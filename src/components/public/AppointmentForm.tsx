'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { Service } from '@/types';
import { APPOINTMENT_PAGE } from '@/constants';

interface AppointmentFormProps {
  services?: Service[];
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ services = [] }) => {
  const [formData, setFormData] = useState({
    parent_name: '',
    child_name: '',
    email: '',
    phone: '',
    child_age: '',
    service_id: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
    preferred_contact_method: 'phone',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{ reference: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service_id: formData.service_id ? parseInt(formData.service_id, 10) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit appointment request.');
      }

      setSuccessResult({
        reference: data.data.reference,
        message: data.message,
      });

      setFormData({
        parent_name: '',
        child_name: '',
        email: '',
        phone: '',
        child_age: '',
        service_id: '',
        preferred_date: '',
        preferred_time: '',
        message: '',
        preferred_contact_method: 'phone',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const timeSlotOptions = [
    { value: 'Morning (9:00 AM - 12:00 PM)', label: 'Morning (9:00 AM - 12:00 PM)' },
    { value: 'Afternoon (12:00 PM - 3:00 PM)', label: 'Afternoon (12:00 PM - 3:00 PM)' },
    { value: 'Late Afternoon (3:00 PM - 5:00 PM)', label: 'Late Afternoon (3:00 PM - 5:00 PM)' },
  ];

  const ageOptions = [
    { value: '0-3 Years (Early Intervention)', label: '0-3 Years (Early Intervention)' },
    { value: '3-5 Years (Preschool)', label: '3-5 Years (Preschool)' },
    { value: '5-8 Years (Early School Age)', label: '5-8 Years (Early School Age)' },
    { value: '8+ Years (Youth)', label: '8+ Years (Youth)' },
  ];

  if (successResult) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">{APPOINTMENT_PAGE.successTitle}</h3>
        <p className="text-slate-600 text-xs max-w-md mx-auto">{successResult.message}</p>
        <div className="inline-block bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm">
          <span className="block text-[10px] font-bold text-slate-400 uppercase">Reference Code</span>
          <span className="block text-lg font-extrabold text-slate-900 mt-0.5">{successResult.reference}</span>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setSuccessResult(null)}
            className="text-xs font-bold text-slate-900 hover:underline"
          >
            {APPOINTMENT_PAGE.submitAnotherText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && <Toast type="error" message={errorMsg} onClose={() => setErrorMsg(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Parent / Guardian Name"
          name="parent_name"
          value={formData.parent_name}
          onChange={handleChange}
          required
          placeholder="e.g. Sarah Jenkins"
        />
        <Input
          label="Child Name"
          name="child_name"
          value={formData.child_name}
          onChange={handleChange}
          required
          placeholder="e.g. Leo"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
        />
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="(555) 000-0000"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Child's Age Group"
          name="child_age"
          options={ageOptions}
          value={formData.child_age}
          onChange={handleChange}
          required
          placeholder="Select age group"
        />
        <Select
          label="Preferred Therapy Service"
          name="service_id"
          options={serviceOptions}
          value={formData.service_id}
          onChange={handleChange}
          placeholder="Select therapy service (optional)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Preferred Date"
          type="date"
          name="preferred_date"
          value={formData.preferred_date}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
        />
        <Select
          label="Preferred Time Window"
          name="preferred_time"
          options={timeSlotOptions}
          value={formData.preferred_time}
          onChange={handleChange}
          required
          placeholder="Select preferred time"
        />
      </div>

      <Textarea
        label="Message / Concerns (Optional)"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Please share any developmental goals or concerns..."
      />

      <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
        Submit Appointment Request
      </Button>

      <p className="text-xs text-center text-slate-500 italic">
        {APPOINTMENT_PAGE.formNotice}
      </p>
    </form>
  );
};
