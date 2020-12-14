const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

$('#confirm_password').on('keyup', function () {
  console.log('wow')
  if ($('#password').val() == $('#confirm_password').val()) {
    $('#message').html('Password match').css('color', 'green');
  } else 
    $('#message').html("Those password didn't match. Try again.");
});