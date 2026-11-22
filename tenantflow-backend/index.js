import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tenants", tenantRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `Database URL Status: ${process.env.DATABASE_URL ? "Terbaca ✅" : "Kosong / Undefined ❌"}`,
  );
});
