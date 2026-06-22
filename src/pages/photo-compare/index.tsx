import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';
import classNames from 'classnames';

const angles = [
  { key: 'front', label: '正面' },
  { key: 'left', label: '左侧' },
  { key: 'right', label: '右侧' }
];

const PhotoComparePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { photos } = state;
  const [currentAngle, setCurrentAngle] = useState('front');

  const anglePhotos = useMemo(() => {
    return photos
      .filter(p => p.angle === currentAngle)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [photos, currentAngle]);

  const beforePhoto = anglePhotos[0];
  const afterPhoto = anglePhotos[anglePhotos.length - 1];

  const handleUpload = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log('[PhotoCompare] 选择照片:', res.tempFilePaths);

        const newPhoto = {
          id: `p_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          angle: currentAngle as 'front' | 'left' | 'right',
          url: res.tempFilePaths[0],
          treatmentIndex: 3
        };

        dispatch({ type: 'ADD_PHOTO', payload: newPhoto });

        Taro.showToast({
          title: '上传成功',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('[PhotoCompare] 选择照片失败:', err);
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.angleTabs}>
        {angles.map(angle => (
          <View
            key={angle.key}
            className={classNames(styles.tab, currentAngle === angle.key && styles.active)}
            onClick={() => setCurrentAngle(angle.key)}
          >
            {angle.label}
          </View>
        ))}
      </View>

      <View className={styles.compareSection}>
        <Text className={styles.sectionTitle}>前后对比</Text>
        <View className={styles.compareCard}>
          <View className={styles.compareHeader}>
            <View className={styles.photoInfo}>
              <Text className={styles.label}>治疗前</Text>
              <Text className={styles.date}>{beforePhoto?.date || '暂无'}</Text>
            </View>
            <View className={styles.vs}>VS</View>
            <View className={styles.photoInfo}>
              <Text className={styles.label}>最近</Text>
              <Text className={styles.date}>{afterPhoto?.date || '暂无'}</Text>
            </View>
          </View>
          <View className={styles.photos}>
            <View className={styles.photoItem}>
              {beforePhoto ? (
                <Image className={styles.photo} src={beforePhoto.url} mode="aspectFill" />
              ) : (
                <View className={styles.addPhoto}>
                  <Text className={styles.icon}>📷</Text>
                  <Text className={styles.text}>暂无照片</Text>
                </View>
              )}
            </View>
            <View className={styles.photoItem}>
              {afterPhoto && afterPhoto.id !== beforePhoto?.id ? (
                <Image className={styles.photo} src={afterPhoto.url} mode="aspectFill" />
              ) : (
                <View className={styles.addPhoto} onClick={handleUpload}>
                  <Text className={styles.icon}>+</Text>
                  <Text className={styles.text}>添加照片</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.historySection}>
        <Text className={styles.sectionTitle}>历史照片</Text>
        <View className={styles.photoGrid}>
          {anglePhotos.map(photo => (
            <View key={photo.id} className={styles.gridItem}>
              <Image className={styles.photo} src={photo.url} mode="aspectFill" />
              <View className={styles.dateTag}>第{photo.treatmentIndex}次</View>
            </View>
          ))}
          {anglePhotos.length === 0 && (
            <Text style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#A9A5B5', padding: '48rpx 0' }}>
              暂无这个角度的照片
            </Text>
          )}
        </View>
      </View>

      <Button className={styles.uploadBtn} onClick={handleUpload}>
        📷 上传新照片
      </Button>

      <View className={styles.tipsCard}>
        <Text className={styles.tipsTitle}>📸 拍照小贴士</Text>
        <View className={styles.tipsList}>
          <Text className={styles.tipItem}>在自然光线下拍摄，避免直射阳光</Text>
          <Text className={styles.tipItem}>保持同一角度和距离，便于对比</Text>
          <Text className={styles.tipItem}>素颜拍摄，不要化妆和美颜</Text>
          <Text className={styles.tipItem}>建议每次治疗后第7天拍摄</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PhotoComparePage;
