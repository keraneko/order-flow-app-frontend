export type Product ={
    id: number;
    name: string;
    price: number;
    img: string;
}

const products: Product[] =[
    {
        id: 1,
        name: "唐揚げ弁当",
        price: 500,
        img: 'src/imgage/image001.jpg',

    },
    {
        id: 2,
        name: "カレーライス",
        price: 450,
        img: 'src/imgage/image01.jpg',
    },
    {
        id: 3,
        name: "ハヤシライス",
        price: 700,
        img: 'src/imgage/image01.jpg',
    },
    {
        id: 4,
        name: "塩からあげ弁当",
        price: 500,
        img: 'src/imgage/image001.jpg',
    },
    {
        id: 5,
        name: "チキンカレー",
        price: 550,
        img: 'src/imgage/image01.jpg',
    },
]

export default products;