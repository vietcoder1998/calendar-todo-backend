import { Request, Response } from 'express';
import * as projectService from '../services/project.service';
import * as userService from '../services/user.service';
import * as linkedItemService from '../services/linkedItem.service';
import * as fileService from '../services/file.service';
import * as webhookService from '../services/webhook.service';
import * as historyService from '../services/history.service';
import * as locationService from '../services/location.service';
import logger from '../logger';

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = req.params.projectId || req.params.id;
    const project = await projectService.getProjectById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    logger.info('Fetched project detail: %s', id);
    res.json(project);
  } catch (e: any) {
    logger.error('Failed to fetch project detail: %s', e?.message || e);
    res
      .status(500)
      .json({ error: 'Failed to fetch project detail', details: e?.message || String(e) });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getProjects();
    logger.info('Fetched projects');
    res.json(projects);
  } catch (e: any) {
    logger.error('Failed to fetch projects: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch projects', details: e?.message || String(e) });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    // Remove projectId if present
    const { projectId, ...rest } = req.body;
    const project = await projectService.createProject(rest);
    logger.info('Created project: %o', project);
    res.status(201).json(project);
  } catch (e: any) {
    logger.error('Project creation failed: %s', e?.message || e);
    res.status(400).json({ error: 'Project creation failed', details: e?.message || String(e) });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    logger.info('Updated project: %o', project);
    res.json(project);
  } catch (e: any) {
    logger.error('Project update failed: %s', e?.message || e);
    res.status(400).json({ error: 'Project update failed', details: e?.message || String(e) });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await projectService.deleteProject(req.params.id);
    logger.info('Deleted project: %s', req.params.id);
    res.status(204).end();
  } catch (e: any) {
    logger.error('Project deletion failed: %s', e?.message || e);
    res.status(400).json({ error: 'Project deletion failed', details: e?.message || String(e) });
  }
};

export const getUsersByProjectId = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const users = await userService.getUsersByProject(projectId);
    res.json(users);
  } catch (e: any) {
    logger.error('Failed to fetch users: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch users', details: e?.message || String(e) });
  }
};

export const getLinkedItems = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const items = await linkedItemService.getLinkedItems(projectId);
    res.json(items);
  } catch (e: any) {
    logger.error('Failed to fetch linked items: %s', e?.message || e);
    res
      .status(500)
      .json({ error: 'Failed to fetch linked items', details: e?.message || String(e) });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const files = await fileService.getFiles(projectId);
    res.json(files);
  } catch (e: any) {
    logger.error('Failed to fetch files: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch files', details: e?.message || String(e) });
  }
};

export const getWebhooks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const webhooks = await webhookService.getWebhooks(projectId);
    res.json(webhooks);
  } catch (e: any) {
    logger.error('Failed to fetch webhooks: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch webhooks', details: e?.message || String(e) });
  }
};

export const getHistories = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const histories = await historyService.getHistories(projectId);
    res.json(histories);
  } catch (e: any) {
    logger.error('Failed to fetch histories: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch histories', details: e?.message || String(e) });
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const locations = await locationService.getLocationsByProjectId(projectId);
    res.json(locations);
  } catch (e: any) {
    logger.error('Failed to fetch locations: %s', e?.message || e);
    res.status(500).json({ error: 'Failed to fetch locations', details: e?.message || String(e) });
  }
};
