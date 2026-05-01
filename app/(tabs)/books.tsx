import { StyleSheet, Text, View } from 'react-native';

export default function BooksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Books</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});
