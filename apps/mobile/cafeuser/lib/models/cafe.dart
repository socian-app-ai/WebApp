class Cafe {
  final String id;
  final String name;
  final String? attachedCafeAdmin;
  final List<String> foodItems;
  final List<String> categories;
  final String status; // 'active', 'archived', 'deactive'
  final List<String> contact;
  final double accumulatedRating;
  final String information;
  final bool deleted;
  final Coordinates coordinates;
  final CreatedBy createdBy;
  final List<LastChange> lastChangesBy;
  final References references;
  final DateTime createdAt;
  final DateTime updatedAt;

  Cafe({
    required this.id,
    required this.name,
    this.attachedCafeAdmin,
    required this.foodItems,
    required this.categories,
    required this.status,
    required this.contact,
    required this.accumulatedRating,
    required this.information,
    required this.deleted,
    required this.coordinates,
    required this.createdBy,
    required this.lastChangesBy,
    required this.references,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Cafe.fromJson(Map<String, dynamic> json) {
    return Cafe(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      attachedCafeAdmin: json['attachedCafeAdmin'],
      foodItems: List<String>.from(json['foodItems'] ?? []),
      categories: List<String>.from(json['categories'] ?? []),
      status: json['status'] ?? 'deactive',
      contact: List<String>.from(json['contact'] ?? []),
      accumulatedRating: (json['accumulatedRating'] ?? 0).toDouble(),
      information: json['information'] ?? '',
      deleted: json['deleted'] ?? false,
      coordinates: Coordinates.fromJson(json['coordinates'] ?? {}),
      createdBy: CreatedBy.fromJson(json['createdBy'] ?? {}),
      lastChangesBy:
          (json['lastChangesBy'] as List<dynamic>?)
              ?.map((item) => LastChange.fromJson(item))
              .toList() ??
          [],
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
      'attachedCafeAdmin': attachedCafeAdmin,
      'foodItems': foodItems,
      'categories': categories,
      'status': status,
      'contact': contact,
      'accumulatedRating': accumulatedRating,
      'information': information,
      'deleted': deleted,
      'coordinates': coordinates.toJson(),
      'createdBy': createdBy.toJson(),
      'lastChangesBy': lastChangesBy.map((item) => item.toJson()).toList(),
      'references': references.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class Coordinates {
  final String id;
  final double latitude;
  final double longitude;
  final String locationInText;

  Coordinates({
    required this.id,
    required this.latitude,
    required this.longitude,
    required this.locationInText,
  });

  factory Coordinates.fromJson(Map<String, dynamic> json) {
    return Coordinates(
      id: json['_id'] ?? '',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      locationInText: json['locationInText'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'latitude': latitude,
      'longitude': longitude,
      'locationInText': locationInText,
    };
  }
}

class CreatedBy {
  final String user;

  CreatedBy({required this.user});

  factory CreatedBy.fromJson(Map<String, dynamic> json) {
    return CreatedBy(user: json['user'] ?? '');
  }

  Map<String, dynamic> toJson() {
    return {'user': user};
  }
}

class LastChange {
  final String whatUpdated;
  final String cafeId;
  final String userId;
  final String userType;
  final DateTime changedAt;

  LastChange({
    required this.whatUpdated,
    required this.cafeId,
    required this.userId,
    required this.userType,
    required this.changedAt,
  });

  factory LastChange.fromJson(Map<String, dynamic> json) {
    return LastChange(
      whatUpdated: json['whatUpdated'] ?? '',
      cafeId: json['cafeId'] ?? '',
      userId: json['userId'] ?? '',
      userType: json['userType'] ?? '',
      changedAt: DateTime.parse(
        json['changedAt'] ?? DateTime.now().toIso8601String(),
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'whatUpdated': whatUpdated,
      'cafeId': cafeId,
      'userId': userId,
      'userType': userType,
      'changedAt': changedAt.toIso8601String(),
    };
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
