"use client";

import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Unlimited short link creation",
  "Real-time click analytics",
  "Custom branded domains",
  "QR code generation",
  "Link expiration controls",
  "API access",
];

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-blue-950/40 to-purple-950/40 border border-blue-800/30 overflow-hidden p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Shorten Your Links?
              </h2>

              <p className="text-lg text-gray-300 mb-8">
                Join thousands of users who are already creating and tracking
                shortened links with our powerful platform.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </SignUpButton>
            </div>

            <div className="flex-1 relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-2xl blur-3xl" />
              <div className="relative bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    1000+
                  </div>
                  <p className="text-gray-400 mb-6">Active users creating links</p>

                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-white">
                      5M+
                    </div>
                    <p className="text-gray-400">Links shortened</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
