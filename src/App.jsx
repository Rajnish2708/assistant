import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Avatar from './components/Avatar';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  const [isTalking, setIsTalking] = useState(false);
  const [captionQueue, setCaptionQueue] = useState([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [typedText, setTypedText] = useState('');

  // Typing effect
  useEffect(() => {
    if (!currentCaption) return;

    let charIndex = 0;
    setTypedText('');
    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + currentCaption[charIndex]);
      charIndex++;
      if (charIndex >= currentCaption.length) clearInterval(typingInterval);
    }, 30); // typing speed

    return () => clearInterval(typingInterval);
  }, [currentCaption]);

  // Queue next sentence after typing finishes
  useEffect(() => {
    if (typedText === currentCaption && captionQueue.length > 0) {
      const timeout = setTimeout(() => {
        const next = captionQueue.shift();
        setCurrentCaption(next || '');
        setCaptionQueue([...captionQueue]);
      }, 2000); // wait before next sentence
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  const handleCaptionUpdate = (fullText) => {
    // 1. Remove any undefined/null
    if (!fullText || typeof fullText !== 'string') return;  
  
    // 2. Clean extra whitespace and split by punctuation
    const cleanedText = fullText.trim().replace(/\s+/g, ' ');
    const sentences = cleanedText.match(/[^.!?]+[.!?]?/g) || [cleanedText];
  
    // 3. Filter out empty strings and reset caption queue
    const filtered = sentences.map(s => s.trim()).filter(Boolean);
  
    setCaptionQueue(filtered);
    setCurrentCaption(filtered[0] || '');
    setTypedText('');
  };
  

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0 }}>
      {/* 3D Avatar Section */}
      <div style={{ flex: 1, position: 'relative', background: '#262A1B' }}>
        <Canvas
          camera={{ position: [0, 1.5, 3.5], fov: 30 }}
          style={{ height: '100%', width: '100%' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <Environment preset="studio" />
          <Avatar isTalking={isTalking} />
          <OrbitControls enablePan={false} />
        </Canvas>

        {/* Caption Typing Display */}
        {typedText && (
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '500',
              maxWidth: '70%',
              textAlign: 'center',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {typedText}
          </div>
        )}
      </div>

      {/* Voice Assistant UI */}
      <div
        style={{
          flex: 0.4,
          padding: '20px',
          backgroundColor: '#f0f0f0',
          height: '100%',
        }}
      >
        <VoiceAssistant
          onSpeakStart={() => setIsTalking(true)}
          onSpeakEnd={() => setIsTalking(false)}
          onCaptionUpdate={handleCaptionUpdate} // updated
        />
      </div>
    </div>
  );
}

export default App;
