import * as pieces from './index.js';
Object.assign(global, pieces);

process.argv.splice(1, 1);

import(process.argv[1]).catch((err) => {
	console.error(err);
	process.exit(4);
});
