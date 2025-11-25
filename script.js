(function () {
    // Lightbox logic
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
      const lightboxImg = lightbox.querySelector('img');
      const closeBtn = lightbox.querySelector('.lightbox-close');
  
      function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Galerija';
        lightbox.classList.add('is-open');
      }
  
      function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightboxImg.src = '';
      }
  
      document.addEventListener('click', function (e) {
        const item = e.target.closest('.gallery-item, .gallery-main-item');
        if (!item) return;
        const img = item.querySelector('img');
        if (!img) return;
        openLightbox(img.src, img.alt);
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

    // Service pill reveal on viewport entry - all appear together
    const servicePills = document.querySelectorAll('.service-pill');
    const servicesSection = document.querySelector('.services');
    
    if (servicePills.length && servicesSection && 'IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add is-visible to all pills at once
              servicePills.forEach((pill) => pill.classList.add('is-visible'));
              sectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.7,
          rootMargin: '0px 0px -10% 0px',
        }
      );

      sectionObserver.observe(servicesSection);
    } else if (servicePills.length) {
      // Fallback without IntersectionObserver
      servicePills.forEach((pill) => pill.classList.add('is-visible'));
    }
  
    // Service cards clickable
    const serviceCards = document.querySelectorAll('.service-main-card, .service-card');
    serviceCards.forEach(function (card) {
      card.addEventListener('click', function () {
        // You can customize this action - scroll to contact, open modal, etc.
        // For now, scrolling to contact section
        const contactSection = document.getElementById('kontakt');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Catering features reveal on viewport entry - left to right with staggered delays
    const cateringFeatures = document.querySelectorAll('.catering-feature');
    const cateringSection = document.querySelector('.catering-highlight');
    
    if (cateringFeatures.length && cateringSection && 'IntersectionObserver' in window) {
      const cateringObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add is-visible to each feature with staggered delays (left to right)
              cateringFeatures.forEach(function (feature, index) {
                setTimeout(function () {
                  feature.classList.add('is-visible');
                }, index * 200); // 150ms delay between each (0ms, 150ms, 300ms, 450ms)
              });
              cateringObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.8,
          rootMargin: '0px 0px -10% 0px',
        }
      );

      cateringObserver.observe(cateringSection);
    } else if (cateringFeatures.length) {
      // Fallback without IntersectionObserver
      cateringFeatures.forEach(function (feature, index) {
        setTimeout(function () {
          feature.classList.add('is-visible');
        }, index * 150);
      });
    }

    // Animated number counter for stats
    const statValues = document.querySelectorAll('.stat-value');
    const aboutStats = document.querySelector('.about-stats');
    
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
                const duration = 3000; // 3 seconds
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
          threshold: 0.5,
          rootMargin: '0px 0px -10% 0px',
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
  })();
  
