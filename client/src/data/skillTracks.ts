import { SkillTrack } from '../types';

export const SKILL_TRACKS: SkillTrack[] = [
  {
    id: 'clear-replies',
    title: 'Clear Replies',
    subtitle: 'Cut the preamble, answer the question first, structure the supporting rationale.',
    description: 'Master the bottom-line-first technique (BLUF) to speak with clarity in fast-paced team channels and executive reviews.',
    iconName: 'MessageSquare',
    color: '#38bdf8', // sky
    completedCount: 2,
    totalCount: 4,
    exercises: [
      {
        id: 'cr-1',
        level: 1,
        title: 'The Direct Stance',
        durationMinutes: 3,
        scenario: 'meeting',
        brief: 'Answer a direct "yes/no/it depends" question within the first 5 seconds, followed by exactly two supporting reasons.',
        challenge: 'Avoid any introductory fluff ("That is a great question...", "Well, to understand that..."). State your conclusion first.',
        completed: true
      },
      {
        id: 'cr-2',
        level: 2,
        title: 'The Rule of Two Reasons',
        durationMinutes: 4,
        scenario: 'meeting',
        brief: 'When asked for an opinion on a strategic decision, give your position and limit supporting rationale to exactly two distinct buckets.',
        challenge: 'Do not drift into third or fourth caveats. Deliver the two points and stop.',
        completed: true
      },
      {
        id: 'cr-3',
        level: 3,
        title: 'The Clean Transition',
        durationMinutes: 5,
        scenario: 'meeting',
        brief: 'Deliver a complex technical status update by moving from Problem → Root Cause → Unblocked Path in under 90 seconds.',
        challenge: 'Use explicit signposts ("First, what failed; second, why; third, the fix").',
        completed: false
      },
      {
        id: 'cr-4',
        level: 4,
        title: 'Landing the Conclusion',
        durationMinutes: 5,
        scenario: 'presentation',
        brief: 'Deliver a presentation climax where the final sentence leaves no ambiguity about who owns what next.',
        challenge: 'End on a declarative action sentence; no trailing "...so yeah, that is basically it."',
        completed: false
      }
    ]
  },
  {
    id: 'memorable-stories',
    title: 'Memorable Stories',
    subtitle: 'Anchor abstract principles to vivid imagery, real tension, and unforgettable turns.',
    description: 'Transform mundane project milestones and case studies into narratives that stick in the audience’s memory long after the meeting.',
    iconName: 'Sparkles',
    color: '#f59e0b', // amber
    completedCount: 1,
    totalCount: 4,
    exercises: [
      {
        id: 'ms-1',
        level: 1,
        title: 'Setting the Stakes in 15 Seconds',
        durationMinutes: 3,
        scenario: 'presentation',
        brief: 'Open a story by contrasting what was at risk with what the default outcome looked like.',
        challenge: 'Hook the listener with an undeniable consequence within the first sentence.',
        completed: true
      },
      {
        id: 'ms-2',
        level: 2,
        title: 'The Sensory Anchor',
        durationMinutes: 4,
        scenario: 'presentation',
        brief: 'Narrate a moment of crisis by including one concrete sensory anchor (a dashboard turning red at 2 AM, 40 slack notifications per second).',
        challenge: 'Never use generic phrases like "things were stressful". Give one physical detail.',
        completed: false
      },
      {
        id: 'ms-3',
        level: 3,
        title: 'The Narrative Turn (Insight)',
        durationMinutes: 5,
        scenario: 'interview',
        brief: 'Explain how an initial failure or dead end led to the key realization that changed everything.',
        challenge: 'Highlight the moment your assumption broke and how your thinking pivoted.',
        completed: false
      },
      {
        id: 'ms-4',
        level: 4,
        title: 'The Takeaway That Sticks',
        durationMinutes: 5,
        scenario: 'presentation',
        brief: 'Close your story with a single universal maxim or takeaway that the listener can apply immediately to their own work.',
        challenge: 'Craft a memorable phrase with rhythm or contrast (e.g. "We stopped optimizing for speed and started optimizing for recovery").',
        completed: false
      }
    ]
  },
  {
    id: 'executive-presence',
    title: 'Executive Presence',
    subtitle: 'Calm pacing, confident pauses, and ownership that reassures senior leadership.',
    description: 'Convey authority not by speaking louder or longer, but through deliberate silence, zero frantic filler, and total command of your cadence.',
    iconName: 'Shield',
    color: '#10b981', // emerald
    completedCount: 2,
    totalCount: 4,
    exercises: [
      {
        id: 'ep-1',
        level: 1,
        title: 'The Three-Second Breath Pause',
        durationMinutes: 3,
        scenario: 'meeting',
        brief: 'Before answering a provocative question from a senior director, pause for a full 2 to 3 seconds with calm composure before speaking.',
        challenge: 'Zero filler sounds during the pause. Begin on steady, grounded breath.',
        completed: true
      },
      {
        id: 'ep-2',
        level: 2,
        title: 'Zero Apology Framing',
        durationMinutes: 4,
        scenario: 'presentation',
        brief: 'Present bad news or a schedule adjustment without using phrases like "I am sorry", "unfortunately", or "just wanted to say".',
        challenge: 'Frame the update around objective facts and proactive mitigation.',
        completed: true
      },
      {
        id: 'ep-3',
        level: 3,
        title: 'Managing Hostile Interruptions',
        durationMinutes: 5,
        scenario: 'meeting',
        brief: 'Acknowledge an aggressive pushback, mirror the underlying concern, and steer back to the agenda with absolute calm.',
        challenge: 'Do not raise pitch or accelerate tempo. Lower vocal pitch slightly and slow your pace.',
        completed: false
      },
      {
        id: 'ep-4',
        level: 4,
        title: 'The High-Stakes Vision Close',
        durationMinutes: 5,
        scenario: 'presentation',
        brief: 'Deliver a 90-second strategic vision pitch to the board of directors.',
        challenge: 'Hold eye contact with the camera/room, modulate volume with intention, and finish with conviction.',
        completed: false
      }
    ]
  },
  {
    id: 'interview-thinking',
    title: 'Interview Thinking',
    subtitle: 'Structure complex answers on the fly using structured frameworks without sounding robotic.',
    description: 'Excel in behavioral, technical leadership, and strategic interviews by organizing messy thoughts into crisp, compelling chapters.',
    iconName: 'Compass',
    color: '#a855f7', // purple
    completedCount: 1,
    totalCount: 4,
    exercises: [
      {
        id: 'it-1',
        level: 1,
        title: 'Signposting Your Plan',
        durationMinutes: 3,
        scenario: 'interview',
        brief: 'When asked a broad question, outline your 3-chapter structure before diving into chapter 1.',
        challenge: 'Signpost: "I think about this in three parts: first, the initial discovery; second, the architectural decision; third, the quantifiable outcome."',
        completed: true
      },
      {
        id: 'it-2',
        level: 2,
        title: 'Balancing "I" and "We"',
        durationMinutes: 4,
        scenario: 'interview',
        brief: 'Explain a team triumph while clearly delineating what you personally analyzed, decided, or led.',
        challenge: 'Credit the team while making your individual contribution unmistakably sharp.',
        completed: false
      },
      {
        id: 'it-3',
        level: 3,
        title: 'Quantifying Trade-Offs',
        durationMinutes: 5,
        scenario: 'interview',
        brief: 'Walk through why you picked Solution B over Solution A and C, citing specific trade-off vectors (latency, operational overhead, cost).',
        challenge: 'Demonstrate mature trade-off thinking; acknowledge what Solution B sacrificed.',
        completed: false
      },
      {
        id: 'it-4',
        level: 4,
        title: 'The Honest Retrospective',
        durationMinutes: 5,
        scenario: 'interview',
        brief: 'Reflect on what you would do differently today given the exact same context.',
        challenge: 'Provide a thoughtful, nuanced lesson rather than a generic platitude.',
        completed: false
      }
    ]
  },
  {
    id: 'impromptu-speaking',
    title: 'Impromptu Speaking',
    subtitle: 'Think quickly, organize instantly, and speak with poise when put on the spot.',
    description: 'Eliminate panic when surprised with a sudden question at an all-hands, a client call, or an elevator encounter.',
    iconName: 'Zap',
    color: '#06b6d4', // cyan
    completedCount: 1,
    totalCount: 4,
    exercises: [
      {
        id: 'is-1',
        level: 1,
        title: 'Past, Present, Future Framework',
        durationMinutes: 3,
        scenario: 'impromptu',
        brief: 'Answer an unannounced question about project progress by dividing your answer into: Where we were, Where we are today, Where we will be Friday.',
        challenge: 'Complete the entire response in under 60 seconds.',
        completed: true
      },
      {
        id: 'is-2',
        level: 2,
        title: 'The Zoom-In / Zoom-Out Pivot',
        durationMinutes: 3,
        scenario: 'impromptu',
        brief: 'When asked about a low-level bug, explain the immediate tactical fix, then zoom out to the broader system resiliency benefit.',
        challenge: 'Bridge smoothly between the micro detail and the macro goal.',
        completed: false
      },
      {
        id: 'is-3',
        level: 3,
        title: 'Holding Ground with "I Don\'t Know Yet"',
        durationMinutes: 3,
        scenario: 'impromptu',
        brief: 'Answer a question when you genuinely lack the facts, without fumbling, guessing, or sounding insecure.',
        challenge: 'Say: "I do not have the verified telemetry on that yet. Here is how we will get it and by when you will have it."',
        completed: false
      },
      {
        id: 'is-4',
        level: 4,
        title: 'The Sudden Elevator Pitch',
        durationMinutes: 3,
        scenario: 'impromptu',
        brief: 'Give a 45-second high-impact pitch for a new initiative to an executive while walking down the hall.',
        challenge: 'State problem, solution, metric benefit, and exact next step.',
        completed: false
      }
    ]
  },
  {
    id: 'lightness-and-wit',
    title: 'Lightness and Wit',
    subtitle: 'Use understated contrast and self-aware timing to release tension naturally.',
    description: 'Bring warmth and natural charm to dense topics without forcing jokes, distracting from the point, or being sarcastic.',
    iconName: 'Smile',
    color: '#ec4899', // pink/rose
    completedCount: 0,
    totalCount: 4,
    exercises: [
      {
        id: 'lw-1',
        level: 1,
        title: 'The Understated Contrast',
        durationMinutes: 3,
        scenario: 'meeting',
        brief: 'After delivering a dense technical or budget breakdown, introduce one dry, self-aware contrast that releases the room’s tension.',
        challenge: 'Keep it understated; let the natural contrast carry the levity without laughing at your own line.',
        completed: false
      },
      {
        id: 'lw-2',
        level: 2,
        title: 'The Playful Analogy',
        durationMinutes: 4,
        scenario: 'presentation',
        brief: 'Explain an arcane engineering problem (e.g. cache invalidation, circular dependencies) using a surprisingly relatable everyday comparison.',
        challenge: 'The analogy must clarify the mechanics, not just act as comic relief.',
        completed: false
      },
      {
        id: 'lw-3',
        level: 3,
        title: 'The Self-Aware Callback',
        durationMinutes: 5,
        scenario: 'presentation',
        brief: 'Reference a harmless slip or earlier observation from the meeting as a connective bridge to your takeaway.',
        challenge: 'Must be inclusive, warm, and tie directly back to the substantive takeaway.',
        completed: false
      },
      {
        id: 'lw-4',
        level: 4,
        title: 'Defusing Stakes Without Diminishing Them',
        durationMinutes: 5,
        scenario: 'impromptu',
        brief: 'Address a moment of high room tension with warm poise and lightness, acknowledging the difficulty while radiating calm confidence.',
        challenge: 'Lightness must increase confidence, not signal carelessness.',
        completed: false
      }
    ]
  }
];
