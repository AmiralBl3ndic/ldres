const commander = require('commander');
const hostile = require('hostile');
const redbird = require('redbird');
const inquirer = require('inquirer');
require('colors');

const { version } = require('./package.json');

const ldres = new commander.Command();
ldres.version(version, '-v, --version', 'get the version of ldres');

ldres
	.command('rproxy')
	.description('Spins up a small reverse proxy solution')
	.option('-d, --domain', 'directly specify the domain name to use as a virtual host')
	.option('-p, --port', 'directly specify the port to reverse-proxy to')
	.action(() => {
		console.log("Not implemented yet".rainbow);
	});

ldres
	.command('static')
	.description('Serves a folder as a website')
	.option('-d, --domain', 'directly specify the domain name to serve the website with')
	.option('-r, --root', 'path to the folder to serve as root of the website')
	.action(() => {
		console.log("Not implemented yet".rainbow);
	});

ldres.parse(process.argv);

if (ldres.version) {
	console.log(ldres.version);
	process.exit();
}

function cleanHostsFile (domain, callback) {
	return () => {
		hostile.remove('127.0.0.1', domain, (err) => {
			if (err) console.error(err);
			else callback();
		});
	}
}

const inquirerQuestions = {
	rproxy: [
		{
			type: 'input',
			name: 'domainName',
			message: '🔗 Domain name to use:',
			validate: input => input && input.length >= 1 || 'Cannot be empty',
		},
		{
			type: 'input',
			name: 'port',
			message: '🔌 Port to bind:',
			validate: input => {
				const p = parseInt(input);
				if (isNaN(input) || p == undefined) return 'Must be an integer';

				return p > 1000 || 'Port must be in [1000 - 65536] range';
			},
		}
	]
}

inquirer.prompt(inquirerQuestions.rproxy).then(answers => {
	const domainName = answers.domainName.toLowerCase();
	const port = parseInt(answers.port);

	console.log(`Starting to bind ${domainName.yellow} to ${'localhost:'.yellow}${(port+'').yellow}`);

	hostile.set('127.0.0.1', domainName, (err) => {
		if (err) {
			console.error(err);
			process.exit();
		}

		const cleanExit = cleanHostsFile(domainName, () => process.exit());
		process.on('SIGINT', cleanExit);
		process.on('exit', cleanExit);

		const proxy = redbird({ 
			port: 80,
			bunyan: false
		});

		console.log(`Registered ${domainName.yellow} in hosts file`);

		proxy.register(`${domainName}`, `http://localhost:${port}`);

		console.log(`Register ${domainName.yellow} virtual host to ${('localhost:'+port).yellow}`);

		console.log(`Listening for requests`.america);
	});
});
