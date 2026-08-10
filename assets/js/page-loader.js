// /* =========================================
//    GLOBAL PAGE LOADER
// ========================================= */

// (function () {
//   "use strict";

//   const loader = document.getElementById("page-loader");
//   const website = document.getElementById("website-content");

//   if (!loader || !website) {
//     return;
//   }

//   /* =========================================
//      KHÓA SCROLL
//   ========================================= */

//   document.body.style.overflow = "hidden";

//   /* =========================================
//      LẤY TOÀN BỘ ẢNH
//   ========================================= */

//   const images = Array.from(document.images);

//   /* =========================================
//      TRẠNG THÁI
//   ========================================= */

//   let loadedImages = 0;
//   let isFinished = false;

//   /* =========================================
//      NẾU KHÔNG CÓ ẢNH
//   ========================================= */

//   if (images.length === 0) {
//     finishLoading();

//     return;
//   }

//   /* =========================================
//      XỬ LÝ ẢNH
//   ========================================= */

//   images.forEach((img) => {
//     /*
//      * Ảnh đã được tải/cache
//      */

//     if (img.complete) {
//       handleImageLoaded();

//       return;
//     }

//     /*
//      * Ảnh tải thành công
//      */

//     img.addEventListener("load", handleImageLoaded, { once: true });

//     /*
//      * Ảnh lỗi
//      *
//      * Không để ảnh lỗi làm loader đứng.
//      */

//     img.addEventListener("error", handleImageLoaded, { once: true });
//   });

//   /* =========================================
//      ẢNH ĐÃ TẢI
//   ========================================= */

//   function handleImageLoaded() {
//     loadedImages++;

//     checkLoading();
//   }

//   /* =========================================
//      KIỂM TRA
//   ========================================= */

//   function checkLoading() {
//     if (loadedImages >= images.length) {
//       finishLoading();
//     }
//   }

//   /* =========================================
//      KẾT THÚC LOADING
//   ========================================= */

//   function finishLoading() {
//     /*
//      * Tránh chạy nhiều lần
//      */

//     if (isFinished) {
//       return;
//     }

//     isFinished = true;

//     /*
//      * Cho browser render frame cuối
//      */

//     requestAnimationFrame(() => {
//       setTimeout(() => {
//         /*
//          * Cho website xuất hiện
//          */

//         document.body.classList.add("page-ready");

//         /*
//          * Ẩn loader
//          */

//         loader.classList.add("loaded");

//         /*
//          * Mở lại scroll
//          */

//         document.body.style.overflow = "";

//         /*
//          * Xóa loader
//          */

//         setTimeout(() => {
//           if (loader) {
//             loader.remove();
//           }
//         }, 700);
//       }, 250);
//     });
//   }

//   /* =========================================
//      FALLBACK
//   ========================================= */

//   setTimeout(() => {
//     if (!isFinished) {
//       console.warn("Page Loader: timeout, website sẽ tiếp tục hiển thị.");

//       finishLoading();
//     }
//   }, 8000);
// })();

/* =========================================
   GLOBAL PAGE LOADER
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("page-loader");

  const website = document.getElementById("website-content");

  /*
   * Nếu không tìm thấy loader
   */

  if (!loader || !website) {
    console.warn("Không tìm thấy #page-loader hoặc #website-content");

    return;
  }

  /*
   * Khóa scroll
   */

  document.body.style.overflow = "hidden";

  /*
   * Lấy toàn bộ ảnh
   */

  const images = Array.from(website.querySelectorAll("img"));

  let loadedImages = 0;
  let finished = false;

  /*
   * =========================================
   * FINISH
   * =========================================
   */

  function finishLoading() {
    if (finished) {
      return;
    }

    finished = true;

    console.log("Page Loader: hoàn tất!");

    /*
     * Website hiện ra
     */

    document.body.classList.add("page-ready");

    /*
     * Loader biến mất
     */

    loader.classList.add("loaded");

    /*
     * Mở scroll
     */

    document.body.style.overflow = "";

    /*
     * Xóa loader
     */

    setTimeout(() => {
      loader.remove();
    }, 700);
  }

  /*
   * =========================================
   * CHECK IMAGES
   * =========================================
   */

  function checkImages() {
    if (loadedImages >= images.length) {
      finishLoading();
    }
  }

  /*
   * =========================================
   * IMAGE COMPLETE
   * =========================================
   */

  function imageLoaded(img) {
    /*
     * Tránh đếm một ảnh nhiều lần
     */

    if (img.dataset.loaderLoaded === "true") {
      return;
    }

    img.dataset.loaderLoaded = "true";

    loadedImages++;

    checkImages();
  }

  /*
   * =========================================
   * KHÔNG CÓ ẢNH
   * =========================================
   */

  if (images.length === 0) {
    finishLoading();

    return;
  }

  /*
   * =========================================
   * KIỂM TRA TỪNG ẢNH
   * =========================================
   */

  images.forEach((img) => {
    /*
     * Ảnh đã tải xong
     */

    if (img.complete) {
      imageLoaded(img);

      return;
    }

    /*
     * Ảnh tải thành công
     */

    img.addEventListener(
      "load",
      () => {
        imageLoaded(img);
      },
      { once: true },
    );

    /*
     * Ảnh lỗi
     */

    img.addEventListener(
      "error",
      () => {
        console.warn("Không tải được ảnh:", img.src);

        imageLoaded(img);
      },
      { once: true },
    );
  });

  /*
   * =========================================
   * FALLBACK
   * =========================================
   *
   * Không bao giờ để loader đứng mãi.
   */

  setTimeout(() => {
    if (!finished) {
      console.warn("Page Loader timeout → tự động đóng loader.");

      finishLoading();
    }
  }, 6000);
});
