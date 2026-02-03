 interface Store {
  id: number
  name: string
}

export async function fetchStores(): Promise<Store[]> {
  const res = await fetch("/api/stores")
  const data = (await res.json()) as Store[]

  if (!res.ok) throw new Error("storesの取得に失敗しました")

  return data
}


