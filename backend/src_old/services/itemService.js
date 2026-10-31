// backend/src/services/itemService.js
import ItemRepository from '../repositories/itemRepository.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import fs from 'fs/promises';

class ItemService {
  async createItem(itemData, userId, imageFile) {
    let imageUrl = null;

    if (imageFile) {
      try {
        const result = await uploadToCloudinary(imageFile, 'lost-found/items');
        imageUrl = result.url;
        // Clean up local file
        await fs.unlink(imageFile.path);
      } catch (error) {
        throw new Error('Failed to upload image: ' + error.message);
      }
    }

    const data = {
      ...itemData,
      userId,
      imageUrl,
      dateFoundOrLost: new Date(itemData.dateFoundOrLost),
    };

    return ItemRepository.create(data);
  }

  async getItem(id) {
    const item = await ItemRepository.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  async getItems(filters, pagination) {
    // Only show approved items to regular users unless it's their own
    if (!filters.userId && !filters.includePending) {
      filters.status = 'APPROVED';
    }
    return ItemRepository.findAll(filters, pagination);
  }

  async updateItem(id, data, userId, userRole) {
    const item = await ItemRepository.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }

    // Check permissions
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && item.userId !== userId) {
      throw new Error('Unauthorized to update this item');
    }

    return ItemRepository.update(id, data);
  }

  async approveItem(id, adminId) {
    const item = await ItemRepository.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }

    if (item.status !== 'PENDING') {
      throw new Error('Item is not pending approval');
    }

    return ItemRepository.update(id, {
      status: 'APPROVED',
      approvedById: adminId,
      approvedAt: new Date(),
    });
  }

  async rejectItem(id, adminId, reason) {
    const item = await ItemRepository.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }

    return ItemRepository.update(id, {
      status: 'REJECTED',
      approvedById: adminId,
      approvedAt: new Date(),
    });
  }

  async deleteItem(id, userId, userRole) {
    const item = await ItemRepository.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }

    // Check permissions
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && item.userId !== userId) {
      throw new Error('Unauthorized to delete this item');
    }

    return ItemRepository.delete(id);
  }

  async getStats() {
    return ItemRepository.getStats();
  }
}

export default new ItemService();