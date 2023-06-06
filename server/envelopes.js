const envelopesRouter = require('express').Router();

module.exports = envelopesRouter;

const {
    isValidEnvelope,
    findEnvelopeById,
    addEnvelope,
    getAllEnvelopes,
    updateEnvelope
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
        // const updatedEnvelope = updateEnvelope(req.body);
        // res.status(200).send(updatedEnvelope);
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
    // const envelope = findEnvelopeById(req.params.id);

    // if (!envelope) {
    //     res.status(404).send();
    // } else {
    //     res.send(envelope);
    // }
    res.send(req.envelope);
})

envelopesRouter.post('/envelopes/:id', (req, res) => {
    // let updatedEnvelope = findEnvelopeById(req.params.id);
    const extract = req.query.extract;

    // if (!updatedEnvelope) {
    //     res.status(404).send();
    // } else if (isNaN(extract) || extract > updatedEnvelope.budget) {
    //     res.status(400).send();
    // } else {
    //     updatedEnvelope.budget -= Number(extract);
    //     res.status(200).send(updatedEnvelope);
    // }
    if (isNaN(extract) | extract > req.envelope.budget) {
        res.status(400).send();
    } else {
        req.envelope.budget -= Number(extract);
        res.status(200).send(req.envelope);
    }
})

envelopesRouter.delete('/envelopes/:id', (req, res) => {
    // if (!findEnvelopeById(req.params.id)) {
    //     res.status(404).send();
    // } else {
    //     getAllEnvelopes().splice(req.params.id, 1);
    //     res.status(204).send();
    // }
    const deletedIndex = allEnvelopes.findIndex((element) => {
        return element.id === req.params.id;
    });
    getAllEnvelopes().splice(deletedIndex, 1);
    res.status(204).send();
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