var express = require('express');
var app = express();
var bodyParser = require('body-parser');
global.atob = require("atob");

var products = [{
	id:1,
	name:'Apple',
	price:50,
},
{
	id:2,
	name:'Orange',
	price:75
},
{
	id:3,
	name:'Pizza',
	price:1500
},
{
	id:4,
	name:'biscuits',
	price:100
},
{
	id:5,
	name:'Orange',
	price:75
},
{
	id:6,
	name:'noodles',
	price:45
}
];

var orders = [];

var payment=[{
	amount:""
}];

var cardPayment=[{
	id:1,
	ccn:"",
	chn:"",
	cvc:"",
	amount:0,
	email:""

}];

var phonePayment=[{
	id:1,
	mn:"",
	pn:"",
	amount:0
}];

var customers=[{
	cid:"",
	discount:0,
	cusName:"",
	cusAdd:"",
	cusUsername:"",
	cusPassword:""
}]

var login=[{

	username:"user",
	password:"password"
}];
var winner =[];

var PcurrentId = 2;
var OcurrentId= 0;
var CcurrentId=0;
var currentCardPaymentId=1;
var currentPhonePayment=1;
var currentLoyaltyPoint=0;

var PORT=process.env.PORT||3001;
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/Myorders',function(req,res){
	res.send({ orders :orders });
});

//add to shopping cart according home2.html
app.post('/ordersAccHome2',function(req,res){
	var madeOrderQuantity = req.body.quantity;
	var madeOrderName = req.body.oName;
	var madeOrderPrice = req.body.oPrice;
	var discount=0;
	OcurrentId++;
	currentLoyaltyPoint=currentLoyaltyPoint+0.5;
	if(currentLoyaltyPoint==1)
	{
		discount=1;
	}
	else if((currentLoyaltyPoint>1)&&(currentLoyaltyPoint<4))
	{
		discount=2;
	}
	else if(currentLoyaltyPoint>=4)
	{
		discount=3;
	}
	var totalPrice = madeOrderQuantity*madeOrderPrice
	orders.push({
		orderId:OcurrentId,
		oName: madeOrderName,
		quantity:madeOrderQuantity,
		oPrice:totalPrice,
		discount:discount,
		loyaltyPoint:currentLoyaltyPoint

	});

	res.send({orders:orders});

});
//delete orders
app.delete('/deleteOrder/:id',function(req,res){
	var id = req.params.id;
  var found = false;

	orders.forEach(function(order, index) {
			if (!found && order.orderId === Number(id)) {
					orders.splice(index, 1);
			}
	});
	res.send('Successfully deleted order!');
});

//get customer details
app.get('/getAllCustomers',function(req,res){
	res.send({customers:customers});
});

//add customers befor Payment
app.post('/customers',function(req,res){
	var NewcusName = req.body.cusName;
	var NewcusAdd = req.body.cusAdd;
	var EncNewcusUsername = req.body.cusUsername;
	var EncNewcusPassword = req.body.cusPassword;

	var DecUn = atob(EncNewcusUsername);
	var DecPw = atob(EncNewcusPassword);

if((NewcusName!="")&&(NewcusAdd!="")&&(EncNewcusUsername!="")&&(EncNewcusPassword!=""))
{
	CcurrentId++;
	customers.push({
		cid:CcurrentId,
		cusName:NewcusName,
		cusAdd : NewcusAdd,
		cusUsername:DecUn,
		cusPassword:DecPw
	});

	res.send('added successfully!');
}
	res.send('all the feilds must be filled');
});

//generate random winner
app.get('/generateRandom',function(req,res){
	var max = CcurrentId;
	var min = 1;
if(max>=1)
	{
		var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
		winner.push({
	randomNumber:randomNumber
	});
	res.send({random:randomNumber});
}

else{
	res.send("no customers in database!");
}

})


app.get('/products',function(req,res){
	res.send({products:products});
});

app.get('/Mypayment',function(req,res){
	var t=0;
	var d=0;
	orders.forEach(function(order,index){
		t=t+order.oPrice;
		d=order.discount;
	});
	var amountAfterDiscount = (t-((t*d)/100));
	payment.push({
		amount:amountAfterDiscount
	});


res.send({totalAmount:amountAfterDiscount});

});

//calculate discount
app.get('/Mydiscount',function(req,res){
	var d=0;
	orders.forEach(function(order,index){
		d=order.discount;
	});
	customers.push({
		discount:d
	});
res.send({totalDiscount:d});

});


app.post('/cardPayment',function(req,res){
	var Newccn=req.body.ccn;
	var Newchn=req.body.chn;
	var Newcvc=req.body.cvc;
	var Newemail = req.body.email;
	currentCardPaymentId++;

	var a=0;
	payment.forEach(function(pay,index){
		a=pay.amount;
	});
	cardPayment.push({
		id:currentCardPaymentId,
		ccn:Newccn,
		chn:Newchn,
		cvc:Newcvc,
		amount:a,
		email:Newemail

	});


	if((Newccn!="")&&(Newchn!="")&&(Newcvc!="")&&(Newemail!="")){

		if(Newccn.match("[0-9]+")&& Newccn.length == 12){
				if(Newcvc.match("[0-9]+") && Newcvc.length==3){
					if(Newemail.includes("@")&&(Newemail.includes(".com"))){
						res.send('successfully added!');
					}
				}
		}
	}
	res.send('not added!');

});

app.get('/cardPayment',function(req,res){
	var a=0;
	payment.forEach(function(pay,index){
		a=pay.amount;
	});
	res.send({tamount:a});
});

app.post('/phonePayment',function(req,res){
	var Newmn=req.body.mn;
	var Newpn=req.body.pn;
	currentPhonePayment++;

	var a=0;
	payment.forEach(function(pay,index){
		a=pay.amount;
	});
	phonePayment.push({
		id:currentPhonePayment,
		mn:Newmn,
		pn:Newpn,
		amount:a

	});

	if((Newmn!="")&&(Newpn!="")){
		if(Newmn.match("[0-9]+")&& Newmn.length==10){
			if(Newpn.match("[0-9]+")&& Newpn.length==4){
				res.send('successfully added!');
			}
		}
	}

	res.send('not added!');

});
app.get('/phonePayment',function(req,res){
	var a=0;
	payment.forEach(function(pay,index){
		a=pay.amount;
	});
	res.send({tamount:a});
});



app.listen(PORT,function(){
	 console.log('Server listening on port '+ PORT);
});
