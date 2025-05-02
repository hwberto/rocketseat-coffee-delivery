import { useCallback, useMemo } from "react";
import { Link, redirect, useSubmit } from "react-router";

import { useCartStore } from "@/stores/cart";
import { v4 as uuid } from "uuid";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Item, ItemTitle, ItemImage, ItemActions } from "@/components/item";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
	PiBank,
	PiCreditCard,
	PiCurrencyDollar,
	PiMapPinLine,
	PiMoney,
	PiPlusBold,
	PiMinusBold,
	PiTrash,
} from "react-icons/pi";

export const addressSchema = z.object({
	cep: z.string().min(1, "CEP é obrigatório"),
	street: z.string().min(1, "Rua é obrigatória"),
	number: z
		.string()
		.min(1, "Número é obrigatório")
		.transform((value) => Number.parseInt(value, 10).toString()),
	adjunct: z.string().optional(),
	district: z.string().min(1, "Bairro é obrigatório"),
	city: z.string().min(1, "Cidade é obrigatória"),
	state: z.string().min(1, "Estado é obrigatório"),
});

export const paymentSchema = z.object({
	paymentMethod: z.enum(["CRÉDITO", "DÉBITO", "DINHEIRO"]),
});

export default function Checkout() {
	const submit = useSubmit();
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

	const addressForm = useForm<z.infer<typeof addressSchema>>({
		defaultValues: {
			cep: "",
			street: "",
			number: "",
			adjunct: "",
			district: "",
			city: "",
			state: "",
		},
		resolver: zodResolver(addressSchema),
		mode: "onChange",
	});

	const paymentForm = useForm<z.infer<typeof paymentSchema>>({
		defaultValues: {
			paymentMethod: undefined,
		},
		resolver: zodResolver(paymentSchema),
		mode: "onChange",
	});

	const handleSubmit = useCallback(async () => {
		try {
			const isAddressValid = await addressForm.trigger();
			const isPaymentValid = await paymentForm.trigger();

			if (!isAddressValid || !isPaymentValid) {
				return;
			}

			const addressData = addressForm.getValues();
			const paymentData = paymentForm.getValues();

			const formData = {
				address: addressData,
				payment: paymentData,
			};

			submit(
				{
					address: JSON.stringify(formData.address),
					payment: JSON.stringify(formData.payment),
				},
				{
					action: "/delivery",
					method: "POST",
				},
			);

			redirect("/delivery");
		} catch (error) {
			throw null;
		}
	}, [addressForm, paymentForm, submit]);

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
			<Item className="flex py-2 gap-4 items-center bg-transparent border-b border-b-base-button space-y-0">
				<ItemImage
					alt={item.name}
					src={`/assets/png/${item.name.replace(/\s+/g, "_").toUpperCase()}.png`}
					className="size-20"
				/>
				<div className="flex flex-col w-full space-y-2">
					<div className="flex justify-between gap-3">
						<ItemTitle className="text-xl xl:mr-5">{item.name}</ItemTitle>
						<span className="font-bold text-lg text-base-text">
							R$ {totalPrice.toFixed(2).replace(/[.]/, ",")}
						</span>
					</div>
					<ItemActions>
						<div className="bg-base-button px-2 h-8 flex items-center gap-2 text-sm [&>button]:text-purple *:cursor-pointer *:hover:opacity-75">
							<button type="button" onClick={handleDecrement}>
								<PiMinusBold />
							</button>
							{amount}
							<button type="button" onClick={handleIncrement}>
								<PiPlusBold />
							</button>
						</div>
						<button
							type="button"
							className="bg-base-button h-8 px-2 leading-8 uppercase cursor-pointer hover:opacity-75 flex items-center gap-1 text-[0.85rem] text-base-text"
							onClick={handleRemove}
						>
							<PiTrash className="text-purple text-xl" />
							Remover
						</button>
					</ItemActions>
				</div>
			</Item>
		);
	};

	return (
		<main className="mx-auto container flex max-lg:flex-col gap-3 mt-30 px-10">
			<section className="w-full space-y-7">
				<h2 className="font-baloo2 font-bold text-xl text-base-subtitle">
					Complete seu pedido
				</h2>
				<div className="w-full p-6 rounded-lg rounded-tr-4xl rounded-bl-4xl bg-base-card">
					<div className="flex gap-3">
						<PiMapPinLine className="text-2xl text-yellow-dark" />
						<div>
							<h3 className="text-lg text-base-subtitle font-bold">
								Endereço de entrega
							</h3>
							<span className="text-base-text">
								Informe o endereço onde deseja receber seu pedido
							</span>
						</div>
					</div>
					<Form {...addressForm}>
						<form className="mt-4 grid grid-cols-3 grid-rows-4 gap-4">
							<FormField
								control={addressForm.control}
								name="cep"
								render={({ field }) => (
									<FormItem className="px-3.5 py-2.5 bg-base-input border border-base-button rounded-lg">
										<FormControl>
											<Input placeholder="CEP" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={addressForm.control}
								name="street"
								render={({ field }) => (
									<FormItem className="px-3.5 py-2.5 bg-base-input border border-base-button rounded-lg col-span-3">
										<FormControl>
											<Input placeholder="Rua" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={addressForm.control}
								name="number"
								render={({ field }) => (
									<FormItem className="px-3.5 py-2.5 bg-base-input border border-base-button rounded-lg">
										<FormControl>
											<Input type="number" placeholder="Número" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={addressForm.control}
								name="adjunct"
								render={({ field }) => (
									<FormItem className="px-3.5 py-2.5 bg-base-input border border-base-button rounded-lg col-span-2 flex items-center gap-1">
										<FormControl>
											<Input
												className="w-full"
												placeholder="Complemento"
												{...field}
											/>
										</FormControl>
										<span className="text-xs italic text-base-label select-none pointer-events-auto">
											Opcional
										</span>
									</FormItem>
								)}
							/>
							<FormField
								control={addressForm.control}
								name="district"
								render={({ field }) => (
									<FormItem className="px-3.5 py-2.5 bg-base-input border border-base-button rounded-lg">
										<FormControl>
											<Input placeholder="Bairro" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={addressForm.control}
								name="city"
								render={({ field }) => (
									<FormItem className="px-3.5 py-2.5 bg-base-input border border-base-button rounded-lg">
										<FormControl>
											<Input placeholder="Cidade" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={addressForm.control}
								name="state"
								render={({ field }) => (
									<FormItem className="px-3.5 py-2.5 bg-base-input border border-base-button rounded-lg">
										<FormControl>
											<Input placeholder="Estado" max={2} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</div>
				<div className="w-full p-6 rounded-lg rounded-tr-4xl rounded-bl-4xl bg-base-card">
					<div className="flex gap-3">
						<PiCurrencyDollar className="text-2xl text-purple" />
						<div>
							<h3 className="text-lg text-base-subtitle font-bold">
								Pagamento
							</h3>
							<span className="text-base-text">
								O pagamento é feito na entrega. Escolha a forma que deseja pagar
							</span>
						</div>
					</div>
					<Form {...paymentForm}>
						<form className="mt-4">
							<FormField
								control={paymentForm.control}
								name="paymentMethod"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<RadioGroup
												className="grid max-lg:grid-rows-3 lg:grid-cols-3 gap-4"
												defaultValue={field.value}
												onChange={field.onChange}
											>
												<FormItem>
													<FormControl>
														<RadioGroupItem
															value="CRÉDITO"
															className="cursor-pointer flex items-center gap-2 rounded-lg w-full px-4 h-12.75 bg-base-input border border-base-button text-sm text-base-text data-[state=checked]:border-purple data-[state=checked]:bg-purple-light"
														>
															<PiCreditCard className="text-purple text-xl" />
															CARTÃO DE CRÉDITO
														</RadioGroupItem>
													</FormControl>
												</FormItem>
												<FormItem>
													<FormControl>
														<RadioGroupItem
															value="DÉBITO"
															className="cursor-pointer flex items-center gap-2 rounded-lg w-full px-4 h-12.75 bg-base-input border border-base-button text-sm text-base-text data-[state=checked]:border-purple data-[state=checked]:bg-purple-light"
														>
															<PiBank className="text-purple text-xl" />
															CARTÃO DE DÉBITO
														</RadioGroupItem>
													</FormControl>
												</FormItem>
												<FormItem>
													<FormControl>
														<RadioGroupItem
															value="DINHEIRO"
															className="cursor-pointer flex items-center gap-2 rounded-lg w-full px-4 h-12.75 bg-base-input border border-base-button text-sm text-base-text data-[state=checked]:border-purple data-[state=checked]:bg-purple-light"
														>
															<PiMoney className="text-purple text-xl" />
															DINHEIRO
														</RadioGroupItem>
													</FormControl>
												</FormItem>
											</RadioGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</div>
			</section>
			<section className="space-y-7">
				<h2 className="font-baloo2 font-bold text-xl text-base-subtitle">
					Cafés selecionados
				</h2>
				<div className="w-max p-6 rounded-lg rounded-tr-4xl rounded-bl-4xl bg-base-card">
					{groupedItems.length > 0 ? (
						<>
							<ul className="max-h-80 overflow-y-scroll">
								{groupedItems.map((item) => (
									<CartItem key={item.name} item={item} />
								))}
							</ul>
							<ul className="space-y-2 py-4 px-4">
								<li className="flex justify-between text-base-text text-sm">
									Total de itens
									<span className="font-bold">
										R$ {totalValue.toFixed(2).replace(/[.]/, ",")}
									</span>
								</li>
								<li className="flex justify-between text-base-text text-sm">
									Entrega
									<span className="font-bold">R$ 3,50</span>
								</li>
								<li className="flex justify-between text-base-subtitle font-bold text-lg">
									Total
									<span>
										R$ {(totalValue + 3.5).toFixed(2).replace(/[.]/, ",")}
									</span>
								</li>
							</ul>
							<button
								className="w-full block cursor-pointer text-center py-1.5 text-xl bg-yellow text-white font-bold font-baloo2 rounded-xl hover:bg-yellow-dark"
								type="button"
								onClick={handleSubmit}
							>
								Confirmar pedido
							</button>
						</>
					) : (
						<>
							<span className="mx-auto block text-base-label text-sm text-center">
								Nenhum item adicionado ao carrinho
							</span>
							<hr className="text-base-button my-3" />
							<Link
								to="/"
								className="w-full block text-center py-1.5 text-xl bg-yellow text-white font-bold font-baloo2 rounded-xl hover:bg-yellow-dark"
							>
								Voltar à página inicial
							</Link>
						</>
					)}
				</div>
			</section>
		</main>
	);
}
