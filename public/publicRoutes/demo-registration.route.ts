import { Router, Request, Response } from 'express';
import { config } from '../../api/config';

const router = Router(); 

router.post('/', (req: Request, res: Response) => {
    res.render('index', { base_url: config.base_url });
})

router.post('/delete', (req: Request, res: Response) => {
    res.render('delete-user')
})

export {
    router as demoRoutes
}