const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB;
const client = new MongoClient(uri, { useNewUrlParser: true });

router.get('/', async (req, res) => {
    try {
        var pageHtml = `<!DOCTYPE html>
    <html>
    
    <head>
    <link type="text/css" href="/css/styles.css" rel="stylesheet">
        <meta charset="UTF-8">
        <title>Football Statistics App</title>
    </head>
    
    <body>
        <h1>Welcome to the Football Statistics App!</h1>
        <table> <tr> <th> name </th> <th> nationality </th> <th>club</th> <th>overallRating</th> </tr>`;

        await client.connect()
        const collection = client.db('fifa').collection('Player');
        const players = await collection.find({}).sort({ name: 1 }).toArray();

        players.forEach((element) => {
            pageHtml += "<tr>";
            pageHtml += "<td class='name'>"+element.name+"</td>";
            pageHtml += "<td class='nationality'>"+element.nationality+"</td>";
            pageHtml += "<td class='club'>"+element.club+"</td>";
            pageHtml += "<td class='overallRating'>"+element.overallRating+"</td>";
            pageHtml += " </tr>\n";
        });

        pageHtml += ` </table>   
    </body>
    </html>`;
        res.status(200).send(pageHtml);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
    finally { client.close(); }
});

module.exports = router;