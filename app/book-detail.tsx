import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function BookDetailScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const dummyBook = {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    abbreviation: 'CLRS',
    subject: 'Computer Science',
    isAvailable: true,
    totalCopies: 3,
    availableCopies: 2,
    location: 'Shelf B — Row 3',
    description: 'A comprehensive introduction to algorithms and data structures. Covers sorting, searching, graph algorithms, and dynamic programming with detailed mathematical analysis.',
  };

  const similarBooks = [
    { id: '2', title: 'Data Structures', author: 'Mark Allen', abbreviation: 'DS' },
    { id: '3', title: 'Algorithm Design', author: 'Kleinberg', abbreviation: 'AD' },
    { id: '4', title: 'Computer Algorithms', author: 'Horowitz', abbreviation: 'CA' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Book Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.bookCover}>
              <Text style={styles.bookAbbreviation}>{dummyBook.abbreviation}</Text>
            </View>
            <Text style={styles.bookTitle}>{dummyBook.title}</Text>
            <Text style={styles.bookAuthor}>{dummyBook.author}</Text>
            <View style={styles.subjectChip}>
              <Text style={styles.subjectText}>{dummyBook.subject}</Text>
            </View>
          </View>

          {/* Availability Card */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Availability</Text>
              <View style={[styles.statusPill, dummyBook.isAvailable ? styles.availablePill : styles.issuedPill]}>
                <Text style={[styles.statusText, dummyBook.isAvailable ? styles.availableText : styles.issuedText]}>
                  {dummyBook.isAvailable ? 'Available' : 'Issued'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Total copies</Text>
              <Text style={styles.cardValue}>{dummyBook.totalCopies} copies</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Available copies</Text>
              <Text style={[styles.cardValue, { color: '#00A896' }]}>{dummyBook.availableCopies} available</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Location</Text>
              <Text style={styles.cardValue}>{dummyBook.location}</Text>
            </View>
          </View>

          {/* Description Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About this book</Text>
            <Text style={styles.description}>{dummyBook.description}</Text>
          </View>

          {/* Similar Books Section */}
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>Similar Books</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarScrollContent}
            >
              {similarBooks.map((book) => (
                <View key={book.id} style={styles.similarBookCard}>
                  <View style={styles.similarBookCover}>
                    <Text style={styles.similarBookAbbreviation}>{book.abbreviation}</Text>
                  </View>
                  <Text style={styles.similarBookTitle} numberOfLines={1}>{book.title}</Text>
                  <Text style={styles.similarBookAuthor} numberOfLines={1}>{book.author}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.wishlistButton}>
            <Text style={styles.wishlistButtonText}>Add to Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.issueButton}>
            <Text style={styles.issueButtonText}>Issue Request</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#00A896',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    backgroundColor: '#132333',
    padding: 24,
    alignItems: 'center',
  },
  bookCover: {
    width: 120,
    height: 160,
    backgroundColor: '#1565C0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookAbbreviation: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#7B8FA8',
    textAlign: 'center',
    marginTop: 4,
  },
  subjectChip: {
    backgroundColor: '#1e3448',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  subjectText: {
    fontSize: 12,
    color: '#7B8FA8',
  },
  card: {
    backgroundColor: '#132333',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e3448',
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#7B8FA8',
  },
  cardValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availablePill: {
    backgroundColor: '#10B981',
  },
  issuedPill: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: 'white',
  },
  issuedText: {
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#1e3448',
    marginHorizontal: -16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#7B8FA8',
    lineHeight: 20,
  },
  similarSection: {
    padding: 16,
  },
  similarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  similarScrollContent: {
    paddingRight: 16,
  },
  similarBookCard: {
    backgroundColor: '#132333',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
  },
  similarBookCover: {
    width: 60,
    height: 80,
    backgroundColor: '#1565C0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  similarBookAbbreviation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  similarBookTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  similarBookAuthor: {
    fontSize: 10,
    color: '#7B8FA8',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0D1B2A',
    borderTopWidth: 1,
    borderTopColor: '#1e3448',
    padding: 16,
    flexDirection: 'row',
    gap: 10,
  },
  wishlistButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00A896',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButtonText: {
    color: '#00A896',
    fontSize: 14,
    fontWeight: '600',
  },
  issueButton: {
    flex: 1,
    backgroundColor: '#00A896',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueButtonText: {
    color: '#0D1B2A',
    fontSize: 14,
    fontWeight: '700',
  },
});
