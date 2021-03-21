import React, { useEffect, useState } from "react";
import axios from 'axios'
import URL from '../../baseUrl/BaseUrl'
function AdminDashboard() {
    let [orderData, setOrderData] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: URL+'/getOrders',
            withCredentials: true
        }).then((response) => {
            setOrderData(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    function updateStatus(id) {
        axios({
            method: 'post',
            url:  URL+'/updateStatus',
            data: {
                id: id,
                status: "Order confirmed"
            },
            withCredentials: true
        }).then((response) => {
            alert(response.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div>
            <div className="container">
                <h1 className='text-center mt-3 mb-3'>Customers Orders</h1>
                <div className='row justify-content-center'>
                    {
                        orderData.map((v, i) => {
                            return (
                                <div className='col-md-5  mr-1 mt-4 py-3 px-3' style={{ boxShadow: "0 0 10px grey" }}>
                                    <div>
                                        <span>Name:</span>
                                        <span className='float-right'>{v.name}</span>
                                    </div>
                                    <div>
                                        <span>Address:</span>
                                        <span className='float-right'>{v.address}</span>
                                    </div>
                                    <div>
                                        <span>Phone:</span>
                                        <span className='float-right'>{v.phone}</span>
                                    </div><hr />
                                    {
                                        v.orders.map((v, i) => {
                                            return (
                                                <div>
                                                    <div className='row '>
                                                        <div className='col-md-6'>{v.name}</div>
                                                        <div className='col-md-6 text-right'>{v.qty} Kg * {v.price} PKR</div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <hr />
                                    <div>
                                        <span>Total Amount</span>
                                        <span className='float-right'>{v.total} PKR</span>
                                    </div>
                                    <div>
                                        <span className='float-right mt-2'>
                                            <button onClick={() => {
                                                updateStatus(v._id)
                                            }} >Confirm Order</button>
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div >
    )
}

export default AdminDashboard