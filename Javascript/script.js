document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const headerLogo = document.getElementById('header-logo');
    const heroLogo = document.getElementById('hero-logo');
    const hero = document.getElementById('hero');
    const sections = document.querySelectorAll('.section');
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

    // Otimização: usar IntersectionObserver ao invés de getBoundingClientRect em loop
    // Usa classes CSS ao invés de manipular style inline
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            const sectionHeight = rect.height;
            const sectionTop = rect.top;
            
            // Remove todas as classes de parallax
            section.classList.remove('parallax-visible', 'parallax-partial', 'parallax-below', 'parallax-above');
            
            if (sectionTop >= viewportHeight) {
                // Section abaixo da viewport
                section.classList.add('parallax-below');
            } else if (sectionTop <= -sectionHeight) {
                // Section acima da viewport
                section.classList.add('parallax-above');
            } else if (entry.intersectionRatio > 0.7) {
                // Section bem visível
                section.classList.add('parallax-visible');
            } else if (entry.intersectionRatio > 0) {
                // Section parcialmente visível
                section.classList.add('parallax-partial');
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    // Observa todas as sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleHeaderScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    handleHeaderScroll();

    headerLogo.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const teamMembers = document.querySelectorAll('.team-member');
    
    function toggleMember(member) {
        if (member.querySelector('.member-instagram')?.contains(document.activeElement)) {
            return;
        }
        
        const isExpanded = member.classList.contains('expanded');
        
        teamMembers.forEach(m => {
            m.classList.remove('expanded');
            m.setAttribute('aria-expanded', 'false');
        });
        
        if (!isExpanded) {
            member.classList.add('expanded');
            member.setAttribute('aria-expanded', 'true');
        }
    }

    teamMembers.forEach(member => {
        // Suporte a clique
        member.addEventListener('click', function(e) {
            if (e.target.closest('.member-instagram')) {
                return;
            }
            toggleMember(this);
        });

        // Suporte a teclado (Enter e Space)
        member.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMember(this);
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

    // Respeitar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let autoplayInterval = null;

    if (!prefersReducedMotion) {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (autoplayInterval) {
        carouselWrapper.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        carouselWrapper.addEventListener('mouseleave', () => {
            if (!prefersReducedMotion) {
                autoplayInterval = setInterval(nextSlide, 5000);
            }
        });
    }

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
