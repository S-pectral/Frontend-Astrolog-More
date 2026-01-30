# 🌌 Cosmic Explorer (S-pectral)
> An immersive, state-of-the-art 3D Solar System simulation built with Three.js and GSAP.

[![Version](https://img.shields.io/badge/Version-1.2.0-blueviolet?style=for-the-badge)](https://github.com/S-pectral/Frontend-Astrolog-More)
[![Original](https://img.shields.io/badge/Original_Project-CanKStar0-orange?style=for-the-badge)](https://github.com/CanKStar0/Frontend-Astrolog)
[![Three.js](https://img.shields.io/badge/Three.js-r128-000000?style=for-the-badge&logo=three.js)](https://threejs.org)

**Cosmic Explorer** is a premium interactive astronomy experience. This edition is a highly optimized fork of the original [Frontend-Astrolog](https://github.com/CanKStar0/Frontend-Astrolog) by **CanKStar0**, featuring enhanced visuals, flight mechanics, and UI refinements.

---

## ✨ Primary Features

### 🎮 Discovery Modes
- **Orbit Mode**: Smooth, cinematic camera controls focused on individual planets. Features "Warp Drive" transitions for seamless interstellar travel.
- **Flight Mode (F)**: Take direct control of a spaceship. Navigate the void with semi-realistic physics and interact with the environment.

### ☄️ Celestial Visuals
- **Advanced Sun Shader**: Procedural solar surface with limb darkening and dynamic noise.
- **Reactive Asteroid Belt**: A lush "Meteor Sea" with thousands of unique rocks, featuring optimized instance rendering for high performance.
- **Atmospheric Rendering**: Custom-built atmosphere layers for Earth and Titan with realistic light scattering.

### 🛰️ Dynamic Database
- **Comprehensive Catalog**: Includes all major planets, their moons (Io, Europa, Titan, etc.), and artificial satellites (ISS, Hubble, Voyager 1).
- **Live Compass**: Real-time HUD tracking of celestial bodies relative to your position.

---

## 🛠️ Technical Stack

- **Core**: JavaScript (ES6+), HTML5, CSS3
- **Graphics**: [Three.js](https://threejs.org/) (WebGL)
- **Animation**: [GSAP](https://greensock.com/gsap/) (GreenSock) for cinematic transitions and UI.
- **Performance**: InstancedMesh for asteroid belts, shader-based atmospheric effects, and optimized geometry batches.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A modern WebGL-capable browser

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/S-pectral/Frontend-Astrolog-More.git
   cd Frontend-Astrolog-More
   ```

2. **Setup dependencies**
   ```bash
   npm install
   ```

3. **Launch the explorer**
   ```bash
   npm start
   ```
   *Alternatively, open `index.html` directly if using a local server extension.*

---

## ⌨️ Controls

| Key | Action |
| --- | --- |
| **W/S** | Accelerate / Decelerate (Flight) |
| **A/D** | Yaw Left / Right (Flight) |
| **Q/E** | Roll (Flight) |
| **Mouse** | Pitch / Orbit (All Modes) |
| **F** | Toggle Flight Mode |

---

## 📂 Project Governance

This project is a fork of [CanKStar0/Frontend-Astrolog](https://github.com/CanKStar0/Frontend-Astrolog), optimized by the **Spectral** team for high-performance frontend visualization. 

### 🏗️ Architecture
- `js/core/`: Scene, Lighting, and Camera management.
- `js/factories/`: Procedural generation of planets and effects.
- `js/systems/`: Flight control, Meteor physics, and Audio.
- `js/ui/`: Glassmorphism-based HUD and Interactive Compass.

---

## 📄 License & Attribution

- **Original Creator**: [CanKStar0](https://github.com/CanKStar0)
- **Maintainer**: [Spectral](https://github.com/S-pectral)

This project is intended for educational and research purposes in the field of 3D Web Visualization.

---

<p align="center">
  <b>🌟 Designed for the Stars. Built for the Web. 🌟</b><br>
  <i>Copyright © 2026 Spectral. All rights reserved.</i>
</p>
