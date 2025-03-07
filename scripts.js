  // Inline Lenis initialization
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Inline Lenis initialization');
    
    // Wait a moment to ensure Lenis is loaded
    setTimeout(function() {
      if (typeof window.Lenis === 'function') {
        const lenis = new window.Lenis({
          duration: 1.2,
          smooth: true
        });
        
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        
        requestAnimationFrame(raf);
        console.log('Lenis initialized');
        window.lenis = lenis;
      } else {
        console.error('Lenis not available for inline initialization');
      }
    }, 500);
  });

// Initialize Swiper sliders for all instances of .home-hero_slider
document.addEventListener('DOMContentLoaded', function() {
  // Swiper slider initialization
  const sliderContainers = document.querySelectorAll('.home-hero_slider');
  if (sliderContainers.length > 0) {
    sliderContainers.forEach(function(container) {
      const swiperElement = container.querySelector('.swiper');
      if (swiperElement) {
        const swiper = new Swiper(swiperElement, {
          // Enable fade effect
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          
          // Show only one slide at a time
          slidesPerView: 1,
          
          // Enable autoplay
          autoplay: {
            delay: 5000, // 5 seconds between slides
            disableOnInteraction: false // Continue autoplay after user interaction
          }
        });
      }
    });
  }
  
  // Team connected sliders initialization
  function initTeamSliders() {
    // Find all team components on the page
    const teamComponents = document.querySelectorAll('.team');
    
    if (teamComponents.length === 0) return;
    
    teamComponents.forEach(function(teamComponent) {
      // Find the main slider and track slider within this team component
      const mainSliderContainer = teamComponent.querySelector('.team_slider-main');
      const trackSliderContainer = teamComponent.querySelector('.team_slider-track');
      
      if (!mainSliderContainer || !trackSliderContainer) return;
      
      // Get the actual swiper elements
      const mainSliderElement = mainSliderContainer.querySelector('.swiper');
      const trackSliderElement = trackSliderContainer.querySelector('.swiper');
      
      if (!mainSliderElement || !trackSliderElement) return;
      
      // Get navigation buttons first so we can reference them in the Swiper initialization
      const prevButton = teamComponent.querySelector('.team_arrow.prev');
      const nextButton = teamComponent.querySelector('.team_arrow.next');
      
      // Function to update arrow states
      function updateArrowStates(swiper, prevBtn, nextBtn) {
        if (!prevBtn || !nextBtn) return;
        
        // Check if we're at the beginning or end of the slider
        if (swiper.isBeginning) {
          prevBtn.classList.add('disabled');
        } else {
          prevBtn.classList.remove('disabled');
        }
        
        if (swiper.isEnd) {
          nextBtn.classList.add('disabled');
        } else {
          nextBtn.classList.remove('disabled');
        }
      }
      
      // Initialize the main slider
      const mainSwiper = new Swiper(mainSliderElement, {
        effect: 'slide',
        slidesPerView: 1,
        // Remove autoplay
        // Disable loop
        loop: false,
        speed: 200,
        watchSlidesProgress: true,
        // Disable touch/swipe controls
        allowTouchMove: false,
        // Remove navigation from Swiper initialization
        // We'll handle it manually
        on: {
          init: function() {
            // Update arrow states on initialization
            updateArrowStates(this, prevButton, nextButton);
            
            // Update the counter with correct class names
            const currentCounter = teamComponent.querySelector('.team_current');
            const totalCounter = teamComponent.querySelector('.team_total');
            
            if (currentCounter && totalCounter) {
              currentCounter.textContent = this.activeIndex + 1;
              totalCounter.textContent = this.slides.length;
            }
          },
          slideChange: function() {
            // Update arrow states when slides change
            updateArrowStates(this, prevButton, nextButton);
            
            // Update the counter with correct class names
            const currentCounter = teamComponent.querySelector('.team_current');
            const totalCounter = teamComponent.querySelector('.team_total');
            
            if (currentCounter && totalCounter) {
              currentCounter.textContent = this.activeIndex + 1;
              totalCounter.textContent = this.slides.length;
            }
            
            // Update track slider manually
            if (trackSwiper) {
              trackSwiper.slideTo(this.activeIndex + 1, 100);
            }
          }
        }
      });
      
      // Initialize the track slider with faster animation speed
      const trackSwiper = new Swiper(trackSliderElement, {
        slidesPerView: 3,
        spaceBetween: 20,
        // Disable loop
        loop: false,
        // Faster speed for track slider to ensure it keeps up with main slider
        speed: 100, // Reduced from 200 to 100
        // Disable autoplay on track slider
        autoplay: false,
        // Enable smooth transitions between slides
        effect: 'slide',
        // Disable touch/swipe controls
        allowTouchMove: false,
        // Important: Remove slidesPerGroup to prevent grouping
        // Start at the next slide (offset by 1)
        initialSlide: 1,
        // Allow sliding beyond the end
        allowSlideNext: true,
        // Add fixed space after the last slide
        slidesOffsetAfter: trackSliderContainer.offsetWidth,
        // Responsive breakpoints
        breakpoints: {
          0: {
            slidesPerView: 1.5,
            spaceBetween: 10
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 15
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 15
          },
          992: {
            slidesPerView: 2.5,
            spaceBetween: 20
          }
        }
      });
      
      // Add click functionality to track slider slides
      trackSliderElement.querySelectorAll('.swiper-slide').forEach(function(slide, index) {
        slide.addEventListener('click', function() {
          // Use slideTo instead of slideToLoop since loop is disabled
          mainSwiper.slideTo(index);
        });
      });
      
      // Initial arrow state update
      updateArrowStates(mainSwiper, prevButton, nextButton);
      
      if (prevButton) {
        prevButton.addEventListener('click', function(e) {
          e.preventDefault();
          // Move main slider back one slide
          if (mainSwiper.activeIndex > 0) {
            mainSwiper.slideTo(mainSwiper.activeIndex - 1);
          }
        });
      }
      
      if (nextButton) {
        nextButton.addEventListener('click', function(e) {
          e.preventDefault();
          // Move main slider forward one slide
          if (mainSwiper.activeIndex < mainSwiper.slides.length - 1) {
            mainSwiper.slideTo(mainSwiper.activeIndex + 1);
          }
        });
      }
    });
  }
  
  // Initialize team sliders
  initTeamSliders();
  
  // Position the vertical line
  function positionVerticalLine() {
    const verticalLine = document.querySelector('.vertical-line');
    const heroButtons = document.querySelector('.home-hero_buttons');
    const homeHero = document.querySelector('.home-hero');
    
    if (verticalLine && heroButtons && homeHero) {
      // Get the home-hero container dimensions
      const heroRect = homeHero.getBoundingClientRect();
      const buttonsRect = heroButtons.getBoundingClientRect();
      
      // Calculate the position relative to the home-hero container
      // This centers the line with the middle of the buttons
      const buttonsMidpoint = buttonsRect.top + (buttonsRect.height / 2);
      const positionFromHeroTop = buttonsMidpoint - heroRect.top;
      
      // Position the line relative to the home-hero container
      verticalLine.style.top = `${positionFromHeroTop}px`;
      verticalLine.style.position = 'absolute';
      verticalLine.style.transform = 'translateY(-50%)'; // Center the line itself
    }
  }
  
  // Only set up vertical line positioning if the elements exist
  const verticalLine = document.querySelector('.vertical-line');
  const heroButtons = document.querySelector('.home-hero_buttons');
  if (verticalLine && heroButtons) {
    // Position on load
    positionVerticalLine();
    
    // Reposition on window resize
    window.addEventListener('resize', positionVerticalLine);
  }

  // Sub-accordion functionality
  const subAccordionLists = document.querySelectorAll('.sub-accordion_list');
  
  // Function to update the accordion image based on active sub-accordion
  function updateAccordionImage(subAccordion) {
    if (!subAccordion) return;
    
    // Get the parent accordion item
    const accordionItem = subAccordion.closest('.accordion_item');
    if (!accordionItem) return;
    
    // Get the sub-accordion image and the accordion image container
    const subAccordionImage = subAccordion.querySelector('.sub-accordion_image');
    const accordionImageContainer = accordionItem.querySelector('.accodion_image-container .g_visual_wrap');
    
    if (subAccordionImage && accordionImageContainer) {
      // Get the source image
      const sourceImg = subAccordionImage;
      // Get the current target image
      const currentTargetImg = accordionImageContainer.querySelector('img.g_visual_img');
      
      if (sourceImg && currentTargetImg) {
        // Get the src, srcset and sizes from the source image
        const sourceSrc = sourceImg.getAttribute('src');
        const sourceSrcset = sourceImg.getAttribute('srcset');
        const sourceSizes = sourceImg.getAttribute('sizes');
        const sourceAlt = sourceImg.getAttribute('alt') || '';
        
        // Create a new image element for the fade transition
        const newImage = document.createElement('img');
        newImage.className = 'g_visual_img u-cover-absolute transition-image';
        newImage.setAttribute('src', sourceSrc);
        if (sourceSrcset) newImage.setAttribute('srcset', sourceSrcset);
        if (sourceSizes) newImage.setAttribute('sizes', sourceSizes);
        newImage.setAttribute('alt', sourceAlt);
        
        // Style for the fade transition - set initial opacity to 0
        newImage.style.opacity = '0';
        newImage.style.zIndex = '2'; // Place above the current image
        
        // Preload the image before showing it to prevent flickering
        const preloadImage = new Image();
        preloadImage.onload = () => {
          // Once preloaded, add the new image to the container
          accordionImageContainer.appendChild(newImage);
          
          // Force a reflow to ensure the transition works
          void newImage.offsetWidth;
          
          // Add the transition property after the element is in the DOM
          newImage.style.transition = 'opacity 0.5s ease';
          
          // Use requestAnimationFrame to ensure the browser has rendered the initial state
          requestAnimationFrame(() => {
            // Fade in the new image in the next frame
            requestAnimationFrame(() => {
              newImage.style.opacity = '1';
            });
          });
          
          // Update the original image attributes behind the scenes
          currentTargetImg.setAttribute('src', sourceSrc);
          if (sourceSrcset) currentTargetImg.setAttribute('srcset', sourceSrcset);
          if (sourceSizes) currentTargetImg.setAttribute('sizes', sourceSizes);
          currentTargetImg.setAttribute('alt', sourceAlt);
          
          // After the transition completes, remove the transition image
          setTimeout(() => {
            // Only remove if it's still in the DOM
            if (newImage.parentNode) {
              accordionImageContainer.removeChild(newImage);
            }
          }, 600); // Slightly longer than the transition to ensure it's complete
        };
        
        // Start preloading
        preloadImage.src = sourceSrc;
      }
    }
  }
  
  // Only set up sub-accordion functionality if elements exist
  if (subAccordionLists.length > 0) {
    // Open the first sub-accordion in each list by default
    subAccordionLists.forEach(list => {
      const subAccordions = list.querySelectorAll('.sub-accordion');
      if (subAccordions.length > 0) {
        // Add active class to first sub-accordion
        subAccordions[0].classList.add('active');
        // Show its content
        const firstContent = subAccordions[0].querySelector('.sub-accordion_content');
        if (firstContent) {
          firstContent.style.display = 'block';
        }
        
        // Update the accordion image with the first sub-accordion's image
        updateAccordionImage(subAccordions[0]);
      }
      
      // Add click event listeners to all sub-accordion headers in this list
      const headers = list.querySelectorAll('.sub-accordion_header');
      headers.forEach(header => {
        header.addEventListener('click', function() {
          const parentAccordion = this.closest('.sub-accordion');
          const content = parentAccordion.querySelector('.sub-accordion_content');
          const isActive = parentAccordion.classList.contains('active');
          
          // Close all sub-accordions in this list
          const allSubAccordions = list.querySelectorAll('.sub-accordion');
          allSubAccordions.forEach(accordion => {
            accordion.classList.remove('active');
            const accordionContent = accordion.querySelector('.sub-accordion_content');
            if (accordionContent) {
              accordionContent.style.display = 'none';
            }
          });
          
          // If the clicked accordion wasn't active, open it
          if (!isActive) {
            parentAccordion.classList.add('active');
            if (content) {
              content.style.display = 'block';
            }
            
            // Update the accordion image with this sub-accordion's image
            updateAccordionImage(parentAccordion);
          }
        });
      });
    });
  }

  // GSAP ScrollTrigger Pin Section - only initialize if elements exist
  const scrollExperienceContainer = document.querySelector('.scroll-experience-container');
  const accordionItems = document.querySelectorAll('.accordion_item');
  
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && scrollExperienceContainer && accordionItems.length > 0) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Set first accordion item as active on page load
    accordionItems[0].classList.add('active');

    // Main container ScrollTrigger with improved snap functionality
    ScrollTrigger.create({
      trigger: ".scroll-experience-container",
      pin: true,
      start: "top top",
      end: () => `+=${accordionItems.length * 100}%`, // Dynamic end point based on number of items
      pinSpacing: true,
      snap: {
        snapTo: (value, self) => {
          // Create snap points at equal intervals
          const snapPoints = [];
          for (let i = 0; i <= accordionItems.length - 1; i++) {
            snapPoints.push(i / (accordionItems.length - 1));
          }
          
          // Find the closest snap point
          let closest = snapPoints.reduce((prev, curr) => {
            return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
          });
          
          return closest;
        },
        duration: {min: 0.2, max: 0.3},
        delay: 0.1,
        ease: "power1.inOut"
      }
    });

    // Create a single ScrollTrigger to handle all accordion items
    ScrollTrigger.create({
      trigger: ".scroll-experience-container",
      start: "top top",
      end: () => `+=${accordionItems.length * 100}%`,
      markers: false,
      onUpdate: self => {
        // Calculate which item should be active based on scroll progress
        const progress = self.progress;
        const itemIndex = Math.round(progress * (accordionItems.length - 1));
        
        // Deactivate all items
        accordionItems.forEach(item => item.classList.remove('active'));
        
        // Activate the current item
        if (accordionItems[itemIndex]) {
          accordionItems[itemIndex].classList.add('active');
        }
      }
    });

    // Add click navigation for accordion buttons
    const accordionButtons = document.querySelectorAll('.accordion_button-click');

    if (accordionButtons.length > 0) {
      accordionButtons.forEach((button) => {
        button.addEventListener('click', function() {
          // Find the parent accordion item of this button
          const parentAccordion = this.closest('.accordion_item');
          
          // Find the index of this accordion item in the collection
          const targetIndex = Array.from(accordionItems).indexOf(parentAccordion);
          
          // Only proceed if we found a valid index
          if (targetIndex !== -1) {
            // Get the container and its ScrollTrigger instances
            const container = document.querySelector('.scroll-experience-container');
            
            // Find the main ScrollTrigger instance with snap functionality
            const mainST = ScrollTrigger.getAll().find(instance => 
              instance.vars.trigger === container || 
              instance.vars.trigger === ".scroll-experience-container" && 
              instance.vars.snap
            );
            
            if (mainST) {
              // Calculate the exact progress point for this accordion
              const exactProgress = targetIndex / (accordionItems.length - 1);
              
              // Use ScrollTrigger's scroll method to precisely navigate to the target position
              mainST.scroll(mainST.start + (exactProgress * (mainST.end - mainST.start)));
              
              // Force the snap to happen immediately
              ScrollTrigger.update();
              
              // Activate the target accordion immediately for better UX
              accordionItems.forEach((item, i) => {
                item.classList.toggle('active', i === targetIndex);
              });
            }
          }
        });
      });
    }
  }

  function imageSrcSetFix() {
    // Handle improperly loaded srcset size for responsive images
    var images = document.getElementsByTagName("img");
    
    if (images.length === 0) return;
  
    function updateImageSizes() {
      for (var i = 0; i < images.length; i++) {
        var image = images[i];
  
        // Check if the image has already been sized
        if (!image.dataset.sized) {
          if (image.complete) {
            setImageSizes(image);
          } else {
            // Add a one-time load event listener
            image.addEventListener(
              "load",
              function () {
                setImageSizes(this);
              },
              { once: true }
            );
          }
        }
      }
    }
  
    function setImageSizes(image) {
      var imageRect = image.getBoundingClientRect();
      var imageWidth = imageRect.width;
      var imageHeight = imageRect.height;
      var viewportWidth = window.innerWidth;
      var viewportHeight = window.innerHeight;
  
      // Calculate width percentage
      var widthPercentage = (imageWidth / viewportWidth) * 100;
  
      // Calculate height percentage
      var heightPercentage = (imageHeight / viewportHeight) * 100;
  
      // Combine width and height considerations
      var combinedSizeValue =
        Math.round(widthPercentage * 0.7 + heightPercentage * 0.3) + "vw";
  
      // Optional: Add a minimum and maximum size constraint
      var minSize = 10; // Minimum 10vw
      var maxSize = 90; // Maximum 90vw
      var finalSizeValue =
        Math.min(Math.max(parseFloat(combinedSizeValue), minSize), maxSize) +
        "vw";
  
      // Set sizes attribute
      image.setAttribute("sizes", finalSizeValue);
  
      // Mark as sized to avoid redundant processing
      image.dataset.sized = "true";
    }
  
    // Debounce function to limit function calls during resize
    function debounce(func, delay) {
      let timer;
      return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
      };
    }
  
    // Update image sizes on initial load
    updateImageSizes();
  
    // Update image sizes on window resize with debounce
    window.addEventListener("resize", debounce(updateImageSizes, 200));
  }

  // Only run image fix if there are images on the page
  if (document.getElementsByTagName("img").length > 0) {
    imageSrcSetFix();
  }

  // Function to create and position the connecting line between split-CTA graphics
  function createConnectingLine() {
    // Get the two graphic elements
    const leftGraphic = document.querySelector('.split-cta_graphic.left');
    const rightGraphic = document.querySelector('.split-cta_graphic.right');
    const splitCtaContainer = document.querySelector('.split-cta');
    
    // Only proceed if all required elements exist
    if (!leftGraphic || !rightGraphic || !splitCtaContainer) {
      return;
    }
    
    // Check if the line already exists, remove it if it does to prevent duplicates
    const existingLine = document.querySelector('.split-cta-connecting-line');
    if (existingLine) {
      existingLine.remove();
    }
    
    // Create an SVG element for the line
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('split-cta-connecting-line');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none'; // Make sure it doesn't interfere with clicks
    svg.style.zIndex = '1'; // Place it above other elements if needed
    
    // Get the positions of the graphics relative to the split-cta container
    const leftRect = leftGraphic.getBoundingClientRect();
    const rightRect = rightGraphic.getBoundingClientRect();
    const containerRect = splitCtaContainer.getBoundingClientRect();
    
    // Check if we're on a mobile/tablet screen (991px or less)
    const isMobile = window.innerWidth <= 991;
    
    let startX, startY, endX, endY;
    
    if (isMobile) {
      // For mobile: bottom middle of left graphic to top middle of right graphic
      startX = leftRect.left + (leftRect.width / 2) - containerRect.left;
      startY = leftRect.bottom - containerRect.top;
      
      endX = rightRect.left + (rightRect.width / 2) - containerRect.left;
      endY = rightRect.top - containerRect.top;
    } else {
      // For desktop: middle right of left graphic to middle left of right graphic
      startX = leftRect.right - containerRect.left;
      startY = containerRect.height / 2; // Center of container
      
      endX = rightRect.left - containerRect.left;
      endY = containerRect.height / 2; // Center of container
    }
    
    // Create the line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-opacity', '0.75');
    line.setAttribute('stroke-width', '2');
    
    // Add the line to the SVG
    svg.appendChild(line);
    
    // Add the SVG to the split-cta container
    splitCtaContainer.appendChild(svg);
  }
  
  // Only set up split-CTA connecting line if elements exist
  const splitCtaElements = document.querySelector('.split-cta');
  if (splitCtaElements) {
    // Initial creation with multiple attempts
    createConnectingLine();
    
    // Try again after delays to ensure proper positioning
    setTimeout(createConnectingLine, 500);
    setTimeout(createConnectingLine, 1500);
    setTimeout(createConnectingLine, 3000);
    
    // Also try when window fully loads
    window.addEventListener('load', createConnectingLine);
    
    // Update immediately on resize without debounce for responsiveness
    window.addEventListener('resize', createConnectingLine);
  }

  // Image card text animation
  const imageCards = document.querySelectorAll('.image-card');
  
  imageCards.forEach(card => {
    const text = card.querySelector('.image-card_text');
    const svg = card.querySelector('.image-card_headline-container svg');
    let textHeight;
    
    // Store the natural height of the text
    function measureTextHeight() {
      // Clone the text element to measure it without affecting layout
      const clone = text.cloneNode(true);
      
      // Style the clone for measurement
      clone.style.cssText = `
        position: absolute;
        visibility: hidden;
        height: auto;
        width: ${text.offsetWidth}px;
      `;
      
      // Add to DOM, measure, then remove
      card.appendChild(clone);
      textHeight = clone.offsetHeight;
      card.removeChild(clone);
    }
    
    // Measure initial height
    measureTextHeight();
    
    // Set initial state with transition
    text.style.height = '0';
    text.style.overflow = 'hidden';
    text.style.transition = 'height 0.4s ease-out';
    
    // Add transition to SVG for smooth rotation
    if (svg) {
      svg.style.transition = 'transform 0.4s ease-out';
      svg.style.transformOrigin = 'center';
    }
    
    // Update height on window resize
    window.addEventListener('resize', () => {
      measureTextHeight();
      // If card is currently hovered, update height immediately
      if (card.matches(':hover')) {
        text.style.height = textHeight + 'px';
      }
    });
    
    // Add hover listeners
    card.addEventListener('mouseenter', () => {
      text.style.height = textHeight + 'px';
      if (svg) {
        svg.style.transform = 'rotate(180deg)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      text.style.height = '0';
      if (svg) {
        svg.style.transform = 'rotate(0deg)';
      }
    });
  });

  // Tab functionality
  function initTabContainers() {
    const tabContainers = document.querySelectorAll('.tab-container');
    
    if (tabContainers.length === 0) return;
    
    tabContainers.forEach(container => {
      const tabNav = container.querySelector('.tab_nav');
      const tabContent = container.querySelector('.tab_content');
      
      if (!tabNav || !tabContent) return;
      
      const tabNavItems = tabNav.querySelectorAll('.tab-nav_item');
      const tabContentItems = tabContent.querySelectorAll('.tab-content_item');
      
      // Ensure we have matching numbers of nav and content items
      if (tabNavItems.length !== tabContentItems.length) {
        console.warn('Tab navigation and content items count mismatch');
        return;
      }
      
      // Set initial state - first tab active, others hidden
      tabNavItems[0].classList.add('active');
      tabNavItems[0].setAttribute('aria-selected', 'true');
      
      // Hide all content items except the first one
      tabContentItems.forEach((item, index) => {
        // Add proper ARIA roles
        item.setAttribute('role', 'tabpanel');
        item.setAttribute('aria-labelledby', `tab-${container.id || 'tab'}-${index}`);
        item.id = `tabpanel-${container.id || 'tab'}-${index}`;
        
        if (index !== 0) {
          item.style.display = 'none';
        }
      });
      
      // Add click event listeners to tab nav items
      tabNavItems.forEach((navItem, index) => {
        // Add proper ARIA roles
        navItem.setAttribute('role', 'tab');
        navItem.id = `tab-${container.id || 'tab'}-${index}`;
        navItem.setAttribute('aria-controls', `tabpanel-${container.id || 'tab'}-${index}`);
        navItem.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        navItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
        
        // Find the icon element
        const iconElement = navItem.querySelector('.tab-nav_icon');
        
        // Set initial icon text based on active state
        if (iconElement) {
          iconElement.textContent = index === 0 ? '-' : '+';
        }
        
        // Make tabs keyboard navigable
        navItem.addEventListener('keydown', (e) => {
          // Handle arrow keys
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            
            const direction = e.key === 'ArrowLeft' ? -1 : 1;
            let newIndex = index + direction;
            
            // Handle wrapping around
            if (newIndex < 0) newIndex = tabNavItems.length - 1;
            if (newIndex >= tabNavItems.length) newIndex = 0;
            
            // Activate the new tab
            tabNavItems[newIndex].click();
            tabNavItems[newIndex].focus();
          }
          
          // Handle Home and End keys
          if (e.key === 'Home') {
            e.preventDefault();
            tabNavItems[0].click();
            tabNavItems[0].focus();
          }
          
          if (e.key === 'End') {
            e.preventDefault();
            tabNavItems[tabNavItems.length - 1].click();
            tabNavItems[tabNavItems.length - 1].focus();
          }
        });
        
        navItem.addEventListener('click', function() {
          // Remove active class from all nav items
          tabNavItems.forEach(item => {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
            item.setAttribute('tabindex', '-1');
            
            // Update icon text to "+" for inactive tabs
            const itemIcon = item.querySelector('.tab-nav_icon');
            if (itemIcon) {
              itemIcon.textContent = '+';
            }
          });
          
          // Add active class to clicked nav item
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
          this.setAttribute('tabindex', '0');
          
          // Update icon text to "-" for active tab
          const thisIcon = this.querySelector('.tab-nav_icon');
          if (thisIcon) {
            thisIcon.textContent = '-';
          }
          
          // Hide all content items
          tabContentItems.forEach(item => {
            item.style.display = 'none';
          });
          
          // Show the corresponding content item
          tabContentItems[index].style.display = 'block';
        });
      });
    });
  }
  
  // Initialize tab containers
  initTabContainers();

  // Menu functionality
  function initializeMenu() {
    const menuButton = document.querySelector('.main-menu_button');
    const mainMenu = document.querySelector('.main-menu');
    const submenuToggles = document.querySelectorAll('.main-menu_submenu-toggle');
    
    // Check if menu elements exist
    if (!menuButton || !mainMenu) return;
    
    // Restructure the menu for the slide effect
    restructureMenu();
    
    // Remove the third close button if it exists
    const extraCloseButton = mainMenu.querySelector('.main-menu_close:not(.main-menu_close-primary):not(.main-menu_close-secondary)');
    if (extraCloseButton) {
      extraCloseButton.remove();
    }
    
    // Toggle main menu
    menuButton.addEventListener('click', function() {
      // Toggle the active class to show/hide the menu
      mainMenu.classList.toggle('active');
      
      // If the menu is being closed, also reset any submenu state
      if (!mainMenu.classList.contains('active')) {
        resetSubmenuState();
      }
      
      // Toggle body scroll
      if (mainMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
      } else {
        document.body.style.overflow = ''; // Restore scrolling
      }
    });
    
    // Add event listeners to both close buttons
    document.querySelectorAll('.main-menu_close').forEach(button => {
      button.addEventListener('click', function() {
        mainMenu.classList.remove('active');
        resetSubmenuState();
        document.body.style.overflow = ''; // Restore scrolling
      });
    });
    
    // Toggle submenu - Fixed to preserve secondary close button
    submenuToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const menuItem = this.closest('.main-menu_item');
        
        if (menuItem) {
          // Reset all other active items first
          document.querySelectorAll('.main-menu_item.active').forEach(item => {
            if (item !== menuItem) {
              item.classList.remove('active');
            }
          });
          
          // Set active state
          menuItem.classList.add('active');
          
          // Show the corresponding submenu in the secondary panel
          const submenu = menuItem.querySelector('.main-menu_submenu');
          const secondaryPanel = document.querySelector('.main-menu_secondary');
          
          if (submenu && secondaryPanel) {
            // Save the close button before clearing the secondary panel
            const closeButton = secondaryPanel.querySelector('.main-menu_close-secondary');
            
            // Clear the secondary panel but keep the close button if it exists
            secondaryPanel.innerHTML = '';
            
            // Add back the close button if it existed
            if (closeButton) {
              secondaryPanel.appendChild(closeButton);
            }
            
            // Add a back button
            const backButton = document.createElement('div');
            backButton.className = 'main-menu_back';
            backButton.innerHTML = '← Back';
            secondaryPanel.appendChild(backButton);
            
            // Clone the submenu content to the secondary panel
            secondaryPanel.appendChild(submenu.cloneNode(true));
            secondaryPanel.querySelector('.main-menu_submenu').style.display = 'block';
            
            // Handle back button click
            backButton.addEventListener('click', function() {
              // Reset the menu to show only the primary panel
              mainMenu.classList.remove('submenu-active');
              
              // Reset all active states to return arrows to default position
              document.querySelectorAll('.main-menu_item.active').forEach(item => {
                item.classList.remove('active');
              });
            });
            
            // Add class to show submenu
            mainMenu.classList.add('submenu-active');
          }
        }
      });
    });
    
    // Function to reset submenu state
    function resetSubmenuState() {
      mainMenu.classList.remove('submenu-active');
      
      // Reset all active states to return arrows to default position
      const activeItems = document.querySelectorAll('.main-menu_item.active');
      activeItems.forEach(item => {
        item.classList.remove('active');
      });
    }
    
    // Function to restructure the menu for the slide effect - Updated with two close buttons
    function restructureMenu() {
      // Create container for primary and secondary panels
      const menuContainer = document.createElement('div');
      menuContainer.className = 'main-menu_container';
      
      // Create primary panel
      const primaryPanel = document.createElement('div');
      primaryPanel.className = 'main-menu_primary';
      
      // Move all menu items to the primary panel
      const menuItems = Array.from(mainMenu.querySelectorAll('.main-menu_item'));
      menuItems.forEach(item => {
        primaryPanel.appendChild(item);
      });
      
      // Create primary close button
      const primaryCloseButton = document.createElement('div');
      primaryCloseButton.className = 'main-menu_close main-menu_close-primary';
      primaryPanel.appendChild(primaryCloseButton);
      
      // Create secondary panel
      const secondaryPanel = document.createElement('div');
      secondaryPanel.className = 'main-menu_secondary';
      
      // Create secondary close button
      const secondaryCloseButton = document.createElement('div');
      secondaryCloseButton.className = 'main-menu_close main-menu_close-secondary';
      secondaryPanel.appendChild(secondaryCloseButton);
      
      // Add panels to container
      menuContainer.appendChild(primaryPanel);
      menuContainer.appendChild(secondaryPanel);
      
      // Add container to menu
      mainMenu.appendChild(menuContainer);
      
      // Add event listeners to both close buttons
      document.querySelectorAll('.main-menu_close').forEach(button => {
        button.addEventListener('click', function() {
          mainMenu.classList.remove('active');
          resetSubmenuState();
          document.body.style.overflow = ''; // Restore scrolling
        });
      });
    }

    // Add keyboard navigation to the menu
    addKeyboardNavigation();
  }
  
  // Initialize menu
  initializeMenu();
});

