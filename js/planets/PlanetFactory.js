/**
 * ========================================
 * PLANET FACTORY
 * ========================================
 * 
 * Creates highly detailed planets with advanced materials, shaders,
 * atmospheres, and unique characteristics for each celestial body.
 * 
 * @module PlanetFactory
 */

/**
 * PlanetFactory Class
 * Manufactures detailed planet meshes with all effects
 */
export class PlanetFactory {
    constructor(scene, lightingSystem) {
        this.scene = scene;
        this.lightingSystem = lightingSystem;
        
        // Current planet
        this.currentPlanet = null;
        this.currentPlanetName = null;
        
        // Planet specifications
        this.planetSpecs = {
            earth: {
                radius: 10,
                segments: 128,
                rotationSpeed: 0.001,
                tilt: 23.5 * (Math.PI / 180),
                atmosphereColor: 0x64c8ff,
                atmosphereOpacity: 0.15
            },
            mars: {
                radius: 8,
                segments: 128,
                rotationSpeed: 0.0008,
                tilt: 25.2 * (Math.PI / 180),
                atmosphereColor: 0xff6644,
                atmosphereOpacity: 0.08
            },
            jupiter: {
                radius: 20,
                segments: 128,
                rotationSpeed: 0.002,
                tilt: 3.1 * (Math.PI / 180),
                atmosphereColor: 0xffb366,
                atmosphereOpacity: 0.12
            },
            blackhole: {
                radius: 12,
                segments: 128,
                rotationSpeed: 0.005,
                tilt: 0,
                atmosphereColor: 0x9955ff,
                atmosphereOpacity: 0.2
            }
        };
    }
    
    /**
     * Create a planet
     * @param {string} planetName
     */
    async createPlanet(planetName) {
        console.log(`Creating ${planetName}...`);
        
        const spec = this.planetSpecs[planetName];
        
        if (!spec) {
            console.error(`No specification for ${planetName}`);
            return;
        }
        
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
            case 'blackhole':
                planetGroup = this.createBlackHole(spec);
                break;
            default:
                console.error(`Unknown planet: ${planetName}`);
                return;
        }
        
        // Apply axial tilt
        planetGroup.rotation.z = spec.tilt;
        
        // Store planet data
        planetGroup.userData = {
            name: planetName,
            spec: spec,
            rotationSpeed: spec.rotationSpeed
        };
        
        this.scene.add(planetGroup);
        this.currentPlanet = planetGroup;
        this.currentPlanetName = planetName;
        
        console.log(`✓ ${planetName} created`);
        
