import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ConfirmationPage() {
  return (
    <div className="container max-w-md py-20 mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">Your Seattle Night Out is all set</p>
          </div>
          <div className="space-y-4">
            <p className="text-center">
              Thank you for booking with Truvay! Our Seattle concierges are already working on creating your perfect
              night out.
            </p>
            <p className="text-center text-muted-foreground">
              You'll receive an email with all the details shortly. We'll reveal each location 30 minutes before it's
              time to head there.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
