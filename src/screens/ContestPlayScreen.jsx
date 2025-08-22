import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const Timer = ({ timeLeft, totalTime, onTimeUp }) => {
  const progress = timeLeft / totalTime;
  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerHeader}>
        <Ionicons name="time-outline" size={20} color="#6366f1" />
        <Text style={styles.timerText}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Text>
      </View>
      <View style={styles.timerBar}>
        <Animated.View
          style={[
            styles.timerProgress,
            {
              width,
              backgroundColor: progress > 0.3 ? '#6366f1' : progress > 0.1 ? '#f59e0b' : '#ef4444',
            },
          ]}
        />
      </View>
    </View>
  );
};

const ProgressBar = ({ currentQuestion, totalQuestions }) => {
  const progress = (currentQuestion + 1) / totalQuestions;
  
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Question {currentQuestion + 1} of {totalQuestions}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` },
          ]}
        />
      </View>
    </View>
  );
};

const QuestionCard = ({ question, onAnswer, selectedAnswer, isAnswered }) => {
  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'multiple_choice':
        return 'list-outline';
      case 'true_false':
        return 'checkmark-circle-outline';
      case 'short_answer':
        return 'chatbubble-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption,
                  isAnswered && option === question.correctAnswer && styles.correctOption,
                  isAnswered && selectedAnswer === option && option !== question.correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => onAnswer(option)}
                disabled={isAnswered}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText,
                  isAnswered && option === question.correctAnswer && styles.correctOptionText,
                  isAnswered && selectedAnswer === option && option !== question.correctAnswer && styles.incorrectOptionText,
                ]}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
                {isAnswered && option === question.correctAnswer && (
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                )}
                {isAnswered && selectedAnswer === option && option !== question.correctAnswer && (
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'true_false':
        return (
          <View style={styles.optionsContainer}>
            {['True', 'False'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption,
                  isAnswered && option === question.correctAnswer && styles.correctOption,
                  isAnswered && selectedAnswer === option && option !== question.correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => onAnswer(option)}
                disabled={isAnswered}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText,
                  isAnswered && option === question.correctAnswer && styles.correctOptionText,
                  isAnswered && selectedAnswer === option && option !== question.correctAnswer && styles.incorrectOptionText,
                ]}>
                  {option}
                </Text>
                {isAnswered && option === question.correctAnswer && (
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                )}
                {isAnswered && selectedAnswer === option && option !== question.correctAnswer && (
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'short_answer':
        return (
          <View style={styles.shortAnswerContainer}>
            <Text style={styles.shortAnswerHint}>
              Type your answer below. Be specific and concise.
            </Text>
            <TouchableOpacity
              style={[styles.optionButton, styles.shortAnswerButton]}
              onPress={() => onAnswer('short_answer')}
            >
              <Text style={styles.shortAnswerText}>Enter Answer</Text>
              <Ionicons name="chevron-forward" size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.questionTypeBadge}>
          <Ionicons name={getQuestionTypeIcon(question.type)} size={16} color="#6366f1" />
          <Text style={styles.questionTypeText}>
            {question.type.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.questionPoints}>{question.points} pts</Text>
      </View>
      
      <Text style={styles.questionText}>{question.text}</Text>
      
      {question.image && (
        <View style={styles.questionImageContainer}>
          <Text style={styles.questionImagePlaceholder}>
            📷 Question Image
          </Text>
        </View>
      )}
      
      {renderQuestionContent()}
      
      {isAnswered && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>
            {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect!'}
          </Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
};

export default function ContestPlayScreen({ route, navigation }) {
  const { contest } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isContestComplete, setIsContestComplete] = useState(false);
  const [score, setScore] = useState(0);

  const mockQuestions = [
    {
      id: 1,
      type: 'multiple_choice',
      text: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris',
      points: 10,
      explanation: 'Paris is the capital and largest city of France.',
    },
    {
      id: 2,
      type: 'true_false',
      text: 'The Earth is the third planet from the Sun.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 5,
      explanation: 'Earth is indeed the third planet from the Sun, after Mercury and Venus.',
    },
    {
      id: 3,
      type: 'multiple_choice',
      text: 'Which programming language was created by Brendan Eich?',
      options: ['Python', 'JavaScript', 'Java', 'C++'],
      correctAnswer: 'JavaScript',
      points: 15,
      explanation: 'JavaScript was created by Brendan Eich at Netscape in 1995.',
    },
    {
      id: 4,
      type: 'short_answer',
      text: 'What is the largest ocean on Earth?',
      options: [],
      correctAnswer: 'Pacific Ocean',
      points: 20,
      explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.',
    },
    {
      id: 5,
      type: 'multiple_choice',
      text: 'In which year did World War II end?',
      options: ['1943', '1944', '1945', '1946'],
      correctAnswer: '1945',
      points: 10,
      explanation: 'World War II ended in 1945 with the surrender of Germany and Japan.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUp = () => {
    Alert.alert(
      'Time\'s Up!',
      'The contest has ended. Your answers will be submitted automatically.',
      [
        {
          text: 'View Results',
          onPress: () => completeContest(),
        },
      ]
    );
  };

  const handleAnswer = (answer) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < mockQuestions.length - 1) {
        handleNextQuestion();
      }
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitContest = () => {
    Alert.alert(
      'Submit Contest?',
      'Are you sure you want to submit your answers? You won\'t be able to change them.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: () => completeContest(),
        },
      ]
    );
  };

  const completeContest = () => {
    // Calculate score
    let totalScore = 0;
    Object.keys(selectedAnswers).forEach(questionIndex => {
      const question = mockQuestions[parseInt(questionIndex)];
      if (selectedAnswers[questionIndex] === question.correctAnswer) {
        totalScore += question.points;
      }
    });

    setScore(totalScore);
    setIsContestComplete(true);
    
    // Navigate to results
    navigation.navigate('Results', { 
      contest, 
      score: totalScore, 
      totalQuestions: mockQuestions.length,
      answeredQuestions: Object.keys(selectedAnswers).length,
    });
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const canSubmit = Object.keys(selectedAnswers).length === mockQuestions.length;

  if (isContestComplete) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.contestTitle}>{contest.title}</Text>
          <Timer timeLeft={timeLeft} totalTime={1800} onTimeUp={handleTimeUp} />
        </View>
        <ProgressBar currentQuestion={currentQuestionIndex} totalQuestions={mockQuestions.length} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswers[currentQuestionIndex]}
          isAnswered={isAnswered}
        />
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? '#9ca3af' : '#6366f1'} />
          <Text style={[
            styles.navButtonText,
            currentQuestionIndex === 0 && styles.navButtonTextDisabled,
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex < mockQuestions.length - 1 ? (
          <TouchableOpacity
            style={[
              styles.navButton,
              !isAnswered && styles.navButtonDisabled,
            ]}
            onPress={handleNextQuestion}
            disabled={!isAnswered}
          >
            <Text style={[
              styles.navButtonText,
              !isAnswered && styles.navButtonTextDisabled,
            ]}>
              Next
            </Text>
            <Ionicons name="chevron-forward" size={20} color={!isAnswered ? '#9ca3af' : '#6366f1'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitContest}
            disabled={!canSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Contest</Text>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 16,
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginLeft: 8,
  },
  timerBar: {
    width: 120,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    borderRadius: 3,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  questionTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 6,
  },
  questionPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 26,
    marginBottom: 20,
  },
  questionImageContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  questionImagePlaceholder: {
    fontSize: 16,
    color: '#64748b',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#6366f1',
    backgroundColor: '#f8fafc',
  },
  correctOption: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  incorrectOption: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectedOptionText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#10b981',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  shortAnswerContainer: {
    marginBottom: 20,
  },
  shortAnswerHint: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  shortAnswerButton: {
    backgroundColor: '#f8fafc',
  },
  shortAnswerText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
  feedbackContainer: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#065f46',
    lineHeight: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navButtonDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    marginHorizontal: 8,
  },
  navButtonTextDisabled: {
    color: '#9ca3af',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
});
