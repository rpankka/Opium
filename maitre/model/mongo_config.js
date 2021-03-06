var config_json = require('../config.json');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var Model = mongoose.model.bind(mongoose);

// Récupérer les paramètres de MongoDB du fichier config.js
var mongodb_db_name = config_json.mongodb_db_name;
var mongodb_port = config_json.mongodb_port;
var mongodb_ip = config_json.mongodb_ip;

// Se connecter à MongoDB
mongoose.connect('mongodb://'+mongodb_ip+':'+mongodb_port+'/'+mongodb_db_name+'/');

// Créer le la collection besoins
var besoins_schema = new Schema({},{ strict: false });
exports.besoins = mongoose.model('besoins', besoins_schema);

// Créer la collection jobs
var jobs_schema = new Schema({},{ strict: false });
exports.jobs = mongoose.model('jobs',jobs_schema, 'jobs');

// Créer la collection esclaves
var esclaves_schema = new Schema({},{ strict: false });
exports.esclaves = mongoose.model('esclaves',esclaves_schema,'esclaves');
