import React from "react";
import { Link } from 'react-router-dom'
import { useGlobalState } from '../../context/globalContext'
import Logout from './logout'
function Navbar() {
    const globalState = useGlobalState()
    return (
        <div  className='sticky-top'>
            <nav style={{backgroundColor:"#FFC72C", color:"#DA291C"}} className="navbar  navbar-expand-lg">
                <a style={{color:"#DA291C", fontWeight:"bolder"}} className="navbar-brand" href="#">sweetShop</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                    {globalState.role === 'user' ?
                        <>
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link style={{color:"#DA291C", fontWeight:"bolder"}} className="nav-link" to="/">Dashboard <span className="sr-only">(current)</span></Link>
                                </li>
                                <li className="nav-item active">
                                    <Link style={{color:"#DA291C", fontWeight:"bolder"}} className="nav-link" to="/myorders">My orders <span className="sr-only">(current)</span></Link>
                                </li>
                            </ul>
                            <h3 style={{color:"black", fontWeight:"bolder"}} className="mr-3"> {globalState.user.name.charAt(0).toUpperCase() + globalState.user.name.slice(1)}</h3>
                            <Logout />
                        </> :
                        <>
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link style={{color:"#DA291C", fontWeight:"bolder"}} className="nav-link" to="/">Admin Dashboard <span className="sr-only">(current)</span></Link>
                                </li>
                                <li className="nav-item active">
                                    <Link style={{color:"#DA291C", fontWeight:"bolder"}} className="nav-link" to="/addproducts">Add Products <span className="sr-only">(current)</span></Link>
                                </li>
                            </ul>
                            <h3 style={{color:"black", fontWeight:"bolder"}} className="mr-3"> {globalState.user.name.charAt(0).toUpperCase() + globalState.user.name.slice(1)}</h3>
                            <Logout />
                        </>
                    }
                </div>
            </nav>
        </div>
    )
}
export default Navbar