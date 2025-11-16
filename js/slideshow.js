document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshows for all modals
    document.querySelectorAll('.project-modal').forEach(modal => {
        const slideshow = modal.querySelector('.slideshow-container');
        if (!slideshow) return; // Skip if no slideshow in this modal
        
        const slides = slideshow.querySelectorAll('.slide');
        const prevBtn = modal.querySelector('.prev-slide');
        const nextBtn = modal.querySelector('.next-slide');
        const indicators = modal.querySelectorAll('.indicator');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;
        const slideDelay = 3000; // 3 seconds between slides
        
        // Show first slide by default
        showSlide(currentSlide);
        
        // Start auto-advancing slides
        startSlideShow();
        
        // Pause autoplay when hovering over slideshow
        slideshow.addEventListener('mouseenter', pauseSlideShow);
        slideshow.addEventListener('mouseleave', startSlideShow);
        
        // Event listeners for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                pauseSlideShow();
                changeSlide(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                pauseSlideShow();
                changeSlide(1);
            });
        }
        
        // Event listeners for indicator dots
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                pauseSlideShow();
                goToSlide(index);
            });
        });
        
        function startSlideShow() {
            // Clear any existing interval
            if (slideInterval) clearInterval(slideInterval);
            // Start new interval
            slideInterval = setInterval(() => {
                changeSlide(1);
            }, slideDelay);
        }
        
        function pauseSlideShow() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }
        
        function changeSlide(direction) {
            currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }
        
        function goToSlide(index) {
            currentSlide = index;
            showSlide(currentSlide);
        }
        
        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            
            // Show current slide with fade effect
            slides[index].classList.add('active');
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            // Update button states
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === totalSlides - 1;
            
            // Reset autoplay timer when manually changing slides
            if (!slideInterval) {
                startSlideShow();
            }
        }
    });
});
