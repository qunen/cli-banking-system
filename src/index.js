const userPrompt = require('./utils/functions/iostream.js');
const promptMessage = require('./constant/prompts.js');

const accountTransactions = {};
const interestRule = {};
const interestRate = {};

const controller = {
    t: async () => {
        // Validate inputs
        const inputs = (await userPrompt(promptMessage.TRANSACTION_PROMPT)).split(' ');
        if (inputs.length !== 4) {
            console.log('Invalid input format! Input has to be follow <Date> <Account> <Type> <Amount> format.\n');
            return;
        }

        // Parse input
        const [dateString, account, type, amountString] = inputs;
        const amount = Number(amountString);

        // Validate date input
        if (dateString.length !== 8) {
            console.log('Invalid date format! Date should be in YYYYMMDD format.\n');
            return;
        }
        else {
            try {
                const year = dateString.slice(0,4);
                const month = dateString.slice(4,6);
                const day = dateString.slice(6);

                const parseDate = new Date(Date.UTC(Number(year), Number(month)-1, Number(day))).toISOString();
                const inputDateISO = `${year}-${month}-${day}T00:00:00.000Z`
                if (parseDate !== inputDateISO) {
                    console.log('Date is invalid! Ensure that the date YYYYMMDD is valid.\n');
                    return;
                }
            }
            catch (_err) {
                console.log('Unable to parse date! Ensure that the date YYYYMMDD is valid.\n');
                return;
            }
        }

        // Validate type input
        if (type.toUpperCase() !== 'D' && type.toUpperCase() !== 'W') {
            console.log(`Invalid type! Type should only be 'D' for deposit or 'W' for withdrawal.\n`);
            return;
        }

        // Validate amount input
        if (!amount || amount < 0) {
            console.log('Invalid amount! Amount should be a positive number.\n');
            return;
        }
        if (amountString.indexOf('.') !== -1 && amountString.length - amountString.indexOf('.') - 1 > 2) {
            console.log('Invalid amount! Amount should not have more than 2 decimal places.\n');
            return;
        }

        // Check if account exists
        if (accountTransactions[account] === undefined) {
            // Validate the first transaction of an account should not be a withdrawal
            if (type.toUpperCase() === 'W') {
                console.log(`Invalid transaction! ${account} is a new account and the first transaction should be a deposit.\n`);
                return;
            }

            // Create account with initial transaction
            accountTransactions[account] = [{
                transactionDate: dateString,
                transactionId: `${dateString}-01`,
                type: type.toUpperCase(),
                amount: amount,
                balance: amount
            }];
        }
        else {
            // Retrieve the last transaction for the account
            const lastTransaction = accountTransactions[account][accountTransactions[account].length - 1];
            let transactionIdNumber = 1;

            // Validate the new transaction date
            if (lastTransaction.transactionDate > dateString) {
                console.log(`Invalid transaction! Transaction date must be later or equal to ${lastTransaction.transactionDate}.\n`);
                return;
            }
            if (lastTransaction.transactionDate === dateString) {
                transactionIdNumber = Number(lastTransaction.transactionId.slice(-2)) + 1;
                if (transactionIdNumber === 100) {
                    console.log(`Invalid transaction! Daily transaction limit (99) has been reached for account ${account} on ${dateString}.\n`);
                    return;
                }
            }

            // Validate account balance is enough for a withdrawal
            if (type.toUpperCase() === 'W' && lastTransaction.balance < amount) {
                console.log(`Invalid transaction! Account ${account} does not have enough balance for withdrawal.\n`);
                return;
            }

            // Update balance and insert new transaction record
            const balance = (type.toUpperCase() === 'W') ? lastTransaction.balance - amount : lastTransaction.balance + amount;
            accountTransactions[account].push({
                transactionDate: dateString,
                transactionId: `${dateString}-${String(transactionIdNumber).padStart(2, '0')}`,
                type: type.toUpperCase(),
                amount: amount,
                balance: balance
            });
        }

        printAccountTransactions(account);
        return;
    },
    i: async () => {
        // Validate input
        const inputs = (await userPrompt(promptMessage.INTEREST_PROMPT)).split(' ');
        if (inputs.length !== 3) {
            console.log('Invalid input format! Input has to be follow <Date> <RuleId> <Rate in %> format.\n');
            return;
        }

        // Parse input
        const [dateString, ruleId, rate] = inputs;

        // Validate date input
        if (dateString.length !== 8) {
            console.log('Invalid date format! Date should be in YYYYMMDD format.\n');
            return;
        }
        else {
            try {
                const year = dateString.slice(0,4);
                const month = dateString.slice(4,6);
                const day = dateString.slice(6);

                const parseDate = new Date(Date.UTC(Number(year), Number(month)-1, Number(day))).toISOString();
                const inputDateISO = `${year}-${month}-${day}T00:00:00.000Z`
                if (parseDate !== inputDateISO) {
                    console.log('Date is invalid! Ensure that the date YYYYMMDD is valid.\n');
                    return;
                }
            }
            catch (_err) {
                console.log('Unable to parse date! Ensure that the date YYYYMMDD is valid.\n');
                return;
            }
        }

        // Validate interest rule and rate
        if (interestRate[ruleId] !== undefined && interestRate[ruleId] !== rate) {
            console.log(`Invalid ruleId! Rule ${ruleId} already exists with a rate of ${interestRate[ruleId]}%.\n`);
            return;
        }
        if (rate >= 100 || rate <= 0) {
            console.log('Invalid interest rate! Interest rate should be greater than 0 and less than 100.');
            return;
        }

        // Update interest rule
        if (interestRate[ruleId] === undefined) interestRate[ruleId] = rate;
        interestRule[dateString] = ruleId;

        printInterestRules();
        return;
    },
    p: async () => {
        // Validate input
        const inputs = (await userPrompt(promptMessage.STATEMENT_PROMPT)).split(' ');
        if (inputs.length !== 2) {
            console.log('Invalid input format! Input has to be follow <Account> <Year><Month> format.\n');
            return;
        }

        // Parse input
        const [account, yearMonth] = inputs;
        const year = yearMonth.slice(0,4);
        const month = yearMonth.slice(4);

        // Validate year-month
        if (yearMonth.length !== 6) {
            console.log('Invalid month format! Date should be in <YYYY><MM> format.\n');
            return;
        }
        else {
            try {
                const parseDate = new Date(Date.UTC(Number(year), Number(month)-1, 1)).toISOString();
                const inputDateISO = `${year}-${month}-01T00:00:00.000Z`
                if (parseDate !== inputDateISO) {
                    console.log('Month is invalid! Ensure that the month YYYYMM is valid.\n');
                    return;
                }
            }
            catch (_err) {
                console.log('Unable to parse month! Ensure that the date YYYYMM is valid.\n');
                return;
            }
        }

        // Validate account
        if (accountTransactions[account] === undefined) {
            console.log(`Invalid account! Account ${account} does not exists.`);
            return;
        }

        printStatement(account, yearMonth);
        return;
    }
};

