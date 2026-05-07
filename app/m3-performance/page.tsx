import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <p className="text-primary font-bold text-sm tracking-widest uppercase">M3 PERFORMANCE MANAGEMENT</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-none">대시보드</h1>
          <p className="text-muted-foreground text-sm mt-4">2026년 1분기 성과관리 현황</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <Card className="bg-primary p-6 rounded-xl shadow-card text-white border-0">
          <p className="text-secondary text-xs font-bold uppercase tracking-wider mb-2">KPI 입력 완료율</p>
          <p className="text-4xl font-black">14 <span className="text-lg font-medium ml-1 opacity-70">/ 20명</span></p>
          <div className="mt-4 flex items-center gap-2">
            <Badge className="bg-white text-primary hover:bg-white/90">진행중</Badge>
            <span className="text-sm opacity-80">마감 3일 전</span>
          </div>
        </Card>

        <Card className="bg-white p-6 rounded-xl shadow-card border border-border">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">본평가 확정률</p>
          <p className="text-4xl font-black text-foreground">6 <span className="text-lg font-medium ml-1 text-slate-400">/ 20건</span></p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="warning">검토중</Badge>
          </div>
        </Card>

        <Card className="bg-warning p-6 rounded-xl shadow-card text-white border-0">
          <p className="opacity-80 text-xs font-bold uppercase tracking-wider mb-2">산출 엔진 현황</p>
          <p className="text-4xl font-black">6<span className="text-lg font-medium ml-1 opacity-70">건 정상</span></p>
          <div className="mt-4 flex items-center gap-2">
            <Badge className="bg-white text-warning hover:bg-white/90">가동중</Badge>
            <span className="text-sm opacity-80">최근 산출: 10분 전</span>
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
                  <p className="text-sm font-medium">직원 [E007] 본평가가 확정되어 성과급 산출 엔진이 트리거되었습니다.</p>
                  <p className="text-xs text-muted-foreground mt-1">10분 전</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b pb-4">
                <Badge variant="danger">오류</Badge>
                <div>
                  <p className="text-sm font-medium">직원 [E012] KPI 입력 가중치 100% 미달 (잔여 15%). 입력 보완이 필요합니다.</p>
                  <p className="text-xs text-muted-foreground mt-1">2시간 전</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
