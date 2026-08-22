import { Application, ApplicationStatus } from "./types";
import { INITIAL_APPLICANTS } from "./constants";

// In-memory global fallback for server routes when Neon DB is not connected
declare global {
  var __comclick_memory_apps: Application[] | undefined;
}

const getMemoryStore = (): Application[] => {
  if (!globalThis.__comclick_memory_apps || !Array.isArray(globalThis.__comclick_memory_apps)) {
    globalThis.__comclick_memory_apps = [...INITIAL_APPLICANTS];
  }
  return globalThis.__comclick_memory_apps;
};

const setMemoryStore = (apps: Application[]): void => {
  globalThis.__comclick_memory_apps = apps;
};

export const getApplications = (): Application[] => {
  return getMemoryStore();
};

export const clearAllApplications = (): void => {
  setMemoryStore([]);
};

export const saveApplications = (apps: Application[]): void => {
  setMemoryStore(apps);
};

export const addApplication = (app: Omit<Application, "id" | "createdAt" | "updatedAt" | "status"> & { id?: string; status?: ApplicationStatus }): Application => {
  const all = getApplications();
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const id = app.id || `CC20-${year}-${randomNum}`;
  const now = new Date().toISOString();

  const newApp: Application = {
    ...app,
    id,
    createdAt: (app as any).createdAt || now,
    updatedAt: now,
    status: app.status || "SUBMITTED",
  };

  const filtered = all.filter((a) => a.id !== id);
  const updated = [newApp, ...filtered];
  saveApplications(updated);
  return newApp;
};

export const findApplication = (query: string): Application | undefined => {
  const clean = query.trim().toLowerCase().replace(/-/g, "");
  const all = getApplications();
  return all.find((app) => {
    const id = app.id.toLowerCase().replace(/-/g, "");
    const studentId = app.studentId.toLowerCase().replace(/-/g, "");
    const phone = app.phone.replace(/-/g, "");
    const name = app.fullNameTh.toLowerCase();
    return id.includes(clean) || studentId.includes(clean) || phone.includes(clean) || name.includes(clean);
  });
};

export const findApplicationByQuery = (query: string): Application | undefined => {
  return findApplication(query);
};

export const updateApplicationStatus = (
  id: string,
  status: Application["status"],
  notes?: string,
  interviewDate?: string,
  assignedDeptId?: string
): Application | null => {
  const all = getApplications();
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const current = all[index];
  const updated: Application = {
    ...current,
    status,
    statusNotes: notes !== undefined ? notes : current.statusNotes,
    interviewDate: interviewDate !== undefined ? interviewDate : current.interviewDate,
    assignedDeptId: assignedDeptId !== undefined ? assignedDeptId : current.assignedDeptId,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  saveApplications(all);
  return updated;
};

export const updateApplicationInterview = (
  id: string,
  interviewDate: string,
  interviewLocation?: string
): Application | null => {
  const all = getApplications();
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const current = all[index];
  const updated: Application = {
    ...current,
    interviewDate,
    interviewLocation: interviewLocation || current.interviewLocation,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  saveApplications(all);
  return updated;
};

export const updateApplicationFull = (
  id: string,
  data: Partial<Application>
): Application | null => {
  const all = getApplications();
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const current = all[index];
  const updated: Application = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  saveApplications(all);
  return updated;
};

export const deleteApplication = (id: string): boolean => {
  const all = getApplications();
  const filtered = all.filter((a) => a.id !== id);
  if (filtered.length === all.length) return false;
  saveApplications(filtered);
  return true;
};

export const resetToInitialData = (): Application[] => {
  saveApplications([]);
  return [];
};

