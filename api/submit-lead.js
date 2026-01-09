const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message, problemSummary } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Format the email content
    const emailHtml = `
      <h2>New Consultation Request from Simplr Scout</h2>

      <h3>Contact Information</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
      </ul>

      <h3>Message</h3>
      <p>${message || 'No message provided'}</p>

      ${problemSummary ? `
        <h3>Problem Summary (from Simplr Scout analysis)</h3>
        <p>${problemSummary}</p>
      ` : ''}

      <hr>
      <p style="color: #666; font-size: 12px;">
        This lead was submitted through Simplr Scout at ${new Date().toISOString()}
      </p>
    `;

    const emailText = `
New Consultation Request from Simplr Scout

Contact Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}

Message:
${message || 'No message provided'}

${problemSummary ? `Problem Summary (from Simplr Scout analysis):
${problemSummary}` : ''}

---
Submitted at ${new Date().toISOString()}
    `;

    // Send email via Resend
    // Using Resend's default sender - no domain verification needed
    // Update 'to' address to your actual email that works
    const { data, error } = await resend.emails.send({
      from: 'Simplr Scout <onboarding@resend.dev>',
      to: [process.env.NOTIFICATION_EMAIL || 'hello@buildsimplr.com'],
      replyTo: email,
      subject: `New Consultation Request: ${name}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error('Resend error:', error);
      // Still log the lead even if email fails
      console.log('LEAD CAPTURED:', { name, email, phone, message, problemSummary, timestamp: new Date().toISOString() });
      return res.status(500).json({ error: 'Failed to send notification, but your request was received.' });
    }

    // Log successful lead
    console.log('LEAD CAPTURED:', {
      name,
      email,
      phone,
      message,
      problemSummary,
      emailId: data?.id,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you! We will be in touch within 24 hours.'
    });

  } catch (error) {
    console.error('Submit lead error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
