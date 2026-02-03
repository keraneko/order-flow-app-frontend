// src/pages/NotFound.tsx
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border bg-background p-6 shadow-sm">
        <h1 className="text-lg font-semibold">ページが見つかりません</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          URLが間違っているか、ページが移動/削除された可能性があります。
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => void navigate(-1)}>
            戻る
          </Button>
          <Button onClick={() => void navigate("/")}>
            ホームへ戻る
          </Button>
        </div>
      </div>
    </div>
  )
}
