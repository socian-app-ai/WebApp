class CafeUser {
  final String id;
  final String name;
  final String username;
  final String email;
  final String phone;
  final String role; // 'c_admin' or 'c_employee'
  final String attachedCafe;
  final Verification verification;
  final Status status;
  final References references;
  final DateTime createdAt;
  final DateTime updatedAt;

  CafeUser({
    required this.id,
    required this.name,
    required this.username,
    required this.email,
    required this.phone,
    required this.role,
    required this.attachedCafe,
    required this.verification,
    required this.status,
    required this.references,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CafeUser.fromJson(Map<String, dynamic> json) {
    return CafeUser(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? '',
      attachedCafe: json['attachedCafe'] ?? '',
      verification: Verification.fromJson(json['verification'] ?? {}),
      status: Status.fromJson(json['status'] ?? {}),
      references: References.fromJson(json['references'] ?? {}),
      createdAt: DateTime.parse(
        json['createdAt'] ?? DateTime.now().toIso8601String(),
      ),
      updatedAt: DateTime.parse(
        json['updatedAt'] ?? DateTime.now().toIso8601String(),
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'username': username,
      'email': email,
      'phone': phone,
      'role': role,
      'attachedCafe': attachedCafe,
      'verification': verification.toJson(),
      'status': status.toJson(),
      'references': references.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class Verification {
  final bool email;
  final bool phone;

  Verification({required this.email, required this.phone});

  factory Verification.fromJson(Map<String, dynamic> json) {
    return Verification(
      email: json['email'] ?? false,
      phone: json['phone'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {'email': email, 'phone': phone};
  }
}

class Status {
  final bool activated;
  final String activationKey;

  Status({required this.activated, required this.activationKey});

  factory Status.fromJson(Map<String, dynamic> json) {
    return Status(
      activated: json['activated'] ?? false,
      activationKey: json['activationKey'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'activated': activated, 'activationKey': activationKey};
  }
}

class References {
  final String universityId;
  final String campusId;

  References({required this.universityId, required this.campusId});

  factory References.fromJson(Map<String, dynamic> json) {
    return References(
      universityId: json['universityId'] ?? '',
      campusId: json['campusId'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'universityId': universityId, 'campusId': campusId};
  }
}
