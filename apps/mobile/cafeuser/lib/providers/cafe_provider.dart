import 'package:flutter/foundation.dart';
import 'package:cafeuser/models/cafe.dart';
import 'package:cafeuser/models/food_item.dart';
import 'package:cafeuser/models/food_category.dart';
import 'package:cafeuser/services/api_dio_client.dart';

class CafeProvider with ChangeNotifier {
  Cafe? _currentCafe;
  List<FoodItem> _foodItems = [];
  List<FoodCategory> _categories = [];
  bool _isLoading = false;
  String? _errorMessage;

  final ApiDioClient _apiClient = ApiDioClient();

  // Getters
  Cafe? get currentCafe => _currentCafe;
  List<FoodItem> get foodItems => _foodItems;
  List<FoodCategory> get categories => _categories;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Clear error message
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  // Load cafe data
  Future<bool> loadCafeData(String cafeId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.getCafe(cafeId);

      // Backend returns the cafe object directly
      if (response is Map<String, dynamic>) {
        _currentCafe = Cafe.fromJson(response);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Invalid response format';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Update cafe information
  Future<bool> updateCafe(String cafeId, Map<String, dynamic> cafeData) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.updateCafe(cafeId, cafeData);

      // Backend returns { message: 'Cafe updated successfully', cafe: updatedCafe }
      if (response['cafe'] != null) {
        _currentCafe = Cafe.fromJson(response['cafe']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Failed to update cafe';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Load categories
  Future<bool> loadCategories(String cafeId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.getCafeCategories(cafeId);

      // Backend returns an array directly, API client now returns List<dynamic>
      final List<FoodCategory> categories = [];
      for (var json in response) {
        categories.add(FoodCategory.fromJson(json as Map<String, dynamic>));
      }
      _categories = categories;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Create category
  Future<bool> createCategory(
    String cafeId,
    Map<String, dynamic> categoryData,
  ) async {
    print('DEBUG: CafeProvider.createCategory called with cafeId: $cafeId');
    print('DEBUG: CafeProvider.createCategory called with data: $categoryData');

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.createCategory(cafeId, categoryData);

      // Backend returns the category object directly
      if (response is Map<String, dynamic>) {
        final newCategory = FoodCategory.fromJson(response);
        _categories.add(newCategory);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Failed to create category';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      print('DEBUG: Error in createCategory: $e');
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Update category
  Future<bool> updateCategory(
    String cafeId,
    String categoryId,
    Map<String, dynamic> categoryData,
  ) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.updateCategory(
        cafeId,
        categoryId,
        categoryData,
      );

      // Backend returns { message: 'Category updated successfully', category: updatedCategory }
      if (response['category'] != null) {
        final updatedCategory = FoodCategory.fromJson(response['category']);
        final index = _categories.indexWhere((cat) => cat.id == categoryId);
        if (index != -1) {
          _categories[index] = updatedCategory;
        }
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['error'] ?? 'Failed to update category';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Delete category
  Future<bool> deleteCategory(String cafeId, String categoryId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.deleteCategory(cafeId, categoryId);

      // Backend returns { message: 'Category deleted successfully' }
      if (response['message'] != null) {
        _categories.removeWhere((cat) => cat.id == categoryId);
        // Also remove all food items in this category
        _foodItems.removeWhere((item) => item.category == categoryId);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['error'] ?? 'Failed to delete category';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Load food items
  Future<bool> loadFoodItems(String cafeId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.getFoodItems(cafeId);

      // Backend returns an array directly, API client now returns List<dynamic>
      final List<FoodItem> items = [];
      for (var json in response) {
        items.add(FoodItem.fromJson(json as Map<String, dynamic>));
      }
      _foodItems = items;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Create food item
  Future<bool> createFoodItem(
    String cafeId,
    String categoryId,
    Map<String, dynamic> itemData,
  ) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.createFoodItem(
        cafeId,
        categoryId,
        itemData,
      );

      // Backend returns the item object directly
      if (response is Map<String, dynamic>) {
        final newItem = FoodItem.fromJson(response);
        _foodItems.add(newItem);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Failed to create food item';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Update food item
  Future<bool> updateFoodItem(
    String cafeId,
    String itemId,
    Map<String, dynamic> itemData,
  ) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.updateFoodItem(
        cafeId,
        itemId,
        itemData,
      );

      // Backend returns the item object directly
      if (response is Map<String, dynamic>) {
        final updatedItem = FoodItem.fromJson(response);
        final index = _foodItems.indexWhere((item) => item.id == itemId);
        if (index != -1) {
          _foodItems[index] = updatedItem;
        }
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Failed to update food item';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Delete food item
  Future<bool> deleteFoodItem(String cafeId, String itemId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.deleteFoodItem(cafeId, itemId);

      // Backend returns { message: 'Food item deleted successfully' }
      if (response['message'] != null) {
        _foodItems.removeWhere((item) => item.id == itemId);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['error'] ?? 'Failed to delete food item';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Get food items by category
  List<FoodItem> getFoodItemsByCategory(String categoryId) {
    return _foodItems.where((item) => item.category == categoryId).toList();
  }

  // Get active food items
  List<FoodItem> get activeFoodItems {
    return _foodItems.where((item) => item.status == 'active').toList();
  }

  // Get active categories
  List<FoodCategory> get activeCategories {
    return _categories.where((cat) => cat.status == 'active').toList();
  }

  // Search food items
  List<FoodItem> searchFoodItems(String query) {
    if (query.isEmpty) return _foodItems;

    return _foodItems.where((item) {
      return item.name.toLowerCase().contains(query.toLowerCase()) ||
          item.description.toLowerCase().contains(query.toLowerCase());
    }).toList();
  }

  // Filter food items by category
  List<FoodItem> filterFoodItemsByCategory(String? categoryId) {
    if (categoryId == null || categoryId.isEmpty) return _foodItems;
    return _foodItems.where((item) => item.category == categoryId).toList();
  }

  // Get category by id
  FoodCategory? getCategoryById(String categoryId) {
    try {
      return _categories.firstWhere((cat) => cat.id == categoryId);
    } catch (e) {
      return null;
    }
  }

  // Get food item by id
  FoodItem? getFoodItemById(String itemId) {
    try {
      return _foodItems.firstWhere((item) => item.id == itemId);
    } catch (e) {
      return null;
    }
  }

  // Clear all data
  void clearData() {
    _currentCafe = null;
    _foodItems.clear();
    _categories.clear();
    _errorMessage = null;
    notifyListeners();
  }
}
