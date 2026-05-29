import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useKpStore from '../../hooks/useKpStore';
import useIsMobile from '../../hooks/useIsMobile';
import useDocumentAwareness from '../../hooks/useDocumentAwareness';
import './PrototypeKp.css';

// ------------------------------------------------------------------
// MOCK DATA
// ------------------------------------------------------------------
const MOCK_CATALOG = [
  { id: 1, product: 'Канапе с лососем', composition: 'Лосось с/с, сливочный сыр, укроп, багет', typeOfProduct: 'eat', priceOfProduct: 250, productWeight: 30 },
  { id: 2, product: 'Брускетта с ростбифом', composition: 'Ростбиф, вяленые томаты, руккола, соус песто', typeOfProduct: 'eat', priceOfProduct: 320, productWeight: 45 },
  { id: 3, product: 'Мини-бургер с говядиной', composition: 'Говяжья котлета, чеддер, томат, лист салата', typeOfProduct: 'eat', priceOfProduct: 450, productWeight: 80 },
  { id: 4, product: 'Тарталетка с икрой', composition: 'Красная икра, масло сливочное, зелень', typeOfProduct: 'eat', priceOfProduct: 550, productWeight: 25 },
  { id: 5, product: 'Ассорти сыров с медом', composition: 'Пармезан, дор блю, камамбер, мед, орехи', typeOfProduct: 'eat', priceOfProduct: 1200, productWeight: 300 },
  { id: 6, product: 'Фруктовая тарелка', composition: 'Ананас, виноград, киви, клубника', typeOfProduct: 'eat', priceOfProduct: 900, productWeight: 500 },
  { id: 7, product: 'Лимонад цитрусовый', composition: 'Апельсин, лимон, мята, сироп, содовая', typeOfProduct: 'drink', priceOfProduct: 300, productWeight: 1000 },
  { id: 8, product: 'Кофе американо', composition: 'Свежесваренный кофе', typeOfProduct: 'drink', priceOfProduct: 150, productWeight: 200 },
  { id: 9, product: 'Аренда бокалов', composition: 'Бокалы для вина', typeOfProduct: 'organisation', priceOfProduct: 50, productWeight: 0 },
  { id: 10, product: 'Официант', composition: 'Обслуживание мероприятия (до 8 часов)', typeOfProduct: 'organisation', priceOfProduct: 5000, productWeight: 0 }
];

const SHOW_CALIBRATION_METRICS = true;

