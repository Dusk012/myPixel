import express from 'express';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', noRegistrado());

contenidoRouter.get('/foro', viewForo());

contenidoRouter.get('/desafios', viewDesafios());

contenidoRouter.get('/tienda', viewShop());

contenidoRouter.get('/perfil', viewProfile());

contenidoRouter.get('/panel', viewSubmit());

contenidoRouter.get('/coordinador', viewNoPermisos());

contenidoRouter.get('/admin', viewAdmin());

export default contenidoRouter;