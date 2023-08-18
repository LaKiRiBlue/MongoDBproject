const express = require('express');
const app = express();
const apiRouter = require('./api');
const homePage = require('./homePage');

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/test', async (req, res) => {
    try {
        res.status(200).send(`<h1>Welcome to the Football Statistics App!</h1>
        All test ok`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

app.use('/api', apiRouter);

app.use('/', homePage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started on port '+PORT));
