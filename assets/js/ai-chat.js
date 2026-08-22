const chatButton = document.getElementById("aiChatButton");
const chatWindow = document.getElementById("aiChatWindow");
const closeButton = document.getElementById("aiClose");

const input = document.getElementById("aiMessageInput");
const sendButton = document.getElementById("aiSendButton");

const chatBody = document.getElementById("aiChatBody");

// ======================================
// AI MEMORY
// ======================================
const CHAT_STORAGE_KEY = "tan_hue_vien_chat_history";
const AI_MEMORY_STORAGE_KEY = "ai_memory";

let conversationHistory = loadChatHistory();

const aiConversationMemory = {
  lastProducts: [],
  lastProductIds: [],
  lastSearchText: "",

  lastIntent: null,

  lastBudget: null,
  lastRecipient: null,
  lastFlavor: null,
  lastPurpose: null,

  waitingForQuantity: false,
};

// ======================================
// AI MEMORY
// ======================================

const userPreferences = {
  budget: null,
  minBudget: null,
  maxBudget: null,

  purpose: null,
  recipient: null,

  flavor: null,
  preference: null,

  quantity: null,

  lastRequest: null,

  // Yêu cầu so sánh
  priceDirection: null,

  // Sản phẩm vừa được gợi ý
  lastProducts: [],

  // Loại câu hỏi gần nhất
  lastIntent: null,

  lastProductFilter: null,

  lastReferencePrice: null,
  lastFollowUpPrice: null,

  // Giá của danh sách vừa hiển thị
  lastDisplayedMaxPrice: null,
  lastDisplayedMinPrice: null,

  // Đang chờ người dùng nhập khu vực giao hàng
  awaitingDeliveryArea: false,
  lastShippingQuestion: false,

  awaitingProductInfo: false,
  awaitingTasteProduct: false,
  awaitingProductFollowUp: false,
  awaitingProductAttribute: null,

  lastProductAttribute: null,

  shippingContext: false,

  // ID sản phẩm vừa hiển thị
  lastProductIds: [],
};

let isAIChatMode = false;

// ======================================
// TRẠNG THÁI AI ĐANG TRẢ LỜI
// ======================================
let isAIResponding = false;

//

const shopInfo = {
  name: "Tân Huê Viên",

  address:
    "153 Quốc lộ 1A, ấp Phụng Hiệp, xã An Hiệp, huyện Châu Thành, tỉnh Sóc Trăng",
  newAddress: "153 QL1A, ấp Phụng Hiệp, An Ninh, Cần Thơ, Việt Nam",

  phone: "000000000000",

  openingHours: "7h30 - 18h30",
  director: "Ông N.Q.Duy",
  paymentMethods: [
    "Thanh toán khi nhận hàng (COD)",
    "Chuyển khoản ngân hàng",
    "Quét mã QR",
  ],
  returnPolicy: `
  Shop hỗ trợ đổi/trả sản phẩm trong trường hợp sản phẩm bị lỗi,
  hư hỏng hoặc giao không đúng sản phẩm.
`,
  productIssuePolicy: `
  Nếu sản phẩm bị hư hỏng hoặc có vấn đề khi nhận hàng,
  khách hàng vui lòng liên hệ shop để được kiểm tra và hỗ trợ.
`,
  orderGuide: `
  Bạn có thể chọn sản phẩm trên website, thêm sản phẩm vào giỏ hàng,
  kiểm tra đơn hàng và tiến hành đặt hàng.
`,
  orderTracking: `
  Bạn có thể kiểm tra tình trạng đơn hàng trong mục đơn hàng
  trên website. Nếu cần hỗ trợ thêm, vui lòng liên hệ shop.
`,
};

const availableFillings = ["Kim Sa", "Đậu xanh", "Sầu riêng", "Khoai môn"];

function getProductsByFilling(filling) {
  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length || !filling) {
    return [];
  }

  // const keyword = normalizeText(filling);
  const fillingKeywords = {
    "kim sa": ["trung muoi", "kim sa"],
    "dau xanh": ["dau xanh", "dau xah"],
    "sau rieng": ["sau rieng"],
    "khoai mon": ["khoai mon"],
  };

  const keywords = fillingKeywords[normalizeText(filling)] || [
    normalizeText(filling),
  ];

  const result = productData.filter((product) => {
    if (!Array.isArray(product.ingredients)) {
      return false;
    }

    // return product.ingredients.some((ingredient) => {
    //   return normalizeText(String(ingredient)).includes(keyword);
    // });

    return product.ingredients.some((ingredient) => {
      const ingredientText = normalizeText(String(ingredient));

      return keywords.some((keyword) => ingredientText.includes(keyword));
    });
  });

  console.log(
    "🥮 SẢN PHẨM THEO NHÂN:",
    filling,
    result.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      ingredients: product.ingredients,
    })),
  );

  return result.slice(0, 3);
}

function findExactProductFromMessage(message) {
  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length) {
    return null;
  }

  const text = normalizeText(message);

  // ======================================
  // 1. TÌM THEO TÊN SẢN PHẨM
  // ======================================

  let product = productData.find((item) => {
    if (!item.name) return false;

    const productName = normalizeText(item.name);

    return text.includes(productName);
  });

  if (product) {
    return product;
  }

  // ======================================
  // 2. TÌM THEO SLUG
  // ======================================

  product = productData.find((item) => {
    if (!item.slug) return false;

    const slugText = normalizeText(String(item.slug).replace(/-/g, " "));

    return text.includes(slugText);
  });

  return product || null;
}
function isAIChatRequest(message) {
  const text = normalizeText(message);

  const keywords = [
    "toi muon chat voi ai",
    "toi muon chat ai",
    "toi muon noi chuyen voi ai",
    "toi muon noi chuyen voi ai",
    "cho toi chat voi ai",
    "cho toi noi chuyen voi ai",
    "bat che do ai",
    "bat ai",
    "mo che do ai",
    "toi muon hoi ai",
    "toi muon hoi tri tue nhan tao",
    "toi muon noi chuyen voi tri tue nhan tao",
    "chat voi tri tue nhan tao",
    "tro chuyen voi ai",
    "noi chuyen voi ai",
    "chat voi ai",
    "goi ai",
  ];

  return keywords.some((keyword) => text.includes(keyword));
}
function detectFilling(text) {
  const normalized = normalizeText(text);

  for (const filling of availableFillings) {
    const keyword = normalizeText(filling);

    if (normalized.includes(keyword)) {
      return filling;
    }
  }

  return null;
}
// ======================================
// MỞ CHAT
// ======================================

chatButton.addEventListener("click", () => {
  chatWindow.classList.toggle("active");
  // Nếu cửa sổ chat đang mở, thực hiện cuộn xuống tin nhắn cuối cùng
  if (chatWindow.classList.contains("active")) {
    scrollToBottom();
  }
});

// ======================================
// ĐÓNG CHAT
// ======================================

closeButton.addEventListener("click", () => {
  chatWindow.classList.remove("active");
});

function saveAIContext(products, intent, message) {
  // ======================================
  // 1. KIỂM TRA DANH SÁCH
  // ======================================

  if (!Array.isArray(products) || products.length === 0) {
    return;
  }

  // ======================================
  // 2. LƯU SẢN PHẨM VỪA HIỂN THỊ
  // ======================================

  userPreferences.lastProducts = [...products];

  userPreferences.lastProductIds = products.map((product) => product.id);

  aiConversationMemory.lastProducts = [...products];

  aiConversationMemory.lastProductIds = products.map((product) => product.id);

  // LƯU ID SẢN PHẨM VỪA HIỂN THỊ
  userPreferences.lastProductIds = Array.isArray(products)
    ? products.map((product) => product.id)
    : [];

  // ======================================
  // 3. LƯU CÂU HỎI
  // ======================================

  userPreferences.lastRequest = message || "";

  aiConversationMemory.lastSearchText = message || "";

  // ======================================
  // 4. LƯU INTENT
  // ======================================

  userPreferences.lastIntent = {
    ...intent,
  };

  // ======================================
  // LƯU ĐIỀU KIỆN GỐC CỦA SẢN PHẨM
  // Dùng cho "rẻ hơn / đắt hơn"
  // ======================================

  userPreferences.lastBaseIntent = {
    ...intent,

    // Không giữ giá cũ
    budget: null,
    minBudget: null,
    maxBudget: null,

    // Không giữ hướng giá cũ
    priceDirection: null,
  };

  userPreferences.lastDeliveryArea = null;

  aiConversationMemory.lastIntent = intent || null;

  // ======================================
  // 5. LƯU THÔNG TIN KHÁCH
  // ======================================

  if (intent?.recipient) {
    userPreferences.recipient = intent.recipient;
    aiConversationMemory.lastRecipient = intent.recipient;
  }

  if (intent?.flavor) {
    userPreferences.flavor = intent.flavor;
    aiConversationMemory.lastFlavor = intent.flavor;
  }

  if (intent?.purpose) {
    userPreferences.purpose = intent.purpose;
    aiConversationMemory.lastPurpose = intent.purpose;
  }

  // ======================================
  // 6. LƯU GIÁ DANH SÁCH VỪA HIỂN THỊ
  // ======================================

  // ======================================
  // LƯU GIÁ CỦA DANH SÁCH ĐANG HIỂN THỊ
  // ======================================

  if (Array.isArray(products) && products.length > 0) {
    const prices = products
      .map((product) => Number(product.price))
      .filter((price) => !isNaN(price));

    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Giá thấp nhất của danh sách đang hiển thị
      userPreferences.lastDisplayedMinPrice = minPrice;

      // Giá cao nhất của danh sách đang hiển thị
      userPreferences.lastDisplayedMaxPrice = maxPrice;

      // Giữ tương thích với code cũ
      userPreferences.lastReferencePrice = maxPrice;

      console.log("💰 GIÁ THẤP NHẤT ĐANG HIỂN THỊ:", minPrice);

      console.log("💰 GIÁ CAO NHẤT ĐANG HIỂN THỊ:", maxPrice);
    }
  }

  // ======================================
  // 7. LƯU LOẠI NHÓM SẢN PHẨM
  // ======================================

  if (intent?.isNewProduct) {
    userPreferences.lastProductFilter = {
      type: "new",
    };
  } else if (intent?.isSaleQuestion) {
    userPreferences.lastProductFilter = {
      type: "sale",
    };
  } else if (intent?.isBestSellerQuestion) {
    userPreferences.lastProductFilter = {
      type: "bestSeller",
    };
  } else if (intent?.isTopRatedQuestion) {
    userPreferences.lastProductFilter = {
      type: "topRated",
    };
  } else {
    userPreferences.lastProductFilter = {
      type: "all",
    };
  }

  // ======================================
  // 8. DEBUG
  // ======================================

  console.log("======================================");
  console.log("💾 SAVE AI CONTEXT");
  console.log("======================================");

  console.log(
    "🛍️ SẢN PHẨM:",
    products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
    })),
  );

  console.log("💰 GIÁ THẤP NHẤT:", userPreferences.lastDisplayedMinPrice);

  console.log("💰 GIÁ CAO NHẤT:", userPreferences.lastDisplayedMaxPrice);

  console.log("📂 FILTER:", userPreferences.lastProductFilter);

  console.log("======================================");
}

// ======================================
// CẬP NHẬT AI MEMORY
// ======================================

function updateAIMemory(intent, products = []) {
  // ------------------------------
  // NGÂN SÁCH
  // ------------------------------

  if (intent.budget !== null && intent.budget !== undefined) {
    userPreferences.budget = intent.budget;
  }

  if (intent.minBudget !== null && intent.minBudget !== undefined) {
    userPreferences.minBudget = intent.minBudget;
  }

  if (intent.maxBudget !== null && intent.maxBudget !== undefined) {
    userPreferences.maxBudget = intent.maxBudget;
  }

  // ------------------------------
  // MỤC ĐÍCH
  // ------------------------------

  if (intent.purpose) {
    userPreferences.purpose = intent.purpose;
  }

  // ------------------------------
  // NGƯỜI NHẬN
  // ------------------------------

  if (intent.recipient) {
    userPreferences.recipient = intent.recipient;
  }

  // ------------------------------
  // HƯƠNG VỊ
  // ------------------------------

  if (intent.flavor) {
    userPreferences.flavor = intent.flavor;
  }

  // ------------------------------
  // SỞ THÍCH
  // ------------------------------

  if (intent.preference) {
    userPreferences.preference = intent.preference;
  }

  // ------------------------------
  // SỐ LƯỢNG
  // ------------------------------

  if (intent.quantity !== null && intent.quantity !== undefined) {
    userPreferences.quantity = intent.quantity;
  }

  // ------------------------------
  // SO SÁNH GIÁ
  // ------------------------------

  if (intent.priceDirection) {
    userPreferences.priceDirection = intent.priceDirection;
  }

  // ------------------------------
  // SẢN PHẨM CUỐI
  // ------------------------------

  if (Array.isArray(products) && products.length > 0) {
    userPreferences.lastProducts = products;
  }

  // ------------------------------
  // INTENT CUỐI
  // ------------------------------

  userPreferences.lastIntent = intent;

  console.log("🧠 AI MEMORY:", userPreferences);

  return {
    ...userPreferences,
  };
}

// ======================================
// LỌC TỪ DANH SÁCH SẢN PHẨM TRƯỚC
// ======================================

function filterFromPreviousProducts(products, intent) {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  let results = [...products];

  // ==================================
  // RẺ HƠN
  // ==================================

  if (intent.priceDirection === "cheaper") {
    const prices = results
      .map((product) => Number(product.price))
      .filter((price) => !isNaN(price));

    if (prices.length > 0) {
      const maxPrice = Math.max(...prices);

      results = results.filter((product) => {
        const price = Number(product.price);

        return !isNaN(price) && price < maxPrice;
      });
    }
  }

  // ==================================
  // ĐẮT HƠN
  // ==================================

  if (intent.priceDirection === "more_expensive") {
    const prices = results
      .map((product) => Number(product.price))
      .filter((price) => !isNaN(price));

    if (prices.length > 0) {
      const minPrice = Math.min(...prices);

      results = results.filter((product) => {
        const price = Number(product.price);

        return !isNaN(price) && price > minPrice;
      });
    }
  }

  // ==================================
  // SẮP XẾP
  // ==================================

  if (intent.priceDirection === "cheaper") {
    results.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (intent.priceDirection === "more_expensive") {
    results.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return results;
}

// ======================================
// LẤY MEMORY HIỆN TẠI
// ======================================

function getAIMemory() {
  return {
    ...userPreferences,

    lastProducts: [...userPreferences.lastProducts],
  };
}

// ======================================
// KIỂM TRA CÂU CÓ PHẢI YÊU CẦU TIẾP THEO
// ======================================

function isFollowUpQuestion(message) {
  const text = normalizeText(message);

  const followUpKeywords = [
    "re hon",
    "dat hon",

    "cao cap hon",
    "tot hon",

    "loai khac",
    "co loai nao",
    "con loai nao",

    "khac khong",

    "the nao",

    "cai nao",

    "san pham nao",
  ];

  return followUpKeywords.some((keyword) => text.includes(keyword));
}

function getDifferentProducts(intent) {
  // ======================================
  // 1. LẤY TOÀN BỘ SẢN PHẨM
  // ======================================

  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length) {
    return [];
  }

  // ======================================
  // 2. LẤY ID SẢN PHẨM ĐÃ HIỂN THỊ
  // ======================================

  const lastProductIds = Array.isArray(userPreferences.lastProductIds)
    ? userPreferences.lastProductIds
    : Array.isArray(aiConversationMemory.lastProductIds)
      ? aiConversationMemory.lastProductIds
      : [];

  console.log("🚫 ID SẢN PHẨM ĐÃ HIỂN THỊ:", lastProductIds);

  // ======================================
  // 3. LOẠI BỎ SẢN PHẨM ĐÃ HIỂN THỊ
  // ======================================

  let result = productData.filter((product) => {
    return !lastProductIds.includes(product.id);
  });

  console.log(
    "📦 SAU KHI LOẠI SẢN PHẨM CŨ:",
    result.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
    })),
  );

  // ======================================
  // 4. GIỮ NGÂN SÁCH CŨ
  // ======================================

  if (intent.budget) {
    result = result.filter((product) => {
      const price = Number(product.price);

      if (isNaN(price)) {
        return false;
      }

      // DƯỚI / TỐI ĐA
      if (intent.budget.type === "max") {
        return price <= Number(intent.budget.max);
      }

      // TỪ ... TRỞ LÊN
      if (intent.budget.type === "min") {
        return price >= Number(intent.budget.min);
      }

      // KHOẢNG GIÁ
      if (intent.budget.type === "range") {
        return (
          price >= Number(intent.budget.min) &&
          price <= Number(intent.budget.max)
        );
      }

      // XUNG QUANH
      if (intent.budget.type === "around") {
        return (
          price >= Number(intent.budget.min) &&
          price <= Number(intent.budget.max)
        );
      }

      // GIÁ CỤ THỂ
      if (intent.budget.type === "exact") {
        return price <= Number(intent.budget.max);
      }

      return true;
    });
  }

  // ======================================
  // 5. GIỮ HƯƠNG VỊ
  // ======================================

  if (intent.flavor) {
    const flavor = String(intent.flavor).toLowerCase().trim();

    result = result.filter((product) => {
      const text = `
        ${product.name || ""}
        ${product.category || ""}
        ${product.description || ""}
        ${(product.ingredients || []).join(" ")}
      `.toLowerCase();

      return text.includes(flavor);
    });
  }

  // ======================================
  // 6. SẢN PHẨM MỚI
  // ======================================

  if (intent.isNewProduct) {
    result = result.filter((product) => {
      return (
        product.isNew === true ||
        product.isNew === 1 ||
        product.newProduct === true
      );
    });
  }

  // ======================================
  // 7. KHUYẾN MÃI
  // ======================================

  if (intent.isSaleQuestion) {
    result = result.filter((product) => {
      return Number(product.discount || 0) > 0;
    });
  }

  // ======================================
  // 8. ĐÁNH GIÁ CAO
  // ======================================

  if (intent.isTopRatedQuestion) {
    result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }

  // ======================================
  // 9. BÁN CHẠY
  // ======================================

  if (intent.isBestSellerQuestion) {
    result.sort((a, b) => {
      const soldA = parseSold(a.sold);
      const soldB = parseSold(b.sold);

      return soldB - soldA;
    });
  }

  // ======================================
  // 10. KIỂM TRA KẾT QUẢ TRƯỚC KHI RANDOM
  // ======================================

  console.log(
    "🔎 SẢN PHẨM KHÁC SAU KHI LỌC:",
    result.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
    })),
  );

  // ======================================
  // 11. XÁO TRỘN
  // ======================================

  result.sort(() => Math.random() - 0.5);

  // ======================================
  // 12. CHỈ LẤY 3
  // ======================================

  result = result.slice(0, 3);

  // ======================================
  // 13. DEBUG CUỐI
  // ======================================

  console.log(
    "🥮 SẢN PHẨM KHÁC CUỐI CÙNG:",
    result.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
    })),
  );

  return result;
}

function findDeliveryArea(message) {
  const text = normalizeText(message);

  if (!text) {
    return null;
  }

  // ======================================
  // TÌM KHU VỰC THEO KEYWORD
  // ======================================

  for (const area of deliveryData.areas) {
    if (!Array.isArray(area.keywords)) {
      continue;
    }

    for (const keyword of area.keywords) {
      const normalizedKeyword = normalizeText(keyword);

      if (normalizedKeyword && text.includes(normalizedKeyword)) {
        return area;
      }
    }
  }

  return null;
}

// ======================================
// PHÂN TÍCH HƯỚNG GIÁ
// ======================================

function detectPriceDirection(message) {
  const text = normalizeText(message);

  // ------------------------------
  // RẺ HƠN
  // ------------------------------

  if (
    text.includes("re hon") ||
    text.includes("gia re hon") ||
    text.includes("thap hon") ||
    text.includes("duoi nua") ||
    text.includes("it hon") ||
    text.includes("re nua") ||
    text.includes("thap nua") ||
    text.includes("nho hon") ||
    text.includes("giam nua") ||
    text.includes("giam hon") ||
    text.includes("bot gia") ||
    text.includes("bot hon") ||
    text.includes("tiet kiem hon") ||
    text.includes("mem hon") ||
    text.includes("hoi hon")
  ) {
    return "cheaper";
  }

  // ------------------------------
  // ĐẮT HƠN
  // ------------------------------

  if (
    text.includes("dat hon") ||
    text.includes("gia cao hon") ||
    text.includes("cao cap hon") ||
    text.includes("mac hon") ||
    text.includes("mac nua") ||
    text.includes("dat nua") ||
    text.includes("gia cao nua") ||
    text.includes("sang hon") ||
    text.includes("xin hon") ||
    text.includes("dac hon") ||
    text.includes("tang gia")
  ) {
    return "more_expensive";
  }

  return null;
}

