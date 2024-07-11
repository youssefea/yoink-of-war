"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

const DisplayPageContent = () => {
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const imageParam = searchParams.get('image');
    const textParam = searchParams.get('text');
    setImage(imageParam);
    setText(textParam);
  }, [searchParams]);

  return (
    <div style={styles.box}>
      <h1 style={styles.title}>Message Content</h1>
      {image && (
        <div style={styles.content}>
          <p><strong>Image:</strong></p>
          <img src={image} alt="Provided image" style={styles.image} />
        </div>
      )}
      {text && (
        <div style={styles.content}>
          <p><strong>Message Text:</strong></p>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

const DisplayPage = () => (
  <div style={styles.container}>
    <Suspense fallback={<div>Loading...</div>}>
      <DisplayPageContent />
    </Suspense>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '10px',
    boxSizing: 'border-box' as 'border-box',
  },
  box: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'black',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  content: {
    marginBottom: '20px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
  },
  '@media (max-width: 600px)': {
    title: {
      fontSize: '1.2rem',
    },
    box: {
      padding: '15px',
    },
  },
};

export default DisplayPage;
