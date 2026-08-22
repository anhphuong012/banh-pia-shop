/* ============================
   AUTH MODAL
============================ */

const loginModal = document.getElementById("loginModal");

const loginPanel = document.getElementById("loginPanel");
const registerPanel = document.getElementById("registerPanel");

const openLoginBtn = document.getElementById("openLogin");
const openRegister = document.getElementById("openRegister");

const closeLoginBtn = document.getElementById("closeLogin");

const openRegisterBtn = document.getElementById("registerBtn");

const backLoginBtn = document.getElementById("loginBtnBack");

/* ============================
   PANEL
============================ */

function showLoginPanel() {
  console.log("Mo panel");
  registerPanel.classList.remove("active");
  loginPanel.classList.add("active");
}

function showRegisterPanel() {
  loginPanel.classList.remove("active");
  registerPanel.classList.add("active");
}

function resetAuthModal() {
  showLoginPanel();
}

function hideAIChat() {
  const chatButton = document.getElementById("aiChatButton");
  const chatWindow = document.getElementById("aiChatWindow");

  if (chatButton) {
    chatButton.style.display = "none";
  }

  if (chatWindow) {
    chatWindow.classList.remove("active");
  }
}

function showAIChat() {
  const chatButton = document.getElementById("aiChatButton");

  if (chatButton) {
    chatButton.style.display = "flex";
  }
}

/* ============================
   MODAL
============================ */

function openLoginModal() {
  resetAuthModal();

  loginModal.classList.add("show");

  hideAIChat();
}

function closeLoginModal() {
  loginModal.classList.remove("show");

  resetAuthModal();

  showAIChat();
}

function openRegisterModal() {
  loginModal.classList.add("show");

  showRegisterPanel();

  hideAIChat();
}
/* ============================
   EVENT
============================ */

// Mở Login
openLoginBtn.addEventListener("click", openLoginModal);

openRegister.addEventListener("click", function (e) {
  e.preventDefault();

  openRegisterModal();
});

// Đóng Login
closeLoginBtn.addEventListener("click", closeLoginModal);

// Chuyển sang Register
openRegisterBtn.addEventListener("click", function (e) {
  e.preventDefault();

  showRegisterPanel();
});

// Quay lại Login
backLoginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  showLoginPanel();
});

// Click ra ngoài Overlay
loginModal.addEventListener("click", function (e) {
  if (e.target === loginModal) {
    closeLoginModal();
  }
});

const forgotPanel = document.getElementById("forgotPanel");
function showForgotPanel() {
  loginPanel.classList.remove("active");
  registerPanel.classList.remove("active");
  forgotPanel.classList.add("active");
}

const openLoginMobile = document.getElementById("openLoginMobile");
const openRegisterMobile = document.getElementById("openRegisterMobile");

openLoginMobile.addEventListener("click", function (e) {
  e.preventDefault();
  openLoginModal();
});

openRegisterMobile.addEventListener("click", function (e) {
  e.preventDefault();
  openRegisterModal();
});