async function sendMessage() {
  // ======================================
  // KHÔNG CHO GỬI THÊM KHI AI ĐANG TRẢ LỜI
  // ======================================

  if (isAIResponding) {
    return;
  }

  // ======================================
  // CÂU KHÁCH HÀNG NHẬP
  // ======================================

  const message = input.value.trim();

  if (!message) return;

  // ======================================
  // KHÓA KHUNG NHẬP
  // ======================================

  setAIResponding(true);

  // ======================================
  // 🤖 KIỂM TRA KHÁCH MUỐN CHAT VỚI AI
  // ======================================

  if (isAIChatRequest(message)) {
    isAIChatMode = true;

    addMessage(message, "user");

    conversationHistory.push({
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    input.value = "";

    // Hiển thị AI đang suy nghĩ
    showTyping();

    setTimeout(() => {
      removeTyping();

      sendAIResponse(`
      🤖 <b>Đã chuyển sang chế độ Chat với AI</b>

      <br><br>

      Từ bây giờ, mọi câu hỏi của bạn
      sẽ được <b>AI trực tiếp trả lời</b> nhé.

      <br><br>

      Bạn có thể hỏi mình bất cứ điều gì.
    `);
    }, 800);

    return;
  }

  // ======================================
  // 🤖 ĐANG CHAT TRỰC TIẾP VỚI AI
  // ======================================

  if (isAIChatMode) {
    addMessage(message, "user");

    conversationHistory.push({
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    input.value = "";

    showTyping();

    try {
      const response = await askGeneralAI(message);

      removeTyping();

      sendAIResponse(response);
    } catch (error) {
      removeTyping();

      console.error("❌ AI ERROR:", error);

      sendAIResponse(`
        😔 Xin lỗi bạn, hiện tại AI đang gặp sự cố.
        <br><br>
        Bạn vui lòng thử lại sau nhé.
      `);
    }

    return;
  }

  // ======================================
  // ⬇️ TỪ ĐÂY TRỞ XUỐNG GIỮ NGUYÊN CODE CŨ
  // ======================================

  // ======================================
  // HIỂN THỊ USER MESSAGE
  // ======================================

  addMessage(message, "user");

  // ======================================
  // LƯU LỊCH SỬ
  // ======================================

  conversationHistory.push({
    role: "user",
    content: message,
    timestamp: Date.now(),
  });

  saveChatHistory();

  input.value = "";

  // ======================================
  // AI ĐANG SUY NGHĨ
  // ======================================

  showTyping();

  await new Promise((resolve) => setTimeout(resolve, 800));

  try {
    // setTimeout(async () => {
    //   removeTyping();

    // ==================================
    // PHÂN TÍCH CÂU HỎI
    // ==================================

    // const intent = analyzeUserIntent(message);

    const currentIntent = analyzeUserIntent(message);

    const intent = mergeIntentWithMemory(currentIntent);

    //for shiping

    // ======================================
    // THOÁT NGỮ CẢNH GIAO HÀNG
    // ======================================

    if (
      !intent.isShipping &&
      !intent.isGeneralQuestion &&
      (intent.isRecommendedQuestion ||
        intent.isBestSellerQuestion ||
        intent.isTopRatedQuestion ||
        intent.isSearchProductQuestion ||
        intent.isNewProduct ||
        intent.isSaleQuestion ||
        intent.isProductInfoQuestion ||
        intent.isProductTypeQuestion ||
        intent.filling ||
        intent.budget)
    ) {
      console.log("🔄 CHUYỂN CHỦ ĐỀ: THOÁT NGỮ CẢNH GIAO HÀNG");

      userPreferences.lastShippingQuestion = false;
      userPreferences.awaitingDeliveryArea = false;
    }

    //

    console.log("🏪 SHOP TEST MESSAGE:", message);
    console.log("🏪 SHOP TEST INTENT:", intent);

    const memory = updateAIMemory(intent);

    saveAIMemoryToSession();

    // ======================================
    // QUAN TRỌNG
    // XỬ LÝ FOLLOW-UP TRƯỚC
    // ======================================

    if (
      intent.priceDirection === "cheaper" ||
      intent.priceDirection === "more_expensive"
    ) {
      const followUpProducts = getFollowUpProducts(intent);

      if (followUpProducts.length === 0) {
        sendAIResponse(`
      😔 Mình chưa tìm thấy sản phẩm
      ${
        intent.priceDirection === "cheaper" ? "<b>rẻ hơn</b>" : "<b>cao hơn</b>"
      }
      lựa chọn trước đó.
    `);

        return;
      }

      // LƯU DANH SÁCH MỚI
      saveAIContext(followUpProducts, intent, message);

      let responseText =
        intent.priceDirection === "cheaper"
          ? `
        💰 Có nhé! Đây là những sản phẩm
        <b>rẻ hơn</b> lựa chọn trước đó:
      `
          : `
        💎 Có nhé! Đây là những sản phẩm
        <b>cao hơn</b> lựa chọn trước đó:
      `;

      // Giữ người nhận
      if (intent.recipient === "mother") {
        responseText += `
      <br><br>
      🎁 Mình vẫn ưu tiên lựa chọn
      <b>phù hợp để tặng mẹ</b>.
    `;
      }

      if (intent.recipient === "father") {
        responseText += `
      <br><br>
      🎁 Mình vẫn ưu tiên lựa chọn
      <b>phù hợp để tặng bố</b>.
    `;
      }

      responseText += `
    <br><br>

    ${createProductList(followUpProducts, intent)}

    <br>

    <span class="ai-product-hint">
      👆 Bấm vào sản phẩm để xem
      thông tin chi tiết.
    </span>
  `;

      sendAIResponse(responseText);

      return;
    }

    // ======================================
    // SAU KHI XỬ LÝ FOLLOW-UP
    // MỚI CẬP NHẬT MEMORY
    // ======================================

    console.log("💾 MEMORY SAU:", getAIMemory());

    if (intent.isGreetingQuestion) {
      const responseText = ` Xin chào bạn 👋

            <br><br>

            Mình là <b>Trợ lý Tân Huê Viên</b> 🤖

            <br><br>

            Mình có thể giúp bạn tìm bánh
            theo <b>ngân sách</b>,
            <b>khẩu vị</b>,..
            hoặc giải đáp thắc mắc cho bạn về
            <b> giao hàng, bảo quản.</b>.

            <br><br>

            Bạn đang muốn gì hãy nói nhé (ví dụ: bảo quản, vận chuyển,..)?
        `;
      sendAIResponse(responseText);

      return;
    }

    if (intent.isProductUsageQuestion) {
      console.log(
        "🧊 DEBUG PRODUCT USAGE QUESTION:",
        intent.isProductUsageQuestion,
      );

      // const reponse = await askGeneralAI(message);
      const reponse = `📦 <b> Hướng dẫn bảo quản </b>
     <br><br>
      Bánh pía nên được để ở nơi <b> khô ráo, thoáng mát hoặc bảo quản trong ngăn mát tủ lạnh</b> để giữ trọn vị ngon.
      <br><br>Nếu để trong tủ lạnh bạn có thẻ dùng lò vi sóng để hâm nóng nhé.
      `;
      sendAIResponse(reponse);
      return;
    }

    // if (intent.isProductTasteQuestion) {
    //   console.log(
    //     "🍯 DEBUG PRODUCT TASTE QUESTION:",
    //     intent.isProductTasteQuestion,
    //   );

    //   const response = await askGeneralAI(message);

    //   sendAIResponse(response);

    //   return;
    // }

    //New for product taste
    if (intent.isProductTasteQuestion) {
      console.log(
        "🍯 DEBUG PRODUCT TASTE QUESTION:",
        intent.isProductTasteQuestion,
      );

      let product = findProductFromMessage(message);

      // Nếu câu hỏi không chứa tên sản phẩm
      // thì dùng sản phẩm vừa hỏi trước đó
      if (!product) {
        product = userPreferences.lastInfoProduct;
      }

      // Không có sản phẩm
      if (!product) {
        userPreferences.awaitingTasteProduct = true;

        sendAIResponse(`
      🍯 Bạn đang muốn hỏi về độ ngọt
      của sản phẩm nào vậy?

      <br><br>

      Bạn cho mình biết
      <b>tên bánh</b>
      để mình kiểm tra nhé.
    `);

        return;
      }

      // Đã tìm thấy sản phẩm
      userPreferences.awaitingTasteProduct = false;
      userPreferences.lastInfoProduct = product;

      // ======================================
      // ⭐ GHI NHỚ LOẠI CÂU HỎI
      // ======================================

      // ⭐ ĐANG HỎI ĐỘ NGỌT
      userPreferences.lastProductAttribute = "taste";

      console.log("🍯 TASTE PRODUCT:", product);

      const responseText = `
    🥮 <b>${product.name}</b>

    <br><br>

    🍯 <b>Độ ngọt:</b>

    <br><br>

    ${product.taste || "Thông tin về độ ngọt của sản phẩm đang được cập nhật."}
  `;

      sendAIResponse(responseText);

      return;
    }

    if (intent.isThanksQuestion) {
      const responseText = ` Cám ơn bạn  🤖

            <br><br>

           Cám ơn bạn vì đã quan tâm. 

            <br><br>

            Hẹn gặp lại bạn sau nhé.

           Tạm biệt👋.
        `;
      sendAIResponse(responseText);

      return;
    }

    if (
      intent.isNewProduct ||
      intent.isSaleQuestion ||
      intent.isBestSellerQuestion ||
      intent.isTopRatedQuestion ||
      intent.isSearchProductQuestion
    ) {
      userPreferences.lastFollowUpPrice = null;
    }

    //Shing

    // ======================================
    // THÔNG TIN GIAO HÀNG
    // ======================================

    //New shiping
    // const deliveryAreaFromMessage = findDeliveryArea(message);

    // console.log("📍 DELIVERY AREA FROM MESSAGE:", deliveryAreaFromMessage);

    // if (
    //   intent.isShipping ||
    //   userPreferences.awaitingDeliveryArea ||
    //   userPreferences.lastShippingQuestion ||
    //   deliveryAreaFromMessage
    // ) {
    //   // ======================================
    //   // TÌM KHU VỰC GIAO HÀNG
    //   // ======================================
    //   userPreferences.lastShippingQuestion = true;

    //   const deliveryArea = deliveryAreaFromMessage;

    //   // ======================================
    //   // 1. ĐÃ TÌM THẤY KHU VỰC
    //   // ======================================

    //   if (deliveryArea) {
    //     userPreferences.lastDeliveryArea = deliveryArea;
    //     userPreferences.awaitingDeliveryArea = false;

    //     const responseText = `
    //   🚚 <b>Thông tin giao hàng</b>

    //   <br><br>

    //   📍 Khu vực:
    //   <b>${deliveryArea.name}</b>

    //   <br><br>

    //   💰 Phí giao hàng dự kiến:
    //   <b>${Number(deliveryArea.fee).toLocaleString("vi-VN")}đ</b>

    //   <br><br>

    //   ⏱️ Thời gian giao dự kiến:
    //   <b>${deliveryArea.deliveryTime}</b>

    //   <br><br>

    //   📦 Phí và thời gian trên là thông tin
    //   dự kiến và có thể thay đổi tùy địa chỉ cụ thể.
    // `;

    //     sendAIResponse(responseText);

    //     return;
    //   }

    //   // ======================================
    //   // 2. ĐANG CHỜ KHÁCH NHẬP TỈNH
    //   // ======================================
    //   // Trường hợp:
    //   // "Giao hàng"
    //   // → chưa nhập tỉnh/thành phố

    //   if (intent.isShipping && !userPreferences.awaitingDeliveryArea) {
    //     userPreferences.awaitingDeliveryArea = true;

    //     const responseText = `
    //   🚚 <b>Thông tin giao hàng</b>

    //   <br><br>

    //   Tân Huê Viên có hỗ trợ giao hàng đến nhiều
    //   tỉnh thành trên toàn quốc.

    //   <br><br>

    //   Bạn cho mình biết
    //   <b>tỉnh/thành phố hoặc khu vực nhận hàng</b>
    //   nhé.

    //   <br><br>

    //   Ví dụ:
    //   <br>
    //   • Bến Tre
    //   <br>
    //   • Vĩnh Long
    //   <br>
    //   • Cần Thơ
    //   <br>
    //   • Sóc Trăng
    //   <br>
    //   • TP. Hồ Chí Minh
    //   <br>
    //   • Hà Nội
    // `;

    //     sendAIResponse(responseText);

    //     return;
    //   }

    //   // ======================================
    //   // 3. KHÔNG HỖ TRỢ KHU VỰC
    //   // ======================================
    //   // Trường hợp:
    //   // "Giao hàng"
    //   // → "Đà Nẵng"
    //   // → không tìm thấy trong dữ liệu

    //   if (userPreferences.awaitingDeliveryArea && !deliveryArea) {
    //     userPreferences.awaitingDeliveryArea = false;

    //     const responseText = `
    //   🚚 <b>Thông tin giao hàng</b>

    //   <br><br>

    //   😔 Rất tiếc, hiện tại Tân Huê Viên
    //   <b>chưa hỗ trợ giao hàng đến khu vực này</b>.

    //   <br><br>

    //   Bạn có thể cho mình biết
    //   <b>tỉnh/thành phố khác</b>
    //   để mình kiểm tra nhé.
    // `;

    //     sendAIResponse(responseText);

    //     return;
    //   }
    // }

    const deliveryAreaFromMessage = findDeliveryArea(message);

    console.log("📍 DELIVERY AREA FROM MESSAGE:", deliveryAreaFromMessage);

    if (
      intent.isShipping ||
      userPreferences.awaitingDeliveryArea ||
      userPreferences.lastShippingQuestion ||
      deliveryAreaFromMessage
    ) {
      // ======================================
      // ĐANG Ở NGỮ CẢNH GIAO HÀNG
      // ======================================

      userPreferences.lastShippingQuestion = true;

      const deliveryArea = deliveryAreaFromMessage;

      // ======================================
      // 1. TÌM THẤY TỈNH / THÀNH PHỐ
      // ======================================

      if (deliveryArea) {
        userPreferences.lastDeliveryArea = deliveryArea;
        userPreferences.awaitingDeliveryArea = false;

        const responseText = `
      🚚 <b>Thông tin giao hàng</b>

      <br><br>

      📍 Khu vực:
      <b>${deliveryArea.name}</b>

      <br><br>

      💰 Phí giao hàng dự kiến:
      <b>${Number(deliveryArea.fee).toLocaleString("vi-VN")}đ</b>

      <br><br>

      ⏱️ Thời gian giao dự kiến:
      <b>${deliveryArea.deliveryTime}</b>

      <br><br>

      📦 Phí và thời gian trên là thông tin
      dự kiến và có thể thay đổi tùy địa chỉ cụ thể.
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // 2. KHÁCH VỪA HỎI "GIAO HÀNG"
      // ======================================

      if (intent.isShipping && !deliveryArea) {
        userPreferences.awaitingDeliveryArea = true;

        const responseText = `
      🚚 <b>Thông tin giao hàng</b>

      <br><br>

      Tân Huê Viên có hỗ trợ giao hàng đến nhiều
      tỉnh thành trên toàn quốc.

      <br><br>

      Bạn cho mình biết
      <b>tỉnh/thành phố hoặc khu vực nhận hàng</b>
      nhé.

      <br><br>

      Ví dụ:
      <br>
      • Bến Tre
      <br>
      • Vĩnh Long
      <br>
      • Cần Thơ
      <br>
      • Sóc Trăng
      <br>
      • TP. Hồ Chí Minh
      <br>
      • Hà Nội
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // 3. ĐANG HỎI TIẾP VỀ GIAO HÀNG
      // NHƯNG KHÔNG HỖ TRỢ KHU VỰC
      // ======================================

      if (userPreferences.lastShippingQuestion && !deliveryArea) {
        userPreferences.awaitingDeliveryArea = false;

        const responseText = `
      🚚 <b>Thông tin giao hàng</b>

      <br><br>

      😔 Rất tiếc, hiện tại Tân Huê Viên
      <b>chưa hỗ trợ giao hàng đến khu vực "${message}"</b>.

      <br><br>

      Bạn có thể cho mình biết
      <b>tỉnh/thành phố khác</b>
      để mình kiểm tra nhé.
    `;

        sendAIResponse(responseText);

        return;
      }
    }

    //bew shopinh

    if (
      intent.isShipping ||
      deliveryAreaFromMessage ||
      userPreferences.awaitingDeliveryArea
    ) {
      // ======================================
      // TÌM KHU VỰC GIAO HÀNG
      // ======================================

      const deliveryArea = deliveryAreaFromMessage;

      // ======================================
      // 1. TÌM THẤY TỈNH / THÀNH PHỐ
      // ======================================

      if (deliveryArea) {
        userPreferences.lastDeliveryArea = deliveryArea;
        userPreferences.awaitingDeliveryArea = false;
        userPreferences.lastShippingQuestion = false;

        const responseText = `
      🚚 <b>Thông tin giao hàng</b>

      <br><br>

      📍 Khu vực:
      <b>${deliveryArea.name}</b>

      <br><br>

      💰 Phí giao hàng dự kiến:
      <b>${Number(deliveryArea.fee).toLocaleString("vi-VN")}đ</b>

      <br><br>

      ⏱️ Thời gian giao dự kiến:
      <b>${deliveryArea.deliveryTime}</b>

      <br><br>

      📦 Phí và thời gian trên là thông tin
      dự kiến và có thể thay đổi tùy địa chỉ cụ thể.
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // 2. KHÁCH VỪA HỎI "GIAO HÀNG"
      // ======================================

      if (intent.isShipping) {
        userPreferences.awaitingDeliveryArea = true;
        userPreferences.lastShippingQuestion = true;

        const responseText = `
      🚚 <b>Thông tin giao hàng</b>

      <br><br>

      Tân Huê Viên có hỗ trợ giao hàng đến nhiều
      tỉnh thành trên toàn quốc.

      <br><br>

      Bạn cho mình biết
      <b>tỉnh/thành phố hoặc khu vực nhận hàng</b>
      nhé.

      <br><br>

      Ví dụ:
      <br>
      • Bến Tre
      <br>
      • Vĩnh Long
      <br>
      • Cần Thơ
      <br>
      • Sóc Trăng
      <br>
      • TP. Hồ Chí Minh
      <br>
      • Hà Nội
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // 3. ĐANG CHỜ KHU VỰC NHƯNG KHÔNG TÌM THẤY
      // ======================================

      if (userPreferences.awaitingDeliveryArea) {
        userPreferences.awaitingDeliveryArea = false;
        userPreferences.lastShippingQuestion = false;

        const responseText = `
      🚚 <b>Thông tin giao hàng</b>

      <br><br>

      😔 Rất tiếc, hiện tại Tân Huê Viên
      <b>chưa hỗ trợ giao hàng đến khu vực "${message}"này</b>.

      <br><br>

      Bạn có thể cho mình biết
      <b>tỉnh/thành phố khác</b>
      để mình kiểm tra nhé.
    `;

        sendAIResponse(responseText);

        return;
      }
    }

    //end

    if (intent.isRecommendedQuestion) {
      const recommendedProducts = getRecommendedProducts(intent);

      if (!recommendedProducts.length) {
        sendAIResponse(`
      😔 Mình chưa tìm thấy bánh phù hợp
      với mức giá bạn mong muốn.
    `);

        return;
      }

      let responseText = `
    🥮 Nếu bạn đang tìm bánh ngon,
    mình gợi ý 3 sản phẩm được đánh giá
    và yêu thích tốt trên shop:
  `;

      if (intent.budget) {
        responseText += `
      <br><br>

      💰 Mình ưu tiên các sản phẩm
      trong mức
      <b>${formatBudget(intent.budget)}</b>.
    `;
      }

      responseText += `
    <br><br>

    ${createProductList(recommendedProducts, intent)}

    <br>

    <span class="ai-product-hint">
      👆 Bấm vào sản phẩm để xem
      thông tin chi tiết.
    </span>
  `;

      saveAIContext(recommendedProducts, intent, message);

      sendAIResponse(responseText);

      return;
    }

    if (intent.isProductTypeQuestion) {
      userPreferences.lastProductAttribute = null;
      userPreferences.lastInfoProduct = null;

      const fillings = availableFillings.join(", ");

      const responseText = `
    🥮 Shop hiện có các loại nhân:

    <br><br>

    <b>${fillings}</b>

    <br><br>

    Bạn muốn xem sản phẩm của
    <b>loại nhân nào</b> thì cứ nói với mình nhé.
  `;

      sendAIResponse(responseText);

      return;
    }

    // ======================================
    // FOLLOW-UP SẢN PHẨM
    //
    // Ví dụ:
    //
    // Bánh Kim Sa có ngọt không?
    // → lastProductAttribute = "taste"
    //
    // Còn bánh mè đen thì sao?
    // → tìm bánh mè đen
    // → giữ "taste"
    // → trả độ ngọt bánh mè đen
    // ======================================

    const followUpProduct = findProductFromMessage(message);

    if (followUpProduct && userPreferences.lastProductAttribute) {
      const attribute = userPreferences.lastProductAttribute;

      console.log("🔄 PRODUCT FOLLOW-UP:", followUpProduct.name);

      console.log("🔄 ATTRIBUTE:", attribute);

      // Cập nhật sản phẩm hiện tại
      userPreferences.lastInfoProduct = followUpProduct;

      // ======================================
      // ⭐ XEM THÔNG TIN ĐẦY ĐỦ SẢN PHẨM
      // ======================================

      //   if (attribute === "info") {
      //     const responseText = `
      //   🥮 <b>${followUpProduct.name}</b>

      //   <br><br>

      //   💰 Giá:
      //   <b>${Number(followUpProduct.price).toLocaleString("vi-VN")}đ</b>

      //   <br><br>

      //   📦 Quy cách:
      //   <b>${followUpProduct.shortDescription || "Đang cập nhật"}</b>

      //   <br><br>

      //   📝 Mô tả:
      //   ${followUpProduct.description || "Thông tin sản phẩm đang được cập nhật."}

      //   <br><br>

      //   🌿 Thành phần:
      //   <b>${
      //     Array.isArray(followUpProduct.ingredients)
      //       ? followUpProduct.ingredients.join(", ")
      //       : "Đang cập nhật"
      //   }</b>

      //   <br><br>

      //   🍯 Độ ngọt:
      //   <b>${followUpProduct.taste || "Đang cập nhật"}</b>

      //   <br><br>

      //   📦 Tình trạng:
      //   <b>${
      //     Number(followUpProduct.stock) > 0
      //       ? `Còn ${followUpProduct.stock} sản phẩm`
      //       : "Hết hàng"
      //   }</b>
      // `;

      //     sendAIResponse(responseText);

      //     return;
      //   }

      if (attribute === "info") {
        const product = findProductFromMessage(message);

        console.log("📦 PRODUCT INFO MODE");
        console.log("📦 MESSAGE:", message);
        console.log("📦 PRODUCT RESULT:", product);

        // ======================================
        // 1. TÌM THẤY SẢN PHẨM
        // ======================================

        if (product) {
          userPreferences.lastInfoProduct = product;
          // ⭐ RẤT QUAN TRỌNG
          userPreferences.lastProductAttribute = "info";

          const responseText = `
      🥮 <b>${product.name}</b>

      <br><br>

      💰 Giá:
      <b>${Number(product.price).toLocaleString("vi-VN")}đ</b>

      <br><br>

      📦 Quy cách:
      <b>${product.shortDescription || "Đang cập nhật"}</b>

      <br><br>

      📝 Mô tả:
      ${product.description || "Thông tin sản phẩm đang được cập nhật."}

      <br><br>

      🌿 Thành phần:
      <b>${
        Array.isArray(product.ingredients)
          ? product.ingredients.join(", ")
          : "Đang cập nhật"
      }</b>

      <br><br>

      🍯 Độ ngọt:
      <b>${product.taste || "Đang cập nhật"}</b>

      <br><br>

      📦 Tình trạng:
      <b>${
        Number(product.stock) > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"
      }</b>
    `;

          sendAIResponse(responseText);

          return;
        }

        // ======================================
        // 2. KHÔNG TÌM THẤY SẢN PHẨM
        // ======================================

        sendAIResponse(`
    🔎 <b>Mình chưa tìm thấy sản phẩm này.</b>

    <br><br>

    Hiện tại Tân Huê Viên chưa có
    sản phẩm <b>${message}</b>
    trong danh sách sản phẩm.

    <br><br>

    Bạn có thể nhập lại
    <b>tên bánh chính xác</b>
    để mình kiểm tra nhé.
  `);

        return;
      }

      // ======================================
      // ĐỘ NGỌT
      // ======================================

      if (attribute === "taste") {
        const responseText = `
      🥮 <b>${followUpProduct.name}</b>

      <br><br>

      🍯 <b>Độ ngọt:</b>

      <br><br>

      ${
        followUpProduct.taste ||
        "Thông tin về độ ngọt của sản phẩm đang được cập nhật."
      }
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // THÀNH PHẦN
      // ======================================

      if (attribute === "ingredients") {
        const responseText = `
      🥮 <b>${followUpProduct.name}</b>

      <br><br>

      🌿 <b>Thành phần:</b>

      <br><br>

      ${
        Array.isArray(followUpProduct.ingredients)
          ? followUpProduct.ingredients.join(", ")
          : "Thông tin thành phần đang được cập nhật."
      }
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // QUY CÁCH
      // ======================================

      if (attribute === "size") {
        const responseText = `
      🥮 <b>${followUpProduct.name}</b>

      <br><br>

      📦 <b>Quy cách:</b>

      <br><br>

      ${
        followUpProduct.shortDescription ||
        "Thông tin quy cách đang được cập nhật."
      }
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // TÌNH TRẠNG
      // ======================================

      if (attribute === "stock") {
        const responseText = `
      🥮 <b>${followUpProduct.name}</b>

      <br><br>

      📦 Tình trạng:


<b>
      ${
        Number(followUpProduct.stock) > 0
          ? `Còn ${followUpProduct.stock} sản phẩm`
          : "Hết hàng"
      }</b>
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // FREE SHIP
      // ======================================

      if (attribute === "freeShip") {
        const responseText = `
      🥮 <b>${followUpProduct.name}</b>

      <br><br>

      🚚 <b>Giao hàng:</b>

      <br><br>

      ${
        followUpProduct.isFreeShip
          ? "Sản phẩm được miễn phí giao hàng."
          : "Sản phẩm chưa được hỗ trợ miễn phí giao hàng."
      }
    `;

        sendAIResponse(responseText);

        return;
      }
    }

    // ======================================
    // SẢN PHẨM ĐƯỢC NHẬP SAU KHI CHATBOT
    // ĐANG CHỜ TÊN SẢN PHẨM
    // ======================================

    if (userPreferences.awaitingProductAttribute) {
      const product = findProductFromMessage(message);

      if (product) {
        const attribute = userPreferences.awaitingProductAttribute;

        userPreferences.lastInfoProduct = product;
        userPreferences.lastProductAttribute = attribute;
        userPreferences.awaitingProductAttribute = null;

        // ======================================
        // THÀNH PHẦN
        // ======================================

        if (attribute === "ingredients") {
          const responseText = `
        🥮 <b>${product.name}</b>

        <br><br>

        🌿 <b>Thành phần:</b>

        <br><br>

        ${
          Array.isArray(product.ingredients)
            ? product.ingredients.join(", ")
            : "Thông tin thành phần đang được cập nhật."
        }
      `;

          sendAIResponse(responseText);

          return;
        }

        // ======================================
        // ĐỘ NGỌT
        // ======================================

        if (attribute === "taste") {
          const responseText = `
        🥮 <b>${product.name}</b>

        <br><br>

        🍯 <b>Độ ngọt:</b>

        <br><br>

        ${product.taste || "Thông tin về độ ngọt đang được cập nhật."}
      `;

          sendAIResponse(responseText);

          return;
        }

        // ======================================
        // QUY CÁCH
        // ======================================

        if (attribute === "size") {
          const responseText = `
        🥮 <b>${product.name}</b>

        <br><br>

        📦 <b>Quy cách:</b>

        <br><br>

        ${product.shortDescription || "Thông tin quy cách đang được cập nhật."}
      `;

          sendAIResponse(responseText);

          return;
        }
      }
    }

    // ======================================
    // NGƯỜI DÙNG HỎI THUỘC TÍNH NHƯNG
    // CHƯA CHỈ ĐỊNH SẢN PHẨM
    // ======================================

    if (intent.isIngredientQuestion || intent.isProductIngredientQuestion) {
      const product = findProductFromMessage(message);

      if (product) {
        userPreferences.lastInfoProduct = product;
        userPreferences.lastProductAttribute = "ingredients";
        userPreferences.awaitingProductAttribute = null;

        const responseText = `
      🥮 <b>${product.name}</b>

      <br><br>

      🌿 <b>Thành phần:</b>

      <br><br>

      ${
        Array.isArray(product.ingredients)
          ? product.ingredients.join(", ")
          : "Thông tin thành phần đang được cập nhật."
      }
    `;

        sendAIResponse(responseText);

        return;
      }

      // Chưa có sản phẩm → chờ người dùng nhập tên bánh
      userPreferences.awaitingProductAttribute = "ingredients";

      sendAIResponse(`
    🌿 Bạn đang muốn hỏi về
    <b>thành phần</b> của sản phẩm nào?

    <br><br>

    Bạn cho mình biết
    <b>tên bánh</b> để mình kiểm tra nhé.
  `);

      return;
    }
    // ======================================
    // CÂU HỎI TIẾP THEO VỀ SẢN PHẨM
    // ======================================

    if (userPreferences.lastInfoProduct && !findProductFromMessage(message)) {
      const text = normalizeText(message);

      // ==============================
      // HỎI TÌNH TRẠNG
      // ==============================

      const isStockFollowUp =
        text.includes("con hang") ||
        text.includes("con hang khong") ||
        text.includes("het hang");

      // ==============================
      // HỎI THÀNH PHẦN
      // ==============================

      const isIngredientFollowUp =
        text.includes("thanh phan") ||
        text.includes("nguyen lieu") ||
        text.includes("nhan gi");

      const isSizeFollowUp =
        text.includes("bao nhieu gram") ||
        text.includes("bao nhieu gam") ||
        text.includes("trong luong") ||
        text.includes("khoi luong") ||
        text.includes("bao nhieu cai") ||
        text.includes("bao nhieu banh") ||
        text.includes("mot hop bao nhieu") ||
        text.includes("hop co bao nhieu");

      const isFreeShipFollowUp =
        text.includes("mien phi giao hang") ||
        text.includes("free ship") ||
        text.includes("freeship") ||
        text.includes("co mien phi ship") ||
        text.includes("co free ship") ||
        text.includes("co duoc free ship");

      // ==============================
      // XỬ LÝ TÌNH TRẠNG
      // ==============================

      if (isStockFollowUp) {
        const product = userPreferences.lastInfoProduct;
        userPreferences.lastProductAttribute = "stock";

        const responseText = `
      🥮 <b>${product.name}</b>

      <br><br>

      📦 Tình trạng:
      <b>${
        Number(product.stock) > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"
      }</b>
    `;

        sendAIResponse(responseText);

        return;
      }

      // ==============================
      // XỬ LÝ THÀNH PHẦN
      // ==============================

      if (isIngredientFollowUp) {
        const product = userPreferences.lastInfoProduct;
        // ⭐ GHI NHỚ ĐANG HỎI THÀNH PHẦN
        userPreferences.lastProductAttribute = "ingredients";

        const responseText = `
      🥮 <b>${product.name}</b>

      <br><br>

      🌿 Thành phần:
      <b>${
        Array.isArray(product.ingredients)
          ? product.ingredients.join(", ")
          : "Đang cập nhật"
      }</b>
    `;

        sendAIResponse(responseText);

        return;
      }

      //Xử lý gram

      if (isSizeFollowUp) {
        const product = userPreferences.lastInfoProduct;
        userPreferences.lastProductAttribute = "size";

        const responseText = `
    🥮 <b>${product.name}</b>

    <br><br>

    📦 Quy cách:
    <b>${
      product.shortDescription || "Thông tin quy cách đang được cập nhật."
    }</b>
  `;

        sendAIResponse(responseText);

        return;
      }

      //Ship

      if (isFreeShipFollowUp) {
        const product = userPreferences.lastInfoProduct;

        userPreferences.lastProductAttribute = "freeShip";

        const responseText = `
    🥮 <b>${product.name}</b>

    <br><br>

    🚚 Giao hàng:
    <b>${
      product.isFreeShip
        ? "Sản phẩm được miễn phí giao hàng."
        : "Sản phẩm chưa được hỗ trợ miễn phí giao hàng."
    }</b>
  `;

        sendAIResponse(responseText);

        return;
      }
    }
    //   if (intent.isProductInfoQuestion) {
    //     // const product = findProductFromMessage(message);

    //     console.log("🔎 PRODUCT INFO MESSAGE:", message);

    //     const product = findProductFromMessage(message);

    //     console.log("🔎 PRODUCT INFO RESULT:", product);

    //     if (!product) {
    //       sendAIResponse(`
    //     🔎 Bạn cho mình biết
    //     <b>tên sản phẩm</b> bạn muốn xem
    //     thông tin nhé.
    //   `);

    //       return;
    //     }

    //     userPreferences.lastInfoProduct = product;

    //     console.log("📦 SẢN PHẨM ĐƯỢC HỎI:", product);

    //     const responseText = `
    //   🥮 <b>${product.name}</b>

    //   <br><br>

    //   💰 Giá:
    //   <b>${Number(product.price).toLocaleString("vi-VN")}đ</b>

    //   <br><br>

    //   📦 ${product.shortDescription || "Đang cập nhật"}

    //   <br><br>

    //   📝 ${product.description || "Thông tin sản phẩm đang được cập nhật."}

    //   <br><br>

    //   🌿 Thành phần:
    //   <b>${
    //     Array.isArray(product.ingredients)
    //       ? product.ingredients.join(", ")
    //       : "Đang cập nhật"
    //   }</b>

    //   <br><br>

    //   📦 Tình trạng:
    //   <b>${
    //     Number(product.stock) > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"
    //   }</b>
    // `;

    //     sendAIResponse(responseText);

    //     return;
    //   }
    // if (userPreferences.awaitingProductInfo && !intent.isProductInfoQuestion) {
    //   const product = findProductFromMessage(message);

    //   if (product) {
    //     userPreferences.awaitingProductInfo = false;
    //     userPreferences.lastInfoProduct = product;

    //     const responseText = `
    //   🥮 <b>${product.name}</b>

    //   <br><br>

    //   💰 Giá:
    //   <b>${Number(product.price).toLocaleString("vi-VN")}đ</b>

    //   <br><br>

    //   📦 Quy cách:
    //   <b>${product.shortDescription || "Đang cập nhật"}</b>

    //   <br><br>

    //   📝 Mô tả:
    //   ${product.description || "Đang cập nhật"}

    //   <br><br>

    //   🌿 Thành phần:
    //   <b>${
    //     Array.isArray(product.ingredients)
    //       ? product.ingredients.join(", ")
    //       : "Đang cập nhật"
    //   }</b>

    //   <br><br>

    //   🍯 Độ ngọt:
    //   <b>${product.taste || "Đang cập nhật"}</b>

    //   <br><br>

    //   📦 Tình trạng:
    //   <b>${
    //     Number(product.stock) > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"
    //   }</b>
    // `;

    //     sendAIResponse(responseText);

    //     return;
    //   }
    // }

    // ======================================
    // 🔎 ĐANG CHỜ KHÁCH NHẬP TÊN SẢN PHẨM
    // ======================================

    if (userPreferences.awaitingProductInfo) {
      const product = findProductFromMessage(message);

      console.log("🔎 AWAITING PRODUCT INFO:", message);
      console.log("🔎 PRODUCT RESULT:", product);

      // ======================================
      // 1. TÌM THẤY SẢN PHẨM
      // ======================================

      if (product) {
        userPreferences.awaitingProductInfo = false;
        // ⭐ GHI NHỚ ĐANG Ở CHẾ ĐỘ XEM THÔNG TIN SẢN PHẨM
        userPreferences.lastProductAttribute = "info";
        userPreferences.lastInfoProduct = product;

        const responseText = `
      🥮 <b>${product.name}</b>

      <br><br>

      💰 Giá:
      <b>${Number(product.price).toLocaleString("vi-VN")}đ</b>

      <br><br>

      📦 Quy cách:
      <b>${product.shortDescription || "Đang cập nhật"}</b>

      <br><br>

      📝 Mô tả:
      ${product.description || "Đang cập nhật"}

      <br><br>

      🌿 Thành phần:
      <b>${
        Array.isArray(product.ingredients)
          ? product.ingredients.join(", ")
          : "Đang cập nhật"
      }</b>

      <br><br>

      🍯 Độ ngọt:
      <b>${product.taste || "Đang cập nhật"}</b>

      <br><br>

      📦 Tình trạng:
      <b>${
        Number(product.stock) > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"
      }</b>
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // 2. KHÔNG TÌM THẤY SẢN PHẨM
      // ======================================

      // userPreferences.awaitingProductInfo = false;

      sendAIResponse(`
    🔎 <b>Mình chưa tìm thấy sản phẩm này.</b>

    <br><br>

    Hiện tại Tân Huê Viên chưa có
    sản phẩm <b>${message}</b>
    trong danh sách sản phẩm.

    <br><br>

    Bạn có thể nhập lại
    <b>tên bánh chính xác</b>
    để mình kiểm tra nhé.
  `);

      return;
    }

    if (intent.isProductInfoQuestion) {
      console.log(
        "📦 DEBUG PRODUCT INFO QUESTION:",
        intent.isProductInfoQuestion,
      );

      const product = findProductFromMessage(message);

      // ======================================
      // CÓ TÊN SẢN PHẨM RÕ RÀNG
      // ======================================

      if (product) {
        userPreferences.lastInfoProduct = product;
        userPreferences.awaitingProductInfo = false;

        // ⭐ ĐANG Ở CHẾ ĐỘ XEM THÔNG TIN SẢN PHẨM
        userPreferences.lastProductAttribute = "info";

        console.log("📦 PRODUCT INFO:", product);

        const responseText = `
      🥮 <b>${product.name}</b>

      <br><br>

      💰 Giá:
      <b>${Number(product.price).toLocaleString("vi-VN")}đ</b>

      <br><br>

      📦 Quy cách:
      <b>${product.shortDescription || "Đang cập nhật"}</b>

      <br><br>

      📝 Mô tả:
      ${product.description || "Thông tin sản phẩm đang được cập nhật."}

      <br><br>

      🌿 Thành phần:
      <b>${
        Array.isArray(product.ingredients)
          ? product.ingredients.join(", ")
          : "Đang cập nhật"
      }</b>

      <br><br>

      🍯 Độ ngọt:
      <b>${product.taste || "Đang cập nhật"}</b>

      <br><br>

      📦 Tình trạng:
      <b>${
        Number(product.stock) > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"
      }</b>
    `;

        sendAIResponse(responseText);

        return;
      }

      // ======================================
      // KHÔNG CÓ TÊN SẢN PHẨM
      // ======================================

      userPreferences.awaitingProductInfo = true;

      sendAIResponse(`
    🔎 <b>Bạn muốn xem thông tin sản phẩm nào?</b>

    <br><br>

    Bạn cho mình biết
    <b>tên bánh</b>
    để mình kiểm tra thông tin chi tiết nhé.

    <br><br>

    Ví dụ:
    <br>
    • Bánh Pía Kim Sa
    <br>
    • Bánh Pía Mè Đen
    <br>
    • Bánh Pía Truyền Thống
  `);

      return;
    }
    // ======================================
    // KHÁCH ĐANG TRẢ LỜI TÊN SẢN PHẨM
    // CHO CÂU HỎI VỀ ĐỘ NGỌT
    // ======================================

    if (userPreferences.awaitingTasteProduct) {
      console.log("🍯 ĐANG CHỜ SẢN PHẨM ĐỂ HỎI ĐỘ NGỌT");

      const product = findProductFromMessage(message);

      if (product) {
        console.log("🍯 TÌM THẤY SẢN PHẨM CHO TASTE FOLLOW-UP:", product);

        userPreferences.awaitingTasteProduct = false;

        userPreferences.lastInfoProduct = product;

        const responseText = `
      🥮 <b>${product.name}</b>

      <br><br>

      🍯 <b>Độ ngọt:</b>

      <br><br>

      ${
        product.taste || "Thông tin về độ ngọt của sản phẩm đang được cập nhật."
      }
    `;

        sendAIResponse(responseText);

        return;
      }

      // Không tìm thấy sản phẩm
      sendAIResponse(`
    😔 Mình chưa tìm thấy sản phẩm
    <b>${message}</b>.

    <br><br>

    Bạn hãy nhập chính xác tên bánh
    để mình kiểm tra độ ngọt nhé.
  `);

      return;
    }

    if (
      intent.filling &&
      !intent.isProductInfoQuestion &&
      !userPreferences.awaitingProductInfo
    ) {
      console.log("🔎 DEBUG PRODUCT INFO:", intent.isProductInfoQuestion);
      console.log("🔎 DEBUG FILLING:", intent.filling);
      console.log("🔎 DEBUG INTENT:", intent);
      const fillingProducts = getProductsByFilling(intent.filling);

      if (!fillingProducts.length) {
        sendAIResponse(`
      😔 Mình chưa tìm thấy sản phẩm
      có nhân <b>${intent.filling}</b>
      phù hợp.
    `);

        return;
      }

      let responseText = `
    🥮 Đây là những sản phẩm có nhân <b>${intent.filling}</b>
    mình tìm thấy cho bạn:
    
    <br><br>

    ${createProductList(fillingProducts, intent)}

    <br>

    <span class="ai-product-hint">
      👆 Bấm vào sản phẩm để xem
      thông tin chi tiết.
    </span>
  `;

      sendAIResponse(responseText);

      return;
    }

    //Thong tin shop

    if (intent.isShopAddressQuestion) {
      console.log("🏪 DEBUG SHOP ADDRESS:", intent.isShopAddressQuestion);

      console.log("🚚 DEBUG SHIPPING:", intent.isShipping);

      const responseText = `
    🏪 <b>${shopInfo.name}</b>

    <br><br>

    📍 Địa chỉ:
    <b>${shopInfo.address}</b>

    <br><br>

     📍 Địa chỉ mới:
    <b>${shopInfo.newAddress}</b>

    <br><br>

    📞 Điện thoại:
    <b>${shopInfo.phone}</b>

    <br><br>

    🕐 Giờ mở cửa:
    <b>${shopInfo.openingHours}</b>
    <br><br>
    👤 Giám đốc:
    <b>${shopInfo.director}</b>
  `;

      sendAIResponse(responseText);

      return;
    }

    if (intent.isDirectorQuestion) {
      const responseText = `
    🏢 <b>${shopInfo.name}</b>

    <br><br>

    👤 Giám đốc:
    <b>${shopInfo.director}</b>
  `;

      sendAIResponse(responseText);

      return;
    }

    if (intent.isShopPhoneQuestion) {
      const responseText = `
    🏪 <b>${shopInfo.name}</b>

    <br><br>

    📞 Số điện thoại:
    <b>${shopInfo.phone}</b>
  `;

      sendAIResponse(responseText);

      return;
    }

    if (intent.isShopOpeningHoursQuestion) {
      const responseText = `
    🏪 <b>${shopInfo.name}</b>

    <br><br>

    🕐 Giờ mở cửa:
    <b>${shopInfo.openingHours}</b>
  `;

      sendAIResponse(responseText);

      return;
    }

    if (intent.isPaymentQuestion) {
      const responseText = `
    💳 <b>Phương thức thanh toán</b>

    <br><br>

    Shop hỗ trợ các hình thức:

    <br><br>

    ${shopInfo.paymentMethods.map((method) => `• ${method}`).join("<br>")}
  `;

      sendAIResponse(responseText);

      return;
    }
    if (intent.isReturnPolicyQuestion) {
      const responseText = `
    🔄 <b>Chính sách đổi / trả hàng</b>

    <br><br>

    ${shopInfo.returnPolicy}
  `;

      sendAIResponse(responseText);

      return;
    }
    if (intent.isProductIssueQuestion) {
      const responseText = `
    📦 <b>Xử lý khi sản phẩm có vấn đề</b>

    <br><br>

    ${shopInfo.productIssuePolicy}
  `;

      sendAIResponse(responseText);

      return;
    }

    if (intent.isOrderQuestion) {
      const responseText = `
    🛒 <b>Cách đặt hàng</b>

    <br><br>

    ${shopInfo.orderGuide}

    <br><br>

    Nếu cần, mình có thể giúp bạn tìm sản phẩm phù hợp
    trước khi đặt hàng nhé.
  `;

      sendAIResponse(responseText);

      return;
    }

    if (intent.isOrderStatusQuestion) {
      const responseText = `
    📦 <b>Kiểm tra đơn hàng</b>

    <br><br>

    ${shopInfo.orderTracking}
  `;

      sendAIResponse(responseText);

      return;
    }
    // ======================================
    // 1. HỎI GIÁ SỈ / CHIẾT KHẤU
    // ======================================

    if (intent.isBulkDiscountQuestion) {
      addMessage(
        `
        📦 Nếu bạn mua số lượng lớn,
        mình có thể hỗ trợ kiểm tra thông tin
        giá sỉ hoặc ưu đãi theo số lượng.

        <br><br>

        ${
          intent.quantity
            ? `
              Mình ghi nhận bạn muốn mua
              khoảng <b>${intent.quantity}</b>
              sản phẩm.
            `
            : `
              Bạn dự định mua khoảng
              <b>bao nhiêu</b> sản phẩm?
            `
        }
        `,
        "bot",
      );

      return;
    }

    // ======================================
    // 2. MUA SỐ LƯỢNG LỚN
    // ======================================

    if (intent.isBulk) {
      if (intent.quantity) {
        addMessage(
          `
          📦 Mình hiểu bạn muốn mua
          <b>${intent.quantity} sản phẩm</b>.

          <br><br>

          Với đơn số lượng lớn, mình có thể
          giúp bạn tìm sản phẩm phù hợp hơn.

          <br><br>

          Bạn có muốn mình tư vấn
          <b>giá sỉ hoặc ưu đãi theo số lượng</b>
          không?
          `,
          "bot",
        );
      } else {
        addMessage(
          `
          📦 Mình hiểu bạn đang muốn mua
          <b>số lượng lớn</b>.

          <br><br>

          Bạn dự định mua khoảng
          <b>bao nhiêu sản phẩm</b>
          để mình tư vấn phù hợp hơn?
          `,
          "bot",
        );
      }

      return;
    }

    //3.San pham khac

    // ======================================
    // SẢN PHẨM KHÁC
    // ======================================

    if (intent.isDifferentProductQuestion) {
      const differentProducts = getDifferentProducts(intent);

      if (!differentProducts.length) {
        addMessage(
          `
      😔 Mình chưa tìm thấy sản phẩm khác
      phù hợp với yêu cầu hiện tại.

      <br><br>

      Bạn có thể thử thay đổi
      mức giá hoặc tiêu chí tìm kiếm nhé.
      `,
          "bot",
        );

        return;
      }

      saveAIContext(differentProducts, intent, message);

      let response = `
    🥮 Mình tìm thêm một số sản phẩm khác
    cho bạn:
  `;

      if (intent.budget) {
        response += `
      <br><br>

      Mình ưu tiên các sản phẩm
      trong mức
      <b>${formatBudget(intent.budget)}</b>.
    `;
      }

      if (intent.priceDirection === "cheaper") {
        response += `
      <br><br>

      Mình đã ưu tiên những sản phẩm
      có giá thấp hơn lựa chọn trước đó.
    `;
      }

      response += `
    <br><br>

    ${createProductList(differentProducts, intent)}

    <br>

    <span class="ai-product-hint">
      👆 Bấm vào sản phẩm để xem
      thông tin chi tiết.
    </span>
  `;

      addMessage(response, "bot");

      return;
    }

    // ======================================
    // 3. SẢN PHẨM MỚI
    // ======================================

    if (intent.isNewProduct) {
      const newProducts = getNewProducts(intent);

      userPreferences.lastProductFilter = {
        type: "new",
      };

      // LƯU CONTEXT
      saveAIContext(newProducts, intent, message);

      if (!newProducts || newProducts.length === 0) {
        sendAIResponse(
          `
          🆕 Mình chưa tìm thấy sản phẩm mới
          phù hợp với yêu cầu hiện tại.

          <br><br>

          Bạn có thể thử thay đổi
          mức giá nhé.
          `,
        );

        return;
      }

      // DÙNG responseText
      // KHÔNG dùng let message

      let responseText = `
        🆕 Đây là những sản phẩm mới
        mình tìm thấy cho bạn:
      `;

      if (intent.budget) {
        responseText += `
          <br><br>

          Mình ưu tiên các sản phẩm mới
          trong mức
          <b>
            ${formatBudget(intent.budget)}
          </b>.
        `;
      }

      responseText += `
        <br><br>

        ${createProductList(newProducts, intent)}

        <br>

        <span class="ai-product-hint">
          👆 Bấm vào sản phẩm để xem
          thông tin chi tiết.
        </span>
      `;

      sendAIResponse(responseText);

      return;
    }

    // ======================================
    // 4. KHUYẾN MÃI
    // ======================================

    if (intent.isSaleQuestion) {
      userPreferences.lastFollowUpPrice = null;
      const saleProducts = getSaleProducts(intent);

      userPreferences.lastProductFilter = {
        type: "sale",
      };

      saveAIContext(saleProducts, intent, message);

      if (!saleProducts || saleProducts.length === 0) {
        sendAIResponse(
          `
          😔 Hiện mình chưa tìm thấy
          sản phẩm khuyến mãi phù hợp
          với yêu cầu của bạn.

          <br><br>

          Bạn có thể thử thay đổi
          mức giá nhé.
          `,
        );

        return;
      }

      let responseText = `
        🔥 Đây là những sản phẩm đang có <b> ưu đãi </b> mà mình tìm thấy
        cho bạn:
      `;

      if (intent.budget) {
        responseText += `
          <br><br>

          Mình ưu tiên các sản phẩm
          trong mức
          <b>
            ${formatBudget(intent.budget)}
          </b>.
        `;
      }

      responseText += `
        <br><br>

        ${createProductList(saleProducts, intent)}

        <br>

        <span class="ai-product-hint">
          👆 Bấm vào sản phẩm để xem
          thông tin chi tiết.
        </span>
      `;

      sendAIResponse(responseText);
      sendAIResponse(` <b>📢 Ngoài ra còn các ưu đãi khác như: </b>
        </br> </br>
        • 🚚 <b>Miễn phí giao hàng </b> cho đơn từ 500k.
           </br>
           </br>
        • 🎁 <b>Tặng túi giấy cao cấp </b> cho đơn từ 2 sản phẩm.
           </br>  </br>
        • ⭐ <b>Tích lũy điểm thành viên </b> khi tham gia mua sắm và còn nhiều ưu đãi khác đang đợi bạn.
        `);

      return;
    }

    // ======================================
    // 5. SẢN PHẨM BÁN CHẠY
    // ======================================

    if (intent.isBestSellerQuestion) {
      userPreferences.lastFollowUpPrice = null;
      const bestProducts = getBestSellerProducts(intent);

      userPreferences.lastProductFilter = {
        type: "bestSeller",
      };

      saveAIContext(bestProducts, intent, message);

      if (!bestProducts.length) {
        sendAIResponse(
          `
          😔 Mình chưa tìm thấy
          sản phẩm bán chạy phù hợp
          với yêu cầu của bạn.
          `,
        );

        return;
      }

      let responseText = `
        🔥 Đây là những sản phẩm
        bán chạy mà mình tìm thấy
        cho bạn:
      `;

      if (intent.budget) {
        responseText += `
          <br><br>

          Mình ưu tiên sản phẩm trong mức
          <b>
            ${formatBudget(intent.budget)}
          </b>.
        `;
      }

      responseText += `
        <br><br>

        ${createProductList(bestProducts, intent)}

        <br>

        <span class="ai-product-hint">
          👆 Bấm vào sản phẩm để xem
          thông tin chi tiết.
        </span>
      `;

      sendAIResponse(responseText);

      return;
    }

    // ======================================
    // 6. SẢN PHẨM ĐÁNH GIÁ CAO
    // ======================================

    if (intent.isTopRatedQuestion) {
      userPreferences.lastFollowUpPrice = null;
      const topProducts = getTopRatedProducts(intent);

      userPreferences.lastProductFilter = {
        type: "topRated",
      };

      saveAIContext(topProducts, intent, message);

      if (!topProducts.length) {
        sendAIResponse(
          `
          😔 Mình chưa tìm thấy
          sản phẩm được đánh giá cao
          phù hợp với yêu cầu của bạn.
          `,
        );

        return;
      }

      let responseText = `
        ⭐ Đây là những sản phẩm
        được đánh giá cao mà mình
        tìm thấy cho bạn:
      `;

      if (intent.budget) {
        responseText += `
          <br><br>

          Mình ưu tiên sản phẩm trong mức
          <b>
            ${formatBudget(intent.budget)}
          </b>.
        `;
      }

      responseText += `
        <br><br>

        ${createProductList(topProducts, intent)}

        <br>

        <span class="ai-product-hint">
          👆 Bấm vào sản phẩm để xem
          thông tin chi tiết.
        </span>
      `;

      sendAIResponse(responseText);

      return;
    }

    // ======================================
    // YÊU CẦU THEO NGÂN SÁCH
    // Ví dụ:
    // "dưới 500k"
    // "trên 200k"
    // "100k - 200k"
    // ======================================

    if (
      intent.budget &&
      !intent.isNewProduct &&
      !intent.isSaleQuestion &&
      !intent.isBestSellerQuestion &&
      !intent.isTopRatedQuestion &&
      !intent.isSearchProductQuestion &&
      !intent.isBulk &&
      !intent.isBulkDiscountQuestion
    ) {
      const budgetProducts = recommendProducts(intent);

      console.log("💰 SẢN PHẨM THEO NGÂN SÁCH:", budgetProducts);

      if (!budgetProducts || budgetProducts.length === 0) {
        sendAIResponse(`
      😔 Mình chưa tìm thấy sản phẩm
      phù hợp với mức giá
      <b>${formatBudget(intent.budget)}</b>.
    `);

        return;
      }

      // ======================================
      // QUAN TRỌNG:
      // LƯU DANH SÁCH VỪA HIỂN THỊ
      // ======================================

      saveAIContext(budgetProducts, intent, message);

      // ======================================
      // HIỂN THỊ
      // ======================================

      let responseText = `
    🥮 Đây là những sản phẩm
    phù hợp với mức giá
    <b>${formatBudget(intent.budget)}</b>
    mà mình tìm thấy cho bạn:
  `;

      responseText += `
    <br><br>

    ${createProductList(budgetProducts, intent)}

    <br>

    <span class="ai-product-hint">
      👆 Bấm vào sản phẩm để xem
      thông tin chi tiết.
    </span>
  `;

      sendAIResponse(responseText);

      return;
    }

    // ======================================
    // 7. TÌM KIẾM SẢN PHẨM
    // ======================================

    if (intent.isSearchProductQuestion) {
      const searchResults = searchProducts(message, intent);

      saveAIContext(searchResults, intent, message);

      if (!searchResults.length) {
        sendAIResponse(
          `
          😔 Mình chưa tìm thấy sản phẩm
          phù hợp với yêu cầu của bạn.

          <br><br>

          Bạn có thể thử tìm theo tên bánh,
          loại nhân hoặc mức giá nhé.
          `,
        );

        return;
      }

      let responseText = `
        🥮 Mình tìm thấy một số sản phẩm
        phù hợp với yêu cầu của bạn:
      `;

      if (intent.budget) {
        responseText += `
          <br><br>

          Mình ưu tiên sản phẩm trong mức
          <b>
            ${formatBudget(intent.budget)}
          </b>.
        `;
      }

      responseText += `
        <br><br>

        ${createProductList(searchResults, intent)}

        <br>

        <span class="ai-product-hint">
          👆 Bấm vào sản phẩm để xem
          thông tin chi tiết.
        </span>
      `;

      sendAIResponse(responseText);

      return;
    }

    //

    // ======================================
    // PRODUCT FOLLOW-UP
    // Ví dụ:
    // "Còn Premium thì sao?"
    // "Còn loại Premium?"
    // "Thế Premium?"
    // ======================================

    const productKeywordFollowUp = findProductKeywordFromMessage(message);

    const isProductFollowUp =
      userPreferences.lastInfoProduct &&
      productKeywordFollowUp &&
      (normalizeText(message).includes("con") ||
        normalizeText(message).includes("the") ||
        normalizeText(message).includes("loai") ||
        normalizeText(message).includes("san pham"));

    if (isProductFollowUp) {
      console.log("🔄 PRODUCT FOLLOW-UP:", productKeywordFollowUp);

      userPreferences.lastInfoProduct = productKeywordFollowUp;

      // Nếu người dùng chỉ đang hỏi về sản phẩm
      // thì hiển thị thông tin sản phẩm

      const product = productKeywordFollowUp;

      const responseText = `
    🥮 <b>${product.name}</b>

    <br><br>

    💰 Giá:
    <b>${Number(product.price).toLocaleString("vi-VN")}đ</b>

    <br><br>

    📦 ${product.shortDescription || "Đang cập nhật"}

    <br><br>

    📝 ${product.description || "Thông tin sản phẩm đang được cập nhật."}

    <br><br>

    🌿 Thành phần:
    <b>${
      Array.isArray(product.ingredients)
        ? product.ingredients.join(", ")
        : "Đang cập nhật"
    }</b>

    <br><br>

    📦 Tình trạng:
    <b>${
      Number(product.stock) > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"
    }</b>
  `;

      sendAIResponse(responseText);

      return;
    }

    // ======================================
    // 8. AI TRẢ LỜI THÔNG THƯỜNG
    // ======================================
    if (intent.isGeneralQuestion) {
      const responseText = await askGeneralAI(message);
      //     `
      //   🤖 Mình có thể hỗ trợ bạn về các sản phẩm
      //   và thông tin của Tân Huê Viên.

      //   <br><br>

      //   Bạn có thể hỏi mình về:
      //   <br>
      //   • 🥮 Sản phẩm và giá
      //   <br>
      //   • 🚚 Giao hàng
      //   <br>
      //   • 🏪 Thông tin cửa hàng
      //   <br>
      //   • 💳 Thanh toán
      //   <br>
      //   • 📦 Đơn hàng
      // `;

      sendAIResponse(responseText);

      return;
    }

    // // ======================================
    // // HIỂN THỊ
    // // ======================================

    // addMessage(response, "bot");

    //   const response = getAIResponse(message, intent);

    //   sendAIResponse(response);
    // }, 800);

    const response = getAIResponse(message, intent);

    sendAIResponse(response);
  } finally {
    removeTyping();
    // Đảm bảo luôn mở lại ô nhập nếu xảy ra lỗi
    setAIResponding(false);
  }
}
function getNewProducts(intent) {
  let results = products.filter((product) => product.isNew === true);

  // ======================================
  // LỌC THEO NGÂN SÁCH
  // ======================================

  if (intent.budget) {
    results = results.filter((product) => {
      const price = Number(product.price);

      if (isNaN(price)) {
        return false;
      }

      // ------------------------------
      // khoảng giá
      // ------------------------------

      if (intent.budget.type === "range") {
        return price >= intent.budget.min && price <= intent.budget.max;
      }

      // ------------------------------
      // dưới giá
      // ------------------------------

      if (intent.budget.type === "max") {
        return price <= intent.budget.max;
      }

      // ------------------------------
      // trên giá
      // ------------------------------

      if (intent.budget.type === "min") {
        return price >= intent.budget.min;
      }

      // ------------------------------
      // giá mục tiêu
      // ------------------------------

      if (intent.budget.type === "target") {
        return price <= intent.budget.target;
      }

      return true;
    });
  }

  // ======================================
  // SẮP XẾP
  // ======================================

  results.sort((a, b) => Number(b.id) - Number(a.id));

  // ======================================
  // CHỈ LẤY 3 SẢN PHẨM
  // ======================================

  return results.slice(0, 3);
}

function mergeIntentWithMemory(intent) {
  const memory = getAIMemory();

  return {
    ...intent,

    // ======================================
    // GIỮ MEMORY
    // ======================================

    budget: intent.budget ?? memory.budget,

    minBudget: intent.minBudget ?? memory.minBudget,

    maxBudget: intent.maxBudget ?? memory.maxBudget,

    purpose: intent.purpose ?? memory.purpose,

    recipient: intent.recipient ?? memory.recipient,

    flavor: intent.flavor ?? memory.flavor,

    preference: intent.preference ?? memory.preference,

    quantity: intent.quantity ?? memory.quantity,

    // ======================================
    // PRICE DIRECTION
    // ======================================
    // Không lấy "rẻ hơn / đắt hơn" cũ

    priceDirection: intent.priceDirection || null,

    // ======================================
    // NHÓM SẢN PHẨM CUỐI
    // ======================================

    lastProductFilter: userPreferences.lastProductFilter || null,

    // ======================================
    // SẢN PHẨM CUỐI
    // ======================================

    lastProducts: Array.isArray(userPreferences.lastProducts)
      ? userPreferences.lastProducts
      : [],

    lastProductIds: Array.isArray(userPreferences.lastProductIds)
      ? userPreferences.lastProductIds
      : [],
  };
}

function getSoldNumber(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  const text = String(value).toLowerCase().replace(",", ".").trim();

  if (text.endsWith("k")) {
    return parseFloat(text.replace("k", "")) * 1000;
  }

  return parseFloat(text) || 0;
}
function getFollowUpProducts(intent) {
  const filter = userPreferences.lastProductFilter;

  // ======================================
  // 1. KIỂM TRA FILTER
  // ======================================

  if (!filter) {
    console.log("❌ Không có lastProductFilter");
    return [];
  }

  // ======================================
  // 2. LẤY TOÀN BỘ CATALOG
  // ======================================

  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length) {
    console.log("❌ Không có productData");
    return [];
  }

  // ======================================
  // 3. INTENT GỐC
  // ======================================

  const baseIntent = {
    ...(userPreferences.lastBaseIntent || {}),
    ...intent,

    // Không để ngân sách cũ
    // chặn follow-up giá
    budget: null,
    minBudget: null,
    maxBudget: null,

    priceDirection: null,
  };

  // ======================================
  // 4. DANH SÁCH SẢN PHẨM
  // ======================================

  let resultProducts = [];

  // ======================================
  // 5. SẢN PHẨM MỚI
  // ======================================

  if (filter.type === "new") {
    resultProducts = getNewProducts(baseIntent);
  }

  // ======================================
  // 6. KHUYẾN MÃI
  // ======================================
  else if (filter.type === "sale") {
    resultProducts = getSaleProducts(baseIntent);
  }

  // ======================================
  // 7. BÁN CHẠY
  // ======================================
  else if (filter.type === "bestSeller") {
    resultProducts = getBestSellerProducts(baseIntent);
  }

  // ======================================
  // 8. ĐÁNH GIÁ CAO
  // ======================================
  else if (filter.type === "topRated") {
    resultProducts = getTopRatedProducts(baseIntent);
  }

  // ======================================
  // 9. YÊU CẦU THÔNG THƯỜNG
  // ======================================
  else if (filter.type === "all") {
    // QUAN TRỌNG:
    // Không lấy lastProducts.
    // Phải lấy toàn bộ catalog.

    resultProducts = [...productData];

    // ==================================
    // GIỮ HƯƠNG VỊ / LOẠI BÁNH CŨ
    // ==================================

    if (baseIntent.flavor) {
      const flavor = String(baseIntent.flavor).toLowerCase().trim();

      resultProducts = resultProducts.filter((product) => {
        const text = `
          ${product.name || ""}
          ${product.category || ""}
          ${product.description || ""}
          ${(product.ingredients || []).join(" ")}
        `.toLowerCase();

        return text.includes(flavor);
      });
    }
  }

  // ======================================
  // 10. KIỂM TRA DANH SÁCH
  // ======================================

  if (!Array.isArray(resultProducts) || resultProducts.length === 0) {
    console.log("❌ Không có sản phẩm để lọc");

    return [];
  }

  // ======================================
  // 11. DEBUG DANH SÁCH GỐC
  // ======================================

  console.log(
    "🛍️ DANH SÁCH GỐC FOLLOW-UP:",
    resultProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
    })),
  );

  // ======================================
  // 12. GIÁ THAM CHIẾU
  // ======================================

  const minDisplayedPrice = userPreferences.lastDisplayedMinPrice;

  const maxDisplayedPrice = userPreferences.lastDisplayedMaxPrice;

  console.log("💰 GIÁ THẤP NHẤT ĐANG HIỂN THỊ:", minDisplayedPrice);

  console.log("💰 GIÁ CAO NHẤT ĐANG HIỂN THỊ:", maxDisplayedPrice);

  // ======================================
  // 13. RẺ HƠN
  // ======================================

  if (intent.priceDirection === "cheaper" && minDisplayedPrice != null) {
    console.log("🔽 TÌM SẢN PHẨM RẺ HƠN:", minDisplayedPrice);

    resultProducts = resultProducts.filter((product) => {
      const price = Number(product.price);

      return !isNaN(price) && price < Number(minDisplayedPrice);
    });

    // Gần giá cũ nhất trước
    resultProducts.sort((a, b) => {
      return Number(b.price) - Number(a.price);
    });
  }

  // ======================================
  // 14. ĐẮT HƠN
  // ======================================
  else if (
    intent.priceDirection === "more_expensive" &&
    maxDisplayedPrice != null
  ) {
    console.log("🔼 TÌM SẢN PHẨM ĐẮT HƠN:", maxDisplayedPrice);

    resultProducts = resultProducts.filter((product) => {
      const price = Number(product.price);

      return !isNaN(price) && price > Number(maxDisplayedPrice);
    });

    // Gần giá cũ nhất trước
    resultProducts.sort((a, b) => {
      return Number(a.price) - Number(b.price);
    });
  }

  // ======================================
  // 15. DEBUG KẾT QUẢ
  // ======================================

  console.log(
    "🎯 KẾT QUẢ FOLLOW-UP:",
    resultProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
    })),
  );

  // ======================================
  // 16. CHỈ LẤY 3 SẢN PHẨM
  // ======================================

  return resultProducts.slice(0, 3);
}
// ======================================
// GỬI CÂU TRẢ LỜI CỦA AI
// ======================================

// function sendAIResponse(response) {
//   // Nếu không có câu trả lời
//   if (!response) return;

//   // ==================================
//   // LƯU LỊCH SỬ HỘI THOẠI
//   // ==================================

//   conversationHistory.push({
//     role: "assistant",
//     content: response,
//   });

//   // ==================================
//   // HIỂN THỊ CHATBOX
//   // ==================================

//   addMessage(response, "bot");
//   saveChatHistory();
// }

function sendAIResponse(response) {
  // ======================================
  // NẾU KHÔNG CÓ CÂU TRẢ LỜI
  // ======================================

  if (!response) {
    setAIResponding(false);
    return;
  }

  // ======================================
  // LƯU LỊCH SỬ HỘI THOẠI
  // ======================================

  conversationHistory.push({
    role: "assistant",
    content: response,
    timestamp: Date.now(),
  });

  // ======================================
  // HIỂN THỊ CÂU TRẢ LỜI
  // ======================================

  addMessage(response, "bot", Date.now());

  saveChatHistory();

  // ======================================
  // AI TRẢ LỜI XONG
  // → MỞ LẠI Ô NHẬP
  // ======================================

  setAIResponding(false);
}

// ======================================
// ENTER ĐỂ GỬI
// ======================================

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    if (isAIResponding) {
      return;
    }
    sendMessage();
  }
});

