const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const scraperRoutes = require('./routes/scraperRoutes');
require('./scheduler')
require('dotenv').config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/api', productRoutes);
app.use('/api/scraper', scraperRoutes);

mongoose
    .connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error(err));

console.log('MONGO_URI:', MONGO_URI);
app.listen(PORT, () => console.log('Server running on port ${PORT}'));


