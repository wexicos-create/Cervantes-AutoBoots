import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvas3DProps {
  interactive?: boolean;
}

export const ThreeCanvas3D: React.FC<ThreeCanvas3DProps> = ({ interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040817, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1500
    );
    camera.position.set(0, 40, 180);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x040817, 1);
    container.appendChild(renderer.domElement);

    // 2. Lighting (Deep Dark Blue & Electric Cyan)
    const ambientLight = new THREE.AmbientLight(0x1e3a8a, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 2.5, 600);
    pointLight1.position.set(100, 150, 80);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x6366f1, 2, 600);
    pointLight2.position.set(-120, -60, 40);
    scene.add(pointLight2);

    // 3. Cyber 3D Grid Wave
    const gridGeometry = new THREE.PlaneGeometry(600, 600, 50, 50);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2.2;
    gridMesh.position.y = -70;
    scene.add(gridMesh);

    // 4. Floating 3D Geometries (Polyhedrons, Torus Knot, Icosahedrons)
    const geometriesGroup = new THREE.Group();
    scene.add(geometriesGroup);

    // Central Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(22, 5.5, 100, 16);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x1e40af,
      emissive: 0x0f172a,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: true,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    knotMesh.position.set(0, 30, -40);
    geometriesGroup.add(knotMesh);

    // Floating Icosahedrons
    const icoGeo = new THREE.IcosahedronGeometry(12, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const icos: THREE.Mesh[] = [];
    const positions = [
      [-90, 50, -20],
      [95, 60, -30],
      [-70, -20, 20],
      [80, -30, 10],
      [0, 80, -60],
    ];

    positions.forEach((pos) => {
      const ico = new THREE.Mesh(icoGeo, icoMat);
      ico.position.set(pos[0], pos[1], pos[2]);
      geometriesGroup.add(ico);
      icos.push(ico);
    });

    // 5. Star / Particle Field
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 800;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 800;
      particleScales[i] = Math.random() * 2 + 1;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 2.2,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 6. Interactive Mouse Movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener('mousemove', onMouseMove);

    // 7. Window Resize Handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;
      camera.position.x = targetX;
      camera.position.y = 40 - targetY;
      camera.lookAt(0, 10, 0);

      // Rotate objects
      knotMesh.rotation.x = elapsedTime * 0.25;
      knotMesh.rotation.y = elapsedTime * 0.35;

      icos.forEach((ico, idx) => {
        ico.rotation.x = elapsedTime * (0.2 + idx * 0.05);
        ico.rotation.y = elapsedTime * (0.15 + idx * 0.03);
        ico.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.08;
      });

      // Wave effect on cyber grid
      const posAttr = gridGeometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getY(i);
        const z = Math.sin(u * 0.02 + elapsedTime * 1.2) * Math.cos(v * 0.02 + elapsedTime * 1.2) * 8;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 20%, #0c1a40 0%, #050b1a 60%, #02050e 100%)',
      }}
    />
  );
};
