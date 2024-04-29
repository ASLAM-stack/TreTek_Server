const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(express.json());
app.use(cors());

 
//mongodb connect
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.ksn35bk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const spotCollection = client.db("touristSpotDB").collection("touristSpot");
    // Add Tourist Spot
    app.post('/addTouristSpot',  async(req,res) =>{
      const spot = req.body;
      const result = await spotCollection.insertOne(spot);
      res.send(result);
    })
    // Get Tourist Spot
    app.get('/addTouristSpot',async(req,res) =>{
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/spot/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.findOne(query)
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('tour crud id running')
})

app.listen(port,() =>{
    console.log(`Server is Running ${port}`);
})