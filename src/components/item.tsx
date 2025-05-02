import { cn } from "@/lib/utils";

function Item({ className, children, ...props }: React.ComponentProps<"li">) {
	return (
		<li
			className={cn(
				"p-3 bg-base-card rounded-bl-4xl rounded-tr-4xl rounded-tl-lg rounded-br-lg space-y-2",
				className,
			)}
			{...props}
		>
			{children}
		</li>
	);
}

function ItemTitle({
	className,
	children,
	...props
}: React.ComponentProps<"h2">) {
	return (
		<h2
			className={cn("font-baloo2 font-bold text-base-subtitle", className)}
			{...props}
		>
			{children}
		</h2>
	);
}

function ItemDescription({
	className,
	children,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span className="text-base-label text-[0.95rem]" {...props}>
			{children}
		</span>
	);
}

function ItemImage({
	className,
	src,
	alt,
	...props
}: React.ComponentProps<"img">) {
	return (
		// biome-ignore lint/a11y/useAltText: <explanation>
		<img src={src} alt={alt} className={className} {...props} />
	);
}

function ItemActions({
	className,
	children,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			className={cn("flex gap-3 items-center *:rounded-lg", className)}
			{...props}
		>
			{children}
		</ul>
	);
}

export { Item, ItemTitle, ItemDescription, ItemImage, ItemActions };
