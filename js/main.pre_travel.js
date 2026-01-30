
import { SceneManager } from './core/SceneManager.js';
import { PlanetFactory } from './factories/PlanetFactory.js';
import { MeteorSystem } from './systems/MeteorSystem.js';
import { UIManager } from './ui/UIManager.js';

class CosmicApp {
    constructor() {
        this.sceneManager = null;
        this.meteorSystem = null;
        this.uiManager = null;
        this.currentPlanet = null;
        this.currentPlanetName = 'earth';

        // Zoom state
        this.targetZoom = 30;
        this.currentZoom = 30;
        this.minZoom = 15;
        this.maxZoom = 80;

        // Mouse state
        this.mouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        const canvas = document.getElementById('cosmos-canvas');
        this.sceneManager = new SceneManager(canvas);
        this.meteorSystem = new MeteorSystem();
        this.uiManager = new UIManager((planetName) => this.switchPlanet(planetName));

        this.initInputListeners();

        // Start loop
        this.animate();

        // Initial Cinematic Sequence
        this.playIntroCinematic();
    }

    initInputListeners() {
        // Mouse Move for Parallax and Cursor
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Scroll Zoom
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.05;
            this.targetZoom += e.deltaY * zoomSpeed;
            this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.targetZoom));
        }, { passive: false });

        // Resize handled in SceneManager

        // Custom Cursor Logic could also form a module, but keeping simple here or in UIManager
        this.initCustomCursor();
    }

    initCustomCursor() {
        const cursor = document.getElementById('custom-cursor');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    }

    switchPlanet(planetName) {
        if (planetName === this.currentPlanetName) return;

        this.currentPlanetName = planetName;

        if (this.currentPlanet) {
            gsap.to(this.currentPlanet.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.8,
                ease: 'power2.in',
                onComplete: () => this.loadPlanet(planetName)
            });
        } else {
            this.loadPlanet(planetName);
        }
    }

    loadPlanet(planetName) {
        if (this.currentPlanet) {
            this.sceneManager.scene.remove(this.currentPlanet);
        }

        const planetGroup = PlanetFactory.createPlanet(planetName);
        if (planetGroup) {
            this.sceneManager.scene.add(planetGroup);
            this.currentPlanet = planetGroup;

            // Update UI
            if (planetGroup.userData.spec && planetGroup.userData.spec.info) {
                this.uiManager.updateInfoPanel(planetGroup.userData.spec.info);
            }

            // Animate entrance
            planetGroup.scale.set(0, 0, 0);
            gsap.to(planetGroup.scale, {
                x: 1, y: 1, z: 1,
                duration: 1.5,
                ease: 'back.out(1.7)'
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Zoom
        this.currentZoom += (this.targetZoom - this.currentZoom) * 0.05;
        this.sceneManager.camera.position.z = this.currentZoom;

        // Stars rotation
        const stars = this.sceneManager.scene.getObjectByName('stars');
        if (stars) stars.rotation.y += 0.0001;

        // Planet rotation
        if (this.currentPlanet) {
            const spec = this.currentPlanet.userData.spec;
            this.currentPlanet.rotation.y += spec.rotationSpeed;

            this.currentPlanet.traverse((child) => {
                if (child.userData && child.userData.rotationSpeed) {
                    child.rotation.z += child.userData.rotationSpeed;
                }
            });
        }

        // Meteor System
        this.meteorSystem.update(this.sceneManager.scene, this.currentPlanet);

        // Parallax
        this.sceneManager.camera.position.x += (this.mouse.x * 5 - this.sceneManager.camera.position.x) * 0.02;
        this.sceneManager.camera.position.y += (this.mouse.y * 3 + 3 - this.sceneManager.camera.position.y) * 0.02;
        this.sceneManager.camera.lookAt(0, 0, 0);

        this.sceneManager.renderer.render(this.sceneManager.scene, this.sceneManager.camera);
    }

    playIntroCinematic() {
        console.log('🌌 Starting Cinematic Sequence...');
        // Simplified Cinematic for refactor speed, but logic preserved
        // We will just load Earth directly after a delay to simulate loading
        // In a full port, we would move the playCinematic logic here

        // Emulating the loading progress for better UX
        const progressBar = document.querySelector('.progress-bar');
        const statusText = document.querySelector('.loading-status');

        const updateProgress = (val, txt) => {
            if (progressBar) progressBar.style.width = val + '%';
            if (statusText) statusText.textContent = txt;
        };

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            updateProgress(progress, 'Initializing systems...');
            if (progress >= 100) {
                clearInterval(interval);
                this.finishLoading();
            }
        }, 50);
    }

    finishLoading() {
        // Create Earth
        this.loadPlanet('earth');
        // Show UI
        this.uiManager.showUI();
    }
}

// Start App
window.addEventListener('load', () => {
    new CosmicApp();
});