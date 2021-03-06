// Contient les informations exif des images importées
var infosExif = null;
var tempsAffichage = "1";

// Récupère les informations exif des images du chantier auprès du serveur
function recupereExif()
{
	//on attend que les fichiers soient créés
        var req = new XMLHttpRequest();    
        req.open('POST','/nouveau_chantier',true);

        req.onreadystatechange = function (aEvt) {
          if (req.readyState == 4) {
             if(req.status == 200)
             {
                  infosExif = JSON.parse(req.responseText);
             }
          }
        };
        // On envoie l'id chantier et la demande d'exif
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify({"_id":$("#idChantier").val(),"demandeExif":"oui"}));
}

// Valide un onglet en envoyant les paramètres du formulaire et en affichant l'onglet suivant
function valider_onglet(id) {
    
    var affichages = ["on_click1","on_click2","on_click3","on_click4"];
    var boutons = ["cliquable1","cliquable2","cliquable3","cliquable4"];

    // change le style des tous les boutons et cache tous les onglets
    for(var i=0; i<4; i++) {
            document.getElementById(affichages[i]).style.display="none";
            chevronRight(boutons[i]);
    }

    // Montre l'onglet courant
    document.getElementById(id).style.display="block";
    chevronDown(id.replace("on_click","cliquable"));
    
    //Onglet courrant(celui à valider), initialisé au premier onglet au premier appel
    var ongletCourant = $("#ongletCourant").val();
    
    //On récupère l'idChantier de la page
    var idChantier = $("#idChantier").val();
    
    // Si on valide l'onglet 2, on récupère les métadonnées des images importées
    if (ongletCourant == "on_click2")
    {
		recupereExif();// Récupération des infos exif aupres du serveur
    }
    else
    {
   
        
        var getinfo = ["nom", "commentaire"]
        var getinfochecked = ["typestatue", "typefacade"]
        //Tableau associatif "onglet courrant" : ["id des formulaires à valider"]
        var tabass = {"on_click1" : ["on_click1a"], "on_click2" : ["js-upload-form"], "on_click3" : ["etalonnageForm", "parametresForm"], "on_click4" : []}
        
        //Pas de formulaire à valider dans l'onglet 4: on passe toutes les étapes
        if(ongletCourant != "on_click4"){
        
        //Création d'un objet JSON
        var formjson = {};
        //Ajout de l'id du chantier
        if(idChantier!="-1"){
            formjson._id = idChantier;
        }
		else{
		//On renvoit la date de création du chantier
			var date1 = new Date();
			var month = date1.getMonth()+1;
			var date2 = date1.getDate() + "-" + ((month<10)?"":"0") + month + "-" + date1.getFullYear();
			formjson.date = date2;
		//On met l'état "En attente de l'utilisateur"
			formjson.etat = "1";
		//validation du troisième onglet à la première validation
			tabass.on_click1 = ["on_click1a","etalonnageForm", "parametresForm"];
		}
        
        // on parcourt les formulaires présents dans l'onglet courant, en regardant la table d'association tabass
        for (var j = 0; j < tabass[ongletCourant].length; j++){
        var idform = (tabass[ongletCourant])[j];
        // Récupération du formulaire
        var Form = document.forms[idform];
        // Boucle tous les éléments du formulaire i
        var el = Form.elements;
        //Formulaire special pour l'etalonnage
        if(idform=="etalonnageForm"){
            var etaljson = {};
            etaljson.id = "1" //A VOIR CE QU'IL FAUT METTRE
            for (var l = 0; l < el.length; l++){
                var idelement = el[l].id;
                //Nouveau JSON pour cet etalonnage
                if(idelement=="calibrationname"){etaljson.nom = el[l].value;}
                if(idelement=="auto_etalonnage"){
                    if(el[l].checked){
                        etaljson.auto_etalonnage="1";
                    }
                    else{
                        etaljson.auto_etalonnage="0";
                        //ALLER CHERCHER LE NOM DU FICHIER DE CALIBRATION
                        break;
                    }
                }
                if(idelement=="standard" && el[l].checked){etaljson.type_auto_etalonnage="standard"}
                if(idelement=="fisheye" && el[l].checked){etaljson.type_auto_etalonnage="fisheye"}
                if(idelement=="fraserbasic" && el[l].checked){etaljson.type_auto_etalonnage="fraserbasic"}
				//Nouvelle image
				if(idelement=="js-upload-files2"){
					var listImCal = [];
					var uploadFiles2 = document.getElementById('js-upload-files2').files;
					if(uploadFiles2.length!=0){
						for(var j=0;j<uploadFiles2.length;j++){
						importeFichier2(uploadFiles2[j]);
						listImCal.push(uploadFiles2[j].name);
						}
					}
					etaljson.liste_images = listImCal;
				}
				//ListeImages
                if(idelement=="choix" && el[l].checked){
					var listImCal = [];
					var menuListImages = document.getElementById("menuSelectImages");
					console.log("Menu deroulant resultat :");
					for(var i=0; i<menuSelectImages.length; i++) {
						if(menuListImages[i].selected){
							console.log(menuListImages[i].value);
							listImCal.push(menuListImages[i].value)
						}
					}
					etaljson.liste_images = listImCal;
				}
				
				//Infos Capteur
                if(idelement=="infoCapteurCb" && el[l].checked){
                    var capteurjson={};
                    capteurjson.focale_reelle = document.getElementById("focale_reelle").value;
                    var dim1 = document.getElementById("dim_1").value;
                    var dim2 = document.getElementById("dim_2").value;
					dimens = [];
					dimens.push(dim1);
					dimens.push(dim2);
                    capteurjson.dimensions = dimens;
                    etaljson.capteur = capteurjson;
                }
            }
		tabEtalonnage = [];
		tabEtalonnage.push(etaljson)
        formjson.etalonnage = tabEtalonnage;
        }
        else{
        for (var l = 0; l < el.length; l++)
            {
            var idelement = el[l].id;
                for (var i =0; i < getinfo.length; i++){
                    //Si l'id est dans la liste des input à récupérer, on l'ajoute à l'objet JSON
                    if( idelement==getinfo[i] ){
                    formjson[idelement] = el[l].value;
                    break;
                    }
                }
                //Pour les checkbox
                for (var i =0; i < getinfochecked.length; i++){
                    //Si l'id est dans la liste des input à récupérer, on l'ajoute à l'objet JSON
                    if( idelement==getinfochecked[i] ){
                        if (el[l].checked){
                            formjson.type = el[l].value;}
                    break;
                    }
                }
				if ( idelement=="mask2D"){
					if (el[l].checked){formjson.masque = "22D";}
					else{formjson.masque = "3D";}
				}
                if ( idelement=="mise_a_echelle" || idelement=="basculement" ){
                    if( el[l].checked){formjson[idelement] = "1"}
                    else{formjson[idelement] = "0"}
                }
                if ( idelement=="quantite_points_liaison" ){
                    formjson[idelement] = el[l].options[el[l].selectedIndex].value;
                }
				if ( idelement=="taille_nuage" ){
                    formjson[idelement] = el[l].options[el[l].selectedIndex].value;
                }
            }
        }
        }
        // N'envoie pas de requete si il y a juste l'id dans le tableau
        if (Object.keys(formjson).length > 1)
        {
            //Pour l'envoi en POST des informations au serveur
            var req = new XMLHttpRequest();    
            req.open('POST','/nouveau_chantier',true);
            
            req.onreadystatechange = function (aEvt) {
              if (req.readyState == 4) {
                 if(req.status == 200){
                 //Récupération du nouvel id du chantier
                  var jsonrecu = JSON.parse(req.responseText);
                  idChantier = jsonrecu._id;
                  //On met l'id chantier dans la page
                  if($("#idChantier").val() == "-1")$("#idChantier").val(idChantier);
                  }
                 else
                  ;//dump("Erreur pendant le chargement de la page.\n");
              }
            };

            //On précise que l'information qu'on envoie est du JSON
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            req.send(JSON.stringify(formjson));
            }
        }
    }
    //Changement d'onglet
    $("#ongletCourant").val(id);
	//Si on passe sur l'onglet 4, on fait le récapitulatif
	if(id == "on_click4"){majInfosChantier(idChantier);}
	
    return true;
}

