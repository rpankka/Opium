#!/bin/bash

#Prérequis : make, libx11-dev

if [ "$(whoami)" != "root" ];
then
  echo "Veuillez lancer ce script en root (en utilisant sudo, par exemple)."
  exit -1
fi

echo "Pour quel utilisateur ce programme doit-il être installé ?"
read user

cd softs_linux

# ExifTool
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' libimage-exiftool-perl|grep "install ok installed")
echo "Recherche d'ExifTool: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas de version d'ExifTool trouvée. Installation."
  tar xzvf Image-ExifTool-9.82.tar.gz
  cd Image-ExifTool-9.82
  perl Makefile.PL
  sudo make install
  cd ..
fi

# MongoDB
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' mongodb|grep "install ok installed")
echo "Recherche de MongoDB: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas de version de MongoDB trouvée. Installation."
  tar xzvf mongodb-linux-x86_64-3.0.2.tar.gz

  # ajout du chemin d'installation de MongoDB au PATH
  echo "# ajout du chemin d installation de MongoDB au PATH" >> "/home/$user/.bashrc"
  echo PATH="$PATH:$(pwd)/mongodb-linux-x86_64-3.0.2/bin" >> "/home/$user/.bashrc"
fi
if [ ! -d "/data/db" ]; then #creates folder if not existing already
  mkdir /data
  mkdir /data/db
  chmod -R 777 /data/db
fi

#node.js
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' nodejs|grep "install ok installed")
echo "Recherche de nodejs: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas de version de nodejs trouvée. Installation."
  tar xzvf node-v0.12.2-linux-x64.tar.gz
  
  # ajout du chemin d'installation de nodejs au PATH
  echo "# ajout du chemin d installation de nodejs au PATH" >> "/home/$user/.bashrc"
  echo PATH="$PATH:$(pwd)/node-v0.12.2-linux-x64/bin" >> "/home/$user/.bashrc"
fi

chmod -R 777 *

echo "Installation terminée, vous pouvez lancer \"lancement.sh\""
