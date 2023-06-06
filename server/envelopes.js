const envelopesRouter = require('express').Router();

module.exports = envelopesRouter;

const {
    isValidEnvelope,
    findEnvelopeById,
    addEnvelope,
    getAllEnvelopes
} = require('./db.js');

envelopesRouter.get('/', (req, res) => {
    res.send('Hello, World');
})

envelopesRouter.get('/envelopes', (req, res) => {
    res.send(getAllEnvelopes);
})

envelopesRouter.post('/envelopes', (req, res) => {
    // if (!isValidEnvelope(req.body)) {
    //     return res.status(400).send();
    // }

    // const {id, category, budget} = req.body;
    // const newEnvelope = {id, category, budget};

    // allEnvelopes.push(newEnvelope);

    // res.status(200).send(newEnvelope);
    if (!addEnvelope(req.body)) {
        return res.status(400).send();
    } else {
        res.status(200).send(addEnvelope(req.body));
    }
})

envelopesRouter.get('/envelopes/:id', (req, res) => {
    const envelope = findEnvelopeById(req.params.id);

    if (!envelope) {
        res.status(404).send();
    } else {
        res.send(envelope);
    }
})

envelopesRouter.put('/envelopes/:id', (req, res) => {
    if (!isValidEnvelope(req.body) || req.body.id !== req.params.id) {
        return res.status(400).send();
    } else {
        let updatedEnvelope = findEnvelopeById(req.params.id);
        const {id, category, budget} = req.body;
        updatedEnvelope = {id, category, budget};
        res.status(200).send(updatedEnvelope);
    }
})

envelopesRouter.post('/envelopes/:id', (req, res) => {
    let updatedEnvelope = findEnvelopeById(req.params.id);

    if (!updatedEnvelope) {
        res.status(404).send();
    } else if (isNaN(req.query.extract) || req.query.extract > updatedEnvelope.budget) {
        res.status(400).send();
    } else {
        updatedEnvelope.budget -= Number(req.query.extract);
        res.status(200).send(updatedEnvelope);
    }
})

envelopesRouter.delete('/envelopes/:id', (req, res) => {
    if (!findEnvelopeById(req.params.id)) {
        res.status(404).send();
    } else {
        allEnvelopes.splice(req.params.id, 1);
        res.status(204).send();
    }
})

envelopesRouter.post('/envelopes/transfer/:from/:to', (req, res) => {
    let sentEnvelope = findEnvelopeById(req.params.from);
    let receivedEnvelope = findEnvelopeById(req.params.to);

    if (!sentEnvelope || !receivedEnvelope) {
        res.status(404).send();
    } else if (isNaN(req.query.amount) || req.query.amount > sentEnvelope.budget) {
        res.status(400).send();
    } else {
        sentEnvelope.budget -= Number(req.query.amount);
        receivedEnvelope.budget += Number(req.query.amount);
        res.status(200).send();
    }
})