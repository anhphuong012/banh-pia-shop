/* =========================================================
   TAN HUE VIEN - CHECKOUT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initCheckout();
});

/* =========================================================
   CONFIG
========================================================= */

const CHECKOUT_CONFIG = {
  FREE_SHIPPING: 500000,

  /*
   * Phí vận chuyển mặc định.
   * Khi đơn từ 500.000đ trở lên => miễn phí.
   */
  SHIPPING_FEE: 30000,
};

/* =========================================================
   STATE
========================================================= */

let checkoutCart = [];

let deliveryMethod = "delivery";

let paymentMethod = "cod";

/* =========================================================
   INIT
========================================================= */

function initCheckout() {
  loadCheckoutCart();

  renderCheckoutProducts();

  updateCheckoutItemCount();

  updateCheckoutSummary();

  bindDeliveryEvents();

  bindPaymentEvents();

  bindFormEvents();

  bindSubmitEvent();
}

/* =========================================================
   LOAD CART
========================================================= */

function loadCheckoutCart() {
  const savedCart = localStorage.getItem("cart");

  if (!savedCart) {
    checkoutCart = [];
    return;
  }

  try {
    const parsedCart = JSON.parse(savedCart);

    if (Array.isArray(parsedCart)) {
      checkoutCart = parsedCart;
    } else {
      checkoutCart = [];
    }
  } catch (error) {
    console.error("Không thể đọc giỏ hàng:", error);

    checkoutCart = [];
  }
}

/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderCheckoutProducts() {
  const container = document.getElementById("checkoutProducts");

  if (!container) return;

  /*
   * Không có sản phẩm
   */

  if (checkoutCart.length === 0) {
    container.innerHTML = `
      <div class="checkout-empty">

        <div class="checkout-empty__icon">
          <i class="bi bi-bag-x"></i>
        </div>

        <h3>Giỏ hàng đang trống</h3>

        <p>
          Bạn chưa có sản phẩm nào trong đơn hàng.
        </p>

        <a href="shop.html">
          Tiếp tục mua sắm
        </a>

      </div>
    `;

    disableCheckoutButton();

    return;
  }

  /*
   * Render sản phẩm
   */

  container.innerHTML = checkoutCart
    .map((item) => {
      const quantity = Number(item.quantity) || 1;

      const price = Number(item.price) || 0;

      const total = price * quantity;

      return `
        <div class="checkout-product">

          <div class="checkout-product__image">

            <img
              src="${item.image || ""}"
              alt="${escapeHTML(item.name || "Sản phẩm")}"
              loading="lazy"
            />

            <span class="checkout-product__quantity">
              ${quantity}
            </span>

          </div>


          <div class="checkout-product__info">

            <strong>
              ${escapeHTML(item.name || "Sản phẩm")}
            </strong>

            <span>
              ${quantity} sản phẩm
            </span>

          </div>


          <div class="checkout-product__price">

            ${formatCurrency(total)}

          </div>

        </div>
      `;
    })
    .join("");

  enableCheckoutButton();
}

/* =========================================================
   CALCULATE SUBTOTAL
========================================================= */

