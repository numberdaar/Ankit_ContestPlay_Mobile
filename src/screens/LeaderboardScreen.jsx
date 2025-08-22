import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TopThreePodium = ({ topThree, currentUser }) => (
  <View style={styles.podiumContainer}>
    <View style={styles.podiumHeader}>
      <Text style={styles.podiumTitle}>Top Performers</Text>
      <Text style={styles.podiumSubtitle}>Leading the competition</Text>
    </View>
    
    <View style={styles.podium}>
      {/* Second Place */}
      {topThree[1] && (
        <View style={[styles.podiumPosition, styles.secondPlace]}>
          <View style={styles.podiumMedal}>
            <Text style={styles.medalEmoji}>🥈</Text>
          </View>
          <Text style={styles.podiumRank}>2</Text>
          <Image
            source={{ uri: topThree[1].avatar || 'https://via.placeholder.com/60x60/6366f1/ffffff?text=U' }}
            style={styles.podiumAvatar}
          />
          <Text style={styles.podiumName} numberOfLines={1}>
            {topThree[1].name}
          </Text>
          <Text style={styles.podiumScore}>{topThree[1].score}</Text>
          <Text style={styles.podiumScoreLabel}>pts</Text>
        </View>
      )}
      
      {/* First Place */}
      {topThree[0] && (
        <View style={[styles.podiumPosition, styles.firstPlace]}>
          <View style={styles.podiumMedal}>
            <Text style={styles.medalEmoji}>👑</Text>
          </View>
          <Text style={styles.podiumRank}>1</Text>
          <Image
            source={{ uri: topThree[0].avatar || 'https://via.placeholder.com/60x60/f59e0b/ffffff?text=U' }}
            style={styles.podiumAvatar}
          />
          <Text style={styles.podiumName} numberOfLines={1}>
            {topThree[0].name}
          </Text>
          <Text style={styles.podiumScore}>{topThree[0].score}</Text>
          <Text style={styles.podiumScoreLabel}>pts</Text>
        </View>
      )}
      
      {/* Third Place */}
      {topThree[2] && (
        <View style={[styles.podiumPosition, styles.thirdPlace]}>
          <View style={styles.podiumMedal}>
            <Text style={styles.medalEmoji}>🥉</Text>
          </View>
          <Text style={styles.podiumRank}>3</Text>
          <Image
            source={{ uri: topThree[2].avatar || 'https://via.placeholder.com/60x60/10b981/ffffff?text=U' }}
            style={styles.podiumAvatar}
          />
          <Text style={styles.podiumName} numberOfLines={1}>
            {topThree[2].name}
          </Text>
          <Text style={styles.podiumScore}>{topThree[2].score}</Text>
          <Text style={styles.podiumScoreLabel}>pts</Text>
        </View>
      )}
    </View>
  </View>
);

const LeaderboardItem = ({ participant, index, isCurrentUser, onPress }) => (
  <TouchableOpacity
    style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}
    onPress={onPress}
  >
    <View style={styles.rankContainer}>
      {index < 3 ? (
        <View style={[styles.topRankBadge, { backgroundColor: getTopRankColor(index) }]}>
          <Text style={styles.topRankText}>#{index + 1}</Text>
        </View>
      ) : (
        <Text style={styles.rankText}>#{index + 1}</Text>
      )}
    </View>
    
    <Image
      source={{ uri: participant.avatar || 'https://via.placeholder.com/40x40/6366f1/ffffff?text=U' }}
      style={styles.participantAvatar}
    />
    
    <View style={styles.participantInfo}>
      <Text style={[
        styles.participantName,
        isCurrentUser && styles.currentUserName,
      ]}>
        {participant.name}
      </Text>
      {isCurrentUser && (
        <Text style={styles.currentUserLabel}>You</Text>
      )}
      <Text style={styles.participantLocation}>
        {participant.location || 'Unknown Location'}
      </Text>
    </View>
    
    <View style={styles.scoreContainer}>
      <Text style={[
        styles.scoreText,
        isCurrentUser && styles.currentUserScoreText,
      ]}>
        {participant.score}
      </Text>
      <Text style={styles.scoreLabel}>pts</Text>
      
      {participant.badge && (
        <View style={[styles.badge, { backgroundColor: getBadgeColor(participant.badge) }]}>
          <Text style={styles.badgeText}>{participant.badge}</Text>
        </View>
      )}
    </View>
    
    {isCurrentUser && (
      <View style={styles.currentUserIndicator}>
        <Ionicons name="star" size={16} color="#f59e0b" />
      </View>
    )}
  </TouchableOpacity>
);

