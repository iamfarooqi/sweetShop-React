
import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
axios.defaults.withCredentials = true

// import url from 'url'




const url = 'http://localhost:5000'
function Login() {

  function userlogin(event) {
    event.preventDefault();



    axios({
      method: 'post',
      url: url + "auth/login",
      data: {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }
    }).then((response) => {
      console.log(response);
      alert("done",response.data.message)
    }, (error) => {
      console.log(error);
      alert("correct your email and password")
    });

  }


    return (

      <div>
        <h1>Login</h1>
        {/* <Form>
        <Form.Group controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" id="email" placeholder="Enter email" />
           <input type="text"  required id="name" placeholder="Your name" /> 
        </Form.Group>
        <Form.Group controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" placeholder="Password" />
          /* <input type="text"  required id="password" placeholder="Your email" /> 
        </Form.Group>
      </Form> */}

        <form onSubmit={userlogin}>
        <label >
          email:
          <input type="email" id="email"/>
          <label >
            password:
            <input type="password" id="password"/>

            <button type="submit">login</button>
          </label>
        </label>
        </form>
      </div>
    )
  }

  export default Login;