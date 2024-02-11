import chalk from 'chalk';
import app from './app.js';

let PORT = process?.env?.PORT ?? 3002;

app.listen(PORT, () => {
  console.log(chalk.greenBright('Success'), `Server is listening on`, PORT);
});
