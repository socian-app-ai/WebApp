import React from 'react';

const CommunityGuidelines = () => {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12 md:px-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Community Guidelines</h1>
        <p className="text-sm text-gray-400">Effective Date: January 15, 2025</p>

        <section className="space-y-4">
          <p className="text-lg">
            Socian is a platform for Pakistani university students to connect, learn, and grow together. 
            These Community Guidelines help ensure a safe, respectful, and productive environment for everyone.
          </p>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <p className="font-semibold text-blue-300">Our Mission:</p>
            <p>To create an inclusive academic community where students, teachers, and alumni can share knowledge, collaborate, and support each other's educational journey.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">1. Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-green-400">✓ Respect</h3>
              <p className="text-sm">Treat all community members with dignity and courtesy</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-green-400">✓ Academic Integrity</h3>
              <p className="text-sm">Maintain honesty in all academic discussions and materials</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-green-400">✓ Inclusivity</h3>
              <p className="text-sm">Welcome diverse perspectives and backgrounds</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-green-400">✓ Helpfulness</h3>
              <p className="text-sm">Support fellow students in their learning journey</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">2. Content Standards</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-3">✓ Encouraged Content</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><span className="font-medium">Academic Resources:</span> Study materials, past papers, course notes, tutorials</li>
                <li><span className="font-medium">Constructive Discussions:</span> Subject-related questions, academic debates, help requests</li>
                <li><span className="font-medium">Society Activities:</span> Event announcements, club updates, extracurricular content</li>
                <li><span className="font-medium">Career Guidance:</span> Internship opportunities, job postings, career advice</li>
                <li><span className="font-medium">Honest Reviews:</span> Constructive feedback about courses and teaching</li>
                <li><span className="font-medium">Campus Life:</span> University events, achievements, positive campus experiences</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-red-400 mb-3">✗ Prohibited Content</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><span className="font-medium">Hate Speech:</span> Content targeting race, religion, gender, sexuality, or nationality</li>
                <li><span className="font-medium">Harassment:</span> Bullying, threats, stalking, or intimidation</li>
                <li><span className="font-medium">Adult Content:</span> Sexually explicit material, nudity, or pornographic content</li>
                <li><span className="font-medium">Violence:</span> Graphic content, violence promotion, or harmful activities</li>
                <li><span className="font-medium">Illegal Activities:</span> Drug use, illegal substances, criminal activities</li>
                <li><span className="font-medium">Copyright Violation:</span> Unauthorized copyrighted material</li>
                <li><span className="font-medium">Spam:</span> Repetitive content, unsolicited advertising, irrelevant posts</li>
                <li><span className="font-medium">Misinformation:</span> False academic information, fake news, misleading content</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">3. Academic Integrity Guidelines</h2>
          
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-400 mb-2">✓ Academic Support</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Share study techniques and learning strategies</li>
                <li>Provide hints and guidance for problem-solving</li>
                <li>Discuss concepts and theoretical understanding</li>
                <li>Share publicly available past papers and resources</li>
                <li>Offer constructive feedback on projects and assignments</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-400 mb-2">✗ Academic Dishonesty</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Sharing current exam questions or answers</li>
                <li>Completing assignments for other students</li>
                <li>Distributing copyrighted textbooks or materials</li>
                <li>Encouraging plagiarism or cheating</li>
                <li>Sharing unauthorized internal exam materials</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">4. Communication Guidelines</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Respectful Communication</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li><span className="font-medium">Use appropriate language:</span> Avoid profanity, slurs, or offensive terms</li>
              <li><span className="font-medium">Stay on topic:</span> Keep discussions relevant to the subject or community</li>
              <li><span className="font-medium">Be constructive:</span> Provide helpful, solution-oriented responses</li>
              <li><span className="font-medium">Respect privacy:</span> Don't share personal information about others</li>
              <li><span className="font-medium">Use proper channels:</span> Post content in appropriate groups and categories</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 mt-6">Discussion Etiquette</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Listen to different viewpoints and engage thoughtfully</li>
              <li>Cite sources when sharing academic information</li>
              <li>Acknowledge when you don't know something</li>
              <li>Thank community members for helpful responses</li>
              <li>Use search before asking duplicate questions</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">5. Teacher Review Guidelines</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Constructive Reviews</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Focus on teaching methods, course content, and learning experience</li>
                <li>Provide specific examples to support your feedback</li>
                <li>Use respectful and professional language</li>
                <li>Be honest but fair in your assessment</li>
                <li>Include both positive aspects and areas for improvement</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-400 mb-2">Inappropriate Reviews</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Personal attacks or character assassination</li>
                <li>Comments about physical appearance or personal life</li>
                <li>Revenge reviews due to poor grades</li>
                <li>False or misleading information</li>
                <li>Reviews based on rumors or hearsay</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">6. Society and Group Management</h2>
          
          <ul className="list-disc ml-6 space-y-2">
            <li><span className="font-medium">Relevant Content:</span> Ensure posts are related to your society's purpose</li>
            <li><span className="font-medium">Inclusive Environment:</span> Welcome all eligible members regardless of background</li>
            <li><span className="font-medium">Clear Guidelines:</span> Establish and communicate society-specific rules</li>
            <li><span className="font-medium">Active Moderation:</span> Monitor content and member behavior regularly</li>
            <li><span className="font-medium">Event Safety:</span> Ensure all events comply with university and local regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">7. Reporting and Moderation</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">How to Report</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Use the "Report" button on any post or comment</li>
              <li>Select the appropriate violation category</li>
              <li>Provide additional context if necessary</li>
              <li>For urgent issues, email: moderation@socian.app</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 mt-4">What to Report</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Harassment, bullying, or threats</li>
              <li>Inappropriate or explicit content</li>
              <li>Spam or commercial posts</li>
              <li>Copyright violations</li>
              <li>Academic dishonesty</li>
              <li>Hate speech or discrimination</li>
              <li>Fake profiles or impersonation</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 mt-4">Moderation Process</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Reports reviewed within 24-48 hours</li>
              <li>Automated systems detect obvious violations</li>
              <li>Human moderators handle complex cases</li>
              <li>Users notified of actions taken on their content</li>
              <li>Appeals process available for disputed decisions</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">8. Consequences and Enforcement</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Progressive Enforcement</h3>
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

            <h3 className="text-lg font-medium mb-2 mt-6">Immediate Suspension</h3>
            <p className="mb-2">Some violations result in immediate account suspension:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Threats of violence or harm</li>
              <li>Doxxing or sharing private information</li>
              <li>Explicit sexual content</li>
              <li>Coordinated harassment campaigns</li>
              <li>Illegal activities or content</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">9. Appeals Process</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">How to Appeal</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Email appeals@socian.app within 7 days of action</li>
              <li>Include your username and specific incident details</li>
              <li>Explain why you believe the action was incorrect</li>
              <li>Provide any relevant context or evidence</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 mt-4">Appeal Review Process</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Initial response within 3-5 business days</li>
              <li>Review by different moderation team member</li>
              <li>Detailed explanation of final decision</li>
              <li>One appeal per incident allowed</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">10. Special Considerations</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Cultural Sensitivity</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Respect Pakistan's diverse cultural and religious backgrounds</li>
              <li>Avoid content that may be offensive to specific communities</li>
              <li>Consider the academic and professional context of discussions</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 mt-4">Language Policy</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Primary languages: English and Urdu</li>
              <li>Regional languages allowed in appropriate contexts</li>
              <li>Translations encouraged for inclusive communication</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 mt-4">University Relations</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Respect individual university policies and guidelines</li>
              <li>Do not share confidential institutional information</li>
              <li>Report serious academic misconduct to appropriate authorities</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Contact and Support</h2>
          <div className="space-y-2">
            <p><span className="font-medium">General Questions:</span> <a href="mailto:support@socian.app" className="underline">support@socian.app</a></p>
            <p><span className="font-medium">Content Reports:</span> <a href="mailto:moderation@socian.app" className="underline">moderation@socian.app</a></p>
            <p><span className="font-medium">Appeals:</span> <a href="mailto:appeals@socian.app" className="underline">appeals@socian.app</a></p>
            <p><span className="font-medium">Community Feedback:</span> <a href="mailto:community@socian.app" className="underline">community@socian.app</a></p>
          </div>
        </section>

        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Remember</h3>
          <p className="text-gray-300">
            These guidelines exist to create a positive learning environment for everyone. 
            When in doubt, ask yourself: "Does this contribute positively to our academic community?" 
            If yes, you're probably on the right track!
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          These Community Guidelines are part of our Terms of Service and are subject to updates. 
          Last updated: January 15, 2025
        </p>
      </div>
    </div>
  );
};

export default CommunityGuidelines; 