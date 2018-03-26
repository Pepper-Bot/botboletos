 $(document).ready(function(){
 	$("#creditcard").on('click', function(event){
 		event.preventDefault();
 		$('#section_credit_data').show();
 		$('#icon_credit_card').attr("src","../assets/credit_card_active.svg");
 		$('#icon_pay_pal').attr("src","../assets/pay_pal_inactive.svg");
 	});
 	$("#paypal").on('click', function(event){
 		event.preventDefault();
 		$('#section_credit_data').hide();
 		$('#icon_pay_pal').attr("src","../assets/pay_pal_active.svg");
 		$('#icon_credit_card').attr("src","../assets/credit_card_inactive.svg");
 	});
});
