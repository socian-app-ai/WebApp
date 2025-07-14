import 'package:cafeuser/services/api_dio_client.dart';
import 'package:cafeuser/services/jwt_service.dart';
import 'package:cafeuser/models/cafe_user.dart';
import 'package:cafeuser/models/auth_user.dart';
import 'package:cafeuser/shared/secure_stroage.dart';
import 'package:cafeuser/shared/constants.dart';

class AuthService {
  final ApiDioClient _apiClient = ApiDioClient();
  final JwtService _jwtService = JwtService();
  static final AuthService _instance = AuthService._internal();

  factory AuthService() {
    return _instance;
  }

  AuthService._internal();

  // Login cafe user
  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _apiClient.post(ApiConstants.login, {
        'identifier': username,
        'password': password,
      });

      // Check if we got access_token (backend returns this for app platform)
      if (response['access_token'] != null) {
        final token = response['access_token'];

        // Save access token to secure storage
        await SecureStorageService.instance.saveToken(token);

        // Extract user information from JWT token
        final userFromToken = _jwtService.getUserFromToken(token);

        if (userFromToken != null) {
          return {
            'success': true,
            'user': userFromToken.toJson(),
            'token': token,
            'message': 'Login successful',
          };
        }

        // Fallback: Try to get user profile from API if JWT extraction fails
        try {
          final userResponse = await _apiClient.getMap(ApiConstants.me);

          return {
            'success': true,
            'user': userResponse['user'] ?? userResponse,
            'token': token,
            'message': 'Login successful',
          };
        } catch (e) {
          // If getting user profile fails, still consider login successful
          // We'll fetch the profile later in checkAuthStatus
          print('Warning: Could not fetch user profile after login: $e');
          return {
            'success': true,
            'user': null,
            'token': token,
            'message': 'Login successful',
          };
        }
      } else {
        return {
          'success': false,
          'message':
              response['message'] ?? 'Login failed - no access token received',
        };
      }
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // Get current user profile
  Future<Map<String, dynamic>> getCurrentUser() async {
    try {
      // First try to get user from stored token
      final token = await SecureStorageService.instance.getToken();
      if (token != null) {
        final userFromToken = _jwtService.getUserFromToken(token);
        if (userFromToken != null && !userFromToken.isTokenExpired) {
          return {'success': true, 'user': userFromToken.toJson()};
        }
      }

      // Fallback to API call
      final response = await _apiClient.getMap(ApiConstants.me);

      if (response['success'] == true && response['user'] != null) {
        return {'success': true, 'user': response['user']};
      } else {
        return {
          'success': false,
          'message': response['message'] ?? 'Failed to get user profile',
        };
      }
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // Logout cafe user
  Future<Map<String, dynamic>> logout() async {
    try {
      // Call backend logout endpoint
      await _apiClient.post(ApiConstants.logout, {});

      // Clear token from secure storage
      await SecureStorageService.instance.deleteToken();

      return {'success': true, 'message': 'Logout successful'};
    } catch (e) {
      // Still clear token even if backend call fails
      await SecureStorageService.instance.deleteToken();
      return {'success': true, 'message': 'Logout successful'};
    }
  }

  // Check if user is authenticated
  Future<bool> isAuthenticated() async {
    try {
      final token = await SecureStorageService.instance.getToken();
      if (token == null) return false;

      // First check if token is expired using JWT service
      if (_jwtService.isTokenExpired(token)) {
        return false;
      }

      // Optionally verify with backend
      try {
        final response = await _apiClient.getMap(ApiConstants.verifyToken);
        return response['success'] == true;
      } catch (e) {
        // If backend verification fails, rely on JWT expiry check
        return !_jwtService.isTokenExpired(token);
      }
    } catch (e) {
      return false;
    }
  }

  // Update user profile
  Future<Map<String, dynamic>> updateProfile(
    Map<String, dynamic> userData,
  ) async {
    try {
      final response = await _apiClient.put(
        ApiConstants.updateProfile,
        userData,
      );

      if (response['success'] == true) {
        return {
          'success': true,
          'user': response['user'],
          'message': 'Profile updated successfully',
        };
      } else {
        return {
          'success': false,
          'message': response['message'] ?? 'Failed to update profile',
        };
      }
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // Change password
  Future<Map<String, dynamic>> changePassword(
    String currentPassword,
    String newPassword,
  ) async {
    try {
      final response = await _apiClient.post(ApiConstants.changePassword, {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      });

      if (response['success'] == true) {
        return {'success': true, 'message': 'Password changed successfully'};
      } else {
        return {
          'success': false,
          'message': response['message'] ?? 'Failed to change password',
        };
      }
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // Get user token
  Future<String?> getToken() async {
    return await SecureStorageService.instance.getToken();
  }

  // Clear all authentication data
  Future<void> clearAuthData() async {
    await SecureStorageService.instance.deleteToken();
  }
}
