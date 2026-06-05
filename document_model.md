# DocumentModel — KP Creator XLSX

> Финальная структура JSON-объекта, передаваемого в Carbone.
> Основана на реальных моделях: `Kp`, `User`, `Contractor`, `Event`, `List`, `Row`.
> Код пока не пишем — только проектирование.

---

## Принцип: кто что вычисляет

```
БД → backend → DocumentModel (всё готово) → Carbone шаблон (только подставляет)
```

**Шаблон не вычисляет ничего.** Все числа, форматы дат, суммы — приходят готовыми строками/числами.

---

## Полный JSON — DocumentModel

```json
{
  "kp": {
    "number":           "42",
    "date":             "04 июня 2025",
    "contractNumber":   "ДОГ-2025/042",
    "contractDate":     "01 июня 2025",
    "status":           "Согласован"
  },

  "manager": {
    "name":             "Иванова Мария Сергеевна",
    "jobTitle":         "Менеджер по продажам",
    "email":            "ivanova@company.ru",
    "tel":              "+7 (495) 123-45-67"
  },

  "contractor": {
    "companyName":      "ООО «Гастроном Люкс»",
    "contactPerson":    "Петров Алексей Николаевич",
    "phone":            "+7 (916) 987-65-43",
    "email":            "petrov@gastronom.ru"
  },

  "event": {
    "title":            "Корпоратив 23 февраля",
    "place":            "Банкетный зал «Империя», Москва",
    "countOfPerson":    "120",
    "dateRange":        "22 февраля 2026 — 23 февраля 2026",
    "startDate":        "22 февраля 2026",
    "endDate":          "23 февраля 2026",
    "schedule": [
      {
        "day":          "День 1 — 22 февраля 2026",
        "arrive":       "17:00 — 19:00",
        "depart":       "23:00 — 00:00"
      },
      {
        "day":          "День 2 — 23 февраля 2026",
        "arrive":       "10:00 — 11:00",
        "depart":       "16:00 — 17:00"
      }
    ]
  },

  "lists": [
    {
      "index":          1,
      "title":          "Банкетное меню",
      "place":          "Банкетный зал «Империя»",
      "countOfPerson":  "120",
      "dateRange":      "22 февраля — 23 февраля 2026",
      "arrive":         "17:00 — 19:00",
      "depart":         "23:00 — 00:00",

      "rows": [
        {
          "rowIndex":       1,
          "product":        "Ассорти мясное",
          "composition":    "Говядина, свинина, курица, зелень",
          "weight":         "250 г",
          "qty":            10,
          "price":          850,
          "total":          8500,
          "totalFormatted": "8 500 ₽",
          "type":           "eat"
        },
        {
          "rowIndex":       2,
          "product":        "Сок апельсиновый",
          "composition":    "Свежевыжатый",
          "weight":         "200 мл",
          "qty":            120,
          "price":          180,
          "total":          21600,
          "totalFormatted": "21 600 ₽",
          "type":           "drink"
        }
      ],

      "subtotal":           30100,
      "subtotalFormatted":  "30 100 ₽"
    },
    {
      "index":          2,
      "title":          "Кофе-пауза",
      "place":          "Фойе",
      "countOfPerson":  "120",
      "dateRange":      "23 февраля 2026",
      "arrive":         "10:00 — 11:00",
      "depart":         "13:00 — 14:00",

      "rows": [
        {
          "rowIndex":       1,
          "product":        "Кофе эспрессо",
          "composition":    "",
          "weight":         "30 мл",
          "qty":            120,
          "price":          120,
          "total":          14400,
          "totalFormatted": "14 400 ₽",
          "type":           "drink"
        }
      ],

      "subtotal":           14400,
      "subtotalFormatted":  "14 400 ₽"
    }
  ],

  "totals": {
    "foodTotal":            30100,
    "foodTotalFormatted":   "30 100 ₽",
    "drinkTotal":           36000,
    "drinkTotalFormatted":  "36 000 ₽",
    "serviceTotal":         0,
    "serviceTotalFormatted":"0 ₽",

    "foodWeightTotal":      3000,
    "foodWeightPerPerson":  25,
    "drinkWeightTotal":     24000,
    "drinkWeightPerPerson": 200,

    "subtotalBeforeLogistics":          66100,
    "subtotalBeforeLogisticsFormatted": "66 100 ₽",

    "logisticsCost":            5000,
    "logisticsCostFormatted":   "5 000 ₽",
    "isWithinMkad":             true,
    "logisticsLabel":           "Доставка (в пределах МКАД)",

    "grandTotal":           71100,
    "grandTotalFormatted":  "71 100 ₽"
  },

  "meta": {
    "generatedAt":  "04.06.2026 14:32",
    "generatedBy":  "KP Creator"
  }
}
```

