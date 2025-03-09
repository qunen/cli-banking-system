const validateDateString = (dateString) => {
    // Validate date string to be in YYYYMMDD format
    if (dateString.length !== 8) return 'Invalid date format! Date should be in YYYYMMDD format.\n';
    try {
        const year = dateString.slice(0,4);
        const month = dateString.slice(4,6);
        const day = dateString.slice(6);

        const parseDate = new Date(Date.UTC(Number(year), Number(month)-1, Number(day))).toISOString();
        const inputDateISO = `${year}-${month}-${day}T00:00:00.000Z`
        if (parseDate !== inputDateISO) return 'Date is invalid! Ensure that the date YYYYMMDD is valid.\n';
    }
    catch (_err) {
        return 'Unable to parse date! Ensure that the date YYYYMMDD is valid.\n';
    }

    return null;
}

const validateYearMonth = (yearMonth) => {
    // Validate year-month to be in YYYYMM format
    if (yearMonth.length !== 6) {
        return 'Invalid month format! Date should be in <YYYY><MM> format.\n';
    }
    else {
        try {
            const year = yearMonth.slice(0,4);
            const month = yearMonth.slice(4);

            const parseDate = new Date(Date.UTC(Number(year), Number(month)-1, 1)).toISOString();
            const inputDateISO = `${year}-${month}-01T00:00:00.000Z`
            if (parseDate !== inputDateISO) {
                return 'Month is invalid! Ensure that the month YYYYMM is valid.\n';
            }
        }
        catch (_err) {
            return 'Unable to parse month! Ensure that the date YYYYMM is valid.\n';
        }
    }
    return null;
};

const vallidateTransactionType = (type) => {
    // Validate transaction type to be 'D' or 'W'
    if (type.toUpperCase() !== 'D' && type.toUpperCase() !== 'W') {
        return `Invalid type! Type should only be 'D' for deposit or 'W' for withdrawal.\n`;
    }
    return null;
};

const validateAmount = (amountString) => {
    // Validate amount to be positive number with up to 2 decimal place
    const amount = Number(amountString);
    if (!amount || amount < 0) {
        return 'Invalid amount! Amount should be a positive number.\n';
    }
    if (amountString.indexOf('.') !== -1 && amountString.length - amountString.indexOf('.') - 1 > 2) {
        return 'Invalid amount! Amount should not have more than 2 decimal places.\n';
    }
    return null;
};

module.exports = {
    validateDateString,
    validateYearMonth,
    vallidateTransactionType,
    validateAmount
};