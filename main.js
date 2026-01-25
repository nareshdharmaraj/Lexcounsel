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
    initDashboardCharts();
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
// DASHBOARD CHARTS (CHART.JS)
// ===================================

function initDashboardCharts() {
    if (!window.Chart) return;

    const isLight = document.body.classList.contains('light-theme');
    const textColor = isLight ? '#1e293b' : 'rgba(255, 255, 255, 0.9)';
    const gridColor = isLight ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.1)';
    const titleColor = isLight ? '#000000' : '#ffffff';

    // Premium Palette
    const gold = '#c5a059';
    const silver = '#94a3b8';
    const accent = '#6366f1';
    const chartPalette = [gold, silver, accent, '#4ade80', '#fbbf24', '#f87171'];
    const goldFill = isLight ? 'rgba(197, 160, 89, 0.3)' : 'rgba(197, 160, 89, 0.15)';

    const createOrUpdateChart = (id, type, label, labels, data, bgColor) => {
        try {
            const ctx = document.getElementById(id);
            if (!ctx) return;

            const existingChart = Chart.getChart(ctx);

            if (existingChart) {
                // ONLY UPDATE COLORS/STAYLES, PRESERVE DATA
                existingChart.options.plugins.legend.labels.color = textColor;
                existingChart.options.plugins.title.color = titleColor;

                if (existingChart.options.scales.r) {
                    existingChart.options.scales.r.grid.color = gridColor;
                    existingChart.options.scales.r.angleLines.color = gridColor;
                    existingChart.options.scales.r.pointLabels.color = textColor;
                    existingChart.options.scales.r.ticks.color = textColor;
                    existingChart.options.scales.r.ticks.backdropColor = 'transparent';
                }
                if (existingChart.options.scales.y) {
                    existingChart.options.scales.y.grid.color = gridColor;
                    existingChart.options.scales.y.ticks.color = textColor;
                }
                if (existingChart.options.scales.x) {
                    existingChart.options.scales.x.ticks.color = textColor;
                }

                // Update dataset colors
                existingChart.data.datasets[0].backgroundColor = bgColor || chartPalette;
                existingChart.update('none'); // Update without re-animating the whole graph
                return;
            }

            // INITIAL CREATION
            new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        backgroundColor: bgColor || chartPalette,
                        borderColor: gold,
                        borderWidth: type === 'line' ? 3 : 1,
                        tension: 0.4,
                        fill: type === 'line'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 600 },
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, padding: 15, color: textColor, font: { weight: '600', size: 11 } } },
                        title: { display: true, text: label, color: titleColor, font: { size: 15, weight: '700' } }
                    },
                    scales: (type.includes('pie') || type.includes('doughnut')) ? {} :
                        ((type.includes('radar') || type.includes('polar')) ? {
                            r: {
                                angleLines: { color: gridColor },
                                grid: { color: gridColor },
                                pointLabels: { color: textColor, font: { size: 10, weight: '700' } },
                                ticks: { backdropColor: 'transparent', color: textColor, z: 10, font: { size: 10, weight: '700' } }
                            }
                        } : {
                            y: {
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: { color: textColor, font: { weight: '600' } },
                                border: { display: false }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: textColor, font: { weight: '600' } },
                                border: { display: false }
                            }
                        })
                }
            });
        } catch (e) {
            console.error("Chart Logic Error:", id, e);
        }
    };

    // --- LOCKED DATA POINTS -> PREVENTS SHIFTING ---
    // User Section
    createOrUpdateChart('userChart1', 'line', 'Legal Spendings (USD)', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], [12000, 19000, 15000, 25000, 22000, 30000], goldFill);
    createOrUpdateChart('userChart4', 'radar', 'Risk Profile', ['Regulatory', 'Contractual', 'IP', 'Taxes', 'Labor'], [80, 40, 60, 20, 50]);
    createOrUpdateChart('userChart5', 'polarArea', 'Document Volume', ['Legal', 'Financial', 'HR', 'Ops'], [30, 20, 15, 35]);
    createOrUpdateChart('userChart6', 'line', 'Response Time (h)', ['W1', 'W2', 'W3', 'W4'], [2, 4, 3, 1], 'rgba(99, 102, 241, 0.1)');
    createOrUpdateChart('userChart7', 'pie', 'Time Allocation', ['Research', 'Drafting', 'Meeting', 'Court'], [25, 40, 20, 15]);
    createOrUpdateChart('userChart8', 'bar', 'Monthly Activity', ['Jan', 'Feb', 'Mar', 'Apr'], [100, 120, 150, 90]);
    createOrUpdateChart('userChart10', 'line', 'Compliance (%)', ['M1', 'M2', 'M3', 'M4'], [90, 92, 88, 95], goldFill);

    // Matter Insights (New Section)
    createOrUpdateChart('matterChart1', 'doughnut', 'Phase Breakdown', ['Discovery', 'Motion', 'Trial', 'Appeal'], [40, 25, 20, 15]);
    createOrUpdateChart('matterChart2', 'polarArea', 'Resource Load', ['Legal', 'Analyst', 'Clerk', 'Admin'], [35, 25, 30, 40]);
    createOrUpdateChart('matterChart3', 'radar', 'Risk Matrix', ['Legal', 'Financial', 'Timeline', 'Reputation', 'Compliance'], [80, 50, 70, 40, 60]);

    // Admin Section
    createOrUpdateChart('adminChart1', 'line', 'Firm Revenue', ['2021', '2022', '2023', '2024'], [5.0, 7.2, 9.1, 12.5], goldFill);
    createOrUpdateChart('adminChart2', 'bar', 'Partner Billing (h)', ['Vance', 'Thorne', 'Chen', 'Knight'], [450, 380, 520, 410]);
    createOrUpdateChart('adminChart3', 'pie', 'Rev by Region', ['Americas', 'EMEA', 'APAC'], [40, 35, 25]);
    createOrUpdateChart('adminChart4', 'radar', 'Firm Capabilities', ['Litigation', 'M&A', 'Tax', 'Tech', 'Energy'], [95, 85, 70, 90, 80]);
    createOrUpdateChart('adminChart5', 'doughnut', 'Client Segments', ['F500', 'SME', 'Private'], [60, 25, 15]);
    createOrUpdateChart('adminChart6', 'line', 'System Load (%)', ['00:00', '06:00', '12:00', '18:00'], [10, 25, 85, 40], 'rgba(244, 63, 94, 0.1)');
    createOrUpdateChart('adminChart7', 'bar', 'Closing Rate (%)', ['Q1', 'Q2', 'Q3', 'Q4'], [65, 78, 70, 85]);
    createOrUpdateChart('adminChart8', 'polarArea', 'Dept Overhead', ['Admin', 'Tech', 'MKT', 'FAC'], [40, 30, 15, 15]);
    createOrUpdateChart('adminChart9', 'line', 'Satisfaction', ['Jan', 'Feb', 'Mar', 'Apr'], [4.2, 4.5, 4.1, 4.4], goldFill);
    createOrUpdateChart('adminChart10', 'doughnut', 'Lead Source', ['Referral', 'Organic', 'SEO', 'Direct'], [55, 20, 15, 10]);
    createOrUpdateChart('adminChart11', 'bar', 'Active Clients', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], [400, 650, 700, 680, 550]);
    createOrUpdateChart('adminChart12', 'line', 'Profit Margin (%)', ['P1', 'P2', 'P3', 'P4'], [25, 30, 22, 35], 'rgba(74, 222, 128, 0.1)');
}

// ===================================
// THEME MANAGER (DARK / LIGHT)
// ===================================
function initThemeManager() {
    const themeBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    themeBtns.forEach(btn => {
        if (!btn) return;

        btn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const isLight = body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            // Re-init charts if on dashboard
            if (typeof initDashboardCharts === 'function') {
                setTimeout(initDashboardCharts, 50);
            }

            // Optional: Update button icon (if you have specific icons for light/dark)
            // This implementation assumes the icon is fixed or handled via CSS
        });
    });
}

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