---

## Трейсинг полей: DocumentModel → БД → поле модели

### Блок `kp`

| DocumentModel | Таблица БД | Поле модели | Примечание |
|---|---|---|---|
| `kp.number` | `kps` | `kpNumber` | STRING, как есть |
| `kp.date` | `kps` | `kpDate` | DATEONLY → форматируется в backend |
| `kp.contractNumber` | `kps` | `contractNumber` | STRING |
| `kp.contractDate` | `kps` | `contractDate` | DATEONLY → форматируется в backend |
| `kp.status` | `kps` | `status` | `'draft'→'Черновик'`, маппинг в backend |

---

### Блок `manager`

| DocumentModel | Таблица БД | Поле модели | Примечание |
|---|---|---|---|
| `manager.name` | `kps` | `managerName` | STRING, денормализованное поле |
| `manager.jobTitle` | `Users` | `job` | через `Kp.belongsTo(User, {as:'manager'})` |
| `manager.email` | `Users` | `email` | через include manager |
| `manager.tel` | `Users` | `tel` | через include manager |

> [!NOTE]
> Сейчас в `kpController.getOne` include User закомментирован. Для генерации XLSX нужен отдельный endpoint `GET /api/kp/:kpNumber/xlsx` с полным include. Существующий getOne не трогаем.

---

### Блок `contractor`

| DocumentModel | Таблица БД | Поле модели | Примечание |
|---|---|---|---|
| `contractor.companyName` | `Contractors` | `companyName` | уже включён через `as:'contractor'` |
| `contractor.contactPerson` | `Contractors` | `contactPerson` | |
| `contractor.phone` | `Contractors` | `phone` | |
| `contractor.email` | `Contractors` | `email` | |

---

### Блок `event`

| DocumentModel | Таблица БД | Поле модели | Примечание |
|---|---|---|---|
| `event.title` | `Events` | `title` | уже в include `as:'event'` |
| `event.place` | `kps` | `eventPlace` | берётся с КП, не из Event |
| `event.countOfPerson` | `kps` | `countOfPerson` | STRING → как есть |
| `event.startDate` | `kps` | `startEvent` | DATEONLY → форматируется |
| `event.endDate` | `kps` | `endEvent` | DATEONLY → форматируется |
| `event.dateRange` | — | — | **вычисляется** в backend из startEvent + endEvent |
| `event.schedule[i].day` | `lists` | `startEvent` | из каждого List, форматируется |
| `event.schedule[i].arrive` | `lists` | `startTimeStartEvent` + `endTimeStartEvent` | `HH:MM — HH:MM` |
| `event.schedule[i].depart` | `lists` | `startTimeEndEvent` + `endTimeEndEvent` | `HH:MM — HH:MM` |

---

### Блок `lists[i]`

| DocumentModel | Таблица БД | Поле модели | Примечание |
|---|---|---|---|
| `lists[i].index` | — | — | **вычисляется**: порядковый номер (1-based) |
| `lists[i].title` | `lists` | `listTitle` | STRING |
| `lists[i].place` | `lists` | `eventPlace` | STRING |
| `lists[i].countOfPerson` | `lists` | `countOfPerson` | STRING |
| `lists[i].dateRange` | `lists` | `startEvent` + `endEvent` | форматируется в backend |
| `lists[i].arrive` | `lists` | `startTimeStartEvent` + `endTimeStartEvent` | `HH:MM — HH:MM` |
| `lists[i].depart` | `lists` | `startTimeEndEvent` + `endTimeEndEvent` | `HH:MM — HH:MM` |
| `lists[i].subtotal` | — | — | **вычисляется**: Σ(row.qty × row.price) |
| `lists[i].subtotalFormatted` | — | — | **вычисляется** + форматируется |

