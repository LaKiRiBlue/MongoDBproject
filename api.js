const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB;
const client = new MongoClient(uri, { useNewUrlParser: true });


router.get('/players', async (req, res) => {
	try {
		await client.connect()
		const collection = client.db('fifa').collection('Player');
		const players = await collection.find({}).sort({ name: 1 }).toArray();
		res.json(players);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server error');
	}
	finally{client.close();}
});

module.exports = router;
