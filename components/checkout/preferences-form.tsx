"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PreferencesFormProps {
  data: {
    interests: string[]
    interestsOther: string
    exclusions: string
  }
  onNext: (data: any) => void
  onBack: () => void
}

export function PreferencesForm({ data, onNext, onBack }: PreferencesFormProps) {
  const [formData, setFormData] = useState({
    interests: data.interests || [],
    interestsOther: data.interestsOther || "",
    exclusions: data.exclusions || "",
  })
  const [errors, setErrors] = useState({})

  const interestOptions = [
    { value: "sports-fitness", label: "Sports & Fitness: Professional Sports, Rock Climbing, etc." },
    { value: "food-drink", label: "Food & Drink: Wine Tasting, Cooking Classes, etc." },
    { value: "culture-history", label: "Culture & History: Museums, Walking Tours, etc." },
    { value: "performing-visual-arts", label: "Performing & Visual Arts: Concerts, Theater, etc." },
    { value: "activities", label: "Activities: Painting or Cocktail Classes, Escape Rooms, etc." },
    { value: "wellness-spirituality", label: "Wellness & Spirituality: Spa, Yoga, Massage, etc." },
    { value: "nightlife", label: "Night Life: Bar Crawl, Casino, etc." },
    { value: "other", label: "Other" },
  ]

  const handleInterestChange = (value, checked) => {
    let newInterests
    if (checked) {
      if (formData.interests.length >= 4) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          interests: "You can select a maximum of 4 interests.",
        }))
        return // Prevent adding more than 4 interests
      }
      newInterests = [...formData.interests, value]
    } else {
      newInterests = formData.interests.filter((item) => item !== value)
    }

    setFormData({
      ...formData,
      interests: newInterests,
    })
    if (newInterests.length > 0) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors.interests
        return newErrors
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (formData.interests.length === 0) {
      newErrors.interests = "Please select at least one interest."
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>
          What are you interested in experiencing during your Seattle Night Out?{" "}
          <span className="text-sm text-muted-foreground">(Select up to 4 that apply)</span>
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {interestOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={formData.interests.includes(option.value) ? "default" : "outline"}
              className={cn(
                "justify-start h-auto p-3 text-left min-h-[3rem]",
                formData.interests.includes(option.value) ? "bg-primary text-primary-foreground" : "",
              )}
              onClick={() => handleInterestChange(option.value, !formData.interests.includes(option.value))}
            >
              {option.label}
            </Button>
          ))}
        </div>
        {errors.interests && <p className="text-sm text-red-500">{errors.interests}</p>}
        {formData.interests.includes("other") && (
          <div className="mt-2">
            <Input
              name="interestsOther"
              value={formData.interestsOther}
              onChange={handleChange}
              placeholder="Please specify your other interests"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="exclusions">Is there anything that we should exclude from your evening plans?</Label>
        <Textarea
          id="exclusions"
          name="exclusions"
          value={formData.exclusions}
          onChange={handleChange}
          placeholder="We'd love to give you a fresh experience. What are some things you already do regularly when you go out that we can skip?"
          className="min-h-[80px]"
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  )
}
