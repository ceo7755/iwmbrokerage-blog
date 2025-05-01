// Toggle retractable bars (About, Services, Reviews, Contact, FAQs)
document.querySelectorAll('.about-bar-title, .services-bar-title, .reviews-bar-title, .contact-bar-title, .faq-bar-title').forEach(title => {
    title.addEventListener('click', () => {
        const content = title.nextElementSibling;
        const arrow = title.querySelector('.arrow');
        content.classList.toggle('active');
        title.classList.toggle('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Hamburger Menu and Chat Widget Logic
document.addEventListener('DOMContentLoaded', () => {
    const footerNavToggle = document.querySelector('.mobile-footer-nav-toggle'); // Footer toggle only
    const navMenu = document.querySelector('.nav-menu');

    // Function to toggle menu
    function toggleMenu(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    // Footer toggle (only one active on mobile)
    if (footerNavToggle && navMenu) {
        footerNavToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking any nav link
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && !navMenu.contains(e.target) && !footerNavToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Ensure menu is closed on page load
    if (navMenu) {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Chat widget toggle
    const chatIcon = document.getElementById('chat-icon');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');

    if (chatIcon && chatBox) {
        chatIcon.addEventListener('click', () => {
            chatBox.style.display = chatBox.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (chatClose && chatBox) {
        chatClose.addEventListener('click', () => {
            chatBox.style.display = 'none';
        });
    }

    // Close chat box when clicking outside
    document.addEventListener('click', (e) => {
        if (chatBox && !chatBox.contains(e.target) && !chatIcon.contains(e.target) && chatBox.style.display === 'block') {
            chatBox.style.display = 'none';
        }
    });
});

// Drag-to-scroll with fixed momentum for carriers-container and reviews-container
function setupDragToScroll(container, fixedVelocity, decelerationFactor, movementThreshold) {
    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let lastX;
    let lastY;
    let animationFrame;
    let isMomentumScrolling = false;
    let scrollDirection = 0; // 1 for right, -1 for left
    const FIXED_VELOCITY = fixedVelocity;
    const DECELERATION_FACTOR = decelerationFactor;
    const MOVEMENT_THRESHOLD = movementThreshold;

    console.log('Container scrollWidth:', container.scrollWidth, 'clientWidth:', container.clientWidth);

    container.addEventListener('mousedown', (e) => {
        if (isMomentumScrolling) {
            cancelAnimationFrame(animationFrame);
            isMomentumScrolling = false;
        }
        isDown = true;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        startY = e.pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        lastX = startX;
        lastY = startY;
        scrollDirection = 0;
    });

    container.addEventListener('touchstart', (e) => {
        if (isMomentumScrolling) {
            cancelAnimationFrame(animationFrame);
            isMomentumScrolling = false;
        }
        isDown = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        startY = e.touches[0].pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        lastX = startX;
        lastY = startY;
        scrollDirection = 0;
    });

    container.addEventListener('mouseleave', () => {
        if (isDown) {
            isDown = false;
            container.classList.remove('active');
            startMomentumScroll();
        }
    });

    container.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            container.classList.remove('active');
            startMomentumScroll();
        }
    });

    container.addEventListener('touchend', (e) => {
        console.log('Touchend fired, direction:', scrollDirection);
        if (isDown) {
            isDown = false;
            startMomentumScroll();
        }
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        const deltaX = Math.abs(x - startX);
        const deltaY = Math.abs(y - startY);

        if (deltaX > 0) {
            scrollDirection = x < lastX ? -1 : 1;
        }

        if (deltaX > deltaY && deltaX > MOVEMENT_THRESHOLD) {
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        }
        lastX = x;
        lastY = y;
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const y = e.touches[0].pageY - container.offsetTop;
        const deltaX = Math.abs(x - startX);
        const deltaY = Math.abs(y - startY);

        console.log('Touchmove: deltaX:', deltaX, 'deltaY:', deltaY, 'scrollDirection:', scrollDirection);

        if (deltaX > 0) {
            scrollDirection = x < lastX ? -1 : 1;
        }

        if (deltaX > deltaY && deltaX > MOVEMENT_THRESHOLD) {
            e.preventDefault();
            e.stopPropagation();
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        }
        lastX = x;
        lastY = y;
    });

    function startMomentumScroll() {
        if (scrollDirection === 0) return;
        console.log('Starting momentum scroll with direction:', scrollDirection);
        isMomentumScrolling = true;
        let currentVelocity = FIXED_VELOCITY * (-scrollDirection);

        function animateScroll() {
            if (!isMomentumScrolling) return;

            let newScrollLeft = container.scrollLeft + currentVelocity;

            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            if (newScrollLeft < 0) {
                newScrollLeft = 0;
                currentVelocity = 0;
                isMomentumScrolling = false;
                cancelAnimationFrame(animationFrame);
                console.log('Hit left boundary, stopping momentum');
            } else if (newScrollLeft > maxScrollLeft) {
                newScrollLeft = maxScrollLeft;
                currentVelocity = 0;
                isMomentumScrolling = false;
                cancelAnimationFrame(animationFrame);
                console.log('Hit right boundary, stopping momentum');
            }

            container.scrollLeft = newScrollLeft;

            currentVelocity *= DECELERATION_FACTOR;

            console.log('Current velocity:', currentVelocity);

            if (Math.abs(currentVelocity) < 0.1) {
                isMomentumScrolling = false;
                cancelAnimationFrame(animationFrame);
                console.log('Momentum scroll stopped due to low velocity');
                return;
            }

            animationFrame = requestAnimationFrame(animateScroll);
        }

        animationFrame = requestAnimationFrame(animateScroll);
    }
}

const carriersContainer = document.querySelector('.carriers-container');
const reviewsContainer = document.querySelector('.reviews-container');

if (carriersContainer) {
    setupDragToScroll(carriersContainer, 26, 0.997, 2);
}
if (reviewsContainer) {
    setupDragToScroll(reviewsContainer, 10, 0.99, 5);
}

// Function for broker login popup
function showBrokerLoginPopup() {
    const password = prompt('Please enter the password:');
    if (password === 'Smile!1') {
        window.location.href = 'broker-portal.html';
    } else {
        alert('Incorrect password. Please try again.');
    }
}

// Broker Login Click
document.querySelector('.footer-link[href="broker-login.html"]').addEventListener('click', function(e) {
    e.preventDefault();
    showBrokerLoginPopup();
});

// Join Team Long Press
const joinTeam = document.getElementById('join-team');
let pressTimer;

if (joinTeam) {
    joinTeam.addEventListener('mousedown', function(e) {
        e.preventDefault();
        pressTimer = setTimeout(showBrokerLoginPopup, 3000);
    });

    joinTeam.addEventListener('mouseup', function() {
        clearTimeout(pressTimer);
    });

    joinTeam.addEventListener('mouseleave', function() {
        clearTimeout(pressTimer);
    });

    joinTeam.addEventListener('touchstart', function(e) {
        e.preventDefault();
        pressTimer = setTimeout(showBrokerLoginPopup, 3000);
    });

    joinTeam.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
    });

    joinTeam.addEventListener('touchcancel', function() {
        clearTimeout(pressTimer);
    });
}

// Mobile-only hero button tap effect
if (window.matchMedia("(max-width: 768px)").matches) {
    const heroButtons = document.querySelectorAll('.hero-ctas .cta-button.neon');
    heroButtons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            const targetButton = e.currentTarget;
            targetButton.classList.add('tapped');
            setTimeout(() => {
                targetButton.classList.remove('tapped');
            }, 2000);
        });
    });
}