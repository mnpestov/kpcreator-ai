import React, { useState, useEffect, useRef } from "react";
import { Input, Button, DatePicker, Select } from '@skbkontur/react-ui';
import './EventPopup.css';

function toDDMMYYYY(input) {
    if (!input) return '';
    if (input instanceof Date && !isNaN(input)) {
        const day = String(input.getDate()).padStart(2, '0');
        const month = String(input.getMonth() + 1).padStart(2, '0');
        const year = input.getFullYear();
        return `${day}.${month}.${year}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        const [year, month, day] = input.split('-');
        return `${day}.${month}.${year}`;
    }
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(input)) {
        return input;
    }
    return '';
}

function EventPopup({ onClose, onSave, contractors = [], initialContractorId = null }) {
    const [formData, setFormData] = useState({
        title: "",
        contractorId: initialContractorId || null,
        startEvent: "",
        endEvent: "",
        startTimeStartEvent: "",
        endTimeStartEvent: "",
        startTimeEndEvent: "",
        endTimeEndEvent: "",
        eventPlace: "",
        countOfPerson: "",
    });

    const modalRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                modalRef.current && 
                !modalRef.current.contains(event.target) &&
                !event.target.closest('.react-ui')
            ) {
                onClose();
            }
        }

        function handleEscapeKey(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
        };
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.title.trim()) {
            alert("Поле 'Название мероприятия' обязательно для заполнения!");
            return;
        }

        const normalizeDate = (value) => {
            if (!value) return null;
            if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
                const [day, month, year] = value.split('.');
                return `${year}-${month}-${day}`;
            }
            return value;
        };

        // Convert to payload expected by backend
        const payload = {
            ...formData,
            startEvent: normalizeDate(formData.startEvent),
            endEvent: normalizeDate(formData.endEvent),
            eventDate: normalizeDate(formData.startEvent),
            // Format time properly (e.g. padding, validation if necessary - handled by Input type="time" or backend)
            countOfPerson: formData.countOfPerson ? Number(formData.countOfPerson) : null,
            contractorId: formData.contractorId === 'none' ? null : formData.contractorId
        };

        onSave(payload);
    };

    return (
        <div className="popup-overlay">
            <div ref={modalRef} className="popup event-popup">
                <div className="event-popup__header">
                    <h2 className="form__title" style={{ margin: 0 }}>Создать событие</h2>
                    <button className="popup__button_close" onClick={onClose}>×</button>
                </div>

                <div className="event-popup__body">
                    <div className="event-popup__section-title">Основная информация</div>
                    <div className="form__field">
                        <label htmlFor="title" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Название мероприятия <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onValueChange={value => handleChange({ target: { name: 'title', value } })}
                            width="100%"
                            autoFocus
                        />
                    </div>

                    {/* <div className="form__field">
                        <label htmlFor="contractorId" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Контрагент
                        </label>
                        <Select
                            id="contractorId"
                            items={['none', ...contractors.map(c => String(c.id))]}
                            value={formData.contractorId ? String(formData.contractorId) : 'none'}
                            onValueChange={value => handleChange({ target: { name: 'contractorId', value: value === 'none' ? null : Number(value) } })}
                            renderItem={item => {
                                if (item === 'none') return '— Не выбран —';
                                const match = contractors.find(c => String(c.id) === item);
                                return match ? match.companyName : item;
                            }}
                            renderValue={item => {
                                if (item === 'none') return '— Не выбран —';
                                const match = contractors.find(c => String(c.id) === item);
                                return match ? match.companyName : item;
                            }}
                            width="100%"
                        />
                    </div> */}

                    <div className="event-popup__section-title">Расписание</div>

                    <div className="form__field">
                        <label htmlFor="startEvent" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Дата начала
                        </label>
                        <DatePicker
                            id="startEvent"
                            name="startEvent"
                            width="100%"
                            value={formData.startEvent}
                            onValueChange={value => handleChange({ target: { name: 'startEvent', value } })}
                        />
                    </div>

                    <div className="event-popup__row">
                        <div className="form__field">
                            <label htmlFor="startTimeStartEvent" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>Время начала</label>
                            <Input
                                width="100%"
                                type="time"
                                id="startTimeStartEvent"
                                name="startTimeStartEvent"
                                value={formData.startTimeStartEvent}
                                onValueChange={value => handleChange({ target: { name: 'startTimeStartEvent', value } })}
                            />
                        </div>
                        <div className="form__field">
                            <label htmlFor="endTimeStartEvent" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>Время окончания</label>
                            <Input
                                width="100%"
                                type="time"
                                id="endTimeStartEvent"
                                name="endTimeStartEvent"
                                value={formData.endTimeStartEvent}
                                onValueChange={value => handleChange({ target: { name: 'endTimeStartEvent', value } })}
                            />
                        </div>
                    </div>

                    <div className="form__field" style={{ marginTop: '8px' }}>
                        <label htmlFor="endEvent" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Дата окончания
                        </label>
                        <DatePicker
                            id="endEvent"
                            name="endEvent"
                            width="100%"
                            value={formData.endEvent}
                            onValueChange={value => handleChange({ target: { name: 'endEvent', value } })}
                        />
                    </div>

                    <div className="event-popup__row">
                        <div className="form__field">
                            <label htmlFor="startTimeEndEvent" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>Время начала</label>
                            <Input
                                width="100%"
                                type="time"
                                id="startTimeEndEvent"
                                name="startTimeEndEvent"
                                value={formData.startTimeEndEvent}
                                onValueChange={value => handleChange({ target: { name: 'startTimeEndEvent', value } })}
                            />
                        </div>
                        <div className="form__field">
                            <label htmlFor="endTimeEndEvent" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>Время окончания</label>
                            <Input
                                width="100%"
                                type="time"
                                id="endTimeEndEvent"
                                name="endTimeEndEvent"
                                value={formData.endTimeEndEvent}
                                onValueChange={value => handleChange({ target: { name: 'endTimeEndEvent', value } })}
                            />
                        </div>
                    </div>

                    <div className="event-popup__section-title">Логистика</div>

                    <div className="form__field">
                        <label htmlFor="eventPlace" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Место проведения
                        </label>
                        <Input
                            id="eventPlace"
                            name="eventPlace"
                            value={formData.eventPlace}
                            onValueChange={value => handleChange({ target: { name: 'eventPlace', value } })}
                            width="100%"
                        />
                    </div>

                    <div className="form__field">
                        <label htmlFor="countOfPerson" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Кол-во персон
                        </label>
                        <Input
                            id="countOfPerson"
                            name="countOfPerson"
                            type="number"
                            value={formData.countOfPerson}
                            onValueChange={value => handleChange({ target: { name: 'countOfPerson', value } })}
                            width="100%"
                        />
                    </div>
                </div>

                <div className="event-popup__footer">
                    <Button use="primary" onClick={handleSave}>Сохранить</Button>
                    <Button use="default" onClick={onClose}>Отмена</Button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(EventPopup);
