const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3001;
const { Transform } = require('stream');

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })  

const processOrder = require("./processOrder.js");
const { isNullOrUndefined } = require('util');

app.get('/api', (req, res) => {
  //const stream = fs.createReadStream('./data/TW/order_1.txt');
  const stream = fs.createReadStream('./data/TW/order_2.txt');
  //const stream = fs.createReadStream('./data/TW/order_form.json');

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

        let t = order.split('\t');

        t[1] = parseInt(t[1]);
        t[2] = parseInt(t[2]);
        t[6] = parseInt(t[6]);

        let clob = processOrder.processOrder(t);
        //let clob = processOrder.processingOrder(t);
        console.log("clob.bidItems : ",clob.bids);
        console.log("clob.offerItems : ",clob.offers);
        console.log("clob.Trade : ",clob.trade);
        //return t;
        return clob;
      });
      //console.log("parsed : ", parsed);
      //console.log("orders : ", orders);
      this.push(JSON.stringify(parsed) + '\n');
      //this.push(JSON.stringify(processOrder.sendAllOrder) + '\n');
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
  

  //const obj = JSON.parse(order);
  let data = '\n'+order.type+'\t'+order.price+'\t'+order.quantity+'\t'+order.user+'\t'+'TW'+'\t'+'Open'+'\t'+0+'\n';
  fs.appendFile('./data/TW/order_2.txt', data, (err) => { //JSON.stringify(order)
      
    // In case of a error throw err.
    if (err) throw err;

    fs.watch("./data/TW/order_2.txt", (eventType, filename) => {
      console.log("\nThe file", filename, "was modified!");
      console.log("The type of change was:", eventType);
      let parsedData = data.toString().trim().replace("\n", "");
      parsedData = parsedData.split('\t');
      parsedData[1] = parseInt(parsedData[1]);
      parsedData[2] = parseInt(parsedData[2]);
      parsedData[6] = parseInt(parsedData[6]);
      processOrder.processOrder(parsedData);

    });  
  })


})


app.listen(port, () => console.log(`Listening on port ${port}...`));

