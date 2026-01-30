
export class FlightController {
    constructor(spaceship, camera, domElement) {
        this.spaceship = spaceship;
        this.camera = camera;
        this.domElement = domElement || document;

        // Physics State
        this.speed = 0;
        this.maxSpeed = 2.5;
        this.acceleration = 0.05;
        this.deceleration = 0.02;

        // Orientation State
        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;

        // Control Sensitivity
        this.turnSpeed = 0.03;
        this.rollResponsiveness = 0.1;

        // Input State
        this.keys = {
            forward: false,
            backward: false,
            left: false, // Roll Left (A)
            right: false // Roll Right (D)
        };

        this.mousePos = { x: 0, y: 0 };

        this.initListeners();
    }

    initListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Track mouse for steering
        document.addEventListener('mousemove', (e) => {
            // Normalize -1 to 1
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

        // 1. Throttle (W/S)
        if (this.keys.forward) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        } else if (this.keys.backward) {
            this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed * 0.5);
        } else {
            // Auto-decelerate
            if (this.speed > 0) this.speed = Math.max(0, this.speed - this.deceleration);
            else if (this.speed < 0) this.speed = Math.min(0, this.speed + this.deceleration);
        }

        // 2. Steering (Mouse)
        // Mouse Y controls Pitch (Up/Down)
        const targetPitch = this.mousePos.y * this.turnSpeed;

        // Mouse X controls Yaw (Left/Right)
        const targetYaw = -this.mousePos.x * this.turnSpeed;

        // Apply rotation (Pitch & Yaw)
        this.spaceship.rotateX(targetPitch);
        this.spaceship.rotateY(targetYaw);

        // 3. Roll (A/D Keys + Mouse Banking)
        // A (Left) -> Roll Left (+Z locally usually)
        // D (Right) -> Roll Right (-Z)
        // Let's modify target roll based on input
        let rollInput = 0;
        if (this.keys.left) rollInput += 1;
        if (this.keys.right) rollInput -= 1;

        // Mouse contributes slight banking, Keys provide strong roll
        // Combining them:
        const targetRoll = (rollInput * 0.08) + (-this.mousePos.x * 0.5);

        // Apply Roll (Rotate Z)
        // We accumulate rotation differences
        const rollDiff = (targetRoll * 0.5); // Simplified direct application
        // Actually, for continuous roll (like a plane doing a barrel roll), 
        // A/D should add to rotation continuously, not set a target angle.

        if (rollInput !== 0) {
            // Continuous roll when holding key
            this.spaceship.rotateZ(rollInput * 0.05);
        } else {
            // Auto-bank when turning with mouse if no key pressed
            // Banking effect
            const bankAngle = -this.mousePos.x * 0.5;
            // This needs complex quaternion math to do perfectly.
            // Simple visual hack: apply a temporary roll that visually resets? 
            // The previous logic was: lerp to a target angle.
            // But A/D implies active rolling.

            // Let's stick to the requested "A/D yatırma" (Banking)
            // If they want to SPIN, that's different. Assuming Banking/Tilting.

            const currentBank = (bankAngle - this.roll) * 0.1;
            this.spaceship.rotateZ(currentBank);
            this.roll += currentBank;
        }

        // 4. Move Forward
        this.spaceship.translateZ(-this.speed);

        // 5. Camera Follow
        this.updateCamera();
    }

    updateCamera() {
        // Position camera DIRECTLY behind and slightly above
        const offset = new THREE.Vector3(0, 4, 18);
        const desiredPosition = offset.applyMatrix4(this.spaceship.matrixWorld);

        // Faster lerp for tighter feel
        this.camera.position.lerp(desiredPosition, 0.2);

        // Look ahead of the ship
        const lookTarget = new THREE.Vector3(0, 0, -50).applyMatrix4(this.spaceship.matrixWorld);
        this.camera.lookAt(lookTarget);
    }
}
