import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { IconArrowLeft } from '../components/ui/Icons';
import './Blog.css';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/blog/${id}`).then(r => setPost(r.data.post)).catch(() => setPost(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--gray-400)' }}>Loading…</div>;
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <h3>Article not found</h3>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="blog-post page-enter container" style={{ maxWidth: 760, padding: '48px 24px 100px' }}>
      <Link to="/blog" className="blog-card__link" style={{ marginBottom: 24, display: 'inline-flex' }}>
        <IconArrowLeft size={14}/> Back to Blog
      </Link>

      <div className="blog-meta" style={{ marginTop: 20 }}>
        <span>{post.category}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post.readTime}</span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: '12px 0 24px', color: 'var(--dark)' }}>{post.title}</h1>

      {post.coverImage?.url && (
        <img src={post.coverImage.url} alt={post.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 32 }} />
      )}

      <div style={{ fontSize: '1rem', lineHeight: 1.9, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>
        {post.content}
      </div>
    </div>
  );
}
