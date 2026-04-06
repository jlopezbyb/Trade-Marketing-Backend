import { Router } from 'express';
import { templateController } from '../repositories/dependencies';

const routes = Router();

routes.get('/', templateController.getTemplates.bind(templateController));
routes.get('/variables', templateController.getTemplateVariables.bind(templateController));
routes.get('/:id', templateController.getTemplateById.bind(templateController));
routes.put('/:id', templateController.updateTemplate.bind(templateController));

export default routes;
