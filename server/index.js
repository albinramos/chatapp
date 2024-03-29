const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log(error);
});


const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${server.address().port}`);
});  