import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { users as usersApi } from '../api';

function Profile({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [userRes, postsRes] = await Promise.all([
        usersApi.get(id),
        usersApi.getPosts(id)
      ]);
      setUser(userRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    setLoading(false);
  };

  const handleFollow = async () => {
    try {
      if (user.is_following) {
        const { data } = await usersApi.unfollow(id);
        setUser({ ...user, ...data.user, is_following: false });
      } else {
        const { data } = await usersApi.follow(id);
        setUser({ ...user, ...data.user, is_following: true });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="loading">User not found</div>;
  }

  return (
    <div>
      <div className="profile-header">
        <div className="profile-avatar">
          {user.username[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>
            {user.username}
            {!user.is_self && (
              <button 
                onClick={handleFollow}
                className={user.is_following ? 'following' : 'follow'}
              >
                {user.is_following ? 'Following' : 'Follow'}
              </button>
            )}
          </h2>
          <div className="profile-stats">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{user.followers_count}</strong> followers</span>
            <span><strong>{user.following_count}</strong> following</span>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-feed">No posts yet</div>
      ) : (
        <div className="profile-posts">
          {posts.map(post => (
            <img
              key={post.id}
              src={post.image_url}
              alt={post.caption}
              onClick={() => navigate(`/post/${post.id}`)}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Image';
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