function getSubtotal() {
  return checkoutCart.reduce((total, item) => {
    const price = Number(item.price) || 0;

    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);
}

/* =========================================================
   SHIPPING
========================================================= */

function getShippingFee(subtotal) {
  /*
   * Nhận tại cửa hàng
   */

  if (deliveryMethod === "store") {
    return 0;
  }

  /*
   * Đơn đạt mức miễn phí
   */

  if (subtotal >= CHECKOUT_CONFIG.FREE_SHIPPING) {
    return 0;
  }

  return CHECKOUT_CONFIG.SHIPPING_FEE;
}

/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateCheckoutSummary() {
  const subtotal = getSubtotal();

  const shipping = getShippingFee(subtotal);

  const discount = 0;

  const total = subtotal + shipping - discount;

  const subtotalElement = document.getElementById("checkoutSubtotal");

  const shippingElement = document.getElementById("checkoutShipping");

  const discountElement = document.getElementById("checkoutDiscount");

  const totalElement = document.getElementById("checkoutTotal");

  if (subtotalElement) {
    subtotalElement.textContent = formatCurrency(subtotal);
  }

  if (shippingElement) {
    if (shipping === 0) {
      shippingElement.textContent = "Miễn phí";

      shippingElement.classList.add("free-shipping");
    } else {
      shippingElement.textContent = formatCurrency(shipping);

      shippingElement.classList.remove("free-shipping");
    }
  }

  if (discountElement) {
    discountElement.textContent =
      discount > 0 ? "-" + formatCurrency(discount) : "0đ";
  }

  if (totalElement) {
    totalElement.textContent = formatCurrency(total);
  }

  /*
   * Hiển thị thông tin miễn phí ship
   */

  updateShippingMessage(subtotal);
}

/* =========================================================
   SHIPPING MESSAGE
========================================================= */

function updateShippingMessage(subtotal) {
  const oldMessage = document.querySelector(".checkout-shipping-message");

  if (oldMessage) {
    oldMessage.remove();
  }

  /*
   * Không hiển thị khi nhận tại cửa hàng
   */

  if (deliveryMethod === "store") {
    return;
  }

  const promotion = document.querySelector(".checkout-promotion");

  if (!promotion) return;

  let message = "";

  if (subtotal >= CHECKOUT_CONFIG.FREE_SHIPPING) {
    message = `
      <div class="checkout-shipping-message success">

        <i class="bi bi-truck"></i>

        <span>
          🎉 Đơn hàng của bạn được
          <strong>miễn phí vận chuyển</strong>
        </span>

      </div>
    `;
  } else {
    const remaining = CHECKOUT_CONFIG.FREE_SHIPPING - subtotal;

    message = `
      <div class="checkout-shipping-message">

        <i class="bi bi-truck"></i>

        <span>
          Mua thêm
          <strong>
            ${formatCurrency(remaining)}
          </strong>
          để được miễn phí vận chuyển
        </span>

      </div>
    `;
  }

  promotion.insertAdjacentHTML("afterend", message);
}

/* =========================================================
   DELIVERY EVENTS
========================================================= */

function bindDeliveryEvents() {
  const options = document.querySelectorAll('input[name="deliveryMethod"]');

  options.forEach((input) => {
    input.addEventListener("change", () => {
      deliveryMethod = input.value;

      updateOptionState(input, 'input[name="deliveryMethod"]');

      updateCheckoutSummary();

      updateAddressState();
    });
  });

  updateAddressState();
}

/* =========================================================
   PAYMENT EVENTS
========================================================= */

function bindPaymentEvents() {
  const options = document.querySelectorAll('input[name="paymentMethod"]');

  options.forEach((input) => {
    input.addEventListener("change", () => {
      paymentMethod = input.value;

      updateOptionState(input, 'input[name="paymentMethod"]');

      handlePaymentChange();
    });
  });
}

/* =========================================================
   OPTION ACTIVE STATE
========================================================= */

function updateOptionState(selectedInput, selector) {
  const inputs = document.querySelectorAll(selector);

  inputs.forEach((input) => {
    const option = input.closest(".checkout-option");

    if (!option) return;

    if (input === selectedInput) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });
}

/* =========================================================
   ADDRESS STATE
========================================================= */

function updateAddressState() {
  const province = document.getElementById("customerProvince");

  const district = document.getElementById("customerDistrict");

  const address = document.getElementById("customerAddress");

  const isStorePickup = deliveryMethod === "store";

  if (province && district && address) {
    province.disabled = isStorePickup;

    district.disabled = isStorePickup;

    address.disabled = isStorePickup;

    if (isStorePickup) {
      province.value = "";

      district.innerHTML = `
        <option value="">
          Không cần chọn
        </option>
      `;

      address.value = "";

      province.closest(".checkout-field")?.classList.add("disabled");

      district.closest(".checkout-field")?.classList.add("disabled");

      address.closest(".checkout-field")?.classList.add("disabled");
    } else {
      province.closest(".checkout-field")?.classList.remove("disabled");

      district.closest(".checkout-field")?.classList.remove("disabled");

      address.closest(".checkout-field")?.classList.remove("disabled");
    }
  }
}

/* =========================================================
   PAYMENT CHANGE
========================================================= */

function handlePaymentChange() {
  console.log("Phương thức thanh toán:", paymentMethod);

  /*
   * Sau này nếu chọn chuyển khoản
   * có thể hiển thị thông tin ngân hàng
   */

  const existing = document.querySelector(".checkout-bank-info");

  if (existing) {
    existing.remove();
  }

  if (paymentMethod !== "banking") {
    return;
  }

  const paymentCard = document.querySelectorAll(".checkout-card")[2];

  if (!paymentCard) return;

  const options = paymentCard.querySelector(".checkout-options");

  if (!options) return;

  options.insertAdjacentHTML(
    "afterend",
    `
      <div class="checkout-bank-info">

        <div class="checkout-bank-info__icon">
          <i class="bi bi-bank"></i>
        </div>

        <div>

          <strong>
            Thông tin chuyển khoản
          </strong>

          <span>
            Ngân hàng: Vietcombank
          </span>

          <span>
            Số tài khoản: 0000000000
          </span>

          <span>
            Chủ tài khoản: TAN HUE VIEN
          </span>

          <small>
            Nội dung:
            THANH TOAN + SỐ ĐIỆN THOẠI
          </small>

        </div>

      </div>
    `,
  );
}

/* =========================================================
   FORM EVENTS
========================================================= */

function bindFormEvents() {
  const province = document.getElementById("customerProvince");

  if (province) {
    province.addEventListener("change", () => {
      loadDistricts(province.value);
    });
  }

  /*
   * Xóa lỗi khi người dùng nhập lại
   */

  const fields = [
    "customerName",
    "customerPhone",
    "customerEmail",
    "customerAddress",
  ];

  fields.forEach((id) => {
    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("input", () => {
      clearFieldError(input);
    });
  });
}

/* =========================================================
   DISTRICTS
========================================================= */

function loadDistricts(province) {
  const district = document.getElementById("customerDistrict");

  if (!district) return;

  const districts = {
    "Sóc Trăng": [
      "Thành phố Sóc Trăng",
      "Kế Sách",
      "Mỹ Tú",
      "Mỹ Xuyên",
      "Long Phú",
      "Châu Thành",
      "Thạnh Trị",
      "Vĩnh Châu",
    ],

    "Thành phố Hồ Chí Minh": [
      "Quận 1",
      "Quận 3",
      "Quận 5",
      "Quận 7",
      "Bình Thạnh",
      "Gò Vấp",
      "Tân Bình",
      "Thủ Đức",
    ],

    "Hà Nội": [
      "Ba Đình",
      "Hoàn Kiếm",
      "Đống Đa",
      "Hai Bà Trưng",
      "Cầu Giấy",
      "Thanh Xuân",
      "Nam Từ Liêm",
      "Bắc Từ Liêm",
    ],

    "Cần Thơ": ["Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt"],

    "Đồng Nai": [
      "Biên Hòa",
      "Long Thành",
      "Nhơn Trạch",
      "Trảng Bom",
      "Vĩnh Cửu",
    ],
  };

  const list = districts[province] || [];

  district.innerHTML = `
    <option value="">
      Chọn quận / huyện
    </option>

    ${list
      .map(
        (item) =>
          `<option value="${item}">
            ${item}
          </option>`,
      )
      .join("")}
  `;
}

/* =========================================================
   SUBMIT
========================================================= */

function bindSubmitEvent() {
  const button = document.getElementById("checkoutSubmit");

  if (!button) return;

  button.addEventListener("click", handleCheckout);
}

/* =========================================================
   HANDLE CHECKOUT
========================================================= */

function handleCheckout() {
  /*
   * Kiểm tra giỏ hàng
   */

  if (checkoutCart.length === 0) {
    showCheckoutMessage(
      "error",
      "Giỏ hàng đang trống",
      "Vui lòng thêm sản phẩm trước khi đặt hàng.",
    );

    return;
  }

  /*
   * Validate
   */

  const valid = validateCheckoutForm();

  if (!valid) {
    showCheckoutMessage(
      "error",
      "Thông tin chưa đầy đủ",
      "Vui lòng kiểm tra lại thông tin nhận hàng.",
    );

    return;
  }

  /*
   * Lấy thông tin khách hàng
   */

  const customer = getCustomerInfo();

  /*
   * Tính tiền
   */

  const subtotal = getSubtotal();

  const shipping = getShippingFee(subtotal);

  const total = subtotal + shipping;

  /*
   * Tạo đơn hàng
   */

  const order = {
    id: "THV-" + Date.now(),

    createdAt: new Date().toISOString(),

    customer,

    deliveryMethod,

    paymentMethod,

    items: checkoutCart.map((item) => ({
      id: item.id,

      name: item.name,

      price: Number(item.price),

      quantity: Number(item.quantity),

      image: item.image,
    })),

    subtotal,

    shipping,

    discount: 0,

    total,

    status: "pending",
  };

  /*
   * Lưu đơn hàng tạm thời
   */

  localStorage.setItem("pendingOrder", JSON.stringify(order));

  /*
   * Hiệu ứng loading nút
   */

  setSubmitLoading(true);

  /*
   * Demo:
   * sau này thay bằng API Spring Boot
   */

  setTimeout(() => {
    setSubmitLoading(false);

    // showCheckoutMessage(
    //   "success",
    //   "Đặt hàng thành công",
    //   `Mã đơn hàng của bạn là ${order.id}`,
    // );
    showOrderSuccessOverlay(order.id);
    /*
     * Xóa giỏ hàng
     */

    localStorage.removeItem("cart");

    checkoutCart = [];

    /*
     * Render lại
     */

    setTimeout(() => {
      window.location.href = "success.html";
    }, 1800);
  }, 1000);
}

/* =========================================================
   GET CUSTOMER INFO
========================================================= */

function getCustomerInfo() {
  return {
    name: document.getElementById("customerName")?.value.trim() || "",

    phone: document.getElementById("customerPhone")?.value.trim() || "",

    email: document.getElementById("customerEmail")?.value.trim() || "",

    province: document.getElementById("customerProvince")?.value || "",

    district: document.getElementById("customerDistrict")?.value || "",

    address: document.getElementById("customerAddress")?.value.trim() || "",

    note: document.getElementById("customerNote")?.value.trim() || "",
  };
}

/* =========================================================
   VALIDATE FORM
========================================================= */

function validateCheckoutForm() {
  let valid = true;

  /*
   * STORE PICKUP
   * không cần địa chỉ
   */

  const isStore = deliveryMethod === "store";

  const name = document.getElementById("customerName");

  const phone = document.getElementById("customerPhone");

  const email = document.getElementById("customerEmail");

  const province = document.getElementById("customerProvince");

  const district = document.getElementById("customerDistrict");

  const address = document.getElementById("customerAddress");

  /*
   * HỌ TÊN
   */

  if (!name || name.value.trim().length < 2) {
    setFieldError(name, "Vui lòng nhập họ và tên.");

    valid = false;
  } else {
    clearFieldError(name);
  }

  /*
   * PHONE
   */

  const phoneValue = phone?.value.trim() || "";

  const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

  if (!phoneRegex.test(phoneValue)) {
    setFieldError(phone, "Số điện thoại không hợp lệ.");

    valid = false;
  } else {
    clearFieldError(phone);
  }

  /*
   * EMAIL
   * không bắt buộc
   */

  if (email && email.value.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value.trim())) {
      setFieldError(email, "Email không hợp lệ.");

      valid = false;
    } else {
      clearFieldError(email);
    }
  }

  /*
   * ĐỊA CHỈ
   */

  if (!isStore) {
    if (!province || !province.value) {
      setFieldError(province, "Vui lòng chọn tỉnh / thành phố.");

      valid = false;
    } else {
      clearFieldError(province);
    }

    if (!district || !district.value) {
      setFieldError(district, "Vui lòng chọn quận / huyện.");

      valid = false;
    } else {
      clearFieldError(district);
    }

    if (!address || address.value.trim().length < 5) {
      setFieldError(address, "Vui lòng nhập địa chỉ nhận hàng.");

      valid = false;
    } else {
      clearFieldError(address);
    }
  }

  /*
   * Scroll đến lỗi đầu tiên
   */

  if (!valid) {
    const firstError = document.querySelector(".checkout-field.has-error");

    firstError?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return valid;
}

