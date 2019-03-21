require('./config/config');
const express = require('express');
const indexRouter = require('./routes');

const app = express();

app.use(express.json());

app.use('/api/v1', indexRouter);

app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('ERROR MESSAGE >>> ', err.message);
        console.log('ERROR STACK >>> ', err.stack);
        res.status(500).send(err.message);
    }
    next(err);
});

module.exports = app;
