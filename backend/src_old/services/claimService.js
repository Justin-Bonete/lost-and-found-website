// backend/src/services/claimService.js
import ClaimRepository from '../repositories/claimRepository.js';
import ItemRepository from '../repositories/itemRepository.js';

class ClaimService {
  async createClaim(claimData, userId) {
    const { itemId, proofDescription, verificationAnswers } = claimData;

    // Check if item exists and is approved
    const item = await ItemRepository.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    if (item.status !== 'APPROVED') {
      throw new Error('This item is not available for claiming');
    }

    if (item.userId === userId) {
      throw new Error('You cannot claim your own item');
    }

    // Check if already claimed
    const existingClaim = await ClaimRepository.findByItemAndUser(itemId, userId);
    if (existingClaim) {
      throw new Error('You have already submitted a claim for this item');
    }

    // Check if item is already claimed
    if (item.status === 'CLAIMED') {
      throw new Error('This item has already been claimed');
    }

    return ClaimRepository.create({
      itemId,
      userId,
      proofDescription,
      verificationAnswers,
      status: 'PENDING',
    });
  }

  async getClaim(id) {
    const claim = await ClaimRepository.findById(id);
    if (!claim) {
      throw new Error('Claim not found');
    }
    return claim;
  }

  async getUserClaims(userId, pagination) {
    return ClaimRepository.findAll({ userId }, pagination);
  }

  async getItemClaims(itemId, pagination) {
    return ClaimRepository.findAll({ itemId }, pagination);
  }

  async processClaim(id, status, processorId, rejectionReason = null) {
    const claim = await ClaimRepository.findById(id);
    if (!claim) {
      throw new Error('Claim not found');
    }

    if (claim.status !== 'PENDING') {
      throw new Error('Claim has already been processed');
    }

    const updatedClaim = await ClaimRepository.update(id, {
      status,
      processedById: processorId,
      processedAt: new Date(),
      ...(rejectionReason && { rejectionReason }),
    });

    // If claim is approved, mark item as claimed
    if (status === 'APPROVED') {
      await ItemRepository.update(claim.itemId, {
        status: 'CLAIMED',
      });

      // Reject all other pending claims for this item
      const otherClaims = await ClaimRepository.findAll({ itemId: claim.itemId, status: 'PENDING' });
      for (const otherClaim of otherClaims.claims) {
        if (otherClaim.id !== id) {
          await ClaimRepository.update(otherClaim.id, {
            status: 'REJECTED',
            processedById: processorId,
            processedAt: new Date(),
            rejectionReason: 'Item has been claimed by another user',
          });
        }
      }
    }

    return updatedClaim;
  }

  async getAllClaims(filters, pagination) {
    return ClaimRepository.findAll(filters, pagination);
  }
}

export default new ClaimService();