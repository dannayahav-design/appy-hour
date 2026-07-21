// api/generate.js
// This is the backend for "Girls & Their Apps." It runs on Vercel's servers,
// not in the visitor's browser, which is what keeps your Anthropic API key
// hidden. The webpage calls this file; this file calls Anthropic.
//
// Your API key lives in an Environment Variable called ANTHROPIC_API_KEY,
// set inside your Vercel project settings (never written in this file).

const PROFILES = [
  {
    id: "1/3",
    archetype: "The Grounded Genius",
    tagline: "Knows everything because she lived it, Googled it, and probably cried about it.",
    essence: "Deeply curious and practical — you learn through research and real-world trial and error, gathering wisdom through the things that didn't go perfectly.",
    roles: ["Teacher", "Strategist", "Creative", "Consultant", "Research-Based Coach"],
    ideas: [
      { name: "The Redemption Arc Generator", desc: "Your best marketing material is the mistake you're most embarrassed to bring up. This app takes a two-sentence description of the failure and drafts three caption versions, ranked by how much each one builds trust instead of costing it." },
      { name: "Curriculum Compost", desc: "Three years of voice memos where you talked yourself into and out of the same idea, going nowhere. This app takes the raw audio, transcribes it, and clusters the \"talked myself out of it\" sections into an actual course outline — because that's usually where the real teaching was hiding." },
      { name: "Devil's Advocate Prep", desc: "You over-research before a hard client call because you're bracing for pushback you haven't thought of yet. This app takes a two-line description of the situation and role-plays the client's most likely objection back at you, so you walk in having already argued with yourself and won." },
      { name: "The Ready Room", desc: "You won't show anyone unfinished work until it's \"done,\" which conveniently never arrives. This app generates a link that self-destructs after exactly three clicks, so your rough draft gets seen by three trusted people before you can talk yourself out of sharing it." },
      { name: "Fieldnotes", desc: "Your case studies read like a highlight reel, which is exactly why nobody believes them. This app lets you log the problem, what you tried, and the outcome right after each client win, then assembles the entries into honest, specific content proof instead of a polished brag." }
    ]
  },
  {
    id: "1/4",
    archetype: "The Scholarly Socialite",
    tagline: "Bookworm by day, networker by night.",
    essence: "You investigate deeply and build a strong foundation, then share it through relationships — an expert who influences through connection and trust.",
    roles: ["Mentor", "Teacher", "Community Builder", "Network-Based Coach", "Influencer", "Thought Leader"],
    ideas: [
      { name: "Truth Bomb Drafts", desc: "You soften your real opinion & truth by the time you hit publish. This app locks your first draft for 24 hours (no editing, no deleting) because most people never go back to soften a post once the moment's passed." },
      { name: "Warm Intro Machine", desc: "You know everyone but can't remember who owes who a favor. This app lets you tag your contacts by what they need and what they offer, flags likely matches, and drafts the introduction email for you to send." },
      { name: "Office Hours", desc: "Your DMs are full of people asking for free advice, one exhausting conversation at a time. This app turns every \"quick question\" into a single scheduled group call, with an auto-reply that hands out the link the moment someone asks." },
      { name: "Reputation Ledger", desc: "You have no testimonials because asking for them feels like begging. This app scans messages you paste in for the ones that read like genuine thanks, then formats them into a testimonials page automatically." },
      { name: "The Fortress Audit", desc: "Your last ten posts look smart but say almost nothing. Paste them in and this app scores how many contain an actual stated opinion versus a curated \"look how smart my circle is\" collage, then gives you the ratio." }
    ]
  },
  {
    id: "2/4",
    archetype: "The Magnetic Hermit",
    tagline: "Hides out, still gets invited everywhere.",
    essence: "Gifted and naturally talented, you need real alone time to recharge — yet the community keeps calling you out to share your gifts.",
    roles: ["Healer", "Guide", "Intuitive Coach", "Small Group Facilitator", "Energy Worker", "Muse"],
    ideas: [
      { name: "The Invitation Only", desc: "You've never once gotten a client from a public link, so stop pretending your business runs on one. This app builds a booking page that only unlocks when a visitor enters a friend's actual name as the referral." },
      { name: "Recharge Radar", desc: "You overbook yourself into the exact burnout you swore you'd avoid this quarter. This app connects to your calendar and auto-blocks your remaining availability once you hit the number of sessions your own history shows is your real limit." },
      { name: "Called Out", desc: "You wait to be asked instead of ever putting yourself forward, so nothing happens without someone else's invitation. This app lets a trusted friend schedule you a \"teach the thing\" prompt for a future date you pre-approve while you're feeling brave, so tired future-you can't cancel it." },
      { name: "Quiet Studio", desc: "You do your best work with the door closed, which means you have zero visible proof it happens. This app takes your private, client-approved session notes and strips identifying details, turning them into anonymized \"here's what happened in a room nobody saw\" snippets for your site." },
      { name: "Word of Mouth Map", desc: "You keep chasing strangers online who were never going to hire you. This app has you log where each client actually came from, then builds a visual map showing the handful of people responsible for 90% of your business." }
    ]
  },
  {
    id: "2/5",
    archetype: "The Hidden Hero",
    tagline: "Quietly brilliant, saves the day when least expected.",
    essence: "A natural talent with visionary solutions — others look to you for answers, and you bring innovative ideas to practical problems.",
    roles: ["Coach", "Strategist", "Transformational Healer", "Creative Consultant", "Innovator"],
    ideas: [
      { name: "Fix It Vault", desc: "You've solved this exact problem for the ninth different person this month and didn't notice. This app lets you save every answer you give with a tag, then auto-matches future \"quick question\" DMs to the answer you already wrote." },
      { name: "Quiet Genius", desc: "You price based on how hard something felt instead of what it was actually worth. This app takes the minutes it took you and the hours it saved the client, then calculates a suggested rate based on impact instead of effort." },
      { name: "The Mystique Audit", desc: "Your \"how I work\" page says \"intuitive\" four times and explains nothing. Paste it in and this app flags every vague word, prompting you to replace at least one with an actual, concrete step before you're allowed to publish." },
      { name: "Rescue Log", desc: "You have zero documented proof of the client fires you've quietly put out. This app lets you log the date, the problem, and the outcome the moment you solve something urgent, building a proof folder passively instead of scrambling for one under deadline." },
      { name: "Innovation Triage", desc: "You have 14 half-built ideas and a talent for never finishing the scary one. This app has you rate each idea on excitement, fear, and how ready it is to build, then tells you which one you're avoiding on purpose." }
    ]
  },
  {
    id: "3/5",
    archetype: "The Experimental Trailblazer",
    tagline: "Masters life by embracing every misstep.",
    essence: "Real-world expert with incredible charisma — trials lead to powerful wisdom, and you fail forward to teach others how to succeed.",
    roles: ["Coach", "Mentor", "Authentic Storyteller", "Workshop Leader", "Healer", "Truth-Bomb Coach"],
    ideas: [
      { name: "Failed It Forward", desc: "The business \"mistake\" you're most embarrassed by is also your best unused content. Describe it in a couple sentences and this app drafts three caption versions, ranked by how much trust each one builds instead of costing." },
      { name: "The Line I Won't Cross", desc: "You over-deliver every time because you can't watch a client struggle without stepping in. This app takes the situation you're tempted to rescue and drafts the exact boundary-setting message in your voice, so the words are ready before you're already in the trap." },
      { name: "Charisma Capture", desc: "You say something brilliant on every live call and can never remember what it was. This app auto-clips the 30-60 seconds of your recorded sessions where engagement or energy spikes, so the unforgettable moment exists somewhere besides the three people who heard it live." },
      { name: "My Mess, My Medicine", desc: "Your stories always end with you fixing it for someone else instead of choosing yourself. This app walks you through a three-act story template that requires the ending \"and I chose myself,\" and rejects any draft that ends in a rescue." },
      { name: "The Scar Tissue Rate Card", desc: "You charge less for the lesson that cost you the most to learn, which is backwards. This app has you rate how painful and how long-ago a lesson was, then calculates a rate that reflects what it actually cost you to get good at this." }
    ]
  },
  {
    id: "3/6",
    archetype: "The Resilient Guide",
    tagline: "Stumbles, learns, and leads with hard-earned wisdom.",
    essence: "Early life is full of experimentation; you eventually become a wise role model through lived experience and hard-earned clarity.",
    roles: ["Mentor", "Guide", "Speaker", "Embodiment Coach", "Storyteller", "Leader", "Visionary"],
    ideas: [
      { name: "Hard-Earned", desc: "Your polished advice isn't the sentence your audience actually needs to hear. This app has you plot your life on a timeline with short notes per chapter, then extracts the rawest, least-polished line from your hardest year as a suggested talk opener." },
      { name: "Still Becoming", desc: "You keep posting \"I healed from X\" the same week X happened again. This app requires you to log the most recent day the old pattern resurfaced before it will let you publish a growth post — both go out together, or neither does." },
      { name: "Speaker's Spine", desc: "Your keynote skips the part where you were 24 and a mess, because it's embarrassing. This app maps your life timeline onto a three-act structure and specifically prompts you to include the unfinished, exhausted middle chapter — the part audiences actually remember." },
      { name: "Role Model Reel", desc: "You're trying to prove credibility without a polished résumé. This app compiles the comebacks you log — not the wins — into a short highlight reel formatted for your bio page or speaker kit." },
      { name: "The \"Still Happening\" Sorter", desc: "You keep confusing \"I haven't learned this yet\" with \"this is just genuinely hard.\" This app has you describe a recurring frustration weekly, then sorts your answers into one category or the other over time, since each needs a different fix." }
    ]
  },
  {
    id: "4/6",
    archetype: "The Community Sage",
    tagline: "Builds bridges and imparts rooftop wisdom.",
    essence: "Builds influence through close relationships and grows into a respected, trusted leader over time — a natural connector.",
    roles: ["Coach", "Mentor", "Community Facilitator", "Inspirational Leader"],
    ideas: [
      { name: "Rooftop Wisdom", desc: "You've used a joke to dodge saying the real thing more times than you can count. This app queues one weekly post slot that scans your caption for humor or hedging and won't let you submit until it's gone." },
      { name: "Depth Probe", desc: "You default to cute and surface-level because depth risks losing the crowd. This app takes a draft post and asks you three follow-up questions, like a skeptical friend would, before letting you post — so what goes out is the third answer, not the first." },
      { name: "Bridge Builder", desc: "You know exactly who in your community should meet and never actually connect them. This app has you log who's in your circle and what they need, flags likely matches, and drafts a direct introduction — no \"no pressure if not!\"" },
      { name: "Community Pulse", desc: "Your group has a theme everyone's avoiding, including you. This app sends a short anonymous survey to your list and summarizes the responses into the one topic nobody's willing to say out loud." },
      { name: "The Harmony Tax", desc: "You say yes to things that cost you, on repeat, to keep the peace. This app has you log the actual cost — time, money, energy — of every people-pleasing yes, then totals it monthly so the pattern has a number attached." }
    ]
  },
  {
    id: "4/1",
    archetype: "The Fixed Fate Friend",
    tagline: "Unchanging path, but always there for a chat.",
    essence: "Deep knowledge with a fixed destiny — you become a stable, reliable expert in your niche, influencing through consistency.",
    roles: ["Teacher", "Strategist", "Course Creator", "Knowledge Hub Community", "Curator", "Connector"],
    ideas: [
      { name: "Say It Straight", desc: "Your real opinion is buried in paragraph three behind two paragraphs of context nobody asked for. Paste a draft and this app finds every \"just,\" \"maybe,\" and \"I could be wrong but,\" then shows you the sentence stripped of them." },
      { name: "The Niche Vault", desc: "You keep re-explaining the same concept to new people like it's the first time you've said it. This app gives every teaching you've ever given a permanent, tagged home, organized by the exact objection each one answers." },
      { name: "The Weekly Digest", desc: "You save great resources constantly with no system for actually sharing them. This app turns your saved links and bookmarks into one curated weekly email your audience actually opens." },
      { name: "The Rolodex Audit", desc: "You know forty people and none of them know you're the one to call. This app maps your network by who-knows-what and surfaces the specific relationship you've been sitting on that should already be a client or collaborator." },
      { name: "The Boat-Rocking Report", desc: "You can't tell if playing it safe is actually costing you business. This app has you tag each post \"played it safe\" or \"said the uncomfortable thing\" along with whether it led to an inquiry, then shows you which type actually converts." }
    ]
  },
  {
    id: "5/1",
    archetype: "The Charismatic Expert",
    tagline: "Draws attention, offers solutions, sometimes misunderstood.",
    essence: "Seen as a savior with practical, well-researched solutions and strong leadership potential — a natural authority.",
    roles: ["Leader", "Teacher", "Thought Leader", "Head Coach", "Visionary", "Messenger/Marketer", "Strategist"],
    ideas: [
      { name: "Boundary Recode", desc: "You say yes to expectations that were never yours to carry. This app requires you to name the specific person whose expectation it is before it lets you confirm any new commitment." },
      { name: "Delegate the Coaching", desc: "You're the bottleneck in your own business because everything runs through your calendar. This app walks you through documenting your actual method step by step, turning it into a playbook the coaches you hire can follow without you." },
      { name: "The Messenger's Draft", desc: "Turning deep expertise into persuasive copy takes forever, and you talk better than you write. This app takes a voice memo of you explaining your offer out loud and turns it into structured copy for email, social, and a landing page at once." },
      { name: "The Redirect Script", desc: "You keep saying yes to work outside what was actually agreed on. Paste in the original scope and the new ask, and this app drafts the exact polite, firm sentence that redirects it back to what you agreed to." },
      { name: "Authority Archive", desc: "Your best insights are buried in old posts nobody can find, so you keep re-typing the same paragraph. This app scans your published content and organizes it into a searchable \"greatest hits\" library, ready to repurpose or link to instead of retype." }
    ]
  },
  {
    id: "5/2",
    archetype: "The Enigmatic Expert",
    tagline: "Mysterious yet magnetic, solves problems effortlessly.",
    essence: "Innovative and insightful with natural genius — you need space, but shine brightly when allowed to lead on your own terms.",
    roles: ["Spiritual Teacher", "Healer", "Creative Coach", "Visionary Guide", "Influencer", "Marketer"],
    ideas: [
      { name: "On My Terms", desc: "You agree to meeting times at 11pm that you deeply regret by 9am. This app only opens booking slots during hours you pre-set while calm, and locks the rest, so tired-you can't overextend the schedule later." },
      { name: "The Reveal", desc: "You've deleted 30 posts this year within an hour of publishing them. This app posts one thing weekly and disables the delete button for 48 hours — long enough for the urge to retreat to pass." },
      { name: "Genius on Demand", desc: "Independent problem solvers get buried under scattered one-off requests that were never going to pay. This app puts a smart intake form in front of your inbox that filters incoming requests, so only aligned, well-matched ones actually reach you." },
      { name: "Mystique Manager", desc: "\"Mysterious\" has started reading as \"unreachable\" to the people who'd actually pay you. This app requires you to publish one real, specific detail about your process each week before you're allowed to post anything else." },
      { name: "Solo Studio", desc: "Constant pings destroy the deep, uninterrupted focus your best work actually needs. This app blocks your calendar for real deep-work sessions and quietly logs how many times you tried to override it." }
    ]
  },
  {
    id: "6/2",
    archetype: "The Wise Wallflower",
    tagline: "Observes quietly, then drops profound insights.",
    essence: "You live three lives in one — experimentation, observation, embodiment — emerging over time as a respected, calm leader.",
    roles: ["Mentor", "Guide", "Elder Coach", "Purpose Coach", "Teacher", "Sage"],
    ideas: [
      { name: "Wisdom Drop", desc: "You've had the same unpublished insight sitting in your notes app since March. This app records a voice note and posts the transcription instantly — there's no editing screen, because your polish is the actual reason it's still unpublished." },
      { name: "The Three Lives Map", desc: "Clients struggle to see how their scattered past experiments add up to real wisdom now. This app takes their life events and maps them onto experimentation, observation, and embodiment phases, generating a visual timeline you can walk them through in session." },
      { name: "Divine Timing Deadline", desc: "Your definition of \"ready\" has never once arrived on schedule. This app sets one hard weekly deadline for sharing something, removing the \"is it time yet\" decision entirely, because left on your own you were never going to decide." },
      { name: "Elder's Notebook", desc: "You've been sitting on a book's worth of material and calling it \"just my journal.\" This app periodically clusters your written reflections into recurring themes, so the book you keep almost writing finally has a starting outline." },
      { name: "Purpose Compass", desc: "Clients give you scattered, rambling answers when you ask what they actually want. This app takes their raw answers to a guided questionnaire and synthesizes them into one clear, one-page purpose statement they can say out loud without flinching." }
    ]
  },
  {
    id: "6/3",
    archetype: "The Evolving Example",
    tagline: "Lives it all to teach it all.",
    essence: "You learn by living through every possible experience, becoming a relatable role model who leads with depth and authenticity.",
    roles: ["Mentor", "Speaker", "Head Life Coach", "Transformational Facilitator", "Alchemist", "Teacher"],
    ideas: [
      { name: "Lived It Library", desc: "You've lived nine lives worth of lessons and taught approximately zero of them on purpose. This app lets you tag life experiences by the business lesson hiding inside each one, building a searchable bank of teaching stories over time." },
      { name: "Teach the Teachers", desc: "You train other coaches for free in your DMs and call it \"just being helpful.\" This app walks you through packaging your private method into modules, structured as an actual certification program other practitioners can pay to complete." },
      { name: "Joy Permission Slip", desc: "Your last \"fun\" activity was also somehow a networking opportunity. This app sends one daily reminder to do something with zero productive purpose, and logs that you did it — for no reason except that you did." },
      { name: "Hope Rewire", desc: "You've gotten so used to managing disappointment that you stopped letting yourself want things. This app asks \"what are you afraid to hope for again\" and won't accept a joke as the answer before moving to the next prompt." },
      { name: "Before & After Compiler", desc: "You can't easily show the transformation your work actually creates. This app lets you capture short client snapshots over time — in their own words — and compiles them into honest before-and-after case studies." }
    ]
  }
]

