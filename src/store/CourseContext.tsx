import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import {
  CourseInfo,
  TreatmentRecord,
  Reminder,
  CheckinRecord,
  PhotoRecord,
  ConsultSession,
  CareProduct,
  UserInfo,
  ConsultMessage,
  RescheduleRequest
} from '@/types';
import {
  mockCourse,
  mockTreatments,
  mockReminders,
  mockCheckins,
  mockPhotos,
  mockConsultSessions,
  mockProducts,
  mockUser
} from '@/data/mockData';

const STORAGE_KEY = 'photon_app_state';

export interface AppState {
  user: UserInfo | null;
  course: CourseInfo | null;
  treatments: TreatmentRecord[];
  rescheduleRequests: RescheduleRequest[];
  reminders: Reminder[];
  checkins: CheckinRecord[];
  photos: PhotoRecord[];
  consultSessions: ConsultSession[];
  products: CareProduct[];
  isBound: boolean;
  courseCode: string | null;
}

type Action =
  | { type: 'HYDRATE_STATE'; payload: AppState }
  | { type: 'BIND_COURSE'; payload: { courseCode: string } }
  | { type: 'ADD_CHECKIN'; payload: CheckinRecord }
  | { type: 'ADD_PHOTO'; payload: PhotoRecord }
  | { type: 'MARK_REMINDER_READ'; payload: string }
  | { type: 'ADD_CONSULT_MESSAGE'; payload: { sessionId: string; message: ConsultMessage } }
  | { type: 'ADD_CONSULT_IMAGES'; payload: { sessionId: string; images: string[] } }
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_RESCHEDULE_REQUEST'; payload: RescheduleRequest }
  | { type: 'UPDATE_RESCHEDULE_STATUS'; payload: { id: string; status: 'approved' | 'rejected'; rejectReason?: string } }
  | { type: 'UPDATE_TREATMENT_DATE'; payload: { id: string; date: string; time: string } }
  | { type: 'SET_CONSULT_PENDING_REPLY'; payload: { sessionId: string; pending: boolean } };

const initialState: AppState = {
  user: mockUser,
  course: null,
  treatments: [],
  rescheduleRequests: [],
  reminders: [],
  checkins: [],
  photos: [],
  consultSessions: mockConsultSessions,
  products: mockProducts,
  isBound: false,
  courseCode: null
};

const saveState = (state: AppState) => {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[Store] 保存状态失败:', e);
  }
};

export const convertImageToBase64 = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (filePath.startsWith('data:') || filePath.startsWith('http')) {
      resolve(filePath);
      return;
    }
    if (process.env.TARO_ENV === 'h5') {
      fetch(filePath)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    } else {
      Taro.getFileSystemManager().readFile({
        filePath,
        encoding: 'base64',
        success: res => resolve(`data:image/jpeg;base64,${res.data}`),
        fail: reject
      });
    }
  });
};

const loadState = (): AppState | null => {
  try {
    const saved = Taro.getStorageSync(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('[Store] 从本地加载状态成功');
      return parsed;
    }
  } catch (e) {
    console.error('[Store] 加载状态失败:', e);
  }
  return null;
};

