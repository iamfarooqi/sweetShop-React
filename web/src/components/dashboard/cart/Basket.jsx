import React, { useState } from 'react';
import '../Dashboard.css'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useGlobalState, useGlobalStateUpdate } from '../../../context/globalContext'
export default function Basket(props) {
  const globalStateUpdate = useGlobalStateUpdate()
  const { cartItems, onAdd, onRemove } = props;
  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
  const totalPrice = itemsPrice;
  const history = useHistory()

  function checkOut() {
    globalStateUpdate(prev => ({
      ...prev,
      cartData: { cartItems: cartItems, totalPrice: totalPrice }
    }))
    history.push('/checkoutform')
  }
  return (
    <aside className="container ">
      <div className="row justify-content-center">
        <div className='col-md-6 basket mt-5 mb-5'>
          <h2>Cart Items</h2>
          {cartItems.length === 0 && <div>Cart is empty</div>}
          {cartItems.map((item) => (
            <div key={item.id} className="row">
              <div className="col-md-4">{item.name}</div>
              <div className="col-md-4 text-center">
                <button onClick={() => onRemove(item)} className="remove">
                  -
              </button>
                <button onClick={() => onAdd(item)} className="add">
                  +
              </button>
              </div>

              <div className="col-md-4 text-right">
                {item.qty} Kg x PKR {item.price}
              </div>
            </div>
          ))}

          {cartItems.length !== 0 && (
            <>
              <hr></hr>
              <div className="row">
                <div className="col-6">
                  <strong>Total Price</strong>
                </div>
                <div className="col-6 text-right">
                  <strong>PKR: {totalPrice}</strong>
                </div>
              </div>
              <hr />
              <div className="row1">
                <button
                  className="btn btn-primary" onClick={checkOut}>
                  Checkout
              </button><br />
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}