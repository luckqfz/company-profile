/**
 * PT ASA DIGITAL - COMPANY PROFILE INTERACTIVE ENGINE
 * Manages mode switching (Landing, Presentation, Document), sliders, filter, FAQs, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global DOM elements
  const body = document.body;
  const sections = Array.from(document.querySelectorAll('section'));
  const header = document.querySelector('header.site-header');

  // 1. SCROLL ACTIONS & STICKY HEADER
  window.addEventListener('scroll', () => {
    if (body.classList.contains('mode-landing')) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      highlightNav();
    }
  });

  function highlightNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(sec => {
      if (sec.id) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('nav.main-nav a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${sec.id}`) {
              a.classList.add('active');
            }
          });
        }
      }
    });
  }

  // 2. LAYOUT MODE SWITCHER
  const landingBtn = document.getElementById('btn-mode-landing');
  const presBtn = document.getElementById('btn-mode-presentation');
  const docBtn = document.getElementById('btn-mode-document');

  let currentMode = 'landing'; // 'landing', 'presentation', 'document'
  let currentSlideIndex = 0;

  // Initialize page mode class
  body.classList.add('mode-landing');

  landingBtn.addEventListener('click', () => setMode('landing'));
  presBtn.addEventListener('click', () => setMode('presentation'));
  docBtn.addEventListener('click', () => setMode('document'));

  function setMode(mode) {
    currentMode = mode;
    body.classList.remove('mode-landing', 'mode-presentation', 'mode-document');
    body.classList.add(`mode-${mode}`);

    // Update active button state
    landingBtn.classList.remove('active');
    presBtn.classList.remove('active');
    docBtn.classList.remove('active');

    if (mode === 'landing') {
      landingBtn.classList.add('active');
      // Restore section visibility and inline styles
      sections.forEach(sec => {
        sec.style.display = '';
        sec.classList.remove('slide-active');
        const container = sec.querySelector('.container');
        if (container) container.classList.remove('slide-container');
      });
      // Restore header
      header.style.position = '';
      header.classList.remove('scrolled-light');
      window.scrollTo(0, 0);
    } 
    else if (mode === 'presentation') {
      presBtn.classList.add('active');
      // Configure slide styling class
      sections.forEach((sec, idx) => {
        sec.classList.remove('slide-active');
        const container = sec.querySelector('.container');
        if (container) container.classList.add('slide-container');
      });
      currentSlideIndex = 0;
      goToSlide(currentSlideIndex);
    } 
    else if (mode === 'document') {
      docBtn.classList.add('active');
      // Restore elements for document structure
      sections.forEach(sec => {
        sec.style.display = '';
        sec.classList.remove('slide-active');
        const container = sec.querySelector('.container');
        if (container) container.classList.remove('slide-container');
      });
      // Smooth reset view
      window.scrollTo(0, 0);
    }
  }

  // 3. PRESENTATION SLIDESHOOTER LOGIC
  const prevSlideBtn = document.getElementById('pres-prev');
  const nextSlideBtn = document.getElementById('pres-next');
  const slideNumText = document.getElementById('slide-num');
  const progressBar = document.getElementById('slide-progress');

  prevSlideBtn.addEventListener('click', prevSlide);
  nextSlideBtn.addEventListener('click', nextSlide);

  // Keyboard navigation listener
  document.addEventListener('keydown', (e) => {
    if (currentMode === 'presentation') {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    }
  });

  function goToSlide(index) {
    if (index < 0 || index >= sections.length) return;
    
    // Deactivate previous slide
    sections.forEach(sec => {
      sec.classList.remove('slide-active');
      sec.style.display = 'none';
    });

    currentSlideIndex = index;
    const activeSec = sections[currentSlideIndex];
    activeSec.classList.add('slide-active');
    activeSec.style.display = 'flex';

    // Slide specific indicators
    slideNumText.textContent = `${currentSlideIndex + 1} / ${sections.length}`;
    
    // Progress bar update
    const percent = ((currentSlideIndex + 1) / sections.length) * 100;
    progressBar.style.width = `${percent}%`;

    // Active slide auto-focus
    activeSec.scrollIntoView({ behavior: 'auto', block: 'center' });
  }

  function nextSlide() {
    if (currentSlideIndex < sections.length - 1) {
      goToSlide(currentSlideIndex + 1);
    } else {
      // Wrap back to beginning
      goToSlide(0);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    } else {
      // Wrap to end
      goToSlide(sections.length - 1);
    }
  }

  // 4. PORTFOLIO TABS FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 5. TESTIMONIAL CLIENT SLIDER
  const testiContainer = document.querySelector('.testi-container');
  const testiCards = document.querySelectorAll('.testi-card');
  const testiPrev = document.getElementById('testi-prev');
  const testiNext = document.getElementById('testi-next');

  let testiIndex = 0;
  const totalTestis = testiCards.length;

  if (testiPrev && testiNext && testiContainer) {
    testiPrev.addEventListener('click', () => {
      testiIndex = (testiIndex === 0) ? totalTestis - 1 : testiIndex - 1;
      updateTestiSlider();
    });

    testiNext.addEventListener('click', () => {
      testiIndex = (testiIndex === totalTestis - 1) ? 0 : testiIndex + 1;
      updateTestiSlider();
    });

    function updateTestiSlider() {
      const translateAmount = -testiIndex * 100;
      testiContainer.style.transform = `translateX(${translateAmount}%)`;
    }

    // Auto cycle testimonials in Landing Mode every 8s
    let autoSlider = setInterval(() => {
      if (currentMode === 'landing') {
        testiIndex = (testiIndex === totalTestis - 1) ? 0 : testiIndex + 1;
        updateTestiSlider();
      }
    }, 8000);

    // Pause auto cycle on manual interaction
    const resetTimer = () => {
      clearInterval(autoSlider);
      autoSlider = setInterval(() => {
        if (currentMode === 'landing') {
          testiIndex = (testiIndex === totalTestis - 1) ? 0 : testiIndex + 1;
          updateTestiSlider();
        }
      }, 8000);
    };

    testiPrev.addEventListener('click', resetTimer);
    testiNext.addEventListener('click', resetTimer);
  }

  // 6. FAQ ACCORDION LOGIC
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse other open FAQ items
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // 7. ORG CHART INTERACTION
  const orgCards = document.querySelectorAll('.org-card');
  orgCards.forEach(card => {
    card.addEventListener('click', () => {
      const role = card.querySelector('.org-role').textContent;
      const desc = card.querySelector('.org-desc').textContent;
      const name = card.querySelector('h3').textContent;

      // Log action or highlight
      card.style.borderColor = 'var(--secondary)';
      card.style.boxShadow = 'var(--shadow-glow)';
      setTimeout(() => {
        card.style.borderColor = '';
        card.style.boxShadow = '';
      }, 2000);
    });
  });

  // 8. CONTACT FORM VALIDATION & SUCCESS MODAL
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        alert('Harap lengkapi Nama, Email, dan Pesan Anda.');
        return;
      }

      // Simulate API submission with visual success dialog
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Mengirim Pesan...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Clear inputs
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Render success modal
        showSuccessModal(name);
      }, 1500);
    });
  }

  function showSuccessModal(senderName) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(27, 36, 42, 0.9)';
    modal.style.backdropFilter = 'blur(15px)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '2000';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.4s ease';

    const card = document.createElement('div');
    card.style.backgroundColor = '#FFFFFF';
    card.style.border = '1px solid var(--secondary)';
    card.style.borderRadius = '24px';
    card.style.padding = '3.5rem 2.5rem';
    card.style.maxWidth = '500px';
    card.style.textAlign = 'center';
    card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.5)';
    card.style.transform = 'scale(0.9)';
    card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';

    card.innerHTML = `
      <div style="width: 70px; height: 70px; border-radius: 50%; background-color: rgba(126, 172, 181, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: #7EACB5;">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.825-8.537z"/>
        </svg>
      </div>
      <h3 style="font-family: var(--font-heading); color: #1B242A; font-size: 26px; margin-bottom: 1rem;">Terima Kasih, ${senderName}!</h3>
      <p style="font-family: var(--font-body); color: #6F7D85; font-size: 16px; margin-bottom: 2rem; line-height: 1.6;">Pesan Anda telah berhasil kami terima. Tim konsultan PT Asa Digital akan segera menghubungi Anda kembali dalam kurun waktu 1x24 jam untuk mendiskusikan kebutuhan bisnis Anda.</p>
      <button class="btn btn-primary" style="margin: 0 auto; min-width: 150px;">Tutup</button>
    `;

    modal.appendChild(card);
    body.appendChild(modal);

    // Trigger transitions
    setTimeout(() => {
      modal.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 50);

    const closeBtn = card.querySelector('button');
    closeBtn.addEventListener('click', () => {
      modal.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => {
        modal.remove();
      }, 400);
    });
  }
});
