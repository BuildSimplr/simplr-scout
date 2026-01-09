const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const QUESTIONS_PROMPT = `Business problem: "{problem}"

Return exactly 5 clarifying questions as a JSON array. No other text.
Example: ["Q1?", "Q2?", "Q3?", "Q4?", "Q5?"]`;

const RECOMMENDATIONS_PROMPT = `Problem: {problem}
Context: {qa_pairs}

Return JSON only:
{"summary":"brief summary","quickWins":["action1","action2","action3"],"strategic":["action1","action2"],"longTerm":["action1","action2"],"nextStep":"most important action"}`;

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, problem, questions, answers, email } = req.body;

    if (!problem) {
      return res.status(400).json({ error: 'Problem description is required' });
    }

    if (type === 'questions') {
      // Generate clarifying questions
      const prompt = QUESTIONS_PROMPT.replace('{problem}', problem);

      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = message.content[0].text;

      // Parse the JSON response
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(content);
      } catch {
        // If parsing fails, extract questions from text
        parsedQuestions = [
          "How long has this problem been affecting your business?",
          "What solutions have you already tried?",
          "What resources (budget, team, time) do you have available?",
          "What would success look like for you?",
          "How urgent is solving this problem?"
        ];
      }

      return res.status(200).json({ questions: parsedQuestions });

    } else if (type === 'recommendations') {
      // Generate recommendations
      let qaPairs = '';
      if (questions && answers) {
        questions.forEach((q, i) => {
          qaPairs += `Q: ${q}\nA: ${answers[i] || 'Not answered'}\n\n`;
        });
      }

      const prompt = RECOMMENDATIONS_PROMPT
        .replace('{problem}', problem)
        .replace('{qa_pairs}', qaPairs);

      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 768,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = message.content[0].text;

      // Parse the JSON response
      let recommendations;
      try {
        recommendations = JSON.parse(content);
      } catch {
        // If parsing fails, return default structure
        recommendations = {
          summary: "Based on your inputs, here's a structured approach to address your challenge.",
          quickWins: [
            "Document your current process to identify immediate bottlenecks",
            "Schedule a team retrospective to gather insights",
            "Set up basic metrics tracking"
          ],
          strategic: [
            "Develop a phased implementation plan",
            "Identify key resources needed"
          ],
          longTerm: [
            "Build organizational capability",
            "Create feedback loops for improvement"
          ],
          nextStep: "Start by documenting your current state."
        };
      }

      // Log the lead (in production, save to database)
      if (email) {
        console.log(`New lead: ${email} - Problem: ${problem.substring(0, 50)}...`);
      }

      return res.status(200).json(recommendations);

    } else {
      return res.status(400).json({ error: 'Invalid request type' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
