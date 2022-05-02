import { provide, inject, InjectionKey, defineComponent, DefineComponent } from 'vue';

const VOID = Symbol();

export type Store<R, T extends any = void> = {
	useProvide: (initialState: T) => R;
	useInject: () => R;
	Provider: DefineComponent<T extends undefined ? { initialState?: T } : { initialState: T }>;
};

export const createStore = <R, T extends any = void>(hook: (initialState: T) => R): Store<R, T> => {
	const id: InjectionKey<R | typeof VOID> = Symbol();

	const useProvide = (initialState: T) => {
		const state = hook(initialState);
		provide(id, state);

		return state;
	};

	const useInject = () => {
		const state = inject(id, VOID);
		if (state === VOID) throw new Error('injection state not found');

		return state;
	};

	const Provider = defineComponent({
		name: 'Provider',
		props: ['initialState'],
		setup: (props, { slots }) => (useProvide(props.initialState), () => slots.default?.()),
	});

	return {
		useProvide,
		useInject,
		//@ts-ignore
		Provider,
	};
};

export default createStore;
