import React, { useState, useEffect } from 'react';
import MovieDetails from './MovieDetails';
import Posts from './Posts';

const Profile = ({setPage, userId, username, setUsername, mockPosts, setMockPosts, mockReplies, setMockReplies}) => {
  const [notificationOn, setNotificationOn] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileDetails, setProfileDetails] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [viewFollowers, setViewFollowers] = useState(false);
  const [viewFollowing, setViewFollowing] = useState(false);
  // const [viewProfileUserId, setViewProfileUserId] = useState('93cfcbd6-54b6-4961-bec5-0cf6e0a81917');
  const [viewProfileUserId, setViewProfileUserId] = useState('a33c0775-1406-4cc3-81ec-16151ecc4ade');
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

    // There will be a fetch request that gets the movie details by id.
    useEffect(() => {
      getAllProfileInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    useEffect(() => {
      checkIfFollowed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followerList]);

  const getAllProfileInfo = () => {
    getProfileDetails();
    getFollowerList();
    getFollowingList();
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

  const getFollowerList = () => {
    fetch('https://localhost:53134/api/users/followers/' + viewProfileUserId, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
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

  const getFollowingList = () => {
    fetch('https://localhost:53134/api/users/following/' + viewProfileUserId, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              setFollowingList(data);
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

  const handleViewProfile = (userId) => {
    /* Need to get username so this needs to be changed */
    setViewProfileUserId(userId);
    setPage("profile");
  }

  const handleViewTimeline = () => {
    setMovieId(-1);
    setViewProfileUserId('');
    setPage("timeline");
  }

  const handleToggleNotifications = () => {
    setNotificationOn(!notificationOn);
    /* Need to apply to database */
  }

  const handleFollowUser = () => {
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
        alert("Followed!");
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

  const handleUnfollowUser = () => {
    // Send id data to server
    fetch('https://localhost:53134/api/users/unfollow', {
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
        alert("Unfollowed!");
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
          <div className="profile__background">
            {userId === viewProfileUserId && <i class='fa fa-edit'></i>}
          </div>
          {/* Profile picture and username */}
          <div className="profile__name-photo-container">
            <div className="profile__picture"></div>
            <p className="profile__username">{profileDetails.username}</p>
          </div>
          {/* Follower counts */}
          <div className="profile__stats">
            <div className="profile__follow-stats">
              <p onClick={() => setViewFollowing(true)}><strong>{profileDetails.following_count}</strong> Following</p>
              <p onClick={() => setViewFollowers(true)}><strong>{profileDetails.follower_count}</strong> Followers</p>
            </div>
            {isFollowed === false && userId !== viewProfileUserId && <div className="profile__follow-button" onClick={() => handleFollowUser()}>Follow</div>}
            {isFollowed === true && userId !== viewProfileUserId && <div className="profile__follow-button--followed" onClick={() => handleUnfollowUser()}>Unfollow</div>}
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
        {postTab !== "movies" ? (<Posts username={username} mockPosts={mockPosts} setMockPosts={setMockPosts} mockReplies={mockReplies} setMockReplies={setMockReplies} handleViewProfile={handleViewProfile} handleToggleMovieDetails={handleToggleMovieDetails} />) 
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
                    <p className="post-author" onClick={() => alert('test')}>{follower.followerId}</p>
                </div>
              </div>
              <div className="profile__follow-button">Follow</div>
              
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
                <p className="post-author" onClick={() => alert('test')}>{following.followingId}</p>
                </div>
              </div>
              <div className="profile__follow-button--followed">Following</div>
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