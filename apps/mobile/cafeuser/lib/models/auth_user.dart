class AuthUser {
  final String userId;
  final String name;
  final String username;
  final String email;
  final String phone;
  final String role; // 'c_admin' or 'c_employee'
  final AttachedCafe attachedCafe;
  final University university;
  final Campus campus;
  final int iat; // issued at
  final int exp; // expires at

  AuthUser({
    required this.userId,
    required this.name,
    required this.username,
    required this.email,
    required this.phone,
    required this.role,
    required this.attachedCafe,
    required this.university,
    required this.campus,
    required this.iat,
    required this.exp,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      userId: json['userId'] ?? '',
      name: json['name'] ?? '',
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? '',
      attachedCafe: AttachedCafe.fromJson(json['attachedCafe'] ?? {}),
      university: University.fromJson(json['university'] ?? {}),
      campus: Campus.fromJson(json['campus'] ?? {}),
      iat: json['iat'] ?? 0,
      exp: json['exp'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'name': name,
      'username': username,
      'email': email,
      'phone': phone,
      'role': role,
      'attachedCafe': attachedCafe.toJson(),
      'university': university.toJson(),
      'campus': campus.toJson(),
      'iat': iat,
      'exp': exp,
    };
  }

  // Convenience getters
  String get cafeId => attachedCafe.id;
  String get cafeName => attachedCafe.name;
  String get universityId => university.id;
  String get universityName => university.name;
  String get campusId => campus.id;
  String get campusName => campus.name;

  // Check if user has admin privileges
  bool get isAdmin => role == 'c_admin';

  // Check if user has employee privileges
  bool get isEmployee => role == 'c_employee';

  // Check if token is expired
  bool get isTokenExpired {
    final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    return now >= exp;
  }

  // Get token expiry date
  DateTime get tokenExpiryDate {
    return DateTime.fromMillisecondsSinceEpoch(exp * 1000);
  }

  // Get user's initials for avatar
  String get userInitials {
    if (name.isEmpty) return '';
    final nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return '${nameParts[0][0]}${nameParts[1][0]}'.toUpperCase();
    } else {
      return nameParts[0][0].toUpperCase();
    }
  }
}

class AttachedCafe {
  final String id;
  final String name;

  AttachedCafe({required this.id, required this.name});

  factory AttachedCafe.fromJson(Map<String, dynamic> json) {
    return AttachedCafe(id: json['_id'] ?? '', name: json['name'] ?? '');
  }

  Map<String, dynamic> toJson() {
    return {'_id': id, 'name': name};
  }
}

class University {
  final String id;
  final String name;

  University({required this.id, required this.name});

  factory University.fromJson(Map<String, dynamic> json) {
    return University(id: json['_id'] ?? '', name: json['name'] ?? '');
  }

  Map<String, dynamic> toJson() {
    return {'_id': id, 'name': name};
  }
}

class Campus {
  final String id;
  final String name;

  Campus({required this.id, required this.name});

  factory Campus.fromJson(Map<String, dynamic> json) {
    return Campus(id: json['_id'] ?? '', name: json['name'] ?? '');
  }

  Map<String, dynamic> toJson() {
    return {'_id': id, 'name': name};
  }
}
