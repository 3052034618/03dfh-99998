import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { CourseInfo } from '@/types';
import classNames from 'classnames';

interface CourseCardProps {
  course: CourseInfo;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const progress = (course.completedTimes / course.totalTimes) * 100;

  return (
    <View className={classNames(styles.courseCard, { [styles.clickable]: onClick })} onClick={onClick}>
      <View className={styles.header}>
        <View>
          <Text className={styles.name}>{course.name}</Text>
          <Text className={styles.institution}>{course.institution} · {course.doctor}</Text>
        </View>
        <View className={styles.status}>
          <Text className={styles.statusText}>{course.status === 'active' ? '进行中' : '已完成'}</Text>
        </View>
      </View>

      <View className={styles.progressSection}>
        <View className={styles.progressInfo}>
          <Text className={styles.progressText}>
            已完成 <Text className={styles.highlight}>{course.completedTimes}</Text> / {course.totalTimes} 次
          </Text>
          <Text className={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <View className={styles.progressBar}>
          <View className={styles.progressFill} style={{ width: `${progress}%` }}></View>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.footerItem}>
          <Text className={styles.footerLabel}>开始时间</Text>
          <Text className={styles.footerValue}>{course.startDate}</Text>
        </View>
        <View className={styles.divider}></View>
        <View className={styles.footerItem}>
          <Text className={styles.footerLabel}>预计结束</Text>
          <Text className={styles.footerValue}>{course.endDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default CourseCard;
