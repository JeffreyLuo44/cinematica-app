import React, { useState, useEffect } from 'react';
import MovieDetails from './MovieDetails';
import Posts from './Posts';
import InfiniteScroll from 'react-infinite-scroll-component';

const Timeline = ({setPage, idToken, userId, handleViewProfile, username, setUsername  }) => {  
  const apiUrlPrefix = process.env.REACT_APP_API_URL_PREFIX;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDetails, setUserDetails] = useState([]);

  const [createPostText, setCreatePostText] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [showImageTrashIcon, setShowImageTrashIcon] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [postWidth, setPostWidth] = useState(0);
  const [isCreateSpoilerPost, setIsCreateSpoilerPost] = useState(false);

  const [moviesTaggedCreatePost, setMoviesTaggedCreatePost] = useState([]);
  const [moviesIdsTaggedCreatePost, setMoviesIdsTaggedCreatePost] = useState([]);

  const [posts, setPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const [postTab, setPostTab] = useState("allposts");

  const [replies, setReplies] = useState([]);
  const [replyPage, setReplyPage] = useState(1);
  const [viewReplies, setViewReplies] = useState([]);

  const [movieId, setMovieId] = useState(-1);

  useEffect(() => {
    getPostsTimeline(postTab, 1);
    if (userId !== '')
      getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPosts([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postTab]);

  const handleToggleImageTrashIcon = (event) => {
    event.stopPropagation();
    if (showImageTrashIcon === true)
      setShowImageTrashIcon(false);
    else
      setShowImageTrashIcon(true);
  }

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
    if (moviesIdsTaggedCreatePost.length === 0){
      alert("You must tag at least one movie to post");
      return;
    }
    if (imageFile !== null) {
      const formData = new FormData();
      formData.append('imageFile', imageFile);
      fetch(apiUrlPrefix + 'posts/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          handleAddPost(data.fileName);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      handleAddPost("");
    }
  };

  const handleAddPost = (generatedImageFileName) => {
    // Post creation
    const date = new Date();
    // Send post data to server
    fetch(apiUrlPrefix + 'posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        newPost: {
          userId: userId,
          createdAt: date.toISOString(),
          body: createPostText,
          isSpoiler: isCreateSpoilerPost,
          image: generatedImageFileName,
        },
        movieIds: moviesIdsTaggedCreatePost
      })
    })
    .then(response => {
      if (response.ok) { // Check if the response status code is in the 2xx range
        return response.json().then(data => {
          let updatedPosts = [data, ...posts];
          setPosts(updatedPosts);
          //Reset create post states
          setCreatePostText('');
          setSearchTag('');
          setMoviesTaggedCreatePost([]);
          setMoviesIdsTaggedCreatePost([]);
          setImageFile(null);
          setIsCreateSpoilerPost(false);
     });
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
  }

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setPage('login');
  }

  // Simulate a click to find an image
  const handleImageIconClick = () => {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
  };

  const handleImageUpload = (e) => {
    const selectedImageFile = e.target.files[0];
    // Size is given in bytes
    if (selectedImageFile.size / 1024 / 1024 > 1)
      alert("The file size should be within 1 MB!");
    else
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
      fetch(apiUrlPrefix + 'movies/search/' + search, {
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
      fetch(apiUrlPrefix + 'movies/' + id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
          updatedMoviesTaggedCreatePost.push(newMovieTagged);
          updatedMoviesIdsTaggedCreatePost.push(id);
          setMoviesTaggedCreatePost(updatedMoviesTaggedCreatePost);
          setMoviesIdsTaggedCreatePost(updatedMoviesIdsTaggedCreatePost);
        } else {

        }
    })
    .catch(error => {
        console.error('Error during getting movie details', error);
    });

    // Reset the search bar and results
    setSearchTag("");
    document.getElementById("search-results").style.visibility = "hidden";
  }

  const handleDeleteTaggedMovie = (id) => {
    let updatedMoviesTaggedCreatePost = [...moviesTaggedCreatePost];
    let updatedMoviesIdsTaggedCreatePost = [...moviesIdsTaggedCreatePost];
    const movieIndex = moviesTaggedCreatePost.findIndex(movie => movie.id === id);
    updatedMoviesTaggedCreatePost.splice(movieIndex, 1);
    updatedMoviesIdsTaggedCreatePost.splice(movieIndex, 1);
    setMoviesTaggedCreatePost(updatedMoviesTaggedCreatePost);
    setMoviesIdsTaggedCreatePost(updatedMoviesIdsTaggedCreatePost);
  }

  const handleViewTimeline = () => {
    setMovieId(-1);
  }

  const changeTab = (e, tab) => {
    if (tab === "following" && userId === ''){
      alert("Please sign in to view posts from who you are following!");
      return;
    }
    const tabs = document.getElementsByClassName("timeline__tabs")[0].childNodes;
    tabs.forEach((item, index) => {
        if (item.classList.contains("tab--clicked")) {
            item.classList.remove("tab--clicked");
        }
    })
    e.target.classList.add("tab--clicked");
    setPosts([]);
    setReplies([]);
    setPostPage(1);
    getPostsTimeline(tab, 1);
  }

  const getPostsTimeline = async (tab, page) => {
    setPostTab(tab);
    setReplies([]);
    let fetchUrl = "";
    let headers = null;
    if (tab === "allposts"){
      fetchUrl = apiUrlPrefix + 'posts/all/' + page  + '?userId=' + userId;
      headers = {
        'Content-Type': 'application/json'
      };
    } 
    else if (tab === "following"){
      fetchUrl = apiUrlPrefix + 'posts/following/' + userId + '/' + page;
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      }
    }
    else {
      setPosts([]);
      return;
    }

    //Get particular page of post from the server
    await fetch(fetchUrl, {
      method: 'GET',
      headers: headers,
    })
    .then(response => {
      if (response.ok) { // Check if the response status code is in the 2xx range
          return response.json().then(data => {
            if (data.length > 0 && postTab === tab){
              let updatedPosts = [...posts, ...data];
              setPosts(updatedPosts);
              setPostPage(page + 1);
            } else if (data.length > 0 && postTab !== tab) {
              setPosts(data);
              setPostPage(page + 1);
            }
          });
      } else {
          alert(response.title);
      }
    })
    .catch(error => {
      console.error('Error during getting post details', error);
    });
  }

  const getUserDetails = () => {
    // Send profile id to server
    fetch(apiUrlPrefix + 'users/' + userId, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              setUserDetails(data);
            });
        } else {
            alert(response.title);
        }
    })
    .catch(error => {
        console.error('Error during getting user details', error);
    });
  }

  const loadPostWidth = () => {
    setPostWidth(document.getElementById("image-preview").clientWidth);
  }

  return (
    <div className="cinematica__content">
      {/* Header */}
      <header>
        <div className="cinematica__header-upper">
          <p className="cinematica__logo logo__size-2 logo__colour-2" onClick={() => handleViewTimeline()}>Cinematica</p>
          <div>
            <img className="TMDB-logo" src="TMDB-logo.svg" alt="" />
            <i class="fa fa-home" aria-hidden="true" onClick={() => handleViewTimeline()}></i>
            {userId !== "" ? <div>
              <p onClick={() => handleViewProfile(userId)}>{username}</p>
              <div className="cinematica__profile-circle" onClick={() => setDropdownVisible(!dropdownVisible)}><img src={userDetails.profile_picture} alt="" /></div>
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
      {movieId >= 0 ? (<MovieDetails idToken={idToken} userId={userId} movieId={movieId} handleToggleMovieDetails={handleToggleMovieDetails} />) :
      (<div className="feed-container">
        {/* Create post */}
        {userId !== '' && <form className="form" onSubmit={handleSubmit}>
          <div>
            <textarea className="post__text" placeholder="What's on your mind?" maxLength={1000} value={createPostText} onChange={(e) => setCreatePostText(e.target.value)} required />
            <div>
              <input type="text" className="searchBar search__timeline" value={searchTag} placeholder="Pick movie you're talking about..." onChange={(e) => {setSearchTag(e.target.value); searchMovie(e.target.value);}} /><br/>
            </div>
            <div id="search-results" className="search-results">
              {/* Display search results here */}
              {searchResults.length > 0 && searchTag !== "" ? searchResults.map((result) => (
                <div key={result.id} onClick={() => handleAddTaggedMovie(result.id, result.title, result.releaseYear)}>{result.title} ({result.releaseYear})</div>
              )) : <div>No movies found</div>}
            </div>
            {moviesTaggedCreatePost.length > 0 && <br/>}
            <div className="post-movie-search">
              {moviesTaggedCreatePost.map((taggedMovie) => (
                <div>
                  <span key={taggedMovie.id} onClick={() => handleToggleMovieDetails(taggedMovie.id)}><i class='fa fa-film'></i> {taggedMovie.title} ({taggedMovie.releaseYear})</span>&nbsp;
                  <span className="tag__delete-icon"><i class="fa fa-trash" aria-hidden="true" onClick={() => handleDeleteTaggedMovie(taggedMovie.id)}></i></span>
                </div>
              ))}
            </div>
          </div>
          {/* Display image preview */}
          {imageFile && <div className="image-preview-container" id="image-preview" onLoad={() => loadPostWidth()} onMouseEnter={() => setShowImageTrashIcon(true)} onMouseLeave={() => setShowImageTrashIcon(false)}
          onTouchStart={(e) => handleToggleImageTrashIcon(e)}>
            {showImageTrashIcon === true && <div className="post__delete-icon"><i class="fa fa-trash" aria-hidden="true" onClick={() => setImageFile(null)}></i></div>}
            <div className="image-preview-wrapper"><br/><img src={URL.createObjectURL(imageFile)} alt="Selected" className="image-preview"  style={{ maxHeight: postWidth * 1.5, width: postWidth }} /></div>
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
        <div className="sticky">
          <div className="timeline__tabs">
            <div onClick={(event) => changeTab(event, "allposts")} className="tab--clicked">All posts</div>
            <div onClick={(event) => changeTab(event, "following")}>Following</div>
          </div>
        </div>
         {/* Posts */}
         <InfiniteScroll
            dataLength={posts.length}
            next={() => getPostsTimeline(postTab, postPage)}
            hasMore={true}
          >
          <Posts idToken={idToken} userId={userId} postTab={postTab} posts={posts} setPosts={setPosts} postPage={postPage} setPostPage={setPostPage} replies={replies} setReplies={setReplies} replyPage={replyPage} setReplyPage={setReplyPage} viewReplies={viewReplies} setViewReplies={setViewReplies} 
          handleViewProfile={handleViewProfile} handleToggleMovieDetails={handleToggleMovieDetails} />
        </InfiniteScroll>
      </div>)}
    </div>
  );
};
    
export default Timeline;