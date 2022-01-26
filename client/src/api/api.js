const jQuery = require('jquery'); 

export const getOrderBook = () => {
  return jQuery.ajax({
    method: 'GET',
    url: '/api',
    success: (orderStr) => {
      console.log("orderStr in jQuery", orderStr);
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
    url: '/postOrder',
    success: (data) => {
      console.log("data in POST :", data);
      return data;
    },
    error: (err) => {
      console.log("Error in postOrders");
    }
  });
};