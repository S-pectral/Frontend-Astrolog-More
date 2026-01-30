
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
    }
}
