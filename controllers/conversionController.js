const { conversionService, csvFileService } = require('../services');

const getConversions = async () => {
    const conversionData = await conversionService.getConversions();
    const fileContent = csvFileService.getCsvFileFromJson(conversionData);
    return fileContent;
}

module.exports =  {
    getConversions,
}