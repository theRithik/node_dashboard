const express = require('express')
const app = express()
const port = process.env.PORT||4200
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
const url = "mongodb://127.0.0.1:27017/";
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const package  = require("../package.json")
let db;


app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())


app.get('/health',(req,res)=>{
    res.status(200).send('this is working')
})

app.get('/user',(req,res)=>{
    let query={}
    if(req.query.role&&req.query.city){
        query= {role:req.query.role ,city:req.query.city,isActive:true}
    }
    else if(req.query.role){
        query={role:req.query.role,isActive:true}
    }
    else if(req.query.city){
        query={city:req.query.city,isActive:true}
    }
    else if(req.query.isActive){
        let isActive = req.query.isActive
        if(isActive=='false'){
            isActive= false
        }
        else{
            isActive=true
        }
    }
    
    db.collection('test').find(query).toArray((err,result)=>{
        if(err) throw err;
        else{
            res.status(200).send(result)
        }
    })
})

//hard delete
app.delete('/delete',(req,res)=>{
    db.collection('test').remove({_id:req.body._id},(err,result)=>{
        if(err) throw err;
        else{
            res.send('data deleted successful')
        }
    })
})

//soft delete//deactive user
app.put('deactivate',(req,res)=>{
    db.collection('test').update({_id:id},{$set:{isActive:false}},(err,result)=>{
    if(err) throw err;
    else{
        res.send('user deactivated successfully')
    }
    })
})



//soft delete//active user
app.put('deactivate',(req,res)=>{
    db.collection('test').update({_id:id},{$set:{isActive:true}},(err,result)=>{
    if(err) throw err;
    else{
        res.send('user deactivated successfully')
    }
    })
})


// MongoClient.connect(url,(err,res)=>{
//     if(err) console.log('db err', err)
//     db = client.db('test')
    app.listen(port,()=>{
        console.log(`${port}`)
    })
// })