const app = require('./app');

let PORT = process?.env?.PORT ?? 3002;

app.listen(PORT, () => {
  console.log(`Server is listening on`, PORT);
});