/* =========================================================
   FIELD ERROR
========================================================= */

function setFieldError(input, message) {
  if (!input) return;

  const field = input.closest(".checkout-field");

  if (!field) return;

  field.classList.add("has-error");

  let error = field.querySelector(".checkout-error");

  if (!error) {
    error = document.createElement("small");

    error.className = "checkout-error";

    field.appendChild(error);
  }

  error.textContent = message;
}

/* =========================================================
   CLEAR ERROR
========================================================= */

function clearFieldError(input) {
  if (!input) return;

  const field = input.closest(".checkout-field");

  if (!field) return;

  field.classList.remove("has-error");

  const error = field.querySelector(".checkout-error");

  if (error) {
    error.textContent = "";
  }
}

/* =========================================================
   SUBMIT LOADING
========================================================= */

function setSubmitLoading(loading) {
  const button = document.getElementById("checkoutSubmit");

  if (!button) return;

  if (loading) {
    button.disabled = true;

    button.innerHTML = `
      <span>
        ĐANG XỬ LÝ...
      </span>

      <i class="bi bi-arrow-repeat checkout-spin"></i>
    `;
  } else {
    button.disabled = false;

    button.innerHTML = `
      <span>
        ĐẶT HÀNG
      </span>

      <i class="bi bi-arrow-right"></i>
    `;
  }
}