        return planetGroup;
    }
    
    /**
     * Create Earth with detailed surface and atmosphere
     * @param {Object} spec
     */
    createEarth(spec) {
        const earthGroup = new THREE.Group();
        
        // Main planet sphere
        const geometry = new THREE.SphereGeometry(spec.radius, spec.segments, spec.segments);
        
        // Create detailed material
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.8,
            metalness: 0.2
        });
        
        material.map = this.generateEarthTexture();
        material.normalMap = this.generateEarthNormalMap();
        
        const earthMesh = new THREE.Mesh(geometry, material);
        earthMesh.castShadow = true;
        earthMesh.receiveShadow = true;
        earthMesh.name = 'earth_surface';
        earthGroup.add(earthMesh);
        
        // Cloud layer
        const cloudGeometry = new THREE.SphereGeometry(spec.radius + 0.1, 64, 64);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            map: this.generateCloudTexture(),
            transparent: true,
            opacity: 0.4,
            depthWrite: false
        });
        
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudMesh.name = 'earth_clouds';
        cloudMesh.userData = { rotationSpeed: spec.rotationSpeed * 1.2 };
        earthGroup.add(cloudMesh);
        
        // Atmosphere glow
        const atmosphere = this.createAtmosphere(spec.radius, spec.atmosphereColor, spec.atmosphereOpacity);
        earthGroup.add(atmosphere);
        
        return earthGroup;
    }
    
    /**
     * Create Mars with terrain
     * @param {Object} spec
     */
    createMars(spec) {
        const marsGroup = new THREE.Group();
        
        const geometry = new THREE.SphereGeometry(spec.radius, spec.segments, spec.segments);
        const material = new THREE.MeshStandardMaterial({
            color: 0xcc4422,
            roughness: 0.95,
            metalness: 0.1,
            map: this.generateMarsTexture()
        });
        
        const marsMesh = new THREE.Mesh(geometry, material);
        marsMesh.castShadow = true;
        marsMesh.receiveShadow = true;
        marsMesh.name = 'mars_surface';
        marsGroup.add(marsMesh);
        
        const atmosphere = this.createAtmosphere(spec.radius, spec.atmosphereColor, spec.atmosphereOpacity);
        marsGroup.add(atmosphere);
        
        return marsGroup;
    }
    
    /**
     * Create Jupiter with gas bands
     * @param {Object} spec
     */
    createJupiter(spec) {
        const jupiterGroup = new THREE.Group();
        
        const geometry = new THREE.SphereGeometry(spec.radius, spec.segments, spec.segments);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffcc88,
            roughness: 0.6,
            metalness: 0.1,
            map: this.generateJupiterTexture()
        });
        
        const jupiterMesh = new THREE.Mesh(geometry, material);
        jupiterMesh.castShadow = true;
        jupiterMesh.receiveShadow = true;
        jupiterMesh.name = 'jupiter_surface';
        jupiterGroup.add(jupiterMesh);
        
        const atmosphere = this.createAtmosphere(spec.radius, spec.atmosphereColor, spec.atmosphereOpacity);
        jupiterGroup.add(atmosphere);
        
        return jupiterGroup;
    }
    
    /**
     * Create Black Hole with accretion disk
     * @param {Object} spec
     */
    createBlackHole(spec) {
        const blackHoleGroup = new THREE.Group();
        
        // Event horizon
        const horizonGeometry = new THREE.SphereGeometry(spec.radius * 0.5, spec.segments, spec.segments);
        const horizonMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const horizonMesh = new THREE.Mesh(horizonGeometry, horizonMaterial);
        horizonMesh.name = 'event_horizon';
        blackHoleGroup.add(horizonMesh);
        
        // Accretion disk
        const diskGeometry = new THREE.RingGeometry(spec.radius * 1.5, spec.radius * 3.5, 128);
        const diskMaterial = new THREE.MeshBasicMaterial({
            color: 0x9955ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const disk = new THREE.Mesh(diskGeometry, diskMaterial);
        disk.rotation.x = Math.PI / 2;
        disk.name = 'accretion_disk';
        disk.userData = { rotationSpeed: 0.003 };
        blackHoleGroup.add(disk);
        
        const atmosphere = this.createAtmosphere(spec.radius * 1.5, spec.atmosphereColor, spec.atmosphereOpacity * 2);
        blackHoleGroup.add(atmosphere);
        
        return blackHoleGroup;
    }
    
    /**
     * Create atmosphere shader
     */
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
                uniform float opacity;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(glowColor, intensity * opacity);
                }
            `,
            uniforms: {
                glowColor: { value: new THREE.Color(color) },
                opacity: { value: opacity }
            },
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
        
        return new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    }
    
    // Texture generation
    generateEarthTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#1e4d8b';
        ctx.fillRect(0, 0, 1024, 512);
        
        ctx.fillStyle = '#3a7d44';
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 150 + 50, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    generateEarthNormalMap() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#8080ff';
        ctx.fillRect(0, 0, 512, 256);
        return new THREE.CanvasTexture(canvas);
    }
    
    generateCloudTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, 1024, 512);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 100 + 30, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    generateMarsTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#cd5c33';
        ctx.fillRect(0, 0, 1024, 512);
        
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(100, 40, 20, ${Math.random() * 0.5})`;
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 100 + 20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    generateJupiterTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        const bandCount = 15;
        const bandHeight = 512 / bandCount;
        
        for (let i = 0; i < bandCount; i++) {
            const lightness = 50 + Math.random() * 20;
            ctx.fillStyle = `hsl(30, 70%, ${lightness}%)`;
            ctx.fillRect(0, i * bandHeight, 1024, bandHeight);
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    /**
     * Update current planet
     */
    updateCurrentPlanet() {
        if (!this.currentPlanet) return;
        
        const spec = this.currentPlanet.userData.spec;
        this.currentPlanet.rotation.y += spec.rotationSpeed;
        
        this.currentPlanet.traverse((child) => {
            if (child.userData && child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
            }
        });
    }
    
    /**
     * Fade out current planet
     */
    async fadeOutCurrent() {
        if (!this.currentPlanet) return;
        
        return new Promise((resolve) => {
            gsap.to(this.currentPlanet.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                onComplete: () => {
                    this.scene.remove(this.currentPlanet);
                    this.currentPlanet = null;
                    resolve();
                }
            });
        });
    }
    
    /**
     * Fade in current planet
     */
    async fadeInCurrent() {
        if (!this.currentPlanet) return;
        
        this.currentPlanet.scale.set(0, 0, 0);
        
        return new Promise((resolve) => {
            gsap.to(this.currentPlanet.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 1.5,
                ease: 'back.out(1.7)',
                onComplete: resolve
            });
        });
    }
    
    /**
     * Dispose resources
     */
    dispose() {
        console.log('Disposing Planet Factory...');
        if (this.currentPlanet) {
            this.scene.remove(this.currentPlanet);
        }
        console.log('✓ Planet Factory disposed');
    }
}