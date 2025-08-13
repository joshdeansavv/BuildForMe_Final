import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

const ReturnPolicy: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="min-h-screen bg-pure-black py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-hero text-white mb-6">
            Return & Refund Policy
          </h1>
          
          <div className="text-gray-400 text-sm mb-8 space-y-1">
            <p><strong>Effective Date:</strong> {currentDate}</p>
            <p><strong>Last Updated:</strong> {currentDate}</p>
          </div>
        </div>

        {/* Content */}
        <Card className="backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">1. Policy Overview</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  This Return & Refund Policy ("Policy") governs the terms and conditions for refunds and returns for BuildForMe's Discord bot services, web dashboard, and subscription plans (collectively, the "Service"). This Policy is incorporated into and forms part of our Terms of Service.
                </p>
                <p>
                  <strong className="text-white">IMPORTANT NOTICE:</strong> All purchases and subscriptions for BuildForMe services are final. We operate a strict no-refund policy except as specifically outlined in this document or as required by applicable law.
                </p>
                <p>
                  By purchasing our services or subscribing to our plans, you acknowledge that you have read, understood, and agree to be bound by this Policy. If you do not agree with any part of this Policy, please do not purchase our services.
                </p>
                <p>
                  This Policy applies to all users, including individual consumers, businesses, and organizations, regardless of their location, subject to applicable local laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">2. No Refund Policy</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">2.1 General Policy</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      <strong className="text-white">All sales are final.</strong> BuildForMe does not offer refunds, returns, or exchanges for any of our services, including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Monthly subscription fees</li>
                      <li>Annual subscription fees</li>
                      <li>Premium feature upgrades</li>
                      <li>One-time service charges</li>
                      <li>Setup fees or configuration charges</li>
                      <li>Custom development or integration services</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">2.2 Rationale</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      Our no-refund policy is based on the following factors:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li><strong className="text-white">Digital Service Nature:</strong> Our services are delivered digitally and consumed immediately upon activation</li>
                      <li><strong className="text-white">Instant Access:</strong> Premium features are activated immediately upon payment</li>
                      <li><strong className="text-white">Resource Allocation:</strong> We allocate server resources and support based on subscription commitments</li>
                      <li><strong className="text-white">Fair Pricing:</strong> Our competitive pricing reflects the no-refund policy</li>
                      <li><strong className="text-white">Free Trial Availability:</strong> We offer free tier services to evaluate our offerings before purchasing</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">2.3 Acknowledgment</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      By completing a purchase, you explicitly acknowledge and agree that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>You have read and understood this no-refund policy</li>
                      <li>You are purchasing digital services that cannot be returned</li>
                      <li>You will not be entitled to a refund for any reason</li>
                      <li>You have evaluated our free services before purchasing premium features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">3. Subscription Terms and Billing</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">3.1 Subscription Billing</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      Subscription fees are charged in advance for each billing period (monthly or annually). All subscription fees are non-refundable, regardless of usage or satisfaction with the Service.
                    </p>
                    <p>
                      Billing occurs automatically on the same day each month (for monthly subscriptions) or annually (for annual subscriptions) unless you cancel your subscription before the next billing cycle.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">3.2 Partial Period Billing</h3>
                  <p className="text-gray-300">
                    If you subscribe mid-billing period, you may be charged a prorated amount for the remaining period. However, if you cancel before the next billing cycle, no refund will be provided for the unused portion.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">3.3 Auto-Renewal</h3>
                  <p className="text-gray-300">
                    Subscriptions automatically renew unless cancelled before the next billing date. Each renewal constitutes a new purchase subject to this no-refund policy.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">4. Cancellation Process</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">4.1 How to Cancel</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      You may cancel your subscription at any time through:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Your dashboard account settings</li>
                      <li>The Stripe Customer Portal (for Stripe payments)</li>
                      <li>Contacting us at buildformeapp@gmail.com</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">4.2 Cancellation Effects</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      When you cancel your subscription:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Your subscription remains active until the end of the current billing period</li>
                      <li>You retain access to premium features until the subscription expires</li>
                      <li>No refund is provided for the current billing period</li>
                      <li>Auto-renewal is disabled for future billing periods</li>
                      <li>Your account automatically downgrades to the free tier upon expiration</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">4.3 Cancellation Confirmation</h3>
                  <p className="text-gray-300">
                    We will send you a confirmation email when your cancellation is processed. If you do not receive confirmation within 24 hours, please contact us at buildformeapp@gmail.com immediately.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">5. Billing Disputes and Errors</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">5.1 Billing Errors</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      If you believe there has been a billing error, please contact us immediately at buildformeapp@gmail.com. We will investigate legitimate billing errors and take appropriate action, which may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Correcting erroneous charges</li>
                      <li>Applying credits to your account</li>
                      <li>Processing refunds for verified billing errors</li>
                      <li>Adjusting your subscription status</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">5.2 Duplicate Charges</h3>
                  <p className="text-gray-300">
                    If you are charged multiple times for the same subscription period due to a technical error, we will refund the duplicate charges after verification.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">5.3 Unauthorized Charges</h3>
                  <p className="text-gray-300">
                    If you believe you have been charged without authorization, please contact us at buildformeapp@gmail.com immediately. We will investigate and take appropriate action, which may include refunding unauthorized charges.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">5.4 Dispute Process</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      To dispute a charge:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-300">
                      <li>Contact us within 30 days of the charge</li>
                      <li>Provide your account information and transaction details</li>
                      <li>Explain the nature of the dispute</li>
                      <li>Provide any supporting documentation</li>
                      <li>Allow up to 10 business days for investigation</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">6. Limited Exceptions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">6.1 Legal Requirements</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      We will provide refunds only when required by applicable law, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Consumer protection laws in your jurisdiction</li>
                      <li>Mandatory cooling-off periods</li>
                      <li>Warranty requirements</li>
                      <li>Unfair business practice regulations</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">6.2 Service Unavailability</h3>
                  <p className="text-gray-300">
                    In the unlikely event that our Service is permanently discontinued or becomes unavailable for extended periods (more than 30 consecutive days), we may, at our sole discretion, provide prorated refunds for the unused portion of active subscriptions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">6.3 Exceptional Circumstances</h3>
                  <p className="text-gray-300">
                    In exceptional circumstances, we may consider refund requests on a case-by-case basis. However, such consideration does not guarantee approval, and any refund remains at our sole discretion.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">7. Chargebacks and Payment Disputes</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">7.1 Chargeback Policy</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      Initiating a chargeback without first attempting to resolve the issue with us may result in:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Immediate suspension of your account and services</li>
                      <li>Termination of your subscription</li>
                      <li>Potential legal action to recover costs</li>
                      <li>Permanent ban from our services</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">7.2 Chargeback Defense</h3>
                  <div className="text-gray-300 space-y-4 leading-relaxed">
                    <p>
                      We will defend against chargebacks by providing:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Transaction records and receipts</li>
                      <li>Service delivery confirmation</li>
                      <li>Account usage logs</li>
                      <li>Terms of Service acceptance records</li>
                      <li>Communication history</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">7.3 Resolution Process</h3>
                  <p className="text-gray-300">
                    Before initiating a chargeback, please contact us at buildformeapp@gmail.com to discuss your concerns. We are committed to resolving disputes fairly and promptly.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">8. Contact Information</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  For questions about this Return & Refund Policy, billing disputes, or cancellation requests, please contact us at:
                </p>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p>Email: buildformeapp@gmail.com</p>
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

export default ReturnPolicy; 