sendButton.addEventListener("click", sendMessage);

// ======================================
// THÊM MESSAGE
// ======================================

// function addMessage(message, type) {
//   const messageElement = document.createElement("div");

//   messageElement.classList.add("ai-message", type);

//   if (type === "bot") {
//     messageElement.innerHTML = `
//             <div class="message-avatar">
//                 🤖
//             </div>

//             <div class="message-content">

//                 <div class="message-bubble">
//                     ${message}
//                 </div>

//                 <span class="message-time">
//                     Vừa xong
//                 </span>

//             </div>
//         `;
//   } else {
//     messageElement.innerHTML = `

//             <div class="message-content">

//                 <div class="message-bubble">
//                     ${message}
//                 </div>

//                 <span class="message-time">
//                     Vừa xong
//                 </span>

//             </div>

//         `;
//   }

//   chatBody.appendChild(messageElement);

//   scrollToBottom();
// }

// ======================================
// THÊM MESSAGE
// ======================================

function addMessage(message, type, timestamp = Date.now()) {
  const messageElement = document.createElement("div");

  messageElement.classList.add("ai-message", type);

  messageElement.dataset.timestamp = timestamp;

  const timeText = timeAgo(timestamp);

  if (type === "bot") {
    messageElement.innerHTML = `
      <div class="message-avatar">
        🤖
      </div>

      <div class="message-content">

        <div class="message-bubble">
          ${message}
        </div>

        <span class="message-time">
          ${timeText}
        </span>

      </div>
    `;
  } else {
    messageElement.innerHTML = `

      <div class="message-content">

        <div class="message-bubble">
          ${message}
        </div>

        <span class="message-time">
          ${timeText}
        </span>

      </div>

    `;
  }

  chatBody.appendChild(messageElement);

  scrollToBottom();
}

