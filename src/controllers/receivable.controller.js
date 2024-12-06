import { ReceivableService } from '../services/receivable.service.js';

export class ReceivableController {
  constructor() {
    this.receivableService = new ReceivableService();
  }

  list = async (req, res) => {
    try {
      const receivables = await this.receivableService.list();
      return res.json(receivables);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  create = async (req, res) => {
    try {
      const data = req.body;
      console.log(data);
      const receivable = await this.receivableService.create(data);
      return res.status(201).json(receivable);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  show = async (req, res) => {
    try {
      const receivable = await this.receivableService.findById(req.params.id);
      if (!receivable) {
        return res.status(404).json({ error: 'Recebível não encontrado' });
      }
      return res.json(receivable);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  update = async (req, res) => {
    try {
      const data = req.body;
      const receivable = await this.receivableService.update(req.params.id, data);
      if (!receivable) {
        return res.status(404).json({ error: 'Recebível não encontrado' });
      }
      return res.json(receivable);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  delete = async (req, res) => {
    try {
      await this.receivableService.delete(req.params.id);
      return res.status(204);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  updateInstallmentStatus = async (req, res) => {
    try {
      const { id, installmentNumber } = req.params;
      const data = req.body;

      const receivable = await this.receivableService.updateInstallmentStatus(
        id,
        parseInt(installmentNumber, 10),
        data
      );

      if (!receivable) {
        return res.status(404).json({ error: 'Recebível não encontrado' });
      }

      return res.json(receivable);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}