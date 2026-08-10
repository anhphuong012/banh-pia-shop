const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));
const proBreadrum = document.getElementById("nameProductDetail");

console.log(productId);
const product = products.find((item) => item.id === productId);

console.log(product);
const productDetail = document.getElementById("productDetail");

function renderProduct() {
  console.log("renderProduct chạy");
  productDetail.innerHTML = "";
  let html = "";
  if (!product) {
    html = `
            <h2>Không tìm thấy sản phẩm</h2>
        `;

    return;
  }

  proBreadrum.innerHTML = product.name;

  html = `<div class="detail-wrapper">
  <div class="detail-gallery">
    <div class="gallery-card">
      <div class="thumbnail-list">
        ${product.images
          .map(
            (img, index) => `
              <img
                src="${img}"
                class="thumb ${index === 0 ? "active" : ""}"
                data-image="${img}"
              >
            `,
          )
          .join("")}
      </div>

      <div class="main-image-wrapper">
        <img
          id="mainProductImage"
          class="main-image"
          src="${product.images[0]}"
        />
        <div class="image-lens"></div>
      </div>
    </div>
  </div>

  <div class="detail-info">
    <h1>${product.name}</h1>
   
    <div class="product-meta">

    <span class="product-badge">
        <i class="bi bi-box-seam"></i>
        Hộp 6 bánh
    </span>

    <span class="product-badge">
        <i class="bi bi-speedometer2"></i>
        480g
    </span>

</div>


    <div class="detail-rating">
      <div class="rating-stars">
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
      </div>
      <span class="rating-score">${product.rating}</span>
      <span class="rating-divider"></span>
      <span class="rating-review">${product.reviewCount} đánh giá</span>
      <span class="rating-divider"></span>
      <span class="rating-sold">Đã bán ${product.sold}</span>
    </div>

    <div class="detail-price">
      <div class="price-main">
        <span class="current">${product.price.toLocaleString("vi-VN")}đ</span>
        <span class="discount-badge">-${product.discount}%</span>
      </div>

      <div class="price-sub">
        <span class="old">${product.oldPrice.toLocaleString("vi-VN")}đ</span>
        <span class="saving-price">
          Tiết kiệm ${(product.oldPrice - product.price).toLocaleString("vi-VN")}đ
        </span>
      </div>
    </div>

    <div class="purchase-action-group">
      <label class="quantity-label">Số lượng</label>

      <div class="action-row">
        <div class="quantity-control">
          <button id="minusBtn" type="button">−</button>
          <input id="quantityInput" type="text" value="1" readonly />
          <button id="plusBtn" type="button">+</button>
        </div>

        <button id="detailAddCart" class="detail-add-cart">
          <i class="bi bi-cart-plus"></i>
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  </div>
</div>

<div class="foot-detail">
  <section class="product-tabs">
    <div class="tab-header">
      <button class="tab-btn active" data-tab="description">
        <i class="bi bi-file-earmark-text"></i>
        <span>Mô tả</span>
      </button>
      <button class="tab-btn" data-tab="ingredient">
        <i class="bi bi-egg-fried"></i>
        <span>Thành phần</span>
      </button>
      <button class="tab-btn" data-tab="guide">
        <i class="bi bi-box-seam"></i>
        <span>Bảo quản</span>
      </button>
      <button class="tab-btn" data-tab="review">
        <i class="bi bi-star"></i>
        <span>Đánh giá</span>
      </button>
    </div>

    <div class="tab-content active" id="description">
      <h3>Mô tả sản phẩm</h3>
      <p>${product.description}</p>
    </div>

    <div class="tab-content" id="ingredient">
      <h3>Thành phần</h3>
      <ul class="ingredient-grid">
        <li>Bột mì</li>
        <li>Sầu riêng</li>
        <li>Trứng muối</li>
        <li>Đường</li>
        <li>Dầu thực vật</li>
      </ul>
    </div>

    <div class="tab-content" id="guide">
      <h3>Hướng dẫn bảo quản</h3>
      <ul>
        <li><i class="bi bi-check-circle-fill"></i> Bảo quản nơi khô ráo.</li>
        <li><i class="bi bi-check-circle-fill"></i> Tránh ánh nắng trực tiếp.</li>
        <li><i class="bi bi-check-circle-fill"></i> Sử dụng trong vòng 30 ngày.</li>
      </ul>
    </div>

    <div class="tab-content" id="review">
      <div class="review-overview">
        <div class="review-score">
          <h2>4.9</h2>
          <div class="review-stars">★★★★★</div>
          <p>128 đánh giá</p>

          <div class="review-extra">
            <div class="review-badge">
              <i class="bi bi-patch-check-fill"></i>
              <span>98% hài lòng</span>
            </div>
            <div class="review-badge">
              <i class="bi bi-bag-check-fill"></i>
              <span>1.2K đã bán</span>
            </div>
          </div>
        </div>

        <div class="review-progress">
          <div class="progress-item">
            <span>5★</span>
            <div class="progress">
              <div class="progress-fill" style="width: 94%"></div>
            </div>
            <span>120</span>
          </div>

          <div class="progress-item">
            <span>4★</span>
            <div class="progress">
              <div class="progress-fill" style="width: 5%"></div>
            </div>
            <span>6</span>
          </div>

          <div class="progress-item">
            <span>3★</span>
            <div class="progress">
              <div class="progress-fill" style="width: 1.5%"></div>
            </div>
            <span>2</span>
          </div>

          <div class="progress-item">
            <span>2★</span>
            <div class="progress">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span>0</span>
          </div>

          <div class="progress-item">
            <span>1★</span>
            <div class="progress">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span>0</span>
          </div>
        </div>
      </div>

      <div class="review-filter">
        <button class="active" data-filter="all">Tất cả</button>
        <button data-filter="image">Có ảnh</button>
        <button data-filter="5">5★</button>
        <button data-filter="4">4★</button>
        <button data-filter="3">3★</button>
      </div>

      <div class="review-list"></div>
    </div>
  </section>

  <section class="review-form-card">

  <div class="review-form-header">

<div class="review-header-stars">

★★★★★

</div>

<h2>

Bạn cảm thấy sản phẩm như thế nào?

</h2>

<p>

Hãy chia sẻ trải nghiệm của bạn để giúp những khách hàng khác có thêm thông tin trước khi mua.

</p>

</div>

    <form id="reviewForm">

        <!-- Rating -->


           <div class="review-form-group">

    <label>Đánh giá của bạn</label>

    <div class="rating-picker">

        <i class="bi bi-star" data-rate="1"></i>

        <i class="bi bi-star" data-rate="2"></i>

        <i class="bi bi-star" data-rate="3"></i>

        <i class="bi bi-star" data-rate="4"></i>

        <i class="bi bi-star" data-rate="5"></i>

    </div>

    <span
        id="ratingText"
        class="rating-text"
    >
        Chọn số sao
    </span>

</div>

  

        <!-- Title -->

      <div class="review-form-group">

    <label>Tiêu đề</label>

    <div class="input-box">

        <i class="bi bi-pencil-square"></i>

        <input

            id="reviewTitle"

            type="text"

            placeholder="Ví dụ: Bánh rất ngon"

        >

    </div>

</div>

        <!-- Content -->
<div class="review-form-group">

<label>Nội dung đánh giá</label>

<div class="textarea-box">

<i class="bi bi-chat-left-text"></i>

<textarea

id="reviewContent"

rows="6"

placeholder="Hãy chia sẻ trải nghiệm của bạn..."

></textarea>

</div>

</div>

        <!-- Upload -->

        <div class="review-form-group">

            <label>Hình ảnh</label>

            <label class="upload-box">

                <input

                    type="file"

                    id="reviewImages"

                    accept="image/*"

                    multiple

                    hidden

                >

                <i class="bi bi-camera-fill"></i>

                <span>Thêm hình ảnh</span>

            </label>

            <div
                id="previewImages"
                class="preview-images"
            ></div>

        </div>
        <div class ="wrap-btn-submit">
        <button

            class="submit-review-btn"

            type="submit"

        >
          <i class="bi bi-send-fill"></i>
            Gửi đánh giá

        </button> </div>

    </form>

</section>




 
</div>
    `;
  productDetail.innerHTML = html;
  bindProductEvents();
}

