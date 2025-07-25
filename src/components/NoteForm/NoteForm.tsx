import React from "react";
import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

export interface NoteFormProps {
  onCancel: () => void;
}

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3 symbols")
    .max(50, "Max 50 symbols")
    .required("Required"),
  content: Yup.string().max(500, "Max 500 symbols"),
  tag: Yup.string()
    .oneOf(TAGS as unknown as string[], "Invalid tag")
    .required("Required"),
});

const initialValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        mutation.mutate({ ...values, tag: values.tag as NoteTag });
        resetForm();
      }}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <FormikError name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <FormikError
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAGS.map((tag) => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <FormikError name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={mutation.isPending}
            >
              Створити нотатку
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
