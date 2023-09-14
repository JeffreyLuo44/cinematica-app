import React, { useState, useEffect } from 'react';
import MovieDetails from './MovieDetails';
import Posts from './Posts';

const Timeline = ({setPage, userId, handleViewProfile, username, setUsername  }) => {  
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [createPostText, setCreatePostText] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [showImageTrashIcon, setShowImageTrashIcon] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isCreateSpoilerPost, setIsCreateSpoilerPost] = useState(false);

  const [moviesTaggedCreatePost, setMoviesTaggedCreatePost] = useState([]);
  const [moviesIdsTaggedCreatePost, setMoviesIdsTaggedCreatePost] = useState([]);

  const [posts, setPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const [postTab, setPostTab] = useState("allposts");
  const [movieId, setMovieId] = useState(-1);

  useEffect(() => {
    getPostsTimeline(postTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPostPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postTab]);

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
    if (userId === ''){
      alert("You must be signed in to create a post");
      return;
    }
    console.log("Post!");

    // let imageUrl = '';
    // if (imageFile) {
    //   imageUrl = URL.createObjectURL(imageFile);
    // }

    // Post creation
    const date = new Date();
    // updatedPosts.unshift(newPost);
    // const updatedReplies = [...replies];
    // updatedReplies.unshift([]);
    // setPosts(updatedPosts);
    // setReplies(updatedReplies);
    // Send post data to server
    // fetch('http://localhost:3001/post', {
    // Send post data to server
    fetch('https://localhost:53134/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newPost: {
          userId: userId,
          createdAt: date.toISOString(),
          body: createPostText,
          image: imageFile,
          isSpoiler: isCreateSpoilerPost,
        },
        movieIds: moviesIdsTaggedCreatePost
      })
    })
    .then(response => {
      if (response.ok) { // Check if the response status code is in the 2xx range
        //Reset create post states
        setCreatePostText('');
        setSearchTag('');
        setMoviesTaggedCreatePost([]);
        setImageFile(null);
        setIsCreateSpoilerPost(false);
      } else {
        return response.json().then(data => {
          console.error('Request failed with status: ' + response.status);
          alert(data.message);
        });
      }
      })
      .catch(error => {
        console.error('Error during post creation:', error);
      });
  };

  const handleLogout = () => {
    setUsername('');
    setPage('login');
  }

  // function getFormattedDateTime(){
  //   let currentDate = new Date(); 
  //   // Month is 0 based.
  //   let currentMonth = currentDate.getMonth() + 1;
  //   let yearTwoDigits = currentDate.getFullYear() - 2000;
  //   let currentHours = currentDate.getHours() > 12 ? currentDate.getHours() - 12 : currentDate.getHours();
  //   let currentMinutes = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes(): currentDate.getMinutes();
  //   let amOrPM = currentDate.getHours() > 11 ? "pm" : "am";
  //   return currentDate.getDate() + "/" + currentMonth + "/" + yearTwoDigits + " " +  currentHours + ":" + currentMinutes + amOrPM;
  // }

  // function getFormattedPostCreatedAt(createdAt) {
  //   const dateAndTime = createdAt.split('T');
  //   const date = dateAndTime[0].split('-');
  //   const time = dateAndTime[1].split(':');
  //   const yearTwoDigits = date[0] - 2000;
  //   const amOrPM = time[0] > 11 ? "pm" : "am";
  //   return date[2] + "/" + date[1] + "/" + yearTwoDigits + " " + time[0] + ":" + time[1] + amOrPM;
  // }

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
  const searchMovie = (search) => {
    if (search === ""){
      setSearchResults([]);
      //To get rid of the small empty search result
      document.getElementById("search-results").style.visibility = "hidden";
      return;
    }
    document.getElementById("search-results").style.visibility = "visible";

    try {
      // Send movie id to server
      fetch('https://localhost:53134/api/movies/search/' + search, {
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
    let updatedMoviesIdsTaggedCreatePost = [...moviesIdsTaggedCreatePost];
    let newMovieTagged = {
      id: id,
      title: title,
      releaseYear: releaseYear
    }
    updatedMoviesTaggedCreatePost.push(newMovieTagged);
    updatedMoviesIdsTaggedCreatePost.push(id);
    setMoviesTaggedCreatePost(updatedMoviesTaggedCreatePost);
    setMoviesIdsTaggedCreatePost(updatedMoviesIdsTaggedCreatePost);
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
    setPostTab(tab);
    getPostsTimeline(tab);
  }

  const getPostsTimeline = (tab) => {
    let fetchUrl = "";
    if (tab === "allposts"){
      fetchUrl = 'https://localhost:53134/api/posts/all/' + postPage  + '?userId=' + userId;
    } 
    else if (tab === "following"){
      fetchUrl = 'https://localhost:53134/api/posts/following/' + userId + '/' + postPage;
    }
    else {
      setPosts([]);
      return;
    }

    //Get particular page of post from the server
    fetch(fetchUrl, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (response.ok) { // Check if the response status code is in the 2xx range
          return response.json().then(data => {
            setPosts(data);
          });
      } else {
          alert(response.title);
      }
    })
    .catch(error => {
      console.error('Error during getting post details', error);
    });
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
      </header>
      {movieId >= 0 ? (<MovieDetails userId={userId} movieId={movieId} handleToggleMovieDetails={handleToggleMovieDetails} />) :
      (<div className="feed-container">
        {/* Create post */}
        {<form className="form" onSubmit={handleSubmit}>
          <div>
            <textarea className="post__text" placeholder="What's on your mind?" maxLength={280} value={createPostText} onChange={(e) => setCreatePostText(e.target.value)} required />
            <div>
              <input type="text" className="searchBar search__timeline" value={searchTag} placeholder="Pick movie you're talking about..." onChange={(e) => {setSearchTag(e.target.value); searchMovie(e.target.value);}} /><br/>
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
        {/* Timeline tabs */}
        <div className="timeline__tabs">
          <div onClick={(event) => changeTab(event, "allposts")} className="tab--clicked">All posts</div>
          <div onClick={(event) => changeTab(event, "following")}>Following</div>
        </div>
         {/* Posts */}
         <Posts userId={userId} postTab={postTab} posts={posts} setPosts={setPosts} postPage={postPage} handleViewProfile={handleViewProfile} handleToggleMovieDetails={handleToggleMovieDetails} />
      </div>)}
    </div>
  );
};
    
export default Timeline;