$(window).scroll(function () {
  if ($(window).scrollTop() >= 300) {
    $("#navbar").css("background", "#222831");
    $("body").css({ background: "white", color: "black" });
  } else {
    $("#navbar").css("background", "transparent");
    $("body").css({ background: "#29a19c", color: "white" });
  }
});

$(document).ready(function () {
  $("body").show();
  $(".tilt").tilt({
    maxTilt: 6,
    glare: true,
    maxGlare: 0.5,
    speed: 1000,
    transition: "cubic-bezier(.86,.27,.91,.65)",
  });

  AOS.init();
});
