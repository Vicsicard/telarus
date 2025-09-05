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
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Swipe left
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Swipe right
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
            // Add transition classes
            slides[currentSlide].classList.add('next-out');
            
            setTimeout(() => {
                slides[currentSlide].classList.remove('active', 'next-out');
                currentSlide++;
                slides[currentSlide].classList.add('active', 'next-in');
                
                setTimeout(() => {
                    slides[currentSlide].classList.remove('next-in');
                    updateSlideCounter();
                }, 600);
            }, 600);
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            // Add transition classes
            slides[currentSlide].classList.add('prev-out');
            
            setTimeout(() => {
                slides[currentSlide].classList.remove('active', 'prev-out');
                currentSlide--;
                slides[currentSlide].classList.add('active', 'prev-in');
                
                setTimeout(() => {
                    slides[currentSlide].classList.remove('prev-in');
                    updateSlideCounter();
                }, 600);
            }, 600);
        }
    }
    
    function goToHome() {
        goToSlide(0);
    }
    
    // Add animation classes to elements when they enter viewport
    const animateElements = () => {
        const currentSlideElements = slides[currentSlide].querySelectorAll('h1, p, ul, blockquote');
        
        currentSlideElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
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
