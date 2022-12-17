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
           const bookingsCollection = client.db('doctors-portal').collection('bookings');

          app.get ('/appointmentOptions', async(req, res) =>{
            const date = req.query.date;
              const query = {};
              const options = await appointmentOptionCollection.find(query).toArray();

              const bookingQuery = {appointmentDate: date}
              const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();
              options.forEach(option => {
                   const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
                   const bookedSlots = optionBooked.map(book => book.slot)
                   const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot));
                   option.slots =  remainingSlots;
              })
              res.send(options);
          });
    
          app.get('/bookings', async(req, res) =>{
                const email = req.query.email;
                console.log(email);
                const query = {email: email};
                const bookings = await bookingsCollection.find(query).toArray();
                res.send(bookings);
          })

          app.post('/bookings', async(req, res) =>{
              const booking = req.body
              console.log(booking);
               const query = {
                   appointmentDate: booking.appointmentDate,
                   email: booking.email,
                   treatment: booking.treatment
               }

               const alreadyBooked = await bookingsCollection.find(query).toArray();

               if(alreadyBooked.length){
                const message = `You already have a booking on ${booking.appointmentDate}`
                return res.send({acknowledged: false, message})  
               }

              const result = await bookingsCollection.insertOne(booking);
              res.send(result);
          });

          app.post('/users', async(req, res) =>{
              const user = req.body;
              const result = await usersCollection.insertOne(user);
              res.send(result);
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