const GREETING_MSG = 'Welcome to AwesomeGIC Bank! What would you like to do?';
const FOLLOW_UP_MSG = 'Is there anything else you\'d like to do?';
const ENDING_MSG = `
Thank you for banking with AwesomeGIC Bank.
Have a nice day!`;
const ACTION_PROMPT = `
[T] Input transactions
[I] Define interest rules
[P] Print statement
[Q] Quit
> `;
const TRANSACTION_PROMPT = `
Please enter transaction details in <Date> <Account> <Type> <Amount> format
(or enter blank to go back to main menu):
> `;
const INTEREST_PROMPT = `
Please enter interest rules details in <Date> <RuleId> <Rate in %> format
(or enter blank to go back to main menu):
> `;
const STATEMENT_PROMPT = `
Please enter account and month to generate the statement <Account> <Year><Month>
(or enter blank to go back to main menu):
> `;

const promptMessage = {
    GREETING_MSG,
    FOLLOW_UP_MSG,
    ENDING_MSG,
    ACTION_PROMPT,
    TRANSACTION_PROMPT,
    INTEREST_PROMPT,
    STATEMENT_PROMPT
};

module.exports = promptMessage;