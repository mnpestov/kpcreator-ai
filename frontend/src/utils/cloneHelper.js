export const prepareCloneData = (formData, listsKp) => {
  const baseTime = Date.now();
  
  const clonedSheets = (listsKp || []).map((list, sIdx) => ({
    ...list,
    id: 's' + (baseTime + sIdx),
    title: list.listTitle || 'Лист 1',
    rows: (list.rows || []).map((row, rIdx) => ({
      ...row,
      id: (baseTime + sIdx + rIdx + 1000).toString()
    }))
  }));

  return {
    kpMeta: {
      kpNumber: formData.kpNumber || '',
      kpDate: formData.kpDate || '',
      contractNumber: formData.contractNumber || '',
      contractDate: formData.contractDate || '',
      syncContractData: formData.kpNumber === formData.contractNumber && formData.kpDate === formData.contractDate
    },
    eventMeta: {
      contractorId: formData.contractorId,
      companyName: formData.contractor?.companyName || '',
      contactPerson: formData.contractor?.contactPerson || '',
      phone: formData.contractor?.phone || '',
      email: formData.contractor?.email || '',
      eventId: null, // СБРОС (создаст новое мероприятие при сохранении)
      listTitle: formData.listTitle || formData.event?.title || '',
      eventName: formData.event?.title || '',
      eventPlace: formData.eventPlace || '',
      countOfPerson: formData.countOfPerson || '',
      startEvent: formData.startEvent || '',
      startTimeStartEvent: formData.startTimeStartEvent || '',
      endTimeStartEvent: formData.endTimeStartEvent || '',
      isMultiDay: !!(formData.endEvent && formData.startEvent && formData.startEvent !== formData.endEvent),
      endEvent: formData.endEvent || '',
      startTimeEndEvent: formData.startTimeEndEvent || '',
      endTimeEndEvent: formData.endTimeEndEvent || ''
    },
    logisticsMeta: {
      hasMkad: formData.isWithinMkad !== false,
      logisticsCost: formData.logisticsCost || 0
    },
    sheets: clonedSheets
  };
};
