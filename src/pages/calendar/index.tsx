import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';
import { formatDate, getMonthDays, getFirstDayOfMonth } from '@/utils/date';
import classNames from 'classnames';

const CalendarPage: React.FC = () => {
  const { state } = useApp();
  const { treatments } = state;

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

  const isToday = (dateStr: string): boolean => {
    return formatDate(new Date()) === dateStr;
  };

  const hasTreatment = (dateStr: string) => {
    return treatmentDates.get(dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const sortedTreatments = useMemo(() => {
    return [...treatments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [treatments]);

  return (
    <ScrollView className={styles.page} scrollY>
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

            return (
              <View
                key={index}
                className={classNames(
                  styles.dayCell,
                  !dayInfo.isCurrentMonth && styles.otherMonth,
                  today && styles.today,
                  treatment && styles.treatmentDay,
                  treatment && treatment.status === 'upcoming' && styles.upcoming
                )}
              >
                <Text className={styles.dayNumber}>{dayInfo.day}</Text>
                {treatment && treatment.status === 'upcoming' && (
                  <Text className={styles.sunWarning}>☀️</Text>
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
          <View className={`${styles.dot} ${styles.dotSun}`}></View>
          <Text className={styles.label}>注意防晒</Text>
        </View>
      </View>

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
          {sortedTreatments.map(treatment => (
            <View key={treatment.id} className={styles.treatmentItem}>
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default CalendarPage;