function initProductDetail() {
  renderProduct();

  initGallery();

  initZoom();
  // initBuyBar();

  initTabs();
  initReviewFilter();

  initImageViewer();
  initRatingPicker();

  //load image
  initReviewUpload();
  // renderReviews();
}

function bindProductEvents() {
  const btn = document.getElementById("detailAddCart");

  if (btn) {
    btn.addEventListener("click", handleAddToCart);
  }
  //   initGallery();

  //   initZoom();

  initQuantity();
}

function initQuantity() {
  const input = document.getElementById("quantityInput");

  const minus = document.getElementById("minusBtn");

  const plus = document.getElementById("plusBtn");

  if (!input) return;

  minus.onclick = () => {
    let value = Number(input.value);

    if (value > 1) {
      input.value = value - 1;
    }
  };

  plus.onclick = () => {
    let value = Number(input.value);

    input.value = value + 1;
  };
}
// renderProduct();

document.addEventListener("DOMContentLoaded", () => {
  initProductDetail();
});

function initGallery() {
  const thumbs = document.querySelectorAll(".thumb");

  const mainImage = document.getElementById("mainProductImage");

  if (!thumbs.length || !mainImage) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      mainImage.src = this.dataset.image;

      thumbs.forEach((item) => {
        item.classList.remove("active");
      });

      this.classList.add("active");

      // Reset Zoom khi đổi ảnh
      mainImage.style.transform = "scale(1)";
    });
  });
}

