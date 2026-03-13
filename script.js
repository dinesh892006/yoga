document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    // Top bar is 30px high, start transition early
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinksAll = document.querySelectorAll('.nav-links'); // Gets both left and right links
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('is-active');
            
            navLinksAll.forEach((ul, index) => {
                if(isActive){
                    // Simplified mobile menu for now
                    ul.style.display = 'flex';
                    ul.style.flexDirection = 'column';
                    ul.style.position = 'absolute';
                    ul.style.top = index === 0 ? '60px' : '200px'; 
                    ul.style.left = '0';
                    ul.style.width = '100%';
                    ul.style.background = '#ffffff';
                    ul.style.padding = '2rem';
                    ul.style.zIndex = '900';
                    ul.querySelectorAll('a').forEach(a => a.style.color = '#000');
                } else {
                    ul.style.display = '';
                    ul.style.position = '';
                    ul.querySelectorAll('a').forEach(a => a.style.color = '');
                }
            });
        });
    }

    /* --- Shopping Cart Logic --- */
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartCountBadges = document.querySelectorAll('.cart-count');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    let cart = [];

    // Open Cart
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; 
    }

    // Close Cart
    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = ''; 
    }

    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function formatMoney(amount) {
        return '$' + parseFloat(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function updateCart() {
        cartCountBadges.forEach(badge => badge.textContent = cart.length);

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your shopping bag is empty.</p>';
            cartTotalPriceEl.textContent = '$0';
            return;
        }

        let html = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += parseFloat(item.price);
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${formatMoney(item.price)}</div>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        cartTotalPriceEl.textContent = formatMoney(total);

        // Re-attach remove events
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                cart.splice(idx, 1);
                updateCart();
            });
        });
    }

    function showNotification(itemTitle) {
        let notif = document.getElementById('custom-notification');
        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'custom-notification';
            notif.className = 'notification';
            document.body.appendChild(notif);
        }

        notif.textContent = `Added ${itemTitle} to your bag`;
        notif.classList.add('show');

        setTimeout(() => {
            notif.classList.remove('show');
        }, 3000);
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').getAttribute('data-price');
            const img = card.querySelector('img').src;

            cart.push({ title, price, image: img });
            updateCart();
            openCart(); 
            showNotification(title);
        });
    });

    /* --- Hero Slider Logic --- */
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (index + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
        });

        function startInterval() {
            slideInterval = setInterval(nextSlide, 6000); // Slower, more elegant timing 
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();
    }

    /* --- Interactive Wave Canvas --- */
    const canvas = document.getElementById('waveCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = 120; // Match new CSS height
        }
        window.addEventListener('resize', resize);
        resize();

        let mouse = { x: width / 2, y: height / 2, active: false };
        const heroSection = document.getElementById('home');
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX;
            mouse.y = e.clientY - rect.top; 
            mouse.active = true;
        });

        heroSection.addEventListener('mouseleave', () => {
            mouse.active = false;
        });

        let time = 0;
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            time += 0.02; // Slower wave

            const amplitude = 15;
            const frequency = 0.01;
            
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, height / 2);

            for (let i = 0; i <= width; i++) {
                let y = Math.sin(i * frequency + time) * amplitude + (height / 2);
                
                if (mouse.active) {
                    const dx = i - mouse.x;
                    const dist = Math.abs(dx);
                    if (dist < 300) {
                        const influence = (300 - dist) / 300;
                        y -= (1 - Math.cos(time*1.5)) * influence * 10; 
                    }
                }
                ctx.lineTo(i, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();

            // Very subtle white reflection
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'; 
            ctx.fill();

            requestAnimationFrame(animate);
        }
        
        animate();
    }
});
