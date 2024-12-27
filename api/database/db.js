import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  connectionString:
    "postgresql://root:0bfeNrruqJzYtzx3VV2sQCDVsXm1mjj2@dpg-ctm8j8jv2p9s73fa1prg-a.oregon-postgres.render.com/tiendaropa",
  ssl: {
    rejectUnauthorized: false, // Útil si el servidor PostgreSQL requiere SSL pero no tiene un certificado autorizado
  },
});

export default pool;
