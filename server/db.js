let allEnvelopes = [
    {
        id: "1",
        category: "groceries",
        budget: 1000000,
    },

    {
        id: "2",
        category: "dining",
        budget: 1500000
    },

    {
        id: "3",
        category: "transportation",
        budget: 500000
    }
]

const isValidEnvelope = instance => {
    instance.id = instance.id || '';
    instance.category = instance.category || '';

    if (typeof instance.id !== 'string' || typeof instance.category !== 'string') {
        throw new Error(`Envelope's id and category must be strings.`);
    }

    if (!isNaN(parseFloat(instance.budget)) && isFinite(instance.budget)) {
        instance.budget = Number(instance.budget);
    } else {
        throw new Error(`Envelope's budget must be a number.`);
    }

    return true;
}

const findEnvelopeById = id => {
    return allEnvelopes.find(envelope => envelope.id === id) || null;
}

const addEnvelope = instance => {
    if (!isValidEnvelope(instance)) {
        return null;
    } else {
        const {id, category, budget} = instance;
        const newEnvelope = {id, category, budget};
        allEnvelopes.push(newEnvelope);
        return newEnvelope;
    }
}

module.exports = {
    isValidEnvelope,
    findEnvelopeById,
    addEnvelope
}