// ======================================
// AI ĐANG NHẬP
// ======================================

function showTyping() {
  const typing = document.createElement("div");

  typing.id = "aiTyping";

  typing.className = "ai-message bot";

  typing.innerHTML = `

        <div class="message-avatar">
            🤖
        </div>

        <div class="message-content">

            <div class="message-bubble">
                Đang suy nghĩ...
            </div>

        </div>

    `;

  chatBody.appendChild(typing);

  scrollToBottom();
}

// ======================================
// XÓA TYPING
// ======================================

function removeTyping() {
  const typing = document.getElementById("aiTyping");

  if (typing) {
    typing.remove();
  }
}

// ======================================
// CUỘN XUỐNG
// ======================================

function scrollToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ======================================
// HỖ TRỢ SẢN PHẨM
// ======================================

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

// ======================================
// TÌM SẢN PHẨM THEO GIÁ
// ======================================

function findProductsByPrice(maxPrice) {
  return products
    .filter((product) => product.price <= maxPrice)
    .sort((a, b) => b.rating - a.rating);
}

// ======================================
// TÌM SẢN PHẨM THEO TỪ KHÓA
// ======================================

function searchProducts(keyword) {
  const text = keyword.toLowerCase();

  return products.filter((product) => {
    const searchableText = `
      ${product.name}
      ${product.category}
      ${product.description}
      ${product.shortDescription}
      ${product.ingredients?.join(" ")}
    `.toLowerCase();

    return searchableText.includes(text);
  });
}