function initZoom() {
  const wrapper = document.querySelector(".main-image-wrapper");

  const image = document.getElementById("mainProductImage");

  if (!wrapper || !image) return;

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    const px = (x / rect.width) * 100;

    const py = (y / rect.height) * 100;

    image.style.transform = "scale(2)";

    image.style.transformOrigin = `${px}% ${py}%`;
  });

  wrapper.addEventListener("mouseleave", () => {
    image.style.transform = "scale(1)";
  });
}

// console.log(document.querySelectorAll(".thumb"));

// document.querySelectorAll(".thumb").forEach((img) => {
//   img.onclick = () => {
//     document.getElementById("mainProductImage").src = img.dataset.image;

//     document
//       .querySelectorAll(".thumb")
//       .forEach((i) => i.classList.remove("active"));

//     img.classList.add("active");
//   };
// });

// //Main warp

// const wrapper = document.querySelector(".main-image-wrapper");

// const image = document.getElementById("mainProductImage");

// const lens = document.querySelector(".image-lens");

// wrapper.addEventListener("mousemove", (e) => {
//   const rect = wrapper.getBoundingClientRect();

//   const x = e.clientX - rect.left;

//   const y = e.clientY - rect.top;

//   const px = (x / rect.width) * 100;

//   const py = (y / rect.height) * 100;

//   image.style.transform = "scale(2)";

//   image.style.transformOrigin = `${px}% ${py}%`;
// });

// wrapper.addEventListener("mouseleave", () => {
//   image.style.transform = "scale(1)";
// });

// document.querySelectorAll(".thumb").forEach((img) => {
//   img.addEventListener("click", () => {
//     console.log("Đã click thumbnail");
//   });
// });

//Event for add product
function handleAddToCart() {
  //   const quantity = Number(document.getElementById("quantityInput")?.value || 1);

  //   const product = products.find((item) => item.id === id);

  //   if (!product) return;

  //   const exist = cart.find((item) => item.id === id);

  //   if (exist) {
  //     exist.quantity += quantity;
  //   } else {
  //     cart.push({
  //       ...product,

  //       quantity,
  //     });
  //   }
  addToCart(productId);
  saveCart();

  updateCartBadge();

  renderCart();

  //   showToast("success", "Đã thêm vào giỏ hàng", product.name);

  flyToCartDetail();
}

function quadraticBezier(t, p0, p1, p2) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

