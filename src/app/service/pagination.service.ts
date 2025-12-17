import { Model } from "mongoose";

type PaginationOptions = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 1 | -1;
  filter?: Record<string, any>;
  q?: string;
  searchFields?: string[];
};

export async function paginate<T>(
  model: Model<T>,
  {
    page,
    limit,
    sortBy = "createdAt",
    sortOrder = -1,
    filter = {},
    q = "",
    searchFields = [],
  }: PaginationOptions
) {
  const safePage = Math.max(1, Number(page || 1));
  const safeLimit = Math.min(100, Math.max(1, Number(limit || 10)));
  const skip = (safePage - 1) * safeLimit;

  // Search condition
  const searchCondition =
    q && searchFields.length
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: q, $options: "i" },
          })),
        }
      : {};

  const finalFilter = { ...filter, ...searchCondition };

  const [data, total] = await Promise.all([
    model
      .find(finalFilter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    model.countDocuments(finalFilter),
  ]);

  const totalPages = Math.ceil(total / safeLimit);

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
}
