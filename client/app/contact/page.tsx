"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Send,
  CheckCircle2,
} from "lucide-react";
import { FadeIn } from "@/components/Motion";

const SERVICES = [
  "Retail Leasing",
  "Commercial Leasing",
  "Project Management Consultancy (PMC)",
  "Sales & Purchase",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-blue-900/30 pointer-events-none" />
        <FadeIn>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Get In Touch
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Have a real estate requirement? Send us an inquiry and our team
              will get back to you within 24 hours.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <FadeIn direction="left" className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-900/40 border border-blue-800/50 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-0.5">
                        Office Address
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Bhiwadi Alwar Bypass Rd, adjoining Kajaria Greens,
                        <br />
                        Bhiwadi, Rajasthan 301019
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-900/40 border border-blue-800/50 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-0.5">
                        Phone
                      </p>
                      <a
                        href="tel:+919116052405"
                        className="text-gray-400 text-sm hover:text-blue-400 transition-colors"
                      >
                        +91 91160 52405
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-900/40 border border-blue-800/50 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-0.5">
                        Email
                      </p>
                      <a
                        href="mailto:info@theleasingworld.com"
                        className="text-gray-400 text-sm hover:text-blue-400 transition-colors"
                      >
                        info@theleasingworld.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm">
                  Follow Us
                </h3>
                <div className="flex items-center gap-3">
                  {[
                    {
                      icon: Facebook,
                      href: "https://facebook.com",
                      label: "Facebook",
                    },
                    {
                      icon: Instagram,
                      href: "https://instagram.com",
                      label: "Instagram",
                    },
                    {
                      icon: Linkedin,
                      href: "https://linkedin.com",
                      label: "LinkedIn",
                    },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="h-10 w-10 rounded-full border border-white/10 hover:border-blue-500 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm">
                  Our Location
                </h3>
                <div className="rounded-xl overflow-hidden border border-white/10 h-52">
                  <iframe
                    src="https://maps.google.com/maps?ll=28.198443,76.810403&z=16&t=m&hl=en&gl=IN&mapclient=embed&cid=15792768173380966308&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn direction="right" className="lg:col-span-3">
            <div>
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 border border-white/10 rounded-2xl">
                  <CheckCircle2 className="h-14 w-14 text-green-400 mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Inquiry Sent!
                  </h2>
                  <p className="text-gray-400 max-w-sm">
                    Thank you for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-[#111118] border border-white/10 rounded-2xl p-8 space-y-5"
                >
                  <h2 className="text-xl font-bold text-white mb-2">
                    Send Inquiry
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">
                        Service Required
                      </label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="" className="bg-[#111118]">
                          Select a service
                        </option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s} className="bg-[#111118]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your requirement (e.g. location, area, budget, brand name...)"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    <Send className="h-4 w-4" /> Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
