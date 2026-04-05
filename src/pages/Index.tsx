import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ScanLine, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import DecorativeQrCode from "@/components/DecorativeQrCode";

const TAGLINE_LINE1 = "Every Life Matters. Every Second Counts.";
const TAGLINE_LINE2 = "Just Scan and Call.";

const useTypewriter = (text: string, speed = 50, startDelay = 0) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(delayTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  return { displayed, done, started };
};

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const line1 = useTypewriter(TAGLINE_LINE1, 45, 800);
  const line2 = useTypewriter(TAGLINE_LINE2, 45, 800 + TAGLINE_LINE1.length * 45 + 300);
  const allTyped = line1.done && line2.done;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10">
      {/* Logo */}
      <div className={`transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <svg width="80" height="95" viewBox="0 0 80 95">
  <ellipse cx="40" cy="90" rx="15" ry="4" fill="#b0c4de" opacity="0.6"/>
  <path d="M40 2 C22 2 8 16 8 34 C8 56 40 88 40 88 C40 88 72 56 72 34 C72 16 58 2 40 2Z" fill="#E8192C"/>
  <path d="M40 2 C22 2 8 16 8 34 C8 56 40 88 40 88 C40 88 72 56 72 34 C72 16 58 2 40 2Z" fill="url(#g1)" opacity="0.2"/>
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:white"/>
      <stop offset="100%" style="stop-color:transparent"/>
    </linearGradient>
  </defs>
  <circle cx="40" cy="24" r="7" fill="white" opacity="0.9"/>
  <circle cx="28" cy="33" r="5" fill="white" opacity="0.8"/>
  <circle cx="52" cy="33" r="5" fill="white" opacity="0.8"/>
  <path d="M29 44 Q27 52 29 58 L32 55 L34 60 L40 55 L46 60 L48 55 L51 58 Q53 52 51 44Z" fill="white" opacity="0.9"/>
  <rect x="33" y="60" width="14" height="10" rx="3" fill="white" opacity="0.8"/>
  <path d="M35 62 Q33 65 35 68 L36 67 L37 69 L40 67 L43 69 L44 67 L45 68 Q47 65 45 62Z" fill="#E8192C"/>
</svg> className="w-32 h-32 object-contain mx-auto mb-2" />
      </div>

      {/* Tagline */}
      <div className="text-center mb-6 min-h-[3.5rem]">
        <div className="text-lg font-semibold text-foreground">
          {line1.started && line1.displayed}
          {line1.started && !line1.done && <span className="animate-blink">|</span>}
        </div>
        <div className="text-lg font-semibold text-primary">
          {line2.started && line2.displayed}
          {line2.started && !allTyped && <span className="animate-blink">|</span>}
        </div>
      </div>

      {/* Content area */}
      <div className={`w-full max-w-md space-y-6 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* QR Code - small */}
        <div className="flex justify-center">
          <DecorativeQrCode />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center card-shadow"><CardContent className="p-3"><Shield className="mx-auto mb-1 text-primary" size={28} /><span className="text-xs font-medium">Secure</span></CardContent></Card>
          <Card className="text-center card-shadow"><CardContent className="p-3"><ScanLine className="mx-auto mb-1 text-primary" size={28} /><span className="text-xs font-medium">Quick Scan</span></CardContent></Card>
          <Card className="text-center card-shadow"><CardContent className="p-3"><Phone className="mx-auto mb-1 text-primary" size={28} /><span className="text-xs font-medium">Call Family</span></CardContent></Card>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button asChild className="flex-1 emergency-gradient hover:opacity-90 text-primary-foreground"><Link to="/login?role=admin">Admin Panel</Link></Button>
          <Button asChild variant="outline" className="flex-1"><Link to="/login?role=agent">Agent Panel</Link></Button>
        </div>

        {/* Privacy */}
        <div className="text-center">
          <Link to="/privacy" className="text-xs text-muted-foreground underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
