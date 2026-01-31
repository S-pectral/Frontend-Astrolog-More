
export class FlightController {
    constructor(spaceship, camera, collidables = []) {
        this.spaceship = spaceship;
        this.camera = camera;
        this.collidables = collidables; // Planets/Major bodies

        // Physics State
        this.speed = 0;
        this.maxSpeed = 2.5;
        this.acceleration = 0.05;
        this.deceleration = 0.03; // Slightly stronger for better control

        // Input State
        this.keys = { forward: false, backward: false, left: false, right: false };
        this.mousePos = { x: 0, y: 0 };

        // Steering - Current vs Target for smoothing
        this.currentPitch = 0;
        this.currentYaw = 0;
        this.currentRoll = 0;
        this.turnSmoothing = 0.1;
        this.turnSpeed = 0.05; // Slightly faster default

        this.initListeners();
    }

    initListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    onKeyDown(e) {
        switch (e.code) {
            case 'KeyW': this.keys.forward = true; break;
            case 'KeyS': this.keys.backward = true; break;
            case 'KeyA': this.keys.left = true; break;
            case 'KeyD': this.keys.right = true; break;
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case 'KeyW': this.keys.forward = false; break;
            case 'KeyS': this.keys.backward = false; break;
            case 'KeyA': this.keys.left = false; break;
            case 'KeyD': this.keys.right = false; break;
        }
    }

    update() {
        if (!this.spaceship) return;

        // 1. Throttle
        if (this.keys.forward) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        } else if (this.keys.backward) {
            this.speed = Math.max(this.speed - this.acceleration, -0.5);
        } else {
            this.speed *= 0.98; // Natural glide
        }

        this.maxSpeed = 3.5;
        this.acceleration = 0.1;

        // 2. Smoothed Steering & Roll (6DOF)
        const targetPitch = this.mousePos.y * this.turnSpeed;
        const targetYaw = -this.mousePos.x * this.turnSpeed;

        this.currentPitch += (targetPitch - this.currentPitch) * this.turnSmoothing;
        this.currentYaw += (targetYaw - this.currentYaw) * this.turnSmoothing;

        // Apply Local Rotations
        this.spaceship.rotateX(this.currentPitch);
        this.spaceship.rotateY(this.currentYaw);

        // 360-Degree Roll Control (A/D)
        let rollSpeed = 0;
        if (this.keys.left) rollSpeed = 0.04;
        if (this.keys.right) rollSpeed = -0.04;

        if (rollSpeed !== 0) {
            this.spaceship.rotateZ(rollSpeed);
        }

        // CRITICAL: Normalize quaternion every frame to prevent floating-point skew/distortion
        this.spaceship.quaternion.normalize();

        // 3. Collision Detection
        const velocity = new THREE.Vector3(0, 0, -this.speed).applyQuaternion(this.spaceship.quaternion);
        const nextPos = this.spaceship.position.clone().add(velocity);

        let collision = false;
        if (this.collidables && this.collidables.length > 0) {
            const raycaster = new THREE.Raycaster();

            // Ray starts from ship center
            const rayDir = velocity.clone().normalize();
            const rayOrigin = this.spaceship.position.clone();
            raycaster.set(rayOrigin, rayDir);

            // Tight range: Ship center to nose is ~5 units. 
            // We only trigger if object is within "physical touch" distance.
            const checkDist = Math.abs(this.speed) + 5.5;
            const intersects = raycaster.intersectObjects(this.collidables, true);

            if (intersects.length > 0) {
                const hit = intersects[0];
                if (hit.distance < checkDist) {
                    collision = true;
                    this.speed *= -0.3; // Bounce back
                    // Visual response: jolt
                    this.currentPitch += (Math.random() - 0.5) * 0.1;
                    this.currentYaw += (Math.random() - 0.5) * 0.1;
                }
            }

            // B. Sphere-based check for large planets (Performance)
            if (!collision) {
                for (const body of this.collidables) {
                    const spec = body.userData.spec;
                    if (!spec || spec.type === 'belt') continue;

                    const planetRadius = spec.radius || 0;
                    if (planetRadius > 0 && nextPos.distanceTo(body.position) < planetRadius + 3) {
                        collision = true;
                        this.speed *= -0.3;
                        break;
                    }
                }
            }
        }

        if (!collision) {
            this.spaceship.position.copy(nextPos);
        }

        // Important: Update world matrix before camera uses it to prevent follow lag/jitter
        this.spaceship.updateMatrixWorld();
        this.updateCamera();
    }

    updateCamera() {
        const offset = new THREE.Vector3(0, 4, 18);
        const desiredPosition = offset.applyMatrix4(this.spaceship.matrixWorld);
        this.camera.position.lerp(desiredPosition, 0.15);
        const lookTarget = new THREE.Vector3(0, 0, -50).applyMatrix4(this.spaceship.matrixWorld);
        this.camera.lookAt(lookTarget);
    }
}
