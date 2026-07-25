document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // STICKY HEADER & ACTIVE NAVIGATION LINKS
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scroll state for sticky header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Dynamic active links on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // MOBILE NAVIGATION HAMBURGER MENU
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu if clicked outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });


  // ==========================================
  // INTERSECTION OBSERVER FOR FADE-IN
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing after animation triggers
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));


  // ==========================================
  // MENU CATEGORY TABS TRANSITIONS
  // ==========================================
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const menuPanes = document.querySelectorAll('.menu-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate current active tab
      tabButtons.forEach(t => t.classList.remove('active'));
      // Activate clicked tab
      btn.classList.add('active');

      const targetPaneId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetPaneId);

      // Fade out current active pane first
      const currentPane = document.querySelector('.menu-pane.active');
      if (currentPane) {
        currentPane.style.opacity = '0';
        currentPane.style.transform = 'translateY(15px)';
        
        setTimeout(() => {
          currentPane.classList.remove('active');
          
          // Show target pane
          targetPane.classList.add('active');
          // Trigger browser layout before starting transitions
          targetPane.offsetHeight; 
          targetPane.style.opacity = '1';
          targetPane.style.transform = 'translateY(0)';
        }, 300); // matches fade duration
      }
    });
  });


  // ==========================================
  // GALLERY LIGHTBOX WITH FULL ACCESSIBILITY
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentImgIndex = 0;
  const galleryImagesData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-src'),
    title: item.getAttribute('data-title'),
    category: item.getAttribute('data-category')
  }));

  const openLightbox = (index) => {
    currentImgIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scroll
  };

  const updateLightboxContent = () => {
    const item = galleryImagesData[currentImgIndex];
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = `${item.category}: ${item.title}`;
      lightboxCaption.textContent = `${item.title} — ${item.category}`;
      lightboxImg.style.opacity = '1';
    }, 200);
  };

  const nextImage = () => {
    currentImgIndex = (currentImgIndex + 1) % galleryImagesData.length;
    updateLightboxContent();
  };

  const prevImage = () => {
    currentImgIndex = (currentImgIndex - 1 + galleryImagesData.length) % galleryImagesData.length;
    updateLightboxContent();
  };

  // Add click listeners to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  // Lightbox controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextImage);
  lightboxPrev.addEventListener('click', prevImage);

  // Click outside to close lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch Swipe Support for Lightbox on Mobile
  let lightboxStartX = 0;
  let lightboxIsSwiping = false;

  lightbox.addEventListener('touchstart', (e) => {
    lightboxStartX = e.touches[0].clientX;
    lightboxIsSwiping = true;
  }, { passive: true });

  lightbox.addEventListener('touchmove', (e) => {
    if (!lightboxIsSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = lightboxStartX - currentX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
      lightboxIsSwiping = false;
    }
  }, { passive: true });

  lightbox.addEventListener('touchend', () => {
    lightboxIsSwiping = false;
  });


  // ==========================================
  // TESTIMONIALS CAROUSEL SLIDER
  // ==========================================
  const track = document.getElementById('testimonials-track');
  const slides = Array.from(track.children);
  const nextButton = document.getElementById('testimonials-next');
  const prevButton = document.getElementById('testimonials-prev');
  const dotsContainer = document.getElementById('testimonials-dots');
  const dots = Array.from(dotsContainer.children);

  let currentSlideIndex = 0;
  let slideInterval;

  const updateSlidePosition = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentSlideIndex = index;
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    slides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const nextSlide = () => {
    updateSlidePosition(currentSlideIndex + 1);
  };

  const prevSlide = () => {
    updateSlidePosition(currentSlideIndex - 1);
  };

  const startAutoplay = () => {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, 6000);
  };

  const stopAutoplay = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  };

  nextButton.addEventListener('click', () => {
    nextSlide();
    startAutoplay();
  });

  prevButton.addEventListener('click', () => {
    prevSlide();
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlidePosition(index);
      startAutoplay();
    });
  });

  // Touch Swipe Support for Mobile
  let startX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      isSwiping = false;
    }
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isSwiping = false;
    startAutoplay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  startAutoplay();


  // ==========================================
  // RESERVATION FORM VALIDATION & MODAL
  // ==========================================
  const resForm = document.getElementById('reservation-form');
  const modal = document.getElementById('confirmation-modal');
  const modalMessage = document.getElementById('modal-message');
  const closeModalBtn = document.getElementById('close-modal-btn');

  // Input elements
  const fields = {
    name: document.getElementById('res-name'),
    email: document.getElementById('res-email'),
    phone: document.getElementById('res-phone'),
    size: document.getElementById('res-size'),
    date: document.getElementById('res-date'),
    time: document.getElementById('res-time')
  };

  // Set minimum date to today's date
  const today = new Date().toISOString().split('T')[0];
  fields.date.setAttribute('min', today);

  // Helper validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    // Matches 10 digit phone format (ignoring spaces, dashes, parentheses)
    const rawNum = phone.replace(/\D/g, '');
    return rawNum.length === 10;
  };

  const checkField = (field, validationFn) => {
    let isValid = true;
    if (validationFn) {
      isValid = validationFn(field.value);
    } else {
      isValid = field.value.trim() !== '';
    }

    if (isValid) {
      field.classList.remove('error');
    } else {
      field.classList.add('error');
    }
    return isValid;
  };

  // Real-time error removal
  Object.keys(fields).forEach(key => {
    fields[key].addEventListener('input', () => {
      fields[key].classList.remove('error');
    });
    fields[key].addEventListener('change', () => {
      fields[key].classList.remove('error');
    });
  });

  // Submit handler
  resForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check all fields
    const isNameValid = checkField(fields.name);
    const isEmailValid = checkField(fields.email, validateEmail);
    const isPhoneValid = checkField(fields.phone, validatePhone);
    const isSizeValid = checkField(fields.size);
    const isDateValid = checkField(fields.date, (val) => {
      return val !== '' && val >= today;
    });
    const isTimeValid = checkField(fields.time);

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isSizeValid && isDateValid && isTimeValid;

    if (isFormValid) {
      // Build confirmation details
      const clientName = fields.name.value.trim();
      const partySize = fields.size.options[fields.size.selectedIndex].text;
      const formattedDate = new Date(fields.date.value).toLocaleDateString(undefined, { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
      const selectedTime = fields.time.options[fields.time.selectedIndex].text;

      modalMessage.innerHTML = `Dear <strong>${clientName}</strong>, your reservation for <strong>${partySize}</strong> on <strong>${formattedDate}</strong> at <strong>${selectedTime}</strong> has been secured.<br><br>A confirmation details email has been sent to <strong>${fields.email.value}</strong>. We look forward to hosting you.`;

      // Show success modal
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Reset form
      resForm.reset();
    }
  });

  // Close confirmation modal
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeModalBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });


  // ==========================================
  // CUSTOM TOAST NOTIFICATION SYSTEM
  // ==========================================
  const toastContainer = document.getElementById('toast-container');

  const showToast = (title, message, iconClass = 'fa-solid fa-bell') => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon"><i class="${iconClass}"></i></div>
      <div class="toast-body">
        <h4 class="toast-title">${title}</h4>
        <p class="toast-message">${message}</p>
      </div>
      <button class="toast-close" aria-label="Close notification"><i class="fa-solid fa-xmark"></i></button>
    `;

    toastContainer.appendChild(toast);

    // Trigger transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    const removeToast = () => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    };

    // Close button event
    toast.querySelector('.toast-close').addEventListener('click', removeToast);

    // Auto dismiss after 5 seconds
    setTimeout(removeToast, 5000);
  };


  // ==========================================
  // NEWSLETTER FORM SUBMISSION
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('.newsletter-input');
    
    showToast(
      'Subscription Successful',
      `Thank you! ${input.value} has been subscribed to the Amara newsletter.`,
      'fa-solid fa-circle-check'
    );
    newsletterForm.reset();
  });

  // ==========================================
  // CUSTOM LUXURY TRAILING CURSOR
  // ==========================================
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isMoving = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!isMoving) {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
      isMoving = true;
    }

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  };
  requestAnimationFrame(animateCursor);

  // Hover states for links and buttons
  const clickables = document.querySelectorAll('a, button, select, input, textarea, .gallery-item, .menu-tab-btn');
  clickables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorDot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorDot.classList.remove('hover');
    });
  });

  // Click active state
  document.addEventListener('mousedown', () => {
    cursor.classList.add('active');
  });
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
  });

  // Hide on mouseleave
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
    isMoving = false;
  });

});
