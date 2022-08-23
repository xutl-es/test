type Describer = () => void;
type Runner = () => void | Promise<void>;

interface SetupFn {
	(runner: Runner): void;
}
interface DescribeFn {
	(label: string, describer: Describer): void;
	it: ItFn;
	skip: SkipFn;
	todo: SkipFn;
	only: (label: string, describer: Describer) => void;
}
interface ItFn {
	(label: string, runner: Runner): void;
	describe: DescribeFn;
	skip: SkipFn;
	todo: SkipFn;
	only: (label: string, runner: Runner) => void;
	timeout: (label: string, ms: number, runner: Runner) => void;
}
interface SkipFn {
	(label: string): void;
	describe: DescribeFn;
	it: ItFn;
}

export const before: SetupFn;
export const beforeEach: SetupFn;
export const afterEach: SetupFn;
export const after: SetupFn;

export const describe: DescribeFn;
export const it: ItFn;
export const skip: SkipFn;
export const todo: SkipFn;

export const configure: (params: { timeout: number }) => void;
