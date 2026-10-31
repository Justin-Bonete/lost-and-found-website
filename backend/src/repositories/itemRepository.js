// backend/src/repositories/itemRepository.js
import prisma from '../config/database.js';

class ItemRepository {
  async create(itemData) {
    return prisma.item.create({
      data: itemData,
      include: {
        user: {
          select: { id: true, username: true, fullName: true },
        },
      },
    });
  }

  async findById(id) {
    return prisma.item.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, fullName: true, email: true },
        },
        claims: {
          where: { status: 'APPROVED' },
          select: { id: true, userId: true },
        },
        approvedBy: {
          select: { id: true, username: true, fullName: true },
        },
      },
    });
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 12 }) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status }),
      ...(filters.category && { category: filters.category }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search } },
          { description: { contains: filters.search } },
          { location: { contains: filters.search } },
          { brand: { contains: filters.search } },
        ],
      }),
      ...(filters.dateFrom && {
        dateFoundOrLost: { gte: new Date(filters.dateFrom) },
      }),
      ...(filters.dateTo && {
        dateFoundOrLost: { lte: new Date(filters.dateTo) },
      }),
    };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, username: true, fullName: true },
          },
        },
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async update(id, data) {
    return prisma.item.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, username: true, fullName: true },
        },
      },
    });
  }

  async delete(id) {
    return prisma.item.delete({ where: { id } });
  }

  async getStats() {
    const [
      totalItems,
      lostItems,
      foundItems,
      claimedItems,
      pendingItems,
      itemsByCategory,
    ] = await Promise.all([
      prisma.item.count(),
      prisma.item.count({ where: { type: 'LOST' } }),
      prisma.item.count({ where: { type: 'FOUND' } }),
      prisma.item.count({ where: { status: 'CLAIMED' } }),
      prisma.item.count({ where: { status: 'PENDING' } }),
      prisma.item.groupBy({
        by: ['category'],
        _count: true,
      }),
    ]);

    return {
      totalItems,
      lostItems,
      foundItems,
      claimedItems,
      pendingItems,
      itemsByCategory,
    };
  }
}

export default new ItemRepository(); 