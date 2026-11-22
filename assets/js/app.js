
/* ========================================
   LADIC - APP.JS
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");

    /* =====================================
       HEADER SCROLL EFFECT
    ===================================== */

    function handleScroll() {
        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    handleScroll();

    /* =====================================
       MOBILE HAMBURGER MENU
    ===================================== */

    if (header && menuToggle && mobileNav) {

        function setMenuState(isOpen) {

            menuToggle.classList.toggle("active", isOpen);
            mobileNav.classList.toggle("open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            mobileNav.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );

            mobileNav.inert = !isOpen;
        }

        // Toggle menu
        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.classList.contains("active");

            setMenuState(!isOpen);

        });

        // Close menu after clicking a link
        mobileNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                setMenuState(false);
            });

        });

        // Close when clicking outside
        document.addEventListener("click", event => {

            if (
                mobileNav.classList.contains("open") &&
                !header.contains(event.target)
            ) {
                setMenuState(false);
            }

        });

        // Close with Escape
        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                mobileNav.classList.contains("open")
            ) {
                setMenuState(false);
                menuToggle.focus();
            }

        });

        // Reset when switching to desktop
        const desktopQuery =
            window.matchMedia("(min-width: 1051px)");

        desktopQuery.addEventListener("change", event => {

            if (event.matches) {
                setMenuState(false);
            }

        });

        setMenuState(false);
    }

    /* =====================================
       ACTIVE NAVIGATION LINK
    ===================================== */

    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";

    document.querySelectorAll(
        ".nav-link, .mobile-link"
    ).forEach(link => {

        const linkPage = link.getAttribute("href");
        const isActive = linkPage === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }

    });

});



/* ========================================
   LADIC - CONTACT FORM
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("ladicContactForm");
    const phoneInput = document.getElementById("ladicPhone");
    const successBox = document.getElementById("ladicFormSuccess");
    const closeButton = document.getElementById("ladicSuccessClose");

    if (!form || !phoneInput || !successBox) return;

    /* =====================================
       LEBANESE PHONE NUMBER
    ===================================== */

    phoneInput.addEventListener("input", () => {

        let value = phoneInput.value.replace(/\D/g, "");

        // Lebanese mobile numbers can contain 7 or 8 digits
        value = value.slice(0, 8);

        phoneInput.value = value;

        phoneInput.setCustomValidity("");
    });

    /* =====================================
       FORM SUBMISSION
    ===================================== */

    form.addEventListener("submit", event => {

        event.preventDefault();

        successBox.hidden = true;

        const phone = phoneInput.value.replace(/\D/g, "");

        // Common Lebanese mobile prefixes:
        // 03, 70, 71, 76, 78, 79, 81
        const mobilePattern =
            /^(?:03\d{6}|(?:70|71|76|78|79|81)\d{6})$/;

        // Also allow common geographic landline prefixes
        const landlinePattern =
            /^(?:0[1-9]\d{6})$/;

        if (!mobilePattern.test(phone) &&
            !landlinePattern.test(phone)) {

            phoneInput.setCustomValidity(
                "Please enter a valid Lebanese phone number."
            );

        } else {
            phoneInput.setCustomValidity("");
        }

        if (!form.reportValidity()) {
            return;
        }

        /* =====================================
           SHOW CONFIRMATION
        ===================================== */

        successBox.hidden = false;

        form.reset();
        phoneInput.setCustomValidity("");

        successBox.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "nearest"
        });

    });

    /* =====================================
       CLOSE CONFIRMATION
    ===================================== */

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            successBox.hidden = true;
        });
    }

});



