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

});

