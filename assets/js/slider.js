const bestSellerSwiper = new Swiper(".bestSellerSwiper", {
  slidesPerView: 4,

  spaceBetween: 25,

  loop: false,

  navigation: {
    nextEl: ".best-next",
    prevEl: ".best-prev",
  },

  pagination: {
    el: ".bestSellerSwiper .swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    0: {
      slidesPerView: 1.2,
    },

    576: {
      slidesPerView: 2,
    },

    768: {
      slidesPerView: 2.5,
    },

    992: {
      slidesPerView: 3,
    },

    1200: {
      slidesPerView: 4,
    },
  },
});
class Slider {
  constructor() {}
}

const slider = new Slider();