const INITIAL_SHEETS = [
  {
    id: 's1',
    title: '1. Без описаний (Baseline)',
    rows: Array.from({ length: 8 }).map((_, i) => ({
      id: `s1-r${i}`, product: `Короткая позиция ${i + 1}`, composition: '', countOfProduct: 10, priceOfProduct: 500, productWeight: 100, typeOfProduct: 'eat'
    }))
  },
  {
    id: 's2',
    title: '2. Очень длинные описания',
    rows: [
      { id: 's2-r1', product: 'Сложное банкетное блюдо', composition: 'Нежнейшее филе фермерской говядины, маринованное в травах прованса на протяжении 24 часов, подается с муссом из белых грибов, трюфельным маслом, конфи из томатов черри и микрозеленью, сервируется на подушке из пюре батата с копченой паприкой. Идеальный выбор для гурманов.', countOfProduct: 1, priceOfProduct: 2500, productWeight: 350, typeOfProduct: 'eat' },
      { id: 's2-r2', product: 'Эксклюзивный десерт', composition: 'Многослойный авторский торт: бисквит дакуаз на миндальной муке, хрустящий слой с пралине из фундука и молочного шоколада, конфи из манго и маракуйи с добавлением лайма, легкий мусс на основе белого бельгийского шоколада с натуральной ванилью Бурбон.', countOfProduct: 1, priceOfProduct: 1800, productWeight: 200, typeOfProduct: 'eat' }
    ]
  },
  {
    id: 's3',
    title: '3. Длинные названия',
    rows: [
      { id: 's3-r1', product: 'Свежевыжатый сок из отборных сицилийских апельсинов прямого отжима без добавления сахара', composition: '200 мл', countOfProduct: 10, priceOfProduct: 300, productWeight: 200, typeOfProduct: 'drink' },
      { id: 's3-r2', product: 'Мини-бургер с мраморной говядиной Black Angus, карамелизованным луком и соусом дор-блю', composition: 'Сытно', countOfProduct: 15, priceOfProduct: 550, productWeight: 150, typeOfProduct: 'eat' }
    ]
  },
  {
    id: 's4',
    title: '4. Смешанная плотность (Overflow test)',
    rows: [
      { id: 's4-r1', product: 'Позиция 1', composition: 'Обычное описание средней длины для теста.', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
      { id: 's4-r2', product: 'Позиция 2', composition: 'Очень длинное описание для теста переполнения страницы, которое должно занять несколько строк и существенно повлиять на общую высоту блока в документе.', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
      { id: 's4-r3', product: 'Позиция 3', composition: '', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
      { id: 's4-r4', product: 'Позиция 4', composition: 'Коротко', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
      { id: 's4-r5', product: 'Длинное название позиции для проверки того как оно переносится на новую строку без описания', composition: '', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
      { id: 's4-r6', product: 'Позиция 6', composition: 'Еще одно длинное описание для теста переполнения страницы, которое должно занять несколько строк и существенно повлиять на общую высоту.', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
      { id: 's4-r7', product: 'Позиция 7', composition: 'Обычное описание.', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
      { id: 's4-r8', product: 'Позиция 8', composition: '', countOfProduct: 5, priceOfProduct: 300, productWeight: 100, typeOfProduct: 'eat' },
    ]
  }
];

// ------------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------------

function Autocomplete({ query, onSelect, activeIndex, onCreateCustom }) {
  if (!query) return null;
  const filtered = MOCK_CATALOG.filter(item => 
    item.product.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  if (filtered.length === 0) {
    return (
      <div className="proto-autocomplete">
        <div className="proto-ac-item active" onMouseDown={(e) => { e.preventDefault(); onCreateCustom(query); }}>
          <div className="proto-ac-info">
            <div className="proto-ac-name" style={{color: '#1a4d9e'}}>+ Создать новую позицию</div>
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

function QuickAddInput({ onAdd, autoFocusRef }) {
  const [value, setValue] = useState('');
  const [showAc, setShowAc] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = value ? MOCK_CATALOG.filter(item => 
    item.product.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 5) : [];

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
        onFocus={() => setShowAc(true)}
        onBlur={() => setShowAc(false)}
        onKeyDown={handleKeyDown}
      />
      {showAc && <Autocomplete query={value} onSelect={handleSelect} activeIndex={activeIndex} onCreateCustom={handleCreateCustom} />}
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

  useEffect(() => {
    setData({ ...row });
  }, [row]);

  useEffect(() => {
    if (isActiveQtyEdit) {
      setTempQty(row.countOfProduct);
    }
  }, [isActiveQtyEdit, row.countOfProduct]);

  const handleQtyKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onQtyEditComplete(tempQty);
      onUpdateRow({ ...data, countOfProduct: tempQty });
    } else if (e.key === 'Escape') {
      onQtyEditComplete(row.countOfProduct);
    }
  };

  const saveEdits = () => {
    if (data.product !== row.product || data.composition !== row.composition || data.priceOfProduct !== row.priceOfProduct || data.productWeight !== row.productWeight || data.category !== row.category) {
      onUpdateRow(data);
    }
  };

  const category = data.category || data.typeOfProduct || 'eat';

  const setCategory = (newCat) => {
    const newData = { ...data, category: newCat };
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
              onChange={(e) => setData({...data, product: e.target.value})}
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
                onChange={(e) => setData({...data, composition: e.target.value})}
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
                      onChange={(e) => setData({...data, productWeight: Number(e.target.value)})}
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
                autoFocus
                type="number"
                className="proto-inline-qty"
                value={tempQty || ''}
                onChange={(e) => setTempQty(Number(e.target.value))}
                onKeyDown={handleQtyKeyDown}
                onBlur={() => {
                  onQtyEditComplete(tempQty);
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
                onChange={(e) => setData({...data, priceOfProduct: Number(e.target.value)})}
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
function MetaCard({ id, expandedId, onToggle, title, summary, children }) {
  const isExpanded = expandedId === id;
  return (
    <div className={`proto-meta-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="proto-meta-header" onClick={() => onToggle(id)}>
        {isExpanded ? (
          <div className="proto-meta-title">
            <span>{title}</span>
            <span className="proto-chevron">Свернуть ▲</span>
          </div>
        ) : (
          <div className="proto-meta-summary">
            {summary}
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
export default function PrototypeKp() {
  const isMobile = useIsMobile();
  
  // Semantic State
  const todayIso = new Date().toISOString().split('T')[0];

  const [kpMeta, setKpMeta] = useState({ 
    kpNumber: '468', kpDate: todayIso,
    contractNumber: '', contractDate: '',
    syncContractData: true
  });
  
  const [eventMeta, setEventMeta] = useState({ 
    companyName: 'ООО Ромашка', contactPerson: '', phone: '', email: '',
    eventName: 'Дикая Мята', eventPlace: 'Loft Hall', countOfPerson: '4000', 
    startEvent: todayIso, startTimeStartEvent: '', endTimeStartEvent: '',
    isMultiDay: false, endEvent: '', startTimeEndEvent: '', endTimeEndEvent: ''
  });

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
    hasMkad: true, logisticsCost: 5000 
  });
  
  const [expandedCard, setExpandedCard] = useState(null);
  
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
    setExpandedCard(prev => prev === id ? null : id);
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

  const handleQtyComplete = (sheetId, rowId, newQty) => {
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
    
    // Return focus to QuickAdd
    setTimeout(() => {
      if (quickAddRef.current) quickAddRef.current.focus();
      else {
        const input = document.getElementById('quick-add-input');
        if (input) input.focus();
      }
    }, 0);
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

  const navigate = useNavigate();
  const setListsKp = useKpStore((state) => state.setListsKp);

  const handleSaveKp = () => {
    // UI state is NOT sent. Only pure business data.
    
    // 1. Send production-ready sheets directly to legacy listsKp
    setListsKp(sheets);

    // 2. Send production-ready form data to legacy kpStore
    const updateFields = useKpStore.getState().updateFields;
    if (updateFields) {
      updateFields({
        kpNumber: kpMeta.kpNumber,
        kpDate: kpMeta.kpDate,
        contractNumber: kpMeta.contractNumber,
        contractDate: kpMeta.contractDate,
        
        eventPlace: eventMeta.eventPlace,
        countOfPerson: parseInt(eventMeta.countOfPerson, 10) || 0,
        startEvent: eventMeta.startEvent,
        endEvent: eventMeta.endEvent,
        startTimeStartEvent: eventMeta.startTimeStartEvent,
        endTimeStartEvent: eventMeta.endTimeStartEvent,
        startTimeEndEvent: eventMeta.startTimeEndEvent,
        endTimeEndEvent: eventMeta.endTimeEndEvent,

        logisticsCost: parseInt(logisticsMeta.logisticsCost, 10) || 0,
        isWithinMkad: logisticsMeta.hasMkad
      });
    } else {
       // fallback if updateFields is not defined in useKpStore (older version maybe?)
       const updateField = useKpStore.getState().updateField;
       updateField('eventPlace', eventMeta.eventPlace);
       updateField('countOfPerson', parseInt(eventMeta.countOfPerson, 10) || 0);
       updateField('logisticsCost', parseInt(logisticsMeta.logisticsCost, 10) || 0);
       updateField('isWithinMkad', logisticsMeta.hasMkad);
    }
    
    console.log('[DEBUG] Strict Production Payload saved successfully.');

    // 3. Navigate
    navigate('/preview');
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
              expandedId={expandedCard}
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
                    <input className="proto-input-clean" value={kpMeta.kpNumber} onChange={e => setKpMeta({...kpMeta, kpNumber: e.target.value})} />
                  </div>
                  <div className="proto-field">
                    <label>Дата КП</label>
                    <input type="date" className="proto-input-clean" value={kpMeta.kpDate} onChange={e => setKpMeta({...kpMeta, kpDate: e.target.value})} />
                  </div>
                </div>
                
                <label className="proto-checkbox">
                  <input 
                    type="checkbox" 
                    checked={kpMeta.syncContractData} 
                    onChange={e => setKpMeta({...kpMeta, syncContractData: e.target.checked})} 
                  />
                  Данные договора совпадают с КП
                </label>
                
                {!kpMeta.syncContractData && (
                  <div className="proto-grid" style={{marginTop: '16px'}}>
                    <div className="proto-field">
                      <label>Номер договора</label>
                      <input className="proto-input-clean" value={kpMeta.contractNumber} onChange={e => setKpMeta({...kpMeta, contractNumber: e.target.value})} placeholder="Оставьте пустым, если нет" />
                    </div>
                    <div className="proto-field">
                      <label>Дата договора</label>
                      <input type="date" className="proto-input-clean" value={kpMeta.contractDate} onChange={e => setKpMeta({...kpMeta, contractDate: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
            </MetaCard>

            {/* 2. EVENT CARD */}
            <MetaCard
              id="event"
              expandedId={expandedCard}
              onToggle={handleToggleCard}
              title="Информация о мероприятии"
              summary={
                <div className="proto-summary-group">
                  <div className="proto-summary-line primary">
                    {eventMeta.companyName || 'Без заказчика'} • {eventMeta.eventName || 'Без названия'}
                  </div>
                  <div className="proto-summary-line secondary">
                    {eventMeta.location || 'Без локации'} • {formatSummaryDate(eventMeta.startDate)} • {eventMeta.guests || '0'} гостей
                  </div>
                </div>
              }
            >
              <div className="proto-field-group">
                <div className="proto-field-group-title">Заказчик</div>
                <div className="proto-grid">
                  <div className="proto-field"><label>Название компании</label><input className="proto-input-clean" value={eventMeta.companyName} onChange={e => handleEventMetaChange('companyName', e.target.value)} /></div>
                  <div className="proto-field"><label>Контактное лицо</label><input className="proto-input-clean" value={eventMeta.contactPerson} onChange={e => handleEventMetaChange('contactPerson', e.target.value)} /></div>
                  <div className="proto-field"><label>Телефон</label><input className="proto-input-clean" value={eventMeta.phone} onChange={e => handleEventMetaChange('phone', e.target.value)} /></div>
                  <div className="proto-field"><label>Email / Telegram</label><input className="proto-input-clean" value={eventMeta.email} onChange={e => handleEventMetaChange('email', e.target.value)} /></div>
                </div>
              </div>

              <div className="proto-field-group">
                <div className="proto-field-group-title">Мероприятие</div>
                <div className="proto-grid">
                  <div className="proto-field"><label>Название / Формат</label><input className="proto-input-clean" value={eventMeta.eventName} onChange={e => handleEventMetaChange('eventName', e.target.value)} /></div>
                  <div className="proto-field"><label>Локация</label><input className="proto-input-clean" value={eventMeta.location} onChange={e => handleEventMetaChange('location', e.target.value)} /></div>
                  <div className="proto-field"><label>Количество гостей</label><input className="proto-input-clean" value={eventMeta.guests} onChange={e => handleEventMetaChange('guests', e.target.value)} /></div>
                  <div className="proto-field"><label>Дата начала</label><input type="date" min={todayIso} className="proto-input-clean" value={eventMeta.startDate} onChange={e => handleEventMetaChange('startDate', e.target.value)} /></div>
                  <div className="proto-field"><label>Время начала</label><input type="time" className="proto-input-clean" value={eventMeta.firstDayStartTime} onChange={e => handleEventMetaChange('firstDayStartTime', e.target.value)} /></div>
                  <div className="proto-field"><label>Время окончания</label><input type="time" className="proto-input-clean" value={eventMeta.firstDayEndTime} onChange={e => handleEventMetaChange('firstDayEndTime', e.target.value)} /></div>
                </div>
                
                <label className="proto-checkbox" style={{marginTop: '16px'}}>
                  <input type="checkbox" checked={eventMeta.isMultiDay} onChange={e => handleEventMetaChange('isMultiDay', e.target.checked)} /> 
                  Многодневное мероприятие
                </label>
                
                {eventMeta.isMultiDay && (
                  <div className="proto-grid" style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #eee'}}>
                    <div className="proto-field"><label>Дата окончания</label><input type="date" min={eventMeta.startDate || todayIso} className="proto-input-clean" value={eventMeta.endDate} onChange={e => handleEventMetaChange('endDate', e.target.value)} /></div>
                    <div className="proto-field"><label>Время начала (посл. день)</label><input type="time" className="proto-input-clean" value={eventMeta.lastDayStartTime} onChange={e => handleEventMetaChange('lastDayStartTime', e.target.value)} /></div>
                    <div className="proto-field"><label>Время окончания (посл. день)</label><input type="time" className="proto-input-clean" value={eventMeta.lastDayEndTime} onChange={e => handleEventMetaChange('lastDayEndTime', e.target.value)} /></div>
                  </div>
                )}
              </div>
            </MetaCard>

            {/* 3. LOGISTICS CARD */}
            <MetaCard
              id="logistics"
              expandedId={expandedCard}
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
                    <input className="proto-input-clean" type="number" value={logisticsMeta.logisticsCost} onChange={e => setLogisticsMeta({...logisticsMeta, logisticsCost: Number(e.target.value)})} />
                  </div>
                </div>
                <label className="proto-checkbox">
                  <input type="checkbox" checked={logisticsMeta.hasMkad} onChange={e => setLogisticsMeta({...logisticsMeta, hasMkad: e.target.checked})} />
                  Выезд за МКАД
                </label>
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
                      onQtyEditComplete={(newQty) => handleQtyComplete(sheet.id, row.id, newQty)}
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
      <div className="proto-sticky-bar">
        <div className="proto-sticky-content">
          <div className="proto-sticky-left">
            <span className="proto-status">Черновик сохранён</span>
            <span className="proto-grand-total">{grandTotal.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="proto-sticky-right">
            <button className="proto-btn proto-btn-primary" onClick={handleSaveKp}>Сохранить КП</button>
          </div>
        </div>
      </div>
    </div>
  );
}
