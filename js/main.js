document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to run animation only once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 2. STICKY HEADER
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // 3. MOBILE MENU TOGGLE
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('open');
      navLinks.classList.toggle('open');

      // Prevent body scrolling when menu is open
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. MENU FILTER LOGIC (Only runs on menu.html)
  const filterButtons = document.querySelectorAll('.menu-nav-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  if (filterButtons.length > 0 && menuItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and add to clicked
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.getAttribute('data-category');

        menuItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');

          if (category === 'all' || itemCategory === category) {
            item.style.display = 'flex';
            // Trigger a tiny reflow to allow transition to run
            void item.offsetWidth;
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            // Hide element from layout after transition completes
            setTimeout(() => {
              if (item.style.opacity === '0') {
                item.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // 5. CONTACT FORM HANDLING (Only runs on contacto.html)
  const contactForm = document.getElementById('dchicken-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Add loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Enviando...</span>';

      // Simulate API call
      setTimeout(() => {
        // Show custom modal or message
        const successMessage = document.createElement('div');
        successMessage.className = 'reveal active';
        successMessage.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(20, 19, 17, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          border-radius: 24px;
          z-index: 10;
          text-align: center;
          padding: 2rem;
          border: 1px solid var(--primary);
        `;

        successMessage.innerHTML = `
          <svg style="width: 64px; height: 64px; fill: var(--primary);" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3 style="font-size: 1.8rem; font-family: var(--font-title);">¡Mensaje Enviado!</h3>
          <p style="color: var(--text-muted); max-width: 320px;">Gracias por contactar con D'Chicken. Nos pondremos en contacto contigo lo antes posible.</p>
          <button class="btn btn-primary" style="margin-top: 1rem;" id="close-success-btn">Aceptar</button>
        `;

        contactForm.appendChild(successMessage);
        contactForm.reset();

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        document.getElementById('close-success-btn').addEventListener('click', () => {
          successMessage.remove();
        });
      }, 1500);
    });
  }
});
