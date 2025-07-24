// Header Hover Effect //
const imgContainer = document.getElementById('img-container');

imgContainer.addEventListener('mouseover', () => {
imgContainer.classList.add('persistent');
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