/* ========================================
   LADIC - HOME HERO SLIDER
   AUTO CHANGE EVERY 3 SECONDS
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("homeHeroSlider");

    if (!slider) return;

    const slides = Array.from(
        slider.querySelectorAll(".home-hero-slide")
    );

    const dots = Array.from(
        slider.querySelectorAll(".home-hero-dot")
    );

    if (!slides.length || slides.length !== dots.length) {
        return;
    }

    let currentSlide = 0;
    let slideInterval = null;
    let touchStartX = 0;

    /* 3000 milliseconds = 3 seconds */
    const slideDuration = 3000;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    /* =====================================
       DISPLAY SLIDE
    ===================================== */

    function showSlide(index) {

        currentSlide =
            (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {

            const isActive = i === currentSlide;

            slide.classList.toggle("active", isActive);

            slide.setAttribute(
                "aria-hidden",
                String(!isActive)
            );

        });

        dots.forEach((dot, i) => {

            const isActive = i === currentSlide;

            dot.classList.toggle("active", isActive);

            dot.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    }

    /* =====================================
       NEXT SLIDE
    ===================================== */

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    /* =====================================
       PREVIOUS SLIDE
    ===================================== */

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    /* =====================================
       STOP SLIDER
    ===================================== */

    function stopSlider() {

        if (slideInterval !== null) {
            clearInterval(slideInterval);
            slideInterval = null;
        }

    }

    /* =====================================
       START SLIDER
    ===================================== */

    function startSlider() {

        stopSlider();

        if (reducedMotion.matches || document.hidden) {
            return;
        }

        slideInterval = setInterval(() => {
            nextSlide();
        }, slideDuration);

    }

    /* =====================================
       NAVIGATION DOTS
    ===================================== */

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            showSlide(index);
            startSlider();

        });

    });

    /* =====================================
       MOBILE SWIPE
    ===================================== */

    slider.addEventListener("touchstart", event => {

        touchStartX =
            event.changedTouches[0].screenX;

    }, { passive: true });

    slider.addEventListener("touchend", event => {

        const touchEndX =
            event.changedTouches[0].screenX;

        const difference =
            touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {

            if (difference > 0) {
                nextSlide();
            } else {
                previousSlide();
            }

            startSlider();

        }

    }, { passive: true });

    /* =====================================
       PAUSE ON HOVER
    ===================================== */

    slider.addEventListener("mouseenter", stopSlider);

    slider.addEventListener("mouseleave", startSlider);

    /* =====================================
       PAUSE ON KEYBOARD FOCUS
    ===================================== */

    slider.addEventListener("focusin", stopSlider);

    slider.addEventListener("focusout", event => {

        if (!slider.contains(event.relatedTarget)) {
            startSlider();
        }

    });

    /* =====================================
       PAGE VISIBILITY
    ===================================== */

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }

    });

    /* =====================================
       REDUCED MOTION
    ===================================== */

    reducedMotion.addEventListener("change", startSlider);

    /* =====================================
       INITIALIZE
    ===================================== */

    showSlide(0);
    startSlider();

});


/* ========================================
   LADIC - ANIMATED IMPACT COUNTERS
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const impactSection = document.querySelector(".home-impact");

    if (!impactSection) return;

    const counters = impactSection.querySelectorAll(
        ".home-impact-number[data-count]"
    );

    let hasAnimated = false;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    /* =====================================
       ANIMATE ONE COUNTER
    ===================================== */

    function animateCounter(element) {

        const target = Number(element.dataset.count);

        if (!Number.isFinite(target)) return;

        if (reducedMotion.matches) {
            element.textContent = target.toLocaleString("en-US");
            return;
        }

        const duration = 1900;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            /* Ease-out cubic */
            const eased = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(
                target * eased
            );

            element.textContent = currentValue.toLocaleString("en-US");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString("en-US");
            }

        }

        requestAnimationFrame(updateCounter);
    }

    /* =====================================
       START ANIMATION
    ===================================== */

    function startImpactAnimation() {

        if (hasAnimated) return;

        hasAnimated = true;

        impactSection.classList.add("is-visible");

        counters.forEach(counter => {
            animateCounter(counter);
        });

    }

    /* =====================================
       OBSERVE SECTION
    ===================================== */

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        startImpactAnimation();

                        observer.disconnect();

                    }

                });

            },
            {
                threshold: 0.2
            }
        );

        observer.observe(impactSection);

    } else {

        startImpactAnimation();

    }

});
