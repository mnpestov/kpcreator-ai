# Фаза 1 — Backend Foundation: план реализации

## Цель фазы

Создать рабочий backend-слой, который:
1. Принимает запрос на экспорт КП
2. Загружает все данные из БД одним запросом
3. Строит DocumentModel v1.1 (все вычисления, форматирование)
4. Возвращает готовый DocumentModel в виде JSON ← **конец Фазы 1**

Генерация XLSX и шаблон — Фаза 2.

---

## Новые файлы

### `backend/services/documents/documentBuilder.js` [NEW]

**Цель:** чистая функция, которая принимает данные из БД и возвращает DocumentModel v1.1.

**Не знает о:** Express, HTTP, файлах, Carbone. Только трансформация данных.

```
Экспортирует:
  buildDocumentModel(kpRow)  →  DocumentModel
```

**Что делает внутри:**
- Форматирование дат (`Intl.DateTimeFormat('ru-RU', ...)`)
- Форматирование денег (`Intl.NumberFormat('ru-RU')`)
- Вычисление `row.total = countOfProduct × priceOfProduct`
- Вычисление `row.weight = productWeight + (type==='drink' ? ' мл' : ' г')`
- Маппинг статусов (`draft→'Черновик'` и т.д.)
- Сборка `lists[]` с `rows[]`
- Добавление строки логистики (`type: 'logistics'`) если `logisticsCost > 0`
- Вычисление `totals.*` (food/drink/service/logistics/grand/nonCash)
- Вычисление `*PerPerson` с `Math.round`
- Формирование `event.schedule` из `lists[]`
- Добавление `meta.generatedAt`

---

### `backend/controllers/xlsxController.js` [NEW]

**Цель:** HTTP-слой. Принимает запрос, вызывает DB-запрос, вызывает `buildDocumentModel`, отдаёт ответ.

```
Экспортирует:
  exportKpXlsx(req, res, next)
```

**Что делает:**
1. Берёт `kpNumber` из `req.params`
2. Загружает КП из БД через `Kp.findOne()` с **полным include** (все связи)
3. Вызывает `buildDocumentModel(kp)`
4. **Фаза 1:** возвращает `res.json(documentModel)` ← временно, для проверки
5. **Фаза 2 (замена):** вызовет `carboneService.render(documentModel)` → `res.download()`

**Include в Фазе 1 (полный, в отличие от `getOne`):**
```js
include: [
  { model: User,       as: 'manager',    attributes: ['name','job','email','tel'] },
  { model: Contractor, as: 'contractor'  },
  { model: Event,      as: 'event',      attributes: ['id','title'] },
  { model: List, include: [
      { model: Row, separate: true, order: [['order','ASC'],['id','ASC']] }
  ]}
]
```

---

### `backend/routes/xlsx.js` [NEW]

**Цель:** минимальный роутер, регистрирует один endpoint.

```js
router.get('/:kpNumber/export/xlsx', authMiddleware, xlsxController.exportKpXlsx)
```

Защищён `authMiddleware` (тот же паттерн, что во всех остальных роутах).

---

## Изменяемые существующие файлы

### `backend/routes/index.js` [MODIFY]

| | |
|---|---|
| **Цель** | Подключить новый роут xlsx |
| **Изменение** | +2 строки: `require('./xlsx')` + `router.use('/api/kp', xlsx)` |
| **Риск** | Нулевой — добавление нового маршрута, не изменение существующих |

> [!IMPORTANT]
> `routes/index.js` — **не** защищённый файл по AGENTS.md. Минимальное изменение: ровно 2 строки.

**Ни один другой существующий файл не изменяется.**

Существующий [`kpController.js`](file:///Users/mihailpestov/Desktop/dev/ai-dev/kpcreatorai/backend/controllers/kpController.js) и [`routes/kp.js`](file:///Users/mihailpestov/Desktop/dev/ai-dev/kpcreatorai/backend/routes/kp.js) остаются **нетронутыми**.

---

## Зависимость: carbone

Carbone нужен уже в Фазе 1 для установки, хотя используется в Фазе 2.

```bash
cd backend && npm install carbone
```

> [!IMPORTANT]
> Установка зависимости требует явного одобрения согласно AGENTS.md §11.2. Команда будет показана перед выполнением.

**Carbone уже установлен** в `/Users/mihailpestov/Desktop/dev/ai-dev/carbone-poc/` (POC).
В backend нужна отдельная установка.

---

## Endpoint контракт

```http
GET /api/kp/:kpNumber/export/xlsx
Authorization: Bearer <jwt_token>
```

### Фаза 1 — response (для проверки)

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "kp": { "number": "42", "date": "04 июня 2026", ... },
  "manager": { "name": "...", "jobTitle": "...", ... },
  "contractor": { "companyName": "...", ... },
  "event": { "title": "...", "dateRange": "...", ... },
  "lists": [...],
  "totals": { "grandTotal": 71100, "grandTotalFormatted": "71 100 ₽", ... },
  "meta": { "generatedAt": "04.06.2026 14:32" }
}
```

### Фаза 2 — response (после добавления Carbone)

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="KP-42.xlsx"
Content-Length: <bytes>
Cache-Control: no-store
```

### Ошибки

| Ситуация | HTTP | Body |
|---|---|---|
| КП не найден | 404 | `{ "message": "КП не найден" }` |
| Не авторизован | 401 | `{ "message": "Не авторизован" }` |
| Ошибка сборки | 500 | `{ "message": "Ошибка формирования документа" }` |

---

## Структура после Фазы 1

```
backend/
├── controllers/
│   ├── kpController.js          ← без изменений
│   └── xlsxController.js        ← NEW
├── routes/
│   ├── index.js                 ← +2 строки
│   ├── kp.js                    ← без изменений
│   └── xlsx.js                  ← NEW
└── services/
    └── documents/
        └── documentBuilder.js   ← NEW
```

---

## Что работает после Фазы 1

| # | Что | Статус |
|---|---|---|
| 1 | Endpoint `GET /api/kp/:kpNumber/export/xlsx` существует | ✅ |
| 2 | Защита через JWT (authMiddleware) | ✅ |
| 3 | Полная загрузка данных из БД (все связи) | ✅ |
| 4 | DocumentModel v1.1 строится полностью | ✅ |
| 5 | Все вычисления: totals, weights, nonCash, logistics row | ✅ |
| 6 | Все форматирования: даты, деньги, время, статусы | ✅ |
| 7 | Ответ: JSON с готовым DocumentModel | ✅ (временно) |
| 8 | XLSX-файл генерируется | ❌ Фаза 2 |
| 9 | Carbone шаблон создан | ❌ Фаза 2 |

---

## Фаза 2 (следующая, после утверждения Фазы 1)

- `backend/services/documents/carboneService.js` — обёртка над `carbone.render()`
- `backend/templates/kp-template.xlsx` — XLSX-шаблон с тегами `{d.*}`
- Замена `res.json(documentModel)` на `carboneService.render(documentModel)` → `res.download()`

---

## Порядок выполнения Фазы 1

```
1. npm install carbone (в backend/)
2. Создать backend/services/documents/documentBuilder.js
3. Создать backend/controllers/xlsxController.js
4. Создать backend/routes/xlsx.js
5. Добавить 2 строки в backend/routes/index.js
6. Проверить: GET /api/kp/1/export/xlsx → JSON с DocumentModel
```
