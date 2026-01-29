/**
 * ========================================
 * LIGHTING SYSTEM
 * ========================================
 * 
 * Advanced lighting system with dynamic lights, shadows, and
 * atmosphere-specific lighting configurations for different celestial bodies.
 * 
 * @module LightingSystem
 */

/**
 * LightingSystem Class
 * Manages all lighting in the scene including ambient, directional, and point lights
 */
export class LightingSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Light references
        this.ambientLight = null;
        this.mainLight = null;
        this.fillLight = null;
        this.rimLight = null;
        this.pointLights = [];
        
        // Light configurations for different planets
        this.lightConfigs = {
            earth: {
                ambient: { color: 0x1a2332, intensity: 0.3 },
                main: { color: 0xffffff, intensity: 1.5, position: { x: 50, y: 30, z: 50 } },
                fill: { color: 0x4488ff, intensity: 0.4, position: { x: -30, y: 20, z: -30 } },
                rim: { color: 0x88ccff, intensity: 0.6, position: { x: 0, y: 50, z: -50 } }
            },
            mars: {
                ambient: { color: 0x331a1a, intensity: 0.25 },
                main: { color: 0xffaa77, intensity: 1.3, position: { x: 60, y: 25, z: 40 } },
                fill: { color: 0xff6644, intensity: 0.3, position: { x: -40, y: 15, z: -35 } },
                rim: { color: 0xff8855, intensity: 0.5, position: { x: 0, y: 45, z: -60 } }
            },
            jupiter: {
                ambient: { color: 0x2a2520, intensity: 0.35 },
                main: { color: 0xffd699, intensity: 1.4, position: { x: 80, y: 40, z: 70 } },
                fill: { color: 0xffbb77, intensity: 0.35, position: { x: -50, y: 30, z: -50 } },
                rim: { color: 0xffcc88, intensity: 0.55, position: { x: 0, y: 60, z: -80 } }
            },
            blackhole: {
                ambient: { color: 0x0a0520, intensity: 0.15 },
                main: { color: 0x8844ff, intensity: 0.8, position: { x: 70, y: 35, z: 60 } },
                fill: { color: 0x6633cc, intensity: 0.2, position: { x: -45, y: 25, z: -45 } },
                rim: { color: 0x9955ff, intensity: 0.7, position: { x: 0, y: 55, z: -70 } }
            }
        };
        
        this.currentConfig = 'earth';
    }
    
    /**
     * Initialize lighting system
     */
    init() {
        console.log('Initializing Lighting System...');
        
        // Create base lights
        this.createAmbientLight();
        this.createMainLight();
        this.createFillLight();
        this.createRimLight();
        
        // Apply initial configuration
        this.applyConfiguration('earth');
        
        console.log('✓ Lighting System initialized');
    }
    
    /**
     * Create ambient light for overall scene illumination
     */
    createAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0x1a2332, 0.3);
        this.ambientLight.name = 'ambientLight';
        this.scene.add(this.ambientLight);
    }
    
    /**
     * Create main directional light (key light)
     */
    createMainLight() {
        const config = this.lightConfigs.earth.main;
        
        this.mainLight = new THREE.DirectionalLight(config.color, config.intensity);
        this.mainLight.position.set(config.position.x, config.position.y, config.position.z);
        this.mainLight.name = 'mainLight';
        
        // Enable shadows for main light
        this.mainLight.castShadow = true;
        this.mainLight.shadow.mapSize.width = 2048;
        this.mainLight.shadow.mapSize.height = 2048;
        this.mainLight.shadow.camera.near = 0.5;
        this.mainLight.shadow.camera.far = 500;
        this.mainLight.shadow.camera.left = -50;
        this.mainLight.shadow.camera.right = 50;
        this.mainLight.shadow.camera.top = 50;
        this.mainLight.shadow.camera.bottom = -50;
        this.mainLight.shadow.bias = -0.0001;
        
        this.scene.add(this.mainLight);
        
        // Optional: Add helper for debugging
        // const helper = new THREE.DirectionalLightHelper(this.mainLight, 5);
        // this.scene.add(helper);
    }
    
    /**
     * Create fill light for softer illumination
     */
    createFillLight() {
        const config = this.lightConfigs.earth.fill;
        
        this.fillLight = new THREE.DirectionalLight(config.color, config.intensity);
        this.fillLight.position.set(config.position.x, config.position.y, config.position.z);
        this.fillLight.name = 'fillLight';
        
        this.scene.add(this.fillLight);
    }
    
    /**
     * Create rim light for edge highlighting
     */
    createRimLight() {
        const config = this.lightConfigs.earth.rim;
        
        this.rimLight = new THREE.DirectionalLight(config.color, config.intensity);
        this.rimLight.position.set(config.position.x, config.position.y, config.position.z);
        this.rimLight.name = 'rimLight';
        
        this.scene.add(this.rimLight);
    }
    
    /**
     * Create dynamic point light (for effects)
     * @param {number} color - Light color
     * @param {number} intensity - Light intensity
     * @param {Object} position - Light position {x, y, z}
     * @param {number} distance - Light distance
     * @returns {THREE.PointLight}
     */
    createPointLight(color, intensity, position, distance = 100) {
        const pointLight = new THREE.PointLight(color, intensity, distance);
        pointLight.position.set(position.x, position.y, position.z);
        
        // Add lens flare effect
        this.addLensFlare(pointLight);
        
        this.scene.add(pointLight);
        this.pointLights.push(pointLight);
        
        return pointLight;
    }
    
    /**
     * Add lens flare effect to light
     * @param {THREE.Light} light
     */
    addLensFlare(light) {
        // Create sprite for lens flare effect
        const textureLoader = new THREE.TextureLoader();
        
        // Create canvas texture for flare
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Draw radial gradient
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 5, 1);
        light.add(sprite);
    }
    
    /**
     * Apply lighting configuration for specific planet
     * @param {string} planetName
     */
    applyConfiguration(planetName) {
        if (!this.lightConfigs[planetName]) {
            console.warn(`No lighting configuration for ${planetName}`);
            return;
        }
        
        const config = this.lightConfigs[planetName];
        this.currentConfig = planetName;
        
        // Animate lighting transitions
        this.transitionAmbientLight(config.ambient);
        this.transitionMainLight(config.main);
        this.transitionFillLight(config.fill);
        this.transitionRimLight(config.rim);
        
        console.log(`✓ Applied lighting configuration: ${planetName}`);
    }
    
    /**
     * Transition ambient light
     * @param {Object} config
     */
    transitionAmbientLight(config) {
        const currentColor = this.ambientLight.color;
        const targetColor = new THREE.Color(config.color);
        
        gsap.to(currentColor, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        gsap.to(this.ambientLight, {
            intensity: config.intensity,
            duration: 2,
            ease: 'power2.inOut'
        });
    }
    
    /**
     * Transition main light
     * @param {Object} config
     */
    transitionMainLight(config) {
        const currentColor = this.mainLight.color;
        const targetColor = new THREE.Color(config.color);
        
        gsap.to(currentColor, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        gsap.to(this.mainLight, {
            intensity: config.intensity,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        gsap.to(this.mainLight.position, {
            x: config.position.x,
            y: config.position.y,
            z: config.position.z,
            duration: 2.5,
            ease: 'power2.inOut'
        });
    }
    
    /**
     * Transition fill light
     * @param {Object} config
     */
    transitionFillLight(config) {
        const currentColor = this.fillLight.color;
        const targetColor = new THREE.Color(config.color);
        
        gsap.to(currentColor, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        gsap.to(this.fillLight, {
            intensity: config.intensity,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        gsap.to(this.fillLight.position, {
            x: config.position.x,
            y: config.position.y,
            z: config.position.z,
            duration: 2.5,
            ease: 'power2.inOut'
        });
    }
    
    /**
     * Transition rim light
     * @param {Object} config
     */
    transitionRimLight(config) {
        const currentColor = this.rimLight.color;
        const targetColor = new THREE.Color(config.color);
        
        gsap.to(currentColor, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        gsap.to(this.rimLight, {
            intensity: config.intensity,
            duration: 2,
            ease: 'power2.inOut'
        });
        
        gsap.to(this.rimLight.position, {
            x: config.position.x,
            y: config.position.y,
            z: config.position.z,
            duration: 2.5,
            ease: 'power2.inOut'
        });
    }
    
    /**
     * Create dramatic lighting effect for events
     * @param {number} duration - Effect duration in seconds
     */
    createDramaticFlash(duration = 0.5) {
        const originalIntensity = this.mainLight.intensity;
        
        gsap.to(this.mainLight, {
            intensity: originalIntensity * 3,
            duration: duration * 0.2,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(this.mainLight, {
                    intensity: originalIntensity,
                    duration: duration * 0.8,
                    ease: 'power2.in'
                });
            }
        });
    }
    
    /**
     * Animate light pulsing effect
     * @param {THREE.Light} light
     * @param {number} minIntensity
     * @param {number} maxIntensity
     * @param {number} speed
     */
    pulseLight(light, minIntensity, maxIntensity, speed = 2) {
        gsap.to(light, {
            intensity: maxIntensity,
            duration: speed,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Remove a point light
     * @param {THREE.PointLight} light
     */
    removePointLight(light) {
        const index = this.pointLights.indexOf(light);
        if (index > -1) {
            this.pointLights.splice(index, 1);
        }
        
        this.scene.remove(light);
        
        if (light.geometry) light.geometry.dispose();
        if (light.material) light.material.dispose();
    }
    
    /**
     * Update lighting system (called per frame if needed)
     */
    update() {
        // Update any animated lights here if needed
    }
    
    /**
     * Cleanup and dispose resources
     */
    dispose() {
        console.log('Disposing Lighting System...');
        
        // Remove all lights
        if (this.ambientLight) this.scene.remove(this.ambientLight);
        if (this.mainLight) this.scene.remove(this.mainLight);
        if (this.fillLight) this.scene.remove(this.fillLight);
        if (this.rimLight) this.scene.remove(this.rimLight);
        
        // Remove point lights
        this.pointLights.forEach(light => {
            this.scene.remove(light);
        });
        this.pointLights = [];
        
        console.log('✓ Lighting System disposed');
    }
}