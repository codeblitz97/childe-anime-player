const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const { sendSuccessResponse } = require('./helper');
const plyrRoutes = require('./routes/plyr.routes');

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

module.exports = app;
