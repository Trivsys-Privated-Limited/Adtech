/**
 * Privacy Policy and Terms & Conditions copy.
 *
 * Both documents should still be reviewed by a qualified lawyer. Inline
 * markup understood by LegalDocument (the "draft" notice shows only while a
 * TODO remains):
 *   {{TODO: ...}}  a detail only the business can supply; rendered as a
 *                  visible "To confirm" badge until replaced with real text
 *   [label](/path) an internal link
 *
 * Statements about how the site works (no analytics, no cookies of its own,
 * one local-storage item, server-side forwarding of forms) describe the
 * current code. Update them if that changes.
 */

import { siteConfig } from "@/config/site";

const address = siteConfig.contact.location;
const lastUpdated = "October 27, 2026";

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
  lastUpdated,
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      body: [
        `This policy explains how Adtech, of ${address} ("Adtech", "we", "us"), handles personal information collected through this website. Adtech is responsible for that information.`,
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
            "Technical information: our website hosting provider may record standard server logs, such as IP address, browser type and the pages requested, to operate and secure the service.",
          ],
        },
        "This website does not currently use analytics, advertising or tracking tools. If that changes, we will update this policy before those tools are switched on.",
      ],
    },
    {
      id: "contact-form",
      title: "Contact-form submissions",
      body: [
        "When you send the contact form, we use your details to read and reply to your enquiry and, if you ask us to, to prepare a proposal.",
        "Submissions are checked on our web server and then emailed to our business inbox. They are not stored on the website itself.",
      ],
    },
    {
      id: "newsletter",
      title: "Newsletter",
      body: [
        "If you sign up for our newsletter, we use your email address only to send it. Sign-ups are checked on our web server and emailed to our business inbox, and we add your address to our mailing list.",
        "You can unsubscribe at any time using the unsubscribe link in any newsletter email or by contacting us, and we will stop sending it to you.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and local storage",
      body: [
        "This website does not set cookies of its own.",
        "To avoid showing you the welcome message on every visit, your browser's local storage keeps one item (\"adtech:welcome-seen-at\") holding the time the message was last shown. It stays on your device, is never sent to us, and can be cleared through your browser settings at any time.",
        "Our hosting provider may set strictly necessary cookies for security or load balancing. They are not used to track you or for advertising. If we add any other cookies, we will list them here first.",
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
        "We process information because you asked us to (for example, by sending an enquiry or signing up), with your consent, for our legitimate interest in running and protecting our business and website, or to comply with the law. We do not sell or share personal information for targeted advertising.",
      ],
    },
    {
      id: "retention",
      title: "Data retention",
      body: [
        "We keep personal information only for as long as we need it for the purposes above.",
        {
          list: [
            "Enquiries: up to 24 months after our last contact with you, or longer if we go on to work together and the information forms part of our business records.",
            "Newsletter: until you unsubscribe. After that we keep only a record of your unsubscribe request, so we do not email you again.",
            "Server logs: kept by our hosting provider for a short period, typically no more than 30 days, unless needed to investigate a security incident.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We take reasonable steps to protect the information you send us. Form submissions are sent over an encrypted (HTTPS) connection and checked on our server before they are emailed to us.",
        "No website or method of transmission is completely secure, so we cannot guarantee absolute security. Access to our inbox, enquiry and newsletter accounts is limited to the people who need it and protected by strong passwords and, where available, two-factor authentication.",
      ],
    },
    {
      id: "third-party-services",
      title: "Third-party services",
      body: [
        "We rely on a small number of service providers to run this website and respond to you. They process information on our behalf:",
        {
          list: [
            "Website hosting: our web hosting provider, which serves the website, sends form submissions to our inbox and may keep server logs.",
            "Email: the email provider that hosts our business inbox, where enquiries and sign-ups are received.",
            "Newsletter delivery: the email platform that sends our newsletter.",
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
        "We respond to requests within 45 days, or tell you within that time if we need longer. If you live in a US state with a consumer privacy law, such as Virginia or California, you may also appeal our decision by replying to our response, and contact your state attorney general if you are not satisfied. If you are in the UK or European Economic Area, you may complain to your local data-protection authority.",
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
  lastUpdated,
  sections: [
    {
      id: "about-these-terms",
      title: "About these terms",
      body: [
        `These terms apply to your use of this website, which is operated by Adtech, of ${address}. By using the website you agree to them. If you do not agree, please do not use the website.`,
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
        "Unless stated otherwise, the content, design, text, graphics and code of this website belong to Adtech or its licensors and are protected by copyright and other intellectual property laws.",
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
        "Any proposal we send is an invitation to discuss. It becomes binding only when both parties sign a written agreement. Unless a proposal states otherwise, its pricing and timelines remain valid for 30 days.",
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
        "To the extent permitted by law, the website and its content are provided \"as is\" and \"as available\", without warranties of any kind, express or implied.",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of liability",
      body: [
        "To the extent permitted by law, Adtech is not liable for any loss arising from your use of, or inability to use, this website or from relying on its content.",
        "Nothing in these terms limits liability that cannot be limited by law.",
        "In particular, we are not liable for any indirect, incidental, special or consequential loss, or for loss of profits, revenue, data or business opportunity, arising from the website. Any work we do for you is governed by the liability terms in our written agreement with you.",
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
        "These terms are governed by the laws of the Commonwealth of Virginia and applicable US federal law, without regard to conflict-of-law rules. Any dispute arising from them or from your use of the website will be decided by the state or federal courts located in Fairfax County, Virginia, or the US District Court for the Eastern District of Virginia, and you agree to their jurisdiction.",
      ],
    },
  ],
};
