module.exports = {

    preProcessOrder: function(order) {
    //console.log("parsedOrder in preProcessOrder -----------", order);
    
      let parsedData = order.toString().trim().replace("\n", "");
      parsedData = parsedData.split('\t');
      parsedData[1] = parseFloat(parsedData[1]);
      parsedData[2] = parseInt(parsedData[2]);
      parsedData[6] = parseInt(parsedData[6]);
      //console.log("parsedOrder in preProcessOrder", parsedData);
      return parsedData;
    }
}