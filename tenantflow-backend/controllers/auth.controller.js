import bcrypt from "bcrypt";
import db from "../src/prisma/db.js";
import jwt from "jsonwebtoken";

export const registerTenant = async (req, res) => {
  try {
    const { tenantName, name, email, password } = req.body;

    if (!tenantName || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field (tenantName, name, email, password) wajib diisi!",
      });
    }

    // Cek email manual (unik global), jangan andalkan kode error P2002
    const existing = await db.orm.public.User.where({ email }).first();
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email tersebut sudah terdaftar.",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const toSlug = (s) =>
      s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    let slug = toSlug(tenantName);
    const taken = await db.orm.public.Tenant.where({ slug }).first();
    if (taken) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

    const result = await db.transaction(async (tx) => {
      const tenant = await tx.orm.public.Tenant.create({
        name: tenantName,
        slug: slug,
      });
      const user = await tx.orm.public.User.create({
        name,
        email,
        password_hash,
        tenant_id: tenant.id,
        role: "OWNER",
      });
      return { tenant, user };
    });

    return res.status(201).json({
      success: true,
      message: "Registrasi Tenant dan Owner berhasil!",
      data: {
        tenant: { id: result.tenant.id, name: result.tenant.name },
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
      },
    });
  } catch (error) {
    console.error("Error registrasi:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal pada server.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi!",
      });
    }

    const user = await db.orm.public.User.where({ email }).first();
    const isValid = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah!",
      });
    }
    console.log("LOGIN DEBUG", { found: !!user, isValid });
    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        tenant_id: user.tenant_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          tenant_id: user.tenant_id,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal pada server.",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await db.orm.public.User.where({
      id: req.user.user_id,
    }).first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile berhasil diambil!",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          tenant_id: user.tenant_id,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Error profile:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal pada server.",
    });
  }
};
