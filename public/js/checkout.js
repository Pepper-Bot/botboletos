$(document).ready(function() {
  $("#payment_type").val("cc");

  $("#creditcard").on("click", function(event) {
    event.preventDefault();
    $("#section_credit_data").show();
    $("#icon_credit_card").attr("src", "../assets/credit_card_active.svg");
	$("#icon_pay_pal").attr("src", "../assets/pay_pal_inactive.svg");
	$("#payment_type").val("cc");

  });
  $("#paypal").on("click", function(event) {
    event.preventDefault();
    $("#section_credit_data").hide();
    $("#icon_pay_pal").attr("src", "../assets/pay_pal_active.svg");
	$("#icon_credit_card").attr("src", "../assets/credit_card_inactive.svg");
	$("#payment_type").val("pp");  

  });
});
