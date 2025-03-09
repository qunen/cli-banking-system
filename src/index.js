const userPrompt = require('./utils/functions/iostream.js');
const promptMessage = require('./constant/prompts.js');
const operationsController = require('./controller/operations.js');

const main = async () => {
    let option = '';
    option = await userPrompt(promptMessage.GREETING_MSG + promptMessage.ACTION_PROMPT);
    option = option.toLowerCase();
    while (option !== 'q') {
        if (operationsController[option]) await operationsController[option]();
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