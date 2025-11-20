// Define props type for the Card component
export interface CardProps {
  title: string;
  desc: string;
}
export interface LoaderProps {
  fn: (value: boolean) => void;
}
