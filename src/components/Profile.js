import React, { useState, useEffect } from 'react';
import MovieDetails from './MovieDetails';
import Posts from './Posts';

const Profile = ({setPage, userId, viewProfileUserId, setViewProfileUserId, handleViewProfile, username, setUsername}) => {
  let startingPath = "https://localhost:53134/images/users/";
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileDetails, setProfileDetails] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [ownFollowingList, setOwnFollowingList] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [viewFollowers, setViewFollowers] = useState(false);
  const [viewFollowing, setViewFollowing] = useState(false);
  // const [viewProfileUserId, setViewProfileUserId] = useState('93cfcbd6-54b6-4961-bec5-0cf6e0a81917');
  // const [viewProfileUserId, setViewProfileUserId] = useState('a33c0775-1406-4cc3-81ec-16151ecc4ade');
  const [posts, setPosts] = useState([]);
  const [postPage] = useState(1);
  const [postTab, setPostTab] = useState("posts");

  const [movieList, setMovieList] = useState([]);

  const [movieId, setMovieId] = useState(-1);
  const handleToggleMovieDetails = (id) => {
    if (movieId === -1){
      setMovieId(id);
    } else {
      setMovieId(-1);
    }
  }

  useEffect(() => {
    getPostsProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    useEffect(() => {
      getAllProfileInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewProfileUserId, viewFollowers === false && viewFollowing === false]);

    useEffect(() => {
      checkIfFollowed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followerList]);

  const getAllProfileInfo = () => {
    getProfileDetails();
    getFollowerList(viewProfileUserId, true);
    getFollowingList(viewProfileUserId, true);
    getMovieList();
  }

  const getProfileDetails = () => {
      // Send profile id to server
      fetch('https://localhost:53134/api/users/' + viewProfileUserId, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              setProfileDetails(data);
            });
        } else {
            alert(response.title);
        }
    })
    .catch(error => {
        console.error('Error during getting user details', error);
    });
  }

  const getFollowerList = (id, profileView) => {
    fetch('https://localhost:53134/api/users/followers/' + id, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              if (profileView === true)
                setFollowerList(data);
            });
        } else {
            alert(response.title);
        }
    })
    .catch(error => {
        console.error('Error during getting user details', error);
    });
  }

  const getFollowingList = (id, profileView) => {
    fetch('https://localhost:53134/api/users/following/' + id, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              if (profileView === true)
                setFollowingList(data);
              else
                setOwnFollowingList(data);
            });
        } else {
            alert(response.title);
        }
    })
    .catch(error => {
        console.error('Error during getting user details', error);
    });
  }

  const checkIfFollowed = () => {
    let isUserIdInArray = followerList.some(user => user.followerId === userId);
    setIsFollowed(isUserIdInArray);
  }

  const getMovieList =() => {
    fetch('https://localhost:53134/api/users/movies/' + viewProfileUserId, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              setMovieList(data);
            });
        } else {
            alert(response.title);
        }
    })
    .catch(error => {
        console.error('Error during getting movie list', error);
    });
  }

  const handleLogout = () => {
    setUsername('');
    setPage('login');
  }

  const handleViewTimeline = () => {
    setMovieId(-1);
    setViewProfileUserId('');
    setPage("timeline");
  }

  const handleFollowUser = () => {
    if (userId === ''){
      alert("Sign in to follow!");
      return;
    }
    // Send id data to server
    fetch('https://localhost:53134/api/users/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: viewProfileUserId,
        followerId: userId,
      })
    })
    .then(response => {
      if (response.ok) { // Check if the response status code is in the 2xx range
        getAllProfileInfo();
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

  const handleUnfollowUser = (user_id, follower_id) => {
    // Send id data to server
    fetch('https://localhost:53134/api/users/unfollow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user_id,
        followerId: follower_id,
      })
    })
    .then(response => {
      if (response.ok) { // Check if the response status code is in the 2xx range
        getAllProfileInfo();
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

  const handleSetCoverPicture = () => {
    const imageInput = document.getElementById('coverPictureInput');
    imageInput.click();
  };

  const handleCoverPictureUpload = (e) => {
    const selectedImageFile = e.target.files[0];

    const formData = new FormData();
    formData.append('UserId', userId); 
    formData.append('File', selectedImageFile); 
    fetch('https://localhost:53134/api/users/set-cover-picture', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'form-data',
      },
    })
      .then(response => response.json())
      .then(data => {
        getAllProfileInfo();
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // Simulate a click to find an image
  const handleSetProfilePicture = () => {
    if (userId !== viewProfileUserId)
      return;

    const imageInput = document.getElementById('profilePictureInput');
    imageInput.click();
  }

  // Simulate a click to find an image
  const handleProfilePictureUpload = (e) => {
    const selectedImageFile = e.target.files[0];

    const formData = new FormData();
    formData.append('UserId', userId); 
    formData.append('File', selectedImageFile); 
    fetch('https://localhost:53134/api/users/set-profile-picture', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(data => {
        getAllProfileInfo();
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const changeTab = (e, tab) => {
    const tabs = document.getElementsByClassName("profile__tabs")[0].childNodes;
    tabs.forEach((item, index) => {
        if (item.classList.contains("tab--clicked")) {
            item.classList.remove("tab--clicked");
        }
    })
    e.target.classList.add("tab--clicked");
    setPostTab(tab);
  }

  const getPostsProfile = () => {
    let fetchUrl = "";
    if (postTab === "posts"){
      fetchUrl = 'https://localhost:53134/api/users/posts/' + userId + '/' + postPage;
    } 
    // else if (postTab === "replies"){
    //   fetchUrl = 'https://localhost:53134/api/users/replies/' + userId + '/' + postPage;
    // }
    // else if (postTab === "likes"){
    //   fetchUrl = 'https://localhost:53134/api/users/likes/' + userId + '/' + postPage;
    // }
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
        <div>
      </div>
      </header>
      {movieId >= 0 ? (<MovieDetails userId={userId} movieId={movieId} handleToggleMovieDetails={handleToggleMovieDetails} />) :
      (<div className="feed-container">
        {(viewFollowing === false && viewFollowers === false) && (<div>
        <div className="profile__container">
          {/* Banner */}
          {/* Hide default "browse" control */}
          <input type="file" accept="image/*" id="coverPictureInput" style={{ display: 'none' }} onChange={handleCoverPictureUpload} />
          <div className="profile__background">
            <img src={startingPath + profileDetails.coverPicture} alt=""/>
            {userId === viewProfileUserId && <i class='fa fa-edit'  onClick={() => {handleSetCoverPicture()}}></i>}
          </div>
          {/* Profile picture and username */}
          {/* Hide default "browse" control */}
          <input type="file" accept="image/*" id="profilePictureInput" style={{ display: 'none' }} onChange={handleProfilePictureUpload} />
          <div className="profile__name-photo-container">
            <div className="profile__picture"  onClick={() => {handleSetProfilePicture()}}><img src={startingPath + profileDetails.profilePicture} alt=""/></div>
            <p className="profile__username">{profileDetails.username}</p>
          </div>
          {/* Follower counts */}
          <div className="profile__stats">
            <div className="profile__follow-stats">
              <p onClick={() => {setViewFollowing(true); if (userId !== ""  && userId !== viewProfileUserId) {getFollowingList(userId, false);} }}><strong>{profileDetails.following_count}</strong> Following</p>
              <p onClick={() => {setViewFollowers(true); if (userId !== ""  && userId !== viewProfileUserId) {getFollowingList(userId, false);} else if (userId !== ""){getFollowerList(userId, false);}}}><strong>{profileDetails.follower_count}</strong> Followers</p>
            </div>
            {isFollowed === false && userId !== viewProfileUserId && <div className="profile__follow-button" onClick={() => handleFollowUser()}>Follow</div>}
            {isFollowed === true && userId !== viewProfileUserId && <div className="profile__follow-button--followed" onClick={() => handleUnfollowUser(viewProfileUserId, userId)}>Following</div>}
          </div>
          {/* Profile tabs */}
          <div className="profile__tabs">
            <div onClick={(event) => changeTab(event, "posts")} className="tab--clicked">Posts</div>
            <div onClick={(event) => changeTab(event, "replies")}>Replies</div>
            <div onClick={(event) => changeTab(event, "likes")}>Likes</div>
            <div onClick={(event) => changeTab(event, "movies")}>Movies</div>
          </div>
        </div>
        <br/>
        {/* Posts */}
        {postTab !== "movies" ? (<Posts userId={userId} postTab={postTab} posts={posts} setPosts={setPosts} postPage={postPage} handleViewProfile={handleViewProfile} handleToggleMovieDetails={handleToggleMovieDetails} />) 
        :
        (<div>{movieList.map((movie) => (
          <div key={movie.id} onClick={() => handleToggleMovieDetails(movie.id)}><i class='fa fa-film'></i> {movie.title} ({movie.releaseYear})</div>
        ))}</div>) }
      </div>)}
      {viewFollowers === true && (
        <div>
          <button className="back" onClick={() => setViewFollowers(false)}><i class='fa fa-arrow-left'></i>&emsp;Back</button>
          <div className="follow-list__header">Followers</div>
          <div className="follow-list__container">
            {followerList.map((follower) => (
            <div className="follow-list__item">
              <div className="follow-list__item-user">
                <div className="cinematica__profile-circle" onClick={() => alert('test')}></div>
                <div>
                    <p className="post-author" onClick={() => alert('test')}>{follower.username}</p>
                </div>
              </div>
              {userId !== viewProfileUserId && 
              userId !== follower.followerId && ownFollowingList.some(user => user.userId === follower.followerId) === false && <div className="profile__follow-button" onClick={() => handleFollowUser()}>Follow</div>}
              {userId !== viewProfileUserId && 
              ownFollowingList.some(user => user.followerId === follower.followerId) === true && <div className="profile__follow-button--followed" onClick={() => handleUnfollowUser(viewProfileUserId, userId)}>Following</div>}

              {userId === viewProfileUserId && followerList.some(user => user.followerId === follower.followerId) === true && <div className="profile__follow-button--followed" onClick={() => handleUnfollowUser(userId, follower.followerId)}>Remove</div>}
            </div>
            ))}
          </div>
        </div>
      )}
      {viewFollowing === true && (
        <div>
          <button className="back" onClick={() => setViewFollowing(false)}><i class='fa fa-arrow-left'></i>&emsp;Back</button>
          <div className="follow-list__header">Following</div>
          <div className="follow-list__container">
          {followingList.map((following) => (
            <div className="follow-list__item">
              <div className="follow-list__item-user">
                <div className="cinematica__profile-circle" onClick={() => alert('test')}></div>
                <div>
                <p className="post-author" onClick={() => alert('test')}>{following.username}</p>
                </div>
              </div>
              {userId !== viewProfileUserId && 
              userId !== following.userId && ownFollowingList.some(user => user.userId === following.userId) === false && <div className="profile__follow-button" onClick={() => handleFollowUser()}>Follow</div>}
              {userId !== viewProfileUserId && 
              ownFollowingList.some(user => user.userId === following.userId) === true && <div className="profile__follow-button--followed" onClick={() => handleUnfollowUser(viewProfileUserId, userId)}>Following</div>}

              {userId === viewProfileUserId && followingList.some(user => user.userId === following.userId) === true && <div className="profile__follow-button--followed" onClick={() => handleUnfollowUser(following.userId, userId)}>Remove</div>}
            </div>
          ))}
          </div>
        </div>
      )}
      </div>)}
    </div>
  );
};
    
export default Profile;