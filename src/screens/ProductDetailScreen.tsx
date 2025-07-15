import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Fonts } from 'styles/Font';
import * as Colors from 'styles/Colors';
import { CommonStyles } from 'styles/CommonStyles';
import { fetchProductDetail } from '../api/productDetailApi';
import { IconButton } from 'components';

interface ProductDetailParams {
  productId: number;
}

const ProductDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route =
    useRoute<RouteProp<{ params: ProductDetailParams }, 'params'>>();
  const navigation = useNavigation();
  const { productId } = route.params;
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['productDetail', productId],
    queryFn: () => fetchProductDetail(productId),
  });

  const paddingTop = useMemo(() => {
    if (Platform.OS === 'android') {
      return insets.top + 16;
    }
    return 16;
  }, [insets.top]);

  if (isLoading) {
    return (
      <View style={[CommonStyles.safeAreaContainer, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isError || !product) {
    return (
      <View style={[CommonStyles.safeAreaContainer, styles.centered]}>
        <Text style={styles.error}>Failed to load product details.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={CommonStyles.safeAreaContainer}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop }]}>
        <View style={styles.card}>
          <View style={styles.backButtonContainer}>
            <IconButton
              testID="back-button"
              customIconStyle={styles.backIconImage}
              source={require('../assets/icons/backButton.png')}
              onPress={() => navigation.goBack()}
            />
          </View>
          <Image source={{ uri: product.thumbnail }} style={styles.image} />
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.stock}>{product.stock} in stock</Text>
          </View>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>★</Text>
            <Text style={styles.ratingValue}>{product.rating}</Text>
          </View>
          <Text style={styles.description}>{product.description}</Text>
          {product.tags && product.tags.length > 0 && (
            <Text style={styles.tags}>
              {product.tags.map(tag => `#${tag}`).join(' ')}
            </Text>
          )}
          <View style={styles.divider} />
          {product.warrantyInformation && (
            <Text style={styles.info}>{product.warrantyInformation}</Text>
          )}
          {product.shippingInformation && (
            <Text style={styles.info}>{product.shippingInformation}</Text>
          )}
          {product.returnPolicy && (
            <Text style={styles.info}>{product.returnPolicy}</Text>
          )}
          {product.minimumOrderQuantity && (
            <Text style={styles.info}>
              Min. Order: {product.minimumOrderQuantity}
            </Text>
          )}
        </View>
        {product.reviews && product.reviews.length > 0 && (
          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            {product.reviews.map((review, idx) => (
              <View key={idx} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewRating}>★ {review.rating}</Text>
                  <Text style={styles.reviewMeta}>
                    {review.reviewerName} ·{' '}
                    {new Date(review.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginLeft: 4,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 24,
    backgroundColor: Colors.almostWhite,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    ...Fonts.titleScreen,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    marginBottom: 4,
  },
  brand: {
    ...Fonts.contentBase,
    color: Colors.gray,
  },
  stock: {
    ...Fonts.contentBaseBold,
    color: Colors.primaryColor,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  ratingLabel: {
    color: Colors.primaryColor,
    fontSize: 18,
    marginRight: 4,
  },
  ratingValue: {
    ...Fonts.contentBaseBold,
    color: Colors.primaryColor,
    fontSize: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 12,
  },
  tags: {
    ...Fonts.contentBase,
    marginTop: 8,
    color: Colors.primaryColor,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  info: {
    ...Fonts.contentBase,
    marginTop: 4,
    color: Colors.gray,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: Colors.feedbackCritical,
    fontSize: 16,
  },
  // ...
  // ...
  reviewsSection: {
    width: '100%',
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 14,
    marginBottom: 24,
  },
  reviewsTitle: {
    ...Fonts.titleBody,
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.primaryColor,
  },
  reviewItem: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  reviewRating: {
    ...Fonts.contentBaseBold,
    color: Colors.primaryColor,
    fontSize: 15,
  },
  reviewComment: {
    ...Fonts.contentBase,
    marginTop: 2,
    color: Colors.gray,
  },
  reviewMeta: {
    ...Fonts.contentSmall,
    color: Colors.gray,
    marginLeft: 8,
  },
  backIconImage: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: Colors.lightGray,
  },
  price: {
    ...Fonts.titleBody,
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  rating: {
    ...Fonts.contentBase,
    marginBottom: 12,
  },
  description: {
    ...Fonts.contentBase,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProductDetailScreen;
