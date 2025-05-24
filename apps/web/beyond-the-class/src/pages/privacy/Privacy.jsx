import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12 md:px-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Privacy Policy for Socian</h1>
        <p className="text-sm text-gray-400">Effective Date: May 24, 2025</p>

        <section className="space-y-4">
          <p>Socian (“we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, share, and protect your information through the Socian mobile application (“App”).</p>
          <p>This policy complies with Google Play Developer Policies and reflects our responsibilities regarding personal, device, and sensitive user data.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">1. Information We Collect</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">a. Personal Information</span> – Name, email (Google Sign-In), profile picture, university/student ID, society memberships, and roles.</p>
            <p><span className="font-semibold">b. Device Info</span> – Device model, OS version, IP, and crash logs.</p>
            <p><span className="font-semibold">c. Media & File Access</span> – For camera, gallery, and PDF uploads.</p>
            <p><span className="font-semibold">d. Location Data</span> – To suggest and manage society-based events and activities.</p>
            <p><span className="font-semibold">e. Usage Analytics</span> – Collected through PostHog to improve user experience.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Authenticate users via Google Sign-In</li>
            <li>Manage academic and society-based roles</li>
            <li>Enable post creation and media/document uploads</li>
            <li>Suggest location-based events</li>
            <li>Improve user experience with analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">3. Data Sharing and Disclosure</h2>
          <p>We do not sell or rent your data. Limited sharing may occur:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>With third-party services (e.g., Firebase, PostHog)</li>
            <li>With other users (limited profile visibility)</li>
            <li>With law enforcement if legally required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">4. Data Retention</h2>
          <p>Data is kept as long as your account is active. You can request deletion at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">5. Children’s Privacy</h2>
          <p>Socian is not intended for children under 13. If such data is found, we will delete it promptly.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">6. Your Rights</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Access, update, or delete your data</li>
            <li>Revoke device permissions (camera, location, etc.)</li>
            <li>Request opt-out from analytics</li>
          </ul>
          <p className="mt-2">Email: <a href="mailto:privacy@socianapp.com" className="underline">privacy@socianapp.com</a></p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">7. Data Security</h2>
          <p>We use encryption, HTTPS, and access control to protect your data. However, no method is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">8. Policy Updates</h2>
          <p>We may revise this policy periodically. Users will be notified of major changes via email or in-app.</p>
          <p className="text-sm text-gray-400 mt-1">Last updated: May 24, 2025</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact:</p>
          <p className="mt-1">Email: <a href="mailto:privacy@socianapp.com" className="underline">privacy@socianapp.com</a></p>
          <p>Website: <a href="https://socianapp.com/privacy" className="underline">https://socianapp.com/privacy</a></p>
          <p>Country: Pakistan</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
