
export const planetSpecs = {
    sun: {
        radius: 50,
        orbitRadius: 0, // Center
        rotationSpeed: 0.0005,
        atmosphereColor: '#ffaa00',
        info: {
            title: 'The Sun',
            description: 'The Star / Heart of our System',
            distance: '0 km',
            diameter: '1.39 million km',
            period: 'N/A'
        }
    },
    mercury: { // Added for completeness
        radius: 4,
        orbitRadius: 120,
        color: 0x999999,
        atmosphereColor: 0xaaaaaa,
        rotationSpeed: 0.001,
        tilt: 0,
        info: {
            title: 'Mercury',
            description: 'The swift planet, closest to the Sun.',
            distance: '57.9M km',
            diameter: '4,879 km',
            period: '88 days'
        }
    },
    venus: {
        radius: 9,
        orbitRadius: 180,
        color: 0xe3bb76,
        atmosphereColor: 0xffddaa,
        rotationSpeed: -0.001, // Retrograde
        tilt: 177 * (Math.PI / 180),
        info: {
            title: 'Venus',
            description: 'The hottest planet in the solar system.',
            distance: '108.2M km',
            diameter: '12,104 km',
            period: '225 days'
        }
    },
    earth: {
        radius: 10,
        orbitRadius: 260,
        color: 0x2194ce,
        atmosphereColor: 0x64c8ff,
        rotationSpeed: 0.001,
        tilt: 23.5 * (Math.PI / 180),
        info: {
            title: 'Earth',
            description: 'The Blue Planet',
            distance: '149.6M km',
            diameter: '12,742 km',
            period: '365.25 days'
        },
        moons: [
            {
                name: 'Moon', radius: 2.5, distance: 60, speed: 0.005, color: 0xaaaaaa,
                info: { title: 'The Moon', description: "Earth's satellite", distance: '384,400 km', diameter: '3,474 km', period: '27.3 days' }
            },
            {
                name: 'ISS', radius: 0.5, distance: 18, speed: 0.02, color: 0xffffff, type: 'station',
                info: { title: 'ISS', description: 'International Space Station', distance: '408 km', diameter: '109 m', period: '93 mins' }
            },
            {
                name: 'Hubble', radius: 0.6, distance: 24, speed: 0.015, color: 0xcccccc, type: 'telescope',
                info: { title: 'Hubble', description: 'Space Telescope', distance: '540 km', diameter: '13.2 m', period: '95 mins' }
            }
        ]
    },
    asteroidBelt_system: {
        radius: 1.5,
        orbitRadius: 420,
        count: 5000,
        type: 'belt',
        color: 0x888888,
        rotationSpeed: 0.0002,
        info: {
            title: 'Astroid Denizi',
            description: 'The Main Asteroid Belt',
            distance: '329M - 478M km',
            diameter: '150M km range',
            period: '3-6 years'
        }
    },
    asteroidbelt: { // Focus version
        radius: 4, // Large rocks for close-up
        orbitRadius: 25, // Centered ring
        count: 1500,
        isFocusOnly: true,
        color: 0xaaaaaa,
        rotationSpeed: 0.001,
        info: {
            title: 'Astroid Denizi',
            description: 'Close inspection of the belt.',
            distance: '420M km',
            diameter: 'N/A',
            period: 'N/A'
        }
    },
    moon_system: {
        radius: 2.5,
        orbitRadius: 285,
        color: 0xaaaaaa,
        rotationSpeed: 0.001,
        info: { title: 'The Moon', description: 'Earth satellite', distance: '384,400 km', diameter: '3,474 km', period: '27.3 days' }
    },
    moon: { // Focus version
        radius: 5,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0xaaaaaa,
        rotationSpeed: 0.001,
        info: { title: 'The Moon', description: 'Earth satellite', distance: '384,400 km', diameter: '3,474 km', period: '27.3 days' }
    },
    mars: {
        radius: 6,
        orbitRadius: 360,
        color: 0xcc4422,
        atmosphereColor: 0xff6644,
        rotationSpeed: 0.0008,
        tilt: 25.2 * (Math.PI / 180),
        info: {
            title: 'Mars',
            description: 'The Red Planet',
            distance: '227.9M km',
            diameter: '6,779 km',
            period: '687 days'
        },
        moons: [
            {
                name: 'Phobos', radius: 1.5, distance: 15, speed: 0.02, color: 0x887766,
                info: { title: 'Phobos', description: 'Martian Moon', distance: '6,000 km', diameter: '22 km', period: '7.6 hours' }
            },
            {
                name: 'Deimos', radius: 1.0, distance: 22, speed: 0.01, color: 0x998877,
                info: { title: 'Deimos', description: 'Martian Moon', distance: '23,460 km', diameter: '12 km', period: '30.3 hours' }
            }
        ]
    },
    jupiter: {
        radius: 25,
        orbitRadius: 550,
        color: 0xffcc88,
        atmosphereColor: 0xffb366,
        rotationSpeed: 0.002,
        tilt: 3.1 * (Math.PI / 180),
        info: {
            title: 'Jupiter',
            description: 'The Gas Giant',
            distance: '778.5M km',
            diameter: '139,820 km',
            period: '11.86 years'
        },
        moons: [
            {
                name: 'Io', radius: 2, distance: 40, speed: 0.015, color: 0xffffaa,
                info: { title: 'Io', description: 'Volcanic Moon', distance: '421,700 km', diameter: '3,642 km', period: '1.77 days' }
            },
            {
                name: 'Europa', radius: 1.8, distance: 50, speed: 0.012, color: 0xccffff,
                info: { title: 'Europa', description: 'Icy Moon', distance: '670,900 km', diameter: '3,122 km', period: '3.55 days' }
            },
            {
                name: 'Ganymede', radius: 2.5, distance: 65, speed: 0.008, color: 0xddccbb,
                info: { title: 'Ganymede', description: 'Largest Moon', distance: '1.07M km', diameter: '5,268 km', period: '7.15 days' }
            },
            {
                name: 'Callisto', radius: 2.2, distance: 80, speed: 0.005, color: 0x665544,
                info: { title: 'Callisto', description: 'Cratered Moon', distance: '1.88M km', diameter: '4,821 km', period: '16.69 days' }
            }
        ]
    },
    saturn: {
        radius: 22,
        orbitRadius: 750,
        rotationSpeed: 0.002,
        atmosphereColor: '#e0c090',
        tilt: 0.47,
        info: {
            title: 'Saturn',
            description: 'The Ringed Planet',
            distance: '1.4B km',
            diameter: '116,460 km',
            period: '29.45 years'
        },
        moons: [
            {
                name: 'Titan', radius: 2.4, distance: 60, speed: 0.006, color: 0xeebb55,
                info: { title: 'Titan', description: 'Thick Atmosphere', distance: '1.2M km', diameter: '5,149 km', period: '15.9 days' }
            },
            {
                name: 'Rhea', radius: 1.2, distance: 40, speed: 0.009, color: 0xcccccc,
                info: { title: 'Rhea', description: 'Icy Moon', distance: '527,100 km', diameter: '1,527 km', period: '4.5 days' }
            }
        ]
    },
    uranus: {
        radius: 12,
        orbitRadius: 950,
        color: 0x4fd0e7,
        atmosphereColor: 0x88ffff,
        rotationSpeed: 0.001,
        tilt: 98 * (Math.PI / 180),
        info: {
            title: 'Uranus',
            description: 'The sideways ice giant.',
            distance: '2.8B km',
            diameter: '50,724 km',
            period: '84 years'
        }
    },
    neptune: {
        radius: 11,
        orbitRadius: 1150,
        color: 0x3366ff,
        atmosphereColor: 0x5588ff,
        rotationSpeed: 0.001,
        tilt: 28 * (Math.PI / 180),
        info: {
            title: 'Neptune',
            description: 'The windiest planet.',
            distance: '4.5B km',
            diameter: '49,244 km',
            period: '165 years'
        }
    },
    voyager: {
        radius: 1,
        orbitRadius: 2800,
        color: 0xdddddd,
        rotationSpeed: 0,
        type: 'probe',
        info: {
            title: 'Voyager 1',
            description: 'Interstellar Probe',
            distance: '24B km',
            diameter: '3.7 m',
            period: 'N/A'
        }
    },
    blackhole: {
        radius: 15,
        orbitRadius: 2000,
        color: 0x000000,
        atmosphereColor: 0x9955ff,
        rotationSpeed: 0.005,
        info: {
            title: 'Black Hole',
            description: 'Gravitational Singularity',
            distance: 'Unknown',
            diameter: 'Unknown (Event Horizon)',
            period: 'N/A'
        }
    },
    // --- DIRECT ACCESS SATELLITES/MOONS ---
    iss: {
        radius: 0.8,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0xffffff,
        rotationSpeed: 0.02,
        type: 'station',
        info: { title: 'ISS', description: 'International Space Station', distance: '408 km', diameter: '109 m', period: '93 mins' }
    },
    hubble: {
        radius: 1.2,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0xcccccc,
        rotationSpeed: 0.015,
        type: 'telescope',
        info: { title: 'Hubble', description: 'Space Telescope', distance: '540 km', diameter: '13.2 m', period: '95 mins' }
    },
    phobos: {
        radius: 3.5,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0x887766,
        rotationSpeed: 0.02,
        info: { title: 'Phobos', description: 'Martian Moon', distance: '6,000 km', diameter: '22 km', period: '7.6 hours' }
    },
    deimos: {
        radius: 3.5,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0x998877,
        rotationSpeed: 0.01,
        info: { title: 'Deimos', description: 'Martian Moon', distance: '23,460 km', diameter: '12 km', period: '30.3 hours' }
    },
    titan: {
        radius: 6.0,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0xeebb55,
        atmosphereColor: 0xffaa00,
        rotationSpeed: 0.006,
        info: { title: 'Titan', description: 'Thick Atmosphere', distance: '1.2M km', diameter: '5,149 km', period: '15.9 days' }
    },
    io: {
        radius: 4.5,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0xffffaa,
        rotationSpeed: 0.015,
        info: { title: 'Io', description: 'Volcanic Moon', distance: '421,700 km', diameter: '3,122 km', period: '1.77 days' }
    },
    europa: {
        radius: 4.2,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0xccffff,
        rotationSpeed: 0.012,
        info: { title: 'Europa', description: 'Icy Moon', distance: '670,900 km', diameter: '3,122 km', period: '3.55 days' }
    },
    ganymede: {
        radius: 5.5,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0xddccbb,
        rotationSpeed: 0.008,
        info: { title: 'Ganymede', description: 'Largest Moon', distance: '1.07M km', diameter: '5,268 km', period: '7.15 days' }
    },
    callisto: {
        radius: 5.2,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0x665544,
        rotationSpeed: 0.005,
        info: { title: 'Callisto', description: 'Cratered Moon', distance: '1.88M km', diameter: '4,821 km', period: '16.69 days' }
    },
    rhea: {
        radius: 3.0,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        color: 0xcccccc,
        rotationSpeed: 0.009,
        info: { title: 'Rhea', description: 'Icy Moon', distance: '527,100 km', diameter: '1,527 km', period: '4.5 days' }
    },
    voyager_system: {
        radius: 1,
        orbitRadius: 2800,
        color: 0xdddddd,
        type: 'probe',
        info: { title: 'Voyager 1', description: 'Interstellar Probe', distance: '24B km', diameter: '3.7 m', period: 'N/A' }
    },
    voyager: { // Focus version
        radius: 3.5,
        orbitRadius: 0,
        distance: 0,
        isFocusOnly: true,
        type: 'probe',
        color: 0xffffff,
        info: { title: 'Voyager 1', description: 'Interstellar Probe', distance: '24B km', diameter: '3.7 m', period: 'N/A' }
    }
};
