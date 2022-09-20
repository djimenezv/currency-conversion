const { conversionApi } = require('../api');
const { currencyEntityHelpers } = require('../helpers');
const { constants } = require('../config');

/**
 * Creates a graph representation of the currency conversions like graphic below
 * 
 *        [CAD]
 *       /  |  \
 *  [EUR] [HKD] [USD]
 *             /  |  \
 *         [BR] [JPY] [MXN]
 * 
 * @param {list of raw conversion items} rawConversions 
 * @returns the root node of directed weihgt graph representing conversions currency connections
 */
const rawConversionsToGraph = rawConversions => {
    const nodesStore = new Map();

    rawConversions.forEach(current => {

        let currentParent = nodesStore.get(current.fromCurrencyCode);
        let currentChild = nodesStore.get(current.toCurrencyCode);

        if(!currentParent) {
            nodesStore.set(current.fromCurrencyCode, currencyEntityHelpers.getNode(current.fromCurrencyCode, current.fromCurrencyName));
            currentParent = nodesStore.get(current.fromCurrencyCode);
        }

        if(!currentChild) {
            nodesStore.set(current.toCurrencyCode, currencyEntityHelpers.getNode(current.toCurrencyCode, current.toCurrencyName));
            currentChild = nodesStore.get(current.toCurrencyCode);
        }
        
        currentParent.connections.push({
            ...currentChild,
            rate: current.exchangeRate,
        });
    });

    return nodesStore.get(constants.SOURCE_CONVERSION_ID);

}

/**
 * 
 * @param {initial node of the graph 'CAD'} rootCurrencyNode 
 * @returns a formated list with the best currency conversion options for customers.
 * The process to find the conversion rates follow is described below
 * 
 * 1. A connected/weight graph is created based on countries connection rates
 * 2. The graph is traversed using a Breath Search First aproach to calculate the conversion amount between CAD currency node and other nodes
 * 3. Each time a node is visited the currency calculation is done an acumulated in the queue used to travers de graph so next node can used it
 * 4. Each time a conversion calculation is done its result is saved in a Map that contains a key equals to source currency | target currency
 *    like this (CAD|BR) and the value saved in the map is the calculated rate amount so the next time same source|target calculation shows up the existing value
 *    in the Map is compare with the new calculated conversion.
 * 5. If the new calculated conversion amount is bigger than existing amount in the Map the calculated amount for the Source|Target conversion
 *    in the map is replaced.
 * 6. Finally the results are formated to be returned.
 */
const processingGraph = rootCurrencyNode => {

    const queue = [];
    const store = new Map();

    queue.push({
        path: rootCurrencyNode.code,
        node: rootCurrencyNode,
        currentConversionAmount: constants.SAMPLE_CONVERSION_AMOUNT,
    });

    while(queue.length > 0) {
        const currentNode = queue.shift();
        const currentConversionPathKey = currencyEntityHelpers.getCurrentPathKey(currentNode.path);
        const conversionInfo = store.get(currentConversionPathKey);
        
        if(!conversionInfo || conversionInfo.weight < currentNode.currentConversionAmount) {
            store.set(currentConversionPathKey, {
                path: currentNode.path,
                weight: currentNode.currentConversionAmount,
                node: currentNode.node,
            });
        } 

        for(i=0; i<currentNode.node.connections.length; i++) {
            queue.push({
             path: `${currentNode.path}|${currentNode.node.connections[i].code}`,
             node: currentNode.node.connections[i],
             currentConversionAmount: currentNode.currentConversionAmount * currentNode.node.connections[i].rate,
            });
        }
    }
    
    return currencyEntityHelpers.getFormattedConversions(store);
}

const getConversions = async() => {
    const rawConversions = await conversionApi.getConversionRates();
    const conversionGraph = rawConversionsToGraph(rawConversions);
    const getCurrencyConversions = processingGraph(conversionGraph);
    return getCurrencyConversions;
}

module.exports = {
    getConversions,
}
