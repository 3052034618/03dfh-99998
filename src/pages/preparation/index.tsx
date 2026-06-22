import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';
import { getDaysDiff } from '@/utils/date';
import { mockRiskItems, mockPrepItems } from '@/data/mockData';
import classNames from 'classnames';

const PreparationPage: React.FC = () => {
  const { state } = useApp();
  const { treatments } = state;

  const [riskItems, setRiskItems] = useState(mockRiskItems);

  const upcomingTreatment = useMemo(() => {
    return treatments.find(t => t.status === 'upcoming');
  }, [treatments]);

  const daysUntil = useMemo(() => {
    if (!upcomingTreatment) return 0;
    return getDaysDiff(new Date().toISOString().split('T')[0], upcomingTreatment.date);
  }, [upcomingTreatment]);

  const handleRiskToggle = (id: string) => {
    setRiskItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const allChecked = useMemo(() => {
    return riskItems.every(item => item.checked === false);
  }, [riskItems]);

  const handleConfirm = () => {
    const hasConcern = riskItems.some(item => item.checked);
    if (hasConcern) {
      Taro.showModal({
        title: '温馨提示',
        content: '您勾选了部分风险项，建议提前联系医生确认是否适合本次治疗',
        confirmText: '联系医生',
        success: res => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/pages/consult/index' });
          }
        }
      });
    } else {
      Taro.showToast({
        title: '确认完成，期待您的到来~',
        icon: 'success'
      });
    }
  };

  const categoryIcons: Record<string, string> = {
    clean: '🧼',
    skincare: '🧴',
    rest: '😴',
    other: '📝'
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.countdownCard}>
        <Text className={styles.label}>距离下次治疗还有</Text>
        <Text className={styles.countdown}>{daysUntil} 天</Text>
        {upcomingTreatment && (
          <Text className={styles.date}>
            {upcomingTreatment.date} {upcomingTreatment.time}
          </Text>
        )}
      </View>

      <View className={styles.riskSection}>
        <Text className={styles.sectionTitle}>到店前风险确认</Text>
        <View className={styles.riskCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.icon}>⚠️</Text>
            <Text className={styles.title}>请确认以下情况</Text>
          </View>
          <View className={styles.riskList}>
            {riskItems.map(item => (
              <View
                key={item.id}
                className={styles.riskItem}
                onClick={() => handleRiskToggle(item.id)}
              >
                <View
                  className={classNames(styles.checkbox, item.checked && styles.checked)}
                >
                  {item.checked && '✓'}
                </View>
                <View className={styles.content}>
                  <Text className={styles.title}>{item.title}</Text>
                  <Text className={styles.desc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
          <Button
            className={classNames(styles.confirmBtn, allChecked && styles.allChecked)}
            onClick={handleConfirm}
          >
            {allChecked ? '✓ 全部确认无误' : '提交确认'}
          </Button>
        </View>
      </View>

      <View className={styles.prepSection}>
        <Text className={styles.sectionTitle}>术前准备建议</Text>
        <View className={styles.prepList}>
          {mockPrepItems.map(item => (
            <View key={item.id} className={styles.prepItem}>
              <View className={styles.itemHeader}>
                <Text className={styles.title}>
                  <Text className={styles.icon}>{categoryIcons[item.category] || '📝'}</Text>
                  {item.title}
                </Text>
                <View className={styles.timeline}>{item.timeline}</View>
              </View>
              <Text className={styles.description}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default PreparationPage;
