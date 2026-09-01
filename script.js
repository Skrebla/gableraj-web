(function () {
    // Lightbox logic
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
      const lightboxPicture = lightbox.querySelector('#lightbox-picture');
      const lightboxImg = lightbox.querySelector('img');
      const closeBtn = lightbox.querySelector('.lightbox-close');
  
      function openLightbox(src, alt) {
        // Check if the source is AVIF and set up proper fallback
        if (src.includes('.avif')) {
          // If AVIF, create sources with AVIF and WebP fallback
          const webpSrc = src.replace('.avif', '.webp');
          lightboxPicture.innerHTML = `
            <source srcset="${src}" type="image/avif" />
            <img src="${webpSrc}" alt="${alt || 'Galerija'}" />
          `;
        } else {
          // For WebP or other formats, use directly
          const img = lightboxPicture.querySelector('img');
          if (img) {
            img.src = src;
            img.alt = alt || 'Galerija';
          }
        }
        lightbox.classList.add('is-open');
        
        // Hide navbar when lightbox opens
        const navbar = document.querySelector('.navbar');
        if (navbar) {
          navbar.classList.add('navbar-hidden');
        }
      }
  
      function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightboxImg.src = '';
        
        // Restore navbar state based on scroll position
        // The scroll handler will take care of showing/hiding based on scroll direction
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
          // If at top, show navbar; otherwise let scroll handler decide
          if (scrollTop <= 0) {
            navbar.classList.remove('navbar-hidden');
          }
          // Trigger scroll event to update navbar state
          window.dispatchEvent(new Event('scroll'));
        }
      }
  
      document.addEventListener('click', function (e) {
        const item = e.target.closest('.gallery-item, .gallery-main-item, .gallery-page-item, .locations-image-main, .locations-image-overlay');
        if (!item) return;
        // Check if there's a picture element, otherwise use img directly
        const picture = item.querySelector('picture');
        const img = picture ? picture.querySelector('img') : item.querySelector('img');
        if (!img) return;
        // Use currentSrc to get the actual image being displayed (AVIF or WebP)
        // Fallback to src if currentSrc is not available
        const imageSrc = img.currentSrc || img.src;
        openLightbox(imageSrc, img.alt);
      });
  
      closeBtn.addEventListener('click', closeLightbox);
  
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
  
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeLightbox();
        }
      });
    }
  
    // FAQ accordion logic
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      faqItems.forEach(function (item) {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;
  
        // set initial max-height for open items
        if (item.classList.contains('is-open')) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
  
        btn.addEventListener('click', function () {
          const isOpen = item.classList.contains('is-open');
  
          // close all
          faqItems.forEach(function (other) {
            other.classList.remove('is-open');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = null;
            }
          });
  
          // open clicked if it was closed
          if (!isOpen) {
            item.classList.add('is-open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });
      });
    }

    // FAQ items reveal from right to left, one by one
    const faqSection = document.querySelector('.faq');
    const allFaqItems = document.querySelectorAll('.faq-item');
    
    if (allFaqItems.length && faqSection && 'IntersectionObserver' in window) {
      const faqObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Reveal each FAQ item with staggered delays
              allFaqItems.forEach(function (item, index) {
                setTimeout(function () {
                  item.classList.add('is-visible');
                }, index * 150); // 150ms delay between each item
              });
              faqObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: '0px 0px -10% 0px',
        }
      );

      faqObserver.observe(faqSection);
    } else if (allFaqItems.length) {
      // Fallback without IntersectionObserver
      allFaqItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
    }

    // Service pill reveal on viewport entry
    const servicePills = document.querySelectorAll('.service-pill');
    const servicesSection = document.querySelector('.services');
    
    // Check if mobile device
    const isMobileDevice = window.innerWidth <= 767;
    
    if (servicePills.length && 'IntersectionObserver' in window) {
      if (isMobileDevice) {
        // On mobile: each pill appears individually when it comes into view
        servicePills.forEach((pill) => {
          const pillObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  pill.classList.add('is-visible');
                  pillObserver.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.3,
              rootMargin: '0px 0px -10% 0px',
            }
          );
          
          // Observe the parent service card instead of the pill itself
          const serviceCard = pill.closest('.service-card, .service-main-card');
          if (serviceCard) {
            pillObserver.observe(serviceCard);
          } else {
            pillObserver.observe(pill);
          }
        });
      } else {
        // On desktop: all pills appear when section comes into view
        if (servicesSection) {
          const sectionObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  servicePills.forEach((pill) => pill.classList.add('is-visible'));
                  sectionObserver.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.3,
              rootMargin: '0px 0px -30% 0px',
            }
          );
          sectionObserver.observe(servicesSection);
        }
      }
    } else if (servicePills.length) {
      // Fallback without IntersectionObserver
      if (isMobileDevice) {
        // On mobile: check each pill individually
        servicePills.forEach((pill) => {
          const serviceCard = pill.closest('.service-card, .service-main-card');
          if (serviceCard) {
            const rect = serviceCard.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) {
              pill.classList.add('is-visible');
            }
          }
        });
      } else {
        // On desktop: check if section is visible
        if (servicesSection) {
          const rect = servicesSection.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            servicePills.forEach((pill) => pill.classList.add('is-visible'));
          }
        }
      }
    }
  
    // Service cards clickable
    const serviceCards = document.querySelectorAll('.service-main-card, .service-card');
    serviceCards.forEach(function (card) {
      card.addEventListener('click', function () {
        // Check if card has a data-link attribute for navigation
        const link = card.getAttribute('data-link');
        if (link) {
          window.location.href = link;
        } else {
          // Fallback: scroll to contact section if no link specified
          const contactSection = document.getElementById('kontakt');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Catering features reveal on viewport entry
    const cateringFeatures = document.querySelectorAll('.catering-feature');
    const cateringSection = document.querySelector('.catering-highlight');
    
    // Check if mobile device for catering features
    const isMobileForCatering = window.innerWidth <= 767;
    
    if (cateringFeatures.length && 'IntersectionObserver' in window) {
      if (isMobileForCatering) {
        // On mobile: each feature appears individually when it comes into view
        cateringFeatures.forEach((feature) => {
          const featureObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  feature.classList.add('is-visible');
                  featureObserver.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.3,
              rootMargin: '0px 0px -10% 0px',
            }
          );
          
          featureObserver.observe(feature);
        });
      } else {
        // On desktop: all features appear together with staggered delays when section comes into view
        if (cateringSection) {
          const cateringObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  // Add is-visible to each feature with staggered delays (left to right)
                  cateringFeatures.forEach(function (feature, index) {
                    setTimeout(function () {
                      feature.classList.add('is-visible');
                    }, index * 200); // 200ms delay between each
                  });
                  cateringObserver.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.2,
              rootMargin: '0px 0px -20% 0px',
            }
          );
          cateringObserver.observe(cateringSection);
        }
      }
    } else if (cateringFeatures.length) {
      // Fallback without IntersectionObserver
      if (isMobileForCatering) {
        // On mobile: check each feature individually
        cateringFeatures.forEach((feature) => {
          const rect = feature.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            feature.classList.add('is-visible');
          }
        });
      } else {
        // On desktop: check if section is visible and show all with delays
        if (cateringSection) {
          const rect = cateringSection.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            cateringFeatures.forEach(function (feature, index) {
              setTimeout(function () {
                feature.classList.add('is-visible');
              }, index * 150);
            });
          }
        }
      }
    }

    // Animated number counter for stats
    const statValues = document.querySelectorAll('.stat-value');
    const aboutStats = document.querySelector('.about-stats');
    
    // Check if mobile device for stats animation
    const isMobileForStats = window.innerWidth <= 767;
    
    if (statValues.length && aboutStats && 'IntersectionObserver' in window) {
      let hasAnimated = false;
      
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true;
              
              statValues.forEach(function (stat) {
                const target = parseInt(stat.getAttribute('data-target'));
                const isMillionStat = target === 1000; // Special case for "1M+"
                const countTarget = isMillionStat ? 1000 : target;
                // Faster duration on mobile (1.5s) vs desktop (3s)
                const duration = isMobileForStats ? 1500 : 3000;
                const increment = countTarget / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = function () {
                  current += increment;
                  if (current < countTarget) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                  } else {
                    if (isMillionStat) {
                      stat.textContent = '1M+';
                    } else if (target === 897 || target === 40) {
                      stat.textContent = target + '+';
                    } else {
                      stat.textContent = target;
                    }
                  }
                };
                
                updateCounter();
              });
              
              statsObserver.unobserve(entry.target);
            }
          });
        },
        {
          // Lower threshold on mobile to trigger earlier
          threshold: isMobileForStats ? 0.2 : 0.5,
          rootMargin: isMobileForStats ? '0px 0px -5% 0px' : '0px 0px -10% 0px',
        }
      );
      
      statsObserver.observe(aboutStats);
    }

    // About image reveal from left


    // About-us image reveal from right
    const aboutUsMedia = document.querySelector('.about-us-media');
    const aboutUsSection = document.querySelector('.about-us-section');
    
    if (aboutUsMedia) {
      if (aboutUsSection && 'IntersectionObserver' in window) {
        const aboutUsImageObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                aboutUsMedia.classList.add('is-visible');
                aboutUsImageObserver.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.5,
            rootMargin: '100px 0px 0px 0px',
          }
        );

        aboutUsImageObserver.observe(aboutUsSection);
      } else {
        // Fallback without IntersectionObserver - show immediately
        aboutUsMedia.classList.add('is-visible');
      }
    }

    // Set footer year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    // Fancy text scroll animation (optimized)
    const fancyTextSection = document.querySelector('.fancy-text-section');
    const fancyTextFirst = document.querySelector('.fancy-text-row--first');
    const fancyTextSecond = document.querySelector('.fancy-text-row--second');
    
    if (fancyTextSection && fancyTextFirst && fancyTextSecond) {
      let ticking = false;
      let isInViewport = false;
      let cachedWindowHeight = window.innerHeight;
      
      // Cache window height and update on resize
      window.addEventListener('resize', function() {
        cachedWindowHeight = window.innerHeight;
      }, { passive: true });
      
      // Only run animation when section is in viewport
      if ('IntersectionObserver' in window) {
        const viewportObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isInViewport = entry.isIntersecting;
              if (isInViewport) {
                updateFancyText();
              }
            });
          },
          {
            rootMargin: '100px 0px 100px 0px' // Start animating slightly before/after viewport
          }
        );
        viewportObserver.observe(fancyTextSection);
      } else {
        // Fallback: always active if IntersectionObserver not supported
        isInViewport = true;
      }
      
      function updateFancyText() {
        if (!isInViewport) return;
        
        const rect = fancyTextSection.getBoundingClientRect();
        
        // Calculate scroll progress (0 to 1) when section is in viewport
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const scrollProgress = Math.max(0, Math.min(1, (cachedWindowHeight - sectionTop) / (cachedWindowHeight + sectionHeight)));
        
        // First row moves to the left (negative translateX)
        const firstRowOffset = scrollProgress * -200;
        fancyTextFirst.style.transform = `translateX(${firstRowOffset}px)`;
        
        // Second row starts at -400px and moves to the right (positive translateX)
        const secondRowOffset = -400 + (scrollProgress * 200);
        fancyTextSecond.style.transform = `translateX(${secondRowOffset}px)`;
        
        ticking = false;
      }
      
      function requestTick() {
        if (!ticking && isInViewport) {
          requestAnimationFrame(updateFancyText);
          ticking = true;
        }
      }
      
      // Use passive listener for better scroll performance
      window.addEventListener('scroll', requestTick, { passive: true });
      // Initial call
      updateFancyText();
    }

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
      // Initialize EmailJS (you'll need to replace with your public key)
      // Get your public key from https://dashboard.emailjs.com/admin/integration
      emailjs.init("QPQWvCmqM0AYvPEUF"); // Replace with your EmailJS public key
      
      // Helper function to show error message below input field
      function showFieldError(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        // Remove existing error message if any
        removeFieldError(fieldId);
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.id = fieldId + '-error';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';
        errorElement.style.display = 'block';
        
        // Add error styling to input
        field.style.borderColor = '#dc3545';
        
        // Insert error message after the input field
        const fieldContainer = field.closest('.contact-field');
        if (fieldContainer) {
          fieldContainer.appendChild(errorElement);
        }
      }
      
      // Helper function to remove error message
      function removeFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        // Remove error message element
        const errorElement = document.getElementById(fieldId + '-error');
        if (errorElement) {
          errorElement.remove();
        }
        
        // Remove error styling from input
        field.style.borderColor = '';
      }
      
      // Clear all field errors
      function clearAllFieldErrors() {
        const fieldIds = ['ime', 'email', 'telefon', 'tip-eventa', 'datum', 'lokacija', 'broj-gostiju'];
        fieldIds.forEach(function(fieldId) {
          removeFieldError(fieldId);
        });
      }
      
      // Comprehensive form validation function
      function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        clearAllFieldErrors();
        
        // Get form values
        const ime = document.getElementById('ime').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefon = document.getElementById('telefon').value.trim();
        const tipEventa = document.getElementById('tip-eventa').value;
        const datum = document.getElementById('datum').value;
        const lokacija = document.getElementById('lokacija').value.trim();
        const brojGostiju = document.getElementById('broj-gostiju').value.trim();
        
        // Validate Ime (Name) - required, at least 2 characters
        if (!ime) {
          showFieldError('ime', 'Ime i prezime je obavezno polje.');
          isValid = false;
        } else if (ime.length < 2) {
          showFieldError('ime', 'Ime i prezime mora imati najmanje 2 znaka.');
          isValid = false;
        }
        
        // Validate Email - required, valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          showFieldError('email', 'Email adresa je obavezno polje.');
          isValid = false;
        } else if (!emailRegex.test(email)) {
          showFieldError('email', 'Molimo unesite valjanu email adresu.');
          isValid = false;
        }
        
        // Validate Telefon (Phone) - required, valid Croatian phone format
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!telefon) {
          showFieldError('telefon', 'Broj telefona je obavezno polje.');
          isValid = false;
        } else if (!phoneRegex.test(telefon) || telefon.replace(/\D/g, '').length < 8) {
          showFieldError('telefon', 'Molimo unesite valjan broj telefona.');
          isValid = false;
        }
        
        // Validate Tip događaja (Event Type) - should have a value (select always has default)
        // This is optional validation, but we'll check anyway
        
        // Validate Datum (Date) - should be a valid date, not in the past
        if (!datum) {
          showFieldError('datum', 'Datum događaja je obavezno polje.');
          isValid = false;
        } else {
          const selectedDate = new Date(datum);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            showFieldError('datum', 'Datum događaja ne može biti u prošlosti.');
            isValid = false;
          }
        }
        
        // Validate Lokacija (Location) - required, at least 2 characters
        if (!lokacija) {
          showFieldError('lokacija', 'Lokacija je obavezno polje.');
          isValid = false;
        } else if (lokacija.length < 2) {
          showFieldError('lokacija', 'Lokacija mora imati najmanje 2 znaka.');
          isValid = false;
        }
        
        // Validate Broj gostiju (Number of guests) - required, minimum 25
        if (!brojGostiju) {
          showFieldError('broj-gostiju', 'Broj gostiju je obavezno polje.');
          isValid = false;
        } else {
          const numGuests = parseInt(brojGostiju, 10);
          if (isNaN(numGuests) || numGuests < 25) {
            showFieldError('broj-gostiju', '25 gostiju minimalno.');
            isValid = false;
          }
        }
        
        return isValid;
      }
      
      // Add real-time validation on blur (when user leaves a field)
      const formFields = ['ime', 'email', 'telefon', 'datum', 'lokacija', 'broj-gostiju'];
      formFields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
          field.addEventListener('blur', function() {
            // Validate only this field
            const value = field.value.trim();
            
            if (fieldId === 'ime') {
              if (!value) {
                showFieldError(fieldId, 'Ime i prezime je obavezno polje.');
              } else if (value.length < 2) {
                showFieldError(fieldId, 'Ime i prezime mora imati najmanje 2 znaka.');
              } else {
                removeFieldError(fieldId);
              }
            } else if (fieldId === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!value) {
                showFieldError(fieldId, 'Email adresa je obavezno polje.');
              } else if (!emailRegex.test(value)) {
                showFieldError(fieldId, 'Molimo unesite valjanu email adresu.');
              } else {
                removeFieldError(fieldId);
              }
            } else if (fieldId === 'telefon') {
              const phoneRegex = /^[\d\s\-\+\(\)]+$/;
              if (!value) {
                showFieldError(fieldId, 'Broj telefona je obavezno polje.');
              } else if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 8) {
                showFieldError(fieldId, 'Molimo unesite valjan broj telefona.');
              } else {
                removeFieldError(fieldId);
              }
            } else if (fieldId === 'datum') {
              if (!value) {
                showFieldError(fieldId, 'Datum događaja je obavezno polje.');
              } else {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                selectedDate.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                  showFieldError(fieldId, 'Datum događaja ne može biti u prošlosti.');
                } else {
                  removeFieldError(fieldId);
                }
              }
            } else if (fieldId === 'lokacija') {
              if (!value) {
                showFieldError(fieldId, 'Lokacija je obavezno polje.');
              } else if (value.length < 2) {
                showFieldError(fieldId, 'Lokacija mora imati najmanje 2 znaka.');
              } else {
                removeFieldError(fieldId);
              }
            } else if (fieldId === 'broj-gostiju') {
              if (!value) {
                showFieldError(fieldId, 'Broj gostiju je obavezno polje.');
              } else {
                const numGuests = parseInt(value, 10);
                if (isNaN(numGuests) || numGuests < 25) {
                  showFieldError(fieldId, '25 gostiju minimalno.');
                } else {
                  removeFieldError(fieldId);
                }
              }
            }
          });
          
          // Clear error on input (real-time feedback)
          field.addEventListener('input', function() {
            if (field.style.borderColor === 'rgb(220, 53, 69)' || field.style.borderColor === '#dc3545') {
              // Only clear if there was an error
              const errorElement = document.getElementById(fieldId + '-error');
              if (errorElement && errorElement.textContent) {
                // Re-validate on input to provide immediate feedback
                field.dispatchEvent(new Event('blur'));
              }
            }
          });
        }
      });
      
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        if (!validateForm()) {
          // Scroll to first error
          const firstError = contactForm.querySelector('.field-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
        
        // Get form data
        const formData = {
          ime: document.getElementById('ime').value.trim(),
          email: document.getElementById('email').value.trim(),
          telefon: document.getElementById('telefon').value.trim(),
          tip_eventa: document.getElementById('tip-eventa').value,
          datum: document.getElementById('datum').value,
          lokacija: document.getElementById('lokacija').value.trim(),
          broj_gostiju: document.getElementById('broj-gostiju').value.trim()
        };
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Šalje se...';
        
        // Convert date from YYYY-MM-DD to European format DD.MM.YYYY.
        let formattedDate = formData.datum;
        if (formData.datum && formData.datum.includes('-')) {
          const parts = formData.datum.split('-');
          if (parts.length === 3) {
            formattedDate = parts[2] + '.' + parts[1] + '.' + parts[0] + '.';
          }
        }

        // Send email using EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs from EmailJS dashboard
        emailjs.send('service_iftu7dh', 'template_lxqalxv', {
          from_name: formData.ime,
          from_email: formData.email,
          phone: formData.telefon,
          event_type: formData.tip_eventa,
          event_date: formattedDate,
          location: formData.lokacija,
          guest_count: formData.broj_gostiju,
          to_email: 'info@catering-gableraj.hr' // Your email address
        })
        .then(function() {
          // Google Ads conversion (Submit lead form) – event_callback runs after conversion is sent (per Google’s recommendation)
          var onConversionSent = function() {
            showMessage('Hvala vam! Vaš upit je uspješno poslan. Javit ćemo vam se u najkraćem roku.', 'success');
            contactForm.reset();
            clearAllFieldErrors();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          };
          var conversionPayload = {
            'send_to': 'AW-17906241738/90qKCOnVie8bEMqhrtpC',
            'value': 1.0,
            'currency': 'EUR',
            'event_callback': onConversionSent
          };
          if (typeof gtag === 'function') {
            gtag('event', 'conversion', conversionPayload);
          } else {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(['event', 'conversion', conversionPayload]);
            onConversionSent();
          }
          // If gtag’s event_callback never runs (e.g. ad blocker), still show success and re-enable button
          setTimeout(function() {
            if (submitBtn.disabled) {
              onConversionSent();
            }
          }, 2500);
        }, function(error) {
          console.error('EmailJS Error:', error);
          showMessage('Došlo je do greške pri slanju upita. Molimo pokušajte ponovno ili nas kontaktirajte direktno.', 'error');
        })
        .finally(function() {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
      });
      
      function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.style.display = 'block';
        formMessage.className = 'form-message ' + type;
        
        if (type === 'success') {
          formMessage.style.backgroundColor = '#d4edda';
          formMessage.style.color = '#155724';
          formMessage.style.border = '1px solid #c3e6cb';
        } else {
          formMessage.style.backgroundColor = '#f8d7da';
          formMessage.style.color = '#721c24';
          formMessage.style.border = '1px solid #f5c6cb';
        }
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 5 seconds for errors
        if (type === 'error') {
          setTimeout(function() {
            formMessage.style.display = 'none';
          }, 5000);
        }
      }
    }

    // Typewriter Effect for Philosophy Section
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
      const words = ['strasti', 'tradiciji', 'izvrsnosti', 'kreativnosti', 'savršenstvu'];
      let currentWordIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;
      let typingSpeed = 100;
      
      function typeWriter() {
        const currentWord = words[currentWordIndex];
        
        if (isDeleting) {
          if (currentCharIndex > 0) {
            typewriterElement.textContent = currentWord.substring(0, currentCharIndex - 1) + (currentCharIndex > 1 ? '.' : '');
          } else {
            typewriterElement.textContent = '';
          }
          currentCharIndex--;
          typingSpeed = 20; // Faster when deleting
        } else {
          const text = currentWord.substring(0, currentCharIndex + 1);
          typewriterElement.textContent = text + (currentCharIndex + 1 === currentWord.length ? '.' : '');
          currentCharIndex++;
          typingSpeed = 50; // Normal speed when typing
        }
        
        if (!isDeleting && currentCharIndex === currentWord.length) {
          // Word is complete, wait before deleting
          typingSpeed = 1000; // Pause at end of word
          isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
          // Word is deleted, move to next word
          isDeleting = false;
          currentWordIndex = (currentWordIndex + 1) % words.length;
          typingSpeed = 500; // Pause before next word
        }
        
        setTimeout(typeWriter, typingSpeed);
      }
      
      // Start typing after a short delay
      setTimeout(typeWriter, 1000);
    }

    // Why choose us items reveal from right, one by one
    const whyChooseItems = document.querySelectorAll('.why-choose-item');
    const whyChooseSection = document.querySelector('.why-choose-section');
    const isMobile = window.innerWidth <= 767;
    
    if (whyChooseItems.length && 'IntersectionObserver' in window) {
      if (isMobile) {
        // On mobile: observe each item individually for scroll reveal
        whyChooseItems.forEach(function (item) {
          const itemObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('is-visible');
                  itemObserver.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.2,
              rootMargin: '0px 0px -50px 0px',
            }
          );
          itemObserver.observe(item);
        });
      } else {
        // On desktop: reveal all items when section enters viewport with staggered delays
        if (whyChooseSection) {
          const whyChooseObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  // Reveal each item with staggered delays from right
                  whyChooseItems.forEach(function (item, index) {
                    setTimeout(function () {
                      item.classList.add('is-visible');
                    }, index * 200); // 200ms delay between each item
                  });
                  whyChooseObserver.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.3,
              rootMargin: '0px 0px -10% 0px',
            }
          );
          whyChooseObserver.observe(whyChooseSection);
        }
      }
    } else if (whyChooseItems.length) {
      // Fallback without IntersectionObserver
      whyChooseItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
    }

    // Why choose us sticky left side
    const whyChooseLeft = document.querySelector('.why-choose-header-left');
    const whyChooseHeader = document.querySelector('.why-choose-header');
    
    if (whyChooseLeft && whyChooseSection && whyChooseHeader) {
      let ticking = false;
      let originalWidth = null;
      let spacer = null;
      
      function updateStickyPosition() {
        if (!whyChooseLeft || !whyChooseSection || !whyChooseHeader) return;
        
        // Disable sticky behavior on mobile (767px and below)
        if (window.innerWidth <= 767) {
          whyChooseLeft.style.position = 'relative';
          whyChooseLeft.style.top = 'auto';
          whyChooseLeft.style.bottom = 'auto';
          whyChooseLeft.style.width = 'auto';
          whyChooseLeft.style.zIndex = 'auto';
          
          // Remove spacer if exists
          const existingSpacer = whyChooseHeader.querySelector('.why-choose-spacer');
          if (existingSpacer && existingSpacer.parentNode) {
            existingSpacer.parentNode.removeChild(existingSpacer);
          }
          return;
        }
        
        const sectionRect = whyChooseSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        const stickyTop = 80; // Distance from top when sticky
        const leftHeight = whyChooseLeft.offsetHeight;
        
        // Store original width on first run
        if (originalWidth === null) {
          originalWidth = whyChooseLeft.offsetWidth;
        }
        
        // Check if we should make it sticky
        if (sectionTop <= stickyTop && sectionBottom > stickyTop + leftHeight) {
          // Calculate maximum top position to keep it within section bounds
          const maxTop = sectionBottom - leftHeight;
          const calculatedTop = Math.max(stickyTop, Math.min(stickyTop, maxTop));
          
          // Make it sticky - section is scrolled past the sticky point
          whyChooseLeft.style.position = 'fixed';
          whyChooseLeft.style.top = calculatedTop + 'px';
          whyChooseLeft.style.width = originalWidth + 'px';
          whyChooseLeft.style.zIndex = '10';
          whyChooseLeft.style.bottom = 'auto';
          
          // Add spacer to maintain layout
          if (!spacer) {
            spacer = document.createElement('div');
            spacer.className = 'why-choose-spacer';
            spacer.style.width = originalWidth + 'px';
            spacer.style.flexShrink = '0';
            spacer.style.height = '1px';
            whyChooseHeader.insertBefore(spacer, whyChooseLeft.nextSibling);
          }
        } else if (sectionTop <= stickyTop && sectionBottom <= stickyTop + leftHeight) {
          // Section bottom reached - constrain to bottom using fixed positioning
          const maxTop = sectionBottom - leftHeight;
          
          whyChooseLeft.style.position = 'fixed';
          whyChooseLeft.style.top = maxTop + 'px';
          whyChooseLeft.style.bottom = 'auto';
          whyChooseLeft.style.width = originalWidth + 'px';
          whyChooseLeft.style.zIndex = '10';
          
          // Keep spacer
          if (!spacer) {
            spacer = document.createElement('div');
            spacer.className = 'why-choose-spacer';
            spacer.style.width = originalWidth + 'px';
            spacer.style.flexShrink = '0';
            spacer.style.height = '1px';
            whyChooseHeader.insertBefore(spacer, whyChooseLeft.nextSibling);
          }
        } else if (sectionTop > stickyTop) {
          // Section hasn't reached sticky point yet - keep relative
          whyChooseLeft.style.position = 'relative';
          whyChooseLeft.style.top = 'auto';
          whyChooseLeft.style.bottom = 'auto';
          whyChooseLeft.style.width = 'auto';
          whyChooseLeft.style.zIndex = 'auto';
          
          // Remove spacer
          if (spacer && spacer.parentNode) {
            spacer.parentNode.removeChild(spacer);
            spacer = null;
          }
        } else {
          // Section has scrolled completely past - reset to relative
          whyChooseLeft.style.position = 'relative';
          whyChooseLeft.style.top = 'auto';
          whyChooseLeft.style.bottom = 'auto';
          whyChooseLeft.style.width = 'auto';
          whyChooseLeft.style.zIndex = 'auto';
          
          // Remove spacer
          if (spacer && spacer.parentNode) {
            spacer.parentNode.removeChild(spacer);
            spacer = null;
          }
        }
        
        ticking = false;
      }
      
      function requestTick() {
        if (!ticking) {
          requestAnimationFrame(updateStickyPosition);
          ticking = true;
        }
      }
      
      // Initial call to set up
      updateStickyPosition();
      
      // Listen to scroll and resize events
      window.addEventListener('scroll', requestTick, { passive: true });
      window.addEventListener('resize', function() {
        originalWidth = null; // Reset width on resize
        if (spacer) {
          spacer.parentNode.removeChild(spacer);
          spacer = null;
        }
        requestTick();
      }, { passive: true });
    }
  })();

  // WEDDING SERVICES SLIDER
  (function() {
    const sliderContainer = document.getElementById('wedding-services-track');
    const paginationContainer = document.getElementById('wedding-services-pagination');
    const sliderWrapper = sliderContainer ? sliderContainer.parentElement : null;
    
    if (!sliderContainer || !paginationContainer || !sliderWrapper) return;

    const cards = sliderContainer.querySelectorAll('.wedding-service-card');
    const totalCards = cards.length;
    const cardsPerView = 3; // Number of cards visible at once
    const totalSlides = totalCards - cardsPerView + 1; // Total positions (one card at a time)
    
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let startTranslateX = 0;
    let translateX = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;

    // Create pagination dots - one for each possible position
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'wedding-services-dot';
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', () => goToSlide(i));
      paginationContainer.appendChild(dot);
    }

    function updatePagination() {
      const dots = paginationContainer.querySelectorAll('.wedding-services-dot');
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function getGap() {
      // Get the actual gap from computed styles
      const computedStyle = window.getComputedStyle(sliderContainer);
      const gapValue = computedStyle.gap || computedStyle.columnGap || '24px';
      // Parse gap value (e.g., "24px" -> 24)
      const gap = parseFloat(gapValue);
      return isNaN(gap) ? 24 : gap;
    }

    function getCardWidth() {
      // Get the actual width of the first card from the DOM
      // This accounts for CSS flex sizing and any padding/margins
      if (cards.length > 0) {
        const firstCard = cards[0];
        // Use offsetWidth for layout width (more reliable than getBoundingClientRect)
        return firstCard.offsetWidth;
      }
      // Fallback calculation if no cards found
      const containerWidth = sliderWrapper.clientWidth;
      const gap = getGap();
      return (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView;
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      const cardWidth = getCardWidth();
      const gap = getGap();
      // Move by one card width + gap for each slide
      translateX = -currentIndex * (cardWidth + gap);
      updateSliderPosition();
      updatePagination();
    }

    function updateSliderPosition() {
      sliderContainer.style.transform = `translateX(${translateX}px)`;
    }

    function handleStart(e) {
      isDragging = true;
      sliderContainer.classList.add('is-dragging');
      const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
      startX = clientX;
      startTranslateX = translateX; // Store the initial translate position
      lastX = clientX;
      lastTime = Date.now();
      velocity = 0;
    }

    function handleMove(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
      const deltaX = clientX - startX;
      const now = Date.now();
      const timeDelta = now - lastTime;
      
      // Calculate velocity for momentum
      if (timeDelta > 0) {
        velocity = (clientX - lastX) / timeDelta;
      }
      
      lastX = clientX;
      lastTime = now;
      
      const cardWidth = getCardWidth();
      const gap = getGap();
      const cardStep = cardWidth + gap;
      const maxTranslate = 0;
      const minTranslate = -cardStep * (totalSlides - 1);
      
      // Calculate new position based on initial position + mouse movement
      const newTranslateX = startTranslateX + deltaX;
      const clampedTranslate = Math.max(minTranslate, Math.min(maxTranslate, newTranslateX));
      
      // Add slight resistance at edges for better feel
      if (clampedTranslate === maxTranslate || clampedTranslate === minTranslate) {
        const edgeResistance = 0.3;
        translateX = startTranslateX + (deltaX * edgeResistance);
      } else {
        translateX = clampedTranslate;
      }
      
      updateSliderPosition();
    }

    function handleEnd() {
      if (!isDragging) return;
      
      isDragging = false;
      
      // Calculate which slide to snap to based on current position (one card at a time)
      const cardWidth = getCardWidth();
      const gap = getGap();
      const cardStep = cardWidth + gap;
      const currentPosition = -translateX;
      const slideIndex = Math.round(currentPosition / cardStep);
      let newIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));
      
      // Apply momentum - if dragging fast, move to next/previous card
      if (Math.abs(velocity) > 0.2) {
        const direction = velocity > 0 ? -1 : 1;
        const proposedIndex = newIndex + direction;
        // Only apply momentum if it's within bounds
        if (proposedIndex >= 0 && proposedIndex < totalSlides) {
          newIndex = proposedIndex;
        }
      }
      
      // Remove dragging class first to re-enable transition
      sliderContainer.classList.remove('is-dragging');
      
      // Use double requestAnimationFrame to ensure transition is fully applied
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Smoothly snap to the calculated slide
          goToSlide(newIndex);
        });
      });
    }

    // Mouse events - attach to wrapper
    sliderWrapper.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Touch events
    sliderWrapper.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        goToSlide(currentIndex);
      }, 250);
    });

    // Initial setup
    updateSliderPosition();
  })();

  // Wedding service cards reveal on viewport entry - left to right with staggered delays
  (function() {
    const weddingServiceCards = document.querySelectorAll('.wedding-service-card');
    const weddingServicesSection = document.querySelector('.wedding-services-section');
    
    if (weddingServiceCards.length && weddingServicesSection && 'IntersectionObserver' in window) {
      const weddingServicesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add is-visible to each card with staggered delays (left to right)
              weddingServiceCards.forEach(function (card, index) {
                setTimeout(function () {
                  card.classList.add('is-visible');
                }, index * 200); // 200ms delay between each card
              });
              weddingServicesObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: '0px 0px -10% 0px',
        }
      );

      weddingServicesObserver.observe(weddingServicesSection);
    } else if (weddingServiceCards.length) {
      // Fallback without IntersectionObserver
      weddingServiceCards.forEach(function (card, index) {
        setTimeout(function () {
          card.classList.add('is-visible');
        }, index * 200);
      });
    }
  })();

  // LOCATIONS SLIDER
  (function() {
    const slides = document.querySelectorAll('.locations-slide');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isFirstClick = true;
    
    function getButtons() {
      const activeSlide = document.querySelector('.locations-slide.active');
      if (!activeSlide) return { prevBtn: null, nextBtn: null };
      return {
        prevBtn: activeSlide.querySelector('.locations-nav-prev'),
        nextBtn: activeSlide.querySelector('.locations-nav-next')
      };
    }
    
    function showSlide(index) {
      // Remove active class from all slides
      slides.forEach(function(slide) {
        slide.classList.remove('active');
      });
      
      // Add active class to current slide
      if (slides[index]) {
        slides[index].classList.add('active');
      }
      
      // Get buttons from active slide
      const { prevBtn, nextBtn } = getButtons();
      if (!prevBtn || !nextBtn) return;
      
      // Update button states
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === totalSlides - 1;
      
      // After first click, remove accent color from next button
      if (isFirstClick && index > 0) {
        nextBtn.classList.add('has-clicked');
        isFirstClick = false;
      }
    }
    
    function nextSlide() {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        showSlide(currentSlide);
      }
    }
    
    function prevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
      }
    }
    
    // Event listeners - use event delegation on the slider container
    const sliderContainer = document.querySelector('.locations-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('click', function(e) {
        if (e.target.closest('.locations-nav-next')) {
          nextSlide();
        } else if (e.target.closest('.locations-nav-prev')) {
          prevSlide();
        }
      });
    }
    
    // Initialize
    showSlide(currentSlide);
  })();

  // Mobile Menu Toggle
  (function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const navDropdown = document.querySelector('.nav-dropdown');
    const body = document.body;

    if (!mobileMenuToggle || !navCenter) return;

    function openMobileMenu() {
      navCenter.classList.add('is-open');
      mobileMenuOverlay.classList.add('is-open');
      body.style.overflow = 'hidden';
      mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
      mobileMenuToggle.classList.add('menu-open');
    }

    function closeMobileMenu() {
      navCenter.classList.remove('is-open');
      mobileMenuOverlay.classList.remove('is-open');
      body.style.overflow = '';
      mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      mobileMenuToggle.classList.remove('menu-open');
      // Close dropdown if open
      if (navDropdown) {
        navDropdown.classList.remove('is-open');
      }
    }

    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navCenter.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Handle dropdown in mobile menu
    if (navDropdown) {
      const dropdownLink = navDropdown.querySelector('.nav-link');
      dropdownLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        navDropdown.classList.toggle('is-open');
      });
    }

    // Close menu when clicking on a nav link (except dropdown)
    const navLinks = navCenter.querySelectorAll('.nav-link:not(.nav-dropdown .nav-link)');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMobileMenu();
      });
    });

    // Close menu when clicking on dropdown items
    const dropdownItems = navCenter.querySelectorAll('.nav-dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', function() {
        closeMobileMenu();
      });
    });

    // Close menu when clicking on mobile button
    const mobileButton = navCenter.querySelector('.nav-mobile-button a, .nav-mobile-button button');
    if (mobileButton) {
      mobileButton.addEventListener('click', function() {
        closeMobileMenu();
      });
    }

    // Close menu when clicking on mobile menu logo
    const mobileMenuLogo = navCenter.querySelector('.mobile-menu-logo');
    if (mobileMenuLogo) {
      mobileMenuLogo.addEventListener('click', function() {
        closeMobileMenu();
      });
    }

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navCenter.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });

    // Close menu on window resize if it's open and we're above mobile breakpoint
    window.addEventListener('resize', function() {
      if (window.innerWidth > 767 && navCenter.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  })();

  // Change logo based on page
  (function() {
    const logo = document.querySelector('.logo');
    const body = document.body;
    const heroGallery = document.querySelector('.hero-gallery');
    const navbar = document.querySelector('.navbar');
    
    // Check if we're on index.html (no page-specific body class)
    const isHomePage = !body.classList.contains('weddings-page') && 
                       !body.classList.contains('business-page') && 
                       !body.classList.contains('party-page') && 
                       !body.classList.contains('about-page');
    
    // Check if we're on galerija.html (has hero-gallery class)
    const isGalleryPage = heroGallery !== null;
    const isLandingPage = isHomePage && !isGalleryPage;
    const isFullscreenHeroPage = isLandingPage || body.classList.contains('christmas-theme');
    
    if (logo) {
      function updateLogo() {
        if (isGalleryPage) {
          // Gallery page - use black logo
          if (logo.src && !logo.src.includes('logo-black-hor.png')) {
            logo.src = logo.src.replace('logo-white-hor.png', 'logo-black-hor.png').replace('logo-black-hor.png', 'logo-black-hor.png');
          }
        } else if (isFullscreenHeroPage) {
          // Fullscreen hero pages (index.html, bozicni-domjenci.html) - change based on scroll on mobile
          if (window.innerWidth <= 767) {
            // Mobile - check scroll state
            const isScrolled = navbar && navbar.classList.contains('navbar-scrolled');
            if (isScrolled) {
              // Scrolled - use black logo
              if (logo.src && !logo.src.includes('logo-black-hor.png')) {
                logo.src = logo.src.replace('logo-white-hor.png', 'logo-black-hor.png');
              }
            } else {
              // At top - use white logo
              if (logo.src && !logo.src.includes('logo-white-hor.png')) {
                logo.src = logo.src.replace('logo-black-hor.png', 'logo-white-hor.png');
              }
            }
          } else {
            // Desktop - use regular logo (black)
            if (logo.src && logo.src.includes('logo-white-hor.png')) {
              logo.src = logo.src.replace('logo-white-hor.png', 'logo-black-hor.png');
            }
          }
        } else if (isHomePage) {
          // Other home page variants - use regular logo
          if (logo.src && logo.src.includes('logo-white-hor.png')) {
            logo.src = logo.src.replace('logo-white-hor.png', 'logo-black-hor.png');
          }
        } else {
          // Other pages - use regular logo
          if (logo.src && (logo.src.includes('logo-white-hor.png') || logo.src.includes('logo-black-hor.png'))) {
            logo.src = logo.src.replace('logo-white-hor.png', 'logo-black-hor.png').replace('logo-black-hor.png', 'logo-black-hor.png');
          }
        }
      }
      
      // Update on load
      updateLogo();
      
      // Update on resize (for fullscreen hero pages)
      if (isFullscreenHeroPage) {
        window.addEventListener('resize', updateLogo);
      }
    }
  })();

  // Navbar hide on scroll down, show on scroll up
  (function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const logo = document.querySelector('.logo');
    const body = document.body;
    const heroGallery = document.querySelector('.hero-gallery');
    
    // Check if we're on index.html (landing page)
    const isHomePage = !body.classList.contains('weddings-page') && 
                       !body.classList.contains('business-page') && 
                       !body.classList.contains('party-page') && 
                       !body.classList.contains('about-page');
    const isGalleryPage = heroGallery !== null;
    const isLandingPage = isHomePage && !isGalleryPage;
    const isFullscreenHeroPage = isLandingPage || body.classList.contains('christmas-theme');

    let lastScrollTop = 0;
    let ticking = false;
    let isInitialized = false;

    function updateLogo() {
      // Only update logo on mobile for fullscreen hero pages
      if (!isFullscreenHeroPage || !logo || window.innerWidth > 767) return;
      
      const isScrolled = navbar.classList.contains('navbar-scrolled');
      const currentSrc = logo.src || '';
      
      if (isScrolled) {
        // Scrolled - use black logo
        if (!currentSrc.includes('logo-black-hor.png')) {
          logo.src = currentSrc.replace('logo-white-hor.png', 'logo-black-hor.png');
        }
      } else {
        // At top - use white logo
        if (!currentSrc.includes('logo-white-hor.png')) {
          logo.src = currentSrc.replace('logo-black-hor.png', 'logo-white-hor.png');
        }
      }
    }

    function updateNavbar() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Always show navbar at the very top
      if (scrollTop <= 0) {
        navbar.classList.remove('navbar-hidden');
        navbar.classList.remove('navbar-scrolled');
        updateLogo(); // Update logo when back at top
        lastScrollTop = scrollTop;
        ticking = false;
        isInitialized = true;
        return;
      }

      // Add/remove scrolled class for background transparency
      // Keep transparent at top, add background when scrolled
      const hadScrolledClass = navbar.classList.contains('navbar-scrolled');
      if (scrollTop > 50) {
        navbar.classList.add('navbar-scrolled');
        // Remove inline style to let CSS take over when scrolled
        if (isLandingPage && window.innerWidth <= 767) {
          navbar.style.background = '';
        }
      } else {
        navbar.classList.remove('navbar-scrolled');
        // Explicitly set transparent background when back at top (mobile landing page)
        if (isLandingPage && window.innerWidth <= 767) {
          navbar.style.background = 'transparent';
        }
      }
      
      // Update logo if scroll state changed
      if (hadScrolledClass !== navbar.classList.contains('navbar-scrolled')) {
        updateLogo();
      }

      // Check if lightbox is open
      const lightbox = document.getElementById('gallery-lightbox');
      const isLightboxOpen = lightbox && lightbox.classList.contains('is-open');

      // Determine scroll direction
      const scrollingDown = scrollTop > lastScrollTop;
      const scrollingUp = scrollTop < lastScrollTop;

      // Only apply hide/show logic after initialization to prevent flicker
      if (isInitialized) {
        // Hide navbar immediately when scrolling down (from any position)
        if (scrollingDown && scrollTop > 0) {
          navbar.classList.add('navbar-hidden');
        } 
        // Show navbar when scrolling up (but not if lightbox is open)
        else if (scrollingUp && !isLightboxOpen) {
          navbar.classList.remove('navbar-hidden');
        }
        // Keep navbar hidden if lightbox is open
        else if (isLightboxOpen) {
          navbar.classList.add('navbar-hidden');
        }
      } else {
        // On first scroll, mark as initialized and hide if scrolling down
        if (scrollingDown && scrollTop > 0) {
          isInitialized = true;
          navbar.classList.add('navbar-hidden');
        }
      }

      lastScrollTop = scrollTop;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initialize - set initial scroll position but don't trigger state changes
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Ensure navbar starts in correct state (transparent at top) - especially for mobile landing page
    if (lastScrollTop <= 0) {
      navbar.classList.remove('navbar-scrolled');
      navbar.classList.remove('navbar-hidden');
      // Explicitly set transparent background for mobile landing page
      if (isLandingPage && window.innerWidth <= 767) {
        navbar.style.background = 'transparent';
      }
    }
    
    // Only initialize state if we're not at the top
    if (lastScrollTop > 0) {
      isInitialized = true;
      if (lastScrollTop > 50) {
        navbar.classList.add('navbar-scrolled');
        // Remove inline style to let CSS take over
        if (isLandingPage && window.innerWidth <= 767) {
          navbar.style.background = '';
        }
      }
      navbar.classList.add('navbar-hidden');
      updateLogo(); // Update logo on initial load if scrolled
    } else {
      // Initialize logo at top
      updateLogo();
    }
    
    // Update logo on window resize (in case of mobile/desktop switch)
    window.addEventListener('resize', function() {
      updateLogo();
    }, { passive: true });
  })();

  // ==========================================================================
  // WEDDING INQUIRY MODAL & FORM CONTROLLER ("Isplaniraj vjenčanje")
  // ==========================================================================
  (function() {
    const weddingModal = document.getElementById('wedding-modal');
    const weddingForm = document.getElementById('wedding-form');
    const weddingFormMessage = document.getElementById('wedding-form-message');
    const openModalBtns = document.querySelectorAll('.open-wedding-modal, [data-open-modal="wedding-modal"]');
    const closeModalBtns = document.querySelectorAll('.wedding-modal-close, [data-close-modal="wedding-modal"]');
    const backdrop = weddingModal ? weddingModal.querySelector('.wedding-modal-backdrop') : null;

    if (!weddingModal) return;

    // Initialize EmailJS safely
    if (typeof emailjs !== 'undefined') {
      emailjs.init("QPQWvCmqM0AYvPEUF");
    }

    let hasAttemptedSubmit = false;

    function openModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      hasAttemptedSubmit = false;
      clearAllFieldErrors();
      if (weddingFormMessage) {
        weddingFormMessage.style.display = 'none';
        weddingFormMessage.textContent = '';
      }
      syncAllPlaceholderColors();
      weddingModal.classList.add('is-active');
      weddingModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      hasAttemptedSubmit = false;
      clearAllFieldErrors();
      if (weddingFormMessage) {
        weddingFormMessage.style.display = 'none';
        weddingFormMessage.textContent = '';
      }
      syncAllPlaceholderColors();
      weddingModal.classList.remove('is-active');
      weddingModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openModalBtns.forEach(function(btn) {
      btn.addEventListener('click', openModal);
    });

    closeModalBtns.forEach(function(btn) {
      btn.addEventListener('click', closeModal);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && weddingModal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Helper functions for field errors
    function showFieldError(fieldId, errorMessage) {
      const field = document.getElementById(fieldId);
      if (!field) return;

      removeFieldError(fieldId);

      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.id = fieldId + '-error';
      errorElement.textContent = errorMessage;
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '12px';
      errorElement.style.marginTop = '4px';
      errorElement.style.display = 'block';

      field.style.borderColor = '#dc3545';

      const fieldContainer = field.closest('.contact-field');
      if (fieldContainer) {
        fieldContainer.appendChild(errorElement);
      }
    }

    function removeFieldError(fieldId) {
      const field = document.getElementById(fieldId);
      if (!field) return;

      const errorElement = document.getElementById(fieldId + '-error');
      if (errorElement) {
        errorElement.remove();
      }
      field.style.borderColor = '';
    }

    const fieldIds = [
      'wedding-ime',
      'wedding-email',
      'wedding-telefon',
      'wedding-broj-gostiju',
      'wedding-lokacija',
      'wedding-datum',
      'wedding-stil',
      'wedding-budzet',
      'wedding-trajanje'
    ];

    function clearAllFieldErrors() {
      fieldIds.forEach(removeFieldError);
    }

    function validateWeddingField(fieldId, forceRequired) {
      const field = document.getElementById(fieldId);
      if (!field) return true;
      const value = field.value.trim();
      const checkRequired = forceRequired || hasAttemptedSubmit;

      if (fieldId === 'wedding-ime') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Ime i prezime je obavezno polje.');
            return false;
          }
        } else if (value.length < 2) {
          showFieldError(fieldId, 'Ime i prezime mora imati najmanje 2 znaka.');
          return false;
        }
      } else if (fieldId === 'wedding-email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Email adresa je obavezno polje.');
            return false;
          }
        } else if (!emailRegex.test(value)) {
          showFieldError(fieldId, 'Molimo unesite valjanu email adresu.');
          return false;
        }
      } else if (fieldId === 'wedding-telefon') {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Broj telefona je obavezno polje.');
            return false;
          }
        } else if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 8) {
          showFieldError(fieldId, 'Molimo unesite valjan broj telefona.');
          return false;
        }
      } else if (fieldId === 'wedding-broj-gostiju') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Broj gostiju je obavezno polje.');
            return false;
          }
        } else {
          const numGuests = parseInt(value, 10);
          if (isNaN(numGuests) || numGuests < 25) {
            showFieldError(fieldId, '25 gostiju minimalno.');
            return false;
          }
        }
      } else if (fieldId === 'wedding-lokacija') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Molimo odaberite lokaciju.');
            return false;
          }
        }
      } else if (fieldId === 'wedding-datum') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Datum vjenčanja je obavezno polje.');
            return false;
          }
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            showFieldError(fieldId, 'Datum vjenčanja ne može biti u prošlosti.');
            return false;
          }
        }
      } else if (fieldId === 'wedding-stil') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Molimo odaberite stil vjenčanja.');
            return false;
          }
        }
      } else if (fieldId === 'wedding-budzet') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Molimo odaberite okvirni budžet.');
            return false;
          }
        }
      } else if (fieldId === 'wedding-trajanje') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Molimo odaberite trajanje događaja.');
            return false;
          }
        }
      }

      removeFieldError(fieldId);
      return true;
    }

    function validateWeddingForm() {
      let isValid = true;
      clearAllFieldErrors();

      fieldIds.forEach(function(fieldId) {
        const fieldValid = validateWeddingField(fieldId, true);
        if (!fieldValid) {
          isValid = false;
        }
      });

      return isValid;
    }

    // Helper to style placeholder color for select and date fields
    function updateFieldColor(field) {
      if (!field) return;
      if (field.tagName === 'SELECT') {
        if (!field.value) {
          field.style.color = '#9e9e9e';
          field.classList.add('is-placeholder');
        } else {
          field.style.color = '#111111';
          field.classList.remove('is-placeholder');
        }
      } else if (field.type === 'date') {
        if (!field.value) {
          field.style.color = '#9e9e9e';
          field.classList.remove('has-value');
        } else {
          field.style.color = '#111111';
          field.classList.add('has-value');
        }
      }
    }

    function syncAllPlaceholderColors() {
      fieldIds.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) updateFieldColor(field);
      });
    }

    // Real-time feedback listeners
    fieldIds.forEach(function(fieldId) {
      const field = document.getElementById(fieldId);
      if (!field) return;

      // Initial color check
      updateFieldColor(field);

      field.addEventListener('blur', function() {
        validateWeddingField(fieldId, false);
        updateFieldColor(field);
      });

      field.addEventListener('input', function() {
        validateWeddingField(fieldId, false);
        updateFieldColor(field);
      });

      if (field.tagName === 'SELECT' || field.type === 'date') {
        field.addEventListener('change', function() {
          validateWeddingField(fieldId, false);
          updateFieldColor(field);
        });
      }
    });

    function showWeddingMessage(text, type) {
      if (!weddingFormMessage) return;
      weddingFormMessage.textContent = text;
      weddingFormMessage.style.display = 'block';
      weddingFormMessage.className = 'form-message ' + type;

      if (type === 'success') {
        weddingFormMessage.style.backgroundColor = '#d4edda';
        weddingFormMessage.style.color = '#155724';
        weddingFormMessage.style.border = '1px solid #c3e6cb';
      } else {
        weddingFormMessage.style.backgroundColor = '#f8d7da';
        weddingFormMessage.style.color = '#721c24';
        weddingFormMessage.style.border = '1px solid #f5c6cb';
      }

      weddingFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (type === 'error') {
        setTimeout(function() {
          weddingFormMessage.style.display = 'none';
        }, 6000);
      }
    }

    if (weddingForm) {
      weddingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hasAttemptedSubmit = true;

        if (!validateWeddingForm()) {
          const firstError = weddingForm.querySelector('.field-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        const ime = document.getElementById('wedding-ime').value.trim();
        const email = document.getElementById('wedding-email').value.trim();
        const telefon = document.getElementById('wedding-telefon').value.trim();
        const brojGostiju = document.getElementById('wedding-broj-gostiju').value.trim();
        const lokacija = document.getElementById('wedding-lokacija').value.trim();
        const datum = document.getElementById('wedding-datum').value;
        const stil = document.getElementById('wedding-stil').value;
        const budzet = document.getElementById('wedding-budzet').value;
        const trajanje = document.getElementById('wedding-trajanje').value;
        const porukaElem = document.getElementById('wedding-poruka');
        const poruka = porukaElem ? porukaElem.value.trim() : '';

        // Convert date from YYYY-MM-DD to European format DD.MM.YYYY.
        let formattedDate = datum;
        if (datum && datum.includes('-')) {
          const parts = datum.split('-');
          if (parts.length === 3) {
            formattedDate = parts[2] + '.' + parts[1] + '.' + parts[0] + '.';
          }
        }

        const submitBtn = weddingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Šalje se...';

        const templateParams = {
          from_name: ime,
          from_email: email,
          phone: telefon,
          event_type: 'Vjenčanje (' + stil + ')',
          wedding_style: stil,
          event_date: formattedDate,
          location: lokacija,
          guest_count: brojGostiju,
          budget: budzet,
          duration: trajanje,
          message: poruka ? poruka : 'Nema dodatne poruke',
          to_email: 'info@catering-gableraj.hr'
        };

        if (typeof emailjs === 'undefined') {
          console.error('EmailJS is not loaded');
          showWeddingMessage('Došlo je do greške. Molimo osvježite stranicu ili nas kontaktirajte direktno.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }

        emailjs.send('service_iftu7dh', 'template_nxp87gd', templateParams)
          .then(function() {
            var onConversionSent = function() {
              showWeddingMessage('Hvala vam! Vaš upit za vjenčanje je uspješno poslan. Javit ćemo vam se u najkraćem roku.', 'success');
              weddingForm.reset();
              clearAllFieldErrors();
              syncAllPlaceholderColors();
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            };

            var conversionPayload = {
              'send_to': 'AW-17906241738/90qKCOnVie8bEMqhrtpC',
              'value': 1.0,
              'currency': 'EUR',
              'event_callback': onConversionSent
            };

            if (typeof gtag === 'function') {
              gtag('event', 'conversion', conversionPayload);
            } else {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push(['event', 'conversion', conversionPayload]);
              onConversionSent();
            }

            setTimeout(function() {
              if (submitBtn.disabled) {
                onConversionSent();
              }
            }, 2500);
          }, function(error) {
            console.error('EmailJS Wedding Form Error:', error);
            showWeddingMessage('Došlo je do greške pri slanju upita. Molimo pokušajte ponovno ili nas kontaktirajte direktno.', 'error');
          })
          .finally(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          });
      });
    }
  })();

  // ==========================================================================
  // CHRISTMAS PARTY / BOŽIĆNI DOMJENCI FORM & MODAL CONTROLLER
  // ==========================================================================
  (function() {
    const christmasModal = document.getElementById('christmas-modal');
    const modalForm = document.getElementById('christmas-modal-form');
    const pageForm = document.getElementById('christmas-form-page');
    const openModalBtns = document.querySelectorAll('.open-christmas-modal, [data-open-modal="christmas-modal"]');
    const closeModalBtns = document.querySelectorAll('.christmas-modal-close, [data-close-modal="christmas-modal"]');
    const backdrop = christmasModal ? christmasModal.querySelector('.christmas-modal-backdrop') : null;

    // Initialize EmailJS safely
    if (typeof emailjs !== 'undefined') {
      emailjs.init("QPQWvCmqM0AYvPEUF");
    }

    function openModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!christmasModal) return;
      christmasModal.classList.add('is-active');
      christmasModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      setTimeout(function() {
        const firstInput = document.getElementById('cmodal-ime');
        if (firstInput) firstInput.focus();
      }, 100);
    }

    function closeModal() {
      if (!christmasModal) return;
      christmasModal.classList.remove('is-active');
      christmasModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openModalBtns.forEach(function(btn) {
      btn.addEventListener('click', openModal);
    });

    closeModalBtns.forEach(function(btn) {
      btn.addEventListener('click', closeModal);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && christmasModal && christmasModal.classList.contains('is-active')) {
        closeModal();
      }
    });

    function showFieldError(field, errorMessage) {
      if (!field) return;
      removeFieldError(field);

      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = errorMessage;
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '12px';
      errorElement.style.marginTop = '4px';
      errorElement.style.display = 'block';

      field.style.borderColor = '#dc3545';

      const fieldContainer = field.closest('.contact-field');
      if (fieldContainer) {
        fieldContainer.appendChild(errorElement);
      }
    }

    function removeFieldError(field) {
      if (!field) return;
      field.style.borderColor = '';
      const fieldContainer = field.closest('.contact-field');
      if (fieldContainer) {
        const err = fieldContainer.querySelector('.field-error');
        if (err) err.remove();
      }
    }

    function validateChristmasForm(form) {
      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');

      requiredInputs.forEach(function(input) {
        const val = input.value.trim();
        removeFieldError(input);

        if (!val) {
          showFieldError(input, 'Ovo polje je obavezno.');
          isValid = false;
          return;
        }

        if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            showFieldError(input, 'Molimo unesite valjanu email adresu.');
            isValid = false;
            return;
          }
        }

        if (input.type === 'tel') {
          const phoneRegex = /^[\d\s\-\+\(\)]+$/;
          if (!phoneRegex.test(val) || val.replace(/\D/g, '').length < 8) {
            showFieldError(input, 'Molimo unesite valjan broj telefona.');
            isValid = false;
            return;
          }
        }

        if (input.type === 'number') {
          const num = parseInt(val, 10);
          if (isNaN(num) || num < 25) {
            showFieldError(input, 'Minimalan broj je 25 osoba.');
            isValid = false;
            return;
          }
        }

        if (input.type === 'date') {
          const selectedDate = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            showFieldError(input, 'Datum ne može biti u prošlosti.');
            isValid = false;
            return;
          }
        }
      });

      return isValid;
    }

    function showFormMsg(msgContainer, text, type) {
      if (!msgContainer) return;
      msgContainer.textContent = text;
      msgContainer.style.display = 'block';
      msgContainer.className = 'form-message ' + type;

      if (type === 'success') {
        msgContainer.style.backgroundColor = '#d4edda';
        msgContainer.style.color = '#155724';
        msgContainer.style.border = '1px solid #c3e6cb';
      } else {
        msgContainer.style.backgroundColor = '#f8d7da';
        msgContainer.style.color = '#721c24';
        msgContainer.style.border = '1px solid #f5c6cb';
      }

      msgContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (type === 'error') {
        setTimeout(function() {
          msgContainer.style.display = 'none';
        }, 6000);
      }
    }

    function setupFormHandling(form, msgContainer, isModal) {
      if (!form) return;

      // Real-time input listeners
      form.querySelectorAll('input, select, textarea').forEach(function(field) {
        field.addEventListener('blur', function() {
          if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, 'Ovo polje je obavezno.');
          } else {
            removeFieldError(field);
          }
        });

        field.addEventListener('input', function() {
          if (field.style.borderColor === 'rgb(220, 53, 69)' || field.style.borderColor === '#dc3545') {
            removeFieldError(field);
          }
        });

        if (field.tagName === 'SELECT') {
          field.addEventListener('change', function() {
            removeFieldError(field);
          });
        }
      });

      form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateChristmasForm(form)) {
          const firstErr = form.querySelector('.field-error');
          if (firstErr) {
            firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        const prefix = isModal ? 'cmodal-' : 'b2b-';
        const ime = (form.querySelector('#' + prefix + 'ime') || {}).value || '';
        const tvrtka = (form.querySelector('#' + prefix + 'tvrtka') || {}).value || '';
        const email = (form.querySelector('#' + prefix + 'email') || {}).value || '';
        const telefon = (form.querySelector('#' + prefix + 'telefon') || {}).value || '';
        const brojGostiju = (form.querySelector('#' + prefix + 'broj-gostiju') || {}).value || '';
        const datum = (form.querySelector('#' + prefix + 'datum') || {}).value || '';
        const lokacija = (form.querySelector('#' + prefix + 'lokacija') || {}).value || '';
        const format = (form.querySelector('#' + prefix + 'format') || {}).value || '';
        const budzet = (form.querySelector('#' + prefix + 'budzet') || {}).value || 'Po dogovoru';
        const porukaElem = form.querySelector('#' + prefix + 'poruka');
        const poruka = porukaElem ? porukaElem.value.trim() : '';

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Šalje se...';

        const templateParams = {
          from_name: ime.trim() + (tvrtka ? ' (' + tvrtka.trim() + ')' : ''),
          from_email: email.trim(),
          phone: telefon.trim(),
          event_type: 'Božićni domjenak - ' + (tvrtka || 'Tvrtka') + ' [' + format + ']',
          wedding_style: 'Božićni domjenak / ' + format,
          event_date: datum,
          location: lokacija,
          guest_count: brojGostiju,
          budget: budzet,
          duration: 'Božićni event / domjenak',
          message: 'Tvrtka: ' + tvrtka + '\nFormat domjenka: ' + format + '\nLokacija: ' + lokacija + '\nOkvirni budžet: ' + budzet + '\nPoruka: ' + (poruka || 'Nema dodatne poruke'),
          to_email: 'info@catering-gableraj.hr'
        };

        if (typeof emailjs === 'undefined') {
          showFormMsg(msgContainer, 'Došlo je do greške. Molimo kontaktirajte nas direktno.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }

        emailjs.send('service_iftu7dh', 'template_lxqalxv', templateParams)
          .then(function() {
            var onConversionSent = function() {
              showFormMsg(msgContainer, 'Hvala vam! Vaš upit za božićni domjenak je uspješno poslan. Naš tim će vam se javiti s ponudom u najkraćem roku.', 'success');
              form.reset();
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            };

            var conversionPayload = {
              'send_to': 'AW-17906241738/90qKCOnVie8bEMqhrtpC',
              'value': 1.0,
              'currency': 'EUR',
              'event_callback': onConversionSent
            };

            if (typeof gtag === 'function') {
              gtag('event', 'conversion', conversionPayload);
            } else {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push(['event', 'conversion', conversionPayload]);
              onConversionSent();
            }

            setTimeout(function() {
              if (submitBtn.disabled) {
                onConversionSent();
              }
            }, 2500);
          }, function(error) {
            console.error('EmailJS Christmas Form Error:', error);
            showFormMsg(msgContainer, 'Došlo je do greške pri slanju upita. Molimo pokušajte ponovno ili nas kontaktirajte putem telefona/emaila.', 'error');
          })
          .finally(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          });
      });
    }

    const modalMsg = document.getElementById('christmas-modal-form-message');
    const pageMsg = document.getElementById('christmas-page-form-message');

    if (modalForm) setupFormHandling(modalForm, modalMsg, true);
    if (pageForm) setupFormHandling(pageForm, pageMsg, false);
  })();

  // ==========================================================================
  // GENERAL INQUIRY MODAL & FORM CONTROLLER ("Zatraži ponudu")
  // ==========================================================================
  (function() {
    const inquiryModal = document.getElementById('inquiry-modal');
    const inquiryForm = document.getElementById('inquiry-modal-form');
    const inquiryFormMessage = document.getElementById('inquiry-modal-form-message');
    const openModalBtns = document.querySelectorAll('.open-inquiry-modal, [data-open-modal="inquiry-modal"]');
    const closeModalBtns = document.querySelectorAll('.inquiry-modal-close, [data-close-modal="inquiry-modal"]');
    const backdrop = inquiryModal ? inquiryModal.querySelector('.wedding-modal-backdrop') : null;

    if (!inquiryModal) return;

    // Initialize EmailJS safely
    if (typeof emailjs !== 'undefined') {
      emailjs.init("QPQWvCmqM0AYvPEUF");
    }

    let hasAttemptedSubmit = false;

    function getPageDefaultEventType() {
      const select = document.getElementById('inquiry-tip-eventa');
      if (!select) return '';
      const selectedOption = select.querySelector('option[selected]:not([disabled])');
      return selectedOption ? selectedOption.value : '';
    }

    function openModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      hasAttemptedSubmit = false;
      clearAllFieldErrors();
      if (inquiryFormMessage) {
        inquiryFormMessage.style.display = 'none';
        inquiryFormMessage.textContent = '';
      }

      // Check if button specifies a data-event-type or use page default
      const btn = e && e.currentTarget ? e.currentTarget : null;
      const targetEventType = btn ? btn.getAttribute('data-event-type') : null;
      const select = document.getElementById('inquiry-tip-eventa');
      if (select) {
        if (targetEventType) {
          select.value = targetEventType;
        } else if (!select.value) {
          const defaultVal = getPageDefaultEventType();
          if (defaultVal) {
            select.value = defaultVal;
          }
        }
      }

      syncAllPlaceholderColors();
      inquiryModal.classList.add('is-active');
      inquiryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      setTimeout(function() {
        const firstInput = document.getElementById('inquiry-ime');
        if (firstInput) firstInput.focus();
      }, 100);
    }

    function closeModal() {
      hasAttemptedSubmit = false;
      clearAllFieldErrors();
      if (inquiryFormMessage) {
        inquiryFormMessage.style.display = 'none';
        inquiryFormMessage.textContent = '';
      }
      syncAllPlaceholderColors();
      inquiryModal.classList.remove('is-active');
      inquiryModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openModalBtns.forEach(function(btn) {
      btn.addEventListener('click', openModal);
    });

    closeModalBtns.forEach(function(btn) {
      btn.addEventListener('click', closeModal);
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && inquiryModal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Helper functions for field errors
    function showFieldError(fieldId, errorMessage) {
      const field = document.getElementById(fieldId);
      if (!field) return;

      removeFieldError(fieldId);

      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.id = fieldId + '-error';
      errorElement.textContent = errorMessage;
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '12px';
      errorElement.style.marginTop = '4px';
      errorElement.style.display = 'block';

      field.style.borderColor = '#dc3545';

      const fieldContainer = field.closest('.contact-field');
      if (fieldContainer) {
        fieldContainer.appendChild(errorElement);
      }
    }

    function removeFieldError(fieldId) {
      const field = document.getElementById(fieldId);
      if (!field) return;

      const errorElement = document.getElementById(fieldId + '-error');
      if (errorElement) {
        errorElement.remove();
      }
      field.style.borderColor = '';
    }

    const fieldIds = [
      'inquiry-ime',
      'inquiry-email',
      'inquiry-telefon',
      'inquiry-tip-eventa',
      'inquiry-datum',
      'inquiry-lokacija',
      'inquiry-broj-gostiju'
    ];

    function clearAllFieldErrors() {
      fieldIds.forEach(removeFieldError);
    }

    function validateInquiryField(fieldId, forceRequired) {
      const field = document.getElementById(fieldId);
      if (!field) return true;
      const value = field.value.trim();
      const checkRequired = forceRequired || hasAttemptedSubmit;

      if (fieldId === 'inquiry-ime') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Ime i prezime je obavezno polje.');
            return false;
          }
        } else if (value.length < 2) {
          showFieldError(fieldId, 'Ime i prezime mora imati najmanje 2 znaka.');
          return false;
        }
      } else if (fieldId === 'inquiry-email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Email adresa je obavezno polje.');
            return false;
          }
        } else if (!emailRegex.test(value)) {
          showFieldError(fieldId, 'Molimo unesite valjanu email adresu.');
          return false;
        }
      } else if (fieldId === 'inquiry-telefon') {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Broj telefona je obavezno polje.');
            return false;
          }
        } else if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 8) {
          showFieldError(fieldId, 'Molimo unesite valjan broj telefona.');
          return false;
        }
      } else if (fieldId === 'inquiry-tip-eventa') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Molimo odaberite tip događaja.');
            return false;
          }
        }
      } else if (fieldId === 'inquiry-datum') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Datum događaja je obavezno polje.');
            return false;
          }
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            showFieldError(fieldId, 'Datum događaja ne može biti u prošlosti.');
            return false;
          }
        }
      } else if (fieldId === 'inquiry-lokacija') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Lokacija je obavezno polje.');
            return false;
          }
        } else if (value.length < 2) {
          showFieldError(fieldId, 'Lokacija mora imati najmanje 2 znaka.');
          return false;
        }
      } else if (fieldId === 'inquiry-broj-gostiju') {
        if (!value) {
          if (checkRequired) {
            showFieldError(fieldId, 'Broj gostiju je obavezno polje.');
            return false;
          }
        } else {
          const numGuests = parseInt(value, 10);
          if (isNaN(numGuests) || numGuests < 25) {
            showFieldError(fieldId, '25 gostiju minimalno.');
            return false;
          }
        }
      }

      removeFieldError(fieldId);
      return true;
    }

    function validateInquiryForm() {
      let isValid = true;
      clearAllFieldErrors();

      fieldIds.forEach(function(fieldId) {
        const fieldValid = validateInquiryField(fieldId, true);
        if (!fieldValid) {
          isValid = false;
        }
      });

      return isValid;
    }

    function updateFieldColor(field) {
      if (!field) return;
      if (field.tagName === 'SELECT') {
        if (!field.value) {
          field.style.color = '#9e9e9e';
          field.classList.add('is-placeholder');
        } else {
          field.style.color = '#111111';
          field.classList.remove('is-placeholder');
        }
      } else if (field.type === 'date') {
        if (!field.value) {
          field.style.color = '#9e9e9e';
          field.classList.remove('has-value');
        } else {
          field.style.color = '#111111';
          field.classList.add('has-value');
        }
      }
    }

    function syncAllPlaceholderColors() {
      fieldIds.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) updateFieldColor(field);
      });
    }

    // Real-time feedback listeners
    fieldIds.forEach(function(fieldId) {
      const field = document.getElementById(fieldId);
      if (!field) return;

      updateFieldColor(field);

      field.addEventListener('blur', function() {
        validateInquiryField(fieldId, false);
        updateFieldColor(field);
      });

      field.addEventListener('input', function() {
        validateInquiryField(fieldId, false);
        updateFieldColor(field);
      });

      if (field.tagName === 'SELECT' || field.type === 'date') {
        field.addEventListener('change', function() {
          validateInquiryField(fieldId, false);
          updateFieldColor(field);
        });
      }
    });

    function showInquiryMessage(text, type) {
      if (!inquiryFormMessage) return;
      inquiryFormMessage.textContent = text;
      inquiryFormMessage.style.display = 'block';
      inquiryFormMessage.className = 'form-message ' + type;

      if (type === 'success') {
        inquiryFormMessage.style.backgroundColor = '#d4edda';
        inquiryFormMessage.style.color = '#155724';
        inquiryFormMessage.style.border = '1px solid #c3e6cb';
      } else {
        inquiryFormMessage.style.backgroundColor = '#f8d7da';
        inquiryFormMessage.style.color = '#721c24';
        inquiryFormMessage.style.border = '1px solid #f5c6cb';
      }

      inquiryFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (type === 'error') {
        setTimeout(function() {
          inquiryFormMessage.style.display = 'none';
        }, 6000);
      }
    }

    if (inquiryForm) {
      inquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hasAttemptedSubmit = true;

        if (!validateInquiryForm()) {
          const firstError = inquiryForm.querySelector('.field-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        const ime = document.getElementById('inquiry-ime').value.trim();
        const email = document.getElementById('inquiry-email').value.trim();
        const telefon = document.getElementById('inquiry-telefon').value.trim();
        const tipEventa = document.getElementById('inquiry-tip-eventa').value;
        const datum = document.getElementById('inquiry-datum').value;
        const lokacija = document.getElementById('inquiry-lokacija').value.trim();
        const brojGostiju = document.getElementById('inquiry-broj-gostiju').value.trim();
        const porukaElem = document.getElementById('inquiry-poruka');
        const poruka = porukaElem ? porukaElem.value.trim() : '';

        // Convert date from YYYY-MM-DD to European format DD.MM.YYYY.
        let formattedDate = datum;
        if (datum && datum.includes('-')) {
          const parts = datum.split('-');
          if (parts.length === 3) {
            formattedDate = parts[2] + '.' + parts[1] + '.' + parts[0] + '.';
          }
        }

        const submitBtn = inquiryForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Šalje se...';

        const templateParams = {
          from_name: ime,
          from_email: email,
          phone: telefon,
          event_type: tipEventa,
          event_date: formattedDate,
          location: lokacija,
          guest_count: brojGostiju,
          message: poruka ? poruka : 'Nema dodatne poruke',
          to_email: 'info@catering-gableraj.hr'
        };

        if (typeof emailjs === 'undefined') {
          console.error('EmailJS is not loaded');
          showInquiryMessage('Došlo je do greške. Molimo osvježite stranicu ili nas kontaktirajte direktno.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }

        emailjs.send('service_iftu7dh', 'template_lxqalxv', templateParams)
          .then(function() {
            var onConversionSent = function() {
              showInquiryMessage('Hvala vam! Vaš upit je uspješno poslan. Javit ćemo vam se u najkraćem roku.', 'success');
              inquiryForm.reset();
              const defaultVal = getPageDefaultEventType();
              const select = document.getElementById('inquiry-tip-eventa');
              if (defaultVal && select) {
                select.value = defaultVal;
              }
              clearAllFieldErrors();
              syncAllPlaceholderColors();
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            };

            var conversionPayload = {
              'send_to': 'AW-17906241738/90qKCOnVie8bEMqhrtpC',
              'value': 1.0,
              'currency': 'EUR',
              'event_callback': onConversionSent
            };

            if (typeof gtag === 'function') {
              gtag('event', 'conversion', conversionPayload);
            } else {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push(['event', 'conversion', conversionPayload]);
              onConversionSent();
            }

            setTimeout(function() {
              if (submitBtn.disabled) {
                onConversionSent();
              }
            }, 2500);
          }, function(error) {
            console.error('EmailJS Inquiry Form Error:', error);
            showInquiryMessage('Došlo je do greške pri slanju upita. Molimo pokušajte ponovno ili nas kontaktirajte direktno.', 'error');
          })
          .finally(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          });
      });
    }
  })();


  

// Language Override for Firebase i18n
document.addEventListener('DOMContentLoaded', () => {
    // When a user selects a language, set the firebase-language-override cookie
    const langLinks = document.querySelectorAll('.lang-switcher .nav-dropdown-item');
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // The onclick in HTML also sets localStorage, but let's set the cookie here
            const url = new URL(e.target.href);
            let lang = 'hr';
            if (url.pathname.startsWith('/en')) lang = 'en';
            if (url.pathname.startsWith('/de')) lang = 'de';
            
            // Set the cookie for Firebase Hosting to respect
            document.cookie = `firebase-language-override=${lang}; path=/; max-age=31536000`; // 1 year
        });
    });
});
