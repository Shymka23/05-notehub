import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import "modern-normalize/modern-normalize.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBar from "../SearchBar/SearchBar";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {
  fetchNotes,
  createNote,
  deleteNote,
  type FetchNotesResponse,
} from "../../services/noteService";
import type { NoteTag } from "../../types/note";

export default function App() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Запит нотаток
  const { data, isLoading, isError, error, isFetching } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes({ search: debouncedSearch, page, perPage: 12 }),
  });

  // Мутація створення нотатки
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  // Мутація видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (selected: number) => {
    setPage(selected + 1);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreate = (values: {
    title: string;
    content: string;
    tag: NoteTag;
  }) => {
    createMutation.mutate(values);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBar onSearch={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            pageCount={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isLoading || isFetching ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message={error?.message || "Error"} />
      ) : (
        data &&
        data.notes.length > 0 && (
          <NoteList notes={data.notes} onDelete={handleDelete} />
        )
      )}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreate}
            onCancel={() => setIsModalOpen(false)}
            isLoading={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
