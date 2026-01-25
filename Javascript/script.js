document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const headerLogo = document.getElementById('header-logo');
    const heroLogo = document.getElementById('hero-logo');
    const hero = document.getElementById('hero');
    const sections = document.querySelectorAll('.section');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleHeaderScroll() {
        const heroHeight = hero.offsetHeight;
        const scrollY = window.scrollY;
        const triggerPoint = heroHeight * 0.3;

        if (scrollY > triggerPoint) {
            header.classList.add('visible');
            heroLogo.classList.add('hidden');
        } else {
            header.classList.remove('visible');
            heroLogo.classList.remove('hidden');
        }
    }

    function handleParallaxScroll() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;

            let progress;
            if (sectionTop >= viewportHeight) {
                progress = 0;
            } else if (sectionTop <= -sectionHeight) {
                progress = 0;
            } else if (sectionTop <= 0 && sectionTop >= -sectionHeight) {
                progress = 1 - Math.abs(sectionTop) / sectionHeight;
            } else {
                progress = 1 - (sectionTop / viewportHeight);
            }

            progress = Math.max(0, Math.min(1, progress));

            const opacity = 0.3 + (progress * 0.8);
            let translateY;

            if (sectionTop > 0) {
                translateY = (1 - progress) * 50;
            } else {
                translateY = -((1 - progress) * 40);
            }

            section.style.opacity = opacity;
            section.style.transform = `translateY(${translateY}px)`;
        });

        lastScrollY = scrollY;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleHeaderScroll();
                handleParallaxScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    handleHeaderScroll();
    handleParallaxScroll();

    headerLogo.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', function(e) {
            if (e.target.closest('.member-instagram')) {
                return;
            }
            
            const isExpanded = this.classList.contains('expanded');
            
            teamMembers.forEach(m => m.classList.remove('expanded'));
            
            if (!isExpanded) {
                this.classList.add('expanded');
            }
        });
    });

    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    let autoplayInterval = setInterval(nextSlide, 5000);

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    carouselWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    carouselWrapper.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
});
