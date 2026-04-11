import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkShortener - Create & Track Shortened URLs",
  description: "Transform long URLs into shareable links. Track clicks, generate QR codes, and customize your links with our powerful link shortener.",
};

const clerkTheme = {
  appearance: {
    baseTheme: "dark",
    variables: {
      colorBackground: "#111827",
      colorInputBackground: "#1f2937",
      colorInputText: "#ffffff",
      colorText: "#ffffff",
      colorTextSecondary: "#d1d5db",
      colorPrimary: "#2563eb",
      colorSuccess: "#10b981",
      colorDanger: "#ef4444",
      colorWarning: "#f59e0b",
      colorAlphaShade: "rgba(255, 255, 255, 0.1)",
      colorAlphaTint: "rgba(255, 255, 255, 0.05)",
      fontFamilyBody: "var(--font-geist-sans)",
      fontFamilyButtons: "var(--font-geist-sans)",
      fontFamilyLabels: "var(--font-geist-sans)",
      fontFamilyCode: "var(--font-geist-mono)",
      fontSize: "14px",
      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "600",
      },
      borderRadius: "0.625rem",
      spacingUnit: "8px",
    },
    elements: {
      rootBox: "rounded-lg border border-gray-700",
      card: "bg-gray-900/80 border border-gray-700",
      footer: "bg-gray-900/80 border-t border-gray-700",
      headerTitle: "text-white font-bold text-lg",
      headerSubtitle: "text-gray-300",
      dividerLine: "bg-gray-700",
      formButtonPrimary:
        "bg-blue-600 hover:bg-blue-700 text-white font-medium",
      formButtonSecondary:
        "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600",
      formFieldInput:
        "bg-gray-800 border border-gray-700 text-white placeholder-gray-500",
      formFieldLabel: "text-white font-medium",
      formFieldHintText: "text-gray-400 text-sm",
      formFieldSuccessText: "text-green-400",
      formFieldErrorText: "text-red-400",
      formFieldWarningText: "text-yellow-400",
      socialButtonsBlockButton:
        "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700",
      socialButtonsBlockButtonText: "text-white font-medium",
      toggleButton: "text-gray-300 hover:text-white",
      toggleButtonIsActive: "text-blue-400",
      badge: "bg-gray-800 text-gray-100",
      avatarBox: "bg-gray-800 border border-gray-700",
      userButtonPopoverCard: "bg-gray-900 border border-gray-700",
      userButtonPopoverRootBox: "bg-gray-900 border border-gray-700",
      userPreviewTextContainer: "text-white font-medium",
      userPreviewSecondaryIdentifier: "text-gray-400 text-sm",
      identityPreviewText: "text-white",
      identityPreviewEditButton:
        "text-blue-400 hover:text-blue-300",
      accordionTrigger: "text-white hover:bg-gray-800 font-medium",
      accordionContent: "text-gray-200",
      selectButton:
        "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700",
      selectSearchInput:
        "bg-gray-800 border border-gray-700 text-white placeholder-gray-500",
      selectOptionButton: "hover:bg-gray-700 text-white",
      otpCodeFieldInput:
        "bg-gray-800 border border-gray-700 text-white text-center text-lg tracking-widest",
      phoneInputBox: "bg-gray-800 border border-gray-700",
      backupCodeListItem: "bg-gray-800 border border-gray-700 text-white",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <ClerkProvider {...clerkTheme}>
          <header className="border-b border-gray-800 py-4 px-6">
            <Show when="signed-out">
              <div className="flex gap-4">
                <SignInButton mode="modal">
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
