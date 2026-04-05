import { Card, CardContent } from "@/components/ui/card";
import { Copy, Link2, Share2, Check } from "lucide-react";

const steps = [
  {
    icon: Copy,
    number: "1",
    title: "Paste Your Long URL",
    description: "Enter any long URL you want to shorten",
  },
  {
    icon: Link2,
    number: "2",
    title: "Customize (Optional)",
    description: "Choose a custom short code or we'll generate one for you",
  },
  {
    icon: Check,
    number: "3",
    title: "Get Your Short Link",
    description: "Instantly receive your shortened link with QR code",
  },
  {
    icon: Share2,
    number: "4",
    title: "Share & Track",
    description: "Share your link and monitor clicks and analytics",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Getting started is simple. Follow these four easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="bg-gray-900/50 border-gray-800 h-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-blue-950/60 border border-blue-800/60 flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-blue-400" />
                      </div>
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {step.number}
                      </div>
                      <h3 className="text-white font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent -translate-y-1/2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
