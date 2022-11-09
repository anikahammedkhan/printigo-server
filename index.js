const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middle wares : 
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.32rvdcq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// crud oparation : 
async function run() {
    try {
        const serviceCollection = client.db('printigo').collection('services');
        const reviewCollection = client.db('printigo').collection('reviews');

        // get all services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({}).sort({ date: -1 });
            const services = await cursor.toArray();
            res.send(services);
        })

        // get only 3 services for home page
        app.get('/services/limit', async (req, res) => {
            const cursor = serviceCollection.find({}).sort({ date: -1 }).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })

        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // add service
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        // add review 
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // get all reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({}).sort({ date: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        })


        // get review by serviceId
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };
            const cursor = reviewCollection.find(query).sort({ date: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
    }
    catch {
        console.log(error);
    }
    finally {

    }
}
run().catch(error => console.error(error));



app.get('/', (req, res) => {
    res.send('Welcome to Printigo Web Server')
})

// invalid url send 404
app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
})

app.listen(port, () => {
    console.log(`Printigo Web Server running on ${port}`);
})