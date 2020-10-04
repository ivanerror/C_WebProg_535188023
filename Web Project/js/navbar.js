$(window).scroll(function () {
  if ($(window).scrollTop() >= 300) {
    $("#navbar").css("background", "#222831");
    $("#js-navbar-nav").removeClass("ml-auto");
    $("#search-box").show();
  } else {
    $("#navbar").css("background", "transparent");
    $("#js-navbar-nav").addClass("ml-auto");
    $("#search-box").hide();
  }
});
