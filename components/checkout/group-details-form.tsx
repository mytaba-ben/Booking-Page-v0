"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GroupDetailsFormProps {
  data: {
    groupSize: number
    groupComposition: string
  }
  onNext: (data: any) => void
  onBack: () => void
}

export function GroupDetailsForm({ data, onNext, onBack }: GroupDetailsFormProps) {
  const [formData, setFormData] = useState({
    groupSize: data.groupSize || 2,
    groupComposition: data.groupComposition || "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      groupSize: Number.parseInt(value),
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.groupSize) newErrors.groupSize = "Group size is required"

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
          <Label htmlFor="groupSize">How many total people (including you) will be attending?</Label>
          <Select defaultValue={formData.groupSize.toString()} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select group size" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} {size === 1 ? "person" : "people"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.groupSize && <p className="text-sm text-red-500">{errors.groupSize}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupComposition">Can you describe your group's composition?</Label>
          <Textarea
            id="groupComposition"
            name="groupComposition"
            value={formData.groupComposition}
            onChange={handleChange}
            placeholder="For example: couple, group of friends, family, etc."
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            This helps us tailor the experience to suit your group's needs.
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
