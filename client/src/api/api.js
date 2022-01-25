const jQuery = require('jquery'); 

export const getOrderBook = () => {
  return jQuery.ajax({
    method: 'GET',
    url: '/api',
    success: (orderStr) => {
      return orderStr;
    },
    error: (err) => {
      console.log("Error in getOrders");
    }
  });
};

export const postOrderBook = () => {
  return jQuery.ajax({
    method: 'POST',
    url: '/',
    success: (data) => {
      return data;
    },
    error: (err) => {
      console.log("Error in postOrders");
    }
  });
};