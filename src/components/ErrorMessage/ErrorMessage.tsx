import css from "./ErrorMessage.module.css";

export interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <p className={css.text}>{message}</p>
);

export default ErrorMessage;
