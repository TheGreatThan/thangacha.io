// Animations for the gacha game
const animations = {
    // Animation elements
    elements: {
        container: document.getElementById('animation-container'),
        resultDisplay: document.getElementById('result-display'),
        rarityBanner: document.getElementById('rarity-banner'),
        itemName: document.getElementById('item-name')
    },

    // Particle systems
    createParticle(x, y, color, size, duration, blending = false) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.pointerEvents = 'none';
        
        if (blending) {
            particle.style.mixBlendMode = 'screen';
            particle.style.filter = 'blur(1px)';
        }
        
        this.elements.container.appendChild(particle);
        
        // Animate the particle
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const startTime = Date.now();
        
        function updateParticle() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const currentX = parseFloat(particle.style.left);
            const currentY = parseFloat(particle.style.top);
            
            particle.style.left = `${currentX + vx}px`;
            particle.style.top = `${currentY + vy}px`;
            particle.style.opacity = 1 - progress;
            
            requestAnimationFrame(updateParticle);
        }
        
        requestAnimationFrame(updateParticle);
        return particle;
    },
    
    createParticleExplosion(x, y, color, count, size, duration) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, color, size, duration, true);
        }
    },
    
    // Lighting effects
    createLightRay(x, y, color, width, height, rotation, duration) {
        const ray = document.createElement('div');
        ray.style.position = 'absolute';
        ray.style.width = `${width}px`;
        ray.style.height = `${height}px`;
        ray.style.backgroundColor = color;
        ray.style.opacity = '0.7';
        ray.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        ray.style.left = `${x}px`;
        ray.style.top = `${y}px`;
        ray.style.borderRadius = '50% 50% 0 0';
        ray.style.pointerEvents = 'none';
        ray.style.filter = 'blur(5px)';
        ray.style.mixBlendMode = 'screen';
        
        this.elements.container.appendChild(ray);
        
        const startTime = Date.now();
        
        function updateRay() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                ray.remove();
                return;
            }
            
            ray.style.opacity = 0.7 * (1 - progress);
            ray.style.height = `${height * (1 + progress * 0.5)}px`;
            
            requestAnimationFrame(updateRay);
        }
        
        requestAnimationFrame(updateRay);
        return ray;
    },
    
    createSpinningLight(x, y, color, size, duration, rotationSpeed) {
        const light = document.createElement('div');
        light.style.position = 'absolute';
        light.style.width = `${size}px`;
        light.style.height = `${size}px`;
        light.style.background = `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`;
        light.style.opacity = '0.9';
        light.style.transform = 'translate(-50%, -50%)';
        light.style.left = `${x}px`;
        light.style.top = `${y}px`;
        light.style.borderRadius = '50%';
        light.style.pointerEvents = 'none';
        light.style.mixBlendMode = 'screen';
        
        const beam = document.createElement('div');
        beam.style.position = 'absolute';
        beam.style.width = '10px';
        beam.style.height = `${size * 0.8}px`;
        beam.style.backgroundColor = color;
        beam.style.left = '50%';
        beam.style.top = '0';
        beam.style.transform = 'translateX(-50%)';
        beam.style.transformOrigin = 'bottom center';
        beam.style.borderRadius = '5px';
        beam.style.opacity = '0.7';
        beam.style.filter = 'blur(2px)';
        
        light.appendChild(beam);
        this.elements.container.appendChild(light);
        
        const startTime = Date.now();
        let rotation = 0;
        
        function updateLight() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                light.remove();
                return;
            }
            
            rotation += rotationSpeed;
            beam.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
            light.style.opacity = 0.9 * (1 - progress);
            
            requestAnimationFrame(updateLight);
        }
        
        requestAnimationFrame(updateLight);
        return light;
    },
    
    // Animation sequences based on rarity
    async playCommonAnimation() {
        this.elements.container.innerHTML = '';
        
        const containerRect = this.elements.container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // Simple flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#a0a0a0';
        flash.style.opacity = '0';
        this.elements.container.appendChild(flash);
        
        // Animate flash
        await this.animateElement(flash, [
            { opacity: 0 },
            { opacity: 0.5, offset: 0.3 },
            { opacity: 0 }
        ], 1000);
        
        // Small particle burst
        this.createParticleExplosion(centerX, centerY, '#c0c0c0', 20, 5, 1500);
        
        // Show result
        return new Promise(resolve => {
            setTimeout(() => {
                flash.remove();
                resolve();
            }, 1500);
        });
    },
    
    async playUncommonAnimation() {
        this.elements.container.innerHTML = '';
        
        const containerRect = this.elements.container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // Green flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#69cf5d';
        flash.style.opacity = '0';
        this.elements.container.appendChild(flash);
        
        // Animate flash
        await this.animateElement(flash, [
            { opacity: 0 },
            { opacity: 0.6, offset: 0.3 },
            { opacity: 0 }
        ], 1200);
        
        // Green particles
        this.createParticleExplosion(centerX, centerY, '#a0e898', 40, 8, 2000);
        
        // Light rays
        for (let i = 0; i < 4; i++) {
            this.createLightRay(
                centerX, 
                centerY, 
                '#69cf5d', 
                30, 
                100, 
                i * 90, 
                1500
            );
        }
        
        // Show result
        return new Promise(resolve => {
            setTimeout(() => {
                flash.remove();
                resolve();
            }, 2000);
        });
    },
    
    async playRareAnimation() {
        this.elements.container.innerHTML = '';
        
        const containerRect = this.elements.container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // Blue pulse
        const pulse = document.createElement('div');
        pulse.style.position = 'absolute';
        pulse.style.width = '10px';
        pulse.style.height = '10px';
        pulse.style.borderRadius = '50%';
        pulse.style.backgroundColor = '#4287f5';
        pulse.style.left = `${centerX}px`;
        pulse.style.top = `${centerY}px`;
        pulse.style.transform = 'translate(-50%, -50%)';
        pulse.style.boxShadow = '0 0 20px #4287f5';
        this.elements.container.appendChild(pulse);
        
        // Animate pulse
        await this.animateElement(pulse, [
            { transform: 'translate(-50%, -50%) scale(1)', boxShadow: '0 0 20px #4287f5' },
            { transform: 'translate(-50%, -50%) scale(20)', boxShadow: '0 0 40px #4287f5' }
        ], 800);
        
        pulse.remove();
        
        // Blue flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#4287f5';
        flash.style.opacity = '0.7';
        this.elements.container.appendChild(flash);
        
        // Animate flash out
        await this.animateElement(flash, [
            { opacity: 0.7 },
            { opacity: 0 }
        ], 400);
        
        flash.remove();
        
        // Particle explosion
        this.createParticleExplosion(centerX, centerY, '#75adff', 60, 10, 2500);
        
        // Spinning lights
        for (let i = 0; i < 3; i++) {
            this.createSpinningLight(
                centerX, 
                centerY, 
                '#4287f5', 
                100, 
                2500,
                5 - i
            );
        }
        
        // Light rays
        for (let i = 0; i < 8; i++) {
            this.createLightRay(
                centerX, 
                centerY, 
                '#4287f5', 
                40, 
                150, 
                i * 45, 
                2000
            );
        }
        
        // Show result
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 2500);
        });
    },
    
    async playEpicAnimation() {
        this.elements.container.innerHTML = '';
        
        const containerRect = this.elements.container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // Create a portal effect
        const portal = document.createElement('div');
        portal.style.position = 'absolute';
        portal.style.width = '10px';
        portal.style.height = '10px';
        portal.style.borderRadius = '50%';
        portal.style.background = 'radial-gradient(circle, #a054ef 0%, #742eb8 70%, transparent 100%)';
        portal.style.boxShadow = '0 0 30px #a054ef';
        portal.style.left = `${centerX}px`;
        portal.style.top = `${centerY}px`;
        portal.style.transform = 'translate(-50%, -50%)';
        this.elements.container.appendChild(portal);
        
        // Portal ring
        const ring = document.createElement('div');
        ring.style.position = 'absolute';
        ring.style.width = '30px';
        ring.style.height = '30px';
        ring.style.borderRadius = '50%';
        ring.style.border = '5px solid #a054ef';
        ring.style.boxShadow = '0 0 15px #a054ef';
        ring.style.left = `${centerX}px`;
        ring.style.top = `${centerY}px`;
        ring.style.transform = 'translate(-50%, -50%)';
        this.elements.container.appendChild(ring);
        
        // Animate portal growing
        await Promise.all([
            this.animateElement(portal, [
                { width: '10px', height: '10px' },
                { width: '300px', height: '300px' }
            ], 1000),
            this.animateElement(ring, [
                { width: '30px', height: '30px', opacity: 1 },
                { width: '350px', height: '350px', opacity: 0 }
            ], 1000)
        ]);
        
        // Purple flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#a054ef';
        flash.style.opacity = '0.8';
        this.elements.container.appendChild(flash);
        
        // Animate flash out
        await this.animateElement(flash, [
            { opacity: 0.8 },
            { opacity: 0 }
        ], 500);
        
        flash.remove();
        
        // Massive particle explosion
        this.createParticleExplosion(centerX, centerY, '#c78aff', 80, 12, 3000);
        
        // Spinning lights
        for (let i = 0; i < 5; i++) {
            this.createSpinningLight(
                centerX, 
                centerY, 
                '#a054ef', 
                150, 
                3000,
                4 - i
            );
        }
        
        // Light rays
        for (let i = 0; i < 12; i++) {
            this.createLightRay(
                centerX, 
                centerY, 
                '#a054ef', 
                50, 
                200, 
                i * 30, 
                2500
            );
        }
        
        // Show result
        return new Promise(resolve => {
            setTimeout(() => {
                portal.remove();
                resolve();
            }, 3000);
        });
    },
    
    async playLegendaryAnimation() {
        this.elements.container.innerHTML = '';
        
        const containerRect = this.elements.container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // Create golden shockwave
        const shockwave = document.createElement('div');
        shockwave.style.position = 'absolute';
        shockwave.style.width = '10px';
        shockwave.style.height = '10px';
        shockwave.style.borderRadius = '50%';
        shockwave.style.border = '5px solid #ffbc27';
        shockwave.style.boxShadow = '0 0 30px #ffbc27';
        shockwave.style.left = `${centerX}px`;
        shockwave.style.top = `${centerY}px`;
        shockwave.style.transform = 'translate(-50%, -50%)';
        this.elements.container.appendChild(shockwave);
        
        // First shockwave
        await this.animateElement(shockwave, [
            { width: '10px', height: '10px', opacity: 1, borderWidth: '5px' },
            { width: '300px', height: '300px', opacity: 0, borderWidth: '1px' }
        ], 700);
        
        // Second bigger shockwave
        shockwave.style.width = '10px';
        shockwave.style.height = '10px';
        shockwave.style.opacity = '1';
        shockwave.style.borderWidth = '10px';
        
        await this.animateElement(shockwave, [
            { width: '10px', height: '10px', opacity: 1, borderWidth: '10px' },
            { width: '500px', height: '500px', opacity: 0, borderWidth: '1px' }
        ], 800);
        
        // Golden flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'radial-gradient(circle, white 0%, #ffbc27 30%, #ff9800 100%)';
        flash.style.opacity = '0';
        this.elements.container.appendChild(flash);
        
        // Animate flash
        await this.animateElement(flash, [
            { opacity: 0 },
            { opacity: 1, offset: 0.2 },
            { opacity: 0 }
        ], 1200);
        
        // Golden particles
        this.createParticleExplosion(centerX, centerY, '#ffd780', 100, 15, 4000);
        this.createParticleExplosion(centerX, centerY, '#ffbc27', 50, 10, 3500);
        
        // Create golden orb
        const orb = document.createElement('div');
        orb.style.position = 'absolute';
        orb.style.width = '200px';
        orb.style.height = '200px';
        orb.style.borderRadius = '50%';
        orb.style.background = 'radial-gradient(circle, white 0%, #ffbc27 50%, #ff9800 100%)';
        orb.style.boxShadow = '0 0 50px #ffbc27';
        orb.style.left = `${centerX}px`;
        orb.style.top = `${centerY}px`;
        orb.style.transform = 'translate(-50%, -50%) scale(0)';
        this.elements.container.appendChild(orb);
        
        // Animate orb
        await this.animateElement(orb, [
            { transform: 'translate(-50%, -50%) scale(0)', offset: 0 },
            { transform: 'translate(-50%, -50%) scale(1.2)', offset: 0.7 },
            { transform: 'translate(-50%, -50%) scale(1)', offset: 1 }
        ], 1000);
        
        // Spinning golden rays
        for (let i = 0; i < 8; i++) {
            this.createSpinningLight(
                centerX, 
                centerY, 
                '#ffbc27', 
                250, 
                3000,
                3 - (i % 3)
            );
        }
        
        // Light rays
        for (let i = 0; i < 16; i++) {
            this.createLightRay(
                centerX, 
                centerY, 
                '#ffbc27', 
                60, 
                300, 
                i * 22.5, 
                2500
            );
        }
        
        // Pulse the orb
        this.animateElement(orb, [
            { transform: 'translate(-50%, -50%) scale(1)', boxShadow: '0 0 50px #ffbc27' },
            { transform: 'translate(-50%, -50%) scale(1.1)', boxShadow: '0 0 70px #ffbc27', offset: 0.5 },
            { transform: 'translate(-50%, -50%) scale(1)', boxShadow: '0 0 50px #ffbc27' }
        ], 1000, { iterations: 3 });
        
        // Show result
        return new Promise(resolve => {
            setTimeout(() => {
                this.animateElement(orb, [
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                    { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 }
                ], 500).then(() => {
                    orb.remove();
                    flash.remove();
                    shockwave.remove();
                    resolve();
                });
            }, 3500);
        });
    },
    
    async playMythicalAnimation() {
        this.elements.container.innerHTML = '';
        
        const containerRect = this.elements.container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // Dark fade in
        const darkOverlay = document.createElement('div');
        darkOverlay.style.position = 'absolute';
        darkOverlay.style.width = '100%';
        darkOverlay.style.height = '100%';
        darkOverlay.style.backgroundColor = 'black';
        darkOverlay.style.opacity = '0';
        darkOverlay.style.zIndex = '1';
        this.elements.container.appendChild(darkOverlay);
        
        await this.animateElement(darkOverlay, [
            { opacity: 0 },
            { opacity: 0.9 }
        ], 1000);
        
        // Add stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.backgroundColor = 'white';
            star.style.borderRadius = '50%';
            star.style.left = `${Math.random() * containerRect.width}px`;
            star.style.top = `${Math.random() * containerRect.height}px`;
            star.style.opacity = `${Math.random() * 0.5 + 0.5}`;
            star.style.zIndex = '2';
            
            // Add twinkle animation
            this.animateElement(star, [
                { opacity: star.style.opacity, transform: 'scale(1)' },
                { opacity: '1', transform: 'scale(1.5)', offset: 0.5 },
                { opacity: star.style.opacity, transform: 'scale(1)' }
            ], 2000 + Math.random() * 3000, { iterations: Infinity });
            
            this.elements.container.appendChild(star);
        }
        
        // Create mythical symbol
        const symbol = document.createElement('div');
        symbol.style.position = 'absolute';
        symbol.style.width = '200px';
        symbol.style.height = '200px';
        symbol.style.left = `${centerX}px`;
        symbol.style.top = `${centerY}px`;
        symbol.style.transform = 'translate(-50%, -50%)';
        symbol.style.zIndex = '3';
        symbol.style.opacity = '0';
        
        // Create the mythical symbol (pentagon with glow)
        symbol.innerHTML = `
            <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="5" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                </defs>
                <polygon points="100,10 190,75 160,180 40,180 10,75" fill="none" stroke="#ff4242" stroke-width="3" filter="url(#glow)"/>
            </svg>
        `;
        
        this.elements.container.appendChild(symbol);
        
        // Animate symbol appearing
        await this.animateElement(symbol, [
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0) rotate(0deg)' },
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1) rotate(360deg)' }
        ], 1500);
        
        // Fire explosion
        const explosion = document.createElement('div');
        explosion.style.position = 'absolute';
        explosion.style.width = '10px';
        explosion.style.height = '10px';
        explosion.style.borderRadius = '50%';
        explosion.style.background = 'radial-gradient(circle, white 0%, #ff4242 50%, #8b0000 100%)';
        explosion.style.boxShadow = '0 0 50px #ff4242';
        explosion.style.left = `${centerX}px`;
        explosion.style.top = `${centerY}px`;
        explosion.style.transform = 'translate(-50%, -50%)';
        explosion.style.zIndex = '4';
        this.elements.container.appendChild(explosion);
        
        // Animate explosion
        await this.animateElement(explosion, [
            { transform: 'translate(-50%, -50%) scale(0)' },
            { transform: 'translate(-50%, -50%) scale(15)' }
        ], 800);
        
        // Red flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = '#ff4242';
        flash.style.opacity = '0.8';
        flash.style.zIndex = '5';
        this.elements.container.appendChild(flash);
        
        // Animate flash out
        await this.animateElement(flash, [
            { opacity: 0.8 },
            { opacity: 0 }
        ], 800);
        
        // Massive particle explosion
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createParticleExplosion(centerX, centerY, '#ff7c7c', 50, 15, 4000);
                this.createParticleExplosion(centerX, centerY, '#ff4242', 50, 10, 4000);
            }, i * 300);
        }
        
        // Create fire effect
        const fireContainer = document.createElement('div');
        fireContainer.style.position = 'absolute';
        fireContainer.style.width = '300px';
        fireContainer.style.height = '300px';
        fireContainer.style.left = `${centerX}px`;
        fireContainer.style.top = `${centerY}px`;
        fireContainer.style.transform = 'translate(-50%, -50%)';
        fireContainer.style.zIndex = '6';
        fireContainer.style.filter = 'blur(3px)';
        this.elements.container.appendChild(fireContainer);
        
        // Add fire particles
        for (let i = 0; i < 50; i++) {
            const fire = document.createElement('div');
            fire.style.position = 'absolute';
            fire.style.width = `${Math.random() * 20 + 10}px`;
            fire.style.height = `${Math.random() * 40 + 20}px`;
            fire.style.backgroundColor = i % 2 === 0 ? '#ff4242' : '#ff7c7c';
            fire.style.borderRadius = '50% 50% 20% 20%';
            fire.style.left = `${Math.random() * 300}px`;
            fire.style.bottom = '0';
            fire.style.opacity = `${Math.random() * 0.3 + 0.7}`;
            fire.style.mixBlendMode = 'screen';
            
            // Animate fire
            this.animateElement(fire, [
                { transform: 'translateY(0) scale(1)', opacity: fire.style.opacity },
                { transform: 'translateY(-100px) scale(0)', opacity: '0' }
            ], 1000 + Math.random() * 1000, { iterations: Infinity });
            
            fireContainer.appendChild(fire);
        }
        
        // Light rays
        for (let i = 0; i < 20; i++) {
            this.createLightRay(
                centerX, 
                centerY, 
                '#ff4242', 
                70, 
                400, 
                i * 18, 
                4000
            );
        }
        
        // Show result
        return new Promise(resolve => {
            setTimeout(() => {
                // Fade out effect
                this.animateElement(darkOverlay, [
                    { opacity: 0.9 },
                    { opacity: 0 }
                ], 1000).then(() => {
                    darkOverlay.remove();
                    symbol.remove();
                    explosion.remove();
                    flash.remove();
                    fireContainer.remove();
                    resolve();
                });
            }, 5000);
        });
    },
    
    // Helper function for Web Animation API
    animateElement(element, keyframes, duration, options = {}) {
        return element.animate(keyframes, {
            duration: duration,
            easing: options.easing || 'cubic-bezier(0.42, 0, 0.58, 1)',
            iterations: options.iterations || 1,
            fill: 'forwards'
        }).finished;
    },
    
    // Display result function
    displayResult(rarity, itemName) {
        this.elements.rarityBanner.textContent = rarity.toUpperCase();
        this.elements.rarityBanner.className = '';
        this.elements.rarityBanner.classList.add(`bg-${rarity.toLowerCase()}`);
        
        this.elements.itemName.textContent = itemName;
        this.elements.itemName.className = '';
        this.elements.itemName.classList.add(rarity.toLowerCase());
        
        this.elements.resultDisplay.classList.remove('hidden');
        
        // Animate result display
        this.animateElement(this.elements.resultDisplay, [
            { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 1, offset: 0.7 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
        ], 800);
    },
    
    // Main function to play animation based on rarity
    async playAnimation(rarity) {
        const animationArea = document.getElementById('gacha-animation');
        animationArea.classList.remove('hidden');
        
        // Wait for animation container to be fully visible
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            switch(rarity.toLowerCase()) {
                case 'common':
                    await this.playCommonAnimation();
                    break;
                case 'uncommon':
                    await this.playUncommonAnimation();
                    break;
                case 'rare':
                    await this.playRareAnimation();
                    break;
                case 'epic':
                    await this.playEpicAnimation();
                    break;
                case 'legendary':
                    await this.playLegendaryAnimation();
                    break;
                case 'mythical':
                    await this.playMythicalAnimation();
                    break;
                default:
                    await this.playCommonAnimation();
            }
        } catch (error) {
            console.error('Animation error:', error);
        }
    }
};

// Export the animations object
window.gachaAnimations = animations; 