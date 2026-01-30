
export const planetSpecs = {
    earth: {
        radius: 10,
        color: 0x2194ce,
        atmosphereColor: 0x64c8ff,
        rotationSpeed: 0.001,
        tilt: 23.5 * (Math.PI / 180),
        info: {
            title: 'Earth',
            description: 'The Blue Planet - Our home in the vast cosmos',
            distance: '149.6M km',
            diameter: '12,742 km',
            period: '365.25 days'
        }
    },
    mars: {
        radius: 8,
        color: 0xcc4422,
        atmosphereColor: 0xff6644,
        rotationSpeed: 0.0008,
        tilt: 25.2 * (Math.PI / 180),
        info: {
            title: 'Mars',
            description: 'The Red Planet - Named after the Roman god of war',
            distance: '227.9M km',
            diameter: '6,779 km',
            period: '687 days'
        }
    },
    jupiter: {
        radius: 20,
        color: 0xffcc88,
        atmosphereColor: 0xffb366,
        rotationSpeed: 0.002,
        tilt: 3.1 * (Math.PI / 180),
        info: {
            title: 'Jupiter',
            description: 'The Gas Giant - Largest planet in our solar system',
            distance: '778.5M km',
            info: "Büyük Kırmızı Leke, Dünya'dan bile büyük, yüzyıllardır süren devasa bir fırtınadır."
        }
    },
    saturn: {
        radius: 9,
        distance: 140, // Scaled for view
        speed: 0.0009,
        tilt: 0.47, // ~26.7 degrees
        rotationSpeed: 0.004,
        atmosphereColor: '#e0c090',
        info: {
            title: 'Saturn',
            description: "The Jewel of the Solar System - Famous for its ring system",
            distance: '1.4B km',
            diameter: '116,460 km',
            period: '29.5 years'
        }
    },
    sun: {
        radius: 35, // Massive
        distance: 0, // Center
        speed: 0,
        tilt: 0,
        rotationSpeed: 0.0005,
        atmosphereColor: '#ffaa00',
        info: {
            title: 'The Sun',
            description: 'The Star / Heart of our System - A giant ball of hot plasma',
            distance: '0 km',
            diameter: '1.39M km',
            period: 'N/A'
        }
    },
    moon: {
        radius: 3, // Smaller than Earth (10)
        distance: 30, // Close to "Home" but we treat it as separate visitable body for now
        speed: 0.002,
        tilt: 0,
        rotationSpeed: 0.001,
        atmosphereColor: '#aaaaaa', // Very thin/none, but for effect
        info: {
            title: 'The Moon',
            description: "Earth's only natural satellite",
            distance: '384,400 km',
            diameter: '3,474 km',
            period: '27.3 days'
        }
    },
    blackhole: {
        radius: 12,
        color: 0x000000,
        atmosphereColor: 0x9955ff,
        rotationSpeed: 0.005,
        tilt: 0,
        info: {
            title: 'Black Hole',
            description: 'A region of spacetime where gravity is so strong nothing can escape',
            distance: 'Unknown',
            diameter: 'Event Horizon',
            period: 'Timeless'
        }
    }
};
