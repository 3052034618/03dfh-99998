import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Input, Button, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';
import classNames from 'classnames';

const ConsultDetailPage: React.FC = () => {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { consultSessions } = state;

  const [inputText, setInputText] = useState('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sessionId = router.params.id || consultSessions[0]?.id;
  const session = consultSessions.find(s => s.id === sessionId) || consultSessions[0];
  const messages = session?.messages || [];

  useEffect(() => {
    if (session) {
      Taro.setNavigationBarTitle({ title: session.advisorName });
    }
  }, [session]);

  const handleSend = () => {
    if (!inputText.trim() && pendingImages.length === 0) return;

    const newMessage = {
      id: `m_${Date.now()}`,
      sender: 'user' as const,
      content: inputText,
      images: pendingImages.length > 0 ? [...pendingImages] : undefined,
      timestamp: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    };

    dispatch({
      type: 'ADD_CONSULT_MESSAGE',
      payload: { sessionId: session!.id, message: newMessage }
    });

    setInputText('');
    setPendingImages([]);

    setTimeout(() => {
      const replyMessage = {
        id: `m_${Date.now()}_reply`,
        sender: 'advisor' as const,
        content: '收到您的问题，我这边帮您看一下~请稍等片刻哦 😊',
        timestamp: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      };
      dispatch({
        type: 'ADD_CONSULT_MESSAGE',
        payload: { sessionId: session!.id, message: replyMessage }
      });
    }, 1500);
  };

  const handleImage = () => {
    const remainCount = 3 - pendingImages.length;
    if (remainCount <= 0) {
      Taro.showToast({
        title: '最多只能发送3张图片',
        icon: 'none'
      });
      return;
    }

    Taro.chooseImage({
      count: remainCount,
      success: res => {
        console.log('[ConsultDetail] 选择图片:', res.tempFilePaths);
        setPendingImages(prev => [...prev, ...res.tempFilePaths]);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  return (
    <View className={styles.page}>
      <ScrollView className={styles.chatArea} scrollY scrollWithAnimation>
        {messages.map(msg => (
          <View
            key={msg.id}
            className={classNames(styles.messageItem, msg.sender === 'user' && styles.user)}
          >
            <View
              className={classNames(
                styles.avatar,
                msg.sender === 'user' ? styles.avatarUser : styles.avatarAdvisor
              )}
            >
              {msg.sender === 'user' ? '我' : (session?.advisorName.charAt(0) || '顾')}
            </View>
            <View className={styles.messageContent}>
              <Text className={styles.messageTime}>
                {formatTime(msg.timestamp)}
              </Text>
              <View
                className={classNames(
                  styles.bubble,
                  msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAdvisor
                )}
              >
                <Text>{msg.content}</Text>
              </View>
              {msg.images && msg.images.length > 0 && (
                <View className={styles.images}>
                  {msg.images.map((img, idx) => (
                    <Image key={idx} className={styles.msgImage} src={img} mode="aspectFill" />
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className={styles.inputArea}>
        {pendingImages.length > 0 && (
          <View className={styles.pendingImages}>
            {pendingImages.map((img, idx) => (
              <View key={idx} className={styles.pendingImgWrap}>
                <Image className={styles.pendingImg} src={img} mode="aspectFill" />
                <View className={styles.removeImgBtn} onClick={() => handleRemoveImage(idx)}>
                  ×
                </View>
              </View>
            ))}
          </View>
        )}
        <View className={styles.inputRow}>
          <View className={styles.iconBtn} onClick={handleImage}>
            📷
          </View>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="请输入您的问题..."
              placeholderClass="input-placeholder"
              value={inputText}
              onInput={e => setInputText(e.detail.value)}
              onConfirm={handleSend}
              confirmType="send"
            />
          </View>
          <Button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!inputText.trim() && pendingImages.length === 0}
          >
            ➤
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ConsultDetailPage;