function lancer_calcul() {

		if(document.getElementById("nom").value == ""){
			alert("Entrez un nom de chantier");
		}
		else{
		//Test du nombre d'images
			if(nbFichiers > 0){
				if(nbFichiers < 2){alert("Importez au moins deux images");}
				else{
					if((document.getElementById("dim_1").value != "" && document.getElementById("dim_2").value == "") || (document.getElementById("dim_1").value == "" && document.getElementById("dim_2").value != "")){
					alert("Rentrez 2 dimensions pour la caméra");
					}
					else{
						var test=1;
						var champsNumber = ["focale_reelle","dim_1","dim_2"];
						for(var i=0; i<champsNumber.length; i++){
							if(isNaN(document.getElementById(champsNumber[i]).value)){alert("N'entrez que des nombres dans les champs Focale et Dimension"); test=0;}
							else{
								if(parseFloat(document.getElementById(champsNumber[i]).value) < 0){alert("Les champs Focale et Dimension ne doivent pas être négatifs"); test=0;}
							}
						}
						//tous les tests sont passés
						if(test == 1){
							//création d'un JSON
							var formjson = {};
							//Recherche de l'idChantier
							var idChantier = $("#idChantier").val();
							formjson._id = idChantier;
							//On change de page et on change d'état
							formjson.etat = "2";
							//Envoi de la requête au serveur
							var req = new XMLHttpRequest();
							req.open('POST','/nouveau_chantier',true);
							//On précise que l'information qu'on envoie est du JSON
							req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
							req.send(JSON.stringify(formjson));
							document.location.href="chantiers";
						}
					}
				}
			}
			else{alert("Pas d'images importées");}
	}
}

// Tourne le chevron d'un onglet
function tournerChevron(id) {

    //if the chevron is right, set it to down, and if down, set it to right
    if (document.getElementById(id).innerHTML.indexOf("right") > -1)  {
        chevronDown(id);
    } else {
        chevronRight(id);
    }

    return true;
}

function chevronRight(id) {
    var element = document.getElementById(id);
    
    element.innerHTML = element.innerHTML.replace("down","right");
    return true;
}

function chevronDown(id) {
    var element = document.getElementById(id);
    
    element.innerHTML = element.innerHTML.replace("right","down");
    return true;
}

// Fonction de mise à jour des informations de chantier
var majInfosChantier = function(idChantier){
	infosChantier(idChantier,function(req){
		var mesBesoins = JSON.parse(req.responseText);
        // Pour mettre à jour l'interface...
        onPageOpen(mesBesoins);
	});
}
