import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";

const TermsOfService: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="min-h-screen bg-pure-black py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gray-800 text-gray-300 px-3 py-1 text-sm font-medium mb-6 border border-gray-700 hover:bg-gray-800">
            <ScrollText className="mr-2 h-3 w-3" />
            Legal Document
          </Badge>
          
          <h1 className="text-hero text-white mb-6">
            Terms of Service
          </h1>
          
          <div className="text-gray-400 text-sm mb-8 space-y-1">
            <p><strong>Effective Date:</strong> {currentDate}</p>
            <p><strong>Last Updated:</strong> {currentDate}</p>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-gray-900 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-heading text-white mb-6">1. Acceptance of Terms</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Welcome to BuildForMe ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your use of our Discord bot, web dashboard, and related services (collectively, the "Service") operated by BuildForMe.
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
                <p>
                  We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on our website with a new effective date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">2. Description of Service</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  BuildForMe provides a Discord bot and web dashboard designed to help Discord server administrators manage their communities through automated server setup, AI-powered moderation, and various administrative tools.
                </p>
                <p>
                  Our Service includes but is not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Discord bot functionality for server management</li>
                  <li>Web dashboard for configuration and monitoring</li>
                  <li>AI-powered server setup and optimization</li>
                  <li>Channel and role management tools</li>
                  <li>Permission optimization and security features</li>
                  <li>Server analytics and reporting</li>
                  <li>Customer support and documentation</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any part of our Service at any time without notice. We are not liable for any modification, suspension, or discontinuation of the Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">3. User Accounts and Registration</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  To access certain features of our Service, you must register for an account by connecting your Discord account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </p>
                <p>
                  You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are solely responsible for safeguarding your account credentials.
                </p>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms or that we determine, in our sole discretion, are harmful to our Service or other users.
                </p>
                <p>
                  You must be at least 13 years old to use our Service. If you are under 18, you represent that you have your parent or guardian's permission to use the Service and that they have agreed to these Terms on your behalf.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">4. Acceptable Use Policy</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service. Prohibited activities include, but are not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Transmitting spam, malware, or malicious code</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Interfering with or disrupting the Service</li>
                  <li>Impersonating others or providing false information</li>
                  <li>Harassing, threatening, or abusing other users</li>
                  <li>Using the Service to distribute illegal content</li>
                  <li>Attempting to reverse engineer or modify our software</li>
                  <li>Using automated means to access the Service without permission</li>
                </ul>
                <p>
                  We reserve the right to investigate and take appropriate action against anyone who violates this policy, including reporting to law enforcement authorities when warranted.
                </p>
                <p>
                  You are solely responsible for your conduct and any content you submit through the Service. We do not endorse any user content and are not responsible for the accuracy or reliability of any user-generated content.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">5. Intellectual Property Rights</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of BuildForMe and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written permission.
                </p>
                <p>
                  You retain ownership of any content you submit through the Service. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, distribute, and display such content in connection with operating and providing the Service.
                </p>
                <p>
                  We respect the intellectual property rights of others and expect our users to do the same. If you believe your copyrighted work has been copied in a way that constitutes copyright infringement, please contact us with the required information under the Digital Millennium Copyright Act (DMCA).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">6. Privacy and Data Protection</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
                <p>
                  We implement appropriate security measures to protect your personal information, but no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
                </p>
                <p>
                  We may process and store your data in countries other than your own. By using our Service, you consent to the transfer of your data to these countries, which may have different data protection laws than your country.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">7. Subscription Plans and Payments</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We offer both free and paid subscription plans for our Service. Paid subscriptions provide access to premium features and enhanced functionality. All subscription fees are due in advance and are non-refundable except as required by law.
                </p>
                <p>
                  Subscription fees are billed monthly unless otherwise specified. By subscribing to a paid plan, you authorize us to charge your designated payment method for the subscription fee and any applicable taxes.
                </p>
                <p>
                  We reserve the right to change our subscription fees at any time. Any fee changes will be communicated to you with at least 30 days' notice. If you do not agree to the fee changes, you may cancel your subscription.
                </p>
                <p>
                  If payment is not received when due, we may suspend or terminate your access to premium features. We are not responsible for any fees or charges from your payment provider.
                </p>
                <p>
                  We use third-party payment processors, including Stripe, to process payments. Your payment information is subject to their respective privacy policies and terms of service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">8. Refund Policy</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  <strong className="text-white">All sales are final.</strong> We do not offer refunds for any subscription fees or other charges, except as required by applicable law or as otherwise specified in these Terms.
                </p>
                <p>
                  You may cancel your subscription at any time, but cancellation will not result in a refund of previously paid fees. Upon cancellation, you will retain access to premium features until the end of your current billing period.
                </p>
                <p>
                  If you believe you have been charged in error, please contact our support team immediately. We will investigate legitimate billing errors and provide appropriate remedies.
                </p>
                <p>
                  In the event of a billing dispute, you agree to work with us in good faith to resolve the issue before initiating any formal legal proceedings or chargebacks.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">9. Disclaimers and Limitation of Liability</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  <strong className="text-white">DISCLAIMER:</strong> THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  We do not warrant that the Service will be uninterrupted, error-free, or secure. We are not responsible for any loss or damage resulting from your use of the Service, including but not limited to data loss, server downtime, or security breaches.
                </p>
                <p>
                  <strong className="text-white">LIMITATION OF LIABILITY:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, BUILDFOR ME SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                </p>
                <p>
                  IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
                </p>
                <p>
                  Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities, so the above limitations may not apply to you.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">10. Indemnification</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  You agree to indemnify, defend, and hold harmless BuildForMe, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorney's fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any content you submit through the Service</li>
                </ul>
                <p>
                  This indemnification obligation will survive the termination of these Terms and your use of the Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">11. Termination</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
                </p>
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion features in our dashboard. Upon termination, your right to use the Service will cease immediately.
                </p>
                <p>
                  Upon termination, we may delete your account and all associated data. We are not obligated to retain any user data after termination.
                </p>
                <p>
                  The provisions of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property rights, disclaimers, limitation of liability, and indemnification.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">12. Governing Law and Jurisdiction</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United States and the state where BuildForMe is incorporated, without regard to conflict of law principles.
                </p>
                <p>
                  Any legal action or proceeding arising under these Terms will be brought exclusively in the courts of competent jurisdiction located in the United States, and you hereby consent to the personal jurisdiction and venue therein.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-heading text-white mb-6">13. Contact Information</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-white font-medium">BuildForMe Support</p>
                  <p>Email: support@buildforme.xyz</p>
                  <p>Website: https://buildforme.xyz</p>
                </div>
                <p>
                  We will respond to your inquiry within 3 business days.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService; 