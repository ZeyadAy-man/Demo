import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function CharacterModel({ playerRef, animationState }) {
  const { scene, animations } = useGLTF("/Character.glb");
  console.log(scene, animations);
  const mixerRef = useRef();
  const actionsRef = useRef({});
  const currentActionRef = useRef();

  useEffect(() => {
    if (!scene || !animations.length) return;

    mixerRef.current = new THREE.AnimationMixer(scene);

    animations.forEach((clip) => {
      const action = mixerRef.current.clipAction(clip);
      actionsRef.current[clip.name] = action;
    });

    if (actionsRef.current['Armature_1|mixamo.com|Layer0.007']) {
      actionsRef.current['Armature_1|mixamo.com|Layer0.007'].play();
      currentActionRef.current = actionsRef.current['Armature_1|mixamo.com|Layer0.007'];
    }

    return () => mixerRef.current?.stopAllAction();
  }, [scene, animations]);

  useEffect(() => {
    if (!actionsRef.current || !animationState) return;

    const animationMap = {
      idle: animations[2].name,
      walk: animations[0].name,
      run: animations[1].name,
    };

    const targetAction = actionsRef.current[animationMap[animationState]];

    if (targetAction && targetAction !== currentActionRef.current) {
      currentActionRef.current?.fadeOut(0.2);
      targetAction.reset().fadeIn(0.2).play();
      currentActionRef.current = targetAction;
    }
  }, [animationState]);

  useFrame((state, delta) => {
    if (playerRef.current && scene) {
      scene.position.copy(playerRef.current.position);
      scene.rotation.copy(playerRef.current.rotation);
    }

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <primitive
      object={scene}
      scale={3}
      castShadow
      receiveShadow
    />
  );
}