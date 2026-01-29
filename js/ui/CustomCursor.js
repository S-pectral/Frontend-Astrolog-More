/**
 * ========================================
 * CUSTOM CURSOR SYSTEM
 * ========================================
 * 
 * Creates and manages an animated custom cursor with particle trails
 * that completely replaces the default browser cursor.
 * 
 * @module CustomCursor
 */

/**
 * CustomCursor Class
 * Manages the custom cursor appearance and behavior
 */
export class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorCore = null;
        this.cursorGlow = null;
        this.trailContainer = null;
        
        // Cursor position
        this.currentPosition = { x: 0, y: 0 };
        this.targetPosition = { x: 0, y: 0 };
        
        // Cursor state
        this.isHovering = false;
        this.isClicking = false;
        
        // Trail particles
        this.trails = [];
        this.maxTrails = 15;
        this.trailSpawnInterval = 50; // ms
        this.lastTrailTime = 0;
        
        // Smooth movement
        this.smoothing = 0.15;
        
        // Animation frame ID
        this.animationId = null;
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.update = this.update.bind(this);
    }
    
    /**
     * Initialize custom cursor
     */
    init() {
        console.log('Initializing Custom Cursor...');
        
        // Get cursor elements
        this.cursor = document.getElementById('custom-cursor');
        this.cursorCore = this.cursor?.querySelector('.cursor-core');
        this.cursorGlow = this.cursor?.querySelector('.cursor-glow');
        this.trailContainer = document.getElementById('cursor-trail-container');
        
        if (!this.cursor || !this.cursorCore || !this.cursorGlow) {
            console.error('Cursor elements not found');
            return;
        }
        
        // Add sparkles to cursor core
        this.addSparkles();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.startAnimation();
        
        // Hide default cursor completely
        this.hideDefaultCursor();
        
        console.log('✓ Custom Cursor initialized');
    }
    
    /**
     * Add sparkle elements to cursor
     */
    addSparkles() {
        for (let i = 0; i < 4; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            this.cursorCore.appendChild(sparkle);
        }
    }
    
    /**
     * Completely hide default cursor
     */
    hideDefaultCursor() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                cursor: none !important;
            }
            html, body, a, button, input, textarea, select, canvas {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', this.handleMouseMove, false);
        
        // Mouse clicks
        document.addEventListener('mousedown', this.handleMouseDown, false);
        document.addEventListener('mouseup', this.handleMouseUp, false);
        
        // Hover detection for interactive elements
        this.setupHoverDetection();
    }
    
    /**
     * Setup hover detection for interactive elements
     */
    setupHoverDetection() {
        const interactiveElements = document.querySelectorAll('a, button, .nav-link, input, textarea');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', this.handleMouseEnter, false);
            element.addEventListener('mouseleave', this.handleMouseLeave, false);
        });
        
        // Use MutationObserver to detect new interactive elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches('a, button, .nav-link, input, textarea')) {
                            node.addEventListener('mouseenter', this.handleMouseEnter, false);
                            node.addEventListener('mouseleave', this.handleMouseLeave, false);
                        }
                        
                        // Check children
                        const children = node.querySelectorAll('a, button, .nav-link, input, textarea');
                        children.forEach(child => {
                            child.addEventListener('mouseenter', this.handleMouseEnter, false);
                            child.addEventListener('mouseleave', this.handleMouseLeave, false);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * Handle mouse movement
     * @param {MouseEvent} event
     */
    handleMouseMove(event) {
        this.targetPosition.x = event.clientX;
        this.targetPosition.y = event.clientY;
        
        // Spawn trail particles
        const now = Date.now();
        if (now - this.lastTrailTime > this.trailSpawnInterval) {
            this.spawnTrail();
            this.lastTrailTime = now;
        }
    }
    
    /**
     * Handle mouse down
     */
    handleMouseDown() {
        this.isClicking = true;
        this.cursor?.classList.add('cursor-click');
    }
    
    /**
     * Handle mouse up
     */
    handleMouseUp() {
        this.isClicking = false;
        this.cursor?.classList.remove('cursor-click');
    }
    
    /**
     * Handle mouse enter on interactive elements
     */
    handleMouseEnter() {
        this.isHovering = true;
        this.cursor?.classList.add('cursor-hover');
    }
    
    /**
     * Handle mouse leave from interactive elements
     */
    handleMouseLeave() {
        this.isHovering = false;
        this.cursor?.classList.remove('cursor-hover');
    }
    
    /**
     * Spawn a trail particle
     */
    spawnTrail() {
        if (!this.trailContainer) return;
        
        // Remove old trails
        if (this.trails.length >= this.maxTrails) {
            const oldTrail = this.trails.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
        
        // Create new trail
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${this.currentPosition.x}px`;
        trail.style.top = `${this.currentPosition.y}px`;
        
        this.trailContainer.appendChild(trail);
        this.trails.push(trail);
        
        // Remove trail after animation
        setTimeout(() => {
            if (trail && trail.parentNode) {
                trail.parentNode.removeChild(trail);
                const index = this.trails.indexOf(trail);
                if (index > -1) {
                    this.trails.splice(index, 1);
                }
            }
        }, 800);
    }
    
    /**
     * Start animation loop
     */
    startAnimation() {
        this.update();
    }
    
    /**
     * Update cursor position (animation loop)
     */
    update() {
        this.animationId = requestAnimationFrame(this.update);
        
        // Smooth cursor movement using lerp
        this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * this.smoothing;
        this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * this.smoothing;
        
        // Update cursor position
        if (this.cursor) {
            this.cursor.style.left = `${this.currentPosition.x}px`;
            this.cursor.style.top = `${this.currentPosition.y}px`;
        }
    }
    
    /**
     * Set cursor visibility
     * @param {boolean} visible
     */
    setVisible(visible) {
        if (this.cursor) {
            this.cursor.style.opacity = visible ? '1' : '0';
        }
    }
    
    /**
     * Trigger cursor pulse animation
     */
    pulse() {
        if (!this.cursorCore) return;
        
        this.cursorCore.style.animation = 'none';
        setTimeout(() => {
            this.cursorCore.style.animation = '';
        }, 10);
    }
    
    /**
     * Change cursor color
     * @param {string} color - CSS color value
     */
    setColor(color) {
        if (this.cursorCore) {
            this.cursorCore.style.background = `radial-gradient(circle, #ffffff 0%, ${color} 50%, transparent 70%)`;
        }
    }
    
    /**
     * Cleanup and dispose
     */
    dispose() {
        console.log('Disposing Custom Cursor...');
        
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mouseup', this.handleMouseUp);
        
        // Clear trails
        this.trails.forEach(trail => {
            if (trail && trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        });
        this.trails = [];
        
        console.log('✓ Custom Cursor disposed');
    }
}