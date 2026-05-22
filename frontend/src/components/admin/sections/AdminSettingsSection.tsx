'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Building2, Phone, Mail, MapPin, Clock,
  Globe, Percent, Truck, Bell, Save, CheckCircle,
} from 'lucide-react';

interface CompanySettings {
  name:        string;
  tagline:     string;
  email:       string;
  phone1:      string;
  phone2:      string;
  phone3:      string;
  address:     string;
  city:        string;
  country:     string;
  website:     string;
  hours:       string;
}

interface BusinessSettings {
  currency:    string;
  vatRate:     number;
  minOrderQty: number;
  leadTimeDays:number;
  freeShipping:number;
  quoteValidity:number;
}

interface NotifSettings {
  newOrder:    boolean;
  newQuote:    boolean;
  newEnquiry:  boolean;
  lowStock:    boolean;
  email:       string;
}

export default function AdminSettingsSection() {
  const [company, setCompany] = useState<CompanySettings>({
    name:'Craftpack Solution', tagline:"Ethiopia's Premier Paper Bag Manufacturer",
    email:'info@craftpacksolution.com', phone1:'0901 236 509', phone2:'0957 117 787', phone3:'0910 628 159',
    address:'Gofa Camp & Gurdshola', city:'Addis Ababa', country:'Ethiopia',
    website:'https://craftpacksolution.com', hours:'Mon–Sat, 8:00 AM – 6:00 PM EAT',
  });

  const [biz, setBiz] = useState<BusinessSettings>({
    currency:'ETB', vatRate:15, minOrderQty:100, leadTimeDays:7, freeShipping:50000, quoteValidity:14,
  });

  const [notif, setNotif] = useState<NotifSettings>({
    newOrder:true, newQuote:true, newEnquiry:true, lowStock:true,
    email:'info@craftpacksolution.com',
  });

  const [saved, setSaved] = useState<string | null>(null);

  function save(section: string) {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  }

  const co = (k: keyof CompanySettings, v: string) => setCompany(p => ({ ...p, [k]: v }));
  const bo = (k: keyof BusinessSettings, v: number | string) => setBiz(p => ({ ...p, [k]: v }));
  const no = (k: keyof NotifSettings, v: boolean | string) => setNotif(p => ({ ...p, [k]: v }));

  const SaveBtn = ({ section }: { section: string }) => (
    <button onClick={() => save(section)} className="btn-primary">
      {saved === section
        ? <><CheckCircle className="w-4 h-4" /> Saved!</>
        : <><Save className="w-4 h-4" /> Save Changes</>
      }
    </button>
  );

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-400" /> Settings
        </h1>
        <p className="page-description">Manage company details, business rules, and notification preferences.</p>
      </div>

      {/* Company Info */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <Building2 className="w-5 h-5 text-brand-400" />
          <h2 className="font-display font-semibold text-white">Company Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="label">Company Name</label>
            <input value={company.name} onChange={e => co('name', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Tagline</label>
            <input value={company.tagline} onChange={e => co('tagline', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Primary Email</label>
            <input type="email" value={company.email} onChange={e => co('email', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Website</label>
            <input value={company.website} onChange={e => co('website', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Phone 1</label>
            <input value={company.phone1} onChange={e => co('phone1', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Phone 2</label>
            <input value={company.phone2} onChange={e => co('phone2', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Phone 3</label>
            <input value={company.phone3} onChange={e => co('phone3', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Business Hours</label>
            <input value={company.hours} onChange={e => co('hours', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Address</label>
            <input value={company.address} onChange={e => co('address', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">City</label>
            <input value={company.city} onChange={e => co('city', e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SaveBtn section="company" />
        </div>
      </section>

      {/* Business Rules */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <Percent className="w-5 h-5 text-gold-400" />
          <h2 className="font-display font-semibold text-white">Business Rules</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="label">Currency</label>
            <select value={biz.currency} onChange={e => bo('currency', e.target.value)} className="select-field">
              <option value="ETB">ETB — Ethiopian Birr</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="label">VAT Rate (%)</label>
            <input type="number" value={biz.vatRate} min={0} max={100}
              onChange={e => bo('vatRate', Number(e.target.value))} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Minimum Order Quantity (units)</label>
            <input type="number" value={biz.minOrderQty} min={1}
              onChange={e => bo('minOrderQty', Number(e.target.value))} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Standard Lead Time (days)</label>
            <input type="number" value={biz.leadTimeDays} min={1}
              onChange={e => bo('leadTimeDays', Number(e.target.value))} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Free Shipping Threshold (ETB)</label>
            <input type="number" value={biz.freeShipping} min={0}
              onChange={e => bo('freeShipping', Number(e.target.value))} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Quote Validity (days)</label>
            <input type="number" value={biz.quoteValidity} min={1}
              onChange={e => bo('quoteValidity', Number(e.target.value))} className="input-field" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SaveBtn section="biz" />
        </div>
      </section>

      {/* Notifications */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <Bell className="w-5 h-5 text-brand-400" />
          <h2 className="font-display font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-1 mb-4">
          <label className="label">Notification Email</label>
          <input type="email" value={notif.email} onChange={e => no('email', e.target.value)} className="input-field" />
        </div>

        <div className="space-y-3">
          {([
            { key: 'newOrder',    label: 'New Orders',            desc: 'Email when a new order is placed' },
            { key: 'newQuote',    label: 'New Quote Requests',     desc: 'Email when a quote is submitted' },
            { key: 'newEnquiry',  label: 'Contact Enquiries',      desc: 'Email when contact form is submitted' },
            { key: 'lowStock',    label: 'Low Stock Alerts',       desc: 'Email when product stock is low' },
          ] as const).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-dark-400">{desc}</p>
              </div>
              <button
                onClick={() => no(key, !notif[key])}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${notif[key] ? 'bg-brand-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notif[key] ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <SaveBtn section="notif" />
        </div>
      </section>
    </div>
  );
}
