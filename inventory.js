// Inventory management system
const inventory = {
    // All items owned by the player
    items: [],
    
    // Currently active tab
    activeTab: 'titles',
    
    // Currently equipped items by type
    equipped: {
        Title: null,
        Background: null,
        Font: null,
        "Color Scheme": null,
        "Special Effect": null,
        Border: null,
        Icon: null
    },
    
    // Add an item to the inventory
    addItem(item) {
        console.log("Adding item to inventory:", item);
        this.items.push(item);
        this.saveInventory();
        
        // Show a notification
        this.showNotification(`Added to inventory: ${item.name}`);
        
        // If this tab is currently visible, refresh it
        if (document.getElementById('inventory-panel').classList.contains('visible') && 
            this.activeTab === item.type.toLowerCase() + 's') {
            this.displayItems(this.activeTab);
        }
    },
    
    // Display items of a particular type
    displayItems(tabName) {
        console.log(`Displaying items for tab: ${tabName}, Total items: ${this.items.length}`);
        this.activeTab = tabName;
        const inventoryContent = document.getElementById('inventory-content');
        inventoryContent.innerHTML = '';
        
        // Get the singular type name (remove trailing 's')
        const typeName = tabName.endsWith('s') ? tabName.slice(0, -1) : tabName;
        
        // Convert first letter to uppercase and rest to lowercase
        const typeNameFormatted = typeName.charAt(0).toUpperCase() + typeName.slice(1).toLowerCase();
        
        // Get items of this type
        const filteredItems = this.items.filter(item => item.type.toLowerCase() === typeNameFormatted.toLowerCase());
        console.log(`Filtered items for ${typeNameFormatted}: ${filteredItems.length}`);
        
        if (filteredItems.length === 0) {
            inventoryContent.innerHTML = '<div class="no-items">No items of this type found.</div>';
            return;
        }
        
        // Get currently equipped item of this type
        const equippedItem = this.equipped[typeNameFormatted];
        
        // Sort items by rarity (mythical first)
        const rarityOrder = {
            mythical: 0,
            legendary: 1,
            epic: 2,
            rare: 3,
            uncommon: 4,
            common: 5
        };
        
        filteredItems.sort((a, b) => {
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        });
        
        // Display each item
        filteredItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            
            // Mark as equipped if it is
            if (equippedItem && equippedItem.id === item.id) {
                itemElement.classList.add('equipped');
            }
            
            // Add rarity as a class for styling
            itemElement.classList.add(item.rarity.toLowerCase());
            
            // Create an icon for the item (using emoji based on type and rarity)
            const iconElement = document.createElement('div');
            iconElement.className = 'item-icon';
            iconElement.textContent = this.getIconForItem(item);
            itemElement.appendChild(iconElement);
            
            // Item name
            const nameElement = document.createElement('div');
            nameElement.className = 'item-name';
            nameElement.textContent = item.name;
            itemElement.appendChild(nameElement);
            
            // Item rarity
            const rarityElement = document.createElement('div');
            rarityElement.className = `item-rarity ${item.rarity.toLowerCase()}`;
            rarityElement.textContent = item.rarity.toUpperCase();
            itemElement.appendChild(rarityElement);
            
            // Add click handler to equip/unequip
            itemElement.addEventListener('click', () => {
                this.toggleEquip(item);
                
                // Refresh the display
                this.displayItems(this.activeTab);
            });
            
            inventoryContent.appendChild(itemElement);
        });
    },
    
    // Get an appropriate icon for an item based on its type and rarity
    getIconForItem(item) {
        const type = item.type;
        const rarity = item.rarity.toLowerCase();
        
        // Icons based on type
        const typeIcons = {
            "Title": "👑",
            "Background": "🌌",
            "Font": "🔠",
            "Color Scheme": "🎨",
            "Special Effect": "✨",
            "Border": "🧩",
            "Icon": "🔮"
        };
        
        // For higher rarities, use fancier icons
        if (rarity === 'mythical') {
            const mythicalIcons = {
                "Title": "🌟",
                "Background": "🌠",
                "Font": "📜",
                "Color Scheme": "🌈",
                "Special Effect": "⚡",
                "Border": "🔱",
                "Icon": "💫"
            };
            return mythicalIcons[type] || typeIcons[type];
        } else if (rarity === 'legendary') {
            const legendaryIcons = {
                "Title": "👑",
                "Background": "🏰",
                "Font": "📝",
                "Color Scheme": "🔥",
                "Special Effect": "💥",
                "Border": "⭐",
                "Icon": "🌟"
            };
            return legendaryIcons[type] || typeIcons[type];
        }
        
        return typeIcons[type] || "🎁";
    },
    
    // Toggle equip/unequip an item
    toggleEquip(item) {
        const currentlyEquipped = this.equipped[item.type];
        
        // If this item is already equipped, unequip it
        if (currentlyEquipped && currentlyEquipped.id === item.id) {
            this.equipped[item.type] = null;
            item.equipped = false;
            
            // Remove visual customizations
            this.removeItemEffects(item);
        } else {
            // Unequip the current item of this type if there is one
            if (currentlyEquipped) {
                currentlyEquipped.equipped = false;
                
                // Remove previous item's effects
                this.removeItemEffects(currentlyEquipped);
            }
            
            // Equip the new item
            this.equipped[item.type] = item;
            item.equipped = true;
            
            // Apply visual customizations
            this.applyItemEffects(item);
        }
        
        // Save the changes
        this.saveInventory();
        
        console.log(`${item.equipped ? 'Equipped' : 'Unequipped'}: ${item.name}`);
    },
    
    // Apply visual effects based on the item's type and rarity
    applyItemEffects(item) {
        const type = item.type;
        const rarity = item.rarity.toLowerCase();
        console.log(`Applying effects for ${type} with rarity ${rarity}`);
        
        switch (type) {
            case 'Title':
                // Change the game title with enhanced effects
                const gameTitle = document.getElementById('game-title');
                // Extract the title name from the full item name
                // The format is typically "Prefix ItemName Suffix"
                const titleWords = item.name.split(' ');
                let displayName = titleWords[0]; // Default to first word
                
                // Try to use middle word if available (the actual name portion)
                if (titleWords.length >= 3) {
                    displayName = titleWords[1];
                } else if (titleWords.length === 2) {
                    displayName = titleWords[0]; // Use prefix as display if only 2 words
                }
                
                console.log(`Setting title to: ${displayName} (from ${item.name})`);
                gameTitle.textContent = displayName;
                
                // Clear previous classes and styles
                gameTitle.className = '';
                gameTitle.classList.add(rarity);
                
                // Remove any previously created title effects
                const existingWrapper = document.getElementById('title-wrapper');
                if (existingWrapper) {
                    const parent = existingWrapper.parentNode;
                    const originalTitle = gameTitle.cloneNode(true);
                    parent.replaceChild(originalTitle, existingWrapper);
                    // Update our reference to the title element
                    gameTitle = document.getElementById('game-title');
                }
                
                // Apply rarity-specific title effects
                if (rarity === 'common') {
                    // Simple color
                    gameTitle.style.background = 'var(--common-color)';
                    gameTitle.style.backgroundClip = 'text';
                    gameTitle.style.webkitBackgroundClip = 'text';
                    gameTitle.style.color = 'transparent';
                    gameTitle.style.textShadow = 'none';
                } 
                else if (rarity === 'uncommon') {
                    // Gradient color
                    gameTitle.style.background = 'linear-gradient(45deg, var(--uncommon-color), #d6f4d1)';
                    gameTitle.style.backgroundClip = 'text';
                    gameTitle.style.webkitBackgroundClip = 'text';
                    gameTitle.style.color = 'transparent';
                    gameTitle.style.textShadow = '0 2px 5px rgba(105, 207, 93, 0.3)';
                } 
                else if (rarity === 'rare') {
                    // Better gradient with glow
                    gameTitle.style.background = 'linear-gradient(45deg, #4287f5, #75adff, #4287f5)';
                    gameTitle.style.backgroundSize = '200% auto';
                    gameTitle.style.backgroundClip = 'text';
                    gameTitle.style.webkitBackgroundClip = 'text';
                    gameTitle.style.color = 'transparent';
                    gameTitle.style.textShadow = '0 0 10px rgba(66, 135, 245, 0.5)';
                    
                    // Add subtle animation
                    gameTitle.style.animation = 'title-shine 3s linear infinite';
                    this.addStyleIfMissing('title-animation-style', `
                        @keyframes title-shine {
                            to { background-position: 200% center; }
                        }
                    `);
                } 
                else if (rarity === 'epic' || rarity === 'legendary' || rarity === 'mythical') {
                    // Get unique effects based on the title name
                    const effectConfig = this.titleNameToEffects(displayName, rarity);
                    
                    // Apply appropriate styles based on rarity and title name
                    if (rarity === 'epic') {
                        const colors = effectConfig.colors;
                        // Apply the custom styles
                        gameTitle.style.background = `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[0]}, ${colors[2]}, ${colors[0]})`;
                        gameTitle.style.backgroundSize = '400% auto';
                        gameTitle.style.backgroundClip = 'text';
                        gameTitle.style.webkitBackgroundClip = 'text';
                        gameTitle.style.color = 'transparent';
                        gameTitle.style.textShadow = effectConfig.textShadow;
                        gameTitle.style.animation = `${effectConfig.animation} ${effectConfig.duration}s linear infinite`;
                        
                        // Add all the required keyframes for epic animations
                        this.addEpicAnimationKeyframes(effectConfig);
                    } 
                    else if (rarity === 'legendary') {
                        const colors = effectConfig.colors;
                        // Apply the custom styles
                        gameTitle.style.background = `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[0]}, ${colors[2]}, ${colors[0]})`;
                        gameTitle.style.backgroundSize = '400% auto';
                        gameTitle.style.backgroundClip = 'text';
                        gameTitle.style.webkitBackgroundClip = 'text';
                        gameTitle.style.color = 'transparent';
                        gameTitle.style.textShadow = `0 0 20px ${colors[0]}`;
                        gameTitle.style.animation = `${effectConfig.animation} 6s linear infinite`;
                        
                        // Add all the required keyframes for legendary animations
                        this.addLegendaryAnimationKeyframes(effectConfig);
                        
                        // Create particles around the title with variations
                        this.createTitleParticles(gameTitle, {
                            count: effectConfig.particles.count,
                            size: effectConfig.particles.size,
                            color: colors[0],
                            glow: colors[0],
                            duration: 4,
                            pattern: effectConfig.particles.pattern
                        });
                    } 
                    else if (rarity === 'mythical') {
                        const colors = effectConfig.colors;
                        // Apply the custom styles
                        gameTitle.style.background = `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[0]}, ${colors[1]})`;
                        gameTitle.style.backgroundSize = '300% auto';
                        gameTitle.style.backgroundClip = 'text';
                        gameTitle.style.webkitBackgroundClip = 'text';
                        gameTitle.style.color = 'transparent';
                        gameTitle.style.textShadow = `0 0 25px ${colors[0]}`;
                        gameTitle.style.animation = `${effectConfig.animation} 4s ease infinite`;
                        
                        // Add all the required keyframes for mythical animations
                        this.addMythicalAnimationKeyframes(effectConfig);
                        
                        // Create flame effects with colors
                        this.createTitleFlames(gameTitle, {
                            count: effectConfig.flames.count,
                            colors: colors,
                            pattern: effectConfig.flames.pattern
                        });
                    }
                }
                break;
                
            case 'Background':
                // Change the background
                const gameContainer = document.getElementById('game-container');
                gameContainer.style.backgroundImage = `none`;
                gameContainer.style.backgroundColor = 'transparent';
                
                if (rarity === 'common') {
                    gameContainer.style.backgroundImage = `linear-gradient(45deg, var(--background-color), #232644)`;
                } else if (rarity === 'uncommon') {
                    gameContainer.style.backgroundImage = `linear-gradient(45deg, #232644, #2c2a4a)`;
                } else if (rarity === 'rare') {
                    gameContainer.style.backgroundImage = `linear-gradient(45deg, #0f1642, #1e3c7b)`;
                } else if (rarity === 'epic') {
                    gameContainer.style.backgroundImage = `linear-gradient(45deg, #3c1f72, #5a1a8b)`;
                } else if (rarity === 'legendary') {
                    gameContainer.style.backgroundImage = `linear-gradient(45deg, #3a1600, #a33b00)`;
                } else if (rarity === 'mythical') {
                    // Create a dynamic starfield background
                    gameContainer.style.backgroundColor = '#000';
                    
                    // Add starfield if not already present
                    if (!document.getElementById('starfield-background')) {
                        const starfield = document.createElement('div');
                        starfield.id = 'starfield-background';
                        starfield.style.position = 'absolute';
                        starfield.style.top = '0';
                        starfield.style.left = '0';
                        starfield.style.width = '100%';
                        starfield.style.height = '100%';
                        starfield.style.zIndex = '0';
                        starfield.style.overflow = 'hidden';
                        gameContainer.prepend(starfield);
                        
                        // Add stars
                        for (let i = 0; i < 200; i++) {
                            const star = document.createElement('div');
                            star.style.position = 'absolute';
                            star.style.width = `${Math.random() * 3 + 1}px`;
                            star.style.height = star.style.width;
                            star.style.backgroundColor = 'white';
                            star.style.borderRadius = '50%';
                            star.style.left = `${Math.random() * 100}%`;
                            star.style.top = `${Math.random() * 100}%`;
                            star.style.opacity = `${Math.random() * 0.5 + 0.5}`;
                            
                            // Add twinkle animation
                            star.animate([
                                { opacity: star.style.opacity, transform: 'scale(1)' },
                                { opacity: '1', transform: 'scale(1.5)', offset: 0.5 },
                                { opacity: star.style.opacity, transform: 'scale(1)' }
                            ], {
                                duration: 2000 + Math.random() * 3000,
                                iterations: Infinity
                            });
                            
                            starfield.appendChild(star);
                        }
                    }
                }
                break;
                
            case 'Font':
                // Change the font
                document.body.classList.remove('custom-font-common', 'custom-font-uncommon', 'custom-font-rare', 'custom-font-epic', 'custom-font-legendary', 'custom-font-mythical');
                document.body.classList.add(`custom-font-${rarity}`);
                break;
                
            case 'Color Scheme':
                // Change the color scheme
                document.documentElement.style.setProperty('--primary-color', this.getColorForRarity(rarity, 'primary'));
                document.documentElement.style.setProperty('--secondary-color', this.getColorForRarity(rarity, 'secondary'));
                document.documentElement.style.setProperty('--tertiary-color', this.getColorForRarity(rarity, 'tertiary'));
                break;
                
            case 'Special Effect':
                // Add special effects to certain elements
                if (rarity === 'common') {
                    // Simple shadow effect
                    document.getElementById('gacha-button').style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
                } else if (rarity === 'uncommon') {
                    // Pulsing effect
                    document.getElementById('gacha-button').style.animation = 'pulse 2s infinite';
                    if (!document.getElementById('special-effect-style')) {
                        const style = document.createElement('style');
                        style.id = 'special-effect-style';
                        style.textContent = `
                            @keyframes pulse {
                                0% { transform: scale(1); }
                                50% { transform: scale(1.05); }
                                100% { transform: scale(1); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                } else if (rarity === 'rare') {
                    // Border glow
                    document.getElementById('gacha-button').style.boxShadow = '0 0 20px var(--rare-color)';
                    document.getElementById('gacha-button').style.border = '2px solid var(--rare-color)';
                } else if (rarity === 'epic') {
                    // Shimmering effect
                    document.getElementById('gacha-button').style.backgroundImage = 'linear-gradient(45deg, var(--primary-color), var(--epic-color), var(--primary-color))';
                    document.getElementById('gacha-button').style.backgroundSize = '200% 200%';
                    document.getElementById('gacha-button').style.animation = 'shimmer 3s infinite';
                    if (!document.getElementById('special-effect-style')) {
                        const style = document.createElement('style');
                        style.id = 'special-effect-style';
                        style.textContent = `
                            @keyframes shimmer {
                                0% { background-position: 0% 0%; }
                                50% { background-position: 100% 100%; }
                                100% { background-position: 0% 0%; }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                } else if (rarity === 'legendary') {
                    // Particle effects around button
                    document.getElementById('gacha-button').style.boxShadow = '0 0 30px var(--legendary-color)';
                    document.getElementById('gacha-button').style.border = '2px solid var(--legendary-color)';
                    
                    if (!document.getElementById('button-particles')) {
                        const particleContainer = document.createElement('div');
                        particleContainer.id = 'button-particles';
                        particleContainer.style.position = 'absolute';
                        particleContainer.style.zIndex = '0';
                        document.getElementById('gacha-area').appendChild(particleContainer);
                        
                        // Add floating particles
                        for (let i = 0; i < 12; i++) {
                            const particle = document.createElement('div');
                            particle.style.position = 'absolute';
                            particle.style.width = '8px';
                            particle.style.height = '8px';
                            particle.style.backgroundColor = 'var(--legendary-color)';
                            particle.style.borderRadius = '50%';
                            particle.style.boxShadow = '0 0 10px var(--legendary-color)';
                            particle.style.opacity = '0.7';
                            particle.style.zIndex = '0';
                            
                            // Random initial position
                            const angle = (i / 12) * Math.PI * 2;
                            const distance = 80 + Math.random() * 30;
                            const x = Math.cos(angle) * distance;
                            const y = Math.sin(angle) * distance;
                            
                            particle.style.transform = `translate(${x}px, ${y}px)`;
                            
                            // Animate each particle
                            particle.animate([
                                { transform: `translate(${x}px, ${y}px)` },
                                { transform: `translate(${x * 1.2}px, ${y * 1.2}px)`, offset: 0.5 },
                                { transform: `translate(${x}px, ${y}px)` }
                            ], {
                                duration: 2000 + i * 200,
                                iterations: Infinity
                            });
                            
                            particleContainer.appendChild(particle);
                        }
                    }
                } else if (rarity === 'mythical') {
                    // Advanced particle effects and glow
                    document.getElementById('gacha-button').style.boxShadow = '0 0 40px var(--mythical-color)';
                    document.getElementById('gacha-button').style.border = '2px solid var(--mythical-color)';
                    document.getElementById('gacha-button').style.backgroundImage = 'linear-gradient(45deg, var(--mythical-color), #ff9f5b, var(--mythical-color))';
                    document.getElementById('gacha-button').style.backgroundSize = '200% 200%';
                    document.getElementById('gacha-button').style.animation = 'mythical-shimmer 5s infinite';
                    
                    if (!document.getElementById('special-effect-style')) {
                        const style = document.createElement('style');
                        style.id = 'special-effect-style';
                        style.textContent = `
                            @keyframes mythical-shimmer {
                                0% { background-position: 0% 0%; }
                                50% { background-position: 100% 100%; }
                                100% { background-position: 0% 0%; }
                            }
                            
                            @keyframes orbit {
                                0% { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
                                100% { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
                            }
                            
                            .mythical-particle {
                                position: absolute;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background-color: var(--mythical-color);
                                box-shadow: 0 0 10px var(--mythical-color);
                                transform-origin: center center;
                                opacity: 0.8;
                                mix-blend-mode: screen;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    if (!document.getElementById('mythical-particles')) {
                        const particleContainer = document.createElement('div');
                        particleContainer.id = 'mythical-particles';
                        particleContainer.style.position = 'absolute';
                        particleContainer.style.width = '300px';
                        particleContainer.style.height = '300px';
                        particleContainer.style.left = '50%';
                        particleContainer.style.top = '50%';
                        particleContainer.style.transform = 'translate(-50%, -50%)';
                        particleContainer.style.zIndex = '0';
                        document.getElementById('gacha-area').appendChild(particleContainer);
                        
                        // Add orbiting particles
                        for (let i = 0; i < 15; i++) {
                            const particle = document.createElement('div');
                            particle.className = 'mythical-particle';
                            particle.style.setProperty('--orbit-radius', `${100 + i * 5}px`);
                            
                            // Position at center initially
                            particle.style.left = '50%';
                            particle.style.top = '50%';
                            
                            // Animation with different durations and delays for each particle
                            particle.style.animation = `orbit ${10 + i * 0.5}s linear infinite`;
                            particle.style.animationDelay = `${i * 0.3}s`;
                            
                            particleContainer.appendChild(particle);
                        }
                    }
                }
                break;
                
            case 'Border':
                // Add border effects to elements
                if (rarity === 'common') {
                    document.getElementById('header').style.borderBottom = '1px solid #444';
                } else if (rarity === 'uncommon') {
                    document.getElementById('header').style.borderBottom = '2px solid var(--uncommon-color)';
                } else if (rarity === 'rare') {
                    document.getElementById('header').style.borderBottom = '3px solid var(--rare-color)';
                    document.getElementById('inventory-panel').style.borderTop = '3px solid var(--rare-color)';
                } else if (rarity === 'epic') {
                    document.getElementById('header').style.borderBottom = '3px solid var(--epic-color)';
                    document.getElementById('inventory-panel').style.borderTop = '3px solid var(--epic-color)';
                    document.getElementById('inventory-panel').style.boxShadow = '0 -10px 20px var(--epic-color)';
                } else if (rarity === 'legendary') {
                    document.getElementById('header').style.borderImage = 'linear-gradient(to right, var(--legendary-color), #ffd780, var(--legendary-color)) 1';
                    document.getElementById('header').style.borderBottom = '3px solid';
                    document.getElementById('inventory-panel').style.borderImage = 'linear-gradient(to right, var(--legendary-color), #ffd780, var(--legendary-color)) 1';
                    document.getElementById('inventory-panel').style.borderTop = '3px solid';
                    document.getElementById('inventory-panel').style.boxShadow = '0 -10px 30px var(--legendary-color)';
                } else if (rarity === 'mythical') {
                    // Animate border
                    document.getElementById('header').style.borderBottom = '3px solid var(--mythical-color)';
                    document.getElementById('inventory-panel').style.borderTop = '3px solid var(--mythical-color)';
                    document.getElementById('inventory-panel').style.boxShadow = '0 -10px 40px var(--mythical-color)';
                    
                    document.getElementById('header').style.animation = 'border-pulse 2s infinite';
                    document.getElementById('inventory-panel').style.animation = 'border-pulse 2s infinite';
                    
                    if (!document.getElementById('border-effect-style')) {
                        const style = document.createElement('style');
                        style.id = 'border-effect-style';
                        style.textContent = `
                            @keyframes border-pulse {
                                0% { border-color: var(--mythical-color); }
                                50% { border-color: #ff9f5b; }
                                100% { border-color: var(--mythical-color); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }
                break;
                
            case 'Icon':
                // Change the currency icon
                const currencyIcon = document.querySelector('.currency-icon');
                if (rarity === 'common') {
                    currencyIcon.textContent = '💎';
                } else if (rarity === 'uncommon') {
                    currencyIcon.textContent = '💰';
                } else if (rarity === 'rare') {
                    currencyIcon.textContent = '🔮';
                } else if (rarity === 'epic') {
                    currencyIcon.textContent = '✨';
                } else if (rarity === 'legendary') {
                    currencyIcon.textContent = '🌟';
                } else if (rarity === 'mythical') {
                    currencyIcon.textContent = '🔱';
                }
                break;
        }
    },
    
    // Remove visual effects of an item
    removeItemEffects(item) {
        const type = item.type;
        
        switch (type) {
            case 'Title':
                document.getElementById('game-title').textContent = 'Ultimate Gacha';
                document.getElementById('game-title').className = '';
                break;
                
            case 'Background':
                const gameContainer = document.getElementById('game-container');
                gameContainer.style.backgroundImage = 'linear-gradient(45deg, var(--background-color), #232644)';
                gameContainer.style.backgroundColor = '';
                
                const starfield = document.getElementById('starfield-background');
                if (starfield) starfield.remove();
                break;
                
            case 'Font':
                document.body.classList.remove('custom-font-common', 'custom-font-uncommon', 'custom-font-rare', 'custom-font-epic', 'custom-font-legendary', 'custom-font-mythical');
                break;
                
            case 'Color Scheme':
                document.documentElement.style.setProperty('--primary-color', '#ff458e');
                document.documentElement.style.setProperty('--secondary-color', '#5642fc');
                document.documentElement.style.setProperty('--tertiary-color', '#2cdaff');
                break;
                
            case 'Special Effect':
                document.getElementById('gacha-button').style.boxShadow = '0 0 20px rgba(255, 69, 142, 0.5)';
                document.getElementById('gacha-button').style.border = 'none';
                document.getElementById('gacha-button').style.animation = 'none';
                document.getElementById('gacha-button').style.backgroundImage = 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))';
                document.getElementById('gacha-button').style.backgroundSize = '';
                
                const buttonParticles = document.getElementById('button-particles');
                if (buttonParticles) buttonParticles.remove();
                
                const mythicalParticles = document.getElementById('mythical-particles');
                if (mythicalParticles) mythicalParticles.remove();
                break;
                
            case 'Border':
                document.getElementById('header').style.borderBottom = 'none';
                document.getElementById('header').style.borderImage = 'none';
                document.getElementById('header').style.animation = 'none';
                document.getElementById('inventory-panel').style.borderTop = 'none';
                document.getElementById('inventory-panel').style.borderImage = 'none';
                document.getElementById('inventory-panel').style.boxShadow = '0 -5px 20px rgba(0, 0, 0, 0.3)';
                document.getElementById('inventory-panel').style.animation = 'none';
                break;
                
            case 'Icon':
                document.querySelector('.currency-icon').textContent = '💎';
                break;
        }
    },
    
    // Get color values based on rarity
    getColorForRarity(rarity, colorType) {
        const colors = {
            common: {
                primary: '#a0a0a0',
                secondary: '#c0c0c0',
                tertiary: '#e0e0e0'
            },
            uncommon: {
                primary: '#69cf5d',
                secondary: '#a0e898',
                tertiary: '#d6f4d1'
            },
            rare: {
                primary: '#4287f5',
                secondary: '#75adff',
                tertiary: '#a8d1ff'
            },
            epic: {
                primary: '#a054ef',
                secondary: '#c78aff',
                tertiary: '#e3c2ff'
            },
            legendary: {
                primary: '#ffbc27',
                secondary: '#ffd780',
                tertiary: '#ffe6b3'
            },
            mythical: {
                primary: '#ff4242',
                secondary: '#ff7c7c',
                tertiary: '#ffb3b3'
            }
        };
        
        return colors[rarity][colorType] || colors.common[colorType];
    },
    
    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '20px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },
    
    // Save inventory to localStorage
    saveInventory() {
        const data = {
            items: this.items,
            equipped: this.equipped
        };
        
        localStorage.setItem('gachaInventory', JSON.stringify(data));
    },
    
    // Load inventory from localStorage
    loadInventory() {
        const data = localStorage.getItem('gachaInventory');
        
        if (data) {
            const parsed = JSON.parse(data);
            this.items = parsed.items || [];
            this.equipped = parsed.equipped || {};
            
            console.log(`Loaded ${this.items.length} items from storage`);
            
            // Apply effects for all equipped items
            for (const type in this.equipped) {
                if (this.equipped[type]) {
                    this.applyItemEffects(this.equipped[type]);
                }
            }
        }
    },
    
    // Initialize the inventory
    init() {
        // Load saved inventory
        this.loadInventory();
        
        // Set up tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to the clicked tab
                button.classList.add('active');
                
                // Display the corresponding items
                this.displayItems(button.dataset.tab);
            });
        });
        
        // Set up inventory toggle button
        const inventoryToggle = document.getElementById('inventory-toggle');
        const inventoryPanel = document.getElementById('inventory-panel');
        
        inventoryToggle.addEventListener('click', () => {
            inventoryPanel.classList.toggle('visible');
            
            if (inventoryPanel.classList.contains('visible')) {
                // First remove the hidden class
                inventoryPanel.classList.remove('hidden');
                // Then set transform and display items
                inventoryPanel.style.transform = 'translateY(0)';
                // Display items for the current tab
                this.displayItems(this.activeTab);
            } else {
                // Animate sliding down
                inventoryPanel.style.transform = 'translateY(100%)';
                // Add hidden class after animation completes
                setTimeout(() => {
                    inventoryPanel.classList.add('hidden');
                }, 300);
            }
        });
        
        console.log('Inventory system initialized with', this.items.length, 'items');
    },
    
    // Helper function to add CSS styles if they don't exist
    addStyleIfMissing(id, cssText) {
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = cssText;
            document.head.appendChild(style);
        }
    },
    
    // Helper function to create particle effects around the title
    createTitleParticles(titleElement, options) {
        const { count, size, color, glow, duration, pattern = 0 } = options;
        
        // Create a wrapper if it doesn't exist
        let titleWrapper = document.getElementById('title-wrapper');
        if (!titleWrapper) {
            titleWrapper = document.createElement('div');
            titleWrapper.id = 'title-wrapper';
            titleWrapper.style.position = 'relative';
            titleWrapper.style.display = 'inline-block';
            titleWrapper.style.zIndex = '10';
            
            // Replace the title with wrapped version
            const parent = titleElement.parentNode;
            parent.replaceChild(titleWrapper, titleElement);
            titleWrapper.appendChild(titleElement);
        }
        
        // Create or get particle container
        let particleContainer = document.getElementById('title-particles');
        if (!particleContainer) {
            particleContainer = document.createElement('div');
            particleContainer.id = 'title-particles';
            particleContainer.style.position = 'absolute';
            particleContainer.style.top = '-20px';
            particleContainer.style.left = '-20px';
            particleContainer.style.width = 'calc(100% + 40px)';
            particleContainer.style.height = 'calc(100% + 40px)';
            particleContainer.style.pointerEvents = 'none';
            titleWrapper.appendChild(particleContainer);
        } else {
            // Clear existing particles
            particleContainer.innerHTML = '';
        }
        
        // Different particle distribution patterns
        const getParticlePosition = (i) => {
            const positions = [
                // Pattern 0: Random all around (original)
                () => {
                    return {
                        x: -20 + Math.random() * 140,
                        y: -20 + Math.random() * 140
                    };
                },
                // Pattern 1: Circular pattern
                () => {
                    const angle = (i / count) * Math.PI * 2;
                    const distance = 30 + Math.random() * 20;
                    return {
                        x: 50 + Math.cos(angle) * distance,
                        y: 50 + Math.sin(angle) * distance
                    };
                },
                // Pattern 2: Horizontal line
                () => {
                    return {
                        x: (i / count) * 100,
                        y: 50 + (Math.random() * 20 - 10)
                    };
                },
                // Pattern 3: Diagonal corners
                () => {
                    // Alternate between corners
                    if (i % 2 === 0) {
                        return {
                            x: Math.random() * 30,
                            y: Math.random() * 30
                        };
                    } else {
                        return {
                            x: 70 + Math.random() * 30,
                            y: 70 + Math.random() * 30
                        };
                    }
                }
            ];
            
            return positions[pattern % positions.length]();
        };
        
        // Create particles
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'title-particle';
            particle.style.position = 'absolute';
            particle.style.width = size;
            particle.style.height = size;
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 8px ${glow}`;
            particle.style.opacity = '0.7';
            
            // Get position based on pattern
            const pos = getParticlePosition(i);
            
            particle.style.left = `${pos.x}%`;
            particle.style.top = `${pos.y}%`;
            
            // Different animation patterns based on pattern type
            const animDuration = duration + Math.random() * 2;
            
            const animations = [
                // Original random movement
                [
                    { transform: 'translate(0, 0) scale(1)', opacity: 0.7 },
                    { transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.5)`, opacity: 1, offset: 0.5 },
                    { transform: 'translate(0, 0) scale(1)', opacity: 0.7 }
                ],
                // Pulsing in place
                [
                    { transform: 'translate(0, 0) scale(1)', opacity: 0.7 },
                    { transform: 'translate(0, 0) scale(1.8)', opacity: 1, offset: 0.5 },
                    { transform: 'translate(0, 0) scale(1)', opacity: 0.7 }
                ],
                // Orbiting movement
                [
                    { transform: `rotate(0deg) translateX(5px) rotate(0deg)`, opacity: 0.7 },
                    { transform: `rotate(180deg) translateX(5px) rotate(-180deg)`, opacity: 1, offset: 0.5 },
                    { transform: `rotate(360deg) translateX(5px) rotate(-360deg)`, opacity: 0.7 }
                ],
                // Bouncing
                [
                    { transform: 'translateY(0) scale(1)', opacity: 0.7 },
                    { transform: 'translateY(-10px) scale(1.2)', opacity: 1, offset: 0.5 },
                    { transform: 'translateY(0) scale(1)', opacity: 0.7 }
                ]
            ];
            
            particle.animate(animations[pattern % animations.length], {
                duration: animDuration * 1000,
                iterations: Infinity
            });
            
            particleContainer.appendChild(particle);
        }
    },
    
    // Helper function to create flame effects around the title
    createTitleFlames(titleElement, options) {
        const { count, colors, pattern = 0 } = options;
        
        // Create a wrapper if it doesn't exist
        let titleWrapper = document.getElementById('title-wrapper');
        if (!titleWrapper) {
            titleWrapper = document.createElement('div');
            titleWrapper.id = 'title-wrapper';
            titleWrapper.style.position = 'relative';
            titleWrapper.style.display = 'inline-block';
            titleWrapper.style.zIndex = '10';
            
            // Replace the title with wrapped version
            const parent = titleElement.parentNode;
            parent.replaceChild(titleWrapper, titleElement);
            titleWrapper.appendChild(titleElement);
        }
        
        // Create or get flame container
        let flameContainer = document.getElementById('title-flames');
        if (!flameContainer) {
            flameContainer = document.createElement('div');
            flameContainer.id = 'title-flames';
            flameContainer.style.position = 'absolute';
            flameContainer.style.top = '-30px';
            flameContainer.style.left = '-30px';
            flameContainer.style.width = 'calc(100% + 60px)';
            flameContainer.style.height = 'calc(100% + 60px)';
            flameContainer.style.pointerEvents = 'none';
            flameContainer.style.zIndex = '5';
            titleWrapper.insertBefore(flameContainer, titleElement);
        } else {
            // Clear existing flames
            flameContainer.innerHTML = '';
        }
        
        // Set default colors if not provided
        const flameColors = colors || ['#ff4242', '#ff7c7c'];
        
        // Different flame distribution patterns
        const getFlamePosition = (i) => {
            const positions = [
                // Pattern 0: Evenly distributed around (original)
                () => {
                    const angle = (i / count) * Math.PI * 2;
                    const distance = 40 + Math.random() * 20;
                    return {
                        x: 50 + Math.cos(angle) * distance,
                        y: 50 + Math.sin(angle) * distance
                    };
                },
                // Pattern 1: Top heavy flames
                () => {
                    const angle = (i / count) * Math.PI;
                    const distance = 40 + Math.random() * 20;
                    return {
                        x: 50 + Math.cos(angle) * distance,
                        y: 30 + Math.sin(angle) * distance
                    };
                },
                // Pattern 2: Bottom only flames
                () => {
                    const angle = Math.PI + (i / count) * Math.PI;
                    const distance = 40 + Math.random() * 20;
                    return {
                        x: 50 + Math.cos(angle) * distance,
                        y: 70 + Math.sin(angle) * distance
                    };
                },
                // Pattern 3: Clustered in groups
                () => {
                    // Create 3-4 clusters of flames
                    const clusterCount = 4;
                    const clusterIndex = Math.floor(i / (count / clusterCount));
                    const angle = (clusterIndex / clusterCount) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
                    const distance = 40 + Math.random() * 15;
                    return {
                        x: 50 + Math.cos(angle) * distance,
                        y: 50 + Math.sin(angle) * distance
                    };
                }
            ];
            
            return positions[pattern % positions.length]();
        };
        
        // Different flame shapes
        const getFlameShape = (i, pattern) => {
            const shapes = [
                // Pattern 0: Original flame shape
                {
                    width: `${10 + Math.random() * 15}px`,
                    height: `${20 + Math.random() * 30}px`,
                    borderRadius: '50% 50% 20% 20%'
                },
                // Pattern 1: Taller flames
                {
                    width: `${8 + Math.random() * 10}px`,
                    height: `${30 + Math.random() * 40}px`,
                    borderRadius: '40% 40% 20% 20%'
                },
                // Pattern 2: Wider flames
                {
                    width: `${15 + Math.random() * 20}px`,
                    height: `${15 + Math.random() * 20}px`,
                    borderRadius: '60% 60% 30% 30%'
                },
                // Pattern 3: Spiky flames
                {
                    width: `${8 + Math.random() * 8}px`,
                    height: `${25 + Math.random() * 25}px`,
                    borderRadius: '30% 30% 10% 10%'
                }
            ];
            
            return shapes[pattern % shapes.length];
        };
        
        // Create flames
        for (let i = 0; i < count; i++) {
            const flame = document.createElement('div');
            flame.className = 'flame-particle';
            flame.style.position = 'absolute';
            
            // Get shape based on pattern
            const shape = getFlameShape(i, pattern);
            flame.style.width = shape.width;
            flame.style.height = shape.height;
            flame.style.borderRadius = shape.borderRadius;
            
            // Get colors
            const color1 = flameColors[1] || flameColors[0];
            const color2 = flameColors[0];
            flame.style.background = `radial-gradient(ellipse at bottom, ${color1}, ${color2})`;
            flame.style.boxShadow = `0 0 15px ${color2}`;
            flame.style.filter = 'blur(2px)';
            flame.style.opacity = '0.9';
            flame.style.mixBlendMode = 'screen';
            
            // Get position based on pattern
            const pos = getFlamePosition(i);
            
            flame.style.left = `${pos.x}%`;
            flame.style.top = `${pos.y}%`;
            
            // Different animation durations for variety
            const animDuration = 2 + Math.random() * 2;
            const animDelay = Math.random() * 2;
            
            // Animate each flame
            flame.style.animation = `flame ${animDuration}s ease-in-out infinite`;
            flame.style.animationDelay = `${animDelay}s`;
            
            flameContainer.appendChild(flame);
        }
    },
    
    // Helper function to hash a string
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },
    
    // Helper function to create effects based on title name
    titleNameToEffects(titleName, rarity) {
        // Generate a hash value from the title name
        const nameHash = this.hashString(titleName);
        
        // Effects for epic titles
        if (rarity === 'epic') {
            // Base colors that we'll modify based on the title
            const baseColors = [
                ['#a054ef', '#c78aff', '#8a46d1'], // Original purple
                ['#ef54d3', '#ff8ade', '#d146b7'], // Pink
                ['#5465ef', '#8aa2ff', '#4651d1'], // Blue 
                ['#54efef', '#8affff', '#46b7d1'], // Cyan
                ['#54ef83', '#8affc2', '#46d18d'], // Green
                ['#c454ef', '#e28aff', '#a846d1'], // Violet
                ['#ef54a1', '#ff8ac7', '#d1468a'], // Rose
                ['#5493ef', '#8ac2ff', '#4682d1']  // Azure
            ];
            
            // Calculate a color variation based on the first letter of the title
            const firstChar = titleName.charCodeAt(0) || 65;
            const colorIndex = firstChar % baseColors.length;
            const palette = baseColors[colorIndex];
            
            // Calculate animation speed based on title length
            const duration = 3 + (titleName.length % 4);
            
            // Calculate animation pattern based on vowel count in title
            const vowelCount = (titleName.match(/[aeiou]/gi) || []).length;
            const animationPatterns = [
                'title-flow',      // Original flowing gradient
                'title-pulse',     // Pulsing effect
                'title-rainbow',   // Rainbow hue rotation
                'title-zoom',      // Subtle zoom
                'title-wave',      // Wave effect
                'title-shimmer',   // Shimmer effect
                'title-flicker',   // Gentle flicker
                'title-rotate'     // Rotation effect
            ];
            const animation = animationPatterns[vowelCount % animationPatterns.length];
            
            // Calculate glow intensity based on consonant count
            const consonantCount = titleName.length - vowelCount;
            const glowIntensity = 0.5 + (consonantCount * 0.1);
            
            return {
                type: 'epic',
                colors: palette,
                duration: duration,
                animation: animation,
                glow: glowIntensity,
                textShadow: `0 0 ${10 + consonantCount * 2}px ${palette[0]}`
            };
        }
        // Effects for legendary titles
        else if (rarity === 'legendary') {
            // Base colors for legendary (gold variations)
            const baseColors = [
                ['#ffbc27', '#ffd780', '#ff9800'], // Original gold
                ['#ffc627', '#fff380', '#ffb400'], // Yellow gold
                ['#e5be3d', '#f5e28a', '#c19526'], // Antique gold
                ['#ffae00', '#ffd27f', '#ff8c00'], // Orange gold
                ['#d4af37', '#f4e5aa', '#b7950b'], // Vegas gold
                ['#d1b000', '#ffe866', '#aa8800'], // Metallic gold
                ['#b5a642', '#e5d68f', '#8e7f31'], // Brass
                ['#cfb53b', '#efd98b', '#a18b29']  // Old gold
            ];
            
            // Calculate index based on sum of character codes in title
            let charSum = 0;
            for (let i = 0; i < titleName.length; i++) {
                charSum += titleName.charCodeAt(i);
            }
            const colorIndex = charSum % baseColors.length;
            const palette = baseColors[colorIndex];
            
            // Calculate particle count based on title length
            const particleCount = 6 + (titleName.length % 10);
            const particleSize = 3 + (titleName.length % 5);
            
            // Calculate animation based on number of words in title
            const wordCount = titleName.split(/\s+/).length;
            const animationPatterns = [
                'title-legendary',         // Original
                'title-legendary-spin',    // Spinning
                'title-legendary-pulse',   // Pulsing
                'title-legendary-flicker', // Flickering
                'title-legendary-wave',    // Wave
                'title-legendary-bounce',  // Bounce
                'title-legendary-glow',    // Glowing
                'title-legendary-orbit'    // Orbiting
            ];
            const animation = animationPatterns[wordCount % animationPatterns.length];
            
            // Calculate pattern based on uppercase letters
            const uppercaseCount = titleName.split('').filter(c => c >= 'A' && c <= 'Z').length;
            
            return {
                type: 'legendary',
                colors: palette,
                animation: animation,
                particles: {
                    count: particleCount,
                    size: `${particleSize}px`,
                    pattern: uppercaseCount % 5 // 5 different patterns
                }
            };
        }
        // Effects for mythical titles
        else if (rarity === 'mythical') {
            // Base colors for mythical (fire variations)
            const baseColors = [
                ['#ff4242', '#ff7c7c'], // Original red
                ['#ff4293', '#ff7ce2'], // Pink
                ['#8442ff', '#c67cff'], // Purple
                ['#42bfff', '#7cd5ff'], // Blue
                ['#ff6d42', '#ffa17c'], // Orange
                ['#42ff83', '#7cffa1'], // Green
                ['#ffdd42', '#ffeb7c'], // Yellow
                ['#42ffd1', '#7cffe0']  // Teal
            ];
            
            // Calculate index based on letter distribution
            let letterMap = {};
            for (let i = 0; i < titleName.length; i++) {
                const char = titleName[i].toLowerCase();
                if (char >= 'a' && char <= 'z') {
                    letterMap[char] = (letterMap[char] || 0) + 1;
                }
            }
            const uniqueLetters = Object.keys(letterMap).length;
            const colorIndex = uniqueLetters % baseColors.length;
            const palette = baseColors[colorIndex];
            
            // Calculate flame count based on title length
            const flameCount = 8 + (titleName.length % 16);
            
            // Calculate animation based on special characters
            const specialCharCount = titleName.split('').filter(c => !(/[a-zA-Z0-9\s]/.test(c))).length;
            const animationPatterns = [
                'title-mythical',          // Original
                'title-mythical-intense',  // More intense
                'title-mythical-electric', // Electric effect
                'title-mythical-vortex',   // Vortex effect
                'title-mythical-pulse',    // Pulsing
                'title-mythical-wave',     // Wave
                'title-mythical-burst',    // Bursting
                'title-mythical-chaos'     // Chaotic
            ];
            const animation = animationPatterns[(specialCharCount + uniqueLetters) % animationPatterns.length];
            
            // Calculate flame pattern based on title entropy
            const titleEntropy = this.calculateEntropy(titleName);
            const patternIndex = Math.floor(titleEntropy * 5) % 5; // 5 different patterns
            
            return {
                type: 'mythical',
                colors: palette,
                animation: animation,
                flames: {
                    count: flameCount,
                    pattern: patternIndex
                }
            };
        }
        
        // Default return for other rarities
        return { type: rarity };
    },
    
    // Helper function to calculate text entropy (diversity of characters)
    calculateEntropy(text) {
        if (!text || text.length === 0) return 0;
        
        const freq = {};
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            freq[char] = (freq[char] || 0) + 1;
        }
        
        let entropy = 0;
        for (const char in freq) {
            const probability = freq[char] / text.length;
            entropy -= probability * Math.log2(probability);
        }
        
        // Normalize to 0-1 range (typical english text has entropy of ~4.5)
        return Math.min(entropy / 5, 1);
    },
    
    // Helper method to add Epic animation keyframes
    addEpicAnimationKeyframes(config) {
        const palette = config.colors;
        
        this.addStyleIfMissing('title-animation-style', `
            @keyframes title-flow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes title-pulse {
                0% { filter: brightness(1) drop-shadow(0 0 10px ${palette[0]}); }
                50% { filter: brightness(1.3) drop-shadow(0 0 15px ${palette[1]}); }
                100% { filter: brightness(1) drop-shadow(0 0 10px ${palette[0]}); }
            }
            
            @keyframes title-rainbow {
                0% { filter: hue-rotate(0deg) drop-shadow(0 0 10px ${palette[0]}); }
                100% { filter: hue-rotate(360deg) drop-shadow(0 0 10px ${palette[0]}); }
            }
            
            @keyframes title-zoom {
                0% { transform: scale(1); filter: drop-shadow(0 0 10px ${palette[0]}); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 15px ${palette[1]}); }
                100% { transform: scale(1); filter: drop-shadow(0 0 10px ${palette[0]}); }
            }
            
            @keyframes title-wave {
                0% { transform: translateY(0px); filter: drop-shadow(0 0 10px ${palette[0]}); }
                25% { transform: translateY(-5px); filter: drop-shadow(0 0 12px ${palette[1]}); }
                50% { transform: translateY(0px); filter: drop-shadow(0 0 15px ${palette[2]}); }
                75% { transform: translateY(5px); filter: drop-shadow(0 0 12px ${palette[1]}); }
                100% { transform: translateY(0px); filter: drop-shadow(0 0 10px ${palette[0]}); }
            }
            
            @keyframes title-shimmer {
                0% { background-position: 0% 50%; opacity: 0.9; }
                50% { background-position: 100% 50%; opacity: 1; }
                100% { background-position: 0% 50%; opacity: 0.9; }
            }
            
            @keyframes title-flicker {
                0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                    filter: drop-shadow(0 0 10px ${palette[0]});
                    opacity: 1;
                }
                20%, 24%, 55% { 
                    filter: drop-shadow(0 0 5px ${palette[0]});
                    opacity: 0.9;
                }
            }
            
            @keyframes title-rotate {
                0% { transform: rotate(-1deg); filter: drop-shadow(0 0 10px ${palette[0]}); }
                50% { transform: rotate(1deg); filter: drop-shadow(0 0 15px ${palette[1]}); }
                100% { transform: rotate(-1deg); filter: drop-shadow(0 0 10px ${palette[0]}); }
            }
        `);
    },
    
    // Helper method to add Legendary animation keyframes
    addLegendaryAnimationKeyframes(config) {
        const palette = config.colors;
        
        this.addStyleIfMissing('title-animation-style', `
            @keyframes title-legendary {
                0% { background-position: 0% 50%; filter: drop-shadow(0 0 5px ${palette[0]}); }
                50% { background-position: 100% 50%; filter: drop-shadow(0 0 15px ${palette[0]}); }
                100% { background-position: 0% 50%; filter: drop-shadow(0 0 5px ${palette[0]}); }
            }
            
            @keyframes title-legendary-spin {
                0% { background-position: 0% 50%; filter: drop-shadow(0 0 5px ${palette[0]}) rotate(0deg); }
                50% { background-position: 100% 50%; filter: drop-shadow(0 0 15px ${palette[0]}) rotate(1deg); }
                100% { background-position: 0% 50%; filter: drop-shadow(0 0 5px ${palette[0]}) rotate(0deg); }
            }
            
            @keyframes title-legendary-pulse {
                0% { background-position: 0% 50%; filter: brightness(1) drop-shadow(0 0 5px ${palette[0]}); }
                50% { background-position: 100% 50%; filter: brightness(1.3) drop-shadow(0 0 15px ${palette[1]}); }
                100% { background-position: 0% 50%; filter: brightness(1) drop-shadow(0 0 5px ${palette[0]}); }
            }
            
            @keyframes title-legendary-flicker {
                0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                    background-position: 0% 50%;
                    filter: drop-shadow(0 0 5px ${palette[0]});
                    opacity: 1;
                }
                20%, 24%, 55% { 
                    background-position: 100% 50%; 
                    filter: drop-shadow(0 0 15px ${palette[0]});
                    opacity: 0.8;
                }
            }
            
            @keyframes title-legendary-wave {
                0% { transform: translateY(0px); filter: drop-shadow(0 0 5px ${palette[0]}); }
                25% { transform: translateY(-3px); filter: drop-shadow(0 0 10px ${palette[1]}); }
                50% { transform: translateY(0px); filter: drop-shadow(0 0 15px ${palette[2]}); }
                75% { transform: translateY(3px); filter: drop-shadow(0 0 10px ${palette[1]}); }
                100% { transform: translateY(0px); filter: drop-shadow(0 0 5px ${palette[0]}); }
            }
            
            @keyframes title-legendary-bounce {
                0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 5px ${palette[0]}); }
                50% { transform: translateY(-5px); filter: drop-shadow(0 0 15px ${palette[0]}); }
            }
            
            @keyframes title-legendary-glow {
                0% { text-shadow: 0 0 5px ${palette[0]}, 0 0 10px ${palette[0]}; }
                50% { text-shadow: 0 0 10px ${palette[0]}, 0 0 20px ${palette[0]}, 0 0 30px ${palette[0]}; }
                100% { text-shadow: 0 0 5px ${palette[0]}, 0 0 10px ${palette[0]}; }
            }
            
            @keyframes title-legendary-orbit {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `);
    },
    
    // Helper method to add Mythical animation keyframes
    addMythicalAnimationKeyframes(config) {
        const palette = config.colors;
        
        this.addStyleIfMissing('title-animation-style', `
            @keyframes title-mythical {
                0% { background-position: 0% 50%; filter: hue-rotate(0deg) drop-shadow(0 0 15px ${palette[0]}); }
                25% { filter: hue-rotate(90deg) drop-shadow(0 0 20px ${palette[0]}); }
                50% { background-position: 100% 50%; filter: hue-rotate(180deg) drop-shadow(0 0 25px ${palette[0]}); }
                75% { filter: hue-rotate(270deg) drop-shadow(0 0 20px ${palette[0]}); }
                100% { background-position: 0% 50%; filter: hue-rotate(360deg) drop-shadow(0 0 15px ${palette[0]}); }
            }
            
            @keyframes title-mythical-intense {
                0% { background-position: 0% 50%; filter: hue-rotate(0deg) contrast(1.2) drop-shadow(0 0 20px ${palette[0]}); }
                25% { filter: hue-rotate(90deg) contrast(1.5) drop-shadow(0 0 25px ${palette[0]}); }
                50% { background-position: 100% 50%; filter: hue-rotate(180deg) contrast(1.8) drop-shadow(0 0 30px ${palette[0]}); }
                75% { filter: hue-rotate(270deg) contrast(1.5) drop-shadow(0 0 25px ${palette[0]}); }
                100% { background-position: 0% 50%; filter: hue-rotate(360deg) contrast(1.2) drop-shadow(0 0 20px ${palette[0]}); }
            }
            
            @keyframes title-mythical-electric {
                0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                    background-position: 0% 50%;
                    filter: hue-rotate(0deg) drop-shadow(0 0 15px ${palette[0]});
                    opacity: 1;
                }
                20%, 24%, 55% { 
                    background-position: 100% 50%; 
                    filter: hue-rotate(180deg) drop-shadow(0 0 25px ${palette[0]});
                    opacity: 0.9;
                    transform: translate(2px, 0);
                }
            }
            
            @keyframes title-mythical-vortex {
                0% { background-position: 0% 50%; filter: hue-rotate(0deg) drop-shadow(0 0 15px ${palette[0]}) rotate(0deg); }
                50% { background-position: 100% 50%; filter: hue-rotate(180deg) drop-shadow(0 0 25px ${palette[0]}) rotate(2deg); }
                100% { background-position: 0% 50%; filter: hue-rotate(360deg) drop-shadow(0 0 15px ${palette[0]}) rotate(0deg); }
            }
            
            @keyframes title-mythical-pulse {
                0% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 15px ${palette[0]}); }
                50% { transform: scale(1.05); filter: brightness(1.5) drop-shadow(0 0 25px ${palette[0]}); }
                100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 15px ${palette[0]}); }
            }
            
            @keyframes title-mythical-wave {
                0% { transform: translateY(0) skewX(0deg); filter: hue-rotate(0deg) drop-shadow(0 0 15px ${palette[0]}); }
                25% { transform: translateY(-5px) skewX(-2deg); filter: hue-rotate(90deg) drop-shadow(0 0 20px ${palette[0]}); }
                50% { transform: translateY(0) skewX(0deg); filter: hue-rotate(180deg) drop-shadow(0 0 25px ${palette[0]}); }
                75% { transform: translateY(5px) skewX(2deg); filter: hue-rotate(270deg) drop-shadow(0 0 20px ${palette[0]}); }
                100% { transform: translateY(0) skewX(0deg); filter: hue-rotate(360deg) drop-shadow(0 0 15px ${palette[0]}); }
            }
            
            @keyframes title-mythical-burst {
                0% { transform: scale(1); filter: brightness(1) contrast(1) blur(0) drop-shadow(0 0 15px ${palette[0]}); }
                15% { transform: scale(1.1); filter: brightness(1.3) contrast(1.1) blur(1px) drop-shadow(0 0 30px ${palette[0]}); }
                30% { transform: scale(1); filter: brightness(1) contrast(1) blur(0) drop-shadow(0 0 15px ${palette[0]}); }
                100% { transform: scale(1); filter: brightness(1) contrast(1) blur(0) drop-shadow(0 0 15px ${palette[0]}); }
            }
            
            @keyframes title-mythical-chaos {
                0% { transform: translate(0, 0) rotate(0deg); filter: hue-rotate(0deg) drop-shadow(0 0 15px ${palette[0]}); }
                10% { transform: translate(2px, -2px) rotate(0.5deg); filter: hue-rotate(36deg) drop-shadow(0 0 17px ${palette[0]}); }
                20% { transform: translate(-1px, 1px) rotate(-0.5deg); filter: hue-rotate(72deg) drop-shadow(0 0 19px ${palette[0]}); }
                30% { transform: translate(1px, 2px) rotate(0deg); filter: hue-rotate(108deg) drop-shadow(0 0 21px ${palette[0]}); }
                40% { transform: translate(2px, -1px) rotate(0.5deg); filter: hue-rotate(144deg) drop-shadow(0 0 23px ${palette[0]}); }
                50% { transform: translate(-2px, -2px) rotate(-0.5deg); filter: hue-rotate(180deg) drop-shadow(0 0 25px ${palette[0]}); }
                60% { transform: translate(1px, 1px) rotate(0deg); filter: hue-rotate(216deg) drop-shadow(0 0 23px ${palette[0]}); }
                70% { transform: translate(-1px, 2px) rotate(0.5deg); filter: hue-rotate(252deg) drop-shadow(0 0 21px ${palette[0]}); }
                80% { transform: translate(-2px, -1px) rotate(-0.5deg); filter: hue-rotate(288deg) drop-shadow(0 0 19px ${palette[0]}); }
                90% { transform: translate(2px, 1px) rotate(0deg); filter: hue-rotate(324deg) drop-shadow(0 0 17px ${palette[0]}); }
                100% { transform: translate(0, 0) rotate(0deg); filter: hue-rotate(360deg) drop-shadow(0 0 15px ${palette[0]}); }
            }
            
            @keyframes flame {
                0%, 100% { 
                    transform: translateY(0) scale(1) rotate(0deg); 
                    filter: brightness(1) hue-rotate(0deg);
                }
                25% { 
                    transform: translateY(-15px) scale(1.2) rotate(-5deg); 
                    filter: brightness(1.1) hue-rotate(15deg);
                }
                50% { 
                    transform: translateY(-7px) scale(1.1) rotate(5deg); 
                    filter: brightness(1.2) hue-rotate(30deg);
                }
                75% { 
                    transform: translateY(-15px) scale(1.2) rotate(-5deg); 
                    filter: brightness(1.1) hue-rotate(15deg);
                }
            }
        `);
    }
};

// Export inventory
window.inventory = inventory; 