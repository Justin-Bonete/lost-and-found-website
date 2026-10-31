// backend/src/repositories/claimRepository.js
import prisma from '../config/database.js';

class ClaimRepository {
  async create(claimData) {
    return prisma.claim.create({
      data: claimData,
      include: {
        item: {
          include: {
            user: { select: { id: true, username: true, email: true } },
          },
        },
        user: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async findById(id) {
    return prisma.claim.findUnique({
      where: { id },
      include: {
        item: {
          include: {
            user: { select: { id: true, username: true, email: true } },
          },
        },
        user: { select: { id: true, username: true, email: true, phoneNumber: true } },
        processedBy: { select: { id: true, username: true, fullName: true } },
      },
    });
  }

  async findByItemAndUser(itemId, userId) {
    return prisma.claim.findUnique({
      where: {
        itemId_userId: { itemId, userId },
      },
    });
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.status && { status: filters.status }),
      ...(filters.itemId && { itemId: filters.itemId }),
      ...(filters.userId && { userId: filters.userId }),
    };

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          item: {
            select: { id: true, title: true, type: true, status: true },
          },
          user: { select: { id: true, username: true, fullName: true } },
        },
      }),
      prisma.claim.count({ where }),
    ]);

    return { claims, total, page, totalPages: Math.ceil(total / limit) };
  }

  async update(id, data) {
    return prisma.claim.update({
      where: { id },
      data,
      include: {
        item: true,
        user: true,
      },
    });
  }
}

export default new ClaimRepository();