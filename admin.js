// Admin panel functionality
const admin = {
    // Constants
    password: "thanisthebest",
    validRarities: ["common", "uncommon", "rare", "epic", "legendary", "mythical"],
    
    // State
    authenticated: false,
    activeTab: 'items',
    
    // DOM Elements
    elements: {
        adminToggle: document.getElementById('admin-toggle'),
        adminPanel: document.getElementById('admin-panel'),
        closeAdmin: document.getElementById('close-admin'),
        adminLogin: document.getElementById('admin-login'),
        adminPassword: document.getElementById('admin-password'),
        adminLoginButton: document.getElementById('admin-login-button'),
        loginError: document.getElementById('login-error'),
        adminControls: document.getElementById('admin-controls'),
        adminCategory: document.getElementById('admin-category'),
        adminItemsContainer: document.getElementById('admin-items-container'),
        
        // Tab elements
        tabButtons: null, // Will be set in init
        tabContents: null, // Will be set in init
        
        // Rarity chance elements
        chanceCommon: document.getElementById('chance-common'),
        chanceUncommon: document.getElementById('chance-uncommon'),
        chanceRare: document.getElementById('chance-rare'),
        chanceEpic: document.getElementById('chance-epic'),
        chanceLegendary: document.getElementById('chance-legendary'),
        chanceMythical: document.getElementById('chance-mythical'),
        totalChance: document.getElementById('total-chance'),
        saveRarityChances: document.getElementById('save-rarity-chances'),
        
        // Title weights elements
        weightsCategory: document.getElementById('weights-category'),
        titleWeightsContainer: document.getElementById('title-weights-container'),
        saveTitleWeights: document.getElementById('save-title-weights')
    },
    
    // Initialize the admin panel
    init() {
        // Set tab elements
        this.elements.tabButtons = document.querySelectorAll('.admin-tab-button');
        this.elements.tabContents = document.querySelectorAll('.admin-tab-content');
        
        // Add event listeners for basic functionality
        this.elements.adminToggle.addEventListener('click', () => this.toggleAdminPanel());
        this.elements.closeAdmin.addEventListener('click', () => this.hideAdminPanel());
        this.elements.adminLoginButton.addEventListener('click', () => this.attemptLogin());
        this.elements.adminPassword.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.attemptLogin();
        });
        this.elements.adminCategory.addEventListener('change', () => this.loadItemsForCategory());
        
        // Add event listeners for tabs
        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });
        
        // Add event listeners for rarity chances
        const rarityInputs = [
            this.elements.chanceCommon,
            this.elements.chanceUncommon,
            this.elements.chanceRare,
            this.elements.chanceEpic,
            this.elements.chanceLegendary,
            this.elements.chanceMythical
        ];
        rarityInputs.forEach(input => {
            input.addEventListener('input', () => this.updateTotalChance());
        });
        
        this.elements.saveRarityChances.addEventListener('click', () => this.saveRarityChances());
        
        // Add event listeners for title weights
        this.elements.weightsCategory.addEventListener('change', () => this.loadTitleWeights());
        this.elements.saveTitleWeights.addEventListener('click', () => this.saveTitleWeights());
        
        console.log('Admin system initialized');
    },
    
    // Toggle the admin panel visibility
    toggleAdminPanel() {
        this.elements.adminPanel.classList.toggle('hidden');
        
        // Reset state when opening
        if (!this.elements.adminPanel.classList.contains('hidden')) {
            this.resetAdminPanel();
        }
    },
    
    // Hide the admin panel
    hideAdminPanel() {
        this.elements.adminPanel.classList.add('hidden');
    },
    
    // Reset the admin panel to initial state
    resetAdminPanel() {
        if (!this.authenticated) {
            // Show login, hide controls
            this.elements.adminLogin.classList.remove('hidden');
            this.elements.adminControls.classList.add('hidden');
            
            // Clear password field and error
            this.elements.adminPassword.value = '';
            this.elements.loginError.classList.add('hidden');
        } else {
            // Show controls, hide login
            this.elements.adminLogin.classList.add('hidden');
            this.elements.adminControls.classList.remove('hidden');
            
            // Load the active tab content
            this.switchTab(this.activeTab);
        }
    },
    
    // Switch between admin tabs
    switchTab(tabName) {
        this.activeTab = tabName;
        
        // Update tab buttons
        this.elements.tabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update tab contents
        this.elements.tabContents.forEach(content => {
            if (content.id === `admin-${tabName}-tab`) {
                content.classList.remove('hidden');
                
                // Load appropriate content
                if (tabName === 'items') {
                    this.loadItemsForCategory();
                } else if (tabName === 'rates') {
                    this.loadRarityChances();
                    this.loadTitleWeights();
                }
            } else {
                content.classList.add('hidden');
            }
        });
    },
    
    // Attempt to login with provided password
    attemptLogin() {
        const enteredPassword = this.elements.adminPassword.value;
        
        if (enteredPassword === this.password) {
            this.authenticated = true;
            this.elements.loginError.classList.add('hidden');
            
            // Show admin controls
            this.elements.adminLogin.classList.add('hidden');
            this.elements.adminControls.classList.remove('hidden');
            
            // Load the active tab
            this.switchTab(this.activeTab);
        } else {
            this.authenticated = false;
            this.elements.loginError.classList.remove('hidden');
        }
    },
    
    // Load rarity chances inputs
    loadRarityChances() {
        if (!this.authenticated) return;
        
        // Get current rarity chances from gacha
        const rarityChances = window.gacha.rarityChances;
        
        // Set input values
        this.elements.chanceCommon.value = rarityChances.common;
        this.elements.chanceUncommon.value = rarityChances.uncommon;
        this.elements.chanceRare.value = rarityChances.rare;
        this.elements.chanceEpic.value = rarityChances.epic;
        this.elements.chanceLegendary.value = rarityChances.legendary;
        this.elements.chanceMythical.value = rarityChances.mythical;
        
        // Update the total
        this.updateTotalChance();
    },
    
    // Update the total chance display
    updateTotalChance() {
        const values = [
            parseFloat(this.elements.chanceCommon.value) || 0,
            parseFloat(this.elements.chanceUncommon.value) || 0,
            parseFloat(this.elements.chanceRare.value) || 0,
            parseFloat(this.elements.chanceEpic.value) || 0,
            parseFloat(this.elements.chanceLegendary.value) || 0,
            parseFloat(this.elements.chanceMythical.value) || 0
        ];
        
        const total = values.reduce((sum, value) => sum + value, 0);
        this.elements.totalChance.textContent = total.toFixed(1);
        
        // Show warning if not 100%
        if (Math.abs(total - 100) > 0.1) {
            this.elements.totalChance.style.color = 'var(--mythical-color)';
        } else {
            this.elements.totalChance.style.color = 'var(--text-color)';
        }
    },
    
    // Save rarity chances to gacha system
    saveRarityChances() {
        if (!this.authenticated) return;
        
        // Update gacha rarityChances object
        window.gacha.rarityChances = {
            common: parseFloat(this.elements.chanceCommon.value) || 0,
            uncommon: parseFloat(this.elements.chanceUncommon.value) || 0,
            rare: parseFloat(this.elements.chanceRare.value) || 0,
            epic: parseFloat(this.elements.chanceEpic.value) || 0,
            legendary: parseFloat(this.elements.chanceLegendary.value) || 0,
            mythical: parseFloat(this.elements.chanceMythical.value) || 0
        };
        
        // Save to localStorage
        this.saveGachaSettings();
        
        // Show notification
        window.inventory.showNotification('Rarity chances updated');
    },
    
    // Load title weights
    loadTitleWeights() {
        if (!this.authenticated) return;
        
        // Get filter value
        const filter = this.elements.weightsCategory.value;
        
        // Get all title templates from gacha
        let titles = [];
        for (const type in window.gacha.itemNames) {
            if (type === "Title") {
                titles = window.gacha.itemNames[type].map(name => {
                    // Check if weight exists, otherwise set default of 1
                    const weight = (window.gacha.titleWeights && window.gacha.titleWeights[name]) || 1;
                    return { name, weight };
                });
            }
        }
        
        // Clear container
        this.elements.titleWeightsContainer.innerHTML = '';
        
        if (titles.length === 0) {
            this.elements.titleWeightsContainer.innerHTML = '<div class="no-items">No titles found.</div>';
            return;
        }
        
        // Create weight controls for each title
        titles.forEach(title => {
            // Create title element
            const titleElement = document.createElement('div');
            titleElement.className = 'title-weight-item';
            
            const nameElement = document.createElement('div');
            nameElement.className = 'title-weight-name';
            nameElement.textContent = title.name;
            
            const weightInput = document.createElement('input');
            weightInput.type = 'number';
            weightInput.className = 'title-weight-input';
            weightInput.min = '0';
            weightInput.value = title.weight;
            weightInput.dataset.title = title.name;
            
            titleElement.appendChild(nameElement);
            titleElement.appendChild(weightInput);
            
            this.elements.titleWeightsContainer.appendChild(titleElement);
        });
    },
    
    // Save title weights
    saveTitleWeights() {
        if (!this.authenticated) return;
        
        // Create or update the titleWeights object in gacha
        if (!window.gacha.titleWeights) {
            window.gacha.titleWeights = {};
        }
        
        // Get all weight inputs
        const weightInputs = this.elements.titleWeightsContainer.querySelectorAll('.title-weight-input');
        
        // Update weights
        weightInputs.forEach(input => {
            const titleName = input.dataset.title;
            const weight = parseFloat(input.value) || 0;
            
            window.gacha.titleWeights[titleName] = weight;
        });
        
        // Save to localStorage
        this.saveGachaSettings();
        
        // Show notification
        window.inventory.showNotification('Title weights updated');
    },
    
    // Save gacha settings to localStorage
    saveGachaSettings() {
        localStorage.setItem('gachaSettings', JSON.stringify({
            rarityChances: window.gacha.rarityChances,
            titleWeights: window.gacha.titleWeights
        }));
    },
    
    // Load items for the selected category
    loadItemsForCategory() {
        if (!this.authenticated) return;
        
        const category = this.elements.adminCategory.value;
        const items = window.inventory.items.filter(item => item.type === category);
        
        // Clear container
        this.elements.adminItemsContainer.innerHTML = '';
        
        if (items.length === 0) {
            this.elements.adminItemsContainer.innerHTML = '<div class="no-items">No items found in this category.</div>';
            return;
        }
        
        // Sort items by rarity (mythical first)
        const rarityOrder = {
            mythical: 0,
            legendary: 1,
            epic: 2,
            rare: 3,
            uncommon: 4,
            common: 5
        };
        
        items.sort((a, b) => {
            return rarityOrder[a.rarity.toLowerCase()] - rarityOrder[b.rarity.toLowerCase()];
        });
        
        // Create item elements
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `admin-item ${item.rarity.toLowerCase()}`;
            
            const nameElement = document.createElement('div');
            nameElement.className = 'admin-item-name';
            nameElement.textContent = item.name;
            
            const raritySelect = document.createElement('select');
            raritySelect.className = 'admin-rarity-select';
            
            // Add options for all rarities
            this.validRarities.forEach(rarity => {
                const option = document.createElement('option');
                option.value = rarity;
                option.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1);
                option.selected = rarity === item.rarity.toLowerCase();
                raritySelect.appendChild(option);
            });
            
            // Add event listener for rarity change
            raritySelect.addEventListener('change', () => {
                this.changeItemRarity(item.id, raritySelect.value);
            });
            
            itemElement.appendChild(nameElement);
            itemElement.appendChild(raritySelect);
            
            this.elements.adminItemsContainer.appendChild(itemElement);
        });
    },
    
    // Change the rarity of an item
    changeItemRarity(itemId, newRarity) {
        // Find the item
        const item = window.inventory.items.find(item => item.id === itemId);
        
        if (!item) {
            console.error(`Item with ID ${itemId} not found`);
            return;
        }
        
        // Update the item's rarity
        const oldRarity = item.rarity;
        item.rarity = newRarity.charAt(0).toUpperCase() + newRarity.slice(1);
        
        console.log(`Changed item "${item.name}" rarity from ${oldRarity} to ${item.rarity}`);
        
        // Check if item is equipped, if so, reapply effects
        if (item.equipped) {
            // Remove old effects
            window.inventory.removeItemEffects(item);
            
            // Apply new effects
            window.inventory.applyItemEffects(item);
        }
        
        // Save inventory
        window.inventory.saveInventory();
        
        // Refresh the admin display
        this.loadItemsForCategory();
        
        // Show notification
        window.inventory.showNotification(`Changed "${item.name}" rarity to ${item.rarity}`);
    }
};

// Initialize admin panel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    admin.init();
}); 