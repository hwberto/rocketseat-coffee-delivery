enum Tags {
	TRADICIONAL = "Tradicional",
	GELADO = "Gelado",
	COM_LEITE = "Com leite",
	ALCOÓLICO = "Alcoólico",
	ESPECIAL = "Especial",
}

type Coffee = {
	name: string;
	description: string;
	price: number;
	tags: Tags[];
};

const coffees: Coffee[] = [
	{
		name: "Expresso Tradicional",
		description: "O tradicional café feito com água quente e grãos moídos",
		price: 9.9,
		tags: [Tags.TRADICIONAL],
	},
	{
		name: "Expresso Americano",
		description: "Expresso diluído, menos intenso que o tradicional",
		price: 9.9,
		tags: [Tags.TRADICIONAL],
	},
	{
		name: "Expresso Cremoso",
		description: "Café expresso tradicional com espuma cremosa",
		price: 9.9,
		tags: [Tags.TRADICIONAL],
	},
	{
		name: "Expresso Gelado",
		description: "Bebida preparada com café expresso e cubos de gelo",
		price: 9.9,
		tags: [Tags.TRADICIONAL, Tags.GELADO],
	},
	{
		name: "Café com Leite",
		description: "Meio a meio de expresso tradicional com leite vaporizado",
		price: 9.9,
		tags: [Tags.TRADICIONAL, Tags.COM_LEITE],
	},
	{
		name: "Latte",
		description:
			"Uma dose de café expresso com o dobro de leite e espuma cremosa",
		price: 9.9,
		tags: [Tags.TRADICIONAL, Tags.COM_LEITE],
	},
	{
		name: "Capuccino",
		description:
			"Bebida com canela feita de doses iguais de café, leite e espuma",
		price: 9.9,
		tags: [Tags.TRADICIONAL, Tags.COM_LEITE],
	},
	{
		name: "Macchiato",
		description:
			"Café expresso misturado com um pouco de leite quente e espuma",
		price: 9.9,
		tags: [Tags.TRADICIONAL, Tags.COM_LEITE],
	},
	{
		name: "Mocaccino",
		description: "Café expresso com calda de chocolate, pouco leite e espuma",
		price: 9.9,
		tags: [Tags.TRADICIONAL, Tags.COM_LEITE],
	},
	{
		name: "Chocolate Quente",
		description: "Bebida feita com chocolate dissolvido no leite quente e café",
		price: 9.9,
		tags: [Tags.ESPECIAL, Tags.COM_LEITE],
	},
	{
		name: "Cubano",
		description:
			"Drink gelado de café expresso com rum, creme de leite e hortelã",
		price: 9.9,
		tags: [Tags.ESPECIAL, Tags.ALCOÓLICO, Tags.GELADO],
	},
	{
		name: "Havaiano",
		description: "Bebida adocicada preparada com café e leite de coco",
		price: 9.9,
		tags: [Tags.ESPECIAL],
	},
	{
		name: "Árabe",
		description: "Bebida preparada com grãos de café árabe e especiarias",
		price: 9.9,
		tags: [Tags.ESPECIAL],
	},
	{
		name: "Irlandês",
		description: "Bebida a base de café, uísque irlandês, açúcar e chantilly",
		price: 9.9,
		tags: [Tags.ESPECIAL, Tags.ALCOÓLICO],
	},
];

export { coffees, Tags, type Coffee };
