/* 
* exchange, card offer functions...
*/

var cancelModal = '';

function card_offer(context,id) {
	console.log('card_offer('+context+','+id+')');
	
	$$("#"+context+" .thumb").show();
	//$$('#'+context).css({ 'top': $$('#'+context).data('top') })
	$$('#'+context).css({ 'top': B.t })
	$$('#'+context).animate(
	    { 'top': 10 },
	    {
	        duration: 500,
	        easing: 'swing',
	        begin: function (elements) {},
	        complete: function () { card_offered(context,id); }
	    }
	);
}

function card_offer_cancel(id) {
	console.log('card_offer_cancel('+id+')');
	B.card_offered = false;
	socket.emit('card offer cancel', {"cardid":id});
}

function card_offered(context,id) {
	console.log('card_offered()');
	B.card_offered = false;
   
	geoLocation(function(p){
		console.log({"cardid":B.cards.mycard.id, "id":id ,"lat":p.latitude, "lng":p.longitude, "alt":p.altitude})
		socket.emit('card offer', {"cardid":B.cards.mycard.id, "id":id ,"lat":p.latitude, "lng":p.longitude, "alt":p.altitude});
	});
	
	$$('#'+context+' .thumb').hide();
	$$('#'+context).animate( 
		{ 'top': B.t}, 
		{ complete: function(){ $$(".no-thumb").show() } }
	);
} 

function onShake() {
	// Fired when a shake is detected
	B.list
	card_offer("mycard", B.cards.mycard.id);
}

(function (document) {
	document.addEventListener("backbutton", function(e){
		e.preventDefault();
		mainView.router.back();
	}, false);
}(document));

socket.on('connect_error', function() {
    $connected = false;
    console.log('$connected = '+$connected);
});
socket.on('connect', function () {
    $connected = true;
    console.log('$connected = '+$connected);
});
socket.on('disconnect', function () {
    $connected = false;
    console.log('$connected = '+$connected);
});
socket.on('reconnect', function () {
    $connected = true;
    console.log('$connected = '+$connected);
});
socket.on('card msg', function(data){
	myApp.alert(data)
});
socket.on('card login', function (data) {
	console.log('on card login : '+data.msg)
	
	switch(data.msg) {
		case "card not found":
			myApp.formDeleteData('login_form');
			myApp.alert("It's the first time we see this email used from this device. <b>We sent a message to this address</b> to confirm ownership so please open it and follow the instructions to gain access.");
			//welcomescreen.open();
			myApp.loginScreen();
			$$("#email").focus();
			break;
		case "card not confirmed":
			myApp.formDeleteData('login_form');
			myApp.alert("This email is not confirmed on this device.<br>We sent a new message to confirm ownership so please open it to have access.");
			//welcomescreen.open();
			myApp.loginScreen();
			$$("#email").focus();
			break;
		case "card login try count":
			myApp.formDeleteData('login_form');
			myApp.alert("This email is not confirmed on this device and you exceeded the number of try without confirming.");
			//welcomescreen.open();
			myApp.loginScreen();
			$$("#email").html('');
			$$("#email").focus();
			break;
		case "card logged in":
		   myApp.closeModal(".login-screen.modal-in");
			socket.emit('card load2', data.id);
		   myApp.alert('Synchronizing your data...<br>Please wait.');
		   geoPermission();
			break;
		case "card set uuid":
			window.localStorage.setItem('uuid',data.uuid);
			break;
	}
	
});

socket.on('card rem', function() {
	myApp.formDeleteData('login_form');
	myApp.loginScreen(".login-screen.modal-in");
	myApp.hidePreloader();
});

