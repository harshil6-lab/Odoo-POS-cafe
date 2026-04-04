import { Card, CardHeader, CardTitle } from "../components/ui/Card"

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Global Configuration</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
