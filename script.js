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
      }
  
      function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightboxImg.src = '';
      }
  
      document.addEventListener('click', function (e) {
        const item = e.target.closest('.gallery-item, .gallery-main-item, .gallery-page-item, .gallery-slider-item, .locations-image-main, .locations-image-overlay');
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
    const aboutPlaceholder = document.querySelector('.about-placeholder');
    const aboutSection = document.querySelector('.about');
    
    if (aboutPlaceholder) {
      if (aboutSection && 'IntersectionObserver' in window) {
        const aboutImageObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                aboutPlaceholder.classList.add('is-visible');
                aboutImageObserver.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.2,
            rootMargin: '100px 0px 0px 0px',
          }
        );

        aboutImageObserver.observe(aboutSection);
      } else {
        // Fallback without IntersectionObserver - show immediately
        aboutPlaceholder.classList.add('is-visible');
      }
    }

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

    // Pause/play hero video based on viewport visibility
    const heroVideo = document.getElementById('hero-video');
    const heroSection = document.querySelector('.hero');
    
    if (heroVideo && heroSection && 'IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Video is in viewport - play it
              heroVideo.play().catch(function(err) {
                // Ignore autoplay errors (browser may block autoplay)
                console.log('Video play prevented:', err);
              });
            } else {
              // Video is out of viewport - pause it to save resources
              heroVideo.pause();
            }
          });
        },
        {
          threshold: 0.5, // Trigger when 50% of video is visible
          rootMargin: '0px'
        }
      );

      videoObserver.observe(heroSection);
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
      
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
          ime: document.getElementById('ime').value,
          email: document.getElementById('email').value,
          telefon: document.getElementById('telefon').value,
          tip_eventa: document.getElementById('tip-eventa').value,
          datum: document.getElementById('datum').value,
          lokacija: document.getElementById('lokacija').value,
          broj_gostiju: document.getElementById('broj-gostiju').value
        };
        
        // Basic validation
        if (!formData.ime || !formData.email || !formData.telefon) {
          showMessage('Molimo ispunite sva obavezna polja.', 'error');
          return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          showMessage('Molimo unesite valjanu email adresu.', 'error');
          return;
        }
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Šalje se...';
        
        // Send email using EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs from EmailJS dashboard
        emailjs.send('service_y058qx8', 'template_lxqalxv', {
          from_name: formData.ime,
          from_email: formData.email,
          phone: formData.telefon,
          event_type: formData.tip_eventa,
          event_date: formData.datum,
          location: formData.lokacija,
          guest_count: formData.broj_gostiju,
          to_email: 'tonyskrebla@gmail.com' // Your email address
        })
        .then(function() {
          showMessage('Hvala vam! Vaš upit je uspješno poslan. Javit ćemo vam se u najkraćem roku.', 'success');
          contactForm.reset();
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

    // Gallery Slider - Automatic scrolling with infinite loop
    const gallerySliderContainer = document.querySelector('.gallery-slider-container');
    const gallerySliderTrack = document.getElementById('gallery-slider-track');
    
    if (gallerySliderContainer && gallerySliderTrack) {
      let currentX = 0;
      let autoScrollSpeed = 0.5; // Pixels per frame (adjust for speed)
      let animationFrameId = null;
      
      // Calculate loop width (width of first set of items)
      const sliderItems = gallerySliderTrack.querySelectorAll('.gallery-slider-item');
      const itemCount = sliderItems.length;
      const loopCount = Math.floor(itemCount / 2); // First half is original, second half is duplicate
      let loopWidth = 0;
      
      function calculateLoopWidth() {
        const firstItem = sliderItems[0];
        if (firstItem) {
          const itemWidth = firstItem.offsetWidth;
          const gap = 20; // Match CSS gap
          loopWidth = (itemWidth + gap) * loopCount;
        }
      }
      
      // Calculate on load and resize
      calculateLoopWidth();
      window.addEventListener('resize', calculateLoopWidth);
      
      function checkLoop() {
        if (loopWidth === 0) return;
        
        // If scrolled past the loop point, reset to beginning
        if (currentX <= -loopWidth) {
          currentX += loopWidth;
          gallerySliderTrack.style.transition = 'none';
          updateSliderPosition();
          // Force reflow
          gallerySliderTrack.offsetHeight;
          gallerySliderTrack.style.transition = '';
        }
      }

      function updateSliderPosition() {
        gallerySliderTrack.style.transform = `translateX(${currentX}px)`;
      }

      function autoScroll() {
        // Move slider to the left (negative direction)
        currentX -= autoScrollSpeed;
        
        checkLoop();
        updateSliderPosition();
        
        // Continue animation
        animationFrameId = requestAnimationFrame(autoScroll);
      }

      // Start automatic scrolling
      autoScroll();

      // Prevent image drag (default browser behavior)
      const sliderItemImages = gallerySliderTrack.querySelectorAll('.gallery-slider-item img');
      sliderItemImages.forEach(function(img) {
        img.addEventListener('dragstart', function(e) {
          e.preventDefault();
        });
      });

      // COMMENTED OUT: Drag functionality
      /*
      let isDown = false;
      let startX;
      let scrollLeft;
      let velocity = 0;
      let lastX = 0;
      let lastTime = Date.now();
      let isDragging = false;

      // Mouse events
      gallerySliderContainer.addEventListener('mousedown', function(e) {
        isDown = true;
        isDragging = true;
        gallerySliderTrack.classList.add('is-dragging');
        startX = e.pageX - gallerySliderContainer.offsetLeft;
        scrollLeft = currentX;
        lastX = e.pageX;
        lastTime = Date.now();
        velocity = 0;
        
        // Cancel any ongoing momentum animation
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });

      gallerySliderContainer.addEventListener('mouseleave', function() {
        if (isDown) {
          isDown = false;
          isDragging = false;
          gallerySliderTrack.classList.remove('is-dragging');
          applyMomentum();
        }
      });

      gallerySliderContainer.addEventListener('mouseup', function() {
        if (isDown) {
          isDown = false;
          isDragging = false;
          gallerySliderTrack.classList.remove('is-dragging');
          applyMomentum();
        }
      });

      gallerySliderContainer.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.pageX - gallerySliderContainer.offsetLeft;
        const walk = (x - startX) * 1.5; // Multiply for faster scrolling
        currentX = scrollLeft + walk; // Drag left moves slider left
        
        // Calculate velocity for momentum
        const now = Date.now();
        const timeDelta = now - lastTime;
        if (timeDelta > 0) {
          const xDelta = e.pageX - lastX;
          velocity = xDelta / timeDelta;
        }
        lastX = e.pageX;
        lastTime = now;
        
        checkLoop();
        updateSliderPosition();
      });

      function applyMomentum() {
        if (Math.abs(velocity) < 0.1) {
          velocity = 0;
          return;
        }

        // Apply friction
        velocity *= 0.95;
        currentX += velocity * 10;

        checkLoop();
        updateSliderPosition();

        // Continue momentum animation
        animationFrameId = requestAnimationFrame(applyMomentum);
      }

      // Make slider items clickable for lightbox (using existing click handler)
      // The existing document click handler will handle .gallery-slider-item clicks
      // We just need to prevent clicks during drag
      let clickAllowed = true;
      
      gallerySliderContainer.addEventListener('mousedown', function() {
        clickAllowed = false;
      });
      
      gallerySliderContainer.addEventListener('mouseup', function() {
        // Allow clicks after a short delay to distinguish from drag
        setTimeout(function() {
          clickAllowed = true;
        }, 150);
      });
      
      gallerySliderTrack.addEventListener('click', function(e) {
        if (!clickAllowed) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      */
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
    
    // Check if we're on index.html (no page-specific body class)
    const isHomePage = !body.classList.contains('weddings-page') && 
                       !body.classList.contains('business-page') && 
                       !body.classList.contains('party-page') && 
                       !body.classList.contains('about-page');
    
    // Check if we're on galerija.html (has hero-gallery class)
    const isGalleryPage = heroGallery !== null;
    
    if (logo) {
      function updateLogo() {
        if (isGalleryPage) {
          // Gallery page - use black logo
          if (logo.src && !logo.src.includes('logo.png')) {
            logo.src = logo.src.replace('logo-white.png', 'logo.png').replace('logo.png', 'logo.png');
          }
        } else if (isHomePage) {
          // Home page (index.html) - use white logo on mobile
          if (window.innerWidth <= 767) {
            // Mobile - use white logo
            if (logo.src && !logo.src.includes('logo-white.png')) {
              logo.src = logo.src.replace('logo.png', 'logo-white.png').replace('logo.png', 'logo-white.png');
            }
          } else {
            // Desktop - use regular logo
            if (logo.src && logo.src.includes('logo-white.png')) {
              logo.src = logo.src.replace('logo-white.png', 'logo.png');
            }
          }
        } else {
          // Other pages - use regular logo
          if (logo.src && (logo.src.includes('logo-white.png') || logo.src.includes('logo.png'))) {
            logo.src = logo.src.replace('logo-white.png', 'logo.png').replace('logo.png', 'logo.png');
          }
        }
      }
      
      // Update on load
      updateLogo();
      
      // Update on resize (only for home page)
      if (isHomePage) {
        window.addEventListener('resize', updateLogo);
      }
    }
  })();
  
