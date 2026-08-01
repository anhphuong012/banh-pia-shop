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

// const testimonialSwiper = new Swiper(".testimonialSwiper", {
//   slidesPerView: 3,

//   spaceBetween: 25,

//   loop: true,

//   autoplay: {
//     delay: 3500,
//   },

//   navigation: {
//     nextEl: ".testimonial .swiper-button-next",

//     prevEl: ".testimonial .swiper-button-prev",
//   },

//   breakpoints: {
//     0: {
//       slidesPerView: 1,
//     },

//     768: {
//       slidesPerView: 2,
//     },

//     1200: {
//       slidesPerView: 3,
//     },
//   },
// });

const reviewSwiper = new Swiper(".reviewSwiper", {
  loop: true,

  autoplay: {
    delay: 5000,
  },

  pagination: {
    el: ".reviewSwiper .swiper-pagination",

    clickable: true,
  },
});
class Slider {
  constructor() {}
}

const slider = new Slider();
