import React, { useState } from 'react';
import MovieDetails from './MovieDetails';
import Posts from './Posts';

const Timeline = ({setPage, userId, handleViewProfile, username, setUsername, mockPosts, setMockPosts, mockReplies, setMockReplies}) => {  
  const [notificationOn, setNotificationOn] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [createPostText, setCreatePostText] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showImageTrashIcon, setShowImageTrashIcon] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isCreateSpoilerPost, setIsCreateSpoilerPost] = useState(false);

  const [moviesTaggedCreatePost, setMoviesTaggedCreatePost] = useState([]);
  const [movieId, setMovieId] = useState(-1);

  const handleToggleMovieDetails = (id) => {
    console.log(id);
    if (movieId === -1){
      setMovieId(id);
    } else {
      setMovieId(-1);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === ''){
      alert("You must be signed in to create a post");
      return;
    }
    console.log("Post!");

    let imageUrl = '';
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    // Mock post creation
    const updatedMockPosts = [...mockPosts];
    // This NEEDS changing
    let mockTaggedMovie = moviesTaggedCreatePost[0].title + " (" + moviesTaggedCreatePost[0].releaseYear + ")";
    let newPost = [username, getFormattedDateTime(), createPostText, imageUrl, mockTaggedMovie, 0, 0, "hideTrashIcon", isCreateSpoilerPost];
    updatedMockPosts.unshift(newPost);
    const updatedMockReplies = [...mockReplies];
    updatedMockReplies.unshift([]);
    setMockPosts(updatedMockPosts);
    setMockReplies(updatedMockReplies);
    // Send post data to server
    // fetch('http://localhost:3001/post', {
    setCreatePostText('');
    setSearchTag('');
    setMoviesTaggedCreatePost([]);
    setImageFile(null);
    setIsCreateSpoilerPost(false);
  };

  const handleLogout = () => {
    setUsername('');
    setPage('login');
  }

  const handleToggleNotifications = () => {
    setNotificationOn(!notificationOn);
    /* Need to apply to database */
  }

  function getFormattedDateTime(){
    let currentDate = new Date(); 
    // Month is 0 based.
    let currentMonth = currentDate.getMonth() + 1;
    let yearTwoDigits = currentDate.getFullYear() - 2000;
    let currentHours = currentDate.getHours() > 12 ? currentDate.getHours() - 12 : currentDate.getHours();
    let currentMinutes = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes(): currentDate.getMinutes();
    let amOrPM = currentDate.getHours() > 11 ? "pm" : "am";
    return currentDate.getDate() + "/" + currentMonth + "/" + yearTwoDigits + " " +  currentHours + ":" + currentMinutes + amOrPM;
  }

  // Simulate a click to find an image
  const handleImageIconClick = () => {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
  };

  const handleImageUpload = (e) => {
    const selectedImageFile = e.target.files[0];
    setImageFile(selectedImageFile);
  };

  // Using the Movie Search API
  const searchMovie = (searchTag) => {
    if (searchTag === ""){
      setSearchResults([]);
      //To get rid of the small empty search result
      document.getElementById("search-results").style.visibility = "hidden";
      return;
    }
    document.getElementById("search-results").style.visibility = "visible";

    try {
      // Send movie id to server
      fetch('https://localhost:53134/api/movies/search/' + searchTag, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
                setSearchResults(data);
            });
        } else {
            alert(response.title);
        }
    });
    } catch (error) {
      console.error('Error getting movie search results:', error);
    }
  }
  
  const handleAddTaggedMovie = (id, title, releaseYear) => {
    let updatedMoviesTaggedCreatePost = [...moviesTaggedCreatePost];
    let newMovieTagged = {
      id: id,
      title: title,
      releaseYear: releaseYear
    }
    updatedMoviesTaggedCreatePost.push(newMovieTagged);
    setMoviesTaggedCreatePost(updatedMoviesTaggedCreatePost);
    // Reset the search bar and results
    setSearchTag("");
    document.getElementById("search-results").style.visibility = "hidden";
  }

  const handleViewTimeline = () => {
    setMovieId(-1);
  }

  const changeTab = (e, tab) => {
    const tabs = document.getElementsByClassName("timeline__tabs")[0].childNodes;
    tabs.forEach((item, index) => {
        if (item.classList.contains("tab--clicked")) {
            item.classList.remove("tab--clicked");
        }
    })
    e.target.classList.add("tab--clicked");
    // setMovieTab(tab);
  }

  return (
    <div className="cinematica__content">
      {/* Header */}
      <header>
        <div className="cinematica__header-upper">
          <p className="cinematica__logo logo__size-2 logo__colour-2" onClick={() => handleViewTimeline()}>Cinematica</p>
          <div>
            <i class="fa fa-home" aria-hidden="true" onClick={() => handleViewTimeline()}></i>
            {username !== "" ? <div>
              {notificationOn ? <i class='fa fa-bell' onClick={() => handleToggleNotifications()}></i> : <i class='fa fa-bell-slash' onClick={() => handleToggleNotifications()}></i>}
              <p onClick={() => handleViewProfile(userId)}>{username}</p>
              <div className="cinematica__profile-circle" onClick={() => setDropdownVisible(!dropdownVisible)}></div>
              {dropdownVisible && (
              <div className="dropdown-menu">
                <p onClick={() => handleViewProfile(userId)}>Profile</p>
                <i class="fa fa-sign-out" aria-hidden="true" onClick={handleLogout}></i>
              </div>
              )}
            </div>
            :
            <div>
              <button className="cinematica__guest-view-button" onClick={() => setPage("login")}>Login</button>
              <button className="cinematica__guest-view-button" onClick={() => setPage("register")}>Register</button>
            </div>}
          </div>
        </div>
        {/* Timeline tabs */}
        <div className="timeline__tabs">
          <div onClick={(event) => changeTab(event, "allposts")} className="tab--clicked">All posts</div>
          <div onClick={(event) => changeTab(event, "following")}>Following</div>
        </div>
      </header>
      {movieId >= 0 ? (<MovieDetails userId={userId} movieId={movieId} handleToggleMovieDetails={handleToggleMovieDetails} />) :
      (<div className="feed-container">
        {/* Create post */}
        {<form className="form" onSubmit={handleSubmit}>
          <div>
            <textarea className="post__text" placeholder="What's on your mind?" maxLength={280} value={createPostText} onChange={(e) => setCreatePostText(e.target.value)} required />
            <div>
              <input type="text" className="searchBar search__timeline" value={searchTag} placeholder="Enter tag..." onChange={(e) => {setSearchTag(e.target.value); searchMovie(e.target.value);}} /><br/>
            </div>
            <div id="search-results" className="search-results">
              {/* Display search results here */}
              {searchResults.map((result) => (
                <div key={result.id} onClick={() => handleAddTaggedMovie(result.id, result.title, result.releaseYear)}>{result.title} ({result.releaseYear})</div>
              ))}
            </div>
            {moviesTaggedCreatePost.length > 0 && <br/>}
            <div className="post-movie">
              {moviesTaggedCreatePost.map((taggedMovie) => (
                <div key={taggedMovie.id} onClick={() => handleToggleMovieDetails(taggedMovie.id)}><i class='fa fa-film'></i> {taggedMovie.title} ({taggedMovie.releaseYear})</div>
              ))}
            </div>
          </div>
          {/* Display image preview */}
          {imageFile && <div className="image-preview-container" onMouseEnter={() => setShowImageTrashIcon(true)} onMouseLeave={() => setShowImageTrashIcon(false)}>
            {showImageTrashIcon === true && <div className="image-trash-icon"><i class="fa fa-trash" aria-hidden="true" onClick={() => setImageFile(null)}></i></div>}
            <div className="image-preview-wrapper"><br/><img src={URL.createObjectURL(imageFile)} alt="Selected" className="image-preview" /></div>
          </div>}
          <div className="post__controls">
            <div>
            {/* Hide default "browse" control */}
            <input type="file" accept="image/*" id="imageInput" style={{ display: 'none' }} onChange={handleImageUpload} />
            <i className='fa fa-image' onClick={handleImageIconClick}></i>
              <label for="spoilers">Mark as spoilers</label>
              <input type="checkbox" value="spoilers" onChange={(e) => setIsCreateSpoilerPost(!isCreateSpoilerPost)} />
            </div>
            <div>
              <button className="post__button" id="post" type="submit">Post</button>
            </div>
          </div>
          <br/>
        </form>}
         {/* Posts */}
         <Posts username={username} mockPosts={mockPosts} setMockPosts={setMockPosts} mockReplies={mockReplies} setMockReplies={setMockReplies} handleViewProfile={handleViewProfile} handleToggleMovieDetails={handleToggleMovieDetails} />
      </div>)}
    </div>
  );
};
    
export default Timeline;