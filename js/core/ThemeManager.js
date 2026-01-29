/**
 * ========================================
 * THEME MANAGER
 * ========================================
 * 
 * Manages visual themes for different celestial bodies,
 * coordinating colors, atmosphere, and UI styling.
 * 
 * @module ThemeManager
 */

/**
 * ThemeManager Class
 * Handles theme transitions and maintains visual consistency
 */
export class ThemeManager {
    constructor() {
        // Theme configurations
        this.themes = {
            earth: {
                name: 'Earth',
                primaryColor: '#64c8ff',
                secondaryColor: '#4488ff',
                backgroundColor: '#000510',
                fogColor: 0x000510,
                fogDensity: 0.00015,
                uiAccent: '#64c8ff',
                description: 'The Blue Planet - Our home in the vast cosmos',
                stats: {
                    distance: '149.6M km',
                    diameter: '12,742 km',
                    period: '365.25 days'
                }
            },
            mars: {
                name: 'Mars',
                primaryColor: '#ff6644',
                secondaryColor: '#cc4422',
                backgroundColor: '#0a0300',
                fogColor: 0x0a0300,
                fogDensity: 0.0002,
                uiAccent: '#ff6644',
                description: 'The Red Planet - A world of ancient mysteries',
                stats: {
                    distance: '227.9M km',
                    diameter: '6,779 km',
                    period: '687 days'
                }
            },
            jupiter: {
                name: 'Jupiter',
                primaryColor: '#ffb366',
                secondaryColor: '#dd8844',
                backgroundColor: '#0f0a00',
                fogColor: 0x0f0a00,
                fogDensity: 0.00012,
                uiAccent: '#ffb366',
                description: 'The Gas Giant - King of the Solar System',
                stats: {
                    distance: '778.5M km',
                    diameter: '139,820 km',
                    period: '11.86 years'
                }
            },
            blackhole: {
                name: 'Black Hole',
                primaryColor: '#9955ff',
                secondaryColor: '#7733cc',
                backgroundColor: '#050015',
                fogColor: 0x050015,
                fogDensity: 0.0001,
                uiAccent: '#9955ff',
                description: 'The Singularity - Where spacetime breaks',
                stats: {
                    distance: 'Unknown',
                    diameter: 'Event Horizon',
                    period: 'Timeless'
                }
            }
        };
        
        this.currentTheme = 'earth';
        this.isTransitioning = false;
    }
    
    /**
     * Initialize theme manager
     */
    init() {
        console.log('Initializing Theme Manager...');
        
        // Apply initial theme
        this.applyTheme('earth', false);
        
        console.log('✓ Theme Manager initialized');
    }
    
