// Gacha game mechanics
const gacha = {
    // Currency
    currency: 10000000,
    
    // Cost per pull
    pullCost: 100,
    
    // Rarity chances (in percentages)
    rarityChances: {
        common: 40,
        uncommon: 35,
        rare: 15,
        epic: 8,
        legendary: 1.5,
        mythical: 0.5   // 0.5%
    },
    
    // Item types
    itemTypes: [
        "Title",
        "Background",
        "Font",
        "Color Scheme",
        "Special Effect",
        "Border",
        "Icon"
    ],
    
    // Item prefixes by rarity
    itemPrefixes: {
        common: [
            "Basic", "Simple", "Plain", "Standard", "Regular",
            "Ordinary", "Modest", "Casual", "Normal", "Everyday"
        ],
        uncommon: [
            "Neat", "Polished", "Improved", "Enhanced", "Refined",
            "Unusual", "Novel", "Distinct", "Peculiar", "Special"
        ],
        rare: [
            "Exceptional", "Superior", "Impressive", "Advanced", "Remarkable",
            "Magnificent", "Splendid", "Exquisite", "Premium", "Valuable"
        ],
        epic: [
            "Extraordinary", "Phenomenal", "Spectacular", "Fantastic", "Marvelous",
            "Wondrous", "Astonishing", "Striking", "Formidable", "Dazzling"
        ],
        legendary: [
            "Legendary", "Supreme", "Majestic", "Divine", "Mythic",
            "Transcendent", "Celestial", "Ultimate", "Paramount", "Sovereign"
        ],
        mythical: [
            "Ethereal", "Cosmic", "Primordial", "Omnipotent", "Eternal",
            "Ancient", "Absolute", "Eldritch", "Arcane", "Unearthly"
        ]
    },
    
    // Item names by type
    itemNames: {
        "Title": [
            "Adventurer", "Explorer", "Discoverer", "Collector", "Conqueror",
            "Champion", "Warrior", "Hunter", "Master", "Commander",
            "Guardian", "Protector", "Defender", "Savior", "Hero",
            "Scholar", "Sage", "Wizard", "Mage", "Sorcerer",
            "Emperor", "King", "Queen", "Prince", "Princess",
            "Dragonslayer", "Voidwalker", "Lightbringer", "Shadowcaster", "Stormcaller"
        ],
        "Background": [
            "Nebula", "Galaxy", "Cosmos", "Starfield", "Aurora",
            "Ocean", "Forest", "Mountain", "Desert", "Sky",
            "City", "Castle", "Temple", "Ruins", "Sanctuary",
            "Fire", "Water", "Earth", "Air", "Void",
            "Dawn", "Dusk", "Day", "Night", "Twilight",
            "Crystal", "Metal", "Wooden", "Stone", "Ethereal"
        ],
        "Font": [
            "Serif", "Sans", "Script", "Display", "Monospace",
            "Cursive", "Angular", "Rounded", "Bold", "Thin",
            "Gothic", "Roman", "Rune", "Calligraphy", "Hieroglyph",
            "Digital", "Futuristic", "Retro", "Vintage", "Modern",
            "Elegant", "Playful", "Serious", "Casual", "Formal",
            "Handwritten", "Carved", "Printed", "Painted", "Glowing"
        ],
        "Color Scheme": [
            "Sunrise", "Sunset", "Midnight", "Noon", "Twilight",
            "Ocean", "Forest", "Desert", "Mountain", "Sky",
            "Fire", "Water", "Earth", "Air", "Void",
            "Rainbow", "Monochrome", "Duotone", "Gradient", "Pattern",
            "Pastel", "Neon", "Metallic", "Matte", "Glossy",
            "Royal", "Mystic", "Arcane", "Divine", "Infernal"
        ],
        "Special Effect": [
            "Sparkle", "Glow", "Shine", "Radiance", "Luminescence",
            "Flame", "Ice", "Lightning", "Wind", "Shadow",
            "Pulse", "Wave", "Ripple", "Shimmer", "Flicker",
            "Fade", "Blur", "Distortion", "Refraction", "Prism",
            "Echo", "Resonance", "Vibration", "Harmony", "Discord",
            "Particle", "Aura", "Halo", "Corona", "Nimbus"
        ],
        "Border": [
            "Line", "Curve", "Geometric", "Organic", "Floral",
            "Chain", "Rope", "Ribbon", "Band", "Wire",
            "Thorns", "Vines", "Waves", "Flames", "Frost",
            "Runes", "Glyphs", "Symbols", "Script", "Cipher",
            "Ornate", "Minimal", "Textured", "Layered", "Beveled",
            "Celtic", "Tribal", "Oriental", "Gothic", "Modern"
        ],
        "Icon": [
            "Star", "Moon", "Sun", "Planet", "Comet",
            "Crown", "Sword", "Shield", "Wand", "Staff",
            "Dragon", "Phoenix", "Griffin", "Unicorn", "Leviathan",
            "Skull", "Heart", "Eye", "Hand", "Key",
            "Tree", "Flower", "Mountain", "Ocean", "Sky",
            "Gear", "Crystal", "Gem", "Relic", "Artifact"
        ]
    },
    
    // Suffixes by rarity
    itemSuffixes: {
        common: [
            "of Beginnings", "of the Novice", "of Practice", "of First Steps", "of Learning",
            "of the Common", "of the Mundane", "of Simplicity", "of Basics", "of Normalcy"
        ],
        uncommon: [
            "of Skill", "of Talent", "of Progress", "of Advancement", "of Growth",
            "of Improvement", "of Development", "of Distinction", "of Peculiarity", "of the Noteworthy"
        ],
        rare: [
            "of Excellence", "of Mastery", "of Expertise", "of Sophistication", "of Perfection",
            "of Wonder", "of Brilliance", "of Grace", "of Splendor", "of Prestige"
        ],
        epic: [
            "of Glory", "of Triumph", "of Victory", "of Conquest", "of Achievement",
            "of the Phenomenal", "of the Extraordinary", "of the Remarkable", "of the Spectacular", "of Marvels"
        ],
        legendary: [
            "of Legends", "of Myths", "of Heroes", "of Gods", "of Eternity",
            "of the Cosmos", "of the Universe", "of Creation", "of Infinity", "of the Divine"
        ],
        mythical: [
            "of the Unfathomable", "of the Unknowable", "of the Impossible", "of the Absolute", "of the Ultimate",
            "of Transcendence", "of Omnipotence", "of the Primordial", "of the Ancient Ones", "of the Void"
        ]
    },
    
    // Generate a random item
    generateItem() {
        // Roll for rarity
        const rarity = this.rollRarity();
        
        // Choose a random item type
        const type = this.itemTypes[Math.floor(Math.random() * this.itemTypes.length)];
        
        // Select random prefix based on rarity
        const prefix = this.itemPrefixes[rarity.toLowerCase()][Math.floor(Math.random() * this.itemPrefixes[rarity.toLowerCase()].length)];
        
        // Select random name based on type
        const name = this.itemNames[type][Math.floor(Math.random() * this.itemNames[type].length)];
        
        // Select random suffix based on rarity
        const suffix = this.itemSuffixes[rarity.toLowerCase()][Math.floor(Math.random() * this.itemSuffixes[rarity.toLowerCase()].length)];
        
        // Create item object
        const item = {
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            type: type,
            name: `${prefix} ${name} ${suffix}`,
            rarity: rarity,
            equipped: false,
            dateAcquired: new Date().toISOString()
        };
        
        return item;
    },
    
    // Roll for rarity based on rarityChances
    rollRarity() {
        const roll = Math.random() * 100;
        let cumulativeChance = 0;
        
        for (const [rarity, chance] of Object.entries(this.rarityChances)) {
            cumulativeChance += chance;
            if (roll < cumulativeChance) {
                return rarity;
            }
        }
        
        // Fallback to common (should never happen, but just in case)
        return 'common';
    },
    
    // Perform a gacha pull
    pull() {
        if (this.currency < this.pullCost) {
            return { success: false, message: "Not enough currency for a pull." };
        }
        
        // Deduct currency
        this.currency -= this.pullCost;
        document.getElementById('currency-amount').textContent = this.currency;
        
        // Generate the item
        const item = this.generateItem();
        
        // Return the result
        return {
            success: true,
            item: item
        };
    },
    
    // Try a gacha pull and handle animations/results
    async tryPull() {
        // Check currency
        if (this.currency < this.pullCost) {
            alert("Not enough gems for a pull!");
            return;
        }
        
        // Hide the gacha button
        document.getElementById('gacha-area').style.display = 'none';
        
        // Perform the pull
        const result = this.pull();
        
        if (result.success) {
            const item = result.item;
            console.log("Generated item:", item);
            
            try {
                // Play the appropriate animation
                await window.gachaAnimations.playAnimation(item.rarity);
                
                // Display the result
                window.gachaAnimations.displayResult(item.rarity, item.name);
                
                // Add to inventory when collected
                const collectButton = document.getElementById('collect-button');
                
                // Remove any existing event listeners (just in case)
                const newCollectButton = collectButton.cloneNode(true);
                collectButton.parentNode.replaceChild(newCollectButton, collectButton);
                
                newCollectButton.addEventListener('click', () => {
                    console.log("Collect button clicked, adding to inventory:", item);
                    // Add to inventory
                    window.inventory.addItem(item);
                    
                    // Hide animation area
                    document.getElementById('gacha-animation').classList.add('hidden');
                    document.getElementById('result-display').classList.add('hidden');
                    
                    // Show gacha button
                    document.getElementById('gacha-area').style.display = 'flex';
                }, { once: true });
            } catch (error) {
                console.error('Error during gacha pull:', error);
                document.getElementById('gacha-area').style.display = 'flex';
            }
        } else {
            alert(result.message);
            document.getElementById('gacha-area').style.display = 'flex';
        }
    },
    
    // Initialize gacha
    init() {
        // Display initial currency
        document.getElementById('currency-amount').textContent = this.currency;
        
        // Add event listener to gacha button
        const gachaButton = document.getElementById('gacha-button');
        gachaButton.addEventListener('click', () => this.tryPull());
        
        console.log('Gacha system initialized');
    }
};

// Export gacha
window.gacha = gacha; 
