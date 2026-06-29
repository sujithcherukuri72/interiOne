export type Project = {
  id: string;
  slug: string;
  title: string;
  location: string;
  year: number;
  category: string;
  /** Low-res placeholder colour (CSS hex) shown instantly */
  placeholderColor: string;
  /** Full-quality image path (lazy-swapped after first render) */
  imageSrc: string;
};
