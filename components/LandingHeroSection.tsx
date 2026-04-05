"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/40 border border-blue-800/60">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-200">
            Shorten URLs in seconds
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          Transform Long URLs Into{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Shareable Links
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Create short, customizable links in seconds. Track clicks, generate QR
          codes, and share with confidence. Perfect for marketing campaigns,
          social media, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <SignUpButton>
            <Button
              size="lg"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </SignUpButton>

          <SignInButton>
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </SignInButton>
        </div>

        <p className="text-sm text-gray-500">
          No credit card required. Start shortening links instantly.
        </p>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
