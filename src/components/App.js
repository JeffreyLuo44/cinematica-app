import './../css/App.css';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import VerifyRegistration from './VerifyRegistration';
import PasswordReset from './PasswordReset';
import Timeline from './Timeline';
import Profile from './Profile';

function App() {
  const [page, setPage] = useState("timeline");
  const [idToken, setIdToken] = useState('');
  const [userId, setUserId] = useState('');
  const [viewProfileUserId, setViewProfileUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleViewProfile = (id) => {
    setViewProfileUserId(id);
    setPage("profile");
  }

  return (
    <div className="App">
      {page==="login" && <Login setPage={setPage} setIdToken={setIdToken} setUserId={setUserId} username={username} setUsername={setUsername}/>}
      {page==="register" && <Register setPage={setPage} email={email} setEmail={setEmail} username={username} setUsername={setUsername} />}
      {page==="verifyRegistration" && <VerifyRegistration setPage={setPage} email={email} username={username} setUsername={setUsername}/>}
      {page==="passwordReset" && <PasswordReset setPage={setPage}/>}
      {page==="timeline" && <Timeline setPage={setPage} idToken={idToken} userId={userId} setViewProfileUserId={setViewProfileUserId} handleViewProfile={handleViewProfile} username={username} setEmail={setEmail} setUsername={setUsername} />}
      {page==="profile" && <Profile setPage={setPage} idToken={idToken} userId={userId} viewProfileUserId={viewProfileUserId} setViewProfileUserId={setViewProfileUserId} handleViewProfile={handleViewProfile} username={username} setUsername={setUsername} />}
    </div>
  );
}

export default App;
