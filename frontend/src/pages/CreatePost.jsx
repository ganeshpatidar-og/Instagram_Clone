import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { posts as postsApi } from '../api';

function CreatePost({ user }) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await postsApi.create({ image_url: imageUrl, caption });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    }
    setLoading(false);
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="image-preview"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Share'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
