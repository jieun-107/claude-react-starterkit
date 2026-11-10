// 소개 페이지 예제 (lazy 로딩 대상)
export function AboutPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold tracking-tight">소개</h1>
      <p className="text-muted-foreground">
        이 페이지는 필요할 때만 불러오도록 lazy 로딩으로 구성되었습니다.
      </p>
    </section>
  )
}
