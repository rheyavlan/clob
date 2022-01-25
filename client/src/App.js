import React, { Component } from 'react';
import { getOrderBook } from './api/api';
import PriorityQueue from 'js-priority-queue';
import './App.css';

import {  Button } from 'antd';
import BookOrder from './BookOrder';
import { constants } from './constants/constants';

const initialState = {
  orderBook: [],
  bidItems: [],
  offerItems: [],
  current: [],
  marketPrice: ['None', null],
  switch: true,
  completedTrade: [],
  
};

class App extends Component {
  static defaultProps = {
    getOrderBook,
  };

  state = {
    ...initialState
  };

  reset() {
   
    this.setState(initialState);
  }

  componentWillUnmount() {
    
  }

  getAllOrders = async () => {
    this.reset();
    const data = await this.props.getOrderBook();
    if (data) {
      console.log("data receieved in React :", JSON.parse(data));
      
      this.setState({
        orderBook: JSON.parse(data),
        switch: false,
        bidItems: JSON.parse(data),
        offerItems:JSON.parse(data),
        completedTrade: JSON.parse(data)
      });
  }
  };

  render() {
    const {bidItems, offerItems, completedTrade} = this.state;

    console.log("Bid Trades", bidItems);
    console.log("Offer Trades", offerItems);

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

          <div class="container"> 
            <div class="box"> 
              <div class="box-row"> 
                  <div class="box-cell box1"> 
                    {offerItems.map((offer, i) =>
                      <div className='minHeap'>
                        <p>Min Heap values in Iteration : {i} </p>
                        <br/>
                        <p >{offer.offers[0]}</p>
                        <p >{offer.offers[1]}</p>
                        <p >{offer.offers[2]}</p>
                        <p >{offer.offers[3]}</p>
                        <p >{offer.offers[4]}</p>
                        <p>{offer.offers[5]}</p>  
                        <p>{offer.offers[6]}</p>   
                      </div>      
                    )}
                 </div> 
                <div class="box-cell box2"> 
                  {bidItems.map((bid, i) => 
                    <div className='maxHeap'>
                      <p>Max Heap values in Iteration : {i} </p>
                      <br/>
                      <p >{bid.bids[0]}</p>
                      <p >{bid.bids[1]}</p>
                      <p >{bid.bids[2]}</p>
                      <p >{bid.bids[3]}</p>
                      <p >{bid.bids[4]}</p>
                      <p>{bid.bids[5]}</p>
                      <p>{bid.bids[6]}</p>
                    </div>
                )}
                </div> 

                <div class="box-cell box3"> 
                  {completedTrade.map((trade, i) => 
                    <div className='trade'>
                      <p>Trade execution Iteration : {i} </p>
                      <br/>
                      <p >{trade.trade[0]}</p>
                      <p >{trade.trade[1]}</p>
                      <p >{trade.trade[2]}</p>
                      <p >{trade.trade[3]}</p>
                      <p >{trade.trade[4]}</p>
                      <p>{trade.trade[5]}</p>
                      <p>{trade.trade[6]}</p>
                    </div>
                  )}
                </div> 
              </div> 
            </div> 
          </div> 
        </div>
          <BookOrder/>
      </div>
    );
  }
}

export default App;