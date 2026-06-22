import React, { useMemo } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';
import { mockReport } from '@/data/mockData';

const ReportPage: React.FC = () => {
  const { state } = useApp();
  const { course, photos } = state;

  const beforePhotos = useMemo(() => {
    return photos.filter(p => p.treatmentIndex === 1);
  }, [photos]);

  const afterPhotos = useMemo(() => {
    const maxIndex = Math.max(...photos.map(p => p.treatmentIndex), 1);
    return photos.filter(p => p.treatmentIndex === maxIndex && maxIndex > 1);
  }, [photos]);

  const handleShare = () => {
    Taro.showToast({
      title: '报告已保存',
      icon: 'success'
    });
  };

  const getScoreDesc = (score: number) => {
    if (score >= 90) return '效果非常显著';
    if (score >= 80) return '效果良好';
    if (score >= 70) return '有一定改善';
    return '效果初显，坚持治疗';
  };

  const overallScore = mockReport.overallScore;

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.reportHeader}>
        <Text className={styles.title}>疗程变化报告</Text>
        <Text className={styles.subtitle}>
          {mockReport.startDate} ~ {mockReport.endDate}
        </Text>
      </View>

      <View className={styles.scoreCard}>
        <Text className={styles.scoreLabel}>综合改善度</Text>
        <View className={styles.score}>
          {overallScore}
          <Text className={styles.fullScore}>/100</Text>
        </View>
        <Text className={styles.scoreDesc}>{getScoreDesc(overallScore)}</Text>
      </View>

      <View className={styles.photoSection}>
        <Text className={styles.sectionTitle}>前后对比</Text>
        <View className={styles.compareCard}>
          <View className={styles.compareHeader}>
            <Text className={styles.photoLabel}>治疗前</Text>
            <Text className={styles.photoLabel}>最近</Text>
          </View>
          <View className={styles.photos}>
            <View className={styles.photoItem}>
              {beforePhotos[0] ? (
                <Image
                  className={styles.photo}
                  src={beforePhotos[0].url}
                  mode="aspectFill"
                />
              ) : (
                <Text style={{ fontSize: '48rpx', textAlign: 'center', paddingTop: '48rpx' }}>📷</Text>
              )}
            </View>
            <View className={styles.photoItem}>
              {afterPhotos[0] ? (
                <Image
                  className={styles.photo}
                  src={afterPhotos[0].url}
                  mode="aspectFill"
                />
              ) : (
                <Text style={{ fontSize: '48rpx', textAlign: 'center', paddingTop: '48rpx' }}>⏳</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.improvementSection}>
        <Text className={styles.sectionTitle}>改善项</Text>
        <View className={styles.improvementList}>
          {mockReport.improvements.map((item, index) => (
            <View key={index} className={styles.improvementItem}>
              <View className={styles.icon}>✓</View>
              <Text className={styles.text}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.suggestionSection}>
        <Text className={styles.sectionTitle}>医生建议</Text>
        <View className={styles.suggestionCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.icon}>💡</Text>
            <Text className={styles.title}>后续护理建议</Text>
          </View>
          <View className={styles.suggestionList}>
            {mockReport.suggestions.map((item, index) => (
              <View key={index} className={styles.suggestionItem}>
                <View className={styles.dot}></View>
                <Text className={styles.text}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipText}>
          💖 皮肤改善是一个循序渐进的过程
          {'\n'}
          坚持疗程，注意护理，一定会越来越好的！
        </Text>
      </View>

      <Button className={styles.shareBtn} onClick={handleShare}>
        📤 保存报告
      </Button>
    </ScrollView>
  );
};

export default ReportPage;
