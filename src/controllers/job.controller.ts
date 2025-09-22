import { Request, Response } from 'express';
import * as jobService from '../services/job.service';

export const getJobs = async (req: Request, res: Response) => {
  const jobs = await jobService.getJobs(req.query.webhookId as string | undefined);
  res.json(jobs);
};

export const getJobById = async (req: Request, res: Response) => {
  const job = await jobService.getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
};

export const createJob = async (req: Request, res: Response) => {
  const job = await jobService.createJob(req.body);
  res.status(201).json(job);
};

export const updateJob = async (req: Request, res: Response) => {
  const job = await jobService.updateJob(req.params.id, req.body);
  res.json(job);
};

export const deleteJob = async (req: Request, res: Response) => {
  await jobService.deleteJob(req.params.id);
  res.status(204).send();
};
