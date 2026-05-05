import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // 1. Fetch Products
    const fetchVaultItems = async () => {
      let { data } = await supabase.from('products').select('*');
      setProducts(data || []);
      setLoading(false);
    };
    fetchVaultItems();

    // 2. Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 3. Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (type) => {
    const { error } = type === 'signup' 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) alert(error.message);
    else setShowAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- HEADER --- */}
      <nav style={{ position: 'absolute', top: 0, width: '100%', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', zItems: 10, boxSizing: 'border-box' }}>
        <img src="https://res.cloudinary.com/dsviustds/image/upload/v1776948035/Whiscraft-logo_logo-Dark_1035x267_xanion.png" alt="Whiscraft" style={{ height: '25px' }} />
        {user ? (
          <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
            <span style={{fontSize:'10px', fontWeight:'700'}}>{user.email.split('@')[0]}</span>
            <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #000', padding: '8px 15px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>LOGOUT</button>
          </div>
        ) : (
          <button onClick={() => setShowAuth(true)} style={{ background: 'none', border: 'none', fontWeight: '700', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer' }}>SIGN IN</button>
        )}
      </nav>

      {/* --- HERO --- */}
      <section style={{ height: '100vh', backgroundImage: "url('https://res.cloudinary.com/dsviustds/image/upload/v1777284354/make_it_more_202604271405_vzrvsi.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', padding: '0 60px' }}>
        <div style={{ maxWidth: '900px' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 8vw, 82px)', fontWeight: '300', lineHeight: '1.1' }}>Whiscraft is coming to protect the craft.</h1>
          <button style={{ backgroundColor: '#000', color: '#FFF', padding: '18px 42px', border: 'none', fontSize: '11px', letterSpacing: '0.15em', fontWeight: '600', marginTop: '40px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>EXPLORE VAULT</button>
        </div>
      </section>

      {/* --- GRID --- */}
      <section style={{ padding: '100px 60px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '54px', fontStyle: 'italic', marginBottom: '60px', fontWeight: '300' }}>The Curated Library.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
          {products.map((item) => (
            <div key={item.id} onClick={() => setSelectedProduct(item)} style={{ cursor: 'pointer' }}>
              <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#F0F0F0', marginBottom: '20px' }}>
                <img src={item.media_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontSize: '22px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- AUTH MODAL --- */}
      {showAuth && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.98)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', marginBottom: '30px' }}>Enter the Portal</h2>
            <input type="email" placeholder="Email" style={{ width: '100%', padding: '15px', marginBottom: '10px', border: '1px solid #EEE' }} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" style={{ width: '100%', padding: '15px', marginBottom: '20px', border: '1px solid #EEE' }} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => handleAuth('signin')} style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#FFF', border: 'none', fontWeight: '700', marginBottom: '10px', cursor: 'pointer' }}>SIGN IN</button>
            <button onClick={() => handleAuth('signup')} style={{ width: '100%', padding: '15px', background: 'none', border: '1px solid #000', fontWeight: '700', cursor: 'pointer' }}>CREATE ACCOUNT</button>
            <p onClick={() => setShowAuth(false)} style={{ marginTop: '20px', fontSize: '10px', cursor: 'pointer', textDecoration: 'underline' }}>CLOSE</p>
          </div>
        </div>
      )}

      {/* --- PRODUCT MODAL (UNCHANGED) --- */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ width: '90%', maxWidth: '1200px', height: '80vh', display: 'flex', backgroundColor:'#FFF', boxShadow:'0 50px 100px rgba(0,0,0,0.1)' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '20px', right: '40px', border: 'none', background: 'none', fontWeight: '700', cursor: 'pointer' }}>CLOSE [X]</button>
              <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <img src={selectedProduct.media_url} style={{ height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ width: '400px', padding: '60px', borderLeft: '1px solid #EEE', display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', fontStyle: 'italic' }}>{selectedProduct.title}</h1>
                <p style={{ color: '#666', lineHeight: '1.6', margin: '30px 0' }}>{selectedProduct.description}</p>
                <button style={{ backgroundColor: '#000', color: '#FFF', padding: '18px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                  {user ? 'ADD TO CART' : 'SIGN IN TO PURCHASE'}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
