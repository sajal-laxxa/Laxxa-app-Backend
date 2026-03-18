import prisma from "../../../prisma/prisma.js";

// Insert
export const insertData = async (tableName, data) => {
    return prisma[tableName].create({
        data,
    });
};

// Get (pagination + filter + sort + include)
export const getData = async (
    tableName,
    {
        page = 1,
        limit = 10,
        filter = {},
        sortBy = "id",
        order = "desc",
        include = {},
        select = null,
    } = {},
) => {
    const skip = (page - 1) * limit;

    return prisma[tableName].findMany({
        where: filter,
        skip,
        take: Number(limit),
        orderBy: {
            [sortBy]: order,
        },
        ...(include && { include }),
        ...(select && { select }),
    });
};
// Get by ID
export const getById = async (tableName, keyId, valueId, options = {}) => {
    return prisma[tableName].findUnique({
        where: { [keyId]: valueId }, //
        ...options,
    });
};

// Update
export const editData = async (tableName, keyId, valueId, data) => {
    return prisma[tableName].update({
        where: { [keyId]: valueId },
        data,
    });
};

// Soft delete (recommended)
export const softDelete = async (tableName, keyId, valueId) => {
    return prisma[tableName].update({
        where: { [keyId]: valueId },
        data: { isDeleted: true },
    });
};

// Hard delete
export const deleteData = async (tableName, keyId, valueId) => {
    return prisma[tableName].delete({
        where: { [keyId]: valueId },
    });
};

// Count (for pagination UI)
export const countData = async (tableName, filter = {}) => {
    return prisma[tableName].count({
        where: filter,
    });
};
