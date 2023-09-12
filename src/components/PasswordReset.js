import React, { useState } from 'react';

const ResetPassword = ({setPage}) => {
  const [resetStage, setResetStage] = useState('1');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleNavToStage2 = (e) => {
    e.preventDefault();
    // Send email data to server
    fetch('https://localhost:53134/api/auth/request-password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(email)
    })
    .then(response => {
      if (response.ok) { // Check if the response status code is in the 2xx range
        setResetStage("2");
      } else {
        return response.json().then(data => {
          console.error('Request failed with status: ' + response.status);
          alert(data.message);
        });
      }
    })
    .catch(error => {
      console.error('Error during request password reset :', error);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = [];
    const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
  
    // Form validation
    if (!passwordRegex.test(newPassword)) {
      errors.push('Password should be at least 8 characters, including at least one number and one special character.');
    }

    if (errors.length > 0){
      for (var i = 0; i < errors.length; i++)
        alert(errors[i]);
    } else {
        console.log("Password reset!");
        // Send password reset data to server
        fetch('https://localhost:53134/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Email: email,
            Password: newPassword,
            ConfirmationCode: token,
          })
        })
        .then(response => {
          if (response.ok) { // Check if the response status code is in the 2xx range
            setPage("login");
            alert("Password has been reset.");
          } else {
            return response.json().then(data => {
              console.error('Request failed with status: ' + response.status);
              alert(data.message);
            });
          }
        })
        .catch(error => {
          console.error('Error during reset password:', error);
        });
    }
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
        {resetStage === "1" && (<button className="back" onClick={() => setPage("login")}><i class='fa fa-arrow-left'></i>&emsp;Back</button>)}
        {resetStage === "2" && (<button className="back" onClick={() => setResetStage("1")}><i class='fa fa-arrow-left'></i>&emsp;Back</button>)}
          <h1 className="formHeading">Forgot Password</h1>
          <br/><br/>
          {resetStage === "1" && (<form className="form" onSubmit={handleNavToStage2}>
            <label>Email Address</label><br/>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/><br/>
            <br/>
            <button className="standard" type="submit">Send Password Reset</button>
          </form>)}
          {resetStage === "2" && (<form className="form" onSubmit={handleSubmit}>
            <label>Token</label><br/>
            <input type="text" value={token.trim()} onChange={(e) => setToken(e.target.value)} required /><br/>
            <br/>
            <label>New Password</label> <br></br>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  placeholder="Enter strong password here..." autoComplete="new-password" required /><br/>
            <br/>
            <button className="standard" type="submit">Change Password</button>
          </form>)}
        </div>
      </div>
    </div>
  );
};
    
export default ResetPassword;