const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5001;


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://mazharulislam3569:W8c8AFI03MpoehfQ@cluster0.gqyrir3.mongodb.net/?retryWrites=true&w=majority`;

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

    const menuCollection = client.db('bistroDB').collection('menu')
    const cartCollection = client.db("bistroDB").collection("carts");

    app.get('/menu', async(req,res)=>{
        const result = await menuCollection.find().toArray()
        res.send(result)
    })


    // cart collection
    app.get('/carts',async(req,res)=>{
      const email = req.query.email
      const query = {email: email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })


    app.post('/carts', async(req, res) => {
      const cartItem = req.body;    
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });


    app.delete('/carts/:id', async(req,res)=>{
      const id = req.params.id
      const query = { _id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('boss is running')
})

app.listen(port,()=>{
    console.log(`bistro boss is setting on the port ${port}`);
})