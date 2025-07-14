import 'package:flutter/material.dart';

class AppThemes {
  // Shadcn-inspired Black & White Light Theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: Colors.white,
    textTheme: const TextTheme(),
    iconTheme: const IconThemeData(color: Colors.black),
    colorScheme: const ColorScheme(
      brightness: Brightness.light,
      primary: Colors.black,
      onPrimary: Colors.white,
      secondary: Color(0xFFFFD700), // Gold accent
      onSecondary: Colors.black,
      error: Color(0xFFB91C1C),
      onError: Colors.white,
      surface: Colors.white,
      onSurface: Colors.black,
    ),
    dividerColor: const Color(0xFFE5E7EB),
    hintColor: const Color(0xFF6B7280),
    cardColor: Colors.white,
    highlightColor: const Color(0xFFF4F4F5),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Colors.black,
      elevation: 0,
      iconTheme: IconThemeData(color: Colors.black),
    ),
    inputDecorationTheme: const InputDecorationTheme(
      fillColor: Color(0xFFF4F4F5),
      filled: true,
      border: OutlineInputBorder(
        borderSide: BorderSide(color: Color(0xFFE5E7EB)),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(color: Color(0xFFFFD700)),
      ),
    ),
  );

  // Shadcn-inspired Dark Theme with Gold (Yellowish) Accents
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: const Color(0xFF18181B),
    textTheme: const TextTheme(),
    iconTheme: const IconThemeData(color: Colors.white),
    colorScheme: const ColorScheme(
      brightness: Brightness.dark,
      primary: Colors.white,
      onPrimary: Color(0xFF18181B),
      secondary: Color(0xFFFFD700), // Gold accent
      onSecondary: Color(0xFF18181B),
      error: Color(0xFFEF4444),
      onError: Colors.white,
      surface: Color(0xFF232326),
      onSurface: Colors.white,
    ),
    dividerColor: const Color(0xFF27272A),
    hintColor: const Color(0xFF71717A),
    cardColor: const Color(0xFF232326),
    highlightColor: const Color(0xFF232326),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF18181B),
      foregroundColor: Colors.white,
      elevation: 0,
      iconTheme: IconThemeData(color: Colors.white),
    ),
    inputDecorationTheme: const InputDecorationTheme(
      fillColor: Color(0xFF232326),
      filled: true,
      border: OutlineInputBorder(
        borderSide: BorderSide(color: Color(0xFF27272A)),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(color: Color(0xFFFFD700)),
      ),
    ),
  );
}
