const validations = require('./validations');

describe('Sucessfully validate date string', () => {
    it('Return null for a valid date string in YYYYMMDD format', () => {
        const err = validations.validateDateString('20250101');
        expect(err).toBeNull();
    });
});

describe('Fail validation for invalid date string', () => {
    const testCases = [
        {
            name: 'date string contain invalid characters',
            input: 'YYYY0101',
            error: 'Unable to parse date! Ensure that the date YYYYMMDD is valid.\n'
        },
        {
            name: 'date string is in DDMMYYYY format',
            input: '04012025',
            error: 'Date is invalid! Ensure that the date YYYYMMDD is valid.\n'
        },
        {
            name: 'date string is in YYYYDDMM format',
            input: '20251506',
            error: 'Date is invalid! Ensure that the date YYYYMMDD is valid.\n'
        },
        {
            name: 'date string is not a valid date',
            input: '20250230',
            error: 'Date is invalid! Ensure that the date YYYYMMDD is valid.\n'
        },
        {
            name: 'date string is in YYYY/MM/DD format',
            input: '2025/06/06',
            error: 'Invalid date format! Date should be in YYYYMMDD format.\n'
        }
    ];

    for (const testCase of testCases) {
        it(testCase.name, () => {
            const err = validations.validateDateString(testCase.input);
            expect(err).toBe(testCase.error);
        });
    }
});

describe('Sucessfully validate month', () => {
    it('Return null for a valid date string in YYYYMM format', () => {
        const err = validations.validateYearMonth('202501');
        expect(err).toBeNull();
    });
});

describe('Fail validation for invalid month string', () => {
    const testCases = [
        {
            name: 'month contain invalid characters',
            input: 'YYYY01',
            error: 'Unable to parse month! Ensure that the date YYYYMM is valid.\n'
        },
        {
            name: 'month is in MMYYYY format',
            input: '012025',
            error: 'Month is invalid! Ensure that the month YYYYMM is valid.\n'
        },
        {
            name: 'month is not a valid month',
            input: '202513',
            error: 'Month is invalid! Ensure that the month YYYYMM is valid.\n'
        },
        {
            name: 'month is in YYYY/MM format',
            input: '2025/06',
            error: 'Invalid month format! Date should be in <YYYY><MM> format.\n'
        }
    ].forEach((testCase) => {
        it(testCase.name, () => {
            const err = validations.validateYearMonth(testCase.input);
            expect(err).toBe(testCase.error);
        });
    });
});

describe('Sucessfully validate transaction type', () => {
    const testCases = [
        {
            name: 'transaction type = \'w\'',
            input: 'w'
        },
        {
            name: 'transaction type = \'W\'',
            input: 'W'
        },
        {
            name: 'transaction type = \'d\'',
            input: 'd'
        },
        {
            name: 'transaction type = \'D\'',
            input: 'D'
        }
    ];

    for (const testCase of testCases) {
        it(testCase.name, () => {
            const err = validations.validateTransactionType(testCase.input);
            expect(err).toBeNull();
        });
    }
});

describe('Fail validation for invalid transaction type', () => {
    const testCases = [
        {
            name: 'transaction type = \'ABC\'',
            input: 'ABC'
        },
        {
            name: 'transaction type = \'Withdrawal\'',
            input: 'Withdrawal'
        },
        {
            name: 'transaction type = \'Deposit\'',
            input: 'Deposit'
        }
    ];

    for (const testCase of testCases) {
        it(testCase.name, () => {
            const err = validations.validateTransactionType(testCase.input);
            expect(err).toBe('Invalid type! Type should only be \'D\' for deposit or \'W\' for withdrawal.\n');
        });
    }
});

describe('Sucessfully validate amount type', () => {
    const testCases = [
        {
            name: 'amount is a positive integer',
            input: '123'
        },
        {
            name: 'amount is a positive number with 1 decimal place',
            input: '123.1'
        },
        {
            name: 'amount is a positive number with 2 decimal place',
            input: '123.12'
        }
    ];

    for (const testCase of testCases) {
        it(testCase.name, () => {
            const err = validations.validateAmount(testCase.input);
            expect(err).toBeNull();
        });
    }
});

describe('Fail validation for amount', () => {
    const testCases = [
        {
            name: 'amount contain invalid characters',
            input: '$100',
            error: 'Invalid amount! Amount should be a positive number.\n'
        },
        {
            name: 'amount is 0',
            input: '0',
            error: 'Invalid amount! Amount should be a positive number.\n'
        },
        {
            name: 'amount is negative',
            input: '-100.15',
            error: 'Invalid amount! Amount should be a positive number.\n'
        },
        {
            name: 'amount has more than 2 decimal places',
            input: '123.4567',
            error: 'Invalid amount! Amount should not have more than 2 decimal places.\n'
        }
    ].forEach((testCase) => {
        it(testCase.name, () => {
            const err = validations.validateAmount(testCase.input);
            expect(err).toBe(testCase.error);
        });
    });
});