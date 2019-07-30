$(function() {
	var loader = $(".loading-container");
	updateBalance();
	// on form submit
	$( ".ff" ).submit(function( e ) {
		e.preventDefault();
    	$this = $(this);
		loader.removeClass("hidden");
		
		$.ajax({
		  	url:"/",
		  	type:"POST",
		  	data: $this.serialize()
		}).done(function(data) {
			//grecaptcha.reset();
			if (!data.success) {
				loader.addClass("hidden");
				console.log(data)
				console.log(data.error)
				swal("Error", data.error.message, "error");
				return;
			}

			$(".rec").val('');
			loader.addClass("hidden");
			swal("Success",
			  `🌩ETH has been successfully transferred!`,
			  "success"
			);
			updateBalance();
		}).fail(function(err) {
			//grecaptcha.reset();
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
