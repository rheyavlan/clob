let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

let processOrder = require('../processOrder');
let preProcessOrder = require('../preProcessOrder');

describe('Task Business logic', () => {

    //get orders 
    describe("Test function call processOrder which processes a given order", () => {
        it("Buy: It should return processed order", (done) => {
            let order = {
                "type": "Buy",
                "price": "10",
                "quantity": "10",
                "user": "testUser"
            }
            let parsedData = order.type+'\t'+order.price+'\t'+order.quantity+'\t'+order.user+'\t'+'TW'+'\t'+'Open'+'\t'+0;
            parsedData = preProcessOrder.preProcessOrder(parsedData);
            processOrder.processOrder(parsedData);
        });

        it("Sell: It should return processed order", (done) => {
            let order = {
                "type": "Sell",
                "price": "10",
                "quantity": "10",
                "user": "testUser1"
            }
            let parsedData = order.type+'\t'+order.price+'\t'+order.quantity+'\t'+order.user+'\t'+'TW'+'\t'+'Open'+'\t'+0;
            parsedData = preProcessOrder.preProcessOrder(parsedData);
            processOrder.processOrder(parsedData);
        });
    });    
  
});