    /**
     * Switch to a new theme
     * @param {string} themeName - Name of theme to switch to
     */
    switchTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme ${themeName} not found`);
            return;
        }
        
        if (this.currentTheme === themeName) {
            return;
        }
        
        console.log(`Switching theme to ${themeName}...`);
        
        this.applyTheme(themeName, true);
        this.currentTheme = themeName;
        
        console.log(`✓ Theme switched to ${themeName}`);
    }
    
    /**
     * Apply theme to UI and scene
     * @param {string} themeName
     * @param {boolean} animated - Whether to animate the transition
     */
    applyTheme(themeName, animated = true) {
        const theme = this.themes[themeName];
        
        if (animated) {
            this.isTransitioning = true;
            
            // Animate theme transition
            this.animateThemeTransition(theme, () => {
                this.isTransitioning = false;
            });
        } else {
            // Apply immediately
            this.setThemeStyles(theme);
        }
        
        // Update info panel
        this.updateInfoPanel(theme);
        
        // Update document meta theme-color
        this.updateMetaThemeColor(theme.primaryColor);
    }
    
    /**
     * Animate theme transition
     * @param {Object} theme
     * @param {Function} onComplete
     */
    animateThemeTransition(theme, onComplete) {
        const duration = 1.5;
        
        // Get root element for CSS variable animations
        const root = document.documentElement;
        
        // Parse current colors
        const currentPrimary = this.parseColor(
            getComputedStyle(root).getPropertyValue('--theme-primary') || theme.primaryColor
        );
        const currentSecondary = this.parseColor(
            getComputedStyle(root).getPropertyValue('--theme-secondary') || theme.secondaryColor
        );
        
        // Parse target colors
        const targetPrimary = this.parseColor(theme.primaryColor);
        const targetSecondary = this.parseColor(theme.secondaryColor);
        
        // Animate color transitions
        gsap.to(currentPrimary, {
            r: targetPrimary.r,
            g: targetPrimary.g,
            b: targetPrimary.b,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                root.style.setProperty(
                    '--theme-primary',
                    this.rgbToHex(currentPrimary.r, currentPrimary.g, currentPrimary.b)
                );
            }
        });
        
        gsap.to(currentSecondary, {
            r: targetSecondary.r,
            g: targetSecondary.g,
            b: targetSecondary.b,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                root.style.setProperty(
                    '--theme-secondary',
                    this.rgbToHex(currentSecondary.r, currentSecondary.g, currentSecondary.b)
                );
            },
            onComplete: () => {
                this.setThemeStyles(theme);
                if (onComplete) onComplete();
            }
        });
    }
    
    /**
     * Set theme styles
     * @param {Object} theme
     */
    setThemeStyles(theme) {
        const root = document.documentElement;
        
        // Set CSS custom properties
        root.style.setProperty('--theme-primary', theme.primaryColor);
        root.style.setProperty('--theme-secondary', theme.secondaryColor);
        root.style.setProperty('--theme-bg', theme.backgroundColor);
        root.style.setProperty('--theme-accent', theme.uiAccent);
    }
    
    /**
     * Update info panel with theme data
     * @param {Object} theme
     */
    updateInfoPanel(theme) {
        const titleElement = document.getElementById('info-title');
        const descElement = document.getElementById('info-description');
        const distanceElement = document.getElementById('stat-distance');
        const diameterElement = document.getElementById('stat-diameter');
        const periodElement = document.getElementById('stat-period');
        
        if (titleElement) {
            gsap.to(titleElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    titleElement.textContent = theme.name;
                    gsap.to(titleElement, { opacity: 1, duration: 0.3 });
                }
            });
        }
        
        if (descElement) {
            gsap.to(descElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    descElement.textContent = theme.description;
                    gsap.to(descElement, { opacity: 1, duration: 0.3 });
                }
            });
        }
        
        if (distanceElement) {
            gsap.to(distanceElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    distanceElement.textContent = theme.stats.distance;
                    gsap.to(distanceElement, { opacity: 1, duration: 0.3 });
                }
            });
        }
        
        if (diameterElement) {
            gsap.to(diameterElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    diameterElement.textContent = theme.stats.diameter;
                    gsap.to(diameterElement, { opacity: 1, duration: 0.3 });
                }
            });
        }
        
        if (periodElement) {
            gsap.to(periodElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    periodElement.textContent = theme.stats.period;
                    gsap.to(periodElement, { opacity: 1, duration: 0.3 });
                }
            });
        }
    }
    
    /**
     * Update meta theme color for browser chrome
     * @param {string} color
     */
    updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = color;
    }
    
    /**
     * Parse hex color to RGB object
     * @param {string} hex - Hex color string
     * @returns {Object} RGB object
     */
    parseColor(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    /**
     * Convert RGB to hex
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {string} Hex color
     */
    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(n).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    /**
     * Get current theme
     * @returns {Object}
     */
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }
    
    /**
     * Get theme by name
     * @param {string} themeName
     * @returns {Object|null}
     */
    getTheme(themeName) {
        return this.themes[themeName] || null;
    }
    
    /**
     * Update method (called per frame if needed)
     */
    update() {
        // Placeholder for any per-frame theme animations
    }
    
    /**
     * Cleanup
     */
    dispose() {
        console.log('Disposing Theme Manager...');
        console.log('✓ Theme Manager disposed');
    }
}