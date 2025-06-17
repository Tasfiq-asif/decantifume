"use client";

import { useEffect } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { usePageLoading } from "@/lib/hooks/usePageLoading";

export default function AboutPage() {
  const { setLoading } = usePageLoading();

  useEffect(() => {
    setLoading(true, "Loading About Us...");
    setTimeout(() => setLoading(false), 1500);
  }, [setLoading]);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-950 via-dark-purple-900 to-dark-purple-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-lavender-100 via-lavender-200 to-lavender-300 bg-clip-text text-transparent mb-4">
              About Decant
            </h1>
            <p className="text-lavender-200 text-lg">
              Discover the story behind our passion for fragrance
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-b from-dark-purple-900 to-dark-purple-800 rounded-lg p-8 border border-lavender-400/20 shadow-lavender-soft">
              <h2 className="text-2xl font-semibold text-lavender-100 mb-4">
                Our Story
              </h2>
              <p className="text-lavender-300 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            <div className="bg-gradient-to-b from-dark-purple-900 to-dark-purple-800 rounded-lg p-8 border border-lavender-400/20 shadow-lavender-soft">
              <h2 className="text-2xl font-semibold text-lavender-100 mb-4">
                Our Mission
              </h2>
              <p className="text-lavender-300 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
