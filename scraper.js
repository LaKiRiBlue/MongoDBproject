const MongoClient = require("mongodb").MongoClient;

const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB;
const client = new MongoClient(uri, { useNewUrlParser: true });

async function scrap() {
  try {
    await client.connect();
    var collection = client.db('fifa').collection('Player');
    console.log('Connected to the database : ' + collection);

    const query = {};

    const result = await collection.deleteMany(query);

    console.log("Deleted " + result.deletedCount + " documents");

    const axios = require('axios');
    const cheerio = require('cheerio');

    axios.get('https://www.fifaindex.com/players/')
      .then(response => {
        const $ = cheerio.load(response.data);

        $('tbody > tr[data-playerid]').each(async (i, element) => {
          const name = $(element).find('td[data-title="Name"] > a').text();
          const nationality = $(element).find('td[data-title="Nationality"] > a').attr('title');
          const club = $(element).find('td[data-title="Team"] > a').attr('title');
          const overallRating = $(element).find('td[data-title="OVR / POT"] > span:nth-child(1)').text();

          console.log({ name, nationality, club, overallRating });
          await collection.insertOne({ name, nationality, club, overallRating });
        });

      })
      .catch(error => {
        console.log(error);
      });

  } catch (error) {
    console.log(error);
    return
  }
  finally {
 //   client.close();
  }
};


scrap();