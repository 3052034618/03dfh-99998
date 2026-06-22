import React from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';

const faqList = [
  { id: 1, q: '治疗后泛红多久会消退？', icon: '🌸' },
  { id: 2, q: '什么时候可以化妆？', icon: '💄' },
  { id: 3, q: '可以用普通防晒霜吗？', icon: '☀️' },
  { id: 4, q: '多久做一次比较合适？', icon: '📅' },
  { id: 5, q: '术后可以运动出汗吗？', icon: '🏃' }
];

const ConsultPage: React.FC = () => {
  const { state } = useApp();
  const { consultSessions } = state;

  const handleStartConsult = () => {
    Taro.navigateTo({ url: '/pages/consult-detail/index?id=' + consultSessions[0]?.id });
  };

  const handleSessionClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/consult-detail/index?id=${id}` });
  };

  const handleFaqClick = (item: typeof faqList[0]) => {
    Taro.showToast({
      title: '常见问题解答',
      icon: 'none'
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.headerCard}>
        <Text className={styles.title}>有问题？随时问我们</Text>
        <Text className={styles.subtitle}>
          专业顾问和医生在线为您解答，有任何疑虑都可以随时沟通，我们会耐心为您解答~
        </Text>
        <Button className={styles.quickAskBtn} onClick={handleStartConsult}>
          💬 发起咨询
        </Button>
      </View>

      <Text className={styles.sectionTitle}>常见问题</Text>
      <View className={styles.faqSection}>
        <View className={styles.faqList}>
          {faqList.map(item => (
            <View
              key={item.id}
              className={styles.faqItem}
              onClick={() => handleFaqClick(item)}
            >
              <View className={styles.question}>
                <View className={styles.qIcon}>{item.icon}</View>
                <Text className={styles.qText}>{item.q}</Text>
                <Text className={styles.arrow}>›</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text className={styles.sectionTitle}>我的咨询</Text>
      <View className={styles.sessionList}>
        {consultSessions.map(session => (
          <View
            key={session.id}
            className={styles.sessionItem}
            onClick={() => handleSessionClick(session.id)}
          >
            <View className={styles.avatar}>
              <Text className={styles.avatarText}>
                {session.advisorName.charAt(0)}
              </Text>
              {session.unreadCount > 0 && (
                <View className={styles.unreadBadge}>{session.unreadCount}</View>
              )}
            </View>
            <View className={styles.content}>
              <View className={styles.nameRow}>
                <Text className={styles.name}>{session.advisorName}</Text>
                <View className={styles.rightRow}>
                  {session.pendingReply && (
                    <View className={styles.pendingBadge}>待回复</View>
                  )}
                  <Text className={styles.time}>{session.lastTime}</Text>
                </View>
              </View>
              <Text className={styles.lastMsg}>
                {session.pendingReply && session.lastMessage ? '📷 ' : ''}
                {session.lastMessage}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ConsultPage;
