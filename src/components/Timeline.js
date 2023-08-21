// import React, { useState } from 'react';

const Timeline = ({setPage, setIdentifier}) => {
//   const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search!");
    // Send login data to server
    // fetch('http://localhost:3001/search', {
  };

  const handleLogout = () => {
    setIdentifier('');
    setPage('login');
  }

  return (
    <div>
        <header>  

        </header>
        <div className="feed-container">
            <button className="back" onClick={() => handleLogout()}>&larr;&emsp;Log out</button>
            <form className="form" onSubmit={handleSubmit}>
            
            </form>
        </div>
    </div>
  );
};
    
export default Timeline;