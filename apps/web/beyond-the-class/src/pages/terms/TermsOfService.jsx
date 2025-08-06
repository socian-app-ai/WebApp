import React from 'react';
import SEO from '../../components/seo/SEO';

const TermsOfService = () => {
  return (
    <>
      <SEO 
        title="Terms of Service" 
        description="Read the terms of service for Socian - Student Community Platform. Learn about user rights, responsibilities, and platform policies."
        keywords="terms of service, user agreement, platform policies, student community, socian"
        pageType="default"
      />
      <div className="bg-black text-white min-h-screen px-6 py-12 md:px-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-sm text-gray-400">Effective Date: January 15, 2025</p>
        <p className="text-sm text-gray-400">Last Updated: January 15, 2025</p>

        <section className="space-y-4">
          <p>
            Welcome to Socian ("we", "our", "us", or "the App"). These Terms of Service ("Terms") govern your use of the Socian mobile application and related services. By accessing or using Socian, you agree to be bound by these Terms.
          </p>
          <p className="font-semibold text-yellow-400">
            PLEASE READ THESE TERMS CAREFULLY. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE OUR APP.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">1. Acceptance of Terms</h2>
          <p>By creating an account, downloading, installing, or using Socian, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">2. Eligibility</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>You must be at least 13 years old to use Socian</li>
            <li>You must be enrolled in or affiliated with a Pakistani university</li>
            <li>You must provide accurate and truthful information during registration</li>
            <li>You must use a valid university email address for verification</li>
            <li>One account per person; multiple accounts are prohibited</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">3. Account Registration and Security</h2>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Registration Requirements:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Valid university email address</li>
              <li>Accurate personal information</li>
              <li>Strong password (minimum 6 characters)</li>
              <li>Verification through OTP or Google Sign-In</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4">Account Security:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>You are responsible for maintaining account confidentiality</li>
              <li>Report unauthorized access immediately</li>
              <li>We collect device information to prevent unauthorized access</li>
              <li>IP addresses are used temporarily during login for security verification</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">4. Acceptable Use Policy</h2>
          
          <h3 className="text-lg font-medium mb-2">You MAY:</h3>
          <ul className="list-disc ml-6 space-y-1 mb-4">
            <li>Share academic content, past papers, and educational materials</li>
            <li>Participate in discussions and society activities</li>
            <li>Upload original content you own or have permission to share</li>
            <li>Provide honest reviews and feedback about teachers</li>
            <li>Create and manage societies within your campus</li>
            <li>Use GIFs from our Giphy integration for appropriate communication</li>
          </ul>

          <h3 className="text-lg font-medium mb-2 text-red-400">You MAY NOT:</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Post hateful, discriminatory, or harassing content</li>
            <li>Share copyrighted material without permission</li>
            <li>Upload malicious files, viruses, or harmful content</li>
            <li>Impersonate others or create fake profiles</li>
            <li>Spam, advertise unauthorized products, or send unsolicited messages</li>
            <li>Share personal information of others without consent</li>
            <li>Engage in academic dishonesty or plagiarism</li>
            <li>Post illegal content or content promoting illegal activities</li>
            <li>Attempt to hack, reverse engineer, or compromise the app</li>
            <li>Create multiple accounts or circumvent account restrictions</li>
            <li>Use the app for commercial purposes without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">5. User-Generated Content</h2>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Content Ownership:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>You retain ownership of content you post</li>
              <li>You grant Socian a license to display, distribute, and moderate your content</li>
              <li>You are responsible for ensuring you have rights to share content</li>
            </ul>

            <h3 className="text-lg font-medium mt-4">Content Standards:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Content must be relevant to academic or social purposes</li>
              <li>No adult content, violence, or graphic material</li>
              <li>No false information or misleading content</li>
              <li>Respect intellectual property rights</li>
            </ul>

            <h3 className="text-lg font-medium mt-4">Content Moderation:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>We reserve the right to remove content that violates these Terms</li>
              <li>Automated and manual moderation systems are in place</li>
              <li>Users can report inappropriate content</li>
              <li>Appeals process available for content removal decisions</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">6. Academic Integrity</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Past papers shared must be authorized by institutions or publicly available</li>
            <li>Do not share current exam questions or answers</li>
            <li>Teacher reviews must be honest and constructive</li>
            <li>No academic dishonesty, cheating, or plagiarism</li>
            <li>Respect your university's academic policies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">7. Privacy and Data Protection</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Your privacy is governed by our Privacy Policy</li>
            <li>We collect minimal data necessary for app functionality</li>
            <li>Device information is used for security purposes</li>
            <li>Location data helps suggest relevant campus events</li>
            <li>You can request data deletion at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">8. Enforcement and Penalties</h2>
          
          <h3 className="text-lg font-medium mb-2">Violation Consequences:</h3>
          <ul className="list-disc ml-6 space-y-1 mb-4">
            <li><span className="font-medium">Warning:</span> First-time minor violations</li>
            <li><span className="font-medium">Content Removal:</span> Violating posts/comments deleted</li>
            <li><span className="font-medium">Temporary Suspension:</span> 1-30 days for moderate violations</li>
            <li><span className="font-medium">Permanent Ban:</span> Severe or repeated violations</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Appeals Process:</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Email appeals to: appeals@socian.app</li>
            <li>Provide detailed explanation of circumstances</li>
            <li>Response within 5-7 business days</li>
            <li>Decision review by moderation team</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">9. Intellectual Property</h2>
          <div className="space-y-3">
            <p>Socian and its features are protected by copyright, trademark, and other intellectual property laws.</p>
            
            <h3 className="text-lg font-medium">Respect for IP Rights:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Do not upload copyrighted material without permission</li>
              <li>Report copyright violations to: copyright@socian.app</li>
              <li>We comply with DMCA takedown procedures</li>
              <li>Repeated copyright violations result in account termination</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">10. Third-Party Services</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><span className="font-medium">Google Services:</span> Sign-in authentication</li>
            <li><span className="font-medium">MongoDB:</span> Data storage and management</li>
            <li><span className="font-medium">Giphy:</span> GIF integration for messaging</li>
            <li>Third-party services have their own terms and privacy policies</li>
            <li>We are not responsible for third-party service issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">11. Regional Availability</h2>
          <p>Socian is designed exclusively for users in Pakistan. The app complies with Pakistani laws and regulations. Users outside Pakistan may experience limited functionality.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">12. Disclaimers and Limitations</h2>
          
          <h3 className="text-lg font-medium mb-2">Service Availability:</h3>
          <ul className="list-disc ml-6 space-y-1 mb-4">
            <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
            <li>Maintenance periods may temporarily limit access</li>
            <li>We are not liable for service interruptions</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Content Accuracy:</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>User-generated content accuracy is not guaranteed</li>
            <li>Academic materials should be verified independently</li>
            <li>Teacher reviews reflect individual opinions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">13. Termination</h2>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">You may terminate your account:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>At any time through app settings</li>
              <li>By contacting support@socian.app</li>
              <li>Using our account deletion page</li>
            </ul>

            <h3 className="text-lg font-medium mt-4">We may terminate accounts for:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Violations of these Terms</li>
              <li>Illegal activities</li>
              <li>Extended inactivity (2+ years)</li>
              <li>Security concerns</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">14. Changes to Terms</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>We may update these Terms periodically</li>
            <li>Significant changes will be communicated via email or in-app notifications</li>
            <li>Continued use after changes constitutes acceptance</li>
            <li>Previous versions available upon request</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">15. Governing Law</h2>
          <p>These Terms are governed by the laws of Pakistan. Any disputes will be resolved in Pakistani courts with jurisdiction in Islamabad.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Contact Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">General Support:</span> <a href="mailto:support@socian.app" className="underline">support@socian.app</a></p>
            <p><span className="font-medium">Legal/Terms Questions:</span> <a href="mailto:legal@socian.app" className="underline">legal@socian.app</a></p>
            <p><span className="font-medium">Appeals:</span> <a href="mailto:appeals@socian.app" className="underline">appeals@socian.app</a></p>
            <p><span className="font-medium">Copyright Issues:</span> <a href="mailto:copyright@socian.app" className="underline">copyright@socian.app</a></p>
            <p><span className="font-medium">Website:</span> <a href="https://socian.app" className="underline">https://socian.app</a></p>
            <p><span className="font-medium">Country:</span> Pakistan</p>
          </div>
        </section>

        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Minimum Age:</p>
              <p>13 years old</p>
            </div>
            <div>
              <p className="font-medium">Region:</p>
              <p>Pakistan only</p>
            </div>
            <div>
              <p className="font-medium">Account Type:</p>
              <p>University email required</p>
            </div>
            <div>
              <p className="font-medium">Content Policy:</p>
              <p>Educational & Social focus</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          By using Socian, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>
    </>
  );
};

export default TermsOfService; 