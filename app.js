import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { sendSuccessResponse } from './helper.js';
import plyrRoutes from './routes/plyr.routes.js';
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  sendSuccessResponse(res, 'Success');
});

app.use('/plyr', plyrRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message,
    hint: err.hint ?? null,
  });
});

export default app;
