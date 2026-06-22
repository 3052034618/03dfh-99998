import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useApp } from '@/store/CourseContext';
import classNames from 'classnames';

const categories = [
  { key: 'all', label: '全部' },
  { key: 'repair', label: '修复' },
  { key: 'sunscreen', label: '防晒' },
  { key: 'moisturize', label: '保湿' }
];

const allowedCategories = ['repair', 'sunscreen', 'moisturize'];

const categoryIcons: Record<string, string> = {
  repair: '🧴',
  sunscreen: '☀️',
  moisturize: '💧'
};

const ShopPage: React.FC = () => {
  const { state } = useApp();
  const { products } = state;
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return products.filter(p => p.isRecommended && allowedCategories.includes(p.category));
    }
    return products.filter(p => p.category === activeCategory && p.isRecommended);
  }, [products, activeCategory]);

  const handleBuy = (productName: string) => {
    Taro.showToast({
      title: `已添加${productName}`,
      icon: 'success'
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.doctorTip}>
        <Text className={styles.icon}>👨‍⚕️</Text>
        <View className={styles.content}>
          <Text className={styles.title}>医生推荐清单</Text>
          <Text className={styles.desc}>
            以下是根据您的皮肤状况和疗程进度，由您的主治医生特别推荐的护理产品，
            请按建议使用，帮助皮肤更好地恢复~
          </Text>
        </View>
      </View>

      <ScrollView scrollX className={styles.categoryTabs} style={{ whiteSpace: 'nowrap' }}>
        {categories.map(cat => (
          <View
            key={cat.key}
            className={classNames(styles.tab, activeCategory === cat.key && styles.active)}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </View>
        ))}
      </ScrollView>

      <View className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <View key={product.id} className={styles.productItem}>
              <View className={styles.productImage}>
                {categoryIcons[product.category] || '🧴'}
              </View>
              <View className={styles.productInfo}>
                <View className={styles.top}>
                  <View>
                    <Text className={styles.name}>{product.name}</Text>
                    {product.isRecommended && (
                      <View className={styles.recommendedTag}>
                        ✓ 医生推荐
                      </View>
                    )}
                  </View>
                  <Text className={styles.desc}>{product.description}</Text>
                </View>
                <View className={styles.bottom}>
                  <View className={styles.price}>
                    <Text className={styles.symbol}>¥</Text>
                    {product.price}
                  </View>
                  <Button
                    className={styles.buyBtn}
                    onClick={() => handleBuy(product.name)}
                  >
                    购买
                  </Button>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.icon}>📦</Text>
            <Text className={styles.text}>暂无该分类的推荐产品</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ShopPage;
