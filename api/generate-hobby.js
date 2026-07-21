// api/generate-hobby.js
// A second, simpler backend endpoint. Takes any hobby, interest, or random
// idea someone types in and invents ONE hyper-specific, weird, fun app idea
// for it — no Human Design Profile involved, just pure specificity and fun.
// Uses the same ANTHROPIC_API_KEY environment variable as api/generate.js.

function buildSystemPrompt() {
  return `You write one hyper-specific, weird, and delightful app-idea pitch for "Girls & Their Apps," a playful idea generator. Someone just told you a hobby, interest, or random idea of theirs. Your job is to invent ONE app idea that could only exist for that exact thing — something so specific it makes the reader go "wait, how did it know that."

VOICE AND FORMAT RULES — follow these exactly:
1. Write at a 7th-grade reading level. Short sentences, everyday words. No jargon.
2. Output has a "name" (2-5 words, punchy, specific, a little clever) and a "desc" (one paragraph, 2-4 sentences).
3. The "desc" shape: first, name a real, specific delight or annoyance tied to this exact hobby or idea, in second person ("you..."). Then say "This app..." and explain the exact, weird, fun mechanism. End with the payoff.
4. Lean into weird and fun over serious and businesslike. This does not need to be a sellable product — absurd, delightful, and hyper-specific is the actual goal.
5. The idea must be impossible to swap onto a different hobby. If it could apply to literally any interest, it's too generic — throw it out and get more specific.
6. Never use "she" or "her" — always use "you."

Use the return_idea tool to give your final answer.`;
}

function buildUserPrompt(hobby) {
  return `Hobby, interest, or random idea: "${hobby}"

Invent one hyper-specific, weird, and fun app idea for this exact thing. Return only the JSON object.`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is not configured with an API key yet.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const cleanHobby = typeof body.hobby === 'string' ? body.hobby.trim() : '';
  if (cleanHobby.length < 2) {
    res.status(400).json({ error: 'Tell us a bit more — a word or two is enough.' });
    return;
  }
  if (cleanHobby.length > 200) {
    res.status(400).json({ error: 'That is a bit long — try a shorter phrase.' });
    return;
  }

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
        max_tokens: 500,
        system: buildSystemPrompt(),
        messages: [
          { role: 'user', content: buildUserPrompt(cleanHobby) }
        ],
        tools: [
          {
            name: 'return_idea',
            description: 'Return the one generated app idea.',
            input_schema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: '2-5 word app name' },
                desc: { type: 'string', description: 'One paragraph, 2-4 sentences' }
              },
              required: ['name', 'desc']
            }
          }
        ],
        tool_choice: { type: 'tool', name: 'return_idea' }
      })
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error('Anthropic API error:', anthropicResponse.status, errText);
      res.status(502).json({ error: 'The AI service returned an error. Please try again.' });
      return;
    }

    const data = await anthropicResponse.json();
    const toolUseBlock = (data.content || []).find(block => block.type === 'tool_use' && block.name === 'return_idea');

    if (!toolUseBlock || !toolUseBlock.input) {
      console.error('generate-hobby.js: no valid tool_use block in response', JSON.stringify(data));
      throw new Error('Unexpected response shape from the model.');
    }

    const idea = {
      name: String(toolUseBlock.input.name || '').trim(),
      desc: String(toolUseBlock.input.desc || '').trim()
    };

    if (!idea.name || !idea.desc) {
      throw new Error('Unexpected response shape from the model.');
    }

    res.status(200).json({ idea });
  } catch (err) {
    console.error('generate-hobby.js error:', err);
    res.status(500).json({ error: 'Something went wrong generating your idea. Please try again.' });
  }
};
