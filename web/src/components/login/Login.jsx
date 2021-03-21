import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import './Login.css'
import URL from '../../baseUrl/BaseUrl'
import { useGlobalState, useGlobalStateUpdate } from '../../context/globalContext'
import {
    useHistory
} from "react-router-dom";
function Login() {
    let [show, setShow] = useState()
    let history = useHistory()
    const globalState = useGlobalState()
    const setGlobalState = useGlobalStateUpdate()
    function login(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: URL + '/login',
            data: {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            },
            withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                setGlobalState(prev => ({
                    ...prev,
                    loginStatus: true,
                    user: response.data.user,
                    role: response.data.user.role,
                }))
            }
            else {
                history.push("/login");
                setShow(response.data.message)
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    function goToForget() {
        history.push("/forgetpw");
    }
    return (
        <div>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-md-5 form'>
                        <h1 className="text-center">Login</h1>
                        <form onSubmit={login}>
                            <div className="form-col">
                                <div className="col">
                                    <input type="email" className="form-control"
                                        placeholder="Email" required id="email" />
                                </div><br />
                                <div className="col">
                                    <input type="password" className="form-control"
                                        placeholder="Password" required id="password" />
                                </div><br />
                                <div className="col">
                                    <button className='btn btn-primary' type="submit">Login</button>
                                    <p className='mt-3' onClick={goToForget}
                                        style={{ cursor: "pointer" }}>Forget Password</p>
                                </div><br />
                                {show ? <div className="alert alert-danger" role="alert">
                                    {show}
                                </div> : null}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login