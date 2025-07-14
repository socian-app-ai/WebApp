import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  // Private constructor
  SecureStorageService._privateConstructor();

  // The single instance of the class
  static final SecureStorageService instance =
      SecureStorageService._privateConstructor();

  // Instance of FlutterSecureStorage
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  // Save token to secure storage
  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: 'token', value: token);
  }

  // Retrieve token from secure storage
  Future<String?> getToken() async {
    return await _secureStorage.read(key: 'token');
  }

  // Delete the token from secure storage
  Future<void> deleteToken() async {
    await _secureStorage.delete(key: 'token');
  }

  // Generic field save/load/delete
  Future<void> saveField(String key, String value) async {
    await _secureStorage.write(key: key, value: value);
  }

  Future<String?> getField(String key) async {
    return await _secureStorage.read(key: key);
  }

  Future<void> deleteField(String key) async {
    await _secureStorage.delete(key: key);
  }

  Future<void> saveDeviceId(String deviceId) async {
    await _secureStorage.write(key: 'deviceId', value: deviceId);
  }

  Future<String?> getDeviceId() async {
    return await _secureStorage.read(key: 'deviceId');
  }

  Future<void> deleteDeviceId() async {
    await _secureStorage.delete(key: 'deviceId');
  }
}
