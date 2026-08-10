//sort event
const customSelect = document.getElementById("sortSelect");

const selected = customSelect.querySelector(".select-selected span");

const options = customSelect.querySelectorAll(".select-options li");
selected.parentElement.onclick = function (e) {
  e.stopPropagation();

  customSelect.classList.toggle("active");
};
options.forEach((option) => {
  option.onclick = function () {
    options.forEach((item) => item.classList.remove("active"));

    this.classList.add("active");

    selected.innerText = this.innerText;

    customSelect.classList.remove("active");
  };
});
document.addEventListener("click", function () {
  customSelect.classList.remove("active");
});

//For Filter
/*======================================
ACCORDION
======================================*/

// =============================
// SHOP FILTER ACCORDION
// =============================

const filterTitles = document.querySelectorAll(".filter-title");

filterTitles.forEach((title) => {
  title.addEventListener("click", () => {
    const filterItem = title.parentElement;

    filterItem.classList.toggle("active");
  });
});

/*======================================
PRICE
======================================*/

const slider = document.getElementById("priceSlider");

noUiSlider.create(slider, {
  start: [100000, 350000],

  connect: true,

  step: 10000,

  range: {
    min: 50000,

    max: 500000,
  },
});

const minInput = document.getElementById("minPrice");

const maxInput = document.getElementById("maxPrice");

slider.noUiSlider.on("update", function (values) {
  console.log("set value " + minInput);
  minInput.value = Number(values[0]).toLocaleString("vi-VN") + "đ";

  maxInput.value = Number(values[1]).toLocaleString("vi-VN") + "đ";
});

//For filter in moblie
/*=========================================
SHOP SIDEBAR MOBILE
=========================================*/

const openFilterBtn = document.getElementById("openFilter");

const closeSidebarBtn = document.getElementById("closeSidebar");

const shopSidebar = document.getElementById("shopSidebar");

const sidebarOverlay = document.getElementById("shopSidebarOverlay");

console.log(openFilterBtn);

function openSidebar() {
  shopSidebar.classList.add("show");

  sidebarOverlay.classList.add("show");

  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  shopSidebar.classList.remove("show");

  sidebarOverlay.classList.remove("show");

  document.body.style.overflow = "";
}
if (openFilterBtn) {
  openFilterBtn.addEventListener("click", openSidebar);
}

if (closeSidebarBtn) {
  closeSidebarBtn.addEventListener("click", closeSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSidebar();
  }
});

//Pagingtion event

const pageNumbers = document.querySelectorAll(".page-number");

pageNumbers.forEach((page) => {
  page.addEventListener("click", () => {
    pageNumbers.forEach((item) => {
      item.classList.remove("active");
    });

    page.classList.add("active");
  });
});
