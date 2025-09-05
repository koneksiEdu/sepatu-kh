// db.ts (versi terupdate)
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// 1. Pertahankan koneksi libSQL original (untuk raw query/backward compatibility)
const libsqlClient = createClient({
  url: import.meta.env.DB_URL,
  authToken: import.meta.env.DB_TOKEN,
});

// 2. Buat instance Drizzle ORM
const raguBase = drizzle(libsqlClient, {
  // logger: true  // <-- Uncomment untuk debug query
});

// 3. Ekspor keduanya
export { libsqlClient as db };  // Ekspor client libSQL original dengan alias
export default raguBase;  // Ekspor Drizzle sebagai default