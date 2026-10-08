'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactInquiryFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const ContactInquiryForm: React.FC<ContactInquiryFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    preferred_contact_method: 'email',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const topicOptions = [
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Therapy Services (Occupational, Speech, ABA, Special Ed)', label: 'Therapy Services & Programs' },
    { value: 'Clinical Assessment & Evaluation', label: 'Clinical Assessment & Evaluation' },
    { value: 'Schedule, Timings & Location', label: 'Schedule, Timings & Location' },
    { value: 'Parent Training & Home Guidance (PCTP)', label: 'Parent Guidance & Training (PCTP)' },
    { value: 'Fee Structure & Enrolment', label: 'Fee Structure & Enrolment' },
    { value: 'Other / Collaboration', label: 'Other / General Question' },
  ];

  const contactMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'whatsapp', label: 'WhatsApp Message' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (minimum 2 characters)';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a message with at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject || 'General Inquiry',
          message: formData.message.trim(),
          preferred_contact_method: formData.preferred_contact_method || 'email',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors: { [key: string]: string } = {};
          data.details.forEach((err: any) => {
            const field = err.path?.[0];
            if (field) fieldErrors[field] = err.message;
          });
          setErrors(fieldErrors);
          throw new Error(data.error || 'Please correct the highlighted fields.');
        }
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
        preferred_contact_method: 'email',
      });
      setErrors({});
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setServerError(null);
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="bg-brand-50/70 border border-brand-200/90 rounded-2xl p-8 text-center space-y-5 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-850 flex items-center justify-center mx-auto shadow-xs border border-brand-200/60">
          <CheckCircle2 className="w-7 h-7 text-brand-800" />
        </div>

        <div className="space-y-2">
          <h3 className="font-serif-heading text-2xl font-bold text-brand-950">Inquiry Received</h3>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Thank you for reaching out to Interactive Minds. Our clinical coordination team will review your message and get back to you shortly.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-brand-200 text-xs font-semibold text-brand-900 shadow-2xs">
          <MessageSquare className="w-4 h-4 text-brand-700" />
          <span>Average response time: within 24 hours</span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-brand-850 hover:text-brand-700 hover:underline transition-colors focus:outline-none"
          >
            Send another question or inquiry &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
      {serverError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Row 1: Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Full Name"
          name="name"
          placeholder="e.g. Priya Sharma"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. priya.sharma@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      </div>

      {/* Row 2: Phone and Inquiry Topic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone / Mobile (Optional)"
          name="phone"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          helperText="Optional, for quick callback or WhatsApp updates"
        />
        <Select
          label="Inquiry Topic"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          options={topicOptions}
          error={errors.subject}
        />
      </div>

      {/* Row 3: Preferred Contact Method */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
          Preferred Response Method
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {contactMethodOptions.map((method) => {
            const isSelected = formData.preferred_contact_method === method.value;
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, preferred_contact_method: method.value }))}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-brand-50 border-brand-600 text-brand-950 ring-1 ring-brand-600 shadow-2xs font-bold'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400'
                }`}
              >
                {method.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 4: Message */}
      <div>
        <Textarea
          label="Your Question or Message"
          name="message"
          rows={4}
          placeholder="Describe your question, child's age/developmental areas, or specific information you would like to know..."
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          required
          helperText="Minimum 10 characters. All inquiries are kept strictly confidential."
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3"
        >
          <Send className="w-4 h-4" />
          <span>Send Inquiry Message</span>
        </Button>
      </div>

      <p className="text-[11px] text-stone-500 text-center leading-relaxed">
        Looking for a clinical evaluation or therapy intake? Switch to the{' '}
        <strong className="text-brand-900 font-semibold">Book Assessment</strong> tab above.
      </p>
    </form>
  );
};
