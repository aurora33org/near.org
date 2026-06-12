import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";


const TOC = [
  "Definitions",
  "Eligibility",
  "Scope of the Services",
  "Use of the Services",
  "Accounts; Authorized Users",
  "Customer Obligations",
  "Suspension of Access to Services",
  "Third-Party Services",
  "Intellectual Property",
  "Subscriptions & Payment",
  "Confidential Information",
  "Data Privacy & Security",
  "Standard Virtual Machines",
  "Confidential Virtual Machines",
  "AI Agent Hosting and Inference",
  "AI Agent Software",
  "Representations & Warranties",
  "Disclaimers",
  "Indemnification",
  "Limitation of Liability",
  "Term & Termination",
  "Updates to these Terms",
  "Dispute Resolution; Governing Law",
  "Miscellaneous",
];

const DEFINITIONS = [
  ["Account", "Customer's account with NEAR AI associated with Customer's use of the Services."],
  ["Affiliate", "Any entity that directly or indirectly controls, is controlled by, or is under common control with a Party."],
  ["Acceptable Use Policy (or \"AUP\")", "The then-current acceptable use policy applicable to the Cloud Service located at: https://near.ai/acceptable-use-policy."],
  ["Agent Hosting", "The Service through which NEAR AI provisions and operates a multi-tenant compute infrastructure platform for the continuous execution of Customer-deployed AI Agents, together with integrated AI inference capabilities made available by NEAR AI as part of Standard Virtual Machine environments."],
  ["AI Agent", "Any software process deployed by or on behalf of Customer that is capable of independently initiating actions, making decisions, calling external APIs, initiating subordinate task processes, or executing multi-step tasks without per-action human authorization or review."],
  ["AI Agent Software", "Collectively, Third-Party AI Agent Software and IronClaw."],
  ["Authorized Account Users", "The employees, contractors, or vendors authorized by Customer to use the Services under the Customer's Account."],
  ["Authorized User", "Authorized Account Users and End Users."],
  ["Business Contact Information", "The business contact information of a Party (including, without limitation, business addresses, phone numbers, and email addresses, including a Party's contact persons' names used solely to facilitate the Parties' communications for administration of these Terms)."],
  ["Confidential Virtual Machine (or \"CVM\")", "A reserved, confidential compute environment utilizing hardware-based isolation and memory encryption technologies designed to allow Customers to run their workloads inside TEEs and reduce the risk of unauthorized access to data in use."],
  ["Customer Application", "Customer's applications, products or services in which Customer may integrate the Services, or host within the NEAR AI Cloud, as permitted by these Terms."],
  ["Customer Data", "Data provided to the Services by Customer and its Authorized Users, including Inputs; and data that Customer or Authorized Users derive or generate from that data through their use of the Services, including Outputs."],
  ["Deployment Type", "The configuration under which Customer workloads are executed on the Platform, which may include (a) deployment in a Standard VM (\"Standard VM Deployment\") or (b) deployment in a CVM (\"CVM Deployment\"), as specified in the applicable Order Form or user interface at the time of provisioning."],
  ["Documentation", "The user guides, technical specifications, API documentation, manuals, help files, and other written or electronic materials provided by NEAR AI that describe the features, functionality, operation, and use of the Services."],
  ["End Users", "The entities or individuals who are customers of Customer who have a written agreement with Customer and have access to the Services through a Customer Application and who have entered into an End User Agreement."],
  ["End User Agreement", "The legally binding terms and conditions between Customer and each End User governing the End User's access to and use of the Customer Application."],
  ["Input", "Any and all instructions, queries, visual or textual cues given by Customer or End Users to the Third-Party Generative AI Services in order to generate an Output."],
  ["Intellectual Property Rights", "Current and future worldwide rights under patent, copyright, trade secret, trademark, and moral rights laws, and other similar rights."],
  ["IronClaw", "The NEAR AI-developed open-source AI Agent offering, available at https://github.com/nearai/ironclaw."],
  ["NEAR AI Cloud", "A hosted confidential cloud computing platform that provides cloud-based AI services and infrastructure, including but not limited to AI model hosting and inference APIs running inside TEEs and CVMs."],
  ["NEAR AI Cloud API", "The OpenAI-compatible inference API that provides programmatic access to AI models hosted on NEAR AI Cloud. The NEAR AI Cloud API supports both open-source models (executed within TEE environments) and premium closed-source models (proxied to third-party providers via a shared NEAR AI API key, without TEE-based privacy or attestation)."],
  ["Order Form", "A transactional ordering document or confirmation information upon purchase of Usage Credits for Customer's purchase of Services, including an online registration page."],
  ["Order Term", "The duration for access to the Services specified in the Order Form, unless terminated earlier in accordance with these Terms."],
  ["Output", "Any and all content generated by the Third-Party Generative AI Services or IronClaw in response to Customer's or End User's Input."],
  ["Personal Data", "Has the meaning given such term in the Data Processing Agreement."],
  ["Protected Health Information (or \"PHI\")", "Individually identifiable health information that is protected under the Health Insurance Portability and Accountability Act of 1996 (\"HIPAA\") and its implementing regulations."],
  ["Standard Virtual Machine (or \"Standard VM\")", "A virtualized compute environment provisioned by NEAR AI through the Platform that provides dedicated processing, memory, and storage resources for the deployment and execution of Customer workloads, without the application of confidential computing protections such as hardware-based TEEs or memory encryption."],
  ["Third-Party AI Agent Software", "OpenClaw and any open-source or third-party alternatives thereto developed by a third party, but expressly excluding IronClaw."],
  ["Third-Party Channel Provider", "Any third-party messaging, communication or collaboration platform through which a Customer or its Authorized Users configures an AI Agent to send or receive Inputs or Outputs, including without limitation Slack, Telegram, Discord and WhatsApp."],
  ["Third-Party Generative AI Services", "The generative AI models obtained from third-party providers and made available to Customer through the Services."],
  ["Trusted Executive Environments (or \"TEEs\")", "A hardware-supported secure execution environment that provides isolation and memory protection for designated workloads, such that code and data processed within the TEE are protected from access by other applications, virtual machines, operating systems or infrastructure components, subject to inherent technical limitations."],
  ["Usage Credits", "The prepaid units for metered use of the Services that Customer may purchase on the Website."],
  ["Usage Data", "Operational and meta data collected by NEAR AI while providing the Services to Customer. For clarity, Usage Data excludes Customer Data."],
];

