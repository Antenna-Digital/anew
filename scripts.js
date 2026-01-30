console.log('sdf');

// Cookie utility functions
const CookieUtils = {
  // Set a cookie with name, value, and optional expiration days
  set: function(name, value, days = 30) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  },
  
  // Get a cookie value by name
  get: function(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  
  // Delete a cookie by name
  delete: function(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
  }
};

// Notification bar functionality with cookie persistence
function initNotificationBar() {
  const notificationBar = document.getElementById('website_notification');
  const closeButton = document.getElementById('website_notification_close');
  
  // Check if notification bar elements exist
  if (!notificationBar || !closeButton) {
    console.warn('Notification bar elements not found');
    return;
  }
  
  const cookieName = 'notification_bar_dismissed';
  const cookieValue = 'true';
  const cookieExpireDays = 30; // Cookie expires in 30 days
  
  // Check if user has already dismissed the notification
  const isDismissed = CookieUtils.get(cookieName);
  
  if (isDismissed === cookieValue) {
    // Hide the notification bar if it was previously dismissed
    notificationBar.style.display = 'none';
    console.log('Notification bar hidden - previously dismissed');
  } else {
    // Show the notification bar (no JS manipulation on page load)
    console.log('Notification bar shown - not previously dismissed');
  }
  
  // Add click event listener to close button
  closeButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Set cookie to remember dismissal
    CookieUtils.set(cookieName, cookieValue, cookieExpireDays);
    
    // Hide notification bar with fade-out animation
    notificationBar.style.transition = 'opacity 0.3s ease-in-out';
    notificationBar.style.opacity = '0';
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      notificationBar.style.display = 'none';
    }, 300);
    
    console.log('Notification bar dismissed and cookie set');
  });
  
  // Add keyboard accessibility for close button
  closeButton.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
  
  // Ensure close button is focusable and has proper ARIA attributes
  closeButton.setAttribute('tabindex', '0');
  closeButton.setAttribute('role', 'button');
  closeButton.setAttribute('aria-label', 'Close notification');
}

