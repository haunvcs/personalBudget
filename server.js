const express = require('express');
const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let envelopes = [];

const findEnvelopeById = id => {
    return envelopes.find(envelope => envelope.id === id) || null;
}

let validator = 
[
    body('id').notEmpty().isString(),
    body('category').notEmpty().isString(),
    body('budget').notEmpty().isNumeric()
];

app.get('/', (req, res) => {
    res.send('Hello, World');
})

app.post('/envelopes', validator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors);
    }

    const {id, category, budget} = req.body;
    const newEnvelope = {
        id, 
        category, 
        budget
    };

    envelopes.push(newEnvelope);

    res.status(201).send(newEnvelope);
})

app.get('/envelopes', (req, res) => {
    res.status(200).send(envelopes);
})

app.get('/envelopes/:id', (req, res) => {
    const envelope = findEnvelopeById(req.params.id);

    if (!envelope) {
        res.status(404).send();
    } else {
        res.send(envelope);
    }
})

app.put('/envelopes/:id', validator, (req, res) => {
    if (req.body.id !== req.params.id) {
        res.status(400).send();
    } else {
        let updatedEnvelope = findEnvelopeById(req.params.id);
        const {id, category, budget} = req.body;
        updatedEnvelope = {id, category, budget};
        res.status(200).send(updatedEnvelope);
    }
})

app.post('/envelopes/:id', (req, res) => {
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

app.delete('/envelopes/:id', (req, res) => {
    if (!findEnvelopeById(req.params.id)) {
        res.status(404).send();
    } else {
        envelopes.splice(req.params.id, 1);
        res.status(204).send();
    }
})

app.post('/envelopes/transfer/:from/:to', (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

