import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { CommonReaction } from '@/types';
import classNames from 'classnames';

interface ReactionCardProps {
  reaction: CommonReaction;
  onClick?: () => void;
}

const ReactionCard: React.FC<ReactionCardProps> = ({ reaction, onClick }) => {
  const severityConfig = {
    normal: { label: '正常反应', color: '#52C41A', bg: '#F6FFED' },
    mild: { label: '轻微反应', color: '#FAAD14', bg: '#FFFBE6' },
    concerning: { label: '需关注', color: '#FF6B81', bg: '#FFF1F0' }
  };

  const config = severityConfig[reaction.severity];

  return (
    <View
      className={classNames(styles.reactionCard, { [styles.clickable]: onClick })}
      onClick={onClick}
    >
      <View className={styles.header}>
        <Text className={styles.name}>{reaction.name}</Text>
        <View className={styles.severity} style={{ background: config.bg }}>
          <Text className={styles.severityText} style={{ color: config.color }}>
            {config.label}
          </Text>
        </View>
      </View>

      <Text className={styles.description}>{reaction.description}</Text>

      <View className={styles.meta}>
        <View className={styles.metaItem}>
          <Text className={styles.metaLabel}>持续时间</Text>
          <Text className={styles.metaValue}>{reaction.duration}</Text>
        </View>
      </View>

      <View className={styles.tipsBox}>
        <Text className={styles.tipsLabel}>💡 护理建议</Text>
        <Text className={styles.tipsText}>{reaction.tips}</Text>
      </View>
    </View>
  );
};

export default ReactionCard;
