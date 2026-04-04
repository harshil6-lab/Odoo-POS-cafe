import { Card, CardHeader, CardTitle } from "../components/ui/Card"

export default function Products() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}