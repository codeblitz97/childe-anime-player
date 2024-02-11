const app = require('./app.js');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is listening on`, PORT);
});
