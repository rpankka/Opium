// Fonction de mise à jour des informations de chantier
var majInfosChantier = function(idChantier){
	infosChantier(idChantier,function(req){
		var mesBesoins = JSON.parse(req.responseText);
        // Pour mettre à jour l'interface...
        onPageOpen(mesBesoins);
        switch(mesBesoins.etat) {
            case "6":
                ungrey("produits-button");
            case "8":
                ungrey("zone-button");
                break;
            case "7":
                toDanger("produits");
                break;
            case "9":
                toDanger("mise");
                break;
        }
	});
}

// Fonction principale pour lancer les écoutes
var chantiers = function($) {
        'use strict';
     // Changement d'id de chantier dans le select
	$("#idChantier").change(function(e){
			majInfosChantier($("#idChantier").val());
	})
}(jQuery);


function plusMoins(nomPanel) {

    var myElement = document.getElementById(nomPanel+"-button"); //trouve le bouton
    var myParentDiv = myElement.parentNode.parentNode;

    //if div is greyed out, pushing the button has no effect
    if(myParentDiv.className.indexOf("greyed-out") != -1) {
        return true;
    }

    //if icon is +, set it to -, and if -, set it to +
    if (myElement.innerHTML.indexOf("plus") > -1)  {
        myElement.innerHTML = myElement.innerHTML.replace("plus","minus");
    } else {
        myElement.innerHTML = myElement.innerHTML.replace("minus","plus");
    }

    afficher(nomPanel+"-body"); //trouve le contenu de la fenêtre

    return true;
}

// enlève l'attribut disabled du bouton "id", et greyed-out de la div parente
function ungrey(id) {
    var element = document.getElementById(id);
    var parentDiv = element.parentNode.parentNode.parentNode;

    element.disabled = "";
    parentDiv.className = parentDiv.className.replace(" greyed-out","");
    
    return true;
}

//change la couleur du panel "id" pour le passer à rouge
function toDanger(id) {
    var element = document.getElementById(id);
    var button = element.children[0].children[0].children[0];
    
    element.className = element.className.replace("success","danger");
    button.className = button.className.replace("success","danger");
    
    return true;
}

//change la couleur du panel "id" pour le passer à orange
function toWarning(id) {
    var element = document.getElementById(id);
    var button = element.children[0].children[0].children[0];
    
    element.className = element.className.replace("success","warning");
    button.className = button.className.replace("success","warning");
    
    return true;
}

var test = ungrey("produits-button");
