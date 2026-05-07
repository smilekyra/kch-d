"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"

const mockData = [
  { id: "E007", name: "김직원", dept: "개발1팀", rank: "pm", score: 92, grade: "EX" },
  { id: "E012", name: "박사원", dept: "영업팀", rank: "am", score: 85, grade: "VG" },
  { id: "E003", name: "이대리", dept: "마케팅", rank: "pm", score: 78, grade: "GD" },
  { id: "E009", name: "최과장", dept: "인사팀", rank: "director", score: 65, grade: "NI" },
  { id: "E020", name: "정임원", dept: "기획팀", rank: "director", score: 50, grade: "UN" },
];

export default function ResultPage() {
  const getGradeBadge = (grade: string) => {
    switch(grade) {
      case "EX": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700">EX</span>;
      case "VG": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">VG</span>;
      case "GD": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700">GD</span>;
      case "NI": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">NI</span>;
      case "UN": return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">UN</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">{grade}</span>;
    }
  }

  const columns = [
    { key: "id", header: "사원 토큰" },
    { key: "dept", header: "부서" },
    { key: "rank", header: "직급/분기", render: (row: any) => <span className="uppercase text-muted-foreground text-xs font-bold">{row.rank}</span> },
    { key: "score", header: "본평가 점수", className: "text-right font-medium" },
    { key: "grade", header: "산출 등급", render: (row: any) => getGradeBadge(row.grade) },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <p className="text-primary font-bold text-sm tracking-widest uppercase">RESULTS</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-none">등급별 분기 비율</h1>
          <p className="text-muted-foreground text-sm mt-4">본평가 점수 기반 5등급 KCH 평가 결과입니다.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { grade: "EX", desc: "탁월", count: 1, color: "bg-success text-white" },
          { grade: "VG", desc: "우수", count: 1, color: "bg-primary text-white" },
          { grade: "GD", desc: "양호", count: 1, color: "bg-secondary text-white" },
          { grade: "NI", desc: "개선필요", count: 1, color: "bg-warning text-white" },
          { grade: "UN", desc: "미흡", count: 1, color: "bg-danger text-white" },
        ].map((item) => (
          <Card key={item.grade} className="kch-card overflow-hidden">
            <div className={`-mt-6 -mx-6 mb-4 px-6 py-3 text-xs font-bold uppercase tracking-wider ${item.color}`}>
              {item.grade} ({item.desc})
            </div>
            <div className="text-4xl font-black text-center">{item.count}<span className="text-lg font-medium ml-1 opacity-70">명</span></div>
          </Card>
        ))}
      </div>

      <Card className="kch-card mt-8">
        <CardHeader>
          <CardTitle>전체 임직원 등급 현황</CardTitle>
          <CardDescription>익명화 처리된 KCH 등급 산출 데이터입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockData} />
        </CardContent>
      </Card>
    </div>
  )
}
