const express = require('express');
const app = express();

module.exports = app;

const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const apiRouter = require('./server/api.js');
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})