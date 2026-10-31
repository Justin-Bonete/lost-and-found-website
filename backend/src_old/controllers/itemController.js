// backend/src/controllers/itemController.js
import ItemService from '../services/itemService.js';

class ItemController {
  async createItem(req, res, next) {
    try {
      const item = await ItemService.createItem(
        req.body,
        req.user.id,
        req.file
      );
      res.status(201).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async getItems(req, res, next) {
    try {
      const filters = {
        type: req.query.type,
        category: req.query.category,
        status: req.query.status,
        search: req.query.search,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      };

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
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

  async getItem(req, res, next) {
    try {
      const item = await ItemService.getItem(parseInt(req.params.id));
      res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const item = await ItemService.updateItem(
        parseInt(req.params.id),
        req.body,
        req.user.id,
        req.user.role
      );
      res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      await ItemService.deleteItem(
        parseInt(req.params.id),
        req.user.id,
        req.user.role
      );
      res.json({
        success: true,
        message: 'Item deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyItems(req, res, next) {
    try {
      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
      };

      const result = await ItemService.getItems(
        { userId: req.user.id },
        pagination
      );
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
}

export default new ItemController();