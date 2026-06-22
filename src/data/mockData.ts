import {
  CourseInfo,
  TreatmentRecord,
  Reminder,
  CheckinRecord,
  PhotoRecord,
  RiskItem,
  PrepItem,
  CommonReaction,
  ConsultSession,
  CareProduct,
  UserInfo,
  ChangeReport
} from '@/types';

export const mockUser: UserInfo = {
  id: 'u001',
  nickname: '小林',
  phone: '138****8888',
  bindDate: '2025-01-15'
};

export const mockCourse: CourseInfo = {
  id: 'c001',
  name: '光子嫩肤基础疗程',
  totalTimes: 6,
  completedTimes: 2,
  startDate: '2025-06-01',
  endDate: '2025-12-01',
  institution: '悦美医疗美容',
  doctor: '王医生',
  status: 'active'
};

const baseDate = new Date('2025-06-22');

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const mockTreatments: TreatmentRecord[] = [
  { id: 't1', date: '2025-06-01', time: '10:00', index: 1, status: 'completed', energyLevel: '中低能量', notes: '首次治疗，皮肤适应良好' },
  { id: 't2', date: '2025-06-15', time: '14:30', index: 2, status: 'completed', energyLevel: '中等能量', notes: '泛红轻微，恢复很快' },
  { id: 't3', date: '2025-07-06', time: '10:30', index: 3, status: 'upcoming' },
  { id: 't4', date: '2025-07-27', time: '11:00', index: 4, status: 'upcoming' },
  { id: 't5', date: '2025-08-17', time: '15:00', index: 5, status: 'upcoming' },
  { id: 't6', date: '2025-09-07', time: '10:00', index: 6, status: 'upcoming' }
];

export const mockReminders: Reminder[] = [
  {
    id: 'r1',
    type: 'prep',
    title: '术前48小时准备',
    description: '距离下次治疗还有48小时，请做好术前准备工作',
    date: '2025-07-04',
    time: '09:00',
    isRead: false
  },
  {
    id: 'r2',
    type: 'sun',
    title: '注意防晒',
    description: '未来三天气温高，紫外线强烈，请加强防晒',
    date: '2025-06-22',
    isRead: false
  },
  {
    id: 'r3',
    type: 'checkin',
    title: '今日恢复打卡',
    description: '今天是第二次治疗后第7天，记得记录恢复情况哦',
    date: '2025-06-22',
    isRead: true
  }
];

export const mockCheckins: CheckinRecord[] = [
  { id: 'ck1', date: '2025-06-15', redness: 2, dryness: 1, stinging: 1, note: '刚做完有点红', treatmentDay: 0 },
  { id: 'ck2', date: '2025-06-16', redness: 1, dryness: 2, stinging: 0, note: '开始有点干', treatmentDay: 1 },
  { id: 'ck3', date: '2025-06-17', redness: 1, dryness: 2, stinging: 0, treatmentDay: 2 },
  { id: 'ck4', date: '2025-06-18', redness: 0, dryness: 1, stinging: 0, treatmentDay: 3 },
  { id: 'ck5', date: '2025-06-19', redness: 0, dryness: 1, stinging: 0, treatmentDay: 4 },
  { id: 'ck6', date: '2025-06-20', redness: 0, dryness: 0, stinging: 0, treatmentDay: 5 },
  { id: 'ck7', date: '2025-06-21', redness: 0, dryness: 0, stinging: 0, treatmentDay: 6 }
];

export const mockPhotos: PhotoRecord[] = [
  { id: 'p1', date: '2025-06-01', angle: 'front', url: 'https://picsum.photos/id/64/400/500', treatmentIndex: 1 },
  { id: 'p2', date: '2025-06-01', angle: 'left', url: 'https://picsum.photos/id/91/400/500', treatmentIndex: 1 },
  { id: 'p3', date: '2025-06-01', angle: 'right', url: 'https://picsum.photos/id/177/400/500', treatmentIndex: 1 },
  { id: 'p4', date: '2025-06-15', angle: 'front', url: 'https://picsum.photos/id/338/400/500', treatmentIndex: 2 },
  { id: 'p5', date: '2025-06-15', angle: 'left', url: 'https://picsum.photos/id/1027/400/500', treatmentIndex: 2 },
  { id: 'p6', date: '2025-06-15', angle: 'right', url: 'https://picsum.photos/id/1000/400/500', treatmentIndex: 2 }
];

export const mockRiskItems: RiskItem[] = [
  { id: 'risk1', title: '是否怀孕或备孕中', description: '怀孕期间不建议进行光子治疗', type: 'pregnancy', checked: false },
  { id: 'risk2', title: '近期是否有晒伤', description: '晒伤皮肤需恢复后再进行治疗', type: 'sunburn', checked: false },
  { id: 'risk3', title: '是否服用光敏性药物', description: '如四环素、维A酸类等，请提前告知医生', type: 'medication', checked: false },
  { id: 'risk4', title: '皮肤是否有破损或炎症', description: '如有请提前告知医生', type: 'other', checked: false }
];

