import { Hero } from "./components/Hero";
import { SocialProof } from "./components/SocialProof";
import { Benefits } from "./components/Benefits";
import { HowItWorks } from "./components/HowItWorks";
import { DemoVideo } from "./components/DemoVideo";
import { CaptureForm } from "./components/CaptureForm";
import { Footer } from "./components/Footer";
import { FloatingCTA } from "./components/FloatingCTA";

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <DemoVideo />
      <SocialProof />
      <Benefits />
      <HowItWorks />
      <CaptureForm />
      <Footer />
      <FloatingCTA />
    </div>
  );
}

export default App;
