/* =========================================
   GLOBAL PAGE LOADER
========================================= */

(function () {
  const loader = document.getElementById("page-loader");

  const website = document.getElementById("website-content");

  if (!loader || !website) {
    return;
  }

  /*
   * Khóa scroll trong lúc loading
   */

  document.body.style.overflow = "hidden";

  /*
   * Lấy toàn bộ ảnh trong website
   */

  const images = Array.from(document.images);

  /*
   * Nếu trang không có ảnh
   */

  if (images.length === 0) {
    finishLoading();

    return;
  }

  let loadedImages = 0;

  images.forEach((img) => {
    /*
     * Ảnh đã được browser cache
     */

    if (img.complete) {
      loadedImages++;

      checkLoading();

      return;
    }

    /*
     * Ảnh tải thành công
     */

    img.addEventListener("load", handleImageLoaded, { once: true });

    /*
     * Ảnh lỗi vẫn cho phép
     * website tiếp tục hiển thị
     */

    img.addEventListener("error", handleImageLoaded, { once: true });
  });

  function handleImageLoaded() {
    loadedImages++;

    checkLoading();
  }

  function checkLoading() {
    if (loadedImages >= images.length) {
      finishLoading();
    }
  }

  function finishLoading() {
    /*
     * Cho browser render lần cuối
     */

    requestAnimationFrame(() => {
      setTimeout(() => {
        document.body.classList.add("page-ready");

        loader.classList.add("loaded");

        document.body.style.overflow = "auto";

        /*
         * Xóa loader khỏi DOM
         * sau khi animation kết thúc
         */

        setTimeout(() => {
          loader.remove();
        }, 700);
      }, 250);
    });
  }

  /*
   * Fallback:
   *
   * Không để người dùng bị kẹt
   * vô hạn ở màn hình loading.
   */

  setTimeout(() => {
    if (!document.body.classList.contains("page-ready")) {
      finishLoading();
    }
  }, 8000);
})();
