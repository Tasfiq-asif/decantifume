"use client";

import { useEffect } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { usePageLoading } from "@/lib/hooks/usePageLoading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Heart, Shield, Star, Users, Zap } from "lucide-react";

export default function AboutPage() {
  const { setLoading } = usePageLoading();

  useEffect(() => {
    setLoading(true, "Loading About Us...");
    setTimeout(() => setLoading(false), 1500);
  }, [setLoading]);

  const features = [
    {
      icon: Droplets,
      title: "Premium Quality",
      description:
        "Only the finest fragrances from renowned perfume houses, carefully decanted for your enjoyment.",
    },
    {
      icon: Heart,
      title: "Passion for Fragrance",
      description:
        "Founded by fragrance enthusiasts who understand the art and science of perfumery.",
    },
    {
      icon: Shield,
      title: "Authentic Guarantee",
      description:
        "100% authentic fragrances sourced directly from authorized distributors and retailers.",
    },
    {
      icon: Star,
      title: "Exceptional Service",
      description:
        "Personalized recommendations and expert guidance to help you find your signature scent.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Building a community of fragrance lovers who share, discover, and celebrate scents together.",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description:
        "Quick processing and secure shipping to ensure your fragrances arrive safely and promptly.",
    },
  ];

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-950 via-dark-purple-900 to-dark-purple-800">
        {/* Hero Section */}
        <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-lavender-900/60 via-dark-purple-800/80 to-dark-purple-900/90" />
            <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-lavender-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-lavender-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-lavender-400/10 to-purple-700/10 rounded-full blur-3xl animate-pulse delay-500" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <Badge className="mb-6 bg-lavender-600/20 text-lavender-200 border-lavender-400/30">
              Est. 2024
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-lavender-100 via-lavender-200 to-lavender-300 bg-clip-text text-transparent mb-6">
              About Decant
            </h1>
            <p className="text-xl md:text-2xl text-lavender-200 leading-relaxed max-w-2xl mx-auto">
              Democratizing luxury fragrances through premium decants, making
              high-end perfumes accessible to every fragrance enthusiast.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-lavender-100">
                  Our Story
                </h2>
                <p className="text-lavender-300 text-lg leading-relaxed">
                  Born from a passion for luxury fragrances and the belief that
                  everyone deserves to experience exceptional scents, Decant was
                  founded to bridge the gap between desire and accessibility.
                </p>
                <p className="text-lavender-300 text-lg leading-relaxed">
                  We recognized that many fragrance lovers wanted to explore
                  premium perfumes without committing to full bottles. Our
                  solution? Premium decants that let you discover, test, and
                  enjoy luxury fragrances at a fraction of the cost.
                </p>
                <p className="text-lavender-300 text-lg leading-relaxed">
                  What started as a small collection has grown into a curated
                  selection of the world&rsquo;s most coveted fragrances, each
                  carefully decanted with precision and love.
                </p>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-64 bg-gradient-to-br from-lavender-600/30 via-purple-600/20 to-dark-purple-800/40 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 backdrop-blur-sm border border-lavender-400/20">
                    <div className="h-full w-full bg-gradient-to-br from-lavender-400/10 to-purple-700/20 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-lavender-500/30 rounded-full blur-xl"></div>
                    </div>
                  </div>
                  <div className="h-64 bg-gradient-to-br from-purple-600/30 via-lavender-500/20 to-dark-purple-700/40 rounded-lg shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 backdrop-blur-sm border border-purple-400/20 mt-8">
                    <div className="h-full w-full bg-gradient-to-br from-purple-400/10 to-lavender-600/20 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-purple-500/30 rounded-full blur-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-64 bg-gradient-to-br from-dark-purple-700/40 via-lavender-600/30 to-purple-800/30 rounded-lg shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 backdrop-blur-sm border border-dark-purple-400/20">
                    <div className="h-full w-full bg-gradient-to-br from-dark-purple-500/10 to-lavender-500/20 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-dark-purple-400/30 rounded-full blur-xl"></div>
                    </div>
                  </div>
                  <div className="h-64 bg-gradient-to-br from-lavender-700/40 via-purple-500/30 to-dark-purple-600/40 rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300 backdrop-blur-sm border border-lavender-500/20 mt-6">
                    <div className="h-full w-full bg-gradient-to-br from-lavender-500/10 to-purple-600/20 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-lavender-400/30 rounded-full blur-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-4xl font-bold text-lavender-100">
                  Our Mission
                </h2>
                <p className="text-lavender-300 text-lg leading-relaxed">
                  To make luxury fragrances accessible to everyone by providing
                  premium decants that maintain the integrity and quality of the
                  original perfumes.
                </p>
                <p className="text-lavender-300 text-lg leading-relaxed">
                  We believe that fragrance is a form of self-expression, and
                  everyone should have the opportunity to discover their
                  signature scent without financial barriers. Through our
                  carefully curated selection and expert knowledge, we guide
                  fragrance enthusiasts on their olfactory journey.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  <Badge
                    variant="outline"
                    className="border-lavender-400/50 text-lavender-200"
                  >
                    Authentic
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-lavender-400/50 text-lavender-200"
                  >
                    Premium Quality
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-lavender-400/50 text-lavender-200"
                  >
                    Accessible
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-lavender-400/50 text-lavender-200"
                  >
                    Expert Curated
                  </Badge>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-lavender-100 mb-4">
                  Why Choose Decant?
                </h2>
                <p className="text-lavender-300 text-lg max-w-2xl mx-auto">
                  We&rsquo;re more than just a decant service - we&rsquo;re your
                  partners in fragrance discovery.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={index}
                      className="bg-gradient-to-b from-dark-purple-900/50 to-dark-purple-800/50 border border-lavender-400/20 backdrop-blur-sm hover:border-lavender-400/40 transition-colors duration-300"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-lavender-600/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-lavender-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-lavender-100 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-lavender-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Values Section */}
            <div className="text-center">
              <Card className="bg-gradient-to-br from-lavender-900/20 via-dark-purple-900/30 to-lavender-800/20 border border-lavender-400/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-lavender-500/10 to-purple-600/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-lavender-600/10 rounded-full blur-2xl" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-lavender-400/5 to-purple-700/5 rounded-full blur-3xl" />
                </div>
                <CardContent className="p-12 relative z-10">
                  <h2 className="text-4xl font-bold text-lavender-100 mb-6">
                    Our Promise
                  </h2>
                  <p className="text-lavender-300 text-xl leading-relaxed max-w-4xl mx-auto mb-8">
                    Every decant tells a story. Every fragrance opens a door to
                    new experiences. We promise to deliver not just perfumes,
                    but memories, emotions, and the confidence that comes with
                    finding your perfect scent.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Badge className="bg-gradient-to-r from-lavender-600 to-purple-600 text-white px-4 py-2 text-sm border-0">
                      🌟 Premium Quality
                    </Badge>
                    <Badge className="bg-gradient-to-r from-purple-600 to-lavender-600 text-white px-4 py-2 text-sm border-0">
                      🔒 100% Authentic
                    </Badge>
                    <Badge className="bg-gradient-to-r from-lavender-500 to-purple-700 text-white px-4 py-2 text-sm border-0">
                      ⚡ Fast Shipping
                    </Badge>
                    <Badge className="bg-gradient-to-r from-purple-700 to-lavender-500 text-white px-4 py-2 text-sm border-0">
                      💜 Made with Love
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
