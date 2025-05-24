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
          <p className="mt-2">Email: <a href="mailto:privacy@socian.app" className="underline">privacy@socian.app</a></p>
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
          <p className="mt-1">Email: <a href="mailto:privacy@socian.app" className="underline">privacy@socian.app</a></p>
          <p>Website: <a href="https://socian.app/privacy" className="underline">https://socian.app/privacy</a></p>
          <p>Country: Pakistan</p>
        </section>

        <section>
  <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">9. Use of PostHog Analytics</h2>
  <div className="space-y-2">
    <p>
      Socian uses <span className="font-semibold">PostHog Analytics</span> to understand how users interact with our app and to improve features, usability, and performance.
    </p>
    <p>
      PostHog may collect aggregated, non-personal data such as device type, screen usage patterns, interaction flow, and performance events. No personally identifiable information (PII) is collected unless explicitly stated and consented to.
    </p>
    <p>
      We do <span className="font-semibold">not</span> use PostHog for advertising or cross-app tracking. Data collected is solely for internal usage analytics and product improvement.
    </p>
    <p>
      In compliance with Google Play and data protection regulations (including GDPR), users may opt out of analytics tracking where applicable. If session replay or behavioral tracking is enabled, it is anonymized by default and never records sensitive input fields.
    </p>
    <p>
      You can learn more about PostHog’s privacy practices by visiting: <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-gray-300">https://posthog.com/privacy</a>
    </p>
    <p>
      Currently, We only capture website usage analytics through PostHog, which includes anonymous data about how users interact with the Socian website. This helps us improve our web presence and user experience. Where users content are hidden from posthog and us.
    </p>
  </div>
</section>


<section>
  <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">10. Analytics and Tracking</h2>
  <div className="space-y-3 text-sm text-gray-300">
    <p>
      Socian uses <strong>PostHog</strong> to collect and analyze app usage data. This helps us understand how users interact with the app and improve functionality and performance.
    </p>

    <p>The following types of data may be collected by PostHog within the mobile app:</p>
    <ul className="list-disc pl-6 space-y-1">
      <li><strong>Device Information:</strong> model, OS version, screen size, manufacturer.</li>
      <li><strong>App Information:</strong> app version, build number, session duration, events like "App Opened" and "App Installed".</li>
      <li><strong>Interaction Data:</strong> taps, scrolls, screen transitions, and navigation (autocapture).</li>
      <li><strong>Network Data:</strong> network type (Wi-Fi/cellular), carrier (not IP address).</li>
      <li><strong>Session Recordings:</strong> Anonymous playback of app usage sessions (e.g., screen flow, UI interactions).</li>
    </ul>

    <p>
      <strong>What We Don’t Collect:</strong> PostHog is configured not to collect personal identifiers such as your name, email address, or input data like passwords, form contents, or uploaded files. Session recordings are anonymized.
    </p>

    <p>
      Data is processed in accordance with PostHog's <a href="https://posthog.com/docs/privacy" className="text-blue-400 underline">privacy policy</a>. You can contact us to opt out of analytics features.
    </p>
  </div>
</section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
