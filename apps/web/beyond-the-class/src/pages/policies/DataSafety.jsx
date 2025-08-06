import React from 'react';
import SEO from '../../components/seo/SEO';

const DataSafety = () => {
  return (
    <>
      <SEO 
        title="Data Safety Policy" 
        description="Learn about how Socian collects, uses, and protects your data. Our comprehensive data safety policy ensures your privacy and security."
        keywords="data safety, privacy policy, data protection, user privacy, student community, socian"
        pageType="default"
      />
      <div className="bg-black text-white min-h-screen px-6 py-12 md:px-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Data Safety Declaration</h1>
        <p className="text-sm text-gray-400">For Google Play Store Compliance</p>
        <p className="text-sm text-gray-400">Last Updated: January 15, 2025</p>

        <section className="space-y-4">
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <p className="font-semibold text-blue-300">Google Play Store Data Safety Requirements:</p>
            <p>This document outlines how Socian collects, uses, and protects user data in compliance with Google Play Store policies and data safety requirements.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">1. Data Collection Summary</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-400 mb-3">✓ Data We Collect</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Full name</li>
                    <li>• Email address (university & personal for alumni)</li>
                    <li>• Profile picture</li>
                    <li>• University/Student ID</li>
                    <li>• Academic role (student/teacher/alumni)</li>
                    <li>• Society memberships</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Technical Information</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Device model and OS version</li>
                    <li>• IP address (temporary during login)</li>
                    <li>• App crash logs and diagnostics</li>
                    <li>• Device identifiers for security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">User Content</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Posts and comments</li>
                    <li>• Uploaded files (PDFs, images)</li>
                    <li>• Academic discussions</li>
                    <li>• Teacher reviews and ratings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Location Data</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Approximate location for campus events</li>
                    <li>• University/campus location</li>
                    <li>• City/region for regional content</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-400 mb-3">✗ Data We DO NOT Collect</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Financial information (credit cards, banking details)</li>
                <li>Health and fitness data</li>
                <li>Precise location tracking</li>
                <li>Contacts or phone books</li>
                <li>SMS or call history</li>
                <li>Microphone recordings without user action</li>
                <li>Camera access without user action</li>
                <li>Browsing history outside the app</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">2. How We Use Your Data</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-400 mb-2">App Functionality</h3>
                <ul className="text-sm space-y-1">
                  <li>• User authentication and account management</li>
                  <li>• Content creation and sharing</li>
                  <li>• Society management and participation</li>
                  <li>• Academic discussions and reviews</li>
                  <li>• Campus event suggestions</li>
                </ul>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-400 mb-2">Security & Safety</h3>
                <ul className="text-sm space-y-1">
                  <li>• Prevent unauthorized account access</li>
                  <li>• Detect and prevent spam/abuse</li>
                  <li>• Fraud prevention and security monitoring</li>
                  <li>• Content moderation and safety</li>
                  <li>• Account verification</li>
                </ul>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-medium text-purple-400 mb-2">Communication</h3>
                <ul className="text-sm space-y-1">
                  <li>• Send account verification emails</li>
                  <li>• Notify about important app updates</li>
                  <li>• Respond to support requests</li>
                  <li>• Send policy change notifications</li>
                </ul>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-medium text-yellow-400 mb-2">App Improvement</h3>
                <ul className="text-sm space-y-1">
                  <li>• Analyze app performance and crashes</li>
                  <li>• Understand user preferences</li>
                  <li>• Improve features and user experience</li>
                  <li>• Fix bugs and technical issues</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">3. Data Sharing Practices</h2>
          
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-400 mb-2">Limited Data Sharing</h3>
              <p className="mb-3">We share data only when necessary for app functionality or legal compliance:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><span className="font-medium">MongoDB (Database Service):</span> Encrypted data storage and management</li>
                <li><span className="font-medium">Giphy Integration:</span> GIF search functionality (search terms only)</li>
                <li><span className="font-medium">Google Services:</span> Authentication via Google Sign-In</li>
                <li><span className="font-medium">Other Users:</span> Public profile information and shared content only</li>
                <li><span className="font-medium">Legal Authorities:</span> Only when legally required with user notification</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-400 mb-2">We NEVER:</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Sell your personal data to third parties</li>
                <li>Share data for advertising purposes</li>
                <li>Provide data to marketing companies</li>
                <li>Share sensitive personal information without consent</li>
                <li>Transfer data outside Pakistan without protection</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">4. Data Protection Measures</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Technical Safeguards</h3>
              <ul className="text-sm space-y-1">
                <li>• End-to-end encryption for data transmission</li>
                <li>• Encrypted database storage</li>
                <li>• Secure HTTPS connections</li>
                <li>• Regular security audits</li>
                <li>• Access control and authentication</li>
                <li>• Automated threat detection</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-400 mb-2">Operational Safeguards</h3>
              <ul className="text-sm space-y-1">
                <li>• Limited employee access to data</li>
                <li>• Data access logging and monitoring</li>
                <li>• Regular backup and recovery procedures</li>
                <li>• Incident response protocols</li>
                <li>• Staff security training</li>
                <li>• Third-party security assessments</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">5. User Rights and Controls</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Your Data Rights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-blue-400 mb-2">Access & Portability</h4>
                <ul className="text-sm space-y-1">
                  <li>• View all data we have about you</li>
                  <li>• Download your data in portable format</li>
                  <li>• Request data transfer to other services</li>
                </ul>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-green-400 mb-2">Control & Deletion</h4>
                <ul className="text-sm space-y-1">
                  <li>• Update or correct your information</li>
                  <li>• Delete specific content or data</li>
                  <li>• Request complete account deletion</li>
                </ul>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-purple-400 mb-2">Privacy Settings</h4>
                <ul className="text-sm space-y-1">
                  <li>• Control profile visibility</li>
                  <li>• Manage location sharing preferences</li>
                  <li>• Adjust notification settings</li>
                </ul>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-yellow-400 mb-2">Permissions</h4>
                <ul className="text-sm space-y-1">
                  <li>• Revoke app permissions anytime</li>
                  <li>• Choose what data to share</li>
                  <li>• Opt out of non-essential features</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">6. Children's Data Protection</h2>
          
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-400 mb-2">Age Restrictions</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li><span className="font-medium">Minimum Age:</span> 13 years old (COPPA compliance)</li>
              <li><span className="font-medium">Verification:</span> University email requirement ensures appropriate age</li>
              <li><span className="font-medium">Special Protections:</span> Enhanced privacy for users under 18</li>
              <li><span className="font-medium">Parental Rights:</span> Parents can request data deletion for minors</li>
              <li><span className="font-medium">No Targeted Content:</span> No advertising or marketing to minors</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">7. Data Retention Policy</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Retention Periods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Active Account Data:</p>
                  <p>Retained while account is active</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Deleted Account Data:</p>
                  <p>Removed within 30 days of deletion request</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Security Logs:</p>
                  <p>Retained for 90 days for security purposes</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Support Communications:</p>
                  <p>Retained for 2 years for quality purposes</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Legal Hold Data:</p>
                  <p>Retained as required by Pakistani law</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Anonymous Analytics:</p>
                  <p>May be retained indefinitely (no personal identifiers)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">8. Regional Compliance</h2>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-400 mb-2">Pakistan-Specific Compliance</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Data processed and stored in compliance with Pakistani data protection laws</li>
              <li>Local data residency requirements met where applicable</li>
              <li>Cooperation with Pakistani regulatory authorities when legally required</li>
              <li>Respect for local cultural and religious sensitivities in data handling</li>
              <li>Compliance with Pakistan Telecommunication Authority (PTA) guidelines</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">9. Data Breach Response</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Our Commitment</h3>
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <ul className="list-disc ml-6 space-y-2">
                <li><span className="font-medium">Immediate Response:</span> Security team notified within 1 hour</li>
                <li><span className="font-medium">User Notification:</span> Affected users notified within 72 hours</li>
                <li><span className="font-medium">Authority Reporting:</span> Regulatory bodies notified as required</li>
                <li><span className="font-medium">Remediation:</span> Immediate steps to secure data and prevent future breaches</li>
                <li><span className="font-medium">Transparency:</span> Public disclosure of significant breaches</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Contact for Data Matters</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="space-y-2">
              <p><span className="font-medium">Data Protection Officer:</span> <a href="mailto:dpo@socian.app" className="underline">dpo@socian.app</a></p>
              <p><span className="font-medium">Privacy Questions:</span> <a href="mailto:privacy@socian.app" className="underline">privacy@socian.app</a></p>
              <p><span className="font-medium">Data Deletion Requests:</span> <a href="mailto:deletion@socian.app" className="underline">deletion@socian.app</a></p>
              <p><span className="font-medium">Security Issues:</span> <a href="mailto:security@socian.app" className="underline">security@socian.app</a></p>
              <p><span className="font-medium">General Support:</span> <a href="mailto:support@socian.app" className="underline">support@socian.app</a></p>
            </div>
          </div>
        </section>

        <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Google Play Store Compliance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Data Collection:</p>
              <p>✓ Minimal and necessary only</p>
            </div>
            <div>
              <p className="font-medium mb-1">User Control:</p>
              <p>✓ Full access and deletion rights</p>
            </div>
            <div>
              <p className="font-medium mb-1">Security:</p>
              <p>✓ Industry-standard encryption</p>
            </div>
            <div>
              <p className="font-medium mb-1">Transparency:</p>
              <p>✓ Clear privacy policies and notices</p>
            </div>
            <div>
              <p className="font-medium mb-1">Children's Safety:</p>
              <p>✓ COPPA compliant protections</p>
            </div>
            <div>
              <p className="font-medium mb-1">Legal Compliance:</p>
              <p>✓ Pakistani and international standards</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          This Data Safety Declaration is updated regularly to reflect current practices and compliance requirements. 
          For the most current version, visit our app or website.
        </p>
      </div>
    </>
  );
};

export default DataSafety; 