---

### Блок `lists[i].rows[j]`

| DocumentModel | Таблица БД | Поле модели | Примечание |
|---|---|---|---|
| `rows[j].rowIndex` | — | — | **вычисляется**: j+1 |
| `rows[j].product` | `rows` | `product` | STRING |
| `rows[j].composition` | `rows` | `composition` | STRING, может быть пустым |
| `rows[j].weight` | `rows` | `productWeight` | INTEGER → `"250 г"` или `"200 мл"` в backend |
| `rows[j].qty` | `rows` | `countOfProduct` | INTEGER |
| `rows[j].price` | `rows` | `priceOfProduct` | INTEGER |
| `rows[j].total` | — | — | **вычисляется**: `countOfProduct × priceOfProduct` |
| `rows[j].totalFormatted` | — | — | **вычисляется** + форматируется |
| `rows[j].type` | `rows` | `typeOfProduct` | `'eat'`, `'drink'`, `'organisation'` |

---

### Блок `totals`

| DocumentModel | Источник | Формула |
|---|---|---|
| `totals.foodTotal` | backend | `Σ(row.qty × row.price)` где `typeOfProduct='eat'` по всем спискам |
| `totals.drinkTotal` | backend | `Σ(row.qty × row.price)` где `typeOfProduct='drink'` |
| `totals.serviceTotal` | backend | `Σ(row.qty × row.price)` где `typeOfProduct='organisation'` |
| `totals.foodWeightTotal` | backend | `Σ(row.productWeight × row.qty)` для `eat` |
| `totals.foodWeightPerPerson` | backend | `foodWeightTotal / kp.countOfPerson` |
| `totals.drinkWeightTotal` | backend | аналогично для `drink` |
| `totals.drinkWeightPerPerson` | backend | `drinkWeightTotal / kp.countOfPerson` |
| `totals.subtotalBeforeLogistics` | backend | `foodTotal + drinkTotal + serviceTotal` |
| `totals.logisticsCost` | `kps` | `logisticsCost` — INTEGER из БД |
| `totals.isWithinMkad` | `kps` | `isWithinMkad` — BOOLEAN |
| `totals.logisticsLabel` | backend | `isWithinMkad ? 'в пределах МКАД' : 'за пределами МКАД'` |
| `totals.grandTotal` | backend | `subtotalBeforeLogistics + logisticsCost` |
| `*Formatted` | backend | `new Intl.NumberFormat('ru-RU').format(n) + ' ₽'` |

---

## Что вычисляет backend — полный список (25 операций)

```
Строки:
  1.  row.total         = row.countOfProduct × row.priceOfProduct
  2.  row.rowIndex      = порядковый номер строки (j + 1)
  3.  row.weight        = productWeight + (typeOfProduct === 'drink' ? ' мл' : ' г')
  4.  row.totalFormatted = Intl.NumberFormat + ' ₽'

Списки:
  5.  list.subtotal     = Σ row.total по всем строкам списка
  6.  list.subtotalFormatted = Intl.NumberFormat + ' ₽'
  7.  list.index        = порядковый номер списка (i + 1)
  8.  list.arrive       = startTimeStartEvent + ' — ' + endTimeStartEvent
  9.  list.depart       = startTimeEndEvent + ' — ' + endTimeEndEvent
  10. list.dateRange    = форматированный диапазон дат списка

Событие:
  11. event.dateRange   = форматированный диапазон дат КП
  12. event.startDate   = kp.startEvent → 'DD месяц YYYY'
  13. event.endDate     = kp.endEvent   → 'DD месяц YYYY'
  14. event.schedule    = массив { day, arrive, depart } из lists[]

Итоги:
  15. totals.foodTotal          = Σ(eat-строки по всем спискам)
  16. totals.drinkTotal         = Σ(drink-строки)
  17. totals.serviceTotal       = Σ(organisation-строки)
  18. totals.foodWeightTotal    = Σ(productWeight × qty) для eat
  19. totals.foodWeightPerPerson = foodWeightTotal / countOfPerson
  20. totals.drinkWeightTotal   = аналогично для drink
  21. totals.drinkWeightPerPerson
  22. totals.subtotalBeforeLogistics
  23. totals.logisticsLabel     = маппинг isWithinMkad → строка
  24. totals.grandTotal         = subtotal + logisticsCost
  25. Все *Formatted             = Intl.NumberFormat('ru-RU') + ' ₽'

Метаданные:
  26. kp.date           = kpDate → 'DD месяц YYYY'
  27. kp.contractDate   = contractDate → 'DD месяц YYYY'
  28. kp.status         = маппинг: draft→Черновик, approved→Согласован, sent→Отправлен
  29. meta.generatedAt  = new Date() при генерации документа
```

