const commander = require('commander');

const { parsePort } = require('./utils');

const ldresRProxy = require('./ldres-rproxy');

const { version } = require('./package.json');

const ldres = new commander.Command();
ldres.version(version, '-v, --version', 'get the version of ldres');

ldres
	.command('rproxy')
	.description('Spins up a small reverse proxy solution')
	.option('-d, --domain <domain>', 'directly specify the domain name to use as a virtual host')
	.option('-p, --port <port>', 'directly specify the port to reverse-proxy to', parsePort)
	.action((opts) => ldresRProxy(opts));

ldres
	.command('static')
	.description('Serves a folder as a website')
	.option('-d, --domain', 'directly specify the domain name to serve the website with')
	.option('-r, --root', 'path to the folder to serve as root of the website')
	.action(() => {
		console.log("Not implemented yet".rainbow);
	});

ldres.parse(process.argv);

module.exports = ldres;
