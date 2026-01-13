export type CreateProductInput ={
    name: string;
    price: string;
    isActive: boolean;
}

export type Product ={
    id: number;
    name: string;
    price: number;
    img: string;
    isActive: boolean;
}

export type ProductApi = {
    id: number;
    name: string;
    price: number;
    img: string;
    is_active: boolean;
}

export const toProduct = (p:ProductApi): Product =>({
    id: p.id,
    name: p.name,
    price: p.price,
    img: p.img,
    isActive: p.is_active,
}) 

export async function getProduct(): Promise<Product[]> {
    const res = await fetch("api/products")
    if(!res.ok) throw new Error(`HTTP${res.status}`)
    const data = (await res.json()) as ProductApi[]
    return data.map(toProduct)
}


