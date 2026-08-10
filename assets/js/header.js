const cartBadgeAction = document.querySelector(".action-badge");

console.log(cartBadgeAction);

cartBadgeAction.classList.add("bounce");

setTimeout(() => {
  cartBadgeAction.classList.remove("bounce");
}, 450);

//Cart event open
/*=====================================
MINI CART
=====================================*/

// const cartDrawer = document.querySelector(".cart-drawer");

// const cartOverlay = document.querySelector(".cart-overlay");

// const cartButton = document.querySelector(".action-item");

// const closeCart = document.querySelector(".close-cart");

// const cartBody = document.querySelector(".cart-body");
// const cartButton = document.querySelector(".cart-action");

// const cartBadge = document.querySelector(".action-badge");

// const subtotal = document.getElementById("cartSubtotal");

// const total = document.getElementById("cartTotal");

// const addButtons = document.querySelectorAll(".product-cart");

// let cart = [];

const cartDrawer = document.querySelector(".cart-drawer");

const cartOverlay = document.querySelector(".cart-overlay");

const cartButton = document.querySelector(".cart-action");

const closeCart = document.querySelector(".close-cart");

const cartBody = document.querySelector(".cart-body");

// const cartBadge = document.querySelector(".action-badge");

const subtotal = document.getElementById("cartSubtotal");

const total = document.getElementById("cartTotal");

const addButtons = document.querySelectorAll(".product-cart");

console.log(addButtons);
console.log(addButtons.length);

//Shiping
const FREE_SHIPPING = 500000;

let cart = [];

function openCart() {
  cartDrawer.classList.add("show");

  cartOverlay.classList.add("show");

  document.body.style.overflow = "hidden";

  // THÊM DÒNG NÀY: Bật class để ẩn nút floating giỏ hàng
  document.body.classList.add("cart-open");
}
function closeCartDrawer() {
  cartDrawer.classList.remove("show");

  cartOverlay.classList.remove("show");

  document.body.style.overflow = "";

  // THÊM DÒNG NÀY: Xóa class khi đóng giỏ hàng
  document.body.classList.remove("cart-open");
}

//Event
// cartButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log(cartButton);
//   openCart();
// });

cartButton.addEventListener("click", (e) => {
  e.preventDefault();

  console.log("Cart Click");

  openCart();
});
closeCart.addEventListener("click", () => {
  closeCartDrawer();
});

cartOverlay.addEventListener("click", () => {
  closeCartDrawer();
});

//Render

function renderCart() {
  cartBody.innerHTML = "";
  if (cart.length === 0) {
    cartBody.innerHTML = `

            <div class="cart-empty">

                <i class="bi bi-cart-x"></i>

                <h3>Giỏ hàng đang trống</h3>

                <p>Hãy thêm sản phẩm để tiếp tục mua sắm.</p>

            </div>

        `;
    resetCartSummary();
    return;
  }
  let totalPrice = 0;

  cart.forEach((item) => {
    console.log(" Da vao go hang");
    totalPrice += item.price * item.quantity;

    // cartBody.innerHTML += `

    //     <div class="cart-item">

    //         <div class="cart-image">
    //             <img src="${item.image}" alt="${item.name}">
    //         </div>

    //         <div class="cart-info">

    //             <h4>${item.name}</h4>

    //             <div class="cart-price">
    //                 ${item.price.toLocaleString("vi-VN")}đ
    //             </div>

    //             <div class="cart-quantity">

    //                 <button class="qty-minus"
    //                     onclick="decreaseQuantity(${item.id})">

    //                     <i class="bi bi-dash"></i>

    //                 </button>

    //                 <span>${item.quantity}</span>

    //                 <button class="qty-plus"
    //                     onclick="increaseQuantity(${item.id})">

    //                     <i class="bi bi-plus"></i>

    //                 </button>

    //             </div>

    //         </div>

    //         <button class="cart-remove"
    //             onclick="removeCartItem(${item.id})">

    //             <i class="bi bi-trash3"></i>

    //         </button>

    //     </div>

    //     ;

    cartBody.innerHTML += `<div class="cart-item">

    <div class="cart-thumb">

        <img src="${item.image}" alt="${item.name}">

    </div>

    <div class="cart-content">

        <h4>${item.name}</h4>

        <p>Hộp 6 bánh • 480g</p>

        <div class="cart-price">

            ${item.price.toLocaleString("vi-VN")}đ

        </div>

        <div class="cart-bottom">

            <div class="cart-quantity">

                <button onclick="decreaseQuantity(${item.id})">

                    <i class="bi bi-dash"></i>

                </button>

                <span>${item.quantity}</span>

                <button onclick="increaseQuantity(${item.id})">

                    <i class="bi bi-plus"></i>

                </button>

            </div>

            <button class="cart-remove"

                onclick="removeCartItem(${item.id})">

                <i class="bi bi-trash3"></i>

            </button>

        </div>

    </div>

</div>`;
  });

  //Update Quanlyty
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("cartCount").textContent = totalItems;
  //Total

  subtotal.textContent = totalPrice.toLocaleString("vi-VN") + "đ";

  total.textContent = totalPrice.toLocaleString("vi-VN") + "đ";

  const progress = Math.min(totalPrice / FREE_SHIPPING, 1);

  document.getElementById("shippingFill").style.width = progress * 100 + "%";
  const remain = FREE_SHIPPING - totalPrice;

  if (remain > 0) {
    document.getElementById("shippingMessage").innerHTML =
      `Mua thêm <strong>${remain.toLocaleString("vi-VN")}đ</strong>
        để được miễn phí vận chuyển`;
  } else {
    document.getElementById("shippingMessage").innerHTML =
      `🎉 Bạn đã được miễn phí vận chuyển`;
  }
}