function flyToCartDetail() {
  const productImage = document.getElementById("mainProductImage");

  const cartIcon = document.querySelector(".cart-action");

  if (!productImage || !cartIcon) return;

  const imageRect = productImage.getBoundingClientRect();

  const cartRect = cartIcon.getBoundingClientRect();

  //   const clone = productImage.cloneNode(true);

  const clone = new Image();

  clone.src = productImage.src;

  clone.className = "fly-product";

  clone.classList.add("fly-product");

  clone.style.left = imageRect.left + "px";
  clone.style.top = imageRect.top + "px";

  clone.style.width = imageRect.width + "px";
  clone.style.height = imageRect.height + "px";

  document.body.appendChild(clone);

  console.log("Bắt đầu animation");
  requestAnimationFrame(() => {
    const startX = imageRect.left;
    const startY = imageRect.top;

    const endX = cartRect.left + cartRect.width / 2 - 15;

    const endY = cartRect.top + cartRect.height / 2 - 15;

    const controlX = (startX + endX) / 2;

    const controlY = startY - 180;

    const duration = 700;

    const startTime = performance.now();

    function animate(time) {
      console.log("animate", time);
      let progress = (time - startTime) / duration;

      progress = Math.min(progress, 1);

      const x = quadraticBezier(progress, startX, controlX, endX);

      const y = quadraticBezier(progress, startY, controlY, endY);

      const endSize = 30;

      clone.style.width = imageRect.width + "px";
      clone.style.height = imageRect.height + "px";

      // Thu nhỏ theo 2 giai đoạn
      clone.style.left = x + "px";
      clone.style.top = y + "px";

      clone.style.transform = "scale(0.2)";

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clone.remove();

        animateCart();

        cartRipple();
      }
    }

    requestAnimationFrame(animate);
  });
}
function cartRipple() {
  const cartIcon = document.querySelector(".cart-action");

  const rect = cartIcon.getBoundingClientRect();

  const ripple = document.createElement("div");

  ripple.className = "cart-ripple";

  ripple.style.left = rect.left + rect.width / 2 - 10 + "px";

  ripple.style.top = rect.top + rect.height / 2 - 10 + "px";

  document.body.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

//Floating

const buyBarImage = document.getElementById("buyBarImage");

const buyBarName = document.getElementById("buyBarName");

const buyBarPrice = document.getElementById("buyBarPrice");

buyBarImage.src = product.image;

buyBarName.textContent = product.name;

buyBarPrice.textContent = product.price.toLocaleString("vi-VN") + "đ";
const buyBar = document.getElementById("buyBar");

// function initBuyBar() {
//   const buyBar = document.getElementById("buyBar");

//   const addButton = document.querySelector(".detail-add-cart");

//   if (!buyBar || !addButton) return;

//   window.addEventListener("scroll", () => {
//     const rect = addButton.getBoundingClientRect();

//     if (rect.bottom < 0) {
//       buyBar.classList.add("show");
//     } else {
//       buyBar.classList.remove("show");
//     }
//   });
// }
function initBuyBar() {
  const buyBar = document.getElementById("buyBar");
  const detailInfo = document.querySelector(".detail-add-cart");

  if (!buyBar || !detailInfo) return;

  window.addEventListener("scroll", () => {
    const rect = detailInfo.getBoundingClientRect();

    // if (rect.bottom < 120) {
    //   buyBar.classList.add("show");
    // } else {
    //   buyBar.classList.remove("show");
    // }
    const triggerPoint = rect.top + rect.height * 0.6;

    if (triggerPoint < 120) {
      buyBar.classList.add("show");
    } else {
      buyBar.classList.remove("show");
    }
  });
}

//Descreption
function initTabs() {
  let reviewInitialized = false;
  const tabButtons = document.querySelectorAll(".tab-btn");

  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.onclick = () => {
      tabButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      tabContents.forEach((tab) => {
        tab.classList.remove("active");
      });

      button.classList.add("active");

      document.getElementById(button.dataset.tab).classList.add("active");

      // Chỉ render review khi mở tab Review lần đầu
      if (button.dataset.tab === "review" && !reviewInitialized) {
        renderReviewList();

        initReviewFilter();

        reviewInitialized = true;
      }
    };
  });
}

// function createProgress(star, count, total) {
//   const percent = (count / total) * 100;

//   return `
//     <div class="progress-row">

//         <span>${star}★</span>

//         <div class="progress">

//             <div
//                 class="progress-fill"
//                 style="width:${percent}%">
//             </div>

//         </div>

//         <span>${count}</span>

