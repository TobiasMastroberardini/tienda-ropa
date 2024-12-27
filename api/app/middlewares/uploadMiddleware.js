// config/multer.js
import multer from "multer";
import path from "path";

// Definir el almacenamiento para las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Asignar un nombre único a la imagen para evitar colisiones
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Filtrar solo imágenes (JPG, PNG, JPEG)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Configurar el middleware multer
const upload = multer({ storage, fileFilter });

export default upload;
