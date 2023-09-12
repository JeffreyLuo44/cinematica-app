import React, { useState } from 'react';
import MovieDetails from './MovieDetails';

const Timeline = ({setPage, username, setUsername, setViewProfileUsername, mockPosts, setMockPosts, mockReplies, setMockReplies}) => {  
  const [notificationOn, setNotificationOn] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [createPostText, setCreatePostText] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showImageTrashIcon, setShowImageTrashIcon] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isCreateSpoilerPost, setIsCreateSpoilerPost] = useState(false);

  const [selectedPost, setSelectedPost] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [viewPost, setViewPost] = useState(false);
  const [createReplyText, setCreateReplyText] = useState("");

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

  const handleViewProfile = (username) => {
    /* Need to get username so this needs to be changed */
    setViewProfileUsername(username);
    setPage("profile");
  }

  const handleToggleNotifications = () => {
    setNotificationOn(!notificationOn);
    /* Need to apply to database */
  }

  const handleToggleReplies = (index) => {
    setCreateReplyText('');
    if (index !== "none"){
      handleTempRemoveSpoilerMessage(index)
      const selectedPostFromPosts = [...mockPosts[index]];
      /* Remove the trash icon when viewing Replies of your own post */
      if (selectedPostFromPosts.lastIndexOf("post__delete-icon") !== -1)
        selectedPostFromPosts[selectedPostFromPosts.lastIndexOf("post__delete-icon")] = "hideTrashIcon";
      setSelectedPost(selectedPostFromPosts);
      setSelectedPostIndex(index);
      setViewPost(true);
    } else {
      setSelectedPost([]);
      setSelectedPostIndex(null);
      setViewPost(false);
      // Restore post to hiding the trash icon to prevent error
      const restorePosts = [...mockPosts];
      let lastIndex = restorePosts[selectedPostIndex].lastIndexOf("hideTrashIcon") !== -1 ? restorePosts[selectedPostIndex].lastIndexOf("hideTrashIcon") : restorePosts[selectedPostIndex].lastIndexOf("post__delete-icon");
      restorePosts[selectedPostIndex][lastIndex] = "hideTrashIcon";
      setMockPosts(restorePosts);
    }
  };

  const toggleDeleteIcon = (array, type, index) => {
    const newArray = [...array];
    if (index === -1){
      let lastIndex = newArray.lastIndexOf("hideTrashIcon") !== -1 ? newArray.lastIndexOf("hideTrashIcon") : newArray.lastIndexOf("post__delete-icon");
      newArray[lastIndex] = newArray[lastIndex] === "hideTrashIcon" ? "post__delete-icon" : "hideTrashIcon";
      setSelectedPost(newArray);
    }
    else if (type === "post"){
      let lastIndex = newArray[index].lastIndexOf("hideTrashIcon") !== -1 ? newArray[index].lastIndexOf("hideTrashIcon") : newArray[index].lastIndexOf("post__delete-icon");
      newArray[index][lastIndex] = newArray[index][lastIndex] === "hideTrashIcon" ? "post__delete-icon" : "hideTrashIcon";
      setMockPosts(newArray);
    } else if (type === "replies") {
      let lastIndex = newArray[selectedPostIndex][index].lastIndexOf("hideTrashIcon") !== -1 ? newArray[selectedPostIndex][index].lastIndexOf("hideTrashIcon") : newArray[selectedPostIndex][index].lastIndexOf("post__delete-icon");
      newArray[selectedPostIndex][index][lastIndex] = newArray[selectedPostIndex][index][lastIndex] === "hideTrashIcon" ? "post__delete-icon" : "hideTrashIcon";
      setMockReplies(newArray);
    }
  };

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

  const handleAddReply = () => {
    if (username === ''){
      alert("You must be signed in to create a reply");
      return;
    }
    const updatedMockReplies = [...mockReplies];
    let newReply = [username, getFormattedDateTime(), createReplyText, 0, "hideTrashIcon"];
    updatedMockReplies[selectedPostIndex].unshift(newReply);
    setMockReplies(updatedMockReplies);
    setCreateReplyText('');
  }

  const handleTempRemoveSpoilerMessage = (index) => {
    const restorePosts = [...mockPosts];
    let lastIndex = restorePosts[index].lastIndexOf(true);
    restorePosts[index][lastIndex] = false;
    setMockPosts(restorePosts);
  }

  const handleTempRemoveAllSpoilers = () => {
    let restorePosts = [...mockPosts];
    if (restorePosts.length > 0){
      restorePosts.map((post) => {
        post[8] = false;
        return post;
      });
    }
    setMockPosts(restorePosts);
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
              <p onClick={() => handleViewProfile(username)}>{username}</p>
              <div className="cinematica__profile-circle" onClick={() => setDropdownVisible(!dropdownVisible)}></div>
              {dropdownVisible && (
              <div className="dropdown-menu">
                <p onClick={() => handleViewProfile(username)}>Profile</p>
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
          <div onClick={() => alert('test')}>All posts</div>
          <div onClick={() => alert('test')}>Following</div>
        </div>
      </header>
      {movieId >= 0 ? (<MovieDetails movieId={movieId} handleToggleMovieDetails={handleToggleMovieDetails} />) :
      (<div className="feed-container">
        {/* Create post */}
        {viewPost === false && <form className="form" onSubmit={handleSubmit}>
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
        <div className="post-container">
           {/* Pre-posts */}
          <label for="revealAllSpoilers">Reveal all potential spoiler posts</label>
          <input type="radio" value="revealAllSpoilers" onChange={(e) => handleTempRemoveAllSpoilers()} />
          {/* Posts, mapped out */}
          {viewPost === false && 
             mockPosts.map((post, index) => (
                <div className="mock-post" onMouseEnter={e => toggleDeleteIcon(mockPosts, "post", index)} onMouseLeave={e => toggleDeleteIcon(mockPosts, "post", index)}>
                    <div className="post__details">
                        <div className="post__author-container">
                          <div className="cinematica__profile-circle" onClick={() => handleViewProfile(post[0])}></div>
                          <div>
                              <p className="post-author" onClick={() => handleViewProfile(post[0])}>{post[0]}</p>
                          </div>
                        </div>
                        <div>
                          <p className="post-date">{post[1]}</p>
                        </div>
                    </div>
                    {post[0] === username && <div className={post[7]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                    {post[8] === false || post[0] === username ? <p className="post-content">{post[2]}</p> : <p className="post-content" onClick={() => handleTempRemoveSpoilerMessage(index)}>Warning: Potential spoilers! Click this text or "Replies" to reveal...</p>}
                    {post[3] !== '' && (post[8] === false || post[0] === username) && <img src={post[3]} alt={`Post ${index}`} className="post-image" />}
                    <p className="post-movie" onClick={() => handleToggleMovieDetails(post[9])}><i class='fa fa-film'></i> {post[4]}</p>
                    <div className="post-stats">
                        <div className="post-likes"><i class='	fa fa-heart-o'></i> {post[5]}</div>
                        <div className="post-comments" onClick={() => handleToggleReplies(index)}>{mockReplies[index].length} Replies</div>
                    </div>
                </div>
            ))}
            {/* Selected post with reply section */}
            {viewPost === true && (<div>
              <button className="back" onClick={() => handleToggleReplies("none")}><i class='fa fa-arrow-left'></i>&emsp;Back</button>
              <div className="mock-post" onMouseEnter={e => toggleDeleteIcon(selectedPost, "post", -1)} onMouseLeave={e => toggleDeleteIcon(selectedPost, "post", -1)}>
                <div className="post__details">
                    <div className="post__author-container">
                      <div className="cinematica__profile-circle" onClick={() => handleViewProfile(selectedPost[0])}></div>
                      <div>
                          <p className="post-author" onClick={() => handleViewProfile(selectedPost[0])}>{selectedPost[0]}</p>
                      </div>
                    </div>
                    <div>
                      <p className="post-date">{selectedPost[1]}</p>
                    </div>
                </div>
                {selectedPost[0] === username && <div className={selectedPost[7]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                <p className="post-content">{selectedPost[2]}</p>
                {selectedPost[3] !== '' && <img src={selectedPost[3]} alt={`Post`} className="post-image" />}
                <p className="post-movie" onClick={() => handleToggleMovieDetails(selectedPost[9])}><i class='fa fa-film'></i> {selectedPost[4]}</p>
                <div className="post-stats">
                    <div className="post-likes"><i class='	fa fa-heart-o'></i> {selectedPost[5]}</div>
                    <div className="post-comments" onClick={() => handleToggleReplies("none")}>{mockReplies[selectedPostIndex].length} Replies</div>
                </div>
              </div>
              <br/>
              {/* Create reply */}
              <div className="comment-box__container">
                <input type="text" className="comment-box__text" value={createReplyText} maxLength={280} placeholder="Write your reply..." onChange={(e) => setCreateReplyText(e.target.value)} required />
                <i class='fa fa-send' onClick={() => handleAddReply()}></i>
              </div>
              <div>
              {/* Replies for selected post, mapped out */}
              {selectedPostIndex != null && mockReplies[selectedPostIndex].map((replies, index) => (
                <div className="mock-post" onMouseEnter={e => toggleDeleteIcon(mockReplies, "replies", index)} onMouseLeave={e => toggleDeleteIcon(mockReplies, "replies", index)}>
                    <div className="post__details">
                        <div className="post__author-container">
                        <div className="cinematica__profile-circle" onClick={() => handleViewProfile(replies[0])}></div>
                        <div>
                            <p className="post-author" onClick={() => handleViewProfile(replies[0])}>{replies[0]}</p>
                        </div>
                        </div>
                        <div>
                          <p className="post-date">{replies[1]}</p>
                        </div>
                    </div>
                    {replies[0] === username && <div className={replies[4]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                    <p className="post-content">{replies[2]}</p>
                    <div className="post-stats">
                        <div className="post-likes"><i class='	fa fa-heart-o'></i> {replies[3]}</div>
                    </div>
                </div>
              ))}
            </div>
          </div>)}
        </div> 
      </div>)}
    </div>
  );
};
    
export default Timeline;