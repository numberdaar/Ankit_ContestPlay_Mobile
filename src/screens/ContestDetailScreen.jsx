import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * TabButton Component
 * Renders a clickable tab button with active/inactive states
 * @param {string} title - The text to display on the tab
 * @param {boolean} isActive - Whether this tab is currently selected
 * @param {function} onPress - Function to call when tab is pressed
 */
const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.activeTabButton]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

/**
 * DetailsTab Component
 * Displays the main contest information including image, description, and join button
 * @param {object} contest - Contest data object containing all contest information
 * @param {function} onJoinPress - Function to handle when join button is pressed
 */
const DetailsTab = ({ contest, onJoinPress }) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    {/* Contest Image - Using dummy image for demonstration */}
    <Image 
      source={require('../../assets/images/contest1.jpg')} 
      style={styles.contestImage} 
      defaultSource={require('../../assets/images/contest1.jpg')}
    />
    
    <View style={styles.detailsContainer}>
      {/* Contest Header with Title and Category Badge */}
      <View style={styles.contestHeader}>
        <Text style={styles.contestTitle}>{contest.title}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(contest.category) }]}>
          <Text style={styles.categoryText}>{contest.category}</Text>
        </View>
      </View>
      
      {/* Contest Description */}
      <Text style={styles.contestDescription}>{contest.description}</Text>
      
      {/* Information Grid showing key contest details */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={24} color="#6366f1" />
          <Text style={styles.infoLabel}>End Date</Text>
          <Text style={styles.infoValue}>{contest.endDate}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="people-outline" size={24} color="#6366f1" />
          <Text style={styles.infoLabel}>Participants</Text>
          <Text style={styles.infoValue}>{contest.participants.toLocaleString()}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="trophy-outline" size={24} color="#6366f1" />
          <Text style={styles.infoLabel}>Entry Fee</Text>
          <Text style={styles.infoValue}>
            {contest.isFree ? 'Free' : `$${contest.entryFee}`}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={24} color="#6366f1" />
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>30 mins</Text>
        </View>
      </View>
      
      {/* Join Contest Button */}
      <TouchableOpacity style={styles.joinButton} onPress={onJoinPress}>
        <Text style={styles.joinButtonText}>Join Now</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </ScrollView>
);

/**
 * LeaderboardTab Component
 * Displays the current contest rankings with user highlighting
 * @param {object} contest - Contest data object
 */
