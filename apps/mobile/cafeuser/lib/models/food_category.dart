class FoodCategory {
  final String id;
  final String name;
  final String description;
  final String imageUrl;
  final String cafeId;
  final String categoryAddedBy;
  final String categoryAddedByModel;
  final String status; // 'active', 'archived', 'deactive'
  final bool deleted;
  final List<String> itemsInIt;
  final List<LastChange> lastChangesBy;
  final References references;
  final DateTime createdAt;
  final DateTime updatedAt;

  FoodCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.cafeId,
    required this.categoryAddedBy,
    required this.categoryAddedByModel,
    required this.status,
    required this.deleted,
    required this.itemsInIt,
    required this.lastChangesBy,
    required this.references,
    required this.createdAt,
    required this.updatedAt,
  });

  factory FoodCategory.fromJson(Map<String, dynamic> json) {
    return FoodCategory(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      cafeId: json['cafeId'] ?? '',
      categoryAddedBy: json['categoryAddedBy'] ?? '',
      categoryAddedByModel: json['categoryAddedByModel'] ?? '',
      status: json['status'] ?? 'active',
      deleted: json['deleted'] ?? false,
      itemsInIt: List<String>.from(json['itemsInIt'] ?? []),
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
      'description': description,
      'imageUrl': imageUrl,
      'cafeId': cafeId,
      'categoryAddedBy': categoryAddedBy,
      'categoryAddedByModel': categoryAddedByModel,
      'status': status,
      'deleted': deleted,
      'itemsInIt': itemsInIt,
      'lastChangesBy': lastChangesBy.map((item) => item.toJson()).toList(),
      'references': references.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class LastChange {
  final String whatUpdated;
  final String cafeId;
  final String? foodCategoryId;
  final String userId;
  final String userType;
  final DateTime changedAt;

  LastChange({
    required this.whatUpdated,
    required this.cafeId,
    this.foodCategoryId,
    required this.userId,
    required this.userType,
    required this.changedAt,
  });

  factory LastChange.fromJson(Map<String, dynamic> json) {
    return LastChange(
      whatUpdated: json['whatUpdated'] ?? '',
      cafeId: json['cafeId'] ?? '',
      foodCategoryId: json['foodCategoryId'],
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
      'foodCategoryId': foodCategoryId,
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
