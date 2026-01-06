export type Contributor = {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  bio: string;
  area?: string; // optional
  tags?: string[]; // optional
};

export const CONTRIBUTORS: Contributor[] = [
  {
    name: "Abhishek Kumar",
    email: "example@email.com",
    github: "https://github.com/abhishek-nexgen-dev",
    linkedin: "https://www.linkedin.com/in/your-link/",
    bio: "Aspiring software engineer. Interested in building friendly open-source tools.",
    area: "Core development",
    tags: ["frontend", "typescript"],
  },
];
