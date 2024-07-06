import { Request, Response } from 'express';

export default {
  // 支持值为 Object 和 Array
  'GET /api/source/items': (req: Request, res: Response) => {
    res.send({
      code: 200,
      data: [
        {
          title: 'Folder 1',
          key: '1',
          type: 'folder',
          icon: '',
          size: '10 KB',
          modifiedTime: '2024-06-17',
          children: [
            {
              title: 'File 1.txt',
              type: 'file',
              key: '3',
              icon: '',
              size: '10 KB',
              modifiedTime: '2024-06-17',
            },
          ],
        },
        {
          title: 'Folder 2',
          key: '2',
          type: 'folder',
          icon: '',
          size: '10 KB',
          modifiedTime: '2024-06-17',
          children: [
            {
              title: 'File 2.jpg',
              key: '4',
              type: 'file',
              icon: '',
              size: '20 KB',
              modifiedTime: '2024-06-16',
            },
            {
              title: 'Empty Folder',
              key: '5',
              type: 'folder',
              icon: '',
              size: '0 KB',
              modifiedTime: '2024-06-17',
              children: [],
            },
          ],
        },
      ],
      mgs: '',
    });
  },

  'GET /api/test': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
};
