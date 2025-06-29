import React from 'react';
import AppDownloadQR from '../../components/QRCode/AppDownloadQR';

const PrivacyPolicy = () => {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12 md:px-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Comprehensive Privacy Policy & Terms</h1>
        <p className="text-sm text-gray-400">Effective Date: January 15, 2025</p>
        <p className="text-sm text-gray-400">Last Updated: January 15, 2025</p>

        <section className="space-y-4">
          <p>Socian or Beyond The Class &#40; &quot;we&quot;, &quot;our&quot;, or &quot;us&quot; &#41; is committed to protecting your privacy. This comprehensive policy outlines how we collect, use, share, and protect your information through the Socian mobile application (&quot;App&quot;).</p>
          <p>This policy complies with Google Play Developer Policies, Pakistani data protection laws, and international privacy standards.</p>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <p className="font-semibold text-yellow-300">Important Notice:</p>
            <p>By using Socian or Beyond The Class, you agree to these terms and our data handling practices. Please read this entire document carefully.</p>
          </div>
        </section>

        {/* Download App Section */}
        <section className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-300 mb-2">Download Our Mobile App</h2>
            <p className="text-gray-300">For the best experience, download our mobile app and stay connected with your university community.</p>
          </div>
          <div className="flex justify-center">
            <AppDownloadQR 
              layout="card" 
              showOnlyApp={true}
              customTitle="Beyond The Class"
              customDescription="Connect with your university community, access past papers, review teachers, and join societies."
              size="large"
              className="bg-blue-900/30 border-blue-600"
            />
          </div>
        </section>

        {/* Table of Contents */}
        <section className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">Privacy & Data:</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Information We Collect</li>
                <li>• How We Use Your Data</li>
                <li>• Data Sharing Practices</li>
                <li>• Data Security</li>
                <li>• Your Rights & Controls</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Terms & Guidelines:</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Acceptable Use Policy</li>
                <li>• Community Guidelines</li>
                <li>• Academic Integrity</li>
                <li>• Content Standards</li>
                <li>• Enforcement & Appeals</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRIVACY & DATA COLLECTION SECTION */}
        <section>
          <h2 className="text-3xl font-semibold border-b border-gray-700 pb-2 mb-6">Privacy & Data Protection</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">1. Information We Collect</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-green-400 mb-3">✓ Data We Collect</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold mb-2">Personal Information:</p>
                      <ul className="text-sm space-y-1 text-gray-300">
                        <li>• Name, email (Google Sign-In)</li>
                        <li>• Profile picture</li>
                        <li>• University/student ID</li>
                        <li>• Society memberships and roles</li>
                        <li>• Academic department and program</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Device & Technical Info:</p>
                      <ul className="text-sm space-y-1 text-gray-300">
                        <li>• Device model, OS version</li>
                        <li>• IP address (temporarily during login for security verification, flushed after login completion)</li>
                        <li>• Device info attached to your user model to protect your account from unauthorized access</li>
                        <li>• Crash logs and diagnostics (used in Flutter for enhanced security measures)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Media & File Access:</p>
                      <ul className="text-sm space-y-1 text-gray-300">
                        <li>• Camera access for photo uploads</li>
                        <li>• Gallery access for media sharing</li>
                        <li>• PDF and document uploads</li>
                        <li>• GIFs from Giphy integration</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Location Data:</p>
                      <ul className="text-sm space-y-1 text-gray-300">
                        <li>• Approximate location for campus events</li>
                        <li>• University/campus location</li>
                        <li>• Regional content suggestions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-red-400 mb-3">✗ Data We DO NOT Collect</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Financial information (credit cards, banking)</li>
                      <li>Health and fitness data</li>
                      <li>Precise location tracking</li>
                      <li>Contacts or phone books</li>
                      <li>SMS or call history</li>
                    </ul>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Microphone recordings without user action</li>
                      <li>Camera access without user permission</li>
                      <li>Browsing history outside the app</li>
                      <li>Social media passwords</li>
                      <li>Personal files without permission</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">2. How We Use Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="font-medium text-blue-400 mb-2">App Functionality</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Authenticate users via Google Sign-In</li>
                      <li>Manage academic and society-based roles</li>
                      <li>Enable post creation and media/document uploads</li>
                      <li>Facilitate academic discussions and past paper sharing</li>
                      <li>Suggest location-based events</li>
                      <li>Provide teacher review and rating functionality</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                    <h4 className="font-medium text-green-400 mb-2">Security & Safety</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Prevent unauthorized account access</li>
                      <li>Detect and prevent spam/abuse</li>
                      <li>Fraud prevention and security monitoring</li>
                      <li>Content moderation and community safety</li>
                      <li>Account verification and integrity</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                    <h4 className="font-medium text-purple-400 mb-2">Communication</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Send account verification emails</li>
                      <li>Notify about important app updates</li>
                      <li>Respond to support requests</li>
                      <li>Send policy change notifications</li>
                      <li>Society and event notifications</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-400 mb-2">Improvement</h4>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Analyze app performance and crashes</li>
                      <li>Understand user preferences</li>
                      <li>Improve features and user experience</li>
                      <li>Fix bugs and technical issues</li>
                      <li>Enhance security measures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">3. Data Sharing and Disclosure</h3>
              <p className="mb-4">We do not sell or rent your data. Limited sharing occurs only when necessary:</p>
              
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-medium text-green-400 mb-2">Authorized Third-Party Services</h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><span className="font-medium">MongoDB:</span> Encrypted data storage and management</li>
                    <li><span className="font-medium">Giphy:</span> GIF integration for messaging (search terms only)</li>
                    <li><span className="font-medium">Google Services:</span> Authentication via Google Sign-In</li>
                    <li><span className="font-medium">Cloud Storage:</span> Secure file storage for uploads</li>
                  </ul>
                </div>

                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">Limited User Sharing</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Public profile information (name, university, role)</li>
                    <li>Posts and comments you choose to share</li>
                    <li>Society membership (if you join public societies)</li>
                    <li>Academic content you voluntarily upload</li>
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-medium text-red-400 mb-2">Legal Requirements</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>With law enforcement if legally required AND with user permission</li>
                    <li>To comply with valid legal process</li>
                    <li>To protect our users' safety and security</li>
                    <li>To enforce our Terms of Service</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">4. Data Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">Technical Safeguards</h4>
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
                  <h4 className="font-medium text-green-400 mb-2">Operational Safeguards</h4>
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
              <p className="mt-4 text-sm text-gray-400">However, no method of transmission over the internet or electronic storage is 100% secure.</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">5. Data Retention</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="mb-4">Data is kept as long as your account is active. You can request deletion at any time by contacting us or visiting <a className='underline' target='_blank' href='/delete-account'>Delete Account</a></p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Active Account Data:</p>
                    <p className="text-gray-300">Retained while account is active</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Deleted Account Data:</p>
                    <p className="text-gray-300">Removed within 30 days of deletion request</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Security Logs:</p>
                    <p className="text-gray-300">Retained for 90 days for security purposes</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Legal Hold Data:</p>
                    <p className="text-gray-300">Retained as required by Pakistani law</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">6. Children's Privacy</h3>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <ul className="list-disc ml-6 space-y-2">
                  <li><span className="font-medium">Minimum Age:</span> Socian is not intended for children under 13. If such data is found, we will delete it promptly.</li>
                  <li><span className="font-medium">University Requirement:</span> University email verification ensures appropriate age</li>
                  <li><span className="font-medium">Enhanced Protection:</span> Special privacy protections for users under 18</li>
                  <li><span className="font-medium">No Marketing:</span> No advertising or marketing targeted to minors</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">7. Your Rights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">Access & Control</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Access, update, or delete your data</li>
                    <li>Download your data in portable format</li>
                    <li>Control profile visibility settings</li>
                    <li>Manage notification preferences</li>
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-medium text-green-400 mb-2">Device Permissions</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Revoke device permissions (camera, location, etc.)</li>
                    <li>Choose what data to share</li>
                    <li>Opt out of non-essential features</li>
                    <li>Request opt-out from analytics</li>
                  </ul>
                </div>
              </div>
              <p className="mt-2">Email: <a href="mailto:privacy@socian.app" className="underline">privacy@socian.app</a></p>
            </div>
          </div>
        </section>

        {/* TERMS OF SERVICE SECTION */}
        <section>
          <h2 className="text-3xl font-semibold border-b border-gray-700 pb-2 mb-6">Terms of Service</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">8. Eligibility and Account Requirements</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>You must be at least 13 years old to use Socian</li>
                <li>You must be enrolled in or affiliated with a Pakistani university</li>
                <li>You must provide accurate and truthful information during registration</li>
                <li>You must use a valid university email address for verification</li>
                <li>One account per person; multiple accounts are prohibited</li>
                <li>You are responsible for maintaining account security</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">9. Acceptable Use Policy</h3>
              
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-green-400 mb-2">✓ You MAY:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Share academic content, past papers, and educational materials</li>
                    <li>Participate in discussions and society activities</li>
                    <li>Upload original content you own or have permission to share</li>
                    <li>Provide honest reviews and feedback about teachers</li>
                    <li>Create and manage societies within your campus</li>
                    <li>Use GIFs from our Giphy integration for appropriate communication</li>
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-red-400 mb-2">✗ You MAY NOT:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Post hateful, discriminatory, or harassing content</li>
                    <li>Share copyrighted material without permission</li>
                    <li>Upload malicious files, viruses, or harmful content</li>
                    <li>Impersonate others or create fake profiles</li>
                    <li>Spam, advertise unauthorized products, or send unsolicited messages</li>
                    <li>Share personal information of others without consent</li>
                    <li>Engage in academic dishonesty or plagiarism</li>
                    <li>Post illegal content or content promoting illegal activities</li>
                    <li>Attempt to hack, reverse engineer, or compromise the app</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">10. Academic Integrity</h3>
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-medium text-green-400 mb-2">✓ Academic Support</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Share study techniques and learning strategies</li>
                    <li>Provide hints and guidance for problem-solving</li>
                    <li>Discuss concepts and theoretical understanding</li>
                    <li>Share publicly available past papers and resources</li>
                    <li>Offer constructive feedback on projects and assignments</li>
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-medium text-red-400 mb-2">✗ Academic Dishonesty</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Sharing current exam questions or answers</li>
                    <li>Completing assignments for other students</li>
                    <li>Distributing copyrighted textbooks or materials</li>
                    <li>Encouraging plagiarism or cheating</li>
                    <li>Sharing unauthorized internal exam materials</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">11. Content Standards</h3>
              <div className="space-y-4">
                <h4 className="font-medium mb-2">Content Guidelines:</h4>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Content must be relevant to academic or social purposes</li>
                  <li>No adult content, violence, or graphic material</li>
                  <li>No false information or misleading content</li>
                  <li>Respect intellectual property rights</li>
                  <li>Use appropriate language and maintain respectful tone</li>
                  <li>No harassment, bullying, or discriminatory content</li>
                </ul>

                <h4 className="font-medium mb-2 mt-4">Teacher Review Guidelines:</h4>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Focus on teaching methods, course content, and learning experience</li>
                  <li>Provide specific examples to support your feedback</li>
                  <li>Use respectful and professional language</li>
                  <li>Be honest but fair in your assessment</li>
                  <li>No personal attacks or inappropriate comments</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">12. Enforcement and Penalties</h3>
              
              <div className="space-y-4">
                <h4 className="font-medium mb-2">Progressive Enforcement:</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-medium text-yellow-400">1. Warning</p>
                    <p className="text-sm">First violation or minor infractions</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="font-medium text-orange-400">2. Content Removal</p>
                    <p className="text-sm">Violating content deleted with notification</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-medium text-red-400">3. Temporary Suspension</p>
                    <p className="text-sm">1-30 days depending on severity</p>
                  </div>
                  <div className="border-l-4 border-red-700 pl-4">
                    <p className="font-medium text-red-300">4. Permanent Ban</p>
                    <p className="text-sm">Severe violations or repeated offenses</p>
                  </div>
                </div>

                <h4 className="font-medium mb-2 mt-4">Appeals Process:</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Email appeals to: <a href="mailto:appeals@socian.app" className="underline">appeals@socian.app</a></li>
                  <li>Provide detailed explanation of circumstances</li>
                  <li>Response within 5-7 business days</li>
                  <li>Decision review by moderation team</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* REGIONAL AND COMPLIANCE SECTION */}
        <section>
          <h2 className="text-3xl font-semibold border-b border-gray-700 pb-2 mb-6">Regional Compliance & Legal</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">13. Regional Availability</h3>
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <p>
                  Socian is designed specifically for users residing in Pakistan. The app, its features, and its data handling practices are intended to comply with local laws and regulations within Pakistan.
                </p>
                <p className="mt-2">
                  Users located outside of Pakistan are not the intended audience for this app and may experience limited functionality or access restrictions.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">14. Third-Party Services</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><span className="font-medium">Google Services:</span> Sign-in authentication</li>
                <li><span className="font-medium">MongoDB:</span> Data storage and management</li>
                <li><span className="font-medium">Giphy:</span> GIF integration for messaging</li>
                <li>Third-party services have their own terms and privacy policies</li>
                <li>We are not responsible for third-party service issues</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">15. Intellectual Property</h3>
              <div className="space-y-3">
                <p>Socian and its features are protected by copyright, trademark, and other intellectual property laws.</p>
                
                <h4 className="font-medium">Respect for IP Rights:</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Do not upload copyrighted material without permission</li>
                  <li>Report copyright violations to: <a href="mailto:copyright@socian.app" className="underline">copyright@socian.app</a></li>
                  <li>We comply with DMCA takedown procedures</li>
                  <li>Repeated copyright violations result in account termination</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">16. Disclaimers and Limitations</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>User-generated content accuracy is not guaranteed</li>
                <li>Academic materials should be verified independently</li>
                <li>Teacher reviews reflect individual opinions</li>
                <li>We are not liable for academic decisions based on app content</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">17. Policy Updates</h3>
          <p>We may revise this policy periodically. Users will be notified of major changes via email or in-app.</p>
          <p className="text-sm text-gray-400 mt-1">Last updated: January 15, 2025</p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">Contact Us</h3>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="mb-3">If you have questions about this Privacy Policy or Terms, contact:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">General Support:</span> <a href="mailto:support@socian.app" className="underline">support@socian.app</a></p>
                <p><span className="font-medium">Privacy Questions:</span> <a href="mailto:privacy@socian.app" className="underline">privacy@socian.app</a></p>
                <p><span className="font-medium">Legal/Terms:</span> <a href="mailto:legal@socian.app" className="underline">legal@socian.app</a></p>
              </div>
              <div>
                <p><span className="font-medium">Appeals:</span> <a href="mailto:appeals@socian.app" className="underline">appeals@socian.app</a></p>
                <p><span className="font-medium">Copyright Issues:</span> <a href="mailto:copyright@socian.app" className="underline">copyright@socian.app</a></p>
                <p><span className="font-medium">Data Protection:</span> <a href="mailto:dpo@socian.app" className="underline">dpo@socian.app</a></p>
              </div>
            </div>
            <div className="mt-3">
              <p><span className="font-medium">Website:</span> <a href="https://socian.app/privacy" className="underline">https://socian.app/privacy</a></p>
              <p><span className="font-medium">Country:</span> Pakistan</p>
            </div>
          </div>
        </section>

        {/* Google Play Store Compliance Summary */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Google Play Store Compliance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">✓ Data Collection:</p>
              <p className="text-gray-300">Minimal and necessary only</p>
            </div>
            <div>
              <p className="font-medium mb-1">✓ User Control:</p>
              <p className="text-gray-300">Full access and deletion rights</p>
            </div>
            <div>
              <p className="font-medium mb-1">✓ Security:</p>
              <p className="text-gray-300">Industry-standard encryption</p>
            </div>
            <div>
              <p className="font-medium mb-1">✓ Transparency:</p>
              <p className="text-gray-300">Clear privacy policies</p>
            </div>
            <div>
              <p className="font-medium mb-1">✓ Children's Safety:</p>
              <p className="text-gray-300">COPPA compliant protections</p>
            </div>
            <div>
              <p className="font-medium mb-1">✓ Legal Compliance:</p>
              <p className="text-gray-300">Pakistani & international standards</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Changes</h3>
          <p className="text-sm text-gray-400 mb-4">
            Below is a list of changes made to this privacy policy. We maintain this section for full transparency.
          </p>

          <details className="mt-4">
            <summary className="cursor-pointer text-gray-300 underline">View Recent Changes (January 15, 2025)</summary>
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
                    <td className="border border-gray-700 px-4 py-2">January 15, 2025</td>
                    <td className="border border-gray-700 px-4 py-2">Comprehensive Policy Update</td>
                    <td className="border border-gray-700 px-4 py-2">
                      Merged Privacy Policy, Terms of Service, Community Guidelines, and Data Safety requirements into one comprehensive document for Google Play Store compliance.
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800">
                    <td className="border border-gray-700 px-4 py-2">January 15, 2025</td>
                    <td className="border border-gray-700 px-4 py-2">Enhanced Data Security Information</td>
                    <td className="border border-gray-700 px-4 py-2">
                      Added detailed information about device info collection for security, temporary IP usage during login, and Flutter security measures.
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800">
                    <td className="border border-gray-700 px-4 py-2">June 19, 2025</td>
                    <td className="border border-gray-700 px-4 py-2">Removed PostHog Analytics</td>
                    <td className="border border-gray-700 px-4 py-2">
                      PostHog was previously used only during private testing for debugging purposes. It was fully removed before publishing the app on the Play Store. We never used it in the production version.
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-800">
                    <td className="border border-gray-700 px-4 py-2">June 19, 2025</td>
                    <td className="border border-gray-700 px-4 py-2">+ Regional Availability Policy</td>
                    <td className="border border-gray-700 px-4 py-2">
                      Added a new section clarifying that Socian is intended for users residing in Pakistan only. This defines regional access scope and legal applicability.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          By using Socian, you acknowledge that you have read, understood, and agree to be bound by this comprehensive Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
