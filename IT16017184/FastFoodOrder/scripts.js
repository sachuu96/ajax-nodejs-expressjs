
//view my orders
$(function(){
	$('#get-button').on('click',function(){
		$.ajax({
			url:'/Myorders',
			contentType:'application/json',
			success:function (response){
				var tbodyEl = $('tbody');
								tbodyEl.html('');

				response.orders.forEach(function(order) {
                    tbodyEl.append('\
                        <tr class="success">\
                            <td class="id">' +order.orderId + '</td>\
                            <td class="name">' +order.oName + '</td>\
                            <td class="quantity">'+order.quantity+'</td>\
                            <td class="price">'+order.oPrice+'</td>\
                            <td class="discount">'+order.discount+'</td>\
                            <td class="discount">'+order.loyaltyPoint+'</td>\
														<td><button class="delete-button">delete</td>\
                        </tr>\
                    ');
                });
			}
		});
	});


//view food details
	$('#getfood-button').on('click',function(){
		$.ajax({
			url:'/products',
			method:'GET',
			contentType:'application/json',
			success:function (response){
				var tbodyEl = $('tbody');
								tbodyEl.html('');
				response.products.forEach(function(product){
                    tbodyEl.append('\
                    	   <tr class="info">\
                            <td><input type="lable" value="' +product.id + '" class="create-input-id" disabled></td>\
                            <td><input type="lable" value="' +product.name + '" class="create-input-name" disabled></td>\
                            <td><input type="lable" value="'+product.price+'" class="create-input-price" disabled></td>\
                            <td> <select class="form-control"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>\
                            </td>\
                            <td><button class="btn btn-primary" >Buy</button>\
                            </td>\
                        </tr>\
                    ');
                    });
				}
		});
	});

	//view customer Details
	$('#get-customers').on('click',function(){
		$.ajax({
			url:'/getAllCustomers',
			method:'GET',
			contentType:'application/json',
			success:function (response){
				var tbodyEl = $('tbody');
							tbodyEl.html('');
						response.customers.forEach(function(customer){
								tbodyEl.append('\
									<tr class="info">\
										<td>'+customer.cid+'</td>\
										<td>'+customer.cusName+'</td>\
									</tr>\
									');
								});

							}
					});
			});

			//delete orders
		$('table').on('click','.delete-button',function(){
			var rowEl = $(this).closest('tr');
      var id = rowEl.find('.id').text();

			$.ajax({
				url: '/deleteOrder/' + id,
				method:'DELETE',
				contentType:'application/json',
				success: function(response) {
							console.log(response);
							$('#get-button').click();
					}
			});
		});

	//add to shopping card according to home2.html
	$('table').on('click','.btn-primary',function(){

		var rowEl = $(this).closest('tr');
		var createInputId = rowEl.find('.create-input-id').val();
		var createInputName = rowEl.find('.create-input-name').val();
		var createInputPrice = rowEl.find('.create-input-price').val();
		var createInputQuantity = rowEl.find('.form-control').val();

		$.ajax({
			url:'/ordersAccHome2',
			method:'POST',
			contentType:'application/json',
			data: JSON.stringify({
				quantity : createInputQuantity,
				oName : createInputName,
				oPrice : createInputPrice

			}),
			success:function(response){
				console.log(response);

			}
		});
	});

//calculate total payment
$('#getBill-button').on('click',function(){
	$.ajax({
		url:'/Mypayment',
		contentType:'application/json',
		success:function (response){
			console.log(response);
			var para = $('p');
			para.html('');
			para.append('\<p>\
                        ' +response.totalAmount +'</p>\
                    	'
                    	);
		}
	});
});


//get total discount
$('#getDiscount-button').on('click',function(){
	$.ajax({
		url:'/Mydiscount',
		contentType:'application/json',
		success:function (response){
			console.log(response);
			var span = $('span');
			span.html('');
			span.append('\<span>\
                        ' +response.totalDiscount + '</span>\
                    	'
                    	);
		}
	});
});

//add customer Details
$('#form-customer').on('submit',function(event){
	event.preventDefault();

	var cusName = $('#create-name');
	var cusAdd = $('#create-address');
	var cusUsername = $('#create-username');
	var cusPassword = $('#create-password');
	var encUn = btoa(cusUsername.val());
	var encPW = btoa(cusPassword.val());

	$.ajax({
		url:'/customers',
		method:'POST',
		contentType:'application/json',
		data: JSON.stringify({
			cusName : cusName.val(),
			cusAdd : cusAdd.val(),
			cusUsername:encUn,
			cusPassword:encPW
		}),
		success:function(response){
			alert(response);
			if(response=="added successfully!")
			{
				alert(response)
				window.location.href = "http://localhost:3001/payment2.html";
			}

		}
	});

});

//Add to card payment
	$('#credit-card-payment').on('submit',function(event){
		event.preventDefault();

		var ccn = $('#ccn');
		var chn = $('#chn');
		var cvc = $('#cvc');
		var email = $('#email');

		$.ajax({
			url:'/cardPayment',
			method:'POST',
			contentType:'application/json',
			data: JSON.stringify({
				ccn : ccn.val(),
				chn : chn.val(),
				cvc : cvc.val(),
				email : email.val()

			}),
			success:function(response){
				console.log(response);
				if(response=="successfully added!"){
					alert("Success!.email is sent!")
				}
				else {
					alert("check wether all the feilds are filled correctly!");
				}
			}
		});
	});

	//fill amount text cardPayment
	$('#get-amount').on('click',function(){
		$.ajax({
			url:'/cardPayment',
		contentType:'application/json',
		success:function (response){
			console.log(response);
			var span = $('span');
			span.html('');
			span.append('\<span>\
                        ' +response.tamount + '</span>\
                    	'
                    	);
		}

		});
	});

//Add to mobile phone payment mobile-payment
	$('#mobile-payment').on('submit',function(event){
		event.preventDefault();

		var mn = $('#mn');
		var pn = $('#pn');

		$.ajax({
			url:'/phonePayment',
			method:'POST',
			contentType:'application/json',
			data: JSON.stringify({
				mn : mn.val(),
				pn : pn.val()

			}),
			success:function(response){
				console.log(response);
				if(response=="successfully added!"){
					alert("Success. SMS is sent")
				}
				else{
					alert("Check wether all the feilds are filled correctly!");
				}
			}
		});
	});


	//fill amount text phonePayment
		$('#get-amount-phone').on('click',function(){
		$.ajax({
			url:'/phonePayment',
		contentType:'application/json',
		success:function (response){
			console.log(response);
			var span = $('span');
			span.html('');
			span.append('\<span>\
                        ' +response.tamount + '</span>\
                    	'
                    	);
		}

		});
	});

	//generate random number to win
$('#random').on('click',function(){
	$.ajax({
		url:'/generateRandom',
		method:'GET',
		contentType:'application/json',
		success:function (response){
			console.log(response);

			if(response=="no customers in database!")
			{
				alert(response);
			}
			else {

				var span = $('span');
				span.html('');
				span.append('\<span>\
													' +response.random + '</span>\
												'
												);
			}


		}
	});
});

});
