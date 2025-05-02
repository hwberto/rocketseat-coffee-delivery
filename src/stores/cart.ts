import { create } from "zustand";

type Item = {
	id: string;
	name: string;
	price: number;
};

type States = {
	items: Item[];
};

type Actions = {
	addToCart: (item: Item) => void;
	removeFromCart: (name: string) => void;
	decrement: (item: Omit<Item, "id">) => void;
	clearCart: () => void;
};

export const useCartStore = create<States & Actions>((set) => ({
	items: [],
	addToCart: (item: Item) =>
		set((state) => {
			const existingItem = state.items.find((i) => i.id === item.id);

			if (existingItem) {
				const newItems = state.items.map((i) =>
					i.id === item.id ? { ...i } : i,
				);

				localStorage.setItem("items", JSON.stringify(newItems));

				return {
					items: newItems,
				};
			}

			localStorage.setItem("items", JSON.stringify([...state.items, item]));

			return {
				items: [...state.items, item],
			};
		}),
	decrement: (item: Omit<Item, "id">) =>
		set((state) => {
			const indexToRemove = [...state.items]
				.reverse()
				.findIndex((i) => i.name === item.name);

			if (indexToRemove === -1) return { items: state.items };

			const actualIndexToRemove = state.items.length - 1 - indexToRemove;

			const updatedItems = state.items.filter(
				(_, index) => index !== actualIndexToRemove,
			);

			localStorage.setItem("items", JSON.stringify(updatedItems));

			return {
				items: updatedItems,
			};
		}),
	removeFromCart: (name: string) =>
		set((state) => {
			localStorage.setItem(
				"items",
				JSON.stringify(state.items.filter((item) => item.name !== name)),
			);

			return {
				items: state.items.filter((item) => item.name !== name),
			};
		}),
	clearCart: () =>
		set(() => {
			localStorage.clear();

			return {
				items: [],
			};
		}),
}));
