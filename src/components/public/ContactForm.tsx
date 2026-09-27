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
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && <Toast type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}
      {errorMsg && <Toast type="error" message={errorMsg} onClose={() => setErrorMsg(null)} />}

      <Input
        label="Your Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter your name"
      />

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

      <Input
        label="Subject (Optional)"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="e.g. Enquiry about Speech Therapy"
      />

      <Textarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
        placeholder="How can Interactive Minds support your family?"
      />

      <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
        Send Message
      </Button>
    </form>
  );
};