//     </div>
//   `;
// }

//Reviews

// function renderReviews() {
//   return `

// <div class="review-item">

// <div class="review-avatar">

// N

// </div>

// <div class="review-body">

// <div class="review-name">

// Nguyễn Văn A

// </div>

// <div class="review-rating">

// ★★★★★

// </div>

// <div class="review-date">

// Đã mua hàng

// </div>

// <p>

// Bánh rất ngon, ít ngọt,
// ăn không bị ngấy.

// </p>

// <div class="review-images">

// <img src="${product.images[0]}">

// <img src="${product.images[1]}">

// </div>

// </div>

// </div>

// `;
// }

const reviews = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "N",
    rating: 5,
    date: "Đã mua hàng",
    text: "Bánh rất ngon, thơm mùi sầu riêng, đóng gói đẹp.",
    images: [
      "assets/images/products/pia1.png",
      "assets/images/products/pia2.png",
    ],
  },

  {
    id: 2,
    name: "Trần Minh",
    avatar: "T",
    rating: 5,
    date: "Đã mua hàng",
    text: "Mình sẽ tiếp tục ủng hộ.",
    images: [],
  },

  {
    id: 3,
    name: "Lê Hải",
    avatar: "L",
    rating: 4,
    date: "Đã mua hàng",
    text: "Bánh ngon, giao nhanh.",
    images: ["assets/images/products/pia3.png"],
  },
];

function renderReviewList(data = reviews) {
  const reviewList = document.querySelector(".review-list");

  if (!reviewList) return;

  reviewList.innerHTML = "";

  if (data.length === 0) {
    reviewList.innerHTML = `
      <div class="empty-review">
          Không có đánh giá phù hợp.
      </div>
    `;
    return;
  }

  reviewList.innerHTML = data
    .map(
      (review) => `
    
    <div class="review-item">

        <div class="review-avatar">

            ${review.avatar}

        </div>

        <div class="review-body">

            <div class="review-name">

                ${review.name}

            </div>

            <div class="review-rating">

                ${"★".repeat(review.rating)}

            </div>

            <div class="review-date">
              <i class="bi bi-patch-check-fill"></i>
                ${review.date}

            </div>

            <p>

                ${review.text}

            </p>

            ${
              review.images.length
                ? `
            <div class="review-images">

                ${review.images
                  .map(
                    (img) => `
                    <img src="${img}">
                `,
                  )
                  .join("")}

            </div>
            `
                : ""
            }

        </div>

    </div>

    `,
    )
    .join("");
}
function initReviewFilter() {
  const buttons = document.querySelectorAll(".review-filter button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));

      button.classList.add("active");

      const filter = button.dataset.filter;

      let result = reviews;

      switch (filter) {
        case "image":
          result = reviews.filter((review) => review.images.length > 0);
          break;

        case "5":
          result = reviews.filter((review) => review.rating === 5);
          break;

        case "4":
          result = reviews.filter((review) => review.rating === 4);
          break;

        case "3":
          result = reviews.filter((review) => review.rating === 3);
          break;

        default:
          result = reviews;
      }

      renderReviewList(result);
    });
  });
}

//LightBOX

let currentReviewImages = [];
let currentIndex = 0;

document.addEventListener("click", (e) => {
  if (!e.target.matches(".review-images img")) return;

  const images = [
    ...e.target.closest(".review-images").querySelectorAll("img"),
  ];

  currentReviewImages = images;

  currentIndex = images.indexOf(e.target);

  document.getElementById("lightboxImage").src = e.target.src;

  document.getElementById("reviewLightbox").classList.add("show");
});

//Click on close
document.getElementById("lightboxClose").onclick = () => {
  document.getElementById("reviewLightbox").classList.remove("show");
};

//Previous
document.getElementById("lightboxPrev").onclick = () => {
  currentIndex--;

  if (currentIndex < 0) currentIndex = currentReviewImages.length - 1;

  document.getElementById("lightboxImage").src =
    currentReviewImages[currentIndex].src;
};

//Next
document.getElementById("lightboxNext").onclick = () => {
  currentIndex++;

  if (currentIndex >= currentReviewImages.length) currentIndex = 0;

  document.getElementById("lightboxImage").src =
    currentReviewImages[currentIndex].src;
};
//ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("reviewLightbox").classList.remove("show");
  }
});

