const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3001;
const { Transform } = require('stream');

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })  

const processOrder = require("./processOrder.js");
const preProcessOrder = require("./preProcessOrder.js");

app.get('/api', (req, res) => {
  const stream = fs.createReadStream('./data/TW/order_1.txt');
  //const stream = fs.createReadStream('./data/TW/order_2.txt');
  //const stream = fs.createReadStream('./data/test2.txt');

  const splitLines = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, cb) {
      this.push(chunk.toString().trim().split('\n'));
      cb();
    }
  });

  const splitOrder = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(orders, encoding, cb) {
      let parsed = orders.map((order) => {
        console.log("order : ", order);

        let preProcessing = preProcessOrder.preProcessOrder(order); 
       
        let clob = processOrder.processOrder(preProcessing);
        console.log("clob.bidItems : ",clob.bids);
        console.log("clob.offerItems : ",clob.offers);
        console.log("clob.Trade : ",clob.trade);
        return clob;
      });
      
      this.push(JSON.stringify(parsed) + '\n');
      cb();
    }
  });

  stream
    .pipe(splitLines)
    .pipe(splitOrder)
    .pipe(res);
});

app.post('/postOrder', urlencodedParser,(req, res) => {
  console.log("req : ", req.body);

  
    
  const order = {
    type: req.body.type,
    price: parseFloat(req.body.price),
    quantity: parseInt(req.body.quantity),
    user: req.body.user
  }

  res.status(200).json(order);
  
  let data = '\n'+order.type+'\t'+order.price+'\t'+order.quantity+'\t'+order.user+'\t'+'TW'+'\t'+'Open'+'\t'+0+'\n';
  fs.appendFile('./data/TW/order_2.txt', data, (err) => { //JSON.stringify(order)
      
    if (err) throw err;

    /**Filewatcher watches for any changes in the file and triggers processOrder for that particular order */
    fs.watch("./data/TW/order_2.txt", (eventType, filename) => {
      //console.log("\nThe file", filename, "was modified!");
      //console.log("The type of change was:", eventType);
      let parsedData = preProcessOrder.preProcessOrder(data);
      console.log("parsedOrder in server.js", parsedData);
      processOrder.processOrder(parsedData);
      
    });  
  })

})

app.listen(port, () => console.log(`Listening on port ${port}...`));