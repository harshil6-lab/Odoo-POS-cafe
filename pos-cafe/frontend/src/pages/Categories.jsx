import { Card, CardHeader, CardTitle } from "../components/ui/Card"

export default function Categories() {
  return (
    <div className="page-container space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏷️</span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">Categories</h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}