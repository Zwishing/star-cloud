import {Request, Response} from "express";

export default {
  // 支持值为 Object 和 Array
  'POST /api/upload': (req: Request, res: Response) => {
    console.log(req.body)
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },

  'GET /api/test': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
};
