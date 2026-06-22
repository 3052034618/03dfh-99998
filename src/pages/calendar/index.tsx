import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp, getTreatmentIntervals } from '@/store/CourseContext';
import { formatDate, getMonthDays, getFirstDayOfMonth, getDaysDiff } from '@/utils/date';
import classNames from 'classnames';

const CalendarPage: React.FC = () => {
  const { state } = useApp();
  const { treatments, reminders, isBound } = state;

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const calendarDays = useMemo(() => {
    const daysInMonth = getMonthDays(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonthDays = getMonthDays(year, month - 1);

    const days: { day: number; isCurrentMonth: boolean; date: string }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      days.push({
        day,
        isCurrentMonth: false,
        date: `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      days.push({
        day: i,
        isCurrentMonth: false,
        date: `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    return days;
  }, [year, month]);

  const treatmentDates = useMemo(() => {
    const map = new Map<string, { status: string; index: number }>();
    treatments.forEach(t => {
      map.set(t.date, { status: t.status, index: t.index });
    });
    return map;
  }, [treatments]);

  const prepDates = useMemo(() => {
    const set = new Set<string>();
    const upcoming = treatments.filter(t => t.status === 'upcoming');
    upcoming.forEach(t => {
      for (let i = 1; i <= 2; i++) {
        const d = new Date(t.date);
        d.setDate(d.getDate() - i);
        set.add(formatDate(d));
      }
    });
    return set;
  }, [treatments]);

  const nextTreatment = useMemo(() => {
    const upcoming = treatments
      .filter(t => t.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] || null;
  }, [treatments]);

  const daysUntilNext = useMemo(() => {
    if (!nextTreatment) return 0;
    return getDaysDiff(formatDate(new Date()), nextTreatment.date);
  }, [nextTreatment]);

  const intervals = useMemo(() => {
    return getTreatmentIntervals(treatments);
  }, [treatments]);

  const isToday = (dateStr: string): boolean => {
    return formatDate(new Date()) === dateStr;
  };

  const hasTreatment = (dateStr: string) => {
    return treatmentDates.get(dateStr);
  };

  const isPrepDay = (dateStr: string) => {
    return prepDates.has(dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleGoToPrep = () => {
    Taro.navigateTo({ url: '/pages/preparation/index' });
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const sortedTreatments = useMemo(() => {
    return [...treatments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [treatments]);

  if (!isBound) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View style={{ padding: '100rpx 0', textAlign: 'center' }}>
          <Text style={{ color: '#A9A5B5' }}>请先绑定疗程码查看日历</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      {nextTreatment && daysUntilNext <= 2 && daysUntilNext >= 0 && (
        <View className={styles.prepReminderCard}>
          <View className={styles.prepReminderHeader}>
            <View className={styles.prepReminderIcon}>📋</View>
            <View className={styles.prepReminderContent}>
              <Text className={styles.prepReminderTitle}>
                {daysUntilNext === 0 ? '今天是治疗日' : `距离下次治疗还有 ${daysUntilNext} 天`}
              </Text>
              <Text className={styles.prepReminderDesc}>
                {daysUntilNext === 0
                  ? '请按约定时间到店，记得提前清洁面部'
                  : '术前48小时，请做好准备工作'}
              </Text>
            </View>
          </View>
          <View className={styles.prepReminderList}>
            <View className={styles.prepReminderItem}>
              <View className={styles.prepCheckDot}>✓</View>
              <Text className={styles.prepReminderText}>停用刺激性护肤品</Text>
            </View>
            <View className={styles.prepReminderItem}>
              <View className={styles.prepCheckDot}>✓</View>
              <Text className={styles.prepReminderText}>加强保湿防晒</Text>
            </View>
          </View>
          <Button className={styles.prepReminderBtn} onClick={handleGoToPrep}>
            查看完整术前准备 →
          </Button>
        </View>
      )}

      <View className={styles.monthSelector}>
        <View className={styles.navBtn} onClick={handlePrevMonth}>‹</View>
        <Text className={styles.monthText}>{year}年{month}月</Text>
        <View className={styles.navBtn} onClick={handleNextMonth}>›</View>
      </View>

      <View className={styles.calendar}>
        <View className={styles.weekRow}>
          {weekDays.map(day => (
            <Text key={day} className={styles.weekDay}>{day}</Text>
          ))}
        </View>
        <View className={styles.daysGrid}>
          {calendarDays.map((dayInfo, index) => {
            const treatment = hasTreatment(dayInfo.date);
            const today = isToday(dayInfo.date);
            const prepDay = isPrepDay(dayInfo.date);

            return (
              <View
                key={index}
                className={classNames(
                  styles.dayCell,
                  !dayInfo.isCurrentMonth && styles.otherMonth,
                  today && styles.today,
                  treatment && styles.treatmentDay,
                  treatment && treatment.status === 'upcoming' && styles.upcoming,
                  prepDay && !treatment && styles.prepDay
                )}
              >
                <Text className={styles.dayNumber}>{dayInfo.day}</Text>
                {treatment && treatment.status === 'upcoming' && (
                  <Text className={styles.sunWarning}>☀️</Text>
                )}
                {prepDay && !treatment && (
                  <View className={styles.prepDot}></View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.legend}>
        <View className={styles.legendItem}>
          <View className={`${styles.dot} ${styles.dotTreatment}`}></View>
          <Text className={styles.label}>治疗日</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={`${styles.dot} ${styles.dotPrep}`}></View>
          <Text className={styles.label}>术前准备</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={`${styles.dot} ${styles.dotSun}`}></View>
          <Text className={styles.label}>注意防晒</Text>
        </View>
      </View>

      {intervals.length > 0 && (
        <View className={styles.intervalSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.title}>治疗间隔</Text>
            <Text className={styles.subtitle}>建议间隔 3-5 周</Text>
          </View>
          <View className={styles.intervalList}>
            {intervals.map((interval, idx) => (
              <View key={idx} className={styles.intervalItem}>
                <View className={styles.intervalDates}>
                  <Text className={styles.intervalDate}>第{idx + 1}次 → 第{idx + 2}次</Text>
                  <Text className={styles.intervalDays}>
                    间隔 <Text
                      className={classNames(
                        styles.intervalNum,
                        interval.isRecommended ? styles.intervalGood : styles.intervalWarn
                      )}
                    >
                      {interval.days}
                    </Text> 天
                  </Text>
                </View>
                <View
                  className={classNames(
                    styles.intervalBadge,
                    interval.isRecommended ? styles.badgeGood : styles.badgeWarn
                  )}
                >
                  {interval.isRecommended ? '✓ 符合建议' : '⚠ 需关注'}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.tipsCard}>
        <View className={styles.tipsHeader}>
          <Text className={styles.icon}>☀️</Text>
          <Text className={styles.title}>防晒提醒</Text>
        </View>
        <Text className={styles.tipsContent}>
          治疗前后一周内请注意严格防晒，避免暴晒。建议使用SPF50+防晒霜，配合遮阳伞、帽子等物理防晒措施。紫外线会加重色素沉着风险哦~
        </Text>
      </View>

      <View style={{ marginTop: '48rpx' }}>
        <View className={styles.sectionTitle}>
          <Text className={styles.title}>治疗记录</Text>
        </View>
        <View className={styles.treatmentList}>
          {sortedTreatments.map(treatment => {
            const intervalInfo = idx => {
              if (idx === 0) return null;
              return intervals[idx - 1];
            };
            const idx = sortedTreatments.indexOf(treatment);
            const interval = intervalInfo(idx);
            return (
              <View key={treatment.id}>
                <View className={styles.treatmentItem}>
                  <View className={styles.itemHeader}>
                    <View className={styles.left}>
                      <Text className={styles.index}>第 {treatment.index} 次治疗</Text>
                      <Text className={styles.date}>{treatment.date} {treatment.time}</Text>
                    </View>
                    <View
                      className={classNames(
                      styles.status,
                      treatment.status === 'completed' ? styles.statusCompleted : styles.statusUpcoming
                    )}
                    >
                      {treatment.status === 'completed' ? '已完成' : '待进行'}
                    </View>
                  </View>
                  {treatment.energyLevel && (
                    <View className={styles.itemDetails}>
                      <View className={styles.detail}>
                        <Text className={styles.label}>能量等级</Text>
                        <Text className={styles.value}>{treatment.energyLevel}</Text>
                      </View>
                      {treatment.notes && (
                        <View className={styles.detail}>
                          <Text className={styles.label}>备注</Text>
                          <Text className={styles.value}>{treatment.notes}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
                {interval && (
                  <View
                    className={classNames(
                      styles.intervalConnector,
                      interval.isRecommended ? styles.connectorGood : styles.connectorWarn
                    )}
                  >
                    <Text className={styles.connectorText}>
                      ⏱ 间隔 {interval.days} 天
                      {interval.isRecommended ? '（建议范围内）' : '（建议3-5周）'}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default CalendarPage;
