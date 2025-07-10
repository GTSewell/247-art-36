import React from 'react';
import Navigation from '@/components/navigation/NavigationComponent';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="text-muted-foreground mb-6">
            <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-foreground leading-relaxed">
              Welcome to our artist platform ("we," "our," or "us"). This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our application, including our 
              auto-profile generation feature that integrates with Instagram and other social media platforms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Account information (name, email address)</li>
              <li>Artist profile information (bio, specialty, location, techniques, styles)</li>
              <li>Social media profile URLs you choose to connect</li>
              <li>Messages and communications through our platform</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">2.2 Information from Social Media</h3>
            <p className="text-foreground leading-relaxed mb-3">
              When you use our auto-profile generation feature, we may collect:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Public profile information (name, bio, profile picture)</li>
              <li>Public posts and content related to your artistic work</li>
              <li>Location information from posts (if publicly available)</li>
              <li>Hashtags and captions related to your artwork</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">2.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Usage data and analytics</li>
              <li>Device information and IP address</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Create and maintain your artist profile</li>
              <li>Generate comprehensive artist profiles using AI analysis</li>
              <li>Connect artists with collectors and galleries</li>
              <li>Facilitate messaging and communication</li>
              <li>Improve our services and user experience</li>
              <li>Send you updates and promotional content (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibend text-foreground mb-4">4. Information Sharing</h2>
            <p className="text-foreground leading-relaxed mb-3">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li><strong>Public Profiles:</strong> Artist profile information you choose to make public</li>
              <li><strong>Service Providers:</strong> Third-party services that help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Storage and Security</h2>
            <p className="text-foreground leading-relaxed mb-3">
              We store your data securely using industry-standard security measures. Your data is stored on secure servers 
              and we implement appropriate technical and organizational measures to protect it.
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Encrypted data transmission</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Data backup and recovery procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights and Choices</h2>
            <p className="text-foreground leading-relaxed mb-3">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for social media data collection</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Data Retention</h2>
            <p className="text-foreground leading-relaxed">
              We retain your personal information for as long as necessary to provide our services or as required by law. 
              When you delete your account, we will delete or anonymize your personal information within 30 days, 
              except where we are required to retain it for legal, regulatory, or security purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Services</h2>
            <p className="text-foreground leading-relaxed">
              Our platform integrates with third-party services including:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Instagram Basic Display API</li>
              <li>OpenAI for AI-powered profile generation</li>
              <li>Supabase for data storage and authentication</li>
            </ul>
            <p className="text-foreground leading-relaxed mt-3">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
            <p className="text-foreground leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="text-foreground">
                <strong>Email:</strong> privacy@your-domain.com<br />
                <strong>Subject:</strong> Privacy Policy Inquiry
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;