/**
 * =============================================================================
 * JAGANNATH PANDA - PRINCIPAL CLOUD ARCHITECT PORTFOLIO
 * Dark Mode Portfolio with Advanced Interactivity
 * =============================================================================
 * Powers all interactive features: animations, modals, forms, and dynamic content
 * Uses: GSAP + ScrollTrigger, Vanta.js, Vanilla Tilt
 */

// ============================================================================
// 1. PROJECT DATA ARRAY - Complete project definitions
// ============================================================================

const projectsData = [
  {
    id: 1,
    title: "Enterprise Multi-Cloud Landing Zone with Developer Platform",
    subtitle: "Palo Alto Cortex Cloud Security",
    category: "Platform Engineering",
    techStack: [
      "AWS",
      "Azure",
      "Palo Alto Cortex Cloud",
      "Backstage IDP",
      "OpenShift",
      "Tekton",
      "Terraform",
      "Sentinel",
      "OPA",
      "GitOps",
    ],
    impact: "30 min onboarding | 100% CIS compliance | 3 new deals",
    summary:
      "Architected multi-cloud landing zones for AWS and Azure with integrated Palo Alto Cortex Cloud security and Backstage Internal Developer Platform.",
    problem:
      "Customers faced 2-week onboarding delays, inconsistent security compliance across clouds, and fragmented developer experience across multi-cloud environments.",
    solution:
      "Built unified landing zones with Palo Alto Cortex Cloud integration, GitOps automation (OpenShift, Tekton, Terraform), policy-as-code enforcement (Sentinel, OPA), and Backstage IDP for self-service provisioning.",
    architecture:
      "Multi-cloud architecture with centralized security governance via Cortex Cloud, GitOps pipelines orchestrating Terraform/Tekton across AWS/Azure, OPA Gatekeeper enforcing policies, Backstage portal enabling self-service, and automated compliance validation.",
    outcomes: [
      "Reduced onboarding time from 2 weeks to 30 minutes via Backstage automation",
      "Achieved 100% CIS compliance across all environments",
      "Packaged as reusable accelerator enabling 40% faster solution delivery",
      "Generated $3M+ in new customer deals",
      "Enabled 200+ developers across 5 organizations",
    ],
    lessonsLearned: [
      "Policy-as-code (OPA) critical for multi-cloud governance at scale",
      "Backstage templates dramatically reduce cognitive load on platform teams",
      "GitOps + policy automation transforms security from gate to enabler",
      "Reusable patterns unlock exponential scaling in consulting",
    ],
  },
  {
    id: 2,
    title: "ML/AIOps Deployment Strategies for Enterprise AI Platform",
    subtitle: "Responsible AI & Inference Cost Optimization",
    category: "GenAI & AI Platform",
    techStack: [
      "OpenShift",
      "Kubernetes",
      "Helm",
      "ArgoCD",
      "Tekton",
      "Backstage",
      "ModelOps",
      "Ray",
      "MLflow",
      "Terraform",
    ],
    impact: "60% delay elimination | 50% faster implementations",
    summary:
      "Designed AIOps architecture with Helm-packaged AI microservices, responsible AI guardrails, and inference cost metering for Fortune-500 enterprise AI platform.",
    problem:
      "Enterprise struggles with 60% of AI projects delayed, lack of model promotion gates, undefined cost allocation, and missing responsible AI controls causing governance gaps.",
    solution:
      "Architected AI microservices framework with Helm templating, GitOps-driven model promotion gates, inference cost metering, responsible AI guardrails (bias detection, explainability), and Backstage templates for self-service model deployment.",
    architecture:
      "Kubernetes-native AI platform with Helm-packaged microservices, ArgoCD/Tekton GitOps pipelines enforcing model promotion stages, Ray for distributed inference, MLflow tracking, cost metering via Prometheus/custom exporters, and policy enforcement via OPA for responsible AI.",
    outcomes: [
      "Eliminated 60% of AI project delays through automated promotion gates",
      "Achieved 50% faster model deployment via Backstage self-service",
      "Implemented cost attribution by model/team reducing waste by 35%",
      "Enabled 40+ concurrent model deployments without bottlenecks",
      "Established responsible AI baselines reducing compliance risk by 80%",
    ],
    lessonsLearned: [
      "Model promotion gates must be automated, not manual checklists",
      "Cost metering at inference layer critical for ML ROI optimization",
      "Responsible AI policies must be enforced at GitOps layer, not post-hoc",
      "Backstage templates unlock self-service for data scientists",
    ],
  },
  {
    id: 3,
    title: "On-Premises to GCP Migration for High-Traffic Consumer Web Platform",
    subtitle: "10M User Platform Migration",
    category: "Cloud Migration",
    techStack: [
      "GCP",
      "GKE Autopilot",
      "Cloud Run",
      "Cloud SQL",
      "Cloud CDN",
      "Cloud Armor",
      "DLP API",
      "Binary Authorization",
      "Terraform",
      "CI/CD",
    ],
    impact: "35-50% cost savings | <10 min cutover | GDPR compliant",
    summary:
      "Executed zero-downtime migration of 10M-user consumer platform from on-premises to GCP with containerization, infrastructure optimization, and data protection.",
    problem:
      "Legacy on-premises infrastructure cost $8.2M annually with limited scalability, outdated security posture, GDPR non-compliance for EU users, and multi-hour failover RPO/RTO.",
    solution:
      "Phased GCP migration using GKE Autopilot for workloads, Cloud Run for microservices, Cloud SQL with DMS for data, Cloud Armor for DDoS protection, DLP API for PII tokenization, and Binary Authorization for CI/CD security gates.",
    architecture:
      "GCP-native architecture with GKE Autopilot cluster, Cloud Run async processors, Cloud SQL managed database with automated backups, Cloud CDN for global performance, Cloud Armor blocking layer, DLP API redacting sensitive data, and Binary Authorization enforcing artifact signature verification.",
    outcomes: [
      "Reduced infrastructure costs by 35-50% via GCP's pricing model",
      "Achieved <10 minute cutover with zero user-facing downtime",
      "Implemented GDPR-compliant data handling via DLP tokenization",
      "Increased system availability from 99.5% to 99.99%",
      "Enabled 300% traffic spikes during peak periods without manual scaling",
      "Reduced security incident response time from 6h to 15 minutes",
    ],
    lessonsLearned: [
      "Database migration is the critical path; start DMS replication early",
      "Data tokenization/PII redaction must be front-of-mind for compliance",
      "GKE Autopilot eliminates node pool management overhead at scale",
      "Cloud Armor + DLP API combination unlocks security without overhead",
    ],
  },
  {
    id: 4,
    title: "Enterprise Kubernetes Platform Strategy and EKS Landing Zone",
    subtitle: "Fortune-100 Financial Services | 342 Microservices",
    category: "Platform Engineering",
    techStack: [
      "Amazon EKS",
      "Backstage",
      "Cosign",
      "OPA Gatekeeper",
      "Calico",
      "Falco",
      "OpenShift",
      "Tekton",
      "ArgoCD",
      "Terraform",
    ],
    impact: "60% operational complexity reduction | 99.99% availability",
    summary:
      "Designed enterprise-grade EKS landing zone for Fortune-100 bank supporting 342 microservices with four-layer security, compliance automation, and self-service developer experience.",
    problem:
      "Fortune-100 financial institution faced 60% operational overhead managing Kubernetes, security/compliance fragmentation (SEC/FINRA/OCC), developer bottlenecks at platform team, and control plane instability.",
    solution:
      "Built four-layer security EKS landing zone: Cosign for image signing, OPA Gatekeeper for policy enforcement, Calico for network policies, Falco for runtime monitoring. Added Backstage portal for self-service namespace provisioning, GitOps automation (Tekton/ArgoCD), and compliance-as-code validation.",
    architecture:
      "Multi-tenant EKS cluster (3 control planes per region for HA) with Calico CNI for microsegmentation, OPA Gatekeeper enforcing 200+ policies, Cosign validating image signatures, Falco runtime detection with AlertManager integration, Backstage portal provisioning namespaces via GitOps, Terraform managing infrastructure, and Prometheus/Grafana for observability.",
    outcomes: [
      "Reduced operational complexity by 60% via automation of 200+ manual tasks",
      "Achieved 99.99% control plane availability across 2 regions",
      "Enabled 1,200+ developers to self-service namespace provisioning",
      "Automated compliance validation reducing audit cycles from quarterly to real-time",
      "Enforced 200+ policies without manual review overhead",
      "Maintained PCI-DSS/SEC/FINRA/OCC compliance continuously",
    ],
    lessonsLearned: [
      "Four-layer security (image/policy/network/runtime) is non-negotiable for FIRE",
      "Backstage self-service eliminates 70% of platform team toil",
      "OPA Gatekeeper policies must evolve with compliance requirements",
      "Multi-control plane HA is mandatory for enterprise SLAs",
    ],
  },
  {
    id: 5,
    title: "Multi-Region Disaster Recovery for Global Payments Platform",
    subtitle: "RTO <30 min | PCI-DSS & GDPR Compliant",
    category: "Infrastructure & Disaster Recovery",
    techStack: [
      "Amazon Aurora",
      "Global Database",
      "Amazon EKS",
      "Amazon Kinesis",
      "AWS DMS",
      "Route 53",
      "Terraform",
      "AWS Backup",
      "CloudFormation",
    ],
    impact: "$2.1M budget | 34% cost savings | RTO <30 min",
    summary:
      "Architected multi-region disaster recovery solution for global payments platform processing $500M+ daily, achieving sub-30-minute RTO with PCI-DSS/GDPR compliance.",
    problem:
      "Global payments platform faced 3+ hour RTO, single-region dependency, PCI-DSS compliance gaps, and $4.2M annual infrastructure cost with manual failover procedures.",
    solution:
      "Implemented Aurora Global Database for <1 second RPO, multi-region EKS clusters with cross-region service mesh, Kinesis streams for event fanout, Route 53 health checks triggering automatic failover, and PCI-DSS-compliant architecture with encryption at rest/transit.",
    architecture:
      "Primary region (us-east-1) with Aurora primary, EKS cluster, Kinesis producers; read-only secondary (eu-west-1) with Aurora read replica, standby EKS cluster, cross-region VPC peering. Route 53 active-active DNS routing with health checks, Kinesis cross-region replication, DMS for non-Aurora workloads, encrypted backups in 3 regions.",
    outcomes: [
      "Reduced RTO from 3+ hours to <30 minutes via automated failover",
      "Achieved <1 second RPO using Aurora Global Database",
      "Saved $1.4M annually (34% reduction) via Savings Plans + Spot instances",
      "Processed 500M+ daily transactions with 99.99% uptime",
      "Maintained PCI-DSS Level 1 certification across regions",
      "Enabled GDPR-compliant data residency with encryption keys per region",
    ],
    lessonsLearned: [
      "Aurora Global Database eliminates RPO/RTO tradeoffs for databases",
      "Automated failover must be tested monthly; manual procedures fail at scale",
      "Kinesis stream replication adds 2-5 second latency; acceptable for financial services",
      "Cost savings from Savings Plans + Spot outweigh multi-region overhead",
    ],
  },
  {
    id: 6,
    title: "Event-Driven Architecture for Business-Critical Order Fulfillment",
    subtitle: "Scaling 5K→10K orders/min | 12→25 locations",
    category: "Architecture & Microservices",
    techStack: [
      "AWS Step Functions",
      "EventBridge",
      "DynamoDB",
      "Lambda",
      "SQS",
      "SNS",
      "X-Ray",
      "Terraform",
    ],
    impact: "5K→10K orders/min | 12→25 locations without code changes",
    summary:
      "Designed event-driven order fulfillment architecture breaking 5,000 orders/minute ceiling, enabling fulfillment center expansion from 12 to 25 locations without application code changes.",
    problem:
      "Order fulfillment platform hit 5,000 orders/minute ceiling, tightly coupled services blocked geographic scaling, PostgreSQL locks caused bottlenecks, manual process addition required code redeployment.",
    solution:
      "Architected with Step Functions Express Workflows (5-step critical path: validate→assign→pick→pack→ship), EventBridge fan-out to 9 async consumers (inventory, notifications, analytics, fulfillment centers), DynamoDB conditional writes replacing PostgreSQL locks, and event-driven orchestration decoupling business processes.",
    architecture:
      "Synchronous critical path via Step Functions Express (sub-second latency), asynchronous processes via EventBridge rules routing to SNS/SQS/Lambda, DynamoDB tables with conditional writes for inventory atomicity, separate Lambda consumers for each fulfillment center, X-Ray tracing across distributed flow.",
    outcomes: [
      "Broke 5,000 orders/min ceiling; now handling 10,000+ orders/min sustained",
      "Scaled from 12 to 25 fulfillment centers without application redeployment",
      "Added new business processes (gift wrapping, rush shipping) via EventBridge rules alone",
      "Reduced p99 latency from 800ms to 120ms for order placement",
      "Achieved 99.99% order accuracy via conditional DynamoDB writes",
      "Eliminated database locks causing cascading failures",
    ],
    lessonsLearned: [
      "EventBridge fan-out eliminates tight coupling and enables process scaling",
      "DynamoDB conditional writes are orders of magnitude faster than distributed locks",
      "Step Functions Express is critical path hero; async fan-out handles the rest",
      "Event schema versioning must support backward compatibility for polyglot consumers",
    ],
  },
  {
    id: 7,
    title: "Centralized DNS across Hundreds of VPCs using Route 53 Profiles",
    subtitle: "Unified Namespace Hierarchy | Multi-AZ Redundancy",
    category: "Networking & Infrastructure",
    techStack: [
      "AWS Route 53",
      "Route 53 Profiles",
      "VPC Associations",
      "Terraform",
      "CloudWatch",
      "CloudTrail",
    ],
    impact: "Single DNS source of truth | 99.99% availability",
    summary:
      "Implemented centralized DNS management for 500+ VPCs across multiple AWS accounts using Route 53 Profiles, eliminating DNS fragmentation and enabling consistent naming.",
    problem:
      "Organization managed 500+ VPCs with fragmented DNS zones, inconsistent naming conventions, manual zone propagation causing 2-3 week change cycles, no unified query logging or auditing.",
    solution:
      "Deployed Route 53 Profiles as centralized DNS service with structured namespace hierarchy (environment.region.account.company.internal), VPC associations via AWS Resource Access Manager, Terraform GitOps pipeline for zone management, and unified CloudWatch Logs for query auditing.",
    architecture:
      "Central Route 53 account hosting master DNS zones with Profiles, spoke VPCs associated via RAM, hierarchical zone structure (prod/staging/dev.us-east-1.platform), Terraform modules managing associations, CloudWatch Logs capturing all queries, Route 53 health checks triggering automatic failover.",
    outcomes: [
      "Centralized DNS source of truth across 500+ VPCs and 20+ AWS accounts",
      "Reduced DNS change cycle from 2-3 weeks to 15 minutes via GitOps",
      "Achieved 99.99% DNS availability with multi-AZ Route 53",
      "Unified query logging enabling compliance audit trails",
      "Eliminated manual zone propagation errors (was 5-10% change failure rate)",
      "Enabled self-service zone creation within governance guardrails",
    ],
    lessonsLearned: [
      "Route 53 Profiles eliminate need for Route 53 delegations in spoke accounts",
      "Structured namespace hierarchy (env.region.account) scales to 1000s of VPCs",
      "Terraform GitOps for DNS enables version control and change tracking",
      "CloudWatch Logs ingestion cost scales linearly; consider sampling for high-volume queries",
    ],
  },
  {
    id: 8,
    title: "AWS Network Firewall with Suricata IPS for Symmetric Traffic Inspection",
    subtitle: "PCI-DSS Readiness | 40% Operational Reduction",
    category: "Security & Compliance",
    techStack: [
      "AWS Network Firewall",
      "Suricata IPS",
      "Route 53 DNS Firewall",
      "VPC Endpoint",
      "CloudWatch",
      "GuardDuty",
      "Security Hub",
      "Terraform",
    ],
    impact: "40% operational reduction | PCI-DSS ready | Symmetric inspection",
    summary:
      "Deployed AWS Network Firewall with Suricata IPS for symmetric traffic inspection across enterprise workloads, achieving PCI-DSS readiness and 40% operational overhead reduction.",
    problem:
      "Enterprise lacked east-west traffic visibility, stateless security groups insufficient for compliance, manual IPS rules maintenance caused 30% operational overhead, no integrated threat detection, PCI-DSS audit findings for lateral movement visibility.",
    solution:
      "Implemented Network Firewall with Suricata IPS rules for symmetric inspection (both ingress/egress), Route 53 DNS Firewall blocking malicious domains, VPC Endpoint routing for centralized inspection, CloudWatch/GuardDuty integration for threat alerting, and Terraform-managed rule sets.",
    architecture:
      "Central inspection VPC with Network Firewall endpoints per AZ, hub-and-spoke architecture routing all traffic through inspection layer, Suricata IPS rules (3,000+ rules) for application-layer inspection, Route 53 DNS Firewall blocking 50K+ malicious domains, GuardDuty findings integrated into Security Hub, Terraform managing firewall policies and rules.",
    outcomes: [
      "Achieved symmetric traffic inspection for east-west lateral movement detection",
      "Reduced operational overhead by 40% via automated Suricata rule updates",
      "Achieved PCI-DSS Requirement 1 compliance (network segmentation)",
      "Integrated with GuardDuty/Security Hub for unified threat visibility",
      "Blocked 99.2% of known threats via DNS Firewall without false positives",
      "Enabled forensic traffic analysis via CloudWatch Logs and VPC Flow Logs",
    ],
    lessonsLearned: [
      "Suricata IPS rules require monthly tuning; false positive rate without tuning is 8-12%",
      "Hub-and-spoke adds 5-10ms latency; use cross-AZ endpoints to minimize",
      "DNS Firewall is force multiplier for blocking C2 beacons without IPS overhead",
      "Rule versioning via Terraform enables safe rollback of problematic rules",
    ],
  },
];

