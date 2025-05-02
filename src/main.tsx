import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./routes/home";
import Checkout from "./routes/checkout";
import Delivery from "./routes/delivery";

import { Layout } from "./components/layout";

import "@/styles/globals.css";

const router = createBrowserRouter([
	{
		Component: Layout,
		children: [
			{ index: true, Component: Home },
			{
				path: "checkout",
				Component: Checkout,
			},
			{
				path: "delivery",
				Component: Delivery,
				action: async ({ request }) => {
					const formData = await request.formData();
					const address = JSON.parse(formData.get("address")?.toString() || "");
					const payment = JSON.parse(formData.get("payment")?.toString() || "");
					return {
						address,
						payment,
					};
				},
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<RouterProvider router={router} />,
);
