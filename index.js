const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
// const { query } = require("express");
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
        const allReviews = database.collection("reviews");
        // get products 
        app.get("/products",async(req,res)=>{
            const product = products.find({});
            const result = await product.toArray();
            res.send(result);
        })
        // get by email orders
        app.get("/order",async(req,res)=>{
          const email = req.query.email;
          const query = { email: email }
          const product = allOrders.find(query);
          const result = await product.toArray();
          res.json(result);
        }) 

        // get all orders
        app.get("/orders",async(req,res)=>{
          const product = allOrders.find({});
          const result = await product.toArray();
          res.send(result);
        })
        
        //get review
        app.get("/reviews",async(req,res)=>{
          const review = allReviews.find({});
          const result = await review.toArray();
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
          // console.log(orders);
          const result =  await allOrders.insertOne(orders);
          res.send(result);
        })
        // add new product 
        app.post("/product",async(req,res)=>{
          const product = req.body;
          // console.log(orders);
          const result =  await products.insertOne(product);
          res.send(result);
        })
        // add new reviews 
        app.post("/reviews",async(req,res)=>{
          const review = req.body;
          const result =  await allReviews.insertOne(review);
          res.send(result);
        })
        //delete an orders
        app.delete("/order/:id",async(req,res)=>{
          const id = req.params.id;
          const query =  {_id: ObjectId(id)};
          const result = await allOrders.deleteOne(query);
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