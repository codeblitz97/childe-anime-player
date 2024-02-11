import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process?.env?.PORT ?? 3002;

app.listen(PORT, () => {
  console.log(`Server is listening on`, PORT);
});
