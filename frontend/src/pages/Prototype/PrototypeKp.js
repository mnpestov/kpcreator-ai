import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useKpStore from '../../hooks/useKpStore';
import useIsMobile from '../../hooks/useIsMobile';
import useDocumentAwareness from '../../hooks/useDocumentAwareness';
import { MainApi } from '../../utils/MainApi';
import { toast } from 'react-toastify';
import ProtoSwitch from '../../components/common/ProtoSwitch/ProtoSwitch';
import './PrototypeKp.css';
import { polyfill as polyfillDragDrop } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import 'mobile-drag-drop/default.css';

// Полифилл нативного HTML5 Drag-and-Drop для тач-устройств
// (мобильные браузеры не поддерживают draggable/onDragStart из коробки).
// Вызывается только на этой странице (единственной с drag-and-drop),
// а не глобально в index.js, чтобы не вешать touch-листенеры на весь app.
// Библиотека не защищена от повторных вызовов (задублирует листенеры),
// поэтому применяем полифилл не более одного раза за жизнь вкладки.
let dragDropPolyfillApplied = false;
function applyDragDropPolyfillOnce() {
  if (dragDropPolyfillApplied) return;
  dragDropPolyfillApplied = true;
  polyfillDragDrop({
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
  });
}

// ------------------------------------------------------------------
// MOCK DATA
// ------------------------------------------------------------------

const SHOW_CALIBRATION_METRICS = true;

const INITIAL_SHEETS = [
  // {
  //   id: 's1',
  //   title: '1. Без описаний (Baseline)',
  //   rows: Array.from({ length: 8 }).map((_, i) => ({
  //     id: `s1-r${i}`, product: `Короткая позиция ${i + 1}`, composition: '', countOfProduct: 10, priceOfProduct: 500, productWeight: 100, typeOfProduct: 'eat'
  //   }))
  // },
  // {
  //   id: 's2',
  //   title: '2. Очень длинные описания',
  //   rows: [
  //     { id: 's2-r1', product: 'Сложное банкетное блюдо', composition: 'Нежнейшее филе фермерской говядины, маринованное в травах прованса на протяжении 24 часов, подается с муссом из белых грибов, трюфельным маслом, конфи из томатов черри и микрозеленью, сервируется на подушке из пюре батата с копченой паприкой. Идеальный выбор для гурманов.', countOfProduct: 1, priceOfProduct: 2500, productWeight: 350, typeOfProduct: 'eat' },
  //     { id: 's2-r2', product: 'Эксклюзивный десерт', composition: 'Многослойный авторский торт: бисквит дакуаз на миндальной муке, хрустящий слой с пралине из фундука и молочного шоколада, конфи из манго и маракуйи с добавлением лайма, легкий мусс на основе белого бельгийского шоколада с натуральной ванилью Бурбон.', countOfProduct: 1, priceOfProduct: 1800, productWeight: 200, typeOfProduct: 'eat' }
  //   ]
  // },
  // {
  //   id: 's3',
  //   title: '3. Длинные названия',
  //   rows: [
  //     { id: 's3-r1', product: 'Свежевыжатый сок из отборных сицилийских апельсинов прямого отжима без добавления сахара', composition: '200 мл', countOfProduct: 10, priceOfProduct: 300, productWeight: 200, typeOfProduct: 'drink' },
  //     { id: 's3-r2', product: 'Мини-бургер с мраморной говядиной Black Angus, карамелизованным луком и соусом дор-блю', composition: 'Сытно', countOfProduct: 15, priceOfProduct: 550, productWeight: 150, typeOfProduct: 'eat' }
  //   ]
  // },
  // {
  //   id: 's4',
  //   title: '4. Смешанная плотность (Overflow test)',
  //   rows: [
  //     { id: 's4-r1', product: 'Позиция 1', composition: 'Обычное описание средней длины для теста.', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
  //     { id: 's4-r2', product: 'Позиция 2', composition: 'Очень длинное описание для теста переполнения страницы, которое должно занять несколько строк и существенно повлиять на общую высоту блока в документе.', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
  //     { id: 's4-r3', product: 'Позиция 3', composition: '', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
  //     { id: 's4-r4', product: 'Позиция 4', composition: 'Коротко', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
  //     { id: 's4-r5', product: 'Длинное название позиции для проверки того как оно переносится на новую строку без описания', composition: '', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
  //     { id: 's4-r6', product: 'Позиция 6', composition: 'Еще одно длинное описание для теста переполнения страницы, которое должно занять несколько строк и существенно повлиять на общую высоту.', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
  //     { id: 's4-r7', product: 'Позиция 7', composition: 'Обычное описание.', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
  //     { id: 's4-r8', product: 'Позиция 8', composition: '', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
  //   ]
  // }
];

// ------------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------------

