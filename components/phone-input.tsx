"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")

  const countryCodes = [
    { value: "+1", label: "+1 US/CA", country: "US/CA" },
    { value: "+44", label: "+44 UK", country: "UK" },
    { value: "+61", label: "+61 AU", country: "AU" },
    { value: "+33", label: "+33 FR", country: "FR" },
    { value: "+49", label: "+49 DE", country: "DE" },
    { value: "+81", label: "+81 JP", country: "JP" },
    { value: "+86", label: "+86 CN", country: "CN" },
    { value: "+91", label: "+91 IN", country: "IN" },
  ]

  // Initialize from existing value
  useEffect(() => {
    if (value) {
      const parts = value.split(" ")
      if (parts.length > 1) {
        const code = parts[0]
        const number = parts.slice(1).join(" ")
        setCountryCode(code)
        setPhoneNumber(number)
      }
    }
  }, [])

  const formatPhoneNumber = (input: string, country: string) => {
    // Remove all non-digits
    const cleaned = input.replace(/\D/g, "")

    if (country === "+1") {
      // US/Canada formatting: (123) 456-7890
      if (cleaned.length <= 3) return cleaned
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    }

    // Default formatting for other countries - just return the cleaned number
    return cleaned
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input, countryCode)
    setPhoneNumber(formatted)
    onChange(`${countryCode} ${formatted}`)
  }

  const handleCountryChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode)
    const formatted = formatPhoneNumber(phoneNumber, newCountryCode)
    setPhoneNumber(formatted)
    onChange(`${newCountryCode} ${formatted}`)
  }

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((code) => (
            <SelectItem key={code.value} value={code.value}>
              {code.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder || "Enter phone number"}
        className="flex-1"
      />
    </div>
  )
}
