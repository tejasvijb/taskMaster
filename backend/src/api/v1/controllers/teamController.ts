import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

import { sendTeamInvitation } from "../../../services/emailService.js";
import { query } from "../config/dbConnection.js";
import { STATUS_CODES } from "../constants/index.js";
import { TeamInvitationType } from "../validations/teamInvitationValidate.js";
import { TeamCreateType } from "../validations/teamValidate.js";

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, name } = req.body as TeamCreateType;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Insert team into database
    const result = await query(
      `INSERT INTO teams (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, created_by, created_at, updated_at`,
      [name, description || null, userId],
    );

    const team = result.rows[0];

    res.status(STATUS_CODES.CREATED).json({
      message: "Team created successfully",
      success: true,
      team: {
        created_at: team.created_at,
        created_by: team.created_by,
        description: team.description,
        id: team.id,
        name: team.name,
        updated_at: team.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Get all teams where user is a member or creator
    const result = await query(
      `SELECT DISTINCT t.id, t.name, t.description, t.created_by, t.created_at, t.updated_at
       FROM teams t
       LEFT JOIN team_members tm ON t.id = tm.team_id
       WHERE t.created_by = $1 OR tm.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId],
    );

    const teams = result.rows.map((team) => ({
      created_at: team.created_at,
      created_by: team.created_by,
      description: team.description,
      id: team.id,
      name: team.name,
      updated_at: team.updated_at,
    }));

    res.status(STATUS_CODES.OK).json({
      success: true,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Check if user is a member of the team or the creator
    const membershipCheck = await query(
      `SELECT t.id FROM teams t
       LEFT JOIN team_members tm ON t.id = tm.team_id
       WHERE t.id = $1 AND (t.created_by = $2 OR tm.user_id = $2)`,
      [teamId, userId],
    );

    if (membershipCheck.rows.length === 0) {
      res.status(STATUS_CODES.FORBIDDEN);
      throw new Error("You do not have access to this team or this team does not exist");
    }

    // Get team details
    const result = await query(
      `SELECT id, name, description, created_by, created_at, updated_at
       FROM teams
       WHERE id = $1`,
      [teamId],
    );

    if (result.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Team not found");
    }

    const team = result.rows[0];

    res.status(STATUS_CODES.OK).json({
      success: true,
      team: {
        created_at: team.created_at,
        created_by: team.created_by,
        description: team.description,
        id: team.id,
        name: team.name,
        updated_at: team.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const inviteUserToTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamId } = req.params;
    const { email } = req.body as TeamInvitationType;
    const userId = req.user?.id;
    const userName = req.user?.firstname;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Verify team exists and user is the creator or has permission
    const teamExists = await query("SELECT id, name, created_by FROM teams WHERE id = $1", [teamId]);
    if (teamExists.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Team not found");
    }

    const team = teamExists.rows[0];
    if (team.created_by !== userId) {
      res.status(STATUS_CODES.FORBIDDEN);
      throw new Error("Only team creator can invite members");
    }

    // Check if invitation already exists and is not expired
    const existingInvitation = await query(
      `SELECT id FROM team_invitations 
       WHERE team_id = $1 AND email = $2 AND status = 'pending' AND expires_at > CURRENT_TIMESTAMP`,
      [teamId, email],
    );

    if (existingInvitation.rows.length > 0) {
      res.status(STATUS_CODES.CONFLICT);
      throw new Error("An active invitation already exists for this email");
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex");

    // Set expiration to 7 days from now
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Insert invitation into database
    const result = await query(
      `INSERT INTO team_invitations (team_id, email, invited_by, token, status, expires_at)
       VALUES ($1, $2, $3, $4, 'pending', $5)
       RETURNING id, team_id, email, invited_by, token, status, expires_at, created_at`,
      [teamId, email, userId, token, expiresAt],
    );

    const invitation = result.rows[0];

    // Send invitation email
    await sendTeamInvitation({
      email,
      invitedBy: userName || "A user",
      teamName: team.name,
      token,
    });

    res.status(STATUS_CODES.CREATED).json({
      invitation: {
        created_at: invitation.created_at,
        email: invitation.email,
        expires_at: invitation.expires_at,
        id: invitation.id,
        invited_by: invitation.invited_by,
        status: invitation.status,
        team_id: invitation.team_id,
        token: invitation.token,
      },
      message: "Invitation sent successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
