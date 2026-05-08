"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { appendToSheet, useSheet } from "@/hooks/use-sheet"

type KpiItem = { id: number; title: string; weight: number }

export default function KpiInputPage() {
  const employees = useSheet("master", "employees")
  const kpiTargets = useSheet("master", "kpi_targets")

  const empIds = useMemo(
    () => Array.from(new Set(employees.data.map((e) => e.empId).filter(Boolean))),
    [employees.data],
  )
  const [empId, setEmpId] = useState<string>("")
  useEffect(() => {
    if (!empId && empIds.length > 0) setEmpId(empIds[0])
  }, [empId, empIds])

  const [kpis, setKpis] = useState<KpiItem[]>([])
  useEffect(() => {
    if (!empId) return
    const seeded: KpiItem[] = kpiTargets.data
      .filter((r) => r.empId === empId && (r.status === "" || r.status === "active"))
      .map((r, i) => ({
        id: Date.now() + i,
        title: r.kpiName,
        weight: Number(r.weight) || 0,
      }))
    setKpis(seeded)
  }, [empId, kpiTargets.data])

  const [newTitle, setNewTitle] = useState("")
  const [newWeight, setNewWeight] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const weightSum = kpis.reduce((acc, kpi) => acc + kpi.weight, 0)

  const addKpi = () => {
    if (!newTitle || !newWeight) return
    const weight = parseInt(newWeight, 10)
    if (isNaN(weight) || weight <= 0) return
    if (weightSum + weight > 100) {
      alert("가중치 합은 100%를 초과할 수 없습니다.")
      return
    }
    setKpis([...kpis, { id: Date.now(), title: newTitle, weight }])
    setNewTitle("")
    setNewWeight("")
  }

  const removeKpi = (id: number) => {
    setKpis(kpis.filter((k) => k.id !== id))
  }

  const submitKpi = async () => {
    if (weightSum !== 100) {
      alert("가중치 합이 100%가 되어야 제출 가능합니다.")
      return
    }
    if (!empId) {
      alert("직원을 선택해주세요.")
      return
    }
    setSubmitting(true)
    try {
      const timestamp = new Date().toISOString()
      for (const kpi of kpis) {
        await appendToSheet("input", "input_status", {
          timestamp,
          empId,
          kpiName: kpi.title,
          weight: String(kpi.weight),
          status: "submitted",
        })
      }
      alert("KPI가 확정되어 입력 시트에 저장되었습니다.")
    } catch (e) {
      alert(`저장 실패: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setSubmitting(false)
    }
  }

  const loading = employees.loading || kpiTargets.loading
  const error = employees.error ?? kpiTargets.error

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <p className="text-primary font-bold text-sm tracking-widest uppercase">KPI MODULE</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-none">KPI 입력 폼</h1>
          <p className="text-muted-foreground text-sm mt-4">평가 분기별 KPI와 가중치를 입력해주세요.</p>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">직원 선택</label>
          <select
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          >
            {empIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      </header>

      {error && <p className="text-sm text-danger">데이터 로드 에러: {error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="kch-card">
            <CardHeader>
              <CardTitle>목표 리스트</CardTitle>
              <CardDescription>현재 시트에 등록된 KPI를 불러왔습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
                {!loading && kpis.map((kpi, index) => (
                  <div key={kpi.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <span className="font-semibold text-sm mr-2 text-primary">Goal {index + 1}</span>
                      <span className="text-sm">{kpi.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{kpi.weight}%</Badge>
                      <button
                        onClick={() => removeKpi(kpi.id)}
                        className="text-danger hover:text-danger/80 p-1 text-sm font-semibold"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}

                {!loading && kpis.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground border border-dashed rounded-md">
                    등록된 KPI가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="kch-card">
            <CardHeader>
              <CardTitle>신규 KPI 등록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="KPI 항목명"
                  className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="가중치"
                    className="w-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm font-medium">%</span>
                </div>
                <button
                  onClick={addKpi}
                  className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  disabled={weightSum >= 100}
                >
                  추가
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="kch-card sticky top-6">
            <CardHeader>
              <CardTitle>검증 및 제출</CardTitle>
              <CardDescription>가중치 규칙 검증</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">현재 가중치 합</span>
                  <span className={`text-lg font-bold ${weightSum === 100 ? 'text-success' : weightSum > 100 ? 'text-danger' : 'text-primary'}`}>
                    {weightSum}%
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">잔여 가중치</span>
                  <span className="text-sm font-medium text-muted-foreground">{Math.max(0, 100 - weightSum)}%</span>
                </div>

                <div className="pt-4">
                  {weightSum === 100 ? (
                    <div className="bg-success/10 text-success p-3 rounded-md text-sm font-medium">
                      ✓ 가중치 검증 통과 (100%)
                    </div>
                  ) : (
                    <div className="bg-danger/10 text-danger p-3 rounded-md text-sm font-medium">
                      ⚠ 가중치 합이 100%가 필요합니다.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/80 transition-colors disabled:opacity-50"
                disabled={weightSum !== 100 || submitting}
                onClick={submitKpi}
              >
                {submitting ? "제출 중..." : "KPI 확정 및 제출"}
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
