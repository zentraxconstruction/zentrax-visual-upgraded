import React, { useState, useEffect } from 'react';

export default function RightPopup({ children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    // prevent body scroll when popup is open (optional)
    if (open) document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div style={styles.wrapper} role="dialog" aria-label="Floating info card">
      <div style={styles.card}>
        <button aria-label="Close" onClick={() => setOpen(false)} style={styles.close}>
          ✕
        </button>
        <div style={styles.inner}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'fixed',
    top: 84,
    right: 28,
    zIndex: 1200,
    pointerEvents: 'auto'
  },
  card: {
    width: 320,
    maxWidth: 'calc(100vw - 48px)',
    borderRadius: 12,
    background: 'linear-gradient(180deg, rgba(6,6,10,0.85), rgba(10,10,12,0.85))',
    border: '1px solid rgba(212,175,55,0.12)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden'
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 10,
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    cursor: 'pointer',
    padding: 6,
    lineHeight: 1
  },
  inner: {
    padding: '18px 18px 20px',
    fontFamily: 'Outfit, sans-serif'
  }
};
