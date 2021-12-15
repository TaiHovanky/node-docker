const express = require('express');
const cors = require('cors');
const redis = require('redis');
const session = require('express-session');
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_PORT,
  REDIS_URL,
  SESSION_SECRET
} = require('./config/config');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT
});

const app = express();
app.use(express.json());
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const mongoose = require('mongoose');
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('connected to DB'))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
}

connectWithRetry();

app.enable('trust proxy');
app.use(cors({}));
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 30000000
  }
}));

app.get('/', (req, res) => {
    res.send('<h2>hi there person!!!</h2>');
});

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));