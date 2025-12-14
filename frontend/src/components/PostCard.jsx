import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { posts as postsApi } from '../api';

function PostCard({ post, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (post.is_liked) {
        const { data } = await postsApi.unlike(post.id);
        onUpdate(data);
      } else {
        const { data } = await postsApi.like(post.id);
        onUpdate(data);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
    setLoading(false);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.user_id}`}>{post.username}</Link>
      </div>
      <img 
        src={post.image_url} 
        alt={post.caption} 
        className="post-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found';
        }}
      />
      <div className="post-actions">
        <button onClick={handleLike} disabled={loading}>
          {post.is_liked ? '❤️' : '🤍'}
        </button>
        <button onClick={() => navigate(`/post/${post.id}`)}>💬</button>
      </div>
      <div className="post-likes">
        {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
      </div>
      {post.caption && (
        <div className="post-caption">
          <strong>{post.username}</strong>
          {post.caption}
        </div>
      )}
      {post.comments_count > 0 && (
        <div className="post-comments-link" onClick={() => navigate(`/post/${post.id}`)}>
          View all {post.comments_count} comments
        </div>
      )}
      <div className="post-time">{formatTime(post.created_at)}</div>
    </div>
  );
}

export default PostCard;
