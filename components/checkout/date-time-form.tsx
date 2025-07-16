"use client"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock } from "lucide-react"

interface DateTimeFormProps {
  formData: {
    date: string
    startTime: string
    endTime: string
  }
  updateFormData: (field: string, value: string) => void
  errors: Record<string, string>
}

export function DateTimeForm({ formData, updateFormData, errors }: DateTimeFormProps) {
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 17; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        times.push({ value: timeString, label: displayTime })
      }
    }
    return times
  }

  const calculateEndTime = (startTime: string) => {
    if (!startTime) return ""

    const [hours, minutes] = startTime.split(":").map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)

    // Add 4 hours
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000)

    return `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`
  }

  const handleStartTimeChange = (value: string) => {
    updateFormData("startTime", value)
    const endTime = calculateEndTime(value)
    updateFormData("endTime", endTime)
  }

  const timeOptions = generateTimeOptions()

  return (
    <Card className="border-2 border-gray-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-truvay-magenta" />
          Date & Time
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              What date would you like to go out? *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateFormData("date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={`${errors.date ? "border-red-500" : ""}`}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-sm font-medium">
              What time do you want your Night Out to start? *
            </Label>
            <Select value={formData.startTime} onValueChange={handleStartTimeChange}>
              <SelectTrigger className={`${errors.startTime ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
          </div>
        </div>

        {formData.startTime && formData.endTime && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Your night out will end around:</strong>{" "}
              {new Date(`2000-01-01T${formData.endTime}`).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              This is an estimated end time based on a typical 4-hour experience
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
