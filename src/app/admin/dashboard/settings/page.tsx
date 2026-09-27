'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/ui/Input';
import { Textarea } from '@/ui/Textarea';
import { Button } from '@/ui/Button';
import { Toast } from '@/ui/Toast';
import { SiteSettings } from '@/types';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: '',
    site_tagline: '',
    site_email: '',
    site_phone: '',
    whatsapp_number: '',
    site_address: '',
    working_hours: '',
    hero_heading: '',
    hero_subheading: '',
    footer_copyright: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.data) setSettings(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToastMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setToastMsg({ type: 'success', message: 'Site settings saved successfully.' });
    } catch (err: any) {
      setToastMsg({ type: 'error', message: err.message || 'Error saving settings' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading site settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Manage global center details, contact numbers, and address</p>
      </div>

      {toastMsg && <Toast type={toastMsg.type} message={toastMsg.message} onClose={() => setToastMsg(null)} />}

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
        
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">General Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Center Site Name" name="site_name" value={settings.site_name} onChange={handleChange} required />
          <Input label="Site Tagline" name="site_tagline" value={settings.site_tagline} onChange={handleChange} required />
        </div>

        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 pt-4">Contact Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Official Email" type="email" name="site_email" value={settings.site_email} onChange={handleChange} required />
          <Input label="Phone Number" name="site_phone" value={settings.site_phone} onChange={handleChange} required />
          <Input label="WhatsApp Number (with country code)" name="whatsapp_number" value={settings.whatsapp_number} onChange={handleChange} required />
        </div>

        <Textarea label="Physical Address" name="site_address" value={settings.site_address} onChange={handleChange} required />

        <Input label="Working Hours" name="working_hours" value={settings.working_hours} onChange={handleChange} required />

        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 pt-4">Homepage Text</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Hero Heading" name="hero_heading" value={settings.hero_heading} onChange={handleChange} />
          <Input label="Hero Subheading" name="hero_subheading" value={settings.hero_subheading} onChange={handleChange} />
        </div>

        <Button type="submit" size="lg" isLoading={isSaving} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          <span>Save Settings</span>
        </Button>
      </form>
    </div>
  );
}
