import { useState, useCallback } from "react";

import { useCartStore } from "@/stores/cart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { v4 as uuid } from "uuid";

import { type Coffee, coffees } from "@/constants/coffees";

import {
	Item,
	ItemTitle,
	ItemDescription,
	ItemImage,
	ItemActions,
} from "@/components/item";

import {
	PiCoffeeFill,
	PiPackageFill,
	PiShoppingCartFill,
	PiTimerFill,
	PiPlusBold,
	PiMinusBold,
} from "react-icons/pi";

export default function Home() {
	const { width } = useMediaQuery();

	const ItemCard = ({ item }: Readonly<{ item: Coffee }>) => {
		const [amount, setAmount] = useState(1);
		const addToCart = useCartStore((state) => state.addToCart);

		const handleIncrement = useCallback(() => {
			setAmount((prev) => prev + 1);
		}, []);

		const handleDecrement = useCallback(() => {
			setAmount((prev) => (prev > 1 ? prev - 1 : prev));
		}, []);

		const handleAddToCart = useCallback(() => {
			const itemsToAdd = Array.from({ length: amount }, () => ({
				id: uuid(),
				name: item.name,
				price: item.price,
			}));
			// biome-ignore lint/complexity/noForEach: <explanation>
			itemsToAdd.forEach((item) => addToCart(item));
		}, [amount, addToCart, item]);

		return (
			<Item className="flex flex-col items-center w-full h-77.5 space-y-4">
				<ItemImage
					className="-mt-9"
					src={`/assets/png/${item.name.replace(/\s+/g, "_").toUpperCase()}.png`}
					alt={item.name}
				/>
				<ul className="flex gap-2 text-xs text-yellow-dark uppercase font-bold">
					{item.tags.map((tag) => (
						<li className="py-1 px-2 rounded-full bg-yellow-light" key={tag}>
							{tag}
						</li>
					))}
				</ul>
				<div className="space-y-1 text-center">
					<ItemTitle className="text-[1.4rem]">{item.name}</ItemTitle>
					<ItemDescription>{item.description}</ItemDescription>
				</div>
				<div className="flex gap-2 items-center">
					<small className="text-base-text">
						R${" "}
						<span className="font-bold text-xl">
							{item.price.toFixed(2).replace(/[.]/, ",")}
						</span>
					</small>
					<ItemActions>
						<div className="flex gap-4 py-2 px-3 bg-base-button rounded-lg [&>button]:text-purple [&>button]:hover:text-purple-dark [&>button]:cursor-pointer [&>button:disabled]:opacity-50 [&>button:disabled]:cursor-not-allowed">
							<button
								type="button"
								disabled={amount === 1}
								onClick={handleDecrement}
							>
								<PiMinusBold />
							</button>
							<span>{amount}</span>
							<button type="button" onClick={handleIncrement}>
								<PiPlusBold />
							</button>
						</div>
						<button
							type="button"
							className="cursor-pointer text-lg p-2.5 rounded-lg bg-purple-dark text-white hover:opacity-75 hover:scale-105 transition-all"
							onClick={handleAddToCart}
						>
							<PiShoppingCartFill />
						</button>
					</ItemActions>
				</div>
			</Item>
		);
	};

	return (
		<>
			<section className="mt-26 max-lg:py-10 bg-[url('/assets/svg/background.svg')] bg-center shadow-background shadow-[inset_0_-10px_5px]">
				<div className="mx-auto container max-lg:flex-col-reverse items-center flex justify-center gap-14 max-lg:h-max lg:h-136 px-10">
					<div className="space-y-4">
						<h1 className="font-baloo2 font-extrabold text-base-title text-4xl sm:text-5xl">
							Encontre o café perfeito para qualquer hora do dia
						</h1>
						<h3 className="text-base-subtitle max-sm:text-sm">
							Com o Coffee Delivery você recebe seu café onde estiver, a
							{width > 968 && <br />} qualquer hora
						</h3>
						<ul className="mt-15 flex text-base-text gap-4 max-sm:text-xs">
							<div className="space-y-4 *:flex *:w-full *:items-center *:gap-3 *:*:rounded-full *:max-sm:*:p-1.5 *:max-sm:*:text-lg *:sm:*:p-2.5 *:sm:*:text-xl *:*:text-white">
								<li>
									<div className="bg-yellow-dark">
										<PiShoppingCartFill />
									</div>
									Compra simples e segura
								</li>
								<li>
									<div className="bg-yellow">
										<PiTimerFill />
									</div>
									Entrega rápida e rastreada
								</li>
							</div>
							<div className="space-y-4 *:flex *:items-center *:gap-3 *:*:rounded-full *:max-sm:*:p-1.5 *:max-sm:*:text-lg *:sm:*:p-2.5 *:sm:*:text-xl *:*:text-white">
								<li>
									<div className="bg-base-text">
										<PiPackageFill />
									</div>
									Embalagem mantém o café intacto
								</li>
								<li>
									<div className="bg-purple">
										<PiCoffeeFill />
									</div>
									O café chega fresquinho até você
								</li>
							</div>
						</ul>
					</div>
					<img src="/assets/png/intro.png" className="h-90 w-119" alt="" />
				</div>
			</section>
			<section className="py-10 space-y-5 mx-auto container px-10">
				<h1 className="font-baloo2 text-base-subtitle text-4xl font-bold">
					Nossos cafés
				</h1>
				<ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-15">
					{coffees.map((item) => (
						<ItemCard key={item.name} item={item} />
					))}
				</ul>
			</section>
		</>
	);
}
