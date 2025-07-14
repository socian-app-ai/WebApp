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
  Future<bool> loadCafeData() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.getCafe();

      if (response['cafe'] != null) {
        _currentCafe = Cafe.fromJson(response['cafe']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Failed to load cafe data';
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
  Future<bool> updateCafe(Map<String, dynamic> cafeData) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.updateCafe(cafeData);

      if (response['success'] == true && response['cafe'] != null) {
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
      _categories =
          response.map((json) => FoodCategory.fromJson(json)).toList();
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
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.createCategory(cafeId, categoryData);

      if (response['success'] == true && response['category'] != null) {
        final newCategory = FoodCategory.fromJson(response['category']);
        _categories.add(newCategory);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Failed to create category';
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

      if (response['success'] == true && response['category'] != null) {
        final updatedCategory = FoodCategory.fromJson(response['category']);
        final index = _categories.indexWhere((cat) => cat.id == categoryId);
        if (index != -1) {
          _categories[index] = updatedCategory;
        }
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Failed to update category';
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

      if (response['success'] == true) {
        _categories.removeWhere((cat) => cat.id == categoryId);
        // Also remove all food items in this category
        _foodItems.removeWhere((item) => item.category == categoryId);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Failed to delete category';
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
      _foodItems = response.map((json) => FoodItem.fromJson(json)).toList();
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

      if (response['success'] == true && response['item'] != null) {
        final newItem = FoodItem.fromJson(response['item']);
        _foodItems.add(newItem);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Failed to create food item';
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

      if (response['success'] == true && response['item'] != null) {
        final updatedItem = FoodItem.fromJson(response['item']);
        final index = _foodItems.indexWhere((item) => item.id == itemId);
        if (index != -1) {
          _foodItems[index] = updatedItem;
        }
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Failed to update food item';
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

      if (response['success'] == true) {
        _foodItems.removeWhere((item) => item.id == itemId);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response['message'] ?? 'Failed to delete food item';
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
