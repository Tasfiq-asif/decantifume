"use client";

import { useEffect } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { usePageLoading } from "@/lib/hooks/usePageLoading";

export default function CollectionsPage() {
  const { setLoading } = usePageLoading();

  useEffect(() => {
    // Simulate loading data when page loads
    setLoading(true, "Loading Collections...");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [setLoading]);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-950 via-dark-purple-900 to-dark-purple-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-lavender-100 via-lavender-200 to-lavender-300 bg-clip-text text-transparent mb-4">
              Our Collections
            </h1>
            <p className="text-lavender-200 text-lg">
              Discover our curated selection of premium fragrances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-dark-purple-900 to-dark-purple-800 rounded-lg p-6 border border-lavender-400/20 shadow-lavender-soft"
              >
                <div className="h-48 bg-gradient-to-b from-lavender-200/20 to-lavender-400/40 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold text-lavender-100 mb-2">
                  Collection {i}
                </h3>
                <p className="text-lavender-300 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
