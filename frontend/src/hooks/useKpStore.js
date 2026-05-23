// import { create } from 'zustand';

// const getDefaultFormData = () => ({
//     kpNumber: '',
//     kpDate: new Date().toISOString().split('T')[0],
//     contractNumber: '',
//     contractDate: new Date().toISOString().split('T')[0],
//     startEvent: new Date().toISOString().split('T')[0],
//     endEvent: new Date().toISOString().split('T')[0],
//     startTimeStartEvent: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
//     endTimeStartEvent: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
//     startTimeEndEvent: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
//     endTimeEndEvent: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
//     eventPlace: '',
//     countOfPerson: '',
//     logisticsCost: 0,
//     isWithinMkad: true,
//     listTitle: ''
// });

// const useKpStore = create((set) => ({
//     formData: {},
//     setFormData: (newData) => set((state) => ({
//         formData: { ...state.formData, ...newData }
//     })),
//     resetFormData: () => {
//         set({ formData: getDefaultFormData() });
//     },
//     // ✅ Обновление одного поля
//     updateField: (field, value) =>
//         set((state) => ({
//             formData: {
//                 ...state.formData,
//                 [field]: value,
//             },
//         })),

//     // ✅ Обновление сразу нескольких полей
//     updateFields: (fields) =>
//         set((state) => ({
//             formData: {
//                 ...state.formData,
//                 ...fields,
//             },
//         })),
//     listsKp: [],
//     setListsKp: (lists) => set({ listsKp: lists }),
//     resetListsKp: () =>
//         set({ listsKp: [] }),
//     addList: (rows) =>
//     set((state) => ({
//         listsKp: [...state.listsKp, { 
//             id: state.listsKp.length + 1, 
//             rows: rows 
//         }]
//     })),
//     deleteList: (id) =>
//     set((state) => ({
//         listsKp: state.listsKp.filter(obj => obj.id !== id)
//     })),
// }));

// export default useKpStore;

import { create } from 'zustand';

const getDefaultFormData = () => ({
    kpNumber: '',
    kpDate: new Date().toISOString().split('T')[0],
    contractNumber: '',
    contractDate: new Date().toISOString().split('T')[0],
    startEvent: new Date().toISOString().split('T')[0],
    endEvent: new Date().toISOString().split('T')[0],
    startTimeStartEvent: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    endTimeStartEvent: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    startTimeEndEvent: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    endTimeEndEvent: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    eventPlace: '',
    countOfPerson: '',
    logisticsCost: 0,
    isWithinMkad: true,
    listTitle: '',
    contractorId: null,
    eventId: null
});

const sortRowsByOrder = (rows) => {
    if (!rows) return rows;
    return [...rows].sort((a, b) => 
        (a.order - b.order) || ((a.id ?? 0) - (b.id ?? 0))
    );
};

const useKpStore = create((set, get) => ({
    // Form state
    formData: {},
    setFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData }
    })),
    resetFormData: () => {
        set({ formData: getDefaultFormData() });
    },
    updateField: (field, value) =>
        set((state) => ({
            formData: {
                ...state.formData,
                [field]: value,
            },
        })),
    updateFields: (fields) =>
        set((state) => ({
            formData: {
                ...state.formData,
                ...fields,
            },
        })),

    // Lists state
    listsKp: [],
    
    setListsKp: (lists) => set({ listsKp: lists }),
    
    resetListsKp: () => set({ listsKp: [] }),
    
    // Добавление нового листа
    addList: (rows) =>
        set((state) => {
            const newId = state.listsKp.length > 0 
                ? Math.max(...state.listsKp.map(item => item.id)) + 1 
                : 1;
            return {
                listsKp: [...state.listsKp, { 
                    id: newId, 
                    rows: sortRowsByOrder(rows)
                }]
            };
        }),
    
    // Удаление листа
    deleteList: (id) =>
        set((state) => ({
            listsKp: state.listsKp.filter(obj => obj.id !== id)
        })),

    // Удаление строки из листа
    deleteRowFromList: (listId, rowIndex) =>
        set((state) => ({
            listsKp: state.listsKp.map(list =>
                list.id === listId
                    ? {
                        ...list,
                        rows: list.rows.filter((_, index) => index !== rowIndex)
                    }
                    : list
            )
        })),

    // ✅ Добавление строки в лист (ADD_ROW_ON_LIST)
    addRowToList: (listId, row) =>
        set((state) => ({
            listsKp: state.listsKp.map(list => {
                if (list.id !== listId) return list;
                
                // Создаем новый массив строк с добавленной позицией
                const updatedRows = [...(list.rows || []), row];
                
                // Сортируем по order и id
                const sortedRows = sortRowsByOrder(updatedRows);
                
                return { ...list, rows: sortedRows };
            })
        })),

    // ✅ Обновление строки в листе (UPDATE_ROW)
    updateRowInList: (listId, rowIndex, updatedRow) =>
        set((state) => ({
            listsKp: state.listsKp.map(list => {
                if (list.id !== listId) return list;
                
                return {
                    ...list,
                    rows: list.rows.map((row, index) => {
                        if (index !== rowIndex) return row;
                        
                        // Обрабатываем поле order специально
                        const newOrder = Number.isInteger(updatedRow?.order)
                            ? updatedRow.order
                            : row.order;
                        
                        return {
                            ...row,
                            ...updatedRow,
                            order: newOrder
                        };
                    })
                };
            })
        })),

    // ✅ Синхронизация обновления строки (SYNC_ROW_UPDATE)
    // syncRowUpdate: (listId, rowIndex, updatedRow) =>
    //     set((state) => ({
    //         listsKp: state.listsKp.map(list =>
    //             list.id === listId
    //                 ? {
    //                     ...list,
    //                     rows: list.rows.map((row, idx) =>
    //                         idx === rowIndex
    //                             ? { ...row, ...updatedRow }
    //                             : row
    //                     )
    //                 }
    //                 : list
    //         )
    //     })),

    // ✅ Обновление нескольких строк/данных (REFRESH_DATA)
    refreshData: () =>
        set((state) => ({
            listsKp: [...state.listsKp] // Создаем новый массив для обновления ссылок
        })),

    // ✅ Полная синхронизация всех данных (SYNC_ALL_DATA)
    // syncAllData: (listsData) =>
    //     set(() => ({
    //         listsKp: listsData
    //     })),

    // ✅ Обновление всего листа целиком
    updateList: (listId, newRows) =>
        set((state) => ({
            listsKp: state.listsKp.map(list =>
                list.id === listId 
                    ? { ...list, rows: sortRowsByOrder(newRows) }
                    : list
            )
        })),

    // ✅ Получение листа по ID
    getListById: (listId) => {
        return get().listsKp.find(list => list.id === listId);
    },

    // ✅ Получение строки по индексу
    getRowByIndex: (listId, rowIndex) => {
        const list = get().listsKp.find(list => list.id === listId);
        return list?.rows?.[rowIndex];
    },

    // ✅ Обновление order'ов для всех строк (для drag-and-drop)
    updateRowsOrder: (listId, orderedRows) =>
        set((state) => ({
            listsKp: state.listsKp.map(list =>
                list.id === listId
                    ? { ...list, rows: orderedRows }
                    : list
            )
        }))
}));

export default useKpStore;