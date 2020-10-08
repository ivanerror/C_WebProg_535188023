const lightbox = document.querySelector("#lightbox");

const box = document.querySelectorAll(".box");

box.forEach((image) => {
  image.addEventListener("click", (e) => {
    lightbox.classList.add("active");
    document.querySelector("#img-modal").src = image.querySelector("img").src;
  });
});

lightbox.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) return;
  lightbox.classList.remove("active");
});
