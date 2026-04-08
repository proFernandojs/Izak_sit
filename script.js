// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('%cIzak Comunicação Visual - Site carregado com sucesso!', 'color: #FF00A8; font-weight: bold');

    let expandedCarousel = null;

    const closeExpandedCarousel = () => {
        if (!expandedCarousel) {
            return;
        }

        const expandedCard = expandedCarousel.closest('.produto-card');
        if (expandedCard) {
            expandedCard.classList.remove('expanded-card');
        }

        expandedCarousel.classList.remove('expanded');
        document.body.classList.remove('carousel-open');
        expandedCarousel = null;
    };

    const openExpandedCarousel = (carousel) => {
        if (expandedCarousel && expandedCarousel !== carousel) {
            const previousCard = expandedCarousel.closest('.produto-card');
            if (previousCard) {
                previousCard.classList.remove('expanded-card');
            }
            expandedCarousel.classList.remove('expanded');
        }

        const card = carousel.closest('.produto-card');
        if (card) {
            card.classList.add('expanded-card');
        }

        expandedCarousel = carousel;
        carousel.classList.add('expanded');
        document.body.classList.add('carousel-open');
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeExpandedCarousel();
        }
    });

    document.addEventListener('click', (event) => {
        if (!expandedCarousel) {
            return;
        }

        if (!expandedCarousel.contains(event.target)) {
            closeExpandedCarousel();
        }
    });

    // Inicializa um carrossel para cada card de produto.
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dotsWrapper = carousel.querySelector('.carousel-dots');

        if (slides.length <= 1 || !prevBtn || !nextBtn || !dotsWrapper) {
            return;
        }

        let currentIndex = 0;
        const dots = slides.map((_, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Ir para imagem ${idx + 1}`);
            dotsWrapper.appendChild(dot);
            return dot;
        });

        const renderSlide = (index) => {
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === index);
            });

            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        };

        const goTo = (index, options = {}) => {
            const previousIndex = currentIndex;
            currentIndex = (index + slides.length) % slides.length;
            renderSlide(currentIndex);

            // Ao concluir o ciclo completo no botão "próxima", fecha o modo expandido.
            if (
                options.closeOnFullCycle &&
                carousel.classList.contains('expanded') &&
                previousIndex === slides.length - 1 &&
                currentIndex === 0
            ) {
                closeExpandedCarousel();
            }
        };

        prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => goTo(currentIndex + 1, { closeOnFullCycle: true }));
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => goTo(idx));
        });

        slides.forEach((slide) => {
            slide.addEventListener('click', () => {
                if (!slide.classList.contains('active') || carousel.classList.contains('expanded')) {
                    return;
                }

                openExpandedCarousel(carousel);
            });
        });

        renderSlide(currentIndex);
    });

    // Efeito suave no scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animação simples nos cards ao rolar
    const cards = document.querySelectorAll('.produto-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});