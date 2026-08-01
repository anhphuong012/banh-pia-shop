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

/* ============================
   MODAL
============================ */

function openLoginModal() {
  resetAuthModal();

  loginModal.classList.add("show");
}

function closeLoginModal() {
  loginModal.classList.remove("show");

  resetAuthModal();
}

function openRegisterModal() {
  loginModal.classList.add("show");

  showRegisterPanel();
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
