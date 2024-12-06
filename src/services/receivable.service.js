import db from '../database/connection.js';

export class ReceivableService {
  async list() {
    const receivables = await db('receivables')
      .select('*')
      .orderBy('created_at', 'desc');

      const installmentStatus = await db('installmentStatus')
       .select('*')
      .whereIn('receivableId', receivables.map(r => r.id));
    
    return receivables.map(receivable => ({
      ...receivable,
     installmentStatus: installmentStatus
      .filter(status => status.receivableId === receivable.id)
      .map(({ receivableId, ...status }) => status)
    }));
  }

  async create(data) {
    const trx = await db.transaction();
    try {
      const [receivable] = await trx('receivables')
        .insert(data)
        .returning('*');

      await trx.commit();
      return { ...receivable, installmentStatus: [] };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async findById(id) {
    const receivable = await db('receivables')
      .where({ id })
      .first();

    if (!receivable) return null;

    const installmentStatus = await db('installmentStatus')
      .where({ receivableId: id })
      .orderBy('installmentNumber');

    return {
      ...receivable,
      installmentStatus: installmentStatus.map(({ receivableId, ...status }) => status)
    };
  }

  async update(id, data) {
    const [receivable] = await db('receivables')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');

    if (!receivable) return null;

    const installmentStatus = await db('installmentStatus')
      .where({ receivableId: id })
      .orderBy('installmentNumber');

    return {
      ...receivable,
      installmentStatus: installmentStatus.map(({ receivableId, ...status }) => status)
    };
  }

  async delete(id) {
    await db('receivables')
      .where({ id })
      .delete();
  }

  async updateInstallmentStatus(receivableId, installmentNumber, updates) {
    const trx = await db.transaction();

    try {
      const receivable = await trx('receivables')
        .where({ id: receivableId })
        .first();

      if (!receivable) {
        await trx.rollback();
        return null;
      }

      const existingStatus = await trx('installmentStatus')
        .where({ receivableId, installmentNumber })
        .first();

      if (existingStatus) {
        await trx('installmentStatus')
          .where({ receivableId, installmentNumber })
          .update({
            ...updates,
            updated_at: trx.fn.now()
          });
      } else {
        const installmentValue = (receivable.totalValue - receivable.downPayment) / receivable.installments;
        const firstInstallmentDate = new Date(receivable.firstInstallmentDate);
        const dueDate = new Date(firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + installmentNumber - 1));

        await trx('installmentStatus')
          .insert({
            receivableId,
            installmentNumber,
            dueDate,
            value: installmentValue,
            billIssued: updates.billIssued || false,
            billPaid: updates.billPaid || false
          });
      }

      await trx.commit();
      return this.findById(receivableId);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
