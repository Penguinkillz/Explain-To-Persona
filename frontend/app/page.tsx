import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ExplainForm } from "@/components/ExplainForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ExplainForm />
      </main>
      <Footer />
    </div>
  );
}