// Auto-detect and convert eyebrow text in rich text fields
function initEyebrowText() {
  const richTextElements = document.querySelectorAll('.split-content_rich-text');
  
  richTextElements.forEach(richText => {
    const firstP = richText.querySelector('p:first-child');
    
    if (firstP) {
      const text = firstP.textContent.trim();
      const nextElement = firstP.nextElementSibling;
      
      // Check if this looks like eyebrow text:
      // - Short text (under 50 characters)
      // - Followed by a heading (h1, h2, h3, etc.)
      // - Or if it's all uppercase already
      // - Contains no periods (likely not a sentence)
      const isShort = text.length <= 50;
      const isFollowedByHeading = nextElement && /^H[1-6]$/.test(nextElement.tagName);
      const isAllCaps = text === text.toUpperCase() && text.length > 0;
      const hasNoPeriod = !text.includes('.');
      const isNotEmpty = text.length > 0;
      
      // Enhanced detection: must meet multiple criteria to avoid false positives
      const isEyebrow = isNotEmpty && (
        (isShort && isFollowedByHeading && hasNoPeriod) || 
        (isAllCaps && hasNoPeriod && text.length <= 30)
      );
      
      if (isEyebrow) {
        // Create the new eyebrow structure
        const eyebrowContainer = document.createElement('div');
        eyebrowContainer.setAttribute('data-g-fade-in', '');
        eyebrowContainer.className = 'u-eyebrow-container';
        eyebrowContainer.style.opacity = '1';
        
        const eyebrowDiv = document.createElement('div');
        eyebrowDiv.className = 'u-eyebrow';
        eyebrowDiv.textContent = text;
        
        eyebrowContainer.appendChild(eyebrowDiv);
        
        // Replace the paragraph with the new structure
        firstP.parentNode.replaceChild(eyebrowContainer, firstP);
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initEyebrowText);

gsap.registerPlugin(ScrollTrigger);

function initHeroSliders() {
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
          
          allowTouchMove: false,
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
}
//Position the vertical line
function positionHeroLine() {
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
function initHeroLine() {
// Only set up vertical line positioning if the elements exist
const verticalLine = document.querySelector('.vertical-line');
const heroButtons = document.querySelector('.home-hero_buttons');
const homeHero = document.querySelector('.home-hero');

if (!verticalLine || !heroButtons || !homeHero) return;

// Position on load
positionHeroLine();

// Try multiple times to ensure correct positioning
setTimeout(positionHeroLine, 100);
setTimeout(positionHeroLine, 500);
setTimeout(positionHeroLine, 1000);

// Reposition on window resize
window.addEventListener('resize', positionHeroLine);

// Also position after window fully loads (all resources including images)
window.addEventListener('load', positionHeroLine);
}

// Function to create and position the connecting line between split-CTA graphics
function createConnectingLine() {
    // Get the two graphic elements
    const leftGraphic = document.querySelector('.split-cta_graphic.left');
    const rightGraphic = document.querySelector('.split-cta_graphic.right');
    const splitCtaContainer = document.querySelector('.split-cta');
    
    // Only proceed if all required elements exist
    if (!leftGraphic || !rightGraphic || !splitCtaContainer) {
        // console.warn('Split CTA: Missing required elements for connecting line');
        return false;
    }
    
    // Check if the elements are actually visible and have dimensions
    const leftRect = leftGraphic.getBoundingClientRect();
    const rightRect = rightGraphic.getBoundingClientRect();
    
    if (leftRect.width === 0 || leftRect.height === 0 || rightRect.width === 0 || rightRect.height === 0) {
        // console.warn('Split CTA: Graphics have zero dimensions, aborting line creation');
        return false;
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
    const containerRect = splitCtaContainer.getBoundingClientRect();
    
    // For debugging
    // console.log('Split CTA: Left graphic position', {
    //     top: leftRect.top - containerRect.top,
    //     left: leftRect.left - containerRect.left,
    //     right: leftRect.right - containerRect.left,
    //     bottom: leftRect.bottom - containerRect.top,
    //     height: leftRect.height,
    //     width: leftRect.width
    // });
    
    // console.log('Split CTA: Right graphic position', {
    //     top: rightRect.top - containerRect.top,
    //     left: rightRect.left - containerRect.left,
    //     right: rightRect.right - containerRect.left,
    //     bottom: rightRect.bottom - containerRect.top,
    //     height: rightRect.height,
    //     width: rightRect.width
    // });
    
    // Check if we're on a mobile/tablet screen (991px or less)
    const isMobile = window.innerWidth <= 991;
    // console.log('Split CTA: Mobile layout?', isMobile);
    
    let startX, startY, endX, endY;
    
    if (isMobile) {
        // For mobile: connect bottom middle of left graphic to top middle of right graphic
        startX = leftRect.left + (leftRect.width / 2) - containerRect.left;
        startY = leftRect.bottom - containerRect.top;
        
        endX = rightRect.left + (rightRect.width / 2) - containerRect.left;
        endY = rightRect.top - containerRect.top;
    } else {
        // For desktop: connect vertically centered points of both graphics
        // Calculate the exact vertical centers of both graphics
        const leftCenterY = leftRect.top + (leftRect.height / 2) - containerRect.top;
        const rightCenterY = rightRect.top + (rightRect.height / 2) - containerRect.top;
        
        startX = leftRect.right - containerRect.left;
        startY = leftCenterY; // Vertical center of left graphic
        
        endX = rightRect.left - containerRect.left;
        endY = rightCenterY; // Vertical center of right graphic
        
        // console.log('Split CTA: Using vertical centers -', { leftCenterY, rightCenterY });
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
    
    // console.log('Split CTA: Drawing line from', { x: startX, y: startY }, 'to', { x: endX, y: endY });
    
    // Add the line to the SVG
    svg.appendChild(line);
    
    // Add the SVG to the split-cta container
    splitCtaContainer.appendChild(svg);
    
    // Return true to indicate successful creation
    return true;
}
      
// Renamed function to properly reflect what it does
function initSplitCtaConnectingLine() {
  // Only set up split-CTA connecting line if elements exist
  const splitCtaElements = document.querySelector('.split-cta');
  if (!splitCtaElements) return;
  
  // console.log('Split CTA: Initializing connecting line');
  
  // Initial creation attempt
  createConnectingLine();
  
  // Try a few more times with delays to catch late-loading elements
  setTimeout(createConnectingLine, 500);
  setTimeout(createConnectingLine, 1500);
  setTimeout(createConnectingLine, 3000);
  
  // Also try when window fully loads (all resources including images)
  window.addEventListener('load', () => {
    // console.log('Split CTA: Recreating on window.load');
    createConnectingLine();
    setTimeout(createConnectingLine, 500);
  });
  
  // MutationObserver to detect any changes to the DOM structure
  // This helps with dynamic content that might affect the positioning
  let isUpdatingLine = false; // Flag to prevent recursion
  
  const observer = new MutationObserver((mutations) => {
    // Skip if we're currently updating the line
    if (isUpdatingLine) return;
    
    // Check if the mutations are just from our line
    const isSelfUpdate = mutations.every(mutation => {
      return mutation.target.classList && 
             (mutation.target.classList.contains('split-cta-connecting-line') || 
              mutation.target === document.querySelector('.split-cta-connecting-line'));
    });
    
    if (!isSelfUpdate) {
      // Set flag to prevent recursive updates
      isUpdatingLine = true;
      createConnectingLine();
      // Reset flag after a small delay to ensure DOM updates are complete
      setTimeout(() => {
        isUpdatingLine = false;
      }, 50);
    }
  });
  
  // Start observing the split-cta container for DOM changes
  observer.observe(splitCtaElements, {
    childList: true,
    subtree: true,
    attributes: true
  });
  
  // Update on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    // Debounce to avoid too many calls during resize
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createConnectingLine, 100);
  });
  
  // Update after orientation change on mobile
  window.addEventListener('orientationchange', () => {
    setTimeout(createConnectingLine, 300);
  });
}

function initSubAccordions() {
  // Sub-accordion functionality
  const subAccordionLists = document.querySelectorAll('.sub-accordion_list');
  
  // Only set up sub-accordion functionality if elements exist
  if (subAccordionLists.length > 0) {
    // Handle each accordion list
    subAccordionLists.forEach(list => {
      const subAccordions = list.querySelectorAll('.sub-accordion');
      if (subAccordions.length === 0) return;
      
      // Get the accordion container
      const accordionItem = list.closest('.accordion_item');
      if (!accordionItem) return;
      
      const mainImageContainer = accordionItem.querySelector('.accodion_image-container');
      if (!mainImageContainer) return;
      
      const mainImage = mainImageContainer.querySelector('.g_visual_wrap img.g_visual_img');
      if (!mainImage) return;
      
      // IMMEDIATE ACTION: Set the first image to the main container
      const firstSubAccordion = subAccordions[0];
      const firstImage = firstSubAccordion.querySelector('.sub-accordion_content img.sub-accordion_image');
      if (firstImage) {
        mainImage.src = firstImage.src;
        if (firstImage.srcset) mainImage.srcset = firstImage.srcset;
        if (firstImage.sizes) mainImage.sizes = firstImage.sizes;
        mainImage.alt = firstImage.alt || '';
      }
      
      // Find active accordion or use first one
      let activeAccordion = list.querySelector('.sub-accordion.active');
      if (!activeAccordion) {
        activeAccordion = subAccordions[0];
        activeAccordion.classList.add('active');
      }
      
      // Show its content
      const activeContent = activeAccordion.querySelector('.sub-accordion_content');
      if (activeContent) {
        activeContent.style.display = 'block';
      }
      
      // Add click event listeners to all sub-accordion headers in this list
      const headers = list.querySelectorAll('.sub-accordion_header');
      headers.forEach(header => {
        header.addEventListener('click', function() {
          const parentAccordion = this.closest('.sub-accordion');
          const content = parentAccordion.querySelector('.sub-accordion_content');
          const isActive = parentAccordion.classList.contains('active');
          
          // If this sub-accordion is already active, don't do anything (prevents closing all)
          if (isActive) return;
          
          // Close all sub-accordions in this list
          const allSubAccordions = list.querySelectorAll('.sub-accordion');
          allSubAccordions.forEach(accordion => {
            accordion.classList.remove('active');
            const accordionContent = accordion.querySelector('.sub-accordion_content');
            if (accordionContent) {
              accordionContent.style.display = 'none';
            }
          });
          
          // Open the clicked accordion
          parentAccordion.classList.add('active');
          if (content) {
            content.style.display = 'block';
          }
          
          // Get the sub-accordion image and update the main image
          const subImage = content.querySelector('img.sub-accordion_image');
          if (subImage && mainImage) {
            mainImage.src = subImage.src;
            if (subImage.srcset) mainImage.srcset = subImage.srcset;
            if (subImage.sizes) mainImage.sizes = subImage.sizes;
            mainImage.alt = subImage.alt || '';
          }
        });
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


function initImageCards() {

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
}

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


// Translation utility function
function getTranslation(key) {
  // Get the HTML lang attribute
  const lang = document.documentElement.lang || 'en';
  
  // Translation dictionary
  const translations = {
    back: {
      en: '← Back',
      de: '← Zurück',
      fr: '← Retour',
      es: '← Atrás'
    }
  };
  
  // Return the translation for the current language, fallback to English
  return translations[key]?.[lang] || translations[key]?.en || '';
}

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

// Add keydown event listener to menu button
menuButton.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Simulate a click on the menu button
        this.click();
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
    toggleSubmenu(this.closest('.main-menu_item'));
    });
});

// Add click event to menu link text elements
const menuLinkTexts = document.querySelectorAll('.main-menu_link-text');
menuLinkTexts.forEach(linkText => {
    // Check if this is a regular link or a submenu toggle
    const menuItem = linkText.closest('.main-menu_item');
    const hasSubmenu = menuItem && menuItem.querySelector('.main-menu_submenu');
    
    if (hasSubmenu) {
        // If it has a submenu, make it toggle the submenu
        linkText.addEventListener('click', function(e) {
            // Prevent default only if it's not an actual link
            if (!linkText.hasAttribute('href')) {
                e.preventDefault();
            }
            toggleSubmenu(menuItem);
        });
    }
});

// Function to toggle submenu state
function toggleSubmenu(menuItem) {
    if (!menuItem) return;
    
    // Check if this item is already active
    const isActive = menuItem.classList.contains('active');
    
    // Reset all other active items first
    document.querySelectorAll('.main-menu_item.active').forEach(item => {
        if (item !== menuItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle active state instead of always adding it
    if (isActive) {
        menuItem.classList.remove('active');
        mainMenu.classList.remove('submenu-active');
    } else {
        menuItem.classList.add('active');
        
        // Show the corresponding submenu in the secondary panel
        const submenu = menuItem.querySelector('.main-menu_submenu');
        const secondaryPanel = document.querySelector('.main-menu_secondary');
        
        if (submenu && secondaryPanel) {
            // Clear the secondary panel completely
            secondaryPanel.innerHTML = '';
            
            // Create a header container for the back button and close button
            const headerContainer = document.createElement('div');
            headerContainer.style.display = 'flex';
            headerContainer.style.justifyContent = 'space-between';
            headerContainer.style.alignItems = 'center';
            headerContainer.style.width = 'calc(100% - 9rem)'; // Account for padding on both sides
            headerContainer.style.position = 'absolute';
            headerContainer.style.top = '30px';
            headerContainer.style.left = '4.5rem';
            headerContainer.style.zIndex = '1010';
            
            // Add a back button
            const backButton = document.createElement('div');
            backButton.className = 'main-menu_back';
            backButton.innerHTML = getTranslation('back');
            headerContainer.appendChild(backButton);
            
            // Add a close button
            const closeButton = document.createElement('div');
            closeButton.className = 'main-menu_close main-menu_close-secondary';
            headerContainer.appendChild(closeButton);
            
            // Add the header container to the secondary panel
            secondaryPanel.appendChild(headerContainer);
            
            // Add the submenu content with margin-top
            const submenuContainer = document.createElement('div');
            secondaryPanel.appendChild(submenuContainer);
            
            // Clone the submenu content to the submenu container
            submenuContainer.appendChild(submenu.cloneNode(true));
            const clonedSubmenu = submenuContainer.querySelector('.main-menu_submenu');
            clonedSubmenu.style.display = 'flex'; // Set display to flex
            
            // Handle back button click
            backButton.addEventListener('click', function() {
                // Reset the menu to show only the primary panel
                mainMenu.classList.remove('submenu-active');
                
                // Reset all active states to return arrows to default position
                document.querySelectorAll('.main-menu_item.active').forEach(item => {
                    item.classList.remove('active');
                });
            });
            
            // Handle close button click
            closeButton.addEventListener('click', function() {
                mainMenu.classList.remove('active');
                resetSubmenuState();
                document.body.style.overflow = ''; // Restore scrolling
            });
            
            // Add class to show submenu
            mainMenu.classList.add('submenu-active');
        }
    }
}

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
    
    // Add action links to the primary panel
    const actionLinks = mainMenu.querySelector('.main-menu_action-links');
    if (actionLinks) {
    primaryPanel.appendChild(actionLinks);
    } else {
    // Create action links if they don't exist
    const actionLinksHTML = `
        <div class="main-menu_action-links">
        <div>
            <a href="#" class="main-menu_action-link w-inline-block">
            <div>Secondary Action</div>
            <div class="icon w-embed">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5875 6.4125L4.5 12.5L3.5 11.5L9.5875 5.4125L3.9875 5.4125L4 4H12V12L10.5875 12.0125L10.5875 6.4125Z" fill="#F4F3F1"></path>
                </svg>
            </div>
            </a>
            <div class="main-menu_action-button">
            <div data-wf--button-main--variant="base" class="btn_main_wrap">
                <div class="g_clickable_wrap">
                <a target="" href="#" class="g_clickable_link w-inline-block">
                    <span class="g_clickable_text u-sr-only">Button Text</span>
                </a>
                <button type="button" class="g_clickable_btn">
                    <span class="g_clickable_text u-sr-only">Button Text</span>
                </button>
                </div>
                <div aria-hidden="true" class="btn_main_text">Button Text</div>
            </div>
            </div>
        </div>
        </div>
    `;
    const actionLinksElement = document.createElement('div');
    actionLinksElement.innerHTML = actionLinksHTML;
    primaryPanel.appendChild(actionLinksElement.firstChild);
    }
    
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

// Fix arrow orientation
fixSubmenuArrows();
}

// Function to add keyboard navigation to the menu
function addKeyboardNavigation() {
  const menuButton = document.querySelector('.main-menu_button');
  const mainMenu = document.querySelector('.main-menu');
  const closeButtons = document.querySelectorAll('.main-menu_close');
  
  if (!menuButton || !mainMenu) return;
  
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
      console.log('back button clicked');
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
          
          // Store a reference to the active item before clicking
          const activeItem = document.querySelector('.main-menu_item.active');
          const activeItemIndex = activeItem ? 
            Array.from(document.querySelectorAll('.main-menu_item')).indexOf(activeItem) : 0;
          
          // Click the back button
          this.click();
          
          // Use a longer timeout to ensure DOM updates are complete
          setTimeout(() => {
            // Try multiple focus strategies
            
            // Strategy 1: Focus the previously active item
            const allMenuItems = document.querySelectorAll('.main-menu_item');
            const targetItem = allMenuItems[activeItemIndex] || allMenuItems[0];
            
            if (targetItem) {
              const linkToFocus = targetItem.querySelector('.main-menu_link-text');
              if (linkToFocus) {
                console.log('Focusing on menu item:', targetItem);
                linkToFocus.focus();
                return;
              }
            }
            
            // Strategy 2: Focus the first menu item as fallback
            const primaryPanel = document.querySelector('.main-menu_primary');
            if (primaryPanel) {
              const firstMenuItem = primaryPanel.querySelector('.main-menu_item');
              if (firstMenuItem) {
                const firstLink = firstMenuItem.querySelector('.main-menu_link-text');
                if (firstLink) {
                  console.log('Focusing on first menu item');
                  firstLink.focus();
                  return;
                }
              }
            }
            
            // Strategy 3: Last resort - focus the menu button
            const menuButton = document.querySelector('.main-menu_button');
            if (menuButton) {
              console.log('Focusing on menu button');
              menuButton.focus();
            }
          }, 300); // Increased timeout
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

// Function to detect keyboard navigation vs mouse
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

// Function to fix SVG orientation in submenu toggles
function fixSubmenuArrows() {
  const submenuToggles = document.querySelectorAll('.main-menu_submenu-toggle');
  
  submenuToggles.forEach(toggle => {
    const svg = toggle.querySelector('svg');
    if (svg) {
      // Reset any inline transforms that might be causing issues
      svg.style.transform = '';
      
      // Check if we need to add a specific class to fix orientation
      if (!svg.classList.contains('arrow-fixed')) {
        svg.classList.add('arrow-fixed');
      }
    }
  });
}


// Animation Functions
function fadeUpOnScroll() {
  document.querySelectorAll("[data-g-fade-up]").forEach((element) => {
    gsap.fromTo(
      element,
      {
        y: 100, // Initial position: 100px down
        opacity: 0, // Initial opacity: 0 (invisible)
      },
      {
        y: 0, // Final position: 0px (default position)
        opacity: 1, // Final opacity: 1 (fully visible)
        delay: element.dataset.gDelay ? parseFloat(element.dataset.gDelay) : 0,
        duration: .75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

function fadeSideOnScroll() {
  document.querySelectorAll("[data-g-fade-side]").forEach((element) => {
    // Determine direction from data attribute: "left" or "right"
    const direction = element.dataset.gFadeSide || "left";

    // Set initial X position based on direction
    const startX = direction === "right" ? 100 : -100;

    gsap.fromTo(
      element,
      {
        x: startX, // Initial position: +/- 100px from side
        opacity: 0, // Initial opacity: 0 (invisible)
      },
      {
        x: 0, // Final position: 0px (default position)
        opacity: 1, // Final opacity: 1 (fully visible)
        delay: element.dataset.gDelay ? parseFloat(element.dataset.gDelay) : 0,
        duration: .75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

function growSideOnScroll() {
  document.querySelectorAll("[data-g-grow-side]").forEach((element) => {
    // Determine direction from data attribute: "left" or "right"
    const direction = element.dataset.gFadeSide || "left";

    // Set initial X position based on direction
    const startX = direction === "right" ? 100 : -100;

    gsap.fromTo(
      element,
      {
        x: startX, // Initial position: +/- 100px from side
        scaleX: 0, // Initial opacity: 0 (invisible)
      },
      {
        x: 0, // Final position: 0px (default position)
        scaleX: 1, // Final width: 1 (fully visible)
        delay: element.dataset.gDelay ? parseFloat(element.dataset.gDelay) : 0,
        duration: 1.0,
        ease: "power1.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

function staggerAnimateOnScroll() {
  document.querySelectorAll("[data-g-stagger]").forEach((parent) => {
    const children = parent.children;
    const delay = parent.dataset.gDelay ? parseFloat(parent.dataset.gDelay) : 0;
    const staggerTime = parent.dataset.gStaggerTime
      ? parseFloat(parent.dataset.gStaggerTime)
      : 0.2;
    const direction = parent.dataset.gDirection || "up";

    // Define from and to states
    let fromState = { opacity: 0 };
    let toState = {
      opacity: 1,
      duration: .75,
      ease: "power2.out",
    };

    // Add transform based on direction
    switch (direction) {
      case "up":
        fromState.y = 100;
        toState.y = 0;
        break;
      case "down":
        fromState.y = -100;
        toState.y = 0;
        break;
      case "left":
        fromState.x = -100;
        toState.x = 0;
        break;
      case "right":
        fromState.x = 100;
        toState.x = 0;
        break;
    }

    gsap.fromTo(children, fromState, {
      ...toState,
      stagger: staggerTime,
      delay: delay,
      scrollTrigger: {
        trigger: parent,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });
}

function fadeInOnScroll() {
  document.querySelectorAll("[data-g-fade-in]").forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        delay: element.dataset.gDelay ? parseFloat(element.dataset.gDelay) : 0,
        duration: .75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

function countUpOnScroll() {
  const countUpElements = document.querySelectorAll(".js-count-up");
  
  countUpElements.forEach((element) => {
    // Get the text content and check if it's a number
    const content = element.textContent.trim();
    const targetNumber = parseFloat(content);
    
    // Only proceed if the content is a valid number
    if (!isNaN(targetNumber)) {
      // Determine decimal places from the target number
      const decimalPlaces = (content.split(".")[1] || "").length;
      
      // Create a proxy object to animate
      const counter = { value: 0 };
      
      // Create the animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          once: true
        }
      });
      
      tl.to(counter, {
        value: targetNumber,
        duration: 2,
        ease: "power1.out",
        onUpdate: function() {
          element.textContent = counter.value.toFixed(decimalPlaces);
        },
        onComplete: function() {
          // Make sure the final value is exactly the original text
          // to avoid any rounding issues
          element.textContent = content;
        }
      });
    }
    // If it's not a number, we do nothing and leave the content as is
  });
}

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

      document.querySelectorAll('a.js-scroll-center').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
      
          const targetId = this.getAttribute('data-target');
          const targetEl = document.querySelector(targetId);
          if (!targetEl) return;
      
          const rect = targetEl.getBoundingClientRect();
          const scrollY = window.scrollY || window.pageYOffset;
          const offset = rect.top + scrollY;
          const centeredOffset = offset - (window.innerHeight / 2) + (targetEl.offsetHeight / 2);
      
          lenis.scrollTo(centeredOffset, {
            duration: 1.5,
            // easing: t => 1 - Math.pow(1 - t, 3),
          });
        });
      });
    } else {
      console.error('Lenis not available for inline initialization');
    }
  }, 500);
});

// Function to initialize hero sliders
function initHeroSliders() {
  const sliderContainers = document.querySelectorAll('.home-hero_slider');
  if (sliderContainers.length === 0) return;
  
  sliderContainers.forEach(function(container) {
    const swiperElement = container.querySelector('.swiper');
    if (swiperElement) {
      const swiper = new Swiper(swiperElement, {
        // Enable fade effect
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        
        allowTouchMove: false,
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

// Function to add active class to scroll items when they enter viewport
function initSubScrollItemActiveClass() {
  const scrollItems = document.querySelectorAll('.sub-scroll_item_content-container');
  
  if (scrollItems.length === 0) return;
  
  scrollItems.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 70%", // Trigger when the top of the element is 30% into the viewport
      end: "bottom 20%", // End when the bottom of the element is 20% from the top of the viewport
      toggleClass: {
        targets: item,
        className: "active"
      },
      // For debugging:
      // markers: true,
      onEnter: () => {
        // console.log('ScrollItem entered view:', item);
        updateMainImage(item);
      },
      onEnterBack: () => {
        // console.log('ScrollItem entered view backwards:', item);
        updateMainImage(item);
      }
    });
  });
  
  // Function to update the main accordion image
  function updateMainImage(activeItem) {
    // Find the parent scroll-item
    const scrollItem = activeItem.closest('.scroll-item');
    if (!scrollItem) return;
    
    // Get the image from the active sub-scroll item
    const subScrollItemImage = activeItem.querySelector('.sub-scroll_item_image');
    if (!subScrollItemImage) return;
    
    // Get the main image container
    const mainImageContainer = scrollItem.querySelector('.accodion_image-container');
    if (!mainImageContainer) return;
    
    // Get the main image element
    const mainImage = mainImageContainer.querySelector('.g_visual_img');
    if (!mainImage) return;
    
    // If it's the same image, don't do anything
    if (mainImage.src === subScrollItemImage.src) return;
    
    // Check if we already have a temp image (in case of rapid scrolling)
    const existingTempImage = mainImageContainer.querySelector('.temp-crossfade-image');
    if (existingTempImage) {
      existingTempImage.remove();
    }
    
    // Create a temporary image element for the crossfade
    const tempImage = document.createElement('img');
    tempImage.classList.add('g_visual_img', 'u-cover-absolute', 'temp-crossfade-image');
    tempImage.style.opacity = '0';
    tempImage.style.position = 'absolute';
    tempImage.style.top = '0';
    tempImage.style.left = '0';
    tempImage.style.width = '100%';
    tempImage.style.height = '100%';
    tempImage.style.objectFit = 'cover';
    tempImage.style.zIndex = '2'; // Place above the current image
    
    // Set the new image source
    tempImage.src = subScrollItemImage.src;
    if (subScrollItemImage.srcset) tempImage.srcset = subScrollItemImage.srcset;
    if (subScrollItemImage.sizes) tempImage.sizes = subScrollItemImage.sizes;
    
    // Add the temporary image to the container
    mainImageContainer.appendChild(tempImage);
    
    // Load event handling - when the new image is fully loaded
    tempImage.onload = function() {
      // Ensure smooth transition
      tempImage.style.transition = 'opacity 0.4s ease';
      
      // Fade in the new image
      requestAnimationFrame(() => {
        tempImage.style.opacity = '1';
      });
      
      // Silently update the main image source while the temporary image is showing
      // This ensures it's fully loaded when we remove the temporary image
      mainImage.onload = function() {
        // This will trigger when the main image finishes loading the new src
        // We're now ready to remove the temp image (after fade transition completes)
        setTimeout(() => {
          // Fade out temp image very slowly to avoid any possible flicker
          tempImage.style.transition = 'opacity 0.3s ease';
          tempImage.style.opacity = '0';
          
          // Remove the temp image after it's fully faded out
          setTimeout(() => {
            tempImage.remove();
          }, 400);
        }, 200); // Small delay to ensure everything is stable
      };
      
      // Update main image source silently in the background
      mainImage.src = subScrollItemImage.src;
      if (subScrollItemImage.srcset) mainImage.srcset = subScrollItemImage.srcset;
      if (subScrollItemImage.sizes) mainImage.sizes = subScrollItemImage.sizes;
      
      // In case the onload doesn't fire (image already cached)
      setTimeout(() => {
        if (tempImage.parentNode) {
          tempImage.style.transition = 'opacity 0.3s ease';
          tempImage.style.opacity = '0';
          
          setTimeout(() => {
            if (tempImage.parentNode) {
              tempImage.remove();
            }
          }, 400);
        }
      }, 1000); // Safety fallback
      
      // console.log('Crossfade transition in progress for:', subScrollItemImage.src);
    };
    
    // Handle error case - if image fails to load
    tempImage.onerror = function() {
      console.error('Failed to load image:', subScrollItemImage.src);
      tempImage.remove();
      
      // Update main image directly as fallback
      mainImage.src = subScrollItemImage.src;
      if (subScrollItemImage.srcset) mainImage.srcset = subScrollItemImage.srcset;
      if (subScrollItemImage.sizes) mainImage.sizes = subScrollItemImage.sizes;
    };
  }
}

// Function to initialize team sliders
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

function initMapFilters() {
  const mapContainers = document.querySelectorAll('.map');

  mapContainers.forEach(mapContainer => {
    const mapBase = mapContainer.querySelector('.map_base');
    const mapLayersContainer = mapContainer.querySelector('.map-layers');
    const mapFiltersContainer = mapContainer.querySelector('.map-filters');
    const clearFilterButton = mapContainer.querySelector('.map-filter_clear');

    if (!mapBase || !mapLayersContainer || !mapFiltersContainer) {
      console.warn('Required map elements not found in map container.');
      return;
    }

    const mapLayers = Array.from(mapLayersContainer.querySelectorAll('.map-layer'));
    const mapFilterItems = Array.from(mapFiltersContainer.querySelectorAll('.map-filter_item'));

    // Initially show all layers by default
    mapLayers.forEach(layer => {
      layer.style.opacity = '1';
      layer.classList.add('active-filter');
    });

    // No active class on filter items initially
    mapFilterItems.forEach(filterItem => {
      filterItem.classList.remove('active-filter');
    });

    // Initially hide the clear filter button
    if (clearFilterButton) {
      clearFilterButton.style.display = 'none';
    }

    // Function to reset all filters
    function resetFilters() {
      // Remove active class from all filter items
      mapFilterItems.forEach(item => {
        item.classList.remove('active-filter');
      });

      // Show all layers
      mapLayers.forEach(layer => {
        layer.classList.add('active-filter');
        layer.style.opacity = '1';
      });

      // Hide the clear filter button
      if (clearFilterButton) {
        clearFilterButton.style.display = 'none';
      }
    }

    // Add click event to clear filter button
    if (clearFilterButton) {
      clearFilterButton.addEventListener('click', resetFilters);
    }

    mapFilterItems.forEach(filterItem => {
      filterItem.addEventListener('click', function() {
        const filterValue = this.dataset.mapFilter;
        const wasActive = this.classList.contains('active-filter');
        
        // First, remove active class from all filter items
        mapFilterItems.forEach(item => {
          item.classList.remove('active-filter');
        });
        
        // If this filter wasn't already active, make it active
        // If it was already active, we're effectively deselecting it
        if (!wasActive) {
          this.classList.add('active-filter');
          
          // Show the clear filter button
          if (clearFilterButton) {
            clearFilterButton.style.display = 'block';
          }
          
          // Update layer visibility based on the selected filter
          if (filterValue === 'all') {
            // Show all layers
            mapLayers.forEach(layer => {
              layer.classList.add('active-filter');
              layer.style.opacity = '1';
            });
          } else {
            // Show only the layer matching the filter value
            mapLayers.forEach(layer => {
              const layerType = layer.dataset.mapLayer;
              
              if (layerType === filterValue) {
                layer.classList.add('active-filter');
                layer.style.opacity = '1';
              } else {
                layer.classList.remove('active-filter');
                layer.style.opacity = '0';
              }
            });
          }
        } else {
          // If this filter was already active and got clicked again,
          // we're deselecting it, so reset to show all layers
          resetFilters();
        }
      });
    });
  });
}

// Function to truncate text and update the "Read More" link
function truncateText() {
  const containers = document.querySelectorAll('.js-read-more');
  // console.log('Found .js-read-more containers:', containers.length);

  containers.forEach(container => {
    // console.log('Processing container:', container);

    // The container *is* the richtext element
    const richtextElement = container;
    // console.log('richtextElement:', richtextElement);

    // Find the read-more-link within the same parent div
    const readMoreLink = container.nextElementSibling;
    // console.log('readMoreLink:', readMoreLink);

    if (!richtextElement) {
      console.warn('richtextElement not found (should not happen):', container);
      return;
    }

    if (!readMoreLink) {
      console.warn('readMoreLink not found as next sibling:', container);
      return;
    }

    // Get all text from inside the w-richtext
    let originalText = '';
    for (const node of richtextElement.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        originalText += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        originalText += node.textContent;
      }
    }
    originalText = originalText.trim();

    // console.log('originalText:', originalText);

    const truncatedText = originalText.length > 80 ? originalText.substring(0, 80) + '...' : originalText;
    // console.log('truncatedText:', truncatedText);

    richtextElement.textContent = truncatedText;
    readMoreLink.textContent = 'Read More';
    // console.log('Text truncated and link updated for container:', container);
  });
  // console.log('truncateText function complete');
}

// console.log('truncateText');

function initReadMore() {
  const containers = document.querySelectorAll('.js-read-more');

  containers.forEach(container => {
    const shortBio = container.querySelector('.js-read-more-short-bio');
    const bio = container.querySelector('.js-read-more-bio');
    const link = container.querySelector('.js-read-more-link');

    if (!shortBio || !bio || !link) {
      console.warn('Missing required elements in .js-read-more container:', container);
      return;
    }

    // Initially hide the full bio
    bio.style.display = 'none';

    link.addEventListener('click', function(e) {
      e.preventDefault();

      const isExpanded = bio.style.display === 'block';

      if (isExpanded) {
        // Collapse
        shortBio.style.display = 'block';
        bio.style.display = 'none';
        link.textContent = 'Read More';
      } else {
        // Expand
        shortBio.style.display = 'none';
        bio.style.display = 'block';
        link.textContent = 'Read Less';
      }
    });
  });
}

console.log('initReadMore');

function initSkipToMain() {
  const skipToMainLink = document.querySelector('.skip-to-main');
  const mainElement = document.querySelector('#main');
  
  if (!skipToMainLink || !mainElement) return;
  
  // Find the first section inside #main
  const firstSection = mainElement.querySelector('section');
  
  if (!firstSection) {
    console.warn('No section found inside #main for skip-to-main functionality');
    return;
  }
  
  // Add ID to the first section
  firstSection.id = 'main-section';
  
  // Update the skip link href to point to the section ID
  skipToMainLink.setAttribute('href', '#main-section');
  
  // When the section receives focus (after clicking the skip link)
  firstSection.addEventListener('focus', function() {
    // Add a small visual indicator that focus has moved
    const originalOutline = this.style.outline;
    this.style.outline = '2px solid #000';
    
    // Remove the outline after a short delay
    setTimeout(() => {
      this.style.outline = originalOutline;
    }, 1500);
  });
  
  // Make sure the section is focusable
  firstSection.setAttribute('tabindex', '-1');
}

function initStickyHeader() {
  const header = document.querySelector('.header');
  
  // If header doesn't exist, exit early
  if (!header) return;
  
  // Variables to track scrolling
  let lastScrollTop = 0;
  let scrollDelta = 5; // Minimum amount of pixels scrolled before triggering show/hide
  let headerHeight = header.offsetHeight;
  
  // Add classes to set up the header for animation
  header.classList.add('header-sticky');
  header.classList.add('header-visible');
  
  // Create scroll handler function
  function handleScroll() {
    // Get current scroll position
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Reset to initial state when near the top (within 10px threshold)
    if (currentScrollTop <= 10) {
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
      header.classList.remove('sticky-active');
      lastScrollTop = currentScrollTop;
      return;
    }
    
    // Check if we've scrolled more than the threshold
    if (Math.abs(lastScrollTop - currentScrollTop) <= scrollDelta) {
      return;
    }
    
    // Scrolling down
    if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight) {
      // Hide header when scrolling down past header height (no sticky-active class)
      header.classList.remove('header-visible');
      header.classList.add('header-hidden');
    } 
    // Scrolling up
    else if (currentScrollTop < lastScrollTop) {
      // Add sticky-active class and show header when scrolling up
      header.classList.add('sticky-active');
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
    }
    
    // Update last scroll position
    lastScrollTop = currentScrollTop;
  }
  
  // Debounce the scroll event to improve performance
  let isScrolling;
  window.addEventListener('scroll', function() {
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);
    
    // Process the scroll event
    handleScroll();
    
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function() {
      // Update header height in case it changed (e.g., mobile menu toggle)
      headerHeight = header.offsetHeight;
    }, 66);
  }, { passive: true });
  
  // Apply header height as padding to the body to prevent content jump
  // document.body.style.paddingTop = headerHeight + 'px';
  
  // // Update padding on window resize
  // window.addEventListener('resize', function() {
  //   headerHeight = header.offsetHeight;
  //   document.body.style.paddingTop = headerHeight + 'px';
  // });
}

function initScrollLockSection() {
  const sections = document.querySelectorAll(".scroll-lock_scroll_item_wrap");
  if (!sections) return;
  const bgEl = document.querySelector(".scroll-lock-section_wrap");

  // Optional: link highlighting
  const navLinks = document.querySelectorAll(".scroll-lock_sticky_list_item a");

  sections.forEach((section, index) => {
    const bgColor = section.dataset.bg || "#003A5D"; // fallback

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => updateUI(index, bgColor),
      onEnterBack: () => updateUI(index, bgColor),
    });
  });

  function updateUI(activeIndex, color) {
    // Update background via CSS variable or pseudo element
    bgEl.style.setProperty("--scroll-bg", color);
    bgEl.classList.add("is-bg-transitioning"); // optional for extra transitions

    // Highlight active link
    navLinks.forEach((link, i) => {
      link.classList.toggle("is-active", i === activeIndex);
    });
  }
}

function initSolutionsScrollActive() {
  const solutionsScrollSection = document.querySelector('.section_solutions-scroll');
  if (!solutionsScrollSection) return;

  const contentContainers = solutionsScrollSection.querySelectorAll('.solutions_scroll-content-container');
  const scrollLinks = solutionsScrollSection.querySelectorAll('.solutions_scroll-link_anchor');

  if (contentContainers.length === 0 || scrollLinks.length === 0) return;

  // Set the first link as active on page load
  scrollLinks.forEach((link, index) => {
    if (index === 0) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });

  // Create ScrollTrigger for each content container
  contentContainers.forEach((container, index) => {
    ScrollTrigger.create({
      trigger: container,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => updateActiveLink(index),
      onEnterBack: () => updateActiveLink(index),
    });
  });

  function updateActiveLink(activeIndex) {
    // Remove active class from all links
    scrollLinks.forEach(link => {
      link.classList.remove('is-active');
    });

    // Add active class to the corresponding link
    if (scrollLinks[activeIndex]) {
      scrollLinks[activeIndex].classList.add('is-active');
    }
  }
}

// Function to initialize project sliders
function initProjectSliders() {
  const projectSliders = document.querySelectorAll('.project_swiper');
  
  if (projectSliders.length === 0) return;
  
  projectSliders.forEach(function(swiperElement) {
    // Find navigation elements within the same container
    const container = swiperElement.closest('.project-slider') || swiperElement.parentElement;
    const prevButton = container.querySelector('.project-slider_arrow.prev') || container.querySelector('.swiper-button-prev');
    const nextButton = container.querySelector('.project-slider_arrow.next') || container.querySelector('.swiper-button-next');
    const pagination = container.querySelector('.project-slider_pagination') || container.querySelector('.swiper-pagination');
    
    const swiper = new Swiper(swiperElement, {
      
      // Show only one slide at a time
      slidesPerView: 1,
      
      // Add space between slides
      spaceBetween: 32,
      
      // Slide direction: right to left
      direction: 'horizontal',
      
      // Disable loop
      loop: false,
      
      // Enable navigation arrows
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      
      // Enable pagination dots
      pagination: {
        el: pagination,
        clickable: true,
        type: 'bullets',
      },
      
      // Enable keyboard navigation
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      
      // Enable mouse wheel navigation
      mousewheel: {
        invert: false,
      },
      
      // Smooth transitions
      speed: 600,
      effect: 'slide',
      
      // Enable touch/swipe controls
      allowTouchMove: true,
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true,
      
      // Auto height
      autoHeight: false,
      
      // Responsive breakpoints
      breakpoints: {
        768: {
          slidesPerView: 1,
        },
        991: {
          slidesPerView: 1.095,
        },
        1900: {
          slidesPerView: 1,
        }
      },
      
      // Event handlers
      on: {
        init: function() {
          console.log('Project slider initialized');
          
          // Update arrow states on initialization
          updateProjectArrowStates(this, prevButton, nextButton);
        },
        slideChange: function() {
          // Update arrow states when slides change
          updateProjectArrowStates(this, prevButton, nextButton);
        }
      }
    });
    
    // Function to update arrow states
    function updateProjectArrowStates(swiperInstance, prevBtn, nextBtn) {
      if (!prevBtn || !nextBtn) return;
      
      // Check if we're at the beginning or end of the slider
      if (swiperInstance.isBeginning) {
        prevBtn.classList.add('disabled');
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.classList.remove('disabled');
        prevBtn.setAttribute('aria-disabled', 'false');
      }
      
      if (swiperInstance.isEnd) {
        nextBtn.classList.add('disabled');
        nextBtn.setAttribute('aria-disabled', 'true');
      } else {
        nextBtn.classList.remove('disabled');
        nextBtn.setAttribute('aria-disabled', 'false');
      }
    }
  });
}

// Function to initialize news sliders (3 images, move 1 per click)
function initNewsSliders() {
  const newsSliders = document.querySelectorAll('.news_swiper');
  
  if (newsSliders.length === 0) return;
  
  newsSliders.forEach(function(swiperElement) {
    // Find navigation elements within the same container
    const container = swiperElement.closest('.news-slider') || swiperElement.parentElement;
    const prevButton = container.querySelector('.news-slider_arrow.prev') || container.querySelector('.swiper-button-prev');
    const nextButton = container.querySelector('.news-slider_arrow.next') || container.querySelector('.swiper-button-next');
    const pagination = container.querySelector('.news-slider_pagination') || container.querySelector('.swiper-pagination');
    
    const swiper = new Swiper(swiperElement, {
      // Show three slides at a time
      slidesPerView: 3,
      // Move one slide per navigation click
      slidesPerGroup: 1,
      
      // Add space between slides
      spaceBetween: 20,
      
      // Slide direction
      direction: 'horizontal',
      
      // Disable loop
      loop: false,
      
      // Enable navigation arrows
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      
      // Optional pagination dots
      pagination: {
        el: pagination,
        clickable: true,
        type: 'bullets',
      },
      
      // Enable keyboard navigation
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      
      // Enable mouse wheel navigation
      mousewheel: {
        invert: false,
      },
      
      // Smooth transitions
      speed: 600,
      effect: 'slide',
      
      // Enable touch/swipe controls
      allowTouchMove: true,
      grabCursor: true,
      
      // Auto height
      autoHeight: false,
      
      // Responsive breakpoints
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 15
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      },
      
      // Event handlers
      on: {
        init: function() {
          // Update arrow states on initialization
          updateNewsArrowStates(this, prevButton, nextButton);
        },
        slideChange: function() {
          // Update arrow states when slides change
          updateNewsArrowStates(this, prevButton, nextButton);
        }
      }
    });
    
    // Function to update arrow states
    function updateNewsArrowStates(swiperInstance, prevBtn, nextBtn) {
      if (!prevBtn || !nextBtn) return;
      
      // Check if we're at the beginning or end of the slider
      if (swiperInstance.isBeginning) {
        prevBtn.classList.add('disabled');
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.classList.remove('disabled');
        prevBtn.setAttribute('aria-disabled', 'false');
      }
      
      if (swiperInstance.isEnd) {
        nextBtn.classList.add('disabled');
        nextBtn.setAttribute('aria-disabled', 'true');
      } else {
        nextBtn.classList.remove('disabled');
        nextBtn.setAttribute('aria-disabled', 'false');
      }
    }
  });
}

// Initialize all functions when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  
  // Initialize notification bar with cookie functionality
  initNotificationBar();
  
  // Initialize sliders
  initHeroSliders();
  initTeamSliders();
  initProjectSliders(); // Added this line
  initNewsSliders();

  // Initialize UI components
  initHeroLine();
  initSplitCtaConnectingLine();
  initSubAccordions();
  initSubScrollItemActiveClass();
  initScrollLockSection();
  initSolutionsScrollActive();
  
  imageSrcSetFix();
  initImageCards();
  initTabContainers();
  initializeMenu();
  initReadMore();
  initSkipToMain();
  
  // Initialize keyboard navigation detection
  detectKeyboardNavigation();
  
  // Initialize animations
  fadeUpOnScroll();
  fadeSideOnScroll();
  growSideOnScroll();
  staggerAnimateOnScroll();
  fadeInOnScroll();
  countUpOnScroll();

  // Initialize map filters
  initMapFilters();
  initStickyHeader();

  initDropdownAccordions();
});

function initDropdownAccordions() {
  const dropdownLists = document.querySelectorAll('.dropdown-list');
  if (dropdownLists.length === 0) return;

  let uniqueIdCounter = 0;

  dropdownLists.forEach(list => {
    if (list.dataset.accordionInitialized === 'true') return;
    list.dataset.accordionInitialized = 'true';

    const items = Array.from(list.querySelectorAll('.dropdown'));
    items.forEach(item => {
      const toggle = item.querySelector('.dropdown-toggle');
      const content = item.querySelector('.dropdown_content');
      const arrow = item.querySelector('.dropdown-arrow');
      if (!toggle || !content) return;

      // Ensure a unique ID relationship for a11y
      if (!content.id) {
        content.id = `dropdown-content-${Date.now()}-${uniqueIdCounter++}`;
      }
      toggle.setAttribute('aria-controls', content.id);
      toggle.setAttribute('aria-expanded', 'false');
      content.setAttribute('role', 'region');
      content.setAttribute('aria-hidden', 'true');

      // Initial state: closed
      content.style.overflow = 'hidden';
      content.style.height = '0px';
      content.style.opacity = '0';
      content.style.transition = 'height 300ms ease, opacity 300ms ease';
      if (arrow) {
        arrow.style.transition = 'transform 300ms ease';
      }

      const openItem = (target) => {
        const targetContent = target.querySelector('.dropdown_content');
        const targetArrow = target.querySelector('.dropdown-arrow');
        const targetToggle = target.querySelector('.dropdown-toggle');
        if (!targetContent || !targetToggle) return;
        target.classList.add('open');
        targetToggle.setAttribute('aria-expanded', 'true');
        targetContent.setAttribute('aria-hidden', 'false');

        // Animate height from current to scrollHeight
        const startHeight = targetContent.getBoundingClientRect().height;
        targetContent.style.height = `${startHeight}px`;
        // Force reflow
        // eslint-disable-next-line no-unused-expressions
        targetContent.offsetHeight;
        const endHeight = targetContent.scrollHeight;
        targetContent.style.opacity = '1';
        targetContent.style.height = `${endHeight}px`;
        // Do NOT switch to auto at end to avoid jump

        if (targetArrow) targetArrow.style.transform = 'rotate(180deg)';
      };

      const closeItem = (target) => {
        const targetContent = target.querySelector('.dropdown_content');
        const targetArrow = target.querySelector('.dropdown-arrow');
        const targetToggle = target.querySelector('.dropdown-toggle');
        if (!targetContent || !targetToggle) return;
        target.classList.remove('open');
        targetToggle.setAttribute('aria-expanded', 'false');
        targetContent.setAttribute('aria-hidden', 'true');

        // Start from current pixel height
        const startHeight = targetContent.scrollHeight;
        targetContent.style.height = `${startHeight}px`;
        // Force reflow
        // eslint-disable-next-line no-unused-expressions
        targetContent.offsetHeight;
        // Animate to 0
        targetContent.style.height = '0px';
        targetContent.style.opacity = '0';
        if (targetArrow) targetArrow.style.transform = '';
      };

      toggle.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close others in this list
        items.forEach(other => {
          if (other !== item && other.classList.contains('open')) {
            closeItem(other);
          }
        });
        // Toggle current
        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });
    });

    // Resize handling: keep open items matched to content height
    const recalcOpenHeights = () => {
      items.forEach(item => {
        if (item.classList.contains('open')) {
          const content = item.querySelector('.dropdown_content');
          if (!content) return;
          const newHeight = content.scrollHeight;
          content.style.height = `${newHeight}px`;
        }
      });
    };

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(recalcOpenHeights, 100);
    };
    window.addEventListener('resize', onResize);
  });
}

document.addEventListener('DOMContentLoaded', initDropdownAccordions);

// Custom map style (your gray theme)
const customMapStyle = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ced4d5" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f5f5f5" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [  
      { "visibility": "off" },
      { "color": "#ffffff" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "visibility": "off" },
      { "color": "#ffffff" },
      { "lightness": 29 },
      { "weight": 0.2 }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" },
      { "color": "#ffffff" },
      { "lightness": 18 }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" },
      { "color": "#ffffff" },
      { "lightness": 16 }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" },
      { "color": "#f5f5f5" },
      { "lightness": 21 }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" },
      { "color": "#dedede" },
      { "lightness": 21 }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "off" },
      { "color": "#ffffff" },
      { "lightness": 16 }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "visibility": "on" },
      { "saturation": 36 },
      { "color": "#282c2f" },
      { "lightness": 40 }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" },
      { "color": "#f2f2f2" },
      { "lightness": 19 }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#fefefe" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#ced4d5" },
      { "lightness": 17 },
      { "weight": 1.2 }
    ]
  }
];

// Global variables
let map;
let markerCategories = {};
let categoryColors = {};
const INACTIVE_MARKER_COLOR = '#8fa3a0';

// Utilities for dynamic categories
function getCategorySlug(input) {
  if (!input) return '';
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getPastelColorForSlug(slug) {
  // Deterministic pastel color from slug
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0; // Convert to 32bit int
  }
  const hue = Math.abs(hash) % 360; // 0-359
  const saturation = 55; // softer
  const lightness = 65; // pastel
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function createCustomMarkerIcon(color) {
  const svg = `
    <svg width="37" height="45" viewBox="0 0 37 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_1_12)">
        <path d="M24.8216 12.0686C23.104 9.56263 20.1755 8 16.8513 8C13.5271 8 10.5985 9.56263 8.88096 12.0686C7.86296 13.555 7.26953 15.3653 7.26953 17.3758C7.26953 18.8003 7.62656 20.7202 9.4744 23.5596L15.9346 33.7835C16.1614 34.0884 16.5039 34.2408 16.8513 34.2408C17.1987 34.2408 17.5412 34.0884 17.768 33.7835L24.2282 23.5596C26.076 20.7202 26.433 18.8003 26.433 17.3758C26.433 15.3653 25.8396 13.555 24.8216 12.0686Z" fill="${color}"/>
        <path d="M16.8635 23.318C13.5152 23.318 10.8086 20.6739 10.8086 17.4009C10.8086 14.128 13.5152 11.4839 16.8635 11.4839C20.2118 11.4839 22.9185 14.128 22.9185 17.4009C22.9185 20.6739 20.2118 23.318 16.8635 23.318Z" fill="white" fill-opacity="0.2"/>
      </g>
      <defs>
        <filter id="filter0_d_1_12" x="-0.23" y="0.77" width="36.8931" height="43.7008" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="1.5" dy="1.5"/>
          <feGaussianBlur stdDeviation="4.365"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_12"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_12" result="shape"/>
        </filter>
      </defs>
    </svg>
  `;
  
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(37, 45),
    anchor: new google.maps.Point(18.5, 45)
  };
}

function ensureCategory(slug) {
  if (!slug) return;
  if (!markerCategories[slug]) markerCategories[slug] = [];
  if (!categoryColors[slug]) categoryColors[slug] = getPastelColorForSlug(slug);
}

function collectCategoriesFromControls() {
  const controlsRoot = document.querySelector('.map-controls');
  if (!controlsRoot) return;
  const inputs = controlsRoot.querySelectorAll('input[type="checkbox"][id]');
  inputs.forEach(input => {
    const slug = getCategorySlug(input.id);
    ensureCategory(slug);
    
    // Get color from the marker-color element
    const categoryToggle = input.closest('.category-toggle');
    if (categoryToggle) {
      const markerColorEl = categoryToggle.querySelector('.marker-color');
      if (markerColorEl) {
        const computedStyle = window.getComputedStyle(markerColorEl);
        const color = computedStyle.color;
        if (color && color !== 'rgb(0, 0, 0)') {
          categoryColors[slug] = color;
        }
      }
    }
  });
}

// Initialize the map with custom styling
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 50.0, lng: -30.0 }, // Center between North America and Europe
    zoom: 3,
    styles: customMapStyle,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });

  // Initialize categories from controls before loading locations
  collectCategoriesFromControls();

  // Load locations from Webflow CMS
  loadLocations();

  // Set up category toggles
  setupCategoryToggles();
}

