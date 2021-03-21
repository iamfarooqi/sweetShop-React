import React from "react";
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from './../home/Home.jsx'
import Login from './../login/Login.jsx'
import Signup from './../signup/Signup.jsx'
import Dashboard from './../dashboard/Dashboard.jsx'
import ForgetPw from './../forgetPw/ForgetPassS1'
import AdminDashboard from '../admin/adminDashboard'
import Basket from '../dashboard/cart/Basket'
import CheckOutForm from '../dashboard/cart/CheckOutForm'
import AddProducts from '../admin/AddProducts'
import MyOrders from '../dashboard/MyOrders'
import basket from '../dashboard/cart/Basket'
import { useGlobalState } from '../../context/globalContext'
import Navbar from '../Navbar/Navbar'
function RoutesConfig() {
    const globalState = useGlobalState()

    return (
        <div>
            <Router>
                {globalState.role === null ?
                    <div>
                        <Switch>
                            <Route exact path="/" component={Signup} />
                            <Route path="/login" component={Login} />
                            <Route path="/forgetpw" component={ForgetPw} />
                            <Route path="*" />
                            <Redirect to="/" />
                            <Route />
                        </Switch>
                    </div> : null}

                {globalState.role === "user" ?
                    <>
                        <Navbar />
                        <Route exact path="/" component={Dashboard} />
                        <Route path="/basket" component={Basket} />
                        <Route path="/myorders" component={MyOrders} />
                        <Route path="/checkoutform" component={CheckOutForm} />
                        <Route path="*" />
                        <Redirect to="/" />
                        <Route />
                    </> : null
                }
                {globalState.role === "admin" ?
                    <>
                        <Navbar />
                        <Route exact path="/" component={AdminDashboard} />
                        <Route exact path="/addproducts" component={AddProducts} />
                        <Route path="*" />
                        <Redirect to="/" />
                        <Route />
                    </> : null
                }
            </Router>
        </div>
    );
}
export default RoutesConfig