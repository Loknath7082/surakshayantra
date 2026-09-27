export type ServiceIconName = "shield" | "globe" | "smartphone" | "plug" | "network";

export type ServiceContent = {
  readonly slug: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly subtitle: string;
  readonly overview: string;
  readonly scope: readonly string[];
  readonly methodology: readonly string[];
  readonly deliverables: readonly string[];
  readonly iconName: ServiceIconName;
};

export const services: readonly ServiceContent[] = [
  {
    slug: "vapt",
    iconName: "shield",
    title: "VAPT",
    shortDescription: "Comprehensive penetration testing across applications, networks, and infrastructure.",
    subtitle: "End-to-end security assessment that uncovers exploitable weaknesses across your entire attack surface.",
    overview:
      "Comprehensive security assessment combining automated scanning with manual penetration testing to identify exploitable weaknesses across your entire attack surface — from web applications and APIs to networks and cloud infrastructure.",
    scope: [
      "Web applications",
      "APIs",
      "Network infrastructure",
      "Cloud environments",
      "Mobile applications",
      "Active Directory",
    ],
    methodology: [
      "Reconnaissance",
      "Automated Scanning",
      "Manual Analysis",
      "Exploitation",
      "Reporting & Retest",
    ],
    deliverables: [
      "Executive summary",
      "Detailed technical report",
      "Proof-of-concept evidence",
      "Prioritized remediation roadmap",
      "Post-fix retest",
    ],
  },
  {
    slug: "web-app",
    iconName: "globe",
    title: "Web App Testing",
    shortDescription: "Identify security weaknesses in web applications before attackers can exploit them.",
    subtitle: "Deep-dive assessment aligned with the OWASP Top 10 and modern web application threats.",
    overview:
      "Deep-dive security assessment of web applications aligned with the OWASP Top 10 and beyond — uncovering authentication bypasses, authorization flaws, injection vulnerabilities, and business logic weaknesses.",
    scope: [
      "Authentication & session management",
      "Authorization & access control",
      "Input validation",
      "Business logic",
      "Client-side security",
      "API endpoints",
    ],
    methodology: [
      "Reconnaissance",
      "Authentication Testing",
      "Input Fuzzing",
      "Business Logic Analysis",
      "Reporting & Retest",
    ],
    deliverables: [
      "Findings report with severity ratings",
      "Reproduction steps",
      "Remediation guidance",
      "Developer-ready recommendations",
      "Retest",
    ],
  },
  {
    slug: "mobile",
    iconName: "smartphone",
    title: "Mobile Testing",
    shortDescription: "Assess iOS and Android applications for vulnerabilities and insecure data handling.",
    subtitle: "Security assessment of mobile applications mapped to OWASP MASVS.",
    overview:
      "Security assessment of iOS and Android applications covering client-side storage, network communication, binary protections, and backend API interactions — mapped to OWASP MASVS.",
    scope: [
      "Local data storage",
      "Secure transport",
      "Binary protections",
      "Code tampering",
      "Runtime manipulation",
      "Backend API interactions",
    ],
    methodology: [
      "Static Analysis",
      "Dynamic Analysis",
      "Network Interception",
      "Backend API Testing",
      "Reporting & Retest",
    ],
    deliverables: [
      "Findings report",
      "Proof-of-concept demonstrations",
      "Platform-specific remediation",
      "MASVS compliance mapping",
      "Retest",
    ],
  },
  {
    slug: "api",
    iconName: "plug",
    title: "API Testing",
    shortDescription: "Evaluate API endpoints for authentication, authorization, and data exposure issues.",
    subtitle: "Comprehensive review of REST, GraphQL, and SOAP APIs across your service boundaries.",
    overview:
      "Comprehensive security review of REST, GraphQL, and SOAP APIs — covering authentication, authorization, rate limiting, input validation, and data exposure across your service boundaries.",
    scope: [
      "Authentication mechanisms",
      "Authorization & IDOR",
      "Rate limiting",
      "Input validation",
      "Data exposure",
      "Business logic abuse",
    ],
    methodology: [
      "Endpoint Discovery",
      "Authentication Testing",
      "Authorization Testing",
      "Input Injection",
      "Reporting & Retest",
    ],
    deliverables: [
      "Findings report",
      "Vulnerable endpoint evidence",
      "Remediation roadmap",
      "API-specific hardening guidance",
      "Retest",
    ],
  },
  {
    slug: "network",
    iconName: "network",
    title: "Network Testing",
    shortDescription: "Test internal and external network perimeters for misconfigurations and exposure.",
    subtitle: "Internal and external network penetration testing that maps attack paths before adversaries do.",
    overview:
      "Internal and external network penetration testing to identify misconfigurations, exposed services, weak credentials, and lateral movement paths before attackers exploit them.",
    scope: [
      "External perimeter",
      "Internal network",
      "Wireless infrastructure",
      "Active Directory",
      "Cloud network configuration",
      "Segmentation controls",
    ],
    methodology: [
      "Reconnaissance",
      "Port Scanning",
      "Service Enumeration",
      "Exploitation",
      "Lateral Movement",
      "Reporting & Retest",
    ],
    deliverables: [
      "Findings report",
      "Attack path documentation",
      "Configuration fixes",
      "Remediation priority matrix",
      "Retest",
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): readonly string[] {
  return services.map((s) => s.slug);
}
