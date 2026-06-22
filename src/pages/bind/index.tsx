import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';

const BindPage: React.FC = () => {
  const { dispatch } = useApp();
  const [code, setCode] = useState('');

  const handleBind = () => {
    if (!code.trim()) {
      Taro.showToast({
        title: '请输入疗程码',
        icon: 'none'
      });
      return;
    }

    console.log('[Bind] 绑定疗程码:', code);

    Taro.showLoading({ title: '绑定中...' });

    setTimeout(() => {
      Taro.hideLoading();
      dispatch({ type: 'BIND_COURSE', payload: { courseCode: code } });
      Taro.showToast({
        title: '绑定成功',
        icon: 'success'
      });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/home/index' });
      }, 1500);
    }, 1000);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.icon}>✨</View>
        <Text className={styles.title}>绑定您的疗程</Text>
        <Text className={styles.subtitle}>
          请输入机构给出的疗程码{'\n'}
          开启您的光子嫩肤变美之旅
        </Text>
      </View>

      <View className={styles.bindCard}>
        <Text className={styles.label}>疗程码</Text>
        <View className={styles.inputWrap}>
          <Input
            className={styles.input}
            placeholder="请输入8位疗程码"
            placeholderClass="input-placeholder"
            value={code}
            onInput={e => setCode(e.detail.value)}
            maxlength={16}
          />
        </View>
        <Button className={styles.bindBtn} onClick={handleBind}>
          立即绑定
        </Button>
      </View>

      <View className={styles.tipsCard}>
        <Text className={styles.tipsTitle}>温馨提示</Text>
        <View className={styles.tipsList}>
          <View className={styles.tipItem}>
            <View className={styles.tipDot}></View>
            <Text className={styles.tipText}>
              疗程码由您就诊的医美机构提供，可在收据或订单中查找
            </Text>
          </View>
          <View className={styles.tipItem}>
            <View className={styles.tipDot}></View>
            <Text className={styles.tipText}>
              绑定后即可查看您的疗程安排、术前准备和术后护理指南
            </Text>
          </View>
          <View className={styles.tipItem}>
            <View className={styles.tipDot}></View>
            <Text className={styles.tipText}>
              如有疑问，请联系您的顾问或机构客服
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BindPage;
