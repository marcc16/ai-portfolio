import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { SkillsChart } from "./SkillsChart";

// Define interface matching the query
interface Skill {
  name: string | null;
  category: string | null;
  proficiency: string | null;
  percentage: number | null;
  yearsOfExperience: number | null;
  color: string | null;
}

const SKILLS_QUERY =
  defineQuery(`*[_type == "skill"] | order(category asc, order asc){
  name,
  category,
  proficiency,
  percentage,
  yearsOfExperience,
  color
}`);

export async function SkillsSection() {
  const { data } = await sanityFetch({ query: SKILLS_QUERY });
  const skills = data as unknown as Skill[]; // Cast to proper array type

  // Check if skills exists and is an array with length
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="py-20 px-6 bg-zinc-950/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Stack Tecnológico
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Las tecnologías y frameworks principales que impulsan mis soluciones de IA.
          </p>
        </div>

        <SkillsChart skills={skills} />
      </div>
    </section>
  );
}