// ---------- Prompt building (mirrors the voice rules for Girls & Their Apps) ----------

function buildSystemPrompt(audience) {
  const audienceRule = audience === 'clients'
    ? `These ideas are products the business owner would BUILD AND SELL to their own clients. The "you" in each idea's problem statement refers to the client (the end user), described using the struggles the business owner gave you. The "This app..." part describes what the sellable tool does for that client. Frame each idea as something the business owner could offer, package, or sell as part of their business — not as a private tool they'd use themselves.`
    : `These ideas are for the business owner to use themselves, in their own business — to run it, grow it, or make their own work easier. The "you" in each idea's problem statement refers to the business owner. Do not frame these as products to sell to clients.`;

  const reuseRule = audience === 'me'
    ? `The reference ideas below were written specifically for this Profile's business role and already work as real answers for the right business. If one of them is a genuinely strong fit for this exact business — as written, or lightly adapted to mention a specific detail from the business description — you may use it as one of your 5. Do not force a reference idea in if it's a stretch; only include one when it truly fits. You do not need to hit exactly 5 new ideas — a mix of reused-and-adapted plus brand-new is fine, as long as every idea in the final 5 feels specific to this business.`
    : `Do not reuse or lightly reword the reference ideas provided below. They exist only so you match the tone, specificity, and creativity level. Write five entirely new ideas, since these reference ideas were written as tools for the business owner's own use, not as sellable client products.`;

  return `You write short app-idea pitches for "Girls & Their Apps," a playful Human Design business-idea generator. Every idea combines a Human Design Profile's business psychology with a real person's actual business, and every idea has to feel like it was made for that one specific business, not swapped in from a generic template.

WHO THESE IDEAS ARE FOR:
${audienceRule}

USING THE REFERENCE IDEAS:
${reuseRule}

VOICE AND FORMAT RULES — follow these exactly:
1. Write at a 7th-grade reading level. Use short sentences and everyday words. No jargon, no business-speak, no big words when a small one works.
2. Each idea has a "name" (2-5 words, specific and a little clever, not generic) and a "desc" (one paragraph, 2-4 sentences).
3. The "desc" always follows this shape: first, name the specific problem or pattern in second person ("you..."), tied to something concrete from the description provided. Then say "This app..." and explain exactly what it does — a specific mechanism, not a vague benefit. End with the payoff in plain terms.
4. Every idea must reference something specific and real from the description given — not a generic swap of "your niche" into a template. If they said their clients are new moms who struggle with sleep training, the idea should feel like it could only be for that specific audience, not for any coach anywhere.
5. Ground every idea in the given Human Design Profile's aligned business roles listed below (e.g. Teacher, Strategist, Consultant, Healer, Connector — whatever this Profile's roles are). Each of the 5 ideas should connect clearly to at least one of those specific roles, not just the general vibe of the Profile. Across the 5 ideas, try to touch a spread of the different roles listed rather than the same one five times, so the set reflects the range of ways this Profile actually shows up in business.
6. No em dashes inside the desc other than the one right after the name-length problem statement, if needed for rhythm. Keep punctuation simple.
7. Never use "she" or "her" — always use "you."

Use the return_ideas tool to give your final 5 ideas.`;
}

