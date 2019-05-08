/* 
* camera, image and ocr functions...
*/

var scanImg = { 'recto':{}, 'verso':{} };

function camera_options(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function camera_open(selection) {
	console.log('camera_open()');
	
	if (typeof Camera === "undefined") {
		card_ocr_process({vertices:[{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}],description:''});$$("#card-entry img."+B.card_side).attr("src","img/bcard.jpg");return false;
		if (B.card_side=='other') { 	 	
			B.croper.destroy();
			var options = { 
				url:"img/bcard.jpg", 
				enableOrientation:true,
     			boundary: B.crop_opts.boundary 
     		};
			B.croper = new Croppie(document.getElementById('crop-box'), options);
			return false;
		} else {
			myApp.alert('Camera not availlable');
			card_ocr_process((B.card_side == 'verso' ? card_back_data : card_data));
			$$("#card-entry img."+B.card_side).attr("src","img/bcard.jpg");
			return false;
		}
	}
    var srcType = Camera.PictureSourceType.CAMERA;
    var options = camera_options(srcType);
    var func = card_image_process;
 
    navigator.camera.getPicture(function cameraSuccess(imgUri) {
          
       if (B.card_side=='other') {       	 	
				B.croper.destroy();
				var options = { 
					url:imgUri, 
					enableOrientation:true,
        			boundary: B.crop_opts.boundary 
        		};
				B.croper = new Croppie(document.getElementById('crop-box'), options);
       	 	return false;
       } else {
       	func(imgUri);
       }
       
    }, function cameraError(error) {
        myApp.alert("Photo capture cancelled"); //  + error
        card_ocr_process({vertices:[{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}],description:''});
        $$("#card-entry img."+B.card_side).attr("src","img/badge_none.png");
    }, options);
}

function card_image_process(imgUri) {
	
	myApp.showPreloader('Loading...');
	setTimeout(function () {
   	myApp.hidePreloader();
	}, 8000);
	card_image2dataUrl(imgUri, function(){
      var image = new Image();
      image.onload = function (imageEvent) {
          var canvas = document.createElement('canvas'),
          	  max_size = 1024,
              width = image.width,
              height = image.height;
          if (width > height) {
              if (width > max_size) {
                  height *= max_size / width;
                  width = max_size;
              }
          } 
          else {
              if (height > max_size) {
                  width *= max_size / height;
                  height = max_size;
              }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          scanImg[B.card_side]['dataUrl'] = canvas.toDataURL('image/jpeg');
          scanImg[B.card_side]['width'] = width;
          scanImg[B.card_side]['height'] = height;
          var pars = {
	          photo: scanImg[B.card_side].dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
	          cardid: mycard.id
          }
          socket.emit('card ocr', pars);
      }
      image.src = scanImg[B.card_side].dataUrl;
	}); 
}

function card_image2dataUrl(imgUri, callback) {
  console.log('card_image2dataUrl()')
	
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
    	scanImg[B.card_side].dataUrl = reader.result;
      callback();
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', imgUri);
  xhr.responseType = 'blob';
  xhr.send();
}

function card_ocr_process(data) {
	console.log('card_ocr_process()');
	
	// Using cropping hints from vision, we crop, rotate and show the scanned card image...
	var points = data.vertices;
	var x0 = points[0].x - 10;
	var y0 = points[0].y - 10;
	var x1 = points[2].x - x0 + 20;
	var y1 = points[2].y - y0 + 20;
	
	var canvas = document.createElement('canvas');
	canvas.width = x1;
	canvas.height = y1;
	var context = canvas.getContext('2d');
	var cardImage = $$("#card-entry").find("img."+B.card_side);
	cardImage.attr("src",scanImg[B.card_side].dataUrl);
	
	// Using text detection result from vision, we add a formatted list of fields...
	var ocrLines = data.description.split("\n");
	
	B.container="#add_card_list";
	B.list = "current";
	B.index = false;
	B.cardid = false;
	
	if (B.card_side=='recto') {
		$$(B.container).html(base_tpl.replace(/lock/g,'unlock').replace(/{{unlock}}/g,'unlock').replace(/{{class}}/g, ''));
	}
	else { 
		$$(".card-back-camera-open").hide(); 
	}
	
	for (var ii=0; ii<ocrLines.length; ii++) {
		var ocrLine = ocrLines[ii].replace(/^[ ]+|[ ]+$/g,'');
		if (ocrLine.length) add_card_li_match(ii, ocrLine);
	}
	
	card_init();
	
	myApp.hidePreloader();
}

socket.on('card ocr', card_ocr_process);

// data pour tester en local...
var card_data = {
	vertices:[{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}],
	description:'Louis Larivière \nAnalyste sénior\nCell: (514) 714-2011 \nllariviere@dubo.qc.ca \nwww.dubo.qc.ca\nDubo Électrique Ltée.\nMatériaux électriques et électroniques\n5780, rue Ontario Est \nMontréal (Québec) HIN 0A2 \nTél.:(514)255-7711 \nDirect:(514) 255-8855, poste221 \n1 800 361-4503 \nFax:(514) 255-9949'
};
var card_back_data = {
	vertices:[{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}],
	description:'Verso de la carte\nAutres infos\nPlusieurs mots de plus'
};
