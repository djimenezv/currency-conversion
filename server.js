const express = require('express');
const { conversionRoutes } = require('./routes');

const app = express();

app.use('/api/v1/conversions', conversionRoutes);

app.listen(1000, () => console.log('conversion server running'));