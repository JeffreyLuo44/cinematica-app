import React, { useState, useEffect } from 'react';
import MovieDetails from './MovieDetails';
import Posts from './Posts';
import InfiniteScroll from 'react-infinite-scroll-component';

const Profile = ({setPage, idToken, userId, viewProfileUserId, setViewProfileUserId, handleViewProfile, username, setUsername}) => {
  const apiUrlPrefix = process.env.REACT_APP_API_URL_PREFIX;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [profileDetails, setProfileDetails] = useState([]);
  const [profileDetailsLoaded, setProfileDetailsLoaded] = useState(false);
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [ownFollowingList, setOwnFollowingList] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [viewFollowers, setViewFollowers] = useState(false);
  const [viewFollowing, setViewFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const [postTab, setPostTab] = useState("posts");

  const [replies, setReplies] = useState([]);
  const [replyPage, setReplyPage] = useState(1);
  const [viewReplies, setViewReplies] = useState([]);

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
    getPostsProfile(postTab, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    useEffect(() => {
      getAllProfileInfo();
      if (userId !== '')
        getUserDetails();
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
      fetch(apiUrlPrefix + 'users/' + viewProfileUserId, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              setProfileDetails(data);
              console.log(data);
              setProfileDetailsLoaded(true);
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
    fetch(apiUrlPrefix + 'users/followers/' + id, {
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
    fetch(apiUrlPrefix + 'users/following/' + id, {
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
    let isUserIdInArray = followerList.some(user => user.userId === userId);
    setIsFollowed(isUserIdInArray);
  }

  const getMovieList =() => {
    fetch(apiUrlPrefix + 'users/movies/' + viewProfileUserId, {
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
    localStorage.removeItem('user_id');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
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
    setIsFollowed(true);
    profileDetails.follower_count++;
    // Send id data to server
    fetch(apiUrlPrefix + 'users/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
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
    setIsFollowed(false);
    profileDetails.follower_count--;
    // Send id data to server
    fetch(apiUrlPrefix + 'users/unfollow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
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

  const handleCoverPictureUpload = async (e) => {
    const selectedImageFile = e.target.files[0];
    // Size is given in bytes
    if (selectedImageFile.size / 1024 / 1024 > 1){
      alert("The file size should be within 1 MB!");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImageFile);
    reader.onload = function () {
      const base64String = reader.result.split(',')[1];
      fetch(apiUrlPrefix + 'users/set-cover-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: userId,
          image: {
            fileData: base64String,
            contentType: selectedImageFile.type,
          }
        })
      })
        .then(response => response.json())
        .then(data => {
          getAllProfileInfo();
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
  };

  // Simulate a click to find an image
  const handleSetProfilePicture = () => {
    if (userId !== viewProfileUserId)
      return;

    const imageInput = document.getElementById('profilePictureInput');
    imageInput.click();
  }

  // Simulate a click to find an image
  const handleProfilePictureUpload = async (e) => {
    const selectedImageFile = e.target.files[0];
    // Size is given in bytes
    if (selectedImageFile.size / 1024 / 1024 > 1){
      alert("The file size should be within 1 MB!");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImageFile);
    reader.onload = function () {
      const base64String = reader.result.split(',')[1];
      fetch(apiUrlPrefix + 'users/set-profile-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: userId,
          image: {
            fileData: base64String,
            contentType: selectedImageFile.type,
          }
        })
      })
        .then(response => response.json())
        .then(data => {
          getAllProfileInfo();
          getUserDetails();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  const changeTab = (e, tab) => {
    const tabs = document.getElementsByClassName("profile__tabs")[0].childNodes;
    tabs.forEach((item, index) => {
        if (item.classList.contains("tab--clicked")) {
            item.classList.remove("tab--clicked");
        }
    })
    e.target.classList.add("tab--clicked");
    setPosts([]);
    setReplies([]);
    if (tab === "movies"){
      setPostTab("movies");
    }
    setPostPage(1);
  }

  const getPostsProfile = async (tab, page) => {
    setPostTab(tab);
    setReplies([]);
    //Get particular page of post from the server
    await fetch(apiUrlPrefix + 'users/posts/' + viewProfileUserId + '/' + page, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
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
            } else {
              document.getElementById("loadingIndicatorProfilePosts").style.display = "none";
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

  const getRepliesProfile = (tab, page) => {
    setPostTab(tab);
    setPosts([]);
      //Get particular page of post from the server
      fetch(apiUrlPrefix + 'users/replies/' + viewProfileUserId + '/' + page, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      })
      .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              if (data.length > 0 && postTab === tab){
                let updatedReplies = [...replies, ...data];
                setReplies(updatedReplies);
                setReplyPage(page + 1);
              } else if (data.length > 0 && postTab !== tab) {
                setReplies(data);
                setReplyPage(page + 1);
              } else {
                document.getElementById("loadingIndicatorProfileReplies").style.display = "none";
              }
              setViewReplies(true);
            });
        } else {
            alert(response.title);
        }
      })
      .catch(error => {
        console.error('Error during getting reply details', error);
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
              <div className="cinematica__profile-circle" onClick={() => setDropdownVisible(!dropdownVisible)}><img src={userDetails.profile_picture} alt=""  className="post-image" /></div>
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
      {movieId >= 0 ? (<MovieDetails idToken={idToken} userId={userId} movieId={movieId} handleToggleMovieDetails={handleToggleMovieDetails} />) :
      (<div className="feed-container">
        {(viewFollowing === false && viewFollowers === false) && (<div>
        <div className="profile__container">
          {/* Banner */}
          {/* Hide default "browse" control */}
          <input type="file" accept="image/*" id="coverPictureInput" style={{ display: 'none' }} onChange={handleCoverPictureUpload} />
          <div className="profile__background">
            <img src={profileDetails.cover_picture} alt=""  className="post-image" />
            <div className="profile__background__edit">
              {userId === viewProfileUserId && <i class='fa fa-edit'  onClick={() => {handleSetCoverPicture()}}></i>}
            </div>
          </div>
          {/* Profile picture and username */}
          {/* Hide default "browse" control */}
          <input type="file" accept="image/*" id="profilePictureInput" style={{ display: 'none' }} onChange={handleProfilePictureUpload} />
          <div className="profile__name-photo-container">
            <div className="profile__picture"  onClick={() => {handleSetProfilePicture()}}><img src={profileDetails.profile_picture} alt=""  className="post-image" /></div>
            <div className="profile__username-container">
              <p className="profile__username">{ profileDetailsLoaded === true ? <strong>{profileDetails.username}</strong> : <div id="loadingIndicator" class="loading__centre loading__colour-profile"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div> }</p>
            </div>
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
            <div onClick={(event) => {changeTab(event, "posts"); getPostsProfile("posts", 1);}} className="tab--clicked">Posts</div>
            <div onClick={(event) => {changeTab(event, "replies"); getRepliesProfile("replies", 1);}}>Replies</div>
            <div onClick={(event) => changeTab(event, "movies")}>Movies</div>
          </div>
        </div>
        <br/>
        {/* Posts */}
        
        {postTab === "posts" && (
          <InfiniteScroll
            dataLength={posts.length}
            next={() => getPostsProfile(postTab, postPage)}
            hasMore={true}
            loader={<div id="loadingIndicatorProfilePosts" class="loading__centre"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>}
            >
          <Posts idToken={idToken} userId={userId} posts={posts} setPosts={setPosts} postPage={postPage} setPostPage={setPostPage} replies={replies} setReplies={setReplies} replyPage={replyPage} setReplyPage={setReplyPage} viewReplies={viewReplies} setViewReplies={setViewReplies} profileUsername={profileDetails.username} profilePicture={profileDetails.profile_picture}
          handleViewProfile={handleViewProfile} handleToggleMovieDetails={handleToggleMovieDetails} />
          </InfiniteScroll>) }
        {postTab === "replies" && (
          <InfiniteScroll
            dataLength={replies.length}
            next={() => getRepliesProfile("replies", replyPage)}
            hasMore={true}
            loader={<div id="loadingIndicatorProfileReplies" class="loading__centre"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>}
            >
          <Posts idToken={idToken} userId={userId} posts={[]} setPosts={setPosts} postPage={postPage} setPostPage={setPostPage} replies={replies} setReplies={setReplies} replyPage={replyPage} setReplyPage={setReplyPage} viewReplies={viewReplies} setViewReplies={setViewReplies} profileUsername={profileDetails.username} profilePicture={profileDetails.profile_picture}
          handleViewProfile={handleViewProfile} handleToggleMovieDetails={handleToggleMovieDetails} />
          </InfiniteScroll>) }
        {postTab === "movies" && (
        <div>{movieList.map((movie) => (
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
                <div className="cinematica__profile-circle" onClick={() => {setProfileDetails([]); handleViewProfile(follower.userId); setViewFollowers(false);}}></div>
                <div>
                    <p className="post-author" onClick={() => {setProfileDetails([]); handleViewProfile(follower.userId); setViewFollowers(false); }}>{follower.username}</p>
                </div>
              </div>
              {userId !== viewProfileUserId && 
              userId !== follower.userId && ownFollowingList.some(user => user.userId === follower.userId) === false && <div className="profile__follow-button" onClick={() => handleFollowUser()}>Follow</div>}
              {userId !== viewProfileUserId && 
              ownFollowingList.some(user => user.userId === follower.userId) === true && <div className="profile__follow-button--followed" onClick={() => handleUnfollowUser(viewProfileUserId, userId)}>Following</div>}

              {userId === viewProfileUserId && followerList.some(user => user.userId === follower.userId) === true && <div className="profile__follow-button--followed" onClick={() => handleUnfollowUser(userId, follower.userId)}>Remove</div>}
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
                <div className="cinematica__profile-circle" onClick={() => {handleViewProfile(following.userId); setViewFollowing(false);}}></div>
                <div>
                <p className="post-author" onClick={() => {handleViewProfile(following.userId); setViewFollowing(false);}}>{following.username}</p>
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