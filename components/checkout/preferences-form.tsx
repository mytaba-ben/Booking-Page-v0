"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface PreferencesFormProps {
  data: {
    interests: string[]
    exclusions: string
  }
  onNext: (data: any) => void
  onBack: () => void
}

export function PreferencesForm({ data, onNext, onBack }: PreferencesFormProps) {
  const [formData, setFormData] = useState({
    interests: data.interests || [],
    exclusions: data.exclusions || "",
  })
  const [errors, setErrors] = useState({})

  const interestOptions = [
    { id: "food", label: "Food & Dining" },
    { id: "drinks", label: "Drinks & Nightlife" },
    { id: "arts", label: "Arts & Culture" },
    { id: "music", label: "Live Music" },
    { id: "outdoor", label: "Outdoor Activities" },
    { id: "sports", label: "Sports & Recreation" },
    { id: "games", label: "Games & Entertainment" },
    { id: "wellness", label: "Wellness & Relaxation" },
    { id: "shopping", label: "Shopping & Markets" },
  ]

  const handleInterestChange = (id: string, checked: boolean) => {
    setFormData({
      ...formData,
      interests: checked ? [...formData.interests, id] : formData.interests.filter((item) => item !== id),
    })
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
    if (formData.interests.length === 0) newErrors.interests = "Please select at least one interest"

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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>What are you interested in experiencing during your Truvay Night Out?</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {interestOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={formData.interests.includes(option.id)}
                  onCheckedChange={(checked) => handleInterestChange(option.id, checked as boolean)}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
          {errors.interests && <p className="text-sm text-red-500">{errors.interests}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="exclusions">Is there anything that we should exclude from your evening plans?</Label>
          <Textarea
            id="exclusions"
            name="exclusions"
            value={formData.exclusions}
            onChange={handleChange}
            placeholder="Tell us what to avoid..."
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            We'd love to give you a fresh experience. What are some things you already do regularly when you go out that
            we can skip?
          </p>
        </div>
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
