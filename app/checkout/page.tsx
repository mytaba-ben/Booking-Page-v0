"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PhoneInput } from "@/components/phone-input"
import { format } from "date-fns"
import { CalendarIcon, Mountain, ArrowLeft, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    // Required fields
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: "",
    groupSize: null,
    date: null,
    startTime: "",
    endTime: "",
    budget: "",
    foodDrinkOptions: {},
    interests: [],
    essentialComms: false,

    // Optional fields
    groupComposition: "",
    specialOccasion: "none",
    exclusions: "",
    marketingComms: false,

    // Payment fields
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  })
  const [errors, setErrors] = useState({})

  // Location options with Seattle as only available option
  const locationOptions = [
    { value: "seattle", label: "Seattle" },
    { value: "other", label: "Other (please specify in group composition)" },
  ]

  // Time options
  const timeOptions = ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"]

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

  // Food and drink options
  const foodDrinkOptions = [
    { id: "happyHour", label: "Happy Hour (apps/drinks)" },
    { id: "dinner", label: "Dinner" },
    { id: "drinks", label: "Drinks" },
    { id: "dessert", label: "Dessert" },
    { id: "none", label: "No Thanks" },
  ]

  // Fixed occasion options - no empty string values
  const occasionOptions = [
    { value: "none", label: "No special occasion" },
    { value: "birthday", label: "Birthday" },
    { value: "anniversary", label: "Anniversary" },
    { value: "date", label: "Date night" },
    { value: "celebration", label: "General celebration" },
  ]

  // Calculate the minimum selectable date (4 days from now)
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + 4)

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
      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleInterestChange = (value, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, value],
      })
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter((item) => item !== value),
      })
    }
  }

  const handleFoodDrinkChange = (id, checked) => {
    const newOptions = { ...formData.foodDrinkOptions }

    if (id === "none" && checked) {
      // If "No Thanks" is selected, clear all other options
      setFormData({
        ...formData,
        foodDrinkOptions: { none: { selected: true } },
      })
    } else if (checked) {
      // Remove "none" if other options are selected
      delete newOptions.none
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
  }

  const handleFoodDrinkAmountChange = (id, amount) => {
    const newOptions = { ...formData.foodDrinkOptions }
    if (newOptions[id]) {
      newOptions[id].amount = amount
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
    })
  }

  const handlePhoneChange = (phone) => {
    setFormData({
      ...formData,
      phoneNumber: phone,
    })
  }

  const validate = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
    if (!formData.location) newErrors.location = "Location selection is required"
    if (!formData.groupSize || formData.groupSize === 0) newErrors.groupSize = "Number of people is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.startTime) newErrors.startTime = "Start time is required"
    if (!formData.endTime) newErrors.endTime = "End time is required"
    if (!formData.budget) newErrors.budget = "Budget selection is required"

    // Check if date is at least 4 days in the future
    if (formData.date && formData.date < minDate) {
      newErrors.date = "Please select a date at least 4 days from today"
    }

    // Food and drink validation (must select at least one including "none")
    if (Object.keys(formData.foodDrinkOptions).length === 0) {
      newErrors.foodDrink = "Please select at least one food/drink option (including 'No Thanks' if applicable)"
    }

    // Interests validation
    if (formData.interests.length === 0) newErrors.interests = "Please select at least one interest"

    // Communication validation
    if (!formData.essentialComms) {
      newErrors.essentialComms = "You must agree to essential communications"
    }

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

  if (isComplete) {
    return (
      <div className="container max-w-md py-20">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">Your Truvay Night Out is all set</p>
            </div>
            <div className="space-y-4">
              <p className="text-center">
                Thank you for booking with Truvay! Our concierges are already working on creating your perfect night
                out.
              </p>
              <p className="text-center text-muted-foreground">
                You'll receive an email with all the details shortly. We'll reveal each location 30 minutes before it's
                time to head there.
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="mx-auto flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            <span className="text-lg font-bold">Truvay</span>
          </div>
          <div className="w-[100px]"></div>
        </div>
      </header>

      <div className="container py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Book Your Truvay Night Out</h1>
          <p className="mt-2 text-muted-foreground">
            Fill out this form and our concierges will create a bespoke itinerary for your perfect night out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8 bg-background rounded-lg border p-6 shadow-sm">
              {/* Number of Guests and Date/Time */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="groupSize">How many total people (including you) will be attending? *</Label>
                    <Select
                      value={formData.groupSize?.toString() || ""}
                      onValueChange={(value) => handleSelectChange("groupSize", Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of people" />
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
                    <Label>What date would you like for your Truvay Night Out? *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground",
                          )}
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label>What time do you want your Truvay Night Out to start? *</Label>
                    <Select
                      value={formData.startTime}
                      onValueChange={(value) => handleSelectChange("startTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>What is the latest end time for your night out? *</Label>
                    <Select value={formData.endTime} onValueChange={(value) => handleSelectChange("endTime", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <PhoneInput
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                </div>

                <div className="mt-4 space-y-2">
                  <Label>
                    Our Weekend Concierge is only available in Seattle at this time. Are you located in (or planning to
                    visit) Seattle? *
                  </Label>
                  <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>
              </div>

              <Separator />

              {/* Group Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Group Details</h2>
                <div className="space-y-2">
                  <Label htmlFor="groupComposition">Can you describe your group's composition?</Label>
                  <Textarea
                    id="groupComposition"
                    name="groupComposition"
                    value={formData.groupComposition}
                    onChange={handleChange}
                    placeholder="For example, you might include details such as whether you're attending as a couple, a group of friends, a family, or any specific identity or demographic characteristics (e.g. all women, all men, LGBTQ+, etc.) that you feel are relevant."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Label>Are you celebrating a special occasion?</Label>
                  <Select
                    value={formData.specialOccasion}
                    onValueChange={(value) => handleSelectChange("specialOccasion", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      {occasionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Budget */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Budget *</h2>
                <div className="space-y-2">
                  <Label>What is your per person budget for your evening (excluding meals)?</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    This is how much we charge upfront per person so our concierges can book everything for you.
                  </p>
                  <RadioGroup
                    value={formData.budget}
                    onValueChange={(value) => handleSelectChange("budget", value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    {[
                      { value: "100", label: "$100", description: "Basic package" },
                      { value: "150", label: "$150", description: "Standard package" },
                      { value: "200", label: "$200", description: "Premium package" },
                      { value: "500", label: "$500", description: "Luxury package" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`budget-${option.value}`} />
                        <Label htmlFor={`budget-${option.value}`} className="flex flex-col cursor-pointer">
                          <span className="text-lg font-bold">{option.label}</span>
                          <span className="text-sm text-muted-foreground">{option.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
                </div>
              </div>

              <Separator />

              {/* Food & Drink Add-ons */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Food & Drink Add-ons *</h2>
                <div className="space-y-2">
                  <Label>Should we include any meals, snacks, or drinks for your evening?</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Feel free to choose as many options as you'd like, and we'll handle the reservations! Just a
                    heads-up: Be sure to select a food option if you want us to plan any meal stops. Please note the
                    cost of food and drinks are not included in the overall price of our service.
                  </p>
                  <div className="space-y-4">
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
                          />
                          <Label htmlFor={option.id}>{option.label}</Label>
                        </div>
                        {option.id !== "none" && formData.foodDrinkOptions[option.id]?.selected && (
                          <div className="ml-6">
                            <Label htmlFor={`${option.id}-amount`} className="text-sm">
                              How much are you willing to spend per person on {option.label.toLowerCase()}?
                            </Label>
                            <Input
                              id={`${option.id}-amount`}
                              type="number"
                              placeholder="Enter amount in $"
                              value={formData.foodDrinkOptions[option.id]?.amount || ""}
                              onChange={(e) => handleFoodDrinkAmountChange(option.id, e.target.value)}
                              className="w-32 mt-1"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.foodDrink && <p className="text-sm text-red-500">{errors.foodDrink}</p>}
                </div>
              </div>

              <Separator />

              {/* Interests & Preferences */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Interests & Preferences *</h2>
                <div className="space-y-2">
                  <Label>What are you interested in experiencing during your Truvay Night Out?</Label>
                  <div className="space-y-2">
                    {interestOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={formData.interests.includes(option.value)}
                          onCheckedChange={(checked) => handleInterestChange(option.value, checked as boolean)}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.interests && <p className="text-sm text-red-500">{errors.interests}</p>}
                </div>

                <div className="mt-4 space-y-2">
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
              </div>

              <Separator />

              {/* Communication Preferences */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Communication Preferences</h2>
                <div className="space-y-4">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="essentialComms"
                      checked={formData.essentialComms}
                      onCheckedChange={(checked) => handleCheckboxChange("essentialComms", checked as boolean)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="essentialComms" className="font-medium">
                        Essential communications for Your Truvay Night Out *
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        I agree to receive text messages and emails from Truvay that are essential for managing and
                        delivering my booked Truvay Night Out.
                      </p>
                    </div>
                  </div>
                  {errors.essentialComms && <p className="text-sm text-red-500">{errors.essentialComms}</p>}

                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="marketingComms"
                      checked={formData.marketingComms}
                      onCheckedChange={(checked) => handleCheckboxChange("marketingComms", checked as boolean)}
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

              <Separator />

              {/* Payment */}
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
                      />
                      {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 lg:hidden">
                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Complete Booking - $${totalAmount}`}
                </Button>
              </div>
            </form>
          </div>

          {/* Floating Total Cost Component */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Number of Guests:</span>
                      <span>{formData.groupSize || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost per Person:</span>
                      <span>${formData.budget || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${totalAmount}</span>
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-4"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Complete Booking`}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Secure payment processing. Your card will be charged ${totalAmount}.
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
