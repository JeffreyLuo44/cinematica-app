import React, { useState } from 'react';

const Register = ({setPage, email, setEmail, username, setUsername}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    const errors = [];
    e.preventDefault();
    if (username.length < 3 || username.length > 14) {
      errors.push('Username should be between 3 and 14 characters.');
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
  
    // Form validation
    if (!passwordRegex.test(password)) {
      errors.push('Password should be at least 8 characters, including at least one number and one special character.');
    }

    if (errors.length > 0){
      for (var i = 0; i < errors.length; i++)
        alert(errors[i]);
    } else {
      console.log("Register!");
      // Send register data to server
      fetch('https://localhost:53134/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Email: email,
          Username: username,
          Password: password
        })
      })
      .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
          setPage("verifyRegistration");
        } else {
          return response.json().then(data => {
            console.error('Request failed with status: ' + response.status);
            alert(data.message);
          });
        }
      })
      .catch(error => {
        console.error('Error during registration:', error);
      });
    }
  };

  return (
    <div>
      {/* <header>  </header> */}
      <div className="container">
        <div className="left-column">
          <div className="register__background">
            <div className="register__background-container">
              <p className="cinematica__logo logo__size-1 logo__colour-1">Cinematica</p>
              <p className="register__background-heading">Share your passion for cinema</p>
              <p className="register__background-text">Join the conversation on the latest movies and TV shows with our community of film enthusiasts.</p>
            </div>
          </div>
        </div>
        <div className="right-column">
          <h1 className="formHeading">Register</h1>
          <form className="form" onSubmit={handleSubmit}>
            <label>Username</label><br/>
            <input type="text" value={username.trim()} onChange={(e) => setUsername(e.target.value)} required /><br/>
            <br/>
            <label>Email Address</label><br/>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/><br/>
            <br/>
            <label>Password</label> <br></br>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="Enter strong password here..." autoComplete="new-password" required /><br/>
            <br/>
            <button className="standard" type="submit">Register</button>
            <p className="link" onClick={() => setPage("timeline")}>Continue as guest</p>
            <br/>
            <p className="link" onClick={() => setPage("login")}>Already have an account? Login here</p>
          </form>
        </div>
      </div>
    </div>
  );
};
    
export default Register;