const envelopesRouter = require('./envelopeRouter.js');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

