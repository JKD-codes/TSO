document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Smooth scroll handler for all links pointing to #...
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      if (targetId === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Close mobile menu if open
      const navMenu = document.getElementById('nav-menu');
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  });

  // Sticky Navbar Scroll Effect
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active state on scroll
    updateActiveNavLink();
  });

  function updateActiveNavLink() {
    const sections = ['home', 'work', 'contact'];
    const scrollPosition = window.scrollY + 200;

    sections.forEach(sectionId => {
      const el = document.getElementById(sectionId);
      const link = document.getElementById(`link-${sectionId}`);
      if (el && link) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Work Tabs Switcher (Cinematography vs Short Films)
  const tabCinematography = document.getElementById('tab-cinematography');
  const tabShortFilms = document.getElementById('tab-short-films');
  const panelCinematography = document.getElementById('panel-cinematography');
  const panelShortFilms = document.getElementById('panel-short-films');

  if (tabCinematography && tabShortFilms) {
    tabCinematography.addEventListener('click', () => {
      tabCinematography.classList.add('active');
      tabCinematography.setAttribute('aria-selected', 'true');
      tabShortFilms.classList.remove('active');
      tabShortFilms.setAttribute('aria-selected', 'false');

      panelCinematography.classList.add('active');
      panelShortFilms.classList.remove('active');
    });

    tabShortFilms.addEventListener('click', () => {
      tabShortFilms.classList.add('active');
      tabShortFilms.setAttribute('aria-selected', 'true');
      tabCinematography.classList.remove('active');
      tabCinematography.setAttribute('aria-selected', 'false');

      panelShortFilms.classList.add('active');
      panelCinematography.classList.remove('active');
    });
  }

  // Lightbox Modal for Cinematography Stills
  const stillCards = document.querySelectorAll('.still-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  stillCards.forEach(card => {
    card.addEventListener('click', () => {
      const fullSrc = card.getAttribute('data-full');
      if (fullSrc && lightboxModal && lightboxImg) {
        lightboxImg.src = fullSrc;
        lightboxModal.classList.add('open');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Interactive Video Player Handlers
  const videoFrames = document.querySelectorAll('.video-player-frame');
  videoFrames.forEach(frame => {
    frame.addEventListener('click', function(e) {
      // Don't re-trigger if already playing
      if (this.classList.contains('is-playing')) return;

      const videoId = this.getAttribute('data-video-id');
      const target = this.querySelector('.video-player-target');
      if (videoId && target) {
        this.classList.add('is-playing');
        
        let embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
        if (window.location.protocol.startsWith('http') && window.location.origin) {
          embedSrc += `&origin=${encodeURIComponent(window.location.origin)}`;
        }

        // Dynamically create iframe
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', embedSrc);
        iframe.setAttribute('title', 'YouTube video player');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        if (window.location.protocol.startsWith('http')) {
          iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        }
        iframe.setAttribute('allowfullscreen', 'true');
        target.appendChild(iframe);
      }
    });
  });

  // Contact Form Submission
  const projectForm = document.getElementById('project-form');
  const formFeedback = document.getElementById('form-feedback');

  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(projectForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const sessionType = formData.get('session_type');
      const message = formData.get('message') || 'No specific notes provided.';

      // Construct mailto link so user can immediately send an email with all prefilled details
      const subject = encodeURIComponent(`Project Inquiry: ${sessionType} - ${name}`);
      const body = encodeURIComponent(
        `Hi Tanmay,\n\nI would like to inquire about your services.\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Project / Session Type: ${sessionType}\n\n` +
        `Details / Concept:\n${message}\n\n` +
        `Best regards,\n${name}`
      );

      // Open email client
      const mailtoUrl = `mailto:tanmayomblemarket@gmail.com?subject=${subject}&body=${body}`;
      
      if (formFeedback) {
        formFeedback.innerHTML = `✓ Thank you <strong>${name}</strong>! Opening your email client to dispatch this directly to <em>tanmayomblemarket@gmail.com</em>.`;
        formFeedback.classList.add('success');
      }
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);
    });
  }

  // Interactive Background Water / Glow Ripple Effect
  initBackgroundRipple();
});

function initBackgroundRipple() {
  const canvas = document.getElementById('ripple-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ripples = [];
  const maxRipples = 40;

  class Ripple {
    constructor(x, y, maxRadius = 140, speed = 2.2, color = 'rgba(229, 169, 60, ') {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = maxRadius;
      this.speed = speed;
      this.opacity = 0.5;
      this.decay = 0.007;
      this.color = color;
      this.lineWidth = 2.2;
    }

    update() {
      this.radius += this.speed;
      this.opacity -= this.decay;
      if (this.lineWidth > 0.4) {
        this.lineWidth -= 0.015;
      }
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI * 2);
      ctx.strokeStyle = `${this.color}${this.opacity})`;
      ctx.lineWidth = this.lineWidth;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `${this.color}${this.opacity * 0.8})`;
      ctx.stroke();

      // Inner subtle harmonic ripple
      if (this.radius > 25) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.radius - 18), 0, Math.PI * 2);
        ctx.strokeStyle = `${this.color}${this.opacity * 0.35})`;
        ctx.lineWidth = Math.max(0.2, this.lineWidth * 0.6);
        ctx.stroke();
      }

      ctx.restore();
    }

    isDone() {
      return this.opacity <= 0 || this.radius >= this.maxRadius;
    }
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function addRipple(x, y, maxRadius = 160, speed = 2.5, color = 'rgba(229, 169, 60, ') {
    if (isMobile()) return;
    if (ripples.length > maxRipples) {
      ripples.shift();
    }
    ripples.push(new Ripple(x, y, maxRadius, speed, color));
  }

  // Mouse move event throttling (Desktop only)
  let lastMove = 0;
  window.addEventListener('mousemove', (e) => {
    if (isMobile()) return;
    const now = performance.now();
    if (now - lastMove > 90) {
      addRipple(e.clientX, e.clientY, 100, 1.8, 'rgba(229, 169, 60, ');
      lastMove = now;
    }
  });

  // Click event makes a pronounced burst ripple (Desktop only)
  window.addEventListener('click', (e) => {
    if (isMobile()) return;
    addRipple(e.clientX, e.clientY, 220, 3.2, 'rgba(245, 158, 11, ');
    setTimeout(() => {
      addRipple(e.clientX, e.clientY, 170, 2.4, 'rgba(255, 255, 255, ');
    }, 90);
  });

  // Ambient gentle ripple every few seconds for alive atmospheric cinema feel (Desktop only)
  setInterval(() => {
    if (isMobile()) return;
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    addRipple(rx, ry, 180, 1.4, 'rgba(229, 169, 60, ');
  }, 3500);

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.update();
      r.draw(ctx);
      if (r.isDone()) {
        ripples.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