// ======================================
// HIỂN THỊ DANH SÁCH SẢN PHẨM
// ======================================

// function createProductList(productList) {
//   if (!productList || productList.length === 0) {
//     return `
//       Mình chưa tìm thấy sản phẩm phù hợp 😢
//     `;
//   }

//   // Chỉ hiển thị tối đa 3 sản phẩm
//   const list = productList.slice(0, 3);

//   let html = `
//     <div class="ai-product-list">
//   `;

//   list.forEach((product) => {
//     html += `

//       <div class="ai-product-card">

//         <img
//           src="${product.image}"
//           alt="${product.name}"
//         >

//         <div class="ai-product-info">

//           <div class="ai-product-name">
//             ${product.name}
//           </div>

//           <div class="ai-product-price">
//             ${formatPrice(product.price)}
//           </div>

//           <div class="ai-product-rating">
//             ⭐ ${product.rating}
//           </div>

//         </div>

//       </div>

//     `;
//   });

//   html += `
//     </div>
//   `;

//   return html;
// }

function createProductList(productList) {
  if (!productList || productList.length === 0) {
    return `
            <div class="ai-no-product">
                😔 Mình chưa tìm thấy sản phẩm
                phù hợp.
            </div>
        `;
  }

  const list = productList.slice(0, 3);

  let html = `
        <div class="ai-product-list">
    `;

  list.forEach((product) => {
    const name = product.name || "Sản phẩm";

    const price = product.price ? formatPrice(product.price) : "Liên hệ";

    const image = product.image || "";

    const rating = product.rating || 0;

    html += `
            <div class="ai-product-card" onClick = "forwardToDetail(${product.id})">

                ${
                  image
                    ? `
                        <img
                            src="${image}"
                            alt="${name}"
                            onerror="this.style.display='none'"
                        >
                    `
                    : ""
                }

                <div class="ai-product-info">

                    <div class="ai-product-name">
                        ${name}
                    </div>

                    <div class="ai-product-price">
                        ${price}  ${
                          product.discount
                            ? `
                <span class="ai-discount ">
                    -${product.discount}%
                </span>
            `
                            : ""
                        }
                    </div>

                    <div class="ai-product-rating">
                        ⭐ ${rating}
                    </div>

                </div>

            </div>
        `;
  });

  html += `
        </div>
    `;

  return html;
}

// ======================================
// PHÂN TÍCH NGÂN SÁCH
// ======================================

// ======================================
// CHUẨN HÓA TIẾNG VIỆT
// ======================================

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

// ======================================
// PHÂN TÍCH NGÂN SÁCH
// ======================================

// ======================================
// PHÂN TÍCH NGÂN SÁCH
// ======================================

function extractBudget(text) {
  const normalized = normalizeText(text);

  // ==================================
  // KHOẢNG GIÁ
  // Ví dụ:
  // 100k - 200k
  // 100k đến 200k
  // 100 nghìn đến 200 nghìn
  // ==================================

  let rangeMatch = normalized.match(
    /(\d+(?:[.,]\d+)?)\s*(k|nghin|ngan)?\s*(?:-|den|toi)\s*(\d+(?:[.,]\d+)?)\s*(k|nghin|ngan)?/,
  );

  if (rangeMatch) {
    const number1 = Number(rangeMatch[1].replace(",", "."));

    const number2 = Number(rangeMatch[3].replace(",", "."));

    const unit1 = rangeMatch[2];
    const unit2 = rangeMatch[4];

    const min = convertMoney(number1, unit1);

    const max = convertMoney(number2, unit2 || unit1);

    return {
      type: "range",
      min: Math.min(min, max),
      max: Math.max(min, max),
    };
  }

  // ==================================
  // TRÊN / TỪ ... TRỞ LÊN
  //
  // trên 100k
  // tren 100k
  // từ 100k trở lên
  // tu 100k tro len
  // ít nhất 100k
  // it nhat 100k
  // ==================================

  let minMatch = normalized.match(
    /(?:tren|tu|it nhat|toi thieu|>=)\s*(\d+(?:[.,]\d+)?)\s*(k|nghin|ngan|d|dong|vnd)?/,
  );

  if (minMatch) {
    const number = Number(minMatch[1].replace(",", "."));

    const min = convertMoney(number, minMatch[2]);

    return {
      type: "min",
      min: min,
      max: null,
    };
  }

  // ==================================
  // DƯỚI / TỐI ĐA
  //
  // dưới 100k
  // duoi 100k
  // tối đa 100k
  // toi da 100k
  // không quá 100k
  // ==================================

  let maxMatch = normalized.match(
    /(?:duoi|toi da|khong qua|khong vuot qua|<=)\s*(\d+(?:[.,]\d+)?)\s*(k|nghin|ngan|d|dong|vnd)?/,
  );

  if (maxMatch) {
    const number = Number(maxMatch[1].replace(",", "."));

    const max = convertMoney(number, maxMatch[2]);

    return {
      type: "max",
      min: null,
      max: max,
    };
  }

  // ==================================
  // KHOẢNG / TẦM
  //
  // khoảng 100k
  // khoang 100k
  // tầm 100k
  // tam 100k
  // ==================================

  let aroundMatch = normalized.match(
    /(?:khoang|tam|tua|gia khoang)\s*(\d+(?:[.,]\d+)?)\s*(k|nghin|ngan|d|dong|vnd)?/,
  );

  if (aroundMatch) {
    const number = Number(aroundMatch[1].replace(",", "."));

    const value = convertMoney(number, aroundMatch[2]);

    return {
      type: "around",
      min: Math.round(value * 0.8),
      max: Math.round(value * 1.2),
      target: value,
    };
  }

  // ==================================
  // CHỈ CÓ SỐ TIỀN
  //
  // 100k
  // 100 nghìn
  // 100000đ
  // ==================================

  let moneyMatch = normalized.match(
    /(?:^|\s)(\d+(?:[.,]\d+)?)\s*(k|nghin|ngan|d|dong|vnd)\b/,
  );

  if (moneyMatch) {
    const number = Number(moneyMatch[1].replace(",", "."));

    const value = convertMoney(number, moneyMatch[2]);

    return {
      type: "exact",
      min: null,
      max: value,
      target: value,
    };
  }

  // ==================================
  // SỐ NGUYÊN LỚN
  //
  // 100000
  // 200000đ
  // ==================================

  let plainMatch = normalized.match(/(?:^|\s)(\d{5,7})\s*(?:d|dong|vnd)?\b/);

  if (plainMatch) {
    const value = Number(plainMatch[1]);

    return {
      type: "exact",
      min: null,
      max: value,
      target: value,
    };
  }

  return null;
}

// ======================================
// CHUYỂN ĐỔI TIỀN
// ======================================

function convertMoney(number, unit) {
  if (!unit) {
    return number;
  }

  unit = unit.toLowerCase();

  if (unit === "k" || unit === "nghin" || unit === "ngan") {
    return Math.round(number * 1000);
  }

  return Math.round(number);
}
// ======================================
// PHÂN TÍCH MỤC ĐÍCH
// ======================================

function detectPurpose(text) {
  if (
    text.includes("làm quà") ||
    text.includes("tặng") ||
    text.includes("biếu") ||
    text.includes("quà")
  ) {
    return "gift";
  }

  if (
    text.includes("gia đình") ||
    text.includes("cả nhà") ||
    text.includes("mọi người")
  ) {
    return "family";
  }

  if (
    text.includes("ăn một mình") ||
    text.includes("ăn thử") ||
    text.includes("thử bánh")
  ) {
    return "personal";
  }

  return null;
}

// ======================================
// PHÂN TÍCH KHẨU VỊ
// ======================================

function detectPreference(text) {
  if (
    text.includes("ít ngọt") ||
    text.includes("không ngọt") ||
    text.includes("nhạt") ||
    text.includes("ít đường") ||
    text.includes("ăn kiêng")
  ) {
    return "low_sugar";
  }

  if (text.includes("béo") || text.includes("béo ngậy")) {
    return "rich";
  }

  if (text.includes("thanh") || text.includes("nhẹ")) {
    return "light";
  }

  if (text.includes("truyền thống")) {
    return "traditional";
  }

  return null;
}

// ======================================
// PHÂN TÍCH HƯƠNG VỊ
// ======================================

function detectFlavor(text) {
  const flavors = [
    "sầu riêng",
    "hạt sen",
    "socola",
    "matcha",
    "mè đen",
    "dừa",
    "đậu xanh",
    "trứng muối",
    "lạp xưởng",
  ];

  for (const flavor of flavors) {
    if (text.includes(flavor)) {
      return flavor;
    }
  }

  return null;
}

// ======================================
// PHÂN TÍCH SỐ LƯỢNG
// ======================================

// ======================================
// PHÂN TÍCH SỐ LƯỢNG
// ======================================

function extractQuantity(text) {
  const normalized = normalizeText(text).trim();

  // ======================================
  // 1. CHỈ NHẬP MỘT CON SỐ
  // Ví dụ: "20"
  // ======================================

  if (/^\d+$/.test(normalized)) {
    const number = Number(normalized);

    if (number > 0 && number <= 10000) {
      return number;
    }
  }

  // ======================================
  // 2. 20 HỘP / 20 CÁI / 20 GÓI
  // ======================================

  let match = normalized.match(/(\d+)\s*(hop|cai|goi|thung|phan|san pham|sp)/);

  if (match) {
    return Number(match[1]);
  }

  // ======================================
  // 3. MUA 20
  // ĐẶT 20
  // LẤY 20
  // CẦN 20
  // ======================================

  match = normalized.match(/(?:mua|dat|lay|can|chon)\s+(\d+)/);

  if (match) {
    return Number(match[1]);
  }

  // ======================================
  // 4. SỐ LƯỢNG 20
  // SỐ LƯỢNG LÀ 20
  // ======================================

  match = normalized.match(/so luong(?:\s+la)?\s*(\d+)/);

  if (match) {
    return Number(match[1]);
  }

  // ======================================
  // KHÔNG TÌM THẤY
  // ======================================

  return null;
}

function searchProducts(message, intent) {
  const text = normalizeText(message);

  const keywords = text.split(/\s+/).filter((word) => word.length >= 2);

  let results = products.map((product) => {
    const productText = normalizeText(`
            ${product.name || ""}
            ${product.slug || ""}
            ${product.category || ""}
            ${product.shortDescription || ""}
            ${product.description || ""}
            ${(product.ingredients || []).join(" ")}
        `);

    let score = 0;

    keywords.forEach((keyword) => {
      if (product.name && normalizeText(product.name).includes(keyword)) {
        score += 5;
      } else if (productText.includes(keyword)) {
        score += 1;
      }
    });

    return {
      product,
      score,
    };
  });

  // ======================================
  // CHỈ GIỮ SẢN PHẨM CÓ ĐIỂM
  // ======================================

  results = results.filter((item) => item.score > 0);

  // ======================================
  // LỌC NGÂN SÁCH
  // ======================================

  if (intent.budget) {
    results = results.filter((item) => {
      const price = Number(item.product.price);

      if (isNaN(price)) {
        return false;
      }

      if (intent.budget.type === "range") {
        return price >= intent.budget.min && price <= intent.budget.max;
      }

      if (intent.budget.type === "max") {
        return price <= intent.budget.max;
      }

      if (intent.budget.type === "min") {
        return price >= intent.budget.min;
      }

      if (intent.budget.type === "target") {
        return price <= intent.budget.target;
      }

      return true;
    });
  }

  // ======================================
  // SẮP XẾP THEO ĐỘ PHÙ HỢP
  // ======================================

  results.sort((a, b) => b.score - a.score);

  // ======================================
  // LẤY 3 SẢN PHẨM
  // ======================================

  return results.slice(0, 3).map((item) => item.product);
}

