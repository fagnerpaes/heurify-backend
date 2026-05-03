export const JWT_CONFIG = {
  algorithm: 'HS256',
  issuer: 'heurify-backend',
  audience: 'heurify-frontend',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const DEFAULT_ROLE = USER_ROLES.EDITOR;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['*'], // All permissions
  [USER_ROLES.EDITOR]: [
    'create:heuristica',
    'read:heuristica',
    'update:heuristica',
    'delete:heuristica',
    'create:sessao',
    'update:sessao',
    'read:sessao',
    'create:charter',
  ],
  [USER_ROLES.VIEWER]: [
    'read:heuristica',
    'read:sessao',
  ],
};

export const HEURISTICA_STATUS = {
  DRAFT: 'draft',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  ARCHIVED: 'archived',
};

export const DEFAULT_HEURISTICA_STATUS = HEURISTICA_STATUS.DRAFT;
