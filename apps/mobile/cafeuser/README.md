# Cafe Admin App

A comprehensive Flutter application for cafe administrators to manage their food items, categories, and customer reviews.

## Features

### 🔐 Authentication
- Secure sign-in for cafe administrators and employees
- Role-based access control (Admin/Employee)
- Token-based authentication with secure storage
- Auto-login with session management

### 📊 Dashboard
- Overview of cafe statistics
- Quick access to frequently used features
- Real-time data updates
- User-friendly interface with material design

### 🍕 Food Management
- **Add Food Items**: Create new food items with detailed information
- **Edit Food Items**: Update existing items (price, description, availability)
- **Delete Food Items**: Remove items from the menu
- **Category Management**: Organize items by categories
- **Search & Filter**: Find items quickly by name or category
- **Take Away Options**: Manage delivery and pickup options

### 📱 Modern UI/UX
- Material Design 3 theming
- Dark and light theme support
- Responsive design for all screen sizes
- Smooth animations and transitions
- Intuitive navigation

### ⭐ Reviews Management
- View customer reviews and ratings
- Filter reviews by rating
- Reply to customer feedback
- Report inappropriate reviews
- Reviews summary and analytics

## Architecture

### Provider Pattern
The app uses the Provider pattern for state management:
- `AuthProvider`: Handles authentication state
- `CafeProvider`: Manages cafe data and operations

### API Integration
- RESTful API integration with Dio client
- Secure token-based authentication
- Error handling and retry mechanisms
- Network state management

### Models
- `CafeUser`: User authentication and profile data
- `Cafe`: Cafe information and settings
- `FoodItem`: Food item details and properties
- `FoodCategory`: Category organization

## Getting Started

### Prerequisites
- Flutter SDK (>= 3.7.2)
- Android Studio or VS Code
- Backend server running (see backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apps/mobile/cafeuser
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure API endpoints**
   Update `lib/shared/constants.dart` with your backend URL:
   ```dart
   class ApiConstants {
     static const String baseUrl = 'https://your-backend-url.com';
   }
   ```

4. **Run the app**
   ```bash
   flutter run
   ```

## Project Structure

```
lib/
├── main.dart                    # App entry point
├── models/                      # Data models
│   ├── cafe_user.dart
│   ├── cafe.dart
│   ├── food_item.dart
│   └── food_category.dart
├── providers/                   # State management
│   ├── auth_provider.dart
│   └── cafe_provider.dart
├── screens/                     # UI screens
│   ├── auth/
│   │   └── signin_page.dart
│   ├── dashboard/
│   │   └── dashboard_page.dart
│   ├── food_management/
│   │   ├── food_items_page.dart
│   │   ├── add_food_item_page.dart
│   │   └── edit_food_item_page.dart
│   └── reviews/
│       └── reviews_page.dart
├── services/                    # API services
│   ├── api_dio_client.dart
│   └── auth_service.dart
└── shared/                      # Shared utilities
    ├── appTheme.dart
    ├── constants.dart
    └── secure_storage.dart
```

## API Endpoints

### Authentication
- `POST /api/auth/cafe/login` - User login
- `POST /api/auth/cafe/logout` - User logout
- `GET /api/auth/cafe/me` - Get current user

### Cafe Management
- `GET /api/mod/cafe/:cafeId` - Get cafe details
- `PUT /api/mod/cafe/update/:cafeId/all` - Update cafe info

### Food Categories
- `GET /api/mod/cafe/:cafeId/categories` - Get categories
- `POST /api/mod/cafe/:cafeId/category` - Create category
- `PUT /api/mod/cafe/update/:cafeId/categories/:categoryId` - Update category
- `DELETE /api/mod/cafe/:cafeId/categories/:categoryId/delete` - Delete category

### Food Items
- `GET /api/mod/cafe/:cafeId/items` - Get food items
- `POST /api/mod/cafe/:cafeId/category/:categoryId/item/create` - Create food item
- `PUT /api/mod/cafe/:cafeId/items/:itemId/all` - Update food item
- `DELETE /api/mod/cafe/:cafeId/item/:itemId` - Delete food item

## User Roles

### Cafe Admin (`c_admin`)
- Full access to all features
- Can manage food items and categories
- Can view and respond to reviews
- Can manage cafe settings

### Cafe Employee (`c_employee`)
- Limited access to features
- Can view food items and reviews
- Cannot delete items or modify critical settings

## Features in Detail

### Food Item Management
- **Comprehensive Forms**: Name, description, price, image, volume, discount
- **Category Assignment**: Organize items into categories
- **Take Away Options**: Separate pricing for delivery/pickup
- **Flavors Support**: Multiple flavor options per item
- **Status Management**: Active, inactive, archived states
- **Bulk Operations**: Multi-select for bulk actions

### Review System
- **Rating Display**: 5-star rating system
- **Customer Feedback**: Read detailed customer comments
- **Filter Options**: Filter by rating, date, food item
- **Response System**: Reply to customer reviews
- **Analytics**: Review summary and statistics

### Security Features
- **Secure Storage**: Encrypted token storage
- **Role-based Access**: Different permissions for admin/employee
- **Session Management**: Auto-logout and token refresh
- **Device Tracking**: Device-specific authentication

## Theme Support

The app supports both light and dark themes:
- **Light Theme**: Clean white background with black text
- **Dark Theme**: Dark background with light text
- **Gold Accents**: Consistent yellow/gold accent color
- **System Theme**: Follows system theme preference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact:
- Email: support@cafeadmin.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

**Built with ❤️ using Flutter**
