var http = require('http');
var ip 	 = require('ip');
var config_esclave = require('../config_esclave')

// Indiquent l'état d'inscription et l'activité en cours de l'esclave
var ACTIVITE_ESCLAVE = "DETENDU";
var INSCRIT 	 	 = false;

// Inscription auprès du maitre
exports.inscription = function(){
	// envoi d'une requete http auprès du maitre
	http.get("http://"+config_esclave.maitre_ip+":"+config_esclave.maitre_port+"/inscriptionEsclave?port="+config_esclave.esclave_port,function callback(response){

		  
		  response.setEncoding('utf8');
		  response.on('data', function (chunk) {
			;//console.log('BODY: ' + chunk);
		  });
	})
	
}

// Renvoie un contenu html pour l'adminsitration de l'esclave
exports.pageHTML = function(res,msg){
	
	res.setHeader('Content-Type', 'text/html');
	
	var string = "";
	
	string += "<html><head><title>Esclave Mojito</title></head><body>";
	string += "<table width=\"50%\" border=\"1\"><tr><td>esclave</td><td>"+ip.address()+":"+config_esclave.esclave_port+"</td>";
	string += "<tr><td colspan=\"2\" align=\"right\"><strong>"+msg+"</strong></td></tr>"
	if (INSCRIT)
		string  += "<tr><td>inscription</td><td>inscrit auprès de </td>";
	else string += "<tr><td>inscription</td><td>non inscrit</td>";
	string += "<tr><td>activité</td><td>"+ACTIVITE_ESCLAVE+"</td>";
	string += "<tr><td>actions</td><td><a href=\"/inscription\">inscription</a></td>";
	string += "</body></html>"
	
	res.end(string);
}
