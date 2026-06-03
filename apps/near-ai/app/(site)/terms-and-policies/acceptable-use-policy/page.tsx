import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";


const TOC = [
  "Scope and Incorporation",
  "Prohibited Use",
  "Sensitive Data and Privacy",
  "Compliance Requirements",
  "High-Risk Activities Disclaimer",
  "Beta or Pre-GA Features",
  "Investigation and Enforcement",
  "Reporting of Violations",
  "Export Control and Sanctions",
  "Attribution Disclaimers and Publicity Restrictions",
  "Changes to this Policy",
];

export default function AcceptableUsePolicyPage() {
  return (
    <div className="relative w-full font-sans bg-[#ECECEC] text-[#101010]">
      <div className="relative w-full flex flex-col">

        {/* ─── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[36vh] flex flex-col bg-gradient-to-b from-[#525252] from-[35%] to-[#ECECEC]">
          <div className="absolute inset-0 z-[1] bg-[#101010]/40 pointer-events-none" />
          <div className="relative z-10 flex flex-col flex-1 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <SiteHeader />
            <div className="flex flex-col flex-1 justify-end pb-12 lg:pb-16 pt-8">
              <h1
                className="text-white font-medium leading-[1.05] tracking-tight"
                style={{ fontSize: "var(--font-size-h1)" }}
              >
                Acceptable Use Policy
              </h1>
              <p className="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.25em] text-white/50">
                Last Updated — February 22, 2026
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
                    <a
                      key={item}
                      href={`#section-${i + 1}`}
                      className="text-pretty text-muted hover:text-[#101010] transition-colors [font-size:var(--font-size-body)] leading-snug"
                    >
                      <span className="font-mono text-[0.7rem] mr-2 opacity-50">{i + 1}.</span>
                      {item}
                    </a>
                  ))}
                </nav>
              </aside>

              {/* Body */}
              <div className="flex flex-col gap-1 max-w-[860px]">

                {/* Intro */}
                <div className="flex flex-col gap-4 text-muted leading-[1.8]" style={{ fontSize: "var(--font-size-body)" }}>
                  <p>This Acceptable Use Policy (&lsquo;Policy&rsquo;) governs your use of the services offered by Jasnah Inc., dba NEAR AI a Delaware corporation (&lsquo;NEAR AI&rsquo;, &lsquo;we&rsquo;, &lsquo;us&rsquo; or &lsquo;our&rsquo;) (&lsquo;Services&rsquo;). We may modify this Policy by posting a revised version at https://near.ai/acceptable-use-policy. By using the Services, you agree to be bound by the latest version of this Policy.</p>

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
                <Section id="section-1" title="Scope and Incorporation">
                  <p>This Policy is incorporated into and forms part of your Agreement with NearAI (including the Terms of Service, Master Services Agreement, and any Order Forms). You are responsible for ensuring that your Authorized Users and end users comply with this Policy, and you must pass through equivalent obligations to them.</p>
                </Section>

                {/* Section 2 */}
                <Section id="section-2" title="Prohibited Use">
                  <p>You may not use, or permit, encourage or facilitate, directly or indirectly, others to use, the Services:</p>
                  <SubSection number="" title="Unauthorized or Illegal Uses:">
                    <ul>
                      <li>to violate the rights of others</li>
                      <li>to distribute, publish, send, or facilitate the sending of unsolicited mass email or other messages, promotions, advertising, or solicitations (or &lsquo;spam&rsquo;)</li>
                      <li>to harass, defame, or unlawfully discriminate against individuals or groups based on legally protected characteristics</li>
                      <li>to impersonate any individual or organization or misrepresent your affiliation with any person or entity</li>
                      <li>to engage in deceptive or undisclosed use of synthetic or AI-generated media in a manner prohibited by law</li>
                      <li>to generate photo, video, voice or other content that impersonates a person (living or dead) with the intent to deceive, or otherwise convince a natural person that they are communicating with another natural person</li>
                      <li>to intentionally or knowingly violate generate content to intellectual property laws</li>
                    </ul>
                  </SubSection>
                  <SubSection number="" title="Criminal Activities:">
                    <ul>
                      <li>for any illegal, infringing, or fraudulent purpose, including unauthorized access or scraping of data or systems</li>
                      <li>to facilitate fraud, blackmail, intimidation, discrimination, extortion, gambling, sports betting, providing instructions on how to commit or facilitate a crime, solicitation of persons to commit a crime</li>
                      <li>to threaten, incite, promote, or actively encourage violence, terrorism, or other serious harm</li>
                      <li>for any content or activity that promotes child sexual exploitation or abuse;</li>
                      <li>to publish or distribute pornography or sexually explicit material that violates applicable laws or industry standards</li>
                      <li>to create or distribute material that could reasonably be expected to result in serious physical harm, property damage, or unlawful interference with infrastructure</li>
                      <li>to generate harmful content relative to weapons and controlled substances: solicitation or synthesis of controlled or illegal compounds, conventional or unconventional weapons (chemical, biological, radiological, nuclear (CBRN))</li>
                    </ul>
                  </SubSection>
                  <SubSection number="" title="Security/System Compromise:">
                    <ul>
                      <li>to intentionally operate the service to act contrary to applicable policies</li>
                      <li>to perform unauthorized benchmarking or testing of the Services, including publishing or disclosing performance data without our prior written consent</li>
                      <li>to violate the security, integrity, or availability of any user, network, computer or communications system, software application, or network or computing device (including by circumventing authentication, attestation, rate limits, or encryption controls)</li>
                      <li>to distribute, install, or operate malware, ransomware, spyware, or other malicious software</li>
                      <li>to host or distribute content that is excessively violent, hateful, or intended to incite hostility</li>
                      <li>to attempt to override or circumvent safeguards; to probe, scan, or test the vulnerability of the Services or related systems without authorization</li>
                      <li>to share login credentials, misrepresent your identity, or access accounts without proper authorization</li>
                      <li>circumvent, disable, or manipulate billing, usage tracking, rate limits, or free-tier restrictions</li>
                      <li>create multiple accounts to bypass usage caps, free-tier quotas, or other service thresholds</li>
                    </ul>
                  </SubSection>
                  <SubSection number="" title="AI, Data, and Privacy Legal Compliance Violations:">
                    <ul>
                      <li>to deploy AI systems classified as prohibited under applicable law, including social scoring, manipulation of vulnerable groups, or real-time biometric identification without authorization</li>
                      <li>to circumvent or disable safety controls, alignment mechanisms, provenance or watermarking signals or content filters in AI systems</li>
                      <li>to train or develop AI models using unlawfully obtained or infringing data, personal data without lawful basis, or copyrighted materials without proper authorization</li>
                      <li>to process personal data without compliance with GDPR, CCPA, or other applicable data protection laws or to impede individuals&apos; ability to exercise their rights (access, deletion, portability, objection)</li>
                      <li>to transfer personal data across borders without appropriate legal safeguards and transfer mechanisms (such as SCCs or equivalent legal safeguards)</li>
                      <li>to obstruct individuals&apos; data protection rights including access, deletion, and portability</li>
                      <li>to train or improve competing AI models using NearAI-generated Outputs without our prior written consent</li>
                      <li>to reverse engineer or attempt to extract model weights, embeddings, or system prompts</li>
                      <li>to automate unattended AI agents that may take real-world actions without adequate human oversight or policy constraints</li>
                    </ul>
                  </SubSection>
                </Section>

                {/* Section 3 */}
                <Section id="section-3" title="Sensitive Data and Privacy">
                  <p>You must not input, upload, or process Protected Health Information (&lsquo;PHI&rsquo;) under HIPAA unless you have executed a Business Associate Agreement (BAA) with NearAI and enabled approved workflows. Special-category data (such as biometric, genetic, precise location, or financial account information) may only be processed with a lawful basis and with required disclosures. You are responsible for implementing appropriate technical and organizational measures for any personal data you process via the Services.</p>
                </Section>

                {/* Section 4 */}
                <Section id="section-4" title="Compliance Requirements">
                  <p>If you use the Services for high-risk AI systems or consequential use cases (those that may materially affect health, safety, fundamental rights, or access to essential services), you must implement appropriate human oversight, robust testing, validation and safeguards to mitigate risks and ensure reliability.</p>
                  <p>You and your end users are solely responsible for all decisions made and actions taken based on your use of the Services and any outputs resulting therefrom. You must evaluate AI outputs for accuracy and appropriateness for your use case.</p>
                </Section>

                {/* Section 5 */}
                <Section id="section-5" title="High-Risk Activities Disclaimer">
                  <p>The Services are not designed, intended, or warranted for use in environments requiring fail-safe performance, such as in the operation of nuclear facilities, air traffic control, life support machines, or other critical systems where failure could lead to death, injury, or severe physical or environmental damage. You assume all risk for any such use.</p>
                </Section>

                {/* Section 6 */}
                <Section id="section-6" title="Beta or Pre-GA Features">
                  <p>Features identified as &lsquo;Alpha,&rsquo; &lsquo;Beta,&rsquo; &lsquo;Preview,&rsquo; or similar are provided as-is, may be changed or withdrawn, and are excluded from any service-level commitments (SLAs). You must not use Beta features in High-Risk contexts without our prior written consent.</p>
                  <p>It is your responsibility to ensure you comply with all applicable laws, rules, and regulations, including the EU AI Act and data protection frameworks. You agree to provide information about your intended uses and compliance with this Policy upon request.</p>
                  <p>We may investigate and enforce violations of this Policy as outlined in this section.</p>
                </Section>

                {/* Section 7 */}
                <Section id="section-7" title="Investigation and Enforcement">
                  <p>We may investigate any suspected violation of this Policy and may throttle, suspend, quarantine, or terminate access to the Services, or remove content that violates this Policy. You agree to cooperate with us in investigating, remediating, or verifying compliance with this Policy.</p>
                  <p>When determining whether there has been a violation of this Policy, we may consider your ability and willingness to comply with this Policy, including the policies and processes you have in place to prevent or identify and remove any prohibited content or activity.</p>
                  <p>We may employ automated systems, manual review, and external reporting tools to monitor for violations.</p>
                  <p>We may report unlawful content or activity to appropriate authorities and cooperate with valid legal requests.</p>
                </Section>

                {/* Section 8 */}
                <Section id="section-8" title="Reporting of Violations">
                  <p>To report any violation of this Policy, please contact <a href="mailto:legal@near.ai" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">legal@near.ai</a>.</p>
                </Section>

                {/* Section 9 */}
                <Section id="section-9" title="Export Control and Sanctions">
                  <p>You may not use or permit access to the Services in violation of any economic sanctions, export control laws or regulations, or other restrictive trade and use measures, regulations and laws administered by the United States or any other government agency.</p>
                </Section>

                {/* Section 10 */}
                <Section id="section-10" title="Attribution, Disclaimers, and Publicity Restrictions">
                  <p>You may not use the name, logo, or trademarks of NEAR AI in any manner without prior written consent. You may not remove, modify or obscure any copyright, trademark, proprietary rights, disclaimer, or warning notice included on or embedded in any part of the Services, any other materials provided by NEAR AI, or any copies thereof. You must not imply any endorsement by NEAR AI or use outputs from the Services in a way that falsely suggests they are human-authored unless clearly disclosed.</p>
                </Section>

                {/* Section 11 */}
                <Section id="section-11" title="Changes to this Policy">
                  <p>We may revise this Policy periodically at our discretion. Material updates will be notified via the console or to your account email before taking effect, unless immediate changes are required for legal, safety, or security reasons.</p>
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

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="pt-12 first:pt-0 flex flex-col gap-5">
      <div className="flex items-baseline gap-3 pb-4 border-b border-[#CAC8C8]">
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
    <div className="mt-4 flex flex-col gap-3">
      <h3 className="font-medium text-[#101010]" style={{ fontSize: "var(--font-size-body)" }}>
        {number && <span className="font-mono text-[0.7rem] text-muted mr-2">{number}</span>}
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
