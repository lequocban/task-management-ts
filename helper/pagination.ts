export interface PaginationObject {
  currentPage: number;
  limitItems: number;
  skip?: number;
  totalPage?: number;
}

const paginationHelper = (
  objectPagination: PaginationObject,
  query: Record<string, any>,
  countRecords: number,
) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page.toString());
  }
  if (query.limit) {
    objectPagination.limitItems = parseInt(query.limit.toString());
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPage = Math.ceil(countRecords / objectPagination.limitItems);

  objectPagination.totalPage = totalPage;

  return objectPagination;
};

export default paginationHelper;
