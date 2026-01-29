/**
 * Cosmic Explorer - Main Application
 * Complete production-ready astronomy experience
 * @version 2.0.0
 */

// Global state
let cosmicApp = {
    scene: null,
    camera: null,
    renderer: null,
    currentPlanet: null,
    currentPlanetName: 'earth',
    animationId: null,
    mouse: { x: 0, y: 0 },
    targetZoom: 30,
    currentZoom: 30,
    minZoom: 15,
    maxZoom: 80,
    meteors: [],
    textureLoader: null,
    clock: null,
    
    planetSpecs: {
        earth: {
            radius: 10,
            color: 0x2194ce,
            atmosphereColor: 0x64c8ff,
            rotationSpeed: 0.001,
            tilt: 23.5 * (Math.PI / 180),
            info: {
                title: 'Earth',
                description: 'The Blue Planet - Our home in the vast cosmos',
                distance: '149.6M km',
                diameter: '12,742 km',
                period: '365.25 days'
            }
        },
        mars: {
            radius: 8,
            color: 0xcc4422,
            atmosphereColor: 0xff6644,
            rotationSpeed: 0.0008,
            tilt: 25.2 * (Math.PI / 180),
            info: {
                title: 'Mars',
                description: 'The Red Planet - Named after the Roman god of war',
                distance: '227.9M km',
                diameter: '6,779 km',
                period: '687 days'
            }
        },
        jupiter: {
            radius: 20,
            color: 0xffcc88,
            atmosphereColor: 0xffb366,
            rotationSpeed: 0.002,
            tilt: 3.1 * (Math.PI / 180),
            info: {
                title: 'Jupiter',
                description: 'The Gas Giant - Largest planet in our solar system',
                distance: '778.5M km',
                diameter: '139,820 km',
                period: '11.86 years'
            }
        },
        blackhole: {
            radius: 12,
            color: 0x000000,
            atmosphereColor: 0x9955ff,
            rotationSpeed: 0.005,
            tilt: 0,
            info: {
                title: 'Black Hole',
                description: 'A region of spacetime where gravity is so strong nothing can escape',
                distance: 'Unknown',
                diameter: 'Event Horizon',
                period: 'Timeless'
            }
        }
    }
};

// ============================================
// TEXTURE GENERATION - REALISTIC PLANET TEXTURES
// ============================================

function generateEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Deep ocean base
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGradient.addColorStop(0, '#1a3a5c');
    oceanGradient.addColorStop(0.3, '#1e5080');
    oceanGradient.addColorStop(0.5, '#2060a0');
    oceanGradient.addColorStop(0.7, '#1e5080');
    oceanGradient.addColorStop(1, '#1a3a5c');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Continents - more realistic shapes
    const continents = [
        // North America
        { x: 300, y: 250, w: 350, h: 280, color: '#3a7d44' },
        // South America
        { x: 450, y: 500, w: 180, h: 350, color: '#4a8d54' },
        // Europe
        { x: 950, y: 200, w: 200, h: 150, color: '#4a8d54' },
        // Africa
        { x: 1000, y: 350, w: 250, h: 350, color: '#c4a35a' },
        // Asia
        { x: 1150, y: 180, w: 500, h: 350, color: '#5a9d64' },
        // Australia
        { x: 1550, y: 550, w: 200, h: 180, color: '#d4935a' },
        // Antarctica
        { x: 0, y: 900, w: 2048, h: 124, color: '#e8e8f0' }
    ];
    
    continents.forEach(c => {
        ctx.fillStyle = c.color;
        ctx.beginPath();
        // Organic continent shapes
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const radiusX = c.w / 2 + Math.random() * 50 - 25;
            const radiusY = c.h / 2 + Math.random() * 40 - 20;
            const px = c.x + c.w/2 + Math.cos(angle) * radiusX;
            const py = c.y + c.h/2 + Math.sin(angle) * radiusY;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        
        // Add terrain variation
        ctx.fillStyle = 'rgba(80, 60, 40, 0.3)';
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(c.x + Math.random() * c.w, c.y + Math.random() * c.h, Math.random() * 30 + 10, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Mountain ranges
    ctx.fillStyle = '#8B7355';
    [[1200, 280, 400], [350, 320, 200], [1100, 400, 150]].forEach(([x, y, len]) => {
        for (let i = 0; i < len; i += 10) {
            ctx.beginPath();
            ctx.arc(x + i + Math.random() * 20, y + Math.random() * 40, Math.random() * 15 + 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Ice caps
    ctx.fillStyle = '#f0f5ff';
    ctx.beginPath();
    ctx.ellipse(1024, 50, 800, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}

function generateEarthClouds() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 2048, 1024);
    
    // Cloud patterns
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const size = Math.random() * 150 + 30;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
}

function generateMarsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Mars base color gradient
    const baseGradient = ctx.createLinearGradient(0, 0, 0, 1024);
    baseGradient.addColorStop(0, '#c1440e');
    baseGradient.addColorStop(0.3, '#d4652a');
    baseGradient.addColorStop(0.5, '#e07040');
    baseGradient.addColorStop(0.7, '#d4652a');
    baseGradient.addColorStop(1, '#a03808');
    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Terrain variations - darker regions
    ctx.fillStyle = 'rgba(80, 30, 10, 0.4)';
    for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        ctx.ellipse(x, y, Math.random() * 200 + 50, Math.random() * 150 + 30, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Olympus Mons (large volcano)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(400, 350, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(400, 350, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Valles Marineris (canyon)
    ctx.strokeStyle = '#5a2a0a';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(800, 480);
    ctx.bezierCurveTo(1000, 500, 1200, 460, 1500, 480);
    ctx.stroke();
    
    // Craters
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const r = Math.random() * 30 + 5;
        
        ctx.fillStyle = 'rgba(60, 20, 5, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(200, 120, 80, 0.3)';
        ctx.beginPath();
        ctx.arc(x + r * 0.2, y - r * 0.2, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Polar ice caps
    ctx.fillStyle = 'rgba(255, 250, 245, 0.8)';
    ctx.beginPath();
    ctx.ellipse(1024, 30, 600, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1024, 994, 500, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}

function generateJupiterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Jupiter band colors
    const bands = [
        '#d4b896', '#c9a882', '#e8d4b8', '#c4956a', '#dcc4a8',
        '#b8865a', '#e0c8a0', '#c9a070', '#d8c098', '#b07848',
        '#dcc4a0', '#c49860', '#e0d0b0', '#b88050', '#d4b890'
    ];
    
    const bandHeight = 1024 / bands.length;
    
    bands.forEach((color, i) => {
        // Create wavy band
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, i * bandHeight);
        
        // Wavy top edge
        for (let x = 0; x <= 2048; x += 20) {
            const waveY = i * bandHeight + Math.sin(x * 0.02 + i) * 8;
            ctx.lineTo(x, waveY);
        }
        
        // Wavy bottom edge
        for (let x = 2048; x >= 0; x -= 20) {
            const waveY = (i + 1) * bandHeight + Math.sin(x * 0.02 + i + 1) * 8;
            ctx.lineTo(x, waveY);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Add turbulence
        ctx.fillStyle = 'rgba(180, 140, 100, 0.2)';
        for (let j = 0; j < 10; j++) {
            ctx.beginPath();
            ctx.ellipse(
                Math.random() * 2048,
                i * bandHeight + Math.random() * bandHeight,
                Math.random() * 100 + 20,
                Math.random() * 20 + 5,
                Math.random() * Math.PI,
                0, Math.PI * 2
            );
            ctx.fill();
        }
    });
    
    // Great Red Spot
    const grsX = 600;
    const grsY = 580;
    
    // Outer red
    ctx.fillStyle = '#c45030';
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, 140, 80, -0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner swirl
    ctx.fillStyle = '#d86040';
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, 100, 55, -0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#e87050';
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, 50, 30, -0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Swirl lines
    ctx.strokeStyle = 'rgba(200, 100, 60, 0.5)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(grsX, grsY, 60 + i * 20, 0, Math.PI * 1.5);
        ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
}

function generateBlackHoleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Pure black center
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1024, 1024);
    
    return new THREE.CanvasTexture(canvas);
}

function generateAccretionDiskTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    const centerX = 512;
    const centerY = 512;
    
    // Radial gradient for disk
    for (let r = 500; r > 100; r -= 2) {
        const hue = 280 - (r - 100) * 0.2;
        const lightness = 30 + (500 - r) * 0.1;
        const alpha = 0.3 + (500 - r) * 0.001;
        
        ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Hot inner region
    const innerGradient = ctx.createRadialGradient(centerX, centerY, 100, centerX, centerY, 200);
    innerGradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
    innerGradient.addColorStop(0.5, 'rgba(255, 100, 50, 0.5)');
    innerGradient.addColorStop(1, 'rgba(150, 50, 200, 0)');
    
    ctx.fillStyle = innerGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}

// ============================================
// PLANET CREATION
// ============================================

function createEarth(spec) {
    const earthGroup = new THREE.Group();
    
    // Main sphere with texture
    const geometry = new THREE.SphereGeometry(spec.radius, 128, 128);
    const material = new THREE.MeshStandardMaterial({
        map: generateEarthTexture(),
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
        map: generateEarthClouds(),
        transparent: true,
        opacity: 0.6,
        depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.name = 'earth_clouds';
    cloudMesh.userData = { rotationSpeed: spec.rotationSpeed * 1.3 };
    earthGroup.add(cloudMesh);
    
    // Atmosphere glow
    const atmosphere = createAtmosphere(spec.radius, spec.atmosphereColor, 0.2);
    earthGroup.add(atmosphere);
    
    return earthGroup;
}

function createMars(spec) {
    const marsGroup = new THREE.Group();
    
    const geometry = new THREE.SphereGeometry(spec.radius, 128, 128);
    const material = new THREE.MeshStandardMaterial({
        map: generateMarsTexture(),
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
    const atmosphere = createAtmosphere(spec.radius, spec.atmosphereColor, 0.08);
    marsGroup.add(atmosphere);
    
    return marsGroup;
}

function createJupiter(spec) {
    const jupiterGroup = new THREE.Group();
    
    const geometry = new THREE.SphereGeometry(spec.radius, 128, 128);
    const material = new THREE.MeshStandardMaterial({
        map: generateJupiterTexture(),
        roughness: 0.6,
        metalness: 0.1
    });
    
    const jupiterMesh = new THREE.Mesh(geometry, material);
    jupiterMesh.castShadow = true;
    jupiterMesh.receiveShadow = true;
    jupiterMesh.name = 'jupiter_surface';
    jupiterGroup.add(jupiterMesh);
    
    // Thick atmosphere
    const atmosphere = createAtmosphere(spec.radius, spec.atmosphereColor, 0.15);
    jupiterGroup.add(atmosphere);
    
    return jupiterGroup;
}

function createBlackHoleObject(spec) {
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
        map: generateAccretionDiskTexture(),
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
}

function createAtmosphere(radius, color, opacity) {
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
}

function createPlanet(planetName) {
    if (cosmicApp.currentPlanet) {
        cosmicApp.scene.remove(cosmicApp.currentPlanet);
    }
    
    const spec = cosmicApp.planetSpecs[planetName];
    let planetGroup;
    
    switch (planetName) {
        case 'earth':
            planetGroup = createEarth(spec);
            break;
        case 'mars':
            planetGroup = createMars(spec);
            break;
        case 'jupiter':
            planetGroup = createJupiter(spec);
            break;
        case 'blackhole':
            planetGroup = createBlackHoleObject(spec);
            break;
        default:
            return;
    }
    
    planetGroup.rotation.z = spec.tilt;
    planetGroup.userData = { spec: spec, name: planetName };
    
    cosmicApp.scene.add(planetGroup);
    cosmicApp.currentPlanet = planetGroup;
    cosmicApp.currentPlanetName = planetName;
    
    updateInfoPanel(spec.info);
    
    // Animate entrance
    planetGroup.scale.set(0, 0, 0);
    gsap.to(planetGroup.scale, {
        x: 1, y: 1, z: 1,
        duration: 1.5,
        ease: 'back.out(1.7)'
    });
}

// ============================================
// METEOR SYSTEM
// ============================================

function createMeteor() {
    const meteorGroup = new THREE.Group();
    
    // Spawn position - random point on sphere around scene
    const spawnDistance = 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    meteorGroup.position.set(
        spawnDistance * Math.sin(phi) * Math.cos(theta),
        spawnDistance * Math.sin(phi) * Math.sin(theta),
        spawnDistance * Math.cos(phi)
    );
    
    // Meteor core
    const coreGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa44,
        emissive: 0xffaa44,
        emissiveIntensity: 1
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    meteorGroup.add(core);
    
    // Glow
    const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6622,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    meteorGroup.add(glow);
    
    // Trail particles
    const trailGeometry = new THREE.BufferGeometry();
    const trailCount = 50;
    const trailPositions = new Float32Array(trailCount * 3);
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    
    const trailMaterial = new THREE.PointsMaterial({
        color: 0xff8844,
        size: 0.3,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const trail = new THREE.Points(trailGeometry, trailMaterial);
    meteorGroup.add(trail);
    
    // Point light
    const light = new THREE.PointLight(0xff6622, 1, 10);
    meteorGroup.add(light);
    
    // Calculate velocity toward planet center
    const direction = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), meteorGroup.position)
        .normalize();
    
    const speed = 0.3 + Math.random() * 0.2;
    
    return {
        mesh: meteorGroup,
        velocity: direction.multiplyScalar(speed),
        trail: trail,
        trailPositions: [],
        age: 0,
        maxAge: 300
    };
}

function updateMeteors() {
    // Spawn new meteors
    if (cosmicApp.meteors.length < 3 && Math.random() < 0.01) {
        const meteor = createMeteor();
        cosmicApp.scene.add(meteor.mesh);
        cosmicApp.meteors.push(meteor);
    }
    
    // Update existing meteors
    for (let i = cosmicApp.meteors.length - 1; i >= 0; i--) {
        const meteor = cosmicApp.meteors[i];
        
        // Move meteor
        meteor.mesh.position.add(meteor.velocity);
        
        // Update trail
        meteor.trailPositions.unshift(meteor.mesh.position.clone());
        if (meteor.trailPositions.length > 50) {
            meteor.trailPositions.pop();
        }
        
        const positions = meteor.trail.geometry.attributes.position.array;
        for (let j = 0; j < meteor.trailPositions.length; j++) {
            positions[j * 3] = meteor.trailPositions[j].x;
            positions[j * 3 + 1] = meteor.trailPositions[j].y;
            positions[j * 3 + 2] = meteor.trailPositions[j].z;
        }
        meteor.trail.geometry.attributes.position.needsUpdate = true;
        
        meteor.age++;
        
        // Check collision with planet
        const distanceToCenter = meteor.mesh.position.length();
        const planetRadius = cosmicApp.currentPlanet ? 
            cosmicApp.currentPlanet.userData.spec.radius : 10;
        
        if (distanceToCenter < planetRadius + 2 || meteor.age > meteor.maxAge) {
            // Create impact effect
            if (distanceToCenter < planetRadius + 2) {
                createImpactEffect(meteor.mesh.position.clone());
            }
            
            cosmicApp.scene.remove(meteor.mesh);
            cosmicApp.meteors.splice(i, 1);
        }
    }
}

function createImpactEffect(position) {
    // Flash
    const flashGeometry = new THREE.SphereGeometry(1, 16, 16);
    const flashMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa44,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.copy(position);
    cosmicApp.scene.add(flash);
    
    // Animate and remove
    gsap.to(flash.scale, {
        x: 3, y: 3, z: 3,
        duration: 0.3,
        ease: 'power2.out'
    });
    gsap.to(flashMaterial, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            cosmicApp.scene.remove(flash);
        }
    });
}

// ============================================
// CINEMATIC SEQUENCE
// ============================================

function playCinematic() {
    return new Promise((resolve) => {
        const loadingScreen = document.getElementById('loading-screen');
        const mainNav = document.getElementById('main-nav');
        const infoPanel = document.getElementById('info-panel');
        
        // Create Sun
        const sunGeometry = new THREE.SphereGeometry(8, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(-60, 0, 0);
        
        // Sun glow
        const sunGlowGeometry = new THREE.SphereGeometry(12, 32, 32);
        const sunGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });
        const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        sun.add(sunGlow);
        
        const sunLight = new THREE.PointLight(0xffaa00, 0, 100);
        sun.add(sunLight);
        cosmicApp.scene.add(sun);
        
        // Create Moon
        const moonGeometry = new THREE.SphereGeometry(6, 64, 64);
        const moonMaterial = new THREE.MeshBasicMaterial({
            color: 0xccccff,
            transparent: true,
            opacity: 0
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(60, 0, 0);
        
        const moonGlowGeometry = new THREE.SphereGeometry(8, 32, 32);
        const moonGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });
        const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial);
        moon.add(moonGlow);
        cosmicApp.scene.add(moon);
        
        // Set camera for cinematic
        cosmicApp.camera.position.set(0, 10, 80);
        cosmicApp.camera.lookAt(0, 0, 0);
        
        // Timeline
        const tl = gsap.timeline();
        
        // Fade in sun and moon
        tl.to([sunMaterial, sunGlowMaterial, moonMaterial, moonGlowMaterial], {
            opacity: 1,
            duration: 1.5
        });
        
        tl.to(sunLight, { intensity: 3, duration: 1 }, '-=1');
        
        // Move toward collision
        tl.to(sun.position, { x: 0, duration: 2.5, ease: 'power2.in' }, '+=0.5');
        tl.to(moon.position, { x: 0, duration: 2.5, ease: 'power2.in' }, '-=2.5');
        
        // Camera zoom in
        tl.to(cosmicApp.camera.position, { z: 50, duration: 2 }, '-=1.5');
        
        // Collision flash
        tl.add(() => {
            // Create explosion
            const explosionLight = new THREE.PointLight(0xffffff, 10, 200);
            cosmicApp.scene.add(explosionLight);
            
            gsap.to(explosionLight, {
                intensity: 0,
                duration: 1.5,
                onComplete: () => cosmicApp.scene.remove(explosionLight)
            });
            
            // Remove sun and moon
            gsap.to([sunMaterial, moonMaterial, sunGlowMaterial, moonGlowMaterial], {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    cosmicApp.scene.remove(sun);
                    cosmicApp.scene.remove(moon);
                }
            });
            
            // Create particles
            createExplosionParticles();
        });
        
        // Wait for particles
        tl.add(() => {}, '+=1.5');
        
        // Form Earth
        tl.add(() => {
            createPlanet('earth');
        });
        
        // Camera settle
        tl.to(cosmicApp.camera.position, {
            x: 0, y: 5, z: 30,
            duration: 2,
            ease: 'power2.out'
        }, '+=0.5');
        
        // Show UI
        tl.add(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => loadingScreen.style.display = 'none', 800);
            }
            if (mainNav) {
                mainNav.classList.remove('hidden');
                mainNav.classList.add('visible');
            }
            if (infoPanel) {
                infoPanel.classList.remove('hidden');
                infoPanel.classList.add('visible');
            }
            resolve();
        }, '+=0.5');
    });
}

function createExplosionParticles() {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        
        // Random velocity
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = Math.random() * 2 + 0.5;
        
        velocities.push({
            x: Math.sin(phi) * Math.cos(theta) * speed,
            y: Math.sin(phi) * Math.sin(theta) * speed,
            z: Math.cos(phi) * speed
        });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffcc66,
        size: 0.5,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    cosmicApp.scene.add(particles);
    
    // Animate particles
    let frame = 0;
    function animateParticles() {
        frame++;
        const posArray = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += velocities[i].x * 0.5;
            posArray[i * 3 + 1] += velocities[i].y * 0.5;
            posArray[i * 3 + 2] += velocities[i].z * 0.5;
            
            // Gravity toward center
            velocities[i].x *= 0.98;
            velocities[i].y *= 0.98;
            velocities[i].z *= 0.98;
            velocities[i].x -= posArray[i * 3] * 0.002;
            velocities[i].y -= posArray[i * 3 + 1] * 0.002;
            velocities[i].z -= posArray[i * 3 + 2] * 0.002;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        
        if (frame < 150) {
            requestAnimationFrame(animateParticles);
        } else {
            // Fade out
            gsap.to(material, {
                opacity: 0,
                duration: 1,
                onComplete: () => cosmicApp.scene.remove(particles)
            });
        }
    }
    animateParticles();
}

// ============================================
// SCENE SETUP
// ============================================

function initScene(canvas) {
    cosmicApp.scene = new THREE.Scene();
    cosmicApp.scene.background = new THREE.Color(0x000008);
    cosmicApp.clock = new THREE.Clock();
    
    cosmicApp.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    cosmicApp.camera.position.set(0, 5, 30);
    
    cosmicApp.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    cosmicApp.renderer.setSize(window.innerWidth, window.innerHeight);
    cosmicApp.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cosmicApp.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    cosmicApp.renderer.toneMappingExposure = 1.2;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404050, 0.4);
    cosmicApp.scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(50, 30, 50);
    sunLight.castShadow = true;
    cosmicApp.scene.add(sunLight);
    
    const fillLight = new THREE.DirectionalLight(0x4466ff, 0.3);
    fillLight.position.set(-30, -20, -30);
    cosmicApp.scene.add(fillLight);
}

function createStarfield() {
    // Main stars
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 15000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
        const radius = 500 + Math.random() * 1500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Star colors - some blue, some yellow, mostly white
        const colorType = Math.random();
        if (colorType < 0.1) {
            colors[i * 3] = 0.7;
            colors[i * 3 + 1] = 0.8;
            colors[i * 3 + 2] = 1;
        } else if (colorType < 0.2) {
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.9;
            colors[i * 3 + 2] = 0.7;
        } else {
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        }
        
        sizes[i] = Math.random() * 2 + 0.5;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const starsMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    stars.name = 'stars';
    cosmicApp.scene.add(stars);
    
    // Distant nebula clouds
    for (let i = 0; i < 5; i++) {
        const nebulaGeometry = new THREE.PlaneGeometry(400, 400);
        const nebulaColor = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.3);
        const nebulaMaterial = new THREE.MeshBasicMaterial({
            color: nebulaColor,
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebula.position.set(
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 500,
            -800 - Math.random() * 500
        );
        nebula.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        cosmicApp.scene.add(nebula);
    }
}

// ============================================
// SCROLL ZOOM
// ============================================

function initScrollZoom() {
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const zoomSpeed = 0.05;
        cosmicApp.targetZoom += e.deltaY * zoomSpeed;
        cosmicApp.targetZoom = Math.max(cosmicApp.minZoom, Math.min(cosmicApp.maxZoom, cosmicApp.targetZoom));
    }, { passive: false });
}

