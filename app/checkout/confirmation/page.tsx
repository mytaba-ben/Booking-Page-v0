import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="container max-w-md py-20">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          <CardDescription>Your Truvay Night Out is all set</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Thank you for booking with Truvay! Our concierges are already working on creating your perfect night out.
          </p>
          <p className="text-center text-muted-foreground">
            You'll receive an email with all the details shortly. We'll reveal each location 30 minutes before it's time
            to head there.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
