class FoodItem {
  final String id;
  final String name;
  final String description;
  final String imageUrl;
  final double price;
  final List<String> flavours;
  final String cafeId;
  final String? category;
  final double? takeAwayPrice;
  final bool takeAwayStatus;
  final String volume;
  final double discount;
  final String attachedCafe;
  final String foodItemAddedBy;
  final String foodItemAddedByModel;
  final String status; // 'active', 'archived', 'deactive'
  final bool deleted;
  final List<LastChange> lastChangesBy;
  final References references;
  final DateTime createdAt;
  final DateTime updatedAt;

  FoodItem({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.price,
    required this.flavours,
    required this.cafeId,
    this.category,
    this.takeAwayPrice,
    required this.takeAwayStatus,
    required this.volume,
    required this.discount,
    required this.attachedCafe,
    required this.foodItemAddedBy,
    required this.foodItemAddedByModel,
    required this.status,
    required this.deleted,
    required this.lastChangesBy,
    required this.references,
    required this.createdAt,
    required this.updatedAt,
  });

  factory FoodItem.fromJson(Map<String, dynamic> json) {
    return FoodItem(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      flavours: List<String>.from(json['flavours'] ?? []),
      cafeId: json['cafeId'] ?? '',
      category: json['category'],
      takeAwayPrice:
          json['takeAwayPrice'] != null
              ? (json['takeAwayPrice']).toDouble()
              : null,
      takeAwayStatus: json['takeAwayStatus'] ?? false,
      volume: json['volume'] ?? '',
      discount: (json['discount'] ?? 0).toDouble(),
      attachedCafe: json['attachedCafe'] ?? '',
      foodItemAddedBy: json['foodItemAddedBy'] ?? '',
      foodItemAddedByModel: json['foodItemAddedByModel'] ?? '',
      status: json['status'] ?? 'active',
      deleted: json['deleted'] ?? false,
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
      'price': price,
      'flavours': flavours,
      'cafeId': cafeId,
      'category': category,
      'takeAwayPrice': takeAwayPrice,
      'takeAwayStatus': takeAwayStatus,
      'volume': volume,
      'discount': discount,
      'attachedCafe': attachedCafe,
      'foodItemAddedBy': foodItemAddedBy,
      'foodItemAddedByModel': foodItemAddedByModel,
      'status': status,
      'deleted': deleted,
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
  final String? foodItemId;
  final String userId;
  final String userType;
  final DateTime changedAt;

  LastChange({
    required this.whatUpdated,
    required this.cafeId,
    this.foodItemId,
    required this.userId,
    required this.userType,
    required this.changedAt,
  });

  factory LastChange.fromJson(Map<String, dynamic> json) {
    return LastChange(
      whatUpdated: json['whatUpdated'] ?? '',
      cafeId: json['cafeId'] ?? '',
      foodItemId: json['foodItemId'],
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
      'foodItemId': foodItemId,
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
