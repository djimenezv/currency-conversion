const express = require("express");
const { conversionController } = require('../controllers');

const routes = express.Router();

routes.get('/', async (req, res) => {
    try {
        const conversionFileContent = await conversionController.getConversions();
        res.attachment('conversions.csv');
        res.status(200).send(conversionFileContent);
    }
    catch (error) {
        console.log(error);
        
        if (error.message === 'invalid_data') {
            res.status(404).send('Cannot get currency data');
        } else {
            res.status(500).send('Internal error');
        }
    }
});

module.exports = routes;