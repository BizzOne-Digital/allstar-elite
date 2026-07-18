import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { IconCart, IconSearch, IconStar, IconGrid, IconList, IconHeart } from '../components/ui/Icons';
import useReveal from '../hooks/useReveal';
import './Shop.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState('grid');
  const [wishlist, setWishlist] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    api.get('/products').then(r => {
      setProducts(r.data.products || []);
    }).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  useReveal([loading]);

  const cats = ['All', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleWish = (id) => setWishlist(w => w.includes(id) ? w.filter(i => i !== id) : [...w, id]);

  const handleAdd = (product) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="shop page-enter">
      {/* Header */}
      <div className="shop__header">
        <div className="shop__header-bg" />
        <div className="container shop__header-inner">
          <div className="section-label">Official Merchandise</div>
          <h1 className="section-title">AllStar Elite <span className="grad-text">Shop</span></h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>Exclusive merch from your favorite artists. Limited drops. Official gear.</p>
        </div>
      </div>

      <div className="container shop__body">
        {/* Filters */}
        <div className="shop__filters">
          <div className="shop__search">
            <IconSearch size={16} />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="shop__cats">
            {cats.map(c => (
              <button key={c} className={`shop__cat-btn${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="shop__view">
            <button onClick={() => setView('grid')} className={view === 'grid' ? 'active' : ''}><IconGrid size={18}/></button>
            <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}><IconList size={18}/></button>
          </div>
        </div>

        <p className="shop__count">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Grid */}
        {loading ? (
          <div className={`shop__grid shop__grid--${view}`}>
            {[...Array(6)].map((_, i) => <div className="product-card product-card--skeleton" key={i} />)}
          </div>
        ) : (
          <div className={`shop__grid shop__grid--${view} reveal-stagger reveal`}>
            {filtered.map(p => (
              <div className={`product-card${view === 'list' ? ' product-card--list' : ''}`} key={p._id}>
                <div className="product-card__img-wrap">
                  <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80'} alt={p.name} />
                  {p.stock <= 5 && p.stock > 0 && <div className="product-card__badge">Only {p.stock} left</div>}
                  {p.stock === 0 && <div className="product-card__badge product-card__badge--out">Sold Out</div>}
                  <button className={`product-card__wish${wishlist.includes(p._id) ? ' active' : ''}`} onClick={() => toggleWish(p._id)}>
                    <IconHeart size={16} filled={wishlist.includes(p._id)} />
                  </button>
                </div>
                <div className="product-card__info">
                  <span className="product-card__cat">{p.category}</span>
                  <h3 className="product-card__name">{p.name}</h3>
                  {p.avgRating > 0 && (
                    <div className="product-card__rating">
                      <IconStar size={13} filled style={{ color: 'var(--gold)' }} />
                      <span>{p.avgRating.toFixed(1)}</span>
                      <small>({p.ratings?.length || 0} reviews)</small>
                    </div>
                  )}
                  <div className="product-card__footer">
                    <span className="product-card__price">${p.price.toFixed(2)}</span>
                    <button className="btn btn-primary product-card__add" onClick={() => handleAdd(p)} disabled={p.stock === 0}>
                      <IconCart size={15} /> {p.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="shop__empty">
            <IconCart size={48} style={{ color: 'var(--gray-300)' }} />
            <h3>No products found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      {/* How to Buy */}
      <div className="shop__how">
        <div className="container">
          <h2 className="section-title reveal" style={{ textAlign: 'center', marginBottom: 48 }}>How to <span className="grad-text">Buy</span></h2>
          <div className="shop__how-grid reveal-stagger reveal">
            {[
              { step: '01', title: 'Browse & Select', desc: 'Explore official merch and pick the items you love.' },
              { step: '02', title: 'Add to Cart', desc: 'Choose quantity and add your favorite products to the cart.' },
              { step: '03', title: 'Checkout Securely', desc: 'Pay safely with Stripe — no hidden fees, ever.' },
              { step: '04', title: 'Track Your Order', desc: 'Get updates from your Dashboard until it\'s delivered.' },
            ].map(s => (
              <div className="shop__how-card" key={s.step}>
                <span className="shop__how-step">{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
