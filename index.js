const express = require('express');

const app = express();
app.use(express.json());
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');

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

app.get('/', (req, res) => {
    res.send('<h2>hi there person!!!</h2>');
});

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));