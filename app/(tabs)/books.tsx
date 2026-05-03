import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

// Dummy data for books
const popularBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Cormen",
    color: "#3B82F6",
    available: true,
  },
  {
    id: 2,
    title: "Operating System Concepts",
    author: "Silberschatz",
    color: "#8B5CF6",
    available: false,
  },
  {
    id: 3,
    title: "Computer Networks",
    author: "Tanenbaum",
    color: "#10B981",
    available: true,
  },
  {
    id: 4,
    title: "Database Systems",
    author: "Navathe",
    color: "#F97316",
    available: true,
  },
];

const allBooks = [
  {
    id: 5,
    title: "Data Structures",
    author: "Knuth",
    subject: "Computer Science",
    color: "#3B82F6",
    abbreviation: "DS",
    copies: 2,
    available: true,
  },
  {
    id: 6,
    title: "Linear Algebra",
    author: "Strang",
    subject: "Mathematics",
    color: "#8B5CF6",
    abbreviation: "LA",
    copies: 1,
    available: false,
  },
  {
    id: 7,
    title: "Quantum Physics",
    author: "Griffiths",
    subject: "Physics",
    color: "#10B981",
    abbreviation: "QP",
    copies: 3,
    available: true,
  },
  {
    id: 8,
    title: "Shakespeare",
    author: "William Shakespeare",
    subject: "Literature",
    color: "#F97316",
    abbreviation: "WS",
    copies: 2,
    available: true,
  },
  {
    id: 9,
    title: "Mechanical Engineering",
    author: "Hibbeler",
    subject: "Engineering",
    color: "#EF4444",
    abbreviation: "ME",
    copies: 1,
    available: false,
  },
  {
    id: 10,
    title: "Artificial Intelligence",
    author: "Russell",
    subject: "Computer Science",
    color: "#06B6D4",
    abbreviation: "AI",
    copies: 4,
    available: true,
  },
  {
    id: 11,
    title: "Calculus",
    author: "Stewart",
    subject: "Mathematics",
    color: "#84CC16",
    abbreviation: "CL",
    copies: 2,
    available: true,
  },
  {
    id: 12,
    title: "Thermodynamics",
    author: "Cengel",
    subject: "Physics",
    color: "#F59E0B",
    abbreviation: "TD",
    copies: 1,
    available: false,
  },
];

const categories = [
  "All",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Literature",
  "Engineering",
];

export default function BooksScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBookPress = (bookId: number) => {
    router.push("/book-detail");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Books</Text>
            <Search size={24} color="#00A896" />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#7B8FA8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title or author..."
              placeholderTextColor="#7B8FA8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.activeCategoryChip,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Popular Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Currently Popular</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.popularScroll}
              contentContainerStyle={styles.popularContent}
            >
              {popularBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  style={styles.popularCard}
                  onPress={() => handleBookPress(book.id)}
                >
                  <View
                    style={[styles.bookCover, { backgroundColor: book.color }]}
                  />
                  <Text style={styles.popularBookTitle} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <Text style={styles.popularAuthor}>{book.author}</Text>
                  <View
                    style={[
                      styles.availabilityChip,
                      {
                        backgroundColor: book.available ? "#27AE60" : "#E74C3C",
                      },
                    ]}
                  >
                    <Text style={styles.availabilityText}>
                      {book.available ? "Available" : "Issued"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* All Books Section */}
          <View style={styles.section}>
            <Text style={styles.allBooksTitle}>All Books</Text>
            {allBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                onPress={() => handleBookPress(book.id)}
              >
                <View
                  style={[
                    styles.bookCoverSmall,
                    { backgroundColor: book.color },
                  ]}
                >
                  <Text style={styles.bookAbbreviation}>
                    {book.abbreviation}
                  </Text>
                </View>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <View style={styles.subjectChip}>
                    <Text style={styles.subjectText}>{book.subject}</Text>
                  </View>
                </View>
                <View style={styles.bookMeta}>
                  <View
                    style={[
                      styles.availabilityPill,
                      {
                        backgroundColor: book.available ? "#27AE60" : "#E74C3C",
                      },
                    ]}
                  >
                    <Text style={styles.availabilityText}>
                      {book.available ? "Available" : "Issued"}
                    </Text>
                  </View>
                  <Text style={styles.copiesText}>{book.copies} copies</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0D1B2A",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#132333",
    borderWidth: 1,
    borderColor: "#1e3448",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: "#132333",
    borderWidth: 1,
    borderColor: "#1e3448",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  activeCategoryChip: {
    backgroundColor: "#00A896",
    borderColor: "#00A896",
  },
  categoryText: {
    color: "#7B8FA8",
    fontSize: 12,
    fontWeight: "600",
  },
  activeCategoryText: {
    color: "#0D1B2A",
    fontWeight: "700",
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#00A896",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  seeAllText: {
    color: "#7B8FA8",
    fontSize: 12,
  },
  popularScroll: {
    marginLeft: 16,
  },
  popularContent: {
    gap: 12,
    paddingRight: 16,
  },
  popularCard: {
    width: 130,
    backgroundColor: "#132333",
    borderWidth: 1,
    borderColor: "#1e3448",
    borderRadius: 14,
    padding: 12,
  },
  bookCover: {
    width: 106,
    height: 80,
    borderRadius: 8,
  },
  popularBookTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  popularAuthor: {
    color: "#7B8FA8",
    fontSize: 11,
    marginTop: 3,
  },
  availabilityChip: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  availabilityText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  allBooksTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bookCard: {
    backgroundColor: "#132333",
    borderWidth: 1,
    borderColor: "#1e3448",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    gap: 12,
  },
  bookCoverSmall: {
    width: 52,
    height: 68,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bookAbbreviation: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  bookAuthor: {
    color: "#7B8FA8",
    fontSize: 12,
    marginTop: 2,
  },
  subjectChip: {
    backgroundColor: "#1e3448",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  subjectText: {
    color: "#7B8FA8",
    fontSize: 10,
  },
  bookMeta: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  availabilityPill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copiesText: {
    color: "#7B8FA8",
    fontSize: 10,
    marginTop: 4,
  },
});
