const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const QUESTIONS_PROMPT = `You are a business consultant. A user needs help with this specific problem:

"{problem}"

Generate exactly 5 clarifying questions that are SPECIFIC to this problem domain.

IMPORTANT: Ask domain-specific questions, not generic ones.

Examples by domain:
- VOIP/Phone Systems: Ask about call volume, current provider, integrations needed, remote workers, budget range
- CRM: Ask about team size, sales process, current tools, must-have integrations, deal volume
- Website: Ask about traffic goals, e-commerce needs, CMS preference, hosting requirements, SEO priorities
- Hiring: Ask about role seniority, remote/hybrid, salary range, timeline, ATS currently used

Return ONLY a JSON array of 5 specific questions. No other text.
Example format: ["Specific question 1?", "Specific question 2?", ...]`;

const RECOMMENDATIONS_PROMPT = `You are a business consultant providing SPECIFIC, ACTIONABLE recommendations.

Problem: {problem}

Context from user answers:
{qa_pairs}

CRITICAL INSTRUCTIONS:
1. Be SPECIFIC to the problem domain - recommend actual tools, vendors, and technologies
2. Include real product names, pricing tiers, and implementation steps
3. NO generic advice like "document your process" or "gather stakeholder input"

GOOD vs BAD examples:

BAD quickWin: "Document your current process"
GOOD quickWin: "Sign up for RingCentral's 14-day free trial and test call quality with your team"

BAD strategic: "Evaluate different solutions"
GOOD strategic: "Create a comparison matrix of RingCentral ($20/user), Nextiva ($18/user), and 8x8 ($15/user) based on your 50-user requirement"

BAD longTerm: "Build organizational capability"
GOOD longTerm: "Migrate to RingCentral's Enterprise tier for advanced analytics and 99.999% uptime SLA"

Domain-specific examples:
- VOIP: Recommend RingCentral, Nextiva, 8x8, Dialpad, or self-hosted Asterisk/FreePBX
- CRM: Recommend HubSpot, Salesforce, Pipedrive, or Zoho with specific tier recommendations
- Website: Recommend Webflow, WordPress, Squarespace, or Shopify with hosting specifics
- Project Management: Recommend Asana, Monday, ClickUp, or Notion with pricing

Return ONLY valid JSON in this exact format:
{
  "summary": "1-2 sentence summary mentioning specific solutions relevant to their problem",
  "quickWins": ["Specific action with tool/vendor name", "Another specific action", "Third specific action"],
  "strategic": ["Medium-term action with specific implementation steps", "Another strategic action with vendors"],
  "longTerm": ["Long-term goal with specific technology/platform", "Another long-term action"],
  "nextStep": "The single most important next action with a specific tool or vendor to try"
}`;