export const mockPrepItems: PrepItem[] = [
  { id: 'prep1', title: '温和清洁', description: '使用温和的氨基酸洁面产品，避免过度清洁', category: 'clean', timeline: '术前48小时' },
  { id: 'prep2', title: '停用刺激性护肤品', description: '暂停使用酸类、维A醇、高浓度维C等刺激性产品', category: 'skincare', timeline: '术前3-7天' },
  { id: 'prep3', title: '加强保湿', description: '使用温和保湿产品，保持皮肤水润状态', category: 'skincare', timeline: '术前3天' },
  { id: 'prep4', title: '严格防晒', description: '外出务必涂抹防晒霜，避免暴晒', category: 'skincare', timeline: '全程' },
  { id: 'prep5', title: '规律作息', description: '保证充足睡眠，避免熬夜', category: 'rest', timeline: '术前1-2天' },
  { id: 'prep6', title: '饮食清淡', description: '避免辛辣刺激食物，多喝水', category: 'rest', timeline: '术前1天' }
];

export const mockReactions: CommonReaction[] = [
  {
    id: 'react1',
    name: '轻微泛红',
    description: '治疗后皮肤可能出现轻微泛红，类似运动后的脸红',
    duration: '通常几小时到1-2天消退',
    severity: 'normal',
    tips: '可以用冷毛巾轻敷，避免热水洗脸，泛红会逐渐消退'
  },
  {
    id: 'react2',
    name: '干燥紧绷',
    description: '治疗后皮肤可能感到干燥、紧绷，这是正常反应',
    duration: '通常持续3-7天',
    severity: 'normal',
    tips: '加强保湿，使用医用保湿面膜和修复霜，多喝水'
  },
  {
    id: 'react3',
    name: '轻微刺痛',
    description: '治疗后短时间内可能有轻微刺痛或灼热感',
    duration: '通常几小时内缓解',
    severity: 'normal',
    tips: '冷敷可以缓解不适，如果持续加重请联系医生'
  },
  {
    id: 'react4',
    name: '色素暂时加深',
    description: '色斑部位可能暂时颜色加深，这是正常反应',
    duration: '通常1-2周逐渐代谢',
    severity: 'mild',
    tips: '注意防晒，不要抠抓，色素会自然代谢脱落'
  },
  {
    id: 'react5',
    name: '细小痂皮',
    description: '部分人可能出现细小痂皮，不要用手抠',
    duration: '通常3-7天自然脱落',
    severity: 'mild',
    tips: '让痂皮自然脱落，注意保湿和防晒，避免感染'
  }
];

export const mockConsultSessions: ConsultSession[] = [
  {
    id: 's1',
    advisorName: '李顾问',
    lastMessage: '好的，泛红是正常现象，您可以继续观察，有问题随时联系我',
    lastTime: '2025-06-21 15:30',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'user', content: '你好，我昨天做完第二次治疗，今天还有点红，正常吗？', timestamp: '2025-06-16 10:20' },
      { id: 'm2', sender: 'advisor', content: '您好，泛红是正常的术后反应，通常1-2天会逐渐消退，您可以用冷毛巾轻轻敷一下缓解', timestamp: '2025-06-16 10:35' },
      { id: 'm3', sender: 'user', content: '好的，那我可以用保湿面膜吗？', timestamp: '2025-06-16 14:00' },
      { id: 'm4', sender: 'advisor', content: '可以的，建议使用医用修复面膜，每天1片，连续3-5天效果更好', timestamp: '2025-06-16 14:15' }
    ]
  },
  {
    id: 's2',
    advisorName: '王医生',
    lastMessage: '下次治疗前请注意防晒，有任何不适随时联系',
    lastTime: '2025-06-15 17:00',
    unreadCount: 1,
    messages: [
      { id: 'm5', sender: 'advisor', content: '今天治疗完成得很顺利，回去注意保湿和防晒', timestamp: '2025-06-15 16:30' },
      { id: 'm6', sender: 'user', content: '好的，谢谢王医生', timestamp: '2025-06-15 16:45' },
      { id: 'm7', sender: 'advisor', content: '下次治疗前请注意防晒，有任何不适随时联系', timestamp: '2025-06-15 17:00' }
    ]
  }
];

export const mockProducts: CareProduct[] = [
  { id: 'prod1', name: '医用修复面膜', category: 'repair', description: '舒缓修复，术后专用，快速缓解泛红干燥', isRecommended: true, price: 198 },
  { id: 'prod2', name: '神经酰胺修复霜', category: 'repair', description: '修护皮肤屏障，增强皮肤抵抗力', isRecommended: true, price: 268 },
  { id: 'prod3', name: '物理防晒霜 SPF50+', category: 'sunscreen', description: '温和物理防晒，术后敏感肌可用', isRecommended: true, price: 158 },
  { id: 'prod4', name: '保湿精华液', category: 'moisturize', description: '深层补水，保持皮肤水润', isRecommended: true, price: 298 },
  { id: 'prod5', name: '氨基酸洁面乳', category: 'cleanser', description: '温和清洁，不刺激皮肤屏障', isRecommended: true, price: 128 },
  { id: 'prod6', name: '舒缓喷雾', category: 'moisturize', description: '随时补水，缓解干燥不适', isRecommended: false, price: 88 }
];

export const mockReport: ChangeReport = {
  courseId: 'c001',
  startDate: '2025-06-01',
  endDate: '2025-09-07',
  beforePhotos: mockPhotos.filter(p => p.treatmentIndex === 1),
  afterPhotos: [],
  improvements: [
    '肤色整体提亮约20%',
    '色斑明显淡化',
    '皮肤细腻度提升',
    '红血丝有所改善'
  ],
  suggestions: [
    '建议继续保持良好的防晒习惯',
    '可以考虑维持治疗，每2-3个月一次',
    '日常护肤以保湿和防晒为主'
  ],
  overallScore: 85
};
