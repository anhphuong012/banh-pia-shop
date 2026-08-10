/* =========================================================
   TAN HUE VIEN
   SUCCESS PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadSuccessOrder();
});

/* =========================================================
   LOAD ORDER
========================================================= */

function loadSuccessOrder() {
  const savedOrder = localStorage.getItem("pendingOrder");

  /*
   * Không có đơn hàng
   */

  if (!savedOrder) {
    handleMissingOrder();

    return;
  }

  let order;

  try {
    order = JSON.parse(savedOrder);
  } catch (error) {
    console.error("Không thể đọc đơn hàng:", error);

    handleMissingOrder();

    return;
  }

  renderOrder(order);
}

/* =========================================================
   RENDER ORDER
========================================================= */

function renderOrder(order) {
  /*
   * Mã đơn
   */

  setText("successOrderId", order.id || "—");

  /*
   * Khách hàng
   */

  setText("successCustomerName", order.customer?.name || "—");

  /*
   * Điện thoại
   */

  setText("successCustomerPhone", order.customer?.phone || "—");

  /*
   * Thanh toán
   */

  setText("successPaymentMethod", getPaymentName(order.paymentMethod));

  /*
   * Vận chuyển
   */

  setText("successShipping", getDeliveryName(order.deliveryMethod));

  /*
   * Sản phẩm
   */

  renderProducts(order.items || []);

  /*
   * Tổng
   */

  setText("successTotal", formatCurrency(order.total));
}

/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(items) {
  const container = document.getElementById("successProducts");

  const countElement = document.getElementById("successItemCount");

  if (!container) return;

  /*
   * Số lượng sản phẩm
   */

  const count = items.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  if (countElement) {
    countElement.textContent = `${count} sản phẩm`;
  }

  /*
   * Không có sản phẩm
   */

  if (items.length === 0) {
    container.innerHTML = `
      <div class="success-empty">
        Không có thông tin sản phẩm.
      </div>
    `;

    return;
  }

  /*
   * Render
   */

  container.innerHTML = items
    .map((item) => {
      const price = Number(item.price) || 0;

      const quantity = Number(item.quantity) || 0;

      const total = price * quantity;

      return `
          <div class="success-product">

            <div class="success-product__image">

              <img
                src="${escapeHTML(item.image || "")}"
                alt="${escapeHTML(item.name || "Sản phẩm")}"
              />

            </div>


            <div class="success-product__info">

              <span class="success-product__name">

                ${escapeHTML(item.name || "Sản phẩm")}

              </span>

              <span class="success-product__quantity">

                ${quantity} sản phẩm

              </span>

            </div>


            <div class="success-product__price">

              ${formatCurrency(total)}

            </div>

          </div>
        `;
    })
    .join("");
}

/* =========================================================
   PAYMENT NAME
========================================================= */

function getPaymentName(method) {
  const methods = {
    cod: "Thanh toán khi nhận hàng",

    banking: "Chuyển khoản ngân hàng",

    momo: "Ví MoMo",

    vnpay: "VNPay",
  };

  return methods[method] || "Thanh toán khi nhận hàng";
}

/* =========================================================
   DELIVERY NAME
========================================================= */

function getDeliveryName(method) {
  if (method === "store") {
    return "Nhận tại cửa hàng";
  }

  return "Giao hàng tận nơi";
}

/* =========================================================
   MISSING ORDER
========================================================= */

function handleMissingOrder() {
  const card = document.querySelector(".success-card");

  if (!card) return;

  card.innerHTML = `

    <div class="success-icon">
      <i class="bi bi-receipt"></i>
    </div>


    <div class="success-heading">

      <span class="success-eyebrow">
        TÂN HUÊ VIÊN
      </span>

      <h1>
        Không tìm thấy<br />
        <span>thông tin đơn hàng</span>
      </h1>

      <p>
        Có thể bạn đã truy cập trang này
        trực tiếp hoặc đơn hàng đã hết hạn.
      </p>

    </div>


    <div class="success-actions">

      <a
        href="index.html"
        class="success-btn success-btn--primary"
      >
        Về trang chủ
        <i class="bi bi-arrow-right"></i>
      </a>


      <a
        href="products.html"
        class="success-btn success-btn--secondary"
      >
        <i class="bi bi-bag"></i>
        Tiếp tục mua sắm
      </a>

    </div>

  `;
}

/* =========================================================
   SET TEXT
========================================================= */

function setText(id, value) {
  const element = document.getElementById(id);

  if (!element) return;

  element.textContent = value;
}

/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value) {
  return (Number(value) || 0).toLocaleString("vi-VN") + "đ";
}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
