import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cafeuser/providers/cafe_provider.dart';
import 'package:cafeuser/providers/auth_provider.dart';
import 'package:cafeuser/shared/constants.dart';

class ReviewsPage extends StatefulWidget {
  const ReviewsPage({Key? key}) : super(key: key);

  @override
  State<ReviewsPage> createState() => _ReviewsPageState();
}

class _ReviewsPageState extends State<ReviewsPage> {
  String _selectedFilter = 'All';
  final List<String> _filterOptions = [
    'All',
    '5 Stars',
    '4 Stars',
    '3 Stars',
    '2 Stars',
    '1 Star',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reviews'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        foregroundColor: Theme.of(context).colorScheme.onSurface,
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              setState(() {
                _selectedFilter = value;
              });
            },
            itemBuilder:
                (context) =>
                    _filterOptions.map((filter) {
                      return PopupMenuItem<String>(
                        value: filter,
                        child: Row(
                          children: [
                            Icon(
                              _selectedFilter == filter
                                  ? Icons.check
                                  : Icons.star,
                              color: Theme.of(context).colorScheme.secondary,
                            ),
                            const SizedBox(width: 8),
                            Text(filter),
                          ],
                        ),
                      );
                    }).toList(),
          ),
        ],
      ),
      body: Consumer<CafeProvider>(
        builder: (context, cafeProvider, child) {
          final foodItems = cafeProvider.foodItems;

          if (cafeProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (foodItems.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.rate_review,
                    size: 64,
                    color: Theme.of(context).hintColor,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No reviews yet',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: Theme.of(context).hintColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Reviews will appear here once customers\nstart rating your food items',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).hintColor,
                    ),
                  ),
                ],
              ),
            );
          }

          return ListView(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            children: [
              // Reviews Summary Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.defaultPadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Reviews Summary',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildSummaryItem(
                            'Total Reviews',
                            '24',
                            Icons.rate_review,
                          ),
                          _buildSummaryItem(
                            'Average Rating',
                            '4.2',
                            Icons.star,
                          ),
                          _buildSummaryItem(
                            'This Week',
                            '8',
                            Icons.calendar_today,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children:
                      _filterOptions.map((filter) {
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: FilterChip(
                            label: Text(filter),
                            selected: _selectedFilter == filter,
                            onSelected: (selected) {
                              setState(() {
                                _selectedFilter = filter;
                              });
                            },
                            selectedColor: Theme.of(
                              context,
                            ).colorScheme.secondary.withOpacity(0.2),
                            checkmarkColor:
                                Theme.of(context).colorScheme.secondary,
                          ),
                        );
                      }).toList(),
                ),
              ),

              const SizedBox(height: 16),

              // Mock Reviews List
              ..._buildMockReviews(),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSummaryItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 24, color: Theme.of(context).colorScheme.secondary),
        const SizedBox(height: 8),
        Text(
          value,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.secondary,
          ),
        ),
        Text(
          label,
          style: Theme.of(
            context,
          ).textTheme.bodySmall?.copyWith(color: Theme.of(context).hintColor),
        ),
      ],
    );
  }

  List<Widget> _buildMockReviews() {
    // Mock reviews data - in a real app, this would come from the backend
    final mockReviews = [
      {
        'customerName': 'John Doe',
        'rating': 5,
        'comment':
            'Excellent food and quick service! Will definitely order again.',
        'foodItem': 'Chicken Burger',
        'time': '2 hours ago',
        'verified': true,
      },
      {
        'customerName': 'Sarah Smith',
        'rating': 4,
        'comment': 'Good taste but could be a bit warmer. Overall satisfied.',
        'foodItem': 'Pizza Margherita',
        'time': '5 hours ago',
        'verified': true,
      },
      {
        'customerName': 'Mike Johnson',
        'rating': 5,
        'comment': 'Amazing coffee! Perfect blend and temperature.',
        'foodItem': 'Cappuccino',
        'time': '1 day ago',
        'verified': false,
      },
      {
        'customerName': 'Emma Wilson',
        'rating': 3,
        'comment': 'Average taste, nothing special. Service was okay.',
        'foodItem': 'Pasta Bolognese',
        'time': '2 days ago',
        'verified': true,
      },
      {
        'customerName': 'David Brown',
        'rating': 4,
        'comment': 'Great portion size and reasonable price. Recommended!',
        'foodItem': 'Caesar Salad',
        'time': '3 days ago',
        'verified': true,
      },
    ];

    return mockReviews.map((review) {
      final rating = review['rating'] as int;
      final shouldShow =
          _selectedFilter == 'All' || _selectedFilter == '$rating Stars';

      if (!shouldShow) return const SizedBox.shrink();

      return Card(
        margin: const EdgeInsets.only(bottom: 12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: Theme.of(
                          context,
                        ).colorScheme.secondary.withOpacity(0.1),
                        child: Text(
                          (review['customerName'] as String)
                              .substring(0, 1)
                              .toUpperCase(),
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.secondary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                review['customerName'] as String,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              if (review['verified'] as bool) ...[
                                const SizedBox(width: 4),
                                Icon(
                                  Icons.verified,
                                  size: 16,
                                  color:
                                      Theme.of(context).colorScheme.secondary,
                                ),
                              ],
                            ],
                          ),
                          Text(
                            review['time'] as String,
                            style: TextStyle(
                              color: Theme.of(context).hintColor,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.secondary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      review['foodItem'] as String,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.secondary,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // Rating Stars
              Row(
                children: List.generate(5, (index) {
                  return Icon(
                    Icons.star,
                    size: 16,
                    color:
                        index < rating
                            ? Colors.amber
                            : Theme.of(context).hintColor.withOpacity(0.3),
                  );
                }),
              ),

              const SizedBox(height: 8),

              // Comment
              Text(
                review['comment'] as String,
                style: Theme.of(context).textTheme.bodyMedium,
              ),

              const SizedBox(height: 12),

              // Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton.icon(
                    onPressed: () {
                      // Handle reply action
                      _showReplyDialog(review['customerName'] as String);
                    },
                    icon: const Icon(Icons.reply, size: 16),
                    label: const Text('Reply'),
                  ),
                  const SizedBox(width: 8),
                  TextButton.icon(
                    onPressed: () {
                      // Handle report action
                      _showReportDialog(review['customerName'] as String);
                    },
                    icon: const Icon(Icons.flag, size: 16),
                    label: const Text('Report'),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }).toList();
  }

  void _showReplyDialog(String customerName) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: Text('Reply to $customerName'),
            content: const TextField(
              decoration: InputDecoration(
                hintText: 'Type your reply here...',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Reply sent successfully')),
                  );
                },
                child: const Text('Send Reply'),
              ),
            ],
          ),
    );
  }

  void _showReportDialog(String customerName) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: Text('Report Review from $customerName'),
            content: const Text(
              'Are you sure you want to report this review as inappropriate?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Review reported successfully'),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.error,
                ),
                child: const Text('Report'),
              ),
            ],
          ),
    );
  }
}
