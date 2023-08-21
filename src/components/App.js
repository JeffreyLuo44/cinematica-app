import './../css/App.css';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import VerifyRegistration from './VerifyRegistration';
import PasswordReset from './PasswordReset';
import Timeline from './Timeline';

function App() {
  const [page, setPage] = useState("login");
  const [identifier, setIdentifier] = useState('');

  return (
    <div className="App">
      {page==="login" && <Login setPage={setPage} identifier={identifier} setIdentifier={setIdentifier}/>}
      {page==="register" && <Register setPage={setPage} setIdentifier={setIdentifier} />}
      {page==="verifyRegistration" && <VerifyRegistration setPage={setPage} setIdentifier={setIdentifier}/>}
      {page==="passwordReset" && <PasswordReset setPage={setPage}/>}
      {page==="timeline" && <Timeline setPage={setPage} identifier={identifier} setIdentifier={setIdentifier}/>}
      {/* {page==="profile" && <Profile setPage={setPage}/>} */}
    </div>
  );
}

export default App;
