const app = require('./app');

require('dotenv').config();

let PORT = process?.env?.PORT ?? 3002;

app.listen(PORT, () => {
  console.log(`Server is listening on`, PORT);
});