//CLick outline
document.getElementById("reviewLightbox").addEventListener("click", (e) => {
  if (e.target.id === "reviewLightbox") {
    e.currentTarget.classList.remove("show");
  }
});

//New reposive for 576px

// function initImageViewer() {
//   const mainImage = document.getElementById("mainProductImage");

//   if (!mainImage) return;

//   viewerImages = [...document.querySelectorAll(".thumb")].map(
//     (img) => img.dataset.image,
//   );

//   mainImage.onclick = () => {
//     viewerIndex = 0;

//     viewerScale = 1;

//     document.getElementById("viewerImage").src = mainImage.src;

//     document.getElementById("viewerImage").style.transform = "scale(1)";

//     document.getElementById("imageViewer").classList.add("show");
//   };
// }
// document.getElementById("viewerClose").onclick = () => {
//   document.getElementById("imageViewer").classList.remove("show");
// };
// document.querySelector(".viewer-overlay").onclick = () => {
//   document.getElementById("imageViewer").classList.remove("show");
// };
// const viewerImage = document.getElementById("viewerImage");

// viewerImage.addEventListener("wheel", (e) => {
//   e.preventDefault();

//   if (e.deltaY < 0) {
//     viewerScale += 0.2;
//   } else {
//     viewerScale -= 0.2;
//   }

//   viewerScale = Math.max(1, Math.min(4, viewerScale));

//   viewerImage.style.transform = `scale(${viewerScale})`;
// });
// document.getElementById("viewerPrev").onclick = () => {
//   viewerIndex--;

//   if (viewerIndex < 0) {
//     viewerIndex = viewerImages.length - 1;
//   }

//   viewerImage.src = viewerImages[viewerIndex];
// };
// document.getElementById("viewerNext").onclick = () => {
//   viewerIndex++;

//   if (viewerIndex >= viewerImages.length) {
//     viewerIndex = 0;
//   }

//   viewerImage.src = viewerImages[viewerIndex];
// };

const ImageViewer = {
  images: [],
  currentIndex: 0,

  scale: 1,
  translateX: 0,
  translateY: 0,

  dragging: false,
  startX: 0,
  startY: 0,

  viewer: null,
  image: null,
  stage: null,

  touchStartX: 0,
  touchStartY: 0,

  initialDistance: 0,
};

// function openViewer(images, index = 0) {
//   ImageViewer.images = images;
//   ImageViewer.currentIndex = index;

//   ImageViewer.scale = 1;
//   ImageViewer.translateX = 0;
//   ImageViewer.translateY = 0;

//   ImageViewer.image.src = images[index];

//   ImageViewer.image.style.transform = "translate(0px,0px) scale(1)";

//   ImageViewer.viewer.classList.add("show");
// }

function openViewer(images, index = 0) {
  ImageViewer.images = images;

  ImageViewer.viewer.classList.add("show");

  changeViewerImage(index);
}
function closeViewer() {
  ImageViewer.viewer.classList.remove("show");
}
function updateViewerTransform() {
  ImageViewer.image.style.transform = `
    translate(${ImageViewer.translateX}px, ${ImageViewer.translateY}px)
    scale(${ImageViewer.scale})
  `;
}
function getDistance(t1, t2) {
  const dx = t1.clientX - t2.clientX;

  const dy = t1.clientY - t2.clientY;

  return Math.sqrt(dx * dx + dy * dy);
}

function changeViewerImage(index) {
  ImageViewer.currentIndex = index;

  ImageViewer.scale = 1;
  ImageViewer.translateX = 0;
  ImageViewer.translateY = 0;

  ImageViewer.image.animate(
    [
      {
        opacity: 0.3,
        transform: "scale(.96)",
      },
      {
        opacity: 1,
        transform: "scale(1)",
      },
    ],
    {
      duration: 220,
      easing: "ease",
    },
  );

  ImageViewer.image.src = ImageViewer.images[index];

  updateViewerTransform();
}

