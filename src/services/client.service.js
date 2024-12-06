import db from '../database/connection.js';
import { formatCPF, formatPhone, unmaskValue } from '../utils/format.js';

export class ClientService {
  async list() {
    const clients = await db('clients')
      .select('*')
      .orderBy('name');

    return clients.map(client => ({
      ...client,
      cpf: formatCPF(client.cpf),
      phone: formatPhone(client.phone)
    }));
  }

  async create(data) {
    const [client] = await db('clients')
      .insert({
        ...data,
        cpf: unmaskValue(data.cpf),
        phone: unmaskValue(data.phone)
      }) 
      .returning('*');

    return {
      ...client,
      cpf: formatCPF(client.cpf),
      phone: formatPhone(client.phone)
    };
  }

  async findById(id) {
    const client = await db('clients')
      .where({ id })
      .first();

    if (!client) return null;

    return {
      ...client,
      cpf: formatCPF(client.cpf),
      phone: formatPhone(client.phone)
    };
  }

  async update(id, data) {
    const updateData = {
      ...data,
      updated_at: db.fn.now()
    };

    if (data.cpf) {
      updateData.cpf = unmaskValue(data.cpf);
    }

    if (data.phone) {
      updateData.phone = unmaskValue(data.phone);
    }

    const [client] = await db('clients')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!client) return null;

    return {
      ...client,
      cpf: formatCPF(client.cpf),
      phone: formatPhone(client.phone)
    };
  }

  async delete(id) {
    const hasReceivables = await db('receivables')
      .where({ clientId: id })
      .first();

    if (hasReceivables) {
      throw new Error('CLIENT_HAS_RECEIVABLES');
    }

    await db('clients').where({ id }).delete();
  }
}