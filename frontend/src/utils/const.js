export const rows = [
    {
        countOfProduct: 400,
        priceOfProduct: 450,
        product: "Бургеры",
        composition: "( BBQ / Спайси )",
        productWeight: 270,
        typeOfProduct: "eat",
    },
    {
        countOfProduct: 400,
        priceOfProduct: 200,
        product: "Картофель ФРИ",
        composition: "(Соус сырный / кетчуп)",
        productWeight: 110,
        typeOfProduct: "eat",
    },
    {
        countOfProduct: 400,
        priceOfProduct: 200,
        product: "Мороженое в рожках",
        composition: "( клубничное / шоколадное / ванильное / фисташковое / баблгам / черешня)",
        productWeight: 60,
        typeOfProduct: "eat",
    },
]

export const lists = [
]

export const KP_DEFAULT_VALUES = {
    kpNumber: '',
    kpDate: '',
    contractNumber: '',
    contractDate: '',
    startEvent: '',
    endEvent: '',
    startTimeStartEvent: '',
    endTimeStartEvent: '',
    startTimeEndEvent: '',
    endTimeEndEvent: '',
    eventPlace: '',
    countOfPerson: '',
    logisticsCost: '',
    listTitle: '',
    isWithinMkad: true,
};

export const kpPreviewSelectors = {
    listSelector: 'list list-preview',
    logoContainerSelector: 'logo-container logo-container-preview',
    logoSelector: 'logo logo-preview',
    subtitleSelector: 'subtitle subtitle-preview',
    kpNumberSelector: 'kpNumber kpNumber-preview',
    kpNumberTitleSelector: 'kpNumber_title kpNumber_title-preview',
    managerSelector: 'manager manager-preview',
    managerInfosSelector: 'manager_infos manager_infos-preview',
    managerPhotoSelector: 'manager__photo manager__photo-preview',
    listLogoSelector: 'list__logo list__logo-preview',
    listTitleSelector: 'list__title list__title-preview',
    listTableSelector: 'list__table list__table-preview',
    tableTitlesSelector: 'table__titles table__titles-preview',
    tableTitleSelector: 'table__title table__title-preview',
    tableSubtitleSelector: 'table__subtitle table__subtitle-preview',
    lastListSelector: 'last-list last-list-preview',
    listTotalSelector: 'list__total list__total-preview',
    tabeLineProductSelector: 'tabel__line_product tabel__line_product-preview',
    rowActionsSelector: 'row-actions row-actions-preview',
    rowButtonSelector: 'row-button row-button-preview',
    tabelLineSelector: 'table__line tabel__line-preview',
    rowCountSelector: 'row_count row_count-preview',
    deleteButtonSelector: 'delete-button delete-button-preview',
    lastListLogoContainerSelector: 'last-list__logo-container last-list__logo-container-preview',
    lastListCountContainerSelector: 'last-list__count-container last-list__count-container-preview'
}
export const kpPrintSelectors = {
    listSelector: 'list',
    logoContainerSelector: 'logo-container',
    logoSelector: 'logo',
    subtitleSelector: 'subtitle',
    kpNumberSelector: 'kpNumber',
    kpNumberTitleSelector: 'kpNumber_title',
    managerSelector: 'manager',
    managerInfosSelector: 'manager_infos',
    managerPhotoSelector: 'manager__photo',
    listLogoSelector: 'list__logo',
    listTitleSelector: 'list__title',
    listTableSelector: 'list__table',
    tableTitlesSelector: 'table__titles',
    tableTitleSelector: 'table__title',
    tableSubtitleSelector: 'table__subtitle',
    lastListSelector: 'last-list',
    listTotalSelector: 'list__total',
    tabeLineProductSelector: 'tabel__line_product',
    rowActionsSelector: 'row-actions',
    rowButtonSelector: 'row-button',
    tabelLineSelector: 'table__line',
    rowCountSelector: 'row_count',
    deleteButtonSelector: 'delete-button',
    lastListLogoContainerSelector: 'last-list__logo-container',
    lastListCountContainerSelector: 'last-list__count-container'
}

// API configuration – single source of truth for the backend base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';
