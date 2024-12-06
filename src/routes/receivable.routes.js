import { Router } from 'express';
import { ReceivableController } from '../controllers/receivable.controller.js';

const receivableRoutes = Router();
const receivableController = new ReceivableController();

receivableRoutes.get('/', receivableController.list);
receivableRoutes.post('/', receivableController.create);
receivableRoutes.get('/:id', receivableController.show);
receivableRoutes.put('/:id', receivableController.update);
receivableRoutes.delete('/:id', receivableController.delete);
receivableRoutes.patch('/:id/installments/:installmentNumber', receivableController.updateInstallmentStatus);

export { receivableRoutes };