/**
 * ========================================
 * CINEMATIC SEQUENCE
 * ========================================
 * 
 * Orchestrates the opening cinematic sequence including Sun/Moon collision,
 * particle formation, and Earth materialization.
 * 
 * @module CinematicSequence
 */

/**
 * CinematicSequence Class
 * Manages the dramatic opening sequence
 */
export class CinematicSequence {
    constructor(scene, cameraSystem, particleSystem, planetFactory) {
        this.scene = scene;
        this.cameraSystem = cameraSystem;
        this.particleSystem = particleSystem;
        this.planetFactory = planetFactory;
        
        // Sequence objects
        this.sun = null;
        this.moon = null;
        this.formingEarth = null;
    }
    
    /**
     * Play the complete cinematic sequence
     * @returns {Promise}
     */
    async play() {
        console.log('Starting cinematic sequence...');
        
        try {
            // Set initial camera position
            await this.setupCamera();
            
            // Create Sun and Moon
            await this.createCelestialBodies();
            
            // Animate collision
            await this.animateCollision();
            
            // Create shockwave and particles
            await this.createCollisionEffects();
            
            // Form Earth from particles
            await this.formEarth();
            
            // Final camera movement
            await this.finalCameraMove();
            
            // Cleanup sequence objects
            this.cleanup();
            
            console.log('✓ Cinematic sequence complete');
            
        } catch (error) {
            console.error('Error in cinematic sequence:', error);
        }
    }
    
    /**
     * Setup initial camera position
     */
    async setupCamera() {
        this.cameraSystem.camera.position.set(0, 10, 100);
        this.cameraSystem.camera.lookAt(0, 0, 0);
        this.cameraSystem.targetPosition = { x: 0, y: 10, z: 100 };
        this.cameraSystem.currentPosition = { x: 0, y: 10, z: 100 };
    }
    
    /**
     * Create Sun and Moon for collision
     */
    async createCelestialBodies() {
        // Create Sun
        const sunGeometry = new THREE.SphereGeometry(8, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 1
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.position.set(-60, 0, 0);
        
        // Add sun glow
        const sunGlowGeometry = new THREE.SphereGeometry(12, 32, 32);
        const sunGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        this.sun.add(sunGlow);
        
        // Add sun light
        const sunLight = new THREE.PointLight(0xffaa00, 3, 100);
        this.sun.add(sunLight);
        
        this.scene.add(this.sun);
        
        // Create Moon
        const moonGeometry = new THREE.SphereGeometry(6, 64, 64);
        const moonMaterial = new THREE.MeshBasicMaterial({
            color: 0xccccff,
            emissive: 0xaaaacc,
            emissiveIntensity: 0.5
        });
        
        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.moon.position.set(60, 0, 0);
        
        // Add moon glow
        const moonGlowGeometry = new THREE.SphereGeometry(8, 32, 32);
        const moonGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaff,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial);
        this.moon.add(moonGlow);
        
        // Add moon light
        const moonLight = new THREE.PointLight(0xaaaaff, 2, 80);
        this.moon.add(moonLight);
        
        this.scene.add(this.moon);
        
        // Fade in
        gsap.from([this.sun.material, this.moon.material], {
            opacity: 0,
            duration: 1,
            stagger: 0.3
        });
    }
    
    /**
     * Animate collision between Sun and Moon
     */
    async animateCollision() {
        return new Promise((resolve) => {
            const duration = 3;
            
            // Move Sun toward center
            gsap.to(this.sun.position, {
                x: -2,
                duration: duration,
                ease: 'power2.in'
            });
            
            // Move Moon toward center
            gsap.to(this.moon.position, {
                x: 2,
                duration: duration,
                ease: 'power2.in',
                onComplete: resolve
            });
            
            // Rotate celestial bodies
            gsap.to(this.sun.rotation, {
                y: Math.PI * 2,
                duration: duration,
                ease: 'none'
            });
            
            gsap.to(this.moon.rotation, {
                y: -Math.PI * 2,
                duration: duration,
                ease: 'none'
            });
        });
    }
    
    /**
     * Create collision effects
     */
    async createCollisionEffects() {
        const collisionPoint = new THREE.Vector3(0, 0, 0);
        
        // Create massive explosion
        this.particleSystem.createExplosion(
            collisionPoint,
            500,
            0xffffff,
            15
        );
        
        // Create multiple shockwaves
        this.particleSystem.createShockwave(collisionPoint, 40, 0xffaa00);
        
        setTimeout(() => {
            this.particleSystem.createShockwave(collisionPoint, 50, 0xaaaaff);
        }, 200);
        
        setTimeout(() => {
            this.particleSystem.createShockwave(collisionPoint, 60, 0xffffff);
        }, 400);
        
        // Create light flash
        const flashLight = new THREE.PointLight(0xffffff, 10, 200);
        flashLight.position.copy(collisionPoint);
        this.scene.add(flashLight);
        
        gsap.to(flashLight, {
            intensity: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                this.scene.remove(flashLight);
            }
        });
        
        // Camera shake
        this.cameraSystem.shake(2, 0.5);
        
        // Fade out Sun and Moon
        gsap.to([this.sun.material, this.moon.material], {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.scene.remove(this.sun);
                this.scene.remove(this.moon);
            }
        });
        
        // Wait for effects
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    /**
     * Form Earth from particles
     */
    async formEarth() {
        // Create particle cloud that will form Earth
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Start particles in a sphere
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = 30 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Earth-like colors
            const colorChoice = Math.random();
            if (colorChoice < 0.7) {
                // Blue (ocean)
                colors[i3] = 0.2;
                colors[i3 + 1] = 0.5;
                colors[i3 + 2] = 0.9;
            } else {
                // Green/Brown (land)
                colors[i3] = 0.3;
                colors[i3 + 1] = 0.6;
                colors[i3 + 2] = 0.2;
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.formingEarth = new THREE.Points(geometry, material);
        this.scene.add(this.formingEarth);
        
        // Animate particles converging to form Earth
        return new Promise((resolve) => {
            const duration = 3;
            const targetPositions = new Float32Array(particleCount * 3);
            
            // Calculate target positions on sphere surface
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const radius = 10;
                
                targetPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                targetPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                targetPositions[i3 + 2] = radius * Math.cos(phi);
            }
            
            // Animate convergence
            gsap.to(positions, {
                endArray: targetPositions,
                duration: duration,
                ease: 'power2.inOut',
                onUpdate: () => {
                    geometry.attributes.position.needsUpdate = true;
                },
                onComplete: () => {
                    // Fade out particle system
                    gsap.to(material, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            this.scene.remove(this.formingEarth);
                            resolve();
                        }
                    });
                }
            });
        });
    }
    
    /**
     * Final camera movement and reveal Earth
     */
    async finalCameraMove() {
        // Create actual Earth planet
        await this.planetFactory.createPlanet('earth');
        
        // Dolly camera in
        await this.cameraSystem.cinematicDollyZoom(100, 30, 3);
        
        // Enable auto-rotate for a moment
        this.cameraSystem.setAutoRotate(true);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.cameraSystem.setAutoRotate(false);
    }
    
    /**
     * Cleanup sequence objects
     */
    cleanup() {
        if (this.sun) {
            this.scene.remove(this.sun);
            this.sun.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
        
        if (this.moon) {
            this.scene.remove(this.moon);
            this.moon.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
        
        if (this.formingEarth) {
            this.scene.remove(this.formingEarth);
            if (this.formingEarth.geometry) this.formingEarth.geometry.dispose();
            if (this.formingEarth.material) this.formingEarth.material.dispose();
        }
    }
}