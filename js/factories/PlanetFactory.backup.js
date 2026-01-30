import { TextureFactory } from './TextureFactory.js';
import { planetSpecs } from '../config/planets.js';

export const PlanetFactory = {
    createAtmosphere(radius, color, opacity) {
        const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.15, 64, 64);
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
        const geometry = new THREE.SphereGeometry(spec.radius, 128, 128);
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

        const geometry = new THREE.SphereGeometry(spec.radius, 128, 128);
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

        const geometry = new THREE.SphereGeometry(spec.radius, 128, 128);
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
        const horizonGeometry = new THREE.SphereGeometry(spec.radius * 0.4, 64, 64);
        const horizonMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
        horizon.name = 'event_horizon';
        blackHoleGroup.add(horizon);

        // Photon sphere - distortion effect
        const photonGeometry = new THREE.SphereGeometry(spec.radius * 0.6, 64, 64);
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
        const lensGeometry = new THREE.SphereGeometry(spec.radius * 1.2, 64, 64);
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
            case 'blackhole':
                planetGroup = this.createBlackHole(spec);
                break;
            default:
                return null;
        }

        planetGroup.rotation.z = spec.tilt;
        planetGroup.userData = { spec: spec, name: planetName };

        return planetGroup;
    },

    createSaturn(spec) {
        const saturnGroup = new THREE.Group();

        // 1. Planet Sphere
        const geometry = new THREE.SphereGeometry(spec.radius, 128, 128);
        const texture = TextureFactory.generateSaturnTexture();
        texture.wrapS = THREE.RepeatWrapping; // Seamless wrap

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
        // InnerRadius, OuterRadius, ThetaSegments
        const ringGeometry = new THREE.RingGeometry(spec.radius * 1.4, spec.radius * 2.5, 128);

        // Correct UV mapping for rings (Radial)
        const pos = ringGeometry.attributes.position;
        const uv = ringGeometry.attributes.uv;

        // RingGeometry UVs are by default suited for circular texturing, 
        // but we want our 1D gradient to map from inner radius to outer radius.
        // ThreeJS RingGeometry default UVs maps the ring to a [0,0] -> [1,1] square.
        // We need to verify if we need custom UVs or if we can just rotate the texture.
        // Actually, simplest trick: Rotate mesh x -90 deg.

        const ringTexture = TextureFactory.generateRingTexture();
        ringTexture.rotation = Math.PI / 2; // Rotate texture 90 deg so horizontal gradient follows radius? 
        // No, RingGeometry creates UVs such that (0.5, 0.5) is center.
        // Ideally we use a specialized shader or simpler: 
        // We use the gradient radially.
        // Let's rely on standard rotation first.

        const ringMaterial = new THREE.MeshStandardMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            roughness: 0.8,
            metalness: 0.2,
            emissive: 0x998877, // Soft warm glow
            emissiveMap: ringTexture,
            emissiveIntensity: 0.3 // Make them visible even in shadow
        });

        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2; // Flat horizontal
        rings.receiveShadow = true;
        rings.castShadow = true;
        saturnGroup.add(rings);

        // 3. Atmosphere
        const atmosphere = this.createAtmosphere(spec.radius, spec.atmosphereColor, 0.2);
        saturnGroup.add(atmosphere);

        return saturnGroup;
    }
};
