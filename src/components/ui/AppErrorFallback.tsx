// import type { FallbackProps } from "react-error-boundary";
// import { Link } from "react-router-dom";
// import { Button } from "./button";

// export function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
//   const message = error instanceof Error ? error.message : String(error);

//   return (<>
//     <div className="p-6">
//       <h1>予期しないエラーが発生しました</h1>
//       <p className="whitespace-pre-wrap">{message}</p>

//       <div className="flex flex-col items-center gap-4 mt-4" >
//         <Button variant="outline" onClick={resetErrorBoundary}>再読み込み</Button>
//         <Button variant="outline"><Link to="/">ホームへ戻る</Link></Button>
//       </div>
//     </div>

//   </>);
// }

import type { FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; 


export function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);

  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : "";

  const goHome = () => {
    // ErrorBoundary状態を先にリセット → その後に遷移（事故が減る）
    resetErrorBoundary();
    navigate("/");
    toast.message("ホームへ戻りました"); 
  };

  const reload = () => {
    // SPA内リセットより確実に直したいとき用
    window.location.reload();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border bg-background p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full border p-2">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              予期しないエラーが発生しました
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              もう一度試すか、ホームへ戻ってください。解決しない場合は再読み込みをお試しください。
            </p>

            <div className="mt-4 rounded-lg bg-muted p-3">
              <p className="text-sm whitespace-pre-wrap break-words">
                {message || "エラーメッセージが取得できませんでした"}
              </p>

              {stack && (
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2"
                    onClick={() => setShowDetail((v) => !v)}
                  >
                    {showDetail ? "詳細を隠す" : "詳細を表示"}
                  </Button>

                  {showDetail && (
                    <pre className="mt-2 max-h-48 overflow-auto rounded-md border bg-background p-3 text-xs whitespace-pre-wrap break-words">
                      {stack}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" 
              onClick={()=>{
                resetErrorBoundary();
                toast.message("再実行しました");
                }}>
                再実行
              </Button>

              <Button variant="outline" onClick={reload}>
                再読み込み
              </Button>

              <Button onClick={goHome}>
                ホームへ戻る
              </Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
