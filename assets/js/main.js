document.addEventListener("DOMContentLoaded", () => {
  console.log("Website Loaded");
});

const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counter = entry.target;

      const target = +counter.dataset.target;

      let current = 0;

      const increment = target / 80;

      const update = () => {
        current += increment;

        if (current < target) {
          counter.innerText = Math.ceil(current).toLocaleString();

          requestAnimationFrame(update);
        } else {
          counter.innerText = target.toLocaleString() + "+";
        }
      };

      update();

      observer.unobserve(counter);
    }
  });
});

counters.forEach((counter) => observer.observe(counter));