function findShippingArea(address) {
  const text = normalizeText(address);

  if (!text) {
    return null;
  }

  // Ưu tiên tìm khu vực cụ thể
  for (const area of shippingData.areas) {
    if (
      area.keywords.some((keyword) => text.includes(normalizeText(keyword)))
    ) {
      return area;
    }
  }

  // Không xác định được tỉnh/thành
  return shippingData.areas.find((area) => area.name === "Các tỉnh khác");
}

function isDeliveryAreaMessage(message) {
  const text = normalizeText(message);

  if (!text) {
    return false;
  }

  return deliveryData.areas.some((area) => {
    if (!Array.isArray(area.keywords)) {
      return false;
    }

    return area.keywords.some((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      return normalizedKeyword && text.includes(normalizedKeyword);
    });
  });
}

// function findProductFromMessage(message) {
//   const productData =
//     typeof window.products !== "undefined" && Array.isArray(window.products)
//       ? window.products
//       : typeof products !== "undefined" && Array.isArray(products)
//         ? products
//         : [];

//   if (!productData.length) {
//     return null;
//   }

//   const text = normalizeText(message);

//   // ======================================
//   // 1. TÌM THEO TÊN SẢN PHẨM
//   // ======================================

//   let product = productData.find((item) => {
//     if (!item.name) return false;

//     const productName = normalizeText(item.name);

//     return text.includes(productName);
//   });

//   if (product) {
//     return product;
//   }

//   // ======================================
//   // 2. TÌM THEO SLUG
//   // ======================================

//   product = productData.find((item) => {
//     if (!item.slug) return false;

//     const slugText = normalizeText(String(item.slug).replace(/-/g, " "));

//     return text.includes(slugText);
//   });

//   if (product) {
//     return product;
//   }

//   // ======================================
//   // 3. TÌM THEO CATEGORY
//   // ======================================

//   product = productData.find((item) => {
//     if (!item.category) return false;

//     const category = normalizeText(item.category);

//     return text.includes(category);
//   });

//   return product || null;
// }

//new

function findProductFromMessage(message) {
  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length) {
    return null;
  }

  const text = normalizeText(message);

  // ======================================
  // HÀM TÁCH TỪ
  // ======================================

  const getWords = (value) => {
    return normalizeText(value)
      .split(/\s+/)
      .filter((word) => word.length >= 2);
  };

  // ======================================
  // 1. TÌM THEO TÊN ĐẦY ĐỦ
  // ======================================

  let product = productData.find((item) => {
    if (!item.name) return false;

    const productName = normalizeText(item.name);

    return text.includes(productName);
  });

  if (product) {
    console.log("🔎 FIND PRODUCT - TÊN ĐẦY ĐỦ:", product.name);

    return product;
  }

  // ======================================
  // 2. TÌM THEO SLUG
  // ======================================

  product = productData.find((item) => {
    if (!item.slug) return false;

    const slugText = normalizeText(String(item.slug).replace(/-/g, " "));

    return text.includes(slugText);
  });

  if (product) {
    console.log("🔎 FIND PRODUCT - SLUG:", product.name);

    return product;
  }

  // ======================================
  // 3. TÌM THEO CATEGORY
  // ======================================

  product = productData.find((item) => {
    if (!item.category) return false;

    const category = normalizeText(item.category);

    return text.includes(category);
  });

  if (product) {
    console.log("🔎 FIND PRODUCT - CATEGORY:", product.name);

    return product;
  }

  // ======================================
  // 4. TÌM THEO TỪ KHÓA CỦA TÊN SẢN PHẨM
  // ======================================

  let bestProduct = null;
  let bestScore = 0;

  for (const item of productData) {
    if (!item.name) continue;

    const productWords = getWords(item.name);

    // Bỏ các từ quá chung
    const ignoredWords = ["banh", "pia", "hop", "loai", "nhan"];

    const importantWords = productWords.filter(
      (word) => !ignoredWords.includes(word),
    );

    if (!importantWords.length) continue;

    let matchedWords = 0;

    for (const word of importantWords) {
      if (text.includes(word)) {
        matchedWords++;
      }
    }

    const score = matchedWords / importantWords.length;

    if (score > bestScore && matchedWords > 0) {
      bestScore = score;
      bestProduct = item;
    }
  }

  // ======================================
  // CHỈ CHẤP NHẬN KHI ĐỦ KHỚP
  // ======================================

  if (bestProduct && bestScore >= 0.8) {
    console.log(
      "🔎 FIND PRODUCT - TỪ KHÓA:",
      bestProduct.name,
      "SCORE:",
      bestScore,
    );

    return bestProduct;
  }

  // ======================================
  // 5. KHÔNG TÌM THẤY
  // ======================================

  console.log("❌ FIND PRODUCT - KHÔNG TÌM THẤY:", message);

  return null;
}
function isSpecificProductInfoRequest(message) {
  const text = normalizeText(message);

  const keywords = [
    "thong tin banh",
    "thong tin san pham",
    "chi tiet banh",
    "chi tiet san pham",
    "xem thong tin",
    "xem chi tiet",
    "cho toi thong tin",
    "cho toi chi tiet",
    "muon xem thong tin",
    "muon xem chi tiet",
  ];

  return keywords.some((keyword) => text.includes(keyword));
}

function hasExplicitProductReference(message) {
  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length) {
    return false;
  }

  const text = normalizeText(message);

  return productData.some((product) => {
    if (!product.name) return false;

    const productName = normalizeText(product.name);

    // Tên đầy đủ
    if (text.includes(productName)) {
      return true;
    }

    // Từ khóa quan trọng trong tên sản phẩm
    const keywords = productName.split(" ").filter((word) => word.length >= 3);

    // Phải có ít nhất 2 từ khóa quan trọng
    const matchedKeywords = keywords.filter((keyword) =>
      text.includes(keyword),
    );

    return matchedKeywords.length >= 2;
  });
}

function findProductKeywordFromMessage(message) {
  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length) {
    return null;
  }

  const text = normalizeText(message);

  let bestProduct = null;
  let bestScore = 0;

  for (const product of productData) {
    if (!product.name) continue;

    const productName = normalizeText(product.name);

    const words = productName
      .split(/\s+/)
      .filter(
        (word) => word.length >= 3 && !["banh", "pia", "hop"].includes(word),
      );

    if (!words.length) continue;

    let matched = 0;

    for (const word of words) {
      if (text.includes(word)) {
        matched++;
      }
    }

    const score = matched / words.length;

    if (matched > 0 && score > bestScore) {
      bestScore = score;
      bestProduct = product;
    }
  }

  if (bestProduct && bestScore >= 0.5) {
    console.log(
      "🔎 PRODUCT KEYWORD FOLLOW-UP:",
      bestProduct.name,
      "SCORE:",
      bestScore,
    );

    return bestProduct;
  }

  return null;
}

// ======================================
// PHÂN TÍCH NHU CẦU KHÁCH HÀNG
// ======================================

function analyzeUserIntent(message) {
  const text = normalizeText(message);

  // ======================================
  // PHÂN TÍCH THÔNG TIN CÂU HIỆN TẠI
  // ======================================

  const currentBudget = extractBudget(text);

  const currentPurpose = detectPurpose(text);

  const currentFlavor = detectFlavor(text);
  const currentFilling = detectFilling(text);

  const currentPreference = detectPreference(text);

  const currentQuantity = extractQuantity(text);

  // ======================================
  // HIỂU CON SỐ ĐỨNG MỘT MÌNH
  // ======================================

  let finalQuantity = currentQuantity;

  if (finalQuantity === null && /^\d+$/.test(text.trim())) {
    const number = Number(text.trim());

    // Nếu chatbot đang chờ số lượng
    if (userPreferences.waitingForQuantity === true) {
      finalQuantity = number;
    }
  }

  // ======================================
  // NGƯỜI NHẬN
  // ======================================

  let recipient = null;

  if (
    text.includes("cho me") ||
    text.includes("tang me") ||
    text.includes("bieu me")
  ) {
    recipient = "mother";
  } else if (
    text.includes("cho bo") ||
    text.includes("tang bo") ||
    text.includes("bieu bo")
  ) {
    recipient = "father";
  }

  // const isGreetingQuestion =
  //   text.includes("chao") ||
  //   text.includes("hi") ||
  //   text.includes("hello") ||
  //   text.includes("xin chao") ||
  //   text.includes("chao shop") ||
  //   text.includes("alo") ||
  //   text.includes("chao ban") ||
  //   text.includes("good morning") ||
  //   text.includes("good afternoon");

  const isGreetingQuestion =
    /\b(chao|xin chao|chao shop|chao ban|hi|hello|alo|good morning|good afternoon)\b/i.test(
      text,
    );

  const thanksKeywords = [
    // Tiếng Việt chuẩn
    "cam on",
    "cảm ơn",
    "xin cam on",
    "xin cảm ơn",
    "cam on shop",
    "cảm ơn shop",
    "cam on ban",
    "cảm ơn bạn",
    "cám ơn",
    "chân thành cảm ơn",

    // Viết tắt / Tiếng lóng giới trẻ
    "tks",
    "tkss",
    "thanks",
    "thanku",
    "thank u",
    "thank you",
    "thx",
    "camon",
    "coam on",

    // Câu khen ngợi kèm cảm ơn
    "da cam on",
    "dạ cảm ơn",
    "ok cam on",
    "ok cảm ơn",
    "ok tks",
    "da tks",
    "da cam on shop nhiều",
    "cảm ơn shop nhiều",
    "cam on shop nhieu",
    "tam biet",
    "bye",
    "bai",

    "bai bai",
    "goodbye",
    "chao nhe",
    "chao ban",
    "hen gap lai",
    "hen gap",
    "gap lai sau",
    "di day",
    "ve day",
    "bb",
    "pp",
    "pipi",
    "see ya",
    "good night",
    "g9",
    "ok cam on",
    "thank u",

    ,
    "chuc ngu ngon",
    "di ngu day",
    "quay lai sau",
    "toi phai di",
    "ngung chat",
    "thoat",
    "bai nha",
    "pipi nha",
    "chao nha",
    "co gi noi sau",
    "mai gap",
    "hen hom khac",
    "out nha",
    "off nha",
    "bye u",
    "cya",
  ];

  const isThanksQuestion = thanksKeywords.some((keyword) =>
    text.includes(keyword),
  );

  const isShopOpeningHoursQuestion =
    text.includes("gio mo cua") ||
    text.includes("gio lam") ||
    text.includes("gio mo ") ||
    text.includes("mo cua") ||
    text.includes("mo cua may gio") ||
    text.includes("shop mo cua luc may gio") ||
    text.includes("cua hang mo cua luc may gio") ||
    text.includes("shop mo cua tu may gio") ||
    text.includes("dong cua may gio") ||
    text.includes("shop dong cua may gio") ||
    text.includes("thoi gian mo cua");

  const isPaymentQuestion =
    text.includes("thanh toan") ||
    text.includes("thanh toan bang gi") ||
    text.includes("shop nhan thanh toan gi") ||
    text.includes("co thanh toan khi nhan hang") ||
    text.includes("cod") ||
    text.includes("chuyen khoan") ||
    text.includes("quet qr") ||
    text.includes("qr code");

  // ======================================
  // SẢN PHẨM MỚI
  // ======================================

  const isNewProduct =
    text.includes("san pham moi") ||
    text.includes("san pham moi nhat") ||
    text.includes("banh moi") ||
    text.includes("banh moi nhat") ||
    text.includes("moi nhat") ||
    text.includes("hang moi") ||
    text.includes("hang moi nhat") ||
    text.includes("moi ra") ||
    text.includes("vua ra") ||
    text.includes("san pham vua ra");

  // ======================================
  // MUA SỐ LƯỢNG NHIỀU
  // ======================================
  const bulkKeyword =
    text.includes("mua nhieu") ||
    text.includes("mua si") ||
    text.includes("dat nhieu") ||
    text.includes("dat si") ||
    text.includes("so luong nhieu") ||
    text.includes("so luong lon") ||
    text.includes("don nhieu") ||
    text.includes("mua hang loat") ||
    text.includes("mua so luong lon") ||
    text.includes("dat so luong lon");

  const isBulk =
    bulkKeyword || (currentQuantity !== null && currentQuantity >= 5);

  const isBulkDiscountQuestion =
    text.includes("mua nhieu co giam") ||
    text.includes("mua nhieu co duoc giam") ||
    text.includes("mua si co giam") ||
    text.includes("dat nhieu co giam") ||
    text.includes("mua nhieu giam gia") ||
    text.includes("gia si") ||
    text.includes("co gia si");

  // ======================================
  // XÁC ĐỊNH MUA SỐ LƯỢNG LỚN
  // ======================================

  // ======================================
  // GIAO HÀNG
  // ======================================

  const isShipping =
    text.includes("giao hang") ||
    text.includes("ship") ||
    text.includes("van chuyen") ||
    text.includes("phi ship") ||
    text.includes("phi giao hang") ||
    text.includes("thoi gian giao") ||
    text.includes("bao lau giao") ||
    text.includes("dia chi giao") ||
    text.includes("khu vuc") ||
    text.includes("khu vuc nhan hang") ||
    text.includes("dia chi nhan hang") ||
    text.includes("nhan hang o dau") ||
    text.includes("giao den dau") ||
    text.includes("giao toi dau") ||
    text.includes("giao den khu vuc nao") ||
    text.includes("ship den dau") ||
    text.includes("ve dau") ||
    text.includes("phi ship") ||
    text.includes("phi giao hang") ||
    text.includes("thoi gian giao") ||
    text.includes("bao lau giao") ||
    text.includes("bao lau nhan duoc") ||
    text.includes("khi nao nhan duoc") ||
    text.includes("may ngay nhan duoc") ||
    text.includes("bao nhieu ngay nhan") ||
    text.includes("thoi gian nhan hang") ||
    text.includes("khu vuc nhan hang") ||
    text.includes("dia chi nhan hang") ||
    text.includes("nhan hang o dau") ||
    text.includes("giao den dau") ||
    text.includes("giao toi dau") ||
    text.includes("giao den khu vuc nao") ||
    text.includes("ship den dau");
  isDeliveryAreaMessage(text);

  // ======================================
  // CÂU HỎI GIÁ
  // ======================================

  const isPriceQuestion =
    text.includes("gia") ||
    text.includes("bao nhieu") ||
    text.includes("bao nhieu tien") ||
    text.includes("gia bao nhieu");

  // ======================================
  // TỪ KHÓA LIÊN QUAN SẢN PHẨM
  // ======================================

  const productKeywords = [
    "banh",
    "pia",
    "san pham",

    "gia",
    "mua",

    "hop",
    "goi",
    "cai",

    "nhan",
    "sau rieng",
    "hat sen",
    "trung muoi",

    "khuyen mai",
    "giam gia",
    "uu dai",

    "giao hang",
    "ship",
    "van chuyen",
    "ngan sach",
    "so tien",

    "mua si",
    "mua nhieu",
  ];

  // ======================================
  // KHUYẾN MÃI / GIẢM GIÁ
  // ======================================

  const isSaleQuestion =
    text.includes("khuyen mai") ||
    text.includes("giam gia") ||
    text.includes("dang sale") ||
    text.includes("sale") ||
    text.includes("uu dai") ||
    text.includes("gia uu dai") ||
    text.includes("san pham giam gia") ||
    text.includes("banh giam gia") ||
    text.includes("dang giam");

  // ======================================
  // SẢN PHẨM BÁN CHẠY
  // ======================================

  const isBestSellerQuestion =
    text.includes("ban chay") ||
    text.includes("ban chay nhat") ||
    text.includes("ban nhieu") ||
    text.includes("ban nhieu nhat") ||
    text.includes("duoc mua nhieu") ||
    text.includes("khach mua nhieu") ||
    text.includes("best seller") ||
    text.includes("best selling") ||
    text.includes("hot nhat") ||
    text.includes("hang hot") ||
    text.includes("dang hot") ||
    text.includes("chay hang") ||
    text.includes("dat hang") ||
    text.includes("ua chuong nhat") ||
    text.includes("thich nhat") ||
    text.includes("duoc chuong nhat") ||
    text.includes("top dau") ||
    text.includes("top dau bang") ||
    text.includes("san pham hot") ||
    text.includes("hang ban chay") ||
    text.includes("mua nhieu nhat") ||
    text.includes("nhieu nguoi mua") ||
    text.includes("nhieu nguoi chon") ||
    text.includes("duoc choi nhieu") ||
    text.includes("duoc dung nhieu") ||
    text.includes("trending") ||
    text.includes("xu huong");

  const isDifferentProductQuestion =
    text.includes("loai khac") ||
    text.includes("san pham khac") ||
    text.includes("san pham nao khac") ||
    text.includes("co san pham khac") ||
    text.includes("co san pham nao khac") ||
    text.includes("mon khac") ||
    text.includes("goi khac") ||
    text.includes("doi loai") ||
    text.includes("doi san pham") ||
    text.includes("mau khac") ||
    text.includes("banh khac") ||
    text.includes("banh nao khac") ||
    text.includes("cho them") ||
    text.includes("muon them") ||
    text.includes("them san pham") ||
    text.includes("them loai");

  const isProductTasteQuestion =
    text.includes("co ngot khong") ||
    text.includes("ngot khong") ||
    text.includes("vi ngot") ||
    text.includes("do ngot") ||
    text.includes("vi gi") ||
    text.includes("vi nhu the nao") ||
    text.includes("huong vi") ||
    text.includes("huong vi nhu the nao") ||
    text.includes("an co ngon khong") ||
    text.includes("co beo khong") ||
    text.includes("co man khong") ||
    text.includes("co thom khong");

  const isSearchProductQuestion =
    !isDifferentProductQuestion &&
    (text.includes("tim banh") ||
      text.includes("tim san pham") ||
      text.includes("cho toi banh") ||
      text.includes("cho toi san pham") ||
      text.includes("co banh") ||
      text.includes("co san pham") ||
      text.includes("toi muon banh") ||
      text.includes("toi can banh") ||
      text.includes("tim cho toi") ||
      (text.includes("mua banh") &&
        !isPriceQuestion &&
        !isShipping &&
        !isSaleQuestion &&
        !isNewProduct)) &&
    !isProductTasteQuestion;

  // ======================================
  // CÂU HỎI THÔNG TIN SHOP
  // ======================================

  const isBestTasteQuestion =
    text.includes("banh nao ngon") ||
    text.includes("banh gi ngon") ||
    text.includes("loai nao ngon") ||
    text.includes("banh ngon") ||
    text.includes("nen an banh nao") ||
    text.includes("nen mua banh nao");

  // ======================================
  // CÂU HỎI ĐẶC ĐIỂM / HƯƠNG VỊ SẢN PHẨM
  // ======================================

  const isShopInfoQuestion =
    text.includes("shop o dau") ||
    text.includes("dia chi") ||
    text.includes("dia chi shop") ||
    text.includes("cua hang o dau") ||
    text.includes("dia chi o dau") ||
    text.includes("shop ban o dau");

  const isRecommendedQuestion =
    text.includes("banh nao ngon") ||
    text.includes("banh nao ngon nhat") ||
    text.includes("loai nao ngon") ||
    text.includes("loai banh nao ngon") ||
    text.includes("banh ngon") ||
    text.includes("goi y banh") ||
    text.includes("goi y cho toi") ||
    text.includes("banh nao nen mua") ||
    text.includes("nen mua banh nao") ||
    text.includes("banh nao tot") ||
    text.includes("banh nao duoc yeu thich");

  const isProductTypeQuestion =
    text.includes("cac loai banh") ||
    text.includes("loai banh nao") ||
    text.includes("shop co nhung loai banh nao") ||
    text.includes("co nhung loai banh nao") ||
    text.includes("shop ban nhung loai banh nao") ||
    text.includes("ban nhung loai banh nao") ||
    text.includes("co nhung loai banh gi") ||
    text.includes("banh gi") ||
    text.includes("khau vi") ||
    text.includes("huong vi") ||
    text.includes("co nhung loai nao") ||
    text.includes("co banh gi") ||
    text.includes("co nhung loai nhan nao") ||
    text.includes("loai nhan nao") ||
    text.includes("shop co nhung loai nhan nao") ||
    text.includes(" loai nhan gi") ||
    text.includes(" loai nhan nao") ||
    text.includes("banh co nhung loai nhan nao") ||
    text.includes("shop co nhung loai nhan gi") ||
    text.includes("nhan banh nao") ||
    text.includes("co nhung loai banh nao") ||
    text.includes("shop co nhung loai banh nao") ||
    text.includes("co nhung loai nao") ||
    text.includes("cac loai banh") ||
    text.includes("cac loai banh cua shop") ||
    text.includes("shop ban nhung loai banh nao") ||
    (text.includes("shop co banh gi") && !isProductTasteQuestion);

  //Infor product
  const isProductInfoQuestion =
    text.includes("thong tin san pham") ||
    text.includes("thong tin cua san pham") ||
    text.includes("thong tin banh") ||
    text.includes("tat ca thong tin") ||
    text.includes("banh co nhung gi") ||
    // ==============================
    // HỎI GIÁ
    // ==============================
    text.includes("gia bao nhieu") ||
    text.includes("gia bao nhieu tien") ||
    text.includes("bao nhieu tien") ||
    text.includes("gia banh") ||
    text.includes("banh nay gia") ||
    text.includes("gia cua banh") ||
    text.includes("gia cua san pham") ||
    // ==============================
    // TÌNH TRẠNG
    // ==============================
    text.includes("con hang") ||
    text.includes("con san pham") ||
    text.includes("con hang khong") ||
    text.includes("het hang") ||
    // ==============================
    // THÀNH PHẦN
    // ==============================
    text.includes("thanh phan") ||
    text.includes("nguyen lieu") ||
    text.includes("nhan gi") ||
    // ==============================
    // QUY CÁCH
    // ==============================
    text.includes("bao nhieu cai") ||
    text.includes("bao nhieu gram") ||
    text.includes("trong luong") ||
    text.includes("khoi luong");

  const isShopAddressQuestion =
    text.includes("shop o dau") ||
    text.includes("vi tri") ||
    text.includes("dia chi shop") ||
    text.includes("dia chi cua shop") ||
    text.includes("cua hang nam o dau") ||
    text.includes("vi tri cua cua hang") ||
    text.includes("vi tri cua hang") ||
    text.includes("vi tri shop") ||
    text.includes("vi tri cua shop") ||
    text.includes("cua hang o dau") ||
    text.includes("shop o dau") ||
    text.includes("shop nam o dau") ||
    text.includes("shop dia chi") ||
    text.includes("dia chi cua cua hang") ||
    text.includes("thong tin cua hang") ||
    text.includes("thong tin shop");

  const isDirectorQuestion =
    text.includes("giam doc") ||
    text.includes("ai la giam doc") ||
    text.includes("giam doc cua shop") ||
    text.includes("giam doc cua cong ty") ||
    text.includes("nguoi dung dau shop") ||
    text.includes("nguoi dung dau cong ty");

  const isShopPhoneQuestion =
    text.includes("so dien thoai") ||
    text.includes("sdt") ||
    text.includes("so dt") ||
    text.includes("dien thoai shop") ||
    text.includes("so dien thoai shop") ||
    text.includes("lien he shop") ||
    text.includes("so lien he");

  const isReturnPolicyQuestion =
    text.includes("doi tra") ||
    text.includes("doi hang") ||
    text.includes("tra hang") ||
    text.includes("doi san pham") ||
    text.includes("co duoc doi hang") ||
    text.includes("co duoc tra hang") ||
    text.includes("chinh sach doi tra") ||
    text.includes("chinh sach doi hang");

  const isProductIssueQuestion =
    text.includes("banh bi hong") ||
    text.includes("banh bi hu") ||
    text.includes("san pham bi hong") ||
    text.includes("san pham bi hu") ||
    text.includes("hang bi hong") ||
    text.includes("hang bi hu") ||
    text.includes("nhan duoc hang bi hong") ||
    text.includes("nhan hang bi hong") ||
    text.includes("hang bi loi") ||
    text.includes("san pham bi loi") ||
    text.includes("xu ly khi hang bi hong") ||
    text.includes("xu ly khi san pham bi loi");

  const isOrderQuestion =
    text.includes("dat hang") ||
    text.includes("dat banh") ||
    text.includes("cach dat hang") ||
    text.includes("lam sao de dat hang") ||
    text.includes("mua hang nhu the nao") ||
    text.includes("dat banh nhu the nao") ||
    text.includes("cach mua hang") ||
    text.includes("dat san pham");

  const isOrderStatusQuestion =
    text.includes("kiem tra don hang") ||
    text.includes("don hang") ||
    text.includes("don hang cua toi") ||
    text.includes("don hang dang o dau") ||
    text.includes("don hang den dau roi") ||
    text.includes("tinh trang don hang") ||
    text.includes("trang thai don hang") ||
    text.includes("theo doi don hang") ||
    text.includes("don hang cua toi dang o dau");

  const isProductUsageQuestion =
    /bao quan|de duoc bao lau|may ngay|han su dung|han dung|tu lanh|bao quan the nao|baoquansao/i.test(
      text,
    );

  const isProductQuestion = productKeywords.some((keyword) =>
    text.includes(keyword),
  );

  const isGeneralQuestion =
    !isProductQuestion &&
    !isShipping &&
    !isPriceQuestion &&
    !isSaleQuestion &&
    !isNewProduct &&
    !isBestSellerQuestion &&
    !isSearchProductQuestion &&
    !isDifferentProductQuestion &&
    !isProductInfoQuestion &&
    !isProductTypeQuestion &&
    !isRecommendedQuestion &&
    !isShopInfoQuestion &&
    !isShopAddressQuestion &&
    !isDirectorQuestion &&
    !isShopPhoneQuestion &&
    !isShopOpeningHoursQuestion &&
    !isPaymentQuestion &&
    !isReturnPolicyQuestion &&
    !isProductIssueQuestion &&
    !isOrderQuestion &&
    !isOrderStatusQuestion &&
    !isGreetingQuestion &&
    !isThanksQuestion;

  // ======================================
  // KIỂM TRA CÓ LIÊN QUAN SẢN PHẨM KHÔNG
  // ======================================

  const priceDirection = detectPriceDirection(text);

  // ======================================
  // CẬP NHẬT MEMORY
  // ======================================

  if (currentBudget !== null) {
    userPreferences.budget = currentBudget;
  }

  if (currentPurpose !== null) {
    userPreferences.purpose = currentPurpose;
  }

  if (currentFlavor !== null) {
    userPreferences.flavor = currentFlavor;
  }

  if (currentPreference !== null) {
    userPreferences.preference = currentPreference;
  }

  if (finalQuantity !== null) {
    userPreferences.quantity = finalQuantity;
  }

  if (recipient !== null) {
    userPreferences.recipient = recipient;
  }

  // ======================================
  // MEMORY CHO CÁC CÂU SAU
  // ======================================

  const memory = {
    ...userPreferences,
  };

  // ======================================
  // TRẢ VỀ INTENT
  // ======================================

  return {
    // ------------------------------
    // THÔNG TIN CÂU HIỆN TẠI
    // ------------------------------

    budget: currentBudget !== null ? currentBudget : memory.budget,

    purpose: currentPurpose !== null ? currentPurpose : memory.purpose,

    flavor: currentFlavor !== null ? currentFlavor : memory.flavor,

    preference:
      currentPreference !== null ? currentPreference : memory.preference,

    quantity: finalQuantity !== null ? finalQuantity : memory.quantity,

    recipient: recipient !== null ? recipient : memory.recipient,

    // ------------------------------
    // TRẠNG THÁI CÂU HỎI
    // ------------------------------

    isNewProduct,

    isBulk,

    isShipping,

    isPriceQuestion,
    isProductUsageQuestion,

    isProductQuestion,
    isSaleQuestion,

    isBulkDiscountQuestion,
    isBestSellerQuestion,

    isSearchProductQuestion,
    priceDirection,
    isDifferentProductQuestion,
    isProductTypeQuestion,
    isBestTasteQuestion,
    isRecommendedQuestion,

    isShopInfoQuestion,
    isProductInfoQuestion,
    isShopAddressQuestion,
    isDirectorQuestion,
    isShopPhoneQuestion,
    isShopOpeningHoursQuestion,
    isPaymentQuestion,
    isReturnPolicyQuestion,
    isProductIssueQuestion,
    isOrderQuestion,
    isOrderStatusQuestion,

    isGreetingQuestion,
    isThanksQuestion,

    isGeneralQuestion,

    isProductTasteQuestion,
    filling: currentFilling,

    // ------------------------------
    // MEMORY
    // ------------------------------

    memory,
  };
}

