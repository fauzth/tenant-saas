export const ROLES = {
  OWNER: "OWNER",
  PM: "PROJECT_MANAGER",
  MEMBER: "MEMBER",
};

// siapa boleh bikin role apa
export const CREATABLE_ROLES = {
  [ROLES.OWNER]: [ROLES.PM, ROLES.MEMBER],
  [ROLES.PM]: [ROLES.MEMBER],
};
