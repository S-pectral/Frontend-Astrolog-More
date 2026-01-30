
export class UIManager {
    constructor(onPlanetChange, onHover, onClick) {
        this.onPlanetChange = onPlanetChange;
        this.onHover = onHover;
        this.onClick = onClick;
        this.navLinks = document.querySelectorAll('.nav-link');
        this.initNavigation();
    }

    initNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (this.onHover) this.onHover();
            });

            link.addEventListener('click', (e) => {
                const planetName = link.dataset.planet;

                // If no planet data, treat as a normal link (allow default behavior)
                if (!planetName) return;

                e.preventDefault();
                if (this.onClick) this.onClick();

                // Active link handling should be done by the caller or here if we track current planet
                // But typically UI updates active state immediately
                this.setActiveLink(planetName);

                if (this.onPlanetChange) {
                    this.onPlanetChange(planetName);
                }
            });
        });
    }

    setActiveLink(planetName) {
        this.navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-planet="${planetName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updateInfoPanel(info) {
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const distance = document.getElementById('stat-distance');
        const diameter = document.getElementById('stat-diameter');
        const period = document.getElementById('stat-period');

        const elements = [
            { el: title, val: info.title, delay: 0 },
            { el: description, val: info.description, delay: 0.1 },
            { el: distance, val: info.distance, delay: 0.2 },
            { el: diameter, val: info.diameter, delay: 0.3 },
            { el: period, val: info.period, delay: 0.4 }
        ];

        elements.forEach(({ el, val, delay }) => {
            if (el) {
                gsap.fromTo(el,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, delay, onStart: () => el.textContent = val }
                );
            }
        });
    }

    showUI() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainNav = document.getElementById('main-nav');
        const infoPanel = document.getElementById('info-panel');
        const hud = document.getElementById('flight-hud');

        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.style.display = 'none', 800);
        }
        if (mainNav) {
            mainNav.classList.remove('hidden');
            mainNav.classList.add('visible');
        }
        if (infoPanel) {
            infoPanel.classList.remove('hidden');
            infoPanel.classList.add('visible');
        }
        // Hide HUD in Orbit Mode
        if (hud) hud.classList.add('hidden');
    }

    hideUI() {
        const mainNav = document.getElementById('main-nav');
        const infoPanel = document.getElementById('info-panel');
        const hud = document.getElementById('flight-hud');

        if (mainNav) mainNav.classList.add('hidden');
        if (infoPanel) infoPanel.classList.add('hidden');

        // Show HUD in Flight Mode
        if (hud) hud.classList.remove('hidden');
    }

    updateHUD(speed, targetName, distance) {
        const speedEl = document.getElementById('hud-speed');
        const targetEl = document.getElementById('hud-target');
        const distEl = document.getElementById('hud-dist');
        const actionEl = document.getElementById('hud-action');

        if (speedEl) speedEl.textContent = speed.toFixed(1) + ' km/s';
        if (targetEl) targetEl.textContent = targetName ? targetName.toUpperCase() : 'DEEP SPACE';

        else if (distance > 1000) distEl.textContent = (distance / 1000).toFixed(1) + 'k km';
        else distEl.textContent = Math.floor(distance) + ' km';
    }
    updateLandingPrompt(show, text = "Press [L] to Land") {
        const actionEl = document.getElementById('hud-action');
        if (actionEl) {
            if (show) {
                actionEl.textContent = text;
                actionEl.classList.remove('hidden');
            } else {
                actionEl.classList.add('hidden');
                // Reset text if needed, or leave it
            }
        }
    }

    toggleInteractionPrompt(show) {
        const actionEl = document.getElementById('hud-action');
        if (actionEl) {
            if (show) actionEl.classList.remove('hidden');
            else actionEl.classList.add('hidden');
        }
    }

    showInfoPanel() {
        const infoPanel = document.getElementById('info-panel');
        if (infoPanel) {
            infoPanel.classList.remove('hidden');
            infoPanel.classList.add('visible');
        }
    }

    updateCompass(camera, systemPlanets) {
        const compassContainer = document.querySelector('.compass-markers');
        if (!compassContainer) return;

        // Clear existing markers (Simple but inefficient for many objects, acceptable for < 20)
        // Optimization: Object pooling or just updating positions of existing keys
        // Let's use a simpler approach: Re-create only if map doesn't exist, else update
        if (!this.markerMap) this.markerMap = new Map();

        const fov = 120; // Compass Field of View in degrees
        const containerWidth = compassContainer.clientWidth;

        // Helper to get heading angle
        const getSignedAngle = (targetPos) => {
            const camPos = camera.position;
            const camDir = new THREE.Vector3();
            camera.getWorldDirection(camDir);
            camDir.y = 0; // Project to horizontal plane
            camDir.normalize();

            const targetDir = new THREE.Vector3().subVectors(targetPos, camPos);
            targetDir.y = 0;
            targetDir.normalize();

            // Calculate angle
            let angle = Math.atan2(targetDir.x, targetDir.z) - Math.atan2(camDir.x, camDir.z);

            // Normalize to -PI to PI
            if (angle > Math.PI) angle -= Math.PI * 2;
            if (angle < -Math.PI) angle += Math.PI * 2;

            return angle * (180 / Math.PI); // Degrees
        };

        const activeIds = new Set();
        const allObjects = [];

        // Collect all celestial bodies
        systemPlanets.forEach(p => {
            allObjects.push(p);
            if (p.children) p.children.forEach(c => {
                if (c.userData && c.userData.isMoon) allObjects.push(c);
            });
        });

        const tempPos = new THREE.Vector3();
        allObjects.forEach(obj => {
            if (!obj.userData || !obj.userData.name) return;
            const name = obj.userData.name;
            obj.getWorldPosition(tempPos);
            const angle = getSignedAngle(tempPos);

            // Only show if within compass FOV/2 + margin
            if (Math.abs(angle) < (fov / 2)) {
                activeIds.add(name);

                // Map angle to pixel position
                // 0 deg = 50%, -fov/2 = 0%, +fov/2 = 100%
                const pct = 50 + (angle / fov) * 100; // Actually, negative angle is usually LEFT.
                // If angle is negative (left), pct should be < 50.
                // Let's flip direction if needed. standard 3D: positive X is Right.
                // atan2: typically CCW.
                // Let's try: angle neg -> left. 50 + (-30 / 120)*100 = 25%. Correct.

                let marker = this.markerMap.get(name);
                if (!marker) {
                    marker = document.createElement('div');
                    marker.className = 'compass-marker';

                    let icon = '⚪'; // Default
                    if (name.toLowerCase() === 'sun') icon = '☀️';
                    else if (name.toLowerCase() === 'earth') icon = '🌍';
                    else if (name.toLowerCase() === 'moon') icon = '🌑';
                    else if (name.toLowerCase() === 'mars') icon = '🔴';
                    else if (name.toLowerCase() === 'iss') icon = '🛰️';
                    else if (name.toLowerCase() === 'hubble') icon = '🔭';
                    else if (name.toLowerCase() === 'voyager 1') icon = '🛰️';
                    else if (name.toLowerCase() === 'meteor sea') icon = '☄️';

                    marker.innerHTML = `<span class="marker-icon">${icon}</span><span class="marker-label">${name}</span>`;
                    compassContainer.appendChild(marker);
                    this.markerMap.set(name, marker);
                }

                // Flip X because screen space X is opposite to rotation usually? Test it.
                // Usually Left on screen is positive angle in some coord systems. 
                // Let's stick to 50 - (angle...).
                // Actually: If I look North, East is Right. Angle diff is +90.
                // So + angle should be Right (>50%).
                // My formula: 50 + (angle/fov)*100. (+90 -> 125% -> Out of screen Right). Correct.
                marker.style.left = `${50 - (angle / fov) * 100}%`;
                marker.style.display = 'flex';
            } else {
                const marker = this.markerMap.get(name);
                if (marker) marker.style.display = 'none';
            }
        });

        // Hide markers that are no longer tracked? (Or just hide via display none above)
    }
}

