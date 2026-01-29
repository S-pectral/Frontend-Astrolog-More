/**
 * ========================================
 * COSMIC EXPLORER - MAIN ENTRY POINT
 * ========================================
 * 
 * Production-level astronomy website with cinematic experience.
 * This module orchestrates all systems and manages the application lifecycle.
 * 
 * @author Senior Frontend Developer
 * @version 1.0.0
 */

import { SceneManager } from './core/SceneManager.js';
import { CameraSystem } from './core/CameraSystem.js';
import { LightingSystem } from './core/LightingSystem.js';
import { ParticleSystem } from './effects/ParticleSystem.js';
import { MeteorSystem } from './effects/MeteorSystem.js';
import { CinematicSequence } from './cinematics/CinematicSequence.js';
import { CustomCursor } from './ui/CustomCursor.js';
import { NavigationController } from './ui/NavigationController.js';
import { PlanetFactory } from './planets/PlanetFactory.js';
import { ThemeManager } from './core/ThemeManager.js';
import { LoadingManager } from './ui/LoadingManager.js';
import { PerformanceMonitor } from './utils/PerformanceMonitor.js';

/**
 * Main Application Class
 * Manages the entire cosmic experience lifecycle
 */
class CosmicExplorer {
    constructor() {
        // Core systems
        this.sceneManager = null;
        this.cameraSystem = null;
        this.lightingSystem = null;
        this.particleSystem = null;
        this.meteorSystem = null;
        this.cinematicSequence = null;
        
        // UI systems
        this.customCursor = null;
        this.navigationController = null;
        this.loadingManager = null;
        
        // Utilities
        this.themeManager = null;
        this.performanceMonitor = null;
        this.planetFactory = null;
        
        // State
        this.currentPlanet = 'earth';
        this.isInitialized = false;
        this.isAnimating = false;
        this.animationId = null;
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('%c🌌 Initializing Cosmic Explorer...', 'color: #64c8ff; font-size: 16px; font-weight: bold;');
            
            // Initialize loading manager first
            this.loadingManager = new LoadingManager();
            
            // Small delay to ensure DOM is ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.loadingManager.updateStatus('Initializing core systems...');
            
            // Initialize custom cursor immediately for better UX
            this.customCursor = new CustomCursor();
            this.customCursor.init();
            
            // Initialize performance monitor
            this.performanceMonitor = new PerformanceMonitor();
            
            // Initialize core Three.js systems
            await this.initializeCoreSystems();
            this.loadingManager.updateProgress(20);
            
            // Initialize visual effects systems
            await this.initializeEffectSystems();
            this.loadingManager.updateProgress(40);
            
            // Initialize UI systems
            await this.initializeUISystems();
            this.loadingManager.updateProgress(60);
            
            // Initialize planet factory and create initial planet
            await this.initializePlanets();
            this.loadingManager.updateProgress(80);
            
            // Setup event listeners
            this.setupEventListeners();
            this.loadingManager.updateProgress(90);
            
            // Play opening cinematic
            await this.playCinematic();
            this.loadingManager.updateProgress(100);
            
            // Start animation loop
            this.startAnimationLoop();
            
            // Hide loading screen
            setTimeout(() => {
                this.loadingManager.hide();
                this.showUI();
            }, 1000);
            
            this.isInitialized = true;
            console.log('%c✨ Cosmic Explorer initialized successfully!', 'color: #64c8ff; font-size: 14px;');
            
        } catch (error) {
            console.error('Failed to initialize Cosmic Explorer:', error);
            this.loadingManager.showError('Failed to initialize. Please refresh the page.');
        }
    }
    
    /**
     * Initialize core Three.js systems
     */
    async initializeCoreSystems() {
        this.loadingManager.updateStatus('Setting up 3D environment...');
        
        // Initialize scene manager
        this.sceneManager = new SceneManager();
        await this.sceneManager.init();
        
        // Initialize camera system with cinematic capabilities
        this.cameraSystem = new CameraSystem(
            this.sceneManager.camera,
            this.sceneManager.renderer.domElement
        );
        this.cameraSystem.init();
        
        // Initialize lighting system
        this.lightingSystem = new LightingSystem(this.sceneManager.scene);
        this.lightingSystem.init();
        
        console.log('✓ Core systems initialized');
    }
    
    /**
     * Initialize visual effects systems
     */
    async initializeEffectSystems() {
        this.loadingManager.updateStatus('Creating particle effects...');
        
        // Initialize particle system for space effects
        this.particleSystem = new ParticleSystem(this.sceneManager.scene);
        this.particleSystem.init();
        
        // Initialize meteor impact system
        this.meteorSystem = new MeteorSystem(
            this.sceneManager.scene,
            this.particleSystem
        );
        this.meteorSystem.init();
        
        console.log('✓ Effect systems initialized');
    }
    
    /**
     * Initialize UI systems
     */
    async initializeUISystems() {
        this.loadingManager.updateStatus('Preparing user interface...');
        
        // Initialize theme manager
        this.themeManager = new ThemeManager();
        this.themeManager.init();
        
        // Initialize navigation controller
        this.navigationController = new NavigationController(
            this.switchPlanet.bind(this)
        );
        this.navigationController.init();
        
        console.log('✓ UI systems initialized');
    }
    
    /**
     * Initialize planets
     */
    async initializePlanets() {
        this.loadingManager.updateStatus('Generating celestial bodies...');
        
        // Initialize planet factory
        this.planetFactory = new PlanetFactory(
            this.sceneManager.scene,
            this.lightingSystem
        );
        
        // Create initial Earth
        await this.planetFactory.createPlanet('earth');
        
        console.log('✓ Planets initialized');
    }
    
    /**
     * Play opening cinematic sequence
     */
    async playCinematic() {
        this.loadingManager.updateStatus('Preparing cinematic sequence...');
        
        // Initialize and play cinematic
        this.cinematicSequence = new CinematicSequence(
            this.sceneManager.scene,
            this.cameraSystem,
            this.particleSystem,
            this.planetFactory
        );
        
        await this.cinematicSequence.play();
        
        console.log('✓ Cinematic sequence completed');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.handleResize, false);
        
        // Visibility change (pause when tab is hidden)
        document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
        
        // Prevent context menu
        window.addEventListener('contextmenu', (e) => e.preventDefault());
        
        console.log('✓ Event listeners setup');
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.isInitialized) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update camera
        this.sceneManager.camera.aspect = width / height;
        this.sceneManager.camera.updateProjectionMatrix();
        
        // Update renderer
        this.sceneManager.renderer.setSize(width, height);
        
        // Update camera system
        if (this.cameraSystem) {
            this.cameraSystem.handleResize();
        }
    }
    
    /**
     * Handle visibility change (pause/resume)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimationLoop();
        } else {
            this.resumeAnimationLoop();
        }
    }
    
    /**
     * Start animation loop
     */
    startAnimationLoop() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.animate();
    }
    
    /**
     * Pause animation loop
     */
    pauseAnimationLoop() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Resume animation loop
     */
    resumeAnimationLoop() {
        if (!this.isAnimating) {
            this.startAnimationLoop();
        }
    }
    
    /**
     * Main animation loop
     */
    animate() {
        if (!this.isAnimating) return;
        
        this.animationId = requestAnimationFrame(this.animate);
        
        // Update performance monitor
        this.performanceMonitor.begin();
        
        // Update camera system
        if (this.cameraSystem) {
            this.cameraSystem.update();
        }
        
        // Update particle systems
        if (this.particleSystem) {
            this.particleSystem.update();
        }
        
        // Update meteor system
        if (this.meteorSystem) {
            this.meteorSystem.update();
        }
        
        // Update current planet
        if (this.planetFactory) {
            this.planetFactory.updateCurrentPlanet();
        }
        
        // Update theme animations
        if (this.themeManager) {
            this.themeManager.update();
        }
        
        // Render scene
        this.sceneManager.render();
        
        // Update performance monitor
        this.performanceMonitor.end();
    }
    
    /**
     * Switch to a different planet
     * @param {string} planetName - Name of the planet to switch to
     */
    async switchPlanet(planetName) {
        if (planetName === this.currentPlanet) return;
        
        console.log(`Switching to ${planetName}...`);
        
        try {
            // Animate camera transition
            await this.cameraSystem.transitionToPlanet(planetName);
            
            // Fade out current planet
            await this.planetFactory.fadeOutCurrent();
            
            // Create and fade in new planet
            await this.planetFactory.createPlanet(planetName);
            await this.planetFactory.fadeInCurrent();
            
            // Update theme
            this.themeManager.switchTheme(planetName);
            
            // Update meteor system for new planet
            this.meteorSystem.updateForPlanet(planetName);
            
            // Update current planet state
            this.currentPlanet = planetName;
            
            console.log(`✓ Switched to ${planetName}`);
            
        } catch (error) {
            console.error(`Failed to switch to ${planetName}:`, error);
        }
    }
    
    /**
     * Show UI elements after loading
     */
    showUI() {
        const nav = document.getElementById('main-nav');
        const infoPanel = document.getElementById('info-panel');
        
        if (nav) {
            nav.classList.remove('hidden');
            nav.classList.add('visible');
        }
        
        if (infoPanel) {
            infoPanel.classList.remove('hidden');
            infoPanel.classList.add('visible');
        }
    }
    
    /**
     * Cleanup and dispose resources
     */
    dispose() {
        console.log('Disposing Cosmic Explorer...');
        
        // Stop animation loop
        this.pauseAnimationLoop();
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Dispose systems
        if (this.sceneManager) this.sceneManager.dispose();
        if (this.particleSystem) this.particleSystem.dispose();
        if (this.meteorSystem) this.meteorSystem.dispose();
        if (this.planetFactory) this.planetFactory.dispose();
        if (this.customCursor) this.customCursor.dispose();
        
        console.log('✓ Cosmic Explorer disposed');
    }
}

// ========================================
// APPLICATION INITIALIZATION
// ========================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

/**
 * Initialize the application
 */
function initializeApp() {
    // Create and initialize the application
    const app = new CosmicExplorer();
    app.init();
    
    // Make app globally accessible for debugging
    if (typeof window !== 'undefined') {
        window.cosmicExplorer = app;
    }
}

// Export for module usage
export { CosmicExplorer };