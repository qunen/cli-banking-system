const userPrompt = require('./../utils/functions/iostream');
const promptMessage = require('./../constant/prompts');
const validations = require('./validations');

const accountTransactions = {};
const interestRule = {};
const interestRate = {};

const inputTransactions = async () => {
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
    let err;
    err = validations.validateDateString(dateString);
    if (err) {
        console.log(err);
        return;
    }

    // Validate type input
    err = validations.validateTransactionType(type);
    if (err) {
        console.log(err);
        return;
    }

    // Validate amount input
    err = validations.validateAmount(amountString);
    if (err) {
        console.log(err);
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
};

const defineInterestRule = async () => {
    // Validate input
    const inputs = (await userPrompt(promptMessage.INTEREST_PROMPT)).split(' ');
    if (inputs.length !== 3) {
        console.log('Invalid input format! Input has to be follow <Date> <RuleId> <Rate in %> format.\n');
        return;
    }

    // Parse input
    const [dateString, ruleId, rate] = inputs;

    // Validate date input
    let err;
    err = validations.validateDateString(dateString);
    if (err) {
        console.log(err);
        return;
    }

    // Validate interest rule and rate
    if (interestRate[ruleId] !== undefined && interestRate[ruleId] !== rate) {
        console.log(`Invalid ruleId! Rule ${ruleId} already exists with a rate of ${interestRate[ruleId]}%.\n`);
        return;
    }
    if (rate >= 100 || rate <= 0) {
        console.log('Invalid interest rate! Interest rate should be greater than 0 and less than 100.\n');
        return;
    }

    // Update interest rule
    if (interestRate[ruleId] === undefined) interestRate[ruleId] = rate;
    interestRule[dateString] = ruleId;

    printInterestRules();
    return;
};

const generateStatement = async () => {
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
    let err;
    err = validations.validateYearMonth(yearMonth);
    if (err) {
        console.log(err);
        return;
    }

    // Validate account
    if (accountTransactions[account] === undefined) {
        console.log(`Invalid account! Account ${account} does not exists.\n`);
        return;
    }
    if (accountTransactions[account][0].transactionDate.slice(0,6) > yearMonth) {
        console.log(`Invalid month! Account ${account} was not created yet.\n`);
        return;
    }

    printStatement(account, year, month);
    return;
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
    // Gregorian calendar criteria for leap year calculation
    const daysInYear =  ((Number(year) % 4 === 0 && Number(year) % 100 > 0) || Number(year) % 400 === 0) ? 366 : 365;
    const daysInMonth = new Date(Date.UTC(Number(year), Number(month), 0)).getDate();

    const dateBoundary = `${year}${month}${daysInMonth}`;
    const transactions = accountTransactions[account].filter((transaction) => transaction.transactionDate <= dateBoundary);
    const interestDate = Object.keys(interestRule).filter((date) => date < dateBoundary).sort((a,b) => a-b);

    // Calculate interest
    let transactionPointer = transactions.length - 1;
    let interestListPointer = interestDate.length - 1;
    const balance = transactions[transactionPointer].balance;
    let interest = 0;
    for (let i=daysInMonth; i>0; i--) {
        const date = `${year}${month}${String(i).padStart(2, '0')}`;
        while (interestDate[interestListPointer] > date && interestListPointer >= 0) {
            interestListPointer --;
        }
        if (interestListPointer < 0) break;
        const ruleId = interestRule[interestDate[interestListPointer]];
        const rate = interestRate[ruleId];
        if (transactions[transactionPointer].transactionDate <= date) interest += transactions[transactionPointer].balance * rate/100;
        while (transactionPointer >= 0 && transactions[transactionPointer].transactionDate === date) {
            transactionPointer --;
        }
        if (transactionPointer < 0) break;
    }

    let maxAmountLength = 'Amount'.length;
    let maxBalanceLength = Math.max('Balance'.length, parseFloat(balance + interest/daysInYear).toFixed(2).length);
    transactions.filter((transaction) => transaction.transactionDate >= `${year}${month}01`);
    for (const transaction of transactions) {
        maxAmountLength = Math.max(maxAmountLength, parseFloat(transaction.amount).toFixed(2).length);
        maxBalanceLength = Math.max(maxBalanceLength, parseFloat(transaction.balance).toFixed(2).length);
    }
    const header = `Account: ${account}
| Date     | Txn Id      | Type | ${'Amount'.padEnd(maxAmountLength, ' ')} | ${'Balance'.padEnd(maxBalanceLength, ' ')} |`;
    console.log(header);
    for (let i=0; i<transactions.length; i++) {
        console.log(`| ${transactions[i].transactionDate} | ${transactions[i].transactionId} | ${transactions[i].type}    | ${parseFloat(transactions[i].amount).toFixed(2).padStart(maxAmountLength, ' ')} | ${parseFloat(transactions[i].balance).toFixed(2).padStart(maxBalanceLength, ' ')} |`);
    }
    console.log(`| ${year}${month}${daysInMonth} |             | I    | ${parseFloat(interest/daysInYear).toFixed(2).padStart(maxAmountLength, ' ')} | ${parseFloat(balance + interest/daysInYear).toFixed(2).padStart(maxBalanceLength, ' ')} |\n`);
};

const operationsController = {
    t: inputTransactions,
    i: defineInterestRule,
    p: generateStatement
};

module.exports = operationsController;