const { createInterface } = require('readline');

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});
const userPrompt = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => resolve(answer.trim()));
    });
};

module.exports = userPrompt;