/* =========================================================
   DISABLE BUTTON
========================================================= */

function disableCheckoutButton() {
  const button = document.getElementById("checkoutSubmit");

  if (!button) return;

  button.disabled = true;

  button.style.opacity = "0.5";

  button.style.cursor = "not-allowed";
}

/* =========================================================
   ENABLE BUTTON
========================================================= */

function enableCheckoutButton() {
  const button = document.getElementById("checkoutSubmit");

  if (!button) return;

  button.disabled = false;

  button.style.opacity = "1";

  button.style.cursor = "pointer";
}

/* =========================================================
   MESSAGE
========================================================= */

function showCheckoutMessage(type, title, message) {
  /*
   * Nếu project đã có toastContainer
   * thì sử dụng luôn toast hiện tại.
   */

  const container = document.getElementById("toastContainer");

  if (container) {
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
          ${escapeHTML(title)}
        </div>

        <div class="toast-message">
          ${escapeHTML(message)}
        </div>

      </div>

    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";

      toast.style.transform = "translateX(80px)";

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);

    return;
  }

  /*
   * Fallback
   */

  alert(`${title}\n\n${message}`);
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

function updateCheckoutItemCount() {
  const element = document.getElementById("checkoutItemCount");

  if (!element) return;

  const count = checkoutCart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  element.textContent = `${count} SP`;
}

function showOrderSuccessOverlay(orderId) {
  const overlay = document.getElementById("orderSuccessOverlay");

  const orderIdElement = document.getElementById("orderSuccessId");

  if (!overlay) return;

  if (orderIdElement) {
    orderIdElement.textContent = orderId || "—";
  }

  /*
   * Khóa scroll
   */

  document.body.style.overflow = "hidden";

  /*
   * Hiển thị modal
   */

  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });
}
