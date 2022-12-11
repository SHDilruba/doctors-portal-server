const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9bzbqn1.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
     try{
          const appointmentOptionCollection = client.db('doctors-portal').collection('appointmentOption');
          app.get ('/appointmentOption', async(req, res) =>{
              const query = {};
              const options = await appointmentOptionCollection.find(query).toArray();
              res.send(options);
          })
     }
     finally{
         
     }
}
run().catch(console.log);


app.get ('/', (req, res) => {
  res.send(`server running on port: ${port}`)
});

app.listen(port, () =>{
  console.log(`server running on port: ${port}`)
})