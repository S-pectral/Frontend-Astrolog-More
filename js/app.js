/**
 * Cosmic Explorer - Main Application
 * Production-ready astronomy experience without ES6 modules
 */

// Global state
let cosmicApp = {
    // Core Three.js objects
    scene: null,
    camera: null,
    renderer: null,
    
    // Current planet
    currentPlanet: null,
    currentPlanetName: 'earth',
    
    // Animation
    animationId: null,
    
    // Mouse tracking
    mouse: { x: 0, y: 0 },
    
    // Planet specifications
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

// Wait for everything to load
window.addEventListener('load', function() {
    console.log('🌌 Cosmic Explorer başlatılıyor...');
    
    // Check if Three.js loaded
    if (typeof THREE === 'undefined') {
        alert('Three.js yüklenemedi! Lütfen npm install komutunu çalıştırın.');
        document.querySelector('.loading-status').textContent = 'Hata: Three.js bulunamadı';
        return;
    }
    
    // Check if GSAP loaded
    if (typeof gsap === 'undefined') {
        alert('GSAP yüklenemedi! Lütfen npm install komutunu çalıştırın.');
        document.querySelector('.loading-status').textContent = 'Hata: GSAP bulunamadı';
        return;
    }
    
    // Start the application
    startCosmicExplorer();
});

function startCosmicExplorer() {
    // Get DOM elements
    const canvas = document.getElementById('cosmos-canvas');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.progress-bar');
    const statusText = document.querySelector('.loading-status');
    const mainNav = document.getElementById('main-nav');
    const infoPanel = document.getElementById('info-panel');
    
    // Progress updater
    function updateProgress(percent, message) {
        if (progressBar) progressBar.style.width = percent + '%';
        if (statusText) statusText.textContent = message;
    }
    
    // Start loading sequence
    updateProgress(10, 'Sahne hazırlanıyor...');
    
    setTimeout(() => {
        // Initialize Three.js scene
        initScene(canvas);
        updateProgress(30, 'Kamera oluşturuluyor...');
        
        setTimeout(() => {
            // Create starfield
            createStarfield();
            updateProgress(50, 'Yıldızlar ekleniyor...');
            
            setTimeout(() => {
                // Create initial planet (Earth)
                createPlanet('earth');
                updateProgress(80, 'Dünya oluşturuluyor...');
                
                setTimeout(() => {
                    updateProgress(100, 'Tamamlandı!');
                    
                    // Hide loading screen
                    setTimeout(() => {
                        if (loadingScreen) {
                            loadingScreen.classList.add('fade-out');
                            setTimeout(() => {
                                loadingScreen.style.display = 'none';
                            }, 800);
                        }
                        
                        // Show UI
                        if (mainNav) {
                            mainNav.classList.remove('hidden');
                            mainNav.classList.add('visible');
                        }
                        
                        if (infoPanel) {
                            infoPanel.classList.remove('hidden');
                            infoPanel.classList.add('visible');
                        }
                        
                        // Initialize interactions
                        initCustomCursor();
                        initNavigation();
                        
                        // Start animation loop
                        animate();
                        
                        console.log('✨ Cosmic Explorer hazır!');
                    }, 500);
                }, 300);
            }, 300);
        }, 300);
    }, 500);
}

function initScene(canvas) {
    // Create scene
    cosmicApp.scene = new THREE.Scene();
    cosmicApp.scene.background = new THREE.Color(0x000000);
    
    // Create camera
    cosmicApp.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    cosmicApp.camera.position.set(0, 5, 30);
    
    // Create renderer
    cosmicApp.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    cosmicApp.renderer.setSize(window.innerWidth, window.innerHeight);
    cosmicApp.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    cosmicApp.scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(50, 30, 50);
    cosmicApp.scene.add(sunLight);
    
    // Mouse tracking for parallax
    document.addEventListener('mousemove', (e) => {
        cosmicApp.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        cosmicApp.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        cosmicApp.camera.aspect = window.innerWidth / window.innerHeight;
        cosmicApp.camera.updateProjectionMatrix();
        cosmicApp.renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 3000;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    stars.name = 'stars';
    cosmicApp.scene.add(stars);
}

function createPlanet(planetName) {
    // Remove existing planet if any
    if (cosmicApp.currentPlanet) {
        cosmicApp.scene.remove(cosmicApp.currentPlanet);
    }
    
    const spec = cosmicApp.planetSpecs[planetName];
    const planetGroup = new THREE.Group();
    
    // Create planet based on type
    if (planetName === 'blackhole') {
        createBlackHole(planetGroup, spec);
    } else {
        createRegularPlanet(planetGroup, spec, planetName);
    }
    
    // Apply axial tilt
    planetGroup.rotation.z = spec.tilt;
    planetGroup.userData = { spec: spec, name: planetName };
    
    cosmicApp.scene.add(planetGroup);
    cosmicApp.currentPlanet = planetGroup;
    cosmicApp.currentPlanetName = planetName;
    
    // Update info panel
    updateInfoPanel(spec.info);
    
    // Animate planet entrance
    planetGroup.scale.set(0, 0, 0);
    gsap.to(planetGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        ease: 'back.out(1.7)'
    });
}

function createRegularPlanet(group, spec, planetName) {
    // Main planet sphere
    const geometry = new THREE.SphereGeometry(spec.radius, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: spec.color,
        roughness: 0.7,
        metalness: 0.3
    });
    
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;
    planetMesh.name = planetName + '_surface';
    group.add(planetMesh);
    
    // Add clouds for Earth
    if (planetName === 'earth') {
        const cloudGeometry = new THREE.SphereGeometry(spec.radius + 0.1, 64, 64);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            depthWrite: false
        });
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudMesh.name = 'earth_clouds';
        cloudMesh.userData = { rotationSpeed: spec.rotationSpeed * 1.3 };
        group.add(cloudMesh);
    }
    
    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(spec.radius * 1.15, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: spec.atmosphereColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    group.add(atmosphere);
}

