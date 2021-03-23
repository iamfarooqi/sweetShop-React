import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {
    useHistory
} from "react-router-dom";
import URL from '../../baseUrl/BaseUrl'
function Signup() {
    let [change, setChange] = useState(true)
    let [show, setShow] = useState()

    let history = useHistory()
    function handleClick() {
        history.push("/login");
    }

    function signup(event) {
        event.preventDefault();

        let name = document.getElementById('name').value
        let email = document.getElementById('email').value
        let phone = document.getElementById('phone').value
        let password = document.getElementById('password').value
        let newData = {
            name: name,
            email: email,
            password: password,
            phone: phone
        }
        axios({
            method: 'post',
            url: URL + '/signup',
            data: newData,
            withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                setChange(false)
            }
            else {
                history.push("/signup");
                setShow(response.data.message)
            }
        }).catch((error) => {
            console.log(error);
        });
    }



    return (

        <div>
            <div>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div style={{color:"#DA291C",fontWeight:"bolder"}} className='col-md-5 form'>
                            {change ? <div>
                                <h1 className="text-center">Signup</h1>
                                <form onSubmit={signup}>
                                    <div className="form-col">
                                        <div className="col">
                                            <input type="text" className="form-control"
                                                placeholder="Name" required id='name' />
                                        </div><br />
                                        <div className="col">
                                            <input type="email" className="form-control"
                                                placeholder="Email" required id="email" />
                                        </div><br />
                                        <div className="col">
                                            <input type="text" className="form-control"
                                                placeholder="Phone" required id='phone' />
                                        </div><br />
                                        <div className="col">
                                            <input type="password" className="form-control"
                                                placeholder="Password" required id="password" />
                                        </div><br />
                                        <div className="col">
                                            <button style={{backgroundColor:"#FFC72C", color:"#DA291C", border:"none", fontWeight:"bolder"}} className='btn btn-primary'>Signup</button>
                                        </div><br/>
                                        <div className="col">
                                            <p>Already have an account?
                                            <span onClick={handleClick}
                                                    className="text-primary ml-1" style={{ cursor: "pointer" }}>
                                                    Login
                                            </span>
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div> :
                                <div className="alert alert-success" role="alert" >
                                    Signup Successfully
                                    <span onClick={handleClick}
                                        className="text-primary ml-1" style={{ cursor: "pointer" }}>
                                        Login
                                    </span>
                                </div>}
                                {show?<div class="alert alert-danger" role="alert">
                                    {show}
                                </div>: null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup