export type PaginationHelperParams = {
  count: number;
  limit: number;
  page: number;
};

export default function paginationHelper({
  count,
  limit,
  page,
}: PaginationHelperParams) {
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(count / limit) ?? 0;
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return { offset, totalPages, hasNextPage, hasPreviousPage };
}