function getProductTypes(intent) {
  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length) {
    return [];
  }

  const categoryMap = new Map();

  productData.forEach((product) => {
    if (!product.category) {
      return;
    }

    const category = String(product.category).trim();

    if (!category) {
      return;
    }

    const key = normalizeText(category);

    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        name: category,
        count: 1,
      });
    } else {
      categoryMap.get(key).count++;
    }
  });

  const result = Array.from(categoryMap.values());

  result.sort((a, b) => b.count - a.count);

  console.log("🥮 CÁC LOẠI BÁNH:", result);

  return result;
}

function getBestSellerProducts(intent) {
  let results = [...products];

  // ======================================
  // LỌC THEO GIÁ
  // ======================================

  if (intent.budget) {
    results = results.filter((product) => {
      const price = Number(product.price);

      if (isNaN(price)) {
        return false;
      }

      if (intent.budget.type === "range") {
        return price >= intent.budget.min && price <= intent.budget.max;
      }

      if (intent.budget.type === "max") {
        return price <= intent.budget.max;
      }

      if (intent.budget.type === "min") {
        return price >= intent.budget.min;
      }

      if (intent.budget.type === "target") {
        return price <= intent.budget.target;
      }

      return true;
    });
  }

  // ======================================
  // SẮP XẾP BÁN CHẠY
  // ======================================

  results.sort((a, b) => {
    return parseSold(b.sold) - parseSold(a.sold);
  });

  return results.slice(0, 3);
}

function parseSold(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  const text = String(value).toLowerCase().replace(",", ".").trim();

  if (text.endsWith("k")) {
    return parseFloat(text.replace("k", "")) * 1000;
  }

  return parseFloat(text) || 0;
}

function getTopRatedProducts(intent) {
  let results = [...products];

  // ======================================
  // LỌC THEO GIÁ
  // ======================================

  if (intent.budget) {
    results = results.filter((product) => {
      const price = Number(product.price);

      if (isNaN(price)) {
        return false;
      }

      if (intent.budget.type === "range") {
        return price >= intent.budget.min && price <= intent.budget.max;
      }

      if (intent.budget.type === "max") {
        return price <= intent.budget.max;
      }

      if (intent.budget.type === "min") {
        return price >= intent.budget.min;
      }

      if (intent.budget.type === "target") {
        return price <= intent.budget.target;
      }

      return true;
    });
  }

  // ======================================
  // SẮP XẾP ĐÁNH GIÁ
  // ======================================

  results.sort((a, b) => {
    const ratingA = Number(a.rating) || 0;
    const ratingB = Number(b.rating) || 0;

    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }

    // Nếu cùng số sao
    // ưu tiên nhiều lượt đánh giá hơn

    return Number(b.reviewCount || 0) - Number(a.reviewCount || 0);
  });

  return results.slice(0, 3);
}

function formatBudget(budget) {
  if (!budget) {
    return "";
  }

  if (budget.type === "max") {
    return `dưới ${formatPrice(budget.max)}`;
  }

  if (budget.type === "min") {
    return `trên ${formatPrice(budget.min)}`;
  }

  if (budget.type === "range") {
    return `${formatPrice(budget.min)} - ${formatPrice(budget.max)}`;
  }

  if (budget.type === "around") {
    return `khoảng ${formatPrice(budget.target)}`;
  }

  if (budget.type === "exact") {
    return `${formatPrice(budget.max)}`;
  }

  return "";
}
// ======================================
// KIỂM TRA THÔNG TIN CÒN THIẾU
// ======================================

function getMissingInformation(intent) {
  // Nếu đã biết ngân sách
  if (intent.budget === null) {
    return "budget";
  }

  // Nếu chưa biết mục đích
  if (intent.purpose === null) {
    return "purpose";
  }

  // Nếu chưa biết khẩu vị
  if (intent.preference === null) {
    return "preference";
  }

  return null;
}

// ======================================
// AI CÓ NÊN HỎI THÊM KHÔNG?
// ======================================

function shouldAskMore(intent) {
  // Có hương vị cụ thể
  if (intent.flavor) {
    return false;
  }

  // Có khẩu vị cụ thể
  if (intent.preference && intent.budget) {
    return false;
  }

  // Có ngân sách
  if (intent.budget && intent.purpose) {
    return false;
  }

  // Có mục đích + khẩu vị
  if (intent.purpose && intent.preference) {
    return false;
  }

  // Chưa có đủ thông tin
  return true;
}

// ======================================
// TẠO CÂU HỎI TIẾP THEO
// ======================================

function generateFollowUpQuestion(intent) {
  // ==============================
  // CHƯA BIẾT NGÂN SÁCH
  // ==============================

  if (intent.budget === null) {
    return `
            🎁 Được ạ. Bạn dự định khoảng
            <b>bao nhiêu tiền</b> để mình chọn
            bánh phù hợp hơn?
            <br><br>
            Ví dụ: <b>200k</b>, <b>300k</b>
            hoặc <b>500k</b>.
        `;
  }

  // ==============================
  // CHƯA BIẾT MỤC ĐÍCH
  // ==============================

  if (intent.purpose === null) {
    return `
            Bạn mua bánh để <b>ăn</b>,
            <b>làm quà</b> hay
            <b>biếu người thân</b> ạ? 😊
        `;
  }

  // ==============================
  // CHƯA BIẾT KHẨU VỊ
  // ==============================

  if (intent.preference === null) {
    return `
            Bạn thích bánh theo kiểu
            <b>truyền thống</b>,
            <b>ít ngọt</b> hay
            muốn thử vị <b>mới lạ</b> ạ? 🥮
        `;
  }

  return null;
}

// ======================================
// TẠO CÂU TRẢ LỜI ĐỀ XUẤT
// ======================================

function generateRecommendation(intent) {
  const results = recommendProducts(intent);

  if (!results || results.length === 0) {
    return `
            😔  Mình chưa tìm thấy sản phẩm
            phù hợp với ngân sách
            <b>
                ${formatBudget(intent.budget)}
            </b>.

            <br><br>

            Bạn có thể thử tăng ngân sách
            hoặc cho mình biết thêm sở thích nhé.
        `;
  }

  let introduction = `
        Mình đã tìm được một số sản phẩm
        khá phù hợp với bạn 🥮
        <br><br>
    `;

  // Nếu có ngân sách
  if (intent.budget) {
    introduction += `
            Với ngân sách khoảng
            <b>${formatBudget(intent.budget)}</b>,
        `;
  }

  // Nếu làm quà

  if (intent.recipient === "mother") {
    introduction += `
        , mình ưu tiên những sản phẩm
        phù hợp để tặng mẹ 🎁.
    `;
  } else if (intent.recipient === "father") {
    introduction += `
        , mình ưu tiên những sản phẩm
        phù hợp để tặng bố 🎁.
    `;
  } else if (intent.purpose === "gift") {
    introduction += `
            mình ưu tiên những sản phẩm
            phù hợp để làm quà 🎁.
        `;
  } else {
    introduction += `
            mình chọn những sản phẩm có
            mức độ phù hợp cao.
        `;
  }

  return `
        ${introduction}

        <br><br>

        ${createProductList(results)}

        <br>

        Bạn có thể bấm vào sản phẩm
        để xem thông tin chi tiết nhé.
    `;
}

// ======================================
// CHẤM ĐIỂM SẢN PHẨM
// ======================================

// function scoreProduct(product, intent) {
//   let score = 0;

//   const content = `
//         ${product.name || ""}
//         ${product.category || ""}
//         ${product.description || ""}
//         ${product.shortDescription || ""}
//         ${(product.ingredients || []).join(" ")}
//     `.toLowerCase();

//   // ==================================

//   if (intent.budget !== null) {
//     const price = Number(product.price);

//     // Sản phẩm vượt ngân sách
//     // tuyệt đối không ưu tiên

//     if (isNaN(price) || price > intent.budget) {
//       return -999999;
//     }

//     // Sản phẩm hợp ngân sách

//     score += 100;

//     // Càng gần ngân sách càng tốt

//     const difference = intent.budget - price;

//     if (difference <= 10000) {
//       score += 30;
//     } else if (difference <= 30000) {
//       score += 20;
//     } else if (difference <= 50000) {
//       score += 10;
//     }
//   }
//   // ==================================
//   // MỤC ĐÍCH LÀM QUÀ
//   // ==================================

//   if (intent.purpose === "gift") {
//     if (
//       content.includes("quà") ||
//       content.includes("biếu") ||
//       content.includes("cao cấp") ||
//       product.category?.toLowerCase().includes("premium")
//     ) {
//       score += 40;
//     }
//   }

//   // ==================================
//   // ÍT NGỌT
//   // ==================================

//   if (intent.preference === "low_sugar") {
//     if (
//       content.includes("ít ngọt") ||
//       content.includes("ít đường") ||
//       content.includes("ăn kiêng")
//     ) {
//       score += 50;
//     }
//   }

//   // ==================================
//   // VỊ NHẸ
//   // ==================================

//   if (intent.preference === "light") {
//     if (content.includes("thanh") || content.includes("nhẹ")) {
//       score += 30;
//     }
//   }

//   // ==================================
//   // TRUYỀN THỐNG
//   // ==================================

//   if (intent.preference === "traditional") {
//     if (content.includes("truyền thống")) {
//       score += 40;
//     }
//   }

//   // ==================================
//   // HƯƠNG VỊ
//   // ==================================

//   if (intent.flavor) {
//     if (content.includes(intent.flavor)) {
//       score += 50;
//     }
//   }

//   // ==================================
//   // ĐÁNH GIÁ
//   // ==================================

//   score += (product.rating || 0) * 5;

//   // ==================================
//   // CÒN HÀNG
//   // ==================================

//   if (product.stock > 0) {
//     score += 5;
//   }

//   return score;
// }

// ======================================
// CHẤM ĐIỂM SẢN PHẨM
// ======================================

function scoreProduct(product, intent) {
  let score = 0;

  const price = Number(product.price);

  if (isNaN(price)) {
    return -999999;
  }

  // ==================================
  // 1. NGÂN SÁCH
  // ==================================

  if (intent.budget) {
    const budget = intent.budget;

    // ==============================
    // DƯỚI / TỐI ĐA
    // ==============================

    if (budget.type === "max") {
      if (price > budget.max) {
        return -999999;
      }

      score += 100;

      // Càng gần mức ngân sách càng tốt

      const difference = budget.max - price;

      if (difference <= 10000) {
        score += 30;
      } else if (difference <= 30000) {
        score += 20;
      } else if (difference <= 50000) {
        score += 10;
      }
    }

    // ==============================
    // TRÊN / TỪ ... TRỞ LÊN
    // ==============================
    else if (budget.type === "min") {
      if (price < budget.min) {
        return -999999;
      }

      score += 100;

      // Ưu tiên sản phẩm gần mức tối thiểu

      const difference = price - budget.min;

      if (difference <= 10000) {
        score += 30;
      } else if (difference <= 30000) {
        score += 20;
      } else if (difference <= 50000) {
        score += 10;
      }
    }

    // ==============================
    // KHOẢNG GIÁ
    // ==============================
    else if (budget.type === "range") {
      if (price < budget.min || price > budget.max) {
        return -999999;
      }

      score += 100;

      const target = (budget.min + budget.max) / 2;

      const difference = Math.abs(price - target);

      if (difference <= 10000) {
        score += 30;
      } else if (difference <= 30000) {
        score += 20;
      } else if (difference <= 50000) {
        score += 10;
      }
    }

    // ==============================
    // KHOẢNG / TẦM
    // ==============================
    else if (budget.type === "around") {
      if (price < budget.min || price > budget.max) {
        return -999999;
      }

      score += 100;

      const difference = Math.abs(price - budget.target);

      if (difference <= 10000) {
        score += 30;
      } else if (difference <= 30000) {
        score += 20;
      } else if (difference <= 50000) {
        score += 10;
      }
    }

    // ==============================
    // GIÁ CỤ THỂ
    // ==============================
    else if (budget.type === "exact") {
      if (price > budget.max) {
        return -999999;
      }

      score += 100;

      const difference = budget.max - price;

      if (difference <= 10000) {
        score += 30;
      } else if (difference <= 30000) {
        score += 20;
      } else if (difference <= 50000) {
        score += 10;
      }
    }
  }

  // ==================================
  // 2. ĐÁNH GIÁ SẢN PHẨM
  // ==================================

  if (product.rating) {
    score += Number(product.rating) * 5;
  }

  // ==================================
  // 3. CÒN HÀNG
  // ==================================

  if (product.stock !== undefined && Number(product.stock) > 0) {
    score += 10;
  }

  // ==================================
  // 4. SẢN PHẨM MỚI
  // ==================================

  if (intent.isNewProduct) {
    if (
      product.isNew === true ||
      product.isNew === 1 ||
      product.newProduct === true
    ) {
      score += 50;
    }
  }

  // ==================================
  // 5. KHẨU VỊ
  // ==================================

  if (intent.flavor) {
    const productText = normalizeText(
      `${product.name || ""} ${product.description || ""}`,
    );

    if (productText.includes(normalizeText(intent.flavor))) {
      score += 40;
    }
  }

  // ==================================
  // 6. ƯU TIÊN
  // ==================================

  if (intent.preference) {
    const preference = normalizeText(intent.preference);

    const productText = normalizeText(
      `${product.name || ""} ${product.description || ""}`,
    );

    if (
      preference === "it ngot" &&
      (productText.includes("it ngot") || productText.includes("thanh"))
    ) {
      score += 30;
    }

    if (preference === "nhieu sau rieng" && productText.includes("sau rieng")) {
      score += 30;
    }
  }

  // ==================================
  // 7. MUA LÀM QUÀ
  // ==================================

  // ======================================
  // NGƯỜI NHẬN
  // ======================================

  const productText = normalizeText(`
    ${product.name || ""}
    ${product.description || ""}
    ${product.category || ""}
    ${product.tags || ""}
`);

  // ======================================
  // MUA CHO MẸ
  // ======================================

  if (intent.recipient === "mother") {
    // Hộp quà / sản phẩm làm quà
    if (
      productText.includes("hop") ||
      productText.includes("qua") ||
      productText.includes("qua tang") ||
      productText.includes("cao cap")
    ) {
      score += 30;
    }
  }

  // ======================================
  // MUA CHO BỐ
  // ======================================

  if (intent.recipient === "father") {
    if (
      productText.includes("hop") ||
      productText.includes("qua") ||
      productText.includes("qua tang") ||
      productText.includes("cao cap")
    ) {
      score += 30;
    }
  }

  // ======================================
  // MUA LÀM QUÀ
  // ======================================

  if (intent.purpose === "gift") {
    if (
      productText.includes("hop") ||
      productText.includes("qua") ||
      productText.includes("qua tang") ||
      productText.includes("cao cap")
    ) {
      score += 30;
    }
  }

  // ======================================
  // MUA SỐ LƯỢNG LỚN
  // ======================================

  if (intent.isBulk) {
    // Ưu tiên sản phẩm phù hợp đơn số lượng lớn
    if (
      product.bulkAvailable === true ||
      product.wholesale === true ||
      product.isWholesale === true
    ) {
      score += 40;
    }
  }

  return score;
}

