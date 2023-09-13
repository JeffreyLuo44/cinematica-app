import './../css/App.css';
import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import VerifyRegistration from './VerifyRegistration';
import PasswordReset from './PasswordReset';
import Timeline from './Timeline';
import Profile from './Profile';

function App() {
  const [page, setPage] = useState("timeline");
  const [userId, setUserId] = useState('a33c0775-1406-4cc3-81ec-16151ecc4ade');
  const [username, setUsername] = useState('jeffrey');
  const [email, setEmail] = useState('');
  const [mockPosts, setMockPosts] = useState([]);
  const [mockReplies, setMockReplies] = useState("");
  const [mockUser] = useState("SpiderManFan");
  const [otherMockUser] = useState("ThatMovieAddict");
  const [otherMockUser2] = useState("PenguinClub");

  useEffect(() => {
    // Eventually need to add spoiler field
    // Like and reply count fields are placeholders for now
    // Movie id will be part of the post data 
    setMockPosts([[otherMockUser, '18/8/23 7:56am', 'Just watched #Oppenheimer and I’m blown away by the brilliant performance of Cillian Murphy and the stunning cinematography of Hoyte van Hoytema. Nolan has done it again, delivering a masterpiece that explores the moral dilemmas and personal struggles of the man behind the atomic bomb. A must-watch for all film lovers! 🎥👏👏👏',
    '', 'Oppenheimer (2023)', '657', '', "hideTrashIcon", false, 872585],
    [mockUser,'16/8/23 9:43pm', 'The visuals of Spider-Man: Across the Spider-Verse is simply GOREGOUS! #loveit',
    'spidermans.jpg', 'Spider-Man: Across the Spider-Verse (2023)', '238', '', "hideTrashIcon", true, 569094]]);
    setMockReplies([[[mockUser, '20/8/23 9:43pm', 'I agree! I don’t usually watch other genres, but this one is a must-watch!', '238', "hideTrashIcon"],
    [otherMockUser2, '19/8/23 5:21pm', 'Thanks for the recommendation! I just left the cinema and WOW! That was AMAZING!', '552', "hideTrashIcon"]],[]]);
    // handleGetPosts();
    // handleGetNotificationPreference();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      {page==="login" && <Login setPage={setPage}  userId={userId} setUserId={setUserId} username={username} setUsername={setUsername}/>}
      {page==="register" && <Register setPage={setPage}  userId={userId} setUserId={setUserId} email={email} setEmail={setEmail} username={username} setUsername={setUsername} />}
      {page==="verifyRegistration" && <VerifyRegistration setPage={setPage} userId={userId} setUserId={setUserId} email={email} username={username} setUsername={setUsername}/>}
      {page==="passwordReset" && <PasswordReset setPage={setPage}/>}
      {page==="timeline" && <Timeline setPage={setPage} userId={userId} setUserId={setUserId} username={username} setEmail={setEmail} setUsername={setUsername}
        mockPosts={mockPosts} setMockPosts={setMockPosts} mockReplies={mockReplies} setMockReplies={setMockReplies} mockUser={mockUser} otherMockUser={otherMockUser} otherMockUser2={otherMockUser2}/>}
      {page==="profile" && <Profile setPage={setPage} userId={userId} setUserId={setUserId} username={username} setUsername={setUsername}
        mockPosts={mockPosts} setMockPosts={setMockPosts} mockReplies={mockReplies} setMockReplies={setMockReplies} mockUser={mockUser} otherMockUser={otherMockUser} otherMockUser2={otherMockUser2}/>}
    </div>
  );
}

export default App;
