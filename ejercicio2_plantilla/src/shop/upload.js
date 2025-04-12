import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads'); // asegúrate de que esta carpeta exista
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: multer.diskStorage({
      destination: 'uploads',
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    })
  });
  
