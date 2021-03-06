var express    	  = require('express');
var bodyParser 	  = require('body-parser');

var comportements = require('./local_modules/comportements_esclave');
var config		  = require('./config_esclave');
var ip 			  = require('ip');

var app 		  = express();
var utils 	 	  = require('./local_modules/utils');

// On inscrit l'esclave aupres du maitre
comportements.inscription(false);

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  next()
})


app.get('/', function(req, res) {
    comportements.pageHTML(res,"");
});

// Inscription manuelle de l'esclave aupres du maitre (requete lancée sur l'esclave par l'utilisateur)
app.get('/inscription', function(req, res) {
	
	comportements.inscription(true,res,function(resExpress,responseHttpGet){
			if (responseHttpGet.statusCode == 204) comportements.pageHTML(resExpress,"inscription ok");
			else if (responseHttpGet.statusCode == 400) comportements.pageHTML(resExpress,"pb d'inscription (déjà inscrit??)");
	}); 
});

// Desinscription manuelle de l'esclave aupres du maitre (requete lancee sur l'esclave par l'utilisateur)
app.get('/desinscription', function(req, res) {
	
	comportements.desinscription(res,function(resExpress,responseHttpGet){
			if (responseHttpGet.statusCode == 204) comportements.pageHTML(resExpress,"desinscription ok");
			else if (responseHttpGet.statusCode == 400) comportements.pageHTML(resExpress,"pb... l esclave etait il bien inscrit???");
	}); 
});

// Réquête de demande de job lancée par le maitre
app.post('/recoitJob', function(req, res) {

	// On vérifie que la requête a bien été initiée par le maitre
	if (utils.toIpV4(req.connection.remoteAddress) == config.maitre_ip)
	{
		comportements.lanceJob(req, res);
	}
	else
	{
		console.log("[ERREUR : esclave / app.post : recoitJob] : requete de lancement de job envoye par un inconnu! [pas bien]");
		res.status(400).end();// retour requete http pb
	}

});

app.listen(parseInt(config.esclave_port)); 
