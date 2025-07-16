"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface BudgetFormProps {
  data: {
    budget: string
    includeMeals: string[]
    specialOccasion: string
  }
  onNext: (data: any) => void
  onBack: () => void
}

export function BudgetForm({ data, onNext, onBack }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    budget: data.budget || "150",
    includeMeals: data.includeMeals || [],
    specialOccasion: data.specialOccasion || "",
  })
  const [errors, setErrors] = useState({})

  const mealOptions = [
    { id: "dinner", label: "Dinner" },
    { id: "drinks", label: "Drinks" },
    { id: "dessert", label: "Dessert/Snacks" },
    { id: "none", label: "No food or drinks" },
  ]

  const occasionOptions = [
    { value: "none", label: "No special occasion" },
    { value: "birthday", label: "Birthday" },
    { value: "anniversary", label: "Anniversary" },
    { value: "date", label: "Date night" },
    { value: "celebration", label: "General celebration" },
  ]

  const handleBudgetChange = (value) => {
    setFormData({
      ...formData,
      budget: value,
    })
  }

  const handleMealChange = (id: string, checked: boolean) => {
    setFormData({
      ...formData,
      includeMeals: checked ? [...formData.includeMeals, id] : formData.includeMeals.filter((item) => item !== id),
    })
  }

  const handleOccasionChange = (value) => {
    setFormData({
      ...formData,
      specialOccasion: value,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.budget) newErrors.budget = "Budget selection is required"

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
          <Label>What is your per person budget for your evening (excluding meals)?</Label>
          <p className="text-sm text-muted-foreground mb-2">
            This is how much we charge upfront per person so our concierges can book everything for you.
          </p>
          <RadioGroup defaultValue={formData.budget} onValueChange={handleBudgetChange}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center space-y-2 border rounded-md p-4">
                <RadioGroupItem value="100" id="budget-100" className="sr-only" />
                <Label htmlFor="budget-100" className="text-xl font-bold">
                  $100
                </Label>
                <p className="text-sm text-center text-muted-foreground">Basic package</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-md p-4">
                <RadioGroupItem value="150" id="budget-150" className="sr-only" />
                <Label htmlFor="budget-150" className="text-xl font-bold">
                  $150
                </Label>
                <p className="text-sm text-center text-muted-foreground">Standard package</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-md p-4">
                <RadioGroupItem value="200" id="budget-200" className="sr-only" />
                <Label htmlFor="budget-200" className="text-xl font-bold">
                  $200
                </Label>
                <p className="text-sm text-center text-muted-foreground">Premium package</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-md p-4">
                <RadioGroupItem value="500" id="budget-500" className="sr-only" />
                <Label htmlFor="budget-500" className="text-xl font-bold">
                  $500
                </Label>
                <p className="text-sm text-center text-muted-foreground">Luxury package</p>
              </div>
            </div>
          </RadioGroup>
          {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
        </div>

        <div className="space-y-2">
          <Label>Should we include any meals, snacks, or drinks for your evening?</Label>
          <p className="text-sm text-muted-foreground mb-2">
            The cost of food and drinks are not included in the overall price of our service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mealOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={formData.includeMeals.includes(option.id)}
                  onCheckedChange={(checked) => handleMealChange(option.id, checked as boolean)}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Are you celebrating a special occasion?</Label>
          <RadioGroup defaultValue={formData.specialOccasion || "none"} onValueChange={handleOccasionChange}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {occasionOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`occasion-${option.value}`} />
                  <Label htmlFor={`occasion-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
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
