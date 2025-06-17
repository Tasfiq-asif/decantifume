"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/lib/hooks/useAuth";
import { useAppSelector } from "@/lib/hooks/reduxHooks";
import { usePageLoading } from "@/lib/hooks/usePageLoading";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalQuantity } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user, logout } = useAuth();
  const { navigateWithLoading } = usePageLoading();

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigation = (href: string, name: string) => {
    if (pathname !== href) {
      navigateWithLoading(href, `Loading ${name}...`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className=" flex h-16 items-center ">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.name)}
                  className={`text-left text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="mr-4 flex ">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">DECANT</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, item.name)}
                className={`transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 items-center justify-end  flex space-x-2">
          <div className="hidden md:flex w-full max-w-sm items-center space-x-2 mr-4">
            <Input
              type="search"
              placeholder="Search for perfumes..."
              className="bg-muted/50"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/account", "Account")}
                  >
                    <span className="w-full">My Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/orders", "Orders")}
                  >
                    <span className="w-full">Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/wishlist", "Wishlist")}
                  >
                    <span className="w-full">Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <span className="w-full">Sign Out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link href="/login" className="w-full">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/register" className="w-full">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
