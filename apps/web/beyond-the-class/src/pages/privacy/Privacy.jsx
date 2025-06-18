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
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Authenticate users via Google Sign-In</li>
            <li>Manage academic and society-based roles</li>
            <li>Enable post creation and media/document uploads</li>
            <li>Suggest location-based events</li>
            <li>Improve user experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">3. Data Sharing and Disclosure</h2>
          <p>We do not sell or rent your data. Limited sharing may occur:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>With third-party services (e.g., MongoDB)</li>
            <li>With other users (limited profile visibility)</li>
            <li>With law enforcement if legally required and User's Permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">4. Data Retention</h2>
          <p>Data is kept as long as your account is active. You can request deletion at any time by contacting us. or visiting <a className='underline' target='_blank' href='/delete-account'>Delete Account</a></p>
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
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">8. Regional Availability</h2>
          <p>
            Socian is designed specifically for users residing in Pakistan. The app, its features, and its data handling practices are intended to comply with local laws and regulations within Pakistan.
          </p>
          <p className="mt-2">
            Users located outside of Pakistan are not the intended audience for this app and may experience limited functionality or access restrictions.
          </p>
        </section>


        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">9. Policy Updates</h2>
          <p>We may revise this policy periodically. Users will be notified of major changes via email or in-app.</p>
          <p className="text-sm text-gray-400 mt-1">Last updated: June 19, 2025</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact:</p>
          <p className="mt-1">Email: <a href="mailto:privacy@socian.app" className="underline">privacy@socian.app</a></p>
          <p>Website: <a href="https://socian.app/privacy" className="underline">https://socian.app/privacy</a></p>
          <p>Country: Pakistan</p>
        </section>




        <p className="text-sm text-gray-400 mt-1">Last updated: June 19, 2025</p>

        <div className="mt-6"><h3 className="text-lg font-semibold mb-2">Recent Changes</h3>
          <p className="text-sm text-gray-400 mb-4">
            Below is a list of changes made to this privacy policy. We maintain this section for full transparency.
          </p>

          <details className="mt-4">
            <summary className="cursor-pointer text-gray-300 underline">View Recent Changes (June 19, 2025)</summary>
            <div className="mt-2">
              <table className="w-full table-auto border border-gray-700 text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-700 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-700 px-4 py-2 text-left">Change</th>
                    <th className="border border-gray-700 px-4 py-2 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-800">
                    <td className="border border-gray-700 px-4 py-2">June 19, 2025</td>
                    <td className="border border-gray-700 px-4 py-2">Removed PostHog Analytics</td>
                    <td className="border border-gray-700 px-4 py-2">
                      PostHog was previously used only during private testing for debugging purposes. It was fully removed before publishing the app on the Play Store. We never used it in the production version.
                    </td>
                  </tr>
                </tbody>


                <tr className="hover:bg-gray-800">
                  <td className="border border-gray-700 px-4 py-2">June 19, 2025</td>
                  <td className="border border-gray-700 px-4 py-2">+ Regional Availability Policy</td>
                  <td className="border border-gray-700 px-4 py-2">
                    Added a new section clarifying that Socian is intended for users residing in Pakistan only. This defines regional access scope and legal applicability.
                  </td>
                </tr>

              </table>
            </div>
          </details>



        </div>




      </div>
    </div>
  );
};

export default PrivacyPolicy;