// ============================================================================
// 2. INITIALIZE - DOM READY & GSAP SETUP
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize all features
  initPageLoader();
  initCustomCursor();
  initNavbar();
  initHeroVanta();
  initTypewriter();
  initScrollAnimations();
  initCounters();
  initSkillsRadarChart();
  initProjectCards();
  initProjectModal();
  initContactForm();
  initBackToTopButton();
  initSmoothScroll();
});

// ============================================================================
// 3. PAGE LOADER - Hide loader after 2.5s with fade out
// ============================================================================

function initPageLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  gsap.to(loader, {
    opacity: 0,
    duration: 0.8,
    delay: 2.5,
    ease: "power2.inOut",
    onComplete: () => {
      loader.style.display = "none";
    },
  });
}

// ============================================================================
// 4. CUSTOM CURSOR - .cursor-dot and .cursor-ring follow mouse
// ============================================================================

function initCustomCursor() {
  // Hide on mobile devices
  if (window.innerWidth <= 768) return;

  const cursorDot = document.createElement("div");
  const cursorRing = document.createElement("div");

  cursorDot.className = "cursor-dot";
  cursorRing.className = "cursor-ring";

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  // Add styles dynamically
  const style = document.createElement("style");
  style.textContent = `
    .cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      background-color: #00d9ff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0, 217, 255, 0.6);
    }
    .cursor-ring {
      position: fixed;
      width: 30px;
      height: 30px;
      border: 2px solid rgba(0, 217, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transition: all 0.1s ease-out;
    }
    .cursor-ring.scaled {
      transform: scale(1.5);
      border-color: rgba(0, 217, 255, 1);
    }
  `;
  document.head.appendChild(style);

  let mouseX = 0,
    mouseY = 0;
  let dotX = 0,
    dotY = 0;
  let ringX = 0,
    ringY = 0;

  // Update cursor position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Check hover over interactive elements
  document.addEventListener("mouseover", (e) => {
    const isInteractive =
      e.target.tagName === "A" ||
      e.target.tagName === "BUTTON" ||
      e.target.classList.contains("project-card") ||
      e.target.closest("a") ||
      e.target.closest("button");
    if (isInteractive) {
      cursorRing.classList.add("scaled");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const isInteractive =
      e.target.tagName === "A" ||
      e.target.tagName === "BUTTON" ||
      e.target.classList.contains("project-card") ||
      e.target.closest("a") ||
      e.target.closest("button");
    if (isInteractive) {
      cursorRing.classList.remove("scaled");
    }
  });

  // Animate cursor with easing
  function animateCursor() {
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;

    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorDot.style.left = dotX - 4 + "px";
    cursorDot.style.top = dotY - 4 + "px";

    cursorRing.style.left = ringX - 15 + "px";
    cursorRing.style.top = ringY - 15 + "px";

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

// ============================================================================
// 5. NAVBAR - Scroll class, active links, mobile menu
// ============================================================================

function initNavbar() {
  const navbar = document.querySelector("nav");
  const navLinks = document.querySelectorAll("nav a");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (!navbar) return;

  // Add blur on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
    });
  }

  // Smooth scroll and close mobile menu on nav click
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          const navHeight = navbar.offsetHeight;
          const targetPosition = target.offsetTop - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }

        // Close mobile menu
        if (navMenu) {
          navMenu.classList.remove("active");
          if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove("active");
          }
        }
      }

      // Highlight active link
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Highlight active section on scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionId = section.getAttribute("id");
      const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
}

