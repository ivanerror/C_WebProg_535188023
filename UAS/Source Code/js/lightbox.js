const lightbox = document.querySelector("#lightbox");

const box = document.querySelectorAll(".box");

box.forEach((image) => {
  image.addEventListener("click", (e) => {
    if(e.target.classList[0] == 'content') {
      lightbox.classList.add("active");
      document.querySelector("#img-modal").src = image.querySelector("img").src;
      $("body").css("overflow", "hidden");
    }
  });
});

lightbox.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) return;
  lightbox.classList.remove("active");
  $("body").css("overflow", "visible");
});

const fillHeart = '<i class="fa fa-heart fa-lg" aria-hidden="true"></i>';
const outlineHeart = '<i class="fa fa-heart-o fa-lg" aria-hidden="true"></i>';

const heartIcon = document.querySelectorAll('.heart-icon');

console.log(heartIcon)

heartIcon.forEach((icon) => {
  icon.addEventListener('click', (e) => {
    if($(icon).hasClass('liked')){
      $(icon).html(outlineHeart)
      $(icon).removeClass('liked')
    } else {
      $(icon).html(fillHeart)
      $(icon).addClass('liked')
    }
  });
});