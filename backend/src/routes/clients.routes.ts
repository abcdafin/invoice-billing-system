import { Router } from 'express';
import { getClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clientController';
import { authProtect } from '../middleware/auth';

const router = Router();

router.use(authProtect);

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

export default router;
