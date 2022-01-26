let server = require('../server');
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe('Task APIs', () => {

    //get orders 
    describe("Test GET route /api", () => {
        it("It should return all orders", (done) => {
            chai.request("http://localhost:3001")
            .get("/api")
            .end((err, response) => {
                response.should.have.status(200);
                
            done();    
            });
        });
    });

    //need bodyparser: issue with mocha
    describe.skip('Test POST route', () => {
        it('Tt should POST the order in order.txt file present in data folder', (done) => {
            let order = {
                "type": "Buy",
                "price": "10",
                "quantity": "10",
                "user": "testUser"
            }
          chai.request("http://localhost:3001")
              .post('/postOrder')
              .send(order)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');                    
                done();
              });
        });
  
    });
  
});