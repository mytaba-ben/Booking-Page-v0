"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface PaymentFormProps {
  data: any
  onComplete: () => void
  onBack: () => void
}

export function PaymentForm({ data, onComplete, onBack }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      setCardDetails({
        ...cardDetails,
        [name]: formatted,
      })
      return
    }

    // Format expiry date
    if (name === "expiry") {
      const cleaned = value.replace(/\D/g, "")
      let formatted = cleaned
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
      }
      setCardDetails({
        ...cardDetails,
        [name]: formatted,
      })
      return
    }

    setCardDetails({
      ...cardDetails,
      [name]: value,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number"
    }
    if (!cardDetails.cardName) newErrors.cardName = "Cardholder name is required"
    if (!cardDetails.expiry || !cardDetails.expiry.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiry = "Please enter a valid expiry date (MM/YY)"
    }
    if (!cardDetails.cvc || !cardDetails.cvc.match(/^\d{3,4}$/)) {
      newErrors.cvc = "Please enter a valid CVC code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      setIsProcessing(true)

      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false)
        onComplete()
      }, 2000)
    }
  }

  // Calculate total amount
  const totalAmount = Number.parseInt(data.budget) * data.groupSize

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="rounded-lg border p-4 mb-4">
          <h3 className="font-medium mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                Truvay Night Out ({data.groupSize} {data.groupSize === 1 ? "person" : "people"})
              </span>
              <span>${totalAmount}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>${totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Payment Details</h3>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={handleChange}
              maxLength={19}
            />
            {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="John Smith"
              value={cardDetails.cardName}
              onChange={handleChange}
            />
            {errors.cardName && <p className="text-sm text-red-500">{errors.cardName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleChange}
                maxLength={5}
              />
              {errors.expiry && <p className="text-sm text-red-500">{errors.expiry}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                name="cvc"
                placeholder="123"
                value={cardDetails.cvc}
                onChange={handleChange}
                maxLength={4}
                type="password"
              />
              {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay $${totalAmount}`}
        </Button>
      </div>
    </form>
  )
}
