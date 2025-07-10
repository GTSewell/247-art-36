import React from 'react';
import Navigation from '@/components/navigation/NavigationComponent';

const DataDeletion = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Data Deletion Instructions</h1>
          
          <div className="text-muted-foreground mb-6">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request Data Deletion</h2>
            <p className="text-foreground leading-relaxed mb-4">
              You have the right to request the deletion of your personal data from our platform. 
              We provide multiple ways for you to request data deletion:
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Account Deletion (Recommended)</h2>
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-foreground leading-relaxed mb-4">
                <strong>If you have an account with us:</strong>
              </p>
              <ol className="list-decimal pl-6 text-foreground space-y-2">
                <li>Log into your account</li>
                <li>Go to Account Settings</li>
                <li>Click on "Delete Account"</li>
                <li>Confirm your decision</li>
                <li>Your account and associated data will be deleted within 30 days</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibend text-foreground mb-4">2. Email Request</h2>
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-foreground leading-relaxed mb-4">
                <strong>Send an email to:</strong> privacy@your-domain.com
              </p>
              <p className="text-foreground leading-relaxed mb-4">
                <strong>Subject Line:</strong> Data Deletion Request
              </p>
              <p className="text-foreground leading-relaxed mb-4">
                <strong>Include the following information:</strong>
              </p>
              <ul className="list-disc pl-6 text-foreground space-y-2">
                <li>Your full name</li>
                <li>Email address associated with your account</li>
                <li>Artist name or profile name (if applicable)</li>
                <li>Reason for deletion request (optional)</li>
                <li>Any specific data you want deleted</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Instagram Data Deletion</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <p className="text-foreground leading-relaxed mb-4">
                <strong>For data collected through Instagram integration:</strong>
              </p>
              <ol className="list-decimal pl-6 text-foreground space-y-2">
                <li>Send an email to privacy@your-domain.com</li>
                <li>Subject: "Instagram Data Deletion Request"</li>
                <li>Include your Instagram username</li>
                <li>Include your email address</li>
                <li>Specify that you want all Instagram-derived data deleted</li>
              </ol>
              <p className="text-foreground leading-relaxed mt-4">
                <strong>Note:</strong> This will remove any profile information we generated from your Instagram account.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Data Will Be Deleted</h2>
            <p className="text-foreground leading-relaxed mb-4">
              When you request data deletion, we will remove:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Your account information and profile</li>
              <li>All personal information we collected</li>
              <li>Data derived from social media integrations</li>
              <li>Your messages and communications</li>
              <li>Analytics data associated with your account</li>
              <li>Any uploaded images or artwork</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data We May Retain</h2>
            <p className="text-foreground leading-relaxed mb-4">
              In certain cases, we may retain some information as required by law or for legitimate business purposes:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Transaction records for tax and accounting purposes</li>
              <li>Data required for legal compliance</li>
              <li>Aggregated, anonymized analytics data</li>
              <li>Information necessary to prevent fraud or abuse</li>
            </ul>
            <p className="text-foreground leading-relaxed mt-4">
              Any retained data will be anonymized and cannot be linked back to you personally.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Processing Timeline</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-foreground mb-2">Account Deletion</h3>
                <p className="text-foreground">Completed within 30 days</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-foreground mb-2">Email Requests</h3>
                <p className="text-foreground">
                  Response within 48 hours<br />
                  Deletion within 30 days
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Verification Process</h2>
            <p className="text-foreground leading-relaxed mb-4">
              To protect your privacy and prevent unauthorized deletion requests, we may need to verify your identity:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>We may ask for additional information to confirm your identity</li>
              <li>For Instagram-related data, we may require proof of account ownership</li>
              <li>Account holders can verify through login credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">After Deletion</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-foreground mb-3">Important Notes:</h3>
              <ul className="list-disc pl-6 text-foreground space-y-2">
                <li>Data deletion is permanent and cannot be undone</li>
                <li>You will lose access to your account and all associated data</li>
                <li>Any public content may take additional time to be removed from search engines</li>
                <li>Third-party integrations may retain some data according to their own policies</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Questions or Issues</h2>
            <p className="text-foreground leading-relaxed mb-4">
              If you have questions about the data deletion process or encounter any issues:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-foreground">
                <strong>Email:</strong> privacy@your-domain.com<br />
                <strong>Subject:</strong> Data Deletion Support<br />
                <strong>Response Time:</strong> Within 48 hours
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p className="text-foreground leading-relaxed">
              This data deletion process is part of your privacy rights. You also have the right to:
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Export your data</li>
              <li>Restrict processing of your data</li>
              <li>Object to data processing</li>
            </ul>
            <p className="text-foreground leading-relaxed mt-4">
              For more information about your privacy rights, please see our{' '}
              <a href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;