// ============================================================================
// 6. HERO VANTA.JS - Initialize VANTA.DOTS with navy/cyan colors
// ============================================================================

function initHeroVanta() {
  const heroBg = document.getElementById("hero-bg");
  if (!heroBg || !window.VANTA) return;

  let vantaEffect = VANTA.DOTS({
    el: heroBg,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x00d9ff,
    backgroundColor: 0x0a0e27,
    size: 3.5,
    spacing: 15.0,
    showLines: false,
  });

  // Cleanup on resize (optional)
  window.addEventListener("resize", () => {
    // vantaEffect can be kept as is; VANTA handles responsiveness
  });

  // Store reference for cleanup if needed
  window.vantaEffect = vantaEffect;
}

// ============================================================================
// 7. TYPEWRITER EFFECT - Cycle through roles with realistic delays
// ============================================================================

function initTypewriter() {
  const typewriterElement = document.querySelector(".typewriter");
  if (!typewriterElement) return;

  const roles = [
    "Principal Cloud Architect",
    "Multi-Cloud Strategist",
    "DevSecOps Leader",
    "GenAI & AI Platform Builder",
    "Platform Engineering Leader",
  ];

  let currentRoleIndex = 0;
  let isDeleting = false;
  let charIndex = 0;
  const typingSpeed = 80;
  const deletingSpeed = 50;
  const delayBetweenRoles = 2000;

  function type() {
    const currentRole = roles[currentRoleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typewriterElement.textContent = currentRole.substring(0, charIndex);

    if (!isDeleting && charIndex === currentRole.length) {
      // Finished typing, wait before deleting
      isDeleting = true;
      setTimeout(type, delayBetweenRoles);
      return;
    }

    if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next role
      isDeleting = false;
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      setTimeout(type, 500);
      return;
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(type, speed);
  }

  type();
}

// ============================================================================
// 8. SCROLL ANIMATIONS - GSAP ScrollTrigger fade-up effects
// ============================================================================

function initScrollAnimations() {
  // Fade-up animation for all .animate-on-scroll elements
  const animateElements = document.querySelectorAll(".animate-on-scroll");

  animateElements.forEach((el, index) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 50%",
        scrub: false,
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: index * 0.1,
      ease: "power2.out",
    });
  });

  // Stagger project cards
  const projectCards = document.querySelectorAll(".project-card");
  if (projectCards.length > 0) {
    gsap.from(projectCards, {
      scrollTrigger: {
        trigger: ".projects-grid",
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
    });
  }

  // Stagger skill hexagons
  const skillHexagons = document.querySelectorAll(".skill-hexagon");
  if (skillHexagons.length > 0) {
    gsap.from(skillHexagons, {
      scrollTrigger: {
        trigger: ".skills-grid",
        start: "top 80%",
      },
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out",
    });
  }

  // Stagger timeline items
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length > 0) {
    gsap.from(timelineItems, {
      scrollTrigger: {
        trigger: ".timeline",
        start: "top 80%",
      },
      opacity: 0,
      x: -50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
    });
  }

  // Stagger achievement cards
  const achievementCards = document.querySelectorAll(".achievement-card");
  if (achievementCards.length > 0) {
    gsap.from(achievementCards, {
      scrollTrigger: {
        trigger: ".achievements-grid",
        start: "top 80%",
      },
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out",
    });
  }

  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.refresh();
}

