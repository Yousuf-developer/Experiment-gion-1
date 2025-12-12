    import * as THREE from 'three';
    
    const COLOR_SCHEME = {
          'Apple White': {
    color1: new THREE.Vector3(0.98, 0.99, 1.0), 
    color2: new THREE.Vector3(0.85, 0.88, 0.92), 
    color3: new THREE.Vector3(0.9, 0.95, 1.0), 
    centerGlowColor: new THREE.Vector3(1.0, 1.0, 1.0)
},
      'Pure White': {
        color1: new THREE.Vector3(0.95, 0.97, 1.0),
        color2: new THREE.Vector3(1.0, 0.85, 0.88),
        color3: new THREE.Vector3(0.9, 0.95, 1.0)
      },
      'RBW Frosted': {
        color1: new THREE.Vector3(0.95, 0.97, 1.0),
        color2: new THREE.Vector3(0.8, 0.3, 0.35),
        color3: new THREE.Vector3(0.4, 0.55, 1.0)
      },
      'Ice Blue': {
        color1: new THREE.Vector3(0.4, 0.7, 1.0),
        color2: new THREE.Vector3(1.0, 0.5, 0.6),
        color3: new THREE.Vector3(0.3, 0.9, 0.95)
      },
      'Fire Orange': {
        color1: new THREE.Vector3(1.0, 0.4, 0.1),
        color2: new THREE.Vector3(1.0, 0.7, 0.0),
        color3: new THREE.Vector3(1.0, 0.2, 0.3)
      },
    'Deep Sea': {
      color1: new THREE.Vector3(0.0, 0.2, 0.4),
      color2: new THREE.Vector3(0.1, 0.4, 0.6),
      color3: new THREE.Vector3(0.6, 0.8, 1.0)
    },
    'Tropical Lagoon': {
      color1: new THREE.Vector3(0.1, 0.7, 0.6),
      color2: new THREE.Vector3(0.3, 0.9, 0.8),
      color3: new THREE.Vector3(0.9, 1.0, 0.9)
    },
    'Midnight Tide': {
      color1: new THREE.Vector3(0.05, 0.05, 0.15),
      color2: new THREE.Vector3(0.1, 0.25, 0.45),
      color3: new THREE.Vector3(0.7, 0.9, 1.0)
    },
    'Coral Reef': {
      color1: new THREE.Vector3(1.0, 0.5, 0.3),
      color2: new THREE.Vector3(0.8, 0.2, 0.6),
      color3: new THREE.Vector3(0.2, 0.8, 0.7)
    },
    'Arctic Flow': {
      color1: new THREE.Vector3(0.6, 0.9, 1.0),
      color2: new THREE.Vector3(0.3, 0.5, 0.7),
      color3: new THREE.Vector3(0.95, 0.98, 1.0)
    },
    'Emerald Pool': {
      color1: new THREE.Vector3(0.0, 0.5, 0.2),
      color2: new THREE.Vector3(0.3, 0.7, 0.4),
      color3: new THREE.Vector3(0.7, 1.0, 0.9)
    },
    'Submarine Glow': {
      color1: new THREE.Vector3(0.1, 0.1, 0.2),
      color2: new THREE.Vector3(0.0, 0.8, 0.8),
      color3: new THREE.Vector3(0.5, 1.0, 1.0)
    },
    'Neptune Core': {
      color1: new THREE.Vector3(0.1, 0.2, 0.7),
      color2: new THREE.Vector3(0.0, 0.5, 0.9),
      color3: new THREE.Vector3(0.8, 0.9, 1.0)
    },
    'Aqua Splatter': {
      color1: new THREE.Vector3(0.0, 0.6, 0.4),
      color2: new THREE.Vector3(0.5, 0.9, 1.0),
      color3: new THREE.Vector3(0.2, 0.3, 0.8)
    },
    'Oceanic Dust': {
      color1: new THREE.Vector3(0.2, 0.3, 0.4),
      color2: new THREE.Vector3(0.7, 0.8, 0.9),
      color3: new THREE.Vector3(0.1, 0.1, 0.15)
    },
    'Glacier Melt': {
      color1: new THREE.Vector3(0.5, 0.7, 0.8),
      color2: new THREE.Vector3(0.8, 0.9, 1.0),
      color3: new THREE.Vector3(0.1, 0.4, 0.5)
    },
    'Kelp Forest': {
      color1: new THREE.Vector3(0.1, 0.4, 0.1),
      color2: new THREE.Vector3(0.0, 0.2, 0.3),
      color3: new THREE.Vector3(0.4, 0.7, 0.4)
    },
    'Shallow Water': {
      color1: new THREE.Vector3(0.7, 0.9, 0.95),
      color2: new THREE.Vector3(0.3, 0.7, 0.8),
      color3: new THREE.Vector3(0.9, 1.0, 1.0)
    },
    'Blue Hole': {
      color1: new THREE.Vector3(0.0, 0.1, 0.2),
      color2: new THREE.Vector3(0.1, 0.3, 0.5),
      color3: new THREE.Vector3(0.5, 0.7, 0.9)
    },
  
  
    // --- II. Sunset & Celestial Schemes 🌅 (14 Schemes) ---
    'Golden Hour': {
      color1: new THREE.Vector3(1.0, 0.8, 0.0),
      color2: new THREE.Vector3(0.8, 0.4, 0.1),
      color3: new THREE.Vector3(1.0, 0.9, 0.6)
    },
    'Violet Nebula': {
      color1: new THREE.Vector3(0.3, 0.0, 0.4),
      color2: new THREE.Vector3(0.6, 0.2, 0.7),
      color3: new THREE.Vector3(0.9, 0.6, 1.0)
    },
    'Desert Dusk': {
      color1: new THREE.Vector3(0.7, 0.3, 0.1),
      color2: new THREE.Vector3(0.9, 0.6, 0.3),
      color3: new THREE.Vector3(0.1, 0.0, 0.2)
    },
    'Aurora Borealis': {
      color1: new THREE.Vector3(0.0, 0.6, 0.4),
      color2: new THREE.Vector3(0.3, 0.9, 0.0),
      color3: new THREE.Vector3(0.7, 1.0, 0.9)
    },
    'Solar Flare': {
      color1: new THREE.Vector3(1.0, 0.1, 0.0),
      color2: new THREE.Vector3(1.0, 0.6, 0.0),
      color3: new THREE.Vector3(1.0, 1.0, 0.5)
    },
    'Lunar Frost': {
      color1: new THREE.Vector3(0.5, 0.5, 0.6),
      color2: new THREE.Vector3(0.8, 0.8, 0.9),
      color3: new THREE.Vector3(0.1, 0.2, 0.3)
    },
    'Supernova': {
      color1: new THREE.Vector3(1.0, 0.0, 0.8),
      color2: new THREE.Vector3(0.5, 0.0, 1.0),
      color3: new THREE.Vector3(1.0, 0.8, 1.0)
    },
    'Red Giant': {
      color1: new THREE.Vector3(0.5, 0.0, 0.0),
      color2: new THREE.Vector3(0.8, 0.2, 0.1),
      color3: new THREE.Vector3(1.0, 0.4, 0.4)
    },
    'Zenith Blue': {
      color1: new THREE.Vector3(0.0, 0.4, 0.8),
      color2: new THREE.Vector3(0.0, 0.1, 0.3),
      color3: new THREE.Vector3(0.7, 0.9, 1.0)
    },
    'Twilight Haze': {
      color1: new THREE.Vector3(0.2, 0.1, 0.4),
      color2: new THREE.Vector3(0.5, 0.4, 0.7),
      color3: new THREE.Vector3(0.9, 0.8, 0.9)
    },
    'Cosmic Dust': {
      color1: new THREE.Vector3(0.1, 0.05, 0.15),
      color2: new THREE.Vector3(0.3, 0.2, 0.4),
      color3: new THREE.Vector3(0.9, 0.9, 0.9)
    },
    'Starlight Burst': {
      color1: new THREE.Vector3(1.0, 1.0, 1.0),
      color2: new THREE.Vector3(0.8, 0.8, 0.8),
      color3: new THREE.Vector3(0.5, 0.0, 0.8)
    },
    'Mars Surface': {
      color1: new THREE.Vector3(0.6, 0.2, 0.1),
      color2: new THREE.Vector3(0.8, 0.4, 0.2),
      color3: new THREE.Vector3(0.9, 0.6, 0.4)
    },
    'Comet Tail': {
      color1: new THREE.Vector3(0.0, 0.7, 1.0),
      color2: new THREE.Vector3(0.8, 0.8, 0.9),
      color3: new THREE.Vector3(0.1, 0.1, 0.8)
    },
  
    // --- III. Earth & Natural Schemes 🌲 (14 Schemes) ---
    'Forest Canopy': {
      color1: new THREE.Vector3(0.1, 0.3, 0.2),
      color2: new THREE.Vector3(0.3, 0.6, 0.3),
      color3: new THREE.Vector3(0.8, 1.0, 0.7)
    },
    'Volcanic Ash': {
      color1: new THREE.Vector3(0.2, 0.2, 0.2),
      color2: new THREE.Vector3(0.4, 0.4, 0.4),
      color3: new THREE.Vector3(0.9, 0.5, 0.0)
    },
    'Marble Stone': {
      color1: new THREE.Vector3(0.7, 0.7, 0.7),
      color2: new THREE.Vector3(0.4, 0.4, 0.4),
      color3: new THREE.Vector3(0.95, 0.95, 0.95)
    },
    'Lavender Field': {
      color1: new THREE.Vector3(0.5, 0.3, 0.7),
      color2: new THREE.Vector3(0.8, 0.6, 0.9),
      color3: new THREE.Vector3(0.9, 0.9, 1.0)
    },
    'Autumn Blaze': {
      color1: new THREE.Vector3(0.6, 0.2, 0.0),
      color2: new THREE.Vector3(1.0, 0.4, 0.0),
      color3: new THREE.Vector3(1.0, 0.7, 0.3)
    },
    'Mossy Rock': {
      color1: new THREE.Vector3(0.3, 0.35, 0.3),
      color2: new THREE.Vector3(0.5, 0.6, 0.5),
      color3: new THREE.Vector3(0.9, 0.9, 0.8)
    },
    'Clay Pot': {
      color1: new THREE.Vector3(0.6, 0.4, 0.3),
      color2: new THREE.Vector3(0.8, 0.6, 0.5),
      color3: new THREE.Vector3(1.0, 0.8, 0.7)
    },
    'Ruby Wine': {
      color1: new THREE.Vector3(0.4, 0.0, 0.1),
      color2: new THREE.Vector3(0.7, 0.1, 0.2),
      color3: new THREE.Vector3(0.9, 0.5, 0.5)
    },
    'Wheat Field': {
      color1: new THREE.Vector3(0.8, 0.7, 0.4),
      color2: new THREE.Vector3(1.0, 0.9, 0.7),
      color3: new THREE.Vector3(0.5, 0.4, 0.2)
    },
    'Pine Needle': {
      color1: new THREE.Vector3(0.0, 0.2, 0.1),
      color2: new THREE.Vector3(0.1, 0.4, 0.3),
      color3: new THREE.Vector3(0.6, 0.8, 0.7)
    },
    'Sandy Dune': {
      color1: new THREE.Vector3(0.8, 0.6, 0.4),
      color2: new THREE.Vector3(0.9, 0.7, 0.5),
      color3: new THREE.Vector3(1.0, 0.9, 0.8)
    },
    'Misty Morning': {
      color1: new THREE.Vector3(0.5, 0.6, 0.6),
      color2: new THREE.Vector3(0.8, 0.9, 0.9),
      color3: new THREE.Vector3(0.2, 0.3, 0.3)
    },
    'Canyon Wall': {
      color1: new THREE.Vector3(0.5, 0.3, 0.1),
      color2: new THREE.Vector3(0.7, 0.4, 0.2),
      color3: new THREE.Vector3(0.9, 0.7, 0.5)
    },
    'Hot Spring': {
      color1: new THREE.Vector3(0.6, 0.7, 0.5),
      color2: new THREE.Vector3(0.8, 0.9, 0.7),
      color3: new THREE.Vector3(0.4, 0.5, 0.3)
    },
  
    // --- IV. Vibrant & Neon Schemes ✨ (14 Schemes) ---
    'Electric Pink': {
      color1: new THREE.Vector3(1.0, 0.0, 0.5),
      color2: new THREE.Vector3(1.0, 0.4, 0.8),
      color3: new THREE.Vector3(0.0, 1.0, 0.9)
    },
    'Cyber Green': {
      color1: new THREE.Vector3(0.0, 1.0, 0.0),
      color2: new THREE.Vector3(0.5, 1.0, 0.5),
      color3: new THREE.Vector3(0.8, 0.0, 1.0)
    },
    'Retro Pop': {
      color1: new THREE.Vector3(1.0, 0.0, 0.0),
      color2: new THREE.Vector3(0.0, 0.0, 1.0),
      color3: new THREE.Vector3(1.0, 1.0, 0.0)
    },
    'High Vis': {
      color1: new THREE.Vector3(1.0, 0.6, 0.0),
      color2: new THREE.Vector3(0.0, 1.0, 0.8),
      color3: new THREE.Vector3(0.5, 0.0, 1.0)
    },
    'Bubblegum': {
      color1: new THREE.Vector3(1.0, 0.4, 0.7),
      color2: new THREE.Vector3(0.5, 0.8, 1.0),
      color3: new THREE.Vector3(1.0, 0.9, 1.0)
    },
    'Laser Beam': {
      color1: new THREE.Vector3(1.0, 0.0, 0.0),
      color2: new THREE.Vector3(0.0, 1.0, 0.0),
      color3: new THREE.Vector3(0.0, 0.0, 1.0)
    },
    'Miami Vice': {
      color1: new THREE.Vector3(1.0, 0.1, 0.6),
      color2: new THREE.Vector3(0.1, 1.0, 0.8),
      color3: new THREE.Vector3(0.8, 0.8, 0.8)
    },
    'Acid Trip': {
      color1: new THREE.Vector3(0.8, 1.0, 0.0),
      color2: new THREE.Vector3(0.2, 0.0, 1.0),
      color3: new THREE.Vector3(1.0, 0.4, 0.8)
    },
    'Tropical Punch': {
      color1: new THREE.Vector3(1.0, 0.3, 0.0),
      color2: new THREE.Vector3(0.1, 0.8, 0.9),
      color3: new THREE.Vector3(0.8, 0.0, 0.5)
    },
    'Electric Grape': {
      color1: new THREE.Vector3(0.5, 0.0, 1.0),
      color2: new THREE.Vector3(0.9, 0.5, 1.0),
      color3: new THREE.Vector3(0.1, 0.9, 0.7)
    },
    'Fiesta Mix': {
      color1: new THREE.Vector3(1.0, 0.0, 0.2),
      color2: new THREE.Vector3(0.0, 0.8, 0.0),
      color3: new THREE.Vector3(1.0, 0.9, 0.0)
    },
    'Vivid Magenta': {
      color1: new THREE.Vector3(0.8, 0.0, 0.8),
      color2: new THREE.Vector3(1.0, 0.5, 1.0),
      color3: new THREE.Vector3(0.0, 0.0, 0.2)
    },
    'Neon Orange': {
      color1: new THREE.Vector3(1.0, 0.3, 0.0),
      color2: new THREE.Vector3(1.0, 0.7, 0.4),
      color3: new THREE.Vector3(0.0, 0.9, 1.0)
    },
    'Luminance': {
      color1: new THREE.Vector3(1.0, 1.0, 0.0),
      color2: new THREE.Vector3(0.0, 1.0, 1.0),
      color3: new THREE.Vector3(1.0, 0.0, 1.0)
    },
  
  
    // --- V. Gradient & Pastel Schemes 🌸 (14 Schemes) ---
    'Soft Peach': {
      color1: new THREE.Vector3(1.0, 0.7, 0.6),
      color2: new THREE.Vector3(0.8, 0.9, 1.0),
      color3: new THREE.Vector3(1.0, 0.9, 0.9)
    },
    'Mint Dream': {
      color1: new THREE.Vector3(0.7, 1.0, 0.9),
      color2: new THREE.Vector3(0.4, 0.8, 0.7),
      color3: new THREE.Vector3(1.0, 1.0, 1.0)
    },
    'Lilac Sunset': {
      color1: new THREE.Vector3(0.6, 0.6, 0.8),
      color2: new THREE.Vector3(0.9, 0.7, 0.8),
      color3: new THREE.Vector3(1.0, 0.8, 0.7)
    },
    'Sky Blue Wash': {
      color1: new THREE.Vector3(0.5, 0.8, 1.0),
      color2: new THREE.Vector3(0.8, 0.9, 1.0),
      color3: new THREE.Vector3(0.2, 0.6, 0.9)
    },
    'Creamy Butter': {
      color1: new THREE.Vector3(1.0, 0.95, 0.8),
      color2: new THREE.Vector3(1.0, 0.8, 0.9),
      color3: new THREE.Vector3(0.8, 1.0, 0.9)
    },
    'Frosted Berry': {
      color1: new THREE.Vector3(0.8, 0.6, 0.7),
      color2: new THREE.Vector3(0.5, 0.3, 0.6),
      color3: new THREE.Vector3(0.9, 0.9, 0.95)
    },
    'Cotton Candy': {
      color1: new THREE.Vector3(1.0, 0.6, 0.8),
      color2: new THREE.Vector3(0.8, 1.0, 1.0),
      color3: new THREE.Vector3(0.6, 0.8, 1.0)
    },
    'Cloud Nine': {
      color1: new THREE.Vector3(0.9, 0.9, 1.0),
      color2: new THREE.Vector3(0.7, 0.8, 0.9),
      color3: new THREE.Vector3(1.0, 1.0, 1.0)
    },
    'Honeydew': {
      color1: new THREE.Vector3(0.8, 1.0, 0.7),
      color2: new THREE.Vector3(0.6, 0.9, 0.5),
      color3: new THREE.Vector3(0.9, 1.0, 0.9)
    },
    'Strawberry Milk': {
      color1: new THREE.Vector3(1.0, 0.8, 0.8),
      color2: new THREE.Vector3(0.9, 0.6, 0.7),
      color3: new THREE.Vector3(1.0, 0.95, 0.95)
    },
    'Ocean Mist': {
      color1: new THREE.Vector3(0.5, 0.8, 0.8),
      color2: new THREE.Vector3(0.7, 0.9, 0.9),
      color3: new THREE.Vector3(0.3, 0.6, 0.7)
    },
    'Muted Gold': {
      color1: new THREE.Vector3(0.8, 0.7, 0.5),
      color2: new THREE.Vector3(0.9, 0.8, 0.6),
      color3: new THREE.Vector3(0.6, 0.5, 0.3)
    },
    'Periwinkle': {
      color1: new THREE.Vector3(0.7, 0.7, 0.9),
      color2: new THREE.Vector3(0.8, 0.8, 1.0),
      color3: new THREE.Vector3(0.5, 0.5, 0.7)
    },
    'Lemon Drop': {
      color1: new THREE.Vector3(1.0, 0.9, 0.7),
      color2: new THREE.Vector3(0.9, 1.0, 0.8),
      color3: new THREE.Vector3(0.7, 0.8, 0.6)
    },
  
    // --- VI. Monochromatic & Muted Schemes 🖤 (14 Schemes) ---
    'Pure Black': {
      color1: new THREE.Vector3(0.05, 0.05, 0.05),
      color2: new THREE.Vector3(0.2, 0.2, 0.2),
      color3: new THREE.Vector3(0.8, 0.8, 0.8)
    },
    'Charcoal Grey': {
      color1: new THREE.Vector3(0.15, 0.15, 0.15),
      color2: new THREE.Vector3(0.4, 0.4, 0.4),
      color3: new THREE.Vector3(0.95, 0.95, 0.95)
    },
    'Dark Teal': {
      color1: new THREE.Vector3(0.0, 0.3, 0.3),
      color2: new THREE.Vector3(0.2, 0.5, 0.5),
      color3: new THREE.Vector3(0.6, 0.9, 0.9)
    },
    'Deep Plum': {
      color1: new THREE.Vector3(0.2, 0.05, 0.2),
      color2: new THREE.Vector3(0.4, 0.1, 0.4),
      color3: new THREE.Vector3(0.8, 0.6, 0.8)
    },
    'Olive Drab': {
      color1: new THREE.Vector3(0.3, 0.3, 0.1),
      color2: new THREE.Vector3(0.5, 0.5, 0.3),
      color3: new THREE.Vector3(0.8, 0.8, 0.6)
    },
    'Muted Rose': {
      color1: new THREE.Vector3(0.6, 0.4, 0.4),
      color2: new THREE.Vector3(0.8, 0.6, 0.6),
      color3: new THREE.Vector3(0.9, 0.8, 0.8)
    },
    'Cobalt Muted': {
      color1: new THREE.Vector3(0.1, 0.2, 0.4),
      color2: new THREE.Vector3(0.3, 0.4, 0.6),
      color3: new THREE.Vector3(0.7, 0.8, 1.0)
    },
    'Slate Blue': {
      color1: new THREE.Vector3(0.2, 0.3, 0.4),
      color2: new THREE.Vector3(0.4, 0.5, 0.6),
      color3: new THREE.Vector3(0.8, 0.9, 0.95)
    },
    'Burnt Sienna': {
      color1: new THREE.Vector3(0.5, 0.2, 0.1),
      color2: new THREE.Vector3(0.7, 0.4, 0.3),
      color3: new THREE.Vector3(0.9, 0.6, 0.5)
    },
    'Deep Forest': {
      color1: new THREE.Vector3(0.1, 0.15, 0.1),
      color2: new THREE.Vector3(0.2, 0.3, 0.2),
      color3: new THREE.Vector3(0.5, 0.7, 0.5)
    },
    'Shadow Grey': {
      color1: new THREE.Vector3(0.1, 0.1, 0.1),
      color2: new THREE.Vector3(0.5, 0.5, 0.5),
      color3: new THREE.Vector3(0.7, 0.7, 0.7)
    },
    'Mauve Muted': {
      color1: new THREE.Vector3(0.5, 0.4, 0.5),
      color2: new THREE.Vector3(0.7, 0.6, 0.7),
      color3: new THREE.Vector3(0.9, 0.9, 0.9)
    },
    'Sable Brown': {
      color1: new THREE.Vector3(0.3, 0.2, 0.1),
      color2: new THREE.Vector3(0.5, 0.3, 0.2),
      color3: new THREE.Vector3(0.8, 0.6, 0.4)
    },
    'Ash White': {
      color1: new THREE.Vector3(0.8, 0.8, 0.8),
      color2: new THREE.Vector3(0.9, 0.9, 0.9),
      color3: new THREE.Vector3(0.1, 0.1, 0.1)
    },
  
  
    // --- VII. Abstract & Theme Schemes ⚙️ (20 Schemes) ---
    'Matrix Code': {
      color1: new THREE.Vector3(0.0, 0.2, 0.0),
      color2: new THREE.Vector3(0.0, 0.6, 0.0),
      color3: new THREE.Vector3(0.5, 1.0, 0.5)
    },
    'Lava Lamp': {
      color1: new THREE.Vector3(0.8, 0.0, 0.4),
      color2: new THREE.Vector3(0.0, 0.8, 0.8),
      color3: new THREE.Vector3(1.0, 0.8, 0.0)
    },
    'Rainbow Dust': {
      color1: new THREE.Vector3(1.0, 0.0, 0.0),
      color2: new THREE.Vector3(0.0, 1.0, 0.0),
      color3: new THREE.Vector3(0.0, 0.0, 1.0)
    },
    'Gold Rush': {
      color1: new THREE.Vector3(0.6, 0.4, 0.0),
      color2: new THREE.Vector3(0.9, 0.7, 0.2),
      color3: new THREE.Vector3(1.0, 0.9, 0.6)
    },
    'Chrome Effect': {
      color1: new THREE.Vector3(0.8, 0.8, 0.9),
      color2: new THREE.Vector3(0.3, 0.3, 0.4),
      color3: new THREE.Vector3(1.0, 1.0, 1.0)
    },
    'Amethyst': {
      color1: new THREE.Vector3(0.4, 0.2, 0.6),
      color2: new THREE.Vector3(0.7, 0.5, 0.9),
      color3: new THREE.Vector3(0.9, 0.8, 1.0)
    },
    'Copper Kettle': {
      color1: new THREE.Vector3(0.7, 0.4, 0.1),
      color2: new THREE.Vector3(0.5, 0.2, 0.0),
      color3: new THREE.Vector3(0.9, 0.6, 0.4)
    },
    'Synthwave': {
      color1: new THREE.Vector3(0.8, 0.0, 0.8),
      color2: new THREE.Vector3(0.0, 1.0, 1.0),
      color3: new THREE.Vector3(1.0, 0.8, 0.0)
    },
    'Blueprint': {
      color1: new THREE.Vector3(0.0, 0.0, 0.5),
      color2: new THREE.Vector3(0.7, 0.7, 0.9),
      color3: new THREE.Vector3(0.0, 0.2, 0.8)
    },
    'Pulsar': {
      color1: new THREE.Vector3(1.0, 0.0, 0.5),
      color2: new THREE.Vector3(1.0, 1.0, 0.0),
      color3: new THREE.Vector3(0.1, 0.1, 0.1)
    },
    'Jade Glow': {
      color1: new THREE.Vector3(0.0, 0.5, 0.3),
      color2: new THREE.Vector3(0.2, 0.8, 0.6),
      color3: new THREE.Vector3(0.9, 1.0, 0.9)
    },
    'Rust Stain': {
      color1: new THREE.Vector3(0.5, 0.1, 0.0),
      color2: new THREE.Vector3(0.7, 0.3, 0.1),
      color3: new THREE.Vector3(0.9, 0.5, 0.3)
    },
    'Cyberpunk City': {
      color1: new THREE.Vector3(0.0, 0.0, 0.4),
      color2: new THREE.Vector3(1.0, 0.0, 0.8),
      color3: new THREE.Vector3(0.0, 1.0, 1.0)
    },
    'Glitch Effect': {
      color1: new THREE.Vector3(0.0, 1.0, 0.2),
      color2: new THREE.Vector3(1.0, 0.0, 0.4),
      color3: new THREE.Vector3(0.1, 0.1, 0.1)
    },
    'Vaporwave': {
      color1: new THREE.Vector3(0.0, 0.8, 1.0),
      color2: new THREE.Vector3(1.0, 0.0, 0.8),
      color3: new THREE.Vector3(1.0, 0.9, 0.0)
    },
    'Quantum Foam': {
      color1: new THREE.Vector3(0.3, 0.1, 0.4),
      color2: new THREE.Vector3(0.7, 0.9, 0.2),
      color3: new THREE.Vector3(0.1, 0.8, 0.9)
    },
    'Dragon Scale': {
      color1: new THREE.Vector3(0.4, 0.0, 0.0),
      color2: new THREE.Vector3(0.8, 0.4, 0.0),
      color3: new THREE.Vector3(0.6, 0.8, 0.6)
    },
    'Iron Man': {
      color1: new THREE.Vector3(0.8, 0.0, 0.0),
      color2: new THREE.Vector3(0.9, 0.6, 0.0),
      color3: new THREE.Vector3(0.8, 0.8, 0.8)
    },
    'Black Mirror': {
      color1: new THREE.Vector3(0.0, 0.0, 0.0),
      color2: new THREE.Vector3(0.2, 0.2, 0.2),
      color3: new THREE.Vector3(0.4, 0.4, 0.4)
    },
    'Alchemy': {
      color1: new THREE.Vector3(0.9, 0.7, 0.1),
      color2: new THREE.Vector3(0.5, 0.0, 0.6),
      color3: new THREE.Vector3(0.0, 0.5, 0.0)
    }
    }

    

    export default COLOR_SCHEME;