const printAccountTransactions = (account) => {
    const transactions = accountTransactions[account];
    let maxAmountLength = 'Amount'.length;
    for (const transaction of transactions) {
        maxAmountLength = Math.max(maxAmountLength, parseFloat(transaction.amount).toFixed(2).length);
    }
    const header = `
Account: ${account}
| Date     | Txn Id      | Type | ${'Amount'.padEnd(maxAmountLength, ' ')} |`;
    console.log(header);
    for (let i=0; i<transactions.length; i++) {
        console.log(`| ${transactions[i].transactionDate} | ${transactions[i].transactionId} | ${transactions[i].type}    | ${parseFloat(transactions[i].amount).toFixed(2).padStart(maxAmountLength, ' ')} |`);
    }
    console.log('\n');
};

const printInterestRules = () => {
    let maxRuleIdLength = 'RuleId'.length;
    let maxRateLength = 'Rate (%)'.length;

    const dateOrder = Object.keys(interestRule).sort((a,b) => a-b);
    const header = `
Interest rules:
| Date     | ${'RuleId'.padEnd(maxRuleIdLength, ' ')} | ${'Rate (%)'.padEnd(maxRateLength, ' ')} |`;
    console.log(header);
    for (let i=0; i<dateOrder.length; i++) {
        const date = dateOrder[i];
        const ruleId = interestRule[date];
        console.log(`| ${date} | ${interestRule[date].padEnd(maxRuleIdLength, ' ')} | ${String(interestRate[ruleId]).padStart(maxRateLength, ' ')} |`);
    }
    console.log('\n');
};

const printStatement = (account, year, month) => {
};

const main = async () => {
    let option = '';
    option = await userPrompt(promptMessage.GREETING_MSG + promptMessage.ACTION_PROMPT);
    option = option.toLowerCase();
    while (option !== 'q') {
        if (controller[option]) await controller[option]();
        else console.log('Invalid option selected. Please re-enter.\n');

        option = await userPrompt(promptMessage.FOLLOW_UP_MSG + promptMessage.ACTION_PROMPT);
        option = option.toLowerCase();
    }

    console.log(promptMessage.ENDING_MSG);
    return;
};

main()
.then(() => process.exit(0))
.catch((err) => {
    console.error(`Unhandled error: ${err}`);
    process.exit(1);
});