//@ts-nocheck
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { SessionGuard } from "@/components/layout/session-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "S3",
  description: "Sistema 3",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">
          <SessionGuard>{children}</SessionGuard>
        </main>
      </div>
    </>
  );
}