function createBlackHole(group, spec) {
    // Event horizon (black sphere)
    const horizonGeometry = new THREE.SphereGeometry(spec.radius * 0.5, 64, 64);
    const horizonMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    horizon.name = 'event_horizon';
    group.add(horizon);
    
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
    group.add(disk);
    
    // Glowing atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(spec.radius * 1.5, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: spec.atmosphereColor,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    group.add(atmosphere);
}

function updateInfoPanel(info) {
    const title = document.getElementById('info-title');
    const description = document.getElementById('info-description');
    const distance = document.getElementById('stat-distance');
    const diameter = document.getElementById('stat-diameter');
    const period = document.getElementById('stat-period');
    
    if (title) {
        gsap.fromTo(title, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, onStart: () => {
                title.textContent = info.title;
            }}
        );
    }
    
    if (description) {
        gsap.fromTo(description,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.1, onStart: () => {
                description.textContent = info.description;
            }}
        );
    }
    
    if (distance) {
        gsap.fromTo(distance,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.2, onStart: () => {
                distance.textContent = info.distance;
            }}
        );
    }
    
    if (diameter) {
        gsap.fromTo(diameter,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.3, onStart: () => {
                diameter.textContent = info.diameter;
            }}
        );
    }
    
    if (period) {
        gsap.fromTo(period,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.4, onStart: () => {
                period.textContent = info.period;
            }}
        );
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const planetName = link.dataset.planet;
            
            // Don't switch if already on this planet
            if (planetName === cosmicApp.currentPlanetName) {
                return;
            }
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Switch planet with animation
            switchPlanet(planetName);
        });
    });
}

function switchPlanet(planetName) {
    console.log(`Switching to ${planetName}...`);
    
    // Fade out current planet
    if (cosmicApp.currentPlanet) {
        gsap.to(cosmicApp.currentPlanet.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
                // Create new planet
                createPlanet(planetName);
            }
        });
    } else {
        createPlanet(planetName);
    }
}

function animate() {
    cosmicApp.animationId = requestAnimationFrame(animate);
    
    // Rotate stars slowly
    const stars = cosmicApp.scene.getObjectByName('stars');
    if (stars) {
        stars.rotation.y += 0.0001;
    }
    
    // Update current planet
    if (cosmicApp.currentPlanet) {
        const spec = cosmicApp.currentPlanet.userData.spec;
        cosmicApp.currentPlanet.rotation.y += spec.rotationSpeed;
        
        // Rotate child objects (clouds, accretion disk, etc.)
        cosmicApp.currentPlanet.traverse((child) => {
            if (child.userData && child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
            }
        });
    }
    
    // Parallax camera effect
    cosmicApp.camera.position.x += (cosmicApp.mouse.x * 5 - cosmicApp.camera.position.x) * 0.05;
    cosmicApp.camera.position.y += (cosmicApp.mouse.y * 5 + 5 - cosmicApp.camera.position.y) * 0.05;
    cosmicApp.camera.lookAt(0, 0, 0);
    
    // Render
    cosmicApp.renderer.render(cosmicApp.scene, cosmicApp.camera);
}

// Custom cursor initialization
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
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

console.log('📜 app.js yüklendi');