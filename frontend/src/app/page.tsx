import Header from "@/components/layout/landingpage/Header";
import Footer from "@/components/layout/landingpage/Footer";
import Hero from "@/features/landingpage/components/Hero";
import Features from "@/features/landingpage/components/Features";
import MainFeatures from "@/features/landingpage/components/MainFeatures";
import AIFeatures from "@/features/landingpage/components/AIFeatures";
import TeacherTools from "@/features/landingpage/components/TeacherTools";
import Leaderboard from "@/features/landingpage/components/Leaderboard";
import Testimonials from "@/features/landingpage/components/Testimonials";
import CTA from "@/features/landingpage/components/CTA";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <MainFeatures />
        <AIFeatures />
        <TeacherTools />
        <Leaderboard />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