// ============================================================================
// 9. COUNTER ANIMATION - Count from 0 to target on scroll enter
// ============================================================================

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target) || 0;
        const suffix = counter.dataset.suffix || "";
        let current = 0;

        const increment = target / 50; // 50 steps for smooth animation
        const duration = 2000 / 50; // 2 second total duration

        const updateCounter = () => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + suffix;
            counter.dataset.counted = "true";
          } else {
            counter.textContent = Math.floor(current) + suffix;
            setTimeout(updateCounter, duration);
          }
        };

        updateCounter();
      }
    });
  }, observerOptions);

  counters.forEach((counter) => observer.observe(counter));
}

// ============================================================================
// 10. SKILLS RADAR CHART - Canvas 2D radar/spider chart
// ============================================================================

function initSkillsRadarChart() {
  const radarContainer = document.getElementById("skills-radar-chart");
  if (!radarContainer) return;

  const canvas = document.createElement("canvas");
  radarContainer.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // Set canvas size
  const size = Math.min(radarContainer.offsetWidth, 400);
  canvas.width = size;
  canvas.height = size;

  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size / 2.8;

  // Skill data: labels and values (0-100)
  const skills = [
    { label: "Multi-Cloud", value: 95 },
    { label: "Kubernetes/DevSecOps", value: 92 },
    { label: "GenAI/ML Platforms", value: 85 },
    { label: "Platform Engineering", value: 94 },
    { label: "FinOps & Cost Optimization", value: 88 },
    { label: "Leadership & Mentoring", value: 90 },
  ];

  const numAxes = skills.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Draw concentric circles (grid)
  for (let i = 1; i <= 5; i++) {
    const radius = (maxRadius / 5) * i;
    ctx.beginPath();
    for (let j = 0; j < numAxes; j++) {
      const angle = angleSlice * j - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(0, 217, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = "rgba(0, 217, 255, 0.2)";
  ctx.lineWidth = 1;
  for (let i = 0; i < numAxes; i++) {
    const angle = angleSlice * i - Math.PI / 2;
    const x = centerX + maxRadius * Math.cos(angle);
    const y = centerY + maxRadius * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // Draw data polygon
  ctx.fillStyle = "rgba(0, 217, 255, 0.15)";
  ctx.strokeStyle = "rgba(0, 217, 255, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < numAxes; i++) {
    const angle = angleSlice * i - Math.PI / 2;
    const value = skills[i].value / 100;
    const radius = maxRadius * value;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw data points
  ctx.fillStyle = "rgba(0, 217, 255, 1)";
  for (let i = 0; i < numAxes; i++) {
    const angle = angleSlice * i - Math.PI / 2;
    const value = skills[i].value / 100;
    const radius = maxRadius * value;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw labels
  ctx.fillStyle = "rgba(200, 200, 220, 0.9)";
  ctx.font = "11px Arial";
  ctx.textAlign = "center";
  for (let i = 0; i < numAxes; i++) {
    const angle = angleSlice * i - Math.PI / 2;
    const x = centerX + (maxRadius + 30) * Math.cos(angle);
    const y = centerY + (maxRadius + 30) * Math.sin(angle);
    ctx.fillText(skills[i].label, x, y);
  }
}

// ============================================================================
// 11. PROJECT CARDS - Vanilla Tilt 3D effect
// ============================================================================

function initProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    if (window.VanillaTilt) {
      VanillaTilt.init(card, {
        max: 15,
        speed: 400,
        scale: 1.02,
        transition: true,
      });
    }

    // Click to open modal
    card.addEventListener("click", () => {
      const projectId = card.dataset.projectId;
      openProjectModal(projectId);
    });
  });
}

// ============================================================================
// 12. PROJECT MODAL - Dynamic content, open/close with animation
// ============================================================================

function initProjectModal() {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.querySelector(".modal-close");
  const backdrop = document.querySelector(".modal-backdrop");

  if (!modal) return;

  // Close on button click
  if (closeBtn) {
    closeBtn.addEventListener("click", closeProjectModal);
  }

  // Close on backdrop click
  if (backdrop) {
    backdrop.addEventListener("click", closeProjectModal);
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProjectModal();
    }
  });
}

function openProjectModal(projectId) {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const project = projectsData.find((p) => p.id === parseInt(projectId));
  if (!project) return;

  // Populate modal content
  const modalContent = modal.querySelector(".modal-content");

  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${project.title}</h2>
      <p class="modal-subtitle">${project.subtitle}</p>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>

    <div class="modal-body">
      <div class="modal-section">
        <h3>Impact</h3>
        <p class="impact-metric">${project.impact}</p>
      </div>

      <div class="modal-section">
        <h3>Problem</h3>
        <p>${project.problem}</p>
      </div>

      <div class="modal-section">
        <h3>Solution</h3>
        <p>${project.solution}</p>
      </div>

      <div class="modal-section">
        <h3>Architecture</h3>
        <p>${project.architecture}</p>
      </div>

      <div class="modal-section">
        <h3>Technology Stack</h3>
        <div class="tech-stack">
          ${project.techStack.map((tech) => `<span class="tech-badge">${tech}</span>`).join("")}
        </div>
      </div>

      <div class="modal-section">
        <h3>Key Outcomes</h3>
        <ul class="outcomes-list">
          ${project.outcomes.map((outcome) => `<li>${outcome}</li>`).join("")}
        </ul>
      </div>

      <div class="modal-section">
        <h3>Lessons Learned</h3>
        <ul class="lessons-list">
          ${project.lessonsLearned.map((lesson) => `<li>${lesson}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  // Reattach close button listener
  const closeBtn = modalContent.querySelector(".modal-close");
  closeBtn.addEventListener("click", closeProjectModal);

  // Show modal
  modal.style.display = "flex";
  modal.classList.add("active");

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  // Animate modal in
  gsap.from(modal, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
  });
}

function closeProjectModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  gsap.to(modal, {
    opacity: 0,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => {
      modal.style.display = "none";
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    },
  });
}

// ============================================================================
// 13. CONTACT FORM - Simple mailto handler
// ============================================================================

function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showContactMessage("Please fill in all fields", "error");
      return;
    }

    // Create mailto link
    const subject = encodeURIComponent(
      `Portfolio Contact from ${name} (${email})`
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoLink = `mailto:jagannath@example.com?subject=${subject}&body=${body}`;

    // For production, replace with actual backend endpoint
    // window.location.href = mailtoLink;

    // Show success message instead
    showContactMessage(
      "Thank you for your message! I'll get back to you soon.",
      "success"
    );

    // Clear form
    contactForm.reset();

    // Log for backend integration
    console.log("Contact form submission:", { name, email, message });
  });
}

function showContactMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `contact-message contact-message-${type}`;
  messageDiv.textContent = message;

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.appendChild(messageDiv);

    // Remove message after 4 seconds
    setTimeout(() => {
      gsap.to(messageDiv, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          messageDiv.remove();
        },
      });
    }, 4000);
  }
}

// ============================================================================
// 14. SMOOTH SCROLL - Anchor links with nav offset
// ============================================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        const navbar = document.querySelector("nav");
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ============================================================================
// 15. BACK TO TOP BUTTON - Appears on scroll
// ============================================================================

function initBackToTopButton() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = "block";
      gsap.to(backToTopBtn, {
        opacity: 1,
        duration: 0.2,
      });
    } else {
      gsap.to(backToTopBtn, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          backToTopBtn.style.display = "none";
        },
      });
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Utility: Wait for element to appear in DOM
 */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

// ============================================================================
// EXPORTS & DEBUG
// ============================================================================

// Expose to window for debugging
window.Portfolio = {
  openProjectModal,
  closeProjectModal,
  projectsData,
};

console.log(
  "Portfolio.js loaded - Jagannath Panda | Principal Cloud Architect"
);
