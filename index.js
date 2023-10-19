const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require("cors")
const app = express();
const port = process.env.PORT || 5000;
// add middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrfwsc1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const brandCollections = client.db("scpElectronicsDB").collection("brands")
        const productCollections = client.db("scpElectronicsDB").collection("products")

        // getting brand apis
        app.get("/brnads", async (req, res) => {
            const cursor = brandCollections.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        // add Product
        app.post("/addProduct", async (req, res) => {
            const newProduct = req.body;
            const result = await productCollections.insertOne(newProduct)
            res.send(result)
        })

        // add brands working
        app.post("/addBrand", async (req, res) => {
            const newBrand = req.body;
            const result = await brandCollections.insertOne(newBrand)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);

app.listen(port, () => {
    console.log(`Server Listening from ${port}`)
})