socket.on('card load', function (data) {
	
	if (data.fields) B.fields = data.fields;
	if (data.cards_fields2) B.cards_fields = data.cards_fields2;
	
	B.cards = {
		mycard: {},
		current: [],
		waiting: []
	}
	
	B.cards.mycard = data.mycard;
	
	for(var i=0; i<data.cards.length; i++) {
		if (data.cards[i].accepted) {
			B.cards.current.push(data.cards[i]);
		} else {
			B.cards.waiting.push(data.cards[i]);
		}
	}
	
	//window.localStorage.setItem('_B', JSON.stringify(B));
	saveData()	
	
	if (B.cards.current) $$(".badge.current-list-nbr").html(B.cards.current.length);
	if (B.cards.waiting) $$(".badge.waiting-list-nbr").html(B.cards.waiting.length);
	
	B.list = "mycard";
	B.index = false;
	card_populate();
	
	myApp.hidePreloader();
	myApp.closeModal();
	
	if (typeof shake !== 'undefined') shake.startWatch(onShake, B.options.shake_level);

	
}); // socket on load

socket.on('card shared data', function(card) {
	B.cards.waiting.push(card.cards);
	$$(".badge.waiting-list-nbr").html(B.cards.waiting.length);
	for(var i=0; i<card.cards_fields.length; i++) B.cards_fields.push(card.cards_fields[i]);
	myApp.alert("A new card in your waiting list!<br>Shared by someone"+(card.mesg ? " who wrote this:<p>\"<b>"+card.mesg+"</b>\"" : '.'));
});
				
socket.on('card record', function (data) {
	
	myApp.hidePreloader();

	switch(data.msg) {
		case "UPDATED":
			myApp.alert("Card updated!");
			break;
		case "EMAIL_EXIST":
			if (data.id==B.cards.mycard.id) {
				myApp.alert("<b>This email address is exactly like your's!</b><br>Please change it and try again.");
			} else if (data.accepted) {
				myApp.alert("<b>This email address is already in your current cards!</b>");
				mainView.router.load({pageName: 'index'});
			} else if (data.added) {
				clearTimeout(B.timout);
				myApp.modal({
					title: 'Existing card', 
					text: '<b>This email address is already in your waiting cards!</b><br>Do you want to accept it?', 
					buttons: [
						{ text: "No thanks", onClick: function(){
							mainView.router.load({pageName: 'index'});
						} },
						{ text: "Yes, accept it", onClick: function(){
							B.container = "#thecard";
							$$(B.container).data("id", data.id);
							card_auth(data.id, 'accept');
							mainView.router.load({pageName: 'index'});
						}}
					]
				});
			} else if (data.payed) {
				clearTimeout(B.timout);
				myApp.modal({
					title: 'Existing card', 
					text: '<b>This email address is already used by a paying user!</b><br>Do you want to add it?', 
					buttons: [
						{ text: "No thanks", onClick: function(){
							myApp.alert("You should change the email address...");
							$$(B.container+" input[type='email']").focus();
						} },
						{ text: "Yes, add it", onClick: function(){
							data["cardid"] = B.cards.mycard.id;
							socket.emit("card add",data);
							mainView.router.load({pageName: 'index'});
						}}
					]
				});
			}
			break;
		case "INSERTED":
			if (data.cards_fields) card_recorder(data);
			break;
	}
	
});

socket.on('card add', function(data){
	console.log('card add : '); console.log(data);
	
	//var list_field = ['company','firstname','lastname','email','id','poinst_img']
	//var pars = {};
	for (var i=0; i<data.cards_fields.length; i++) {
		var name = '';
		for (var ii=0; ii<B.fields.length; ii++) {
			if (B.fields[ii].id==data.cards_fields[i].field_id) {
				name = B.fields[ii].en.toLowerCase().replace(/\s/g,'');
				break;
			}
		}
		//if (list_field.indexOf(name)!==false) pars[name] = data.cards_fields[i].value;
		B.cards_fields.push(data.cards_fields[i]);
	}
	//pars['cardid'] = B.cards.mycard.id;
	//pars["accepted"] = data.card.accepted;
	//pars["id"] = data.card.id;
	if (data.card.accepted==null) {
		myApp.alert("Card added to your waiting list!")
		B.cards.waiting.push(data.card);
		$$(".badge.waiting-list-nbr").html(B.cards.waiting.length);
	} 
	else {
		myApp.alert("Card added to your current list!")
		B.cards.current.push(data.card);
		$$(".badge.current-list-nbr").html(B.cards.current.length);
	}
	//window.localStorage.setItem('B', JSON.stringify(B));
	saveData();
	mainView.router.load({pageName: 'index'});
});

