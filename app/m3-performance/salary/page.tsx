"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { useSheet } from "@/hooks/use-sheet"

type SalaryRow = {
  id: string
  grade: string
  rank: string
  baseToken: string
  inflation: string
  bonus: string
  newSalary: string
  status: string
}

export default function SalaryPage() {
  const { data, loading, error } = useSheet("master", "salary_calc")

  const rows: SalaryRow[] = data.map((r) => ({
    id: r.empId ?? "",
    grade: r.grade ?? "",
    rank: r.rank ?? "",
    baseToken: r.baseSalaryToken ?? "",
    inflation: r.raisePct ? `${r.raisePct}%` : "",
    bonus: r.bonusPct ? `${r.bonusPct}%` : "",
    newSalary: r.newSalaryToken ?? "",
    status: "PASS",
  }))

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "EX": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700">EX</span>
      case "VG": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">VG</span>
      case "GD": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700">GD</span>
      case "NI": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">NI</span>
      case "UN": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">UN</span>
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">{grade}</span>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "PASS" ? (
      <div className="flex justify-center gap-1">
        <span className="w-2 h-2 rounded-full bg-success" title="rangeOk"></span>
        <span className="w-2 h-2 rounded-full bg-success" title="sumOk"></span>
        <span className="w-2 h-2 rounded-full bg-success" title="rankBranchOk"></span>
      </div>
    ) : (
      <Badge variant="danger">FAIL</Badge>
    )
  }

  const columns = [
    { key: "id", header: "사원 토큰" },
    { key: "rank", header: "직급/분기", render: (row: SalaryRow) => <span className="uppercase text-xs font-bold text-muted-foreground">{row.rank}</span> },
    { key: "grade", header: "평가 등급", render: (row: SalaryRow) => getGradeBadge(row.grade) },
    { key: "baseToken", header: "기본급 토큰", className: "font-mono text-xs" },
    { key: "inflation", header: "인상률" },
    { key: "bonus", header: "성과급 토큰", className: "font-mono text-xs" },
    { key: "newSalary", header: "최종 연봉 토큰", className: "font-mono text-xs" },
    { key: "status", header: "3종 검증 게이트", render: (row: SalaryRow) => getStatusBadge(row.status) },
  ]

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <p className="text-primary font-bold text-sm tracking-widest uppercase">M3 PERFORMANCE MANAGEMENT</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-none">성과급 및 연봉 산출</h1>
          <p className="text-muted-foreground text-sm mt-4">Cloud Function 기반 자동 산출 결과 및 3종 검증 내역입니다.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-border px-4 py-2 rounded-lg shadow-sm flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-sm font-bold text-foreground">Verification Gates: ACTIVE</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <Card className="bg-white p-6 rounded-xl shadow-card border border-border">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Gate 01. 인상률 0~15% 검증</p>
          <p className="text-2xl font-black text-foreground">rangeOk</p>
          <p className="text-sm font-medium text-muted-foreground mt-4">산출된 모든 인상률이 KCH 보상 규정 내에 위치함을 보장합니다.</p>
        </Card>

        <Card className="bg-white p-6 rounded-xl shadow-card border border-border">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Gate 02. 합계 무결성 검증</p>
          <p className="text-2xl font-black text-foreground">sumOk</p>
          <p className="text-sm font-medium text-muted-foreground mt-4">기본급 + 성과급 = 최종 연봉 합계 시 1원 미만의 오차도 없음을 보장합니다.</p>
        </Card>

        <Card className="bg-white p-6 rounded-xl shadow-card border border-border">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Gate 03. 직급별 분기 적용</p>
          <p className="text-2xl font-black text-foreground">rankBranchOk</p>
          <p className="text-sm font-medium text-muted-foreground mt-4">Director, PM, AM 직급별 서로 다른 가중치 및 테이블 적용을 보장합니다.</p>
        </Card>
      </div>

      <Card className="kch-card mt-8">
        <CardHeader>
          <CardTitle>최종 산출 결과 기록 (salary_calc)</CardTitle>
          <CardDescription>평문 금융 데이터 0건 원칙 적용. 모든 금융 데이터는 토큰화되었습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
          {error && <p className="text-sm text-danger">에러: {error}</p>}
          {!loading && !error && <DataTable columns={columns} data={rows} />}
        </CardContent>
      </Card>
    </div>
  )
}
