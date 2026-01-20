import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { FloatingDockClient } from "./FloatingDockClient";

const NAVIGATION_QUERY =
  defineQuery(`*[_type == "navigation"] | order(order asc){
  title,
  href,
  icon,
  isExternal
}`);

export async function FloatingDock() {
  const { data: navItems } = await sanityFetch({ query: NAVIGATION_QUERY });

  if (!navItems || navItems.length === 0) {
    return null;
  }

  // Filter out items that shouldn't appear in the dock
  const excludedTitles = ['github', 'achievements', 'blog', 'testimonials', 'twitter'];
  const filteredNavItems = navItems?.filter(item =>
    !excludedTitles.some(excluded =>
      item.title?.toLowerCase().includes(excluded)
    )
  ) || [];

  return <FloatingDockClient navItems={filteredNavItems} />;
}
