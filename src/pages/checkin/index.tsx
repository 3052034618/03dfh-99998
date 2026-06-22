import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';
import { formatDate } from '@/utils/date';
import classNames from 'classnames';

const symptoms = [
  { key: 'redness', name: '泛红', icon: '🔴', levels: ['无', '轻微', '中等', '明显'] },
  { key: 'dryness', name: '干燥', icon: '🏜️', levels: ['无', '轻微', '中等', '明显'] },
  { key: 'stinging', name: '刺痛', icon: '💫', levels: ['无', '轻微', '中等', '明显'] }
];

const emojis = ['😊', '🙂', '😐', '😣'];

const CheckinPage: React.FC = () => {
  const { dispatch } = useApp();
  const [levels, setLevels] = useState({ redness: 0, dryness: 0, stinging: 0 });
  const [note, setNote] = useState('');

  const today = formatDate(new Date());

  const handleLevelChange = (key: string, level: number) => {
    setLevels(prev => ({ ...prev, [key]: level }));
  };

  const handleSubmit = () => {
    console.log('[Checkin] 提交打卡:', { levels, note });

    const checkinRecord = {
      id: `ck_${Date.now()}`,
      date: today,
      redness: levels.redness,
      dryness: levels.dryness,
      stinging: levels.stinging,
      note: note || undefined,
      treatmentDay: 7
    };

    dispatch({ type: 'ADD_CHECKIN', payload: checkinRecord });

    Taro.showToast({
      title: '打卡成功',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.dayHeader}>
          <Text className={styles.dayText}>术后第 8 天</Text>
          <Text className={styles.dateText}>{today}</Text>
        </View>

        <View className={styles.symptomSection}>
          <Text className={styles.sectionTitle}>今天的皮肤状态</Text>

          {symptoms.map(symptom => (
            <View key={symptom.key} className={styles.symptomCard}>
              <View className={styles.symptomHeader}>
                <Text className={styles.symptomName}>
                  <Text className={styles.icon}>{symptom.icon}</Text>
                  {symptom.name}
                </Text>
                <Text className={styles.currentLevel}>
                  当前：{symptom.levels[levels[symptom.key as keyof typeof levels]]}
                </Text>
              </View>
              <View className={styles.emojiSelector}>
                {emojis.map((emoji, index) => (
                  <View
                    key={index}
                    className={classNames(
                      styles.emojiOption,
                      levels[symptom.key as keyof typeof levels] === index && styles.selected
                    )}
                    onClick={() => handleLevelChange(symptom.key, index)}
                  >
                    <Text className={styles.emoji}>{emoji}</Text>
                    <Text className={styles.label}>{symptom.levels[index]}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View className={styles.noteSection}>
          <Text className={styles.sectionTitle}>补充说明（选填）</Text>
          <View className={styles.noteCard}>
            <Input
              className={styles.noteInput}
              placeholder="今天皮肤有什么变化或疑问都可以记录下来~"
              placeholderClass="input-placeholder"
              value={note}
              onInput={e => setNote(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>

        <View className={styles.tipsCard}>
          <Text className={styles.tipsTitle}>💡 温馨提示</Text>
          <Text className={styles.tipsText}>
            轻微的泛红和干燥都是光子治疗后的正常反应，
            一般3-7天会逐渐缓解。
            如果出现严重不适请及时联系您的医生或顾问哦~
          </Text>
        </View>
      </ScrollView>

      <Button className={styles.submitBtn} onClick={handleSubmit}>
        完成打卡
      </Button>
    </View>
  );
};

export default CheckinPage;