const generateReminders = (treatments: TreatmentRecord[]): Reminder[] => {
  const reminders: Reminder[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = treatments
    .filter(t => t.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcoming.length > 0) {
    const next = upcoming[0];
    const nextDate = new Date(next.date);
    nextDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 2 && diffDays >= 0) {
      reminders.push({
        id: 'rem_prep_auto',
        type: 'prep',
        title: diffDays === 0 ? '今天有治疗' : `距离下次治疗还有${diffDays}天`,
        description: '请做好术前准备：停用刺激性护肤品、注意防晒、规律作息',
        date: next.date,
        time: next.time,
        isRead: false
      });
    }

    if (diffDays === 2) {
      reminders.push({
        id: 'rem_48h_auto',
        type: 'prep',
        title: '术前48小时提醒',
        description: '请开始温和清洁、停用酸类/维A醇等刺激性产品、加强保湿',
        date: next.date,
        isRead: false
      });
    }
  }

  reminders.push({
    id: 'rem_sun_daily',
    type: 'sun',
    title: '每日防晒提醒',
    description: '治疗前后请注意严格防晒，避免紫外线加重色素沉着',
    date: new Date().toISOString().split('T')[0],
    isRead: true
  });

  const completed = treatments.filter(t => t.status === 'completed');
  if (completed.length > 0) {
    const lastCompleted = completed[completed.length - 1];
    const lastDate = new Date(lastCompleted.date);
    const daysSince = Math.ceil((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince <= 14) {
      reminders.push({
        id: 'rem_checkin_auto',
        type: 'checkin',
        title: `术后第${daysSince}天恢复打卡`,
        description: '今天也别忘了记录皮肤状态，帮助医生了解恢复情况~',
        date: new Date().toISOString().split('T')[0],
        isRead: false
      });
    }
  }

  return reminders;
};

const appReducer = (state: AppState, action: Action): AppState => {
  let newState: AppState;

  switch (action.type) {
    case 'HYDRATE_STATE':
      return action.payload;

    case 'BIND_COURSE': {
      const reminders = generateReminders(mockTreatments);
      newState = {
        ...state,
        isBound: true,
        courseCode: action.payload.courseCode,
        course: mockCourse,
        treatments: mockTreatments,
        rescheduleRequests: [],
        reminders: reminders,
        checkins: mockCheckins,
        photos: mockPhotos
      };
      break;
    }

    case 'ADD_RESCHEDULE_REQUEST': {
      const newTreatmentWithReschedule = state.treatments.map(t =>
        t.id === action.payload.treatmentId
          ? { ...t, reschedule: action.payload }
          : t
      );
      newState = {
        ...state,
        rescheduleRequests: [...state.rescheduleRequests, action.payload],
        treatments: newTreatmentWithReschedule
      };
      break;
    }

    case 'UPDATE_RESCHEDULE_STATUS': {
      const updatedRequests = state.rescheduleRequests.map(r => {
        if (r.id === action.payload.id) {
          const updated = {
            ...r,
            status: action.payload.status,
            repliedAt: new Date().toISOString(),
            rejectReason: action.payload.rejectReason
          };
          if (action.payload.status === 'approved') {
            const updatedTreatments = state.treatments.map(t =>
              t.id === r.treatmentId
                ? {
                    ...t,
                    date: r.requestedDate,
                    time: r.requestedTime,
                    reschedule: updated
                  }
                : t
            );
            newState = {
              ...state,
              rescheduleRequests: state.rescheduleRequests.map(req =>
                req.id === action.payload.id ? updated : req
              ),
              treatments: updatedTreatments
            };
            return updated;
          }
          return updated;
        }
        return r;
      });
      if (!newState) {
        newState = {
          ...state,
          rescheduleRequests: updatedRequests,
          treatments: state.treatments.map(t => {
            const req = updatedRequests.find(r => r.treatmentId === t.id);
            return req ? { ...t, reschedule: req } : t;
          })
        };
      }
      break;
    }

    case 'UPDATE_TREATMENT_DATE': {
      newState = {
        ...state,
        treatments: state.treatments.map(t =>
          t.id === action.payload.id
            ? { ...t, date: action.payload.date, time: action.payload.time }
            : t
        )
      };
      break;
    }

    case 'SET_CONSULT_PENDING_REPLY': {
      newState = {
        ...state,
        consultSessions: state.consultSessions.map(s =>
          s.id === action.payload.sessionId
            ? { ...s, pendingReply: action.payload.pending }
            : s
        )
      };
      break;
    }

    case 'ADD_CHECKIN':
      newState = {
        ...state,
        checkins: [...state.checkins, action.payload]
      };
      break;

    case 'ADD_PHOTO':
      newState = {
        ...state,
        photos: [...state.photos, action.payload]
      };
      break;

    case 'MARK_REMINDER_READ':
      newState = {
        ...state,
        reminders: state.reminders.map(r =>
          r.id === action.payload ? { ...r, isRead: true } : r
        )
      };
      break;

    case 'SET_REMINDERS':
      newState = {
        ...state,
        reminders: action.payload
      };
      break;

    case 'ADD_CONSULT_MESSAGE': {
      const isUser = action.payload.message.sender === 'user';
      newState = {
        ...state,
        consultSessions: state.consultSessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                messages: [...s.messages, action.payload.message],
                lastMessage: action.payload.message.content || '[图片]',
                lastTime: action.payload.message.timestamp,
                pendingReply: isUser ? true : false
              }
            : s
        )
      };
      break;
    }

    case 'ADD_CONSULT_IMAGES':
      newState = {
        ...state,
        consultSessions: state.consultSessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                messages: s.messages.map((m, idx) =>
                  idx === s.messages.length - 1
                    ? { ...m, images: [...(m.images || []), ...action.payload.images] }
                    : m
                )
              }
            : s
        )
      };
      break;

    default:
      return state;
  }

  saveState(newState);
  return newState;
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const validateCourseCode = (code: string): { valid: boolean; message?: string } => {
  const trimmed = code.trim();

  if (!trimmed) {
    return { valid: false, message: '请输入疗程码' };
  }

  if (trimmed.length < 6) {
    return { valid: false, message: '疗程码至少6位，请检查后重试' };
  }

  if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
    return { valid: false, message: '疗程码格式不正确，应为字母和数字组合' };
  }

  const validPrefixes = ['PHOTON', 'PT', 'GN', 'SKIN', 'BEAUTY'];
  const upperCode = trimmed.toUpperCase();
  const hasValidPrefix = validPrefixes.some(p => upperCode.startsWith(p) || /[A-Z]{2,}\d{4,}/.test(upperCode));

  if (!hasValidPrefix) {
    return { valid: false, message: '疗程码不存在，请确认后再输入' };
  }

  return { valid: true };
};

