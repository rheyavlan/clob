const PriorityQueue = require('js-priority-queue');
const { constants } = require('./client/src/constants/constants.js');

const clone = require('clone');

//maxHeap = saves buy orders in decreasing order (Highest price on top)
var maximumHeap =  new PriorityQueue({comparator: (a, b) => b[1] - a[1]});
//console.log("maximumHeap" , maximumHeap);
//minHeap = saves sell orders in increasing order (Lowest price on top)
var minimumHeap = new PriorityQueue({comparator: (a, b) => a[1] - b[1]});
//console.log("minimumHeap" , minimumHeap);

var completeTrade = new PriorityQueue({comparator: (a, b) => b[1] - a[1]});

var bidItems = [];
var offerItems = [];
var current = [];
var executedTrades = [];

module.exports = {

    processOrder: function(order) {
        console.log("getOrderBook ", order);
        
        const orderCopy = order.slice();
        var mktPrice = ['None', null];
        var minHeap = minimumHeap;
        var maxHeap = maximumHeap;
        var completedTrade = completeTrade;

        
        if(order[0] === constants.SELL) {
          //console.log("SELL ORDER");
          var highestBid = maxHeap.priv.data[0];
          //console.log("highestbid info ", highestBid);

          /**Compare the price of incoming order and the order present in maxHeap. 
           * Then compare the quanitities 
           * Then compare the trader 
           */
          while (highestBid && highestBid[1] >= order[1] && order[2] > 0 && highestBid[3]!==order[3]) {
            //console.log("INSIDE WHILE");
            highestBid = maxHeap.dequeue();
            mktPrice = [highestBid[1], 'bid'];

            /**Calculate the difference between the quantities and accordingly mark the trade as partially complete/complete
             * both complete = when quantities are same
             * buy partially complete and sell complete = when sell quantity is less
             * sell partially complete and buy complete = when buy quanity is less
             */ 
            const diff = highestBid[2] - order[2];
            if (diff >= 0) { 
              order[6] = order[2];
              order[2] = 0;
    
              if (diff) {
                maxHeap.queue([constants.BUY, highestBid[1], diff, highestBid[3], highestBid[4], constants.PARTIALLY_COMPLETED,
            diff]); 
            //console.log("maxHeap after queue operation :", maxHeap);
                order[5] = constants.COMPLETED; 
                
                completedTrade.queue(order);
              }
    
              if (diff===0) {
                order[5] = constants.COMPLETED;
                highestBid[5] = constants.COMPLETED;
                order[6] = order[2];
                highestBid[6] = highestBid[2];
                completedTrade.queue(order);
                completedTrade.queue(highestBid);
                order[2] = 0;
              }
            } else { 
              highestBid[5] = constants.COMPLETED;
              highestBid[6] = highestBid[2];
              completedTrade.queue(highestBid);
              order[2] = -diff; 
              highestBid = maxHeap.priv.data[0]; 
            }
          }
          if (order[2]) minHeap.queue(order);
          //console.log("minHeap after adding the order", minHeap);
        } 
        else if (order[0] === constants.BUY) {
          let lowestOffer = minHeap.priv.data[0];

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
              order[2] = -diff; 
              lowestOffer = minHeap.priv.data[0];
            }
          }
          if (order[2]) maxHeap.queue(order);
          }
       

      current =  orderCopy,
      marketPrice = mktPrice,
      minimumHeap = minHeap,
      maximumHeap = maxHeap,
      completedTrade = completedTrade,
      bidItems = getCurrentOrders(maxHeap, 'bid').bids,
      offerItems = getCurrentOrders(minHeap, 'offer').offers.reverse(),
      executedTrades = getCurrentOrders(completedTrade, 'trade').trade

      console.log("bidItems : ", bidItems);
      console.log("offerItems : ", offerItems);
      console.log("executedTrades : ", executedTrades);

      let orders = {
        bids: bidItems,
        offers: offerItems,
        trade: executedTrades
      };
      //return [bidItems, offerItems, executedTrades];
      return orders
      
      },
    
  }

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
  