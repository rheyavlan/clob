import React, { Component } from 'react';
import { getOrderBook } from './api/api';
import PriorityQueue from 'js-priority-queue';
import './App.css';

import {  Button } from 'antd';
import BookOrder from './BookOrder';
import { constants } from './constants/constants';

const clone = require('clone');
const initialState = {
  orderBook: [],
  //maxHeap = saves buy orders in decreasing order (Highest price on top)
  maxHeap: new PriorityQueue({comparator: (a, b) => b[1] - a[1]}),

  //minHeap = saves sell orders in increasing order (Lowest price on top)
  minHeap: new PriorityQueue({comparator: (a, b) => a[1] - b[1]}),

  bidItems: [],
  offerItems: [],
  current: [],
  marketPrice: ['None', null],
  switch: true,
  completedTrade: new PriorityQueue({comparator: (a, b) => b[1] - a[1]}),
  executedTrades: []
};
let takeOrder;

class App extends Component {
  static defaultProps = {
    getOrderBook,
  };

  state = {
    ...initialState
  };

  reset() {
    this.state.maxHeap.clear();
    this.state.minHeap.clear();
    this.state.completedTrade.clear();
    this.setState(initialState);
  }

  componentWillUnmount() {
    //The clearInterval() method clears a timer set with the setInterval() method
    clearInterval(takeOrder);
  }

  getAllOrders = async () => {
    this.reset();
    const data = await this.props.getOrderBook();
    if (data) {
      this.setState({
        orderBook: JSON.parse(data),
        switch: false,
      });
      takeOrder = setInterval(() => this.processOrder(), 1500);
    }
  };

  /*buttonPress = () => {
    //call this.processOrder(automated)
  }

  manualButtonPress = () => {
    /**get data from form
     Add that data to manualOrderBook 
     call this.processOrder (manual)*/
  //}


  /** In the first run the priority queue will be empty  */
  processOrder = () => {
    // order : Array [bid/offer type, price, amount, user]
    /**  shift : Removes the first element from an array and returns it. 
    If the array is empty, undefined is returned and the array is not modified.*/

    /*Pick up an order from the txt file*/
    let order = this.state.orderBook.shift(); 
    /*if(incomingOrderSource == 'automated') {
      let order = this.state.orderBook.shift(); 
    } else if(incomingOrderSource == 'manual') {
      let order = this.state.manualOrderBook.shift();
    }*/

    /**If the text file is empty */
    if (!order) {
      //order book is empty
      this.setState({switch: !this.state.switch});
      //The clearInterval() method clears a timer set with the setInterval() method
      clearInterval(takeOrder);
      return;
    }

    let orderCopy = order.slice();
    let mktPrice = ['None', null];
    let minHeap = this.state.minHeap;
    let maxHeap = this.state.maxHeap;
    let completedTrade = this.state.completedTrade;

    //If the incoming order from the input is a sell order
    if (order[0] === constants.SELL) {
      console.log("Order in sell ", order);

      //In case of sell order, refer maxHeap for buy orders with highest value 
      console.log("maxHeap.priv : ", maxHeap.priv);
      let highestBid = maxHeap.priv.data[0]; //peek
      console.log("highestbid info ", highestBid);

      /** highestBid - There should at least be one entry in maxHeap to compare 
       *  highestBid[1] >= order[1] - check if the order's price is lower than current highest bid (Selling price<Buying price)
       * order[2] > 0 - The order quantity should be greater than 0  
       * highestBid[3]!==order[3] - Ensures if the traders are not same
       * highestBid[4]===order[4] - Ensures that the trade is executed between same tickers
      */
      while (highestBid && highestBid[1] >= order[1] && order[2] > 0 && highestBid[3]!==order[3]) {

        //If true remove the buy entry from max heap to process it 
        highestBid = maxHeap.dequeue();

        //Trade executed was Bid trade with value taken from maxHeap 
        mktPrice = [highestBid[1], 'bid'];

        //Calculate the difference between the quantities 
        let diff = highestBid[2] - order[2];

        //quantity of buy is more .. 
        if (diff >= 0) { 
          order[6] = order[2];
          order[2] = 0;

          //If diff is +ve, that means that buy quantity is higher. Put the buy quantity back in queue
          if (diff) {
            maxHeap.queue([constants.BUY, highestBid[1], diff, highestBid[3], highestBid[4], constants.PARTIALLY_COMPLETED,
        diff]); 
            order[5] = constants.COMPLETED; 
            
            completedTrade.queue(order);
          }

          //If diff===0, the entire order amount is consumed, transaction is complete
          if (diff===0) {
            order[5] = constants.COMPLETED;
            highestBid[5] = constants.COMPLETED;
            order[6] = order[2];
            highestBid[6] = highestBid[2];
            completedTrade.queue(order);
            completedTrade.queue(highestBid);
            order[2] = 0;
          }
          //enqueue the remaining bid (unless 0 amount)
        } else { /**there is remaining order after transaction, compare with next highest bid. The order in maxHeap is processed
          so mark that complete*/
          highestBid[5] = constants.COMPLETED;
          highestBid[6] = highestBid[2];
          completedTrade.queue(highestBid);
          order[2] = -diff; // minus of minus makes it plus
          highestBid = maxHeap.priv.data[0]; //peek first before while loop
        }
      }
      //enqueue any (remaining) order to minHeap (Sell orders to minHeap)
      if (order[2]) minHeap.queue(order);
    } 
    else if (order[0] === constants.BUY) {
      let lowestOffer = minHeap.priv.data[0];

      /**Sell order should be less than current incoming Buy order 
       * lowestOffer[3]!==order[3] - Ensures if the traders are not same
       * lowestOffer[4]===order[4] - Ensures that the trade is executed between same tickers
      */
      while (lowestOffer && lowestOffer[1] <= order[1] && order[2] > 0 && lowestOffer[3]!==order[3]) {
        lowestOffer = minHeap.dequeue();
        mktPrice = [lowestOffer[1], 'offer'];
        let diff = lowestOffer[2] - order[2];
        if (diff >= 0) {
          order[6] = order[2];
          order[2] = 0;
          if (diff) {
            minHeap.queue([constants.SELL, lowestOffer[1], diff, lowestOffer[3], lowestOffer[4], constants.PARTIALLY_COMPLETED,
          diff]);
          order[5] = constants.COMPLETED;
          
          completedTrade.queue(order);
          }
          if (diff===0) {
            order[5] = constants.COMPLETED;
            lowestOffer[5] = constants.COMPLETED;
            lowestOffer[6] = lowestOffer[2];
            order[6] = order[2];
            completedTrade.queue(order);
            completedTrade.queue(lowestOffer);
            order[2] = 0;
          }
        } else {
          lowestOffer[5] = constants.COMPLETED;
          lowestOffer[6] = lowestOffer[2];
          completedTrade.queue(lowestOffer);
          order[2] = -diff; // minus of minus makes it plus
          lowestOffer = minHeap.priv.data[0];
        }
      }
      //Buy orders to maxHeap
      if (order[2]) maxHeap.queue(order);
    }

    this.setState({
      orderBook: this.state.orderBook,
      current: orderCopy,
      marketPrice: mktPrice,
      minHeap: minHeap,
      maxHeap: maxHeap,
      completedTrade: completedTrade,
      bidItems: this.getCurrentOrders(maxHeap, 'bid').bids,
      offerItems: this.getCurrentOrders(minHeap, 'offer').offers.reverse(),
      executedTrades: this.getCurrentOrders(completedTrade, 'trade').trade
    })
  };

