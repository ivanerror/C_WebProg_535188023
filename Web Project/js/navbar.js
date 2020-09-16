$(window).scroll(function () {
  $(".navbar").toggleClass("scrolled", $(this).scrollTop() > 300);
  $(".navbar a").toggleClass("scrolled", $(this).scrollTop() > 300);

  if ($(this).scrollTop() < 300) {
    $(".navbar .navbar-brand img").attr("src", "accel-logo.png");
  } else {
    $(".navbar .navbar-brand img").attr("src", "accel-logo-scrolled.png");
  }
});

$(window).on("resize load", function () {
  if ($(window).width() < 992) {
    $("#search-box").addClass("search-box");
    $("#search-txt").addClass("search-txt");

    $("#search-box").removeClass("search-box-hover");
    $("#search-txt").removeClass("search-txt-hover");
  } else {
    $("#search-box").addClass("search-box-hover");
    $("#search-txt").addClass("search-txt-hover");

    $("#search-box").removeClass("search-box");
    $("#search-txt").removeClass("search-txt");
  }
});
