import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Connection to your Supabase Vault using the Vercel keys
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchVaultItems = async () => {
      let { data, error } = await supabase.from('products').select('*');
      if (error) console.error("Vault Sync Error:", error);
      else setProducts(data || []);
      setLoading(false);
    };
    fetchVaultItems();
  }, []);

  const styles = {
    hero: {
      height: '100vh',
      backgroundImage: "url('https://res.cloudinary.com/dsviustds/image/upload/v1777284354/make_it_more_202604271405_vzrvsi.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'clamp(20px, 5vw, 60px)',
      color: '#000'
    },
    tagline: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 'clamp(40px, 8vw, 82px)',
      fontWeight: '300',
      lineHeight: '1.1',
      maxWidth: '900px'
    },
    btnMain: {
      backgroundColor: '#000',
      color: '#FFF',
      padding: '18px 42px',
      border: 'none',
      fontSize: '11px',
      letterSpacing: '0.15em',
      fontWeight: '600',
      textTransform: 'uppercase',
      cursor: 'pointer',
      display: 'inline-block'
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="https://res.cloudinary.com/dsviustds/image/upload/v1776948035/Whiscraft-logo_logo-Dark_1035x267_xanion.png" alt="Whiscraft" style={{ height: '25px' }} />
          <button style={{ background: 'none', border: 'none', fontWeight: '700', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer' }}>SIGN IN</button>
        </div>

        <div>
          <h1 style={styles.tagline}>Whiscraft is coming to protect the craft.</h1>
          <button style={{...styles.btnMain, marginTop: '40px'}} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            EXPLORE CURATED LIBRARY
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: '700', letterSpacing: '0.15em' }}>
          <div><span style={{color: '#C1FF00'}}>●</span> VAULT SYNC ACTIVE</div>
          <div>EST. 2026</div>
        </div>
      </section>

      {/* --- GRID SECTION --- */}
      <section style={{ padding: '100px 5vw' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 54px)', fontStyle: 'italic', marginBottom: '60px', fontWeight: '300' }}>The Curated Library.</h2>
        
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '0.1em' }}>SYNCING...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
            {products.map((item) => (
              <div key={item.id} onClick={() => setSelectedProduct(item)} style={{ cursor: 'pointer' }}>
                <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#F0F0F0', marginBottom: '20px' }}>
                  <img src={item.media_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.category}</div>
                <div style={{ fontSize: '22px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{item.title}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- MODAL WINDOW --- */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '90%', maxWidth: '1200px', height: '85vh', display: 'flex', position: 'relative' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '-40px', right: '0', border: 'none', background: 'none', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>CLOSE [X]</button>
            
            <div style={{ flex: 1.5, overflowY: 'auto', padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <img src={selectedProduct.media_url} alt="View" style={{ width: isExpanded ? '100%' : '80%', height: 'auto', objectFit: 'contain', transition: '0.4s' }} />
            </div>

            <div style={{ width: '350px', padding: '40px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #EEE' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#2E5BFF', letterSpacing: '0.2em' }}>{selectedProduct.category}</span>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '38px', fontStyle: 'italic', margin: '20px 0' }}>{selectedProduct.title}</h1>
              <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#666', marginBottom: '40px' }}>{selectedProduct.description}</p>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button style={styles.btnMain}>ADD TO CART</button>
                <button style={{ border: '1px solid #000', padding: '16px', background: 'none', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>ADD TO WISHLIST</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
