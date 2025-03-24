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
    
    // Log position data for debugging if needed
    // console.log('Positioned vertical line at:', positionFromHeroTop, 'px');
}
}

// Watch for changes that might affect vertical line position
function setupVerticalLineObserver() {
    const homeHero = document.querySelector('.home-hero');
    if (!homeHero) return;
    
    // Create observer to watch for changes to the hero section
    const observer = new MutationObserver((mutations) => {
        // Reposition the vertical line when mutations occur
        positionVerticalLine();
    });
    
    // Start observing the hero section for DOM changes
    observer.observe(homeHero, { 
        attributes: true, 
        childList: true, 
        subtree: true,
        characterData: true
    });
}

function resizeVerticalLine() {
// Only set up vertical line positioning if the elements exist
const verticalLine = document.querySelector('.vertical-line');
const heroButtons = document.querySelector('.home-hero_buttons');
if (verticalLine && heroButtons) {
  // Position on load
  positionVerticalLine();
  
  // Try multiple times to ensure correct positioning
  setTimeout(positionVerticalLine, 100);
  setTimeout(positionVerticalLine, 500);
  setTimeout(positionVerticalLine, 1000);
  
  // Reposition on window resize
  window.addEventListener('resize', positionVerticalLine);
  
  // Also position after window fully loads (all resources including images)
  window.addEventListener('load', positionVerticalLine);
  
  // Set up mutation observer to catch any DOM changes
  setupVerticalLineObserver();
}
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
      
    function initVerticalLine() {
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
    }

function initSubAccordions() {
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
            backButton.innerHTML = '← Back';
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
  document.querySelectorAll("[data-g-tick-up]").forEach((element) => {
    const targetNumber = parseFloat(element.dataset.gTickUp);
    const randomDuration = Math.random() * (3 - 1) + 1;

    // Determine decimal places from the target number
    const decimalPlaces = (targetNumber.toString().split(".")[1] || "").length;

    // Store the initial number for reference
    element.innerText = targetNumber;

    gsap.fromTo(
      element,
      {
        innerText: 0,
      },
      {
        innerText: targetNumber,
        duration: randomDuration,
        ease: "power1.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        onUpdate: function () {
          const value = this.targets()[0].innerText;
          // Format with the same number of decimal places as the target
          element.innerText = parseFloat(value).toFixed(decimalPlaces);
        },
      }
    );
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

    // Add active class to the first filter item by default
    if (mapFilterItems.length > 0) {
      mapFilterItems[0].classList.add('active-filter');
    }

    mapFilterItems.forEach(filterItem => {
      filterItem.addEventListener('click', function() {
        const filterValue = this.dataset.mapFilter;

        // Deactivate all layers
        mapLayers.forEach(layer => {
          layer.classList.remove('active-filter');
          layer.style.opacity = '0';
        });

        // Activate the selected layer(s)
        if (filterValue === 'all') {
          // Show all layers
          mapLayers.forEach(layer => {
            layer.classList.add('active-filter');
            layer.style.opacity = '1';
          });
        } else {
          // Show only the layer(s) matching the filter value
          mapLayers.forEach(layer => {
            if (layer.dataset.mapLayer === filterValue) {
              layer.classList.add('active-filter');
              layer.style.opacity = '1';
            }
          });
        }

        // Remove active class from all filter items
        mapFilterItems.forEach(item => {
          item.classList.remove('active-filter');
        });

        // Add active class to the clicked filter item
        this.classList.add('active-filter');
      });
    });
  });
}

// Function to truncate text and update the "Read More" link
function truncateText() {
  const containers = document.querySelectorAll('.js-read-more');
  console.log('Found .js-read-more containers:', containers.length);

  containers.forEach(container => {
    console.log('Processing container:', container);

    // The container *is* the richtext element
    const richtextElement = container;
    console.log('richtextElement:', richtextElement);

    // Find the read-more-link within the same parent div
    const readMoreLink = container.nextElementSibling;
    console.log('readMoreLink:', readMoreLink);

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

    console.log('originalText:', originalText);

    const truncatedText = originalText.length > 80 ? originalText.substring(0, 80) + '...' : originalText;
    console.log('truncatedText:', truncatedText);

    richtextElement.textContent = truncatedText;
    readMoreLink.textContent = 'Read More';
    console.log('Text truncated and link updated for container:', container);
  });
  console.log('truncateText function complete');
}

console.log('truncateText');

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

// Initialize all functions when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  
  // Initialize sliders
  initHeroSliders();
  initTeamSliders();

  // Run vertical line positioning ASAP using requestAnimationFrame for optimal timing
  requestAnimationFrame(() => {
    positionVerticalLine();
    resizeVerticalLine();
  });
  
  // Also initialize with a slight delay as backup
  setTimeout(() => {
    positionVerticalLine();
    resizeVerticalLine();
  }, 50);
  
  initVerticalLine();
  initSubAccordions();

  imageSrcSetFix();
  initImageCards();
  initTabContainers();
  initializeMenu();
  initReadMore();
  
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
  

});



