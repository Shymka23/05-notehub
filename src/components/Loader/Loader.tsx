import css from "./Loader.module.css";

export interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => (
  <p className={css.text}>{message || "Loading, please wait..."}</p>
);

export default Loader;