socket.on('card details', function(data){
	// si la carte n'est pas deja dans mes listes (added!=null)...
	for (var i=0; i<data.cards_fields.length; i++) {
		B.cards_fields.push(data.cards_fields[i]);
	}
	if (data.card.accepted==null) {
		myApp.alert("Card added to your waiting list!")
		B.cards.waiting.push(data.card);
		$$(".badge.waiting-list-nbr").html(B.cards.waiting.length);
	} 
	else {
		myApp.alert("Card added to your current list!")
		B.cards.current.push(data.card);
		$$(".badge.current-list-nbr").html(B.cards.current.length);
	}
	//window.localStorage.setItem('B', JSON.stringify(B));
	saveData();
});
socket.on('card accepted', function(data){
	if (data.msg=='OK') {
		
		for (var i=0; i<B.cards.waiting.length; i++) {
			if (B.cards.waiting[i].id==data.id) {
				B.cards.current.push(B.cards.waiting[i]);
				B.cards.waiting.splice(i,1);
			}
		}
		
		if (B.cards.current) $$(".badge.current-list-nbr").html(B.cards.current.length);
		if (B.cards.waiting) $$(".badge.waiting-list-nbr").html(B.cards.waiting.length);
		$$(".current-list-open").trigger("click");
		myApp.alert("Card accepted and transfered to your current card list!");
	}
	//window.localStorage.setItem('B', JSON.stringify(B));
	saveData();
});
socket.on('card refused', function(data){
	if (data.msg=='OK') {
		
		for (var i=0; i<B.cards.waiting.length; i++) {
			if (B.cards.waiting[i].id==data.id) {
				B.cards.waiting.splice(i,1);
			}
		}
		
		if (B.cards.waiting) $$(".badge.waiting-list-nbr").html(B.cards.waiting.length);
		$$(".waiting-list-open").trigger("click");
		myApp.alert("Card deleted from your waiting card list!");
		//window.localStorage.setItem('B', JSON.stringify(B));
		saveData();
	}
});
socket.on('card deleted', function(data){
	if (data.msg=='OK') {
		
		for (var i=0; i<B.cards.current.length; i++) {
			if (B.cards.current[i].id==data.id) {
				B.cards.current.splice(i,1);
				$$("li.card-item.item"+data.id).remove();
			}
		}
		$$(".current-list-open").trigger("click");
		if (B.cards.current) $$(".badge.current-list-nbr").html(B.cards.current.length);
		myApp.alert("Card deleted from your current card list!");
		//window.localStorage.setItem('B', JSON.stringify(B))
		saveData();
	}
});
socket.on('card qr', function(data){

	if (data.image) {
  	 //if (storageAvailable()) localStorage.setItem('card_qr', data.buffer);
    //qr_src = 'data:image/png;base64,' + data.buffer;
    //$$("#qr_img").attr("src", qr_src);
		myApp.alert('<div class="picker-modal-inner"><div class="content-block" style="text-align: center;width:100%;"><img src="data:image/png;base64,'+data.buffer+'" align="middle" style="width:150px;" /></div></div>');
  
	}
  
});
socket.on('card connected', function(data){
  console.log("card connected response: "+data)
});
socket.on('custom field', function(data){
  	myApp.alert(data.msg);
			
  	B.fields.push({"id":data.id,"en":data.field,"fr":data.field,"base":0,"order":255});
  	//window.localStorage.setItem('B', JSON.stringify(B));
  	saveData();
  	
	var li = $$(B.container).find("li.ii_"+data.ii);
	li.find(".label").attr("data-i",data.id);
	li.find(".label").text(data.field);
	li.find("input").attr("name",data.id);
	myApp.closeModal(".choseModal");
});
socket.on('sms test result', function(data){
	switch(data.act) {
		case "good":
		case "not": $$("#validation_modal_text").html(data.msg); break;
		case "bad": $$("#sms_test_msg").text(data.msg); $$("#sms_test_code").val(''); break;
	}
});
socket.on('card cc charge', function(data){
	$$.each(B.cards.current, function(i,c){
		if (c.id==data.id) {
			B.cards.current[i].payed_date=Date().toString();
			//window.localStorage.setItem('B', JSON.stringify(B));
			saveData();
		}
	});
	$$("#card-form .payfor").hide();
	myApp.alert("Payment complete!");
});

