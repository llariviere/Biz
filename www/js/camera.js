/* 
* camera, image and ocr functions...
*/

var scanImg = {};

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
    var srcType = Camera.PictureSourceType.CAMERA;
    var options = camera_options(srcType);
    var func = card_image_process;
 
    navigator.camera.getPicture(function cameraSuccess(imgUri) {
        func(imgUri);
    }, function cameraError(error) {
        myApp.alert("Unable to obtain picture: " + error);
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
          	  max_size = 544,
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
          scanImg.dataUrl = canvas.toDataURL('image/jpeg');
          scanImg.width = width;
          scanImg.height = height;
          var pars = {
	          photo:scanImg.dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
	          cardid: mycard.id
          }
          socket.emit('card ocr', pars);
      }
      image.src = scanImg.dataUrl;
	}); 
}

function card_image2dataUrl(imgUri, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
    	scanImg.dataUrl = reader.result;
      callback();
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', imgUri);
  xhr.responseType = 'blob';
  xhr.send();
}

function card_ocr_process(data) {
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
	var cardImage = $$("#card-entry").find("img");
	
	var image = new Image();
	image.onload = function () {
		context.drawImage(image, x0, y0, x1, y1, 0, 0, x1, y1);
		
		if (x1 < y1) {
			var offset = ((y1-y1)-(x1-x0))/2;
			myApp.alert(x1+' '+y1+' '+offset);
			context.translate(canvas.width/2,canvas.height/2);
			context.rotate(270*Math.PI/180);
			
			/*
			cardImage.css({
				'transform':'rotate(270deg)',
				'transform':'translate('+offset+'px, '+offset+'px)'
			});
			*/
		} 
		
		cardImage.attr("src",canvas.toDataURL('image/jpeg'));
	}
	image.src = scanImg.dataUrl;
	
	// Using text detection result from vision, we add a formatted list of fields...
	var ocrLines = data.description.split("\n");
	for (var i=0; i<ocrLines.length; i++) {
		var ocrLine = ocrLines[i].replace(/^[ ]+|[ ]+$/g,'');
		if (ocrLine.length) add_card_li(i, ocrLine);
	}
	$$("#add_card_list").find(".color-red").on("click", function () {
		$$(this).parents("li").remove();
	});
	$$("#add_card_list").find(".item-title.label").on("click", function () {
		$$(this).html(card_set_field(false,$$(this).data("ii")));
	});
	myApp.hidePreloader();
}

socket.on('card ocr', card_ocr_process);
