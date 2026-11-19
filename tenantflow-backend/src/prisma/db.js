import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import contractJson from "./contract.json" with { type: "json" };

export const contract = contractFromJson(contractJson);

const createDb = () => {
  return postgres({
    contract,
    url: process.env.DATABASE_URL,
  });
};

export const db = globalThis.dbGlobal ?? createDb();

export default db;

if (process.env.NODE_ENV !== "production") {
  globalThis.dbGlobal = db;
}
