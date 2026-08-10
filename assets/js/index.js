function quadraticBezier(t, p0, p1, p2) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}
function flyToCartIndex(card) {
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
function bindProductEventsForIndex() {
  const addButtons = document.querySelectorAll(".btn-cart");

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");

      const id = Number(card.dataset.id);

      addToCart(id);
      console.log("Da vao cart");

      flyToCartIndex(card);
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("Da chay");
  bindProductEventsForIndex();
});
