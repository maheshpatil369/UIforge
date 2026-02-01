import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
  return (
    <Card className="p-6 max-w-sm">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">UIForge Ready 🚀</h2>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
