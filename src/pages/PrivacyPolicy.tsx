import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
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
            <Shield className="mr-2 h-3 w-3" />
            Privacy & Security
          </Badge>
          
          <h1 className="text-hero text-white mb-6">
            Privacy Policy
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">1. Introduction</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  BuildForMe ("we," "us," or "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Discord bot, web dashboard, and related services (collectively, the "Service").
                </p>
                <p>
                  This Privacy Policy applies to all users of our Service, including visitors to our website, users of our Discord bot, and subscribers to our paid services. By using our Service, you consent to the data practices described in this policy.
                </p>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the effective date.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">2. Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">2.1 Information You Provide</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      We collect information you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li><strong className="text-white">Account Information:</strong> When you create an account, we collect your Discord username, user ID, avatar, and email address (if provided by Discord).</li>
                      <li><strong className="text-white">Server Information:</strong> When you add our bot to your Discord server, we collect server names, IDs, member counts, and channel/role configurations.</li>
                      <li><strong className="text-white">Payment Information:</strong> When you subscribe to our paid services, we collect billing information through our payment processors (such as Stripe).</li>
                      <li><strong className="text-white">Support Communications:</strong> When you contact us for support, we collect the information you provide in your communications.</li>
                      <li><strong className="text-white">Feedback and Surveys:</strong> We may collect information you provide in feedback forms or surveys.</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">2.2 Information We Collect Automatically</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      When you use our Service, we automatically collect certain information, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li><strong className="text-white">Usage Information:</strong> We collect information about your interactions with our Service, including features used, commands executed, and time spent using the Service.</li>
                      <li><strong className="text-white">Device Information:</strong> We collect information about the devices you use to access our Service, including IP addresses, browser types, operating systems, and device identifiers.</li>
                      <li><strong className="text-white">Log Information:</strong> Our servers automatically record certain information, including error logs, access logs, and performance metrics.</li>
                      <li><strong className="text-white">Discord API Data:</strong> We collect information available through the Discord API, including server metadata, user roles, and message metadata (but not message content unless explicitly authorized).</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">2.3 Information from Third Parties</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      We may receive information from third parties, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li><strong className="text-white">Discord:</strong> We receive information from Discord when you use our bot or authenticate with your Discord account.</li>
                      <li><strong className="text-white">Payment Processors:</strong> We receive transaction information from payment processors like Stripe.</li>
                      <li><strong className="text-white">Analytics Services:</strong> We may receive aggregated information from analytics services to help improve our Service.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">3. How We Use Your Information</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li><strong className="text-white">Providing and Maintaining Our Service:</strong> To operate our Discord bot, maintain our dashboard, and provide customer support.</li>
                  <li><strong className="text-white">Personalizing Your Experience:</strong> To customize features and content based on your preferences and usage patterns.</li>
                  <li><strong className="text-white">Processing Payments:</strong> To process subscription payments and manage billing inquiries.</li>
                  <li><strong className="text-white">Improving Our Service:</strong> To analyze usage patterns, identify issues, and develop new features.</li>
                  <li><strong className="text-white">Communicating with You:</strong> To send service notifications, updates, and respond to your inquiries.</li>
                  <li><strong className="text-white">Ensuring Security:</strong> To detect and prevent fraud, abuse, and security threats.</li>
                  <li><strong className="text-white">Compliance:</strong> To comply with legal obligations and enforce our Terms of Service.</li>
                  <li><strong className="text-white">Marketing:</strong> To send promotional communications (with your consent where required).</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">4. Information Sharing and Disclosure</h2>
              <div className="text-gray-300 space-y-6 leading-relaxed">
                <p>
                  We may share your information in the following circumstances:
                </p>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">4.1 Service Providers</h3>
                  <div className="text-gray-300 space-y-4">
                    <p>
                      We may share your information with third-party service providers who perform services on our behalf, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Cloud hosting providers (e.g., Supabase, AWS)</li>
                      <li>Payment processors (e.g., Stripe)</li>
                      <li>Analytics services (e.g., Google Analytics)</li>
                      <li>Customer support tools</li>
                      <li>Email service providers</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">4.2 Legal Requirements</h3>
                  <div className="text-gray-300 space-y-4">
                    <p>
                      We may disclose your information if required by law or in good faith belief that such disclosure is necessary to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Comply with legal obligations or court orders</li>
                      <li>Protect our rights, property, or safety</li>
                      <li>Protect the rights, property, or safety of our users or others</li>
                      <li>Investigate potential violations of our Terms of Service</li>
                      <li>Prevent or investigate possible wrongdoing</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">4.3 Business Transfers</h3>
                  <p>
                    In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any such transfer and any choices you may have regarding your information.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">4.4 Consent</h3>
                  <p>
                    We may share your information with your consent or at your direction, such as when you choose to share information with third-party integrations.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">5. Data Security</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Employee training on data protection practices</li>
                  <li>Incident response procedures</li>
                </ul>
                <p>
                  However, no method of transmission over the Internet or electronic storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
                <p>
                  If we become aware of a security breach that affects your information, we will notify you as required by applicable law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">6. Data Retention</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We retain your information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. Specific retention periods include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li><strong className="text-white">Account Information:</strong> Retained while your account is active and for a reasonable period after deletion to comply with legal obligations.</li>
                  <li><strong className="text-white">Usage Data:</strong> Typically retained for 12-24 months for analytics and service improvement purposes.</li>
                  <li><strong className="text-white">Payment Information:</strong> Retained as required by payment processors and tax regulations, typically 7 years.</li>
                  <li><strong className="text-white">Support Communications:</strong> Retained for 3 years to provide ongoing support and resolve disputes.</li>
                  <li><strong className="text-white">Legal Hold Data:</strong> Retained as required by law or for ongoing legal proceedings.</li>
                </ul>
                <p>
                  We may retain anonymized or aggregated data indefinitely for analytics and research purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">7. Your Rights and Choices</h2>
              <div className="text-gray-300 space-y-6 leading-relaxed">
                <p>
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">7.1 Access and Portability</h3>
                  <p>
                    You may request access to your personal information and receive a copy of your data in a structured, commonly used format.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">7.2 Correction</h3>
                  <p>
                    You may request that we correct inaccurate or incomplete personal information.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">7.3 Deletion</h3>
                  <p>
                    You may request that we delete your personal information, subject to certain exceptions (e.g., legal requirements, legitimate business purposes).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">7.4 Restriction and Objection</h3>
                  <p>
                    You may request that we restrict or limit the processing of your personal information or object to certain processing activities.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">7.5 Exercising Your Rights</h3>
                  <p>
                    To exercise any of these rights, please contact us at privacy@buildforme.xyz. We will respond to your request within 30 days.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">8. Contact Information</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-white font-medium">BuildForMe Privacy Team</p>
                  <p>Email: privacy@buildforme.xyz</p>
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

export default PrivacyPolicy; 