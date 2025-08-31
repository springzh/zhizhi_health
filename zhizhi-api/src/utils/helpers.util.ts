import { randomBytes, createHash } from 'crypto';

export const generateRandomString = (length: number = 32): string => {
  return randomBytes(length).toString('hex');
};

export const generateSecureToken = (length: number = 32): string => {
  return randomBytes(length).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const hashString = (str: string, salt?: string): string => {
  const saltValue = salt || randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(str + saltValue)
    .digest('hex');
  
  return `${saltValue}:${hash}`;
};

export const verifyHash = (str: string, hashedString: string): boolean => {
  try {
    const [salt, hash] = hashedString.split(':');
    const computedHash = createHash('sha256')
      .update(str + salt)
      .digest('hex');
    
    return hash === computedHash;
  } catch (error) {
    return false;
  }
};

export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return otp;
};

export const generateAppointmentId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `APT${timestamp}${random}`;
};

export const generateMembershipId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MBR${timestamp}${random}`;
};

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD${timestamp}${random}`;
};

export const sanitizePhoneNumber = (phone: string): string => {
  // 移除所有非数字字符
  return phone.replace(/\D/g, '');
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/; // 中国手机号
  return phoneRegex.test(sanitizePhoneNumber(phone));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
};

export const formatDate = (date: Date, format: 'full' | 'date' | 'time' = 'full'): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Shanghai',
  };

  switch (format) {
    case 'date':
      return new Intl.DateTimeFormat('zh-CN', {
        ...options,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    case 'time':
      return new Intl.DateTimeFormat('zh-CN', {
        ...options,
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    case 'full':
    default:
      return new Intl.DateTimeFormat('zh-CN', {
        ...options,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
  }
};