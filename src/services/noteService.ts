// Сервіс для роботи з нотатками
import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  id: string;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const filteredParams = { ...params };
  if (!filteredParams.search) {
    delete filteredParams.search;
  }
  try {
    const { data } = await axiosInstance.get<FetchNotesResponse>("", {
      params: filteredParams,
    });
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Не вдалося отримати нотатки"
    );
  }
}

export async function createNote(params: CreateNoteParams): Promise<Note> {
  try {
    const { data } = await axiosInstance.post<Note>("", params);
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Не вдалося створити нотатку"
    );
  }
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  try {
    const { data } = await axiosInstance.delete<DeleteNoteResponse>(`/${id}`);
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Не вдалося видалити нотатку"
    );
  }
}
