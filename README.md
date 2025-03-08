# CLI Banking System
This is a simple banking system that runs in the command line without a database. It is designed to solve the problem stated in `ProblemStatement.md`.

## Running the service
### Prequisite
```
Node.js         v20.12.2
```
First install the required packages with the following command.
```
npm install
```
Once the package has been installed, the service can be launch with the following command.
```
npm start
```
To run the unit test coverage, run the following command.
```
npm run test:coverage
```

## Assumptions
- Data does not persist after quiting the program.
- Transactions input for an account must be in cronological order. The user is not allowed to enter a transaction that is before the last transaction.
- There is a limit of 99 transactions per account per day. When the 100th transaction is entered, it will not be allowed.
- Each interest ruleId cannot have more than 1 interest rate.