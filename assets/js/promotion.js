const benefitCards = document.querySelectorAll(".benefit-card");

const benefitObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        benefitCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("show");
          }, index * 180);
        });
      }
    });
  },
  {
    threshold: 0.25,
  },
);

benefitObserver.observe(document.querySelector(".benefits-grid"));

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  item.querySelector(".faq-question").onclick = () => {
    if (item.classList.contains("active")) {
      item.classList.remove("active");

      return;
    }

    faqItems.forEach((i) => i.classList.remove("active"));

    item.classList.add("active");
  };
});

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));

    btn.classList.add("active");
  });
});
const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.2,
  },
);

reveals.forEach((item) => {
  revealObserver.observe(item);
});
