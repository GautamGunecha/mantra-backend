require('dotenv').config()
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectToMongoDB = require('./configs/mongoose');

const app = express();

app.use(cors());
app.use(helmet());

connectToMongoDB();

app.use('/api', require('./routes'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server running on port: ${port}`));
