import db from '../database/connection.js';

export class SaleService {
  async list() {
    return db('sales')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  async create(data) {
    const [sale] = await db('sales')
      .insert({
        ...data,
        status: 'waiting_contract'
      })
      .returning('*');

    return sale;
  }

  async findById(id) {
    return db('sales')
      .where({ id })
      .first();
  }

  async update(id, data) {
    const [sale] = await db('sales')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');

    return sale;
  }

  async delete(id) {
    await db('sales')
      .where({ id })
      .delete();
  }
}