const getTopRankColor = (index) => {
  const colors = ['#f59e0b', '#6366f1', '#10b981'];
  return colors[index] || '#6b7280';
};

const getBadgeColor = (badge) => {
  const badgeColors = {
    'Speed Demon': '#ef4444',
    'Accuracy Master': '#10b981',
    'Perfect Score': '#f59e0b',
    'First Timer': '#6366f1',
    'Comeback King': '#8b5cf6',
  };
  return badgeColors[badge] || '#6b7280';
};

export default function LeaderboardScreen({ route, navigation }) {
  const [selectedContest, setSelectedContest] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Mock data for demonstration
  const mockContests = [
    {
      id: '1',
      title: 'Tech Trivia Challenge',
      category: 'Technology',
      participants: 1250,
    },
    {
      id: '2',
      title: 'Creative Photography Contest',
      category: 'Art',
      participants: 890,
    },
    {
      id: '3',
      title: 'Math Puzzle Championship',
      category: 'Education',
      participants: 567,
    },
  ];

  const mockLeaderboard = [
    {
      id: '1',
      name: 'Alex Johnson',
      score: 95,
      avatar: 'https://via.placeholder.com/40x40/6366f1/ffffff?text=A',
      location: 'San Francisco, CA',
      badge: 'Perfect Score',
      isCurrentUser: false,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      score: 92,
      avatar: 'https://via.placeholder.com/40x40/10b981/ffffff?text=S',
      location: 'New York, NY',
      badge: 'Accuracy Master',
      isCurrentUser: false,
    },
    {
      id: '3',
      name: 'Mike Davis',
      score: 89,
      avatar: 'https://via.placeholder.com/40x40/f59e0b/ffffff?text=M',
      location: 'Austin, TX',
      badge: 'Speed Demon',
      isCurrentUser: false,
    },
    {
      id: '4',
      name: 'Emma Wilson',
      score: 87,
      avatar: 'https://via.placeholder.com/40x40/ef4444/ffffff?text=E',
      location: 'Seattle, WA',
      isCurrentUser: false,
    },
    {
      id: '5',
      name: 'David Lee',
      score: 85,
      avatar: 'https://via.placeholder.com/40x40/8b5cf6/ffffff?text=D',
      location: 'Boston, MA',
      isCurrentUser: false,
    },
    {
      id: '6',
      name: 'Lisa Rodriguez',
      score: 83,
      avatar: 'https://via.placeholder.com/40x40/06b6d4/ffffff?text=L',
      location: 'Miami, FL',
      isCurrentUser: false,
    },
    {
      id: '7',
      name: 'James Brown',
      score: 81,
      avatar: 'https://via.placeholder.com/40x40/84cc16/ffffff?text=J',
      location: 'Chicago, IL',
      isCurrentUser: false,
    },
    {
      id: '8',
      name: 'You',
      score: 78,
      avatar: 'https://via.placeholder.com/40x40/f59e0b/ffffff?text=Y',
      location: 'Your Location',
      isCurrentUser: true,
    },
    {
      id: '9',
      name: 'Anna Kim',
      score: 76,
      avatar: 'https://via.placeholder.com/40x40/ec4899/ffffff?text=A',
      location: 'Portland, OR',
      isCurrentUser: false,
    },
    {
      id: '10',
      name: 'Tom Anderson',
      score: 74,
      avatar: 'https://via.placeholder.com/40x40/14b8a6/ffffff?text=T',
      location: 'Denver, CO',
      isCurrentUser: false,
    },
  ];

  useEffect(() => {
    // Set default contest and leaderboard data
    if (mockContests.length > 0) {
      setSelectedContest(mockContests[0]);
      setLeaderboardData(mockLeaderboard);
      
      // Find current user
      const currentUserData = mockLeaderboard.find(p => p.isCurrentUser);
      if (currentUserData) {
        setCurrentUser(currentUserData);
      }
    }
  }, []);

  const handleContestSelect = (contest) => {
    setSelectedContest(contest);
    // In a real app, you would fetch leaderboard data for the selected contest
  };

  const handleParticipantPress = (participant) => {
    // In a real app, you might show participant details or profile
    console.log('Participant pressed:', participant.name);
  };

  const topThree = leaderboardData.slice(0, 3);
  const remainingParticipants = leaderboardData.slice(3);

  if (!selectedContest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>See how you rank against others</Text>
      </View>

      {/* Contest Selector */}
      <View style={styles.contestSelector}>
        <Text style={styles.contestSelectorTitle}>Select Contest</Text>
        <FlatList
          horizontal
          data={mockContests}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.contestOption,
                selectedContest.id === item.id && styles.selectedContestOption,
              ]}
              onPress={() => handleContestSelect(item)}
            >
              <Text style={[
                styles.contestOptionText,
                selectedContest.id === item.id && styles.selectedContestOptionText,
              ]}>
                {item.title}
              </Text>
              <Text style={[
                styles.contestOptionCategory,
                selectedContest.id === item.id && styles.selectedContestOptionCategory,
              ]}>
                {item.category}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.contestSelectorContent}
        />
      </View>

      {/* Contest Info */}
      <View style={styles.contestInfo}>
        <View style={styles.contestInfoLeft}>
          <Text style={styles.contestName}>{selectedContest.title}</Text>
          <Text style={styles.contestCategory}>{selectedContest.category}</Text>
        </View>
        <View style={styles.contestInfoRight}>
          <Ionicons name="people-outline" size={20} color="#6366f1" />
          <Text style={styles.participantCount}>
            {selectedContest.participants.toLocaleString()} participants
          </Text>
        </View>
      </View>

      {/* Top Three Podium */}
      <TopThreePodium topThree={topThree} currentUser={currentUser} />

      {/* Full Leaderboard */}
      <View style={styles.leaderboardSection}>
        <View style={styles.leaderboardHeader}>
          <Text style={styles.leaderboardTitle}>All Participants</Text>
          <Text style={styles.leaderboardSubtitle}>
            {leaderboardData.length} total participants
          </Text>
        </View>

        <FlatList
          data={remainingParticipants}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LeaderboardItem
              participant={item}
              index={index + 3} // +3 because top 3 are shown in podium
              isCurrentUser={item.isCurrentUser}
              onPress={() => handleParticipantPress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.leaderboardList}
        />
      </View>

      {/* Current User Summary */}
      {currentUser && (
        <View style={styles.currentUserSummary}>
          <View style={styles.currentUserInfo}>
            <Text style={styles.currentUserTitle}>Your Performance</Text>
            <Text style={styles.currentUserRank}>
              Rank #{leaderboardData.findIndex(p => p.isCurrentUser) + 1} of {leaderboardData.length}
            </Text>
          </View>
          <View style={styles.currentUserScore}>
            <Text style={styles.currentUserScoreValue}>{currentUser.score}</Text>
            <Text style={styles.currentUserScoreLabel}>points</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  contestSelector: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  contestSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  contestSelectorContent: {
    paddingHorizontal: 20,
  },
  contestOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedContestOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  contestOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedContestOptionText: {
    color: '#fff',
  },
  contestOptionCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  selectedContestOptionCategory: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  contestInfoLeft: {
    flex: 1,
  },
  contestName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  contestCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  contestInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantCount: {
    fontSize: 14,
    color: '#6366f1',
    marginLeft: 8,
    fontWeight: '500',
  },
  podiumContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  podiumHeader: {
    marginBottom: 20,
  },
  podiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  podiumSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 200,
  },
  podiumPosition: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  firstPlace: {
    height: 180,
  },
  secondPlace: {
    height: 150,
  },
  thirdPlace: {
    height: 120,
  },
  podiumMedal: {
    marginBottom: 8,
  },
  medalEmoji: {
    fontSize: 24,
  },
  podiumRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: 80,
  },
  podiumScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  podiumScoreLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  leaderboardSection: {
    backgroundColor: '#fff',
    flex: 1,
  },
  leaderboardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  leaderboardList: {
    padding: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserItem: {
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  topRankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  currentUserName: {
    color: '#92400e',
  },
  currentUserLabel: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
    marginBottom: 2,
  },
  participantLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  currentUserScoreText: {
    color: '#92400e',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  currentUserIndicator: {
    marginLeft: 8,
  },
  currentUserSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  currentUserInfo: {
    flex: 1,
  },
  currentUserTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  currentUserRank: {
    fontSize: 14,
    color: '#64748b',
  },
  currentUserScore: {
    alignItems: 'center',
  },
  currentUserScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  currentUserScoreLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
});
