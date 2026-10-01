// Hero Parallax //
// The image drifts down slower than the page as you scroll past it,
// giving the banner a sense of depth. Ken Burns drift lives in CSS on
// the <img>; this only moves the wrapper, so the two never conflict.
const heroContainer = document.getElementById('img-container');
const heroWrap = document.getElementById('hero-img-wrap');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroWrap && heroContainer && !reduceMotion) {
    let ticking = false;

    function applyParallax() {
        // Clamp travel to the wrapper's 12% overscan so an edge never shows.
        const maxTravel = heroContainer.offsetHeight * 0.12;
        const offset = Math.min(window.scrollY * 0.12, maxTravel);
        heroWrap.style.transform = `translate3d(0, ${offset}px, 0)`;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(applyParallax);
            ticking = true;
        }
    }, { passive: true });

    applyParallax();
}

// Image-Theft Deterrents //
// Blocks right-click "Save image" and click-drag-to-desktop on images.
// This only stops casual copying — it cannot prevent a determined visitor
// (the file is still in their browser, and reachable at its direct URL).
// Real protection = watermark / low-res display copies.
["contextmenu", "dragstart"].forEach((eventName) => {
    document.addEventListener(eventName, (e) => {
        if (e.target.tagName === "IMG" || e.target.closest(".img-container")) {
            e.preventDefault();
        }
    });
});

// Page Scroll Effect //
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".hidden");

    function checkScroll() {
        elements.forEach((element) => {
            const position = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (position < windowHeight - 100) {
                element.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});

// Phrase-field choreography //
// The phrases drift in the opening view, then gather into a typographic
// stack as the hero scrolls toward the introduction.
const phraseHero = document.querySelector(".hero");
const phraseStage = document.querySelector(".hero-stage");
const phraseNodes = [...document.querySelectorAll(".moving-phrase")];
const bioContent = document.querySelector(".hero-content");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (phraseHero && phraseStage && phraseNodes.length) {
    function cssLengthInPixels(value) {
        const number = parseFloat(value) || 0;
        if (value.includes("vw")) return window.innerWidth * number / 100;
        if (value.includes("vh")) return window.innerHeight * number / 100;
        return number;
    }

    const starts = phraseNodes.map((node) => ({
        x: cssLengthInPixels(getComputedStyle(node).getPropertyValue("--start-x")),
        y: cssLengthInPixels(getComputedStyle(node).getPropertyValue("--start-y"))
    }));
    let framePending = false;

    function updatePhraseField() {
        const range = Math.max(1, phraseHero.offsetHeight - phraseStage.offsetHeight);
        const progress = Math.max(0, Math.min(1, -phraseHero.getBoundingClientRect().top / range));
        phraseNodes.forEach((node, index) => {
            const phraseProgress = motionPreference.matches ? 1 : Math.max(0, Math.min(1, (progress - index * 0.08) / 0.62));
            const drift = motionPreference.matches ? 0 : 1 - phraseProgress;
            const x = starts[index].x * (1 - phraseProgress) + Math.sin(Date.now() / 1100 + index * 2) * 30 * drift;
            const y = starts[index].y * (1 - phraseProgress) + Math.cos(Date.now() / 1300 + index * 2) * 24 * drift;
            node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            node.style.opacity = "1";
        });
        if (bioContent) {
            const showBio = progress >= 0.78;
            bioContent.classList.toggle("is-visible", showBio);
            bioContent.inert = !showBio;
        }
        framePending = false;
    }

    function requestPhraseUpdate() {
        if (!framePending) {
            framePending = true;
            window.requestAnimationFrame(updatePhraseField);
        }
    }

    window.addEventListener("scroll", requestPhraseUpdate, { passive: true });
    window.addEventListener("resize", requestPhraseUpdate);
    if (!motionPreference.matches) window.setInterval(requestPhraseUpdate, 50);
    requestPhraseUpdate();
}

// Bring each Biblical Studies card onto its timeline mark as it enters view.
const studiesTimeline = document.querySelector(".studies-section");
const timelineCards = [...document.querySelectorAll(".studies-section .detail-card")];
if (studiesTimeline && timelineCards.length && "IntersectionObserver" in window) {
    studiesTimeline.classList.add("timeline-ready");
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    timelineCards.forEach((card) => timelineObserver.observe(card));
} else {
    timelineCards.forEach((card) => card.classList.add("is-visible"));
}

// Keep the laptop screen in step with the scroll landmarks beneath it.
const laptopJourney = document.querySelector(".laptop-journey");
if (laptopJourney) {
    const laptopCards = [...laptopJourney.querySelectorAll("[data-laptop-card]")];
    const laptopSteps = [...laptopJourney.querySelectorAll("[data-laptop-step]")];
    const staticLaptop = window.matchMedia("(max-width: 600px), (prefers-reduced-motion: reduce)");

    if (staticLaptop.matches || !("IntersectionObserver" in window)) {
        laptopCards.forEach((card) => {
            card.setAttribute("aria-hidden", "false");
            card.inert = false;
        });
    } else {
        laptopJourney.classList.add("has-laptop-scroll");
        const laptopObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const index = laptopSteps.indexOf(entry.target);
                laptopCards.forEach((card, cardIndex) => {
                    const active = cardIndex === index;
                    card.classList.toggle("is-active", active);
                    card.setAttribute("aria-hidden", String(!active));
                    card.inert = !active;
                });
                laptopSteps.forEach((step, stepIndex) => {
                    step.classList.toggle("is-active", stepIndex === index);
                });
            });
        }, { threshold: 0, rootMargin: "-48% 0px -48% 0px" });
        laptopSteps.forEach((step) => laptopObserver.observe(step));

        staticLaptop.addEventListener("change", (event) => {
            if (!event.matches) return;
            laptopJourney.classList.remove("has-laptop-scroll");
            laptopObserver.disconnect();
            laptopCards.forEach((card) => {
                card.setAttribute("aria-hidden", "false");
                card.inert = false;
            });
        });
    }
}
