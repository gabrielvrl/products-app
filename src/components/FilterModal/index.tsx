import React from 'react';

import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';

import Modal from 'components/Modal';
import { Colors, Fonts } from 'styles';

interface IFilterModal {
  primaryColor: string;
  filterModalVisible: boolean;
  categories: string[];
  selectedCategory: string | null;
  handleCloseFilterModal: () => void;
  onFilterClear: () => void;
  onSelectCategory: (category: string) => void;
  onButtonOnePress: () => void;
}

const FilterModal: React.FC<IFilterModal> = ({
  primaryColor,
  filterModalVisible,
  categories,
  selectedCategory,
  handleCloseFilterModal,
  onFilterClear,
  onSelectCategory,
  onButtonOnePress,
}) => {
  const { lineStyle, headerContainerStyle, modalContent, scrollArea } =
    filterModalStyle;

  const clearTextStyle = {
    ...Fonts.contentBaseBold,
    color: Colors.primaryColor,
  };

  const renderCategorySelection = () => {
    const { options, button, buttonText, buttonTextSelected, buttonSelected } =
      filterStyle;

    return (
      <ScrollView
        style={scrollArea}
        contentContainerStyle={options}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        {categories.map(category => {
          const isSelected = selectedCategory === category;
          const buttonStyle = isSelected
            ? {
                ...buttonSelected,
                backgroundColor: primaryColor,
              }
            : button;
          const textStyle = isSelected
            ? [Fonts.contentBase, buttonTextSelected]
            : [Fonts.contentBase, buttonText];

          return (
            <Pressable
              key={category}
              onPress={() => onSelectCategory(category)}
              style={buttonStyle}
            >
              <Text style={textStyle}>{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };
  // ...existing code...
  // Remove duplicate/erroneous return and closing bracket here

  return (
    <Modal
      variant="bottom"
      buttonOneText="Search"
      onButtonOnePress={onButtonOnePress}
      isVisible={filterModalVisible}
      animationTiming={300}
      onBackdropPress={handleCloseFilterModal}
    >
      <SafeAreaView style={modalContent}>
        <View style={headerContainerStyle}>
          <Text style={Fonts.titleBody}>Filter by category</Text>
          <Text style={clearTextStyle} onPress={onFilterClear}>
            Clear Filters
          </Text>
        </View>
        <View style={lineStyle} />
        {renderCategorySelection()}
      </SafeAreaView>
    </Modal>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const filterModalStyle = StyleSheet.create({
  modalContent: {
    maxHeight: SCREEN_HEIGHT * 0.7,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 16,
  },
  scrollArea: {
    flexGrow: 0,
    maxHeight: SCREEN_HEIGHT * 0.45,
    marginBottom: 8,
  },
  headerContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 12,
  },
  lineStyle: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 8,
  },
});

const filterStyle = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  optionsScroll: {
    marginTop: 8,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
    paddingBottom: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.almostWhite,
    marginBottom: 4,
  },
  buttonSelected: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    marginBottom: 4,
  },
  buttonText: {
    color: Colors.gray,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonTextSelected: {
    color: Colors.almostWhite,
    fontSize: 14,
    textAlign: 'center',
  },
});

export { FilterModal };
