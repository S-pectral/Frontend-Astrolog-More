const fs = require('fs');
const path = require('path');

console.log('📦 Kütüphaneler kopyalanıyor...');

// Create lib directory
const libDir = path.join(__dirname, 'lib');
if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir);
}

// Copy Three.js
const threeSrc = path.join(__dirname, 'node_modules', 'three', 'build', 'three.min.js');
const threeDest = path.join(libDir, 'three.min.js');

if (fs.existsSync(threeSrc)) {
    fs.copyFileSync(threeSrc, threeDest);
    console.log('✅ Three.js kopyalandı');
} else {
    console.log('❌ Three.js bulunamadı');
}

// Copy GSAP
const gsapSrc = path.join(__dirname, 'node_modules', 'gsap', 'dist', 'gsap.min.js');
const gsapDest = path.join(libDir, 'gsap.min.js');

if (fs.existsSync(gsapSrc)) {
    fs.copyFileSync(gsapSrc, gsapDest);
    console.log('✅ GSAP kopyalandı');
} else {
    console.log('❌ GSAP bulunamadı');
}

console.log('✨ Kurulum tamamlandı!');