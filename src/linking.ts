const linking = {
  prefixes: ['products-app://', 'https://products-app.com'],
  config: {
    screens: {
      ProductDetail: {
        path: 'product/:productId',
        parse: { productId: Number },
      },
      ProductList: {
        path: 'category/:categoryName',
        parse: { categoryName: String },
      },
    },
  },
};

export default linking;
