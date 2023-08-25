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
  const [newReply, setNewReply] = useState("");
  const [mockReplies, setMockReplies] = useState("");
  const [mockUser] = useState("SpiderManFan");
  const [otherMockUser] = useState("ThatMovieAddict");
  const [otherMockUser2] = useState("PenguinClub");

  useEffect(() => {
    setMockPosts([[otherMockUser, '18/08/23 7:56am', 'Just watched #Oppenheimer and I’m blown away by the brilliant performance of Cillian Murphy and the stunning cinematography of Hoyte van Hoytema. Nolan has done it again, delivering a masterpiece that explores the moral dilemmas and personal struggles of the man behind the atomic bomb. A must-watch for all film lovers! 🎥👏👏👏',
    '', 'Oppenheimer (2023)', '657', '1,026', "hide"],
    [mockUser,'16/08/23 9:43pm', 'The visuals of Spider-Man: Across the Spider-Verse is simply GOREGOUS! #loveit',
    'spidermans.jpg', 'Spider-Man: Across the Spider-Verse (2023)', '238', '432', "hide"]]);
    setMockReplies([[[mockUser, '20/08/23 9:43pm', 'I agree! I don’t usually watch other genres, but this one is a must-watch!', '238', "hide"],
    [otherMockUser2, '19/08/23 5:21pm', 'Thanks for the recommendation! I just left the cinema and WOW! That was AMAZING!', '552', "hide"]],[]]);
    // handleGetPosts();
    // handleGetNotificationPreference();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Post!");
    // Send post data to server
    // fetch('http://localhost:3001/post', {
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
    if (index !== "none"){
      const selectedPostFromPosts = [...mockPosts[index]];
      /* Remove the trash icon when viewing Repliess of your own post */
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
      setMockPosts([[otherMockUser, '18/08/23 7:56am', 'Just watched #Oppenheimer and I’m blown away by the brilliant performance of Cillian Murphy and the stunning cinematography of Hoyte van Hoytema. Nolan has done it again, delivering a masterpiece that explores the moral dilemmas and personal struggles of the man behind the atomic bomb. A must-watch for all film lovers! 🎥👏👏👏',
      '', 'Oppenheimer (2023)', '657', '1,026', "hide"],
      [mockUser,'16/08/23 9:43pm', 'The visuals of Spider-Man: Across the Spider-Verse is simply GOREGOUS! #loveit',
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
    } else if (type === "Replies") {
      let lastIndex = newArray[selectedPostIndex][index].lastIndexOf("hide") !== -1 ? newArray[selectedPostIndex][index].lastIndexOf("hide") : newArray[selectedPostIndex][index].lastIndexOf("post__delete-icon");
      newArray[selectedPostIndex][index][lastIndex] = newArray[selectedPostIndex][index][lastIndex] === "hide" ? "post__delete-icon" : "hide";
      setMockReplies(newArray);
    }
  };

  return (
    <div className="cinematica__content">
      <header>
        <div className="cinematica__header-upper">
          <p className="cinematica__logo logo__size-2 logo__colour-2">Cinematica</p>
          <div>
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
            <input type="text" className="searchBar search__timeline" value={searchTag} placeholder="Enter tag..." onChange={(e) => setSearchTag(e.target.value)} required /><br/>
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
                <input type="text" className="comment-box__text" value={newReply} placeholder="Write your Replies..." onChange={(e) => setNewReply(e.target.value)} required />
                <i class='fa fa-send'></i>
              </div>
              <div>
              {selectedPostIndex != null && mockReplies[selectedPostIndex].map((Replies, index) => (
                <div className="mock-post" onMouseEnter={e => toggleDeleteIcon(mockReplies, "Replies", index)} onMouseLeave={e => toggleDeleteIcon(mockReplies, "Replies", index)}>
                    <div className="post__details">
                        <div className="post__author-container">
                        <div className="cinematica__profile-circle" onClick={() => handleViewProfile(Replies[0])}></div>
                        <div>
                            <p className="post-author" onClick={() => handleViewProfile(Replies[0])}>{Replies[0]}</p>
                        </div>
                        </div>
                        <div>
                          <p className="post-date">{Replies[1]}</p>
                        </div>
                    </div>
                    {Replies[0] === mockUser && <div className={Replies[4]}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                    <p className="post-content">{Replies[2]}</p>
                    <div className="post-stats">
                        <div className="post-likes"><i class='	fa fa-heart-o'></i> {Replies[3]}</div>
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