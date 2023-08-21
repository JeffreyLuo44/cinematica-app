import React, { useState } from 'react';

const Login = ({setPage}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login!");
    // Send login data to server
    // fetch('http://localhost:3001/login', {
  };

  return (
    <div>
      <header>  

      </header>
      <div className="container">
        <div className="left-column">
          <div className="login__background">
            <div className="login__background-container">
              <p className="cinematica__logo logo__size-1 logo__colour-1">Cinematica</p>
              <p className="login__background-heading">Welcome back!</p>
              <p className="login__background-text">The more movies and TV shows you watch, the more opportunities you have to interact with film enthusiasts.</p>
            </div>
          </div>
        </div>
        <div className="right-column">
          <h1 className="formHeading">Login</h1>
          <form className="form" onSubmit={handleSubmit}>
            <label>Username or Email Address</label><br/>
            <input type="text" value={identifier.trim()} onChange={(e) => setIdentifier(e.target.value)} required/><br/>
            <br/>
            <label id="login-password">Password</label> <span className="link">Forgot Password</span><br/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="" autoComplete="new-password" required /> <br/>
            <br/>
            <button className="standard" type="submit">Log In</button>
            <p className="link" onClick={() => setPage("register")}>New to the conversation? Register here</p>
          </form>
        </div>
      </div>
    </div>
  );
};
    
export default Login;