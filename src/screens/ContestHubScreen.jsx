import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockContests = [
  {
    id: '1',
    title: 'Tech Trivia Challenge',
    description: 'Test your knowledge in technology and win amazing prizes!',
    image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Tech+Trivia',
    participants: 1250,
    entryFee: 5,
    isFree: false,
    endDate: '2024-02-15',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Creative Photography Contest',
    description: 'Showcase your photography skills and creativity',
    image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Photography',
    participants: 890,
    entryFee: 0,
    isFree: true,
    endDate: '2024-02-20',
    category: 'Art',
  },
  {
    id: '3',
    title: 'Math Puzzle Championship',
    description: 'Solve complex mathematical puzzles against the clock',
    image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Math+Puzzle',
    participants: 567,
    entryFee: 10,
    isFree: false,
    endDate: '2024-02-25',
    category: 'Education',
  },
  {
    id: '4',
    title: 'Gaming Tournament',
    description: 'Compete in the ultimate mobile gaming championship',
    image: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Gaming',
    participants: 2100,
    entryFee: 15,
    isFree: false,
    endDate: '2024-03-01',
    category: 'Gaming',
  },
];

const ContestCard = ({ contest, onPress }) => (
  <TouchableOpacity style={styles.contestCard} onPress={onPress}>
    <Image source={{ uri: contest.image }} style={styles.contestImage} />
    <View style={styles.contestInfo}>
      <View style={styles.contestHeader}>
        <Text style={styles.contestTitle}>{contest.title}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(contest.category) }]}>
          <Text style={styles.categoryText}>{contest.category}</Text>
        </View>
      </View>
      <Text style={styles.contestDescription} numberOfLines={2}>
        {contest.description}
      </Text>
      <View style={styles.contestMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>{contest.participants.toLocaleString()}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>{contest.endDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="card-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>
            {contest.isFree ? 'Free' : `$${contest.entryFee}`}
          </Text>
        </View>
      </View>
      <View style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#6366f1" />
      </View>
    </View>
  </TouchableOpacity>
);

const getCategoryColor = (category) => {
  const colors = {
    Technology: '#6366f1',
    Art: '#10b981',
    Education: '#f59e0b',
    Gaming: '#ef4444',
  };
  return colors[category] || '#6b7280';
};

export default function ContestHubScreen({ navigation }) {
  const [contests] = useState(mockContests);

  const handleContestPress = (contest) => {
    navigation.navigate('ContestDetail', { contest });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Contests</Text>
        <Text style={styles.headerSubtitle}>Join exciting challenges and win prizes</Text>
      </View>
      
      <FlatList
        data={contests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContestCard contest={item} onPress={() => handleContestPress(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  listContainer: {
    padding: 16,
  },
  contestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contestImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contestInfo: {
    padding: 16,
  },
  contestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contestDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  contestMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginRight: 4,
  },
});
