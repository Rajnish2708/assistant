import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Avatar from './components/Avatar';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  const [isTalking, setIsTalking] = useState(false);
  const [captionQueue, setCaptionQueue] = useState([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [typedText, setTypedText] = useState('');

  const typingTimeoutRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Typing Effect
  useEffect(() => {
    if (!currentCaption) return;

    let charIndex = 0;
    setTypedText('');

    typingIntervalRef.current = setInterval(() => {
      if (charIndex < currentCaption.length) {
        const nextChar = currentCaption[charIndex];
        if (nextChar !== undefined) {
          // console.log('Typing:', nextChar);
          setTypedText((prev) => prev + nextChar);
          charIndex++;
        }
      } else {
        clearInterval(typingIntervalRef.current);
      }
    }, 30);

    return () => clearInterval(typingIntervalRef.current);
  }, [currentCaption]);

  // Advance to next caption when typing is complete
  useEffect(() => {
    if (typedText === currentCaption && captionQueue.length > 1) {
      typingTimeoutRef.current = setTimeout(() => {
        const [, ...remainingQueue] = captionQueue;
        setCaptionQueue(remainingQueue);
        setCurrentCaption(remainingQueue[0] || '');
      }, 2000);

      return () => clearTimeout(typingTimeoutRef.current);
    }
  }, [typedText, currentCaption, captionQueue]);

  // Caption handler from voice assistant
  const handleCaptionUpdate = (fullText) => {
    if (!fullText || typeof fullText !== 'string' || fullText === 'undefined') return;
  
    const cleanedText = fullText.trim().replace(/\s+/g, ' ');
    const sentences = cleanedText.match(/[^.!?]+[.!?]?/g) || [cleanedText];
    const filtered = sentences.map((s) => s.trim()).filter(Boolean);
  
    if (filtered.length === 0) return;
  
    setCaptionQueue(filtered);
    setCurrentCaption(filtered[0]);
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

        {/* Caption Display */}
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

      {/* Voice Assistant Panel */}
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
          onCaptionUpdate={handleCaptionUpdate}
        />
      </div>
    </div>
  );
}

export default App;
