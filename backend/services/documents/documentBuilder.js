/**
 * Clean data transformation for DocumentModel v1.1.
 * Pure function, agnostic of HTTP/Express/Carbone.
 */

const formatMoney = (num) => {
    if (num === null || num === undefined) return "";
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const formatPhone = (phone) => {
    if (!phone) return "";
    const cleaned = String(phone).replace(/\D/g, "");
    if (cleaned.length === 11) {
        return "+7 (" + cleaned.slice(1, 4) + ") " + cleaned.slice(4, 7) + "-" + cleaned.slice(7, 9) + "-" + cleaned.slice(9, 11);
    }
    return phone;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return day + "." + month + "." + year;
};

const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return String(timeStr).slice(0, 5);
};

const mapStatus = (status) => {
    const statuses = {
        "draft": "Черновик",
        "sent": "Отправлен",
        "approved": "Согласован",
        "rejected": "Отклонен"
    };
    return statuses[status] || status;
};

const buildDocumentModel = (kp) => {
    if (!kp) return null;

    const manager = kp.manager || {};
    const contractor = kp.contractor || {};
    const event = kp.event || {};

    // 1. KP Info
    const kpData = {
        number: kp.kpNumber,
        date: formatDate(kp.kpDate),
        contractNumber: kp.contractNumber || "",
        contractDate: formatDate(kp.contractDate),
        status: mapStatus(kp.status)
    };

    // 2. Manager Info
    const managerData = {
        name: manager.name || kp.managerName || "",
        jobTitle: manager.job || "",
        email: manager.email || "",
        tel: formatPhone(manager.tel || "")
    };

    // 3. Contractor Info
    const contractorData = {
        companyName: contractor.companyName || "",
        contactPerson: contractor.contactPerson || "",
        phone: contractor.phone || "",
        email: contractor.email || ""
    };

    // 4. Event Info
    const eventStartDate = formatDate(kp.startEvent);
    const eventEndDate = formatDate(kp.endEvent);
    const eventDateRange = kp.startEvent === kp.endEvent 
        ? eventStartDate 
        : eventStartDate + " — " + eventEndDate;

    const eventData = {
        title: event.title || "",
        place: kp.eventPlace || "",
        countOfPerson: String(kp.countOfPerson || ""),
        dateRange: eventDateRange,
        startDate: eventStartDate,
        endDate: eventEndDate
    };

    // 5. Lists, Rows & PrintableRows
    let foodTotalNum = 0;
    let drinkTotalNum = 0;
    let serviceTotalNum = 0;
    let foodWeightTotalNum = 0;
    let drinkWeightTotalNum = 0;
    
    const printableRows = [];

    const listsData = (kp.lists || []).map((list, lIdx) => {
        let listSubtotal = 0;
        
        const listStartDate = formatDate(list.startEvent);
        const listEndDate = formatDate(list.endEvent);
        const listDateRange = list.startEvent === list.endEvent 
            ? listStartDate 
            : listStartDate + " — " + listEndDate;

        const rowsData = (list.rows || []).map((row, rIdx) => {
            const rowTotal = (row.countOfProduct || 0) * (row.priceOfProduct || 0);
            listSubtotal += rowTotal;

            if (row.typeOfProduct === "eat") {
                foodTotalNum += rowTotal;
                foodWeightTotalNum += (row.productWeight || 0) * (row.countOfProduct || 0);
            } else if (row.typeOfProduct === "drink") {
                drinkTotalNum += rowTotal;
                drinkWeightTotalNum += (row.productWeight || 0) * (row.countOfProduct || 0);
            } else if (row.typeOfProduct === "organisation") {
                serviceTotalNum += rowTotal;
            }

            const weightUnit = row.typeOfProduct === "drink" ? " мл" : " г";
            const weightFormatted = row.productWeight ? row.productWeight + weightUnit : "";

            let details = weightFormatted || "";
            if (row.composition) {
                details += (details ? "\n" : "") + "(" + row.composition + ")";
            }

            const rowData = {
                rowIndex: rIdx + 1,
                product: row.product || "",
                composition: row.composition || "",
                weight: weightFormatted,
                qty: row.countOfProduct || 0,
                price: row.priceOfProduct || 0,
                total: rowTotal,
                type: row.typeOfProduct || ""
            };

            printableRows.push({
                rowIndex: printableRows.length + 1,
                title: row.product || "",
                details: details,
                qty: rowData.qty,
                price: formatMoney(rowData.price),
                total: formatMoney(rowData.total),
                type: rowData.type
            });

            return rowData;
        });

        return {
            index: lIdx + 1,
            title: list.listTitle || "",
            place: list.eventPlace || "",
            countOfPerson: String(list.countOfPerson || ""),
            dateRange: listDateRange,
            arrive: formatTime(list.startTimeStartEvent) + " — " + formatTime(list.endTimeStartEvent),
            depart: formatTime(list.startTimeEndEvent) + " — " + formatTime(list.endTimeEndEvent),
            rows: rowsData,
            subtotal: listSubtotal
        };
    });

    // 6. Totals
    const logisticsCostNum = kp.logisticsCost || 0;
    const grandTotalNum = foodTotalNum + drinkTotalNum + serviceTotalNum + logisticsCostNum;
    const nonCashTotalNum = Math.round(grandTotalNum * 1.07);

    const countOfPersonNum = parseInt(kp.countOfPerson, 10) || 0;
    const foodWeightPerPerson = countOfPersonNum > 0 ? Math.round(foodWeightTotalNum / countOfPersonNum) : 0;
    const drinkWeightPerPerson = countOfPersonNum > 0 ? Math.round(drinkWeightTotalNum / countOfPersonNum) : 0;

    const logisticsLabel = "Доставка (" + (kp.isWithinMkad ? "в пределах МКАД" : "за пределами МКАД") + ")";

    if (logisticsCostNum > 0) {
        printableRows.push({
            rowIndex: printableRows.length + 1,
            title: logisticsLabel,
            details: "",
            qty: 1,
            price: formatMoney(logisticsCostNum),
            total: formatMoney(logisticsCostNum),
            type: "logistics"
        });
    }

    const totalsData = {
        foodTotal: formatMoney(foodTotalNum),
        drinkTotal: formatMoney(drinkTotalNum),
        serviceTotal: formatMoney(serviceTotalNum),
        foodWeightTotal: foodWeightTotalNum,
        foodWeightPerPerson,
        drinkWeightTotal: drinkWeightTotalNum,
        drinkWeightPerPerson,
        subtotalBeforeLogistics: formatMoney(foodTotalNum + drinkTotalNum + serviceTotalNum),
        logisticsCost: formatMoney(logisticsCostNum),
        isWithinMkad: kp.isWithinMkad,
        logisticsLabel,
        grandTotal: formatMoney(grandTotalNum),
        nonCashTotal: formatMoney(nonCashTotalNum)
    };

    // 7. Meta
    const metaData = {
        generatedAt: "05.06.2026",
        generatedBy: "KP Creator"
    };

    return {
        kp: kpData,
        manager: managerData,
        contractor: contractorData,
        event: eventData,
        lists: listsData,
        printableRows,
        totals: totalsData,
        meta: metaData
    };
};

module.exports = {
    buildDocumentModel
};
