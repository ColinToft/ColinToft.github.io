"use client";

import { useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, Preload } from "@react-three/drei";
import * as THREE from "three";
// @ts-expect-error - no types
import * as random from "maath/random/dist/maath-random.esm";
import {
    useBackgroundStore,
    type BackgroundState,
} from "@/store/backgroundStore";

const vertexShader = `
  uniform float uSize;
  attribute float scale;

  varying vec3 vPosition; // Pass position to fragment shader

  void main() {
    vPosition = position; // Pass position along
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize;
    // Size attenuation; make points smaller further away
    gl_PointSize *= (1.0 / -viewPosition.z);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uTime; // Add time uniform
  uniform float uGlobalAlpha; // Add global alpha uniform for fading

  varying vec3 vPosition; // Receive position from vertex shader

  // Simple pseudo-random function
  float random(vec3 st) {
    return fract(sin(dot(st.xyz, vec3(12.9898, 78.233, 45.543))) * 43758.5453123);
  }

  void main() {
    // Calculate distance from center of the point (0.5, 0.5)
    float dist = distance(gl_PointCoord, vec2(0.5));

    // Prevent rendering pixels outside the circle
    if (dist > 0.5) discard;

    // Base brightness falloff
    float strength = 1.0 - dist * 2.0; // Linear falloff
    if (dist < 0.1) {
        strength = 1.0;
    } else {
        strength = pow(strength, 3.0); // Sharper falloff
    }

    /*
    // Twinkle effect: vary strength based on time and position
    float twinkle = random(vPosition + uTime * 0.1); // Use position and time for variation
    twinkle = smoothstep(0.3, 0.7, twinkle); // Make the twinkle effect smoother

    // Modulate base strength with twinkle effect
    strength *= (0.7 + twinkle * 0.3); // Vary between 50% and 100% brightness
    */

    // Add vertical fade based on y-coordinate
    float yFade = smoothstep(-1.0, 1.0, vPosition.y); // Map y to 0..1
    yFade = mix(0.0, 0.9, yFade); 
    strength *= yFade; // Apply y-fade

    // Apply global alpha fade (from scroll)
    strength *= uGlobalAlpha;

    // Set color and alpha based on strength
    gl_FragColor = vec4(uColor, strength);
  }
`;

function fromSphericalShell(
    buffer: Float32Array,
    {
        minRadius,
        maxRadius,
        center = [0, 0, 0],
    }: {
        minRadius: number;
        maxRadius: number;
        center: [number, number, number];
    }
) {
    random.onSphere(buffer, { radius: 1, center: [0, 0, 0] });

    // Scale each point to have a random radius between minRadius and maxRadius
    for (let i = 0; i < buffer.length; i += 3) {
        // Generate a random radius in the desired range
        // Scale using the cube root to ensure uniform volume distribution
        const randomFactor = Math.cbrt(
            Math.random() * (Math.pow(maxRadius, 3) - Math.pow(minRadius, 3)) +
                Math.pow(minRadius, 3)
        );

        buffer[i] = buffer[i] * randomFactor + center[0];
        buffer[i + 1] = buffer[i + 1] * randomFactor + center[1];
        buffer[i + 2] = buffer[i + 2] * randomFactor + center[2];
    }

    return buffer;
}

function Stars() {
    const ref = useRef<THREE.Points>(null);
    const [sphere] = useState(() =>
        fromSphericalShell(new Float32Array(3000 * 3), {
            minRadius: 1.0,
            maxRadius: 2.5,
            center: [0, 0, 0],
        })
    );

    const starVisibility = useBackgroundStore(
        (state: BackgroundState) => state.starVisibility
    );

    const uniforms = useMemo(
        () => ({
            uSize: { value: 15 },
            uColor: { value: new THREE.Color("#ffffff") },
            uTime: { value: 0.0 },
            uGlobalAlpha: { value: 1.0 },
        }),
        []
    );

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y -= delta / 1000;
            const material = ref.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
            material.uniforms.uGlobalAlpha.value = THREE.MathUtils.lerp(
                material.uniforms.uGlobalAlpha.value,
                starVisibility,
                0.05
            );
        }
    });

    return (
        <group rotation={[0.3, 0, 0]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled>
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    transparent={true}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

// Background gradient colors
const nightColors = {
    top: new THREE.Color("#101a29"),
    middle: new THREE.Color("#1a2b58"),
    bottom: new THREE.Color("#243c87"),
};

const dawnColors = {
    top: new THREE.Color("#101a29"),
    middle: new THREE.Color("#1a2b58"),
    bottom: new THREE.Color("#243c87"),
};

const BackgroundCanvas = () => {
    // Get brightness from the store
    const brightness = useBackgroundStore(
        (state: BackgroundState) => state.brightness
    );

    const currentTop = useMemo(
        () => nightColors.top.clone().lerp(dawnColors.top, brightness),
        [brightness]
    );
    const currentMiddle = useMemo(
        () => nightColors.middle.clone().lerp(dawnColors.middle, brightness),
        [brightness]
    );
    const currentBottom = useMemo(
        () => nightColors.bottom.clone().lerp(dawnColors.bottom, brightness),
        [brightness]
    );

    const gradient = useMemo(
        () =>
            `linear-gradient(to bottom, ${currentTop.getStyle()} 0%, ${currentMiddle.getStyle()} 50%, ${currentBottom.getStyle()} 100%)`,
        [currentTop, currentMiddle, currentBottom]
    );

    return (
        <div className='w-full h-full fixed inset-0 -z-10'>
            {/* Gradient overlay */}
            <div
                className='absolute inset-0 transition-colors duration-500 ease-in-out'
                style={{
                    background: gradient,
                }}
            />

            {/* Stars Canvas */}
            <Canvas
                camera={{
                    position: [0, 0, 0.01],
                    fov: 60,
                    near: 0.1,
                    far: 10000,
                }}
            >
                <Suspense fallback={null}>
                    <Stars />
                </Suspense>
                <Preload all />
            </Canvas>

            {/* Scatter Overlay */}
            <div
                className='absolute inset-0'
                style={{
                    background: "url('/images/scatter.png')",
                    opacity: 0.2,
                    mixBlendMode: "screen",
                }}
            />

            {/* Bottom Glow (static or adjusted) */}
            <div
                className='absolute bottom-[-50vh] left-[-50vw] right-[-50vw] h-[100vh]' // Removed transition class
                style={{
                    background:
                        "radial-gradient(ellipse 80% 20% at 65% 50%, rgba(155, 133, 129, 1.0) 0%, rgba(155, 133, 129, 0.3) 50%, rgba(155, 133, 129, 0) 100%)",
                    filter: "blur(10px)",
                }}
            />
        </div>
    );
};

export default BackgroundCanvas;
