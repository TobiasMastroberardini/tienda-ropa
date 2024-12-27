import multer from "multer";
import path from "path";

// Configuración del almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generar un nombre único
  },
});

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isMimeTypeValid = allowedTypes.test(file.mimetype);
  const isExtValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (isMimeTypeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpg, jpeg, png)."));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
