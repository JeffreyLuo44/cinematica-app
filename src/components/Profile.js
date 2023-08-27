import React, { useState } from 'react';

const Profile = ({setPage, identifier, setIdentifier, viewProfileUsername, setViewProfileUsername, mockPosts, setMockPosts, mockReplies, setMockReplies}) => {
  const [notificationOn, setNotificationOn] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [selectedPost, setSelectedPost] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [viewPost, setViewPost] = useState(false);
  const [createReplyText, setCreateReplyText] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Post!");
//     // Send post data to server
//     // fetch('http://localhost:3001/post', {
//   };

  const handleLogout = () => {
    setIdentifier('');
    setPage('login');
  }

  const handleViewProfile = (username) => {
    /* Need to get username so this needs to be changed */
    setViewProfileUsername(username);
    setPage("profile");
  }

  const handleViewTimeline = () => {
    setViewProfileUsername('');
    setPage("timeline");
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
    const updatedMockReplies = [...mockReplies];
    let newReply = [identifier, getFormattedDateTime(), createReplyText, 0, "hideTrashIcon"];
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

  return (
    <div className="cinematica__content">
      {/* Header */}
      <header>
        <div className="cinematica__header-upper">
          <p className="cinematica__logo logo__size-2 logo__colour-2" onClick={() => handleViewTimeline()}>Cinematica</p>
          <div>
            <i class="fa fa-home" aria-hidden="true" onClick={() => handleViewTimeline()}></i>
            {identifier !== "" ? <div>
              {notificationOn ? <i class='fa fa-bell' onClick={() => handleToggleNotifications()}></i> : <i class='fa fa-bell-slash' onClick={() => handleToggleNotifications()}></i>}
              <p onClick={() => handleViewProfile(identifier)}>{identifier}</p>
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
      <div className="feed-container">
        <div className="profile__container">
          {/* Banner */}
          <div className="profile__background">
            {identifier === viewProfileUsername && <i class='fa fa-edit'></i>}
          </div>
          {/* Profile picture and username */}
          <div className="profile__name-photo-container">
            <div className="profile__picture"></div>
            <p className="profile__username">{viewProfileUsername}</p>
          </div>
          {/* Follower counts */}
          <div className="profile__stats">
            <div  className="profile__follow-stats">
              <p><strong>123</strong> Following</p>
              <p><strong>123</strong> Followers</p>
            </div>
            {identifier !== viewProfileUsername && <div className="profile__follow-button">Follow</div>}
          </div>
          {/* Profile tabs */}
          <div className="profile__tabs">
            <div>Posts</div>
            <div>Replies</div>
            <div>Likes</div>
            <div>Movies</div>
          </div>
        </div>
        <div className="post-container">
          {/* Pre-posts */}
          <br/>
          <label for="revealAllSpoilers">Reveal all potential spoiler posts</label>
          <input type="radio" value="revealAllSpoilers" onChange={(e) => handleTempRemoveAllSpoilers()} />
          {/* Posts, mapped out */}
          {viewPost === false && 
             mockPosts.map((post, index) => (
                <div className="mock-post"  onMouseEnter={e => toggleDeleteIcon(mockPosts, "post", index)} onMouseLeave={e => toggleDeleteIcon(mockPosts, "post", index)}>
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
                    {post[0] === identifier && <div className={post[7]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                    {post[8] === false || post[0] === identifier ? <p className="post-content">{post[2]}</p> : <p className="post-content" onClick={() => handleTempRemoveSpoilerMessage(index)}>Warning: Potential spoilers! Click this text or "Replies" to reveal...</p>}
                    {post[3] !== '' && (post[8] === false || post[0] === identifier) && <img src={post[3]} alt={`Post ${index}`} className="post-image" />}
                    <p className="post-movie"><i class='fa fa-film'></i> {post[4]}</p>
                    <div className="post-stats">
                        <div className="post-likes"><i class='	fa fa-heart-o'></i> {post[5]}</div>
                        <div className="post-comments" onClick={() => handleToggleReplies(index)}>{post[6]} Replies</div>
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
                {selectedPost[0] === identifier && <div className={selectedPost[7]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                <p className="post-content">{selectedPost[2]}</p>
                {selectedPost[3] !== '' && <img src={selectedPost[3]} alt={`Post`} className="post-image" />}
                <p className="post-movie"><i class='fa fa-film'></i> {selectedPost[4]}</p>
                <div className="post-stats">
                    <div className="post-likes"><i class='	fa fa-heart-o'></i> {selectedPost[5]}</div>
                    <div className="post-comments" onClick={() => handleToggleReplies("none")}>{selectedPost[6]} Replies</div>
                </div>
              </div>
              <br/>
              {/* Create reply */}
              <div className="comment-box__container">
                <input type="text" className="comment-box__text" value={createReplyText} maxLength={280} placeholder="Write your Replies..." onChange={(e) => setCreateReplyText(e.target.value)} required />
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
                    {replies[0] === identifier && <div className={replies[4]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                    <p className="post-content">{replies[2]}</p>
                    <div className="post-stats">
                        <div className="post-likes"><i class='	fa fa-heart-o'></i> {replies[3]}</div>
                    </div>
                </div>
              ))}
            </div>
            </div>)}
        </div> 
      </div>
    </div>
  );
};
    
export default Profile;