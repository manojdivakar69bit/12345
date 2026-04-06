import { QRCodeSVG } from "qrcode.react";
import { Phone } from "lucide-react";

const DecorativeQrCode = () => {
  return (
    <div className="relative inline-block p-4 rounded-2xl bg-card" style={{
      boxShadow: "0 0 30px 8px rgba(236,72,153,0.3), 0 0 60px 20px rgba(96,165,250,0.2)"
    }}>
      <QRCodeSVG value="https://callmyfamily.in" size={180} level="M" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-primary rounded-lg p-1.5">
          <Phone className="text-primary-foreground" size={24} />
        </div>
      </div>
    </div>
  );
};

export default DecorativeQrCode;
