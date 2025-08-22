import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ScoreCard = ({ score, totalQuestions, answeredQuestions, contest }) => {
  const percentage = (score / (totalQuestions * 20)) * 100; // Assuming max 20 points per question
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! You\'re a master!';
    if (score >= 60) return 'Great job! Well done!';
    if (score >= 40) return 'Good effort! Keep practicing!';
    return 'Keep learning! You\'ll do better next time!';
  };

  const getScoreEmoji = (score) => {
    if (score >= 80) return '🏆';
    if (score >= 60) return '🎉';
    if (score >= 40) return '👍';
    return '💪';
  };

  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.scoreCard}
    >
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreTitle}>Your Score</Text>
        <Text style={styles.scoreEmoji}>{getScoreEmoji(percentage)}</Text>
      </View>
      
      <View style={styles.scoreDisplay}>
        <Text style={styles.scoreNumber}>{score}</Text>
        <Text style={styles.scoreLabel}>points</Text>
      </View>
      
      <View style={styles.scoreDetails}>
        <View style={styles.scoreDetailItem}>
          <Text style={styles.scoreDetailLabel}>Questions Answered</Text>
          <Text style={styles.scoreDetailValue}>{answeredQuestions}/{totalQuestions}</Text>
        </View>
        <View style={styles.scoreDetailItem}>
          <Text style={styles.scoreDetailLabel}>Accuracy</Text>
          <Text style={styles.scoreDetailValue}>{percentage.toFixed(1)}%</Text>
        </View>
      </View>
      
      <Text style={styles.scoreMessage}>{getScoreMessage(percentage)}</Text>
    </LinearGradient>
  );
};

const PerformanceChart = ({ score, totalQuestions }) => {
  const maxPossibleScore = totalQuestions * 20;
  const percentage = (score / maxPossibleScore) * 100;
  
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Master', color: '#10b981', icon: '🏆' };
    if (percentage >= 80) return { level: 'Expert', color: '#059669', icon: '⭐' };
    if (percentage >= 70) return { level: 'Advanced', color: '#0d9488', icon: '🎯' };
    if (percentage >= 60) return { level: 'Intermediate', color: '#f59e0b', icon: '🎉' };
    if (percentage >= 50) return { level: 'Beginner', color: '#f97316', icon: '🌱' };
    return { level: 'Novice', color: '#ef4444', icon: '💪' };
  };

  const performance = getPerformanceLevel(percentage);

  return (
    <View style={styles.performanceChart}>
      <Text style={styles.performanceTitle}>Performance Level</Text>
      
      <View style={styles.performanceDisplay}>
        <Text style={styles.performanceIcon}>{performance.icon}</Text>
        <View style={styles.performanceInfo}>
          <Text style={[styles.performanceLevel, { color: performance.color }]}>
            {performance.level}
          </Text>
          <Text style={styles.performancePercentage}>{percentage.toFixed(1)}%</Text>
        </View>
      </View>
      
      <View style={styles.performanceBar}>
        <View style={styles.performanceBarBackground}>
          <View
            style={[
              styles.performanceBarFill,
              { width: `${percentage}%`, backgroundColor: performance.color },
            ]}
          />
        </View>
        <Text style={styles.performanceBarText}>
          {score}/{maxPossibleScore} points
        </Text>
      </View>
    </View>
  );
};

