"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function EvalPage() {
  const [selfScore, setSelfScore] = useState("");
  const [mainScore, setMainScore] = useState("");
  const [finalized, setFinalized] = useState(false);

  const handleFinalize = () => {
    if (!mainScore) {
      alert("본평가 점수를 입력해주세요.");
      return;
    }
    setFinalized(true);
    alert("본평가가 확정되었습니다. 성과급 산출 엔진이 트리거됩니다.");
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <p className="text-primary font-bold text-sm tracking-widest uppercase">EVALUATION</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-none">평가 진행</h1>
          <p className="text-muted-foreground text-sm mt-4">자기평가 및 사업부장 본평가</p>
        </div>
      </header>

      <Tabs defaultValue="self" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="self">1차: 자기평가</TabsTrigger>
          <TabsTrigger value="main">2차: 사업부장 본평가</TabsTrigger>
        </TabsList>
        
        <TabsContent value="self">
          <Card className="kch-card max-w-2xl">
            <CardHeader>
              <CardTitle>자기평가 입력</CardTitle>
              <CardDescription>올 한해 본인의 성과를 평가해주세요. (1~100점)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">자기평가 점수</label>
                  <input 
                    type="number" 
                    value={selfScore}
                    onChange={(e) => setSelfScore(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="예: 85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">핵심 기여 내역</label>
                  <textarea 
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="올해 가장 큰 성과 및 기여도를 작성해주세요."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button 
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80 transition-colors"
                onClick={() => alert("자기평가가 제출되었습니다.")}
              >
                자기평가 제출
              </button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="main">
          <Card className="kch-card max-w-2xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>사업부장 본평가</CardTitle>
                  <CardDescription>조직원들의 자기평가를 바탕으로 최종 평가 점수를 부여합니다.</CardDescription>
                </div>
                {finalized && <Badge variant="success">확정 완료</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md mb-6 space-y-2">
                <h4 className="font-semibold text-sm">직원: E007 (김직원)</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">자기평가 점수</span>
                  <span className="font-medium text-primary">85점</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">본평가 점수 (확정용)</label>
                  <input 
                    type="number" 
                    value={mainScore}
                    onChange={(e) => setMainScore(e.target.value)}
                    disabled={finalized}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    placeholder="예: 90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">코멘트</label>
                  <textarea 
                    disabled={finalized}
                    className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    placeholder="평가 의견을 작성해주세요."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button 
                className="rounded-md bg-warning px-4 py-2 text-sm font-semibold text-white hover:bg-warning/80 transition-colors disabled:opacity-50"
                onClick={handleFinalize}
                disabled={finalized}
              >
                본평가 확정 및 산출 트리거
              </button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