---

## Что шаблон НЕ вычисляет — ничего

| Операция | Ответственность |
|---|---|
| qty × price | Backend → `row.total` |
| Σ по списку | Backend → `list.subtotal` |
| Σ по типу (еда/напитки) | Backend → `totals.foodTotal` и др. |
| Вес на персону | Backend |
| Итог + логистика | Backend → `totals.grandTotal` |
| Форматирование дат | Backend |
| Форматирование денег | Backend |
| Форматирование времён | Backend |
| Маппинг статусов | Backend |
| Порядковые номера | Backend |

Шаблон только подставляет: `{d.totals.grandTotalFormatted}` → `"71 100 ₽"`

---

## Диаграмма зависимостей

```
Kp (kps)
├── manager → Users  (managerId FK)
│   ├── name         ← kps.managerName      (денормализован)
│   ├── jobTitle     ← Users.job
│   ├── email        ← Users.email
│   └── tel          ← Users.tel
│
├── contractor → Contractors  (contractorId FK)
│   ├── companyName  ← Contractors.companyName
│   ├── contactPerson← Contractors.contactPerson
│   ├── phone        ← Contractors.phone
│   └── email        ← Contractors.email
│
├── event → Events  (eventId FK)
│   └── title        ← Events.title
│
├── кп-реквизиты ← kps
│   ├── kpNumber, kpDate
│   ├── contractNumber, contractDate
│   ├── startEvent, endEvent, eventPlace
│   ├── countOfPerson, isWithinMkad, logisticsCost
│   └── status
│
└── lists[] → lists  (kpId FK)
    ├── startEvent, endEvent
    ├── startTimeStartEvent, endTimeStartEvent
    ├── startTimeEndEvent, endTimeEndEvent
    ├── eventPlace, countOfPerson, listTitle
    └── rows[] → rows  (listId FK)
        ├── product, composition
        ├── productWeight, countOfProduct, priceOfProduct
        ├── typeOfProduct, order
        └── [total — вычисляется backend]
```

---

## Открытые вопросы перед утверждением

> [!IMPORTANT]
> **Вес — единица измерения.** `productWeight` — INTEGER без единицы. Правило: `typeOfProduct === 'drink'` → добавляем `мл`, иначе → `г`. Если есть исключения (кг, порция) — зафиксировать сейчас, пока не написан код.

> [!IMPORTANT]
> **Manager include.** `kpController.getOne` не включает User (закомментировано). Для XLSX нужен отдельный endpoint `GET /api/kp/:kpNumber/xlsx` — новый контроллер, существующий API не трогаем.

> [!NOTE]
> **`event.schedule`** — массив дней из всех списков. Нужен в шапке документа для вывода графика. Если шапка не предполагает расписание — убираем.

> [!NOTE]
> **`lists[i].subtotal`** — промежуточный итог по каждому списку. Нужен если шаблон выводит итог под каждым списком. Если нет — убираем.

> [!NOTE]
> **Формат дат.** Предлагается `"04 июня 2025"` через `Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })`. Подтвердите или укажите альтернативный формат.
