export interface StoreFormValue {
    code: string;
    name: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine: string;
    isActive: boolean;
}

export interface Store {
    id: number ;
    code: string;
    name: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine: string;
    isActive: boolean;
}

export interface StoreApi {
    id: number;
    code: string;
    name: string;
    postal_code: string;
    prefecture: string;
    city: string;
    address_line: string;
    is_active: boolean;

}

export const toStore = (s:StoreApi): Store =>({
    id: s.id,
    code: s.code,
    name: s.name,
    postalCode: s.postal_code,
    prefecture: s.prefecture,
    city: s.city,
    addressLine: s.address_line,
    isActive: s.is_active,
}) 

export async function getStores(): Promise<Store[]> {
    const res = await fetch("/api/stores")

    if(!res.ok) throw new Error(`HTTP${res.status}`)
    const data = (await res.json()) as StoreApi[]

    return data.map(toStore)
}


