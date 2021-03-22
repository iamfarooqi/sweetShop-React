import React, { useState } from "react";
import Main from './cart/Main';
import Basket from './cart/Basket';
import data from './data';
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import {useHistory} from "react-router-dom"
import { useGlobalState,useGlobalStateUpdate} from '../../context/globalContext'

function Dashboard() {    
    const globalState = useGlobalState()
    const globalStateUpdate = useGlobalStateUpdate()
    let history = useHistory()
    const { products } = data;
    const [cartItems, setCartItems] = useState([]);
 
    ///////////////////////////////
    const onAdd = (product) => {
        const exist = cartItems.find((x) => x.id === product.id);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty: 1 }]);
        }
    };
    ///////////////////////////////
    ///////////////////////////////
    const onRemove = (product) => {
        const exist = cartItems.find((x) => x.id === product.id);
        if (exist.qty === 1) {
            setCartItems(cartItems.filter((x) => x.id !== product.id));
        } else {
            setCartItems(
                cartItems.map((x) =>
                    x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
                )
            );
        }
    };
    ///////////////////////////////

    function logout() {
        axios({
            method: 'post',
            url: 'http://localhost:5000/logout',
            withCredentials: true
        }).then((response) => {
            console.log(response)
            globalStateUpdate(prev =>({
                ...prev,
                loginStatus:false
            }))
            history.push("/login")
        }, (error) => {
            console.log(error);
        });
    }
    return (
        <div >
            <div logout={logout}/>
            <div className='bg-primary py-2'  >
                <div  className="container">
                    <h2 className="mr-4 text-white">Welcome </h2>
                </div>
            </div>
            <div  className="row1">
                <Main products={products} onAdd={onAdd}></Main>
                <Basket
                    cartItems={cartItems}
                    onAdd={onAdd}
                    onRemove={onRemove}
                ></Basket>
            </div>
        </div>
    )
}

export default Dashboard