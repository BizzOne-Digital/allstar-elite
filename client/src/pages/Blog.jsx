import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { IconArrowRight, IconSearch } from '../components/ui/Icons';
import useReveal from '../hooks/useReveal';
import './Blog.css';

const CATS = ['All', 'Tips & Strategy', 'Education', 'Monetization', 'Merchandise', 'Rights'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    api.get('/blog').then(r => setPosts(r.data.posts || [])).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);

  useReveal([loading]);

  const filtered = posts.filter(p => {
    const matchCat = cat === 'All' || p.category === cat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="blog-page page-enter">
      {/* Header */}
      <div className="blog-hero">
        <div className="blog-hero__bg" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="section-label" style={{ margin: '0 auto 16px' }}>Artist Resources</div>
          <h1 className="section-title">AllStar Elite <span className="grad-text">Blog</span></h1>
          <p className="section-sub" style={{ margin: '0 auto 32px' }}>Tips, guides, and industry insights to help independent artists grow their careers.</p>
          <div className="blog-search">
            <IconSearch size={16} />
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="container blog-body">
        {/* Categories */}
        <div className="blog-cats">
          {CATS.map(c => (
            <button key={c} className={`shop__cat-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)' }}>Loading articles…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)' }}>
            <h3>No articles found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <div className="blog-featured reveal">
                <div className="blog-featured__img">
                  <img src={featured.coverImage?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'} alt={featured.title} />
                  <span className="blog-featured__cat">{featured.category}</span>
                </div>
                <div className="blog-featured__content">
                  <div className="blog-meta">
                    <span>{new Date(featured.createdAt).toLocaleDateString()}</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <Link to={`/blog/${featured._id}`} className="btn btn-primary" style={{ marginTop: 20 }}>
                    Read Article <IconArrowRight size={16}/>
                  </Link>
                </div>
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="blog-grid reveal-stagger reveal">
                {rest.map(p => (
                  <div className="blog-card" key={p._id}>
                    <div className="blog-card__img">
                      <img src={p.coverImage?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'} alt={p.title} />
                      <span className="blog-card__cat">{p.category}</span>
                    </div>
                    <div className="blog-card__content">
                      <div className="blog-meta">
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                        <span>{p.readTime}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                      <Link to={`/blog/${p._id}`} className="blog-card__link">
                        Read more <IconArrowRight size={14}/>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
