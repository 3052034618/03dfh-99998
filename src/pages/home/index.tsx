import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp, getDaysSinceLastTreatment } from '@/store/CourseContext';
import { getDaysDiff, getSymptomEmoji, formatDate } from '@/utils/date';

const HomePage: React.FC = () => {
  const { state } = useApp();
  const { course, treatments, reminders, checkins, user, isBound } = state;

  useEffect(() => {
    if (!isBound) {
      console.log('[Home] 未绑定疗程，跳转到绑定页');
      Taro.redirectTo({ url: '/pages/bind/index' });
    }
  }, [isBound]);

  const upcomingTreatment = useMemo(() => {
    const upcoming = treatments
      .filter(t => t.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] || null;
  }, [treatments]);

  const lastCheckin = useMemo(() => {
    if (checkins.length === 0) return null;
    return checkins[checkins.length - 1];
  }, [checkins]);

  const daysUntilNext = useMemo(() => {
    if (!upcomingTreatment) return 0;
    return getDaysDiff(formatDate(new Date()), upcomingTreatment.date);
  }, [upcomingTreatment]);

  const daysSinceLast = useMemo(() => {
    return getDaysSinceLastTreatment(treatments);
  }, [treatments]);

  const unreadCount = useMemo(() => {
    return reminders.filter(r => !r.isRead).length;
  }, [reminders]);

  const handleQuickNav = (path: string) => {
    Taro.navigateTo({ url: path });
  };

  const getReminderIcon = (type: string) => {
    const icons: Record<string, { emoji: string; className: string }> = {
      prep: { emoji: '📋', className: styles.typePrep },
      sun: { emoji: '☀️', className: styles.typeSun },
      checkin: { emoji: '✅', className: styles.typeCheckin },
      other: { emoji: '💡', className: styles.typePrep }
    };
    return icons[type] || icons.other;
  };

  if (!isBound) {
    return (
      <View className={styles.page}>
        <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#A9A5B5' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.greeting}>今天也要好好护肤哦 ~</Text>
        <Text className={styles.userName}>{user?.nickname || '亲爱的'}</Text>
        <Text className={styles.subtitle}>
          {course?.status === 'active'
            ? daysSinceLast > 0
              ? `上次治疗后第 ${daysSinceLast} 天，皮肤恢复中`
              : '疗程进行中，我们一起变美'
            : '欢迎使用光子嫩肤陪伴'}
        </Text>
      </View>

      <View className={styles.section}>
        {course && (
          <View className={styles.courseCard}>
            <Text className={styles.courseName}>{course.name}</Text>
            <Text className={styles.institution}>{course.institution} · {course.doctor}</Text>

            <View className={styles.progressInfo}>
              <Text className={styles.progressText}>
                已完成 <Text className={styles.num}>{course.completedTimes}</Text> / {course.totalTimes} 次
              </Text>
              <Text className={styles.percent}>
                {Math.round((course.completedTimes / course.totalTimes) * 100)}%
              </Text>
            </View>

            <View className={styles.progressBar}>
              <View
                className={styles.fill}
                style={{ width: `${(course.completedTimes / course.totalTimes) * 100}%` }}
              ></View>
            </View>

            {upcomingTreatment && (
              <View className={styles.nextTreatment}>
                <Text className={styles.label}>
                  距下次治疗还有 {daysUntilNext} 天
                </Text>
                <Text className={styles.date}>
                  {upcomingTreatment.date} {upcomingTreatment.time}
                </Text>
                {upcomingTreatment.reschedule && (
                  <View className={styles.rescheduleStatus}>
                    {upcomingTreatment.reschedule.status === 'pending' && (
                      <Text className={styles.reschedulePending}>⏳ 改约审核中：{upcomingTreatment.reschedule.requestedDate} {upcomingTreatment.reschedule.requestedTime}</Text>
                    )}
                    {upcomingTreatment.reschedule.status === 'approved' && (
                      <Text className={styles.rescheduleApproved}>✅ 已改约（原{upcomingTreatment.reschedule.originalDate}）</Text>
                    )}
                    {upcomingTreatment.reschedule.status === 'rejected' && (
                      <Text className={styles.rescheduleRejected}>❌ 改约未通过：{upcomingTreatment.reschedule.rejectReason}</Text>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.quickGrid}>
          <View className={styles.quickItem} onClick={() => handleQuickNav('/pages/preparation/index')}>
            <View className={`${styles.icon} ${styles.iconPrep}`}>📋</View>
            <Text className={styles.label}>术前准备</Text>
          </View>
          <View className={styles.quickItem} onClick={() => handleQuickNav('/pages/checkin/index')}>
            <View className={`${styles.icon} ${styles.iconCheckin}`}>📝</View>
            <Text className={styles.label}>恢复打卡</Text>
          </View>
          <View className={styles.quickItem} onClick={() => handleQuickNav('/pages/photo-compare/index')}>
            <View className={`${styles.icon} ${styles.iconPhoto}`}>📷</View>
            <Text className={styles.label}>照片对比</Text>
          </View>
          <View className={styles.quickItem} onClick={() => handleQuickNav('/pages/consult/index')}>
            <View className={`${styles.icon} ${styles.iconConsult}`}>💬</View>
            <Text className={styles.label}>问题咨询</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.reminderCard}>
          <View className={styles.reminderHeader}>
            <Text className={styles.title}>今日提醒</Text>
            {unreadCount > 0 && (
              <Text className={styles.more}>{unreadCount} 条未读</Text>
            )}
          </View>
          <View className={styles.reminderList}>
            {reminders.length > 0 ? (
              reminders.slice(0, 3).map(reminder => {
                const iconConfig = getReminderIcon(reminder.type);
                return (
                  <View key={reminder.id} className={styles.reminderItem}>
                    <View className={`${styles.typeIcon} ${iconConfig.className}`}>
                      {iconConfig.emoji}
                    </View>
                    <View className={styles.content}>
                      <Text className={styles.reminderTitle}>{reminder.title}</Text>
                      <Text className={styles.reminderDesc}>{reminder.description}</Text>
                    </View>
                    {!reminder.isRead && <View className={styles.unreadDot}></View>}
                  </View>
                );
              })
            ) : (
              <Text style={{ textAlign: 'center', color: '#A9A5B5', padding: '24rpx 0' }}>暂无提醒</Text>
            )}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.recentSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.title}>最近恢复</Text>
            <Text
              className={styles.more}
              onClick={() => Taro.switchTab({ url: '/pages/recovery/index' })}
            >
              查看全部 →
            </Text>
          </View>
          {lastCheckin ? (
            <View className={styles.checkinPreview}>
              <View className={styles.checkinHeader}>
                <Text className={styles.day}>第 {lastCheckin.treatmentDay + 1} 天</Text>
                <Text className={styles.date}>{lastCheckin.date}</Text>
              </View>
              <View className={styles.symptomRow}>
                <View className={styles.symptomItem}>
                  <Text className={styles.emoji}>{getSymptomEmoji(lastCheckin.redness)}</Text>
                  <Text className={styles.label}>泛红</Text>
                </View>
                <View className={styles.symptomItem}>
                  <Text className={styles.emoji}>{getSymptomEmoji(lastCheckin.dryness)}</Text>
                  <Text className={styles.label}>干燥</Text>
                </View>
                <View className={styles.symptomItem}>
                  <Text className={styles.emoji}>{getSymptomEmoji(lastCheckin.stinging)}</Text>
                  <Text className={styles.label}>刺痛</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className={styles.checkinPreview}>
              <Text style={{ textAlign: 'center', color: '#A9A5B5', fontSize: '24rpx' }}>
                暂无打卡记录
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
