document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const homeBtn = document.getElementById('homeBtn');
    const slideCounter = document.getElementById('slideCounter');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Variables
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isNavigating = false; // Flag to prevent rapid navigation
    
    // Initialize
    updateSlideCounter();
    
    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    homeBtn.addEventListener('click', goToHome);
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'Home') {
            goToHome();
        }
    });
    
    // Thumbnail Navigation
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Touch Navigation
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        
        // Get the current touch position
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        
        // Calculate horizontal and vertical movement
        const diffX = currentX - touchStartX;
        const diffY = Math.abs(currentY - touchStartY);
        
        // If horizontal swipe is significant and greater than vertical movement
        // (to avoid interfering with vertical scrolling)
        if (Math.abs(diffX) > 20 && Math.abs(diffX) > diffY * 1.5) {
            // Prevent default to stop page scrolling during horizontal swipe
            e.preventDefault();
            
            const currentSlideEl = slides[currentSlide];
            const direction = diffX < 0 ? -1 : 1;
            const nextSlideIndex = currentSlide + direction;
            
            // Limit the transform amount
            const transformAmount = Math.min(Math.abs(diffX) * 0.3, 60);
            
            // Apply transform to current slide
            currentSlideEl.style.transform = `translateX(${diffX * 0.3}px)`;
            currentSlideEl.style.opacity = 1 - Math.min(Math.abs(diffX) * 0.002, 0.3);
            
            // If there's a next/prev slide, prepare it too
            if (nextSlideIndex >= 0 && nextSlideIndex < totalSlides) {
                const nextSlideEl = slides[nextSlideIndex];
                nextSlideEl.style.visibility = 'visible';
                nextSlideEl.style.opacity = Math.min(Math.abs(diffX) * 0.002, 0.3);
                nextSlideEl.style.transform = `translateX(${direction * (60 - transformAmount)}px)`;
            }
        }
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        // Reset any transforms applied during swipe
        slides.forEach(slide => {
            slide.style.transform = '';
            slide.style.opacity = '';
            if (!slide.classList.contains('active')) {
                slide.style.visibility = '';
            }
        });
        
        handleSwipe();
        isSwiping = false;
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeVerticalThreshold = 80;
        const swipeVertical = Math.abs(touchEndY - touchStartY);
        const swipeHorizontal = Math.abs(touchEndX - touchStartX);
        
        // Only handle horizontal swipes (ignore diagonal/vertical swipes)
        // Make sure the horizontal swipe is significantly larger than vertical movement
        if (swipeHorizontal > swipeThreshold && swipeHorizontal > swipeVertical * 1.5) {
            // Check if we're not scrolling within a slide content
            const target = document.elementFromPoint(touchEndX, touchEndY);
            const slideContent = target.closest('.slide-content');
            
            // Only process swipe if we're not in a scrollable content area
            // or if the content is not scrollable (no overflow)
            if (!slideContent || 
                (slideContent.scrollHeight <= slideContent.clientHeight)) {
                if (touchEndX < touchStartX) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        }
    }
    
    // Functions
    function updateSlideCounter() {
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        
        // Update thumbnails
        thumbnails.forEach((thumbnail, index) => {
            if (index === currentSlide) {
                thumbnail.classList.add('active');
            } else {
                thumbnail.classList.remove('active');
            }
        });
        
        // Update navigation button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        prevBtn.setAttribute('aria-disabled', currentSlide === 0);
        nextBtn.setAttribute('aria-disabled', currentSlide === totalSlides - 1);
    }
    
    // Disable navigation during transitions
    function disableNavigation() {
        if (isNavigating) return;
        isNavigating = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        homeBtn.disabled = true;
    }
    
    // Re-enable navigation after transitions
    function enableNavigation() {
        isNavigating = false;
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        homeBtn.disabled = false;
    }
    
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Add active class to new slide
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        
        // Update counter
        updateSlideCounter();
    }
    
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            // Prevent rapid clicking by disabling buttons temporarily
            disableNavigation();
            
            // Add transition classes
            slides[currentSlide].classList.add('next-out');
            
            // Preload next slide for smoother transition
            slides[currentSlide + 1].style.visibility = 'visible';
            slides[currentSlide + 1].style.opacity = '0';
            
            setTimeout(() => {
                slides[currentSlide].classList.remove('active', 'next-out');
                currentSlide++;
                slides[currentSlide].classList.add('active', 'next-in');
                
                setTimeout(() => {
                    slides[currentSlide].classList.remove('next-in');
                    updateSlideCounter();
                    enableNavigation();
                }, 700);
            }, 700);
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            // Prevent rapid clicking by disabling buttons temporarily
            disableNavigation();
            
            // Add transition classes
            slides[currentSlide].classList.add('prev-out');
            
            // Preload previous slide for smoother transition
            slides[currentSlide - 1].style.visibility = 'visible';
            slides[currentSlide - 1].style.opacity = '0';
            
            setTimeout(() => {
                slides[currentSlide].classList.remove('active', 'prev-out');
                currentSlide--;
                slides[currentSlide].classList.add('active', 'prev-in');
                
                setTimeout(() => {
                    slides[currentSlide].classList.remove('prev-in');
                    updateSlideCounter();
                    enableNavigation();
                }, 700);
            }, 700);
        }
    }
    
    function goToHome() {
        goToSlide(0);
    }
    
    // Add animation classes to elements when they enter viewport
    const animateElements = () => {
        const currentSlideElements = slides[currentSlide].querySelectorAll('h1, h2, p, ul, li, blockquote, .highlight-text, .pill, .qa-icon');
        
        // Reset any previous animations
        currentSlideElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            // Use hardware acceleration for smoother animations
            element.style.willChange = 'opacity, transform';
            element.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        });
        
        // Stagger the animations
        currentSlideElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                // Remove will-change after animation completes to free up resources
                setTimeout(() => {
                    element.style.willChange = 'auto';
                }, 600);
            }, 100 + (index * 80));
        });
    };
    
    // Observe slide changes to trigger animations
    const slideObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const targetElement = mutation.target;
                if (targetElement.classList.contains('active')) {
                    animateElements();
                }
            }
        });
    });
    
    // Observe all slides
    slides.forEach((slide) => {
        slideObserver.observe(slide, { attributes: true });
    });
    
    // Initial animation for first slide
    animateElements();
});
