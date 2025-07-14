import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cafeuser/providers/cafe_provider.dart';
import 'package:cafeuser/providers/auth_provider.dart';
import 'package:cafeuser/models/food_item.dart';
import 'package:cafeuser/models/food_category.dart';
import 'package:cafeuser/shared/constants.dart';
import 'package:cafeuser/screens/food_management/add_food_item_page.dart';
import 'package:cafeuser/screens/food_management/edit_food_item_page.dart';

class FoodItemsPage extends StatefulWidget {
  const FoodItemsPage({Key? key}) : super(key: key);

  @override
  State<FoodItemsPage> createState() => _FoodItemsPageState();
}

class _FoodItemsPageState extends State<FoodItemsPage> {
  String _searchQuery = '';
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor:
            isError
                ? Theme.of(context).colorScheme.error
                : Theme.of(context).colorScheme.secondary,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Future<void> _deleteFoodItem(FoodItem item) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Delete Food Item'),
            content: Text('Are you sure you want to delete "${item.name}"?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.error,
                ),
                child: const Text('Delete'),
              ),
            ],
          ),
    );

    if (confirmed == true) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final cafeProvider = Provider.of<CafeProvider>(context, listen: false);
      final cafeId = authProvider.cafeId;

      if (cafeId != null) {
        final success = await cafeProvider.deleteFoodItem(cafeId, item.id);
        if (success) {
          _showSnackBar('Food item deleted successfully');
        } else {
          _showSnackBar(
            cafeProvider.errorMessage ?? 'Failed to delete food item',
            isError: true,
          );
        }
      }
    }
  }

  List<FoodItem> _getFilteredItems(
    List<FoodItem> items,
    List<FoodCategory> categories,
  ) {
    List<FoodItem> filteredItems = items;

    // Filter by category
    if (_selectedCategory != 'All') {
      final selectedCategoryObj = categories.firstWhere(
        (cat) => cat.name == _selectedCategory,
        orElse: () => categories.first,
      );
      filteredItems =
          filteredItems
              .where((item) => item.category == selectedCategoryObj.id)
              .toList();
    }

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      filteredItems =
          filteredItems
              .where(
                (item) =>
                    item.name.toLowerCase().contains(
                      _searchQuery.toLowerCase(),
                    ) ||
                    item.description.toLowerCase().contains(
                      _searchQuery.toLowerCase(),
                    ),
              )
              .toList();
    }

    return filteredItems;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Food Items'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        foregroundColor: Theme.of(context).colorScheme.onSurface,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const AddFoodItemPage(),
                ),
              );
            },
          ),
        ],
      ),
      body: Consumer<CafeProvider>(
        builder: (context, cafeProvider, child) {
          final categories = cafeProvider.categories;
          final items = _getFilteredItems(cafeProvider.foodItems, categories);

          return Column(
            children: [
              // Search and Filter Section
              Container(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                color: Theme.of(context).colorScheme.surface,
                child: Column(
                  children: [
                    // Search Bar
                    TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: 'Search food items...',
                        prefixIcon: const Icon(Icons.search),
                        suffixIcon:
                            _searchQuery.isNotEmpty
                                ? IconButton(
                                  icon: const Icon(Icons.clear),
                                  onPressed: () {
                                    _searchController.clear();
                                    setState(() {
                                      _searchQuery = '';
                                    });
                                  },
                                )
                                : null,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(
                            AppConstants.borderRadius,
                          ),
                        ),
                      ),
                      onChanged: (value) {
                        setState(() {
                          _searchQuery = value;
                        });
                      },
                    ),

                    const SizedBox(height: 12),

                    // Category Filter
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _buildCategoryChip('All', _selectedCategory == 'All'),
                          const SizedBox(width: 8),
                          ...categories.map(
                            (category) => Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: _buildCategoryChip(
                                category.name,
                                _selectedCategory == category.name,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Items List
              Expanded(
                child:
                    cafeProvider.isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : items.isEmpty
                        ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.restaurant_menu,
                                size: 64,
                                color: Theme.of(context).hintColor,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                _searchQuery.isNotEmpty ||
                                        _selectedCategory != 'All'
                                    ? 'No food items found'
                                    : 'No food items yet',
                                style: Theme.of(
                                  context,
                                ).textTheme.titleMedium?.copyWith(
                                  color: Theme.of(context).hintColor,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                _searchQuery.isNotEmpty ||
                                        _selectedCategory != 'All'
                                    ? 'Try adjusting your search or filter'
                                    : 'Add your first food item',
                                style: Theme.of(
                                  context,
                                ).textTheme.bodyMedium?.copyWith(
                                  color: Theme.of(context).hintColor,
                                ),
                              ),
                            ],
                          ),
                        )
                        : ListView.builder(
                          padding: const EdgeInsets.all(
                            AppConstants.defaultPadding,
                          ),
                          itemCount: items.length,
                          itemBuilder: (context, index) {
                            final item = items[index];
                            final category = categories.firstWhere(
                              (cat) => cat.id == item.category,
                              orElse: () => categories.first,
                            );
                            return _buildFoodItemCard(item, category);
                          },
                        ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildCategoryChip(String label, bool isSelected) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          _selectedCategory = selected ? label : 'All';
        });
      },
      selectedColor: Theme.of(context).colorScheme.secondary.withOpacity(0.2),
      checkmarkColor: Theme.of(context).colorScheme.secondary,
    );
  }

  Widget _buildFoodItemCard(FoodItem item, FoodCategory category) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.secondary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(AppConstants.smallBorderRadius),
          ),
          child:
              item.imageUrl.isNotEmpty
                  ? ClipRRect(
                    borderRadius: BorderRadius.circular(
                      AppConstants.smallBorderRadius,
                    ),
                    child: Image.network(
                      item.imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder:
                          (context, error, stackTrace) => Icon(
                            Icons.restaurant,
                            color: Theme.of(context).colorScheme.secondary,
                          ),
                    ),
                  )
                  : Icon(
                    Icons.restaurant,
                    color: Theme.of(context).colorScheme.secondary,
                  ),
        ),
        title: Text(
          item.name,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              item.description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(
                      context,
                    ).colorScheme.secondary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    category.name,
                    style: TextStyle(
                      fontSize: 12,
                      color: Theme.of(context).colorScheme.secondary,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color:
                        item.status == AppConstants.activeStatus
                            ? Colors.green.withOpacity(0.1)
                            : Colors.grey.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    item.status.toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      color:
                          item.status == AppConstants.activeStatus
                              ? Colors.green
                              : Colors.grey,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '${AppConstants.currencySymbol}${item.price.toStringAsFixed(2)}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            PopupMenuButton<String>(
              onSelected: (value) {
                if (value == 'edit') {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => EditFoodItemPage(item: item),
                    ),
                  );
                } else if (value == 'delete') {
                  _deleteFoodItem(item);
                }
              },
              itemBuilder:
                  (context) => [
                    const PopupMenuItem(
                      value: 'edit',
                      child: Row(
                        children: [
                          Icon(Icons.edit),
                          SizedBox(width: 8),
                          Text('Edit'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete),
                          SizedBox(width: 8),
                          Text('Delete'),
                        ],
                      ),
                    ),
                  ],
            ),
          ],
        ),
      ),
    );
  }
}
