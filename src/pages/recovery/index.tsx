import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp, getCheckinsForTreatment, getConsecutiveCheckinDays, getDaysSinceLastTreatment } from '@/store/CourseContext';
import { getSymptomEmoji, getSymptomLevelText, formatDate } from '@/utils/date';
import { mockReactions } from '@/data/mockData';
import classNames from 'classnames';

const RecoveryPage: React.FC = () => {
  const { state } = useApp();
  const { checkins, course, treatments, isBound } = state;
  const [selectedTreatment, setSelectedTreatment] = useState<number | 'all'>('all');

  const availableTreatments = useMemo(() => {
    const completed = treatments
      .filter(t => t.status === 'completed')
      .sort((a, b) => a.index - b.index);
    return completed;
  }, [treatments]);

  const filteredCheckins = useMemo(() => {
    if (selectedTreatment === 'all') {
      return [...checkins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    const treatmentCheckins = getCheckinsForTreatment(checkins, treatments, selectedTreatment);
    return [...treatmentCheckins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [checkins, treatments, selectedTreatment]);

  const consecutiveDays = useMemo(() => {
    return getConsecutiveCheckinDays(checkins);
  }, [checkins]);

  const daysSinceLast = useMemo(() => {
    return getDaysSinceLastTreatment(treatments);
  }, [treatments]);

  const handleCheckin = () => {
    Taro.navigateTo({ url: '/pages/checkin/index' });
  };

  const handlePhotoCompare = () => {
    Taro.navigateTo({ url: '/pages/photo-compare/index' });
  };

  const handleViewReport = () => {
    Taro.navigateTo({ url: '/pages/report/index' });
  };

  const getSeverityBadge = (severity: string) => {
    const configs: Record<string, { text: string; className: string }> = {
      normal: { text: '正常反应', className: styles.badgeNormal },
      mild: { text: '轻微反应', className: styles.badgeMild },
      concerning: { text: '需关注', className: styles.badgeMild }
    };
    return configs[severity] || configs.normal;
  };

  if (!isBound) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View style={{ padding: '100rpx 0', textAlign: 'center' }}>
          <Text style={{ color: '#A9A5B5' }}>请先绑定疗程码查看恢复记录</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.statsCard}>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.num}>{consecutiveDays}</Text>
            <Text className={styles.label}>
              {consecutiveDays > 0 ? '连续打卡' : '已打卡'}
            </Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.num}>{checkins.length}</Text>
            <Text className={styles.label}>累计打卡</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.num}>{daysSinceLast}</Text>
            <Text className={styles.label}>术后第几天</Text>
          </View>
        </View>
        <Button className={styles.checkinBtn} onClick={handleCheckin}>
          📝 今日打卡
        </Button>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionCard} onClick={handlePhotoCompare}>
          <View className={`${styles.icon} ${styles.iconPhoto}`}>📷</View>
          <Text className={styles.title}>照片对比</Text>
          <Text className={styles.desc}>记录每一次变化</Text>
        </View>
        <View className={styles.actionCard} onClick={handleViewReport}>
          <View className={`${styles.icon} ${styles.iconReport}`}>📊</View>
          <Text className={styles.title}>变化报告</Text>
          <Text className={styles.desc}>查看疗程效果</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.title}>打卡记录</Text>
        <Text className={styles.more}>{filteredCheckins.length} 条记录</Text>
      </View>

      {availableTreatments.length > 0 && (
        <ScrollView scrollX className={styles.treatmentTabs} style={{ whiteSpace: 'nowrap' }}>
          <View
            className={classNames(styles.treatmentTab, selectedTreatment === 'all' && styles.active)}
            onClick={() => setSelectedTreatment('all')}
          >
            全部
          </View>
          {availableTreatments.map(t => (
            <View
              key={t.index}
              className={classNames(styles.treatmentTab, selectedTreatment === t.index && styles.active)}
              onClick={() => setSelectedTreatment(t.index)}
            >
              第{t.index}次后
            </View>
          ))}
        </ScrollView>
      )}

      <View className={styles.checkinList}>
        {filteredCheckins.map(checkin => (
          <View key={checkin.id} className={styles.checkinItem}>
            <View className={styles.itemHeader}>
              <Text className={styles.day}>术后第 {checkin.treatmentDay + 1} 天</Text>
              <Text className={styles.date}>{checkin.date}</Text>
            </View>
            <View className={styles.symptoms}>
              <View className={styles.symptom}>
                <Text className={styles.emoji}>{getSymptomEmoji(checkin.redness)}</Text>
                <Text className={styles.label}>泛红</Text>
                <Text className={styles.level}>{getSymptomLevelText(checkin.redness)}</Text>
              </View>
              <View className={styles.symptom}>
                <Text className={styles.emoji}>{getSymptomEmoji(checkin.dryness)}</Text>
                <Text className={styles.label}>干燥</Text>
                <Text className={styles.level}>{getSymptomLevelText(checkin.dryness)}</Text>
              </View>
              <View className={styles.symptom}>
                <Text className={styles.emoji}>{getSymptomEmoji(checkin.stinging)}</Text>
                <Text className={styles.label}>刺痛</Text>
                <Text className={styles.level}>{getSymptomLevelText(checkin.stinging)}</Text>
              </View>
            </View>
            {checkin.note && (
              <View className={styles.note}>
                <Text className={styles.noteText}>{checkin.note}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.reactionSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>常见反应</Text>
          <Text className={styles.subtitle}>了解更多，减少焦虑</Text>
        </View>
        <View className={styles.reactionCards}>
          {mockReactions.map(reaction => {
            const badge = getSeverityBadge(reaction.severity);
            return (
              <View key={reaction.id} className={styles.reactionItem}>
                <View className={styles.reactionHeader}>
                  <Text className={styles.name}>{reaction.name}</Text>
                  <View className={classNames(styles.badge, badge.className)}>
                    {badge.text}
                  </View>
                </View>
                <Text className={styles.reactionDesc}>{reaction.description}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default RecoveryPage;