// ============================================
// NAVIGATION & UI
// ============================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const planetName = link.dataset.planet;
            
            if (planetName === cosmicApp.currentPlanetName) return;
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            switchPlanet(planetName);
        });
    });
}

function switchPlanet(planetName) {
    if (cosmicApp.currentPlanet) {
        gsap.to(cosmicApp.currentPlanet.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => createPlanet(planetName)
        });
    } else {
        createPlanet(planetName);
    }
}

function updateInfoPanel(info) {
    const title = document.getElementById('info-title');
    const description = document.getElementById('info-description');
    const distance = document.getElementById('stat-distance');
    const diameter = document.getElementById('stat-diameter');
    const period = document.getElementById('stat-period');
    
    const elements = [
        { el: title, val: info.title, delay: 0 },
        { el: description, val: info.description, delay: 0.1 },
        { el: distance, val: info.distance, delay: 0.2 },
        { el: diameter, val: info.diameter, delay: 0.3 },
        { el: period, val: info.period, delay: 0.4 }
    ];
    
    elements.forEach(({ el, val, delay }) => {
        if (el) {
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, delay, onStart: () => el.textContent = val }
            );
        }
    });
}

function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cosmicApp.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        cosmicApp.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
}

// ============================================
// ANIMATION LOOP
// ============================================

