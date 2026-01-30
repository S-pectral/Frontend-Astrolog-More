import { TextureFactory } from './TextureFactory.js';
import { planetSpecs } from '../config/planets.js';

export const PlanetFactory = {
    createAtmosphere(radius, color, opacity) {
        const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.15, 32, 32);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float intensity;
                varying vec3 vNormal;
                void main() {
                    float strength = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(glowColor, strength * intensity);
                }
            `,
            uniforms: {
                glowColor: { value: new THREE.Color(color) },
                intensity: { value: opacity }
            },
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        return new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    },

    createEarth(spec) {
        const earthGroup = new THREE.Group();

        // Main sphere with texture
        const geometry = new THREE.SphereGeometry(spec.radius, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            map: TextureFactory.generateEarthTexture(),
            roughness: 0.8,
            metalness: 0.1,
            bumpScale: 0.05
        });

        const earthMesh = new THREE.Mesh(geometry, material);
        earthMesh.castShadow = true;
        earthMesh.receiveShadow = true;
        earthMesh.name = 'earth_surface';
        earthGroup.add(earthMesh);

        // Cloud layer
        const cloudGeometry = new THREE.SphereGeometry(spec.radius + 0.15, 64, 64);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            map: TextureFactory.generateEarthClouds(),
            transparent: true,
            opacity: 0.6,
            depthWrite: false
        });
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudMesh.name = 'earth_clouds';
        cloudMesh.userData = { rotationSpeed: spec.rotationSpeed * 1.3 };
        earthGroup.add(cloudMesh);

        // Atmosphere glow
        const atmosphere = this.createAtmosphere(spec.radius, spec.atmosphereColor, 0.2);
        earthGroup.add(atmosphere);

        return earthGroup;
    },

    createMars(spec) {
        const marsGroup = new THREE.Group();

        const geometry = new THREE.SphereGeometry(spec.radius, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            map: TextureFactory.generateMarsTexture(),
            roughness: 0.9,
            metalness: 0.05,
            bumpScale: 0.1
        });

        const marsMesh = new THREE.Mesh(geometry, material);
        marsMesh.castShadow = true;
        marsMesh.receiveShadow = true;
        marsMesh.name = 'mars_surface';
        marsGroup.add(marsMesh);

        // Thin atmosphere
        const atmosphere = this.createAtmosphere(spec.radius, spec.atmosphereColor, 0.08);
        marsGroup.add(atmosphere);

        return marsGroup;
    },

    createJupiter(spec) {
        const jupiterGroup = new THREE.Group();

        const geometry = new THREE.SphereGeometry(spec.radius, 64, 64);
        const texture = TextureFactory.generateJupiterTexture();
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping; // Usually not needed for sphere poles but good practice

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            metalness: 0.1
        });

        const jupiterMesh = new THREE.Mesh(geometry, material);
        jupiterMesh.castShadow = true;
        jupiterMesh.receiveShadow = true;
        jupiterMesh.name = 'jupiter_surface';
        jupiterGroup.add(jupiterMesh);

        // Thick atmosphere
        const atmosphere = this.createAtmosphere(spec.radius, spec.atmosphereColor, 0.15);
        jupiterGroup.add(atmosphere);

        return jupiterGroup;
    },

    createBlackHole(spec) {
        const blackHoleGroup = new THREE.Group();

        // Event horizon - pure black sphere
        const horizonGeometry = new THREE.SphereGeometry(spec.radius * 0.4, 32, 32);
        const horizonMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
        horizon.name = 'event_horizon';
        blackHoleGroup.add(horizon);

        // Photon sphere - distortion effect
        const photonGeometry = new THREE.SphereGeometry(spec.radius * 0.6, 32, 32);
        const photonMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        const photonSphere = new THREE.Mesh(photonGeometry, photonMaterial);
        blackHoleGroup.add(photonSphere);

        // Accretion disk
        const diskGeometry = new THREE.RingGeometry(spec.radius * 0.8, spec.radius * 2.5, 128, 8);
        const diskMaterial = new THREE.MeshBasicMaterial({
            map: TextureFactory.generateAccretionDiskTexture(),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const disk = new THREE.Mesh(diskGeometry, diskMaterial);
        disk.rotation.x = Math.PI / 2.2;
        disk.name = 'accretion_disk';
        disk.userData = { rotationSpeed: 0.008 };
        blackHoleGroup.add(disk);

        // Secondary tilted disk for depth
        const disk2 = disk.clone();
        disk2.rotation.x = Math.PI / 2.5;
        disk2.rotation.z = Math.PI / 6;
        disk2.material = diskMaterial.clone();
        disk2.material.opacity = 0.5;
        disk2.userData = { rotationSpeed: -0.005 };
        blackHoleGroup.add(disk2);

        // Gravitational lensing glow
        const lensGeometry = new THREE.SphereGeometry(spec.radius * 1.2, 32, 32);
        const lensMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                    vec3 color = mix(vec3(0.6, 0.3, 1.0), vec3(1.0, 0.5, 0.2), intensity);
                    gl_FragColor = vec4(color, intensity * 0.8);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        blackHoleGroup.add(lens);

        // Point light from accretion disk
        const light = new THREE.PointLight(0x9955ff, 2, 50);
        blackHoleGroup.add(light);

        return blackHoleGroup;
    },

    createSaturn(spec) {
        const saturnGroup = new THREE.Group();

        // 1. Planet Sphere
        const geometry = new THREE.SphereGeometry(spec.radius, 64, 64);
        const texture = TextureFactory.generateSaturnTexture();
        texture.wrapS = THREE.RepeatWrapping;

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.7,
            metalness: 0.1
        });

        const saturnMesh = new THREE.Mesh(geometry, material);
        saturnMesh.castShadow = true;
        saturnMesh.receiveShadow = true;
        saturnGroup.add(saturnMesh);

        // 2. Rings
        const ringGeometry = new THREE.RingGeometry(spec.radius * 1.4, spec.radius * 2.5, 128);
        const ringTexture = TextureFactory.generateRingTexture();

        const ringMaterial = new THREE.MeshStandardMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            roughness: 0.8,
            metalness: 0.2,
            emissive: 0x998877,
            emissiveMap: ringTexture,
            emissiveIntensity: 0.3
        });

        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        rings.receiveShadow = true;
        rings.castShadow = true;
        saturnGroup.add(rings);

        // 3. Atmosphere
        const atmosphere = this.createAtmosphere(spec.radius, spec.atmosphereColor, 0.2);
        saturnGroup.add(atmosphere);

        return saturnGroup;
    },

    createMoon(spec) {
        const moonGroup = new THREE.Group();
        const geometry = new THREE.SphereGeometry(spec.radius, 48, 48);
        const material = new THREE.MeshStandardMaterial({
            map: TextureFactory.generateMoonTexture(),
            roughness: 0.9,
            metalness: 0.05,
            bumpScale: 0.1
        });

        const moonMesh = new THREE.Mesh(geometry, material);
        moonMesh.castShadow = true;
        moonMesh.receiveShadow = true;
        moonGroup.add(moonMesh);

        return moonGroup;
    },

    createSun(spec) {
        const sunGroup = new THREE.Group();

        // 1. Core Sphere with Animated Shader
        const geometry = new THREE.SphereGeometry(spec.radius, 64, 64);
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0xffaa00) }, // Orange
                color2: { value: new THREE.Color(0xffcc33) }, // Bright Yellow
                color3: { value: new THREE.Color(0xff4400) }  // Dark Red/Orange spots
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                // Simple Pseudo-Noise
                float noise(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
                }
                
                // Value Noise 3D
                float vnoise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(
                        mix(mix(noise(i), noise(i + vec3(1,0,0)), f.x),
                            mix(noise(i + vec3(0,1,0)), noise(i + vec3(1,1,0)), f.x), f.y),
                        mix(mix(noise(i + vec3(0,0,1)), noise(i + vec3(1,0,1)), f.x),
                            mix(noise(i + vec3(0,1,1)), noise(i + vec3(1,1,1)), f.x), f.y), f.z);
                }
                
                // Fractal Brownian Motion
                float fbm(vec3 p) {
                    float v = 0.0;
                    float a = 0.5;
                    for (int i = 0; i < 5; i++) {
                        v += a * vnoise(p);
                        p *= 2.0;
                        a *= 0.5;
                    }
                    return v;
                }

                void main() {
                    // 1. Base Noise for surface detail (Granules)
                    float n = fbm(vPosition * 0.3 + vec3(0.0, time * 0.15, 0.0));
                    
                    // 2. Secondary fine noise
                    float n2 = fbm(vPosition * 0.8 - vec3(0.0, time * 0.05, 0.0));

                    // 3. Mix colors: Dark Spots (color3) -> Base (color1) -> Hot (color2)
                    vec3 color = mix(color3, color1, n);
                    color = mix(color, color2, n2 * 0.8);
                    
                    // 4. Limb Darkening (Edge of the sun is darker)
                    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Simplified view direction
                    float limb = dot(vNormal, viewDir); 
                    limb = smoothstep(0.0, 0.8, limb); // Make edges darker
                    // Note: We need real viewDir for perfect limb darkening, but vNormal.z roughly works in view space?
                    // Actually, vNormal is varying from vertex shader where it was transformed by normalMatrix (View Space).
                    // So view direction is roughly (0,0,1).
                    // dot(vNormal, vec3(0,0,1)) is literally vNormal.z
                    
                    float darkening = 0.4 + 0.6 * saturate(vNormal.z);
                    color *= darkening;

                    // 5. Brightness pulse
                    float pulse = 0.95 + 0.05 * sin(time * 2.0);
                    
                    gl_FragColor = vec4(color * pulse, 1.0);
                }
                
                float saturate(float x) {
                    return clamp(x, 0.0, 1.0);
                }
            `
        });

        const sunMesh = new THREE.Mesh(geometry, shaderMaterial);
        sunGroup.add(sunMesh);

        // 2. Glow/Corona -- Enhanced
        const glowGeometry = new THREE.SphereGeometry(spec.radius * 1.4, 32, 32); // Slightly larger
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(0xffaa00) },
                viewVector: { value: new THREE.Vector3() }
            },
            vertexShader: `
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    // Standard Fresnel
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    // Bias the glow to be softer
                    intensity = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    gl_FragColor = vec4(glowColor, intensity * 2.0); // Softer intensity
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        sunGroup.add(glowMesh);

        // 3. Point Light
        const light = new THREE.PointLight(0xffaa00, 3, 500);
        sunGroup.add(light);

        // Attach update function
        sunGroup.userData.update = (time) => {
            shaderMaterial.uniforms.time.value = time;
        };

        return sunGroup;
    },

    createPlanet(planetName) {
        const spec = planetSpecs[planetName];
        let planetGroup;

        switch (planetName) {
            case 'earth':
                planetGroup = this.createEarth(spec);
                break;
            case 'mars':
                planetGroup = this.createMars(spec);
                break;
            case 'jupiter':
                planetGroup = this.createJupiter(spec);
                break;
            case 'saturn':
                planetGroup = this.createSaturn(spec);
                break;
            case 'sun':
                planetGroup = this.createSun(spec);
                break;
            case 'moon':
                planetGroup = this.createMoon(spec);
                break;
            case 'blackhole':
                planetGroup = this.createBlackHole(spec);
                break;
            default:
                return null;
        }

        planetGroup.rotation.z = spec.tilt;
        planetGroup.userData = { spec: spec, name: planetName };

        return planetGroup;
    }
};
