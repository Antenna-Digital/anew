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
});
