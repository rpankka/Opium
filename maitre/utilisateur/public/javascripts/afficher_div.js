function afficher_cacher(id) {

    var affichages = ["on_click1","on_click2","on_click3","on_click4"];
    var boutons = ["cliquable1","cliquable2","cliquable3","cliquable4"]


    for(var i=0; i<4; i++) {
            document.getElementById(affichages[i]).style.display="none";
            chevronRight(boutons[i]);
    }

    document.getElementById(id).style.display="block";
    chevronDown(id.replace("on_click","cliquable"));
	
    var req = new XMLHttpRequest();
	
	if(id=='on_click2'){
	var chantier = document.getElementById("chantiername").value;
	var commentaire = document.getElementById("comment").value;
	var optionstatue = document.getElementById("optionsRadios1").value;
	req.open('GET', 'nouveau_chantier?chantier=' + chantier + '&commentaire=' + commentaire + '&optionstatue=' + optionstatue, true);
	}
	
	//var imagefile = document.getElementById("js-upload-files").files[0];
	//alert(user);
	
    
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
         if(req.status == 200)
          dump(req.responseText);
         else
          dump("Erreur pendant le chargement de la page.\n");
      }
    };
    req.send();
    return true;
}

function afficher(id) {
    console.log("AFFICHER");

    if(document.getElementById(id).style.display=="block") {
        document.getElementById(id).style.display="none";
    } else {
        document.getElementById(id).style.display="block";
    }

    return true;
}

function tournerChevron(id) {
    console.log("TOURNER_CHEVRON");

    //if the chevron is right, set it to down, and if down, set it to right
    if (document.getElementById(id).innerHTML.indexOf("right") > -1)  {
        chevronDown(id);
    } else {
        chevronRight(id);
    }

    return true;
}

function chevronRight(id) {
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace("down","right");
    return true;
}

function chevronDown(id) {
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace("right","down");
    return true;
}

function plusMoins(id) {

    //if icon is +, set it to -, and if -, set it to +
    if (document.getElementById(id).innerHTML.indexOf("plus") > -1)  {
        document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace("plus","minus");
    } else {
        document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace("minus","plus");
    }

    return true;
}
