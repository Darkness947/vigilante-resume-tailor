import nodemailer from 'nodemailer';

export async function sendTailoredResumeEmail({
  toEmail,
  resumeLink,
  atsScore,
  jobTitle
}: {
  toEmail: string;
  resumeLink: string;
  atsScore: number;
  jobTitle: string;
}) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('[Email Warning] GMAIL_USER or GMAIL_APP_PASSWORD not set. Skipping email notification.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"VIGILANTE Resume Tailor" <${user}>`,
    to: toEmail,
    subject: `Your Resume Tailored: ${jobTitle || 'Untitiled Role'} (${atsScore}% ATS Score)`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 40px; text-align: center;">
        <h1 style="color: #fff; letter-spacing: 2px;">VIGILANTE</h1>
        <h2 style="color: #666; font-weight: normal; margin-bottom: 40px;">PROTOCOL: TAILOR COMPLETE</h2>
        
        <div style="background-color: #111; border: 1px solid #333; border-radius: 8px; padding: 40px; margin: 0 auto; max-width: 600px;">
          <p style="font-size: 16px; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">Target Designator:</p>
          <p style="font-size: 24px; font-weight: bold; margin-bottom: 30px; letter-spacing: 0.5px;">${jobTitle || 'N/A'}</p>
          
          <div style="margin-bottom: 40px; padding: 20px 0; border-top: 1px solid #222; border-bottom: 1px solid #222;">
             <p style="font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Estimated ATS Score</p>
             <p style="font-size: 48px; font-weight: black; color: ${atsScore >= 80 ? '#4ADE80' : '#FBBF24'}; margin: 0; font-family: monospace;">${atsScore}%</p>
          </div>

          <a href="${resumeLink}" style="display: inline-block; background-color: #fff; color: #000; padding: 16px 36px; text-decoration: none; font-weight: 900; letter-spacing: 1px; border-radius: 4px; font-size: 14px; text-transform: uppercase;">Download PDF Asset</a>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px; line-height: 1.5;">
            This secure channel link is valid for exactly 2 hours.<br/>Extract your document immediately.
          </p>
        </div>
        
        <p style="font-size: 10px; color: #444; margin-top: 40px; letter-spacing: 1px;">
          DO NOT REPLY TO THIS AUTOMATED DISPATCH.<br/>
          VIGILANTE AI PROTOCOL
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email Success] Notification sent to ${toEmail}`);
  } catch (err) {
    console.error('[Email Error] Failed to send email:', err);
    throw err; // Re-throw to be caught in the main action
  }
}
