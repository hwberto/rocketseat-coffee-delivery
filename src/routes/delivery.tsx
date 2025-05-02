import { useEffect } from "react";
import { Link, useActionData } from "react-router";

import { useCartStore } from "@/stores/cart";

import { PiCurrencyDollar, PiMapPinFill, PiTimerFill } from "react-icons/pi";

export default function Delivery() {
	const actionData = useActionData();
	const clearCart = useCartStore((state) => state.clearCart);
	const paymentMethod = () => {
		switch (actionData?.payment.paymentMethod) {
			case "CRÉDITO":
				return "Cartão de Cŕedito";
			case "DÉBITO":
				return "Cartão de Débito";
			case "DINHEIRO":
				return "Dinheiro";
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		clearCart();
	}, []);

	return (
		<main className="mx-auto container mt-30 px-10 flex lg:justify-between items-center max-lg:flex-col lg:gap-10">
			{actionData ? (
				<>
					<section className="space-y-2">
						<h2 className="font-baloo2 font-bold text-yellow-dark text-3xl">
							Uhu! Pedido confirmado
						</h2>
						<h3 className="text-xl text-base-subtitle">
							Agora é só aguardar que logo o café chegará até você
						</h3>
						<div className="mt-10 space-y-2 py-6 pl-6 relative rounded-lg rounded-bl-4xl rounded-tr-4xl bg-background before:content-[''] before:-z-10 before:block before:-inset-0.25 before:absolute before:rounded-bl-4xl before:rounded-tr-4xl before:rounded-lg before:bg-gradient-to-br before:from-yellow before:to-purple *:flex *:gap-3 *:items-center *:p-1 *:text-base-text *:[&>svg]:p-2 *:[&>svg]:rounded-full *:[&>svg]:text-4xl *:[&>svg]:text-white">
							<li>
								<PiMapPinFill className="bg-purple" />
								<div>
									<p>
										Entrega em{" "}
										<strong>
											{actionData.address.street}, {actionData.address.number}
										</strong>
									</p>
									<p>
										{actionData.address.district} - {actionData.address.city},{" "}
										{actionData.address.state}
									</p>
								</div>
							</li>
							<li>
								<PiTimerFill className="bg-yellow" />
								<div>
									<p>Previsão de entrega</p>
									<strong>20 min - 30 min</strong>
								</div>
							</li>
							<li>
								<PiCurrencyDollar className="bg-yellow-dark" />
								<div>
									<p>Pagamento na entrega</p>
									<strong>{paymentMethod()}</strong>
								</div>
							</li>
						</div>
					</section>
					<img src="/assets/svg/delivery-bike.svg" alt="" />
				</>
			) : (
				<main className="mx-auto container flex flex-col justify-center items-center gap-5">
					<h1 className="font-baloo2 text-4xl font-bold text-base-subtitle">
						Algo de errado não está certo...
					</h1>
					<span className="text-base-text">
						Parece que você não fez nenhum pedido por enquanto.
					</span>
					<Link
						to="/"
						className="block text-center py-1.5 px-10 text-xl bg-yellow text-white font-bold font-baloo2 rounded-xl hover:bg-yellow-dark"
					>
						Voltar à página inicial
					</Link>
				</main>
			)}
		</main>
	);
}