export const getDaysSinceLastTreatment = (treatments: TreatmentRecord[]): number => {
  const completed = treatments.filter(t => t.status === 'completed');
  if (completed.length === 0) return 0;

  const last = completed[completed.length - 1];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDate = new Date(last.date);
  lastDate.setHours(0, 0, 0, 0);

  return Math.ceil((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const getTreatmentIntervals = (treatments: TreatmentRecord[]): { date1: string; date2: string; days: number; isRecommended: boolean }[] => {
  const sorted = [...treatments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const results: { date1: string; date2: string; days: number; isRecommended: boolean }[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const t1 = sorted[i];
    const t2 = sorted[i + 1];
    const d1 = new Date(t1.date);
    const d2 = new Date(t2.date);
    const days = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    results.push({
      date1: t1.date,
      date2: t2.date,
      days,
      isRecommended: days >= 21 && days <= 35
    });
  }

  return results;
};

export const getCheckinsForTreatment = (
  checkins: CheckinRecord[],
  treatments: TreatmentRecord[],
  treatmentIndex: number
): CheckinRecord[] => {
  const sortedTreatments = [...treatments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const currentTreatment = sortedTreatments.find(t => t.index === treatmentIndex);
  if (!currentTreatment) return [];

  const currentDate = new Date(currentTreatment.date);
  currentDate.setHours(0, 0, 0, 0);

  const nextTreatment = sortedTreatments.find(
    t => t.index === treatmentIndex + 1
  );
  const nextDate = nextTreatment
    ? new Date(nextTreatment.date)
    : new Date('2100-01-01');
  nextDate.setHours(0, 0, 0, 0);

  return checkins.filter(c => {
    const checkinDate = new Date(c.date);
    checkinDate.setHours(0, 0, 0, 0);
    return checkinDate >= currentDate && checkinDate < nextDate;
  });
};

export const getConsecutiveCheckinDays = (checkins: CheckinRecord[]): number => {
  if (checkins.length === 0) return 0;

  const sortedDates = [...new Set(checkins.map(c => c.date))]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let consecutive = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const checkinDate = new Date(sortedDates[i]);
    checkinDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (checkinDate.getTime() === expectedDate.getTime()) {
      consecutive++;
    } else if (i === 0 && checkinDate.getTime() < expectedDate.getTime()) {
      const diffDays = Math.round(
        (expectedDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        consecutive++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return consecutive;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.treatments && saved.treatments.length > 0) {
        const refreshedReminders = generateReminders(saved.treatments);
        const existingIds = saved.reminders.map(r => r.id);
        const merged = [
          ...saved.reminders,
          ...refreshedReminders.filter(r => !existingIds.includes(r.id))
        ];
        dispatch({ type: 'HYDRATE_STATE', payload: { ...saved, reminders: merged } });
      } else {
        dispatch({ type: 'HYDRATE_STATE', payload: saved });
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && state.isBound && state.treatments.length > 0) {
      const autoReminders = generateReminders(state.treatments);
      const existingIds = new Set(state.reminders.map(r => r.id));
      const newReminders = autoReminders.filter(r => !existingIds.has(r.id));

      if (newReminders.length > 0) {
        dispatch({ type: 'SET_REMINDERS', payload: [...state.reminders, ...newReminders] });
      }
    }
  }, [hydrated, state.isBound, state.treatments.length]);

  if (!hydrated) {
    return null;
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
