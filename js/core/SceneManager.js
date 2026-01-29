/**
 * ========================================
 * SCENE MANAGER
 * ========================================
 * 
 * Manages the Three.js scene, renderer, and core 3D environment setup.
 * Handles scene initialization, rendering pipeline, and resource management.
 * 
 * @module SceneManager
 */

/**
 * SceneManager Class
 * Responsible for creating and managing the Three.js scene and renderer
 */
export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        
        // Scene properties
        this.fog = null;
        this.backgroundColor = 0x000000;
        
        // Render settings
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.antialias = true;
        this.alpha = false;
    }
    
    /**
     * Initialize the scene manager
     */
    async init() {
        console.log('Initializing Scene Manager...');
        
        // Get canvas element
        this.canvas = document.getElementById('cosmos-canvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        // Create scene
        this.createScene();
        
        // Create camera
        this.createCamera();
        
        // Create renderer
        this.createRenderer();
        
        // Setup scene environment
        this.setupEnvironment();
        
        console.log('✓ Scene Manager initialized');
    }
    
    /**
     * Create the Three.js scene
     */
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.backgroundColor);
        
        // Add subtle fog for depth
        this.fog = new THREE.FogExp2(0x000510, 0.00015);
        this.scene.fog = this.fog;
        
        console.log('✓ Scene created');
    }
    
    /**
     * Create the camera
     */
    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const fov = 75;
        const near = 0.1;
        const far = 10000;
        
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(0, 0, 0);
        
        console.log('✓ Camera created');
    }
    
    /**
     * Create the WebGL renderer
     */
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: this.antialias,
            alpha: this.alpha,
            powerPreference: 'high-performance'
        });
        
        // Set renderer properties
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.pixelRatio);
        
        // Enable shadow mapping for realistic shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Set tone mapping for better color handling
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Enable physically correct lighting
        this.renderer.physicallyCorrectLights = true;
        
        // Set output encoding for better color accuracy
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        console.log('✓ Renderer created');
    }
    
    /**
     * Setup scene environment (ambient elements, stars, etc.)
     */
    setupEnvironment() {
        // Create starfield background
        this.createStarfield();
        
        // Create distant nebula effect
        this.createNebulaBackground();
        
        console.log('✓ Environment setup complete');
    }
    
    /**
     * Create realistic starfield with varying sizes and brightness
     */
    createStarfield() {
        const starCount = 15000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);
        
        // Generate stars
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Random spherical distribution
            const radius = 2000 + Math.random() * 3000;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            starPositions[i3 + 2] = radius * Math.cos(phi);
            
            // Star colors (white to blue-white)
            const colorVariation = 0.8 + Math.random() * 0.2;
            starColors[i3] = colorVariation;
            starColors[i3 + 1] = colorVariation;
            starColors[i3 + 2] = 1.0;
            
            // Star sizes (vary for depth effect)
            starSizes[i] = Math.random() * 3 + 0.5;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
        
        // Create star material with custom shader for better visuals
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const starField = new THREE.Points(starGeometry, starMaterial);
        starField.name = 'starfield';
        this.scene.add(starField);
        
        // Create second layer of larger, brighter stars
        this.createBrightStars();
        
        console.log('✓ Starfield created');
    }
    
    /**
     * Create bright prominent stars
     */
    createBrightStars() {
        const brightStarCount = 500;
        const brightStarGeometry = new THREE.BufferGeometry();
        const brightStarPositions = new Float32Array(brightStarCount * 3);
        const brightStarColors = new Float32Array(brightStarCount * 3);
        const brightStarSizes = new Float32Array(brightStarCount);
        
        for (let i = 0; i < brightStarCount; i++) {
            const i3 = i * 3;
            
            const radius = 1500 + Math.random() * 3500;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            brightStarPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            brightStarPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            brightStarPositions[i3 + 2] = radius * Math.cos(phi);
            
            // Colorful stars (blue, white, yellow tint)
            const starType = Math.random();
            if (starType < 0.3) {
                // Blue stars
                brightStarColors[i3] = 0.7;
                brightStarColors[i3 + 1] = 0.9;
                brightStarColors[i3 + 2] = 1.0;
            } else if (starType < 0.6) {
                // White stars
                brightStarColors[i3] = 1.0;
                brightStarColors[i3 + 1] = 1.0;
                brightStarColors[i3 + 2] = 1.0;
            } else {
                // Yellow-white stars
                brightStarColors[i3] = 1.0;
                brightStarColors[i3 + 1] = 0.95;
                brightStarColors[i3 + 2] = 0.8;
            }
            
            brightStarSizes[i] = Math.random() * 5 + 2;
        }
        
        brightStarGeometry.setAttribute('position', new THREE.BufferAttribute(brightStarPositions, 3));
        brightStarGeometry.setAttribute('color', new THREE.BufferAttribute(brightStarColors, 3));
        brightStarGeometry.setAttribute('size', new THREE.BufferAttribute(brightStarSizes, 1));
        
        const brightStarMaterial = new THREE.PointsMaterial({
            size: 4,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const brightStarField = new THREE.Points(brightStarGeometry, brightStarMaterial);
        brightStarField.name = 'brightStarfield';
        this.scene.add(brightStarField);
    }
    
    /**
     * Create nebula background effect
     */
    createNebulaBackground() {
        // Create large sphere with nebula texture
        const nebulaGeometry = new THREE.SphereGeometry(4500, 64, 64);
        
        // Create canvas texture for nebula
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');
        
        // Create gradient nebula effect
        const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024);
        gradient.addColorStop(0, 'rgba(20, 40, 80, 0.05)');
        gradient.addColorStop(0.3, 'rgba(40, 20, 60, 0.03)');
        gradient.addColorStop(0.6, 'rgba(10, 20, 40, 0.02)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 2048, 2048);
        
        // Add some noise/texture
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * 2048;
            const y = Math.random() * 2048;
            const size = Math.random() * 3;
            const alpha = Math.random() * 0.1;
            
            ctx.fillStyle = `rgba(100, 150, 255, ${alpha})`;
            ctx.fillRect(x, y, size, size);
        }
        
        const nebulaTexture = new THREE.CanvasTexture(canvas);
        
        const nebulaMaterial = new THREE.MeshBasicMaterial({
            map: nebulaTexture,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebula.name = 'nebula';
        this.scene.add(nebula);
        
        console.log('✓ Nebula background created');
    }
    
    /**
     * Render the scene
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Update scene background color
     * @param {number} color - Hex color value
     */
    setBackgroundColor(color) {
        this.backgroundColor = color;
        this.scene.background = new THREE.Color(color);
    }
    
    /**
     * Update fog properties
     * @param {number} color - Fog color
     * @param {number} density - Fog density
     */
    updateFog(color, density) {
        this.scene.fog = new THREE.FogExp2(color, density);
    }
    
    /**
     * Add object to scene
     * @param {THREE.Object3D} object - Object to add
     */
    add(object) {
        this.scene.add(object);
    }
    
    /**
     * Remove object from scene
     * @param {THREE.Object3D} object - Object to remove
     */
    remove(object) {
        this.scene.remove(object);
    }
    
    /**
     * Get object by name
     * @param {string} name - Object name
     * @returns {THREE.Object3D|undefined}
     */
    getObjectByName(name) {
        return this.scene.getObjectByName(name);
    }
    
    /**
     * Cleanup and dispose resources
     */
    dispose() {
        console.log('Disposing Scene Manager...');
        
        // Dispose all geometries and materials in scene
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('✓ Scene Manager disposed');
    }
}