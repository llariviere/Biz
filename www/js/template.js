/*
* All the template used by bizswap.js
*/

var base_tpl = '<li class="list-item ii_1">\
      <div class="item-content">\
        <div class="item-inner"> \
          <div class="item-title label" data-i="33" data-id="1">'+lsval('Email')+'<span><i class="fa fa-lock"></i></span></div>\
          <div class="item-input">\
            <input type="email" name="33" value="" placeholder="'+lsval('Email')+'..." class="base lock" data-label="'+lsval('Email')+'" readonly="true" />\
          </div>\
        </div>\
      </div>\
    <li class="list-item ii_2">\
      <div class="item-content">\
        <div class="item-inner"> \
          <div class="item-title label" data-i="35" data-id="2">'+lsval('Firstname')+'<span><i class="fa fa-{{lock}}"></i></span></div>\
          <div class="item-input">\
            <input type="text" name="35" value="" placeholder="'+lsval('Firstname')+'..." class="base {{class}}" data-label="'+lsval('Firstname')+'" readonly="true" />\
          </div>\
        </div>\
      </div>\
    </li>\
    <li class="list-item ii_3">\
      <div class="item-content">\
        <div class="item-inner"> \
          <div class="item-title label" data-i="38" data-id="3">'+lsval('Lastname')+'<span><i class="fa fa-{{lock}}"></i></span></div>\
          <div class="item-input">\
            <input type="text" name="38" value="" placeholder="'+lsval('Lastname')+'..." class="base {{class}}" data-label="'+lsval('Lastname')+'" readonly="true" />\
          </div>\
        </div>\
      </div>\
    </li>\
    <li class="list-item ii_4">\
      <div class="item-content">\
        <div class="item-inner"> \
          <div class="item-title label" data-i="26" data-id="4">'+lsval('Cellphone')+'<span><i class="fa fa-{{lock}}"></i></span></div>\
          <div class="item-input">\
            <input type="tel" name="26" value="" placeholder="'+lsval('Cellphone')+'..." class="base {{class}}" data-label="'+lsval('Cellphone')+'" readonly="true" />\
          </div>\
        </div>\
      </div>\
    </li>\
    <li class="list-item ii_5">\
      <div class="item-content">\
        <div class="item-inner"> \
          <div class="item-title label" data-i="29" data-id="5">'+lsval('Company')+'<span><i class="fa fa-{{lock}}"></i></span></div>\
          <div class="item-input">\
            <input type="text" name="29" value="" placeholder="'+lsval('Company')+'..." class="base {{class}}" data-label="'+lsval('Company')+'" readonly="true" />\
          </div>\
        </div>\
      </div>\
    </li>\
    <li class="list-item ii_6">\
      <div class="item-content">\
        <div class="item-inner"> \
          <div class="item-title label" data-i="40" data-id="6">'+lsval('Job title')+'<span><i class="fa fa-{{lock}}"></i></span></div>\
          <div class="item-input">\
            <input type="text" name="40" value="" placeholder="'+lsval('Job title')+'..." class="base {{class}}" data-label="'+lsval('Job title')+'" readonly="true" />\
          </div>\
        </div>\
      </div>\
    </li>';

var cards_templates = [
	'<div style="top:4px;left:0px;font-weight:bold;font-size:16px;">{{complete name}}{{firstname}} {{lastname}}</div>\
	<div style="top:28px;left:0px;">{{title}}</div>\
	<div style="top:46px;left:0px;" onClick="card_email(this)">{{email}}</div>\
	<div style="top:75px;left:120px;">{{address}}</div>\
	<div style="top:90px;left:120px;">{{city}} {{state_prov}} {{country}} {{postal code}}</div>\
	<div style="top:105px;left:120px;">{{website}}</div>\
	<div style="top:120px;left:120px;">{{company name}}{{company}}</div>\
	<div style="top:135px;left:120px;" onClick="card_cell(this)">{{cellphone}}</div>\
	<div style="top:150px;left:120px;">{{fax}}</div>\
	<div class="img" style="top:75px;left:0px;background-image:url({{logo}}), url(img/fa-user.png);" onClick="card_messages(this)"></div>',
	
	'<div style="top:4px;left:120px;font-weight:bold;font-size:16px;">{{complete name}}{{firstname}} {{lastname}}</div>\
	<div style="top:28px;left:120px;">{{title}}</div>\
	<div style="top:46px;left:120px;" onClick="card_email(this)">{{email}}</div>\
	<div style="top:75px;left:120px;">{{address}}</div>\
	<div style="top:90px;left:120px;">{{city}} {{state_prov}} {{country}} {{postal code}}</div>\
	<div style="top:105px;left:120px;">{{company name}}{{company}}</div>\
	<div style="top:120px;left:120px;" onClick="card_cell(this)">{{cellphone}}</div>\
	<div style="top:135px;left:120px;">{{fax}}</div>\
	<div style="top:150px;left:120px;">{{website}}</div>\
	<div class="img" style="top:0px;left:0px;background-image:url({{logo}}), url(img/fa-user.png);" onClick="card_messages(this)"></div>',
	
	'<div style="top:84px;width:50%;text-align:right;font-weight:bold;font-size:16px;">{{complete name}}{{firstname}} {{lastname}} |</div>\
	<div style="top:88px;left:50%;width:50%;text-align:left;">&nbsp;{{title}}</div>\
	<div style="top:104px;width:100%;text-align:center;" onClick="card_email(this)">{{email}}</div>\
	<div style="top:120px;width:100%;text-align:center;">{{address}} {{city}}</div>\
	<div style="top:136px;width:100%;text-align:center;">{{state_prov}} {{country}} {{postal code}}</div>\
	<div style="top:152px;width:50%;text-align:right;">{{company name}}{{company}}&nbsp;|</div>\
	<div style="top:152px;left:50%;width:50%;text-align:left;">&nbsp;{{website}}</div>\
	<div style="top:168px;width:50%;text-align:right;" onClick="card_cell(this)">{{cellphone}}&nbsp;|</div>\
	<div style="top:168px;left:50%;width:50%;text-align:left;">&nbsp;{{fax}}</div>\
	<div class="img" style="top:0px;width:75px;height:75px;left:50%;margin-left:-38px;background-image:url({{logo}}), url(img/fa-user.png);" onClick="card_messages(this)"></div>',
];

var input_tpl = '<input type="text" name="{{name}}" value="{{value}}" class="{{class}}" data-label="{{label}}" placeholder="{{placeholder}}" readonly="{{readonly}}" />';

var li_tpl = '<li class="list-item {{data-id}}"> \
		<div class="item-content"> \
			<div class="item-inner"> \
				<div class="item-title label" data-i="{{data-i}}" data-id="{{data-id}}">{{label}}<span><i class="fa fa-{{lock}}"></i></span></div> \
				<div class="item-input"> \
					{{input}} \
				</div> \
			</div> \
		</div> \
	</li>';
