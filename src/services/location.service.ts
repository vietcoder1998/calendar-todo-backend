import { Location } from '@/types';
import { PrismaClient } from '@prisma/client';
import { createAsset } from './asset.util';

const prisma = new PrismaClient();

export async function getLocationsByProjectId(projectId: string): Promise<Location[]> {
  const results = await prisma.location.findMany({ where: { projectId } });
  return results.map((loc) => ({
    ...loc,
    googleMapsLink: loc.googleMapsLink ?? undefined,
    createdAt: loc.createdAt instanceof Date ? loc.createdAt.toISOString() : loc.createdAt,
    updatedAt: loc.updatedAt instanceof Date ? loc.updatedAt.toISOString() : loc.updatedAt,
  }));
}

export async function createLocation(
  projectId: string,
  data: Omit<Location, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>,
): Promise<Location> {
  // Create asset and link
  let assetId: string | null = null;
  if (data.name) {
    assetId = await createAsset(data.name, 'location');
  }
  const loc = await prisma.location.create({
    data: {
      ...data,
      projectId,
      assetId,
    },
  });
  return {
    ...loc,
    googleMapsLink: loc.googleMapsLink ?? undefined,
    createdAt: loc.createdAt.toISOString(),
    updatedAt: loc.updatedAt.toISOString(),
  };
}

export async function getLocationById(
  projectId: string,
  locationId: string,
): Promise<Location | null> {
  const loc = await prisma.location.findFirst({ where: { id: locationId, projectId } });
  return loc
    ? {
        ...loc,
        googleMapsLink: loc.googleMapsLink ?? undefined,
        createdAt: loc.createdAt.toISOString(),
        updatedAt: loc.updatedAt.toISOString(),
      }
    : null;
}

export async function updateLocation(
  projectId: string,
  locationId: string,
  data: Partial<Location>,
): Promise<Location | null> {
  const loc = await prisma.location.update({
    where: { id: locationId },
    data,
  });
  return loc
    ? {
        ...loc,
        googleMapsLink: loc.googleMapsLink ?? undefined,
        createdAt: loc.createdAt instanceof Date ? loc.createdAt.toISOString() : loc.createdAt,
        updatedAt: loc.updatedAt instanceof Date ? loc.updatedAt.toISOString() : loc.updatedAt,
      }
    : null;
}

export async function deleteLocation(projectId: string, locationId: string): Promise<void> {
  await prisma.location.delete({ where: { id: locationId } });
}
