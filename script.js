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
