const envelopesRouter = require('express').Router();

module.exports = envelopesRouter;

const {
    isValidEnvelope,
    findEnvelopeById,
    addEnvelope,
    getAllEnvelopes,
    updateEnvelope,
    deleteEnvelope
} = require('./db.js');

envelopesRouter.get('/', (req, res) => {
    res.send('Hello, World');
})

envelopesRouter.get('/envelopes', (req, res) => {
    res.send(getAllEnvelopes());
})

envelopesRouter.post('/envelopes', (req, res) => {
    if (!addEnvelope(req.body)) {
        return res.status(400).send();
    } else {
        res.status(200).send(addEnvelope(req.body));
    }
})

envelopesRouter.put('/envelopes/:id', (req, res) => {
    if (!isValidEnvelope(req.body) || req.body.id !== req.params.id) {
        return res.status(400).send();
    } else {
        res.status(200).send(updateEnvelope(req.body));
    }
})

envelopesRouter.param('id', (req, res, next, id) => {
    const envelope = findEnvelopeById(id);

    if (envelope) {
        req.envelope = envelope;
        next();
    } else {
        res.status(404).send();
    }
})

envelopesRouter.get('/envelopes/:id', (req, res) => {
    res.send(req.envelope);
})

envelopesRouter.post('/envelopes/:id', (req, res) => {
    const extract = req.query.extract;

    if (isNaN(extract) | extract > req.envelope.budget) {
        res.status(400).send();
    } else {
        req.envelope.budget -= Number(extract);
        res.status(200).send(req.envelope);
    }
})

envelopesRouter.delete('/envelopes/:id', (req, res) => {
    if (!deleteEnvelope(req.params.id)) {
        res.status(404).send();
    } else {
        res.status(204).send();
    }
})

envelopesRouter.post('/envelopes/transfer/:from/:to', (req, res) => {
    let sentEnvelope = findEnvelopeById(req.params.from);
    let receivedEnvelope = findEnvelopeById(req.params.to);
    const amount = req.query.amount;

    if (!sentEnvelope || !receivedEnvelope) {
        res.status(404).send();
    } else if (isNaN(amount) || amount > sentEnvelope.budget) {
        res.status(400).send();
    } else {
        sentEnvelope.budget -= Number(amount);
        receivedEnvelope.budget += Number(amount);
        res.status(200).send();
    }
})