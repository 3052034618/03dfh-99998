import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { AppProvider } from './store/CourseContext';
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('[App] 应用初始化');
  }, []);

  useDidShow(() => {
    console.log('[App] 页面显示');
  });

  useDidHide(() => {
    console.log('[App] 页面隐藏');
  });

  return (
    <AppProvider>
      {props.children}
    </AppProvider>
  );
}

export default App;
