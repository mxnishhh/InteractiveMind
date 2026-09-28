'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SiteSettings } from '@/types';
import {
  Save,
  Building2,
  PhoneCall,
  MapPin,
  Globe,
  Sparkles,
  Mail,
  Phone,
  MessageCircle,
  Clock,
} from 'lucide-react';

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
        setToastMsg({ type: 'error', message: 'Unable to connect to site settings API' });
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

      setToastMsg({ type: 'success', message: 'Site configuration saved successfully.' });
    } catch (err: any) {
      setToastMsg({ type: 'error', message: err.message || 'Error saving settings' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <AdminPageHeader
          eyebrow="Configuration"
          title="Clinic & Site Settings"
          description="Manage global clinic identity, phone numbers, WhatsApp, physical address, and homepage copy."
        />
        <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center text-xs text-stone-600 font-medium animate-pulse">
          Loading site configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {toastMsg && <Toast type={toastMsg.type} message={toastMsg.message} onClose={() => setToastMsg(null)} />}

      <AdminPageHeader
        eyebrow="Configuration"
        title="Clinic & Site Settings"
        description="Manage global clinic identity, phone numbers, WhatsApp, physical address, and homepage copy."
        actions={
          <Button
            onClick={handleSave}
            variant="primary"
            size="sm"
            isLoading={isSaving}
            className="gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </Button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6 text-xs text-stone-800">
        {/* Section 1: General Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-850 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-brand-750" />
            </div>
            <div>
              <h2 className="font-serif-heading font-bold text-brand-950 text-base">General Clinic Identity</h2>
              <p className="text-stone-600 text-xs font-medium">Public center name, branding tagline, and legal footer copyright</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Center / Organization Name"
              name="site_name"
              value={settings.site_name}
              onChange={handleChange}
              placeholder="Interactive Minds"
              required
            />
            <Input
              label="Tagline / Medical Sub-heading"
              name="site_tagline"
              value={settings.site_tagline}
              onChange={handleChange}
              placeholder="Autism Care & Child Development Centre"
              required
            />
          </div>

          <Input
            label="Footer Copyright & Legal Attribution"
            name="footer_copyright"
            value={settings.footer_copyright || ''}
            onChange={handleChange}
            placeholder="© 2026 Interactive Minds Child Development Centre. All rights reserved."
          />
        </div>

        {/* Section 2: Contact Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-850 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-brand-750" />
            </div>
            <div>
              <h2 className="font-serif-heading font-bold text-brand-950 text-base">Contact &amp; Clinical Inquiries</h2>
              <p className="text-stone-600 text-xs font-medium">Public telephone lines, clinical intake email, and WhatsApp booking number</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <Input
                label="Official Clinical Email"
                type="email"
                name="site_email"
                value={settings.site_email}
                onChange={handleChange}
                placeholder="care@interactiveminds.in"
                required
              />
            </div>
            <div>
              <Input
                label="Clinic Phone Number"
                name="site_phone"
                value={settings.site_phone}
                onChange={handleChange}
                placeholder="+91 94310 XXXXX"
                required
              />
            </div>
            <div>
              <Input
                label="WhatsApp Number (with country code)"
                name="whatsapp_number"
                value={settings.whatsapp_number}
                onChange={handleChange}
                placeholder="9194310XXXXX"
                helperText="Formatted with country code without + (e.g. 919431000000)"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Location & Hours */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-850 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-brand-750" />
            </div>
            <div>
              <h2 className="font-serif-heading font-bold text-brand-950 text-base">Clinic Location &amp; Hours</h2>
              <p className="text-stone-600 text-xs font-medium">Physical therapy center address and clinical operating schedule</p>
            </div>
          </div>

          <Textarea
            label="Physical Center Address"
            name="site_address"
            rows={3}
            value={settings.site_address}
            onChange={handleChange}
            placeholder="Plot No. XX, Boring Canal Road, Patna, Bihar - 800001"
            required
          />

          <Input
            label="Clinical Working Hours"
            name="working_hours"
            value={settings.working_hours}
            onChange={handleChange}
            placeholder="Monday – Saturday: 9:00 AM – 7:00 PM (Sunday Closed)"
            required
          />
        </div>

        {/* Section 4: Homepage Copy */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-850 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-brand-750" />
            </div>
            <div>
              <h2 className="font-serif-heading font-bold text-brand-950 text-base">Homepage Hero Headlines</h2>
              <p className="text-stone-600 text-xs font-medium">Primary heading and supporting clinical copy on the landing page</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Hero Primary Heading"
              name="hero_heading"
              value={settings.hero_heading || ''}
              onChange={handleChange}
              placeholder="Empowering Children Through Evidence-Based Developmental Therapy"
            />
            <Textarea
              label="Hero Clinical Sub-heading"
              name="hero_subheading"
              rows={3}
              value={settings.hero_subheading || ''}
              onChange={handleChange}
              placeholder="Comprehensive assessment, personalized occupational therapy, speech-language pathology, and behavioral intervention for developmental milestones in Patna."
            />
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-stone-600 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-brand-700" />
            <span>Changes take effect immediately on the public website and contact touchpoints.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            className="gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
