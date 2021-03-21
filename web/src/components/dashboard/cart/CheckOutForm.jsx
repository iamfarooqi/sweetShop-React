import React, { useState } from 'react'
import axios from "axios"
import { useGlobalState, useGlobalStateUpdate } from '../../../context/globalContext'
import URL from '../../../baseUrl/BaseUrl'
export default function CheckoutFrom() {
    const globalState = useGlobalState()
    const [msg,setMsg] = useState('')
    globalState.cartData && globalState.cartData.cartItems.map(value => {
        delete value.image
        delete value.description
        delete value.stock
    })
    function placeOrder(e) {
        e.preventDefault()
        axios({
            method: 'post',
            url: URL+"/order",
            data: {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                total: globalState.cartData.totalPrice,
                orders: globalState.cartData.cartItems
            },
            withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                setMsg(response.data.message)
            }
            else {
                console.log(response.data.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 mt-5">
                        <form onSubmit={placeOrder}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputEmail4">Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Name" required />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputPassword4">Phone</label>
                                    <input type="text" className="form-control" id="phone" placeholder="Phone" required/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Address</label>
                                <input type="text" className="form-control" id="address" placeholder="1234 Main St" required/>
                            </div>
                            <button type="submit" className="btn btn-primary">Confirm Order</button>
                        </form>
                        {msg ? <div class="alert alert-success mt-3" role="alert">
                            {msg}
                        </div> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}