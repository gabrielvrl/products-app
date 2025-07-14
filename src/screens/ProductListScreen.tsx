import React, { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Fonts } from 'styles/Font';
import { CommonStyles } from 'styles/CommonStyles';
import * as Colors from 'styles/Colors';
import * as Common from 'styles/Common';
import { fetchProducts } from '../api/productsApi';
import { fetchCategories } from '../api/categoriesApi';
import {
  mapProductsToListItems,
  ProductListItem,
} from '../mappers/productMapper';
import { FilterModal } from 'components/FilterModal';

const PAGE_SIZE = 20;

const ProductListScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', selectedCategory],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        pageParam,
        limit: PAGE_SIZE,
        category: selectedCategory || undefined,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap(page => page.products || []).length;
      return loaded < (lastPage.total || 0) ? loaded : undefined;
    },
    initialPageParam: 0,
  });

  const handleCloseFilterModal = () => setModalVisible(false);
  const handleClearFilter = () => {
    setPendingCategory(null);
  };
  const handleSelectCategory = (category: string) => {
    setPendingCategory(prev => (prev === category ? null : category));
  };
  const handleSearch = () => {
    setSelectedCategory(pendingCategory);
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
      <View style={styles.headerRow}>
        <Text style={[Fonts.titleScreen, styles.titleScreen]}>Products</Text>
        <TouchableOpacity
          onPress={() => {
            setPendingCategory(selectedCategory);
            setModalVisible(true);
          }}
          style={styles.filterButton}
        >
          <Text style={[Fonts.contentBaseBold, { color: Colors.white }]}>
            Filter
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [selectedCategory],
  );

  if (isError || isErrorCategories) {
    return (
      <SafeAreaView style={CommonStyles.safeAreaContainer}>
        {Header()}
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

      <FilterModal
        primaryColor={Colors.primaryColor}
        filterModalVisible={modalVisible}
        categories={
          Array.isArray(categories) ? categories.map(c => c.name) : []
        }
        selectedCategory={pendingCategory}
        handleCloseFilterModal={handleCloseFilterModal}
        onFilterClear={handleClearFilter}
        onSelectCategory={handleSelectCategory}
        onButtonOnePress={handleSearch}
      />

      {isLoading || isLoadingCategories ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.item,
                {
                  backgroundColor: Colors.almostWhite,
                  borderRadius: Common.radiusBase,
                },
              ]}
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
            </View>
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
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    ...Common.dropShadow,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: Colors.lightGray,
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
});

export default ProductListScreen;
