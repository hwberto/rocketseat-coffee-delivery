import { useMemo } from "react";
import { Link } from "react-router";

import { useCartStore } from "@/stores/cart";
import { v4 as uuid } from "uuid";

import { Item, ItemTitle, ItemImage, ItemActions } from "./item";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
	PiMapPinFill,
	PiShoppingCartFill,
	PiMinusBold,
	PiPlusBold,
	PiTrashFill,
} from "react-icons/pi";

export function Header() {
	const items = useCartStore((state) => state.items);

	const groupedItems = useMemo(() => {
		const grouped = items.reduce(
			(acc, item) => {
				if (!acc[item.name]) {
					acc[item.name] = { ...item, amount: 0 };
				}
				acc[item.name].amount += 1;
				return acc;
			},
			{} as Record<string, { name: string; price: number; amount: number }>,
		);
		return Object.values(grouped);
	}, [items]);

	const totalValue = useMemo(() => {
		return groupedItems.reduce((total, item) => {
			return total + item.price * item.amount;
		}, 0);
	}, [groupedItems]);

	const CartItem = ({
		item,
	}: Readonly<{
		item: {
			name: string;
			price: number;
		};
	}>) => {
		const items = useCartStore((state) => state.items);
		const removeFromCart = useCartStore((state) => state.removeFromCart);
		const decrement = useCartStore((state) => state.decrement);
		const addToCart = useCartStore((state) => state.addToCart);

		const amount = useMemo(
			() => items.filter((i) => i.name === item.name).length,
			[items, item.name],
		);

		const totalPrice = useMemo(() => item.price * amount, [item.price, amount]);

		const handleDecrement = () => decrement(item);
		const handleIncrement = () => addToCart({ ...item, id: uuid() });
		const handleRemove = () => removeFromCart(item.name);

		return (
			<Item className="flex py-2 gap-4 items-center bg-transparent space-y-0">
				<ItemImage
					alt={item.name}
					src={`/assets/png/${item.name.replace(/\s+/g, "_").toUpperCase()}.png`}
					className="size-25"
				/>
				<div className="flex flex-col w-full space-y-2">
					<div className="flex items-center gap-3">
						<ItemTitle className="text-xl">{item.name}</ItemTitle>
						<span className="w-max px-3 text-xs text-yellow-dark bg-yellow-light font-bold rounded-full">
							{amount}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<small className="text-base-text">
							R${" "}
							<span className="font-bold text-xl">
								{totalPrice.toFixed(2).replace(/[.]/, ",")}
							</span>
						</small>
						<ItemActions>
							<div className="bg-base-button p-2 flex items-center gap-2 text-sm text-purple *:cursor-pointer *:hover:opacity-75">
								<button type="button" onClick={handleDecrement}>
									<PiMinusBold />
								</button>
								<button type="button" onClick={handleIncrement}>
									<PiPlusBold />
								</button>
							</div>
							<button
								type="button"
								className="bg-danger h-7.5 px-2 leading-7.5 text-white cursor-pointer hover:opacity-75"
								onClick={handleRemove}
							>
								<PiTrashFill />
							</button>
						</ItemActions>
					</div>
				</div>
			</Item>
		);
	};

	return (
		<header className="z-30 w-full flex justify-center fixed bg-background top-0 transition-shadow shadow-background shadow-[0_10px_5px]">
			<div className="w-full max-w-6xl h-26 flex justify-between items-center px-8">
				<Link to="/">
					<img src="/assets/svg/logo.svg" alt="Coffee Delivery" />
				</Link>
				<DropdownMenu>
					<DropdownMenuTrigger className="relative cursor-pointer rounded-lg p-2 flex gap-2 items-center font-bold font-baloo2 text-yellow-dark bg-yellow-light ">
						<PiShoppingCartFill className="text-xl" />
						Carrinho
						{items.length > 0 && (
							<span className="text-white font-bold size-5 leading-5 text-[0.6rem] bg-yellow-dark rounded-full absolute right-0 top-0 translate-x-1/2 -translate-y-1/2">
								{items.length}
							</span>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent
						sideOffset={12}
						className="mr-4 border border-base-input relative"
					>
						<h1 className="font-baloo2 text-base-subtitle text-2xl font-bold text-center border-b border-b-base-input mb-2">
							Seu carrinho
						</h1>
						{groupedItems.length > 0 ? (
							<>
								<ul className="w-max max-h-80 overflow-y-scroll overflow-x-hidden">
									{groupedItems.map((item) => (
										<CartItem key={item.name} item={item} />
									))}
								</ul>
								<div className="mt-2 border-t border-t-base-input flex justify-between items-center py-2 text-base-label uppercase text-xs">
									Valor total:
									<span className="text-base-subtitle text-xs">
										R${" "}
										<strong className="text-xl">
											{totalValue.toFixed(2).replace(".", ",")}
										</strong>
									</span>
								</div>
								<Link
									to="/checkout"
									className="w-full block text-center py-1.5 text-xl bg-purple text-white font-bold font-baloo2 rounded-xl hover:bg-purple-dark"
								>
									Finalizar pedido
								</Link>
							</>
						) : (
							<span className="mt-2 text-base-label text-sm text-center">
								Nenhum item adicionado ao carrinho
							</span>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
