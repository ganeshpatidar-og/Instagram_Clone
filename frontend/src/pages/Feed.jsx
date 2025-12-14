import { useState, useEffect } from 'react';
import { posts as postsApi } from '../api';
import PostCard from '../components/PostCard';

function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [viewAll, setViewAll] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [page, viewAll]);

  const loadPosts = async () => {
    try {
      const apiCall = viewAll ? postsApi.getAll : postsApi.getFeed;
      const { data } = await apiCall(page);
      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      setHasNext(data.has_next);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setLoading(false);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const toggleFeed = () => {
    setViewAll(!viewAll);
    setPage(1);
    setPosts([]);
    setLoading(true);
  };

  if (loading && posts.length === 0) {
    return <div className="loading">Loading feed...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={toggleFeed}
          style={{
            padding: '8px 16px',
            background: viewAll ? '#0095f6' : '#efefef',
            color: viewAll ? 'white' : '#262626',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          All Posts
        </button>
        <button 
          onClick={toggleFeed}
          style={{
            padding: '8px 16px',
            background: !viewAll ? '#0095f6' : '#efefef',
            color: !viewAll ? 'white' : '#262626',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Following
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="empty-feed">
          <p>No posts yet. {viewAll ? 'Be the first to post!' : 'Follow some users to see their posts here.'}</p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onUpdate={handlePostUpdate}
            />
          ))}
          {hasNext && (
            <button 
              onClick={() => setPage(p => p + 1)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'white',
                border: '1px solid #dbdbdb',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Feed;
