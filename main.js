// Main.js - Entry point for the gacha game

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Ultimate Gacha Game...');
    
    // Initialize systems
    window.inventory.init();
    window.gacha.init();
    
    // Add debug currency button in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addDebugFeatures();
    }
    
    // Set Z-indices properly
    document.getElementById('header').style.zIndex = '5';
    document.getElementById('inventory-panel').style.zIndex = '20';
    document.getElementById('inventory-toggle').style.zIndex = '30';
    
    console.log('Game initialization complete');
});

// Add debug features for development
function addDebugFeatures() {
    // Add a button to add currency
    const debugButton = document.createElement('button');
    debugButton.id = 'debug-button';
    debugButton.textContent = 'Add 500 Gems';
    debugButton.style.position = 'fixed';
    debugButton.style.top = '10px';
    debugButton.style.left = '10px';
    debugButton.style.zIndex = '1000';
    debugButton.style.padding = '5px 10px';
    debugButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    debugButton.style.color = 'white';
    debugButton.style.border = '1px solid #444';
    debugButton.style.borderRadius = '5px';
    debugButton.style.cursor = 'pointer';
    
    debugButton.addEventListener('click', () => {
        window.gacha.currency += 500;
        document.getElementById('currency-amount').textContent = window.gacha.currency;
        console.log('Added 500 gems for debugging');
    });
    
    document.body.appendChild(debugButton);
    
    // Add shortcut keys for testing
    window.addEventListener('keydown', (e) => {
        // Press 'G' to add currency
        if (e.key === 'g' || e.key === 'G') {
            window.gacha.currency += 500;
            document.getElementById('currency-amount').textContent = window.gacha.currency;
        }
        
        // Press '1' through '6' to test different rarity animations
        if (e.key >= '1' && e.key <= '6') {
            const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical'];
            const rarityIndex = parseInt(e.key) - 1;
            
            if (rarityIndex >= 0 && rarityIndex < rarities.length) {
                const testItem = {
                    id: 'test-' + Date.now(),
                    type: 'Title',
                    name: `Test ${rarities[rarityIndex].toUpperCase()} Item`,
                    rarity: rarities[rarityIndex],
                    equipped: false,
                    dateAcquired: new Date().toISOString()
                };
                
                // Hide gacha button
                document.getElementById('gacha-area').style.display = 'none';
                
                // Play animation and show result
                (async () => {
                    try {
                        await window.gachaAnimations.playAnimation(testItem.rarity);
                        window.gachaAnimations.displayResult(testItem.rarity, testItem.name);
                        
                        // Add collect button event
                        const collectButton = document.getElementById('collect-button');
                        collectButton.addEventListener('click', () => {
                            // Add to inventory
                            window.inventory.addItem(testItem);
                            
                            // Hide animation area
                            document.getElementById('gacha-animation').classList.add('hidden');
                            document.getElementById('result-display').classList.add('hidden');
                            
                            // Show gacha button
                            document.getElementById('gacha-area').style.display = 'flex';
                            
                            // Remove event listener
                            collectButton.replaceWith(collectButton.cloneNode(true));
                        }, { once: true });
                    } catch (error) {
                        console.error('Animation test error:', error);
                        document.getElementById('gacha-area').style.display = 'flex';
                    }
                })();
            }
        }
    });
    
    console.log('Debug features enabled');
}

// Handle browser resize events for responsiveness
window.addEventListener('resize', () => {
    // If inventory is visible, make sure its height is appropriate
    const inventoryPanel = document.getElementById('inventory-panel');
    if (inventoryPanel.classList.contains('visible')) {
        if (window.innerWidth <= 768) {
            inventoryPanel.style.height = '80%';
        } else {
            inventoryPanel.style.height = '70%';
        }
    }
});

// Handle visibility changes (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Restore animations that might have been paused
        const animations = document.getAnimations();
        animations.forEach(animation => {
            if (animation.playState === 'paused') {
                animation.play();
            }
        });
    }
}); 