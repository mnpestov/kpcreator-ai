import React, { useRef, Suspense, lazy, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Select, Loader } from '@skbkontur/react-ui';
import { MainApi } from '../../utils/MainApi';
import FirstList from '../../components/FirstList/FirstList';
import Kp from '../../components/KP/Kp';
import KpCompact from '../../components/KpCompact/KpCompact';

import { toast } from 'react-toastify';
import "./Preview.css";
import HiddenPrint from "../../components/HiddenPrint/HiddenPrint";
import "./PreviewHidden.css";
import useAuthStore from '../../hooks/useAuthStore';
import useKpStore from '../../hooks/useKpStore';
import { API_BASE_URL } from '../../utils/const';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { prepareCloneData } from '../../utils/cloneHelper';

// Подключаем LastList лениво (lazy), как это было сделано в App.js
const LastList = lazy(() => import('../../components/LastList/LastList'));

function Preview({
    formData,
    isNewKp,
    dispatch,
    deleteRow,
    deleteList,
    deleteRowFromDb,
    updateRowInDb,
    addRowOnList,
    GetPrice,
    downloadSpec,
    downloadKpXlsx,
    getProductWeightWithMeasure,
    getDeclination,
    exportHiddenPDF,
    kpPreviewSelectors,
    kpPrintSelectors
}) {
    const { user } = useAuthStore();
    const listsKp = useKpStore((s) => s.listsKp);
    console.log(user);
    console.log(listsKp);

    const setFormData = useKpStore((s) => s.setFormData);
    const setListsKp = useKpStore((s) => s.setListsKp);

    const compactPdfRef = useRef(null);
    const hiddenPrintRef = useRef(null);
    const navigate = useNavigate();
    const { kpNumber } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const downloadRef = useRef(null);

    const updateField = useKpStore((s) => s.updateField);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (downloadRef.current && !downloadRef.current.contains(e.target)) {
                setIsDownloadOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!kpNumber) return;
        if (String(formData?.kpNumber) === String(kpNumber)) {
            return;
        }

        let aborted = false;
        const loadKp = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const data = await MainApi.getKp(kpNumber);
                if (!aborted) {
                    if (data?.formData) setFormData(data.formData);
                    if (Array.isArray(data?.listsKp)) setListsKp(data.listsKp);
                }
            } catch (err) {
                console.error('Ошибка восстановления КП:', err);
                if (!aborted) setFetchError('Не удалось загрузить коммерческое предложение');
            } finally {
                if (!aborted) setIsLoading(false);
            }
        };

        loadKp();
        return () => { aborted = true; };
    }, [kpNumber, formData?.kpNumber, setFormData, setListsKp]);

    const needsFetch = kpNumber && String(formData?.kpNumber) !== String(kpNumber);

    if (isLoading || (needsFetch && !fetchError)) {
        return (
            <PageContainer maxWidth="1200px">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <Loader active type="big" caption="Загрузка коммерческого предложения..." />
                </div>
            </PageContainer>
        );
    }

    if (fetchError || !formData?.kpNumber) {
        return (
            <PageContainer maxWidth="1200px">
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>Ошибка</h3>
                    <p style={{ color: '#666', marginBottom: '24px' }}>{fetchError || 'Коммерческое предложение не найдено'}</p>
                    <button className="proto-btn proto-btn-primary" onClick={() => navigate('/')}>Вернуться на главную</button>
                </div>
            </PageContainer>
        );
    }

    const handleStatusChange = async (newStatus) => {
        try {
            await MainApi.updateKpStatus(formData.kpNumber, newStatus);
            updateField('status', newStatus);
        } catch (e) {
            console.error('Ошибка при обновлении статуса:', e);
            toast.error('Ошибка при обновлении статуса');
        }
    };

    const handleExportPDF = async () => {
        // 1. Start PDF generation
        await exportHiddenPDF();

        // 2. Transition if draft
        if (formData.status === 'draft') {
            await handleStatusChange('sent');
        }
    };

    const handleDownloadXlsx = async () => {
        // 1. Download XLSX
        await downloadKpXlsx();

        // 2. Transition if draft (same as PDF)
        if (formData.status === 'draft') {
            await handleStatusChange('sent');
        }
    };

    // Форматирование даты (ожидаем ISO)
    const formatDate = (value) => {
        if (!value) return '';
        return new Date(value).toLocaleDateString('ru-RU', {
            year: 'numeric', month: 'numeric', day: 'numeric'
        });
    };

    // "HH:MM:SS" -> "HH:MM"
    const formatTime = (value) => {
        if (!value) return '';
        return String(value).slice(0, 5);
    };

    // Выбираем менеджера из констант по manager (если есть) или по managerName
    // const managerKey = formData.manager || resolveManagerKey(formData.managerName);
    // const m = MANAGERS[managerKey];

    return (
        <PageContainer maxWidth="1200px">
            <PageHeader
                title={`Предпросмотр КП № ${formData.kpNumber || ''}`}
                actions={
                    <>
                        <button
                            className="proto-btn proto-btn-secondary"
                            onClick={() => {
                                const cloneData = prepareCloneData(formData, listsKp);
                                navigate('/new', { state: { cloneData } });
                            }}
                        >
                            Создать на основе
                        </button>
                        <div className="preview-download-wrapper" ref={downloadRef}>
                            <button
                                className="proto-btn proto-btn-primary"
                                onClick={() => setIsDownloadOpen((v) => !v)}
                            >
                                Скачать ▾
                            </button>
                            {isDownloadOpen && (
                                <div className="preview-download-menu">
                                    <button
                                        className="preview-download-item"
                                        onClick={() => { setIsDownloadOpen(false); handleExportPDF(); }}
                                    >
                                        PDF
                                    </button>
                                    <button
                                        className="preview-download-item"
                                        onClick={() => { setIsDownloadOpen(false); handleDownloadXlsx(); }}
                                    >
                                        XLSX
                                    </button>
                                    <button
                                        className="preview-download-item"
                                        onClick={() => { setIsDownloadOpen(false); downloadSpec(); }}
                                    >
                                        Спецификация
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                }
            />
            <div className="preview-page" style={{ marginTop: '1rem' }}>
                <div className="preview-meta-bar">
                    <div className="preview-meta-status">
                        <span className="preview-meta-label">Статус:</span>
                        <Select
                            id="preview-status"
                            data-testid="preview-status-select"
                            items={['draft', 'sent', 'approved', 'paid']}
                            value={formData.status || 'draft'}
                            onValueChange={handleStatusChange}
                            renderItem={item => {
                                const map = { draft: 'Черновик', sent: 'Отправлено', approved: 'Согласовано', paid: 'Оплачено' };
                                return map[item] || item;
                            }}
                            renderValue={item => {
                                const map = { draft: 'Черновик', sent: 'Отправлено', approved: 'Согласовано', paid: 'Оплачено' };
                                return map[item] || item;
                            }}
                            width="140px"
                        />
                    </div>
                </div>
                <div className="preview">
                    {/* Шапка КП */}
                    <FirstList
                        managerName={user.name}
                        managerJobTitle={user.job}
                        managerEmail={user.email}
                        managerTel={user.tel}
                        kpNumber={formData.kpNumber}
                        kpDate={formatDate(formData.kpDate)}
                        contractNumber={formData.contractNumber}
                        contractDate={formatDate(formData.contractDate)}
                        managerPhoto={`${API_BASE_URL}/static/${user.photo}`}
                        kpPreviewSelectors={kpPreviewSelectors}
                        listSelector={'list list-preview'}
                    />

                    {/* Списки товаров (каждый списокKp – отдельный блок КП) */}
                    {listsKp.map((item) => (
                        <Kp
                            key={item.id}
                            startEvent={formatDate(formData.startEvent)}
                            endEvent={formatDate(formData.endEvent)}
                            eventPlace={formData.eventPlace}
                            countOfPerson={formData.countOfPerson}
                            list={item}
                            id={item.id}
                            listTitle={formData.listTitle}
                            startTimeStartEvent={formatTime(formData.startTimeStartEvent)}
                            endTimeStartEvent={formatTime(formData.endTimeStartEvent)}
                            startTimeEndEvent={formatTime(formData.startTimeEndEvent)}
                            endTimeEndEvent={formatTime(formData.endTimeEndEvent)}
                            isNewKp={isNewKp}
                            deleteRow={deleteRow}
                            deleteList={deleteList}
                            deleteRowFromDb={deleteRowFromDb}
                            updateRowInDb={updateRowInDb}
                            addRowOnList={addRowOnList}
                            dispatch={dispatch}
                            GetPrice={GetPrice}
                            getProductWeightWithMeasure={getProductWeightWithMeasure}
                            getDeclination={getDeclination}
                            listSelector={'list list-preview'}
                            kpPreviewSelectors={kpPreviewSelectors}
                        />
                    ))}

                    {/* Скрытые компактные списки для спецификации (без цен) */}
                    <div
                        ref={compactPdfRef}
                        style={{
                            position: 'fixed',     // вне потока и не расширяет документ
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0,
                            overflow: 'hidden',
                            pointerEvents: 'none',
                            opacity: 0             // можно убрать visibility
                        }}
                    >
                        {listsKp.map((list, idx) => (
                            <KpCompact
                                key={`compact-${list.id}-${Date.now()}`}
                                // key={`compact-${idx}`}
                                list={list}
                                listTitle={formData.listTitle}
                                startEvent={formatDate(formData.startEvent)}
                                endEvent={formatDate(formData.endEvent)}
                                startTimeStartEvent={formatTime(formData.startTimeStartEvent)}
                                endTimeStartEvent={formatTime(formData.endTimeStartEvent)}
                                startTimeEndEvent={formatTime(formData.startTimeEndEvent)}
                                endTimeEndEvent={formatTime(formData.endTimeEndEvent)}
                                eventPlace={formData.eventPlace}
                                countOfPerson={formData.countOfPerson}
                                isNewKp={isNewKp}
                                dispatch={dispatch}
                                isCompact={true}
                                deleteRow={deleteRow}
                                deleteRowFromDb={deleteRowFromDb}
                                updateRowInDb={updateRowInDb}
                                getProductWeightWithMeasure={getProductWeightWithMeasure}
                                kpPreviewSelectors={kpPrintSelectors}
                            />
                        ))}
                    </div>


                    {/* Итоговая часть КП (LastList) с расчетом стоимости, доставкой и пр. */}
                    <Suspense fallback={<div>Загрузка LastList...</div>}>
                        <LastList
                            lists={listsKp}
                            countOfPerson={formData.countOfPerson}
                            logisticsCost={parseInt(formData.logisticsCost) || 0}
                            isWithinMkad={formData.isWithinMkad}
                            GetPrice={GetPrice}
                            listSelector={'list list-preview list_last-list'}
                            kpPreviewSelectors={kpPreviewSelectors}
                        />
                    </Suspense>
                </div>
                {/* НОВЫЙ скрытый компонент печати полной версии — полностью автономный */}
                <div
                    ref={hiddenPrintRef}
                    className="hiddenPrintMount"
                    data-role="hidden-print-mount"
                >

                    <HiddenPrint
                        key={`hidden-${Date.now()}`}
                        formData={formData}
                        listsKp={listsKp}
                        isNewKp={isNewKp}
                        dispatch={dispatch}
                        deleteRow={deleteRow}
                        deleteList={deleteList}
                        deleteRowFromDb={deleteRowFromDb}
                        updateRowInDb={updateRowInDb}
                        addRowOnList={addRowOnList}
                        GetPrice={GetPrice}
                        getProductWeightWithMeasure={getProductWeightWithMeasure}
                        getDeclination={getDeclination}
                        kpPreviewSelectors={kpPrintSelectors}
                    />
                </div>
            </div>
        </PageContainer>
    );
}

export default Preview;
