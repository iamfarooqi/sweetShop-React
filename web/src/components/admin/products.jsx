import React, { useState, useEffect } from "react";
import Basket from '../dashboard/cart/Basket';
import URL from '../../baseUrl/BaseUrl'
import axios from 'axios'
import { useGlobalState, useGlobalStateUpdate } from '../../context/globalContext'

function Products() {

    const [hideCart, setHideCart] = useState(true)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        axios({
            method: 'get',
            url: URL + '/getProducts',
            withCredentials: true
        }).then((response) => {
            setProducts(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    ///////////////////////////////
    console.log(products)
    const onAdd = (product) => {
        const exist = cartItems.find((x) => x._id === product._id);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
                )
            );

        } else {
            setCartItems([...cartItems, { ...product, qty: 1 }]);
        }
    };
    ///////////////////////////////
    ///////////////////////////////
    const onRemove = (product) => {
        const exist = cartItems.find((x) => x._id === product._id);
        if (exist.qty === 1) {
            setCartItems(cartItems.filter((x) => x._id !== product._id));
        } else {
            setCartItems(
                cartItems.map((x) =>
                    x._id === product._id ? { ...exist, qty: exist.qty - 1 } : x
                )
            );
        }
    };
    ///////////////////////////////

    return (<>
         
             <div style={{color:"#DA291C"}} className='pt-1 pb-3  sticky-top'>
               

             {/* <marquee style={{border:"1px solid red", width:"50%"}} behavior="scroll" direction="left">Here is some scrolling text... right to left!</marquee> */}

             
                  <a style={{backgroundColor:"#FFC72C", color:"#DA291C", marginRight:"6rem", paddingTop:"0.8rem", border:"none"}} id="cart" className="btn btn-light float-right"
                      onClick={() => setHideCart(prev => !prev)} >
                     <i class="fas fa-shopping-cart"/><span className="ml-1">{cartItems.length}</span>
                  </a>
              
              
                 
             </div>



             
            <div className="row1">
                {hideCart === true ?
                    <main className="container">
                        <h1 className="text-center mt-5 ">Products</h1>
                        <div className="row">
                            {products.map((product) => (
                                <div className="col-md-4 mt-5" key={product.id}>
                                    <div>
                                        <img className="w-100" height="200" src={product.image} alt={product.name} />
                                        <h3>{product.name}</h3>
                                        <div>Rs: {product.price}/kg</div>
                                       <div><h3>Description</h3> <p>{product.description}</p></div>
                                        <div>
                                            <button  style={{backgroundColor:"#FFC72C", color:"#DA291C", border:"none", fontWeight:"bolder"}} onClick={() => onAdd(product)} className="btn btn-primary">Add To Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main> :
                    <>
                        <Basket cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} /></>}
            </div>
        
            
  </>)
}

export default Products