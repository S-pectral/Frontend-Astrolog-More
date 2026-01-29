/**
 * ========================================
 * CAMERA SYSTEM
 * ========================================
 * 
 * Advanced camera system with cinematic controls, smooth transitions,
 * and interactive camera movements for an immersive experience.
 * 
 * @module CameraSystem
 */

/**
 * CameraSystem Class
 * Manages camera behavior, transitions, and interactive controls
 */
export class CameraSystem {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        
        // Camera state
        this.isTransitioning = false;
        this.autoRotate = false;
        this.autoRotateSpeed = 0.1;
        
        // Mouse interaction
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.mouseInfluence = 0.02;
        
        // Camera orbit
        this.orbitRadius = 50;
        this.orbitAngle = 0;
        this.orbitHeight = 0;
        
        // Smooth damping
        this.dampingFactor = 0.05;
        this.currentPosition = { x: 0, y: 0, z: 50 };
        this.targetPosition = { x: 0, y: 0, z: 50 };
        
        // Planet-specific camera positions
        this.planetPositions = {
            earth: { x: 0, y: 5, z: 30, lookAt: { x: 0, y: 0, z: 0 } },
            mars: { x: 0, y: 8, z: 35, lookAt: { x: 0, y: 0, z: 0 } },
            jupiter: { x: 0, y: 15, z: 80, lookAt: { x: 0, y: 0, z: 0 } },
            blackhole: { x: 0, y: 10, z: 60, lookAt: { x: 0, y: 0, z: 0 } }
        };
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
    }
    
    /**
     * Initialize camera system
     */
    init() {
        console.log('Initializing Camera System...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Set initial camera position
        this.camera.position.set(0, 0, 50);
        this.currentPosition = { ...this.camera.position };
        this.targetPosition = { ...this.camera.position };
        
        console.log('✓ Camera System initialized');
    }
    
    /**
     * Setup event listeners for camera interaction
     */
    setupEventListeners() {
        // Mouse movement for parallax effect
        this.domElement.addEventListener('mousemove', this.handleMouseMove, false);
        
        // Mouse wheel for zoom (optional)
        this.domElement.addEventListener('wheel', this.handleMouseWheel, { passive: false });
    }
    
    /**
     * Handle mouse movement for parallax camera effect
     * @param {MouseEvent} event
     */
    handleMouseMove(event) {
        // Normalize mouse position to -1 to 1 range
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    /**
     * Handle mouse wheel for camera zoom
     * @param {WheelEvent} event
     */
    handleMouseWheel(event) {
        event.preventDefault();
        
        if (this.isTransitioning) return;
        
        // Adjust orbit radius
        const zoomSpeed = 0.05;
        this.orbitRadius += event.deltaY * zoomSpeed;
        
        // Clamp orbit radius
        this.orbitRadius = Math.max(20, Math.min(100, this.orbitRadius));
    }
    
    /**
     * Update camera position and orientation
     */
    update() {
        // Smooth mouse tracking with interpolation
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * this.dampingFactor;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * this.dampingFactor;
        
        if (!this.isTransitioning) {
            // Apply subtle parallax effect based on mouse position
            const parallaxX = this.mouse.x * this.mouseInfluence * this.orbitRadius;
            const parallaxY = this.mouse.y * this.mouseInfluence * this.orbitRadius;
            
            this.targetPosition.x = parallaxX;
            this.targetPosition.y = parallaxY;
            
            // Auto-rotate if enabled
            if (this.autoRotate) {
                this.orbitAngle += this.autoRotateSpeed * 0.01;
                
                this.targetPosition.x += Math.sin(this.orbitAngle) * 2;
                this.targetPosition.z = this.orbitRadius + Math.cos(this.orbitAngle) * 2;
            }
        }
        
        // Smooth camera movement with damping
        this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * this.dampingFactor;
        this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * this.dampingFactor;
        this.currentPosition.z += (this.targetPosition.z - this.currentPosition.z) * this.dampingFactor;
        
        // Apply position to camera
        this.camera.position.set(
            this.currentPosition.x,
            this.currentPosition.y,
            this.currentPosition.z
        );
        
        // Always look at the origin (where planet is)
        this.camera.lookAt(0, 0, 0);
    }
    
    /**
     * Transition camera to a specific planet
     * @param {string} planetName - Name of the planet
     * @returns {Promise}
     */
    transitionToPlanet(planetName) {
        return new Promise((resolve) => {
            if (!this.planetPositions[planetName]) {
                console.warn(`No camera position defined for ${planetName}`);
                resolve();
                return;
            }
            
            this.isTransitioning = true;
            const targetPos = this.planetPositions[planetName];
            
            // Use GSAP for smooth cinematic transition
            const duration = 2.5;
            
            gsap.to(this.targetPosition, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: duration,
                ease: 'power2.inOut',
                onUpdate: () => {
                    // Update orbit radius to match
                    this.orbitRadius = this.targetPosition.z;
                },
                onComplete: () => {
                    this.isTransitioning = false;
                    resolve();
                }
            });
            
            // Animate camera lookAt if specified
            if (targetPos.lookAt) {
                const lookAtTarget = { x: 0, y: 0, z: 0 };
                
                gsap.to(lookAtTarget, {
                    x: targetPos.lookAt.x,
                    y: targetPos.lookAt.y,
                    z: targetPos.lookAt.z,
                    duration: duration,
                    ease: 'power2.inOut'
                });
            }
        });
    }
    
    /**
     * Animate camera to specific position
     * @param {Object} position - Target position {x, y, z}
     * @param {number} duration - Animation duration in seconds
     * @returns {Promise}
     */
    animateTo(position, duration = 2.0) {
        return new Promise((resolve) => {
            this.isTransitioning = true;
            
            gsap.to(this.targetPosition, {
                x: position.x,
                y: position.y,
                z: position.z,
                duration: duration,
                ease: 'power2.inOut',
                onComplete: () => {
                    this.isTransitioning = false;
                    resolve();
                }
            });
        });
    }
    
    /**
     * Perform cinematic dolly zoom effect
     * @param {number} startZ - Starting z position
     * @param {number} endZ - Ending z position
     * @param {number} duration - Duration in seconds
     * @returns {Promise}
     */
    cinematicDollyZoom(startZ, endZ, duration = 3.0) {
        return new Promise((resolve) => {
            this.isTransitioning = true;
            
            const startFov = this.camera.fov;
            const endFov = startFov * (startZ / endZ);
            
            gsap.to(this.camera.position, {
                z: endZ,
                duration: duration,
                ease: 'power1.inOut'
            });
            
            gsap.to(this.camera, {
                fov: endFov,
                duration: duration,
                ease: 'power1.inOut',
                onUpdate: () => {
                    this.camera.updateProjectionMatrix();
                },
                onComplete: () => {
                    this.isTransitioning = false;
                    resolve();
                }
            });
        });
    }
    
    /**
     * Perform orbital camera movement around target
     * @param {number} radius - Orbit radius
     * @param {number} speed - Orbit speed
     * @param {number} duration - Duration in seconds
     * @returns {Promise}
     */
    cinematicOrbit(radius, speed, duration = 5.0) {
        return new Promise((resolve) => {
            this.isTransitioning = true;
            
            const startAngle = Math.atan2(
                this.camera.position.x,
                this.camera.position.z
            );
            
            const totalRotation = speed * duration;
            
            gsap.to({}, {
                duration: duration,
                ease: 'none',
                onUpdate: function() {
                    const progress = this.progress();
                    const angle = startAngle + (totalRotation * progress);
                    
                    this.camera.position.x = Math.sin(angle) * radius;
                    this.camera.position.z = Math.cos(angle) * radius;
                    this.camera.lookAt(0, 0, 0);
                }.bind(this),
                onComplete: () => {
                    this.isTransitioning = false;
                    resolve();
                }
            });
        });
    }
    
    /**
     * Shake camera for impact effects
     * @param {number} intensity - Shake intensity
     * @param {number} duration - Shake duration in seconds
     */
    shake(intensity = 0.5, duration = 0.3) {
        if (this.isTransitioning) return;
        
        const originalX = this.camera.position.x;
        const originalY = this.camera.position.y;
        const originalZ = this.camera.position.z;
        
        gsap.to(this.camera.position, {
            x: originalX + (Math.random() - 0.5) * intensity,
            y: originalY + (Math.random() - 0.5) * intensity,
            z: originalZ + (Math.random() - 0.5) * intensity,
            duration: duration * 0.1,
            repeat: 5,
            yoyo: true,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to(this.camera.position, {
                    x: originalX,
                    y: originalY,
                    z: originalZ,
                    duration: duration * 0.3,
                    ease: 'power2.out'
                });
            }
        });
    }
    
    /**
     * Enable/disable auto-rotate
     * @param {boolean} enabled
     */
    setAutoRotate(enabled) {
        this.autoRotate = enabled;
    }
    
    /**
     * Set camera field of view
     * @param {number} fov - Field of view in degrees
     * @param {number} duration - Transition duration
     */
    setFOV(fov, duration = 1.0) {
        gsap.to(this.camera, {
            fov: fov,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.camera.updateProjectionMatrix();
            }
        });
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    
    /**
     * Reset camera to default position
     */
    reset() {
        this.targetPosition = { x: 0, y: 0, z: 50 };
        this.orbitRadius = 50;
        this.orbitAngle = 0;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
    }
    
    /**
     * Cleanup and remove event listeners
     */
    dispose() {
        console.log('Disposing Camera System...');
        
        this.domElement.removeEventListener('mousemove', this.handleMouseMove);
        this.domElement.removeEventListener('wheel', this.handleMouseWheel);
        
        console.log('✓ Camera System disposed');
    }
}