// Load locations from Webflow CMS data on the page
function loadLocations() {
  // Get all location data divs (from your Webflow Collection List)
  const locationElements = document.querySelectorAll('.location-data');

  if (locationElements.length === 0) {
    console.warn('No location data found. Make sure your Webflow Collection List has the class "location-data" on each item.');
    return;
  }

  locationElements.forEach(element => {
    const location = {
      name: element.querySelector('.location-name')?.textContent?.trim() || '',
      address: element.querySelector('.location-address')?.textContent?.trim() || '',
      category: element.querySelector('.location-category')?.textContent?.trim() || '',
      description: element.querySelector('.location-description')?.textContent?.trim() || '',
      phone: element.querySelector('.location-phone')?.textContent?.trim() || '',
      website: element.querySelector('.location-website')?.textContent?.trim() || ''
    };

    // Only create marker if we have required data
    if (location.name && location.address && location.category) {
      // Ensure category exists based on slug
      ensureCategory(getCategorySlug(location.category));
      geocodeAndCreateMarker(location);
    } else {
      console.warn('Incomplete location data:', location);
    }
  });
}

// Geocode address and create marker
function geocodeAndCreateMarker(location) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: location.address }, (results, status) => {
    if (status === 'OK') {
      const categorySlug = getCategorySlug(location.category);
      ensureCategory(categorySlug);
      const marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
        title: location.name,
        icon: createCustomMarkerIcon(categoryColors[categorySlug])
      });

      // Precompute icons for active/inactive states
      marker.__activeIcon = createCustomMarkerIcon(categoryColors[categorySlug]);
      marker.__inactiveIcon = createCustomMarkerIcon(INACTIVE_MARKER_COLOR);

      // Apply initial visibility and icon based on current checkbox state if available
      const checkbox = document.getElementById(categorySlug);
      if (checkbox) {
        const isActive = !!checkbox.checked;
        marker.setMap(isActive ? map : null);
        marker.setIcon(isActive ? marker.__activeIcon : marker.__inactiveIcon);
      }

      // Create info window with CMS data
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(location)
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Store marker in category array
      markerCategories[categorySlug].push(marker);

    } else {
      console.error('Geocoding failed for "' + location.address + '": ' + status);
    }
  });
}