function animate() {
    cosmicApp.animationId = requestAnimationFrame(animate);
    
    // Smooth zoom
    cosmicApp.currentZoom += (cosmicApp.targetZoom - cosmicApp.currentZoom) * 0.05;
    cosmicApp.camera.position.z = cosmicApp.currentZoom;
    
    // Rotate stars
    const stars = cosmicApp.scene.getObjectByName('stars');
    if (stars) stars.rotation.y += 0.0001;
    
    // Update planet
    if (cosmicApp.currentPlanet) {
        const spec = cosmicApp.currentPlanet.userData.spec;
        cosmicApp.currentPlanet.rotation.y += spec.rotationSpeed;
        
        cosmicApp.currentPlanet.traverse((child) => {
            if (child.userData && child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
            }
        });
    }
    
    // Update meteors
    updateMeteors();
    
    // Parallax camera
    cosmicApp.camera.position.x += (cosmicApp.mouse.x * 5 - cosmicApp.camera.position.x) * 0.02;
    cosmicApp.camera.position.y += (cosmicApp.mouse.y * 3 + 3 - cosmicApp.camera.position.y) * 0.02;
    cosmicApp.camera.lookAt(0, 0, 0);
    
    cosmicApp.renderer.render(cosmicApp.scene, cosmicApp.camera);
}

