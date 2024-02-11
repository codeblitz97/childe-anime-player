const chalk = require('chalk');
const app = require('./app');

let PORT = process?.env?.PORT ?? 3002;

app.listen(PORT, () => {
  console.log(chalk.greenBright('Success'), `Server is listening on`, PORT);
});
