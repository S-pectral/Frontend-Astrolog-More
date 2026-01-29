/**
 * ========================================
 * PERFORMANCE MONITOR
 * ========================================
 * 
 * Monitors application performance including FPS, memory usage,
 * and render times for optimization purposes.
 * 
 * @module PerformanceMonitor
 */

/**
 * PerformanceMonitor Class
 * Tracks and reports performance metrics
 */
export class PerformanceMonitor {
    constructor() {
        this.fps = 60;
        this.frameTime = 0;
        this.lastTime = performance.now();
        this.frames = 0;
        this.fpsUpdateInterval = 1000; // Update FPS every second
        this.lastFpsUpdate = 0;
        
        // Performance thresholds
        this.targetFps = 60;
        this.lowFpsThreshold = 30;
        
        // Stats display (optional)
        this.statsElement = null;
        this.showStats = false;
    }
    
    /**
     * Initialize performance monitor
     */
    init() {
        // Optional: Create stats display element
        if (this.showStats) {
            this.createStatsDisplay();
        }
    }
    
    /**
     * Create stats display element
     */
    createStatsDisplay() {
        this.statsElement = document.createElement('div');
        this.statsElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            border-radius: 4px;
        `;
        document.body.appendChild(this.statsElement);
    }
    
    /**
     * Begin frame measurement
     */
    begin() {
        this.lastTime = performance.now();
    }
    
    /**
     * End frame measurement
     */
    end() {
        this.frames++;
        
        const currentTime = performance.now();
        this.frameTime = currentTime - this.lastTime;
        
        // Update FPS
        if (currentTime >= this.lastFpsUpdate + this.fpsUpdateInterval) {
            this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastFpsUpdate));
            this.frames = 0;
            this.lastFpsUpdate = currentTime;
            
            // Update stats display
            if (this.showStats && this.statsElement) {
                this.updateStatsDisplay();
            }
            
            // Check for performance issues
            this.checkPerformance();
        }
    }
    
    /**
     * Update stats display
     */
    updateStatsDisplay() {
        if (!this.statsElement) return;
        
        const memory = performance.memory ? 
            `${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB` : 
            'N/A';
        
        this.statsElement.innerHTML = `
            FPS: ${this.fps}<br>
            Frame: ${this.frameTime.toFixed(2)}ms<br>
            Memory: ${memory}
        `;
        
        // Color code based on performance
        if (this.fps < this.lowFpsThreshold) {
            this.statsElement.style.color = '#ff0000';
        } else if (this.fps < this.targetFps) {
            this.statsElement.style.color = '#ffaa00';
        } else {
            this.statsElement.style.color = '#00ff00';
        }
    }
    
    /**
     * Check for performance issues
     */
    checkPerformance() {
        if (this.fps < this.lowFpsThreshold) {
            console.warn(`Low FPS detected: ${this.fps}`);
            // Could trigger quality reduction here
        }
    }
    
    /**
     * Get current FPS
     * @returns {number}
     */
    getFPS() {
        return this.fps;
    }
    
    /**
     * Get frame time
     * @returns {number}
     */
    getFrameTime() {
        return this.frameTime;
    }
    
    /**
     * Enable/disable stats display
     * @param {boolean} enabled
     */
    setStatsDisplay(enabled) {
        this.showStats = enabled;
        
        if (enabled && !this.statsElement) {
            this.createStatsDisplay();
        } else if (!enabled && this.statsElement) {
            this.statsElement.remove();
            this.statsElement = null;
        }
    }
}