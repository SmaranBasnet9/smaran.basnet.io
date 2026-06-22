/* ================================================
   SMARAN BASNET - PORTFOLIO SCRIPTS
   Three.js Background + UI Interactions
   ================================================ */

// ===== THREE.JS PARTICLE BACKGROUND =====
(function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canvas || typeof THREE === 'undefined' || prefersReducedMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    // Particles
    const count = 800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 20;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({ size: 0.025, color: 0xed7a3d, transparent: true, opacity: 0.35 });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Floating wireframe shapes
    const shapes = [];
    const shapeGeo = [
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.TetrahedronGeometry(0.4, 0),
    ];
    shapeGeo.forEach((g, i) => {
        const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xff9452, wireframe: true, transparent: true, opacity: 0.06 }));
        m.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4);
        scene.add(m);
        shapes.push(m);
    });

    camera.position.z = 6;

    // Mouse interaction
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / innerWidth - 0.5) * 0.5;
        my = (e.clientY / innerHeight - 0.5) * 0.5;
    });

    // Loop
    function tick() {
        requestAnimationFrame(tick);
        particles.rotation.y += 0.0004;
        particles.rotation.x += 0.0002;
        particles.rotation.y += mx * 0.003;
        particles.rotation.x += my * 0.003;
        shapes.forEach((s, i) => {
            s.rotation.x += 0.003 + i * 0.001;
            s.rotation.y += 0.003 + i * 0.001;
            s.position.y += Math.sin(Date.now() * 0.0008 + i * 2) * 0.002;
        });
        renderer.render(scene, camera);
    }
    tick();

    addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });
})();


// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.getElementById('header');
    const menuBtn = document.getElementById('menuToggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const closeMenu = () => {
        if (!menuBtn || !navbar) return;
        navbar.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    // --- Scroll Reveal ---
    const revealEls = document.querySelectorAll('.glass-card, .service-card, .stat-item, .about-img, .about-text, .contact-info, .contact-form, .section-header, .capability-card, footer');
    revealEls.forEach(el => el.classList.add('reveal'));

    if (prefersReducedMotion) {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => revealObserver.observe(el));
    }

    // --- Sticky Header ---
    const syncHeader = () => {
        header.classList.toggle('scrolled', scrollY > 60);
    };
    window.addEventListener('scroll', syncHeader, { passive: true });
    syncHeader();

    // --- Active Nav Link ---
    const syncActiveNav = () => {
        let current = 'home';
        sections.forEach(s => {
            if (scrollY >= s.offsetTop - 180) current = s.id;
        });
        if (current === 'results') current = 'home';
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    };
    window.addEventListener('scroll', syncActiveNav, { passive: true });
    syncActiveNav();

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') !== 'light';
            document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }

    const saved = localStorage.getItem('theme');
    if (saved) document.body.setAttribute('data-theme', saved);

    // --- Mobile Menu ---
    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', () => {
            const isOpen = navbar.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });

        navLinks.forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 920) closeMenu();
        });
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;

            const headerOffset = header ? header.offsetHeight + 20 : 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top: targetTop,
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            });
        });
    });

    // --- Contact Form ---
    const form = document.getElementById('contactForm');
    if (form) {
        const status = document.getElementById('formStatus');

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const formData = new FormData(form);
            const name = (formData.get('name') || '').toString().trim();
            const business = (formData.get('business') || '').toString().trim();
            const goal = (formData.get('goal') || '').toString().trim();
            const message = (formData.get('message') || '').toString().trim();
            const brief = [
                `Name: ${name}`,
                business ? `Company or Brand: ${business}` : 'Company or Brand: Not specified',
                `Primary Goal: ${goal}`,
                'Project Brief:',
                message,
            ].join('\n');

            btn.textContent = 'Copying...';
            btn.disabled = true;

            try {
                await navigator.clipboard.writeText(brief);
                status.textContent = 'Project brief copied. Paste it into a LinkedIn message to start the conversation.';
                btn.textContent = 'Copied';
                btn.style.background = '#10b981';
                form.reset();
            } catch (error) {
                status.textContent = 'Copy failed. Please copy the details manually and send them on LinkedIn.';
                btn.textContent = 'Request a Strategy Call';
            } finally {
                setTimeout(() => {
                    btn.textContent = 'Request a Strategy Call';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 2200);
            }
        });
    }

});
