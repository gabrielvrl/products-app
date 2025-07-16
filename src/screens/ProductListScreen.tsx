import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from 'contexts/Toast';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Fonts } from 'styles/Font';
import { CommonStyles } from 'styles/CommonStyles';
import * as Colors from 'styles/Colors';
import * as Common from 'styles/Common';
import { fetchProducts } from '../api/productsApi';
import { fetchCategories } from '../api/categoriesApi';
import { mapProductsToListItems } from '../mappers/productMapper';
import { FilterModal } from 'components/FilterModal';
import { ProductListItem, SortField, SortOrder } from 'types/Product';
import { normalizeCategory } from 'utils/normalizeCategory';
import { showProductNotification } from 'utils/notify';

const PAGE_SIZE = 20;

const ProductListScreen: React.FC = () => {
  const route = useRoute();
  const initialCategory = normalizeCategory(
    (route.params && (route.params as any).categoryName) || null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory,
  );
  const [currentCategory, setCurrentCategory] = useState<string | null>(
    initialCategory,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const {
    data: categories,
    isError: isErrorCategories,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const toast = useToast();
  const hasShownToastRef = useRef(false);

  useEffect(() => {
    if (isErrorCategories && !hasShownToastRef.current) {
      toast.show({
        title: 'Could not load categories',
        message: 'Filtering may be limited.',
        type: 'warning',
        position: 'bottom',
        autoDismiss: true,
      });
      hasShownToastRef.current = true;
    }
    if (!isErrorCategories) {
      hasShownToastRef.current = false;
    }
  }, [isErrorCategories, toast]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', selectedCategory, sortField, sortOrder],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        pageParam,
        limit: PAGE_SIZE,
        category: selectedCategory || null,
        sortBy: sortField || null,
        order: sortOrder || null,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap(page => page.products || []).length;
      return loaded < (lastPage.total || 0) ? loaded : null;
    },
    initialPageParam: 0,
  });

  const handleCloseFilterModal = () => setModalVisible(false);
  const handleClearFilter = () => {
    setCurrentCategory(null);
  };
  const handleSelectCategory = (category: string) => {
    setCurrentCategory(prev => (prev === category ? null : category));
  };
  const handleSearch = () => {
    setSelectedCategory(currentCategory);
    setModalVisible(false);
  };

  const products: ProductListItem[] = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page =>
      mapProductsToListItems(page.products || []),
    );
  }, [data]);

  const Header = useCallback(
    () => (
      <>
        <View style={styles.headerRow}>
          <Text style={[Fonts.titleScreen, styles.titleScreen]}>Products</Text>
          <TouchableOpacity
            onPress={() => {
              setCurrentCategory(selectedCategory);
              setModalVisible(true);
            }}
            style={[
              styles.filterButton,
              (isLoadingCategories || isErrorCategories) &&
                styles.filterButtonDisabled,
            ]}
            disabled={isLoadingCategories || isErrorCategories}
          >
            <Text style={[Fonts.contentBaseBold, styles.filterButtonText]}>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [selectedCategory, isLoadingCategories, isErrorCategories],
  );

  const SortOptions = useCallback(
    () => (
      <View style={styles.sortOptionsRow}>
        <Text style={Fonts.contentBaseBold}>Sort by:</Text>
        <ScrollView
          style={styles.sortRow}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortField === 'price' &&
                sortOrder === 'asc' &&
                styles.sortButtonActive,
            ]}
            onPress={() => {
              if (sortField === 'price' && sortOrder === 'asc') {
                setSortField(null);
                setSortOrder(null);
              } else {
                setSortField('price');
                setSortOrder('asc');
              }
            }}
          >
            <Text
              style={
                sortField === 'price' && sortOrder === 'asc'
                  ? styles.sortTextActive
                  : styles.sortText
              }
            >
              Price ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortField === 'price' &&
                sortOrder === 'desc' &&
                styles.sortButtonActive,
            ]}
            onPress={() => {
              if (sortField === 'price' && sortOrder === 'desc') {
                setSortField(null);
                setSortOrder(null);
              } else {
                setSortField('price');
                setSortOrder('desc');
              }
            }}
          >
            <Text
              style={
                sortField === 'price' && sortOrder === 'desc'
                  ? styles.sortTextActive
                  : styles.sortText
              }
            >
              Price ↓
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortField === 'rating' &&
                sortOrder === 'asc' &&
                styles.sortButtonActive,
            ]}
            onPress={() => {
              if (sortField === 'rating' && sortOrder === 'asc') {
                setSortField(null);
                setSortOrder(null);
              } else {
                setSortField('rating');
                setSortOrder('asc');
              }
            }}
          >
            <Text
              style={
                sortField === 'rating' && sortOrder === 'asc'
                  ? styles.sortTextActive
                  : styles.sortText
              }
            >
              Rating ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortField === 'rating' &&
                sortOrder === 'desc' &&
                styles.sortButtonActive,
            ]}
            onPress={() => {
              if (sortField === 'rating' && sortOrder === 'desc') {
                setSortField(null);
                setSortOrder(null);
              } else {
                setSortField('rating');
                setSortOrder('desc');
              }
            }}
          >
            <Text
              style={
                sortField === 'rating' && sortOrder === 'desc'
                  ? styles.sortTextActive
                  : styles.sortText
              }
            >
              Rating ↓
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    ),
    [sortField, sortOrder],
  );

  if (isError) {
    return (
      <SafeAreaView style={CommonStyles.safeAreaContainer}>
        {Header()}
        {SortOptions()}
        <View style={styles.centered}>
          <Text style={styles.error}>
            Oops! Something went wrong. Please try again 😵‍💫
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={CommonStyles.safeAreaContainer}>
      {Header()}
      {SortOptions()}

      <FilterModal
        primaryColor={Colors.primaryColor}
        filterModalVisible={modalVisible}
        categories={
          Array.isArray(categories) ? categories.map(c => c.name) : []
        }
        selectedCategory={currentCategory}
        handleCloseFilterModal={handleCloseFilterModal}
        onFilterClear={handleClearFilter}
        onSelectCategory={handleSelectCategory}
        onButtonOnePress={handleSearch}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                showProductNotification(item.title, item.id);
                navigation.navigate('ProductDetail', { productId: item.id });
              }}
              activeOpacity={0.8}
              style={styles.item}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
              />
              <View style={styles.info}>
                <Text style={Fonts.titleBody}>{item.title}</Text>
                <Text
                  style={[Fonts.contentBase, { color: Colors.primaryColor }]}
                >
                  ${item.price}
                </Text>
              </View>
              <Text style={styles.chevron}>{'›'}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={Fonts.contentBase}>
                Nothing to see here... 👻 Try another filter!
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator size="large" />
              </View>
            ) : null
          }
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sortOptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sortRow: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    marginLeft: 8,
  },
  sortButtonActive: {
    backgroundColor: Colors.primaryColor,
  },
  sortText: {
    color: Colors.gray,
    fontWeight: 'bold',
  },
  sortTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.almostWhite,
    borderRadius: Common.radiusBase,
    ...Common.dropShadow,
  },
  chevron: {
    fontSize: 28,
    color: Colors.gray,
    marginLeft: 8,
    alignSelf: 'center',
    fontWeight: '300',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  error: {
    color: Colors.feedbackCritical,
    fontSize: 16,
  },
  footer: {
    padding: 16,
  },
  titleScreen: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primaryColor,
    borderRadius: 16,
  },
  filterButtonDisabled: {
    opacity: 0.5,
  },
  filterButtonText: {
    color: Colors.white,
  },
});

export default ProductListScreen;
