import { Card, CardHeader, CardTitle } from "../components/ui/Card"

export default function Categories() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}