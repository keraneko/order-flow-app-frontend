 type Store = {
  id: number
  name: string
}

export async function fetchStores(): Promise<Store[]> {
  const res = await fetch("/api/stores")
  if (!res.ok) throw new Error("storesの取得に失敗しました")
  return res.json()
}
