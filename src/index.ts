import { provide, inject, InjectionKey } from 'vue';

const VOID = Symbol();

export const createStore = <T extends any[], R>(hook: (...args: T) => R) => {
	const id: InjectionKey<R | typeof VOID> = Symbol();

	const useProvider = (...args: T) => {
		const state = hook(...args);
		provide(id, state);

		return state;
	};

	const useInject = () => {
		const state = inject(id, VOID);
		if (state === VOID) throw new Error('injection state not found');

		return state;
	};

	return {
		useProvider,
		useInject,
	};
};

export default createStore;
