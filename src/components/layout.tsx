import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import { useCartStore } from "@/stores/cart";

import { Header } from "./header";

export function Layout() {
	const [isLoading, setIsLoading] = useState(true);
	const addToCart = useCartStore((state) => state.addToCart);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function loadCartItems() {
			const storedItems = localStorage.getItem("items");
			const items = storedItems ? JSON.parse(storedItems) : [];

			if (Array.isArray(items) && items.length > 0) {
				// biome-ignore lint/complexity/noForEach: <explanation>
				items.forEach((item) => addToCart(item));
			}

			setIsLoading(false);
		}

		loadCartItems();
	}, []);

	if (isLoading) {
		return (
			<div className="inset-0 fixed bg-[url('/background.svg'),var(--color-background)] bg-center bg-no-repeat"></div>
		);
	}

	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}
