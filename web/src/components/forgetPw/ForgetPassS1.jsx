import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import {
    useHistory
} from "react-router-dom";
import { useGlobalState, useGlobalStateUpdate } from '../../context/globalContext'
function ForgetPw() {
    let url = 'http://localhost:5000'
    let [next, setNext] = useState(true);
    let [next2, setNext2] = useState(true);
    let [resMsg, setResMsg] = useState('');
    let [resErrorMsg, setResErrorMsg] = useState('');
    let form = {
        boxShadow: "0 0 10px grey",
        padding: "20px",
        marginTop: "50px"
    }
    function nextStep() {
        setNext(prev => !prev)
    }
    function nextStep2() {
        setNext2(prev => !prev)
        console.log(document.getElementById('otp').value)
    }
    function getEmail(e) {
        e.preventDefault()
        let email = document.getElementById('email').value;
        axios({
            method: 'post',
            url: url + '/forget-password',
            data: {
                email: email,
            },
            withCredentials: true
        }).then((response) => {
            console.log(response)
            if (response.data.status === 200) {
                setResMsg(response.data.message)
                nextStep()
            }
            else {
                setResErrorMsg(response.data.message)
            }
        }, (error) => {
            console.log(error);
        });
    }
    function ForgetPw2(e) {
        e.preventDefault()
        console.log(document.getElementById('password').value)
        console.log(document.getElementById('otp').value)
        axios({
            method: 'post',
            url: url + '/forget-password-2',
            data: {
                newPassword: document.getElementById('password').value,
                otp: document.getElementById('otp').value,
            },
            withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                alert(response.data.message)
                // location.href = "./login.html"
            }
            else {
                alert(response.data.message)
            }
        }, (error) => {
            console.log(error);
        });

    }
    return (
        <div>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-md-5 ' style={form}>
                        <h3 className="text-center">Account recovery</h3><br />
                        <div className="form-col">
                            {next ? <div className="col">
                                <form onSubmit={getEmail}>
                                    <input type="email" className="form-control"
                                        placeholder="Email" required id="email" /><br />
                                    <button className='btn btn-primary' type="submit">Next</button>
                                </form>
                            </div> :

                                <form onSubmit={ForgetPw2}>
                                    <div>
                                        {/* {next2 ? */}
                                        <div className="col">
                                            <input type="number" className="form-control"
                                                    placeholder="Enter 6 digits code" required id="otp" />
                                            <p>{resMsg}</p>
                                          {/* <button className='btn btn-primary' onClick={nextStep2}>Next</button> */}
                                        </div> 
                                        <div className="col">
                                            <input type="text" className="form-control"
                                                    placeholder="Enter new password" required id="password" />
                                            <button className='btn btn-primary' type='submit'>Change Password</button>
                                        </div>
                                    </div>
                                </form>}


                            {resErrorMsg ? <div className="alert alert-danger" role="alert">
                                {resErrorMsg}
                            </div> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPw