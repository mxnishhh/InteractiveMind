'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferred_contact_method: 'email',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit contact enquiry.');
      }

      setSuccessMsg(data.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferred_contact_method: 'email',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {successMsg && <Toast type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}
      {errorMsg && <Toast type="error" message={errorMsg} onClose={() => setErrorMsg(null)} />}

      <Input
        label="Your Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="e.g. Rahul Sharma"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          placeholder="+91 94310 XXXXX"
        />
      </div>

      <Input
        label="Subject (Optional)"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="e.g. Enquiry about Speech Therapy assessment"
      />

      <Textarea
        label="Message / Clinical Query"
        name="message"
        rows={4}
        value={formData.message}
        onChange={handleChange}
        required
        placeholder="Please describe how our clinical team can assist your family..."
      />

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          className="w-full shadow-card hover:shadow-card-hover py-3.5 text-xs font-semibold uppercase tracking-wider"
        >
          Send Enquiry
        </Button>
      </div>

      <p className="text-[11px] text-center text-stone-500 italic leading-relaxed">
        All messages are treated confidentially and reviewed by our clinical intake team within 24 hours.
      </p>
    </form>
  );
};
