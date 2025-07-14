import 'package:flutter/foundation.dart';
import 'package:cafeuser/models/auth_user.dart';
import 'package:cafeuser/services/auth_service.dart';
import 'package:cafeuser/shared/secure_stroage.dart';

class AuthProvider with ChangeNotifier {
  AuthUser? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;
  bool _isAuthenticated = false;

  final AuthService _authService = AuthService();

  // Getters
  AuthUser? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _isAuthenticated;

  // Clear error message
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  // Sign in method
  Future<bool> signIn(String username, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await _authService.login(username, password);

      if (result['success'] == true) {
        // Create user object from response if available
        if (result['user'] != null) {
          _currentUser = AuthUser.fromJson(result['user']);
        } else {
          // User data not available yet, will be fetched later
          _currentUser = null;
        }
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = result['message'] ?? 'Login failed';
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

  // Sign out method
  Future<void> signOut() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authService.logout();
      _currentUser = null;
      _isAuthenticated = false;
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Check authentication status
  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();

    try {
      final isAuth = await _authService.isAuthenticated();
      if (isAuth) {
        // Get current user profile
        final result = await _authService.getCurrentUser();
        if (result['success'] == true) {
          _currentUser = AuthUser.fromJson(result['user']);
          _isAuthenticated = true;
        } else {
          _isAuthenticated = false;
          _currentUser = null;
        }
      } else {
        _isAuthenticated = false;
        _currentUser = null;
      }
    } catch (e) {
      _isAuthenticated = false;
      _currentUser = null;
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Update user profile
  Future<bool> updateProfile(Map<String, dynamic> userData) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await _authService.updateProfile(userData);

      if (result['success'] == true) {
        _currentUser = AuthUser.fromJson(result['user']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = result['message'] ?? 'Failed to update profile';
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

  // Change password
  Future<bool> changePassword(
    String currentPassword,
    String newPassword,
  ) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await _authService.changePassword(
        currentPassword,
        newPassword,
      );

      if (result['success'] == true) {
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = result['message'] ?? 'Failed to change password';
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

  // Check if user has admin privileges
  bool get isAdmin => _currentUser?.isAdmin ?? false;

  // Check if user has employee privileges
  bool get isEmployee => _currentUser?.isEmployee ?? false;

  // Check if token is expired
  bool get isTokenExpired => _currentUser?.isTokenExpired ?? true;

  // Get user's cafe ID
  String? get cafeId => _currentUser?.cafeId;

  // Get user's full name
  String? get userFullName => _currentUser?.name;

  // Get user's initials for avatar
  String? get userInitials => _currentUser?.userInitials;

  // Get cafe name
  String? get cafeName => _currentUser?.cafeName;

  // Get university name
  String? get universityName => _currentUser?.universityName;

  // Get campus name
  String? get campusName => _currentUser?.campusName;

  // Clear all authentication data
  Future<void> clearAuthData() async {
    await _authService.clearAuthData();
    _currentUser = null;
    _isAuthenticated = false;
    _errorMessage = null;
    notifyListeners();
  }
}
