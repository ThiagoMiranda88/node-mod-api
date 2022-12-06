import express, { ErrorRequestHandler, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { MulterError } from 'multer';
import apiRoutes from './routes/api';

dotenv.config();


const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({extended: true}));

server.use('/api', apiRoutes);

server.use( (req: Request, res: Response)=> {
    res.status(404);
    res.json({error: 'Endpoint não encontrado.'});
});

//tratar erros de files //envia o erro correto na resposta //por exemplo: se o usuario manda 2 arquivos e a rota está esperando uma (single)
const errorHaldler: ErrorRequestHandler = (err, req, res, next) =>{

    res.status(400); //Bad Request
    if(err instanceof MulterError){
        res.json({ error: err.code })
    }else{
        console.log(err);
        res.json({error: 'Ocorreu algum erro.'});
    }

}
server.use(errorHaldler)

server.listen(process.env.PORT);