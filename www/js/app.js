/* B.ï.Z specific /var/www/html/card/js/app.js */

 var myApp = new Framework7({
	precompileTemplates: true,
	template7Pages: true,
	allowDuplicateUrls:true,
	modalTitle: 'B.&iuml;.Z',
	modalButtonCancel: 'Cancel...',
	modalPreloaderTitle: 'One moment please...',
	scrollTopOnStatusbarClick: true,
	uniqueHistory: true,
	routerRemoveWithTimeout: true,
	swipeBackPage: false
});

var mySwiper = myApp.swiper('.swiper-container', {
   pagination:'.swiper-pagination',
   allowSlideNext: false
});

var $$ = Dom7;

var B = {
	about:'B.&iuml;.Z is a product of Kontakt Mondo inc. and all related subdiaries . Reserved brand blblbl.<p> KontaktMondo is an incorporation under Canada law bbllblba on May xx 2019. </p> <p>Current version in used: 0.7.1 (2019-06)',
	server:'https://virtualbizcards.com:3333/',
	options: {
		ocr_match: true,
		shake_level: 40
	},
	croper:{},
	crop_opts:{"img":'img/b.png',"card":{ width: ($$("body").width() - 10), height: (($$("body").width() - 10) / 3.5 * 2), type: 'square' },"boundary":{ width: ($$("body").width() - 10), height: (($$("body").width() - 10) / 3.5 * 2)}}
};

var templates_name = ["Standard","Classical","Centered"];

$$.each(cards_templates, function(i,e){
	var data = {
		firstname:"John",
		lastname:"Doe",
		title:"Job Title",
		company:"Company name",
		address:"123 street",
		city:"City",
		state_prov:"Region",
		zip_postal:"zip code",
		country:"Country",
		website:"www.some_domain",
		email:"john.doe@some_domain",
		cellphone:"555-555-1234",
		fax:"555-555-6789",
		template:i
	};
	
	var HTML = '<div class="card_template" id="'+i+'" data-name="'+templates_name[i]+'">\
	       <div class="content">';
	//HTML += card_populate(0,data);
	HTML += '</div>\
	       <div class="points"><img src="img/badge_none.png" alt="points"></div>\
	       <div class="card_template_on"><i class="fa fa-check fa-4x"></i></div>\
	     </div>';
	
	$$(".popup-templates > .content-block").append(HTML);
});

var currentList = Template7.compile($$('#current-list').html());

var waitingList = Template7.compile($$('#waiting-list').html());

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

var mySearchbar = {};

var socket = io.connect(B.server);
var $connected = false;
var $online = false;


