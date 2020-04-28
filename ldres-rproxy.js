const inquirer = require('inquirer');
const redbird = require('redbird');
require('colors');

const { cleanHostsFile, registerLocalVHost } = require('./utils');

let inquirerQuestions = [
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
];

async function ldresRProxy(opts) {
	let domainName = undefined, port = undefined;

	if (opts.domain) {
		domainName = opts.domain.trim();
		domainName = domainName.replace(/^https?:\/?\/?/, '');
		domainName = domainName.replace(/\/$/, '');

		inquirerQuestions = inquirerQuestions.filter(q => q.name !== 'domainName');
	}

	if (opts.port) {
		port = opts.port;
		inquirerQuestions = inquirerQuestions.filter(q => q.name !== 'port');
	}

	// Ask for missing parameters
	const answers = await inquirer.prompt(inquirerQuestions);

	// Ensure all parameters values are set
	domainName = domainName || answers.domainName.toLowerCase();
	port = port || parseInt(answers.port);

	console.log(`Starting to bind ${domainName.yellow} to ${'localhost:'.yellow}${(port+'').yellow}`);

	try {
		await registerLocalVHost(domainName);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`Registered ${domainName.yellow} in hosts file`);

	// Ensure hosts file will be cleaned before program exits
	const cleanExit = cleanHostsFile(domainName, () => process.exit());
	process.on('SIGINT', cleanExit);
	process.on('exit', cleanExit);

	// Define and start reverse proxy
	const proxy = redbird({ 
		port: 80,
		bunyan: false
	});

	// Register a new virtual host 
	proxy.register(domainName, `http://localhost:${port}`);

	console.log(`Registered ${domainName.yellow} virtual host to ${('localhost:'+port).yellow}`);
}

module.exports = ldresRProxy;