// Create rich info window content
function createInfoWindowContent(location) {
  const categorySlug = getCategorySlug(location.category);
  return `
    <div style="font-family: Arial, sans-serif; padding: 12px; max-width: 250px;">
      <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">${location.name}</h3>
      
      <p style="margin: 4px 0; color: #666; font-size: 14px;">
        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${categoryColors[categorySlug]}; margin-right: 6px;"></span>
        ${location.category.charAt(0).toUpperCase() + location.category.slice(1)}
      </p>
      
      <p style="margin: 4px 0; color: #666; font-size: 14px;">📍 ${location.address}</p>
      
      ${location.description ? `<p style="margin: 8px 0; color: #555; font-size: 14px;">${location.description}</p>` : ''}
      
      ${location.phone ? `<p style="margin: 4px 0; color: #666; font-size: 14px;">📞 <a href="tel:${location.phone}" style="color: #45B7D1; text-decoration: none;">${location.phone}</a></p>` : ''}
      
      ${location.website ? `<p style="margin: 8px 0 4px 0;"><a href="${location.website}" target="_blank" style="color: #45B7D1; text-decoration: none; font-size: 14px;">Visit Website →</a></p>` : ''}
    </div>
  `;
}

// Setup category toggle functionality
function setupCategoryToggles() {
  const controlsRoot = document.querySelector('.map-controls');
  if (!controlsRoot) return;
  const inputs = controlsRoot.querySelectorAll('input[type="checkbox"][id]');
  inputs.forEach(input => {
    const slug = getCategorySlug(input.id);
    ensureCategory(slug);
    // Set initial visual state
    const toggleRoot = input.closest('.category-toggle');
    if (toggleRoot) toggleRoot.classList.toggle('inactive', !input.checked);

    input.addEventListener('change', () => {
      toggleCategory(slug, input.checked);
      // Update visual state
      if (toggleRoot) toggleRoot.classList.toggle('inactive', !input.checked);
      // Optionally refit map after toggling
      fitMapToMarkers();
      // Re-apply current search filter so results reflect both search and category
      const searchInput = document.getElementById('location-search');
      const term = searchInput ? searchInput.value.toLowerCase() : '';
      filterMarkers(term);
    });
  });
}

