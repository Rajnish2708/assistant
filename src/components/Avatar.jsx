import React, { useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

const Avatar = ({ isTalking }) => {
  const { scene, animations } = useGLTF('/models/scene.gltf');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (isTalking && actions.Talking) {
      actions.Idle?.fadeOut(0.5);
      actions.Talking.reset().fadeIn(0.5).play();
    } else if (!isTalking) {
      if (actions.Idle) {
        actions.Talking?.fadeOut(0.5);
        actions.Idle.reset().fadeIn(0.5).play();
      } else {
        const fallback = Object.values(actions)[0];
        fallback?.reset().fadeIn(0.5).play();
      }
    }
  }, [isTalking, actions]);

  // Play Idle once on mount to avoid T-pose
  useEffect(() => {
    if (actions.Idle) {
      actions.Idle.reset().fadeIn(0.5).play();
    } else {
      const fallback = Object.values(actions)[0];
      fallback?.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return <primitive object={scene} position={[0, -1.2, 0]} />;
};

export default Avatar;
