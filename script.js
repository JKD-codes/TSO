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
});
