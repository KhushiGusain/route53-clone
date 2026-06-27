"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      setCheckingAuth(false);
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (checkingAuth) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
