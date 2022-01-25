const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3001;
const { Transform } = require('stream');

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false })  


app.get('/api', (req, res) => {
  //const stream = fs.createReadStream('./data/TW/order_1.txt');
  const stream = fs.createReadStream('./data/TW/order_1.txt');

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
        return t;
      });
      console.log("parsed : ", parsed);
      console.log("orders : ", orders);
      this.push(JSON.stringify(parsed) + '\n');
      cb();
    }
  });

  stream
    .pipe(splitLines)
    .pipe(splitOrder)
    .pipe(res);
});

app.post('/', urlencodedParser,(req, res) => {
  console.log("req : ", req.body);
  //res.send("POST Request Called", req.query.user);
  const order = {
    type: req.body.type,
    price: parseFloat(req.body.price),
    quantity: parseInt(req.body.quantity),
    user: req.body.user
  }

  //res.status(200).send((req.query.user).toString());
  res.status(200).json(order);

  //const obj = JSON.parse(order);
  const values = Object.keys(order).map(function (key) { return order[key]; });
  fs.writeFile('./data/TW/order_form.json', JSON.stringify(order), (err) => {
    
      
    // In case of a error throw err.
    if (err) throw err;
  })


})


app.listen(port, () => console.log(`Listening on port ${port}...`));

