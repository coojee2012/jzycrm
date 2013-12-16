
var path   = require('path');
var merge  = require('merge-recursive');

var cache = { };

// Root path of the project
var ROOT_DIR = path.join(__dirname, '../../..');
exports.setRootDir = function(root) {
	ROOT_DIR = root;
};

// Configuration directory
var CONF_DIR = 'config';
exports.setConfDir = function(conf) {
	CONF_DIR = conf;
};

// Master config file
var MASTER_CONF = 'master';
exports.setMasterConf = function(master) {
	MASTER_CONF = master;
};

// Load configuration
exports.load = function(env, force) {
	if (! cache[env] || force) {
		cache[env] = loadConfFiles([ MASTER_CONF, (env || 'undefined') ]);
	}
	return cache[env];
};

// Loads configuration files and merges them
function loadConfFiles(files) {
	var confDir = path.resolve(ROOT_DIR, CONF_DIR);
	return merge.recursive.apply(merge,
		files.map(function(file) {
			var contents;
			try {
				contents = require(path.join(confDir, file + '.json'));
			} catch (e) {
				try {
					contents = require(path.join(confDir, file + '.js'));
				} catch (e2) {
					contents = { };
				}
			}
			return contents;
		})
	);
}


