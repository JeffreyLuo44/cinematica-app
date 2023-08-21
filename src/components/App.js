import './../css/App.css';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';

function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="App">
      {page==="login" && <Login setPage={setPage}/>}
      {page==="register" && <Register setPage={setPage}/>}
      {/* {page==="verifyRegistration" && <VerifyRegistration setPage={setPage}/>}
      {page==="passwordReset" && <PasswordReset setPage={setPage}/>}
      {page==="timeline" && <Timeline setPage={setPage}/>}
      {page==="profile" && <Profile setPage={setPage}/>} */}
    </div>
  );
}

export default App;
