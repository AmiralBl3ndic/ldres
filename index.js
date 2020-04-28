const hostile = require('hostile');
const redbird = require('redbird');
const inquirer = require('inquirer');
const colors = require('colors');

const { version } = require('./package.json');

console.log(`lurl v${version}`.green);

inquirer.prompt([
	{
		type: 'input',
		name: 'domainName',
		message: '🔗 Domain name to use: ',
		validate: input => input && input.length >= 1 || 'Cannot be empty',
	},
	{
		type: 'input',
		name: 'port',
		message: '🔌 Port to bind: ',
		validate: input => {
			const p = parseInt(input);
			if (isNaN(input) || p == undefined) return 'Must be an integer';

			return ![22, 80, 443].includes(p) || 'Cannot be SSH, HTTP or HTTPS port';
		},
	}
]).then(answers => {
	const { domainName } = answers;
	const port = parseInt(answers.port);

	console.log(`Starting to bind ${domainName.yellow} to ${'localhost:'.yellow}${(port+'').yellow}`);
});
