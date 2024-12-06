import db from '../database/connection.js';

export class DevelopmentService {
  async list() {
    return db('developments')
      .select('*')
      .orderBy('name');
  }

  async create(data) {
    const [development] = await db('developments')
      .insert(data)
      .returning('*');

    return development;
  }

  async findById(id) {
    return db('developments')
      .where({ id })
      .first();
  }

  async update(id, data) {
    const [development] = await db('developments')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');

    return development;
  }

  async delete(id) {
    const hasReceivables = await db('receivables')
      .where({ developmentId: id })
      .first();

    if (hasReceivables) {
      throw new Error('DEVELOPMENT_HAS_RECEIVABLES');
    }

    await db('developments')
      .where({ id })
      .delete();
  }
}