// Initialize Swiper sliders for all instances of .home-hero_slider
document.addEventListener('DOMContentLoaded', function() {
  // Find all slider containers
  const sliderContainers = document.querySelectorAll('.home-hero_slider');
  
  // Loop through each slider container
  sliderContainers.forEach(function(container) {
    // Initialize Swiper for this container
    const swiper = new Swiper(container.querySelector('.swiper'), {
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
  });
  
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
  
  // Position on load
  positionVerticalLine();
  
  // Reposition on window resize
  window.addEventListener('resize', positionVerticalLine);

  // Sub-accordion functionality
  const subAccordionLists = document.querySelectorAll('.sub-accordion_list');
  
  // Function to update the accordion image based on active sub-accordion
  function updateAccordionImage(subAccordion) {
    console.log('updateAccordionImage called for:', subAccordion);
    
    // Get the parent accordion item
    const accordionItem = subAccordion.closest('.accordion_item');
    console.log('Parent accordion item:', accordionItem);
    
    if (!accordionItem) {
      console.warn('No parent accordion item found');
      return;
    }
    
    // Get the sub-accordion image and the accordion image container
    const subAccordionImage = subAccordion.querySelector('.sub-accordion_image');
    const accordionImageContainer = accordionItem.querySelector('.accodion_image-container .g_visual_wrap');
    
    console.log('Sub-accordion image element:', subAccordionImage);
    console.log('Accordion image container:', accordionImageContainer);
    
    if (subAccordionImage && accordionImageContainer) {
      // Get the source image
      const sourceImg = subAccordionImage;
      // Get the current target image
      const currentTargetImg = accordionImageContainer.querySelector('img.g_visual_img');
      
      console.log('Source image:', sourceImg);
      console.log('Current target image:', currentTargetImg);
      
      if (sourceImg && currentTargetImg) {
        // Get the src, srcset and sizes from the source image
        const sourceSrc = sourceImg.getAttribute('src');
        const sourceSrcset = sourceImg.getAttribute('srcset');
        const sourceSizes = sourceImg.getAttribute('sizes');
        const sourceAlt = sourceImg.getAttribute('alt') || '';
        
        console.log('Source image src:', sourceSrc);
        
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
            
            console.log('Transition complete, updated original image');
          }, 600); // Slightly longer than the transition to ensure it's complete
          
          console.log('Started image transition');
        };
        
        // Start preloading
        preloadImage.src = sourceSrc;
      } else {
        console.warn('Could not find source or target img element');
      }
    } else {
      console.warn('Missing required elements:', {
        'subAccordionImage': subAccordionImage,
        'accordionImageContainer': accordionImageContainer
      });
    }
  }
  
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

// GSAP ScrollTrigger Pin Section
gsap.registerPlugin(ScrollTrigger);
  
const accordionItems = document.querySelectorAll('.accordion_item');
  
// Set first accordion item as active on page load
if (accordionItems.length > 0) {
  accordionItems[0].classList.add('active');
}

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
      } else {
        // Fallback if ScrollTrigger instance not found
        console.warn("ScrollTrigger instance not found");
      }
    }
  });
});

function imageSrcSetFix() {
    // Handle improperly loaded srcset size for responsive images
    var images = document.getElementsByTagName("img");
  
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
  
      // Optional: Log for debugging
      // console.log(`Image size set to: ${finalSizeValue}`);
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

  imageSrcSetFix();

  // Function to create and position the connecting line between split-CTA graphics
  function createConnectingLine() {
    // Check if the line already exists, remove it if it does to prevent duplicates
    const existingLine = document.querySelector('.split-cta-connecting-line');
    if (existingLine) {
      existingLine.remove();
    }
    
    // Get the two graphic elements
    const leftGraphic = document.querySelector('.split-cta_graphic.left');
    const rightGraphic = document.querySelector('.split-cta_graphic.right');
    
    // Only proceed if both elements exist
    if (!leftGraphic || !rightGraphic) {
      console.warn('Could not find one or both of the split-CTA graphics');
      return;
    }
    
    // Get the parent split-cta container
    const splitCtaContainer = document.querySelector('.split-cta');
    if (!splitCtaContainer) {
      console.warn('Could not find the split-cta container');
      return;
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
    
    // Calculate the center point of the split-cta container for vertical alignment
    const containerCenterY = containerRect.height / 2;
    
    // Calculate the start and end points for the line
    // Start from the middle right of the left graphic
    const startX = leftRect.right - containerRect.left;
    // Use the container's center for Y position
    const startY = containerCenterY;
    
    // End at the middle left of the right graphic
    const endX = rightRect.left - containerRect.left;
    // Use the container's center for Y position
    const endY = containerCenterY;
    
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
  
  // Initial creation with multiple attempts
  // Try immediately
  createConnectingLine();
  
  // Try again after delays to ensure proper positioning
  setTimeout(createConnectingLine, 500);
  setTimeout(createConnectingLine, 1500);
  setTimeout(createConnectingLine, 3000);
  
  // Also try when window fully loads
  window.addEventListener('load', createConnectingLine);
  
  // Update immediately on resize without debounce for responsiveness
  window.addEventListener('resize', createConnectingLine);

});

