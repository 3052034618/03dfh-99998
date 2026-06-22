import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';

const MinePage: React.FC = () => {
  const { state } = useApp();
  const { user, course, checkins, photos } = state;

  const handleNavigate = (path: string) => {
    Taro.navigateTo({ url: path });
  };

  const menuGroups = [
    {
      items: [
        { icon: '🛍️', iconClass: styles.iconShop, text: '护理商城', path: '/pages/shop/index' },
        { icon: '📊', iconClass: styles.iconReport, text: '变化报告', path: '/pages/report/index' }
      ]
    },
    {
      items: [
        { icon: '🏥', iconClass: styles.iconInstitution, text: '机构信息', path: '' },
        { icon: '📋', iconClass: styles.iconCode, text: '疗程码', path: '/pages/bind/index' }
      ]
    },
    {
      items: [
        { icon: '⚙️', iconClass: styles.iconSetting, text: '设置', path: '' }
      ]
    }
  ];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>
              {user?.nickname?.charAt(0) || '用'}
            </Text>
          </View>
          <View className={styles.info}>
            <Text className={styles.nickname}>{user?.nickname || '用户'}</Text>
            <Text className={styles.phone}>{user?.phone || ''}</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.courseCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.title}>{course?.name || '暂无疗程'}</Text>
            <View className={styles.status}>
              {course?.status === 'active' ? '进行中' : '已完成'}
            </View>
          </View>
          <View className={styles.stats}>
            <View className={styles.statItem}>
              <Text className={styles.num}>{course?.completedTimes || 0}</Text>
              <Text className={styles.label}>已治疗</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.num}>{checkins.length}</Text>
              <Text className={styles.label}>打卡次数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.num}>{photos.length}</Text>
              <Text className={styles.label}>照片数</Text>
            </View>
          </View>
        </View>

        {menuGroups.map((group, gIndex) => (
          <View key={gIndex} className={styles.menuGroup}>
            {group.items.map((item, iIndex) => (
              <View
                key={iIndex}
                className={styles.menuItem}
                onClick={() => item.path && handleNavigate(item.path)}
              >
                <View className={`${styles.icon} ${item.iconClass}`}>
                  {item.icon}
                </View>
                <Text className={styles.text}>{item.text}</Text>
                <Text className={styles.arrow}>›</Text>
              </View>
            ))}
          </View>
        ))}

        <View className={styles.safeTip}>
          <Text className={styles.tipText}>您的隐私数据将被严格保护 🔒</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
