"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateTimeFormProps {
  data: {
    startTime: string
    date: string
  }
  onNext: (data: any) => void
  onBack: () => void
}

export function DateTimeForm({ data, onNext, onBack }: DateTimeFormProps) {
  const [formData, setFormData] = useState({
    startTime: data.startTime || "7:00 PM",
    date: data.date ? new Date(data.date) : null,
  })
  const [errors, setErrors] = useState({})

  const timeOptions = ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"]

  const handleTimeChange = (value) => {
    setFormData({
      ...formData,
      startTime: value,
    })
  }

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.startTime) newErrors.startTime = "Start time is required"
    if (!formData.date) newErrors.date = "Date is required"

    // Check if date is at least 4 days in the future
    const today = new Date()
    const fourDaysFromNow = new Date(today)
    fourDaysFromNow.setDate(today.getDate() + 4)

    if (formData.date && formData.date < fourDaysFromNow) {
      newErrors.date = "Please select a date at least 4 days from today"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onNext({
        ...formData,
        date: formData.date ? formData.date.toISOString() : "",
      })
    }
  }

  // Calculate the minimum selectable date (4 days from now)
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + 4)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>What time do you want your Truvay Night Out to start?</Label>
          <RadioGroup defaultValue={formData.startTime} onValueChange={handleTimeChange}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {timeOptions.map((time) => (
                <div key={time} className="flex items-center justify-center">
                  <RadioGroupItem value={time} id={`time-${time}`} className="sr-only" />
                  <Label
                    htmlFor={`time-${time}`}
                    className={cn(
                      "flex h-10 w-full items-center justify-center rounded-md border border-input text-sm",
                      "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                      formData.startTime === time && "bg-primary text-primary-foreground",
                    )}
                  >
                    {time}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
        </div>

        <div className="space-y-2">
          <Label>What date would you like for our Weekend Concierge to plan for you?</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Every Truvay Night Out is meticulously planned, so we recommend you give us at least 4 days in advance.
          </p>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateChange}
                disabled={(date) => date < minDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
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