// ============================================
// WINDOW EVENTS
// ============================================

window.addEventListener('resize', () => {
    if (!cosmicApp.camera || !cosmicApp.renderer) return;
    
    cosmicApp.camera.aspect = window.innerWidth / window.innerHeight;
    cosmicApp.camera.updateProjectionMatrix();
    cosmicApp.renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('load', function() {
    console.log('🌌 Cosmic Explorer başlatılıyor...');
    
    if (typeof THREE === 'undefined') {
        alert('Three.js yüklenemedi!');
        return;
    }
    
    if (typeof gsap === 'undefined') {
        alert('GSAP yüklenemedi!');
        return;
    }
    
    const canvas = document.getElementById('cosmos-canvas');
    const progressBar = document.querySelector('.progress-bar');
    const statusText = document.querySelector('.loading-status');
    
    function updateProgress(percent, message) {
        if (progressBar) progressBar.style.width = percent + '%';
        if (statusText) statusText.textContent = message;
    }
    
    updateProgress(10, 'Sahne hazırlanıyor...');
    
    setTimeout(() => {
        initScene(canvas);
        updateProgress(30, 'Yıldızlar oluşturuluyor...');
        
        setTimeout(() => {
            createStarfield();
            updateProgress(50, 'Sistemler başlatılıyor...');
            
            setTimeout(() => {
                initCustomCursor();
                initScrollZoom();
                initNavigation();
                updateProgress(70, 'Sinematik hazırlanıyor...');
                
                setTimeout(() => {
                    updateProgress(100, 'Başlatılıyor...');
                    
                    // Start animation loop
                    animate();
                    
                    // Play cinematic
                    setTimeout(() => {
                        playCinematic().then(() => {
                            console.log('✨ Cosmic Explorer hazır!');
                        });
                    }, 500);
                }, 300);
            }, 300);
        }, 300);
    }, 500);
});

console.log('📜 Cosmic Explorer v2.0 yüklendi');
