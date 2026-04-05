import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Link2,
  BarChart3,
  QrCode,
  Shield,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Shortening",
    description: "Create shortened URLs in seconds with just one click.",
  },
  {
    icon: Link2,
    title: "Customizable Codes",
    description: "Choose your own custom short codes or let us generate them.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Tracking",
    description: "Track clicks, geographic data, and referral sources in real-time.",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Automatically generate QR codes for every shortened link.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with optional link expiration.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Perfect integration for mobile apps and responsive design.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to create, manage, and track your shortened links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-950/40 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