socket.on('card offer confirm', function(data){
	
   cancelModal = myApp.modal({
   	title: 'Card offered...', 
   	text: 'Clic below to cancel', 
   	buttons: [
			{ text: "Cancel", onClick: function() { card_offer_cancel(data.id); } }
		]
	});
	clearTimeout(B.timout);
	B.timout = setTimeout(function () { myApp.closeModal(cancelModal); B.card_offered = false; }, 30000)
	
});

socket.on('cards list', function(data){
	
	myApp.closeModal();

	if (!data) return false; 
	
	$$("#pulser").hide();
 		
	if (data.length > 1) {
		var text = '<div class="list-block" id="cards_found"><table style="width:100%;">';
		var fnds = [];
 			
		var titre = (data.length > 1 ? "We found those offers<br>(clic a name to accept)" : "We found this offer<br>(clic to accept)");
 			
		$$.each(data, function(i,card){
			
			if (card.card == B.card_offered || card.card == B.cards.mycard.id) return true;
			
			var fullname = (card.firstname || card.lastname ? card.firstname+' '+card.lastname : card.email);
			var linked = (card.accepted ? "fa-id-card-o" : (card.added ? "fa-id-card" : "fa-check-square-o"));
 				
			if (card.card!=B.cards.mycard.id) fnds.push('<tr style="border-bottom:solid 1px #bbb;" onClick="card_auth('+card.card+',\'offer auth\');myApp.closeModal();B.card_offered = false;">\
<td align="left">'+fullname+'<span style="float:right">'+(30-card.delais)+'s</span></td>\
<td align="right"><i class="fa '+linked+'"></i></td>\
</tr>');
		});
 			
		text += fnds.join('<tr><td colspan="3"><hr></td></tr>') + '</table></div>';
 		
 		clearTimeout(B.timout);
		myApp.modal({title: titre, text: text, buttons: [
			{ text: "Cancel", onClick: function(){}}
		]});
		
		var timers = [];		
		$$('#cards_found').find('span').each(function(i,e){
			var timer = $$(this);			
			timers[i] = setInterval(function() {
				var sec = parseInt(timer.text());
				sec--;
				timer.text(sec+'s')
			  // If the count down is finished, write some text 
			  if (sec < 0) {
			    clearInterval(timers[i]);
			    timer.parent().parent().remove();
			    if ($$('#cards_found').find('span').length<1) myApp.closeModal();
			  }
			}, 1000);
		});
	}

});



function card_login(email) {
	console.log('card_login('+email+')');
	
	if (!email) return false;
	
	// validation des champs de login...
	var regexp = /^[a-z0-9](\.?[a-z0-9_-]){0,}@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/gi;
	if (!email.match(regexp)) {
		myApp.alert("Your email address doesn't respect the standards. Please correct it and try again.")																																																																																																																																																																																																																																																																																																																																																				
		myApp.loginScreen();
		$$("#email").val('');
		$$("#email").focus();
		return false;
	}

	myApp.formStoreData('login_form', {
		"email":email
   });
   
   var uuid = window.localStorage.getItem('uuid') || '';
		   
	var login_data = {
		"email":email,
		"uuid":uuid
	}
	
	socket.emit('card login2', login_data);

}
	
var storedData = myApp.formGetData('login_form');

if (storedData) {
	if ($connected) {
		card_login(storedData.email);
	} 
	else {
		B.list = "mycard";
		B.index = false;
		card_populate();
	}
} else {
	//welcomescreen.open();
	$$("#email").focus();
}
