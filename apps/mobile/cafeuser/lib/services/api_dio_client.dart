import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:cafeuser/shared/secure_stroage.dart';
import 'package:cafeuser/shared/constants.dart';

class ApiDioClient {
  final Dio _dio;

  String? _deviceId;

  ApiDioClient({Dio? dio})
    : _dio = dio ?? Dio(BaseOptions(baseUrl: ApiConstants.baseUrl)) {
    _initDeviceId();
  }

  Future<void> _initDeviceId() async {
    // First try to get stored device ID
    _deviceId = await SecureStorageService.instance.getDeviceId();

    // If no stored device ID, generate a new one
    if (_deviceId == null || _deviceId!.isEmpty) {
      final deviceInfo = DeviceInfoPlugin();
      if (Platform.isAndroid) {
        final androidInfo = await deviceInfo.androidInfo;
        _deviceId = androidInfo.id ?? 'unknown';
        log('androidInfo.id: ${androidInfo.id}');
        if (_deviceId != 'unknown') {
          SecureStorageService.instance.saveDeviceId(_deviceId!);
        }
      } else if (Platform.isIOS) {
        final iosInfo = await deviceInfo.iosInfo;
        _deviceId = iosInfo.identifierForVendor ?? 'unknown';
        if (_deviceId != 'unknown') {
          SecureStorageService.instance.saveDeviceId(_deviceId!);
        }
      } else {
        _deviceId = 'unknown';
      }
    }
  }

  Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> data, {
    Map<String, String>? headers,
  }) async {
    try {
      final defaultHeaders = {
        "x-platform": "app",
        if (_deviceId != null) "x-device-id": _deviceId!,
      };
      final token = await SecureStorageService.instance.getToken();

      final mergedHeaders = {
        ...defaultHeaders,
        if (token != null) "Authorization": "Bearer $token",
        if (headers != null) ...headers,
      };

      final response = await _dio.post(
        endpoint,
        data: jsonEncode(data),
        options: Options(headers: mergedHeaders),
      );
      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> postFormData(
    String endpoint,
    Map<String, dynamic> data, {
    Map<String, String>? headers,
  }) async {
    try {
      final defaultHeaders = {
        "x-platform": "app",
        if (_deviceId != null) "x-device-id": _deviceId!,
        "Content-Type": "multipart/form-data",
      };

      final token = await SecureStorageService.instance.getToken();

      final mergedHeaders = {
        ...defaultHeaders,
        if (token != null) "Authorization": "Bearer $token",
        if (headers != null) ...headers,
      };

      FormData formData = FormData.fromMap(data);

      final response = await _dio.post(
        endpoint,
        data: formData,
        options: Options(headers: mergedHeaders),
      );

      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> putFormData(
    String endpoint,
    Map<String, dynamic> data, {
    Map<String, String>? headers,
  }) async {
    try {
      final defaultHeaders = {
        "x-platform": "app",
        if (_deviceId != null) "x-device-id": _deviceId!,
        "Content-Type": "multipart/form-data",
      };

      final token = await SecureStorageService.instance.getToken();

      final mergedHeaders = {
        ...defaultHeaders,
        if (token != null) "Authorization": "Bearer $token",
        if (headers != null) ...headers,
      };

      FormData formData = FormData.fromMap(data);

      final response = await _dio.put(
        endpoint,
        data: formData,
        options: Options(headers: mergedHeaders),
      );

      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<T> get<T>(
    String endpoint, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final defaultHeaders = {
        "x-platform": "app",
        if (_deviceId != null) "x-device-id": _deviceId!,
      };
      final token = await SecureStorageService.instance.getToken();

      final mergedHeaders = {
        ...defaultHeaders,
        if (token != null) "Authorization": "Bearer $token",
        if (headers != null) ...headers,
      };

      final response = await _dio.get(
        endpoint,
        queryParameters: queryParameters,
        options: Options(headers: mergedHeaders),
      );

      return response.data as T;
    } catch (e) {
      debugPrint("Error in DIO GET $e");
      throw ApiException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> getMap(
    String endpoint, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
  }) async {
    return get<Map<String, dynamic>>(
      endpoint,
      headers: headers,
      queryParameters: queryParameters,
    );
  }

  Future<List<dynamic>> getList(
    String endpoint, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
  }) async {
    return get<List<dynamic>>(
      endpoint,
      headers: headers,
      queryParameters: queryParameters,
    );
  }

  Future<Map<String, dynamic>> delete(
    String endpoint, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
  }) async {
    final defaultHeaders = {
      "x-platform": "app",
      if (_deviceId != null) "x-device-id": _deviceId!,
    };
    final token = await SecureStorageService.instance.getToken();

    final mergedHeaders = {
      ...defaultHeaders,
      if (token != null) "Authorization": "Bearer $token",
      if (headers != null) ...headers,
    };

    final response = await _dio.delete(
      endpoint,
      options: Options(headers: mergedHeaders),
      queryParameters: queryParameters,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> patch(
    String endpoint,
    Map<String, dynamic>? data, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
  }) async {
    final defaultHeaders = {
      "x-platform": "app",
      if (_deviceId != null) "x-device-id": _deviceId!,
    };
    final token = await SecureStorageService.instance.getToken();

    final mergedHeaders = {
      ...defaultHeaders,
      if (token != null) "Authorization": "Bearer $token",
      if (headers != null) ...headers,
    };
    final response = await _dio.patch(
      endpoint,
      data: data,
      options: Options(headers: mergedHeaders),
      queryParameters: queryParameters,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<String> getCurrentUserId() async {
    try {
      final response = await getMap('/api/user/me');
      final userId = response['_id'] as String?;
      if (userId == null) {
        throw ApiException('User ID not found in response');
      }
      return userId;
    } catch (e) {
      throw ApiException('Failed to fetch current user ID: $e');
    }
  }

  // Add this method to your ApiClient class
  Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> data, {
    Map<String, String>? headers,
  }) async {
    try {
      final defaultHeaders = {
        "x-platform": "app",
        if (_deviceId != null) "x-device-id": _deviceId!,
      };
      final token = await SecureStorageService.instance.getToken();

      final mergedHeaders = {
        ...defaultHeaders,
        if (token != null) "Authorization": "Bearer $token",
        if (headers != null) ...headers,
      };

      final response = await _dio.put(
        endpoint,
        data: jsonEncode(data),
        options: Options(headers: mergedHeaders),
      );
      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  // Cafe Operations
  Future<Map<String, dynamic>> getCafe(String cafeId) async {
    final endpoint = ApiConstants.getCafe.replaceAll(':cafeId', cafeId);
    return await getMap(endpoint);
  }

  Future<List<dynamic>> getAllCafes() async {
    return await getList(ApiConstants.getAllCafes);
  }

  Future<Map<String, dynamic>> updateCafe(
    String cafeId,
    Map<String, dynamic> cafeData,
  ) async {
    final endpoint = ApiConstants.updateCafe.replaceAll(':cafeId', cafeId);
    return await put(endpoint, cafeData);
  }

  Future<Map<String, dynamic>> updateCafeName(
    String cafeId,
    String name,
  ) async {
    final endpoint = ApiConstants.updateCafeName.replaceAll(':cafeId', cafeId);
    return await patch(endpoint, {'name': name});
  }

  Future<Map<String, dynamic>> updateCafeStatus(
    String cafeId,
    String status,
  ) async {
    final endpoint = ApiConstants.updateCafeStatus.replaceAll(
      ':cafeId',
      cafeId,
    );
    return await patch(endpoint, {'status': status});
  }

  Future<Map<String, dynamic>> updateCafeCoordinates(
    String cafeId,
    double latitude,
    double longitude,
    String? locationInText,
  ) async {
    final endpoint = ApiConstants.updateCafeCoordinates.replaceAll(
      ':cafeId',
      cafeId,
    );
    return await patch(endpoint, {
      'latitude': latitude,
      'longitude': longitude,
      if (locationInText != null) 'locationInText': locationInText,
    });
  }

  Future<Map<String, dynamic>> deleteCafe(String cafeId) async {
    final endpoint = ApiConstants.deleteCafe.replaceAll(':cafeId', cafeId);
    return await delete(endpoint);
  }

  // Category Operations
  Future<List<dynamic>> getCafeCategories(String cafeId) async {
    final endpoint = ApiConstants.getCafeCategories.replaceAll(
      ':cafeId',
      cafeId,
    );
    return await getList(endpoint);
  }

  Future<Map<String, dynamic>> createCategory(
    String cafeId,
    Map<String, dynamic> categoryData,
  ) async {
    final endpoint = ApiConstants.createCategory.replaceAll(':cafeId', cafeId);
    print('DEBUG: Creating category with endpoint: $endpoint');
    print('DEBUG: Category data: $categoryData');
    print('DEBUG: cafeId parameter: $cafeId');
    return await post(endpoint, categoryData);
  }

  Future<Map<String, dynamic>> updateCategory(
    String cafeId,
    String categoryId,
    Map<String, dynamic> categoryData,
  ) async {
    final endpoint = ApiConstants.updateCategory
        .replaceAll(':cafeId', cafeId)
        .replaceAll(':categoryId', categoryId);
    return await put(endpoint, categoryData);
  }

  Future<Map<String, dynamic>> updateCategoryStatus(
    String cafeId,
    String categoryId,
    String status,
  ) async {
    final endpoint = ApiConstants.updateCategoryStatus
        .replaceAll(':cafeId', cafeId)
        .replaceAll(':categoryId', categoryId);
    return await put(endpoint, {'status': status});
  }

  Future<Map<String, dynamic>> deleteCategory(
    String cafeId,
    String categoryId,
  ) async {
    final endpoint = ApiConstants.deleteCategoryById
        .replaceAll(':cafeId', cafeId)
        .replaceAll(':categoryId', categoryId);
    return await delete(endpoint);
  }

  // Food Item Operations
  Future<List<dynamic>> getFoodItems(String cafeId) async {
    final endpoint = ApiConstants.getFoodItems.replaceAll(':cafeId', cafeId);
    return await getList(endpoint);
  }

  Future<Map<String, dynamic>> createFoodItem(
    String cafeId,
    String categoryId,
    Map<String, dynamic> itemData,
  ) async {
    final endpoint = ApiConstants.createFoodItem.replaceAll(':cafeId', cafeId);
    // Add categoryId to the item data since backend expects it in the body
    final dataWithCategory = {...itemData, 'category': categoryId};
    return await post(endpoint, dataWithCategory);
  }

  Future<Map<String, dynamic>> updateFoodItem(
    String cafeId,
    String itemId,
    Map<String, dynamic> itemData,
  ) async {
    final endpoint = ApiConstants.updateFoodItem
        .replaceAll(':cafeId', cafeId)
        .replaceAll(':itemId', itemId);
    return await put(endpoint, itemData);
  }

  Future<Map<String, dynamic>> deleteFoodItem(
    String cafeId,
    String itemId,
  ) async {
    final endpoint = ApiConstants.deleteFoodItem
        .replaceAll(':cafeId', cafeId)
        .replaceAll(':itemId', itemId);
    return await delete(endpoint);
  }

  // Reviews Operations
  Future<List<dynamic>> getReviews(String cafeId) async {
    final endpoint = ApiConstants.getReviews.replaceAll(':cafeId', cafeId);
    return await getList(endpoint);
  }

  Future<List<dynamic>> getItemReviews(String cafeId, String itemId) async {
    final endpoint = ApiConstants.getItemReviews
        .replaceAll(':cafeId', cafeId)
        .replaceAll(':itemId', itemId);
    return await getList(endpoint);
  }
}

class ApiException implements Exception {
  final String message;

  ApiException(this.message);

  static ApiException fromDioError(dynamic error) {
    if (error is DioException) {
      final statusCode = error.response?.statusCode;
      final data = error.response?.data;

      String readableMessage = "Unexpected error";
      if (data is Map<String, dynamic> && data.containsKey('error')) {
        readableMessage = data['error'].toString();
      } else if (data is String) {
        readableMessage = data;
      }

      switch (error.type) {
        case DioExceptionType.badResponse:
          return ApiException(" $readableMessage");
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return ApiException("Connection timeout");
        case DioExceptionType.cancel:
          return ApiException("Request was cancelled");
        default:
          return ApiException("Unexpected error: ${error.message}");
      }
    }
    return ApiException("Unexpected error: $error");
  }

  @override
  String toString() => message;
}

class ExternalApiClient {
  final Dio _dio;
  String? _deviceId;

  ExternalApiClient({Dio? dio})
    : _dio = dio ?? Dio(BaseOptions(baseUrl: ApiConstants.baseUrl)) {
    _initDeviceId();
  }
  Future<void> _initDeviceId() async {
    // First try to get stored device ID
    _deviceId = await SecureStorageService.instance.getDeviceId();

    // If no stored device ID, generate a new one
    if (_deviceId == null || _deviceId!.isEmpty) {
      final deviceInfo = DeviceInfoPlugin();
      if (Platform.isAndroid) {
        final androidInfo = await deviceInfo.androidInfo;
        _deviceId = androidInfo.id ?? 'unknown';
        log('androidInfo.id: ${androidInfo.id}');
        if (_deviceId != 'unknown') {
          SecureStorageService.instance.saveDeviceId(_deviceId!);
        }
      } else if (Platform.isIOS) {
        final iosInfo = await deviceInfo.iosInfo;
        _deviceId = iosInfo.identifierForVendor ?? 'unknown';
        if (_deviceId != 'unknown') {
          SecureStorageService.instance.saveDeviceId(_deviceId!);
        }
      } else {
        _deviceId = 'unknown';
      }
    }
  }

  Future<Map<String, dynamic>> get(
    String url, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final defaultHeaders = {
        "x-platform": "app",
        if (_deviceId != null) "x-device-id": _deviceId!,
      };

      final response = await _dio.get(
        url,
        queryParameters: queryParameters,
        options: Options(
          headers: {...defaultHeaders, if (headers != null) ...headers},
        ),
      );
      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Map<String, dynamic>> post(
    String url,
    Map<String, dynamic> data, {
    Map<String, String>? headers,
  }) async {
    try {
      final defaultHeaders = {
        "x-platform": "app",
        if (_deviceId != null) "x-device-id": _deviceId!,
      };

      final response = await _dio.post(
        url,
        data: data,
        options: Options(
          headers: {...defaultHeaders, if (headers != null) ...headers},
        ),
      );
      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}
