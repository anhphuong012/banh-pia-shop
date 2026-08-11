const shopProducts = document.getElementById("shopProducts");
function renderProducts() {
  shopProducts.innerHTML = "";
  let html = "";

  products.slice(0, 6).forEach((product) => {
    html += `

         <article
                class="product-card"

                data-id="${product.id}"
                data-name="${product.name}"
                data-price="${product.price}"
                data-image="${product.image}"
              >
                <div class="product-image">
                  <!-- Badge giảm giá -->
                  <span class="product-badge ${product.isNew ? "badge-new" : ""}"> ${product.isHot ? "Hot" : product.isNew ? "New" : "-" + product.discount + "%"} </span>

                  <!-- Wishlist -->
                  <button class="product-favorite">
                    <i class="bi bi-heart"></i>
                  </button>

                  <!-- Ảnh 
                  <img
                    src="${product.image}"
                    alt="Bánh Pía Kim Sa"
                  />-->

                  <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                  </a>
                  <!--Quick view-->

                  <a  href="product-detail.html?id=${product.id}" class="quick-view-shop" >
                    <i class="bi bi-eye"></i>

                    Xem nhanh
                  </a>
                </div>

                <div class="product-info">
                  <!-- Rating -->
                  <div class="product-rating">
                    <div class="stars">${renderStars(product.rating)}</div>

                    <span>(${product.reviewCount})</span>
                  </div>

                  <!-- Product Name -->
                  <a href="product-detail.html?id=${product.id}">
                    <h3 class="product-name">${product.name}</h3></a
                  >

                  <!-- Description -->
                  <div class="product-desc">

    <span>

        <i class="bi bi-box-seam"></i>

        Hộp 6 bánh

    </span>

    <span>

        <i class="bi bi-speedometer2"></i>

        480g

    </span>

</div>
                  <!-- Product Price -->
                  <div class="product-price">
                    <span class="price-current"> ${product.price.toLocaleString("vi-VN")}đ </span>

                    <span class="price-old"> ${product.oldPrice.toLocaleString("vi-VN")}đ </span>
                  </div>

                 <!-- <div class="product-saving">Tiết kiệm 40.000đ</div>-->
                  <!-- Product Meta -->
                  <div class="product-meta">
                    <span>
                      <i class="bi bi-truck"></i>
                      Miễn phí ship
                    </span>

                    <span>
                      <i class="bi bi-fire"></i>
                      Đã bán ${product.sold}
                    </span>
                  </div>

                  <!-- Button  -->
                  <button class="product-cart"  >
                    <i class="bi bi-cart-plus"></i>

                    Thêm vào giỏ
                  </button>
                </div>
              </article>

        `;
  });
  shopProducts.innerHTML = html;
  bindProductEvents();
}

function quadraticBezier(t, p0, p1, p2) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}
function flyToCart(card) {
  const productImage = card.querySelector(".product-image img");
  const cartIcon = document.querySelector(".cart-action");

  if (!productImage || !cartIcon) return;

  const imageRect = productImage.getBoundingClientRect();

  const cartRect = cartIcon.getBoundingClientRect();

  // Clone ảnh
  const clone = productImage.cloneNode(true);

  clone.classList.add("fly-product");

  clone.style.left = imageRect.left + "px";
  clone.style.top = imageRect.top + "px";
  clone.style.width = imageRect.width + "px";
  clone.style.height = imageRect.height + "px";

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    const startX = imageRect.left;
    const startY = imageRect.top;

    const endX = cartRect.left + cartRect.width / 2 - 15;

    const endY = cartRect.top + cartRect.height / 2 - 15;

    /*
    Điểm điều khiển
*/

    const controlX = (startX + endX) / 2;

    const controlY = startY - 180;

    const duration = 700;

    const startTime = performance.now();

    function animate(time) {
      let progress = (time - startTime) / duration;

      progress = Math.min(progress, 1);

      const x = quadraticBezier(progress, startX, controlX, endX);

      const y = quadraticBezier(progress, startY, controlY, endY);

      clone.style.left = x + "px";

      clone.style.top = y + "px";

      clone.style.width = 120 - progress * 90 + "px";

      clone.style.height = 120 - progress * 90 + "px";

      clone.style.opacity = 1 - progress * 0.8;

      // clone.style.transform = `rotate(${progress * 720}deg)`;
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

  setTimeout(() => {
    clone.remove();

    animateCart();
  }, 1000);

  console.log("Clone tạo thành công");
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
function bindProductEvents() {
  const addButtons = document.querySelectorAll(".product-cart");

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");

      const id = Number(card.dataset.id);

      addToCart(id);

      flyToCart(card);
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const decimal = rating - fullStars;

  let stars = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += `<i class="bi bi-star-fill"></i>`;
    } else if (i === fullStars + 1 && decimal >= 0.5) {
      stars += `<i class="bi bi-star-half"></i>`;
    } else {
      stars += `<i class="bi bi-star"></i>`;
    }
  }

  return stars;
}
