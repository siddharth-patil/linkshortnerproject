import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/LandingHeroSection";
import { FeaturesSection } from "@/components/LandingFeaturesSection";
import { HowItWorksSection } from "@/components/LandingHowItWorksSection";
import { CTASection } from "@/components/LandingCTASection";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col bg-black">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