function Autocomplete({ query, onSelect, activeIndex, onCreateCustom, catalog = [] }) {
  const filtered = (query
    ? catalog.filter(item => item.product.toLowerCase().includes(query.toLowerCase()))
    : catalog
  ).slice(0, 5);

  if (filtered.length === 0) {
    if (!query) return null; // Don't show "Create custom" if input is completely empty and catalog is empty
    return (
      <div className="proto-autocomplete">
        <div className="proto-ac-item active" onMouseDown={(e) => { e.preventDefault(); onCreateCustom(query); }}>
          <div className="proto-ac-info">
            <div className="proto-ac-name" style={{ color: '#1a4d9e' }}>+ Создать новую позицию</div>
            <div className="proto-ac-desc">"{query}"</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="proto-autocomplete">
      {filtered.map((item, idx) => (
        <div
          key={item.id}
          className={`proto-ac-item ${idx === activeIndex ? 'active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onSelect(item); }}
        >
          <div className="proto-ac-info">
            <div className="proto-ac-name">{item.product}</div>
            <div className="proto-ac-desc">{item.composition}</div>
          </div>
          <span className="proto-ac-meta">{item.priceOfProduct} ₽</span>
        </div>
      ))}
    </div>
  );
}

function QuickAddInput({ onAdd, autoFocusRef, catalog = [] }) {
  const [value, setValue] = useState('');
  const [showAc, setShowAc] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = (value
    ? catalog.filter(item => item.product.toLowerCase().includes(value.toLowerCase()))
    : catalog
  ).slice(0, 5);

  const handleSelect = (item) => {
    onAdd({
      product: item.product,
      composition: item.composition || '',
      countOfProduct: 1,
      priceOfProduct: item.priceOfProduct || 0,
      productWeight: item.productWeight || 0,
      category: item.category || item.typeOfProduct || 'eat',
      typeOfProduct: item.typeOfProduct || 'eat'
    });
    setValue('');
    setShowAc(false);
    setActiveIndex(0);
  };

  const handleCreateCustom = (query) => {
    onAdd({
      product: query.trim(),
      composition: '',
      countOfProduct: 1,
      priceOfProduct: 0,
      productWeight: 0,
      category: 'eat',
      typeOfProduct: 'eat'
    });
    setValue('');
    setShowAc(false);
    setActiveIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!showAc && e.key !== 'Enter') {
      setShowAc(true);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showAc) {
        if (filtered.length > 0) {
          handleSelect(filtered[activeIndex]);
        } else if (value.trim()) {
          handleCreateCustom(value);
        }
      } else if (value.trim()) {
        handleCreateCustom(value);
      }
    } else if (e.key === 'Escape') {
      setShowAc(false);
    }
  };

  return (
    <div className="proto-quick-add">
      <input
        id="quick-add-input"
        ref={autoFocusRef}
        type="text"
        className="proto-quick-input"
        placeholder="Введите позицию и нажмите Enter..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowAc(true);
          setActiveIndex(0);
        }}
        onClick={() => setShowAc(true)}
        onBlur={() => setShowAc(false)}
        onKeyDown={handleKeyDown}
      />
      {showAc && <Autocomplete query={value} onSelect={handleSelect} activeIndex={activeIndex} onCreateCustom={handleCreateCustom} catalog={catalog} />}
    </div>
  );
}

function RowDisplay({
  row, isActiveQtyEdit, onQtyEditComplete, onStartQtyEdit, onUpdateRow, onDelete,
  index, onDragStart, onDragEnter, onDragEnd
}) {
  const [data, setData] = useState({ ...row });
  const [tempQty, setTempQty] = useState(row.countOfProduct);
  const [editField, setEditField] = useState(null);
  const [isDraggable, setIsDraggable] = useState(false);
  const qtyInputRef = useRef(null);

  useEffect(() => {
    setData({ ...row });
  }, [row]);

  useEffect(() => {
    if (isActiveQtyEdit) {
      setTempQty(row.countOfProduct);
    }
  }, [isActiveQtyEdit, row.countOfProduct]);

  useEffect(() => {
    if (!isActiveQtyEdit) return;
    const input = qtyInputRef.current;
    if (!input) return;

    // Скроллим так, чтобы верхний край инпута оказался у верхней границы
    // видимой области — дефолтный scroll-into-view браузера центрирует
    // элемент и конфликтует с анимацией открытия клавиатуры.
    let done = false;
    const scrollInputToTop = () => {
      if (done) return;
      done = true;
      input.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };

    // В части WebView (в т.ч. некоторые сборки Telegram) visualViewport
    // либо не шлёт resize при открытии клавиатуры, либо шлёт до того, как
    // анимация клавиатуры реально завершилась — поэтому не полагаемся
    // только на событие и подстраховываемся таймером.
    const vv = window.visualViewport;
    vv?.addEventListener('resize', scrollInputToTop);
    const fallbackTimer = setTimeout(scrollInputToTop, 350);

    return () => {
      vv?.removeEventListener('resize', scrollInputToTop);
      clearTimeout(fallbackTimer);
    };
  }, [isActiveQtyEdit]);

  const handleQtyKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onQtyEditComplete(tempQty, true);
      onUpdateRow({ ...data, countOfProduct: tempQty });
    } else if (e.key === 'Escape') {
      onQtyEditComplete(row.countOfProduct, true);
    }
  };

  const saveEdits = () => {
    if (data.product !== row.product || data.composition !== row.composition || data.priceOfProduct !== row.priceOfProduct || data.productWeight !== row.productWeight || data.category !== row.category || data.typeOfProduct !== row.typeOfProduct) {
      onUpdateRow(data);
    }
  };

  const category = data.category || data.typeOfProduct || 'eat';

  const setCategory = (newCat) => {
    const newData = { ...data, category: newCat, typeOfProduct: newCat };
    setData(newData);
    onUpdateRow(newData);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  const total = data.countOfProduct * data.priceOfProduct;

  return (
    <div
      className="proto-row"
      onClick={() => !isActiveQtyEdit && onStartQtyEdit()}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="proto-row-content">
        <div className="proto-row-title-block">
          {editField === 'title' ? (
            <input
              autoFocus
              className="proto-native-input title"
              value={data.product}
              onChange={(e) => setData({ ...data, product: e.target.value })}
              onBlur={() => { saveEdits(); setEditField(null); }}
              onKeyDown={handleInputKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="proto-row-name display" onClick={(e) => { e.stopPropagation(); setEditField('title'); }}>
              {row.product}
            </div>
          )}

          <div className="proto-row-desc-container" style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
            {editField === 'desc' ? (
              <textarea
                autoFocus
                className="proto-native-input desc textarea"
                value={data.composition || ''}
                onChange={(e) => setData({ ...data, composition: e.target.value })}
                onBlur={() => { saveEdits(); setEditField(null); }}
                onKeyDown={handleInputKeyDown}
                onClick={(e) => e.stopPropagation()}
                rows={2}
              />
            ) : (
              row.composition ? (
                <div className="proto-row-desc display" onClick={(e) => { e.stopPropagation(); setEditField('desc'); }}>
                  {row.composition}
                </div>
              ) : (
                <div className="proto-row-desc display placeholder" onClick={(e) => { e.stopPropagation(); setEditField('desc'); }}>
                  Добавить описание...
                </div>
              )
            )}

            {category !== 'organisation' && (
              <>
                {(row.composition || editField === 'desc') && (row.productWeight > 0 || editField === 'weight') && <span className="proto-weight-separator">•</span>}

                {editField === 'weight' ? (
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <input
                      autoFocus
                      type="number"
                      className="proto-native-input weight"
                      value={data.productWeight || ''}
                      onChange={(e) => setData({ ...data, productWeight: Number(e.target.value) })}
                      onBlur={() => { saveEdits(); setEditField(null); }}
                      onKeyDown={handleInputKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={e => e.target.select()}
                      placeholder={category === 'drink' ? "Объем" : "Вес"}
                    />
                    <span style={{ fontSize: '13px', color: '#666', marginLeft: '4px' }}>{category === 'drink' ? 'мл' : 'г'}</span>
                  </div>
                ) : (
                  (row.productWeight > 0) ? (
                    <div className="proto-row-weight-display" onClick={(e) => { e.stopPropagation(); setEditField('weight'); }} style={{ fontSize: '13px', color: '#666' }}>
                      {row.productWeight} {category === 'drink' ? 'мл' : 'г'}
                    </div>
                  ) : (
                    <div className="proto-row-weight-display placeholder" onClick={(e) => { e.stopPropagation(); setEditField('weight'); }} style={{ fontSize: '13px', color: '#aaa', fontStyle: 'italic', cursor: 'pointer' }}>
                      {category === 'drink' ? '+ объем' : '+ вес'}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>

        <div className="proto-row-math">
          <div className="proto-row-calc">
            <div
              className="proto-inline-category-wrapper"
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
              tabIndex={0}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  if (editField === 'category') setEditField(null);
                }
              }}
            >
              <span
                className="proto-inline-category-label"
                onClick={(e) => { e.stopPropagation(); setEditField(editField === 'category' ? null : 'category'); }}
              >
                {category === 'eat' ? 'еда' : category === 'drink' ? 'напитки' : 'организация'}
              </span>
              {editField === 'category' && (
                <div className="proto-category-popover">
                  <div className="proto-category-popover-item" onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); setCategory('eat'); setEditField(null); }}>еда</div>
                  <div className="proto-category-popover-item" onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); setCategory('drink'); setEditField(null); }}>напитки</div>
                  <div className="proto-category-popover-item" onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); setCategory('organisation'); setEditField(null); }}>организация</div>
                </div>
              )}
            </div>
            <span className="proto-multiply">·</span>

            {isActiveQtyEdit ? (
              <input
                ref={qtyInputRef}
                autoFocus
                type="number"
                className="proto-inline-qty"
                value={tempQty || ''}
                onChange={(e) => setTempQty(Number(e.target.value))}
                onKeyDown={handleQtyKeyDown}
                onBlur={() => {
                  onQtyEditComplete(tempQty, false);
                  onUpdateRow({ ...data, countOfProduct: tempQty });
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.target.select()}
              />
            ) : (
              <span className="proto-qty-text">{data.countOfProduct} шт</span>
            )}
            <span className="proto-multiply">×</span>

            {editField === 'price' ? (
              <input
                autoFocus
                type="number"
                className="proto-native-input price"
                value={data.priceOfProduct}
                onChange={(e) => setData({ ...data, priceOfProduct: Number(e.target.value) })}
                onBlur={() => { saveEdits(); setEditField(null); }}
                onKeyDown={handleInputKeyDown}
                onClick={(e) => e.stopPropagation()}
                onFocus={e => e.target.select()}
              />
            ) : (
              <span className="proto-row-price-display" onClick={(e) => { e.stopPropagation(); setEditField('price'); }}>
                {row.priceOfProduct}
              </span>
            )} ₽
            <span className="proto-equals">=</span>
          </div>
          <div className="proto-row-price">{total.toLocaleString('ru-RU')} ₽</div>
        </div>
      </div>

      <div className="proto-row-actions" onClick={(e) => e.stopPropagation()}>
        <span
          className="proto-drag-handle"
          onPointerDown={() => setIsDraggable(true)}
          onPointerUp={() => setIsDraggable(false)}
          onMouseLeave={() => setIsDraggable(false)}
        >
          ⋮⋮
        </span>
        <button className="proto-ghost-btn delete" onClick={onDelete}>✕</button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// SEMANTIC META CARD COMPONENT
// ------------------------------------------------------------------
function MetaCard({ id, isExpanded, onToggle, title, summary, children }) {
  return (
    <div className={`proto-meta-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="proto-meta-header" onClick={() => onToggle(id)}>
        {isExpanded ? (
          <div className="proto-meta-title">
            <span>{title}</span>
            <span className="proto-chevron">▴</span>
          </div>
        ) : (
          <div className="proto-meta-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="proto-meta-summary">
              {summary}
            </div>
            <span className="proto-chevron">▾</span>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="proto-meta-body" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// MAIN PROTOTYPE APP
// ------------------------------------------------------------------
export default function PrototypeKp({ addToDb, isNewKp }) {
  useEffect(() => {
    applyDragDropPolyfillOnce();
  }, []);

  const isMobile = useIsMobile();

  // На мобильных (в т.ч. Telegram Mini App) открытая экранная клавиатура
  // не сжимает layout-viewport, из-за чего прото-sticky-bar с fixed
  // позиционированием "всплывает" поверх рабочей области над клавиатурой.
  // Прячем его по самому факту фокуса на инпуте/textarea — не по изменению
  // высоты visualViewport, т.к. во время анимации открытия клавиатуры это
  // приводит к мельканию футера (видно, что он на миг появляется и пропадает).
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    let hideTimer = null;
    const isTextField = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');

    const handleFocusIn = (e) => {
      if (!isTextField(e.target)) return;
      clearTimeout(hideTimer);
      setIsKeyboardOpen(true);
    };

    const handleFocusOut = (e) => {
      if (!isTextField(e.target)) return;
      // Небольшая задержка: если фокус тут же перескочил на другой инпут
      // (переход между полями), клавиатура не закрывалась — футер не мигает.
      hideTimer = setTimeout(() => setIsKeyboardOpen(false), 100);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      clearTimeout(hideTimer);
    };
  }, [isMobile]);

  const navigate = useNavigate();
  const location = useLocation();
  const setListsKp = useKpStore((state) => state.setListsKp);

  // Semantic State
  const todayIso = new Date().toISOString().split('T')[0];

  const [kpMeta, setKpMeta] = useState({
    kpNumber: '', kpDate: todayIso,
    contractNumber: '', contractDate: todayIso,
    syncContractData: true
  });

  const [eventMeta, setEventMeta] = useState({
    contractorId: null, companyName: '', contactPerson: '', phone: '', email: '',
    eventId: null, listTitle: '',
    eventName: '', eventPlace: '', countOfPerson: '',
    startEvent: todayIso, startTimeStartEvent: '', endTimeStartEvent: '',
    isMultiDay: false, endEvent: '', startTimeEndEvent: '', endTimeEndEvent: ''
  });

  const [events, setEvents] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [menuCatalog, setMenuCatalog] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showEventAc, setShowEventAc] = useState(false);
  const [showContractorAc, setShowContractorAc] = useState(false);
  const [conflictModal, setConflictModal] = useState({ isOpen: false, oldContractorName: '', newContractorName: '' });

  useEffect(() => {
    let cancelled = false;

    // Fetch KP Number (if cloning, it will still fetch and assign a new number)
    MainApi.getLastKpNumber()
      .then((res) => {
        if (cancelled) return;
        const last = parseInt(String(res).trim(), 10);
        const next = Number.isFinite(last) ? last + 1 : 1;
        setKpMeta(prev => ({
          ...prev,
          kpNumber: String(next),
          contractNumber: prev.syncContractData ? String(next) : prev.contractNumber
        }));
      })
      .catch((err) => {
        console.error('Ошибка получения следующего номера КП:', err);
        setKpMeta(prev => ({
          ...prev,
          kpNumber: '1',
          contractNumber: prev.syncContractData ? '1' : prev.contractNumber
        }));
      });


    // Fetch Events
    MainApi.getEvents()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          const upcoming = data.filter(e => !['Completed', 'Cancelled'].includes(e.status));
          setEvents(upcoming);
        }
      })
      .catch((err) => console.error("Ошибка загрузки событий:", err));

    // Fetch Contractors
    MainApi.getContractors()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setContractors(data);
        }
      })
      .catch((err) => console.error("Ошибка загрузки контрагентов:", err));

    // Fetch Catalog
    Promise.all([MainApi.getMenuItems(), MainApi.getOrganisations()])
      .then(([menuData, orgData]) => {
        if (!cancelled) {
          let normalized = [];
          if (Array.isArray(menuData)) {
            const activeItems = menuData.filter(item => item.active === true);
            normalized = normalized.concat(activeItems.map(item => ({
              id: item.id,
              product: item.title || '',
              composition: item.description || '',
              typeOfProduct: item.category || 'eat',
              priceOfProduct: item.price || 0,
              productWeight: item.weight || 0
            })));
          }
          if (Array.isArray(orgData)) {
            const activeOrgs = orgData.filter(item => item.active === true);
            normalized = normalized.concat(activeOrgs.map(item => ({
              id: item.id, // Or handle id collision? Usually it's fine for autocomplete if we just need fields.
              product: item.title || '',
              composition: item.description || '',
              typeOfProduct: 'organisation',
              priceOfProduct: item.price || 0,
              productWeight: 0
            })));
          }
          setMenuCatalog(normalized);
        }
      })
      .catch((err) => console.error("Ошибка загрузки каталога меню:", err));

    return () => { cancelled = true; };
  }, []);

  // ------------------------------------------------------------------
  // CLONE INITIALIZATION
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isNewKp && location.state && location.state.cloneData) {
      const { cloneData } = location.state;
      setEventMeta(cloneData.eventMeta);
      setLogisticsMeta(cloneData.logisticsMeta);
      setSheets(cloneData.sheets);

      setKpMeta(prev => ({
        ...prev,
        syncContractData: cloneData.kpMeta.syncContractData
      }));
    }
  }, [isNewKp, location.state]);

  const handleKpMetaChange = (field, value) => {
    setKpMeta(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'syncContractData' && value === true) {
        next.contractNumber = next.kpNumber;
        next.contractDate = next.kpDate;
      }
      if (field === 'kpNumber' && next.syncContractData) {
        next.contractNumber = value;
      }
      if (field === 'kpDate' && next.syncContractData) {
        next.contractDate = value;
      }
      return next;
    });
  };

  const handleEventAcSelect = (selectedEvent) => {
    setEventMeta(prev => {
      let next = { ...prev, eventId: selectedEvent.id, eventName: selectedEvent.title };
      next.originalEventContractorId = selectedEvent.contractorId || null;
      next.originalEventContractorName = selectedEvent.Contractor?.companyName || null;
      if (selectedEvent.title) next.listTitle = selectedEvent.title;
      next.startEvent = selectedEvent.startEvent || selectedEvent.eventDate || '';
      next.endEvent = selectedEvent.endEvent || selectedEvent.eventDate || '';

      if (next.startEvent && next.endEvent && next.startEvent !== next.endEvent) {
        next.isMultiDay = true;
      } else {
        next.isMultiDay = false;
      }

      if (selectedEvent.startTimeStartEvent || selectedEvent.startTime) next.startTimeStartEvent = (selectedEvent.startTimeStartEvent || selectedEvent.startTime).slice(0, 5);
      if (selectedEvent.endTimeStartEvent) next.endTimeStartEvent = selectedEvent.endTimeStartEvent.slice(0, 5);
      if (selectedEvent.startTimeEndEvent) next.startTimeEndEvent = selectedEvent.startTimeEndEvent.slice(0, 5);
      if (selectedEvent.endTimeEndEvent || selectedEvent.endTime) next.endTimeEndEvent = (selectedEvent.endTimeEndEvent || selectedEvent.endTime).slice(0, 5);
      next.eventPlace = selectedEvent.eventPlace || '';
      next.countOfPerson = selectedEvent.countOfPerson ? String(selectedEvent.countOfPerson) : '';

      // Сохраняем слепок исходных значений события для сравнения при сохранении КП
      next.originalEventSnapshot = {
        title: selectedEvent.title || '',
        eventPlace: selectedEvent.eventPlace || '',
        startEvent: selectedEvent.startEvent || selectedEvent.eventDate || '',
        endEvent: selectedEvent.endEvent || selectedEvent.eventDate || '',
        startTimeStartEvent: (selectedEvent.startTimeStartEvent || selectedEvent.startTime || '').slice(0, 5),
        endTimeStartEvent: (selectedEvent.endTimeStartEvent || '').slice(0, 5),
        startTimeEndEvent: (selectedEvent.startTimeEndEvent || '').slice(0, 5),
        endTimeEndEvent: (selectedEvent.endTimeEndEvent || selectedEvent.endTime || '').slice(0, 5),
        countOfPerson: selectedEvent.countOfPerson ? String(selectedEvent.countOfPerson) : '',
      };

      return next;
    });
    setShowEventAc(false);
  };

  const handleContractorAcSelect = (selectedContractor) => {
    setEventMeta(prev => ({
      ...prev,
      contractorId: selectedContractor.id,
      companyName: selectedContractor.companyName || '',
      contactPerson: selectedContractor.contactPerson || '',
      phone: selectedContractor.phone || '',
      email: selectedContractor.email || ''
    }));
    setShowContractorAc(false);
  };

  const handleEventMetaChange = (field, value) => {
    setEventMeta(prev => {
      let next = { ...prev, [field]: value };

      if (field === 'startEvent') {
        if (next.isMultiDay && next.endEvent && next.endEvent < value) {
          next.endEvent = value;
        }
      }

      if (field === 'endEvent') {
        if (value < next.startEvent) {
          next.endEvent = next.startEvent;
        }
      }

      if (field === 'isMultiDay' && value && !next.endEvent) {
        next.endEvent = next.startEvent;
      }

      const isSameDay = !next.isMultiDay || (next.startEvent === next.endEvent);

      if (isSameDay) {
        if (field === 'startTimeStartEvent' && next.endTimeStartEvent && value > next.endTimeStartEvent) {
          next.endTimeStartEvent = value;
        }
        if (field === 'endTimeStartEvent' && next.startTimeStartEvent && value < next.startTimeStartEvent) {
          next.startTimeStartEvent = value; // soft correction: pull start time back
        }
      }

      return next;
    });
  };

  const formatSummaryDate = (dateStr) => {
    if (!dateStr) return 'Дата не указана';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const formatSummaryKpDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  const [logisticsMeta, setLogisticsMeta] = useState({
    hasMkad: false, logisticsCost: 5000
  });

  const [expandedCards, setExpandedCards] = useState({});

  const [sheets, setSheets] = useState(INITIAL_SHEETS);
  const [activeSheetId, setActiveSheetId] = useState('s1');

  const [inlineEditQtyId, setInlineEditQtyId] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);

  const quickAddRef = useRef(null);

  // Totals
  const grandTotal = sheets.reduce((acc, sheet) => {
    return acc + sheet.rows.reduce((sum, r) => sum + (r.countOfProduct * r.priceOfProduct), 0);
  }, 0) + (logisticsMeta.logisticsCost || 0);

  const getSheetTotal = (sheet) => {
    return sheet.rows.reduce((sum, r) => sum + (r.countOfProduct * r.priceOfProduct), 0);
  };

  const sheetAwareness = useDocumentAwareness(sheets);

  // Handlers
  const handleToggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddRow = (sheetId, newRowData) => {
    const newId = Date.now().toString();
    setSheets(sheets.map(sheet => {
      if (sheet.id === sheetId) {
        return {
          ...sheet,
          rows: [...sheet.rows, {
            id: newId,
            ...newRowData,
            countOfProduct: 1,
            productWeight: newRowData.productWeight || 0
          }]
        };
      }
      return sheet;
    }));
    // Start POS flow immediately: jump to qty editing
    setInlineEditQtyId(newId);
  };

  const handleQtyComplete = (sheetId, rowId, newQty, shouldRefocus = false) => {
    setSheets(sheets.map(sheet => {
      if (sheet.id === sheetId) {
        return {
          ...sheet,
          rows: sheet.rows.map(r => r.id === rowId ? { ...r, countOfProduct: newQty } : r)
        };
      }
      return sheet;
    }));
    setInlineEditQtyId(null);

    // Return focus to QuickAdd only when completed via keyboard (Enter/Escape)
    if (shouldRefocus) {
      setTimeout(() => {
        if (quickAddRef.current) quickAddRef.current.focus();
        else {
          const input = document.getElementById('quick-add-input');
          if (input) input.focus();
        }
      }, 0);
    }
  };

  const handleUpdateRow = (sheetId, updatedRow) => {
    setSheets(sheets.map(sheet => {
      if (sheet.id === sheetId) {
        return {
          ...sheet,
          rows: sheet.rows.map(r => r.id === updatedRow.id ? updatedRow : r)
        };
      }
      return sheet;
    }));
  };

  const handleDeleteRow = (sheetId, rowId) => {
    setSheets(sheets.map(sheet => {
      if (sheet.id === sheetId) {
        return { ...sheet, rows: sheet.rows.filter(r => r.id !== rowId) };
      }
      return sheet;
    }));
  };

  const handleDeleteSheet = (sheetId) => {
    const sheet = sheets.find(s => s.id === sheetId);
    if (!sheet) return;

    if (sheet.rows.length === 0) {
      setSheets(sheets.filter(s => s.id !== sheetId));
    } else {
      if (window.confirm('Удалить этот лист и все его позиции?')) {
        setSheets(sheets.filter(s => s.id !== sheetId));
      }
    }
  };

  const validateDocument = () => {
    const errors = [];

    // Document Parameters
    if (!kpMeta.kpNumber) errors.push('Номер КП');
    if (!kpMeta.kpDate) errors.push('Дата КП');
    if (!kpMeta.contractNumber) errors.push('Номер договора');
    if (!kpMeta.contractDate) errors.push('Дата договора');

    // Event Information
    if (!eventMeta.eventName) errors.push('Название мероприятия');
    if (!eventMeta.eventPlace) errors.push('Локация мероприятия');
    if (!eventMeta.countOfPerson || parseInt(eventMeta.countOfPerson, 10) <= 0) errors.push('Количество гостей');

    // Event Dates
    if (!eventMeta.startEvent) errors.push('Дата начала мероприятия');
    if (!eventMeta.startTimeStartEvent) errors.push('Время начала (первый день)');
    if (!eventMeta.endTimeStartEvent) errors.push('Время окончания (первый день)');

    if (eventMeta.isMultiDay) {
      if (!eventMeta.endEvent) errors.push('Дата окончания мероприятия');
      if (!eventMeta.startTimeEndEvent) errors.push('Время начала (последний день)');
      if (!eventMeta.endTimeEndEvent) errors.push('Время окончания (последний день)');
    }

    // Logistics
    if (logisticsMeta.logisticsCost === '' || logisticsMeta.logisticsCost === null || logisticsMeta.logisticsCost === undefined) errors.push('Стоимость логистики');
    if (logisticsMeta.hasMkad === null || logisticsMeta.hasMkad === undefined) errors.push('Тип логистики (Внутри МКАД / За МКАД)');

    // Document Content
    if (!sheets || sheets.length === 0) {
      errors.push('Документ не содержит блоков');
    } else {
      let hasRows = false;
      sheets.forEach(sheet => {
        if (sheet.rows && sheet.rows.length > 0) hasRows = true;
      });
      if (!hasRows) {
        errors.push('Документ не содержит ни одной позиции меню');
      }
    }

    return errors;
  };

  const handleSaveKp = async () => {
    const errors = validateDocument();
    if (errors.length > 0) {
      setValidationErrors(errors);

      toast.dismiss(); // Prevent toast spam by clearing previous notifications
      toast.warning(
        <div style={{ padding: '2px' }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
            Не заполнены обязательные поля:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            {errors.map((err, idx) => (
              <div key={idx} style={{ fontSize: '14px' }}>{err}</div>
            ))}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.85 }}>
            Заполните обязательные поля и повторите сохранение.
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          theme: "light",
          style: {
            background: '#fffbeb',
            color: '#451a03',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }
        }
      );

      return;
    }
    setValidationErrors([]);

    // Conflict detection
    if (eventMeta.eventId && eventMeta.originalEventContractorId) {
      const originalId = eventMeta.originalEventContractorId;
      const originalName = (eventMeta.originalEventContractorName || '').trim().toLowerCase();

      const selectedId = eventMeta.contractorId;
      const enteredName = (eventMeta.companyName || '').trim().toLowerCase();

      let isConflict = false;
      if (selectedId && selectedId !== originalId) {
        isConflict = true;
      } else if (!selectedId && enteredName && enteredName !== originalName) {
        isConflict = true;
      }

      if (isConflict) {
        console.log('Conflict detected');
        const newName = eventMeta.companyName || contractors.find(c => c.id === selectedId)?.companyName || 'Новый контрагент';
        setConflictModal({
          isOpen: true,
          oldContractorName: eventMeta.originalEventContractorName,
          newContractorName: newName
        });
        return; // STOP loop
      }
    }

    const shouldUpdate = !eventMeta.eventId || (eventMeta.eventId && !eventMeta.originalEventContractorId);

    // Определяем, изменились ли данные события относительно выбранного
    let eventChanged = false;
    if (eventMeta.eventId && eventMeta.originalEventSnapshot) {
      const snap = eventMeta.originalEventSnapshot;
      // endEvent при однодневном событии равен startEvent (аналогично proceedWithSave строка 926)
      const currentEndEvent = eventMeta.isMultiDay ? (eventMeta.endEvent || '') : (eventMeta.startEvent || '');
      eventChanged = (
        (eventMeta.eventName || '') !== (snap.title || '') ||
        (eventMeta.eventPlace || '') !== (snap.eventPlace || '') ||
        (eventMeta.startEvent || '') !== (snap.startEvent || '') ||
        currentEndEvent !== (snap.endEvent || '') ||
        (eventMeta.startTimeStartEvent || '') !== (snap.startTimeStartEvent || '') ||
        (eventMeta.endTimeStartEvent || '') !== (snap.endTimeStartEvent || '') ||
        (eventMeta.startTimeEndEvent || '') !== (snap.startTimeEndEvent || '') ||
        (eventMeta.endTimeEndEvent || '') !== (snap.endTimeEndEvent || '') ||
        String(eventMeta.countOfPerson || '') !== String(snap.countOfPerson || '')
      );
    }

    // Если данные события изменились — передаём null, addToDb создаст новый Event
    // Если не изменились — передаём существующий eventId
    const resolvedEventId = eventChanged ? null : eventMeta.eventId;

    proceedWithSave(shouldUpdate, resolvedEventId);
  };

  const proceedWithSave = async (updateEventContractor, resolvedEventId) => {
    const formDataPayload = {
      kpNumber: kpMeta.kpNumber,
      kpDate: kpMeta.kpDate,
      contractNumber: kpMeta.contractNumber,
      contractDate: kpMeta.contractDate,
      updateEventContractor: updateEventContractor,

      listTitle: eventMeta.eventName,
      eventId: resolvedEventId !== undefined ? resolvedEventId : eventMeta.eventId,
      contractorId: eventMeta.contractorId,
      companyName: eventMeta.companyName,
      contactPerson: eventMeta.contactPerson,
      phone: eventMeta.phone,
      email: eventMeta.email,
      eventPlace: eventMeta.eventPlace,
      countOfPerson: eventMeta.countOfPerson ? parseInt(eventMeta.countOfPerson, 10) : null,
      startEvent: eventMeta.startEvent,
      endEvent: eventMeta.isMultiDay ? eventMeta.endEvent : eventMeta.startEvent,
      startTimeStartEvent: eventMeta.startTimeStartEvent,
      endTimeStartEvent: eventMeta.endTimeStartEvent,
      startTimeEndEvent: eventMeta.isMultiDay ? eventMeta.startTimeEndEvent : eventMeta.startTimeStartEvent,
      endTimeEndEvent: eventMeta.isMultiDay ? eventMeta.endTimeEndEvent : eventMeta.endTimeStartEvent,

      logisticsCost: logisticsMeta.logisticsCost ? parseInt(logisticsMeta.logisticsCost, 10) : 0,
      isWithinMkad: !logisticsMeta.hasMkad
    };

    try {
      if (addToDb) {
        await addToDb(formDataPayload, sheets);
      } else {
        console.error('addToDb is not provided to PrototypeKp');
        toast.error('Функция сохранения не настроена.');
      }
    } catch (err) {
      console.error('Ошибка сохранения КП:', err);
      toast.error('Произошла ошибка при сохранении КП в базу данных.');
    }
  };

  const handleRenameSheet = (sheetId, currentTitle) => {
    const newTitle = window.prompt('Название блока:', currentTitle);
    if (newTitle && newTitle.trim()) {
      setSheets(sheets.map(s => s.id === sheetId ? { ...s, title: newTitle.trim() } : s));
    }
  };

  const handleDragStart = (e, sheetId, index) => {
    setDraggingItem({ sheetId, index });
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Required for Firefox to start drag
      e.dataTransfer.setData('text/plain', index);
    }
  };

  const handleDragEnter = (e, sheetId, targetIndex) => {
    if (!draggingItem || draggingItem.sheetId !== sheetId) return;
    if (draggingItem.index === targetIndex) return;

    setSheets(prevSheets => prevSheets.map(sheet => {
      if (sheet.id === sheetId) {
        const newRows = [...sheet.rows];
        const [movedRow] = newRows.splice(draggingItem.index, 1);
        newRows.splice(targetIndex, 0, movedRow);
        return { ...sheet, rows: newRows };
      }
      return sheet;
    }));

    setDraggingItem({ sheetId, index: targetIndex });
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleAddSheet = (title) => {
    const newId = 's' + Date.now();
    setSheets([...sheets, { id: newId, title, rows: [] }]);
    setActiveSheetId(newId);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="prototype-page">
      <div className="prototype-container">

        {/* --- DOCUMENT PANELS (HEADER) --- */}
        <div className="proto-header">
          <div className="proto-meta-cards-container">

            {/* 1. DOCUMENT CARD */}
            <MetaCard
              id="document"
              isExpanded={!!expandedCards['document']}
              onToggle={handleToggleCard}
              title="Параметры документа"
              summary={
                <div className="proto-summary-text">
                  КП №{kpMeta.kpNumber} • {(!kpMeta.syncContractData && kpMeta.contractNumber) ? `Договор №${kpMeta.contractNumber}` : formatSummaryKpDate(kpMeta.kpDate)}
                </div>
              }
            >
              <div className="proto-field-group">
                <div className="proto-grid">
                  <div className="proto-field">
                    <label>Номер КП</label>
                    <input className="proto-input-clean" value={kpMeta.kpNumber} onChange={e => handleKpMetaChange('kpNumber', e.target.value)} />
                  </div>
                  <div className="proto-field">
                    <label>Дата КП</label>
                    <input type="date" className="proto-input-clean" value={kpMeta.kpDate} onChange={e => handleKpMetaChange('kpDate', e.target.value)} />
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <ProtoSwitch
                    checked={kpMeta.syncContractData}
                    onChange={(checked) => handleKpMetaChange('syncContractData', checked)}
                    label="Данные договора совпадают с КП"
                  />
                </div>

                {!kpMeta.syncContractData && (
                  <div className="proto-grid" style={{ marginTop: '16px' }}>
                    <div className="proto-field">
                      <label>Номер договора</label>
                      <input className="proto-input-clean" value={kpMeta.contractNumber} onChange={e => handleKpMetaChange('contractNumber', e.target.value)} placeholder="Оставьте пустым, если нет" />
                    </div>
                    <div className="proto-field">
                      <label>Дата договора</label>
                      <input type="date" className="proto-input-clean" value={kpMeta.contractDate} onChange={e => handleKpMetaChange('contractDate', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </MetaCard>

            {/* 2. EVENT CARD */}
            <MetaCard
              id="event"
              isExpanded={!!expandedCards['event']}
              onToggle={handleToggleCard}
              title="Информация о мероприятии"
              summary={
                <div className="proto-summary-group">
                  <div className="proto-summary-line primary">
                    {eventMeta.companyName || 'Без заказчика'} • {eventMeta.eventName || 'Без названия'}
                  </div>
                  <div className="proto-summary-line secondary">
                    {eventMeta.eventPlace || 'Без локации'} • {formatSummaryDate(eventMeta.startEvent)} • {eventMeta.countOfPerson || '0'} гостей
                  </div>
                </div>
              }
            >
              <div className="proto-field-group">
                <div className="proto-field-group-title">Заказчик</div>
                <div className="proto-grid">
                  <div className="proto-field" style={{ position: 'relative' }}>
                    <label>Название компании</label>
                    <input
                      className="proto-input-clean"
                      value={eventMeta.companyName}
                      onChange={e => {
                        handleEventMetaChange('companyName', e.target.value);
                        handleEventMetaChange('contractorId', null);
                      }}
                      onFocus={() => setShowContractorAc(true)}
                      onBlur={() => setTimeout(() => setShowContractorAc(false), 150)}
                    />
                    {showContractorAc && (
                      <div className="proto-autocomplete">
                        {(eventMeta.companyName
                          ? contractors.filter(c => c.companyName.toLowerCase().includes(eventMeta.companyName.toLowerCase()))
                          : contractors
                        ).slice(0, 5).map(c => (
                          <div
                            key={c.id}
                            className="proto-ac-item"
                            onMouseDown={(e) => { e.preventDefault(); handleContractorAcSelect(c); }}
                          >
                            <div className="proto-ac-info">
                              <div className="proto-ac-name">{c.companyName}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="proto-field"><label>Контактное лицо</label><input className="proto-input-clean" value={eventMeta.contactPerson} onChange={e => handleEventMetaChange('contactPerson', e.target.value)} /></div>
                  <div className="proto-field"><label>Телефон</label><input className="proto-input-clean" value={eventMeta.phone} onChange={e => handleEventMetaChange('phone', e.target.value)} /></div>
                  <div className="proto-field"><label>Email / Telegram</label><input className="proto-input-clean" value={eventMeta.email} onChange={e => handleEventMetaChange('email', e.target.value)} /></div>
                </div>
              </div>

              <div className="proto-field-group">
                <div className="proto-field-group-title">Мероприятие</div>
                <div className="proto-grid">
                  <div className="proto-field" style={{ position: 'relative' }}>
                    <label>Название / Формат</label>
                    <input
                      className="proto-input-clean"
                      value={eventMeta.eventName}
                      onChange={e => {
                        handleEventMetaChange('eventName', e.target.value);
                        handleEventMetaChange('eventId', null);
                      }}
                      onFocus={() => setShowEventAc(true)}
                      onBlur={() => setTimeout(() => setShowEventAc(false), 150)}
                    />
                    {showEventAc && (
                      <div className="proto-autocomplete">
                        {(eventMeta.eventName
                          ? events.filter(ev => ev.title.toLowerCase().includes(eventMeta.eventName.toLowerCase()))
                          : events
                        ).slice(0, 5).map(ev => (
                          <div
                            key={ev.id}
                            className="proto-ac-item"
                            onMouseDown={(e) => { e.preventDefault(); handleEventAcSelect(ev); }}
                          >
                            <div className="proto-ac-info">
                              <div className="proto-ac-name">{ev.title} ({ev.eventDate || ev.startEvent})</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="proto-field"><label>Локация</label><input className="proto-input-clean" value={eventMeta.eventPlace || ''} onChange={e => handleEventMetaChange('eventPlace', e.target.value)} /></div>
                  <div className="proto-field"><label>Количество гостей</label><input className="proto-input-clean" value={eventMeta.countOfPerson || ''} onChange={e => handleEventMetaChange('countOfPerson', e.target.value)} /></div>
                  <div className="proto-field"><label>Дата начала</label><input type="date" min={todayIso} className="proto-input-clean" value={eventMeta.startEvent || ''} onChange={e => handleEventMetaChange('startEvent', e.target.value)} /></div>
                  <div className="proto-field"><label>Время начала</label><input type="time" className="proto-input-clean" value={eventMeta.startTimeStartEvent || ''} onChange={e => handleEventMetaChange('startTimeStartEvent', e.target.value)} /></div>
                  <div className="proto-field"><label>Время окончания</label><input type="time" className="proto-input-clean" value={eventMeta.endTimeStartEvent || ''} onChange={e => handleEventMetaChange('endTimeStartEvent', e.target.value)} /></div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <ProtoSwitch
                    checked={eventMeta.isMultiDay}
                    onChange={(checked) => handleEventMetaChange('isMultiDay', checked)}
                    label="Многодневное мероприятие"
                  />
                </div>

                {eventMeta.isMultiDay && (
                  <div className="proto-grid" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #eee' }}>
                    <div className="proto-field"><label>Дата окончания</label><input type="date" min={eventMeta.startEvent || todayIso} className="proto-input-clean" value={eventMeta.endEvent || ''} onChange={e => handleEventMetaChange('endEvent', e.target.value)} /></div>
                    <div className="proto-field"><label>Время начала (посл. день)</label><input type="time" className="proto-input-clean" value={eventMeta.startTimeEndEvent || ''} onChange={e => handleEventMetaChange('startTimeEndEvent', e.target.value)} /></div>
                    <div className="proto-field"><label>Время окончания (посл. день)</label><input type="time" className="proto-input-clean" value={eventMeta.endTimeEndEvent || ''} onChange={e => handleEventMetaChange('endTimeEndEvent', e.target.value)} /></div>
                  </div>
                )}
              </div>
            </MetaCard>

            {/* 3. LOGISTICS CARD */}
            <MetaCard
              id="logistics"
              isExpanded={!!expandedCards['logistics']}
              onToggle={handleToggleCard}
              title="Логистика"
              summary={
                <div className="proto-summary-text">
                  {logisticsMeta.logisticsCost > 0
                    ? <>{logisticsMeta.hasMkad ? 'За МКАД • ' : ''}Логистика {logisticsMeta.logisticsCost.toLocaleString('ru-RU')} ₽</>
                    : 'Логистика не требуется'}
                </div>
              }
            >
              <div className="proto-field-group">
                <div className="proto-grid">
                  <div className="proto-field">
                    <label>Стоимость логистики (₽)</label>
                    <input className="proto-input-clean" type="number" value={logisticsMeta.logisticsCost} onChange={e => setLogisticsMeta({ ...logisticsMeta, logisticsCost: Number(e.target.value) })} />
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <ProtoSwitch
                    checked={logisticsMeta.hasMkad}
                    onChange={(checked) => setLogisticsMeta({ ...logisticsMeta, hasMkad: checked })}
                    label="Выезд за МКАД"
                  />
                </div>
              </div>
            </MetaCard>

          </div>
        </div>

        {/* --- WORKSPACE / ACCORDION SHEETS --- */}
        <div className="proto-workspace">
          {sheets.map(sheet => {
            const isActive = sheet.id === activeSheetId;
            const sheetTotal = getSheetTotal(sheet);
            const awareness = sheetAwareness.get(sheet.id);

            if (!isActive) {
              return (
                <div key={sheet.id} className="proto-sheet collapsed" onClick={() => setActiveSheetId(sheet.id)}>
                  <div className="proto-sheet-header-collapsed">
                    <h2 className="proto-sheet-title">{sheet.title}</h2>
                    <div className="proto-sheet-meta">
                      <span className="proto-sheet-count">{sheet.rows.length} поз.</span>
                      <span className="proto-sheet-total">{sheetTotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={sheet.id} className="proto-sheet active">
                <div className="proto-sheet-header-active">
                  <h2 className="proto-sheet-title">
                    {sheet.title}
                    <button className="proto-icon-btn" onClick={() => handleRenameSheet(sheet.id, sheet.title)}>✎</button>
                    <button className="proto-icon-btn delete" onClick={() => handleDeleteSheet(sheet.id)}>✕</button>
                  </h2>
                  <span className="proto-sheet-total active">{sheetTotal.toLocaleString('ru-RU')} ₽</span>
                </div>

                <div className="proto-rows-container">
                  {sheet.rows.map((row, index) => (
                    <RowDisplay
                      key={row.id}
                      row={row}
                      index={index}
                      isActiveQtyEdit={inlineEditQtyId === row.id}
                      onStartQtyEdit={() => { setInlineEditQtyId(row.id); }}
                      onQtyEditComplete={(newQty, shouldRefocus) => handleQtyComplete(sheet.id, row.id, newQty, shouldRefocus)}
                      onUpdateRow={(updatedData) => handleUpdateRow(sheet.id, updatedData)}
                      onDelete={() => handleDeleteRow(sheet.id, row.id)}
                      onDragStart={(e, idx) => handleDragStart(e, sheet.id, idx)}
                      onDragEnter={(e, idx) => handleDragEnter(e, sheet.id, idx)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>

                <QuickAddInput
                  autoFocusRef={quickAddRef}
                  onAdd={(newRow) => handleAddRow(sheet.id, newRow)}
                  catalog={menuCatalog}
                />

                {awareness && awareness.hintText && (
                  <div className={`proto-sheet-hint ${awareness.status}`}>
                    {awareness.hintText}
                  </div>
                )}

                {SHOW_CALIBRATION_METRICS && awareness && (
                  <div className="proto-debug-metrics">
                    ⚙️ [DEV] PDF Semantic: {Math.round(awareness.pdfSemanticHeight)}px ({(awareness.pdfFillRatio * 100).toFixed(1)}%) | UI Vis: {Math.round(awareness.uiVisualHeight)}px | Status: {awareness.status.toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Add Sheet Presets */}
          <div className="proto-quick-presets">
            <button className="proto-preset-btn primary" onClick={() => handleAddSheet('Новый лист')}>
              + Добавить лист
            </button>
          </div>

        </div>
      </div>

      {/* --- STICKY BOTTOM BAR --- */}
      <div className={`proto-sticky-bar${isKeyboardOpen ? ' proto-sticky-bar--keyboard-open' : ''}`}>
        <div className="proto-sticky-content">
          <div className="proto-sticky-left">
            <span className="proto-status">Черновик сохранён</span>
            <span className="proto-grand-total">{grandTotal.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="proto-footer-actions">
            <button className="proto-btn proto-btn-primary" onClick={handleSaveKp}>Сохранить КП</button>
          </div>
        </div>
      </div>

      {conflictModal.isOpen && (
        <div className="proto-modal-overlay" onMouseDown={() => setConflictModal({ isOpen: false, oldContractorName: '', newContractorName: '' })}>
          <div className="proto-modal-content" onMouseDown={e => e.stopPropagation()}>
            <h3 className="proto-modal-title">Замена контрагента</h3>
            <div className="proto-modal-body">
              <p className="proto-modal-text">Событие уже привязано к контрагенту «{conflictModal.oldContractorName}».</p>
              <p className="proto-modal-text">Заменить связь на «{conflictModal.newContractorName}»?</p>
            </div>
            <div className="proto-modal-footer">
              <button
                className="proto-btn proto-btn-secondary"
                onClick={() => {
                  console.log('User selected keep existing');
                  setConflictModal({ isOpen: false, oldContractorName: '', newContractorName: '' });
                  proceedWithSave(false);
                }}
              >
                Оставить текущего
              </button>
              <button
                className="proto-btn proto-btn-primary"
                onClick={() => {
                  console.log('User selected replace contractor');
                  setConflictModal({ isOpen: false, oldContractorName: '', newContractorName: '' });
                  proceedWithSave(true);
                }}
              >
                Заменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
