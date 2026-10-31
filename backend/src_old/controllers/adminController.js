// backend/src/controllers/adminController.js
import ItemService from '../services/itemService.js';
import ClaimService from '../services/claimService.js';
import UserRepository from '../repositories/userRepository.js';
import ReportRepository from '../repositories/reportRepository.js';

class AdminController {
  async getDashboardStats(req, res, next) {
    try {
      const itemStats = await ItemService.getStats();
      const users = await UserRepository.findAll({}, { page: 1, limit: 1 });
      const pendingClaims = await ClaimService.getAllClaims({ status: 'PENDING' }, { page: 1, limit: 1 });

      res.json({
        success: true,
        data: {
          totalItems: itemStats.totalItems,
          lostItems: itemStats.lostItems,
          foundItems: itemStats.foundItems,
          claimedItems: itemStats.claimedItems,
          pendingItems: itemStats.pendingItems,
          totalUsers: users.total,
          pendingClaims: pendingClaims.total,
          itemsByCategory: itemStats.itemsByCategory,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async approveItem(req, res, next) {
    try {
      const item = await ItemService.approveItem(
        parseInt(req.params.id),
        req.user.id
      );
      res.json({
        success: true,
        data: item,
        message: 'Item approved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectItem(req, res, next) {
    try {
      const { reason } = req.body;
      const item = await ItemService.rejectItem(
        parseInt(req.params.id),
        req.user.id,
        reason
      );
      res.json({
        success: true,
        data: item,
        message: 'Item rejected',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllItems(req, res, next) {
    try {
      const filters = {
        type: req.query.type,
        category: req.query.category,
        status: req.query.status,
        search: req.query.search,
        includePending: true,
      };

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const result = await ItemService.getItems(filters, pagination);
      res.json({
        success: true,
        data: result.items,
        pagination: {
          page: result.page,
          limit: pagination.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const filters = {
        role: req.query.role,
        isActive: req.query.isActive === 'true',
        search: req.query.search,
      };

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      };

      const result = await UserRepository.findAll(filters, pagination);
      res.json({
        success: true,
        data: result.users,
        pagination: {
          page: result.page,
          limit: pagination.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { role, isActive } = req.body;
      const user = await UserRepository.update(parseInt(req.params.id), {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      });
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllClaims(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
      };

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      };

      const result = await ClaimService.getAllClaims(filters, pagination);
      res.json({
        success: true,
        data: result.claims,
        pagination: {
          page: result.page,
          limit: pagination.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async processClaim(req, res, next) {
    try {
      const { status, rejectionReason } = req.body;
      const claim = await ClaimService.processClaim(
        parseInt(req.params.id),
        status,
        req.user.id,
        rejectionReason
      );
      res.json({
        success: true,
        data: claim,
        message: `Claim ${status.toLowerCase()} successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();