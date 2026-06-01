/* =============================================
   ZENTRAX PREMIUM — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──────────────────────────────────
  const loader = document.getElementById('loader');
  document.body.classList.add('loading');

  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    revealInit();
  }, 2400);


  // ── NAVBAR SCROLL ───────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }, { passive: true });

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  }


  // ── MOBILE MENU ─────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });


  // ── SMOOTH SCROLL ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── SCROLL REVEAL ───────────────────────────
  function revealInit() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.min(idx * 80, 400));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));
  }


  // ── COUNTER ANIMATION ───────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.stat-num, .hstat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));


  // ── TESTIMONIALS CAROUSEL ───────────────────
  const track = document.getElementById('testiTrack');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testi-card').length;
  let autoplay;

  function goToSlide(n) {
    currentSlide = (n + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });
  dots.forEach(d => d.addEventListener('click', () => { goToSlide(parseInt(d.dataset.i)); resetAutoplay(); }));

  function startAutoplay() {
    autoplay = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }
  startAutoplay();


  // ── CONTACT FORM → SQLite API ────────────────
  const contactForm = document.getElementById('contactForm');
  const formStatus  = document.getElementById('formStatus');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        name:    contactForm.name.value.trim(),
        email:   contactForm.email.value.trim(),
        phone:   contactForm.phone.value.trim(),
        service: contactForm.service.value,
        message: contactForm.message.value.trim(),
      };

      // Basic validation
      if (!data.name || !data.email || !data.message) {
        showStatus('Please fill in Name, Email and Project Brief.', 'error');
        return;
      }

      // Disable button while sending
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      hideStatus();

      try {
        const res = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          showStatus('Message Sent ✓  We\'ll be in touch shortly.', 'success');
          contactForm.reset();
        } else {
          showStatus(result.message || 'Error saving data. Please try again.', 'error');
        }
      } catch (err) {
        console.error(err);
        showStatus('Unable to reach server. Please ensure the backend is running.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
    formStatus.style.display = 'block';
  }
  function hideStatus() {
    if (!formStatus) return;
    formStatus.style.display = 'none';
  }


  // ── LUXURY CURSOR TRAIL (desktop only) ──────
  if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed; width: 8px; height: 8px; background: rgba(201,168,76,0.7);
      border-radius: 50%; pointer-events: none; z-index: 99999;
      transition: transform 0.15s ease, opacity 0.15s ease;
      transform: translate(-50%,-50%);
    `;
    document.body.appendChild(cursor);

    const ring = document.createElement('div');
    ring.style.cssText = `
      position: fixed; width: 36px; height: 36px; border: 1px solid rgba(201,168,76,0.35);
      border-radius: 50%; pointer-events: none; z-index: 99998;
      transition: transform 0.4s ease, left 0.08s linear, top 0.08s linear;
      transform: translate(-50%,-50%);
    `;
    document.body.appendChild(ring);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; });
      el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; });
    });
  }


  // ── PROPERTY MODALS ─────────────────────────
  const MODAL_DATA = {
    vertex: {
      title: 'Vertex Tower',
      cat: 'Mixed-Use Development',
      location: 'Mysuru, Karnataka',
      desc: 'A landmark mixed-use tower combining premium office spaces with luxury residences. Designed for the modern professional, Vertex Tower offers world-class amenities and breathtaking city views.',
      status: 'Completed — 2025',
      price: 'Contact for Pricing',
      badge: 'Commercial & Residential',
      img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80'
    },
    coastal: {
      title: 'Coastal Residence',
      cat: 'Luxury Living',
      location: 'Mysuru, Karnataka',
      desc: 'An exclusive coastal-inspired residential community featuring premium 2 & 3 BHK apartments with open-plan layouts, natural light, and high-end finishes throughout.',
      status: 'Completed — 2025',
      price: 'Available on Request',
      badge: 'Luxury Residential',
      img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'
    },
    innovation: {
      title: 'Innovation Center',
      cat: 'Corporate Campus',
      location: 'Mysuru, Karnataka',
      desc: 'A state-of-the-art corporate campus built to inspire collaboration and creativity. Features open-plan workspaces, conference suites, and sustainable design elements.',
      status: 'Completed — 2025',
      price: 'Lease Enquiry Open',
      badge: 'Corporate Campus',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
    },
    township: {
      title: 'Residential Township',
      cat: 'Planned Community',
      location: 'Ilavala Hobli, Mysuru',
      desc: 'A thoughtfully planned residential township with integrated green spaces, community facilities, and premium homes. Vastu-compliant layouts with modern infrastructure.',
      status: 'Completed — 2024',
      price: 'Units Available',
      badge: 'Planned Community',
      img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'
    },
    hombelaku: {
      title: 'Hombelaku Residences',
      cat: 'Residential Property',
      location: '#44, Hombelaku, Ilavala Hobli, Mysuru',
      desc: 'A premium multi-storey residential building offering spacious, Vastu-compliant homes with modern architecture, dedicated parking, and 24/7 security. Available for immediate lease.',
      status: 'Available for Lease',
      price: 'Contact for Lease Rate',
      badge: 'Available Now',
      img: 'property.jpg'
    }
  };

  const modalOverlay = document.getElementById('propertyModal');
  const modalClose  = document.getElementById('modalClose');

  function openModal(key) {
    const d = MODAL_DATA[key];
    if (!d) return;
    document.getElementById('modalImg').src = d.img;
    document.getElementById('modalImg').alt = d.title;
    document.getElementById('modalBadge').textContent = d.badge;
    document.getElementById('modalCat').textContent = d.cat;
    document.getElementById('modalTitle').textContent = d.title;
    document.getElementById('modalLocationText').textContent = d.location;
    document.getElementById('modalDesc').textContent = d.desc;
    document.getElementById('modalStatus').textContent = d.status;
    document.getElementById('modalPrice').textContent = d.price;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(el.dataset.modal);
    });
  });

  // Also trigger on port-card click
  document.querySelectorAll('.port-card[data-modal]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.modal));
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Close modal and scroll to contact on Enquire Now click
  document.querySelector('.modal-enquire-btn').addEventListener('click', closeModal);


  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (heroBg && window.scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.2}px)`;
    }
  }, { passive: true });

});
