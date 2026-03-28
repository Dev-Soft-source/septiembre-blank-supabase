
import { TeamLevel } from "./types";

// Team levels with structured content
export const teamLevelsData: TeamLevel[] = [
  {
    id: "glow",
    name: "GLOW LEVEL",
    tier: "TIER 4",
    shortName: "GLOW",
    color: "#FFC83D",
    content: {
      description: "The Glow team represents the operational and visible foundation of our organization. They are the first point of contact with the public and the ones who clearly and directly convey the essential values of our project. They act as daily ambassadors of our brand, bringing presence, consistency, and dynamism to every action. Their role is key to ensuring a strong connection between the company and its surroundings. Each team of three is carefully selected by a Bridge Leader (Level 3) to form a fundamental unit within the organization.",
      responsibilities: [
        "Hotel relations and commercial operations (18 people): Onboarding Specialists (12) for hotel relations, Integration Specialists (6) for contract integration",
        "Marketing and expansion (9 people): SEO/SEM Specialists (3), Content Creators (3), Social Media Managers (3)",
        "Technology and development (3 people): Frontend and Backend Developers for implementation and database management",
        "Customer service (3 people): Customer Support Representatives for user inquiries and issue resolution",
        "Legal and HR (3 people): Human Resources Manager (1) for legal support, HR Specialists (2) for talent management"
      ],
      qualifications: [
        "Working knowledge of English for effective international communication",
        "Additional languages beneficial for regional assignments",
        "Strong communication and interpersonal skills",
        "Ability to work effectively in team structures"
      ],
      benefits: [
        "Direct involvement in company operations",
        "Professional development opportunities",
        "Team-based working environment",
        "Clear leadership structure and support"
      ]
    }
  },
  {
    id: "bridge",
    name: "BRIDGE LEVEL",
    tier: "TIER 3",
    shortName: "BRIDGE",
    color: "#9387F5", 
    content: {
      description: "Ten essential Team Leaders, each authorized to form and lead a team of three Glow members. These leaders are distributed across the departments of Hotel Relations, Marketing, Technology, Customer Support, and Legal/HR. Ambitious, resourceful, and well-connected professionals ready to take the lead. Tier 3 members are empowered to build and lead their own Tier 4 team — a group of three collaborators they trust and guide. This is not just about joining a project — it's about stepping into a leadership role with real influence and visibility within the company.",
      responsibilities: [
        "Hotel Relations and Commercial Operations Department (6 teams – 6 leaders): Leaders of Hotel and User Base Development",
        "Marketing and Expansion Department (1 team – 1 leader): Digital Marketing Leader for SEO, SEM strategies, advertising campaigns, and social media",
        "Technology and Development Department (1 team – 1 leader): Software Development Leader for maintenance and Frontend/Backend development",
        "Customer Service Department (1 team – 1 leader): Customer Support Leader for customer service and user experience",
        "Legal and Human Resources Department (1 team – 1 leader): Legal and HR Leader for legal matters, talent management, and internal company culture"
      ],
      qualifications: [
        "Leadership experience and team management skills",
        "Working knowledge of English for international communication",
        "Additional languages beneficial for regional assignments",
        "Proven track record in relevant professional area",
        "Strong networking and relationship-building abilities"
      ],
      benefits: [
        "Leadership role with real influence and visibility",
        "Authority to build and lead own Tier 4 team",
        "Participation in high-level strategic discussions",
        "Direct impact on company evolution and direction",
        "Professional growth and development opportunities"
      ]
    }
  },
  {
    id: "drive",
    name: "DRIVE LEVEL",
    tier: "TIER 2",
    shortName: "DRIVE",
    color: "#FC9F5B", 
    content: {
      description: "Senior-level professionals with experience in any area of expertise that can meaningfully contribute to the growth of the business. These allies also hold relevant influence in strategic environments, and their primary role is to drive the expansion of Hotel Living through their network and direct involvement in high-impact actions.",
      responsibilities: [
        "Develop and execute acquisition strategies by country, region, or type of hotel",
        "Represent Hotel Living at key meetings or events",
        "Monitor results and improve tactics based on data",
        "Generate strategic contacts and leads",
        "Help design materials and scripts tailored to each region",
        "Ensure execution quality throughout the team structure"
      ],
      qualifications: [
        "Senior-level professional experience",
        "Relevant influence in strategic environments",
        "Strong network and relationship-building capabilities",
        "Working knowledge of English for international communication",
        "Additional languages beneficial for regional assignments",
        "Proven track record in business development or expansion"
      ],
      benefits: [
        "Strategic role in company expansion",
        "Direct involvement in high-impact actions",
        "Access to executive-level decision making",
        "Opportunity to leverage professional network",
        "Significant influence on company growth direction"
      ]
    }
  },
  {
    id: "summit",
    name: "SUMMIT LEVEL",
    tier: "TIER 1",
    shortName: "SUMMIT",
    color: "#8CD867",
    content: {
      description: "The Summit Level (Tier 1) includes high-value individuals whose involvement creates access, visibility, trust, or massive opportunity — through influence, network, or reputation. Not part of daily operations. Their participation adds prestige, legitimacy, and exponential reach to Hotel Living.",
      responsibilities: [
        "Unlock mass onboarding through partnerships",
        "Build public confidence in the platform",
        "Offer strategic advice and presence when needed",
        "Shape perception through their voice, name, or support",
        "Provide access to high-level networks and opportunities"
      ],
      qualifications: [
        "Influencers or content creators with massive audiences",
        "Public figures, academics, or cultural leaders with strong reputations",
        "Connectors capable of opening entire networks with one introduction",
        "Executives or former directors of hotel/tourism associations",
        "Hotel chain owners or regional operators",
        "Significant influence, network, or reputation in relevant industries"
      ],
      benefits: [
        "Strategic advisory role without daily operational involvement",
        "Prestige and legitimacy association with innovative platform",
        "Opportunity to shape industry evolution",
        "Access to exclusive networking and partnership opportunities",
        "Recognition as key strategic partner in revolutionary concept"
      ]
    }
  }
];
