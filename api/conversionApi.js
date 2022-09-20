const axios = require ('axios');
const { urls } = require ('../config');

const getConversionRates = async () => {
  const rawConversions = await axios.get(`${urls.currencyApiUrl}`);
    
  if(!rawConversions.data) throw new Error('invalid_data');

  const { data } = rawConversions;
  return data;
}

module.exports = {
    getConversionRates,
}