const guideHero = document.querySelector(".guide-right");

if (guideHero) {
  guideHero.addEventListener("mousemove", (e) => {
    const x = (e.offsetX / guideHero.offsetWidth - 0.5) * 20;
    const y = (e.offsetY / guideHero.offsetHeight - 0.5) * 20;

    guideHero.querySelector(".guide-image").style.transform =
      `translate(${x}px,${y}px)`;
  });

  guideHero.addEventListener("mouseleave", () => {
    guideHero.querySelector(".guide-image").style.transform = "translate(0,0)";
  });
}
