import type { CompareData } from "@/components/expandlab/ComparePage";

/** Data for the three /compare/* pages (AI Search plan §2.6). Kept here so each
 * page render and its FAQPage schema share one source. Framing stays fair; a
 * page that only praises us does not get trusted or cited. */

export const CMP_AGENCY_VS_FREELANCER: CompareData = {
  eyebrow: "Compare",
  h1: "Course agency vs freelancer: who should build your course?",
  intro: [
    "A course agency builds your entire course, from strategy through launch, with one team owning the outcome. A freelancer builds a single piece you hand them, like a sales page or a course shell, and leaves you to plan, manage and connect the rest.",
    "Both are the right call in different situations. Here is how they compare.",
  ],
  columns: ["Course agency", "Freelancer"],
  rows: [
    { label: "Cost", cells: ["$7,000 to $50,000+ for the full build", "$1,500 to $5,000 per piece"] },
    { label: "Timeline", cells: ["A managed timeline, roughly 100 days end to end", "Per task; you sequence the pieces yourself"] },
    { label: "What you get", cells: ["Strategy, curriculum, platform, funnel, automations and launch", "One deliverable, built to spec"] },
    { label: "Who runs it", cells: ["The agency project-manages and connects everything", "You project-manage and integrate the pieces"] },
    { label: "Best for", cells: ["Experts who want the whole thing built and launched", "A specific gap when the rest already exists"] },
    { label: "Main risk", cells: ["Higher upfront cost, so fit matters", "Pieces that do not connect, and coordination falls on you"] },
  ],
  choices: [
    {
      title: "Choose an agency if",
      body: "You want the entire product built and launched, you value one accountable team, and the cost of your own time is higher than the fee.",
    },
    {
      title: "Choose a freelancer if",
      body: "You already have the strategy and the system, and you only need one well-defined piece built.",
    },
  ],
  faq: [
    {
      q: "Is a course agency worth it over a freelancer?",
      a: "It depends on scope. For one small piece, a freelancer is cheaper. For a whole course and launch, an agency usually costs less than hiring and coordinating five freelancers yourself, and it ships faster.",
    },
    {
      q: "How much does a course agency cost compared to a freelancer?",
      a: "Agencies run $7,000 to $50,000 and up for the full build; freelancers run $1,500 to $5,000 per piece. The Expand Lab's 100-Day Build is $7,000 to $9,500 for everything.",
    },
    {
      q: "Can a freelancer build my whole course?",
      a: "Sometimes, but you become the project manager who connects strategy, curriculum, tech and launch. Most experts underestimate how much that coordination costs them in time and momentum.",
    },
    {
      q: "What does a course agency actually do?",
      a: "A full course launch agency handles strategy, curriculum, the platform build, the funnel, automations and the launch, so you record your content and give feedback while they build the rest.",
    },
  ],
  crossLinks: [
    { href: "/pricing", label: "See pricing →" },
    { href: "/method", label: "See the method →" },
    { href: "/faq", label: "Read the FAQ →" },
  ],
};

