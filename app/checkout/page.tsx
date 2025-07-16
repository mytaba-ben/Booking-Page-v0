"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ContactForm } from "@/components/checkout/contact-form"
import { GroupDetailsForm } from "@/components/checkout/group-details-form"
import { DateTimeForm } from "@/components/checkout/date-time-form"
import { BudgetForm } from "@/components/checkout/budget-form"
import { PreferencesForm } from "@/components/checkout/preferences-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { Calendar, Users, DollarSign, Heart, MapPin, Utensils } from "lucide-react"
import Image from "next/image"

interface FormData {
  // Contact
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string

  // Group Details
  groupSize: number
  occasion: string
  neighborhood: string

  // Date & Time
  date: string
  startTime: string
  endTime: string

  // Budget
  budget: string

  // Preferences
  interests: string[]
  otherInterest: string
  foodDrinks: string[]
  additionalRequests: string

  // Payment
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
  billingAddress: string
  city: string
  zipCode: string
}

export default function CheckoutPage() {
  const [showPayment, setShowPayment] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    groupSize: 2,
    occasion: "",
    neighborhood: "",
    date: "",
    startTime: "",
    endTime: "",
    budget: "",
    interests: [],
    otherInterest: "",
    foodDrinks: [],
    additionalRequests: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
    city: "",
    zipCode: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Clear errors when form data changes
  useEffect(() => {
    const newErrors = { ...errors }
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof FormData] && errors[key]) {
        delete newErrors[key]
      }
    })
    if (Object.keys(newErrors).length !== Object.keys(errors).length) {
      setErrors(newErrors)
    }
  }, [formData])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.occasion.trim()) newErrors.occasion = "Occasion is required"
    if (!formData.neighborhood.trim()) newErrors.neighborhood = "Neighborhood is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.startTime) newErrors.startTime = "Start time is required"
    if (!formData.budget) newErrors.budget = "Budget is required"
    if (formData.interests.length === 0) newErrors.interests = "At least one interest is required"

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.occasion.trim() &&
      formData.neighborhood.trim() &&
      formData.date &&
      formData.startTime &&
      formData.budget &&
      formData.interests.length > 0 &&
      /\S+@\S+\.\S+/.test(formData.email)
    )
  }

  const isPaymentValid = () => {
    return formData.cardNumber.trim() && formData.expiryDate.trim() && formData.cvv.trim() && formData.nameOnCard.trim()
  }

  const handleAddPayment = () => {
    if (validateForm()) {
      setShowPayment(true)
    }
  }

  const handleEditDetails = () => {
    setShowPayment(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getFoodDrinksDisplay = () => {
    if (formData.foodDrinks.length === 0 || formData.foodDrinks.includes("none")) {
      return "None selected"
    }
    return formData.foodDrinks.join(", ")
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header with Logo */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center">
            <Image src="/truvay-logo-black.png" alt="Truvay" width={120} height={40} className="h-8 w-auto" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <PaymentForm
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onEditDetails={handleEditDetails}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-2 border-gray-100 shadow-lg">
                <CardHeader className="bg-truvay-gradient text-white">
                  <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-truvay-magenta" />
                      <div>
                        <div className="font-medium">{formatDate(formData.date)}</div>
                        <div className="text-sm text-gray-600">
                          {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-truvay-magenta" />
                      <div>
                        <div className="font-medium">
                          {formData.groupSize} {formData.groupSize === 1 ? "Person" : "People"}
                        </div>
                        <div className="text-sm text-gray-600">{formData.occasion}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-truvay-magenta" />
                      <div>
                        <div className="font-medium">{formData.neighborhood}</div>
                        <div className="text-sm text-gray-600">Seattle</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-truvay-magenta" />
                      <div>
                        <div className="font-medium">{formData.budget}</div>
                        <div className="text-sm text-gray-600">Per person budget</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Heart className="h-4 w-4 text-truvay-magenta mt-1" />
                      <div className="flex-1">
                        <div className="font-medium">Interests</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-truvay-gradient-subtle">
                              {interest}
                            </Badge>
                          ))}
                          {formData.otherInterest && (
                            <Badge variant="secondary" className="text-xs bg-truvay-gradient-subtle">
                              {formData.otherInterest}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Utensils className="h-4 w-4 text-truvay-magenta mt-1" />
                      <div className="flex-1">
                        <div className="font-medium">Food & Drinks</div>
                        <div className="text-sm text-gray-600">Reservations only*</div>
                        {formData.foodDrinks.length > 0 && !formData.foodDrinks.includes("none") && (
                          <div className="text-xs text-gray-500 mt-1">{getFoodDrinksDisplay()}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <Button className="w-full truvay-button text-white font-semibold py-3" disabled={!isPaymentValid()}>
                      Complete Booking
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      *Food and drink costs are separate and paid directly to venues
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Logo */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Image src="/truvay-logo-black.png" alt="Truvay" width={120} height={40} className="h-8 w-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Night Out</h1>
              <p className="text-gray-600">Tell us about your perfect Seattle experience</p>
            </div>

            <ContactForm formData={formData} updateFormData={updateFormData} errors={errors} />

            <GroupDetailsForm formData={formData} updateFormData={updateFormData} errors={errors} />

            <DateTimeForm formData={formData} updateFormData={updateFormData} errors={errors} />

            <BudgetForm formData={formData} updateFormData={updateFormData} errors={errors} />

            <PreferencesForm formData={formData} updateFormData={updateFormData} errors={errors} />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-2 border-gray-100 shadow-lg">
              <CardHeader className="bg-truvay-gradient text-white">
                <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  {formData.date && formData.startTime && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-truvay-magenta" />
                      <div>
                        <div className="font-medium">{formatDate(formData.date)}</div>
                        <div className="text-sm text-gray-600">
                          {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-truvay-magenta" />
                    <div>
                      <div className="font-medium">
                        {formData.groupSize} {formData.groupSize === 1 ? "Person" : "People"}
                      </div>
                      {formData.occasion && <div className="text-sm text-gray-600">{formData.occasion}</div>}
                    </div>
                  </div>

                  {formData.neighborhood && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-truvay-magenta" />
                      <div>
                        <div className="font-medium">{formData.neighborhood}</div>
                        <div className="text-sm text-gray-600">Seattle</div>
                      </div>
                    </div>
                  )}

                  {formData.budget && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-truvay-magenta" />
                      <div>
                        <div className="font-medium">{formData.budget}</div>
                        <div className="text-sm text-gray-600">Per person budget</div>
                      </div>
                    </div>
                  )}

                  {formData.interests.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Heart className="h-4 w-4 text-truvay-magenta mt-1" />
                      <div className="flex-1">
                        <div className="font-medium">Interests</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-truvay-gradient-subtle">
                              {interest}
                            </Badge>
                          ))}
                          {formData.otherInterest && (
                            <Badge variant="secondary" className="text-xs bg-truvay-gradient-subtle">
                              {formData.otherInterest}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Utensils className="h-4 w-4 text-truvay-magenta mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">Food & Drinks</div>
                      <div className="text-sm text-gray-600">Reservations only*</div>
                      {formData.foodDrinks.length > 0 && !formData.foodDrinks.includes("none") && (
                        <div className="text-xs text-gray-500 mt-1">{getFoodDrinksDisplay()}</div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <Button
                    onClick={handleAddPayment}
                    className="w-full truvay-button text-white font-semibold py-3"
                    disabled={!isFormValid()}
                  >
                    Add Payment Details
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    *Food and drink costs are separate and paid directly to venues
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