//

// function addToCart(card) {
//   const product = {
//     id: Number(card.dataset.id),

//     name: card.dataset.name,

//     price: Number(card.dataset.price),

//     image: card.dataset.image,

//     quantity: 1,
//   };

//   console.log(product);
// }
// addButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     const card = button.closest(".product-card");
//     console.log("Click");
//     addToCart(card);
//     // animateCartBadge();
//     console.log("bat dau goi fly to cart");
//     flyToCart(card);
//   });
// });

// addButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     const card = button.closest(".product-card");

//     const id = Number(card.dataset.id);

//     addToCart(id);
//     console.log("Ready add to card");
//     flyToCart(card);
//   });
// });

function addToCart(id) {
  console.log("id:" + id);
  const product = products.find((item) => item.id === id);
  const quantity = Number(document.getElementById("quantityInput")?.value || 1);

  if (!product) return;

  const exist = cart.find((item) => item.id === id);

  if (exist) {
    console.log("da co san pham");
    exist.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity: quantity,
    });
  }

  console.log(cart);

  updateCartBadge();

  renderCart();
  saveCart();

  // showToast("success", "Đã thêm vào giỏ hàng", product.name);
}

//function update badge
function updateCartBadge() {
  const totalQuantity = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartBadgeAction.textContent = totalQuantity;
}
function increaseQuantity(id) {
  const item = cart.find((product) => product.id === id);

  if (!item) return;

  item.quantity++;

  renderCart();
  saveCart();
}
function decreaseQuantity(id) {
  const item = cart.find((product) => product.id === id);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    removeCartItem(id);

    return;
  }

  renderCart();
  saveCart();
}
function removeCartItem(id) {
  cart = cart.filter((item) => item.id !== id);

  renderCart();
  saveCart();
}
function animateCartBadge() {
  const badge = document.querySelector(".action-badge");

  badge.classList.remove("bounce");

  void badge.offsetWidth;

  badge.classList.add("bounce");
}
function resetCartSummary() {
  subtotal.textContent = "0đ";
  total.textContent = "0đ";

  document.getElementById("cartCount").textContent = 0;

  document.querySelector(".action-badge").textContent = 0;

  document.getElementById("shippingFill").style.width = "0%";

  document.getElementById("shippingMessage").innerHTML =
    `Mua thêm <strong>${FREE_SHIPPING.toLocaleString("vi-VN")}đ</strong> để được miễn phí vận chuyển`;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
/*=====================================
LOAD CART
=====================================*/

function loadCart() {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

//TOAST

function showToast(type, title, message) {
  const container = document.getElementById("toastContainer");
  console.log(container);
  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  toast.innerHTML = `

      <div class="toast-icon">
        <i class="bi ${
          type === "success" ? "bi-check2-circle" : "bi-exclamation-circle"
        }"></i>
    </div>

    <div class="toast-content">

        <div class="toast-title">
            ${title}
        </div>

        <div class="toast-message">
            ${message}
        </div>

        <div class="toast-progress">
            <span></span>
        </div>

    </div>

    `;

  container.appendChild(toast);

  console.log(document.getElementById("toastContainer").children.length);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(80px)";

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// //Fly to cart
// function flyToCart(button) {
//   console.log("Da chay fly to cart");
//   // Ảnh của sản phẩm
//   const productImage = button
//     .closest(".product-card")
//     .querySelector(".product-image img");

//   // Icon giỏ hàng
//   const cartIcon = document.querySelector(".cart-action");

//   const imageRect = productImage.getBoundingClientRect();

//   const cartRect = cartIcon.getBoundingClientRect();

//   console.log(imageRect);
//   console.log(cartRect);
// }

function animateCart() {
  const cartIcon = document.querySelector(".cart-action");

  const badge = document.querySelector(".action-badge");

  cartIcon.classList.add("shake");

  badge.classList.add("bounce");

  setTimeout(() => {
    cartIcon.classList.remove("shake");

    badge.classList.remove("bounce");
  }, 500);
}

//Load data
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartBadge();
  renderCart();
  // saveCart();
});

window.addEventListener("scroll", function () {
  const cartBtn = document.querySelector(".cart-action");

  if (cartBtn) {
    // Cuộn xuống hơn 160px sẽ bật chế độ nổi
    if (window.scrollY > 160) {
      cartBtn.classList.add("is-floating");
    } else {
      cartBtn.classList.remove("is-floating");
    }
  }
});

//

function forwardToCheckOut() {
  window.location.href = "checkout.html";
}
