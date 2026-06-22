export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/calendar/index',
    'pages/recovery/index',
    'pages/consult/index',
    'pages/mine/index',
    'pages/bind/index',
    'pages/preparation/index',
    'pages/checkin/index',
    'pages/photo-compare/index',
    'pages/consult-detail/index',
    'pages/shop/index',
    'pages/report/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FAF7FF',
    navigationBarTitleText: '光子嫩肤陪伴',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FAF7FF'
  },
  tabBar: {
    color: '#A9A5B5',
    selectedColor: '#B79ED8',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/calendar/index',
        text: '日历'
      },
      {
        pagePath: 'pages/recovery/index',
        text: '恢复'
      },
      {
        pagePath: 'pages/consult/index',
        text: '咨询'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
