import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.SMTP_PASSWORD,
    user: process.env.SMTP_USER,
  },
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
});

interface SendTeamInvitationParams {
  email: string;
  invitedBy: string;
  teamName: string;
  token: string;
}

export const sendTeamInvitation = async ({ email, invitedBy, teamName, token }: SendTeamInvitationParams) => {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const invitationLink = `${appUrl}/accept-invitation?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    html: `
      <h2>You've been invited to join a team!</h2>
      <p>${invitedBy} has invited you to join <strong>${teamName}</strong> on TaskMaster.</p>
      <p>
        <a href="${invitationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Accept Invitation
        </a>
      </p>
      <p>Or copy this link: <a href="${invitationLink}">${invitationLink}</a></p>
      <p>This invitation expires in 7 days.</p>
      <p>If you didn't expect this invitation, you can safely ignore this email.</p>
    `,
    subject: `You've been invited to join ${teamName} on TaskMaster`,
    text: `
      You've been invited to join a team!
      ${invitedBy} has invited you to join ${teamName} on TaskMaster.
      
      Accept the invitation here: ${invitationLink}
      
      This invitation expires in 7 days.
    `,
    to: email,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending invitation email:", error);
    throw new Error("Failed to send invitation email");
  }
};
