'use client';
import { AppContext } from '@/context/IsPlayingContext';
import {
  Environment,
  Html,
  Loader,
  OrbitControls,
  SpotLight,
  useAnimations,
  useDepthBuffer,
  useGLTF,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useContext, useEffect, useRef } from 'react';
import { Vector3 } from 'three';

const Torch = ({ vec = new Vector3(), ...props }) => {
  const light = useRef<THREE.SpotLight>(null);
  const viewport = useThree((state) => state.viewport);
  const depthBuffer = useDepthBuffer({ frames: 1 });
  useFrame((state) => {
    light.current?.target.position.lerp(
      vec.set(
        (state.mouse.x * viewport.width) / 2,
        (state.mouse.y * viewport.height) / 2,
        0
      ),
      0.1
    );
    light.current?.target.updateMatrixWorld();
  });
  return (
    <SpotLight
      depthBuffer={depthBuffer}
      castShadow
      ref={light}
      penumbra={1}
      distance={10}
      angle={0.35}
      attenuation={5}
      anglePower={4}
      intensity={3}
      {...props}
    />
  );
};

//Resource to Head : https://sketchfab.com/3d-models/blender-sushi-virtual-journal-16th-april-2020-634af2ae983f4fb8a9295e6b1b3d5c74
const Head = () => {
  const { isPlaying, setIsPlaying } = useContext(AppContext);
  const { nodes, materials, animations, scene } = useGLTF('/head.glb');
  const { actions } = useAnimations(animations, scene);
  const action = actions.Animation;
  useEffect(() => {
    if (isPlaying) {
      action?.play();
    } else {
      action?.fadeOut(0.5);
      setTimeout(() => {
        action?.stop();
      }, 500);
    }
  }, [isPlaying, action]);
  return (
    <primitive color={'white'} object={scene} scale={3} rotation-z={0.2} />
  );
};

export const ChatBotCanvas = () => {
  return (
    <Canvas>
      <OrbitControls
        enableZoom={false}
        enableDamping
        maxPolarAngle={2}
        minAzimuthAngle={-Math.PI * 0.5}
        maxAzimuthAngle={Math.PI * 0.5}
      />
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.015} />
      <Suspense
        fallback={
          <Html>
            <Loader />
          </Html>
        }
      >
        <Head />
      </Suspense>
      <Torch color="blue" position={[3, 2, 2]} />
      <Torch color="#b00c3f" position={[-3, 2, 2]} />
    </Canvas>
  );
};
