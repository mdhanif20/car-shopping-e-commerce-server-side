const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const { query } = require("express");
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8f4kw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("carProducts");
        const products = database.collection("products");
        const allOrders = database.collection("orders");
        app.get("/products",async(req,res)=>{
            const product = products.find({});
            const result = await product.toArray();
            res.send(result);
        })
        // get single product 
        app.get("/products/:id", async(req,res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)}
          const order = await products.findOne(query); 
          res.send(order);
        })
        // orders post 
        app.post("/order",async(req,res)=>{
          const orders = req.body;
          console.log(orders);
          const result =  await allOrders.insertOne(orders);
          res.json(result);
        })
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Online car shopping!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})