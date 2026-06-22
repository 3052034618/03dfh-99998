import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  CourseInfo,
  TreatmentRecord,
  Reminder,
  CheckinRecord,
  PhotoRecord,
  ConsultSession,
  CareProduct,
  UserInfo
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

interface AppState {
  user: UserInfo | null;
  course: CourseInfo | null;
  treatments: TreatmentRecord[];
  reminders: Reminder[];
  checkins: CheckinRecord[];
  photos: PhotoRecord[];
  consultSessions: ConsultSession[];
  products: CareProduct[];
  isBound: boolean;
}

type Action =
  | { type: 'BIND_COURSE'; payload: { courseCode: string } }
  | { type: 'ADD_CHECKIN'; payload: CheckinRecord }
  | { type: 'ADD_PHOTO'; payload: PhotoRecord }
  | { type: 'MARK_REMINDER_READ'; payload: string }
  | { type: 'ADD_CONSULT_MESSAGE'; payload: { sessionId: string; message: any } };

const initialState: AppState = {
  user: mockUser,
  course: mockCourse,
  treatments: mockTreatments,
  reminders: mockReminders,
  checkins: mockCheckins,
  photos: mockPhotos,
  consultSessions: mockConsultSessions,
  products: mockProducts,
  isBound: true
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'BIND_COURSE':
      return {
        ...state,
        isBound: true,
        course: mockCourse,
        treatments: mockTreatments,
        reminders: mockReminders
      };
    case 'ADD_CHECKIN':
      return {
        ...state,
        checkins: [...state.checkins, action.payload]
      };
    case 'ADD_PHOTO':
      return {
        ...state,
        photos: [...state.photos, action.payload]
      };
    case 'MARK_REMINDER_READ':
      return {
        ...state,
        reminders: state.reminders.map(r =>
          r.id === action.payload ? { ...r, isRead: true } : r
        )
      };
    case 'ADD_CONSULT_MESSAGE':
      return {
        ...state,
        consultSessions: state.consultSessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                messages: [...s.messages, action.payload.message],
                lastMessage: action.payload.message.content,
                lastTime: action.payload.message.timestamp
              }
            : s
        )
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
