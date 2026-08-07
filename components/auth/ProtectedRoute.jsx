"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if we are on the login, register, or landing page
    if (pathname === "/login" || pathname === "/register" || pathname === "/") {
      setIsChecking(false);
      return;
    }

    // Check local storage for the token
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Optionally render a loading state while checking authentication
  if (isChecking && pathname !== "/login" && pathname !== "/register" && pathname !== "/") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
