import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BaseUrl from '../../baseUrl/BaseUrl'
function MyOrders() {
    const [myOrder, setMyOrders] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: BaseUrl + '/myOrders',
            withCredentials: true
        }).then((response) => {
            setMyOrders(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div>
            <div className="container">
                <h1 className='text-center'>My Orders</h1>
                <div className='row justify-content-center'>
                    {
                        myOrder.map((v, i) => {
                            return (
                                <div className='col-md-6 mr-2 mt-4 py-3 px-3' style={{boxShadow: "0 0 10px grey"}}>
                                    {
                                        v.orders.map((v, i) => {
                                            return (
                                                <div>
                                                    <div className='row '>
                                                        <div className='col-md-4'>{v.name}</div>
                                                        <div className='col-md-4 text-center'>{v.price} PKR</div>
                                                        <div className='col-md-4 text-right'>{v.qty} Kg</div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <hr/>
                                    <div>
                                        <span>Total Amount:</span>
                                        <span className='float-right'>{v.total} PKR</span>
                                    </div>
                                    <div>
                                        <span>Status:</span>
                                        <span className='float-right'>{v.status}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default MyOrders;