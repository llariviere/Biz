var cLANGUAGE = "fr";

var languageSpecificObject = null;
var languageSpecificURL = "";
var spanishLanguageSpecificURL = "i18n/es.json";
var frenchLanguageSpecificURL  = "i18n/fr.json";
var englishLanguageSpecificURL = "i18n/en.json";
var lsval = {};

var languageControls = function(language){

	if((language.toString() == "es") || (language.toString() == "español") || (language.toString().indexOf("es") != -1)){
      languageSpecificURL = spanishLanguageSpecificURL;
	}
	else if((language.toString() == "fr") || (language.toString() == "français") || (language.toString().indexOf("fr") != -1)){
      languageSpecificURL = frenchLanguageSpecificURL;
	}
	else{
      languageSpecificURL = englishLanguageSpecificURL;
	}
   
   //Make an ajax call to strings.json files
	onNetworkCall(languageSpecificURL,function(msg){
  		languageSpecificObject = JSON.parse(msg);
		$$(".lshtm").each(function(){
			$$(this).html(languageSpecificObject.languageSpecifications[0][$$(this).data("text")]);
		});
		$$(".lsphr").each(function(){
			$$(this).attr("placeholder",languageSpecificObject.languageSpecifications[0][$$(this).data("text")]);
		});
      $$(".lsvlu").each(function(){
			$$(this).attr("value",languageSpecificObject.languageSpecifications[0][$$(this).data("text")]);
		});
		
		lsval = function(key){
			value = languageSpecificObject.languageSpecifications[0][key];
			return value;
		};
	});
};

var onNetworkCall = function(urlToHit,successCallback){
	
	$$.ajax({
		 url: urlToHit,
		 method: 'GET',
		 cache: false,
		 timeout: 30000,
		 error: function(){myApp.alert('Error: the language file is not available!');},
		 success: function(data){
		 	successCallback(data);
		 },
	});
}
	
languageControls(cLANGUAGE);
