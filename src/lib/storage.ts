import { Application } from "./types";
import { INITIAL_APPLICANTS } from "./constants";

const STORAGE_KEY = "comclick_20_applications_v1";

// In-memory fallback for SSR / Server routes
let memoryApplications: Application[] = [...INITIAL_APPLICANTS];

export const getApplications = (): Application[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored !== "[]") {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICANTS));
      return [...INITIAL_APPLICANTS];
    } catch (e) {
      console.warn("Could not read from localStorage, using memory state", e);
    }
  }
  return memoryApplications.length > 0 ? memoryApplications : [...INITIAL_APPLICANTS];
};

export const saveApplications = (apps: Application[]): void => {
  memoryApplications = apps;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
      window.dispatchEvent(new Event("comclick_storage_updated"));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }
};

export const addApplication = (app: Omit<Application, "id" | "createdAt" | "updatedAt" | "status">): Application => {
  const all = getApplications();
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const id = `CC20-${year}-${randomNum}`;
  const now = new Date().toISOString();

  const newApp: Application = {
    ...app,
    id,
    createdAt: now,
    updatedAt: now,
    status: "SUBMITTED",
  };

  const updated = [newApp, ...all];
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