  getCurrentOrders = (q, type) => {
    //retrieve current pending orders and insert in array in order
    let copy = clone(q);
    let orders = {
      bids: [],
      offers: [],
      trade: []
    };
    while (copy.priv.data.length) {
      let item = copy.dequeue();
      type === 'bid' ? orders.bids.push(item) : (type ==='offer' ? orders.offers.push(item) : orders.trade.push(item));
    }
    return orders;
  };

  render() {
    const {bidItems, offerItems, current, marketPrice, executedTrades} = this.state;

    console.log("Executed Trades", this.state.executedTrades);

    function getColor(type) {
      if (!type) return;
      return type === 'offer' ? 'blue' : 'red';
    }

    return (
      <div>
        <div className='App'>
          <br/>
          <Button 
            className='ob-button'
            onClick={() => this.getAllOrders()}
            disabled={!this.state.switch}
          >
            Process Trades 
          </Button>
          <br/>

          {!!current.length && 
            <div className='announcement'>
              <div className='current-order'>
                {`Current Incoming Order: ${(current[0] === constants.BUY) ? constants.BUY : constants.SELL} ${current[2]} 
                shares at ${current[1]} by ${current[3]}`}
              </div>
              <div className='notification'>
                Previous Market Price: &ensp;
                <span className={`${getColor(marketPrice[1])}`}>
                  {marketPrice[0]}
                </span>
              </div>
              Central Limit Order Book
            </div>
          }

          
          <table className='trade-table'>
            <tbody>
              <tr className='trade-title'>
                <th>Ticker</th>
                <th>Trader</th>
                <th>Quantity</th>
                <th>Ask/Sell Price</th> {/* from user's perspective this is Ask/Sell price */}
                <th>Bid/Buy Price</th> {/* from user's perspective this is Bid/Buy price */}
                <th>Quantity</th>
                <th>Status</th>
                <th>Filled Quantity</th>
              </tr>

              {offerItems.map((offer, i) => 
                <tr key={i} className='offer-table'>
                  <td >{offer[4]}</td>
                  <td >{offer[3]}</td>
                  <td className='detail'>{offer[2]}</td>
                  <td className='detail'>{offer[1]}</td>
                  <td></td>
                  <td></td>
                  <td>{offer[5]}</td>  
                  <td>{offer[6]}</td>     
                </tr>
              )}
              
              {bidItems.map((bid, i) => 
                <tr key={i} className='bid-table'>
                  <td >{bid[4]}</td>
                  <td >{bid[3]}</td>
                  <td></td>
                  <td></td>
                  <td className='detail'>{bid[1]}</td>
                  <td className='detail'>{bid[2]}</td>
                  <td>{bid[5]}</td>
                  <td>{bid[6]}</td>
                </tr>
              )}

            </tbody>
          </table>
          <br/>
          {/*<Upload>
            <Button icon={<UploadOutlined />}>Upload Trades</Button>
          </Upload>*/}
          <br/>
          

          <table className='trade-table'>
            <tbody>
              <tr lassName='trade-title'>
                <th>Ticker</th>
                <th>Trader</th>
                <th>Quantity</th>
                <th>Price</th> 
                <th>Status</th>
                <th>Filled Quantity</th>
              </tr>

              {executedTrades.map((trade,i) =>
                <tr key={i} className='comp-table'>
                  <td >{trade[4]}</td>
                  <td >{trade[3]}</td>
                  <td className='detail'>{trade[1]}</td>
                  <td className='detail'>{trade[2]}</td>
                  <td>{trade[5]}</td>
                  <td>{trade[6]}</td>
              </tr>
              )}

            </tbody>
          </table>
          <br/>
          {/*<Upload>
            <Button icon={<UploadOutlined />}>Upload Trades</Button>
          </Upload>*/}
          <br/>
          
          
        </div>
          <BookOrder/>
      </div>
    );
  }
}

export default App;
