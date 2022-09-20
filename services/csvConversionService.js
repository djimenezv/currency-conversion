const { Parser } = require('json2csv');

const getCsvFileFromJson = data => {
    const fields = ['code', 'country', 'conversionAmount', 'path'];
    const opts = { fields };
    const parser = new Parser(opts);
    const fileContent = parser.parse(data);    
    return fileContent;
}

module.exports = {
    getCsvFileFromJson,
}

