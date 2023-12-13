const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();
        const brandCollections = client.db("scpElectronicsDB").collection("brands");
        const productCollections = client.db("scpElectronicsDB").collection("products");
        const cartCollection = client.db("scpElectronicsDB").collection("myCart");
        const upCommingCategroyCollections = client.db("scpElectronicsDB").collection("upCommingCategroy");
        // get products
        //get data wich need to update
        app.get("/updateProduct/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollections.findOne(query);
            res.send(result)
        })
        app.get("/productDetail/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollections.findOne(query);
            res.send(result)
        })
        // getting brand apis
        app.get("/products/:brand", async (req, res) => {
            const brand = req.params.brand;
            const query = { brandName: brand }
            const product = productCollections.find(query);
            const result = await product.toArray();
            res.send(result)
        })
        // // get all product
        // app.get("/allProduct", async (req, res) => {
        //     const cursor = productCollections.find();
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })
        // get data from cart
        app.get(`/myCart/:email`, async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail }
            const cursor = cartCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })
        // getting total Carts Items;
        app.get(`/myCart-total/:email`, async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail }
            const cursor = cartCollection.find(query)
            const result = (await cursor.toArray());
            res.send(result)
        })


        // getting brand apis
        app.get("/brnads", async (req, res) => {
            const cursor = brandCollections.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // getting all upcommming category data
        app.get("/upcomming-category", async (req, res) => {
            const result = (await upCommingCategroyCollections.find().toArray()).reverse();
            res.send(result)
        })
        // post the upcomming category
        app.post("/upcommingCategory", async (req, res) => {
            const data = req.body;
            const result = await upCommingCategroyCollections.insertOne(data);
            res.send(result)
        })
        // add Product
        app.post("/addProduct", async (req, res) => {
            const newProduct = req.body;
            const result = await productCollections.insertOne(newProduct)
            res.send(result)
        })
        // add Product to cart
        app.post("/addtToCart", async (req, res) => {
            const newAddedProduct = req.body;
            const result = await cartCollection.insertOne(newAddedProduct)
            res.send(result)
        })
        // add brands working
        app.post("/addBrand", async (req, res) => {
            const newBrand = req.body;
            const result = await brandCollections.insertOne(newBrand)
            res.send(result)
        })

        // update Products
        app.put("/updateProduct/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const product = req.body;
            const updateProduct = {
                $set: {
                    productName: product.productName,
                    porductImg: product.porductImg,
                    brandName: product.brandName,
                    productType: product.productType,
                    desc: product.desc,
                    rate: product.rate,
                    price: product.price
                },
            };
            const result = await productCollections.updateOne(filter, updateProduct)
            res.send(result)
        })
        // delete data from cart
        app.delete("/deleteCart/:id", async (req, res) => {
            const deleteid = req.params.id;
            const query = { _id: new ObjectId(deleteid) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })
        // delete specific product
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollections.deleteOne(query)
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