export default function TermsOfServicePage() {
  return (
    <div className="relative w-full font-sans bg-[#ECECEC] text-[#101010]">
      <div className="relative w-full flex flex-col">

        {/* ─── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[36vh] flex flex-col bg-gradient-to-b from-[#525252] from-[35%] to-[#ECECEC]">
          <div className="absolute inset-0 z-[1] bg-[#101010]/40 pointer-events-none" />
          <div className="relative z-10 flex flex-col flex-1 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <SiteHeader />
            <div className="flex flex-col flex-1 justify-end pb-12 lg:pb-16 pt-8">
              <h1 className="text-white font-medium leading-[1.05] tracking-tight" style={{ fontSize: "var(--font-size-h1)" }}>
                NEAR AI Services Terms of Service
              </h1>
              <p className="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.25em] text-white/50">
                Last Updated — May 18, 2026
              </p>
            </div>
          </div>
        </section>

        {/* ─── CONTENT ───────────────────────────────────────────────────────── */}
        <section className="bg-[#ECECEC] py-16 lg:py-24">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 lg:gap-24 items-start">

              {/* Sticky TOC */}
              <aside className="hidden lg:block sticky top-12">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted mb-6">Contents</p>
                <nav className="flex flex-col gap-2">
                  {TOC.map((item, i) => (
                    <a key={item} href={`#section-${i + 1}`} className="text-pretty text-muted hover:text-[#101010] transition-colors [font-size:var(--font-size-body)] leading-snug">
                      <span className="font-mono text-[0.7rem] mr-2 opacity-50">{i + 1}.</span>
                      {item}
                    </a>
                  ))}
                </nav>
              </aside>

              {/* Body */}
              <div className="flex flex-col gap-1 max-w-[860px]">

                {/* Intro */}
                <div className="mb-12 flex flex-col gap-4 text-muted leading-[1.8]" style={{ fontSize: "var(--font-size-body)" }}>
                  <p>Welcome to NEAR AI. These Terms of Service (the &ldquo;Terms&rdquo;) are a legally binding agreement between Jasnah, Inc. d/b/a NEAR AI (&ldquo;NEAR AI&rdquo;, &ldquo;we&rdquo;, or &ldquo;us&rdquo;) and the person or entity agreeing to the Terms (&ldquo;Customer&rdquo; or &ldquo;you&rdquo;). If you are agreeing to these Terms on behalf of an organization, &ldquo;Customer&rdquo; shall also mean that organization. These Terms govern your access to and use of the Agent Hosting platform, NEAR AI Cloud, including the NEAR AI Cloud API, and related developer services we make available (such products and services, the &ldquo;Services&rdquo;) on or through our websites currently located at https://near.ai/, https://cloud.near.ai/, and https://agent.near.ai (the &ldquo;NEAR AI Hosting Platform&rdquo;).</p>
                  <p>Please read these Terms carefully as they affect your legal rights. These Terms are effective on the earlier of when you click to accept the Terms and your first use of the Services (the &ldquo;Effective Date&rdquo;). By accepting these Terms, using the Services, or creating an Account, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our Services.</p>

                  {/* Mobile TOC */}
                  <div className="lg:hidden mt-4 border border-[#CAC8C8] rounded-2xl p-6 flex flex-col gap-2">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted mb-2">Contents</p>
                    {TOC.map((item, i) => (
                      <a key={item} href={`#section-${i + 1}`} className="text-pretty text-muted [font-size:var(--font-size-body)] leading-snug">
                        <span className="font-mono text-[0.7rem] mr-2 opacity-50">{i + 1}.</span>{item}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Section 1 */}
                <Section id="section-1" number="1" title="Definitions.">
                  <div className="flex flex-col gap-4">
                    {DEFINITIONS.map(([term, def]) => (
                      <p key={term}><strong>&ldquo;{term}&rdquo;</strong> means {def}</p>
                    ))}
                  </div>
                </Section>

                {/* Section 2 */}
                <Section id="section-2" number="2" title="Eligibility.">
                  <p>You may use the Services only if you can form a binding contract with NEAR AI, and only in compliance with these Terms and all applicable local, state, national, and international laws, rules and regulations. Any use or access to the Services by anyone under 18 is strictly prohibited. By registering for an Account, you represent and warrant that (i) you are at least 18 years of age, (ii) you will use the Services in accordance with these Terms and all applicable laws, (iii) if registering on behalf of a company or other entity, you are an authorized representative with authority to bind such entity, (iv) you are not located in, under the control of, or a national/resident of any country or region subject to comprehensive U.S. embargoes or sanctions (including Cuba, Iran, North Korea, Syria, or the Crimea, Donetsk, or Luhansk regions of Ukraine), (v) you are not identified on any U.S. government restricted party lists, and (vi) you are otherwise eligible to receive the Services under applicable laws, including U.S. export-control laws. We may require identity or compliance information (including &ldquo;know your customer&rdquo; checks) to verify eligibility.</p>
                </Section>

                {/* Section 3 */}
                <Section id="section-3" number="3" title="Scope of the Services.">
                  <p>These Terms, which incorporate by reference NEAR AI&apos;s Acceptable Use Policy, govern your use of the Services. The Services consist solely of NEAR AI&apos;s AI Agent framework(s) and related tooling made available by NEAR AI, and do not include any specific AI Agent configurations, instructions, parameters, behaviors, or Outputs configured, defined or deployed by you. You are solely responsible for configuring, operating and deploying any AI Agents using the Services. For the avoidance of doubt, the Services do not include (i) the Third-Party Generative AI Services that NEAR AI makes available through the NEAR AI Cloud API, or (ii) any third-party or custom-built agents, integrations, or models not expressly provided by NEAR AI as part of the Services.</p>
                </Section>

                {/* Section 4 */}
                <Section id="section-4" number="4" title="Use of the Services.">
                  <SubSection number="4.1" title="Use of Services.">
                    <p>During the Term, NEAR AI will make the Services available to Customer in accordance with these Terms, the Documentation, and any applicable Order Form(s). Subject to the terms and conditions herein, Customer may use the Services to (i) generate Outputs based on its Inputs through Third-Party Generative AI Models made available within the NEAR AI Cloud, and (ii) make the Services available to its End Users as integrated into or through the Customer Application.</p>
                  </SubSection>
                  <SubSection number="4.2" title="Use Restrictions.">
                    <p>Customer will only use the Services for its legitimate purposes in accordance with these Terms, including the AUP. Customer will not:</p>
                    <ul>
                      <li>(i) use, copy, modify or otherwise prepare derivative works of the Services, unless expressly authorized;</li>
                      <li>(ii) use the Services to develop any product or artificial intelligence model that competes with the Services or any Third-Party Generative AI Services;</li>
                      <li>(iii) reverse engineer, disassemble, alter or decompile the Services;</li>
                      <li>(iv) interfere with or disrupt the Services, bypass or disable rate limits, security, or attestation/verification mechanisms;</li>
                      <li>(v) automatically or programmatically extract data and/or outputs, except via published NEAR AI Cloud APIs under applicable rate limits;</li>
                      <li>(vi) misrepresent AI-generated content as human-created;</li>
                      <li>(vii) use Outputs to develop or train competing AI models, unless expressly permitted in a separate written agreement;</li>
                      <li>(viii) run cryptocurrency mining, proof-of-work/stake computations, or similar high-risk workloads without prior written authorization;</li>
                      <li>(ix) use free-tier resources as a proxy/VPN or for workloads earning third-party financial rewards;</li>
                      <li>(x) sell, resell, sublicense, transfer, or distribute any or all of the Services;</li>
                      <li>(xi) use the Services to create, collect, transmit, store, use, or process any data that violates any applicable laws, or infringes any third party&apos;s intellectual property or other rights;</li>
                      <li>(xii) use the Services in violation of any Trade Restrictions;</li>
                      <li>(xiii) remove any copyright, trademark, proprietary rights, disclaimer, or warning notice;</li>
                      <li>(xiv) use the Services or any Output in violation of the AUP; or</li>
                      <li>(xv) transmit, store, or process Protected Health Information except as permitted by an executed Business Associate Agreement.</li>
                    </ul>
                  </SubSection>
                  <SubSection number="4.3" title="API Usage.">
                    <p>Customer shall not exceed the API usage limits, quotas, or thresholds set forth in the applicable Order Form, Documentation, or otherwise communicated by NEAR AI. Any use beyond such limits may result in account throttling, suspension, or additional fees, at NEAR AI&apos;s discretion.</p>
                  </SubSection>
                  <SubSection number="4.4" title="Virtual Machine Deployment.">
                    <p>The Services support multiple Deployment Types, including: (a) Standard VM Deployment, governed by Section 13, or (b) CVM Deployment, governed by Section 14, which may be offered as a Dedicated CVM or Shared CVM Instance. The applicable Deployment Type will be identified at the time of provisioning or in the Order Form. A change in Deployment Type constitutes a material change to the Services and may require Customer action or an amendment to the applicable Order Form.</p>
                  </SubSection>
                  <SubSection number="4.5" title="Updates to the Services.">
                    <p>NEAR AI may make changes to the Services from time to time, including by adding or removing features, increasing or decreasing capacity limits, offering new services or discontinuing certain services. Except to the extent that Customer has prepaid for certain Services, NEAR AI will not be liable for any change to or any suspension or discontinuation of the Services.</p>
                  </SubSection>
                  <SubSection number="4.6" title="Beta Services.">
                    <p>From time to time, NEAR AI may make available to Customer services or functionality designated as alpha, beta, pilot, preview, or similar (&ldquo;Beta Services&rdquo;). Beta Services are not considered &ldquo;Services&rdquo; under these Terms and are provided solely on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without any warranty of any kind. YOU ASSUME ALL RISKS AND COSTS ASSOCIATED WITH YOUR USE OF THE BETA SERVICES.</p>
                  </SubSection>
                  <SubSection number="4.7" title="Usage Data.">
                    <p>Customer acknowledges that NEAR AI uses Usage Data (excluding Customer Content or Personal Data) for legitimate business purposes related to the ongoing operation, development, security and improvement of the Services. NEAR AI will not disclose Usage Data externally except in de-identified and/or aggregated form that does not reasonably identify Customer.</p>
                  </SubSection>
                </Section>

                {/* Section 5 */}
                <Section id="section-5" number="5" title="Accounts; Authorized Users.">
                  <SubSection number="5.1" title="Accounts.">
                    <p>Customer must create an Account to use the Services and is responsible for the information it provides, the security of its passwords (including any keys for the NEAR AI Cloud API), and for any use of its Account. Customer is responsible for all activity that occurs under its Account, and shall immediately notify NEAR AI upon becoming aware of any unauthorized access to, or security breach involving, its login credentials or Account.</p>
                  </SubSection>
                  <SubSection number="5.2" title="Authorized Users.">
                    <p>Only Customer&apos;s Authorized Users may access and use the Services, provided that (i) End Users may only access the Services through the Customer Application, and (ii) only Authorized Account Users may access the Services through the Customer&apos;s Account. Customer is responsible for the compliance with the terms of these Terms by its Authorized Account Users and for compliance of the End User Agreement by the End Users.</p>
                  </SubSection>
                </Section>

                {/* Section 6 */}
                <Section id="section-6" number="6" title="Customer Obligations.">
                  <SubSection number="6.1" title="Compliance.">
                    <p>Customer will (a) ensure that Customer&apos;s and its Authorized Users&apos; use of the Services complies with these Terms, (b) ensure End Users enter into an End User Agreement and terminate access for any End User that violates the terms thereof, (c) use commercially reasonable efforts to prevent and terminate any unauthorized use of, or access to, the Services, and (d) immediately notify NEAR AI of any unauthorized use of, or access to, the Services or Account.</p>
                  </SubSection>
                  <SubSection number="6.2" title="Input.">
                    <p>Customer is responsible for all Input it and its End Users submit to the Services. By submitting Input, Customer represents and warrants that it has all rights, licenses, and permissions necessary for NEAR AI to process the Input under these Terms, and that any Input submitted will not violate these Terms, NEAR AI&apos;s Acceptable Use Policy, or any applicable laws or regulations.</p>
                  </SubSection>
                  <SubSection number="6.3" title="Output.">
                    <p>Customer is responsible for all Output it creates. Subject to your compliance with these Terms, we assign you all of our right, title and interest, if any, in and to Outputs. Where required by law or regulation, you must disclose that Output was AI-generated and comply with applicable transparency obligations (e.g., EU AI Act, FTC guidance).</p>
                  </SubSection>
                </Section>

                {/* Section 7 */}
                <Section id="section-7" number="7" title="Suspension of Access to Services.">
                  <SubSection number="7.1" title="Violations of Use Restrictions and AUP.">
                    <p>If NEAR AI becomes aware that Customer&apos;s or Customer&apos;s End Users&apos; use of the Services violates Section 4.2 (Use Restrictions) or the Acceptable Use Policy, then NEAR AI may suspend all or part of Customer&apos;s use of the Services until the violation is corrected.</p>
                  </SubSection>
                  <SubSection number="7.2" title="Other Suspensions.">
                    <p>NEAR AI may also suspend all or part of Customer&apos;s use of the Services without prior notice if (a) suspension is needed to protect the Services, NEAR AI&apos;s infrastructure, or any other customer; (b) there is suspected unauthorized third-party access to the Services; (c) immediate suspension is required to comply with any applicable law; or (d) Customer or its Authorized Users are in breach of Section 4.2. NEAR AI will reinstate Customer&apos;s access when the circumstances giving rise to the suspension have been resolved.</p>
                  </SubSection>
                </Section>

                {/* Section 8 */}
                <Section id="section-8" number="8" title="Third-Party Services.">
                  <p>The Services may contain links to or integrations with third-party websites, platforms, applications, or services (&ldquo;Third-Party Services&rdquo;) that are subject to different terms and privacy practices. NEAR AI does not own or control Third-Party Services and is not responsible or liable for any aspect of such Third-Party Services.</p>
                  <p>Furthermore, Customer acknowledges and agrees that its use of and access to the Third-Party Generative AI Services made available to Customer with the Services are subject to terms and conditions specified by the third-party owners of such generative AI services, and that it will abide by such terms and conditions at all times.</p>
                </Section>

                {/* Section 9 */}
                <Section id="section-9" number="9" title="Intellectual Property.">
                  <SubSection number="9.1" title="Services.">
                    <p>The Services, and all materials contained therein, and all Intellectual Property Rights related thereto are the exclusive property of NEAR AI and its licensors. NEAR AI reserves all rights not expressly granted herein.</p>
                  </SubSection>
                  <SubSection number="9.2" title="Customer Data.">
                    <p>As between Customer and NEAR AI, Customer retains all right, title, and interest in and to Customer Data, including Inputs and Output. Customer grants NEAR AI a limited license in Customer Data solely for the purpose of providing the Services. NEAR AI will not use Customer Data to train any generative AI models. NEAR AI also maintains written agreements with the providers of the Third-Party Generative AI Services prohibiting third parties from using Customer Data to train their AI models.</p>
                  </SubSection>
                  <SubSection number="9.3" title="Feedback.">
                    <p>At its option, Customer may provide feedback or suggestions about the Services to NEAR AI. If Customer provides Feedback, then NEAR AI may use such Feedback without restriction and without obligation to Customer.</p>
                  </SubSection>
                </Section>

                {/* Section 10 */}
                <Section id="section-10" number="10" title="Subscriptions & Payment.">
                  <SubSection number="10.1" title="Usage Credits; Self-Serve.">
                    <p>Customer may access certain Services by purchasing prepaid usage credits (&ldquo;Usage Credits&rdquo;) that are consumed based on metered usage at the rates specified on the applicable NEAR AI Websites. Usage Credits are non-transferable, non-refundable, and may expire as stated at the time of purchase.</p>
                  </SubSection>
                  <SubSection number="10.2" title="Subscription Plans.">
                    <p>We may offer one or more subscription plans, each with different available features, functionalities or length of subscription. The fees for each Plan are as set forth on our Websites. We reserve the right to change our available Plans, or the fees for a Plan, at any time provided that such changes will only apply on a go-forward basis to any renewal of your subscription.</p>
                  </SubSection>
                  <SubSection number="10.3" title="Recurring Billing.">
                    <p>By enrolling in one of our automatically renewing Plans, you authorize us and/or our third-party payment processor to charge your credit card at the beginning of your subscription term, and on a recurring basis. Your Plan will continue for the period of time of the subscription period that you selected and will automatically renew until terminated. You must cancel your Plan before it renews in order to avoid billing of the subscription fees for the next billing cycle.</p>
                    <p>We may receive updated credit card information (new credit card number or updated expiration date) from your credit card issuer. We may use these new details to help prevent any interruption to your subscription. If you would like to use a different payment method or if there is a change in payment method, please visit the settings area of your account to update your billing information. If any subscription fee is not paid in a timely manner, or your transaction cannot be processed, we reserve the right to suspend, disable, cancel or terminate your access to the Services or cancel your subscription. You will be responsible for paying all past due amounts. Some credit card issuers may charge you certain fees, such as foreign transaction fees or other fees relating to the processing of your credit card. Check with your credit card provider for details. If your credit card cannot be processed for some reason, we may contact you via auto-generated email, text, or phone if you are opted-in to receive such forms of communication.</p>
                  </SubSection>
                  <SubSection number="10.4" title="Cancellation.">
                    <p>When you cancel a subscription, you cancel only future charges associated with your subscription. In order to avoid future charges, you must cancel your subscription at least 24 hours prior to the end of your current subscription period. To cancel, please use the cancellation functions in your Customer Account or contact us at <a href="/mailto:hello@near.ai" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">hello@near.ai</a>.</p>
                  </SubSection>
                  <SubSection number="10.5" title="No Refunds.">
                    <p className="uppercase text-sm leading-relaxed">All payments (including subscription fees, overage charges, and amounts paid for usage credits) are nonrefundable and not redeemable for cash, in whole or in part. For clarity, usage credits are nonrefundable. We reserve the right to issue refunds, credits, or discounts at our sole discretion.</p>
                    <p>If you cancel your subscription, you will not receive any refund and you will continue to have access to your Plan through the end of the subscription period. We reserve the right to issue refunds, credits, or discounts at our sole discretion. If we issue a refund, credit, or discount, we are under no obligation to issue the same or similar refund in the future and we may terminate your Plan and access to the Services.</p>
                  </SubSection>
                  <SubSection number="10.6" title="Free Trials & Promotions.">
                    <p>We may offer promotional trial subscriptions for free or at special discounted prices. If you sign up for a trial subscription, your rights to use the applicable portion of the Service are limited by the terms of such trial and will terminate or renew according to the terms of your trial arrangement.</p>
                  </SubSection>
                </Section>

                {/* Section 11 */}
                <Section id="section-11" number="11" title="Confidential Information.">
                  <SubSection number="11.1" title="Definition.">
                    <p>&ldquo;Confidential Information&rdquo; means information that one Party (or an Affiliate) discloses to the other Party under or in connection with these Terms, and which is marked as confidential or, under the circumstances surrounding the disclosure, would reasonably be considered confidential. Confidential Information does not include information that is independently developed by the Recipient, is rightfully given to the Recipient by a third party without confidentiality obligations or becomes public through no fault of the Recipient. Customer Data is considered Customer&apos;s Confidential Information.</p>
                  </SubSection>
                  <SubSection number="11.2" title="Obligations.">
                    <p>The Recipient will only use the Discloser&apos;s Confidential Information to exercise the Recipient&apos;s rights and fulfill its obligations under these Terms and will use reasonable care to protect against the disclosure of the Discloser&apos;s Confidential Information. The Recipient may disclose Confidential Information only to its Representatives who need to know it and who have agreed in writing to keep it confidential.</p>
                  </SubSection>
                  <SubSection number="11.3" title="Required Disclosure.">
                    <p>In the event that Recipient is required to disclose Confidential Information to comply with legal process or valid order of a court of competent jurisdiction, the recipient shall (a) notify the Discloser prior to making such disclosure to permit Discloser to seek confidential treatment, and (b) disclose only that portion of Discloser&apos;s Confidential Information that is legally required to be disclosed.</p>
                  </SubSection>
                </Section>

                {/* Section 12 */}
                <Section id="section-12" number="12" title="Data Privacy & Security.">
                  <SubSection number="12.1" title="Data Privacy.">
                    <p>NEAR AI will process any Personal Data contained in Business Contact Information in accordance with NEAR AI&apos;s <a href="/privacy-policy" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">Privacy Policy</a>; and to the extent NEAR processes any Personal Data contained in the Customer Data, it will do so in accordance with the <a href="/near-ai-data-processing-agreement-for-customers" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">Data Processing Agreement</a> which is incorporated by reference herein.</p>
                  </SubSection>
                  <SubSection number="12.2" title="Security.">
                    <p>NEAR has implemented and will maintain technical, organizational, and physical measures consistent with recognized industry standards and practices designed to ensure the confidentiality, integrity and availability of Customer Data.</p>
                  </SubSection>
                </Section>

                {/* Section 13 */}
                <Section id="section-13" number="13" title="Standard Virtual Machines.">
                  <SubSection number="13.1" title="Scope.">
                    <p>This Section 13 solely applies to Services deployed using Standard VM Deployment.</p>
                  </SubSection>
                  <SubSection number="13.2" title="Nature of Standard VM Deployment.">
                    <p>Standard VM Deployment provides a virtualized compute environment without hardware-based TEEs, memory encryption or equivalent confidential computing protections.</p>
                  </SubSection>
                  <SubSection number="13.3" title="NEAR AI Access and Observability.">
                    <p>In Standard VM environments, NEAR AI may have access to Customer workloads and associated data, including without limitation: (i) prompts, Inputs, and Outputs; (ii) application data and files stored within the environment; (iii) logs, telemetry, and execution metadata; (iv) API calls, connectors, and external interactions; and (v) credentials, tokens, and keys stored or used within the environment. NEAR AI&apos;s access shall be solely for the purposes of (a) providing, maintaining and securing the Services, (b) debugging, diagnostics and technical support, (c) performance optimization and system improvement; and (d) enforcing these Terms.</p>
                  </SubSection>
                  <SubSection number="13.4" title="No Model Training.">
                    <p>NEAR AI will not use Customer Data from Standard VM environments for training or fine-tuning machine learning models, except as expressly agreed.</p>
                  </SubSection>
                  <SubSection number="13.5" title="Customer Responsibility for Security Configuration.">
                    <p>Customer is responsible for implementing appropriate safeguards within Standard VM environments, including encryption, credential management, and access controls. Customer acknowledges that Standard VM environments do not provide the hardware-level isolation guarantees of CVMs.</p>
                  </SubSection>
                  <SubSection number="13.6" title="Shared Responsibility Model.">
                    <p>NEAR AI is responsible for the underlying infrastructure, including virtualization, networking and physical security. Customer is responsible for workload-level security, including applications, data handling, identity management and credential usage.</p>
                  </SubSection>
                  <SubSection number="13.7" title="No Confidential Compute Guarantees.">
                    <p>NEAR AI makes no representation that Standard VM Deployments provide protection against access to data in use, memory inspection or similar risks addressed by confidential computing technologies.</p>
                  </SubSection>
                  <SubSection number="13.8" title="Data Handling and Visibility">
                    <p>Customer acknowledges that NEAR AI&apos;s operational access to Standard VM environments may result in the access to and processing of Customer Data as necessary to provide the Services, subject to these Terms and its applicable privacy obligations herein.</p>
                  </SubSection>
                </Section>

                {/* Section 14 */}
                <Section id="section-14" number="14" title="Confidential Virtual Machines.">
                  <SubSection number="14.1" title="Scope.">
                    <p>This Section 14 applies solely to Services deployed using Confidential Virtual Machines (CVMs).</p>
                  </SubSection>
                  <SubSection number="14.2" title="CVM Deployment Offerings.">
                    <p>NEAR AI offers CVM-based deployment in two distinct configurations: (i) <strong>Dedicated CVM</strong> — a CVM deployment in which Customer is allocated an entire physical hardware stack, reserved exclusively for Customer&apos;s workloads, with no co-tenancy at the hardware level; and (ii) <strong>Shared CVM Instance</strong> — a logically isolated CVM instance deployed within a physical hardware environment shared among multiple customers, with isolation enforced through hardware-based memory encryption and TEE partitioning.</p>
                  </SubSection>
                  <SubSection number="14.3" title="Availability.">
                    <p>NEAR AI does not warrant that CVM-based deployment will be available in all regions, configurations or service tiers, and reserves the right to modify, suspend or discontinue CVM availability upon reasonable notice to Customer.</p>
                  </SubSection>
                  <SubSection number="14.4" title="Attestation.">
                    <p>&ldquo;Attestation&rdquo; means the cryptographic process by which the integrity and configuration of a CVM environment can be verified by Customer prior to submitting workloads. Customer is solely responsible for independently verifying Attestation prior to submitting sensitive workloads to a CVM. NEAR AI makes no representation that Attestation reports constitute a warranty that the underlying hardware is free of undisclosed vulnerabilities.</p>
                    <p><strong>14.4.1 Dedicated CVMs.</strong> Attestation covers the integrity and configuration of the entire allocated hardware stack and its TEE.</p>
                    <p><strong>14.4.2 Shared CVM Instances.</strong> Attestation verifies the integrity and configuration of Customer&apos;s logical instance and its TEE partition only. Attestation does not extend to verifying the absence of co-tenant workloads on the underlying shared physical hardware.</p>
                  </SubSection>
                  <SubSection number="14.5" title="Shared Responsibility.">
                    <p>Customer is solely responsible for securely configuring workloads, encryption, managing cryptographic keys used within the TEE (including generating, rotating, safeguarding and, upon termination, destroying such keys), identity and access controls, and secure application design within CVM environments. NEAR AI does not have access to cryptographic keys managed by Customer within the TEE and accordingly cannot recover Customer workloads, data or configurations in the event of Customer&apos;s loss or destruction of such keys.</p>
                  </SubSection>
                  <SubSection number="14.6" title="NEAR AI Access Limitations.">
                    <p>Consistent with the design of CVM environments, NEAR AI does not have access to the contents of Customer workloads, memory or data processed within a running TEE during normal operations. Customer acknowledges that this architectural limitation may affect NEAR AI&apos;s ability to provide technical support, perform diagnostics or respond to incidents.</p>
                    <p className="uppercase text-sm leading-relaxed">The use of a CVM does not grant customer, and customer hereby expressly waives, any right of physical access to, or physical possession of, any NEAR AI servers, hardware, equipment, or other assets. Designation of a deployment as a &ldquo;dedicated CVM&rdquo; refers exclusively to the logical and hardware-level isolation of customer&apos;s allocated resources and does not confer any proprietary, possessory, or access right in or to the underlying physical infrastructure.</p>
                  </SubSection>
                  <SubSection number="14.7" title="Customer Acknowledgements.">
                    <p>Customer acknowledges that CVMs and TEEs are intended to reduce the risk of unauthorized access, but do not eliminate all security risks. In particular, Customer acknowledges that (i) hardware-level vulnerabilities, including side-channel attacks, firmware weaknesses, and microcode deficiencies may exist; (ii) the security properties of CVMs depend in part on the integrity of hardware manufacturer attestation infrastructure outside of NEAR AI&apos;s control; (iii) the protections afforded by TEEs are subject to inherent technical limitations; and (iv) with respect to Shared CVM Instances, side-channel vulnerabilities or other advanced hardware-level attack vectors may theoretically exploit the shared physical environment.</p>
                  </SubSection>
                  <SubSection number="14.8" title="Disclaimers.">
                    <p>NEAR AI makes no representations or warranties that the use of CVMs will prevent all unauthorized access, hardware-level vulnerabilities, side-channel attacks or other advanced threats. Customer&apos;s compliance with applicable regulatory obligations remains solely Customer&apos;s responsibility.</p>
                  </SubSection>
                  <SubSection number="14.9" title="Termination and Data Destruction.">
                    <p>Upon expiration or termination of CVM-based Services, NEAR AI will decommission the applicable CVM environments in accordance with its standard decommissioning processes. Where Customer manages the cryptographic keys within the TEE, Customer&apos;s deletion of those keys constitutes Customer&apos;s primary mechanism for rendering associated data irrecoverable.</p>
                    <p><strong>14.9.1 Dedicated CVMs.</strong> NEAR AI&apos;s decommissioning procedures for Dedicated CVMs are designed to render encrypted CVM memory, storage, and host-level data irrecoverable across the entire allocated physical hardware stack.</p>
                    <p><strong>14.9.2 Shared CVM Instances.</strong> NEAR AI&apos;s decommissioning procedures for Shared CVM Instances are designed to render the logical instance and its encrypted TEE partition irrecoverable. Customer&apos;s deletion of its cryptographic keys is the primary mechanism for rendering data within the TEE irrecoverable.</p>
                  </SubSection>
                </Section>

                {/* Section 15 */}
                <Section id="section-15" number="15" title="AI Agent Hosting and Inference.">
                  <SubSection number="15.1" title="Default Inference Routing (Agent Hosting).">
                    <p>For Agent Hosting deployments, inference requests are by default processed using NEAR AI-operated AI models within NEAR AI infrastructure, and Customer Data does not leave NEAR AI-controlled systems in this default configuration, except where (i) Customer or its Authorized Users select or enable third-party models or inference routing providers, (ii) a Customer routes inference requests through its own third-party API keys, or (iii) Customer or its Authorized Users configure Third-Party Channel Integrations.</p>
                  </SubSection>
                  <SubSection number="15.2" title="Bring Your Own Model; API Keys.">
                    <p>Customer may configure AI Agents to use third-party AI models via Customer-provided API keys or credentials. In such cases: (i) inference requests are sent directly from Customer&apos;s AI Agent to the third-party model provider; (ii) NEAR AI does not process, route or transmit such requests; and (iii) Customer is solely responsible for compliance with the third-party model provider&apos;s terms and policies. NEAR AI disclaims all responsibility and liability for third-party inference services accessed in the foregoing manner.</p>
                  </SubSection>
                  <SubSection number="15.3" title="Third-Party Channel Integrations.">
                    <p>Customer or its Authorized Users may configure AI Agents to transmit Customer Data via third-party messaging and communication platforms including Slack, Telegram, Discord and WhatsApp (&ldquo;Channel Integrations&rdquo;). In such cases: (i) Customer Data, including Input and Output, is transmitted directly to the relevant Third-Party Channel Providers; (ii) NEAR AI does not control, filter or process Customer Data once transmitted to such Third-Party Channel Providers; and (iii) Customer is solely responsible for compliance with the applicable Third-Party Channel Provider&apos;s terms and policies. Such Third-Party Channel Providers are not deemed sub-processors of NEAR AI by virtue of such integrations.</p>
                  </SubSection>
                  <SubSection number="15.4" title="Agentic Operations and Third-Party Service Interactions.">
                    <p>NEAR AI may enable AI Agents to interact with third-party services, APIs, and other external systems using credentials, tokens, keys, or other authentication materials provided or authorized by Customer (&ldquo;Customer-Provided Credentials&rdquo;). Customer is solely responsible for (i) the security, scoping, rotation, and revocation of such Customer-Provided Credentials, and (ii) compliance with the applicable third party&apos;s terms, policies, and applicable laws. NEAR AI does not control, and is not responsible for, the third party&apos;s processing of Customer Data after such data is transmitted to that third party.</p>
                  </SubSection>
                  <SubSection number="15.5" title="No Training Use.">
                    <p>NEAR AI does not use Customer Data from AI Agent Hosting environments to train or fine-tune machine learning models, unless expressly agreed to in writing.</p>
                  </SubSection>
                  <SubSection number="15.6" title="Deployment Type Differences.">
                    <p>Customer acknowledges that data visibility, access, and security characteristics differ materially between Standard VM Deployment and CVM Deployment, as described in Sections 13 and 14, respectively.</p>
                  </SubSection>
                </Section>

                {/* Section 16 */}
                <Section id="section-16" number="16" title="AI Agent Software.">
                  <SubSection number="16.1" title="Scope.">
                    <p>This Section 16 applies to all AI Agent Software deployed by Customer within the NEAR AI Hosting Platform.</p>
                  </SubSection>
                  <SubSection number="16.2" title="Customer Responsibility for AI Agent Conduct.">
                    <p>Customer is solely and exclusively responsible for all actions taken by any AI Agent deployed under Customer&apos;s Account, regardless of whether such actions were explicitly authorized, foreseeable or intended by Customer. Without limiting the foregoing, Customer shall be responsible for:</p>
                    <ul>
                      <li><strong>16.2.1</strong> all actions taken by sub-agents, delegated processes, or additional agent instances initiated by an AI Agent originally deployed by Customer;</li>
                      <li><strong>16.2.2</strong> all effects and results of AI Agent actions, including API calls and use of other connectors, data submissions, communications, content generation, financial transactions, and any other actions taken by an AI Agent;</li>
                      <li><strong>16.2.3</strong> ensuring that each AI Agent is configured with appropriate scope limitations, permission boundaries, and intervention mechanisms prior to deployment; and</li>
                      <li><strong>16.2.4</strong> implementing and maintaining human oversight mechanisms sufficient to monitor AI Agent behavior, detect anomalous or unintended actions, and intervene where necessary.</li>
                    </ul>
                  </SubSection>
                  <SubSection number="16.3" title="Deployment Type and NEAR AI Visibility.">
                    <p>The scope of NEAR AI&apos;s visibility into AI Agent behavior depends on the applicable Deployment Type.</p>
                    <p><strong>16.3.1 AI Agents in Standard VM Environments.</strong> NEAR AI may have visibility into and access to AI Agent behavior, including prompts, Outputs, logs and interactions, for the purposes described in Section 13.3. Notwithstanding such access, NEAR AI does not assume responsibility for monitoring, controlling or intervening in AI Agent behavior, and Customer remains solely responsible for AI Agent configurations, actions and outcomes.</p>
                    <p><strong>16.3.2 AI Agents in CVM Environments.</strong> Where Customer deploys AI Agents within its CVM, NEAR AI has limited or no ability to observe, access, audit, log, intervene in, or otherwise monitor AI Agent behavior within the TEE. Customer expressly acknowledges that (i) NEAR AI cannot detect or prevent unauthorized, anomalous, or harmful AI Agent behavior occurring within a CVM in real time; (ii) NEAR AI cannot recover, reconstruct, or provide access to any AI Agent outputs, decisions, logs, or processed data generated within a CVM; and (iii) NEAR AI cannot provide any audit trail, activity log, or compliance record of AI Agent actions occurring within a CVM.</p>
                  </SubSection>
                  <SubSection number="16.4" title="Persistent Compute Lifecycle.">
                    <p>AI Agents deployed on the NEAR AI Cloud may operate as persistent compute processes across extended periods. Customer acknowledges and agrees:</p>
                    <ul>
                      <li><strong>16.4.1 No Backup.</strong> NEAR AI does not provide backup services for AI Agent processes or in-enclave AI Agent state. Customer is solely responsible for implementing any state persistence, checkpointing, or recovery mechanisms.</li>
                      <li><strong>16.4.2 Suspension.</strong> NEAR AI may suspend a CVM instance hosting an AI Agent for maintenance, resource management, or operational reasons. Suspension may interrupt AI Agent execution mid-task.</li>
                      <li><strong>16.4.3 Termination.</strong> Upon termination of Customer&apos;s CVM-based Services, all AI Agent processes operating within the CVM will be terminated. NEAR AI shall have no responsibility for the consequences of mid-task AI Agent termination.</li>
                      <li><strong>16.4.4 No Recovery of In-TEE State.</strong> NEAR AI cannot access, recover, or reconstruct any AI Agent state, memory, task history, or processed data that existed within a TEE at the time of suspension or termination.</li>
                      <li><strong>16.4.5 Backup and Recovery for Non-Confidential Environments.</strong> For AI Agent deployments in Standard VM environments, NEAR AI may maintain encrypted backup copies of AI Agent state for recovery purposes. Such backup data is encrypted using Customer-provided keys, and any decryption occurs only within the applicable execution environment.</li>
                    </ul>
                  </SubSection>
                  <SubSection number="16.5" title="AI Agent Credentials.">
                    <p>Customer is solely responsible for all AI Agent Credentials stored within or provided to any AI Agent operating within Customer&apos;s CVM environment, including the security, appropriate scoping, rotation and revocation thereof, and for all actions taken by an AI Agent using such credentials. In the event that AI Agent Credentials are compromised or misused, Customer shall have sole responsibility for all resulting losses, damages, and third-party claims.</p>
                  </SubSection>
                  <SubSection number="16.6" title="Third-Party AI Agent Software Disclaimer.">
                    <p>NEAR AI is not the developer, maintainer, licensor, or distributor of any Third-Party AI Agent Software. NEAR AI makes no representation or warranty of any kind with respect to any Third-Party Agent Software. Customer is solely responsible for evaluating, testing and validating any Third-Party AI Agent Software prior to deployment. NEAR AI disclaims any and all liability for any loss, damage or claim arising from Third-Party Agent Software.</p>
                  </SubSection>
                  <SubSection number="16.7" title="IronClaw Framework.">
                    <p>Customer acknowledges that the IronClaw framework is open source software made available under a dual MIT/Apache-2.0 license (the &ldquo;IronClaw License&rdquo;) and agrees to abide by the IronClaw License in its use of IronClaw. NEAR AI&apos;s rights, obligations, and liability with respect to IronClaw&apos;s source code, framework architecture, and inherent functionality are governed exclusively by the IronClaw License. NEAR AI makes no representation or warranty as to the suitability of IronClaw&apos;s source code or inherent framework design for any particular deployment configuration, use case, or integration.</p>
                  </SubSection>
                  <SubSection number="16.8" title="AI Agent Indemnification.">
                    <p>In addition to any other indemnification obligations set forth in these Terms, to the extent Customer deploys an AI Agent in connection with its use of the Services, Customer agrees to defend, indemnify and hold harmless NEAR AI from and against any and all Losses arising out of or relating to (a) any action taken by an AI Agent deployed under Customer&apos;s Account; (b) any misuse, unauthorized use, compromise, or excessive use of AI Agent Credentials; (c) any failure by Customer to comply with the terms of any API provider in connection with AI Agent-driven API usage; (d) any claim by a data subject, regulatory authority, or third party arising from AI Agent-driven data processing; and (e) an allegation that content generated by an AI Agent infringes upon a third party&apos;s Intellectual Property Rights.</p>
                  </SubSection>
                  <SubSection number="" title="AI Agent-Specific Prohibited Uses.">
                    <p>Without limiting Section 4.2 and the AUP, the following uses of AI Agents are prohibited. Customer shall not deploy, operate or permit the operation of any AI Agent that: (a) operates without adequate human oversight; (b) engages in unlawful or harmful automated interactions with third parties; (c) evades external monitoring capabilities or bypasses safety controls; (d) processes personal data unlawfully or generates content that violates NEAR AI&apos;s AUP; or (e) provides advice or determinations in regulated domains (e.g., medical diagnoses, legal advice, financial advice) without legally-required authorizations, licenses and human oversight mechanisms.</p>
                  </SubSection>
                </Section>

                {/* Section 17 */}
                <Section id="section-17" number="17" title="Representations & Warranties.">
                  <SubSection number="17.1" title="Mutual Representations & Warranties.">
                    <p>Each Party represents and warrants that (a) it has full power and authority to enter into these Terms, and (b) it will comply with all laws applicable to its obligations under these Terms.</p>
                  </SubSection>
                  <SubSection number="17.2" title="Customer Representations & Warranties.">
                    <p>Customer represents and warrants that (a) it has obtained all necessary rights, licenses and consents to use, host and deploy any Customer Application; (b) it has obtained all rights, licenses, consents, and authorizations required by applicable law to allow Customer to upload, use, transmit and grant NEAR AI the rights to access, use and process Customer Data; (c) its use of the Services will comply with all applicable laws, regulations and NEAR AI&apos;s Acceptable Use Policy; (d) it will not permit any Authorized User to use the Services in connection with unlawful, obscene, deceptive, defamatory, harassing, discriminatory or otherwise violate applicable law; and (e) it is solely responsible for reviewing, evaluating, and determining the appropriateness of any Outputs.</p>
                  </SubSection>
                  <SubSection number="17.3" title="Limited NEAR AI Warranty.">
                    <p>NEAR AI warrants that the Services will substantially comply with any applicable Documentation. In the event of a breach of the foregoing warranty, Customer&apos;s exclusive remedy will be for NEAR AI to use commercially reasonable efforts to provide an error-correction or work-around within a reasonable time after such nonconformity is identified and reported by Customer.</p>
                  </SubSection>
                </Section>

                {/* Section 18 */}
                <Section id="section-18" number="18" title="Disclaimers.">
                  <p className="uppercase text-sm leading-relaxed">Except as expressly provided for in these Terms, NEAR AI makes no warranty and expressly disclaims, to the fullest extent permitted by applicable law any warranties of any kind, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular use, title, noninfringement, or uninterrupted or error-free operation of the Services.</p>
                  <p className="uppercase text-sm leading-relaxed">To the maximum extent permitted by law, NEAR AI disclaims all liability arising from or related to Customer Applications, Third-Party Generative AI Services, and any Outputs generated by Third-Party Generative AI Services. Customer acknowledges that (a) Outputs may be inaccurate, incomplete, misleading, offensive, or otherwise unsuitable for any particular purpose; (b) NEAR does not warrant the accuracy, reliability, quality, or suitability of any Outputs; and (c) Customer uses the Services, Customer Applications, Third-Party Generative AI Services and Outputs at its own risk.</p>
                </Section>

                {/* Section 19 */}
                <Section id="section-19" number="19" title="Indemnification.">
                  <SubSection number="19.1" title="By NEAR AI.">
                    <p>NEAR AI will defend, indemnify and hold harmless Customer, its Affiliates, and its employees, officers and directors (&ldquo;Customer Indemnitee&rdquo;) from and against any and all Losses arising out of or relating to any Claim alleging that the Services or any part thereof infringes upon such third party&apos;s Intellectual Property Rights.</p>
                  </SubSection>
                  <SubSection number="19.2" title="By Customer.">
                    <p>Customer will defend, indemnify and hold harmless NEAR AI, its Affiliates, and its employees, officers and directors (&ldquo;NEAR AI Indemnitee&rdquo;) from and against any and all Losses arising out of or relating to a Claim to the extent arising from (a) any Customer Application or Customer Data; (b) Customer&apos;s or an Authorized User&apos;s use of the Services in breach of these Terms; (c) Customer&apos;s or an Authorized User&apos;s violation of applicable law in connection with its use of the Services; and (d) any dispute between Customer and its End Users.</p>
                  </SubSection>
                  <SubSection number="19.3" title="Exclusions.">
                    <p>NEAR AI will have no obligations under this Section 19 with respect to any Claim that relates to or arises from: (i) Customer&apos;s continuation of an activity after being notified of such activity&apos;s alleged infringement; (ii) the combination or use of the Services with hardware, software, data or other materials not provided or approved by NEAR AI; or (iii) use of the Services other than in accordance with these Terms.</p>
                  </SubSection>
                  <SubSection number="19.4" title="Indemnification Procedure.">
                    <p>Each Party will promptly notify the other Party in writing of any Claim. The Indemnitor will promptly take control of the defense and investigation of such Claim and will employ counsel of its choice at the Indemnitor&apos;s sole cost and expense. Neither Party shall settle any Claim that results in the Indemnitee&apos;s obligation or liability without the Indemnitee&apos;s prior written consent.</p>
                    <p>The Indemnitee&apos;s failure to perform any obligations under this Section 19.4 will not relieve the Indemnitor of its indemnity obligations under this Section 19, except to the extent that the Indemnitor can demonstrate that it has been materially prejudiced as a result of such failure. The Indemnitee may participate in and observe the proceedings at its own cost and expense with counsel of its own choosing.</p>
                  </SubSection>
                  <SubSection number="19.5" title="Remedies.">
                    <p>If NEAR AI reasonably believes the Services might infringe a third party&apos;s Intellectual Property Rights, then NEAR AI may, at its sole option and expense: (i) procure the right for Customer to continue using the Services; (ii) modify the Services to make them non-infringing; or (iii) replace the Services with a non-infringing alternative. If NEAR AI does not believe the remedies in (i)-(iii) are commercially reasonable, NEAR AI may suspend or terminate Customer&apos;s use of the impacted Services.</p>
                  </SubSection>
                  <SubSection number="19.6" title="Sole Rights &amp; Obligations">
                    <p>Without affecting either Party&apos;s termination rights and to the extent permitted by applicable law, this Section 19 states the Parties&apos; sole and exclusive remedy under these Terms for any third-party allegations of Intellectual Property Rights infringement covered by this Section 19.</p>
                  </SubSection>
                </Section>

                {/* Section 20 */}
                <Section id="section-20" number="20" title="Limitation of Liability.">
                  <p className="uppercase text-sm leading-relaxed">20.1 In no event will either party be liable for lost profits or special, incidental, or consequential damages arising out of or related to this agreement (whether from breach of contract, breach of warranty, or from negligence, strict liability, or any other form of action), even if such party has been advised of the possibility of such damages.</p>
                  <p className="uppercase text-sm leading-relaxed">20.2 In no event will either party&apos;s aggregate, cumulative liability exceed the amount paid or payable to NEAR AI by Customer during the twelve (12) month period preceding the relevant claim.</p>
                  <p className="uppercase text-sm leading-relaxed">20.3 Nothing in these Terms excludes or limits (a) either party&apos;s liability for: (i) fraud, gross negligence or willful misconduct, (ii) indemnification and defense obligations under Section 19 (Indemnification), (iii) infringement of the other party&apos;s intellectual property rights; (b) Customer&apos;s payment obligations or express representations and warranties; or (c) matters for which liability cannot be excluded or limited under applicable law.</p>
                </Section>

                {/* Section 21 */}
                <Section id="section-21" number="21" title="Term & Termination.">
                  <SubSection number="21.1" title="Term.">
                    <p>These Terms will commence on the Effective Date and continue until the earlier of such time as (i) Customer closes its Account, and (ii) a party terminates these Terms as set forth herein.</p>
                  </SubSection>
                  <SubSection number="21.2" title="Termination for Breach or Insolvency.">
                    <p>Either party will be entitled to terminate these Terms (i) if the other party commits a material breach and fails to cure such breach within thirty (30) days of written notification, and (ii) upon written notice if the other party enters into liquidation, becomes insolvent, or enters into receivership or bankruptcy.</p>
                  </SubSection>
                  <SubSection number="21.3" title="Termination by NEAR AI.">
                    <p>NEAR AI reserves the right to terminate these Terms and close your Account upon notice to you in the event that we determine we are required to do so by law, in which case we will refund to you any prepaid fees covering the remainder of your payment period.</p>
                  </SubSection>
                  <SubSection number="21.4" title="Effect of Termination.">
                    <p>Upon any expiration or termination of these Terms: (a) Customer&apos;s rights and access to the Services will terminate unless otherwise described in these Terms, and (b) all fees will become due and owing.</p>
                  </SubSection>
                  <SubSection number="21.5" title="Survival.">
                    <p>Sections that by their nature are intended to survive include: Section 9 (Intellectual Property), Section 10 (Subscriptions & Payment), Section 11 (Confidential Information), Section 12 (Data Privacy & Security), Section 17 (Representations and Warranties), Section 18 (Disclaimers), Section 19 (Indemnification), Section 20 (Limitation of Liability), Section 21.4 (Effect of Termination), Section 23 (Dispute Resolution; Governing Law), and Section 24 (Miscellaneous). Customer&apos;s liability and obligation to pay any fees or other amounts that have accrued prior to such expiration or termination will also survive such expiration or termination.</p>
                  </SubSection>
                </Section>

                {/* Section 22 */}
                <Section id="section-22" number="22" title="Updates to these Terms.">
                  <p>NEAR AI reserves the right to change or update these Terms from time to time at our sole discretion by posting the amended Terms with an updated &ldquo;Last Updated&rdquo; date. If the changes include material changes that affect your rights or obligations, we will notify you of the changes by reasonable means. Customer&apos;s continued use of the Services following the effective date of any changes constitutes acceptance of those changes.</p>
                </Section>

                {/* Section 23 */}
                <Section id="section-23" number="23" title="Dispute Resolution; Governing Law.">
                  <SubSection number="23.1" title="Governing Law.">
                    <p>All claims arising out of or relating to these Terms or the Services will be governed by the laws of the State of Delaware, USA, excluding Delaware&apos;s conflicts of laws rules.</p>
                  </SubSection>
                  <SubSection number="23.2" title="Informal Resolution.">
                    <p>Before commencing any action, the parties will attempt in good faith to resolve any Dispute through discussions between persons with decision-making authority. If a Dispute is not resolved within sixty (60) days after written notice, either party may bring an action in accordance with Section 23.3.</p>
                  </SubSection>
                  <SubSection number="23.3" title="Jurisdiction and Venue.">
                    <p>The parties agree that any action arising out of or relating to these Terms or the Services shall be brought exclusively in the state or federal courts located in the State of Delaware, and each party irrevocably submits to the personal jurisdiction and venue of such courts.</p>
                  </SubSection>
                  <SubSection number="23.4" title="Jury Trial Waiver.">
                    <p className="uppercase text-sm leading-relaxed">Each party irrevocably waives any right to a jury trial in any action arising out of or relating to these Terms or the Services.</p>
                  </SubSection>
                </Section>

                {/* Section 24 */}
                <Section id="section-24" number="24" title="Miscellaneous.">
                  <SubSection number="24.1" title="Notices.">
                    <p>Notices to Customer must be sent to the email address associated with Customer&apos;s Account. Notices to NEAR AI must be sent to <a href="/mailto:legal@near.ai" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">legal@near.ai</a>. Customer is responsible for keeping its email address current throughout the Term.</p>
                  </SubSection>
                  <SubSection number="24.2" title="Assignment.">
                    <p>Neither Party may assign any part of these Terms without the written consent of the other, except to an Affiliate where (a) the assignee has agreed in writing to be bound by these Terms, and (b) the assigning Party has notified the other Party of the assignment. Any other attempt to assign is void.</p>
                  </SubSection>
                  <SubSection number="24.3" title="Force Majeure.">
                    <p>Neither Party will be liable for failure or delay in performance to the extent caused by circumstances beyond its reasonable control, including acts of God, natural disasters, terrorism, riots, or war.</p>
                  </SubSection>
                  <SubSection number="24.4" title="No Agency.">
                    <p>These Terms do not create any agency, partnership, or joint venture between the Parties.</p>
                  </SubSection>
                  <SubSection number="24.5" title="No Waiver.">
                    <p>Neither Party will be treated as having waived any rights by not exercising (or delaying the exercise of) any rights under these Terms.</p>
                  </SubSection>
                  <SubSection number="24.6" title="Severability.">
                    <p>If any part of these Terms is invalid, illegal, or unenforceable, the rest of these Terms will remain in effect.</p>
                  </SubSection>
                  <SubSection number="24.7" title="No Third-Party Beneficiaries.">
                    <p>These Terms do not confer any benefits on any third party unless it expressly states that it does.</p>
                  </SubSection>
                  <SubSection number="24.8" title="Equitable Relief.">
                    <p>Each Party acknowledges that a material breach of these Terms adversely affecting a Party&apos;s Intellectual Property Rights or the Confidential Information of either Party may cause irreparable harm for which monetary damages would be inadequate. In such event, the non-breaching Party will be entitled to seek equitable or injunctive relief.</p>
                  </SubSection>
                  <SubSection number="24.9" title="Entire Agreement.">
                    <p>These Terms set out all terms agreed between the Parties and supersede all other agreements between the Parties relating to its subject matter.</p>
                  </SubSection>
                  <SubSection number="24.10" title="Headers.">
                    <p>Headings and captions used in these Terms are for reference purposes only and will not have any effect on the interpretation of these Terms.</p>
                  </SubSection>
                </Section>

              </div>
            </div>
          </div>
        </section>
        <SiteFooter />

      </div>
    </div>
  );
}

/* ─── Local layout helpers ─────────────────────────────────────────────────── */

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="pt-12 first:pt-0 flex flex-col gap-5">
      <div className="flex items-baseline gap-3 pb-4 border-b border-[#CAC8C8]">
        <span className="font-mono text-[0.75rem] text-muted shrink-0">{number}.</span>
        <h2 className="text-pretty font-medium leading-[1.1] tracking-tight text-[#101010]" style={{ fontSize: "var(--font-size-h3)" }}>
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4 text-muted leading-[1.8] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_strong]:font-medium [&_strong]:text-[#101010]" style={{ fontSize: "var(--font-size-body)" }}>
        {children}
      </div>
    </div>
  );
}

function SubSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 flex flex-col gap-3">
      <h3 className="font-medium text-[#101010]" style={{ fontSize: "var(--font-size-body)" }}>
        {number && <span className="font-mono text-[0.7rem] text-muted mr-2">{number}</span>}
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
