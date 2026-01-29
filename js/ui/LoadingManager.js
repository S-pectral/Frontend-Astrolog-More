/**
 * ========================================
 * LOADING MANAGER
 * ========================================
 * 
 * Manages loading screen, progress updates, and smooth transitions.
 * 
 * @module LoadingManager
 */

/**
 * LoadingManager Class
 * Controls the loading screen and progress indication
 */
export class LoadingManager {
    constructor() {
        this.loadingScreen = null;
        this.progressBar = null;
        this.statusText = null;
        this.currentProgress = 0;
    }
    
    /**
     * Initialize loading manager
     */
    constructor() {
        this.loadingScreen = null;
        this.progressBar = null;
        this.statusText = null;
        this.currentProgress = 0;
        
        // Auto-initialize
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.querySelector('.progress-bar');
        this.statusText = document.querySelector('.loading-status');
    }
    
    /**
     * Update loading progress
     * @param {number} progress - Progress percentage (0-100)
     */
    updateProgress(progress) {
        this.currentProgress = Math.min(100, Math.max(0, progress));
        
        if (this.progressBar) {
            gsap.to(this.progressBar, {
                width: `${this.currentProgress}%`,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }
    
    /**
     * Update loading status text
     * @param {string} status
     */
    updateStatus(status) {
        if (this.statusText) {
            gsap.to(this.statusText, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    this.statusText.textContent = status;
                    gsap.to(this.statusText, {
                        opacity: 1,
                        duration: 0.2
                    });
                }
            });
        }
    }
    
    /**
     * Hide loading screen
     */
    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 800);
        }
    }
    
    /**
     * Show error message
     * @param {string} message
     */
    showError(message) {
        if (this.statusText) {
            this.statusText.textContent = message;
            this.statusText.style.color = '#ff6644';
        }
    }
}