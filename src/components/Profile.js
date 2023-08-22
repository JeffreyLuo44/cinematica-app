import React, { useState, useEffect } from 'react';

const Profile = ({setPage, identifier, setIdentifier, profileView, setProfileView}) => {
  const [search, setSearch] = useState('');
  const [mockPosts, setMockPosts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationOn, setNotificationOn] = useState(true);
  const [selectedPost, setSelectedPost] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [viewPost, setViewPost] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [mockComments, setMockComments] = useState("");
  const [mockUser] = useState("SpiderManFan");
  const [otherMockUser] = useState("ThatMovieAddict");
  const [otherMockUser2] = useState("PenguinClub");

  useEffect(() => {
    setMockPosts([[otherMockUser, '18/08/23 7:56am', 'Just watched #Oppenheimer and I’m blown away by the brilliant performance of Cillian Murphy and the stunning cinematography of Hoyte van Hoytema. Nolan has done it again, delivering a masterpiece that explores the moral dilemmas and personal struggles of the man behind the atomic bomb. A must-watch for all film lovers! 🎥👏👏👏',
    '', 'Oppenheimer (2023)', '657', '1,026'],
    [mockUser,'16/08/23 9:43pm', 'The visuals of Spider-Man: Across the Spider-Verse is simply GOREGOUS! #loveit',
    'spidermans.jpg', 'Spider-Man: Across the Spider-Verse (2023)', '238', '432']]);
    setMockComments([[[mockUser, '20/08/23 9:43pm', 'I agree! I don’t usually watch other genres, but this one is a must-watch!', '238'],
      [otherMockUser2, '19/08/23 5:21pm', 'Thanks for the recommendation! I just left the cinema and WOW! That was AMAZING!', '552']],[]]);
    // handleGetPosts();
    // handleGetNotificationPreference();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setProfileView(username);
    setPage("profile");
  }

  const handleViewTimeline = () => {
    setProfileView('');
    setPage("timeline");
  }

  const handleToggleNotifications = () => {
    setNotificationOn(!notificationOn);
    /* Need to apply to database */
  }

  const handleToggleComments = (index) => {
    if (index !== "none"){
      setSelectedPost(mockPosts[index]);
      setSelectedPostIndex(index);
      setViewPost(true);
    } else {
      setSelectedPost([]);
      setSelectedPostIndex(null);
      setViewPost(false);
    }
  };

  return (
    <div className="cinematica__content">
      <header>
        <div className="cinematica__header-upper">
          <p className="cinematica__logo logo__size-2 logo__colour-2">Cinematica</p>
          <div>
            {notificationOn ? <i class='fa fa-bell' onClick={() => handleToggleNotifications()}></i> : <i class='fa fa-bell-slash' onClick={() => handleToggleNotifications()}></i>}
            <div className="cinematica__profile-circle" onClick={() => setDropdownVisible(!dropdownVisible)}></div>
            {dropdownVisible && (
            <div className="dropdown-menu">
              <p onClick={() => handleViewTimeline()}>Timeline</p>
              <p onClick={handleLogout}>Log out</p>
            </div>
          )}
          </div>
        </div>
        <div>
          {/*Update posts as input is being typed in*/}
          <input type="text" className="searchBar search__timeline" value={search} placeholder="Explore" onChange={(e) => setSearch(e.target.value)} required /><br/>
        </div>
      </header>
      <div className="feed-container">
        <div className="profile__container">
          {/* Banner */}
          <div className="profile__background">
            <i class='fa fa-edit'></i>
          </div>
          {/* Profile picture and username */}
          <div className="profile__name-photo-container">
            <div className="profile__picture"></div>
            <p className="profile__username">{profileView}</p>
          </div>
          {/* Follower counts */}
          <div className="profile__follow-stats">
            <p><strong>123</strong> Following</p>
            <p><strong>123</strong> Followers</p>
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
          {viewPost === false && 
             mockPosts.map((post, index) => (
                <div className="mock-post">
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
                    <p className="post-content">{post[2]}</p>
                    {post[3] !== '' && <img src={post[3]} alt={`Post ${index}`} className="post-image" />}
                    <p className="post-movie"><i class='fa fa-film'></i> {post[4]}</p>
                    <div className="post-stats">
                        <div className="post-likes"><i class='	fa fa-heart-o'></i> {post[5]}</div>
                        <div className="post-comments" onClick={() => handleToggleComments(index)}>{post[6]} Comments</div>
                    </div>
                </div>
            ))}
            {viewPost === true && (<div>
              <button className="back" onClick={() => handleToggleComments("none")}><i class='fa fa-arrow-left'></i>&emsp;Back</button>
              <div className="mock-post">
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
                <p className="post-content">{selectedPost[2]}</p>
                {selectedPost[3] !== '' && <img src={selectedPost[3]} alt={`Post`} className="post-image" />}
                <p className="post-movie"><i class='fa fa-film'></i> {selectedPost[4]}</p>
                <div className="post-stats">
                    <div className="post-likes"><i class='	fa fa-heart-o'></i> {selectedPost[5]}</div>
                    <div className="post-comments" onClick={() => handleToggleComments("none")}>{selectedPost[6]} Comments</div>
                </div>
              </div>
              <br/>
              <div className="comment-box__container">
                <input type="text" className="comment-box__text" value={newComment} placeholder="Write your comment..." onChange={(e) => setNewComment(e.target.value)} required />
                <i class='fa fa-send'></i>
              </div>
              <div>
              {selectedPostIndex != null && mockComments[selectedPostIndex].map((comment, index) => (
                <div className="mock-post">
                    <div className="post__details">
                        <div className="post__author-container">
                        <div className="cinematica__profile-circle" onClick={() => handleViewProfile(comment[0])}></div>
                        <div>
                            <p className="post-author" onClick={() => handleViewProfile(comment[0])}>{comment[0]}</p>
                        </div>
                        </div>
                        <div>
                        <p className="post-date">{comment[1]}</p>
                        </div>
                    </div>
                    <p className="post-content">{comment[2]}</p>
                    <div className="post-stats">
                        <div className="post-likes"><i class='	fa fa-heart-o'></i> {comment[3]}</div>
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