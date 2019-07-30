$(function() {
	var loader = $(".loading-container");
	updateBalance();
	// on form submit
	$( "#faucetForm" ).submit(function( e ) {
		e.preventDefault();
    	$this = $(this);
		loader.removeClass("hidden");
		var receiver = $("#receiver").val();
		$.ajax({
		  	url:"/",
		  	type:"POST",
		  	data: $this.serialize()
		}).done(function(data) {
			grecaptcha.reset();
			if (!data.success) {
				loader.addClass("hidden");
				console.log(data)
				console.log(data.error)
				swal("Error", data.error.message, "error");
				return;
			}

			$("#receiver").val('');
			loader.addClass("hidden");
			swal("Success",
			  `0.05 🌩ETH has been successfully transferred to <a href="https://explorer.lisinski.online/tx/${data.success.txHash}" target="blank">${receiver}</a>`,
			  "success"
			);
			updateBalance();
		}).fail(function(err) {
			grecaptcha.reset();
			console.log(err);
			loader.addClass("hidden");
		});
	});
});

function updateBalance() {
  $.ajax({
    url: "/health",
    type: "GET"
  }).done(function (data) {
    if (data.balanceInEth) {
      $(".footer-balance").text(data.balanceInEth + " 🌩ETH remaining")
    } else {
      $(".footer-balance").text("Balance not available");
    }
  }).fail(function(err) {
    $(".footer-balance").text("Balance not available");
    console.log(err);
  });
}
