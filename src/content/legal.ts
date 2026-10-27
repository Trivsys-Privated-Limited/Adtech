/**
 * Privacy Policy and Terms & Conditions copy.
 *
 * DRAFT TEMPLATES — both documents need review by Adtech and a qualified
 * lawyer before launch. Inline markup understood by LegalDocument:
 *   {{TODO: ...}}  a detail only the business can supply; rendered as a
 *                  visible "To confirm" badge until replaced with real text
 *   [label](/path) an internal link
 *
 * Statements about how the site works (no analytics, no cookies of its own,
 * one local-storage item, server-side forwarding of forms) describe the
 * current code. Update them if that changes.
 */

export type LegalBlock = string | { list: string[] };

export type LegalSection = {
  id: string;
  title: string;
  body: LegalBlock[];
};

export type LegalDoc = {
  title: string;
  /** Short summary shown under the title and used as the meta description. */
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  summary:
    "How Adtech collects, uses and protects personal information when you use this website, contact us, or sign up for our newsletter.",
  lastUpdated: "{{TODO: publication date}}",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      body: [
        "This policy explains how Adtech ({{TODO: registered legal entity name, company number and registered address}}) (\"Adtech\", \"we\", \"us\") handles personal information collected through this website.",
        "For questions about this policy or your information, use the contact details at the end of this page.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: [
        "We only collect the information you choose to give us, plus the limited technical information needed to deliver the website:",
        {
          list: [
            "Contact form: your name, work email, company (optional), the type of project and the project details you write.",
            "Newsletter sign-up: your email address.",
            "Technical information: our hosting provider ({{TODO: hosting provider}}) may record standard server logs, such as IP address, browser type and the pages requested, to operate and secure the service.",
          ],
        },
        "This website does not currently use analytics, advertising or tracking tools. {{TODO: update this section before adding any analytics or marketing tools}}",
      ],
    },
    {
      id: "contact-form",
      title: "Contact-form submissions",
      body: [
        "When you send the contact form, we use your details to read and reply to your enquiry and, if you ask us to, to prepare a proposal.",
        "Submissions are checked on our server and then passed to the service we use to receive enquiries ({{TODO: CRM, inbox or workflow tool that receives submissions}}). The address of that service is never exposed in your browser.",
      ],
    },
    {
      id: "newsletter",
      title: "Newsletter",
      body: [
        "If you sign up for our newsletter, we use your email address only to send it. Sign-ups are passed from our server to our email platform ({{TODO: newsletter provider}}).",
        "You can unsubscribe at any time by contacting us. {{TODO: confirm every newsletter includes an unsubscribe link and whether sign-ups use double opt-in}}",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and local storage",
      body: [
        "This website does not set cookies of its own.",
        "To avoid showing you the welcome message on every visit, your browser's local storage keeps one item (\"adtech:welcome-seen-at\") holding the time the message was last shown. It stays on your device, is never sent to us, and can be cleared through your browser settings at any time.",
        "{{TODO: list any cookies set by the hosting provider or by tools added later}}",
      ],
    },
    {
      id: "how-we-use-information",
      title: "How we use information",
      body: [
        "We use personal information to:",
        {
          list: [
            "respond to enquiries and discuss potential projects;",
            "send the newsletter to people who asked for it;",
            "operate, secure and fix problems with this website;",
            "meet legal obligations that apply to us.",
          ],
        },
        "{{TODO: confirm the legal basis for each purpose under the data-protection laws that apply to Adtech}}",
      ],
    },
    {
      id: "retention",
      title: "Data retention",
      body: [
        "We keep personal information only for as long as we need it for the purposes above.",
        {
          list: [
            "Enquiries: {{TODO: retention period for contact-form submissions}}.",
            "Newsletter: until you unsubscribe. {{TODO: confirm provider retention after unsubscribing}}",
            "Server logs: {{TODO: hosting provider's log retention period}}.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We take reasonable steps to protect the information you send us. Form submissions are validated on our server and the credentials for the services that receive them are kept server-side, never in the browser.",
        "No website or method of transmission is completely secure, so we cannot guarantee absolute security. {{TODO: describe access controls for the inbox, CRM and newsletter account}}",
      ],
    },
    {
      id: "third-party-services",
      title: "Third-party services",
      body: [
        "We rely on a small number of service providers to run this website and respond to you. They process information on our behalf:",
        {
          list: [
            "Website hosting: {{TODO: hosting provider and the region where data is stored}}.",
            "Enquiry handling: {{TODO: service that receives contact-form submissions}}.",
            "Newsletter delivery: {{TODO: newsletter provider}}.",
          ],
        },
        "The website's fonts are served from our own domain, so loading a page does not send requests to a font provider.",
        "Links to other websites are not covered by this policy. Please read their privacy policies.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: [
        "Depending on where you live, you may have the right to access the personal information we hold about you, to have it corrected or deleted, to object to or restrict how we use it, and to withdraw consent at any time.",
        "To make a request, contact us using the details below. We may need to confirm your identity before acting on it.",
        "{{TODO: name the data-protection laws that apply, any supervisory authority visitors can complain to, and response timescales}}",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: [
        "This website is intended for businesses and professionals. It is not directed at children, and we do not knowingly collect information from them.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        "We may update this policy as the website or our services change. The date at the top of this page shows when it was last updated.",
      ],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms & Conditions",
  summary:
    "The terms that apply when you use the Adtech website, including intellectual property, enquiries and proposals, and limitations.",
  lastUpdated: "{{TODO: publication date}}",
  sections: [
    {
      id: "about-these-terms",
      title: "About these terms",
      body: [
        "These terms apply to your use of this website, which is operated by Adtech ({{TODO: registered legal entity name, company number and registered address}}). By using the website you agree to them. If you do not agree, please do not use the website.",
        "Our [Privacy Policy](/privacy-policy) explains how we handle personal information.",
      ],
    },
    {
      id: "use-of-the-website",
      title: "Use of the website",
      body: [
        "You may use this website to learn about Adtech and to contact us. You agree not to:",
        {
          list: [
            "use the website in a way that breaks any law or infringes anyone's rights;",
            "attempt to gain unauthorised access to the website, its servers or connected systems;",
            "introduce malicious code or interfere with the website's operation;",
            "submit false, misleading or automated enquiries or newsletter sign-ups.",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: [
        "Unless stated otherwise, the content, design, text, graphics and code of this website belong to Adtech or its licensors. {{TODO: confirm ownership of all website content and assets}}",
        "You may view and share pages for personal or internal business purposes. You may not copy, reproduce or reuse the website's content for commercial purposes without our written permission.",
        "Technology names and logos mentioned on this website belong to their respective owners and are used only to describe the tools we work with.",
      ],
    },
    {
      id: "service-descriptions",
      title: "Service descriptions",
      body: [
        "Descriptions of our services on this website are general information. They are not an offer and do not form part of any contract.",
        "The scope, timeline, price and deliverables of any engagement are set out only in a separate written agreement between you and Adtech.",
        "Projects labelled \"Concept project\" in our case studies are illustrations of the kind of work we do. They are not descriptions of work delivered for real clients.",
      ],
    },
    {
      id: "enquiries-and-proposals",
      title: "Enquiries and proposals",
      body: [
        "Sending an enquiry through this website does not create a contract or oblige either of us to work together.",
        "Any proposal we send is an invitation to discuss. It becomes binding only when both parties sign a written agreement. {{TODO: confirm how long proposals remain valid and the standard agreement used}}",
        "Please avoid including confidential information in an initial enquiry. If you need to share sensitive details, ask us about confidentiality terms first.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      body: [
        "This website may link to websites run by other organisations. We do not control them and are not responsible for their content, availability or privacy practices.",
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      body: [
        "We work to keep the information on this website accurate and up to date, but it is provided for general information only. We do not promise that the website will always be available, uninterrupted or error-free.",
        "{{TODO: legal review: disclaimer wording and the extent to which it is enforceable where Adtech operates}}",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of liability",
      body: [
        "To the extent permitted by law, Adtech is not liable for any loss arising from your use of, or inability to use, this website or from relying on its content.",
        "Nothing in these terms limits liability that cannot be limited by law.",
        "{{TODO: legal review: liability exclusions and any cap}}",
      ],
    },
    {
      id: "changes-to-these-terms",
      title: "Changes to these terms",
      body: [
        "We may update these terms from time to time. The date at the top of this page shows when they were last updated. Continuing to use the website after a change means you accept the updated terms.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing law",
      body: [
        "{{TODO: governing law and courts with jurisdiction, to be set by Adtech with legal advice}}",
      ],
    },
  ],
};
