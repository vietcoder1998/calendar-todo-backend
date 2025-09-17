import { Location } from '@/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getLocationsByProjectId(projectId: string): Promise<Location[]> {
  return prisma.location.findMany({ where: { projectId } });
}

export async function createLocation(
  projectId: string,
  data: Partial<Location>,
): Promise<Location> {
  return prisma.location.create({
    data: {
      ...data,
      projectId,
    } as any,
  });
}

export async function getLocationById(
  projectId: string,
  locationId: string,
): Promise<Location | null> {
  return prisma.location.findFirst({ where: { id: locationId, projectId } });
}

export async function updateLocation(
  projectId: string,
  locationId: string,
  data: Partial<Location>,
): Promise<Location | null> {
  return prisma.location.update({
    where: { id: locationId },
    data,
  });
}

export async function deleteLocation(projectId: string, locationId: string): Promise<void> {
  await prisma.location.delete({ where: { id: locationId } });
}
