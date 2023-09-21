import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DateTime } from 'luxon';

const Posts = ({idToken, userId, posts, setPosts, postPage, setPostPage, replies, setReplies, replyPage, setReplyPage, viewReplies, setViewReplies, handleViewProfile, handleToggleMovieDetails, profileUsername, profilePicture}) => {
  const apiUrlPrefix = process.env.REACT_APP_API_URL_PREFIX;
  const [selectedPost, setSelectedPost] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState("none");
  const [viewPost, setViewPost] = useState(false);
  const [createReplyText, setCreateReplyText] = useState("");
  const [searchPostTag, setSearchPostTag] = useState('');
  const [searchPostResults, setSearchPostResults] = useState([]);
  const [taggedMovieIdForPostSearch, setTaggedMovieIdForPostSearch] = useState(-1);
  const [showPostImageTrashIcon, setShowPostImageTrashIcon] = useState(-1);
  const [showReplyImageTrashIcon, setShowReplyImageTrashIcon] = useState(-1);
  const [postWidth, setPostWidth] = useState(0);

  const handleTogglePostImageTrashIcon = (id, event) => {
    event.stopPropagation();
    if (showPostImageTrashIcon !== id)
      setShowPostImageTrashIcon(id);
    else
      setShowPostImageTrashIcon(-1);
  }

  const handleToggleReplyImageTrashIcon = (id, event) => {
    event.stopPropagation();
    if (showReplyImageTrashIcon !== id)
      setShowReplyImageTrashIcon(id);
    else
      setShowReplyImageTrashIcon(-1);
  }

  const handleToggleReplies = (index) => {
    setCreateReplyText('');
    if (index !== "none"){
      const selectedPostFromPosts = posts[index];
      setSelectedPost(selectedPostFromPosts);
      setSelectedPostIndex(index);
      getReplies(selectedPostFromPosts.post.postId, 1);
      setViewPost(true);
      setViewReplies(true);
    } else {
      setSelectedPost([]);
      setReplies([]);
      setSelectedPostIndex(null);
      setViewPost(false);
      setViewReplies(false);
    }
  };

  const getReplies = (postId, replyPage) => {
    fetch(apiUrlPrefix + 'posts/ ' + postId + '/replies/' + replyPage + '?userId=' + userId, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
              if (replyPage === 1){
                setReplyPage(2);
                setReplies(data);
              } else {
                let updatedReplies = [...replies, ...data];
                setReplies(updatedReplies);
                setReplyPage(replyPage + 1);
              }
              setViewReplies(true);
            });
        } else {
            alert(response.title);
        }
    })
    .catch(error => {
        console.error('Error during getting user details', error);
    });
  }

    function getFormattedPostCreatedAt(createdAt) {
      // Parse the ISO string into a DateTime object in UTC
      const utcDateTime = DateTime.fromISO(createdAt, { zone: 'utc' });

      // Convert to New Zealand Time (NZT)
      const nzDateTime = utcDateTime.setZone('Pacific/Auckland');

      // Format as ISO 8601 in the target zone
      const nzISOString = nzDateTime.toISO();
      const dateAndTime = nzISOString.split('T');
      const date = dateAndTime[0].split('-');
      const time = dateAndTime[1].split(':');
      const yearTwoDigits = date[0] - 2000;
      const amOrPM = time[0] > 11 ? "pm" : "am";
      return date[2] + "/" + date[1] + "/" + yearTwoDigits + " " + time[0] + ":" + time[1] + amOrPM;
    }
  
    const handleAddReply = (postId) => {
      if (userId === ''){
        alert("Sign in to reply");
        return;
      }
      // Reply creation
      const date = new Date();
      // Send reply data to server
      fetch(apiUrlPrefix + 'replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          postId: postId,
          userId: userId,
          createdAt: date.toISOString(),
          body: createReplyText,
        })
      })
      .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
          getReplies(postId, 1);
          let updatedSelectedPost = selectedPost;
          updatedSelectedPost.commentsCount = updatedSelectedPost.commentsCount + 1;
          setSelectedPost(updatedSelectedPost);
          //Reset create reply states
          setCreateReplyText('');
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
  
    const handleTempRemoveAllSpoilers = () => {
      let restorePosts = [...posts];
      if (restorePosts.length > 0){
        restorePosts.map((post) => {
          return post.post.isSpoiler = false;
        });
      }
      setPosts(restorePosts);
    }
  
    const handleTempRemoveSpoilerMessage = (index) => {
      const restorePosts = [...posts];
      restorePosts[index].post.isSpoiler = false;
      setPosts(restorePosts);
    }

    const searchPostsByMovie = (search) => {
      if (search === ""){
        setSearchPostResults([]);
        document.getElementById("search-posts-results").style.visibility = "hidden";
        return;
      }
      document.getElementById("search-posts-results").style.visibility = "visible";
      try {
        fetch(apiUrlPrefix + 'movies/withPosts/' + search, {
          mathod: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(response => {
          if (response.ok) {
            response.json().then(data => {
              setSearchPostResults(data);
            })
          }
          else {
          }
        })
      } catch (error) {
        console.error('Error getting movie search results:', error);
      }
    }
  
    const getPostsByTaggedMovie = (id, page) => {
      document.getElementById("search-posts-results").style.visibility = "hidden";
      try {
        fetch(apiUrlPrefix + 'posts/search/' + id + '/' + page, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.ok) {
            response.json().then(data => {
              if (page === 1){
                setPosts(data);
              } else {
                let updatedPosts = [...posts, ...data];
                setPosts(updatedPosts);
              }
              setPostPage(page + 1);
            })
          }
          else {
            alert(response.title);
          }
        })
      } catch (error) {
        console.error('Error getting posts from movie:', error);
      }
    }

    const handleAddTaggedMovieForPostSearch = (id) => {
      getPostsByTaggedMovie(id, 1);
      setTaggedMovieIdForPostSearch(id);
      // Reset the search results
      setSearchPostResults([]);
    }

    const handleLikeReply = (replyId) => {
      if (userId === ''){
        alert("Sign in to like!");
        return;
      }
      // Send id data to server
      fetch(apiUrlPrefix + 'replies/like/' + userId + '/' + replyId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      })
      .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
          // Local update to the like button
          const replyIndex = replies.findIndex(reply => reply.reply.replyId === replyId);
          if (replyIndex !== -1) {
            const updatedReplies = [...replies];
            updatedReplies[replyIndex] = {...updatedReplies[replyIndex], youLike: !updatedReplies[replyIndex].youLike};
            if (updatedReplies[replyIndex].youLike === true)
              updatedReplies[replyIndex] = {...updatedReplies[replyIndex], likesCount: updatedReplies[replyIndex].likesCount + 1};
            else
              updatedReplies[replyIndex] = {...updatedReplies[replyIndex], likesCount: updatedReplies[replyIndex].likesCount - 1};
            setReplies(updatedReplies);
          }
        } else {
          return response.json().then(data => {
            console.error('Request failed with status: ' + response.status);
            alert(data.message);
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }

    const handleLikePost = (postId) => {
      if (userId === ''){
        alert("Sign in to like!");
        return;
      }
      // Send id data to server
      fetch(apiUrlPrefix + 'posts/like/' + userId + '/' + postId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      })
      .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
          // Local update to the like button
          const postIndex = posts.findIndex(post => post.post.postId === postId);
          if (postIndex !== 1) {
            const updatedPosts = [...posts];
            updatedPosts[postIndex] = {...updatedPosts[postIndex], youLike: !updatedPosts[postIndex].youLike};
            if (updatedPosts[postIndex].youLike === true)
              updatedPosts[postIndex] = {...updatedPosts[postIndex], likesCount: updatedPosts[postIndex].likesCount + 1};
            else
              updatedPosts[postIndex] = {...updatedPosts[postIndex], likesCount: updatedPosts[postIndex].likesCount - 1};
            setPosts(updatedPosts);
     
            let updatedSelectedPost = selectedPost;
            updatedSelectedPost = {...updatedSelectedPost, youLike: !updatedSelectedPost.youLike};
            if (updatedSelectedPost.youLike === true)
              updatedSelectedPost = {...updatedSelectedPost, likesCount: updatedSelectedPost.likesCount + 1};
            else
              updatedSelectedPost = {...updatedSelectedPost, likesCount: updatedSelectedPost.likesCount - 1};
            setSelectedPost(updatedSelectedPost);
          }
        } else {
          return response.json().then(data => {
            console.error('Request failed with status: ' + response.status);
            alert(data.message);
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }

    const handleDeletePost = (id) => {
      try {
        fetch(apiUrlPrefix + 'posts/' + id, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          }
        }).then(response => {
          if (response.ok) {
            let updatedPosts = [...posts];
            const postIndex = posts.findIndex(post => post.post.postId === id);
            updatedPosts.splice(postIndex, 1);
            setPosts(updatedPosts);
            // Go back to list of posts if viewing selected post
            if (postIndex !== -1 && selectedPostIndex === "none") {
   
            }
            else {
              setViewPost(false);
              setSelectedPostIndex("none");
            }
          }
          else {
            alert(response.title);
          }
        })
      } catch (error) {
        console.error('Error getting posts from movie:', error);
      }
    }

    const handleDeleteReply = (id) => {
      try {
        fetch(apiUrlPrefix + 'replies/' + id, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          }
        }).then(response => {
          if (response.ok) {
            let updatedReplies = [...replies];
            const replyIndex = replies.findIndex(reply => reply.reply.replyId === id);
            if (replyIndex !== -1) {
              updatedReplies.splice(replyIndex, 1);
              setReplies(updatedReplies);
            }
          }
          else {
            alert(response.title);
          }
        })
      } catch (error) {
        console.error('Error getting posts from movie:', error);
      }
    }

    const loadPostWidth = (index) => {
      setPostWidth(document.getElementById("post-" + index).clientWidth);
    }
    
    return (<div className="post-container">
               {<InfiniteScroll
              dataLength={posts.length}
              next={() => getPostsByTaggedMovie(taggedMovieIdForPostSearch, postPage)}
              hasMore={true}
            />}
        {/* Pre-posts */}
        {viewPost === false && <div>
          <br/>
          <i>This product uses the TMDB API but is not endorsed or certified by TMDB</i>
          <br/> <br/>
          <input type="text" className="searchBar search__timeline" value={searchPostTag} placeholder="Search posts by movie..." onChange={(e) => {setSearchPostTag(e.target.value); searchPostsByMovie(e.target.value);}} /><br/>
        </div>}
        {/* Change class names */}
        <div id="search-posts-results" className="search-results">
          {/* Display search results here */}
          {searchPostResults.map((result) => (
            <div key={result.id} onClick={() => handleAddTaggedMovieForPostSearch(result.id, result.title, result.releaseYear)}>{result.title} ({result.releaseYear})</div>
          ))}
          {searchPostResults.length === 0 && searchPostTag !== "" && <div>No movies with posts found</div>} 
        </div>
        <br/>
        <label for="revealAllSpoilers">Reveal all potential spoiler posts</label>
        <input type="radio" value="revealAllSpoilers" onChange={(e) => handleTempRemoveAllSpoilers()} />
        {/* Posts, mapped out */}
        {viewPost === false && posts.length > 0 &&
           posts.map((post, index) => (
              <div className="post" id={"post-" + index} onLoad={() => loadPostWidth(index)} onMouseEnter={() => setShowPostImageTrashIcon(post.post.postId)} onMouseLeave={() => setShowPostImageTrashIcon(-1)}
              onTouchStart={(e) => handleTogglePostImageTrashIcon(post.post.postId, e)}>
                  <div className="post__details">
                      <div className="post__author-container">
                      <div className="cinematica__profile-circle" onClick={() => handleViewProfile(post.post.userId)}><img src={post.profilePicture} alt={''} className="post-image" /></div>
                      <div>
                          <p className="post-author" onClick={() => handleViewProfile(post.post.userId)}>{post.userName !== undefined ? post.userName : profileUsername}</p>
                      </div>
                      </div>
                      <div>
                        <p className="post-date">{getFormattedPostCreatedAt(post.post.createdAt)}</p>
                      </div>
                  </div>
                  {showPostImageTrashIcon === post.post.postId && post.post.userId === userId && <div className="post__delete-icon" onClick={() => handleDeletePost(post.post.postId)}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                  {post.post.isSpoiler === false || post.post.userId === userId ? <p className="post-content">{post.post.body}</p> : <p className="post-content" onClick={() => handleTempRemoveSpoilerMessage(index)}>Warning: Potential spoilers! Click this text or "Replies" to reveal...</p>}
                  {(post.post.isSpoiler === false || post.post.userId === userId) && <img src={post.post.image} alt={''} className="post-image" style={{ maxHeight: postWidth * 1.5, width: postWidth, transform: "translate(-1.2rem)"}}/>}
                  <div className="post-movie">
                    {post.movies.map((movie, index) => (
                      <span onClick={() => handleToggleMovieDetails(movie.id)}><i class='fa fa-film'></i> {movie.title} ({movie.releaseYear})</span>
                    ))}
                  </div>
                  <div className="post-stats">
                      {post.youLike === false ? <div className="post-likes" onClick={() => handleLikePost(post.post.postId)}><i class='	fa fa-heart-o'></i> {post.likesCount}</div> : <div className="post-likes" onClick={() => handleLikePost(post.post.postId)}><i class='	fa fa-heart'></i> {post.likesCount}</div>}
                      <div className="post-comments" onClick={() => handleToggleReplies(index)}>{post.commentsCount} Replies</div>
                  </div>
              </div>
          ))}
          {/* Selected post with reply section */}
          {viewPost === true && (<div>
            <button className="back" onClick={() => handleToggleReplies("none")}><i class='fa fa-arrow-left'></i>&emsp;Back</button>
            <div className="post" onMouseEnter={() => setShowPostImageTrashIcon(selectedPost.post.postId)} onMouseLeave={() => setShowPostImageTrashIcon(-1)}
            onTouchStart={(e) => handleTogglePostImageTrashIcon(selectedPost.post.postId, e)}>
              <div className="post__details">
                  <div className="post__author-container">
                  <div className="cinematica__profile-circle" onClick={() => handleViewProfile(selectedPost.post.userId)}><img src={selectedPost.profilePicture} alt={''} className="post-image" /></div>
                  <div>
                      <p className="post-author" onClick={() => handleViewProfile(selectedPost.post.userId)}>{selectedPost.userName !== undefined ? selectedPost.userName : profileUsername}</p>
                  </div>
                  </div>
                  <div>
                    <p className="post-date">{getFormattedPostCreatedAt(selectedPost.post.createdAt)}</p>
                  </div>
              </div>
              {selectedPost.post.postId === showPostImageTrashIcon && selectedPost.post.userId === userId && <div className="post__delete-icon" onClick={() => handleDeletePost(selectedPost.post.postId)} onTouchStart={() => handleDeletePost(selectedPost.post.postId)}><i class="fa fa-trash" aria-hidden="true"></i></div>}
              <p className="post-content">{selectedPost.post.body}</p>
              {<img src={selectedPost.post.image} alt={''} className="post-image" style={{ maxHeight: postWidth * 1.5, width: postWidth, transform: "translate(-1.2rem)" }} />}
              <div className="post-movie">
                {selectedPost.movies.map((movie, index) => (
                  <span onClick={() => handleToggleMovieDetails(movie.id)}><i class='fa fa-film'></i> {movie.title} ({movie.releaseYear})</span>
                ))}
              </div>
              <div className="post-stats">
                  {selectedPost.youLike === false ? <div className="post-likes" onClick={() => handleLikePost(selectedPost.post.postId)}><i class='	fa fa-heart-o'></i> {selectedPost.likesCount}</div> : <div className="post-likes" onClick={() => handleLikePost(selectedPost.post.postId)}><i class='	fa fa-heart'></i> {selectedPost.likesCount}</div>}
                  <div className="post-comments" onClick={() => handleToggleReplies("none")}>{selectedPost.commentsCount} Replies</div>
              </div>
            </div>
            <br/>
            {/* Create reply */}
            <div className="comment-box__container">
              <input type="text" className="comment-box__text" value={createReplyText} maxLength={280} placeholder="Write your reply..." onChange={(e) => setCreateReplyText(e.target.value)} required />
              <i class='fa fa-send' onClick={() => handleAddReply(selectedPost.post.postId)}></i>
            </div>
            {<InfiniteScroll
              dataLength={replies.length}
              next={() => getReplies(selectedPost.post.postId, replyPage)}
              hasMore={true}
            />}
            </div>)}
   
            {/* Replies with selected post, mapped out */}
            {viewReplies === true && replies.map((reply, index) => (
                <div className="post" onMouseEnter={(e) => handleToggleReplyImageTrashIcon(reply.reply.replyId, e)} onMouseLeave={(e) => handleToggleReplyImageTrashIcon(-1, e)}
                onTouchStart={(e) => handleToggleReplyImageTrashIcon(reply.reply.replyId, e)}>
                  <div className="post__details">
                      <div className="post__author-container">
                      <div className="cinematica__profile-circle" onClick={() => handleViewProfile(reply.reply.userId)}><img src={reply.profilePicture !== undefined && reply.profilePicture !== '' ? reply.profilePicture : profilePicture} alt={''} className="post-image" /></div>
                      <div>
                          <p className="post-author" onClick={() => handleViewProfile(reply.reply.userId)}>{reply.userName !== undefined ? reply.userName : profileUsername}</p>
                      </div>
                      </div>
                      <div>
                      <p className="post-date">{getFormattedPostCreatedAt(reply.reply.createdAt)}</p>
                      </div>
                  </div>
                  {reply.reply.replyId === showReplyImageTrashIcon && reply.reply.userId === userId && <div className="post__delete-icon" onClick={() => handleDeleteReply(reply.reply.replyId)} onTouchStart={() => handleDeleteReply(reply.reply.replyId)}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                  <p className="post-content">{reply.reply.body}</p>
                  <div className="post-stats">
                    {reply.youLike === false ? <div className="post-likes" onClick={() => handleLikeReply(reply.reply.replyId)}><i class='	fa fa-heart-o'></i> {reply.likesCount}</div> : <div className="post-likes" onClick={() => handleLikeReply(reply.reply.replyId)}><i class='	fa fa-heart'></i> {reply.likesCount}</div>}
                  </div>
              </div>
            ))}
      </div> 
    );
};
    
export default Posts;