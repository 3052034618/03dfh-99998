import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { getSymptomLevelText, getSymptomEmoji } from '@/utils/date';

interface CheckinItemProps {
  date: string;
  day: number;
  redness: number;
  dryness: number;
  stinging: number;
  note?: string;
}

const CheckinItem: React.FC<CheckinItemProps> = ({ date, day, redness, dryness, stinging, note }) => {
  return (
    <View className={styles.checkinItem}>
      <View className={styles.dateInfo}>
        <Text className={styles.day}>第{day}天</Text>
        <Text className={styles.date}>{date}</Text>
      </View>

      <View className={styles.symptoms}>
        <View className={styles.symptomItem}>
          <Text className={styles.emoji}>{getSymptomEmoji(redness)}</Text>
          <Text className={styles.symptomLabel}>泛红</Text>
          <Text className={styles.symptomLevel}>{getSymptomLevelText(redness)}</Text>
        </View>
        <View className={styles.symptomItem}>
          <Text className={styles.emoji}>{getSymptomEmoji(dryness)}</Text>
          <Text className={styles.symptomLabel}>干燥</Text>
          <Text className={styles.symptomLevel}>{getSymptomLevelText(dryness)}</Text>
        </View>
        <View className={styles.symptomItem}>
          <Text className={styles.emoji}>{getSymptomEmoji(stinging)}</Text>
          <Text className={styles.symptomLabel}>刺痛</Text>
          <Text className={styles.symptomLevel}>{getSymptomLevelText(stinging)}</Text>
        </View>
      </View>

      {note && (
        <View className={styles.note}>
          <Text className={styles.noteText}>{note}</Text>
        </View>
      )}
    </View>
  );
};

export default CheckinItem;
