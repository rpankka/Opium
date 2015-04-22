// Fonction de mise à jour des informations de chantier
var majInfosChantier = function(idChantier){
    infosChantier(idChantier,function(req){

        var mesBesoins = JSON.parse(req.responseText);
        // Pour mettre à jour l'interface...
        onPageOpen(mesBesoins); //pour le resumé des paramètres
        majChantier(mesBesoins);
        // document.getElementById("position").onclick="javascript: returnProduit(position,'"+mesBesoins._id+"')";
       
    });
}

// Fonction principale pour lancer les écoutes
var chantiers = function($) {
        'use strict';
     // Changement d'id de chantier dans le select
    $("#idChantier").change(function(e){
        var id = $("#idChantier").val();
        returnProduit('position',id); //màj des boutons de téléchargement
        returnProduit('nuage',id);
        returnProduit('calibration',id);
        majInfosChantier(id);
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

function supprimerChantier(idChantier) {

}

function returnProduit (id_form,idChantier) {
     document.getElementById(id_form).href="/chantiers?getFichier=yes&typeFichier="+id_form+"&idChantier="+idChantier;
}

function majChantier(besoins) {
    ungrey("config-button");
    switch(besoins.etat) { //pour savoir quels boutons griser
        case "6":
            ungrey("mise-button");
            if(besoins.residus > 1) {
                toWarning("mise");
            }
            ungrey("zone-button");
            ungrey("produits-button");
            break;
        case "7":
            toDanger(results);
        case "8":
            ungrey("mise-button");
            if(bsoins.residus > 1) {
                toWarning("mise");
            }
            ungrey("zone-button");
            ungrey("produits-button");
            webGL_MicMac("/chantiers?getFichier=yes&typeFichier=nuagePly&idChantier="+idChantier,"Restriction");
            document.getElementById("nuage").disabled = "disabled"; //interdit le téléchargement du fichier de résultat tant que le calcul n'est pas fini
        case "9":  //comme Bernard. Cazeneuve. Mdr lol.
            ungrey("mise-button");
            danger("mise");
            break;
    }
               
    document.getElementById("residusChantier").innerHTML = '<div class="panel panel-default panel-body">Résidus : '+besoins.residus+' px.</div>'; //màj des résidus
    document.getElementById("deleteButton").onclick="javascript: supprimerChantier('"+besoins._id+"')"; //màj du bouton de suppression    
}
