const hostile = require('hostile');

function parsePort(value, _) {
	const p = parseInt(value);

	if (isNaN(value) || p == undefined || !/^\d+$/.test(value)) {
		console.error(`"${value}" is not a valid port`);
		process.exit(1);
	}

	if (p < 1000 || p > 65535) {
		console.error(`${p} cannot be used as a port (must be in the [1000 - 65535] range)`);
		process.exit(1);
	}

	return p;
}

function cleanHostsFile (domain, callback) {
	return () => {
		hostile.remove('127.0.0.1', domain, (err) => {
			if (err) console.error(err);
			else callback();
		});
	}
}

function registerLocalVHost(domain) {
	return new Promise((resolve, reject) => {
		hostile.set('127.0.0.1', domain, (err) => {
			if (err) return reject(err);
			resolve();
		});
	});
}

module.exports = {
	parsePort,
	cleanHostsFile,
	registerLocalVHost,
};