// ======================================
// RECOMMEND PRODUCTS
// ======================================

// ======================================
// ĐỀ XUẤT SẢN PHẨM
// ======================================

function recommendProducts(intent) {
  const productData = typeof products !== "undefined" ? products : [];

  if (!productData.length) {
    return [];
  }

  let result = [...productData];

  // ======================================
  // BƯỚC 1
  // LỌC NGÂN SÁCH
  // ======================================

  if (intent.budget) {
    result = result.filter((product) => {
      const price = Number(product.price);

      if (isNaN(price)) {
        return false;
      }

      // ==============================
      // DƯỚI / TỐI ĐA
      // ==============================

      if (intent.budget.type === "max") {
        return price <= Number(intent.budget.max);
      }

      // ==============================
      // TRÊN / TỪ ... TRỞ LÊN
      // ==============================

      if (intent.budget.type === "min") {
        return price >= Number(intent.budget.min);
      }

      // ==============================
      // KHOẢNG GIÁ
      // ==============================

      if (intent.budget.type === "range") {
        return (
          price >= Number(intent.budget.min) &&
          price <= Number(intent.budget.max)
        );
      }

      // ==============================
      // TẦM GIÁ / KHOẢNG GIÁ
      // ==============================

      if (intent.budget.type === "around") {
        return (
          price >= Number(intent.budget.min) &&
          price <= Number(intent.budget.max)
        );
      }

      // ==============================
      // GIÁ CỤ THỂ
      // ==============================

      if (intent.budget.type === "exact") {
        return price <= Number(intent.budget.max);
      }

      return true;
    });
  }

  // ======================================
  // BƯỚC 2
  // LỌC SẢN PHẨM MỚI
  // ======================================

  if (intent.isNewProduct) {
    result = result.filter((product) => {
      return (
        product.isNew === true ||
        product.isNew === 1 ||
        product.newProduct === true
      );
    });
  }

  // ======================================
  // BƯỚC 3
  // LỌC NGƯỜI NHẬN
  // ======================================

  // Hiện tại chưa loại sản phẩm theo người nhận.
  // Chúng ta chỉ giữ recipient để hiển thị
  // "phù hợp tặng mẹ/bố".

  // ======================================
  // BƯỚC 4
  // NẾU CÓ NGÂN SÁCH
  // ƯU TIÊN THEO GIÁ
  // ======================================

  if (intent.budget) {
    result.sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);

      // ------------------------------
      // DƯỚI / TỐI ĐA
      // ------------------------------

      if (intent.budget.type === "max" || intent.budget.type === "exact") {
        // Giá cao nhất nhưng không vượt ngân sách
        return priceB - priceA;
      }

      // ------------------------------
      // TRÊN / TỪ ... TRỞ LÊN
      // ------------------------------

      if (intent.budget.type === "min") {
        // Giá thấp nhất nhưng vẫn đạt ngân sách
        return priceA - priceB;
      }

      // ------------------------------
      // KHOẢNG GIÁ
      // ------------------------------

      if (intent.budget.type === "range" || intent.budget.type === "around") {
        const target =
          intent.budget.target ??
          (Number(intent.budget.min) + Number(intent.budget.max)) / 2;

        const diffA = Math.abs(priceA - target);

        const diffB = Math.abs(priceB - target);

        return diffA - diffB;
      }

      return priceB - priceA;
    });
  } else {
    // ==================================
    // KHÔNG CÓ NGÂN SÁCH
    // DÙNG SCORE
    // ==================================

    result = result.map((product) => ({
      ...product,

      score: scoreProduct(product, intent),
    }));

    result.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return Number(b.rating || 0) - Number(a.rating || 0);
    });
  }

  // ======================================
  // CHỈ LẤY 3 SẢN PHẨM
  // ======================================

  return result.slice(0, 3);
}

function getRecommendedProducts(intent) {
  const productData =
    typeof window.products !== "undefined" && Array.isArray(window.products)
      ? window.products
      : typeof products !== "undefined" && Array.isArray(products)
        ? products
        : [];

  if (!productData.length) {
    return [];
  }

  let result = [...productData];

  // ======================================
  // GIỮ NGÂN SÁCH NẾU KHÁCH CÓ NÓI
  // ======================================

  if (intent.budget) {
    result = result.filter((product) => {
      const price = Number(product.price);

      if (isNaN(price)) {
        return false;
      }

      if (intent.budget.type === "max") {
        return price <= intent.budget.max;
      }

      if (intent.budget.type === "min") {
        return price >= intent.budget.min;
      }

      if (intent.budget.type === "range" || intent.budget.type === "around") {
        return price >= intent.budget.min && price <= intent.budget.max;
      }

      if (intent.budget.type === "exact") {
        return price <= intent.budget.max;
      }

      return true;
    });
  }

  // ======================================
  // CHẤM ĐIỂM
  // ======================================

  result = result.map((product) => {
    const rating = Number(product.rating || 0);
    const reviewCount = Number(product.reviewCount || 0);
    const sold = parseSold(product.sold);

    let score = 0;

    // Đánh giá cao
    score += rating * 20;

    // Có nhiều lượt đánh giá
    score += Math.min(reviewCount / 10, 10);

    // Bán chạy
    score += Math.min(sold / 100, 10);

    return {
      ...product,
      recommendationScore: score,
    };
  });

  // ======================================
  // SẮP XẾP
  // ======================================

  result.sort((a, b) => b.recommendationScore - a.recommendationScore);

  // ======================================
  // CHỈ LẤY 3
  // ======================================

  return result.slice(0, 3);
}
// ======================================
// AI RESPONSE
// ======================================

function getAIResponse(message, intent) {
  //   const text = message.toLowerCase().trim();

  const text = normalizeText(message);

  // ==================================
  // CHÀO HỎI
  // ==================================

  if (
    text === "hi" ||
    text === "hello" ||
    text.includes("xin chào") ||
    text === "chào"
  ) {
    return `
            Xin chào bạn 👋

            <br><br>

            Mình là <b>Trợ lý Tân Huê Viên</b> 🤖

            <br><br>

            Mình có thể giúp bạn tìm bánh
            theo <b>ngân sách</b>,
            <b>khẩu vị</b>,..
            hoặc giải đáp thắc mắc cho bạn về
            <b> giao hàng, bảo quản.</b>.

            <br><br>

            Bạn đang muốn gì hãy nói nhé (ví dụ: bảo quản, vận chuyển,..)?
        `;
  }

  // ==================================
  // CẢM ƠN
  // ==================================

  if (text.includes("cam on") || text.includes("thanks")) {
    return `
            Không có gì ạ ❤️

            <br><br>

            Rất vui được tư vấn cho bạn.
            Nếu muốn tìm loại bánh khác,
            cứ nói với mình nhé!
        `;
  }

  // ==================================
  // GIAO HÀNG
  // ==================================

  // if (
  //   text.includes("giao hang") ||
  //   text.includes("ship") ||
  //   text.includes("van chuyen")
  // ) {
  //   return `
  //           🚚 Tân Huê Viên có hỗ trợ giao hàng.

  //           <br><br>

  //           Bạn cho mình biết
  //           <b>tỉnh/thành phố</b> muốn nhận hàng,
  //           mình sẽ tư vấn tiếp cho bạn nhé.
  //       `;
  // }

  // ==================================
  // KHUYẾN MÃI
  // ==================================

  // if (
  //   text.includes("khuyen mai") ||
  //   text.includes("giam gia") ||
  //   text.includes("uu dai") ||
  //   text.includes("sale")
  // ) {
  //   const productData = typeof products !== "undefined" ? products : [];

  //   const saleProducts = productData
  //     .filter((product) => product.discount > 0)
  //     .sort((a, b) => b.discount - a.discount);

  //   return `
  //           🔥 Mình tìm thấy một số sản phẩm
  //           đang có ưu đãi:

  //           <br><br>

  //           ${createProductList(saleProducts)}
  //       `;
  // }

  // ==================================
  // CÓ THÔNG TIN CỤ THỂ
  // ==================================

  // ==================================
  // CÓ NGÂN SÁCH
  // → HIỂN THỊ SẢN PHẨM NGAY
  // ==================================

  if (intent.budget !== null) {
    return generateRecommendation(intent);
  }

  // ==================================
  // SẢN PHẨM MỚI
  // ==================================

  if (intent.isNewProduct) {
    return generateRecommendation(intent);
  }

  const hasSpecificRequest =
    intent.budget || intent.flavor || intent.preference;

  if (hasSpecificRequest) {
    return generateRecommendation(intent);
  }

  // ==================================
  // KHÁCH CHỈ NÓI MỤC ĐÍCH
  // ==================================

  if (intent.purpose) {
    const question = generateFollowUpQuestion(intent);

    if (question) {
      return question;
    }

    return generateRecommendation(intent);
  }

  // ==================================
  // CẦN HỎI THÊM
  // ==================================

  const followUp = generateFollowUpQuestion(intent);

  if (followUp) {
    return followUp;
  }

  return `
        Mình hiểu rồi 😊

        <br><br>

        Bạn muốn mình tìm cho bạn
        một loại bánh phù hợp nhất đúng không?
    `;
}

function getSaleProducts(intent) {
  let results = products.filter((product) => {
    const price = Number(product.price);
    const oldPrice = Number(product.oldPrice);

    return !isNaN(price) && !isNaN(oldPrice) && oldPrice > price;
  });

  // ======================================
  // LỌC THEO NGÂN SÁCH
  // ======================================

  if (intent.budget) {
    results = results.filter((product) => {
      const price = Number(product.price);

      if (isNaN(price)) {
        return false;
      }

      // Khoảng giá
      if (intent.budget.type === "range") {
        return price >= intent.budget.min && price <= intent.budget.max;
      }

      // Dưới giá
      if (intent.budget.type === "max") {
        return price <= intent.budget.max;
      }

      // Trên giá
      if (intent.budget.type === "min") {
        return price >= intent.budget.min;
      }

      // Giá mục tiêu
      if (intent.budget.type === "target") {
        return price <= intent.budget.target;
      }

      return true;
    });
  }

  // ======================================
  // SẮP XẾP GIẢM GIÁ CAO → THẤP
  // ======================================

  results.sort((a, b) => {
    return Number(b.discount || 0) - Number(a.discount || 0);
  });

  // ======================================
  // CHỈ LẤY 3 SẢN PHẨM
  // ======================================

  return results.slice(0, 3);
}
//Ai gemi
async function askGeneralAI(message) {
  console.log("🤖 GENERAL AI INPUT:", message);

  try {
    const response = await fetch(
      "https://soft-pond-e596.nguyenngocphuong11072002.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      },
    );

    console.log("📡 WORKER STATUS:", response.status);

    const data = await response.json();

    console.log("📦 WORKER RESPONSE:", data);

    return data.reply || "Xin lỗi, mình chưa thể trả lời câu hỏi này.";
  } catch (error) {
    console.error("❌ GENERAL AI ERROR:", error);

    return "Xin lỗi, hiện tại AI tổng quát chưa thể trả lời.";
  }
}

// async function askGeneralAI(message) {
//   try {
//     const response = await fetch(
//       "https://sweet-star-ac2e.nguyenngocphuong11072002.workers.dev/",
//       {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           message: message,
//         }),
//       },
//     );

//     const data = await response.json();

//     console.log("🤖 GENERAL AI RESPONSE:", data);

//     if (!response.ok || !data.success) {
//       console.error("❌ GENERAL AI ERROR:", data);

//       return "Xin lỗi, hiện tại mình chưa thể trả lời câu hỏi này.";
//     }

//     return data.reply;
//   } catch (error) {
//     console.error("❌ GENERAL AI FETCH ERROR:", error);

//     return "Xin lỗi, hiện tại mình chưa thể kết nối với AI.";
//   }
// }

function forwardToDetail(id) {
  window.location.href = "product-detail.html?id=" + id;
}

// ======================================
// CÂU HỎI GỢI Ý
// ======================================

document.querySelectorAll(".ai-suggestions button").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.question;

    sendMessage();
  });
});

//thanh cuon

const sliderAi = document.querySelector(".ai-suggestions");
let isDown = false;
let startX;
let scrollLeft;

sliderAi.addEventListener("mousedown", (e) => {
  isDown = true;
  sliderAi.classList.add("active");
  startX = e.pageX - sliderAi.offsetLeft;
  scrollLeft = sliderAi.scrollLeft;
});

sliderAi.addEventListener("mouseleave", () => {
  isDown = false;
});

sliderAi.addEventListener("mouseup", () => {
  isDown = false;
});

sliderAi.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - sliderAi.offsetLeft;
  const walk = (x - startX) * 2; // Nhân 2 để tăng tốc độ kéo
  sliderAi.scrollLeft = scrollLeft - walk;
});

function saveChatHistory() {
  sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(conversationHistory));
}

function loadChatHistory() {
  try {
    const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const history = JSON.parse(saved);

    if (!Array.isArray(history)) {
      return [];
    }

    return history;
  } catch (error) {
    console.error("❌ LOAD CHAT HISTORY ERROR:", error);

    return [];
  }
}

function restoreChatHistory() {
  if (!conversationHistory.length) {
    return;
  }

  console.log("💬 RESTORE CHAT HISTORY:", conversationHistory);

  conversationHistory.forEach((item) => {
    if (!item || !item.content) return;

    const type = item.role === "user" ? "user" : "bot";

    addMessage(item.content, type, item.timestamp || Date.now());
  });
}

function saveAIMemoryToSession() {
  try {
    sessionStorage.setItem(
      AI_MEMORY_STORAGE_KEY,
      JSON.stringify(userPreferences),
    );
  } catch (error) {
    console.error("❌ SAVE AI MEMORY ERROR:", error);
  }
}

function loadAIMemoryFromSession() {
  try {
    const saved = sessionStorage.getItem(AI_MEMORY_STORAGE_KEY);

    if (!saved) {
      return;
    }

    const memory = JSON.parse(saved);

    if (!memory || typeof memory !== "object") {
      return;
    }

    Object.assign(userPreferences, memory);

    console.log("🧠 RESTORED AI MEMORY:", userPreferences);
  } catch (error) {
    console.error("❌ LOAD AI MEMORY ERROR:", error);
  }
}

function scrollToBottom() {
  if (chatBody) {
    // Sử dụng setTimeout để đảm bảo các phần tử DOM đã được dựng hoàn chỉnh trước khi cuộn
    setTimeout(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 50);
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }
  const chatBox = document.getElementById("aiChatWindow");

  if (!chatBox) {
    return;
  }

  chatBox.classList.remove("active");
  chatBox.classList.remove("open");
});

document.addEventListener("DOMContentLoaded", () => {
  const suggestionContainer = document.querySelector(".ai-suggestions");

  if (suggestionContainer) {
    // 1. Tạo nút "Chat với AI"
    const aiButton = document.createElement("button");
    const questionText = "Chat với AI!";

    aiButton.setAttribute("data-question", questionText);
    aiButton.textContent = "🤖 Chat với AI";

    // 2. Gắn sự kiện click tự động điền và gửi tin nhắn
    aiButton.addEventListener("click", () => {
      if (input) {
        input.value = questionText;
        sendMessage(); // Gọi hàm sendMessage có sẵn trong code của bạn
      }
    });

    // 3. Chèn nút mới vào danh sách gợi ý
    suggestionContainer.appendChild(aiButton);
  }

  //tooltip
  const chatBtn = document.getElementById("aiChatButton");

  if (chatBtn) {
    // 2. Tạo phần tử span cho Tooltip
    const tooltip = document.createElement("span");
    tooltip.className = "chat-tooltip";
    tooltip.textContent = "CÓ GÌ HÃY HỎI TÔI";

    // 3. Chèn Tooltip vào bên trong nút Chat
    chatBtn.appendChild(tooltip);
  }

  loadAIMemoryFromSession();
  restoreChatHistory();

  initMessageTimestamps();

  // Cập nhật mỗi 30 giây
  setInterval(updateMessageTimes, 60000);
});

function timeAgo(timestamp) {
  if (!timestamp) return "Vừa xong";

  const now = Date.now();
  const secondsPast = Math.floor((now - new Date(timestamp).getTime()) / 1000);

  if (secondsPast < 30) return "Vừa xong";
  if (secondsPast < 60) return `${secondsPast} giây trước`;

  const minutesPast = Math.floor(secondsPast / 60);
  if (minutesPast < 60) return `${minutesPast} phút trước`;

  const hoursPast = Math.floor(minutesPast / 60);
  if (hoursPast < 24) return `${hoursPast} giờ trước`;

  const daysPast = Math.floor(hoursPast / 24);
  if (daysPast < 30) return `${daysPast} ngày trước`;

  return new Date(timestamp).toLocaleDateString("vi-VN");
}

// ======================================
// KHÓA / MỞ KHUNG NHẬP KHI AI ĐANG TRẢ LỜI
// ======================================

function setAIResponding(status) {
  isAIResponding = status;

  if (input) {
    input.disabled = status;

    if (status) {
      input.placeholder = "AI đang trả lời...";
    } else {
      input.placeholder = "Nhập câu hỏi...";

      // AI trả lời xong → đưa con trỏ trở lại ô nhập
      setTimeout(() => {
        input.focus();
      }, 50);
    }
  }

  if (sendButton) {
    sendButton.disabled = status;
  }
}

// ======================================
// CẬP NHẬT THỜI GIAN MESSAGE
// ======================================

function updateMessageTimes() {
  const messages = document.querySelectorAll(
    "#aiChatBody .ai-message[data-timestamp]",
  );

  messages.forEach((messageElement) => {
    const timestamp = Number(messageElement.dataset.timestamp);

    const timeElement = messageElement.querySelector(".message-time");

    if (!timeElement || !timestamp) {
      return;
    }

    timeElement.textContent = timeAgo(timestamp);
  });
}

function initMessageTimestamps() {
  const messages = document.querySelectorAll(".ai-message");

  messages.forEach((messageElement) => {
    // Nếu đã có timestamp thì bỏ qua
    if (messageElement.dataset.timestamp) {
      return;
    }

    // Gắn thời gian hiện tại
    messageElement.dataset.timestamp = Date.now();
  });

  updateMessageTimes();
}
