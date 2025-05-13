export type Project = {
  id: number;
  title: string;
  description: string;
  Technologies: string[];
  imageUrl?: string;
  icon?: React.ReactNode;
  url?: string;
};
