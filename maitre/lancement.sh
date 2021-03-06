# Lancement de l'application  
echo "Historique du mongo de l'application MOJITO" > mongo.log
echo "Date du lancement: $(date)" >> mongo.log
nohup echo $(mongod) & >> mongo.log 2>&1
echo Mongo ...
sleep 15

echo "Historique de l'utilisateur de l'application MOJITO" > utilisateur.log
echo "Date du lancement: $(date)" >> utilisateur.log
cd utilisateur
nohup $(./bin/www) & >> ../utilisateur.log 2>&1
cd ..
echo Utilisateur ...
sleep 5

echo "Historique du metier de l'application MOJITO" > metier.log
echo "Date du lancement: $(date)" >> metier.log
cd metier
nohup echo $(node metier.js) & >> ../metier.log 2>&1
cd ..
echo Metier ...
sleep 5

echo "Historique du MMManager de l'application MOJITO" > MMManager.log
echo "Date du lancement: $(date)" >> MMManager.log
cd MMManager
nohup echo $(node MMManager.js) & >> ../MMManager.log 2>&1
cd ..
echo MMManager ...

echo Application lancée avec succès ...
