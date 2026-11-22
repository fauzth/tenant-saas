import bcrypt from "bcrypt";
import db from "../src/prisma/db.js";
import { ROLES, CREATABLE_ROLES } from "../constants/roles.js";

export const getTenant = async (req, res) => {
  try {
    const tenant = await db.orm.public.Tenant.where({
      id: req.user.tenant_id,
    }).first();

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { id: tenant.id, name: tenant.name },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

export const listUser = async (req, res) => {
  try {
    const users = await db.orm.public.User.where({
      tenant_id: req.user.tenant_id,
    })
      .select("id", "name", "email", "role", "createdAt")
      .all();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = ROLES.MEMBER } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password harus diisi.",
      });
    }

    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role tidak valid. Pilih salah satu: ${validRoles.join(", ")}.`,
      });
    }

    const allowedRoles = CREATABLE_ROLES[req.user.role] || [];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message:
          "Akses ditolak. Anda tidak memiliki izin untuk membuat user dengan role ini.",
      });
    }

    const existingUser = await db.orm.public.User.where({ email }).first();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.orm.public.User.create({
      name,
      email,
      password_hash: hashedPassword,
      role,
      tenant_id: req.user.tenant_id,
    });

    return res.status(201).json({
      success: true,
      message: "User berhasil dibuat.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};
