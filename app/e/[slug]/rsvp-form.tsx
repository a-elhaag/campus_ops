"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/useToast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export default function RSVPForm({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const toast = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex =
      /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, "").length >= 10;
    return phoneRegex;
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        return undefined;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!validatePhone(value))
          return "Please enter a valid phone number (10+ digits)";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate all fields before submission
    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const phoneError = validateField("phone", formData.phone);

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
    });

    if (nameError || emailError || phoneError) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/events/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to RSVP");
      }

      setSuccess(true);
      toast.success("Registration confirmed! See you there!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="animate-slideUp p-6 bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-200/10 text-green-900 dark:text-green-100 rounded-2xl text-center space-y-2">
        <div className="flex justify-center mb-2">
          <CheckCircle2 className="w-8 h-8 animate-checkmark" />
        </div>
        <p className="text-lg font-bold">Registration Confirmed</p>
        <p className="text-sm text-green-800 dark:text-green-200">
          Thank you for registering! We'll see you at the event.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-1 ml-2">
          <Label
            htmlFor="name"
            className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300"
          >
            Full Name
          </Label>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <div className="relative">
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jane Doe"
            className={`h-12 rounded-xl text-base border-2 transition-colors dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400 ${
              errors.name && touched.name
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {touched.name && !errors.name && (
            <CheckCircle2 className="absolute right-4 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.name && touched.name && (
          <div className="animate-slideUp flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-semibold px-2">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-1 ml-2">
          <Label
            htmlFor="email"
            className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300"
          >
            Email Address
          </Label>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="jane@example.com"
            className={`h-12 rounded-xl text-base border-2 transition-colors dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400 ${
              errors.email && touched.email
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {touched.email && !errors.email && (
            <CheckCircle2 className="absolute right-4 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.email && touched.email && (
          <div className="animate-slideUp flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-semibold px-2">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-1 ml-2">
          <Label
            htmlFor="phone"
            className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300"
          >
            Phone Number
          </Label>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <div className="relative">
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+1 (555) 123-4567"
            className={`h-12 rounded-xl text-base border-2 transition-colors dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400 ${
              errors.phone && touched.phone
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {touched.phone && !errors.phone && (
            <CheckCircle2 className="absolute right-4 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.phone && touched.phone && (
          <div className="animate-slideUp flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-semibold px-2">
            <AlertCircle className="w-4 h-4" />
            {errors.phone}
          </div>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full mt-8 uppercase tracking-widest text-base"
        disabled={loading}
        isLoading={loading}
      >
        Confirm RSVP
      </Button>
    </form>
  );
}
