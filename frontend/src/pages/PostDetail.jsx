import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { posts as postsApi } from '../api';

function PostDetail({ user }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        postsApi.get(id),
        postsApi.getComments(id)
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Error loading post:', error);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    try {
      if (post.is_liked) {
        const { data } = await postsApi.unlike(post.id);
        setPost(data);
      } else {
        const { data } = await postsApi.like(post.id);
        setPost(data);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { data } = await postsApi.addComment(id, newComment);
      setComments([data, ...comments]);
      setNewComment('');
      setPost({ ...post, comments_count: post.comments_count + 1 });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="loading">Post not found</div>;
  }

  return (
    <div>
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
          <button onClick={handleLike}>
            {post.is_liked ? '❤️' : '🤍'}
          </button>
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
      </div>

      <div className="comments-section">
        <form className="comment-form" onSubmit={handleComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" disabled={submitting || !newComment.trim()}>
            Post
          </button>
        </form>

        {comments.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8e8e8e', marginTop: '20px' }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <strong>
                <Link to={`/profile/${comment.user_id}`} style={{ color: '#262626', textDecoration: 'none' }}>
                  {comment.username}
                </Link>
              </strong>
              {comment.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostDetail;
