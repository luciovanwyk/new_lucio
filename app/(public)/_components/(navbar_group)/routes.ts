export interface Route {
  name: string;
  path: string;
}

export const getRoutes = (isLoggedIn = false, role?: string): Route[] => {
  const baseRoutes: Route[] = [
    { name: "Home", path: "/" },
    { name: "Headwear", path: "/headwear" },
    { name: "Apparel", path: "/apparel" },
    { name: "All Collections", path: "/all-collections" },
  ];

  if (isLoggedIn && role) {
    const dashboardPath = `/${role.toLowerCase()}/dashboard`;
    baseRoutes.push({ name: "My Dashboard", path: dashboardPath });
  }

  return baseRoutes;
};