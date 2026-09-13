import { SeededPrompt } from '../types';

export const SEEDED_PROMPTS: SeededPrompt[] = [
  // 1. Presentation / Public Speech
  {
    id: 'speech-pivot',
    scenario: 'presentation',
    title: 'The Legacy Deprecation Pivot',
    context: 'You are presenting to 150 enterprise customers and partners. You must announce the planned sunset of the legacy v1 platform that 30% of accounts rely on, while unveiling the migration roadmap for the unified v2 platform.',
    targetAudience: 'clients',
    recommendedDuration: 180,
    suggestedFocus: 'Lead with empathy for operational continuity, acknowledge the migration burden honestly, and anchor on the compounding leverage of v2.',
    stakes: 'If you sound dismissive, churn will spike. If you sound hesitant or apologetic, you undermine confidence in v2 roadmap.'
  },
  {
    id: 'speech-allhands',
    scenario: 'presentation',
    title: 'Rallying the Team After a Painful Quarter',
    context: 'In a quarterly all-hands meeting, morale is low because the team missed growth targets by 18% and had a high-visibility weekend outage. You must re-center the mission without sugarcoating or assigning blame.',
    targetAudience: 'colleagues',
    recommendedDuration: 180,
    suggestedFocus: 'Name the reality first with steady composure, highlight one uncelebrated architectural breakthrough, and set three strict operational focuses for the coming month.',
    stakes: 'Empty cheerleading breeds cynicism; harsh doom-mongering triggers attrition.'
  },
  {
    id: 'speech-budget',
    scenario: 'presentation',
    title: 'Pitching Capital Investment to the Investment Committee',
    context: 'You have 3 minutes to request $850k in infrastructure tooling and specialized engineering headcount before an executive committee that is scrutinizing every discretionary dollar.',
    targetAudience: 'leadership',
    recommendedDuration: 180,
    suggestedFocus: 'Translate technical debt into revenue risk and engineer hours lost. Contrast status-quo bleed with 6-month payback.',
    stakes: 'Getting dismissed as "just another engineering nice-to-have" will freeze the platform for the next year.'
  },

  // 2. Meeting / Professional Reply
  {
    id: 'meeting-slip',
    scenario: 'meeting',
    title: 'Answering the VP: "Why Is the Timeline Slipping?"',
    context: 'In an executive cross-functional sync, the VP of Product notices your core milestone moved out two weeks and asks directly: "We committed to this in QBR. Why are we moving the goalposts?"',
    targetAudience: 'leadership',
    recommendedDuration: 120,
    suggestedFocus: 'Take ownership without defensive deflection; separate the third-party upstream API regression from your internal discovery, and present the mitigation plan with a protected launch scope.',
    stakes: 'Defensiveness ruins credibility; throwing partners under the bus looks amateurish.'
  },
  {
    id: 'meeting-scope-creep',
    scenario: 'meeting',
    title: 'Pushing Back on Urgent Feature Creep',
    context: 'Sales leadership has pulled you into an ad-hoc meeting insisting on adding a custom SSO and reporting module to close a marquee deal before quarter end, risking existing delivery.',
    targetAudience: 'colleagues',
    recommendedDuration: 120,
    suggestedFocus: 'Validate the deal value immediately, expose the trade-off calculus clearly (what gets dropped), and offer an elegant phased compromise.',
    stakes: 'Saying flat "no" makes you a blocker; saying "yes" guarantees a catastrophic team burnout and broken launch promises.'
  },
  {
    id: 'meeting-incident',
    scenario: 'meeting',
    title: 'Leading a Calm Postmortem Debrief',
    context: 'Addressing department directors the morning after a critical data pipeline stall delayed billing runs for 4 hours.',
    targetAudience: 'leadership',
    recommendedDuration: 120,
    suggestedFocus: 'Three-beat summary: what triggered it, why detection took 22 minutes instead of 2, and the concrete guardrails being deployed today.',
    stakes: 'Losing control of the narrative will trigger micromanagement audits.'
  },

  // 3. Interview
  {
    id: 'interview-tradeoff',
    scenario: 'interview',
    title: 'Navigating Incomplete Data Under Pressure',
    context: 'The hiring committee chair asks: "Walk me through a pivotal moment where you had contradictory signals, missing user analytics, and a ticking clock. How did you decide what to ship?"',
    targetAudience: 'interview_panel',
    recommendedDuration: 180,
    suggestedFocus: 'Structure with STAR, but heavily emphasize the decision framework, the risk containment strategy, and the post-launch retrospective feedback loop.',
    stakes: 'Vague storytelling sounds fabricated; over-indexing on luck reveals poor judgment.'
  },
  {
    id: 'interview-disagreement',
    scenario: 'interview',
    title: 'Constructive Disagreement with Senior Leadership',
    context: 'The panel asks: "Tell me about a time you strongly disagreed with a principal stakeholder or VP on architectural direction. How did you handle the friction?"',
    targetAudience: 'interview_panel',
    recommendedDuration: 180,
    suggestedFocus: 'Focus on depersonalizing the debate through objective benchmark experiments, listening to their underlying constraints, and committing fully to the decision.',
    stakes: 'Coming off as combative or as a pushover will sink the leadership hire.'
  },
  {
    id: 'interview-failure',
    scenario: 'interview',
    title: 'Analyzing a Meaningful Professional Failure',
    context: 'A partner asks: "What is a project you championed that ultimately failed to meet its objectives? What was your personal responsibility, and what did you unlearn?"',
    targetAudience: 'interview_panel',
    recommendedDuration: 180,
    suggestedFocus: 'Demonstrate genuine self-awareness without false modesty; clearly trace the faulty assumption and show how your operating model changed permanently.',
    stakes: 'Deflecting blame or picking a trivial "fake failure" fails the executive maturity screen.'
  },

  // 4. Impromptu Answer
  {
    id: 'impromptu-tradeoff-allhands',
    scenario: 'impromptu',
    title: 'Town Hall Curveball: "Why This and Not Tooling?"',
    context: 'During an open Q&A mic, an engineer asks: "Leadership keeps talking about our new AI features, but our CI/CD takes 45 minutes and tests are flaky. Why are we prioritizing shiny demos over developer sanity?"',
    targetAudience: 'colleagues',
    recommendedDuration: 120,
    suggestedFocus: 'Acknowledge the frustration with complete authenticity, bridge to the shared reality of developer friction, and explain the parallel resource allocation.',
    stakes: 'A corporate boilerplate non-answer will cause immediate cynicism on Slack.'
  },
  {
    id: 'impromptu-elevator',
    scenario: 'impromptu',
    title: 'The Hallway Elevator Pitch to the CEO',
    context: 'The CEO steps into the elevator and says: "I heard your pod has been prototyping a new caching topology. What does it actually unlock for us?"',
    targetAudience: 'leadership',
    recommendedDuration: 60,
    suggestedFocus: 'Lead with the single business metric: 40% reduction in peak latency unlocking 15% higher checkout conversion. Omit low-level packet minutiae.',
    stakes: 'Getting lost in algorithmic rabbit holes causes their eyes to glaze over.'
  },
  {
    id: 'impromptu-pushback',
    scenario: 'impromptu',
    title: 'Handling a Sharp Objection in a Client Demo',
    context: 'Mid-demo, the prospective client’s CTO interrupts: "Your competitor already built this natively into their cloud tier at half the cost. Why should we even finish this meeting?"',
    targetAudience: 'clients',
    recommendedDuration: 120,
    suggestedFocus: 'Stay unruffled, validate their vigilance on cost, highlight the hidden integration and vendor-lock tax of the competitor, and anchor on your auditability guarantee.',
    stakes: 'Panicking or badmouthing the competitor kills the prospect on the spot.'
  }
];

export function getPromptsByScenario(scenario: string): SeededPrompt[] {
  return SEEDED_PROMPTS.filter(p => p.scenario === scenario);
}

export function getPromptById(id: string): SeededPrompt | undefined {
  return SEEDED_PROMPTS.find(p => p.id === id);
}
