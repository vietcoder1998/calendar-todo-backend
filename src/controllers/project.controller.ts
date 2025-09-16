import { Request, Response } from 'express';
import * as projectService from '../services/project.service';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getProjects();
    res.json(projects);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch projects', details: e?.message || String(e) });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (e: any) {
    res.status(400).json({ error: 'Project creation failed', details: e?.message || String(e) });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const project = await projectService.updateProject(id, req.body);
    res.json(project);
  } catch (e: any) {
    res.status(400).json({ error: 'Project update failed', details: e?.message || String(e) });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await projectService.deleteProject(id);
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: 'Project deletion failed', details: e?.message || String(e) });
  }
};
