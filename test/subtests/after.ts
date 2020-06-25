import { describe, it, after } from '../../';
import assert from 'assert';

describe('test', () => {
	after(() => assert(false));
	it('test', () => assert(true));
});
