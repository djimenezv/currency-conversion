/**
 * Creates a node greaph representation giving its currency code
 */
 const getNode = (currencyCode, currencyCountry) => ({
    code: currencyCode,
    country: currencyCountry,
    connections: [],
})

/**
 * return the key conversion path using this format CAD|TargetConversionCurrency
 */
const getCurrentPathKey = conversionPath => {
    const conversionPathTokens = conversionPath.split('|');

    return conversionPathTokens === 0 
                ? conversionPath
                : `${conversionPathTokens[0]}/${conversionPathTokens[conversionPathTokens.length - 1]}`;
}

const getConversionEntity = (country, code, path, conversionAmount) => ({
    code,
    country,
    conversionAmount,
    path,
})

const getFormattedConversions = rawConversionEntities => {
    let result = [];
    rawConversionEntities.forEach((value) => result.push(getConversionEntity(value.node.country, value.node.code, value.path, value.weight)));
    return result;
}

module.exports = {
    getNode,
    getCurrentPathKey,
    getConversionEntity,
    getFormattedConversions,
}

