const session = require('express-session');
const MongoStore = require("connect-mongo");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lisbon-nights-app";

  const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@cluster0.wvpow0g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

module.exports = app => {
    app.set('trust proxy', 1);
   
    app.use(
      session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 60000
        }, // ADDED code below !!!
        store: MongoStore.create({
          mongoUrl:MONGO_URI
   
          // ttl => time to live
          // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
        })
      })
    );
  };