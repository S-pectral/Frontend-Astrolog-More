/**
 * ========================================
 * NAVIGATION CONTROLLER
 * ========================================
 * 
 * Manages navigation interactions and planet switching functionality.
 * Handles navbar events and coordinates with other systems.
 * 
 * @module NavigationController
 */

/**
 * NavigationController Class
 * Controls navigation UI and planet switching
 */
export class NavigationController {
    constructor(onPlanetSwitch) {
        this.onPlanetSwitch = onPlanetSwitch;
        
        // Navigation elements
        this.nav = null;
        this.navLinks = [];
        this.currentActive = null;
        
        // State
        this.isTransitioning = false;
    }
    
    /**
     * Initialize navigation controller
     */
    init() {
        console.log('Initializing Navigation Controller...');
        
        // Get navigation element
        this.nav = document.getElementById('main-nav');
        
        if (!this.nav) {
            console.error('Navigation element not found');
            return;
        }
        
        // Get all navigation links
        this.navLinks = Array.from(this.nav.querySelectorAll('.nav-link'));
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Set initial active state
        this.currentActive = this.navLinks.find(link => link.classList.contains('active'));
        
        console.log('✓ Navigation Controller initialized');
    }
    
    /**
     * Setup event listeners for navigation
     */
    setupEventListeners() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.handleNavClick(link);
            });
            
            // Add hover sound effect (optional)
            link.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });
    }
    
    /**
     * Handle navigation link click
     * @param {HTMLElement} link
     */
    async handleNavClick(link) {
        if (this.isTransitioning) {
            console.log('Navigation transition in progress...');
            return;
        }
        
        // Don't switch if already active
        if (link === this.currentActive) {
            return;
        }
        
        const planetName = link.dataset.planet;
        
        if (!planetName) {
            console.warn('No planet data on link');
            return;
        }
        
        console.log(`Navigating to ${planetName}...`);
        
        this.isTransitioning = true;
        
        // Update active state
        this.setActiveLink(link);
        
        // Trigger planet switch callback
        if (this.onPlanetSwitch) {
            try {
                await this.onPlanetSwitch(planetName);
            } catch (error) {
                console.error('Error switching planet:', error);
            }
        }
        
        this.isTransitioning = false;
        
        console.log(`✓ Navigated to ${planetName}`);
    }
    
    /**
     * Set active navigation link
     * @param {HTMLElement} link
     */
    setActiveLink(link) {
        // Remove active class from current
        if (this.currentActive) {
            this.currentActive.classList.remove('active');
            this.animateLinkOut(this.currentActive);
        }
        
        // Add active class to new
        link.classList.add('active');
        this.animateLinkIn(link);
        
        // Update current
        this.currentActive = link;
    }
    
    /**
     * Animate link activation
     * @param {HTMLElement} link
     */
    animateLinkIn(link) {
        gsap.fromTo(link,
            {
                scale: 1,
                boxShadow: '0 4px 20px rgba(100, 200, 255, 0)'
            },
            {
                scale: 1.05,
                boxShadow: '0 4px 20px rgba(100, 200, 255, 0.3)',
                duration: 0.3,
                ease: 'back.out(1.7)'
            }
        );
    }
    
    /**
     * Animate link deactivation
     * @param {HTMLElement} link
     */
    animateLinkOut(link) {
        gsap.to(link, {
            scale: 1,
            boxShadow: '0 4px 20px rgba(100, 200, 255, 0)',
            duration: 0.3,
            ease: 'power2.out'
        });
    }
    
    /**
     * Play hover sound effect (optional)
     */
    playHoverSound() {
        // Optional: Add subtle sound effect
        // const audio = new Audio('assets/sounds/hover.mp3');
        // audio.volume = 0.1;
        // audio.play().catch(() => {});
    }
    
    /**
     * Show navigation
     */
    show() {
        if (this.nav) {
            this.nav.classList.remove('hidden');
            this.nav.classList.add('visible');
            
            // Animate in
            gsap.fromTo(this.nav,
                {
                    y: -100,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out'
                }
            );
        }
    }
    
    /**
     * Hide navigation
     */
    hide() {
        if (this.nav) {
            gsap.to(this.nav, {
                y: -100,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    this.nav.classList.remove('visible');
                    this.nav.classList.add('hidden');
                }
            });
        }
    }
    
    /**
     * Set navigation state
     * @param {string} planetName
     */
    setActivePlanet(planetName) {
        const link = this.navLinks.find(l => l.dataset.planet === planetName);
        if (link && link !== this.currentActive) {
            this.setActiveLink(link);
        }
    }
    
    /**
     * Enable/disable navigation
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        if (enabled) {
            this.navLinks.forEach(link => {
                link.style.pointerEvents = 'auto';
                link.style.opacity = '1';
            });
        } else {
            this.navLinks.forEach(link => {
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.5';
            });
        }
    }
    
    /**
     * Cleanup
     */
    dispose() {
        console.log('Disposing Navigation Controller...');
        
        // Remove event listeners
        this.navLinks.forEach(link => {
            const clone = link.cloneNode(true);
            link.parentNode?.replaceChild(clone, link);
        });
        
        console.log('✓ Navigation Controller disposed');
    }
}