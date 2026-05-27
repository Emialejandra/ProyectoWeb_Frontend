export const normalizeUser = (user) => {
  if (!user || typeof user !== "object") {
    return null;
  }

  const metadata = user.user_metadata || {};
  const categories = Array.isArray(user.categories)
    ? user.categories
    : Array.isArray(metadata.categories)
    ? metadata.categories
    : [];

  return {
    ...user,
    first_name: user.first_name ?? metadata.first_name ?? "",
    last_name: user.last_name ?? metadata.last_name ?? "",
    age: user.age ?? metadata.age ?? "",
    salary: user.salary ?? metadata.salary ?? "",
    children_count:
      user.children_count ?? metadata.children_count ?? "",
    pets_count: user.pets_count ?? metadata.pets_count ?? "",
    categories
  };
};
