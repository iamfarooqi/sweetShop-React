
import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
// import url from 'url'




const url = "http://locahlhost:5000"
function Login() {



  // axios({
  //   method: 'post',
  //   url: url + "/login",
  //   data: {
  //     // email: document.getElementById("email").value,
  //     // password: document.getElementById("password").value,
  //   }, withCredentials: true

  // }).then((response) => {
  //   console.log(response);
  //   alert(response.data.message)
  //   window.location.href = "home.html"
  // }, (error) => {
  //   console.log(error);
  //   alert("Please write your correct email and password")
  // });




  // return (

  //   <div>
  //     <h1>Login</h1>
  //     <Form>
  //       <Form.Group controlId="formGroupEmail">
  //         <Form.Label>Email address</Form.Label>
  //         <Form.Control type="email" id="email" placeholder="Enter email" />
  //         {/* <input type="text"  required id="name" placeholder="Your name" /> */}
  //       </Form.Group>
  //       <Form.Group controlId="formGroupPassword">
  //         <Form.Label>Password</Form.Label>
  //         <Form.Control type="password" id="password" placeholder="Password" />
  //         {/* <input type="text"  required id="password" placeholder="Your email" /> */}
  //       </Form.Group>
  //     </Form>
  //   </div>
  // )
}

export default Login;