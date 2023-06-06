const express = require('express');
const apiRouter = express.Router();

const envelopesRouter = require('./envelopes.js');

apiRouter.use(envelopesRouter);

module.exports = apiRouter;