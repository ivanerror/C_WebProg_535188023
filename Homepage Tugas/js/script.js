$(window).scroll(function () {
  if ($(window).scrollTop() >= 300) {
    $("#navbar").css("background", "rgba(26, 28, 32, 0.97)");
    $("body").css({ background: "whitesmoke", color: "black" });
  } else {
    $("#navbar").css("background", "transparent");
    $("body").css({ background: "rgba(26, 28, 32)", color: "white" });
  }
});

$(document).ready(function () {
  $("body").show();
  $(".tilt").tilt({
    maxTilt: 6,
    glare: true,
    maxGlare: 0.5,
    speed: 10000,
    transition: "cubic-bezier(.86,.27,.91,.65)",
  });

  AOS.init();

  var textWrapper = document.querySelector(".ml10 .letters");
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

  anime
    .timeline({ loop: true })
    .add({
      targets: ".ml10 .letter",
      rotateY: [-90, 0],
      duration: 1300,
      delay: (el, i) => 45 * i,
    })
    .add({
      targets: ".ml10",
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000,
    });
});
