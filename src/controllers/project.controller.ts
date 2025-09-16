import { Request, Response } from 'express';
import * as projectService from '../services/project.service';
import logger from '../logger';

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
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
    const project = await projectService.createProject(req.body);
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
