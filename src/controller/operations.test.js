const operationsController = require('./operations');
const userPrompt = require('./../utils/functions/iostream');
const validations = require('./validations');

jest.mock('./../utils/functions/iostream');
jest.mock('./validations');

describe('Controller test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fail to enter transaction with invalid input format', async () => {
        userPrompt.mockResolvedValue('invalid input');
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid input format! Input has to be follow <Date> <Account> <Type> <Amount> format.\n');
    });

    it('fail to enter transaction with invalid date', async () => {
        userPrompt.mockResolvedValue('invalid AC001 D 100');
        validations.validateDateString.mockReturnValue('invalid date');
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).toHaveBeenCalledWith('invalid date');
    });

    it('fail to enter transaction with transaction type', async () => {
        userPrompt.mockResolvedValue('20230505 AC001 X 100');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue('invalid type');
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).toHaveBeenCalledWith('invalid type');
    });

    it('fail to enter transaction with invalid amount', async () => {
        userPrompt.mockResolvedValue('20230505 AC001 D -100');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue('invalid amount');
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).toHaveBeenCalledWith('invalid amount');
    });

    it('fail to create account with withdrawal as first transaction', async () => {
        userPrompt.mockResolvedValue('20230505 AC001 W 100');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid transaction! AC001 is a new account and the first transaction should be a deposit.\n');
    });

    it('successfully made first deposit transactions', async () => {
        userPrompt.mockResolvedValue('20230505 AC001 D 100');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('20230505-01'));
    });

    it('fail to add transactions that happen before the last transaction', async () => {
        userPrompt.mockResolvedValue('20230501 AC001 D 150');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid transaction! Transaction date must be later or equal to 20230505.\n');
    });

    it('successfully made second deposit transactions', async () => {
        userPrompt.mockResolvedValue('20230601 AC001 D 150');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('20230601-01'));
    });

    it('fail to make withdrawal more than account balance', async () => {
        userPrompt.mockResolvedValue('20230601 AC001 W 9999');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid transaction! Account AC001 does not have enough balance for withdrawal.\n');
    });

    it('successfully made withdrawal transactions', async () => {
        userPrompt.mockResolvedValue('20230626 AC001 W 20');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('20230626-01'));
    });

    it('successfully made same day withdrawal transactions', async () => {
        userPrompt.mockResolvedValue('20230626 AC001 W 100');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.t();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('20230626-02'));
    });

    it('fail to make more than 99 transaction in 1 day', async () => {
        userPrompt.mockResolvedValue('20230101 AC002 D 100');
        validations.validateDateString.mockReturnValue(null);
        validations.validateTransactionType.mockReturnValue(null);
        validations.validateAmount.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        for (let i=0; i<100; i++) {
            await operationsController.t();
        }
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid transaction! Daily transaction limit (99) has been reached for account AC002 on 20230101.\n');
    });

    it('fail to add interest rule with invalid input format', async () => {
        userPrompt.mockResolvedValue('invalid input');
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.i();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid input format! Input has to be follow <Date> <RuleId> <Rate in %> format.\n');
    });

    it('fail to add interest rule with invalid date', async () => {
        userPrompt.mockResolvedValue('invalid RULE01 1.95');
        validations.validateDateString.mockReturnValue('invalid date');
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.i();
        expect(consoleLogMock).toHaveBeenCalledWith('invalid date');
    });

    it('successfully added first interest rule', async () => {
        userPrompt.mockResolvedValue('20230101 RULE01 1.95');
        validations.validateDateString.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.i();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('20230101 | RULE01 |     1.95'));
    });

    it('fail to add existing interest rule with different rate', async () => {
        userPrompt.mockResolvedValue('20230520 RULE01 1.90');
        validations.validateDateString.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.i();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid ruleId! Rule RULE01 already exists with a rate of 1.95%.\n');
    });

    it('fail to add existing interest rule with different rate', async () => {
        userPrompt.mockResolvedValue('20230520 RULE02 190');
        validations.validateDateString.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.i();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid interest rate! Interest rate should be greater than 0 and less than 100.\n');
    });

    it('successfully added second interest rule', async () => {
        userPrompt.mockResolvedValue('20230520 RULE02 1.90');
        validations.validateDateString.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.i();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('20230520 | RULE02 |     1.90'));
    });

    it('successfully added third interest rule', async () => {
        userPrompt.mockResolvedValue('20230615 RULE01 1.95');
        validations.validateDateString.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.i();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('20230615 | RULE01 |     1.95'));
    });

    it('successfully updated third interest rule', async () => {
        userPrompt.mockResolvedValue('20230615 RULE03 2.20');
        validations.validateDateString.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.i();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('20230615 | RULE03 |     2.20'));
    });

    it('fail to generate statement with invalid input format', async () => {
        userPrompt.mockResolvedValue('invalid_input');
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.p();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid input format! Input has to be follow <Account> <Year><Month> format.\n');
    });

    it('fail to generate statement with invalid month', async () => {
        userPrompt.mockResolvedValue('AC001 invalid');
        validations.validateYearMonth.mockReturnValue('invalid month');
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.p();
        expect(consoleLogMock).toHaveBeenCalledWith('invalid month');
    });

    it('fail to generate statement with invalid account id', async () => {
        userPrompt.mockResolvedValue('AC000 202301');
        validations.validateYearMonth.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.p();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid account! Account AC000 does not exists.\n');
    });

    it('fail to generate statement for month before account was created', async () => {
        userPrompt.mockResolvedValue('AC001 202301');
        validations.validateYearMonth.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.p();
        expect(consoleLogMock).toHaveBeenCalledWith('Invalid month! Account AC001 was not created yet.\n');
    });

    it('successfully generated statement for month', async () => {
        userPrompt.mockResolvedValue('AC001 202306');
        validations.validateYearMonth.mockReturnValue(null);
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
        await operationsController.p();
        expect(consoleLogMock).not.toHaveBeenCalledWith(expect.stringContaining('Invalid'));
        expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('I    |   0.39 |  130.39'));
    });
});