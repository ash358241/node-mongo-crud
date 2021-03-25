const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = '';

const uri = "mongodb+srv://organicUser:9BX-n2yaGtnLLU3@cluster0.suylw.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const collection = client.db("organicdb").collection("products");

  app.get('/products', (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

app.post("/addProduct", (req, res) => {
    const product = req.body;
    // console.log(product);
    collection.insertOne(product)
    .then(result => {
        console.log("Product added successfully");
        res.redirect('/')
    })
});

app.patch('/update/:id', (req, res) => {
  console.log(req.body.price)
  collection.updateOne({_id: ObjectId(req.params.id)},
  {
    $set: {price: req.body.price, quantity: req.body.quantity}
  })
  .then(result => {
    res.send(result.modifiedCount > 0)
  })
})

app.delete('/delete/:id', (req, res) => {
  collection.deleteOne({ _id: ObjectId(req.params.id)})
  .then(result => {
    // console.log(result);
    res.send(result.deletedCount > 0)
  })
})
  
  // perform actions on the collection object
//   client.close();
});

app.listen(3000);

