import { Request, Response } from 'express';
import * as assetService from '../services/asset.service';

export const getAssets = async (req: Request, res: Response) => {
  const { id } = req.query;
  const assets = await assetService.getAssets(id as string | undefined);
  res.json(assets);
};

export const getAssetById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const asset = await assetService.getAssetById(id);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  res.json(asset);
};

export const createAsset = async (req: Request, res: Response) => {
  const asset = await assetService.createAsset(req.body);
  res.status(201).json(asset);
};

export const updateAsset = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await assetService.updateAsset(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Asset not found' });
  res.json(updated);
};

export const deleteAsset = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await assetService.deleteAsset(id);
  if (!deleted) return res.status(404).json({ message: 'Asset not found' });
  res.json({ success: true });
};
