class AppConstants {
  static const String appName = 'Cafe Admin';
  static const String appVersion = '1.0.0';

  // API Constants
  // static const String baseUrl =
  //     'https://192.bilalellahi.com'; 
  static const String baseUrl = "http://10.107.248.4:8080";
  static const int connectionTimeout = 30000;
  static const int receiveTimeout = 30000;

  // Storage Keys
  static const String tokenKey = 'cafe_auth_token';
  static const String userKey = 'cafe_user_data';
  static const String deviceIdKey = 'device_id';
  static const String themeKey = 'theme_mode';

  // User Roles
  static const String adminRole = 'c_admin';
  static const String employeeRole = 'c_employee';

  // Food Item Status
  static const String activeStatus = 'active';
  static const String inactiveStatus = 'deactive';
  static const String archivedStatus = 'archived';

  // Cafe Status
  static const String cafeActiveStatus = 'active';
  static const String cafeInactiveStatus = 'deactive';
  static const String cafeArchivedStatus = 'archived';

  // Image Constants
  static const String defaultCafeImage =
      'https://via.placeholder.com/300x200?text=Cafe+Image';
  static const String defaultFoodImage =
      'https://via.placeholder.com/300x200?text=Food+Item';
  static const String defaultCategoryImage =
      'https://via.placeholder.com/300x200?text=Category';

  // Validation Constants
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 50;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 20;
  static const int minNameLength = 2;
  static const int maxNameLength = 50;
  static const int maxDescriptionLength = 500;
  static const int maxFoodItemNameLength = 100;
  static const int maxCategoryNameLength = 50;
  static const double minPrice = 0.0;
  static const double maxPrice = 10000.0;
  static const double minDiscount = 0.0;
  static const double maxDiscount = 100.0;

  // UI Constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double borderRadius = 12.0;
  static const double smallBorderRadius = 8.0;
  static const double largeBorderRadius = 20.0;

  // Animation Constants
  static const int animationDuration = 300;
  static const int longAnimationDuration = 500;
  static const int shortAnimationDuration = 200;

  // List Constants
  static const int itemsPerPage = 20;
  static const int maxCategories = 50;
  static const int maxFoodItems = 500;
  static const int maxFlavours = 10;

  // Error Messages
  static const String networkError =
      'Network error. Please check your connection.';
  static const String serverError = 'Server error. Please try again later.';
  static const String authError = 'Authentication failed. Please login again.';
  static const String validationError =
      'Please check your input and try again.';
  static const String unknownError = 'An unexpected error occurred.';

  // Success Messages
  static const String loginSuccess = 'Login successful';
  static const String logoutSuccess = 'Logout successful';
  static const String updateSuccess = 'Updated successfully';
  static const String createSuccess = 'Created successfully';
  static const String deleteSuccess = 'Deleted successfully';

  // Placeholder Text
  static const String noDataPlaceholder = 'No data available';
  static const String loadingPlaceholder = 'Loading...';
  static const String errorPlaceholder = 'Something went wrong';
  static const String emptyListPlaceholder = 'No items found';

  // Currency
  static const String currency = 'PKR';
  static const String currencySymbol = '₨';

  // Date Format
  static const String dateFormat = 'MMM dd, yyyy';
  static const String timeFormat = 'HH:mm';
  static const String dateTimeFormat = 'MMM dd, yyyy HH:mm';

  // Regex Patterns
  static const String emailPattern =
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
  static const String phonePattern = r'^[0-9]{10,15}$';
  static const String usernamePattern = r'^[a-zA-Z0-9._-]{3,20}$';
  static const String namePattern = r'^[a-zA-Z\s]{2,50}$';
  static const String pricePattern = r'^\d+(\.\d{1,2})?$';
}

class ApiConstants {
  static const String baseUrl =
      'http://192.bilalellahi.com'; // Replace with your backend URL

  // Auth endpoints
  static const String login = '/api/cafe/login';
  static const String logout = '/api/cafe/logout';
  static const String me = '/api/cafe/user/me';
  static const String updateProfile = '/api/cafe/user/profile';
  static const String changePassword = '/api/cafe/user/change-password';
  static const String verifyToken = '/api/cafe/user/verify-token';

  // Cafe endpoints
  static const String getCafe = '/api/cafe/user/:cafeId';
  static const String getAllCafes = '/api/cafe/user/all';
  static const String updateCafe = '/api/cafe/user/update/:cafeId/all';
  static const String updateCafeName = '/api/cafe/user/update/:cafeId/name';
  static const String updateCafeStatus = '/api/cafe/user/update/:cafeId/status';
  static const String updateCafeCoordinates =
      '/api/cafe/user/update/:cafeId/coordinates';
  static const String deleteCafe = '/api/cafe/user/:cafeId/delete';

  // Category endpoints
  static const String getCafeCategories = '/api/cafe/user/:cafeId/categories';
  static const String createCategory = '/api/cafe/user/:cafeId/category';
  static const String updateCategory =
      '/api/cafe/user/:cafeId/categories/:categoryId';
  static const String updateCategoryStatus =
      '/api/cafe/user/:cafeId/categories/:categoryId/status';
  static const String deleteCategoryById =
      '/api/cafe/user/:cafeId/categories/:categoryId';

  // Food item endpoints
  static const String getFoodItems = '/api/cafe/user/:cafeId/items';
  static const String createFoodItem = '/api/cafe/user/:cafeId/items';
  static const String updateFoodItem =
      '/api/cafe/user/:cafeId/items/:itemId/all';
  static const String deleteFoodItem = '/api/cafe/user/:cafeId/items/:itemId';

  // Reviews endpoints
  static const String getReviews = '/api/cafe/user/:cafeId/reviews';
  static const String getItemReviews =
      '/api/cafe/user/:cafeId/items/:itemId/reviews';
}
