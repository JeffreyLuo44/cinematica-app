import React, { useState, useEffect } from 'react';

const Timeline = ({setPage, identifier, setIdentifier, setViewProfileUsername}) => {  
  const [notificationOn, setNotificationOn] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [createPostText, setCreatePostText] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [isCreateSpoilerPost, setIsCreateSpoilerPost] = useState(false);

  const [mockPosts, setMockPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [viewPost, setViewPost] = useState(false);
  const [createReplyText, setCreateReplyText] = useState("");
  const [mockReplies, setMockReplies] = useState("");
  const [mockUser] = useState("SpiderManFan");
  const [otherMockUser] = useState("ThatMovieAddict");
  const [otherMockUser2] = useState("PenguinClub");

  useEffect(() => {
    // Eventually need to add spoiler field
    setMockPosts([[otherMockUser, '18/8/23 7:56am', 'Just watched #Oppenheimer and I’m blown away by the brilliant performance of Cillian Murphy and the stunning cinematography of Hoyte van Hoytema. Nolan has done it again, delivering a masterpiece that explores the moral dilemmas and personal struggles of the man behind the atomic bomb. A must-watch for all film lovers! 🎥👏👏👏',
    '', 'Oppenheimer (2023)', '657', '1,026', "hide"],
    [mockUser,'16/8/23 9:43pm', 'The visuals of Spider-Man: Across the Spider-Verse is simply GOREGOUS! #loveit',
    'spidermans.jpg', 'Spider-Man: Across the Spider-Verse (2023)', '238', '432', "hide"]]);
    setMockReplies([[[mockUser, '20/8/23 9:43pm', 'I agree! I don’t usually watch other genres, but this one is a must-watch!', '238', "hide"],
    [otherMockUser2, '19/8/23 5:21pm', 'Thanks for the recommendation! I just left the cinema and WOW! That was AMAZING!', '552', "hide"]],[]]);
    // handleGetPosts();
    // handleGetNotificationPreference();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Post!");
    // Mock post creation
    const updatedMockPosts = [...mockPosts];
    let newPost = [identifier, getFormattedDateTime(), createPostText, '', 'No movie tagged', 0, 0, "hide"];
    updatedMockPosts.unshift(newPost);
    const updatedMockReplies = [...mockReplies];
    updatedMockReplies.unshift([]);
    setMockPosts(updatedMockPosts);
    setMockReplies(updatedMockReplies);
    // Send post data to server
    // fetch('http://localhost:3001/post', {
    setCreatePostText('');
    setSearchTag('');
    setIsCreateSpoilerPost(false);
  };

  const handleLogout = () => {
    setIdentifier('');
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
      console.log(index);
      const selectedPostFromPosts = [...mockPosts[index]];
      /* Remove the trash icon when viewing Replies of your own post */
      if (selectedPostFromPosts.lastIndexOf("post__delete-icon") !== -1)
        selectedPostFromPosts[selectedPostFromPosts.lastIndexOf("post__delete-icon")] = "hide";
      setSelectedPost(selectedPostFromPosts);
      setSelectedPostIndex(index);
      setViewPost(true);
    } else {
      setSelectedPost([]);
      setSelectedPostIndex(null);
      setViewPost(false);
      // Get the posts again
      setMockPosts([[otherMockUser, '18/8/23 7:56am', 'Just watched #Oppenheimer and I’m blown away by the brilliant performance of Cillian Murphy and the stunning cinematography of Hoyte van Hoytema. Nolan has done it again, delivering a masterpiece that explores the moral dilemmas and personal struggles of the man behind the atomic bomb. A must-watch for all film lovers! 🎥👏👏👏',
      '', 'Oppenheimer (2023)', '657', '1,026', "hide"],
      [mockUser,'16/8/23 9:43pm', 'The visuals of Spider-Man: Across the Spider-Verse is simply GOREGOUS! #loveit',
      'spidermans.jpg', 'Spider-Man: Across the Spider-Verse (2023)', '238', '432', "hide"]]);
    }
  };

  const toggleDeleteIcon = (array, type, index) => {
    const newArray = [...array];
    if (index === -1){
      let lastIndex = newArray.lastIndexOf("hide") !== -1 ? newArray.lastIndexOf("hide") : newArray.lastIndexOf("post__delete-icon");
      newArray[lastIndex] = newArray[lastIndex] === "hide" ? "post__delete-icon" : "hide";
      setSelectedPost(newArray);
    }
    else if (type === "post"){
      let lastIndex = newArray[index].lastIndexOf("hide") !== -1 ? newArray[index].lastIndexOf("hide") : newArray[index].lastIndexOf("post__delete-icon");
      newArray[index][lastIndex] = newArray[index][lastIndex] === "hide" ? "post__delete-icon" : "hide";
      setMockPosts(newArray);
    } else if (type === "replies") {
      let lastIndex = newArray[selectedPostIndex][index].lastIndexOf("hide") !== -1 ? newArray[selectedPostIndex][index].lastIndexOf("hide") : newArray[selectedPostIndex][index].lastIndexOf("post__delete-icon");
      newArray[selectedPostIndex][index][lastIndex] = newArray[selectedPostIndex][index][lastIndex] === "hide" ? "post__delete-icon" : "hide";
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
    let newReply = [identifier, getFormattedDateTime(), createReplyText, 0, "hide"];
    updatedMockReplies[selectedPostIndex].unshift(newReply);
    setMockReplies(updatedMockReplies);
  }

  return (
    <div className="cinematica__content">
      <header>
        <div className="cinematica__header-upper">
          <p className="cinematica__logo logo__size-2 logo__colour-2" onClick={() => setPage("timeline")}>Cinematica</p>
          <div>
            <i class="fa fa-home" aria-hidden="true" onClick={() => setPage("timeline")}></i>
            {identifier !== "" ? <div>
              {notificationOn ? <i class='fa fa-bell' onClick={() => handleToggleNotifications()}></i> : <i class='fa fa-bell-slash' onClick={() => handleToggleNotifications()}></i>}
              <p onClick={() => handleViewProfile(identifier)}>{identifier}</p>
              <div className="cinematica__profile-circle" onClick={() => setDropdownVisible(!dropdownVisible)}></div>
              {dropdownVisible && (
              <div className="dropdown-menu">
                <p onClick={() => handleViewProfile(identifier)}>Profile</p>
                <p onClick={handleLogout}>Log out</p>
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
        <div className="timeline__tabs">
          <div onClick={() => alert('test')}>All posts</div>
          <div onClick={() => alert('test')}>Following</div>
        </div>
      </header>
      <div className="feed-container">
        {viewPost === false && <form className="form" onSubmit={handleSubmit}>
          <div>
            <textarea className="post__text" placeholder="What's on your mind?" maxLength={280} value={createPostText} onChange={(e) => setCreatePostText(e.target.value)} required /><br/>
            <br/>
            <div>
            {/*Update posts as input is being typed in*/}
            <input type="text" className="searchBar search__timeline" value={searchTag} placeholder="Enter tag..." onChange={(e) => setSearchTag(e.target.value)} /><br/>
          </div>
          </div>
          <div className="post__controls">
            <div>
              <i class='fa fa-image'></i>
              <label for="spoilers">Mark as having spoilers</label>
              <input type="checkbox" value="spoilers" onChange={(e) => setIsCreateSpoilerPost(!isCreateSpoilerPost)} />
            </div>
            <div>
              <button className="post__button" id="post" type="submit">Post</button>
            </div>
          </div>
          <br/>
        </form>}
        <div className="post-container">
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
                    {post[0] === mockUser && <div className={post[7]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                    <p className="post-content">{post[2]}</p>
                    {post[3] !== '' && <img src={post[3]} alt={`Post ${index}`} className="post-image" />}
                    <p className="post-movie"><i class='fa fa-film'></i> {post[4]}</p>
                    <div className="post-stats">
                        <div className="post-likes"><i class='	fa fa-heart-o'></i> {post[5]}</div>
                        <div className="post-comments" onClick={() => handleToggleReplies(index)}>{post[6]} Replies</div>
                    </div>
                </div>
            ))}
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
                {selectedPost[0] === mockUser && <div className={selectedPost[7]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                <p className="post-content">{selectedPost[2]}</p>
                {selectedPost[3] !== '' && <img src={selectedPost[3]} alt={`Post`} className="post-image" />}
                <p className="post-movie"><i class='fa fa-film'></i> {selectedPost[4]}</p>
                <div className="post-stats">
                    <div className="post-likes"><i class='	fa fa-heart-o'></i> {selectedPost[5]}</div>
                    <div className="post-comments" onClick={() => handleToggleReplies("none")}>{selectedPost[6]} Replies</div>
                </div>
              </div>
              <br/>
              <div className="comment-box__container">
                <input type="text" className="comment-box__text" value={createReplyText} maxLength={280} placeholder="Write your Replies..." onChange={(e) => setCreateReplyText(e.target.value)} required />
                <i class='fa fa-send' onClick={() => handleAddReply()}></i>
              </div>
              <div>
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
                    {replies[0] === mockUser && <div className={replies[4]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
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
    
export default Timeline;