// Add keyboard navigation to the menu
function addKeyboardNavigation() {
  const menuButton = document.querySelector('.main-menu_button');
  const mainMenu = document.querySelector('.main-menu');
  const closeButtons = document.querySelectorAll('.main-menu_close');
  
  // Add ARIA attributes to menu button
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', 'main-menu');
  menuButton.setAttribute('aria-label', 'Menu');
  menuButton.setAttribute('role', 'button');
  menuButton.setAttribute('tabindex', '0');
  
  // Add ARIA attributes to menu
  mainMenu.setAttribute('role', 'navigation');
  mainMenu.setAttribute('aria-label', 'Main Menu');
  mainMenu.id = 'main-menu';
  
  // Add ARIA attributes to close buttons
  closeButtons.forEach(button => {
    button.setAttribute('aria-label', 'Close Menu');
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    
    // Make close button keyboard accessible
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
        
        // Return focus to menu button when closing
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.focus();
      }
    });
  });
  
  // Handle Escape key to close menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainMenu.classList.contains('active')) {
      closeButtons[0].click();
    }
  });
  
  // Add keyboard navigation to menu items
  const menuItems = mainMenu.querySelectorAll('.main-menu_item');
  
  menuItems.forEach((item, index) => {
    const link = item.querySelector('.main-menu_link-text');
    const submenuToggle = item.querySelector('.main-menu_submenu-toggle');
    
    if (link) {
      // Make links keyboard accessible
      link.setAttribute('tabindex', '0');
      
      // Add keyboard navigation between menu items
      link.addEventListener('keydown', function(e) {
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight': // Add right arrow for forward navigation (like Tab)
            e.preventDefault();
            // Focus next menu item or wrap to first
            const nextItem = menuItems[index + 1] || menuItems[0];
            nextItem.querySelector('.main-menu_link-text').focus();
            break;
            
          case 'ArrowUp':
          case 'ArrowLeft': // Add left arrow for backward navigation (like Shift+Tab)
            e.preventDefault();
            // Focus previous menu item or wrap to last
            const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
            prevItem.querySelector('.main-menu_link-text').focus();
            break;
            
          case 'Enter':
          case ' ':
            e.preventDefault();
            // If there's a submenu toggle, activate it
            if (submenuToggle) {
              submenuToggle.click();
              
              // Focus the back button in the submenu
              setTimeout(() => {
                const backButton = document.querySelector('.main-menu_back');
                if (backButton) backButton.focus();
              }, 100);
            } else {
              // If it's just a link with no submenu, follow the link
              link.click();
            }
            break;
            
          case 'Escape':
            e.preventDefault();
            // Close the menu
            closeButtons[0].click();
            break;
        }
      });
    }
    
    // Update submenu toggle keyboard handling
    if (submenuToggle) {
      // Make submenu toggles keyboard accessible
      submenuToggle.setAttribute('tabindex', '0');
      submenuToggle.setAttribute('role', 'button');
      submenuToggle.setAttribute('aria-expanded', 'false');
      submenuToggle.setAttribute('aria-label', 'Open submenu');
      
      // Handle keyboard activation of submenu toggles
      submenuToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
          this.setAttribute('aria-expanded', 'true');
          
          // Focus the back button in the submenu
          setTimeout(() => {
            const backButton = document.querySelector('.main-menu_back');
            if (backButton) backButton.focus();
          }, 100);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          // Forward navigation
          e.preventDefault();
          const nextItem = menuItems[index + 1] || menuItems[0];
          if (nextItem) {
            const nextLink = nextItem.querySelector('.main-menu_link-text');
            if (nextLink) nextLink.focus();
          }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          // Backward navigation
          e.preventDefault();
          const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
          if (prevItem) {
            const prevLink = prevItem.querySelector('.main-menu_link-text');
            if (prevLink) prevLink.focus();
          }
        }
      });
    }
  });
  
  // Handle back button keyboard navigation - Fixed
  document.addEventListener('click', function(e) {
    if (e.target.closest('.main-menu_back')) {
      const activeItem = document.querySelector('.main-menu_item.active');
      if (activeItem) {
        const submenuToggle = activeItem.querySelector('.main-menu_submenu-toggle');
        const menuLink = activeItem.querySelector('.main-menu_link-text');
        
        if (submenuToggle) {
          submenuToggle.setAttribute('aria-expanded', 'false');
          
          // Return focus to the menu link that was activated
          setTimeout(() => {
            if (menuLink) {
              menuLink.focus();
            } else if (submenuToggle) {
              submenuToggle.focus();
            }
          }, 100);
        }
      }
    }
  });
  
  // Make submenu links keyboard navigable - Enhanced with left/right arrow navigation
  function setupSubmenuKeyboardNav() {
    const secondaryPanel = document.querySelector('.main-menu_secondary');
    if (!secondaryPanel) return;
    
    const backButton = secondaryPanel.querySelector('.main-menu_back');
    const submenuLinks = secondaryPanel.querySelectorAll('a');
    
    if (backButton) {
      backButton.setAttribute('tabindex', '0');
      backButton.setAttribute('role', 'button');
      
      backButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
          // Focus will be handled by the click event handler
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          if (submenuLinks.length > 0) {
            submenuLinks[0].focus();
          }
        }
      });
    }
    
    submenuLinks.forEach((link, i) => {
      link.addEventListener('keydown', function(e) {
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight': // Add right arrow for forward navigation
            e.preventDefault();
            // Focus next link or wrap to first
            if (i < submenuLinks.length - 1) {
              submenuLinks[i + 1].focus();
            } else {
              backButton.focus();
            }
            break;
            
          case 'ArrowUp':
          case 'ArrowLeft': // Add left arrow for backward navigation
            e.preventDefault();
            // Focus previous link or wrap to back button
            if (i > 0) {
              submenuLinks[i - 1].focus();
            } else {
              backButton.focus();
            }
            break;
            
          case 'Escape':
            e.preventDefault();
            // Close the menu
            closeButtons[0].click();
            break;
        }
      });
    });
  }
  
  // Set up submenu keyboard navigation when a submenu is opened
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class' && 
          mainMenu.classList.contains('submenu-active')) {
        setupSubmenuKeyboardNav();
      }
    });
  });
  
  observer.observe(mainMenu, { attributes: true });
}

// Detect keyboard navigation vs mouse - Fixed
function detectKeyboardNavigation() {
  // Add class to body when using keyboard
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  // Remove class when using mouse
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });
  
  // Initial setup - force keyboard navigation to be active
  document.body.classList.add('keyboard-nav');
}

// Call this function on page load
detectKeyboardNavigation();



