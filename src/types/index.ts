// 疗程信息
export interface CourseInfo {
  id: string;
  name: string;
  totalTimes: number;
  completedTimes: number;
  startDate: string;
  endDate: string;
  institution: string;
  doctor: string;
  status: 'active' | 'completed';
}

// 治疗记录
export interface TreatmentRecord {
  id: string;
  date: string;
  time: string;
  index: number;
  status: 'upcoming' | 'completed' | 'missed';
  energyLevel?: string;
  notes?: string;
}

// 提醒事项
export interface Reminder {
  id: string;
  type: 'prep' | 'sun' | 'checkin' | 'other';
  title: string;
  description: string;
  date: string;
  time?: string;
  isRead: boolean;
}

// 打卡记录
export interface CheckinRecord {
  id: string;
  date: string;
  redness: number; // 0-3 无/轻微/中等/明显
  dryness: number; // 0-3
  stinging: number; // 0-3
  note?: string;
  treatmentDay: number; // 第几天
}

// 照片记录
export interface PhotoRecord {
  id: string;
  date: string;
  angle: 'front' | 'left' | 'right';
  url: string;
  treatmentIndex: number;
}

// 风险项
export interface RiskItem {
  id: string;
  title: string;
  description: string;
  type: 'pregnancy' | 'sunburn' | 'medication' | 'other';
  checked: boolean;
}

// 术前准备项
export interface PrepItem {
  id: string;
  title: string;
  description: string;
  category: 'clean' | 'skincare' | 'rest' | 'other';
  timeline: string;
}

// 常见反应
export interface CommonReaction {
  id: string;
  name: string;
  description: string;
  duration: string;
  severity: 'normal' | 'mild' | 'concerning';
  tips: string;
}

// 咨询消息
export interface ConsultMessage {
  id: string;
  sender: 'user' | 'advisor';
  content: string;
  images?: string[];
  timestamp: string;
}

// 咨询会话
export interface ConsultSession {
  id: string;
  advisorName: string;
  advisorAvatar?: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: ConsultMessage[];
}

// 护理产品
export interface CareProduct {
  id: string;
  name: string;
  category: 'repair' | 'sunscreen' | 'moisturize' | 'cleanser';
  description: string;
  isRecommended: boolean;
  price?: number;
  imageUrl?: string;
}

// 变化报告
export interface ChangeReport {
  courseId: string;
  startDate: string;
  endDate: string;
  beforePhotos: PhotoRecord[];
  afterPhotos: PhotoRecord[];
  improvements: string[];
  suggestions: string[];
  overallScore: number;
}

// 用户信息
export interface UserInfo {
  id: string;
  nickname: string;
  avatar?: string;
  phone: string;
  bindDate: string;
}
