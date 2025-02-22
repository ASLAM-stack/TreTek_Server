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
    // await client.connect();

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const spotCollection = client.db("touristSpotDB").collection("touristSpot");
    const countryCollection = client.db("touristSpotDB").collection("countryList");
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
    app.get('/countryList',async(req,res) =>{
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/spot/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.findOne(query)
      res.send(result)
    })

    app.get('/mylist/:email', async (req,res)=>{
       const email = req.params.email;
       const query = {user_email:email}
       const result = await spotCollection.find(query).toArray();
       res.send(result)
    })
    app.get('/country/:country_Name', async (req,res)=>{
       const country = req.params.country_Name;
       const query = {country_Name:country}
       const result = await spotCollection.find(query).toArray();
       res.send(result)
    })
    app.put('/update/:id', async (req,res) =>{
      const id = req.params.id;
      const info = req.body;
      const filter = {_id: new ObjectId(id)}
      const option = {upsert:true}
      const UpdatedInfo = {
        $set:{
          image:info.image,
          tourists_spot_name:info.tourists_spot_name,
          country_Name:info.country_Name,
          location:info.location,
          short_description:info.short_description,
          average_cost:info.average_cost,
          seasonality:info.seasonality,
          travel_time:info.travel_time,
          totalVisitors_PerYear:info.totalVisitors_PerYear,
          user_name:info.user_name,
          user_email:info.user_email
        }
      }
      const result =await spotCollection.updateOne(filter,UpdatedInfo,option);
      res.send(result)
    })
    app.delete('/spot/:id',async (req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
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