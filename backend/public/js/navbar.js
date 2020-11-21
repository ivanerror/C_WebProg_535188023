$(window).scroll(function () {
  if ($(window).scrollTop() >= 300) {
    $("#navbar").css("background", "#222831");
    $("#js-navbar-nav").removeClass("ml-auto");
    $("#search-box").css("display", "flex");
  } else {
    $("#navbar").css("background", "transparent");
    $("#js-navbar-nav").addClass("ml-auto");
    $("#search-box").hide();
  }
});

// $(document).ready(function(){
//   $("#heart").click(function(){
//     if($("#heart").hasClass("liked")){
//       $("#heart").html('<i class="fa fa-heart-o fa-lg" aria-hidden="true"></i>');
//       $("#heart").removeClass("liked");
//     }else{
//       $("#heart").html('<i class="fa fa-heart fa-lg" aria-hidden="true"></i>');
//       $("#heart").addClass("liked");
//     }
//   });
// });

