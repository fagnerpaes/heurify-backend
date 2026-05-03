export const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date = new Date()) => {
  return date.toISOString();
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatError = (code, message, details = {}) => {
  return {
    error: {
      code,
      message,
      details,
      timestamp: formatDate(),
    },
  };
};

export const formatSuccess = (data, meta = {}) => {
  return {
    success: true,
    data,
    meta: {
      timestamp: formatDate(),
      ...meta,
    },
  };
};