function buildUserPrompt(profile, businessDesc, audience) {
  const referenceIdeas = profile.ideas.map(i => `${i.name} — ${i.desc}`).join('\n\n');
  const contextLabel = audience === 'clients'
    ? "THE PERSON'S CLIENTS — WHO THEY ARE AND WHAT THEY STRUGGLE WITH (in the business owner's own words):"
    : "THE PERSON'S BUSINESS (their own words):";

  const referenceLabel = audience === 'me'
    ? "REFERENCE IDEAS ALREADY WRITTEN FOR THIS PROFILE (use one if it's a genuinely strong fit for this exact business, adapted with a specific detail from the description below — otherwise write something new that still fits the roles above):"
    : "REFERENCE IDEAS FOR THIS PROFILE (tone and specificity calibration only — do not reuse or reword these, write 5 new ones):";

  const instructionLine = audience === 'clients'
    ? "Write 5 new app ideas the business owner could build and SELL to these clients, combining this Profile's aligned business roles with the specific client struggles described above. Return only the JSON array."
    : "Write 5 app ideas — reused-and-adapted or brand new, whichever genuinely fits best — that combine this Profile's aligned business roles with specifics from this exact business description. Make sure the 5 ideas together reflect a spread of the roles listed above, not just one. Return only the JSON array.";

  return `HUMAN DESIGN PROFILE
Profile: ${profile.id} — ${profile.archetype}
Essence: ${profile.essence}
Aligned business roles: ${profile.roles.join(', ')}

${referenceLabel}
${referenceIdeas}

${contextLabel}
"${businessDesc}"

${instructionLine}`;
}

