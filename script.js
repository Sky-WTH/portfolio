/* ===========================================
   SCRIPT.JS — Interactive behaviors for
   Bihangesh Guha's portfolio
   =========================================== */

// ——— Particle Background Canvas ———
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouse;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  mouse = { x: -1000, y: -1000 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function createParticles() {
    const count = Math.floor((width * height) / 18000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse interaction — gentle repel
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 150) {
        const force = (150 - mDist) / 150 * 0.02;
        p.vx += (mdx / mDist) * force;
        p.vy += (mdy / mDist) * force;
      }

      // Dampen velocity
      p.vx *= 0.999;
      p.vy *= 0.999;
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();


// ——— Navbar scroll effect ———
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Scroll class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();


// ——— Active nav link on scroll ———
(function initActiveNav() {
  const sections = document.querySelectorAll('.section, .hero');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function setActive() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive);
  setActive();
})();


// ——— Scroll reveal (Intersection Observer) ———
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  reveals.forEach(el => observer.observe(el));
})();


// ——— Smooth scroll for anchor links ———
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});


// ——— Typing effect for hero badge (subtle) ———
(function initTyping() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  // Subtle pulse already handled in CSS
})();


// ——— Contact form UX (Web3Forms) ———
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const btn = form.querySelector('.form-submit');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    // Show loading state
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.7';
    statusEl.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        statusEl.textContent = '✅ Message sent! I\'ll get back to you soon.';
        statusEl.style.color = '#00ff88';
        statusEl.style.display = 'block';
        form.reset();
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (err) {
      statusEl.textContent = '❌ Failed to send. Please try emailing me directly.';
      statusEl.style.color = '#ff4444';
      statusEl.style.display = 'block';
      console.error('Form error:', err);
    } finally {
      btn.textContent = original;
      btn.style.pointerEvents = '';
      btn.style.opacity = '';
    }
  });
})();
