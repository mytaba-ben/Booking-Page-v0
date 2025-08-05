"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Footer } from "@/components/footer"

export default function BookingPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [formData, setFormData] = useState({
    // Required fields
    firstName: "",
    lastName: "",
    phoneNumber: "",
    countryCode: "US",
    preferredArea: "",
    groupSize: null,
    date: null,
    dateInput: "", // For manual date input
    startTime: "",
    endTime: "",
    budget: "",
    foodDrinkOptions: {},
    interests: [],
    essentialComms: false,
    dietaryRestrictions: "", // New field for dietary restrictions

    // Optional fields
    groupComposition: "",
    specialOccasion: "none",
    specialOccasionOther: "",
    exclusions: "",
    marketingComms: false,

    // Payment fields
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",

    interestsOther: "",
  })
  const [errors, setErrors] = useState({})
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const { toast } = useToast()

  // Country codes with search functionality
  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
    { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
    { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
    { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
    { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
    { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
    { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
    { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
    { code: "BR", name: "Brazil", flag: "🇧🇷", dialCode: "+55" },
    { code: "MX", name: "Mexico", flag: "🇲🇽", dialCode: "+52" },
    { code: "IT", name: "Italy", flag: "🇮🇹", dialCode: "+39" },
    { code: "ES", name: "Spain", flag: "🇪🇸", dialCode: "+34" },
    { code: "NL", name: "Netherlands", flag: "🇳🇱", dialCode: "+31" },
    { code: "SE", name: "Sweden", flag: "🇸🇪", dialCode: "+46" },
    { code: "NO", name: "Norway", flag: "🇳🇴", dialCode: "+47" },
    { code: "DK", name: "Denmark", flag: "🇩🇰", dialCode: "+45" },
    { code: "FI", name: "Finland", flag: "🇫🇮", dialCode: "+358" },
  ]

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()),
  )

  const selectedCountry = countries.find((c) => c.code === formData.countryCode) || countries[0]

  // Seattle area options - reduced and sorted
  const seattleAreas = [
    { value: "no-preference", label: "No preference - surprise me!" },
    { value: "ballard", label: "Ballard" },
    { value: "belltown", label: "Belltown" },
    { value: "capitol-hill", label: "Capitol Hill" },
    { value: "downtown", label: "Downtown" },
    { value: "fremont", label: "Fremont" },
    { value: "international-district", label: "International District" },
    { value: "sodo", label: "SODO" },
  ]

  // Time options
  const startTimeOptions = ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"]

  // Dynamic end time options based on start time
  const getEndTimeOptions = (startTime) => {
    const timeMap = {
      "5:00 PM": ["7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"],
      "6:00 PM": ["8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"],
      "7:00 PM": ["9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"],
      "8:00 PM": ["10:00 PM", "11:00 PM", "12:00 AM"],
    }
    return timeMap[startTime] || []
  }

  // Interest options exactly as specified
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

  // Food and drink options with minimum amounts
  const foodDrinkOptions = [
    { id: "happyHour", label: "Happy Hour (apps/drinks)", minAmount: 10 },
    { id: "dinner", label: "Dinner", minAmount: 20 },
    { id: "drinks", label: "Drinks", minAmount: 10 },
    { id: "dessert", label: "Dessert", minAmount: 10 },
    { id: "none", label: "No Thanks", minAmount: 0 },
  ]

  // Special occasion options
  const occasionOptions = [
    { value: "none", label: "No special occasion" },
    { value: "birthday", label: "Birthday" },
    { value: "anniversary", label: "Anniversary" },
    { value: "date", label: "Date night" },
    { value: "celebration", label: "General celebration" },
    { value: "other", label: "Other" },
  ]

  // Calculate the minimum selectable date (4 days from now)
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + 4)

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "")

    // Format based on US/Canada format
    if (formData.countryCode === "US" || formData.countryCode === "CA") {
      if (cleaned.length <= 3) return cleaned
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    }

    // For other countries, just return the cleaned number
    return cleaned
  }

  // Clear error when field is updated
  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      const newErrors = { ...errors }
      delete newErrors[fieldName]
      setErrors(newErrors)
    }
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      setFormData({
        ...formData,
        [name]: formatted,
      })
      clearError(name)
      return
    }

    // Format expiry date
    if (name === "expiry") {
      const cleaned = value.replace(/\D/g, "")
      let formatted = cleaned
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
      }
      setFormData({
        ...formData,
        [name]: formatted,
      })
      clearError(name)
      return
    }

    // Format phone number
    if (name === "phoneNumber") {
      const formatted = formatPhoneNumber(value)
      setFormData({
        ...formData,
        [name]: formatted,
      })
      clearError(name)
      return
    }

    // Handle manual date input
    if (name === "dateInput") {
      setFormData({
        ...formData,
        [name]: value,
      })

      // Try to parse the date
      const parsedDate = new Date(value)
      if (!isNaN(parsedDate.getTime()) && parsedDate >= minDate) {
        setFormData((prev) => ({
          ...prev,
          date: parsedDate,
          dateInput: value,
        }))
        clearError("date")
      } else {
        // If parsing fails or date is invalid, clear the date state
        setFormData((prev) => ({
          ...prev,
          date: null,
        }))
      }
      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
    clearError(name)
  }

  const handleSelectChange = (name, value) => {
    const newFormData = {
      ...formData,
      [name]: value,
    }

    // Reset end time if start time changes
    if (name === "startTime") {
      newFormData.endTime = ""
    }

    setFormData(newFormData)
    clearError(name)
  }

  const handleCheckboxChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
    clearError(name)
  }

  const handleInterestChange = (value, checked) => {
    let newInterests
    if (checked) {
      if (formData.interests.length >= 4) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          interests: "You can select a maximum of 4 interests.",
        }))
        toast({
          title: "Interest Limit Reached",
          description: "You can select a maximum of 4 interests.",
          variant: "destructive",
        })
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

    // Clear interests error if at least one is selected
    if (newInterests.length > 0) {
      clearError("interests")
    }
  }

  const handleFoodDrinkChange = (id, checked) => {
    const newOptions = { ...formData.foodDrinkOptions }

    if (id === "none" && checked) {
      // If "No Thanks" is selected, clear all other options
      setFormData({
        ...formData,
        foodDrinkOptions: { none: { selected: true } },
        dietaryRestrictions: "", // Clear dietary restrictions
      })
    } else if (checked) {
      // Remove "none" if other options are selected
      delete newOptions.none
      const option = foodDrinkOptions.find((opt) => opt.id === id)
      newOptions[id] = { selected: true, amount: "" }
      setFormData({
        ...formData,
        foodDrinkOptions: newOptions,
      })
    } else {
      delete newOptions[id]
      setFormData({
        ...formData,
        foodDrinkOptions: newOptions,
      })
    }

    // Clear food/drink error if at least one option is selected
    if (Object.keys(newOptions).length > 0 || (id === "none" && checked)) {
      clearError("foodDrink")
    }
  }

  const handleFoodDrinkAmountChange = (id, amount) => {
    const newOptions = { ...formData.foodDrinkOptions }
    if (newOptions[id]) {
      const option = foodDrinkOptions.find((opt) => opt.id === id)
      const minAmount = option?.minAmount || 0
      const numValue = Number(amount)

      // Always update the amount
      newOptions[id].amount = amount

      // Show error if value is less than minimum and not empty
      if (amount !== "" && (!Number.isInteger(numValue) || numValue < minAmount)) {
        setErrors({
          ...errors,
          [`foodDrink_${id}`]: `Minimum $${minAmount} required`,
        })
      } else {
        // Clear error if valid
        const newErrors = { ...errors }
        delete newErrors[`foodDrink_${id}`]
        setErrors(newErrors)
      }

      setFormData({
        ...formData,
        foodDrinkOptions: newOptions,
      })
    }
  }

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
      dateInput: date ? format(date, "MM/dd/yyyy") : "",
    })
    setShowCalendar(false) // Close calendar after selection
    clearError("date")
  }

  const handleCountrySelect = (countryCode) => {
    setFormData({
      ...formData,
      countryCode,
    })
    setShowCountryDropdown(false)
    setCountrySearch("")
  }

  // Check if food/drink options require dietary restrictions
  const requiresDietaryRestrictions = () => {
    return Object.keys(formData.foodDrinkOptions).some(
      (key) => key !== "none" && formData.foodDrinkOptions[key]?.selected,
    )
  }

  // Check if all required survey fields are filled
  const isFormValid = () => {
    const basicFieldsValid =
      formData.firstName &&
      formData.lastName &&
      formData.phoneNumber &&
      formData.preferredArea &&
      formData.groupSize &&
      formData.date &&
      formData.startTime &&
      formData.endTime &&
      formData.budget &&
      Object.keys(formData.foodDrinkOptions).length > 0 &&
      formData.interests.length > 0 &&
      formData.essentialComms

    // If food/drink options are selected (not "none"), dietary restrictions are required
    if (requiresDietaryRestrictions() && !formData.dietaryRestrictions) {
      return false
    }

    return basicFieldsValid
  }

  // Check if payment fields are filled
  const isPaymentValid = () => {
    return (
      formData.cardNumber &&
      formData.cardName &&
      formData.expiry &&
      formData.cvc &&
      formData.cardNumber.replace(/\s/g, "").length === 16 &&
      formData.expiry.match(/^\d{2}\/\d{2}$/) &&
      formData.cvc.match(/^\d{3,4}$/)
    )
  }

  const handleSurveyComplete = (e) => {
    e.preventDefault() // Prevent form submission
    setShowValidationErrors(true) // Show validation errors

    // Validate survey fields first
    const newErrors = {}

    // Required fields validation
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
    if (!formData.preferredArea) newErrors.preferredArea = "Preferred area is required"
    if (!formData.groupSize || formData.groupSize < 2) newErrors.groupSize = "Minimum 2 people required"
    if (!formData.date) newErrors.date = "Date is required"
    if (formData.date && formData.date < minDate) {
      newErrors.date = "Please select a date at least 4 days from today"
    }
    if (!formData.startTime) newErrors.startTime = "Start time is required"
    if (!formData.endTime) newErrors.endTime = "End time is required"
    if (!formData.budget) newErrors.budget = "Budget selection is required"

    // Food and drink validation (must select at least one including "none")
    if (Object.keys(formData.foodDrinkOptions).length === 0) {
      newErrors.foodDrink = "Please select at least one food/drink option (including 'No Thanks' if applicable)"
    }

    // Add validation for food/drink amounts
    Object.keys(formData.foodDrinkOptions).forEach((key) => {
      if (key !== "none" && formData.foodDrinkOptions[key].selected && !formData.foodDrinkOptions[key].amount) {
        newErrors[`foodDrink_${key}`] = "Amount is required"
      }
    })

    // Dietary restrictions validation
    if (requiresDietaryRestrictions() && !formData.dietaryRestrictions) {
      newErrors.dietaryRestrictions = "Please specify dietary restrictions or select 'None'"
    }

    // Interests validation
    if (formData.interests.length === 0) newErrors.interests = "Please select at least one interest"

    // Communication validation
    if (!formData.essentialComms) {
      newErrors.essentialComms = "You must agree to essential communications"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      // Scroll to the first error
      const firstError = document.querySelector(".text-red-500")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setShowPaymentForm(true)
    window.scrollTo(0, 0)
  }

  const validate = () => {
    const newErrors = {}

    // Payment validation
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number"
    }
    if (!formData.cardName) newErrors.cardName = "Cardholder name is required"
    if (!formData.expiry || !formData.expiry.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiry = "Please enter a valid expiry date (MM/YY)"
    }
    if (!formData.cvc || !formData.cvc.match(/^\d{3,4}$/)) {
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
        setIsComplete(true)
        window.scrollTo(0, 0)
      }, 2000)
    } else {
      // Scroll to the first error
      const firstError = document.querySelector(".text-red-500")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  // Calculate total amount
  const totalAmount = formData.budget && formData.groupSize ? Number.parseInt(formData.budget) * formData.groupSize : 0
  const isSummaryCalculable =
    formData.groupSize && formData.date && formData.startTime && formData.endTime && formData.budget

  if (isComplete) {
    return (
      <div className="container max-w-md py-20 mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">Your Seattle Night Out is all set</p>
            </div>
            <div className="space-y-4">
              <p className="text-center">
                Thank you for booking with Truvay! Our Seattle concierges are already working on creating your perfect
                night out.
              </p>
              <p className="text-center text-muted-foreground">
                You'll receive an email with all the details shortly. We'll reveal each location 30 minutes before it's
                time to head there.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Payment Form
  if (showPaymentForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white border-b shadow-sm">
          <div className="container flex h-20 items-center justify-center">
            <div className="flex items-center gap-3">
              <Image src="/truvay-logo-black.png" alt="Truvay" width={120} height={40} className="h-8 w-auto" />
            </div>
          </div>
        </header>

        <div className="container py-8 md:py-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-truvay-yellow via-truvay-magenta to-truvay-purple bg-clip-text text-transparent">
              Complete Your Seattle Booking
            </h1>
            <p className="mt-2 text-muted-foreground">Enter your payment details to confirm your Seattle Night Out.</p>
          </div>

          {/* Add edit button */}
          <div className="max-w-2xl mx-auto mb-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowPaymentForm(false)}
              className="text-sm hover:bg-truvay-gradient-subtle"
            >
              ← Edit Details
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border p-6 shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        maxLength={19}
                        className={cn(
                          "focus:ring-truvay-magenta focus:border-truvay-magenta",
                          errors.cardNumber && "border-red-500",
                        )}
                      />
                      {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="John Smith"
                        value={formData.cardName}
                        onChange={handleChange}
                        className={cn(
                          "focus:ring-truvay-magenta focus:border-truvay-magenta",
                          errors.cardName && "border-red-500",
                        )}
                      />
                      {errors.cardName && <p className="text-sm text-red-500">{errors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date *</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleChange}
                          maxLength={5}
                          className={cn(
                            "focus:ring-truvay-magenta focus:border-truvay-magenta",
                            errors.expiry && "border-red-500",
                          )}
                        />
                        {errors.expiry && <p className="text-sm text-red-500">{errors.expiry}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC *</Label>
                        <Input
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={handleChange}
                          maxLength={4}
                          type="password"
                          className={cn(
                            "focus:ring-truvay-magenta focus:border-truvay-magenta",
                            errors.cvc && "border-red-500",
                          )}
                        />
                        {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 lg:hidden">
                  <Button
                    type="submit"
                    className="w-full truvay-button text-white font-semibold"
                    size="lg"
                    disabled={isProcessing || !isPaymentValid()}
                  >
                    {isProcessing ? "Processing..." : `Complete Booking - $${totalAmount}`}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary for Payment */}
            <div className="hidden lg:block">
              <div className="sticky top-6">
                <Card className="border-2 border-transparent bg-gradient-to-br from-truvay-yellow/5 via-truvay-magenta/5 to-truvay-purple/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Number of Guests:</span>
                        <span>{formData.groupSize || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{formData.date ? format(formData.date, "MM/dd/yyyy") : "Not selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span>
                          {formData.startTime && formData.endTime
                            ? `${formData.startTime} - ${formData.endTime}`
                            : "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost per Person:</span>
                        <span>{formData.budget ? `$${formData.budget}` : "Not selected"}</span>
                      </div>
                      {Object.keys(formData.foodDrinkOptions).length > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Food & Drinks:</span>
                            <span className="text-xs">
                              {Object.keys(formData.foodDrinkOptions).includes("none")
                                ? "None selected"
                                : "Reservations only*"}
                            </span>
                          </div>
                          {!Object.keys(formData.foodDrinkOptions).includes("none") && (
                            <div className="text-xs text-muted-foreground pl-0">
                              {Object.keys(formData.foodDrinkOptions)
                                .filter((key) => key !== "none")
                                .map((key) => {
                                  const option = foodDrinkOptions.find((opt) => opt.id === key)
                                  return option ? option.label : key
                                })
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span className="text-truvay-magenta font-bold">
                          {isSummaryCalculable ? `$${totalAmount}` : "N/A"}
                        </span>
                      </div>
                      <Button
                        type="submit"
                        className="w-full mt-4 truvay-button text-white font-semibold"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isProcessing || !isPaymentValid()}
                      >
                        {isProcessing ? "Processing..." : `Complete Booking`}
                      </Button>
                      {Object.keys(formData.foodDrinkOptions).length > 0 &&
                        !Object.keys(formData.foodDrinkOptions).includes("none") && (
                          <p className="text-xs text-center text-muted-foreground mt-2">
                            *Food & drink costs are separate and paid directly at venues
                          </p>
                        )}
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Secure payment powered by Stripe. Your experience will be confirmed within 24 hours.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container flex h-20 items-center justify-center">
          <div className="flex items-center gap-3">
            <Image src="/truvay-logo-black.png" alt="Truvay" width={120} height={40} className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <div className="container py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-truvay-yellow via-truvay-magenta to-truvay-purple bg-clip-text text-transparent">
            Book Your Truvay Night Out
          </h1>
          <p className="mt-2 text-muted-foreground">
            Fill out this form and our Seattle concierges will create a bespoke itinerary for your perfect night out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSurveyComplete} className="space-y-8 bg-white rounded-lg border p-6 shadow-sm">
              {/* Event Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Event Details</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="groupSize">How many total people (including you) will be attending? *</Label>
                    <Select
                      modal={false}
                      value={formData.groupSize?.toString() || ""}
                      onValueChange={(value) => handleSelectChange("groupSize", Number.parseInt(value))}
                    >
                      <SelectTrigger
                        className={cn(
                          "focus:ring-truvay-magenta focus:border-truvay-magenta",
                          (errors.groupSize || (showValidationErrors && !formData.groupSize)) && "border-red-500",
                        )}
                      >
                        <SelectValue placeholder="Select number of people" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {[2, 3, 4, 5, 6, 7, 8].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} people
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(errors.groupSize || (showValidationErrors && !formData.groupSize)) && (
                      <p className="text-sm text-red-500">{errors.groupSize || "Group size is required"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>What date would you like for your Seattle Night Out? *</Label>
                    <Popover modal={false} open={showCalendar} onOpenChange={setShowCalendar}>
                      <div className="relative">
                        <Input
                          type="text"
                          name="dateInput"
                          value={formData.dateInput}
                          onChange={handleChange}
                          placeholder="MM/DD/YYYY"
                          className={cn(
                            "w-full pr-10", // Right padding for the icon
                            "focus:ring-truvay-magenta focus:border-truvay-magenta",
                            (errors.date || (showValidationErrors && !formData.date)) && "border-red-500",
                          )}
                        />
                        <PopoverTrigger asChild>
                          <Button
                            type="button" // This is the critical fix for the submission bug
                            variant="ghost"
                            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowCalendar(true)}
                          >
                            <span className="sr-only">Open calendar</span>
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                      </div>
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
                    {(errors.date || (showValidationErrors && !formData.date)) && (
                      <p className="text-sm text-red-500">{errors.date || "Date is required"}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label>What time do you want your Night Out to start? *</Label>
                    <Select
                      modal={false}
                      value={formData.startTime}
                      onValueChange={(value) => handleSelectChange("startTime", value)}
                    >
                      <SelectTrigger
                        className={cn(
                          "focus:ring-truvay-magenta focus:border-truvay-magenta",
                          (errors.startTime || (showValidationErrors && !formData.startTime)) && "border-red-500",
                        )}
                      >
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {startTimeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(errors.startTime || (showValidationErrors && !formData.startTime)) && (
                      <p className="text-sm text-red-500">{errors.startTime || "Start time is required"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>What is the latest end time for your night out? *</Label>
                    <Select
                      modal={false}
                      value={formData.endTime}
                      onValueChange={(value) => handleSelectChange("endTime", value)}
                      disabled={!formData.startTime}
                    >
                      <SelectTrigger
                        className={cn(
                          "focus:ring-truvay-magenta focus:border-truvay-magenta",
                          (errors.endTime || (showValidationErrors && !formData.endTime)) && "border-red-500",
                        )}
                      >
                        <SelectValue placeholder={formData.startTime ? "Select end time" : "Select start time first"} />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {getEndTimeOptions(formData.startTime).map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(errors.endTime || (showValidationErrors && !formData.endTime)) && (
                      <p className="text-sm text-red-500">{errors.endTime || "End time is required"}</p>
                    )}
                  </div>
                </div>

                {/* Seattle Area Preference */}
                <div className="mt-4 space-y-2">
                  <Label>Which area of Seattle would you prefer for your experience? *</Label>
                  <p className="text-sm text-muted-foreground">
                    Your experience will all be within walking distance of the start point, which will be shared prior
                    to event start.
                  </p>
                  <Select
                    modal={false}
                    value={formData.preferredArea}
                    onValueChange={(value) => handleSelectChange("preferredArea", value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "focus:ring-truvay-magenta focus:border-truvay-magenta",
                        (errors.preferredArea || (showValidationErrors && !formData.preferredArea)) && "border-red-500",
                      )}
                    >
                      <SelectValue placeholder="Select preferred area" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {seattleAreas.map((area) => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(errors.preferredArea || (showValidationErrors && !formData.preferredArea)) && (
                    <p className="text-sm text-red-500">{errors.preferredArea || "Preferred area is required"}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Budget */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Budget *</h2>
                <div className="space-y-2">
                  <Label>What is your per person budget for your Seattle evening (excluding meals)?</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    This is how much we charge upfront per person so our Seattle concierges can book everything for you.
                    Each tier includes different types of activities and venues - from local favorites to premium
                    experiences.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "100", label: "$100", description: "Truvay Select", popular: false },
                      { value: "150", label: "$150", description: "Truvay Classic", popular: true },
                      { value: "250", label: "$250", description: "Truvay Luxe", popular: false },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex flex-col items-center space-y-2 border rounded-md p-4 cursor-pointer transition-all duration-200 relative",
                          formData.budget === option.value
                            ? "border-truvay-magenta bg-gradient-to-br from-truvay-yellow/10 via-truvay-magenta/10 to-truvay-purple/10 shadow-md"
                            : "hover:border-truvay-magenta/50 hover:bg-truvay-gradient-subtle",
                          (errors.budget || (showValidationErrors && !formData.budget)) && "border-red-500",
                        )}
                        onClick={() => handleSelectChange("budget", option.value)}
                      >
                        {option.popular && (
                          <div className="absolute -top-2 left-2 truvay-gradient text-white text-xs px-2 py-1 rounded font-medium">
                            Most popular
                          </div>
                        )}
                        <span className="text-xl font-bold mt-2">{option.label}</span>
                        <p className="text-sm text-center text-muted-foreground font-medium">{option.description}</p>
                      </div>
                    ))}
                  </div>
                  {(errors.budget || (showValidationErrors && !formData.budget)) && (
                    <p className="text-sm text-red-500">{errors.budget || "Budget selection is required"}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={cn(
                        "focus:ring-truvay-magenta focus:border-truvay-magenta",
                        (errors.firstName || (showValidationErrors && !formData.firstName)) && "border-red-500",
                      )}
                    />
                    {(errors.firstName || (showValidationErrors && !formData.firstName)) && (
                      <p className="text-sm text-red-500">{errors.firstName || "First name is required"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={cn(
                        "focus:ring-truvay-magenta focus:border-truvay-magenta",
                        (errors.lastName || (showValidationErrors && !formData.lastName)) && "border-red-500",
                      )}
                    />
                    {(errors.lastName || (showValidationErrors && !formData.lastName)) && (
                      <p className="text-sm text-red-500">{errors.lastName || "Last name is required"}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Popover modal={false} open={showCountryDropdown} onOpenChange={setShowCountryDropdown}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[180px] justify-start bg-transparent hover:bg-truvay-gradient-subtle"
                        >
                          {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" sideOffset={4} align="start">
                        <div className="p-2">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search countries..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              className="w-full px-3 py-2 text-left hover:bg-truvay-gradient-subtle flex items-center gap-2"
                              onClick={() => handleCountrySelect(country.code)}
                            >
                              {country.flag} {country.name} ({country.dialCode})
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className={cn(
                        "flex-1 focus:ring-truvay-magenta focus:border-truvay-magenta",
                        (errors.phoneNumber || (showValidationErrors && !formData.phoneNumber)) && "border-red-500",
                      )}
                    />
                  </div>
                  {(errors.phoneNumber || (showValidationErrors && !formData.phoneNumber)) && (
                    <p className="text-sm text-red-500">{errors.phoneNumber || "Phone number is required"}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Group Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Group Details</h2>
                <div className="space-y-2">
                  <Label htmlFor="groupComposition">Can you describe your group's composition?</Label>
                  <Textarea
                    id="groupComposition"
                    name="groupComposition"
                    value={formData.groupComposition}
                    onChange={handleChange}
                    placeholder="For example, you might include details such as whether you're attending as a couple, a group of friends, a family, or any specific identity or demographic characteristics (e.g. all women, all men, LGBTQ+, etc.) that you feel are relevant."
                    className="min-h-[100px] focus:ring-truvay-magenta focus:border-truvay-magenta"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Label>Are you celebrating a special occasion?</Label>
                  <Select
                    modal={false}
                    value={formData.specialOccasion}
                    onValueChange={(value) => handleSelectChange("specialOccasion", value)}
                  >
                    <SelectTrigger className="focus:ring-truvay-magenta focus:border-truvay-magenta">
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {occasionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {formData.specialOccasion === "other" && (
                    <div className="mt-2">
                      <Input
                        name="specialOccasionOther"
                        value={formData.specialOccasionOther}
                        onChange={handleChange}
                        placeholder="Please specify the occasion"
                        className="focus:ring-truvay-magenta focus:border-truvay-magenta"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Food & Drink Add-ons */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Food & Drink Add-ons *</h2>
                <p className="text-sm text-muted-foreground mb-4 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  <strong>Please note:</strong> Food and drink costs are separate from your booking fee and are paid
                  directly at venues.
                </p>

                <div>
                  <Label className="mb-4">
                    Should we include any meals, snacks, or drinks for your Truvay Night Out?{" "}
                  </Label>

                  <div className="space-y-4 mt-4">
                    {foodDrinkOptions.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={
                              option.id === "none"
                                ? formData.foodDrinkOptions.none?.selected || false
                                : formData.foodDrinkOptions[option.id]?.selected || false
                            }
                            onCheckedChange={(checked) => handleFoodDrinkChange(option.id, checked as boolean)}
                            className={cn(
                              "data-[state=checked]:bg-truvay-magenta data-[state=checked]:border-truvay-magenta",
                              (errors.foodDrink ||
                                (showValidationErrors && Object.keys(formData.foodDrinkOptions).length === 0)) &&
                                "border-red-500",
                            )}
                          />
                          <Label htmlFor={option.id}>{option.label}</Label>
                        </div>
                        {option.id !== "none" && formData.foodDrinkOptions[option.id]?.selected && (
                          <div className="ml-6">
                            <Label htmlFor={`${option.id}-amount`} className="text-sm">
                              How much are you willing to spend per person on {option.label.toLowerCase()}? (Min: $
                              {option.minAmount})
                            </Label>
                            <Input
                              id={`${option.id}-amount`}
                              type="number"
                              min={option.minAmount}
                              step="1"
                              placeholder="Amount ($)"
                              value={formData.foodDrinkOptions[option.id]?.amount || ""}
                              onChange={(e) => handleFoodDrinkAmountChange(option.id, e.target.value)}
                              className={cn(
                                "w-[6.4rem] mt-1 focus:ring-truvay-magenta focus:border-truvay-magenta no-spinners",
                                errors[`foodDrink_${option.id}`] && "border-red-500",
                              )}
                            />
                            {errors[`foodDrink_${option.id}`] && (
                              <p className="text-sm text-red-500">{errors[`foodDrink_${option.id}`]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {(errors.foodDrink ||
                    (showValidationErrors && Object.keys(formData.foodDrinkOptions).length === 0)) && (
                    <p className="text-sm text-red-500">{errors.foodDrink || "Please select at least one option"}</p>
                  )}
                </div>

                {/* Dietary Restrictions */}
                {requiresDietaryRestrictions() && (
                  <div className="mt-6 space-y-2">
                    <Label>Do you have any dietary restrictions? *</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dietaryNone"
                          checked={formData.dietaryRestrictions === "None"}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                dietaryRestrictions: "None",
                              })
                              clearError("dietaryRestrictions")
                            } else {
                              setFormData({
                                ...formData,
                                dietaryRestrictions: "",
                              })
                            }
                          }}
                          className="data-[state=checked]:bg-truvay-magenta data-[state=checked]:border-truvay-magenta"
                        />
                        <Label htmlFor="dietaryNone">None</Label>
                      </div>
                      {formData.dietaryRestrictions !== "None" && (
                        <Textarea
                          id="dietaryRestrictions"
                          name="dietaryRestrictions"
                          value={formData.dietaryRestrictions === "None" ? "" : formData.dietaryRestrictions}
                          onChange={handleChange}
                          placeholder="Please describe any dietary restrictions, allergies, or preferences."
                          className={cn(
                            "min-h-[80px] focus:ring-truvay-magenta focus:border-truvay-magenta",
                            (errors.dietaryRestrictions ||
                              (showValidationErrors &&
                                requiresDietaryRestrictions() &&
                                !formData.dietaryRestrictions)) &&
                              "border-red-500",
                          )}
                        />
                      )}
                    </div>
                    {(errors.dietaryRestrictions ||
                      (showValidationErrors && requiresDietaryRestrictions() && !formData.dietaryRestrictions)) && (
                      <p className="text-sm text-red-500">
                        {errors.dietaryRestrictions || "Please specify dietary restrictions or select 'None'"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Interests & Preferences */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Interests & Preferences *</h2>
                <div className="space-y-2">
                  <Label>
                    What are you interested in experiencing during your Seattle Night Out?{" "}
                    <span className="text-sm text-muted-foreground">(Select up to 4 that apply)</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    These selections help inspire your itinerary - your actual experience will be a curated surprise
                    based on your preferences!
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {interestOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={formData.interests.includes(option.value) ? "default" : "outline"}
                        className={cn(
                          "justify-start h-auto p-3 text-left min-h-[3rem] transition-all duration-200",
                          formData.interests.includes(option.value)
                            ? "truvay-button text-white"
                            : "hover:bg-truvay-gradient-subtle hover:border-truvay-magenta/50",
                          (errors.interests || (showValidationErrors && formData.interests.length === 0)) &&
                            "border-red-500",
                        )}
                        onClick={() => handleInterestChange(option.value, !formData.interests.includes(option.value))}
                      >
                        {option.label}
                      </Button>
                    ))}
                    {formData.interests.includes("other") && (
                      <div className="mt-2">
                        <Input
                          name="interestsOther"
                          value={formData.interestsOther || ""}
                          onChange={handleChange}
                          placeholder="Please specify your other interests"
                          className="focus:ring-truvay-magenta focus:border-truvay-magenta"
                        />
                      </div>
                    )}
                  </div>
                  {(errors.interests || (showValidationErrors && formData.interests.length === 0)) && (
                    <p className="text-sm text-red-500">{errors.interests || "Please select at least one interest"}</p>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="exclusions">Is there anything that we should exclude from your evening plans?</Label>
                  <Textarea
                    id="exclusions"
                    name="exclusions"
                    value={formData.exclusions}
                    onChange={handleChange}
                    placeholder="We'd love to give you a fresh experience. What are some things you already do regularly when you go out that we can skip?"
                    className="min-h-[80px] focus:ring-truvay-magenta focus:border-truvay-magenta"
                  />
                </div>
              </div>

              <Separator />

              {/* Communication Preferences */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Communication Preferences</h2>
                <div className="space-y-4">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="essentialComms"
                      checked={formData.essentialComms}
                      onCheckedChange={(checked) => handleCheckboxChange("essentialComms", checked as boolean)}
                      className={cn(
                        "data-[state=checked]:bg-truvay-magenta data-[state=checked]:border-truvay-magenta",
                        (errors.essentialComms || (showValidationErrors && !formData.essentialComms)) &&
                          "border-red-500",
                      )}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="essentialComms" className="font-medium">
                        Essential communications for Your Seattle Night Out *
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        I agree to receive text messages and emails from Truvay that are essential for managing and
                        delivering my booked Seattle Night Out.
                      </p>
                    </div>
                  </div>
                  {(errors.essentialComms || (showValidationErrors && !formData.essentialComms)) && (
                    <p className="text-sm text-red-500">
                      {errors.essentialComms || "You must agree to essential communications"}
                    </p>
                  )}

                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="marketingComms"
                      checked={formData.marketingComms}
                      onCheckedChange={(checked) => handleCheckboxChange("marketingComms", checked as boolean)}
                      className="data-[state=checked]:bg-truvay-magenta data-[state=checked]:border-truvay-magenta"
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

              <div className="pt-4 lg:hidden">
                <Button
                  type="submit"
                  className="w-full truvay-button text-white font-semibold"
                  size="lg"
                  // Removed disabled={!isFormValid()}
                >
                  Add Payment Details
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Card className="border-2 border-transparent bg-gradient-to-br from-truvay-yellow/5 via-truvay-magenta/5 to-truvay-purple/5">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Number of Guests:</span>
                      <span>{formData.groupSize || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{formData.date ? format(formData.date, "MM/dd/yyyy") : "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>
                        {formData.startTime && formData.endTime
                          ? `${formData.startTime} - ${formData.endTime}`
                          : "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost per Person:</span>
                      <span>{formData.budget ? `$${formData.budget}` : "Not selected"}</span>
                    </div>
                    {Object.keys(formData.foodDrinkOptions).length > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Food & Drinks:</span>
                          <span className="text-xs">
                            {Object.keys(formData.foodDrinkOptions).includes("none")
                              ? "None selected"
                              : "Reservations only*"}
                          </span>
                        </div>
                        {!Object.keys(formData.foodDrinkOptions).includes("none") && (
                          <div className="text-xs text-muted-foreground pl-0">
                            {Object.keys(formData.foodDrinkOptions)
                              .filter((key) => key !== "none")
                              .map((key) => {
                                const option = foodDrinkOptions.find((opt) => opt.id === key)
                                return option ? option.label : key
                              })
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span className="text-truvay-magenta font-bold">
                        {isSummaryCalculable ? `$${totalAmount}` : "N/A"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      className="w-full mt-4 truvay-button text-white font-semibold"
                      size="lg"
                      onClick={handleSurveyComplete}
                      // Removed disabled={!isFormValid()}
                    >
                      Add Payment Details
                    </Button>
                    {Object.keys(formData.foodDrinkOptions).length > 0 &&
                      !Object.keys(formData.foodDrinkOptions).includes("none") && (
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          *Food & drink costs are separate and paid directly at venues
                        </p>
                      )}
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Secure payment powered by Stripe. Your experience will be confirmed within 24 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