const ShareSection = ({ score, contest, onShare }) => {
  const shareMessages = [
    `🎯 Just scored ${score} points in "${contest.title}" on YonuMeta! Can you beat my score?`,
    `🏆 Excited to share my contest results: ${score} points in ${contest.title}! Ready for the challenge?`,
    `💪 Completed "${contest.title}" with ${score} points! Think you can do better? Join the contest!`,
    `🚀 Amazing contest experience! Scored ${score} points in "${contest.title}". Your turn to shine!`,
  ];

  const handleShare = async (platform) => {
    const randomMessage = shareMessages[Math.floor(Math.random() * shareMessages.length)];
    
    try {
      if (platform === 'general') {
        await Share.share({
          message: randomMessage,
          title: 'My Contest Results',
        });
      } else {
        // For specific platforms, you would integrate with their SDKs
        Alert.alert(
          'Share to ' + platform,
          'This would open the ' + platform + ' app to share your results!',
          [
            { text: 'OK' },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share results');
    }
  };

  return (
    <View style={styles.shareSection}>
      <Text style={styles.shareTitle}>Share Your Achievement</Text>
      <Text style={styles.shareSubtitle}>
        Challenge your friends and create FOMO! 🚀
      </Text>
      
      <View style={styles.shareButtons}>
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: '#25D366' }]}
          onPress={() => handleShare('whatsapp')}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#fff" />
          <Text style={styles.shareButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: '#E4405F' }]}
          onPress={() => handleShare('instagram')}
        >
          <Ionicons name="logo-instagram" size={24} color="#fff" />
          <Text style={styles.shareButtonText}>Instagram</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: '#1DA1F2' }]}
          onPress={() => handleShare('twitter')}
        >
          <Ionicons name="logo-twitter" size={24} color="#fff" />
          <Text style={styles.shareButtonText}>Twitter</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.generalShareButton}
        onPress={() => handleShare('general')}
      >
        <Ionicons name="share-outline" size={20} color="#6366f1" />
        <Text style={styles.generalShareText}>Share to Other Apps</Text>
      </TouchableOpacity>
    </View>
  );
};

const NextSteps = ({ onViewLeaderboard, onJoinAnother }) => (
  <View style={styles.nextStepsSection}>
    <Text style={styles.nextStepsTitle}>What's Next?</Text>
    
    <TouchableOpacity style={styles.nextStepButton} onPress={onViewLeaderboard}>
      <View style={styles.nextStepIcon}>
        <Ionicons name="trophy-outline" size={24} color="#6366f1" />
      </View>
      <View style={styles.nextStepContent}>
        <Text style={styles.nextStepTitle}>View Leaderboard</Text>
        <Text style={styles.nextStepDescription}>
          See how you rank against other participants
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6366f1" />
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.nextStepButton} onPress={onJoinAnother}>
      <View style={styles.nextStepIcon}>
        <Ionicons name="add-circle-outline" size={24} color="#6366f1" />
      </View>
      <View style={styles.nextStepContent}>
        <Text style={styles.nextStepTitle}>Join Another Contest</Text>
        <Text style={styles.nextStepDescription}>
          Discover more exciting challenges
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6366f1" />
    </TouchableOpacity>
  </View>
);

export default function ResultsScreen({ route, navigation }) {
  const { contest, score = 0, totalQuestions = 5, answeredQuestions = 5 } = route.params;

  const handleViewLeaderboard = () => {
    navigation.navigate('Leaderboard', { contest, userScore: score });
  };

  const handleJoinAnother = () => {
    navigation.navigate('ContestHub');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contest Results</Text>
          <Text style={styles.headerSubtitle}>
            Congratulations on completing "{contest.title}"!
          </Text>
        </View>

        <ScoreCard
          score={score}
          totalQuestions={totalQuestions}
          answeredQuestions={answeredQuestions}
          contest={contest}
        />

        <PerformanceChart score={score} totalQuestions={totalQuestions} />

        <ShareSection
          score={score}
          contest={contest}
          onShare={() => {}}
        />

        <NextSteps
          onViewLeaderboard={handleViewLeaderboard}
          onJoinAnother={handleJoinAnother}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thanks for participating! Your results have been recorded.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
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
  scoreCard: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  scoreEmoji: {
    fontSize: 24,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  scoreDetailItem: {
    alignItems: 'center',
  },
  scoreDetailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  performanceChart: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  performanceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  performanceInfo: {
    flex: 1,
  },
  performanceLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  performancePercentage: {
    fontSize: 16,
    color: '#64748b',
  },
  performanceBar: {
    marginBottom: 12,
  },
  performanceBarBackground: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceBarText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  shareSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  shareSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  generalShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  generalShareText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 8,
  },
  nextStepsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  nextStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  nextStepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  nextStepDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
