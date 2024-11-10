const dotenv = require('dotenv')
const express = require('express');
const app = express();
const cors = require('cors')
const bodyparser = require("body-parser");
const path = require ('path')

const corsOrigin ={
  origin:'*', //or whatever port your frontend is using
  // origin:'http://localhost:3000', //or whatever port your frontend is using
  credentials:true,            
  optionSuccessStatus:200
}
app.use(cors(corsOrigin));

// app.use(cors())

dotenv.config()

const mongoose = require('mongoose');
const debug = require('debug')("app:main");
const config = require('config');

const router = require('./src/routes');

app.use(
  "/uploads",
  express.static(path.join(__dirname,"public" , "uploads"))
);

app.use(express.json());
app.use(express.urlencoded({extended: true }));
// app.use(bodyparser.json());
// app.use(express.static('public'));

mongoose
.connect(process.env.DATABASE_URL,{
  useNewUrlParser:true , useUnifiedTopology:true
})
// mongoose
// .connect(config.get('db.address'))
//  .then(() => debug("connected to mongodb"))
//   .catch(() => debug("could not connect"));

mongoose
  .connection.on("open", function(){
    console.log('conected to mongodb')
  })
  // .then(() => debug("connected to mongodb"))
  // .catch(() => debug("could not connect"));

app.use('/api/v1', router);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));
