"use client";

import { useEffect } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { usePageLoading } from "@/lib/hooks/usePageLoading";

export default function ContactPage() {
  const { setLoading } = usePageLoading();

  useEffect(() => {
    setLoading(true, "Loading Contact Info...");
    setTimeout(() => setLoading(false), 1200);
  }, [setLoading]);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-950 via-dark-purple-900 to-dark-purple-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-lavender-100 via-lavender-200 to-lavender-300 bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <p className="text-lavender-200 text-lg">
              Get in touch with our fragrance experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-b from-dark-purple-900 to-dark-purple-800 rounded-lg p-8 border border-lavender-400/20 shadow-lavender-soft">
              <h2 className="text-2xl font-semibold text-lavender-100 mb-6">
                Send us a message
              </h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 bg-dark-purple-800 border border-lavender-400/30 rounded-lg text-lavender-100 placeholder-lavender-400 focus:outline-none focus:border-lavender-300"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 bg-dark-purple-800 border border-lavender-400/30 rounded-lg text-lavender-100 placeholder-lavender-400 focus:outline-none focus:border-lavender-300"
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="w-full p-3 bg-dark-purple-800 border border-lavender-400/30 rounded-lg text-lavender-100 placeholder-lavender-400 focus:outline-none focus:border-lavender-300 resize-none"
                ></textarea>
                <button className="w-full bg-gradient-to-r from-lavender-500 to-lavender-600 text-white py-3 rounded-lg hover:from-lavender-600 hover:to-lavender-700 transition-all duration-200">
                  Send Message
                </button>
              </form>
            </div>

            <div className="bg-gradient-to-b from-dark-purple-900 to-dark-purple-800 rounded-lg p-8 border border-lavender-400/20 shadow-lavender-soft">
              <h2 className="text-2xl font-semibold text-lavender-100 mb-6">
                Contact Information
              </h2>
              <div className="space-y-4 text-lavender-300">
                <div>
                  <h3 className="font-semibold text-lavender-200">Email</h3>
                  <p>hello@decantperfumes.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lavender-200">Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lavender-200">Address</h3>
                  <p>
                    123 Fragrance Street
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