const LeaderboardTab = ({ contest }) => {
  // Mock leaderboard data - in real app this would come from API
  const mockLeaderboard = [
    { rank: 1, name: 'Alex Johnson', score: 95, isCurrentUser: false },
    { rank: 2, name: 'Sarah Chen', score: 92, isCurrentUser: false },
    { rank: 3, name: 'Mike Davis', score: 89, isCurrentUser: false },
    { rank: 15, name: 'You', score: 78, isCurrentUser: true },
    { rank: 4, name: 'Emma Wilson', score: 87, isCurrentUser: false },
    { rank: 5, name: 'David Lee', score: 85, isCurrentUser: false },
  ];

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.leaderboardContainer}>
        {/* Leaderboard Header */}
        <View style={styles.leaderboardHeader}>
          <Text style={styles.leaderboardTitle}>Top Participants</Text>
          <Text style={styles.leaderboardSubtitle}>Current standings</Text>
        </View>
        
        {/* Render each participant in the leaderboard */}
        {mockLeaderboard.map((participant, index) => (
          <View
            key={index}
            style={[
              styles.leaderboardItem,
              participant.isCurrentUser && styles.currentUserItem,
            ]}
          >
            {/* Rank Display */}
            <View style={styles.rankContainer}>
              <Text style={[
                styles.rankText,
                participant.rank <= 3 && styles.topRankText,
                participant.isCurrentUser && styles.currentUserRankText,
              ]}>
                #{participant.rank}
              </Text>
            </View>
            
            {/* Participant Information */}
            <View style={styles.participantInfo}>
              <Text style={[
                styles.participantName,
                participant.isCurrentUser && styles.currentUserName,
              ]}>
                {participant.name}
              </Text>
              {participant.isCurrentUser && (
                <Text style={styles.currentUserLabel}>You</Text>
              )}
            </View>
            
            {/* Score Display */}
            <View style={styles.scoreContainer}>
              <Text style={[
                styles.scoreText,
                participant.isCurrentUser && styles.currentUserScoreText,
              ]}>
                {participant.score}
              </Text>
              <Text style={styles.scoreLabel}>pts</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

/**
 * RulesTab Component
 * Displays contest rules, eligibility, and terms in organized sections
 * @param {object} contest - Contest data object
 */
const RulesTab = ({ contest }) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <View style={styles.rulesContainer}>
      {/* Eligibility Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eligibility</Text>
        <Text style={styles.sectionText}>
          • Open to participants aged 13 and above{'\n'}
          • Must have a valid account on the platform{'\n'}
          • One entry per person per contest{'\n'}
          • Employees and immediate family members are not eligible
        </Text>
      </View>
      
      {/* Judging Criteria Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Judging Criteria</Text>
        <Text style={styles.sectionText}>
          • Accuracy of answers: 60%{'\n'}
          • Speed of completion: 25%{'\n'}
          • Bonus points for early submission: 15%
        </Text>
      </View>
      
      {/* Terms & Conditions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        <Text style={styles.sectionText}>
          • All decisions made by judges are final{'\n'}
          • Prizes are non-transferable{'\n'}
          • Platform reserves the right to modify rules{'\n'}
          • Cheating or manipulation will result in disqualification
        </Text>
      </View>
      
      {/* Prize Distribution Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prize Distribution</Text>
        <Text style={styles.sectionText}>
          • 1st Place: $500 + Trophy{'\n'}
          • 2nd Place: $300 + Medal{'\n'}
          • 3rd Place: $200 + Certificate{'\n'}
          • Top 10: Recognition badges
        </Text>
      </View>
    </View>
  </ScrollView>
);

/**
 * Main ContestDetailScreen Component
 * Manages the tab navigation and renders appropriate content based on active tab
 * @param {object} route - Navigation route object containing contest data
 * @param {object} navigation - Navigation object for screen transitions
 */
export default function ContestDetailScreen({ route, navigation }) {
  // Extract contest data from navigation route
  const { contest } = route.params;
  
  // State to track which tab is currently active
  const [activeTab, setActiveTab] = useState('details');

  /**
   * Handles the join button press
   * Routes to ContestPlay for free contests or Payment for paid contests
   */
  const handleJoinPress = () => {
    if (contest.isFree) {
      navigation.navigate('ContestPlay', { contest });
    } else {
      navigation.navigate('Payment', { contest });
    }
  };

  /**
   * Renders the appropriate tab content based on activeTab state
   * @returns {JSX.Element} The component to render for the active tab
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab contest={contest} onJoinPress={handleJoinPress} />;
      case 'leaderboard':
        return <LeaderboardTab contest={contest} />;
      case 'rules':
        return <RulesTab contest={contest} />;
      default:
        return <DetailsTab contest={contest} onJoinPress={handleJoinPress} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation Bar */}
      <View style={styles.tabContainer}>
        <TabButton
          title="Details"
          isActive={activeTab === 'details'}
          onPress={() => setActiveTab('details')}
        />
        <TabButton
          title="Leaderboard"
          isActive={activeTab === 'leaderboard'}
          onPress={() => setActiveTab('leaderboard')}
        />
        <TabButton
          title="Rules"
          isActive={activeTab === 'rules'}
          onPress={() => setActiveTab('rules')}
        />
      </View>
      
      {/* Render the active tab content */}
      {renderTabContent()}
    </SafeAreaView>
  );
}

/**
 * Utility function to get category-specific colors
 * @param {string} category - The contest category
 * @returns {string} Hex color code for the category
 */
const getCategoryColor = (category) => {
  const colors = {
    Technology: '#6366f1',
    Art: '#10b981',
    Education: '#f59e0b',
    Gaming: '#ef4444',
  };
  return colors[category] || '#6b7280';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  contestImage: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: 20,
  },
  contestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contestDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  infoItem: {
    width: (width - 60) / 2,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    } : Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    } : {
      elevation: 2,
    }),
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 8px rgba(99, 102, 241, 0.3)',
    } : Platform.OS === 'ios' ? {
      shadowColor: '#6366f1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    } : {
      elevation: 4,
    }),
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  leaderboardContainer: {
    padding: 20,
  },
  leaderboardHeader: {
    marginBottom: 24,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    } : Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    } : {
      elevation: 2,
    }),
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
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
  },
  topRankText: {
    color: '#f59e0b',
  },
  currentUserRankText: {
    color: '#f59e0b',
  },
  participantInfo: {
    flex: 1,
    marginLeft: 16,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  currentUserName: {
    color: '#92400e',
  },
  currentUserLabel: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  currentUserScoreText: {
    color: '#92400e',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  rulesContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    } : Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    } : {
      elevation: 2,
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});
