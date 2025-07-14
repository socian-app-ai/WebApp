import 'dart:convert';
import 'package:cafeuser/models/auth_user.dart';

class JwtService {
  static final JwtService _instance = JwtService._internal();

  factory JwtService() {
    return _instance;
  }

  JwtService._internal();

  /// Decode JWT token and extract payload
  Map<String, dynamic>? decodeToken(String token) {
    try {
      // Split the token into parts
      final parts = token.split('.');
      if (parts.length != 3) {
        throw FormatException('Invalid JWT token format');
      }

      // Decode the payload (second part)
      final payload = parts[1];

      // Add padding if needed
      String normalizedPayload = payload;
      switch (payload.length % 4) {
        case 1:
          normalizedPayload += '===';
          break;
        case 2:
          normalizedPayload += '==';
          break;
        case 3:
          normalizedPayload += '=';
          break;
      }

      // Decode from base64
      final decoded = utf8.decode(base64Url.decode(normalizedPayload));
      return json.decode(decoded) as Map<String, dynamic>;
    } catch (e) {
      print('Error decoding JWT token: $e');
      return null;
    }
  }

  /// Extract user information from JWT token
  AuthUser? getUserFromToken(String token) {
    try {
      final payload = decodeToken(token);
      if (payload == null) return null;

      return AuthUser.fromJson(payload);
    } catch (e) {
      print('Error extracting user from JWT token: $e');
      return null;
    }
  }

  /// Check if token is expired
  bool isTokenExpired(String token) {
    try {
      final payload = decodeToken(token);
      if (payload == null) return true;

      final exp = payload['exp'] as int?;
      if (exp == null) return true;

      final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      return now >= exp;
    } catch (e) {
      return true;
    }
  }

  /// Get token expiry date
  DateTime? getTokenExpiryDate(String token) {
    try {
      final payload = decodeToken(token);
      if (payload == null) return null;

      final exp = payload['exp'] as int?;
      if (exp == null) return null;

      return DateTime.fromMillisecondsSinceEpoch(exp * 1000);
    } catch (e) {
      return null;
    }
  }

  /// Get token issued date
  DateTime? getTokenIssuedDate(String token) {
    try {
      final payload = decodeToken(token);
      if (payload == null) return null;

      final iat = payload['iat'] as int?;
      if (iat == null) return null;

      return DateTime.fromMillisecondsSinceEpoch(iat * 1000);
    } catch (e) {
      return null;
    }
  }
}
