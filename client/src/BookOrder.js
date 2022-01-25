import React, { Component } from 'react';
import './BookOrder.css';


class BookOrder extends Component {

    handleSubmit = (event) => {
        event.preventDefault();
    }

    render() {
        return(
        <div>
            <br/>
        <form class="form-style-4" action="/" method="post">
            <input type="text" name="type" required="true"
                placeholder="Type (Buy/Sell)"/>
            <input type="text" name="price" required="true" 
                placeholder="Price"/>

            <input type="text" name="quantity" required="true"
                placeholder="Quantity"/>
            <input type="text" name="user" required="true"
                placeholder="User"/>
            <br/>  
            <button type="submit" name="submit" onClick="handleSubmit()">
                Submit Trade
            </button>
        </form>
        </div>
        );
    }
}

export default BookOrder;
