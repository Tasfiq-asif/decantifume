"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  // Get current year - will be the same on server and client
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="px-8 py-12 md:py-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">DECANT</h3>
            <p className="text-sm text-muted-foreground">
              Premium decant perfumes at affordable prices. Experience luxury
              scents without the full bottle commitment.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/designer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Designer
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/niche"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Niche
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/bestsellers"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/new"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Order History
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} DECANT Perfumes. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
