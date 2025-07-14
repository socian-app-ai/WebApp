import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cafeuser/providers/cafe_provider.dart';
import 'package:cafeuser/providers/auth_provider.dart';
import 'package:cafeuser/models/food_item.dart';
import 'package:cafeuser/models/food_category.dart';
import 'package:cafeuser/shared/constants.dart';

class EditFoodItemPage extends StatefulWidget {
  final FoodItem item;

  const EditFoodItemPage({Key? key, required this.item}) : super(key: key);

  @override
  State<EditFoodItemPage> createState() => _EditFoodItemPageState();
}

class _EditFoodItemPageState extends State<EditFoodItemPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _imageUrlController = TextEditingController();
  final _volumeController = TextEditingController();
  final _discountController = TextEditingController();
  final _takeAwayPriceController = TextEditingController();
  final _flavoursController = TextEditingController();

  String? _selectedCategoryId;
  bool _takeAwayStatus = false;

  @override
  void initState() {
    super.initState();
    _populateFields();
  }

  void _populateFields() {
    _nameController.text = widget.item.name;
    _descriptionController.text = widget.item.description;
    _priceController.text = widget.item.price.toString();
    _imageUrlController.text = widget.item.imageUrl;
    _volumeController.text = widget.item.volume;
    _discountController.text = widget.item.discount.toString();
    _takeAwayPriceController.text = widget.item.takeAwayPrice?.toString() ?? '';
    _flavoursController.text = widget.item.flavours.join(', ');
    _selectedCategoryId = widget.item.category;
    _takeAwayStatus = widget.item.takeAwayStatus;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _imageUrlController.dispose();
    _volumeController.dispose();
    _discountController.dispose();
    _takeAwayPriceController.dispose();
    _flavoursController.dispose();
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

  Future<void> _updateFoodItem() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final cafeProvider = Provider.of<CafeProvider>(context, listen: false);
    final cafeId = authProvider.cafeId;

    if (cafeId == null || _selectedCategoryId == null) {
      _showSnackBar('Please select a category', isError: true);
      return;
    }

    final itemData = {
      'name': _nameController.text.trim(),
      'description': _descriptionController.text.trim(),
      'price': double.parse(_priceController.text),
      'imageUrl': _imageUrlController.text.trim(),
      'volume': _volumeController.text.trim(),
      'discount': double.parse(
        _discountController.text.isEmpty ? '0' : _discountController.text,
      ),
      'flavours':
          _flavoursController.text
              .trim()
              .split(',')
              .map((e) => e.trim())
              .toList(),
      'takeAwayStatus': _takeAwayStatus,
      'takeAwayPrice':
          _takeAwayStatus ? double.parse(_takeAwayPriceController.text) : null,
      'category': _selectedCategoryId,
    };

    final success = await cafeProvider.updateFoodItem(
      cafeId,
      widget.item.id,
      itemData,
    );

    if (success) {
      _showSnackBar('Food item updated successfully');
      Navigator.of(context).pop();
    } else {
      _showSnackBar(
        cafeProvider.errorMessage ?? 'Failed to update food item',
        isError: true,
      );
    }
  }

  String? _validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Name is required';
    }
    if (value.length > AppConstants.maxFoodItemNameLength) {
      return 'Name must be less than ${AppConstants.maxFoodItemNameLength} characters';
    }
    return null;
  }

  String? _validateDescription(String? value) {
    if (value == null || value.isEmpty) {
      return 'Description is required';
    }
    if (value.length > AppConstants.maxDescriptionLength) {
      return 'Description must be less than ${AppConstants.maxDescriptionLength} characters';
    }
    return null;
  }

  String? _validatePrice(String? value) {
    if (value == null || value.isEmpty) {
      return 'Price is required';
    }
    final price = double.tryParse(value);
    if (price == null) {
      return 'Please enter a valid price';
    }
    if (price < AppConstants.minPrice || price > AppConstants.maxPrice) {
      return 'Price must be between ${AppConstants.minPrice} and ${AppConstants.maxPrice}';
    }
    return null;
  }

  String? _validateDiscount(String? value) {
    if (value == null || value.isEmpty) return null;
    final discount = double.tryParse(value);
    if (discount == null) {
      return 'Please enter a valid discount';
    }
    if (discount < AppConstants.minDiscount ||
        discount > AppConstants.maxDiscount) {
      return 'Discount must be between ${AppConstants.minDiscount}% and ${AppConstants.maxDiscount}%';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Food Item'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        foregroundColor: Theme.of(context).colorScheme.onSurface,
        actions: [
          Consumer<CafeProvider>(
            builder: (context, cafeProvider, child) {
              return TextButton(
                onPressed: cafeProvider.isLoading ? null : _updateFoodItem,
                child:
                    cafeProvider.isLoading
                        ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                        : const Text('Update'),
              );
            },
          ),
        ],
      ),
      body: Consumer<CafeProvider>(
        builder: (context, cafeProvider, child) {
          final categories = cafeProvider.categories;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Category Selection
                  DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      labelText: 'Category',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    value: _selectedCategoryId,
                    items:
                        categories.map((category) {
                          return DropdownMenuItem<String>(
                            value: category.id,
                            child: Text(category.name),
                          );
                        }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedCategoryId = value;
                      });
                    },
                    validator:
                        (value) =>
                            value == null ? 'Please select a category' : null,
                  ),

                  const SizedBox(height: 16),

                  // Name Field
                  TextFormField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      labelText: 'Name',
                      hintText: 'Enter food item name',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    validator: _validateName,
                    textInputAction: TextInputAction.next,
                  ),

                  const SizedBox(height: 16),

                  // Description Field
                  TextFormField(
                    controller: _descriptionController,
                    decoration: InputDecoration(
                      labelText: 'Description',
                      hintText: 'Enter food item description',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    validator: _validateDescription,
                    textInputAction: TextInputAction.next,
                    maxLines: 3,
                  ),

                  const SizedBox(height: 16),

                  // Price Field
                  TextFormField(
                    controller: _priceController,
                    decoration: InputDecoration(
                      labelText: 'Price (${AppConstants.currencySymbol})',
                      hintText: 'Enter price',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    validator: _validatePrice,
                    textInputAction: TextInputAction.next,
                    keyboardType: TextInputType.number,
                  ),

                  const SizedBox(height: 16),

                  // Image URL Field
                  TextFormField(
                    controller: _imageUrlController,
                    decoration: InputDecoration(
                      labelText: 'Image URL (Optional)',
                      hintText: 'Enter image URL',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    textInputAction: TextInputAction.next,
                  ),

                  const SizedBox(height: 16),

                  // Volume Field
                  TextFormField(
                    controller: _volumeController,
                    decoration: InputDecoration(
                      labelText: 'Volume/Size (Optional)',
                      hintText: 'e.g., 250ml, Large, Medium',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    textInputAction: TextInputAction.next,
                  ),

                  const SizedBox(height: 16),

                  // Discount Field
                  TextFormField(
                    controller: _discountController,
                    decoration: InputDecoration(
                      labelText: 'Discount (%) (Optional)',
                      hintText: 'Enter discount percentage',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    validator: _validateDiscount,
                    textInputAction: TextInputAction.next,
                    keyboardType: TextInputType.number,
                  ),

                  const SizedBox(height: 16),

                  // Flavours Field
                  TextFormField(
                    controller: _flavoursController,
                    decoration: InputDecoration(
                      labelText: 'Flavours (Optional)',
                      hintText: 'Enter flavours separated by commas',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    textInputAction: TextInputAction.next,
                  ),

                  const SizedBox(height: 16),

                  // Take Away Options
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Checkbox(
                                value: _takeAwayStatus,
                                onChanged: (value) {
                                  setState(() {
                                    _takeAwayStatus = value ?? false;
                                  });
                                },
                              ),
                              const Text('Available for Take Away'),
                            ],
                          ),

                          if (_takeAwayStatus) ...[
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _takeAwayPriceController,
                              decoration: InputDecoration(
                                labelText:
                                    'Take Away Price (${AppConstants.currencySymbol})',
                                hintText: 'Enter take away price',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(
                                    AppConstants.borderRadius,
                                  ),
                                ),
                              ),
                              validator:
                                  _takeAwayStatus ? _validatePrice : null,
                              keyboardType: TextInputType.number,
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Update Button
                  ElevatedButton(
                    onPressed: cafeProvider.isLoading ? null : _updateFoodItem,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Theme.of(context).colorScheme.onPrimary,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                    ),
                    child:
                        cafeProvider.isLoading
                            ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  Colors.white,
                                ),
                              ),
                            )
                            : const Text(
                              'Update Food Item',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
