import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background p-4 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-primary mb-4 hover:underline">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <div className="prose prose-sm text-foreground space-y-4">
        <p className="text-muted-foreground">Last updated: April 4, 2026</p>

        <h2 className="text-lg font-semibold">1. Introduction</h2>
        <p>Call My Family ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and related services.</p>

        <h2 className="text-lg font-semibold">2. Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Personal Information:</strong> Name, phone number, vehicle number, blood group, and address provided during registration.</li>
          <li><strong>Emergency Contacts:</strong> Names, phone numbers, and relationships of contacts you designate.</li>
          <li><strong>Usage Data:</strong> QR code scans, call logs, and app interaction data.</li>
          <li><strong>Device Information:</strong> Device type, operating system, and unique identifiers.</li>
        </ul>

        <h2 className="text-lg font-semibold">3. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To facilitate emergency contact during accidents or emergencies</li>
          <li>To generate and manage QR code stickers linked to your profile</li>
          <li>To enable quick scanning and calling of emergency contacts</li>
          <li>To improve our services and user experience</li>
        </ul>

        <h2 className="text-lg font-semibold">4. Data Sharing</h2>
        <p>We do not sell or share your personal information with third parties except:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>When required by law or legal process</li>
          <li>To protect the rights and safety of our users</li>
          <li>With your explicit consent</li>
        </ul>

        <h2 className="text-lg font-semibold">5. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data.</p>

        <h2 className="text-lg font-semibold">6. Your Rights</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2 className="text-lg font-semibold">7. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at support@callmyfamily.in</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
