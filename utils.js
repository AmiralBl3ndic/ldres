const hostile = require('hostile');

function cleanHostsFile (domain, callback) {
	return () => {
		hostile.remove('127.0.0.1', domain, (err) => {
			if (err) console.error(err);
			else callback();
		});
	}
}

module.exports = {
	cleanHostsFile,
};
