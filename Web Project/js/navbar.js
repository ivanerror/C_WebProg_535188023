$(window).scroll(function () {
  if ($(window).scrollTop() >= 300) {
    $("#navbar").css("background", "#222831");
    $("#con-search").show(2000);
  } else {
    $("#navbar").css("background", "transparent");
    $("#con-search").hide();
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