// Toggle category visibility
function toggleCategory(category, isActive) {
  const list = markerCategories[category] || [];
  list.forEach(marker => {
    // Show/hide markers by category and update icon color
    marker.setMap(isActive ? map : null);
    marker.setIcon(isActive ? (marker.__activeIcon || marker.getIcon()) : (marker.__inactiveIcon || marker.getIcon()));
  });
}

// Auto-fit map to show all markers
function fitMapToMarkers() {
  const bounds = new google.maps.LatLngBounds();
  let hasMarkers = false;

  Object.values(markerCategories).forEach(categoryMarkers => {
    categoryMarkers.forEach(marker => {
      if (marker.getMap()) { // Only include visible markers
        bounds.extend(marker.getPosition());
        hasMarkers = true;
      }
    });
  });

  if (hasMarkers) {
    map.fitBounds(bounds);
    // Prevent too much zoom for single markers
    const listener = google.maps.event.addListener(map, "idle", function () {
      if (map.getZoom() > 16) map.setZoom(16);
      google.maps.event.removeListener(listener);
    });
  }
}

// Optional: Add search functionality
function setupSearch() {
  const searchInput = document.getElementById('location-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterMarkers(searchTerm);
    });
  }
}

// Filter markers based on search term
function filterMarkers(searchTerm) {
  // Hides by text match only; recolors by category active state
  Object.keys(markerCategories).forEach(category => {
    const checkbox = document.getElementById(category);
    const isActive = checkbox ? checkbox.checked : true;

    markerCategories[category].forEach(marker => {
      const titleMatches = marker.getTitle().toLowerCase().includes(searchTerm);
      const shouldShow = (searchTerm === '' || titleMatches) && isActive;
      marker.setMap(shouldShow ? map : null);
      marker.setIcon(isActive ? (marker.__activeIcon || marker.getIcon()) : (marker.__inactiveIcon || marker.getIcon()));
    });
  });
}

// Initialize everything when page loads
function initialize() {
  // Wait a bit for Webflow to fully load the CMS data
  setTimeout(() => {
    initMap();
    setupSearch(); // Optional search functionality

    // Auto-fit map after markers are loaded (with delay for geocoding)
    setTimeout(() => {
      fitMapToMarkers();
    }, 2000);
  }, 500);
}

// Start everything when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