// ---------- The actual serverless function Vercel runs ----------

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Make sure the API key was actually set up in Vercel's environment variables
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is not configured with an API key yet.' });
    return;
  }

  // Vercel usually parses JSON bodies automatically, but we handle the
  // string case too just in case.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const { profileId, businessDesc, audience } = body;

  // ---- Basic validation, so we never send garbage to the API ----
  const profile = PROFILES.find(p => p.id === profileId);
  if (!profile) {
    res.status(400).json({ error: 'Unknown or missing profileId.' });
    return;
  }

  const cleanDesc = typeof businessDesc === 'string' ? businessDesc.trim() : '';
  if (cleanDesc.length < 10) {
    res.status(400).json({ error: 'businessDesc is too short.' });
    return;
  }

  const cleanAudience = audience === 'clients' ? 'clients' : 'me';

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1500,
        system: buildSystemPrompt(cleanAudience),
        messages: [
          { role: 'user', content: buildUserPrompt(profile, cleanDesc, cleanAudience) }
        ],
        tools: [
          {
            name: 'return_ideas',
            description: 'Return the 5 generated app ideas.',
            input_schema: {
              type: 'object',
              properties: {
                ideas: {
                  type: 'array',
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: '2-5 word app name' },
                      desc: { type: 'string', description: 'One paragraph, 2-4 sentences' }
                    },
                    required: ['name', 'desc']
                  }
                }
              },
              required: ['ideas']
            }
          }
        ],
        tool_choice: { type: 'tool', name: 'return_ideas' }
      })
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error('Anthropic API error:', anthropicResponse.status, errText);
      res.status(502).json({ error: 'The AI service returned an error. Please try again.' });
      return;
    }

    const data = await anthropicResponse.json();
    const toolUseBlock = (data.content || []).find(block => block.type === 'tool_use' && block.name === 'return_ideas');

    if (!toolUseBlock || !toolUseBlock.input) {
      console.error('generate.js: no tool_use block in response', JSON.stringify(data));
      throw new Error('Unexpected response shape from the model.');
    }

    // Normally toolUseBlock.input.ideas is already an array, exactly matching
    // the schema. Occasionally the model double-wraps its answer as a JSON
    // *string* instead (e.g. input.ideas = '{"ideas":[...]}' as text rather
    // than the array itself). This unwraps that case instead of failing.
    let ideasArray = toolUseBlock.input.ideas;
    if (typeof ideasArray === 'string') {
      try {
        const unwrapped = JSON.parse(ideasArray);
        ideasArray = Array.isArray(unwrapped) ? unwrapped : unwrapped.ideas;
      } catch (e) {
        ideasArray = null;
      }
    }

    if (!Array.isArray(ideasArray)) {
      console.error('generate.js: could not extract an ideas array', JSON.stringify(data));
      throw new Error('Unexpected response shape from the model.');
    }

    const ideas = ideasArray.slice(0, 5).map(idea => ({
      name: String(idea.name || '').trim(),
      desc: String(idea.desc || '').trim()
    }));

    res.status(200).json({ ideas });
  } catch (err) {
    console.error('generate.js error:', err);
    res.status(500).json({ error: 'Something went wrong generating your ideas. Please try again.' });
  }
};
