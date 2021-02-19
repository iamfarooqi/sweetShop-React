
import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
// import url from 'url'





const url = "http://locahlhost:5000"
function Signup() {

  function handlSubmit(event) {
    event.preventDefault();
    axios({
      method: 'post',
      url: url + '/auth/signup',
      data: {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      }, withCredentials: true
    }).then((response) => {
      if (response.data.status === 200) {
        alert(response.data.message)
      } else {
        // alert(response.data.message);
        alert(response.data.message)
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  return (

    <div>
      <h1>Signup</h1>
      <form onSubmit={handlSubmit}>
        <input type="text" id="name" />
        <input type="text" id="email" />
        <input type="text" id="password" />
        <button type="submit">DOne</button>
      </form>
    </div>
  )
}

export default Signup;