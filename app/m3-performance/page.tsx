"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSheet } from "@/hooks/use-sheet"

export default function DashboardPage() {
  const employees = useSheet("master", "employees")
  const evals = useSheet("master", "eval_5stage")
  const salaries = useSheet("master", "salary_calc")
  const inputs = useSheet("input", "input_status")

  const totalEmployees = employees.data.length
  const inputDone = new Set(inputs.data.map((r) => r.empId)).size
  const evalDone = evals.data.length
  const calcDone = salaries.data.length

  const loading = employees.loading || evals.loading || salaries.loading || inputs.loading
  const error = employees.error ?? evals.error ?? salaries.error ?? inputs.error

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <p className="text-primary font-bold text-sm tracking-widest uppercase">M3 PERFORMANCE MANAGEMENT</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-none">대시보드</h1>
          <p className="text-muted-foreground text-sm mt-4">2026년 1분기 성과관리 현황</p>
        </div>
      </header>

      {error && <p className="text-sm text-danger">데이터 로드 에러: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <Card className="bg-primary p-6 rounded-xl shadow-card text-white border-0">
          <p className="text-secondary text-xs font-bold uppercase tracking-wider mb-2">KPI 입력 완료율</p>
          <p className="text-4xl font-black">
            {loading ? "..." : inputDone}{" "}
            <span className="text-lg font-medium ml-1 opacity-70">/ {totalEmployees}명</span>
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge className="bg-white text-primary hover:bg-white/90">진행중</Badge>
            <span className="text-sm opacity-80">입력 시트 기준</span>
          </div>
        </Card>

        <Card className="bg-white p-6 rounded-xl shadow-card border border-border">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">본평가 확정률</p>
          <p className="text-4xl font-black text-foreground">
            {loading ? "..." : evalDone}{" "}
            <span className="text-lg font-medium ml-1 text-slate-400">/ {totalEmployees}건</span>
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="warning">검토중</Badge>
          </div>
        </Card>

        <Card className="bg-warning p-6 rounded-xl shadow-card text-white border-0">
          <p className="opacity-80 text-xs font-bold uppercase tracking-wider mb-2">산출 엔진 현황</p>
          <p className="text-4xl font-black">
            {loading ? "..." : calcDone}
            <span className="text-lg font-medium ml-1 opacity-70">건 정상</span>
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge className="bg-white text-warning hover:bg-white/90">가동중</Badge>
            <span className="text-sm opacity-80">salary_calc 기준</span>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="kch-card">
          <CardHeader>
            <CardTitle>최근 알림</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b pb-4">
                <Badge variant="outline">시스템</Badge>
                <div>
                  <p className="text-sm font-medium">
                    {loading
                      ? "데이터를 불러오는 중..."
                      : `eval_5stage ${evalDone}건, salary_calc ${calcDone}건이 시트에 적재되어 있습니다.`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">실시간</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b pb-4">
                <Badge variant="outline">입력</Badge>
                <div>
                  <p className="text-sm font-medium">
                    {loading
                      ? "..."
                      : `input_status에 ${inputs.data.length}개 행이 누적되어 있습니다 (직원 ${inputDone}명).`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">실시간</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
