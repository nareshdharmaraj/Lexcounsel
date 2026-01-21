// ===================================
// PREMIUM INTERACTION SUITE
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initMagneticButtons();
    // initTextReveals(); // Disabled text animations as per user request
    initScrollAnimations();
    initThemeManager();
    initAuthTabs();
    initRTLManager();
    initMobileMenu();
});

// ===================================
// CUSTOM CURSOR
// ===================================
const initCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation Loop for Smooth Follow
    const animateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.1; // Ease factor (0.1 = smooth lag)
        cursorY += dy * 0.1;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover Effects
    const hoverables = document.querySelectorAll('a, button, .grid-item, input, textarea');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
};

// ===================================
// MAGNETIC BUTTONS
// ===================================
const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.btn-magnetic');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button slightly towards cursor
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
};

// ===================================
// TEXT REVEAL ANIMATIONS (GSAP-like)
// ===================================
const initTextReveals = () => {
    // Simple split-line simulation
    const splitTexts = document.querySelectorAll('.display-text');

    // Create an observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'all 1.2s cubic-bezier(0.19, 1, 0.22, 1)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    splitTexts.forEach(text => {
        observer.observe(text);
    });
};

// ===================================
// SCROLL ANIMATIONS
// ===================================
const initScrollAnimations = () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-num');
    const startCount = (el) => {
        const targetAttr = el.getAttribute('data-target');
        if (!targetAttr) return;
        const target = parseInt(targetAttr);
        if (isNaN(target)) return;

        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.innerText = target; 
                if (target > 1000) el.innerText = (target / 1000).toFixed(1) + 'k';
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current);
            }
        }, 16);
    };

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCount(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    });

    stats.forEach(el => statObserver.observe(el));
};

// ===================================
// THEME MANAGER
// ===================================
const initThemeManager = () => {
    const themeBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }

    themeBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                body.classList.toggle('light-theme');
                const newTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
            });
        }
    });
};

// ===================================
// AUTH TABS
// ===================================
const initAuthTabs = () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabBtns = document.querySelectorAll('.auth-tab-btn');

    if (!loginForm || !registerForm) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');
            if (target === 'login') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            }
        });
    });
};

// ===================================
// RTL MANAGER
// ===================================
const initRTLManager = () => {
    const rtlBtns = document.querySelectorAll('#rtlToggle, #rtlToggleMobile');
    const html = document.documentElement;

    // Check saved
    const savedDir = localStorage.getItem('dir') || 'ltr';
    html.setAttribute('dir', savedDir);

    rtlBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const currentDir = html.getAttribute('dir');
                const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
                html.setAttribute('dir', newDir);
                localStorage.setItem('dir', newDir);
            });
        }
    });
};

// ===================================
// MOBILE MENU
// ===================================
const initMobileMenu = () => {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-header)');
    const subLinks = document.querySelectorAll('.mobile-sub-link');
    const dropdownHeaders = document.querySelectorAll('.mobile-dropdown-header');

    if (!toggle || !menu) return;

    const toggleMenu = () => {
        menu.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        if (menu.classList.contains('active')) {
            toggle.innerHTML = '✕';
        } else {
            toggle.innerHTML = '☰';
            // Reset dropdowns when menu closes
            document.querySelectorAll('.mobile-dropdown').forEach(d => d.classList.remove('active'));
        }
    };

    toggle.addEventListener('click', toggleMenu);

    // Toggle Dropdowns
    dropdownHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = header.parentElement;
            parent.classList.toggle('active');
        });
    });

    // Close menu when a flat link or sub-link is clicked
    [...links, ...subLinks].forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            document.body.classList.remove('menu-open');
            toggle.innerHTML = '☰';
        });
    });
};
