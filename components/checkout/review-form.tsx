"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

interface ReviewFormProps {
  data: any
  onNext: (data: any) => void
  onBack: () => void
}

export function ReviewForm({ data, onNext, onBack }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    essentialComms: data.essentialComms !== undefined ? data.essentialComms : true,
    marketingComms: data.marketingComms || false,
  })
  const [errors, setErrors] = useState({})

  const handleEssentialCommsChange = (checked) => {
    setFormData({
      ...formData,
      essentialComms: checked,
    })
  }

  const handleMarketingCommsChange = (checked) => {
    setFormData({
      ...formData,
      marketingComms: checked,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.essentialComms) {
      newErrors.essentialComms = "We need your permission to send essential communications about your booking"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onNext(formData)
    }
  }

  // Format interests for display
  const interestOptions = {
    food: "Food & Dining",
    drinks: "Drinks & Nightlife",
    arts: "Arts & Culture",
    music: "Live Music",
    outdoor: "Outdoor Activities",
    sports: "Sports & Recreation",
    games: "Games & Entertainment",
    wellness: "Wellness & Relaxation",
    shopping: "Shopping & Markets",
  }

  const formatInterests = () => {
    return data.interests.map((id) => interestOptions[id] || id).join(", ")
  }

  // Format meals for display
  const mealOptions = {
    dinner: "Dinner",
    drinks: "Drinks",
    dessert: "Dessert/Snacks",
    none: "No food or drinks",
  }

  const formatMeals = () => {
    return data.includeMeals.map((id) => mealOptions[id] || id).join(", ")
  }

  // Format occasion for display
  const occasionOptions = {
    none: "No special occasion",
    birthday: "Birthday",
    anniversary: "Anniversary",
    date: "Date night",
    celebration: "General celebration",
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Booking Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-muted-foreground">Name:</p>
              <p>
                {data.firstName} {data.lastName}
              </p>

              <p className="text-muted-foreground">Phone:</p>
              <p>{data.phoneNumber}</p>

              <p className="text-muted-foreground">Group Size:</p>
              <p>
                {data.groupSize} {data.groupSize === 1 ? "person" : "people"}
              </p>

              <p className="text-muted-foreground">Date:</p>
              <p>{data.date ? format(new Date(data.date), "PPP") : "Not selected"}</p>

              <p className="text-muted-foreground">Time:</p>
              <p>{data.startTime}</p>

              <p className="text-muted-foreground">Budget:</p>
              <p>${data.budget} per person</p>

              <p className="text-muted-foreground">Interests:</p>
              <p>{formatInterests()}</p>

              {data.includeMeals && data.includeMeals.length > 0 && (
                <>
                  <p className="text-muted-foreground">Include Meals:</p>
                  <p>{formatMeals()}</p>
                </>
              )}

              {data.specialOccasion && data.specialOccasion !== "none" && (
                <>
                  <p className="text-muted-foreground">Special Occasion:</p>
                  <p>{occasionOptions[data.specialOccasion] || data.specialOccasion}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              id="essentialComms"
              checked={formData.essentialComms}
              onCheckedChange={handleEssentialCommsChange}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="essentialComms" className="font-medium">
                Essential communications for Your Truvay Night Out
              </Label>
              <p className="text-sm text-muted-foreground">
                I agree to receive text messages and emails from Truvay that are essential for managing and delivering
                my booked Truvay Night Out.
              </p>
            </div>
          </div>
          {errors.essentialComms && <p className="text-sm text-red-500">{errors.essentialComms}</p>}

          <div className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              id="marketingComms"
              checked={formData.marketingComms}
              onCheckedChange={handleMarketingCommsChange}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="marketingComms" className="font-medium">
                Stay Updated with Truvay
              </Label>
              <p className="text-sm text-muted-foreground">
                I'd like to stay in the loop with future Truvay offerings, special promotions, and news!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Proceed to Payment</Button>
      </div>
    </form>
  )
}
