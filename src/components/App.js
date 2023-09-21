import './../css/App.css';
import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import VerifyRegistration from './VerifyRegistration';
import PasswordReset from './PasswordReset';
import Timeline from './Timeline';
import Profile from './Profile';
import jwtDecode from 'jwt-decode';

function App() {
  const apiUrlPrefix = process.env.REACT_APP_API_URL_PREFIX;
  const [page, setPage] = useState("timeline");
  const [userId, setUserId] = useState(localStorage.getItem('user_id') === null ? '' : localStorage.getItem('user_id'));
  const [idToken, setIdToken] = useState(localStorage.getItem('idToken') === null ? '': localStorage.getItem('idToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') === null ? '': localStorage.getItem('refreshToken'));
  const [username, setUsername] = useState(localStorage.getItem('username') === null ? '': localStorage.getItem('username'));
  const [viewProfileUserId, setViewProfileUserId] = useState('');
  const [email, setEmail] = useState('');

  const handleViewProfile = (id) => {
    setViewProfileUserId(id);
    setPage("profile");
  }

  useEffect(() => {
    if (idToken === '')
      return;

    const decodedToken = jwtDecode(idToken);

    if (decodedToken && decodedToken.exp) {
      const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
      if (decodedToken.exp < currentTimestamp) {
        // Token has expired
        console.log('Token has expired');
        fetch(apiUrlPrefix + 'auth/refresh-access-token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            refreshToken: refreshToken,
          })
        })
        .then(response => {
            if (response.ok) { // Check if the response status code is in the 2xx range
                return response.json().then(data => {
                  setIdToken(data.idToken);
                });
            } else {
                alert(response.title);
            }
        })
        .catch(error => {
            console.error('Error during getting id token', error);
        });
      } else {
        console.log('Id token is valid');
      }
    } else {
      console.log('Invalid id token format');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      {page==="login" && <Login setPage={setPage} setIdToken={setIdToken} setUserId={setUserId} setRefreshToken={setRefreshToken} username={username} setUsername={setUsername}/>}
      {page==="register" && <Register setPage={setPage} email={email} setEmail={setEmail} username={username} setUsername={setUsername} />}
      {page==="verifyRegistration" && <VerifyRegistration setPage={setPage} email={email} username={username} setUsername={setUsername}/>}
      {page==="passwordReset" && <PasswordReset setPage={setPage}/>}
      {page==="timeline" && <Timeline setPage={setPage} idToken={idToken} userId={userId} setViewProfileUserId={setViewProfileUserId} handleViewProfile={handleViewProfile} username={username} setEmail={setEmail} setUsername={setUsername} />}
      {page==="profile" && <Profile setPage={setPage} idToken={idToken} userId={userId} viewProfileUserId={viewProfileUserId} setViewProfileUserId={setViewProfileUserId} handleViewProfile={handleViewProfile} username={username} setUsername={setUsername} />}
    </div>
  );
}

export default App;