function initImageViewer() {
  ImageViewer.viewer = document.getElementById("imageViewer");

  ImageViewer.image = document.getElementById("viewerImage");

  ImageViewer.stage = document.querySelector(".viewer-stage");

  const mainImage = document.getElementById("mainProductImage");

  if (!mainImage) return;

  const thumbs = [...document.querySelectorAll(".thumb")];

  const images = thumbs.map((img) => img.dataset.image);

  // Click ảnh chính
  mainImage.onclick = () => {
    const current = mainImage.src;

    const index = images.findIndex((img) => current.includes(img));

    openViewer(images, index === -1 ? 0 : index);
  };

  // Click thumbnail
  // thumbs.forEach((thumb, index) => {
  //   // thumb.onclick = () => {
  //   //   openViewer(images, index);
  //   // };

  //   thumb.addEventListener("click", () => {
  //     openViewer(images, index);
  //   });
  // });

  document.getElementById("viewerClose").onclick = closeViewer;

  document.querySelector(".viewer-overlay").onclick = closeViewer;

  //Click change image

  document.getElementById("viewerPrev").onclick = () => {
    let index = ImageViewer.currentIndex - 1;

    if (index < 0) {
      index = ImageViewer.images.length - 1;
    }

    changeViewerImage(index);
  };

  document.getElementById("viewerNext").onclick = () => {
    let index = ImageViewer.currentIndex + 1;

    if (index >= ImageViewer.images.length) {
      index = 0;
    }

    changeViewerImage(index);
  };

  // Double Click Zoom
  ImageViewer.image.addEventListener("dblclick", (e) => {
    const rect = ImageViewer.image.getBoundingClientRect();

    if (ImageViewer.scale === 1) {
      ImageViewer.scale = 2;

      const x = e.clientX - rect.left;

      const y = e.clientY - rect.top;

      ImageViewer.translateX = rect.width / 2 - x;

      ImageViewer.translateY = rect.height / 2 - y;
    } else {
      ImageViewer.scale = 1;

      ImageViewer.translateX = 0;

      ImageViewer.translateY = 0;
    }

    updateViewerTransform();
  });

  // Zoom bằng con lăn
  ImageViewer.image.addEventListener("wheel", (e) => {
    e.preventDefault();

    if (e.deltaY < 0) {
      ImageViewer.scale += 0.2;
    } else {
      ImageViewer.scale -= 0.2;
    }

    ImageViewer.scale = Math.max(1, Math.min(4, ImageViewer.scale));

    if (ImageViewer.scale === 1) {
      ImageViewer.translateX = 0;
      ImageViewer.translateY = 0;
    }

    updateViewerTransform();
  });

  ImageViewer.image.addEventListener("mousedown", (e) => {
    if (ImageViewer.scale === 1) return;

    ImageViewer.dragging = true;

    ImageViewer.startX = e.clientX - ImageViewer.translateX;

    ImageViewer.startY = e.clientY - ImageViewer.translateY;

    ImageViewer.image.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!ImageViewer.dragging) return;

    ImageViewer.translateX = e.clientX - ImageViewer.startX;

    ImageViewer.translateY = e.clientY - ImageViewer.startY;

    updateViewerTransform();
  });

  window.addEventListener("mouseup", () => {
    ImageViewer.dragging = false;

    ImageViewer.image.style.cursor = "grab";
  });

  //Moblie action

  ImageViewer.stage.addEventListener(
    "touchstart",
    (e) => {
      // Swipe
      if (e.touches.length === 1) {
        ImageViewer.touchStartX = e.touches[0].clientX;

        ImageViewer.touchStartY = e.touches[0].clientY;
      }

      // Drag khi zoom
      if (e.touches.length === 1 && ImageViewer.scale > 1) {
        ImageViewer.dragging = true;

        ImageViewer.startX = e.touches[0].clientX - ImageViewer.translateX;

        ImageViewer.startY = e.touches[0].clientY - ImageViewer.translateY;
      }

      // Pinch
      if (e.touches.length === 2) {
        ImageViewer.initialDistance = getDistance(e.touches[0], e.touches[1]);
      }
    },
    { passive: true },
  );

  ImageViewer.stage.addEventListener(
    "touchmove",
    (e) => {
      // Drag ảnh khi zoom
      if (ImageViewer.dragging && e.touches.length === 1) {
        ImageViewer.translateX = e.touches[0].clientX - ImageViewer.startX;

        ImageViewer.translateY = e.touches[0].clientY - ImageViewer.startY;

        updateViewerTransform();
      }

      // Pinch Zoom
      if (e.touches.length === 2) {
        e.preventDefault();

        const distance = getDistance(e.touches[0], e.touches[1]);

        const scale = distance / ImageViewer.initialDistance;

        ImageViewer.scale *= scale;

        ImageViewer.scale = Math.max(1, Math.min(4, ImageViewer.scale));

        ImageViewer.initialDistance = distance;

        updateViewerTransform();
      }
    },
    { passive: false },
  );

  ImageViewer.stage.addEventListener("touchend", (e) => {
    ImageViewer.dragging = false;

    // Swipe đổi ảnh
    if (e.changedTouches.length === 1 && ImageViewer.scale === 1) {
      const deltaX = e.changedTouches[0].clientX - ImageViewer.touchStartX;

      if (Math.abs(deltaX) < 60) return;

      if (deltaX < 0) {
        document.getElementById("viewerNext").click();
      } else {
        document.getElementById("viewerPrev").click();
      }
    }
  });
}