function card_populate() {
	console.log('card_populate()');
	
	var c = (B.list=='mycard' ? B.cards[B.list] : B.cards[B.list][B.index]);
	
	var html = cards_templates[(c.template ? c.template : 0)];
	
	var complete_name = '';
	
	var html2 = '<div class="card-info-name">{{firstname}} {{lastname}}</div><div class="card-info-add">{{email}}{{title}}{{address}} {{city}} {{state_prov}} {{country}} {{postal code}}</div>';
	
	$$.each(B.cards_fields, function(iii,cf) {
		if (cf.cid==c.id) {
			var v = '', e = '';
			switch(cf.fid) {
				case 10: c.shake_level = cf.v; break;
				case 11: c.ocr_match = cf.v; break;
				case 26: e = 'cellphone'; v = 'C: '+cf.v; break;
				case 29: e = 'company'; v = cf.v; break;
				case 33: e = 'email'; v = 'E: '+cf.v+'<br>'; break;
				case 35: e = 'firstname'; v = cf.v; 
					c.firstname = v; complete_name = v; break;
				case 38: e = 'lastname'; v = cf.v; 
					c.lastname = v; complete_name += ' '+v; break;
				case 40: e = 'title'; v = cf.v+'<br>'; break;
				case 50: e = 'logo'; v = cf.v; break;
				case 52: c.avatar = cf.v; break;
			}
			if (e) {
				html = html.replace(new RegExp('{{'+e+'}}', 'g'), v);
				html2 = html2.replace(new RegExp('{{'+e+'}}', 'g'), v.replace('E: ',''));
			}
		}
	});
	
	html = html.replace(/{{[\w\s]*}}/g, '');
	html2 = html2.replace(/{{[\w\s]*}}/g, '');
	
	if (B.list == 'mycard') {
		
		if (c.firstname+c.lastname=='') {
			card_initial_setup();
			return false;
		}
		
		var img = card_points_img(c)
		
		$$(".pieID.pie_text").html(img.points_img +'<br>'+ Math.round(c.points/img.points_target*100)+"%");
		$$(".pieID.legend span.actual").html(c.points+"");
		$$(".pieID.legend span.missing").html(img.points_target-c.points+"");
		$$(".pieID.legend span.target").html(img.points_target+"");
		
		var next_target = "Your next target:<br>Bronze";
		switch(img.points_img) {
			case "Bronze":	next_target = "Your next target:<br>Silver"; break;
			case "Silver": next_target = "Your next target:<br>Gold"; 	break;
			case "Gold": 	next_target = "Your next target:<br>Diamond";break;
			case "Diamond":
				next_target = "You're at the TOP!"; 			
				$$(".pieID.legend li.missing, .pieID.legend li.target").hide();
				break;
		}
		$$(".pieID.legend span.next_target").html(next_target);
		$$(".pieID.pie").addClass(img.points_img.toLowerCase());
		pie_create(".pieID.legend", ".pieID.pie");
		
		B.cardid = B.cards.mycard.id;
		
	}
	else {
		
		if (B.list=="waiting") $$("#card-form .card-info-txt").html(html2);
		
		var initials = '--'
		initials = c.firstname.substr(0,1).toUpperCase();
		initials += c.lastname.substr(0,1).toUpperCase();
		if (c.avatar) {
			$$("#card-form .card-info-pastille").css({"background-image":"url("+c.avatar+")"});
			$$("#card-form .card-info-pastille").text('');
		} else {
			$$("#card-form .card-info-pastille").css({"background-image":"none"});
			$$("#card-form .card-info-pastille").text(initials);
		}
		B.list = 'thecard';
		
	}
	
	$$("#"+B.list+" .content").html(html);
	c.points_img = (c.points_img ? c.points_img : 'bronze');
	$$("#"+B.list+" .points > img").attr("src", "img/badge_"+ c.points_img.toLowerCase() +".png");
	$$(".card-info-title").text(complete_name);
		
	B.h = $$("#"+B.list).width() / 3.5 * 2.0;
	B.t = $$("#"+B.list).offset().top;
	
	$$("#"+B.list).data("top", B.t);
	$$("#"+B.list).css({"height": B.h, "bottom":B.t+B.h});
	
	$$("#"+B.list).find(".handle").on("click touchmove touchstart", function(e){
		if ($$(this).parent().attr("id") == "mycard") {
			B.list = "mycard";
			B.cardid = B.cards.mycard.id;
		}
		if (!B.card_offered) {
			B.card_offered = true;			
			card_offer(B.list, B.cardid);
		}
	});
				
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
function card_form_open() {
	console.log('card_form_open()');
	
	mainView.router.load({pageName: 'card-form'});
	
	if (B.list=='mycard') {
		$$("#card-form > div > div").hide();
		$$("#card-form > div > div.edit, #card-form > div > div.parameters").show()
		$$("#card-form > div > div.edit, #card-form > div > div.parameters").removeClass("hidden");
		$$("#card-form-edit").hide();
		var pre_ph = 'your ';
		var card = B.cards.mycard;	
	} 
	else {
		var card = B.cards[B.list][B.index];	
	} 
	
	if (B.list=='waiting') {
		$$("#card-form > div > div").hide();
		$$("#card-form > div > div.waiting").show()
		$$("#card-form > div > div.waiting").removeClass("hidden");
		$$("#card-form-edit").hide();
		var pre_ph = 'the ';
	} 
	else if (B.list=='current') {
		$$("#card-form > div > div").hide()
		$$("#card-form > div > div.current").show	();
		$$("#card-form > div > div.edit").show()
		$$("#card-form > div > div.edit").addClass("hidden");
		$$("#card-form > div > div.current").removeClass("hidden");
		$$("#card-form-edit").addClass('fa-edit')
		$$("#card-form-edit").removeClass('fa-times-circle');
		$$("#card-form-edit").show();
		if (!B.cards.current[B.index].payed_date) {
			$$("#card-form > div > div.payfor").removeClass("hidden");
			$$("#card-form > div > div.payfor").show();
		}
		var pre_ph = 'the ';
	}
	
	var locked_base = (card.payed_date && B.cards.mycard.id!=card.id);
	$$(B.container).html(base_tpl.replace(/{{lock}}/g, (locked_base ? 'lock' : 'unlock')).replace(/{{class}}/g, (locked_base ? 'lock' : '')));
	
	// on batit la matrice de cles-valeurs de la carte... 
	for (var i=0; i<B.cards_fields.length; i++) {
		if (B.cards_fields[i].cid >card.id) break;
		if (B.cards_fields[i].cid==card.id) card[B.cards_fields[i].fid] = B.cards_fields[i];
	}
	
	var input_li = input_tpl;
	
	for (var i=0; i<B.fields.length; i++) {
		var f = B.fields[i];
		if (f.format=='pars' && B.list=='mycard') {
			if (f.id==10) {
				$$("#card-parameter input[name='"+f.id+"']").val((card[f.id] ? card[f.id].v : 40));
			} 
			if (f.id==11) {
				$$("#card-parameter input[name='"+f.id+"']").prop("checked",(card[f.id] ? true : false));
			}
			
		} else if (f.format=='img') {
			// Skip all image field...
		} else if (f.base) {
			$$(B.container+" input[name='"+f.id+"']").val((card[f.id] ? card[f.id].v : ''));
		} else if(card[f.id]) {
			var input = input_li.replace(/{{name}}/, f.id).replace(/{{value}}/, card[f.id].v).replace(/{{class}}/, f.format).replace(/{{label}}/, f['en']).replace(/{{placeholder}}/, pre_ph+f['en']);
			var li = li_tpl.replace(/{{data-id}}/g, i).replace(/{{data-i}}/, f.id).replace(/{{label}}/, f['en']);
			li = li.replace(/{{input}}/, input).replace(/{{lock}}/, (card[f.id].own==B.cards.mycard.id ? 'unlock' : 'lock'));
	      $$(B.container).append(li);
		}
	}
	
	if (B.list!='mycard') {
		card_populate();
	}
	
	card_init()
	
}
/////////////////////////////////////////////////////////////////////////////////////////////////

function is_locked() {
	return !$$(this).hasClass('lock');
}

function card_init(card_side) {
	console.log('card_init()');
	
	B.card_offered = false;
	
	if (B.container=="card-form-list") {
		$$(B.container).find(".card-refuse").off("click");
		$$(B.container).find(".card-refuse").on("click", function(){
			card_auth(B.cardid, 'refuse');
		});
		$$(B.container).find(".card-accept").off("click");
		$$(B.container).find(".card-accept").on("click", function(){
			card_auth(B.cardid, 'accept');
		});
	}
	
	if (B.container!="#add_card_list") {
		
		$$(B.container).find(".item-input input").off("click")
		$$(B.container).find(".item-input input").filter(is_locked).on("click", card_input_modal);
	
	} 
	
	$$(B.container).find(".item-input input.catg").off("click")
	$$(B.container).find(".item-input input.catg").filter(is_locked).on("click", function(){
		category_open($$(B.container).find(".item-input input.catg").val(), 'catg');
	});
	
	$$(B.container).find(".item-input input.func").off("click")
	$$(B.container).find(".item-input input.func").filter(is_locked).on("click", function(){
		category_open($$(B.container).find(".item-input input.func").val(), 'func');
	});
	
	if (B.container=="#add_card_list") {
		
		$$(B.container).find(".item-input input.base").off("click");
		$$(B.container).find(".item-input input.base").filter(is_locked).on("click", function(){
			$$("#card_ocr_title").text($$(this).data("label"));
			B.input_text = $$(this).val();
			$$("#card_ocr_input").val(B.input_text);
			B['input_name'] = $$(this).attr("name");
			myApp.pickerModal(".picker-ocr-words");
			if (card_side) add_card_word_detect();
		});
		
		if (card_side=='front') {
			
			if ($$("#card_ocr_words").find(".word").length) {
				var html = '<div class="list-block" style="margin:0px;line-height:35px;"> \
					<input id="card_ocr_input" type="text" name="" value="'+B.input_text+'" placeholder="Pick words or enter text..."/> \
						Words from the card: \
				</div>';
			}
			else {
				var html = '<div class="list-block" style="margin:0px;line-height:35px;"> \
					<input id="card_ocr_input" type="text" name="" value="'+B.input_text+'" placeholder="Enter text..."/> \
				</div>';
			}
			
			
			$$("#card_ocr_words").prepend(html);
			
			
			$$("#card_ocr_input").on("change", add_card_word_detect);
			
			$$("#card_ocr_words").find(".word").off("click");
			$$("#card_ocr_words").find(".word").on("click", function(event) {
				var new_text = '';
				if ($$(this).hasClass("on")) {
					new_text = $$("#card_ocr_input").val().replace($$(this).text(),'').replace('  ',' ').trim();
				} else {
					new_text = $$("#card_ocr_input").val()+" "+$$(this).text();	
				}
				$$("#card_ocr_input").val(new_text.trim())
				$$(this).toggleClass("on");
			});
			/*
			$$("#card_ocr_ok").off("click");
			$$("#card_ocr_ok").on("click", function(){
				console.log(B.input_name+' '+$$("#card_ocr_input").val());
				if (B.input_name==33) $$("#card_ocr_input").val($$("#card_ocr_input").val().replace(/[\s]/g,''));
				$$(B.container+" input[name='"+B.input_name+"']").val($$("#card_ocr_input").val());
			});
			*/
		}
		
	}

}

function card_ocr_ok() {
	console.log(B.input_name+' '+$$("#card_ocr_input").val());
	if (B.input_name==33) $$(B.container+" input[name='"+B.input_name+"']").val($$("#card_ocr_input").val().replace(/\s/g,''));
	else $$(B.container+" input[name='"+B.input_name+"']").val($$("#card_ocr_input").val());
}

function card_input_modal() {
	console.log('card_input_modal()');
	
	B.input_text = $$(this).val();
	B.input_name = $$(this).attr("name");
	B.input_type = $$(this).attr("class").replace('active-state','').trim();
	B.input_labl = $$(this).data('label');
	var aftertext = '<input type="text" value="'+B.input_text+'">';
	var title = 'Enter value for <b>'+B.input_labl+'</b>';
	
	switch (B.input_type) {
		case 'catg' : 
		case 'func' : 
		case 'ctry' : 
			category_open(B.input_text, B.input_type);
			return false;
		case 'date' : 
			aftertext = '<input type="hidden" id="calendar-input"><div id="calendar-inline-container"></div>';
			title = 'Select value for <b>'+B.input_labl+'</b>';
			break;
		case 'img'  : break;
		case 'mail' : break;
		case 'www'  : break;
		case 'zip'  : break;
		case 'tel'  : break;
		case 'tpl'  : break;
		case 'en,fr': 
			aftertext = '<select><option value="en">english</option><option '+(B.input_text=='fr' ? 'selected' : '')+' value="fr">francais</option></select>';
			title = 'Select value for <b>'+B.input_labl+'</b>';
			break;
		case 'm,f'  : 
			aftertext = '<select><option value="m">Male</option><option '+(B.input_text=='f' ? 'selected' : '')+' value="f">Femalle</option></select>';
			title = 'Select value for <b>'+B.input_labl+'</b>';
			break;
	}
	
	clearTimeout(B.timout);
  	var myModal= myApp.modal({
  		title:title,
  		afterText:aftertext,
  		buttons: [
  			{
  				text:'Cancel'
  			},
  			{
  				text:'Ok',
  				onClick: function () {
  					var value = $$(myModal).find('input,select').val();
  					if (value.replace(/\s/g,'')=='') return false;
  					$$(B.container+" input[name='"+B.input_name+"']").val(value);
  				}
  			}
  		]
   },
   function(){
   	// bouton cancel...
   });
   
   if (B.input_type=='date') {
   	var calendarInline = myApp.calendar({
		    container: '#calendar-inline-container',
		    input:'#calendar-input',
		    value: [B.input_text],
		    weekHeader: false
		});
		$$(".modal.modal-in").css({"margin-top":"-150px", "width":"calc(100% - 10px)", "left":"5px", "margin-left":"0"})
   }
 }


function card_record() {
	console.log('card_record()');
	
	myApp.showPreloader('Recording...');
	setTimeout(function () {
   	myApp.hidePreloader();
	}, 8000);

	var pars = {};
	
	if (B.list=="mycard") {
		pars.id = B.cards.mycard.id;
	} 
	else {
		pars.id = B.cardid;
	}
		
	$$.each($$(B.container+" li"+(B.list=="mycard" ? ", #card-parameter li" : '')), function(i,li) {
		var label 	= $$(li).find(".label").text();
		var champ 	= parseInt($$(li).find("input").attr("name").toLowerCase());
		var valeur 	= $$(li).find("input").val().replace('-change-','').trim();
		var oblige 	= ($$(li).find("input").hasClass('base'));
		var phone 	= ($$(li).find("input").hasClass('tel')); 
		
		// Skip incomplete fields name...
		if (!champ) return true;
		
		// For phone-like fields we filter all except number...
		if (phone) valeur = valeur.replace(/[^0-9]/g, '');
		
		// Add to the parameters sent to server...
		pars[champ] = valeur;
		
		// Delete non-mandatory field without value...
		if (valeur=='' && pars.id==B.cards.mycard.id) {
			if (oblige) {
				myApp.alert("Field '"+label+"' is mandatory!<br>Please enter a value.");
				$$(li).find("input").focus();
				pars = false;
				return false;
			} else {
				$$(li).remove();
				return true;
			}
		}
		
		// If card exist, we update B.cards_fields list...
		var add_local = (B.container=='#add_card_list');
		if (pars.id) {
			$$.each(B.cards_fields, function(i,cf){
				if (cf.cid==pars['id'] && cf.fid==champ) {
					B.cards_fields[i].v = valeur;
					add_local = false;
					return false;
				}
			});
			// If we add a new field (we are the owner)...
			if (add_local) {
				B.cards_fields.push({
					"cid": pars.id,
					"fid":champ,
					"own":B.cards.mycard.id,
					"v":valeur
				});
			}
			saveData();
		}
		
	});
	
	if (!pars) return false;
	
	// Validate that email field is present and valid...
	if (pars['33']==undefined || !validateEmail(pars['33'])) {
		myApp.alert("You MUST have a valid value for the 'Email' field!");
		return false;
	}
	
	// Always identify the owner...
	pars['owner'] = B.cards.mycard.id;
	
	// For scan entry we record the original images...
	if (B.container=='#add_card_list' && typeof B.dataUrl !== 'undefined') { 
		pars[44] = B.dataUrl.front;
		pars[45] = B.dataUrl.back;
	}
		
	// Send to server...
	socket.emit('card record', pars);
	
	console.log("Data size:"+JSON.stringify(pars).length);
	
	// For existing card update we refresh the card template...
	if (B.container!='#add_card_list') {
		if (pars.id==B.cards.mycard.id) {
			B.list 	= "mycard";
			B.index 	= false;
			B,cardid = pars.id;
			/*
			if (typeof shake !== 'undefined') {
				shake.stopWatch();
				if (B.options.shake_level) shake.startWatch(onShake, B.options.shake_level);
			}
			*/
		}
		card_populate();
	}
}

function card_recorder(data) {
	console.log('card_recorder(data) >>>');
	console.log(data);
	
	if (data.cards) {
		if (data.cards.accepted) B.cards.current.push(data.cards);
		else B.cards.waiting.push(data.cards);
	}
	
	if (data.cards_fields) {
		for (var i=0; i<data.cards_fields.length; i++) B.cards_fields.push(data.cards_fields[i]);
	}
		
	myApp.alert("New card added to your current list!");
	$$(".badge.current-list-nbr").html(B.cards.current.length);
	$$(".current-list-open").trigger("click");
	
	saveData();
}

function card_field_add() {
	console.log('card_field_add()');
	
	var ii = $$(B.container+" > li").length + 1;
	var i = 0;
	var add_new = true;
	var l = '', n = '', html = ['','','','','',''];
	var families = ['Families','Address fields','Personal infos','Phone numbers','Business infos','Other fields'];
	var li_tpl = '<li>' +
			      '<label class="label-checkbox item-content">' +
			        '<input type="checkbox" name="{{ii}}" value="{{i}}" data-name="{{l}}" class="other" {{checked}}>' +
			        '<div class="item-media">' +
			          '<i class="icon icon-form-checkbox"></i>' +
			        '</div>' +
			        '<div class="item-inner">' +
			          '<div class="item-title">{{l}}</div>' +
			        '</div>' +
			      '</label>' +
			    '</li>';
			    
	$$.each(B.fields, function(k,v) {
		if ($$(B.container).find("input[name='"+v.id+"']").length==0) {
			n = v.en;
			l = n.substr(0,1).toUpperCase() + n.substr(1).toLowerCase();
			html[v.family] += li_tpl.replace(/{{ii}}/,ii).replace(/{{i}}/,v.id).replace(/{{l}}/g,l);
		}
		if (v.id==i) {
			n = v.en;
			l = n.substr(0,1).toUpperCase() + n.substr(1).toLowerCase();
			html[v.family] += li_tpl.replace(/{{ii}}/,ii).replace(/{{i}}/,v.id).replace(/{{l}}/g,l).replace(/{{checked}}/,'checked="checked"');
		}
	});
	
	html[5] += li_tpl.replace(/{{ii}}/,ii).replace(/{{i}}/,"999").replace(/{{l}}/g,"Custom field");
	
	myApp.pickerModal(
    '<div class="picker-modal choseModal" style="height:100%">' +
      '<div class="toolbar">' +
        '<div class="toolbar-inner">' +
          '<div class="left"><a href="#" class="close-picker">Cancel</a></div>' +
          'Choose fields to add' +
          '<div class="right"><a href="#" class="ok-picker">Ok</a></div>' +
        '</div>' +
      '</div>' +
      '<div class="picker-modal-inner" style="overflow:scroll;">' +
			'<div class="list-block accordion-list">' +
			    '<ul>' +
			        '<li class="accordion-item">' +
			            '<a href="" class="item-link item-content">' +
			                '<div class="item-inner">' +
			                    '<div class="item-title">' +
			                    		families[1] +
			                    '</div>' +
			                '</div>' +
			            '</a> ' +
			            '<div class="accordion-item-content">' +
			            	'<ul>' +
			            		html[1] +
			            	'</ul>' +
			            '</div>' +
			        '</li>' +
			        '<li class="accordion-item">' +
			            '<a href="" class="item-link item-content">' +
			                '<div class="item-inner">' +
			                    '<div class="item-title">' +
			                    		families[2] +
			                    '</div>' +
			                '</div>' +
			            '</a> ' +
			            '<div class="accordion-item-content">' +
			            	'<ul>' +
			            		html[2] +
			            	'</ul>' +
			            '</div>' +
			        '</li>' +
			        '<li class="accordion-item">' +
			            '<a href="" class="item-link item-content">' +
			                '<div class="item-inner">' +
			                    '<div class="item-title">' +
			                    		families[3] +
			                    '</div>' +
			                '</div>' +
			            '</a> ' +
			            '<div class="accordion-item-content">' +
			            	'<ul>' +
			            		html[3] +
			            	'</ul>' +
			            '</div>' +
			        '</li>' +
			        '<li class="accordion-item">' +
			            '<a href="" class="item-link item-content">' +
			                '<div class="item-inner">' +
			                    '<div class="item-title">' +
			                    		families[4] +
			                    '</div>' +
			                '</div>' +
			            '</a> ' +
			            '<div class="accordion-item-content">' +
			            	'<ul>' +
			            		html[4] +
			            	'</ul>' +
			            '</div>' +
			        '</li>' +
			        '<li class="accordion-item">' +
			            '<a href="" class="item-link item-content">' +
			                '<div class="item-inner">' +
			                    '<div class="item-title">' +
			                    		families[5] +
			                    '</div>' +
			                '</div>' +
			            '</a> ' +
			            '<div class="accordion-item-content">' +
			            	'<ul>' +
			            		html[5] +
			            	'</ul>' +
			            '</div>' +
			        '</li>' +
			    '</ul>' +
			'</div>' +
      '</div>' +
    '</div>'
  );
  
  $$(".picker-modal .ok-picker").on("click", function(){
  		var n = '', i = '', n0 = '', i0 = '', iii = 0;
  		$$(".picker-modal").find("input[name='"+ii+"']:checked").each(function(){
  			n = $$(this).data("name");
  			i = $$(this).val();
  			if(iii==0) {
	  			n0 = n;
	  			i0 = i;
  			}
		  			
  			if (add_new) {
			 	add_card_li(ii,'-change-',n,i)
		  	}
	  		if (i==999) {
	  			myApp.prompt('What is the field\'s name?', 'Custom Field <i class="fa fa-cube"></i>', function (value) {
	  				if (value.replace(/\s/g,'')=='') return false;
	  				card_custom_field_validate(ii, value);
			   },
			   function(){
			   	$$(B.container+" li").eq($$(B.container+" li").length-1).remove();
			   });
	  		}  else {
				var li = $$(B.container).find("li.ii_"+ii);
				li.find(".label").attr("data-i",i);
				li.find(".label").text(n);
				li.find("input").attr("name",i);
				li.find("input").data("label",n);
			}
			ii++; iii++;
  		});
  		
  		if (B.container=="#card-form-list") {
		
			$$(B.container).find(".item-input input.new").off("click")
			$$(B.container).find(".item-input input.new").filter(is_locked).on("click", card_input_modal);
			$$(B.container).find(".item-input input.new").eq(0).trigger("click");
	  		
  		} else {
  		
			$$(B.container).find(".item-input input.new").off("click");
			$$(B.container).find(".item-input input.new").on("click", function(){
				$$("#card_ocr_title").text($$(this).data("label"));
				B.input_text = $$(this).val();
				$$("#card_ocr_input").val(B.input_text);
				B['input_name'] = $$(this).attr("name");
				myApp.pickerModal(".picker-ocr-words");
				add_card_word_detect();
			});
  		
			$$("#card_ocr_title").text(n0);
			B.input_text = '';
			$$("#card_ocr_input").val(B.input_text);
			B['input_name'] = i0;
	  		myApp.pickerModal(".picker-ocr-words");
	  		add_card_word_detect();
  		
  		}
  		
  		myApp.closeModal(".choseModal");
  });
}

function add_card_li(ii,v,n,i) {
	console.log('add_card_li('+ii+','+v+','+n+','+i+')');
	
	var l = '-change-', p = '';
	
	$$.each(B.fields, function(iii,f) {
		if (i==f.id) {
			n = f["en"];
			l = n.substr(0,1).toUpperCase() + n.substr(1).toLowerCase();
			return false;
		}
	});
	
	if (v=="-change-") {
		p = v; v = '';
	}
	
	var input = input_tpl.replace(/{{name}}/, i).replace(/{{value}}/, v).replace(/{{class}}/, 'new').replace(/{{label}}/, l).replace(/{{placeholder}}/, p).replace(/{{readonly}}/, 'false');
	var li = li_tpl.replace(/{{data-i}}/, i).replace(/{{data-id}}/g, ii).replace(/{{label}}/, l).replace(/{{lock}}/, 'unlock').replace(/{{input}}/, input);
	          
	$$(B.container).append(li);
	
	if (B.container=="#card-form-list") {
		
		$$(B.container).find(".item-input input.new").off("click")
		$$(B.container).find(".item-input input.new").filter(is_locked).on("click", card_input_modal);
		$$(B.container).find(".item-input input.new").eq(0).trigger("click");
	
	} else {
	
		$$(B.container).find(".item-input input.new").on("click", function(){
			if ($$(this).val()) return false;
			B['input_name'] = $$(this).attr("name");
			myApp.pickerModal(".picker-ocr-words");
		});
		
	}
}

function add_card_li_match(ii,v) {
	console.log('add_card_li_match('+ii+', '+v+')');
	
	if (typeof v === "undefined") return false;
	if (v.toString().replace(/^[^\d\w]$/,'')=='') return false;
	
	if (B.options.ocr_match) {
		
		var Name = /^[a-zéè\-]{2,}\s[a-zéè\-]{2,}$/i;
		var Company = /\s(lt[eéè]e)|\s(inc)|\s(enr)/i;
		var Email = /\w+@\w+/;
		var Website = /(www.)|(.com)|(.ca)/i;
		var Fax = /(fax)|(telec)|(téléc)/i;
		var Cel = /(cel)/i;
		var Tel = /(.+\d{3}.{1,2}\d{3}.?\d{4})/i;
		var Add = /^(\d{1,2}[,\d]\d+[\s,].+)/i;
		var li = '';
		
		var i = '', cls = '';
		if (v.match(Company)) {
			if (!$$(B.container).find("input[name='29']").val()) {
				$$(B.container+" input[name='29']").val(v);
				cls = 'off';
			}
		}
		else if (v.match(Name)) {
			if (!$$(B.container).find("input[name='35']").val()) {
				var names = v.split(' ');
				$$(B.container+" input[name='35']").val(names[0]);
				$$(B.container+" input[name='38']").val(names[1]);
				cls = 'off';
			}
		}
		else if (v.match(Email)) {
			if (!$$(B.container).find("input[name='33']").val()) {
				$$(B.container+" input[name='33']").val(v);
				cls = 'off';
			}
		}
		else if (v.match(Cel)) {
			if (!$$(B.container).find("input[name='26']").val()) {
				var telno = v;//.replace(/[^\d]/g,'');
				$$(B.container+" input[name='26']").val(telno);
				cls = 'off';
			}
		}
		else if (v.match(Website)) {
			if ($$(B.container).find("input[name='41']").length==0) i = 41;
			cls = 'off';
		}
		else if (v.match(Fax)) {
			if ($$(B.container).find("input[name='34']").length==0) i = 34;
			cls = 'off';
		}
		else if (v.match(Tel)) {
			if ($$(B.container).find("input[name='24']").length==0) i = 24;
			cls = 'off';
		}
		else if (v.match(Add)) {
			if ($$(B.container).find("input[name='22']").length==0) i = 22;
			cls = 'off';
		}
		
	}
	
	v = v.replace(/(\()/g,' (').replace(/(\s\s)/g,' ');
	var ocr_words = v.trim().split(' ');
	for (var i=0; i<ocr_words.length; i++) {
		cls = '';
		ocr_words[i] = '<span class="word '+cls+'">'+ocr_words[i].trim()+'</span>';
	}
	$$("#card_ocr_words").append(ocr_words.join(''));
	
}

function add_card_word_detect() {
	console.log('add_card_word_detect()');
	
	var words_in_container = [];
	var words_in_input_text = B.input_text.split(" ");
	var card_ocr_picked_words = [];
	$$(B.container).find(".item-input input").each(function(){
		var txt = $$(this).val();
		var words = txt.split(" ");
		$$.each(words, function(i, word){
			words_in_container.push(word);
		});
		
	});
	
	$$("#card_ocr_words").find(".word").each(function(){
		var rem = false;
		$$(this).removeClass("on");
		$$(this).removeClass("off");
		if (words_in_input_text.indexOf($$(this).text()) > -1) {
			rem = "on";
		}
		else if (words_in_container.indexOf($$(this).text()) > -1) {
			rem = "off";
		}
		if (rem) {
			card_ocr_picked_words.push($$(this).addClass(rem))
			$$(this).remove();
		}
	});
	$$("#card_ocr_words").find("div").each(function(){
		//if ($$(this).html()=='') $$(this).remove();
	});
	$$("#card_ocr_words").append('<div class="picked_words"></div>');
	$$.each(card_ocr_picked_words, function(i,word){ $$("#card_ocr_words > div.picked_words").append(word); });
	
};

function card_custom_field_validate(ii, v) {
	console.log('card_custom_field_validate('+ii+', '+v+')');
	
	if (v=="") return false;
	var pars = {"owner":B.cards.mycard.id,"ii":ii,"field":v}
	socket.emit('custom field', pars);
}

function card_email(e) {
	
	if ($$(e).parents(".draggable").attr("id")=='mycard') return false;
	
	var email = e.textContent.substr(3);
	$$("#card-email").find("input, textarea").val('');
	$$("#card-email").find(".to").val(email)
	mainView.router.load({pageName: 'card-email'});
}

function card_email_send(help) {
	var container = help || "card-email";
	var pars = {
		"from": B.cards.mycard.id,
		"firstname": B.cards.mycard.firstname,
		"lastname": B.cards.mycard.lastname,
		"to": $$("#"+container).find("input.to").val(),
		"sujet": $$("#"+container).find("input.subject").val(),
		"msg": $$("#"+container).find("textarea").val()
	}; 
	var Email = /\w+@\w+/;
	if (pars.to.match(Email)) {
		socket.emit('card share email',pars);
		mainView.router.back();
	} else {
		myApp.alert("The email address is not valid.")
	}
	$$("#"+container).find("textarea").val('');
}

function card_messages(e) {
	
	console.log("card_cell(e)");
	
	if ($$(e).parents(".draggable").attr("id")=='mycard') return false;
	
	var conversationStarted = false;
	var myMessages = myApp.messages('.messages', {
	  autoLayout:true
	});
	var myMessagebar = myApp.messagebar('.messagebar');
	mainView.router.load({pageName: 'card-messages'});
	
	$$('.messagebar .link').on('click', function () {
	  // Message text
	  var messageText = myMessagebar.value().trim();
	  // Exit if empty message
	  if (messageText.length === 0) return;
	 
	  // Empty messagebar
	  myMessagebar.clear()
	 
	  // Random message type
	  var messageType ='sent';// (['sent', 'received'])[Math.round(Math.random())];
	 
	  // Avatar and name for received message
	  var avatar, name;
	  if(messageType === 'received') {
	    avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
	    name = 'Kate';
	  }
	  // Add message
	  myMessages.addMessage({
	    // Message text
	    text: messageText,
	    // Random message type
	    type: messageType,
	    // Avatar and name:
	    avatar: avatar,
	    name: name,
	    // Day
	    day: !conversationStarted ? 'Today' : false,
	    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
	  })
	 
	  // Update conversation flag
	  conversationStarted = true;
	});

}

function card_cell(e) {
	console.log("card_cell(e)");
	
	if ($$(e).parents(".draggable").attr("id")=='mycard') return false;
	
	var cell = e.textContent.substr(3).replace(/[^\d]/g,'');
	
	if (typeof cordova.plugins.phonedialer == 'undefined') return false;
	cordova.plugins.phonedialer.dial(
	  cell, 
	  function(err) {
	    if (err == "empty") myApp.alert("Unknown phone number");
	    else myApp.alert("Dialer Error:" + err);    
	  },
	  function(success) {  }
	);
}

function card_auth(id, action) {
	if (typeof id === 'undefined') id = B.cardid;
	
	console.log('card_auth('+id+', '+action+')');
		
	socket.emit('card '+action, {"cardid":B.cards.mycard.id, "authid":id});
}

function card_del(id) {		
	console.log('card_del('+id+')');
	
	socket.emit('card delete', {"cardid":B.cards.mycard.id, "authid":id});
}



function card_initial_setup() {
	
	mainView.router.load({pageName: 'initial-setup'});
	B.swiper = $$('.swiper-container-setup')[0].swiper;
	B.swiper.slideTo(0);
	
	// Initializing the fields for different actions...
	$$("#setup-1").find("input").on("keyup", function(){
		var fullname = $$("#setup-1").find("input[name='35']").val() + $$("#setup-1").find("input[name='38']").val();
		if (fullname.length>4) {
			$$("#setup-1").find(".card-info-button").removeClass("hidden");
		} else {
			$$("#setup-1").find(".card-info-button").addClass("hidden");
		}
	});
	$$("#setup-2").find("input").on("keyup", function(){
		var cell = $$("#setup-2").find("input[name='26']").val().replace(/[^0-9]/g,'') 
		if (cell.match(/(^\d{10,12}$)/)) {
			$$("#setup-2").find(".reveal").removeClass("hidden");
		} 
		else {
			$$("#setup-2").find(".reveal").addClass("hidden");
		}
	});
	$$("#setup-3").find("input.catg").on("click, focus", function() {
		B.container = '#setup-3';
		category_open($$(B.container).find("input.catg").val(), 'catg');
	});
	$$("#setup-3").find("input.func").on("click, focus", function() {
		B.container = '#setup-3';
		category_open($$(B.container).find("input.func").val(), 'func');
	});
	$$("#setup-3").find(".card-info-button").on("click", function() {
		var pars = {
			id:B.cards.mycard.id,
			owner:B.cards.mycard.id,
			33:B.cards.mycard.email
		};
		$$("#setup_page").find("input").each(function(i,f){
			pars[$$(this).attr("name")] = $$(this).val();
			//B.cards_fields.push({cid:pars.id, fid:$$(this).attr("name"), own:pars.id, v:$$(this).val()});
		});
		socket.emit('card record', pars);
			
		card_populate('mycard','')
		
		mainView.router.load({pageName: 'index'});
	});
}


function card_points_img(card) {
	var $data = {};
	if (card.points>=1000000) {
		$data['points_img'] = 'Diamond';
		$data['points_target'] = points;
		$data['points_color'] = "#caf1f7";
	} else if(card.points>=500000) {
		$data['points_img'] = 'Gold';
		$data['points_target'] = 1000000;
		$data['points_color'] = "#ffeb56";
	} else if(card.points>=100000) {
		$data['points_img'] = 'Silver';
		$data['points_target'] = 500000;
		$data['points_color'] = "#ccd1f9";
	} else if(card.payed_date>0) {
		$data['points_img'] = 'Bronze';
		$data['points_target'] = 100000;
		$data['points_color'] = "Bronze";
	} else {
		$data['points_img'] = 'Bronze';
		$data['points_target'] = 100000;
		$data['points_color'] = "Bronze";
	}
	return $data;
} 

function card_about() {
	console.log('card_about()');
	myApp.alert(B.about);
}

function card_share(list, by) {
	
	$$(".speed-dial").removeClass("speed-dial-opened");
	
	var id = (list=='mycard' ? B.cards.mycard.id : B.cardid);
	
	console.log("card_share("+list+", "+by+", "+id+")");

	var title = '';
	var aftertext = '<input type="text" value="">';
	
	switch(by) {
		case 'email':title='Email sharing';aftertext = 'Enter the email address:'+aftertext; break;
		case 'texto': title='SMS sharing'; aftertext = 'Enter the cellphone number:'+aftertext; break;
		case 'qrcode': socket.emit('card qr', {"cardid":id}); return false; break;
		case 'direct': 
			title='Direct sharing'; 
			var recipients = '<select><option value="">-- choose --</option>';
			$$.each(B.cards.current, function(i,card) {
				if (!card.payed_date) return true;
				var cid = card.id;
				var rec = {"35":'', "38":''};
				$$.each(B.cards_fields, function (ii,cf) {
					if(cf.cid>cid) return false;
					if(cf.cid==cid && (cf.fid=='35' || cf.fid=='38')) { rec[cf.fid.toString()]=cf.v; }
				});
				recipients += '<option value="'+card.id+'">'+rec['35']+' '+rec['38']+'</option>';
			});
			recipients += '</option>'
			aftertext = 'Choose the recipient and write a short message:'+recipients+aftertext; 
			break;
		default: return false;
	}
	
	clearTimeout(B.timout);
  	var myModal= myApp.modal({
  		title:title,
  		afterText:aftertext,
  		buttons: [
  			{
  				text:'Cancel'
  			},
  			{
  				text:'Send',
  				onClick: function () {
  					var value = $$(myModal).find('input').val().trim();
  					switch(by) {
  						case 'email':
  							var email = value;
  							var Email = /\w+@\w+/;
  							if (value.match(Email)) {
  								var pars =  {
  									"from":B.cards.mycard.id,
  									"cardid":id,
  									"email":email, 
  									"firstname": B.cards.mycard.firstname, 
  									"lastname": B.cards.mycard.lastname
  								}
								console.log(pars)
  								socket.emit('card share email',pars);
  							} else {
  								myApp.alert("The address is not valid. Send aborted");
  							}
  							break;
  						case 'texto':
  							var cell = value.replace(/[^0-9]/g,'');
  							var Tel = /(^\d{10,12}$)/;
  							if (value.match(Tel)) {
  								socket.emit('card share sms', {"from":B.cards.mycard.id,"cardid":id,"cell":cell});
  							} else {
  								myApp.alert("The number is not valid. Send aborted");
  							}
  							break;
  						case 'direct':
  							var dest = $$(myModal).find('select').val();
  							if (dest) {
  								socket.emit('card share direct', {"from":B.cards.mycard.id,"cardid":id,"dest":dest,"mesg":value});
  							} else {
  								myApp.alert("No recipient chosen. Send aborted");
  							}
  							break;
  					};
  				}
  			}
  		]
   },
   function(){
   	// bouton cancel...
   });
   
}

function card_sms_validate() {
	console.log('card_sms_validate()');
	
	var cell = $$("#setup-2").find("input[name='26']").val().replace(/[^0-9]/g,'');
	var Tel = /(^\d{10,12}$)/;
	if (cell.match(Tel)) {
		var data = {"cell":cell,"email":B.cards.mycard.email};
		socket.emit('send validate sms', data);
		
		clearTimeout(B.timout);
		myApp.modal({
			title: 'Cellphone validation', 
			text: '<div id="validation_modal_text"><b><span id="sms_test_msg">Please enter de validation-code from the SMS</span></b> \
						<div class="row"> \
						  <div class="col-50"> \
						    <input type="number" id="sms_test_code" value="" placeholder="999999" style="padding:3px;"/> \
						  </div> \
						  <div class="col-50" onClick="card_sms_test_code();"> \
						    <a href="#" class="button color-blue" style="margin:10px 0;">Submit</a> \
						  </div> \
						</div>', 
			buttons: [
				{ text: "Close" }
			]
		});
	
	} else {
		myApp.alert("This entry doesn't match a cellphone number.\nPlease correct and retry.");
	}
	
}

function card_sms_test_code() {
	console.log('card_sms_test_code()');
	
	var sms_test_code = $$("#sms_test_code").val();
	var Sms = /(^\d{6}$)/;
	
	if (sms_test_code.match(Sms)) {
		var cell = $$("#setup-2").find("input[name='26']").val().replace(/[^0-9]/g,'');
		var data = {"cell":cell,"email":B.cards.mycard.email,"code":sms_test_code};
		socket.emit('send sms test code', data);
	} else {
		$$("#sms_test_msg").text("The code should have 6 digit.<br>Please correct and retry.");
	}
}

function card_reload() {
	console.log('card_reload()');
	if ($connected) {
		myApp.alert('Synchronizing your data...<br>Please wait.');
		socket.emit('card load2', B.cards.mycard.id);
	}
	else {
		myApp.alert('Unable to reach the server.<br>Your device seem to be offline.');
	}
}

// section ranking...

function pie_slice_size(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}

function pie_slice_add(sliceSize, pieElement, offset, sliceID, color) {
  $$(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + sliceSize;
  $$("."+sliceID).css({
    "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
  });
  $$("."+sliceID+" span").css({
    "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
    "background-color": color
  });
}

function pie_slice_each(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var sliceID = "s"+dataCount+"-"+sliceCount;
  var maxSize = 179;
  if(sliceSize<=maxSize) {
    pie_slice_add(sliceSize, pieElement, offset, sliceID, color);
  } else {
    pie_slice_add(maxSize, pieElement, offset, sliceID, color);
    pie_slice_each(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
  }
}

function pie_create(dataElement, pieElement) {
  var listData = [];
  $$(dataElement+" span.point").each(function() {
    listData.push(Number($$(this).html().replace(' points','').replace(',','')));
  });
  var listTotal = 0;
  for(var i=0; i<listData.length; i++) {
    listTotal += listData[i];
  }
  var offset = 0;
  var color = [
    "#888888",
    '#EEEEEE'
  ];
  for(var i=0; i<listData.length; i++) {
    var size = pie_slice_size(listData[i], listTotal);
    pie_slice_each(size, pieElement, offset, i, 0, color[i]);
    $$(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color[i]);
    offset += size;
  }
}

function croper_format(f) {
	if (f=='card') {
		if (B.croper.options.viewport.width > 100) return false;
		var options =
		{
			url: B.croper.data.url,
			viewport: B.crop_opts.card,
			enableOrientation: true,
			boundary: B.crop_opts.boundary
	   }
		B.croper.destroy();
	   B.croper = new Croppie(document.getElementById('crop-box'), options);
	} else {
		if (B.croper.options.viewport.width == 100) return false;
		var options =
		{
			url: B.croper.data.url,
			viewport: {width:100, height:100, type: 'square'},
			enableOrientation: true,
			boundary: B.crop_opts.boundary
	   }
		B.croper.destroy();
	   B.croper = new Croppie(document.getElementById('crop-box'), options);
	}
}

function croper_record() {
	console.log("croper_record()");
	
	var opts = { "type":"base64", "size":"viewport", "format":"png", "quality":1, "circle":false };
	B.croper.result(opts).then(function(dataUrl){
		var updated = false;
		var cid = B.cardid;
		var own = B.cards.mycard.id;
		var fid = parseInt($$('#img_output').val()) || parseInt($$('#img_input').val());
		
		if (!fid) {
			myApp.alert("You need to select an input or output image type before saving it!");
			return false;
		}
		
		for(var i=0; i<B.cards_fields.length; i++) {
			if (cid==B.cards_fields[i].cid && fid==B.cards_fields[i].fid) { 
				B.cards_fields[i].v = dataUrl;
				update = true;
				break;
			}
		}
		
		if (!updated) {
			B.cards_fields[B.cards_fields.length] = {
				v:dataUrl,
				cid:cid,
				fid:fid,
				own:own
			};
		}
		
		// et on enregistre le changement sur disque localement...
		saveData();
		
		if (cid==own) {
			$$("#mycard").find("div.img").css({"background-image":"url("+dataUrl+")"});
			
		} else {
			if (fid==50) $$("#thecard").find("div.img").css({"background-image":"url("+dataUrl+")"});
			
			if (fid==52) {
				 $$("#card-form").find("div.card-info-pastille").css({"background-image":"url("+dataUrl+")"});
				 $$("#card-form").find("div.card-info-pastille").text('');
			}
		}
		
		var pars = { 
			"id":cid,
			"owner":own
		};
		pars[fid] = dataUrl;
		socket.emit('card record', pars);
	}); 
}

// section utilities...

function online(event) {
  $online = (event.type=='online');
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function geoPermission() {
	if (typeof locationPermission!=="undefined") {
		locationPermission.getStatus(function(status) {
		    switch(status) {
		        case locationPermission.GRANTED: console.log('Granted !'); break;
		        case locationPermission.DENIED: 
		        	clearTimeout(B.timout);
		        	myApp.modal({
				   	title: 'GeoLocation is not permitted on your device', 
				   	text: 'You have to activate GeoLocation in your app parameters for Bizswiper card exchange to work.', 
				   	buttons: [
							{ text: "Ok", onClick: function () {
								
							} }
						]
					});
		    }
		});
	}
	if (typeof navigator.permissions!=="undefined") {		
	  navigator.permissions.query({name:'geolocation'}).then(function(result) {
	    if (result.state !== 'granted') {
	      clearTimeout(B.timout);
	      myApp.modal({
		   	title: 'GeoLocation is not permitted on your device', 
		   	text: 'You have to activate GeoLocation in your app parameters for Bizswiper card exchange to work.', 
		   	buttons: [
					{ text: "Ok", onClick: function () {} }
				]
	  		});
	    }
	  });
	}
}

function geoLocation(func) {
		
	if (!navigator.geolocation){
		clearTimeout(B.timout);
		myApp.modal({
	   	title: 'GeoLocation is not permitted on your device', 
	   	text: 'You have to activate GeoLocation in your app parameters for B.&iuml;.Z card exchange to work.1', 
	   	buttons: [
				{ text: "Ok", onClick: function () {} }
			]
  		});
		return false;
	}

	function onSuccess(o) {
		func(o.coords);
	};

	function onError(err) {
		myApp.hidePreloader();
		clearTimeout(B.timout);
		myApp.modal({
	   	title: 'GeoLocation is not permitted on your device', 
	   	text: err.PositionError.code+' You have to activate GeoLocation in your app parameters for B.&iuml;.Z card exchange to work.', 
	   	buttons: [
				{ text: "Ok", onClick: function () {} }
			]
  		});
	}
	
	var options = {
	  enableHighAccuracy: true,
	  maximumAge: 0
	};
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	//success({lat:45.6105491,lng:-73.5094794,alt:0}); // manual override for testing...
}
	
function saveData() {
	
	if (typeof LocalFileSystem === "undefined") {
		myApp.alert("Unable to open your file system!");
		return false;
	}
	
	window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSys) {
		var fs_ = fileSys;
		var cwd_ = fs_.root;
		cwd_.getDirectory("datadir", {create:true, exclusive: false}, function(dirEntry) {
			cwd_ = dirEntry;
			
			cwd_.getFile("datafile.txt", { create: true, exclusive: false }, function (fileEntry) {
				
				 fileEntry.createWriter(function (fileWriter) {
			 
			        fileWriter.onerror = function (e) {
			            console.log("Failed file write: " + e.toString());
			        };
			        
			        fileWriter.write(JSON.stringify(B));
			    });
				
		   }, onFail);
		}, onFail1);
	}, onFail2);
		
}

function readData(onSuccess) {
	
	if (typeof LocalFileSystem === "undefined") {
		myApp.alert("Unable to open your file system!");
		return false;
	}
	
	window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSys) {
		var fs_ = fileSys;
		var cwd_ = fs_.root;
		cwd_.getDirectory("datadir", {create:true, exclusive: false}, function(dirEntry) {
			cwd_ = dirEntry;
			
			cwd_.getFile("datafile.txt", { create: true, exclusive: false }, function (fileEntry) {
				
				 fileEntry.file(function (file) {
			        var reader = new FileReader();
			        
			        reader.onloadend = function() {
			            console.log("Successful file read");
			            if (this.result) B = JSON.parse(this.result);
			            onSuccess();
			        };
			 
			        reader.readAsText(file);
			    });
				
		   }, onFail);
		}, onFail1);
	}, onFail2);

}

$$(document).on("click", ".card-item", function(){
	
	B.list 		= $$(this).parent().attr("id");
	B.index 		= $$(this).index();
	B.cardid 	= B.cards[B.list][B.index].id;
	B.container = '#card-form-list';
	B.card_side = '';
	
	card_form_open();
	
});

$$(document).on("click", ".initial-setup", card_initial_setup);

$$(document).on('form:success', 'form.ajax-submit', function (e) {
	
	myApp.alert("Recorded!");
	
	if ($$("form.ajax-submit input[name='id']").val()!=B.cards.mycard.id) return false;
	
	$$.each($$(this).find("input, select"), function(i,e){
		if (e.name) {
			B.cards.mycard[e.name] = e.value;
			
			saveData();
		}
	})
	
	card_populate("mycard",B.cards.mycard);
	
});

$$(".index-open").on("click", function(){	
	mainView.router.load({pageName: 'index',animatePages: false});
});

$$(".current-list-open").on("click", function(){
	var list = { current:[] };
	for(var i=0; i<B.cards.current.length; i++) {
		list.current[i] = {"id":B.cards.current[i].id};
		$$.each(B.cards_fields, function(ii,cf){
			if(cf.cid==B.cards.current[i].id) {
				switch(cf.fid) {
					case 33: list.current[i]['email']		=cf.v; break;
					case 35: list.current[i]['firstname']	=cf.v; break;
					case 38: list.current[i]['lastname']	=cf.v; break;
					case 29: list.current[i]['company']		=cf.v; break;
					case 26: list.current[i]['cellphone']	=cf.v.replace(/[^0-9]/g, ''); break;
				}
			}
		});	
	}
	
	var html = currentList(list);
	
	mainView.router.loadContent(html);
	
});

$$(".waiting-list-open").on("click", function(){
	var list = { waiting:[] };
	for(var i=0; i<B.cards.waiting.length; i++) {
		list.waiting[i] = {"id":B.cards.waiting[i].id};
		$$.each(B.cards_fields, function(ii,cf){
			if(cf.cid==B.cards.waiting[i].id) {
				switch(cf.fid) {
					case 35: list.waiting[i]['firstname']	=cf.v; break;
					case 38: list.waiting[i]['lastname']	=cf.v; break;
					case 29: list.waiting[i]['company']		=cf.v; break;
				}
			}
		});	
	}
	
	var html = waitingList(list);
	
	mainView.router.loadContent(html);
	
});


$$('.a-swipeout.delete').on('click', function () {
	console.log($$(this).data("id"))
});

$$('.a-swipeout').on('click', function () {
	console.log($$(this).data("id"))
	return false;
});

$$(".card-add-user").on("click", function(){
	console.log('card-add-user');
	
	mainView.router.load({pageName: 'card-add-user'});
	$$(".card-fields, .button-photo").addClass("hidden");
	$$("#capturePhoto, #listPhoto").parent().removeClass("hidden");
	$$('#card-photo-front, #card-photo-back').attr("src","")
	$$(".button.card-side.back").trigger("click");
	$$(".button.card-side.front").trigger("click");
	
	/*
	$$(".card-back-camera-open").show();
	$$("#card-entry").find("img").attr("src","");
	B.card_side = 'front';
	$$("#add_card_list").html('');
	$$("#card_ocr_words").html('');
	camera_open(false);
	*/
});

$$(".card-back-camera-open").on("click", function(){
	B.card_side = 'back';
	camera_open(false);
});

$$(".card-other-camera-open").on("click", function(){
	B.card_side = 'other';
	galleryPhoto();
});

$$('.popup-crop').on('popup:open', function () {
	console.log('Crop Popup open');
	
	//var container_width = $$("#crop-box").width();	// 2"x3.5" ou 600px x 1050px
	//B.crop_opts.card = { width: ($$("#crop-box").width() - 10), height: (($$("#crop-box").width() - 10) / 3.5 * 2), type: 'square' }
	
	//B.crop_opts.img = 'img/b.png';
	
	var options =
	{
        url: B.crop_opts.img,
        enableOrientation: true,
        boundary: B.crop_opts.boundary
   }
   
	if ($$('#img_select').val()==44 || $$('#img_select').val()==45) {
		options['viewport'] = B.crop_opts.card;
	} 
	
	$$('#img_input').val(0);
	$$('#img_output').val(0);
	
   B.croper = new Croppie(document.getElementById('crop-box'), options);
   
});

$$('.popup-crop').on('popup:close', function () {
	console.log('Crop Popup close');
	
	B.croper.destroy();
});

$$('#img_input').on("change", function() {
	console.log('Crop input change');
	
	var found = false;
	var cid = B.cardid;
	var fid = parseInt($$(this).val());
	for (var i=0; i<B.cards_fields.length; i++) {
		var f = B.cards_fields[i];
		if (f.cid==cid && f.fid==fid) {
			found = f;
			break;
		}
	}
	if (!found) { 
		myApp.alert("No image for that field yet"); 
	}
	else {
		B.croper.destroy();
		if (found.v.substr(0,4)!='data') found.v = 'data:image/jpeg;base64,'+found.v;
		var options = { url:found.v, enableOrientation:true,
        boundary: B.crop_opts.boundary };
		
		if (fid == 44 || fid == 45) { options['viewport'] = B.crop_opts.card; }
		
		B.croper = new Croppie(document.getElementById('crop-box'), options);
	}
});

$$(".my-card-open").on("click", function(){
	B.container = '#card-form-list';
	B.list = "mycard";
	B.index = false;
	B.cardid = B.cards.mycard.id;
	card_form_open();
});

$$(".my-card-reload").on("click", card_reload);

$$(document).on("click", ".radio_btn", function () {
	$$(this).parent().find(".button").removeClass("active");
	$$(this).addClass("active");
	$$(this).parent().find("input").val($$(this).data("id"))
});

$$(document).on("click", "li.reputation i.fa", function () {
	if ($$(this).hasClass('own')) return false;
	card_form_star($$(this).data("star"));
});

$$(document).on("click", "#card-form-edit", function () {
	$$(this).toggleClass('fa-edit').toggleClass('fa-times-circle');
	$$("#card-form > div > div.current").toggleClass("hidden");
	$$("#card-form > div > div.edit").toggleClass("hidden");
});

$$(".log-off").on("click", function(){
	myApp.formDeleteData('login_form');
	//welcomescreen.open();
	myApp.loginScreen();
});

$$(".card_template").on("click", function() {
	$$(".card_template").removeClass("on");
	//welcomescreen.open();
	myApp.loginScreen(".login-screen.modal-in");
	$$(this).addClass("on");
	$$("#template_text").text($$(this).data("name"));
	$$("#template").val($$(this).attr("id"));
});
