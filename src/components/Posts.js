import React, { useState } from 'react';
// Oppenheimer movie id: 872585
// Spider-Man: Across the Spiderverse movie id: 569094
const Posts = ({userId, postTab, posts, setPosts, postPage, handleViewProfile, handleToggleMovieDetails}) => {
  const [selectedPost, setSelectedPost] = useState([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [viewPost, setViewPost] = useState(false);
  const [createReplyText, setCreateReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [replyPage, setReplyPage] = useState(1);

  const [searchPostTag, setSearchPostTag] = useState('');
  const [searchPostResults, setSearchPostResults] = useState([]);
  const [movieTaggedForPostSearch, setTaggedMovieForPostSearch] = useState([]);

  const handleToggleReplies = (index) => {
      setCreateReplyText('');
      console.log(posts);
      console.log(index);
      if (index !== "none"){
        // handleTempRemoveSpoilerMessage(index);
        const selectedPostFromPosts = posts[index];
        // /* Remove the trash icon when viewing Replies of your own post */
        // if (selectedPostFromPosts.lastIndexOf("post__delete-icon") !== -1)
        //   selectedPostFromPosts[selectedPostFromPosts.lastIndexOf("post__delete-icon")] = "hideTrashIcon";
        setSelectedPost(selectedPostFromPosts);
        setSelectedPostIndex(index);
        getReplies(selectedPostFromPosts.post.postId, replyPage);
        setViewPost(true);
      } else {
        setSelectedPost([]);
        setSelectedPostIndex(null);
        setViewPost(false);
        // Restore post to hiding the trash icon to prevent error
        const restorePosts = [...posts];
        // let lastIndex = restorePosts[selectedPostIndex].lastIndexOf("hideTrashIcon") !== -1 ? restorePosts[selectedPostIndex].lastIndexOf("hideTrashIcon") : restorePosts[selectedPostIndex].lastIndexOf("post__delete-icon");
        // restorePosts[selectedPostIndex][lastIndex] = "hideTrashIcon";
        setPosts(restorePosts);
      }
    };

    const getReplies = (postId, replyPage) => {
      fetch('https://localhost:53134/api/posts/ ' + postId + '/replies/' + replyPage + '?userId=' + userId, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      })
      .then(response => {
          if (response.ok) { // Check if the response status code is in the 2xx range
              return response.json().then(data => {
                console.log(data);
                setReplies(data);
                setReplyPage(replyPage + 1);
              });
          } else {
              alert(response.title);
          }
      })
      .catch(error => {
          console.error('Error during getting user details', error);
      });
    }
  
    // const toggleDeleteIcon = (array, type, index) => {
    //   const newArray = [...array];
    //   if (index === -1){
    //     let lastIndex = newArray.lastIndexOf("hideTrashIcon") !== -1 ? newArray.lastIndexOf("hideTrashIcon") : newArray.lastIndexOf("post__delete-icon");
    //     newArray[lastIndex] = newArray[lastIndex] === "hideTrashIcon" ? "post__delete-icon" : "hideTrashIcon";
    //     setSelectedPost(newArray);
    //   }
    //   else if (type === "post"){
    //     let lastIndex = newArray[index].lastIndexOf("hideTrashIcon") !== -1 ? newArray[index].lastIndexOf("hideTrashIcon") : newArray[index].lastIndexOf("post__delete-icon");
    //     newArray[index][lastIndex] = newArray[index][lastIndex] === "hideTrashIcon" ? "post__delete-icon" : "hideTrashIcon";
    //     setPosts(newArray);
    //   } else if (type === "replies") {
    //     let lastIndex = newArray[selectedPost.post.Index][index].lastIndexOf("hideTrashIcon") !== -1 ? newArray[selectedPost.post.Index][index].lastIndexOf("hideTrashIcon") : newArray[selectedPost.post.Index][index].lastIndexOf("post__delete-icon");
    //     newArray[selectedPost.post.Index][index][lastIndex] = newArray[selectedPost.post.Index][index][lastIndex] === "hideTrashIcon" ? "post__delete-icon" : "hideTrashIcon";
    //     setReplies(newArray);
    //   }
    // };

    function getFormattedPostCreatedAt(createdAt) {
      const dateAndTime = createdAt.split('T');
      const date = dateAndTime[0].split('-');
      const time = dateAndTime[1].split(':');
      const yearTwoDigits = date[0] - 2000;
      const amOrPM = time[0] > 11 ? "pm" : "am";
      return date[2] + "/" + date[1] + "/" + yearTwoDigits + " " + time[0] + ":" + time[1] + amOrPM;
    }
  
    const handleAddReply = () => {
      const updatedReplies = [...replies];
      // let newReply = [username, getFormattedPostCreatedAt(), createReplyText, 0, "hideTrashIcon"];
      // updatedReplies[selectedPostIndex].unshift(newReply);
      setReplies(updatedReplies);
      setCreateReplyText('');
    }
  
    const handleTempRemoveAllSpoilers = () => {
      // let restorePosts = [...posts];
      // if (restorePosts.length > 0){
      //   restorePosts.map((post) => {
      //     post[8] = false;
      //     return post;
      //   });
      // }
      // setPosts(restorePosts);
    }
  
    const handleTempRemoveSpoilerMessage = (index) => {
      // const restorePosts = [...posts];
      // let lastIndex = restorePosts[index].lastIndexOf(true);
      // restorePosts[index][lastIndex] = false;
      // setPosts(restorePosts);
    }

    // Replace
    const searchPostsByMovie = (search) => {
      if (search === ""){
        setSearchPostResults([]);
        return;
      }
      try {
        fetch('https://localhost:53134/api/movies/search/' + search, {
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
            alert(response.title);
          }
        })
      } catch (error) {
        console.error('Error getting movie search results:', error);
      }
    }
  
    // Replace
    const getPostsByTaggedMovie = (id) => {
      try {
        fetch('https://localhost:53134/api/posts/search/' + id + '/1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.ok) {
            response.json().then(data => {
              setPosts(data);
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

    const handleAddTaggedMovieForPostSearch = (id, title, releaseYear) => {
      let newMovieTagged = {
        id: id,
        title: title,
        releaseYear: releaseYear
      }
      setTaggedMovieForPostSearch(newMovieTagged);
      getPostsByTaggedMovie(id);
      // Reset the search bar and results
      setSearchPostTag("");
      setSearchPostResults([]);
      // document.getElementById("search-results").style.visibility = "hidden";
    }
  
    const removeTagForSearchPost = () => {
      setTaggedMovieForPostSearch([]);
      // Add post refresh
    }

    const handleLikeReply = (replyId) => {
      if (userId === ''){
        alert("Sign in to like!");
        return;
      }
      // Send id data to server
      fetch('https://localhost:53134/api/replies/like/' + userId + '/' + replyId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
          // Local update to the like button
          const replyIndex = replies.findIndex(reply => reply.reply.replyId === replyId);
          if (replyIndex !== -1) {
            console.log(replyIndex);
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
      fetch('https://localhost:53134/api/posts/like/' + userId + '/' + postId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
          // Local update to the like button
          const postIndex = posts.findIndex(post => post.post.postId === postId);
          if (postIndex !== -1 && selectedPostIndex === "none") {
            console.log(postIndex);
            const updatedPosts = [...posts];
            updatedPosts[postIndex] = {...updatedPosts[postIndex], youLike: !updatedPosts[postIndex].youLike};
            if (updatedPosts[postIndex].youLike === true)
              updatedPosts[postIndex] = {...updatedPosts[postIndex], likesCount: updatedPosts[postIndex].likesCount + 1};
            else
              updatedPosts[postIndex] = {...updatedPosts[postIndex], likesCount: updatedPosts[postIndex].likesCount - 1};
            setPosts(updatedPosts);
          }
          else {
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
    
    return (<div className="post-container">
        {/* Pre-posts */}
        <div>
          <br/>
          <input type="text" className="searchBar search__timeline" value={searchPostTag} placeholder="Search posts by movie..." onChange={(e) => {setSearchPostTag(e.target.value); searchPostsByMovie(e.target.value);}} /><br/>
        </div>
        {/* Change class names */}
        <div>
          {/* Display search results here */}
          {searchPostResults.map((result) => (
            <div key={result.id} onClick={() => handleAddTaggedMovieForPostSearch(result.id, result.title, result.releaseYear)}>{result.title} ({result.releaseYear})</div>
          ))}
        </div>
        {movieTaggedForPostSearch.id !== undefined && <div className="post-movie">
          <span onClick={() => handleToggleMovieDetails(movieTaggedForPostSearch.id)}>Posts for <i class='fa fa-film'></i> {movieTaggedForPostSearch.title} ({movieTaggedForPostSearch.releaseYear}) </span>
          <button onClick={() => removeTagForSearchPost()}>Remove</button>
        <br/> </div>}
        <br/>
        <label for="revealAllSpoilers">Reveal all potential spoiler posts</label>
        <input type="radio" value="revealAllSpoilers" onChange={(e) => handleTempRemoveAllSpoilers()} />
        {/* Posts, mapped out */}
        {viewPost === false && posts.length > 0 &&
           posts.map((post, index) => (
              <div className="mock-post">
              {/* <div className="mock-post"  onMouseEnter={e => toggleDeleteIcon(posts, "post", index)} onMouseLeave={e => toggleDeleteIcon(posts, "post", index)}> */}
                  <div className="post__details">
                      <div className="post__author-container">
                      <div className="cinematica__profile-circle" onClick={() => handleViewProfile(post.post.userId)}></div>
                      <div>
                          <p className="post-author" onClick={() => handleViewProfile(post.post.userId)}>{post.userName}</p>
                      </div>
                      </div>
                      <div>
                        <p className="post-date">{getFormattedPostCreatedAt(post.post.createdAt)}</p>
                      </div>
                  </div>
                  {post.post.userId === userId && <div className=""><i class="fa fa-trash" aria-hidden="true"></i></div>}
                  {post.post.isSpoiler === false || post.post.userId === userId ? <p className="post-content">{post.post.body}</p> : <p className="post-content" onClick={() => handleTempRemoveSpoilerMessage(index)}>Warning: Potential spoilers! Click this text or "Replies" to reveal...</p>}
                  {/* {post[3] !== '' && (post.post.isSpoiler === false || post.post.userId === userId) && <img src={post[3]} alt={`Post ${index}`} className="post-image" />} */}
                  {/* Need mapping */}
                  {/* <p className="post-movie" onClick={() => handleToggleMovieDetails(post.post.movies[0].id)}><i class='fa fa-film'></i> {post.post.movies[0].title}</p> */}
                  <div className="post-stats">
                      {post.youLike === false ? <div className="post-likes" onClick={() => handleLikePost(post.post.postId)}><i class='	fa fa-heart-o'></i> {post.likesCount}</div> : <div className="post-likes" onClick={() => handleLikePost(post.post.postId)}><i class='	fa fa-heart'></i> {post.likesCount}</div>}
                      <div className="post-comments" onClick={() => handleToggleReplies(index)}>{post.commentsCount} Replies</div>
                  </div>
              </div>
          ))}
          {/* Selected post with reply section */}
          {viewPost === true && (<div>
            <button className="back" onClick={() => handleToggleReplies("none")}><i class='fa fa-arrow-left'></i>&emsp;Back</button>
            <div className="mock-post">
            {/* <div className="mock-post" onMouseEnter={e => toggleDeleteIcon(selectedPost.post., "post", -1)} onMouseLeave={e => toggleDeleteIcon(selectedPost.post., "post", -1)}> */}
              <div className="post__details">
                  <div className="post__author-container">
                  <div className="cinematica__profile-circle" onClick={() => handleViewProfile(selectedPost.post.userId)}></div>
                  <div>
                      <p className="post-author" onClick={() => handleViewProfile(selectedPost.post.userId)}>{selectedPost.userName}</p>
                  </div>
                  </div>
                  <div>
                    <p className="post-date">{getFormattedPostCreatedAt(selectedPost.post.createdAt)}</p>
                  </div>
              </div>
              {selectedPost.post.userId === userId && <div className={""}><i class="fa fa-trash" aria-hidden="true"></i></div>}
              <p className="post-content">{selectedPost.post.body}</p>
              {/* {selectedPost.post.[3] !== '' && <img src={selectedPost.post.[3]} alt={`Post`} className="post-image" />} */}
              {/* <p className="post-movie" onClick={() => handleToggleMovieDetails(post.post.movies[0].id)}><i class='fa fa-film'></i> {post.post.movies[0].title}</p> */}
              <div className="post-stats">
                  {selectedPost.youLike === false ? <div className="post-likes" onClick={() => handleLikePost(selectedPost.post.postId)}><i class='	fa fa-heart-o'></i> {selectedPost.likesCount}</div> : <div className="post-likes" onClick={() => handleLikePost(selectedPost.post.postId)}><i class='	fa fa-heart'></i> {selectedPost.likesCount}</div>}
                  <div className="post-comments" onClick={() => handleToggleReplies("none")}>{selectedPost.commentsCount} Replies</div>
              </div>
            </div>
            <br/>
            {/* Create reply */}
            <div className="comment-box__container">
              <input type="text" className="comment-box__text" value={createReplyText} maxLength={280} placeholder="Write your reply..." onChange={(e) => setCreateReplyText(e.target.value)} required />
              <i class='fa fa-send' onClick={() => handleAddReply()}></i>
            </div>
            <div>
            {/* Replies for selected post, mapped out */}
            {selectedPostIndex != null && replies.map((reply, index) => (
                <div className="mock-post">
                {/* <div className="mock-post" onMouseEnter={e => toggleDeleteIcon(replies, "replies", index)} onMouseLeave={e => toggleDeleteIcon(replies, "replies", index)}> */}
                  <div className="post__details">
                      <div className="post__author-container">
                      <div className="cinematica__profile-circle" onClick={() => handleViewProfile(reply.reply.userId)}></div>
                      <div>
                          <p className="post-author" onClick={() => handleViewProfile(reply.reply.userId)}>{reply.userName}</p>
                      </div>
                      </div>
                      <div>
                      <p className="post-date">{getFormattedPostCreatedAt(reply.reply.createdAt)}</p>
                      </div>
                  </div>
                  {reply.reply.userId === userId && <div className={""}><i class="fa fa-trash" aria-hidden="true"></i></div>}
                  <p className="post-content">{reply.reply.body}</p>
                  <div className="post-stats">
                    {reply.youLike === false ? <div className="reply-likes" onClick={() => handleLikeReply(reply.reply.replyId)}><i class='	fa fa-heart-o'></i> {reply.likesCount}</div> : <div className="reply-likes" onClick={() => handleLikeReply(reply.reply.replyId)}><i class='	fa fa-heart'></i> {reply.likesCount}</div>}
                  </div>
              </div>
            ))}
          </div>
          </div>)}
      </div> 
    );
};
    
export default Posts;