//Rating

let selectedRating = 0;

function initRatingPicker() {
  const stars = document.querySelectorAll(".rating-picker i");

  const ratingText = document.getElementById("ratingText");

  const labels = {
    1: "😢 Xin lỗi vì trải nghiệm chưa tốt. Chúng mình sẽ cải thiện.",

    2: "😕 Chúng mình rất tiếc. Điều gì chưa tốt?",

    3: "🙂 Bình thường. Hãy chia sẻ thêm trải nghiệm của bạn.",

    4: "😊 Rất tốt! Điều gì khiến bạn chưa thật sự hài lòng?",

    5: "😍 Tuyệt vời! Cảm ơn bạn đã yêu thích sản phẩm.",
  };

  stars.forEach((star) => {
    star.addEventListener("mouseenter", () => {
      const rate = Number(star.dataset.rate);

      highlightStars(rate);

      ratingText.textContent = labels[rate];
    });

    star.addEventListener("click", () => {
      selectedRating = Number(star.dataset.rate);

      highlightStars(selectedRating);

      ratingText.textContent = labels[selectedRating];
      console.log("Select:" + selectedRating);

      if (selectedRating >= 3) {
        ratingText;
        ratingText.style.backgroundColor = "#d4edda";
        ratingText.style.color = "#155724";
      } else {
        ratingText.style.color = "#d93025";
        ratingText.style.backgroundColor = "#fce8e6";
      }
    });
  });

  document
    .querySelector(".rating-picker")
    .addEventListener("mouseleave", () => {
      highlightStars(selectedRating);

      ratingText.textContent = selectedRating
        ? labels[selectedRating]
        : "Chọn số sao";
    });
}

function highlightStars(rate) {
  document.querySelectorAll(".rating-picker i").forEach((star) => {
    star.classList.toggle(
      "active",

      Number(star.dataset.rate) <= rate,
    );
  });
}

//load image

let reviewFiles = [];

function initReviewUpload() {
  const input = document.getElementById("reviewImages");

  const preview = document.getElementById("previewImages");

  if (!input || !preview) return;

  input.addEventListener("change", (e) => {
    const files = [...e.target.files];

    files.forEach((file) => {
      if (reviewFiles.length >= 6) return;

      reviewFiles.push(file);
    });

    renderPreviewImages();
  });
}

function renderPreviewImages() {
  const preview = document.getElementById("previewImages");

  preview.innerHTML = "";

  reviewFiles.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.innerHTML += `

                <div class="preview-item">

                    <img src="${e.target.result}">

                    <button
                        class="preview-remove"
                        data-index="${index}"
                    >

                        <i class="bi bi-x"></i>

                    </button>

                </div>

            `;

      bindRemovePreview();
    };

    reader.readAsDataURL(file);
  });
}

function bindRemovePreview() {
  document.querySelectorAll(".preview-remove").forEach((btn) => {
    btn.onclick = () => {
      reviewFiles.splice(btn.dataset.index, 1);

      renderPreviewImages();
    };
  });
}
