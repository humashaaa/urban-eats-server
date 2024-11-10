const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5001;

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wal4hcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersCollection = client.db("urbanEats").collection("users");
    const cartCollection = client.db("urbanEats").collection("cart");
    const menuCollection = client.db("urbanEats").collection("menu");
    const reviewCollection = client.db("urbanEats").collection("reviews");

    // user related api
    app.post(`/users`, async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // cart related api

    //TODO - user can not add to cart same menu twice
    app.post(`/carts`, async(req, res)=>{
      const cartItem = req.body
      const result = await cartCollection.insertOne(cartItem)
      res.send(result)
    })

    // get cart info by specific user
    app.get(`/cart/:email`, async(req, res)=>{
      const query = {email : req.params.email}
      const result = await cartCollection.findOne(query).toArray()
      res.send(result)
    })

    // menu related api

    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    // review related api
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
