import React, { useState } from 'react';

const VerifyRegistration = ({setPage, setIdentifier}) => {
  const [otpEntry1, setOTPEntry1] = useState('');
  const [otpEntry2, setOTPEntry2] = useState('');
  const [otpEntry3, setOTPEntry3] = useState('');
  const [otpEntry4, setOTPEntry4] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("OTP: " + otpEntry1 + otpEntry2 + otpEntry3 + otpEntry4);
    // Send OTP data to server
    // fetch('http://localhost:3001/verifyOTP', {
    setPage("timeline");
  };

  const handleInput1Change = (e) => {
    setOTPEntry1(e.target.value);
    if (e.target.value !== "")
        document.getElementById(e.target.id).nextSibling.focus();
  }

  const handleInput2Change = (e) => {
    setOTPEntry2(e.target.value);
    if (e.target.value !== "")
        document.getElementById(e.target.id).nextSibling.focus();
    else 
        document.getElementById(e.target.id).previousSibling.focus();
  }

  const handleInput3Change = (e) => {
    setOTPEntry3(e.target.value);
    if (e.target.value !== "")
        document.getElementById(e.target.id).nextSibling.focus();
    else 
        document.getElementById(e.target.id).previousSibling.focus();
  }

  const handleInput4Change = (e) => {
    setOTPEntry4(e.target.value);
    if (e.target.value === "")
        document.getElementById(e.target.id).previousSibling.focus();
  }

  const handleLogout = () => {
    setIdentifier('');
    setPage('login');
  }

  return (
    <div>
      <header>  

      </header>
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
          <button className="back" onClick={() => handleLogout()}><i class='fa fa-arrow-left'></i>&emsp;Exit to login</button>
          <h1 className="formHeading" id="verifyHeading">Verify</h1>
          <form className="form" onSubmit={handleSubmit}>
            <p>Nearly in the conversation<br/>Please verify your email address</p>
            <label>One Time Password</label><br/>
            <input type="text" className="otpEntry" id="otpEntry1" value={otpEntry1} maxLength={1} onChange={(e) => handleInput1Change(e)} required/>
            <input type="text" className="otpEntry" id="otpEntry2" value={otpEntry2} maxLength={1} onChange={(e) => handleInput2Change(e)} required/>
            <input type="text" className="otpEntry" id="otpEntry3" value={otpEntry3} maxLength={1} onChange={(e) => handleInput3Change(e)} required/>
            <input type="text" className="otpEntry" id="otpEntry4" value={otpEntry4} maxLength={1} onChange={(e) => handleInput4Change(e)} required/><br/>
            <br/>
            <button className="standard" id="resend-button">Resend One Time Password</button>
            <br/>
            <button className="standard" type="submit">Verify and Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};
    
export default VerifyRegistration;