export const CMP_DFY_VS_DIY: CompareData = {
  eyebrow: "Compare",
  h1: "Done-for-you vs DIY: should you build your course yourself?",
  intro: [
    "Done-for-you means a team designs, builds and launches your course for you. DIY means you build it yourself on a platform like Kajabi, Skool or GoHighLevel, learning each piece as you go.",
    "Both can work. Here is the honest comparison.",
  ],
  columns: ["Done-for-you", "DIY on a platform"],
  rows: [
    { label: "Cost", cells: ["$7,000 to $9,500 for the full build, plus platform fees", "Mostly your time, plus platform fees"] },
    { label: "Timeline", cells: ["About 100 days, managed", "However long it takes you; often years, or never"] },
    { label: "What you get", cells: ["Strategy, curriculum, tech, funnel and launch, done", "Whatever you can build and learn yourself"] },
    { label: "Skills needed", cells: ["Your expertise and feedback", "Offer design, curriculum, tech, copy and launch, all yours to learn"] },
    { label: "Best for", cells: ["Experts whose time is worth more than the fee", "Early-stage builders testing a first offer cheaply"] },
    { label: "Main risk", cells: ["Upfront cost, and you stay involved at key points", "Half-built products, stalled launches, and the cost of your time"] },
  ],
  choices: [
    {
      title: "Choose done-for-you if",
      body: "You have a proven offer and an audience, your calendar is the ceiling, and you would rather buy back the months it would take to learn every piece.",
    },
    {
      title: "Choose DIY if",
      body: "You are early, testing whether an offer sells, and time is more available to you than money.",
    },
  ],
  faq: [
    {
      q: "Is it worth paying someone to build my course?",
      a: "If you have a proven offer and an audience, usually yes: the build pays for itself when it launches, and you get the months back. If you are still testing whether an offer sells, DIY first.",
    },
    {
      q: "How much does it cost to build a course yourself?",
      a: "Mostly time, plus platform fees of roughly $1,000 to $2,000 a year. The hidden cost is the months it takes, and the launches that never happen while you learn each piece.",
    },
    {
      q: "Can I build a course myself and hire help later?",
      a: "Yes, many do. A common path is to DIY a first version, prove it sells, then bring in a team to rebuild and scale it properly.",
    },
    {
      q: "What is done-for-you course creation?",
      a: "A done-for-you agency designs, builds and launches your course for you: offer, curriculum, platform, funnel, automations and launch, so you only record content and give feedback.",
    },
  ],
  crossLinks: [
    { href: "/pricing", label: "See pricing →" },
    { href: "/whats-included", label: "What's included →" },
    { href: "/faq", label: "Read the FAQ →" },
  ],
};

export const CMP_PLATFORMS: CompareData = {
  eyebrow: "Compare",
  h1: "Kajabi vs Skool vs GoHighLevel: which platform for your course?",
  intro: [
    "Kajabi, Skool and GoHighLevel all host online courses, but they are built for different models. Kajabi is an all-in-one course and membership platform, Skool is a community-first platform, and GoHighLevel is a CRM with courses and heavy automation built in.",
    "Here is how they compare for coaches and experts.",
  ],
  columns: ["Kajabi", "Skool", "GoHighLevel"],
  rows: [
    { label: "Best for", cells: ["Polished standalone courses and memberships", "Community-led courses and cohorts", "Courses inside a CRM with heavy automation"] },
    { label: "Strengths", cells: ["Courses, memberships, email and pages in one place", "Discussion, gamification and simplicity", "Funnels, pipelines, email and SMS, and SaaS mode"] },
    { label: "Community", cells: ["Built in, secondary to courses", "The core of the platform", "Available, secondary to automation"] },
    { label: "Automation", cells: ["Solid built-in pipelines and email", "Light; connect external tools", "Deep; the platform's main strength"] },
    { label: "Pricing model", cells: ["Flat monthly tiers", "A single flat monthly fee", "Flat monthly tiers, plus agency and SaaS plans"] },
    { label: "Watch for", cells: ["Less flexible for community-first models", "Fewer standalone course and funnel features", "Powerful but complex; easy to over-build"] },
  ],
  choices: [
    { title: "Choose Kajabi if", body: "You want a polished course and membership experience with courses, email and pages in one place." },
    { title: "Choose Skool if", body: "Your offer is community-first, built on discussion, accountability and gamification." },
    { title: "Choose GoHighLevel if", body: "You want the course inside a CRM with heavy automation, or you plan to resell the software." },
  ],
  faq: [
    {
      q: "Which is best for an online course: Kajabi, Skool or GoHighLevel?",
      a: "It depends on your model. Kajabi for polished standalone courses, Skool for community-led courses, GoHighLevel for courses inside a CRM with heavy automation. We pick based on your architecture, not habit.",
    },
    {
      q: "Is Skool better than Kajabi?",
      a: "Neither is better overall. Skool wins for community-first offers; Kajabi wins for standalone courses and memberships. The right one depends on how your offer is built.",
    },
    {
      q: "Can GoHighLevel replace Kajabi?",
      a: "For many course businesses, yes, especially if you want automation and a CRM in one place. Kajabi is faster to set up for a straightforward course, while GoHighLevel does more but takes more to wire.",
    },
    {
      q: "Do I have to pick the platform before we start?",
      a: "No. Choosing the platform is part of Architecture. We recommend the one that fits your offer, and we build on all three.",
    },
  ],
  crossLinks: [
    { href: "/kajabi", label: "Kajabi builds →" },
    { href: "/skool", label: "Skool builds →" },
    { href: "/gohighlevel", label: "GoHighLevel builds →" },
  ],
};
