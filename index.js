const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(express.json())
app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174" ],
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
    }
  });
  
  async function run() {
    try {
        const userCollection = client.db('urbanEats').collection('users')
        const menuCollection = client.db('urbanEats').collection('menu')
        const reviewCollection = client.db('urbanEats').collection('reviews')


        app.get('/menu', async(req, res)=>{
            const result = await menuCollection.find().toArray() 
            res.send(result)
        })
     
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
  











app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });