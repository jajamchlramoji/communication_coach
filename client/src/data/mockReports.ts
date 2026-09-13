import { CoachingReport } from '../types';

export const MOCK_REPORTS: Record<string, CoachingReport> = {
  'presentation': {
    id: 'report-demo-presentation',
    sessionId: 'session-demo-pres-01',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    scenario: 'presentation',
    practiceType: 'answer_prompt',
    audience: 'clients',
    durationSeconds: 142,
    wordCount: 318,
    wordsPerMinute: 134,
    oneSentenceSummary: 'Announced the retirement of v1 and the migration path to v2, emphasizing data safety and high-throughput query performance.',
    whatPeopleWillRemember: '“We didn’t build v2 to replace your habits; we built it so your dashboards stop freezing at 9 AM on Monday.”',
    overallScore: 84,
    scorecard: {
      clarity: {
        score: 88,
        evidence: 'Directly stated the sunset date (November 15th) within the first 40 seconds, avoiding euphemisms like "transition phase".',
        benchmark: 'High executive standard: unequivocal timeline and direct rationale.'
      },
      concision: {
        score: 79,
        evidence: 'Tight delivery on the feature matrix, though the middle paragraph spent 25 seconds repeating API endpoint stability.',
        benchmark: 'Slightly wordy in the middle bridge; 30 words could be trimmed.'
      },
      structure: {
        score: 91,
        evidence: 'Followed a textbook Hook → Reality → Technical Turn → Protected Migration → Action CTA sequence.',
        benchmark: 'Clean, logical progression with zero backtracking.'
      },
      storytelling: {
        score: 82,
        evidence: 'Grounded the technical rationale in the visceral pain of Monday morning dashboard latency spikes.',
        benchmark: 'Effective sensory anchor; could have featured a specific customer anecdote.'
      },
      engagement: {
        score: 85,
        evidence: 'Anticipated client anxiety upfront regarding schema migrations, preventing skepticism from festering.',
        benchmark: 'High empathy with enterprise risk constraints.'
      },
      delivery: {
        score: 80,
        evidence: 'Paced steadily at 134 wpm. Paused effectively after stating the deprecation date to let the milestone register.',
        benchmark: 'Good vocal pacing; two slight speed rushes during the schema compatibility section.'
      },
      purposefulWit: {
        score: 86,
        evidence: 'Released tension with the self-aware line about engineer coffee consumption versus server uptime.',
        benchmark: 'Natural, understated, and directly relevant to the point.'
      }
    },
    strengths: [
      {
        title: 'Immediate Bottom-Line Upfront (BLUF)',
        explanation: 'You did not hide the sunset behind vague marketing buzzwords; you gave the exact date with total transparency.',
        quotedMoment: '“Starting November 15th, all telemetry streams will run exclusively on the v2 architecture.”',
        timestamp: '0:28'
      },
      {
        title: 'Empathetic Risk Acknowledgement',
        explanation: 'You validated how painful migration checklists are before explaining the benefits.',
        quotedMoment: '“Nobody wakes up thrilled to rewrite an ingestion script. We know the friction, which is why our automated shim handles 90% of legacy schemas.”',
        timestamp: '1:05'
      },
      {
        title: 'Clean, Concrete Value Contrast',
        explanation: 'Contrasted slow historical benchmarks with instant modern query speeds using concrete metrics.',
        quotedMoment: '“Instead of waiting 4 minutes for a batch export, queries resolve in 850 milliseconds.”',
        timestamp: '1:44'
      }
    ],
    improvements: [
      {
        priority: 1,
        area: 'Trim the Redundant Architecture Bridge',
        actionableFix: 'You explained the distributed cache mechanism twice. Replace the second iteration with a customer guarantee.',
        contrastExample: {
          before: '“So as I mentioned, the cache is distributed across regions, and that distribution gives regional redundancy so regions do not fail.”',
          after: '“Every query is redundantly mirrored across two live regions with zero failover penalty.”'
        }
      },
      {
        priority: 2,
        area: 'Strengthen the Final Call to Action',
        actionableFix: 'Your conclusion trailed off with "so please reach out if you have questions." Make it an explicit invitation to the test sandbox.',
        contrastExample: {
          before: '“So yeah, please let our team know if there are any questions or issues with the beta.”',
          after: '“Open the migration tab in your console today. Run one canary query. If it isn’t 3x faster, ping me directly.”'
        }
      },
      {
        priority: 3,
        area: 'Eliminate Transitional Fillers During Technical Detail',
        actionableFix: 'Used "basically" and "kind of" three times when introducing the schema translator.',
        contrastExample: {
          before: '“The schema converter is basically kind of doing the translation on the fly for you.”',
          after: '“The schema converter translates legacy JSON payloads on the fly.”'
        }
      }
    ],
    frictionSpots: {
      fillerWords: {
        totalCount: 7,
        densityPer100Words: 2.2,
        breakdown: { 'basically': 3, 'you know': 2, 'kind of': 2 }
      },
      repeatedPhrases: ['as I said earlier', 'moving forward'],
      runOnSentences: ['The v2 pipeline is built from scratch with rust workers and it handles the streaming events without dropping a packet even when spikes hit twelve thousand per second and that means your reports never lag.'],
      weakTransitions: ['So another thing is...', 'Also on that note...'],
      jargonTerms: ['synergistic ingestion', 'paradigm shift'],
      vagueClaims: ['performance is massively improved across the board'],
      missedConclusions: ['trailing off at the end of the data safety section without a firm takeaway']
    },
    storyMap: [
      {
        stage: 'hook',
        label: 'Hook',
        present: true,
        quotedText: '“Last year our telemetry system processed 4 billion events, and on Cyber Monday, our dashboards froze for 14 minutes.”',
        feedback: 'Superb opening. Instantly relatable and honest about the operational problem.'
      },
      {
        stage: 'context',
        label: 'Context',
        present: true,
        quotedText: '“Our v1 architecture was designed in 2021 when 100k requests per minute felt like a mountain.”',
        feedback: 'Good historical context explaining why v1 had to evolve.'
      },
      {
        stage: 'tension',
        label: 'Tension / Problem',
        present: true,
        quotedText: '“We hit the physical ceiling of that design. Patching it was like putting race tires on a lawnmower.”',
        feedback: 'Vivid tension and memorable analogy.'
      },
      {
        stage: 'insight',
        label: 'Insight / Turn',
        present: true,
        quotedText: '“Instead of patching the query engine, we decoupled event ingestion entirely from real-time aggregation.”',
        feedback: 'Clear technical pivot.'
      },
      {
        stage: 'concrete_example',
        label: 'Concrete Example',
        present: true,
        quotedText: '“In our early test with Acme Corp, their hourly ETL dropped from 42 minutes to 3.8 minutes.”',
        feedback: 'Concrete metric that proves the value proposition.'
      },
      {
        stage: 'takeaway',
        label: 'Takeaway / CTA',
        present: false,
        quotedText: undefined,
        feedback: 'Missing a crisp, authoritative closing instruction. Ended on an informal conversational note.'
      }
    ],
    engagementRisks: [
      {
        riskType: 'abstraction_overload',
        severity: 'medium',
        observedPattern: 'At 1:12, you spent 20 seconds listing protocol specs (gRPC vs HTTP/2) without linking it to customer value.',
        timestampEstimate: '1:12',
        mitigation: 'Ground protocol specs in customer impact: "gRPC means your background sync uses 60% less battery."'
      },
      {
        riskType: 'sudden_stop',
        severity: 'low',
        observedPattern: 'Your final sentence dropped in volume and ended on an uncertain pitch.',
        timestampEstimate: '2:15',
        mitigation: 'Deliver the final action sentence with a downward inflection.'
      }
    ],
    memorableRewrite: {
      strongerOpening: {
        original: '“Hello everyone, thanks for joining today. Today I wanted to share an update about the roadmap and talk about our v1 and v2 platforms.”',
        recommended: '“Last year on Cyber Monday, our dashboards froze for 14 minutes. Today, I’m showing you the system that guarantees it will never happen again.”',
        technique: 'Contrast past pain with today’s decisive solution within the first 10 seconds.'
      },
      strongerBridge: {
        original: '“So yeah, another thing about the architecture is that we changed the way schemas are handled.”',
        recommended: '“Speed means nothing if your data breaks on arrival. That’s why the schema translator runs in parallel.”',
        technique: 'Name the hidden fear (broken data) before presenting the architectural shield.'
      },
      vividAnalogy: {
        ideaTargeted: 'Explaining why v1 cannot simply be patched anymore.',
        analogyText: '“Patching v1 was like bolting jet engines onto a bicycle. The frame was simply shaking apart.”',
        whyItWorks: 'Physical, visual, and instantly clarifies why a clean break to v2 is necessary.'
      },
      strongerClosing: {
        original: '“So that’s pretty much the gist of it, let us know if you run into any issues with the migration sandbox.”',
        recommended: '“Open the migration tab today. Run one canary test. If it doesn’t save you an hour by Friday, my calendar is open.”',
        technique: 'Personal commitment and a time-bound challenge.'
      }
    },
    lighterMoment: {
      mechanism: 'self_aware_understatement',
      explanation: 'Release tension right after the deprecation date announcement by acknowledging engineer sentiment without cynicism.',
      suggestedMoment: 'Immediately after saying "sunset date is November 15th"',
      suggestedLine: '“I know changing an API is everyone’s third favorite thing right after root canals and calendar invites with no agenda.”',
      ruleOfThumb: 'Acknowledge the shared annoyance with warm solidarity, then immediately move forward.'
    },
    replayTranscript: [
      {
        id: 't-1',
        speaker: 'user',
        text: 'Last year our telemetry system processed 4 billion events, and on Cyber Monday, our dashboards froze for 14 minutes.',
        timestampMs: 0,
        highlightType: 'hook',
        coachingNote: 'Exceptional hook: high stakes, clear numbers, immediate vulnerability.'
      },
      {
        id: 't-2',
        speaker: 'user',
        text: 'Our v1 architecture was designed in 2021 when 100k requests per minute felt like a mountain.',
        timestampMs: 8000,
        highlightType: 'strength',
        coachingNote: 'Good historical perspective.'
      },
      {
        id: 't-3',
        speaker: 'user',
        text: 'We basically hit the ceiling of that design and patching it was kind of like putting race tires on a lawnmower.',
        timestampMs: 16000,
        highlightType: 'filler',
        coachingNote: 'Great metaphor, but remove "basically" and "kind of". State it with certainty.',
        alternativeSuggestion: '“We hit the ceiling of that design. Patching it was like putting race tires on a lawnmower.”'
      },
      {
        id: 't-4',
        speaker: 'user',
        text: 'Starting November 15th, all telemetry streams will run exclusively on the v2 architecture.',
        timestampMs: 28000,
        highlightType: 'strength',
        coachingNote: 'Direct, clear delivery.'
      },
      {
        id: 't-5',
        speaker: 'user',
        text: 'Nobody wakes up thrilled to rewrite an ingestion script. We know the friction, which is why our automated shim handles 90% of legacy schemas.',
        timestampMs: 42000,
        highlightType: 'strength',
        coachingNote: 'Empathy builds trust with technical clients.'
      },
      {
        id: 't-6',
        speaker: 'user',
        text: 'The v2 pipeline is built from scratch with rust workers and it handles the streaming events without dropping a packet even when spikes hit twelve thousand per second and that means your reports never lag.',
        timestampMs: 65000,
        highlightType: 'run_on',
        coachingNote: 'Run-on sentence. Split into two punchy statements to allow breathing room.',
        alternativeSuggestion: '“The v2 pipeline is rebuilt in Rust. It absorbs 12,000 spikes per second with zero packet loss. Your reports never lag.”'
      },
      {
        id: 't-7',
        speaker: 'user',
        text: 'In our early test with Acme Corp, their hourly ETL dropped from 42 minutes to 3.8 minutes.',
        timestampMs: 95000,
        highlightType: 'example',
        coachingNote: 'Concrete proof point.'
      },
      {
        id: 't-8',
        speaker: 'user',
        text: 'So that is pretty much what we have, please reach out if there are questions.',
        timestampMs: 135000,
        highlightType: 'closing',
        coachingNote: 'Weak ending. End with an actionable prompt.',
        alternativeSuggestion: '“Run one test in the sandbox this week. See the speed for yourself.”'
      }
    ],
    retryExercise: {
      focusedSkill: 'Authoritative Closing Action',
      goal: 'Deliver a 30-second concluding call-to-action that ends on a crisp declarative sentence without trailing fillers.',
      prompt: 'Summarize the v2 migration in 2 sentences and challenge the client to run a 5-minute sandbox test today.',
      successCondition: 'Ends with zero trailing fillers and an exact time-bound next step.'
    },
    visualDeliverySignals: {
      gazeAlignmentScore: 88,
      headMovementLevel: 'balanced',
      framingStatus: 'centered',
      visibleEnergy: 'dynamic',
      lastCue: 'Steady framing and direct camera alignment observed.'
    }
  },

  'meeting': {
    id: 'report-demo-meeting',
    sessionId: 'session-demo-meet-01',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    scenario: 'meeting',
    practiceType: 'answer_prompt',
    audience: 'leadership',
    durationSeconds: 98,
    wordCount: 224,
    wordsPerMinute: 137,
    oneSentenceSummary: 'Addressed the 2-week timeline slip by separating upstream API dependencies from internal work and presenting a protected MVP scope.',
    whatPeopleWillRemember: '“The delay isn’t from writing code; it’s from waiting on security tokens from our payment vendor.”',
    overallScore: 87,
    scorecard: {
      clarity: {
        score: 92,
        evidence: 'Answered the VP’s question in the first 6 seconds without dodging or blaming.',
        benchmark: 'Exemplary executive presence and ownership.'
      },
      concision: {
        score: 88,
        evidence: 'Kept the total explanation under 100 seconds with two distinct chapters.',
        benchmark: 'High concision; respected the meeting tempo.'
      },
      structure: {
        score: 90,
        evidence: 'Direct Answer → Root Cause Distinction → Concrete Mitigation Plan.',
        benchmark: 'Structured problem-solving format.'
      },
      storytelling: {
        score: 75,
        evidence: 'Focused predominantly on operational logic; had one vivid metaphor about passing security gates.',
        benchmark: 'Appropriate for an internal operations sync.'
      },
      engagement: {
        score: 86,
        evidence: 'Acknowledged the VP’s QBR commitment explicitly, validating their concern.',
        benchmark: 'Direct alignment with executive stakes.'
      },
      delivery: {
        score: 84,
        evidence: 'Controlled cadence, low vocal tension, grounded pause before answering.',
        benchmark: 'Calm under scrutiny.'
      },
      purposefulWit: {
        score: 80,
        evidence: 'Quiet understatement regarding vendor compliance turnaround times.',
        benchmark: 'Tasteful, restrained, and avoided bitterness.'
      }
    },
    strengths: [
      {
        title: 'Zero Defensiveness',
        explanation: 'You immediately took ownership of the schedule adjustment without blaming team members.',
        quotedMoment: '“The date moved out two weeks. Here is exactly what changed and how we protect the core release.”',
        timestamp: '0:04'
      },
      {
        title: 'Bifurcated Root Cause',
        explanation: 'You clearly separated internal engineering (which is on schedule) from external vendor certification.',
        quotedMoment: '“Our core checkout engine completed QA on Tuesday. What is holding the lock is Stripe’s Level 1 compliance sign-off.”',
        timestamp: '0:32'
      },
      {
        title: 'Hard Mitigation Boundary',
        explanation: 'You proposed an explicit compromise rather than just asking for an extension.',
        quotedMoment: '“We are decoupling the secondary payment rails so the primary launch stays on track for the 18th.”',
        timestamp: '1:10'
      }
    ],
    improvements: [
      {
        priority: 1,
        area: 'Quantify the Impact on Downstream Teams',
        actionableFix: 'Mention how this 2-week shift affects marketing and sales enablement before the VP has to ask.',
        contrastExample: {
          before: '“So we need two more weeks to finish testing.”',
          after: '“Marketing’s campaign is held for 10 days, but customer onboarding docs will be in their hands by Monday.”'
        }
      },
      {
        priority: 2,
        area: 'Remove Tentative Language Around Vendor Dates',
        actionableFix: 'Replace "we are hoping they reply tomorrow" with firm escalation status.',
        contrastExample: {
          before: '“We are kind of hoping the vendor sends back the keys by Thursday.”',
          after: '“Our VP of Partnerships escalated this to their Head of Solutions; our SLA callback is at 2 PM today.”'
        }
      },
      {
        priority: 3,
        area: 'Close with a Defined Check-in Point',
        actionableFix: 'Specify when you will send the next delta update.',
        contrastExample: {
          before: '“I will let you know when we hear back.”',
          after: '“I will post a green/yellow status update in leadership-sync at 4 PM today.”'
        }
      }
    ],
    frictionSpots: {
      fillerWords: {
        totalCount: 4,
        densityPer100Words: 1.8,
        breakdown: { 'um': 2, 'basically': 2 }
      },
      repeatedPhrases: ['on our end'],
      runOnSentences: [],
      weakTransitions: ['So yeah...'],
      jargonTerms: ['bandwidth constraints'],
      vagueClaims: ['we are working hard to expedite things'],
      missedConclusions: []
    },
    storyMap: [
      {
        stage: 'hook',
        label: 'Hook / Stance',
        present: true,
        quotedText: '“The timeline moved two weeks, and that is my responsibility. Here is the operational reality.”',
        feedback: 'Decisive executive stance.'
      },
      {
        stage: 'context',
        label: 'Context',
        present: true,
        quotedText: '“We committed to the 4th during QBR based on automated sandbox tests.”',
        feedback: 'Acknowledged prior commitment.'
      },
      {
        stage: 'tension',
        label: 'Tension / Block',
        present: true,
        quotedText: '“Production certification surfaced a token revocation bottleneck with our partner.”',
        feedback: 'Clear technical bottleneck.'
      },
      {
        stage: 'insight',
        label: 'Insight / Turn',
        present: true,
        quotedText: '“Rather than wait for full dual-rail approval, we are gating secondary rails behind a feature flag.”',
        feedback: 'Strategic solution.'
      },
      {
        stage: 'concrete_example',
        label: 'Concrete Example',
        present: true,
        quotedText: '“This unblocks 92% of domestic card transactions on schedule.”',
        feedback: 'Compelling concrete ratio.'
      },
      {
        stage: 'takeaway',
        label: 'Takeaway / Commit',
        present: true,
        quotedText: '“I will post the sign-off verification in Slack by 4 PM.”',
        feedback: 'Clear deliverable.'
      }
    ],
    engagementRisks: [
      {
        riskType: 'unclear_stakes',
        severity: 'low',
        observedPattern: 'Risk was mitigated quickly; executive listener stayed focused.',
        mitigation: 'Continue framing technical slips in terms of protected business value.'
      }
    ],
    memorableRewrite: {
      strongerOpening: {
        original: '“Um, so regarding the question about the date slipping two weeks, there were some things that came up with Stripe.”',
        recommended: '“The timeline moved two weeks, and that is on me. Here is what changed, why we did it, and how we protect the core launch.”',
        technique: 'Lead with extreme ownership and an orderly roadmap.'
      },
      strongerBridge: {
        original: '“And then basically we had to figure out what to do with the other payment methods.”',
        recommended: '“Rather than let one vendor block the entire ship, we quarantined their dependency.”',
        technique: 'Use active agency verbs (quarantined) over passive ones (we had to figure out).'
      },
      vividAnalogy: {
        ideaTargeted: 'Explaining the feature flag decoupling.',
        analogyText: '“It’s like opening the main express lanes on the bridge while the toll booth finishing work happens on the side.”',
        whyItWorks: 'Physical and intuitive for non-technical executives.'
      },
      strongerClosing: {
        original: '“So we should be good for the 18th hopefully.”',
        recommended: '“Domestic checkout launches on the 18th. Next status drops in your inbox at 4 PM.”',
        technique: 'Certainty and operational accountability.'
      }
    },
    lighterMoment: {
      mechanism: 'understated_contrast',
      explanation: 'Highlight the contrast between rapid internal code velocity and vendor compliance bureaucracies.',
      suggestedMoment: 'When describing the vendor sign-off queue',
      suggestedLine: '“Our engineers rewrote the gateway in two days; their compliance department needs twelve days to review their own logo.”',
      ruleOfThumb: 'Keep it gentle and self-aware; do not sound bitter.'
    },
    replayTranscript: [
      {
        id: 'tm-1',
        speaker: 'user',
        text: 'The timeline moved two weeks, and that is my responsibility. Here is the operational reality.',
        timestampMs: 0,
        highlightType: 'hook',
        coachingNote: 'Decisive, executive opening. Calms the room.'
      },
      {
        id: 'tm-2',
        speaker: 'user',
        text: 'Our core checkout engine completed QA on Tuesday. What is holding the lock is Stripe’s Level 1 compliance sign-off.',
        timestampMs: 14000,
        highlightType: 'strength',
        coachingNote: 'Specific root cause.'
      },
      {
        id: 'tm-3',
        speaker: 'user',
        text: 'Rather than wait for full dual-rail approval, we are basically gating secondary rails behind a feature flag.',
        timestampMs: 35000,
        highlightType: 'filler',
        coachingNote: 'Remove "basically". The strategic pivot is strong on its own.',
        alternativeSuggestion: '“Rather than wait for full dual-rail approval, we are gating secondary rails behind a feature flag.”'
      },
      {
        id: 'tm-4',
        speaker: 'user',
        text: 'This unblocks 92% of domestic card transactions on schedule.',
        timestampMs: 58000,
        highlightType: 'example',
        coachingNote: 'High impact metric.'
      },
      {
        id: 'tm-5',
        speaker: 'user',
        text: 'Domestic checkout launches on the 18th. Status report in leadership-sync at 4 PM.',
        timestampMs: 82000,
        highlightType: 'closing',
        coachingNote: 'Clean, reliable finish.'
      }
    ],
    retryExercise: {
      focusedSkill: 'Direct Question Answering (BLUF)',
      goal: 'Answer a pointed question in under 10 seconds without preamble before transitioning to the data.',
      prompt: 'A director asks: "Can we still make the Q3 revenue target with this delay?" Answer in 45 seconds.',
      successCondition: 'Direct yes/no/conditioned answer in sentence 1, backed by 2 crisp numbers.'
    },
    visualDeliverySignals: {
      gazeAlignmentScore: 92,
      headMovementLevel: 'balanced',
      framingStatus: 'centered',
      visibleEnergy: 'calm',
      lastCue: 'Calm composure and steady eye contact maintained.'
    }
  },

  'interview': {
    id: 'report-demo-interview',
    sessionId: 'session-demo-int-01',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    scenario: 'interview',
    practiceType: 'answer_prompt',
    audience: 'interview_panel',
    durationSeconds: 165,
    wordCount: 380,
    wordsPerMinute: 138,
    oneSentenceSummary: 'Walked through a high-stakes trade-off under incomplete data when launching a fraud prevention heuristic before Black Friday.',
    whatPeopleWillRemember: '“I chose to accept 1% false declines over a catastrophic $2M fraud exposure on Black Friday.”',
    overallScore: 89,
    scorecard: {
      clarity: {
        score: 90,
        evidence: 'Organized with explicit chapter markers: Context, Incomplete Signal, Decision Rule, Retrospective.',
        benchmark: 'Top-tier interview signaling.'
      },
      concision: {
        score: 84,
        evidence: 'Slightly detailed on database indexes during the middle section.',
        benchmark: 'Avoided drowning the interviewer in low-level schema details.'
      },
      structure: {
        score: 93,
        evidence: 'Classic STAR with deep emphasis on the Action and Result metrics.',
        benchmark: 'Textbook behavioral interview architecture.'
      },
      storytelling: {
        score: 88,
        evidence: 'Painted the ticking clock of Black Friday weekend with sharp clarity.',
        benchmark: 'Compelling stakes that kept the panel leaning in.'
      },
      engagement: {
        score: 91,
        evidence: 'Checked in with the panel after the architecture section to gauge interest in going deeper.',
        benchmark: 'Collaborative interview presence.'
      },
      delivery: {
        score: 86,
        evidence: 'Smooth vocal control with natural pauses between chapters.',
        benchmark: 'Natural, poised conversational cadence.'
      },
      purposefulWit: {
        score: 83,
        evidence: 'Self-aware humor regarding the luxury of hindsight when analyzing logs.',
        benchmark: 'Subtle and humble without diminishing competency.'
      }
    },
    strengths: [
      {
        title: 'Signposting the Architecture',
        explanation: 'You gave the interview panel a mental map of your story within the first 15 seconds.',
        quotedMoment: '“I’ll break this down into three parts: the signal ambiguity, the trade-off calculus, and the guardrails we built.”',
        timestamp: '0:12'
      },
      {
        title: 'Explicit Decision Framework',
        explanation: 'You showed executive decision-making under uncertainty instead of claiming you knew the right answer all along.',
        quotedMoment: '“We didn’t have enough telemetry to prove the fraud ring’s origin, so we optimized for reversible blast radius.”',
        timestamp: '0:58'
      },
      {
        title: 'Measurable Outcome & Humility',
        explanation: 'You shared both the successful prevention and the collateral false positive rate honestly.',
        quotedMoment: '“We prevented an estimated $1.8M in chargebacks, but generated 42 false positive tickets that required VIP outreach.”',
        timestamp: '1:52'
      }
    ],
    improvements: [
      {
        priority: 1,
        area: 'Delineate Personal Leadership vs Team Work',
        actionableFix: 'Use "I" when explaining the final threshold choice and "we" for implementation.',
        contrastExample: {
          before: '“We kind of all decided to lower the threshold together.”',
          after: '“While the engineering team debated the telemetry, I made the call to lower the threshold to 0.75.”'
        }
      },
      {
        priority: 2,
        area: 'Trim Database Minutiae',
        actionableFix: 'Skip mentions of Postgres B-tree index scans; the panel wanted decision logic, not SQL tuning.',
        contrastExample: {
          before: '“We had to re-index the table using a partial composite index so the query planner wouldn’t sequential scan.”',
          after: '“We optimized our detection queries to return answers in sub-50 milliseconds.”'
        }
      },
      {
        priority: 3,
        area: 'Punchier Closing Reflection',
        actionableFix: 'End on the foundational principle you now carry into every architectural decision.',
        contrastExample: {
          before: '“So that was pretty much that experience and what happened.”',
          after: '“That experience taught me my core rule: in high-uncertainty crises, optimize for reversibility over perfection.”'
        }
      }
    ],
    frictionSpots: {
      fillerWords: {
        totalCount: 5,
        densityPer100Words: 1.3,
        breakdown: { 'like': 2, 'you know': 2, 'so': 1 }
      },
      repeatedPhrases: ['at the end of the day'],
      runOnSentences: [],
      weakTransitions: ['Moving on to the next part...'],
      jargonTerms: ['heuristics vector'],
      vagueClaims: [],
      missedConclusions: []
    },
    storyMap: [
      {
        stage: 'hook',
        label: 'Hook',
        present: true,
        quotedText: '“It was 72 hours before Black Friday when our risk engine showed a 400% anomaly in new account velocity.”',
        feedback: 'Immediate high-stakes drama.'
      },
      {
        stage: 'context',
        label: 'Context',
        present: true,
        quotedText: '“We had just rolled out 1-click checkout to 8 million users.”',
        feedback: 'Clear scope of exposure.'
      },
      {
        stage: 'tension',
        label: 'Tension',
        present: true,
        quotedText: '“Aggressive blocking would kill legitimate sales; passive logging would allow millions in chargeback fraud.”',
        feedback: 'Sharply defined dilemma.'
      },
      {
        stage: 'insight',
        label: 'Insight',
        present: true,
        quotedText: '“I realized we didn’t need a binary block; we could introduce targeted step-up verification for suspicious devices.”',
        feedback: 'Elegant third option created under pressure.'
      },
      {
        stage: 'concrete_example',
        label: 'Concrete Example',
        present: true,
        quotedText: '“We flagged 4,200 transactions and resolved 96% of authentic buyers via SMS in under 12 seconds.”',
        feedback: 'Detailed proof point.'
      },
      {
        stage: 'takeaway',
        label: 'Takeaway',
        present: true,
        quotedText: '“When you cannot eliminate risk, make the cost of false positives low and reversible.”',
        feedback: 'World-class leadership takeaway.'
      }
    ],
    engagementRisks: [],
    memorableRewrite: {
      strongerOpening: {
        original: '“So a time I had to make a decision without data was when I was working on the risk team before Black Friday.”',
        recommended: '“Seventy-two hours before Black Friday, our risk charts spiked 400%. We had three days to choose between losing revenue to fraud or losing customers to false alarms.”',
        technique: 'Contrast the two nightmare scenarios immediately.'
      },
      strongerBridge: {
        original: '“And then we discussed it in the room for a couple of hours.”',
        recommended: '“Instead of arguing hypotheticals, I whiteboarded the blast radius of both mistakes side-by-side.”',
        technique: 'Show visual leadership in action.'
      },
      vividAnalogy: {
        ideaTargeted: 'Step-up authentication mechanism.',
        analogyText: '“Rather than slamming the fortress gate shut, we posted a polite guard at the door checking IDs.”',
        whyItWorks: 'Memorable mental model for fraud moderation.'
      },
      strongerClosing: {
        original: '“So we got through Black Friday and that was pretty much how I handled it.”',
        recommended: '“That sprint codified my leadership rule: when information is incomplete, pick the path that is cheapest to undo.”',
        technique: 'End with an enduring leadership maxim.'
      }
    },
    lighterMoment: {
      mechanism: 'self_aware_understatement',
      explanation: 'Release the interview tension after describing the frantic pre-holiday war room.',
      suggestedMoment: 'When describing sleeping near the laptop',
      suggestedLine: '“Our primary metric that week was fraud prevention; our secondary metric was team espresso consumption.”',
      ruleOfThumb: 'Show team warmth and camaraderie without sounding reckless.'
    },
    replayTranscript: [
      {
        id: 'ti-1',
        speaker: 'user',
        text: 'It was 72 hours before Black Friday when our risk engine showed a 400% anomaly in new account velocity.',
        timestampMs: 0,
        highlightType: 'hook',
        coachingNote: 'Compelling, cinematic opening.'
      },
      {
        id: 'ti-2',
        speaker: 'user',
        text: 'I will break this down into three parts: the signal ambiguity, the trade-off calculus, and the guardrails we built.',
        timestampMs: 12000,
        highlightType: 'strength',
        coachingNote: 'Signposting helps interviewers follow easily.'
      },
      {
        id: 'ti-3',
        speaker: 'user',
        text: 'Aggressive blocking would kill legitimate sales; passive logging would allow millions in chargeback fraud.',
        timestampMs: 38000,
        highlightType: 'tension',
        coachingNote: 'Crisp articulation of the trade-off.'
      },
      {
        id: 'ti-4',
        speaker: 'user',
        text: 'While the team debated, I made the call to lower the threshold to 0.75 with step-up verification.',
        timestampMs: 78000,
        highlightType: 'strength',
        coachingNote: 'Clear ownership.'
      },
      {
        id: 'ti-5',
        speaker: 'user',
        text: 'That experience taught me: when you cannot eliminate risk, make the cost of false positives low and reversible.',
        timestampMs: 155000,
        highlightType: 'closing',
        coachingNote: 'Memorable principle.'
      }
    ],
    retryExercise: {
      focusedSkill: 'Signposting Complex Stories',
      goal: 'Deliver the first 25 seconds of an answer by stating the thesis and outlining your 3 story chapters.',
      prompt: 'Describe a time you inherited a failing project and turned it around in 60 days.',
      successCondition: 'Thesis + 3 signposted points delivered under 25 seconds.'
    },
    visualDeliverySignals: {
      gazeAlignmentScore: 94,
      headMovementLevel: 'balanced',
      framingStatus: 'centered',
      visibleEnergy: 'dynamic',
      lastCue: 'Engaging, grounded visual presence.'
    }
  },

  'impromptu': {
    id: 'report-demo-impromptu',
    sessionId: 'session-demo-imp-01',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    scenario: 'impromptu',
    practiceType: 'answer_prompt',
    audience: 'colleagues',
    durationSeconds: 78,
    wordCount: 185,
    wordsPerMinute: 142,
    oneSentenceSummary: 'Answered a town hall curveball about developer tooling versus AI investments with empathy, balanced resource realities, and a concrete CI pipeline fix.',
    whatPeopleWillRemember: '“We aren’t trading engineer happiness for shiny marketing demos; developer speed is what finances our experiments.”',
    overallScore: 88,
    scorecard: {
      clarity: {
        score: 91,
        evidence: 'Validated the engineer’s complaint without defensive PR rhetoric.',
        benchmark: 'Authentic impromptu credibility.'
      },
      concision: {
        score: 87,
        evidence: 'Finished in 78 seconds; avoided getting bogged down in budget allocation details.',
        benchmark: 'High impact town hall timing.'
      },
      structure: {
        score: 89,
        evidence: 'Used Empathy → Dual-Track Reality → Concrete Next Step structure.',
        benchmark: 'Instant impromptu framework deployment.'
      },
      storytelling: {
        score: 80,
        evidence: 'Referred to the frustration of waiting 45 minutes for a CI build while watching coffee get cold.',
        benchmark: 'Relatable everyday pain point.'
      },
      engagement: {
        score: 93,
        evidence: 'Connected deeply with engineer morale in the room.',
        benchmark: 'Exceptional emotional resonance.'
      },
      delivery: {
        score: 85,
        evidence: 'Unflustered pause before replying, steady vocal cadence.',
        benchmark: 'Poised under pressure.'
      },
      purposefulWit: {
        score: 87,
        evidence: 'Dry quip about watching Jenkins spinning wheels as an Olympic sport.',
        benchmark: 'Broke tension and united the room.'
      }
    },
    strengths: [
      {
        title: 'Immediate Emotional Validation',
        explanation: 'You did not dismiss the question as negative; you leaned in with genuine solidarity.',
        quotedMoment: '“You are 100% right: a 45-minute build time is a tax on everyone’s sanity.”',
        timestamp: '0:03'
      },
      {
        title: 'Reframing the False Dichotomy',
        explanation: 'You showed why product investment and infrastructure investment are mutually reinforcing, not competitors.',
        quotedMoment: '“It’s not either/or. Fast tooling is the engine that allows our product experiments to survive.”',
        timestamp: '0:28'
      },
      {
        title: 'Actionable Allocation Pledge',
        explanation: 'Gave a specific team and timeline rather than a vague corporate promise.',
        quotedMoment: '“Platform team has two dedicated engineers starting Monday focused solely on test parallelism to cut that time to 12 minutes.”',
        timestamp: '0:54'
      }
    ],
    improvements: [
      {
        priority: 1,
        area: 'Avoid Dismissing the Questioner’s Tone',
        actionableFix: 'Keep focus entirely on the operational reality.',
        contrastExample: {
          before: '“I know people get emotional about this...”',
          after: '“Every developer in this room feels that friction every day.”'
        }
      },
      {
        priority: 2,
        area: 'Offer an Open Channel for Feedback',
        actionableFix: 'Invite the team to join the bi-weekly platform retro.',
        contrastExample: {
          before: '“So trust us, we are working on it.”',
          after: '“Join our platform retro this Thursday at 2 PM to see the initial PR benchmark.”'
        }
      },
      {
        priority: 3,
        area: 'Land the Final Sentence with Quiet Confidence',
        actionableFix: 'No trailing "hope that helps answer your question".',
        contrastExample: {
          before: '“So yeah, hope that makes sense.”',
          after: '“We will fix the builds first, then ship the future together.”'
        }
      }
    ],
    frictionSpots: {
      fillerWords: {
        totalCount: 3,
        densityPer100Words: 1.6,
        breakdown: { 'um': 1, 'like': 2 }
      },
      repeatedPhrases: [],
      runOnSentences: [],
      weakTransitions: [],
      jargonTerms: [],
      vagueClaims: [],
      missedConclusions: []
    },
    storyMap: [
      {
        stage: 'hook',
        label: 'Hook',
        present: true,
        quotedText: '“You are 100% right: a 45-minute build time is an unacceptable tax on developer sanity.”',
        feedback: 'Instant disarming honesty.'
      },
      {
        stage: 'context',
        label: 'Context',
        present: true,
        quotedText: '“Our repository tripled in code volume over the last two quarters.”',
        feedback: 'Simple context.'
      },
      {
        stage: 'tension',
        label: 'Tension',
        present: true,
        quotedText: '“It feels like leadership only cares about external demos while internal friction mounts.”',
        feedback: 'Voiced the unspoken elephant in the room.'
      },
      {
        stage: 'insight',
        label: 'Insight',
        present: true,
        quotedText: '“Developer tooling is not a cost center; it is our foundation.”',
        feedback: 'Values re-alignment.'
      },
      {
        stage: 'concrete_example',
        label: 'Concrete Example',
        present: true,
        quotedText: '“Two engineers are staffed full-time on test sharding to bring build times under 12 minutes.”',
        feedback: 'Hard commitment.'
      },
      {
        stage: 'takeaway',
        label: 'Takeaway',
        present: true,
        quotedText: '“Hold me accountable to that 12-minute target by end of month.”',
        feedback: 'Leadership courage.'
      }
    ],
    engagementRisks: [],
    memorableRewrite: {
      strongerOpening: {
        original: '“Um, yeah, so I know people have been asking why we are building AI when CI is slow.”',
        recommended: '“You are completely right. A 45-minute build isn’t just slow; it’s an insult to your focus.”',
        technique: 'Disarm tension by agreeing with the truth of the problem.'
      },
      strongerBridge: {
        original: '“And so we talked to management and decided to assign some people to it.”',
        recommended: '“We stopped treating developer tooling as background maintenance and funded it like a tier-one product.”',
        technique: 'Elevate the priority level with strong vocabulary.'
      },
      vividAnalogy: {
        ideaTargeted: 'Slow build times delaying company momentum.',
        analogyText: '“You can’t drive a Formula 1 car if the pit stop takes an hour.”',
        whyItWorks: 'Visceral reminder that infrastructure enables speed.'
      },
      strongerClosing: {
        original: '“So hopefully by next month it will be better.”',
        recommended: '“Watch the CI dashboard on Friday. If it isn’t under 15 minutes, come to my desk and call me on it.”',
        technique: 'Personal, vulnerable accountability.'
      }
    },
    lighterMoment: {
      mechanism: 'surprising_comparison',
      explanation: 'Understated quip on build delays.',
      suggestedMoment: 'After mentioning 45-minute CI runs',
      suggestedLine: '“At 45 minutes, compiling code isn’t a build step; it’s a full lunch break and a lifestyle choice.”',
      ruleOfThumb: 'Shared laughter at the absurdity of the pain point.'
    },
    replayTranscript: [
      {
        id: 'tp-1',
        speaker: 'user',
        text: 'You are 100% right: a 45-minute build time is an unacceptable tax on developer sanity.',
        timestampMs: 0,
        highlightType: 'hook',
        coachingNote: 'Direct, disarming acknowledgment.'
      },
      {
        id: 'tp-2',
        speaker: 'user',
        text: 'Developer tooling is not a cost center; it is our foundation.',
        timestampMs: 22000,
        highlightType: 'strength',
        coachingNote: 'Resets the narrative.'
      },
      {
        id: 'tp-3',
        speaker: 'user',
        text: 'Two engineers are dedicated full-time to test sharding starting Monday to bring builds under 12 minutes.',
        timestampMs: 46000,
        highlightType: 'example',
        coachingNote: 'Concrete resource commitment.'
      },
      {
        id: 'tp-4',
        speaker: 'user',
        text: 'Hold me accountable to that 12-minute target by the end of the month.',
        timestampMs: 70000,
        highlightType: 'closing',
        coachingNote: 'High credibility finish.'
      }
    ],
    retryExercise: {
      focusedSkill: 'Disarming Hostile Questions',
      goal: 'Acknowledge an aggressive question with calm empathy within the first 5 seconds, avoiding defensive pushback.',
      prompt: 'A client asks: "Why did your platform fail our security audit on Friday?" Answer in 45 seconds.',
      successCondition: 'No excuses; immediate ownership and mitigation plan.'
    },
    visualDeliverySignals: {
      gazeAlignmentScore: 90,
      headMovementLevel: 'balanced',
      framingStatus: 'centered',
      visibleEnergy: 'dynamic',
      lastCue: 'Calm poise under pressure.'
    }
  }
};