// Generate context-aware fallback based on problem text
function generateFallback(problem) {
  const problemLower = problem.toLowerCase();

  if (problemLower.includes('voip') || problemLower.includes('phone') || problemLower.includes('call')) {
    return {
      summary: "You need a modern VOIP solution that fits your business requirements and budget.",
      quickWins: [
        "Sign up for free trials at RingCentral, Nextiva, and 8x8 to test call quality",
        "List your must-have features: auto-attendant, call recording, mobile app, integrations",
        "Check your internet bandwidth - you need ~100kbps per concurrent call"
      ],
      strategic: [
        "Compare RingCentral ($20-35/user), Nextiva ($18-32/user), and 8x8 ($15-44/user) based on your team size",
        "Plan number porting from your current provider - typically takes 2-4 weeks"
      ],
      longTerm: [
        "Consider unified communications (UCaaS) for video, chat, and phone in one platform",
        "Evaluate contact center features if you scale customer support"
      ],
      nextStep: "Start a free trial at RingCentral.com - they have the best overall reliability and integrations."
    };
  }

  if (problemLower.includes('crm') || problemLower.includes('sales') || problemLower.includes('customer')) {
    return {
      summary: "You need a CRM system to organize customer relationships and streamline your sales process.",
      quickWins: [
        "Start with HubSpot Free CRM - it's genuinely free for unlimited users",
        "Import your existing contacts from spreadsheets or email",
        "Set up deal stages that match your actual sales process"
      ],
      strategic: [
        "Compare HubSpot (free-$1200/mo), Salesforce ($25-300/user), and Pipedrive ($14-99/user)",
        "Integrate with your email provider for automatic activity logging"
      ],
      longTerm: [
        "Add marketing automation as you scale (HubSpot Marketing Hub or Salesforce Pardot)",
        "Build custom reports and dashboards for sales forecasting"
      ],
      nextStep: "Create a free HubSpot CRM account at hubspot.com/crm and import your contacts today."
    };
  }

  if (problemLower.includes('website') || problemLower.includes('web') || problemLower.includes('online')) {
    return {
      summary: "You need a professional website that serves your business goals and is easy to maintain.",
      quickWins: [
        "Choose your platform: Webflow for design flexibility, Squarespace for simplicity, WordPress for full control",
        "Secure your domain name through Namecheap or Google Domains ($12/year)",
        "Set up Google Analytics and Search Console from day one"
      ],
      strategic: [
        "Compare Webflow ($14-39/mo), Squarespace ($16-49/mo), or WordPress + hosting ($5-30/mo)",
        "Plan your site structure: homepage, about, services, contact, blog"
      ],
      longTerm: [
        "Implement SEO best practices - target 3-5 keywords per page",
        "Add e-commerce if needed: Shopify ($29-299/mo) or WooCommerce (free plugin)"
      ],
      nextStep: "Start with Squarespace's free trial at squarespace.com - you can build a professional site in a weekend."
    };
  }

  // Generic but still actionable fallback
  return {
    summary: `Based on your challenge with "${problem.substring(0, 50)}...", here are specific next steps.`,
    quickWins: [
      "Research the top 3 solutions in your space using G2.com or Capterra reviews",
      "Set up free trials for your top 2 choices before committing",
      "Document your requirements in a simple spreadsheet: must-haves vs nice-to-haves"
    ],
    strategic: [
      "Compare pricing across vendors - most offer discounts for annual billing (15-20% off)",
      "Check integration compatibility with your existing tools before purchasing"
    ],
    longTerm: [
      "Plan for scalability - choose solutions that grow with your business",
      "Build internal expertise through vendor training resources and certifications"
    ],
    nextStep: "Visit G2.com and search for solutions to your specific problem - filter by company size and read recent reviews."
  };
}

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
        max_tokens: 600,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = message.content[0].text;

      // Parse the JSON response
      let parsedQuestions;
      try {
        // Try to extract JSON array from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedQuestions = JSON.parse(jsonMatch[0]);
        } else {
          parsedQuestions = JSON.parse(content);
        }
      } catch {
        // Context-aware fallback questions
        const problemLower = problem.toLowerCase();
        if (problemLower.includes('voip') || problemLower.includes('phone')) {
          parsedQuestions = [
            "How many employees need phone lines or extensions?",
            "What's your monthly budget for phone/communication services?",
            "Do you need integration with any specific tools (CRM, helpdesk, etc.)?",
            "Do you have remote workers who need mobile access?",
            "What features are must-haves: auto-attendant, call recording, video conferencing?"
          ];
        } else if (problemLower.includes('crm') || problemLower.includes('sales')) {
          parsedQuestions = [
            "How many salespeople or users will need access?",
            "What's your typical sales cycle length?",
            "Do you need email marketing integration?",
            "What tools do you currently use that need to integrate?",
            "What's your budget range for CRM software?"
          ];
        } else {
          parsedQuestions = [
            "What's your budget range for solving this problem?",
            "How many people on your team will be involved?",
            "What solutions have you already tried or considered?",
            "What's your timeline for implementation?",
            "What would success look like in 90 days?"
          ];
        }
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
        max_tokens: 1800,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const content = message.content[0].text;

      // Parse the JSON response
      let recommendations;
      try {
        // Try to extract JSON object from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          recommendations = JSON.parse(content);
        }
      } catch {
        // Use context-aware fallback
        recommendations = generateFallback(problem);
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
