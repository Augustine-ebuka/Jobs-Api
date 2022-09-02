require('dotenv').config();
require('express-async-errors');

//extra security Packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const ratelimit = require('express-rate-limit');
const express = require('express');

const app = express();
const authenticateUser = require('./middleware/authentication');

//connect DB
const connectDB = require('./db/connect');
//routers
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// extra packages


app.set('trust proxy', 1);
app.use(
  ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  res.send('Hello job api thi was built by Augustine_dev')
})

app.use('/api/v1/jobs',authenticateUser,jobRouter)
app.use('/api/v1/auth',authRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
