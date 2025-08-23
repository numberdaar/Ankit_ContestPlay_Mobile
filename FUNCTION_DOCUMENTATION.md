# YonuMeta Contest App - Function Documentation

This document provides detailed explanations of all functions and components in the YonuMeta Contest Mobile Application.

## 📱 ContestDetailScreen.jsx

### Component: TabButton
**Purpose**: Renders a clickable tab button with active/inactive states
**Parameters**:
- `title` (string): The text to display on the tab
- `isActive` (boolean): Whether this tab is currently selected
- `onPress` (function): Function to call when tab is pressed
**Functionality**: Creates a touchable tab that changes appearance based on active state

### Component: DetailsTab
**Purpose**: Displays the main contest information including image, description, and join button
**Parameters**:
- `contest` (object): Contest data object containing all contest information
- `onJoinPress` (function): Function to handle when join button is pressed
**Functionality**: 
- Shows contest image (using dummy image)
- Displays contest title, category, and description
- Renders information grid with key details (end date, participants, entry fee, duration)
- Provides join button for contest participation

### Component: LeaderboardTab
**Purpose**: Displays the current contest rankings with user highlighting
**Parameters**:
- `contest` (object): Contest data object
**Functionality**:
- Shows top participants with their rankings
- Highlights current user's position
- Displays scores and participant names
- Uses mock data (would come from API in production)

### Component: RulesTab
**Purpose**: Displays contest rules, eligibility, and terms in organized sections
**Parameters**:
- `contest` (object): Contest data object
**Functionality**:
- Shows eligibility requirements
- Displays judging criteria with percentage breakdowns
- Lists terms and conditions
- Provides prize distribution information

### Main Component: ContestDetailScreen
**Purpose**: Main screen that manages tab navigation and renders appropriate content
**Parameters**:
- `route` (object): Navigation route object containing contest data
- `navigation` (object): Navigation object for screen transitions
**State Management**:
- `activeTab`: Tracks which tab is currently active (details/leaderboard/rules)
**Key Functions**:
- `handleJoinPress()`: Routes to ContestPlay for free contests or Payment for paid contests
- `renderTabContent()`: Renders the appropriate tab content based on activeTab state

### Utility Function: getCategoryColor
**Purpose**: Returns category-specific colors for visual consistency
**Parameters**:
- `category` (string): The contest category
**Returns**: Hex color code for the category
**Supported Categories**: Technology, Art, Education, Gaming

## 🎮 ContestPlayScreen.jsx

### Main Component: ContestPlayScreen
**Purpose**: Handles the interactive gameplay interface for contest participation
**Key Features**:
- Question display and navigation
- Timer management
- Answer submission
- Score tracking
- Progress indicators

## 🏆 LeaderboardScreen.jsx

### Main Component: LeaderboardScreen
**Purpose**: Displays comprehensive leaderboards with rankings and achievements
**Key Features**:
- Top 3 podium display
- Performance badges
- User highlighting
- Contest switching
- Real-time updates

## 💰 PaymentScreen.jsx

### Main Component: PaymentScreen
**Purpose**: Handles payment processing for paid contests
**Key Features**:
- Multiple payment methods
- Secure processing
- Entry fee management
- Transaction confirmation

## 📸 SubmissionScreen.jsx

### Main Component: SubmissionScreen
**Purpose**: Manages contest entry submissions
**Key Features**:
- Image upload
- Camera integration
- Gallery selection
- Submission validation

## 📊 ResultsScreen.jsx

### Main Component: ResultsScreen
**Purpose**: Displays contest results and performance analytics
**Key Features**:
- Score breakdown
- Performance levels
- Social sharing
- Achievement display

## 🎯 ContestHubScreen.jsx

### Main Component: ContestHubScreen
**Purpose**: Main discovery interface for browsing available contests
**Key Features**:
- Contest browsing
- Category filtering
- Search functionality
- Contest previews

## 🔧 App.jsx

### Main Component: App
**Purpose**: Root component that sets up navigation and app structure
**Key Features**:
- Navigation setup
- Screen routing
- App configuration
- Global state management

## 📁 Project Structure

```
yonumeta/
├── App.jsx                 # Main app component with navigation setup
├── src/
│   └── screens/           # All screen components
│       ├── ContestHubScreen.jsx      # Contest discovery interface
│       ├── ContestDetailScreen.jsx   # Contest details with tabbed view
│       ├── ContestPlayScreen.jsx     # Interactive gameplay
│       ├── PaymentScreen.jsx         # Payment processing
│       ├── SubmissionScreen.jsx      # Entry submission
│       ├── ResultsScreen.jsx         # Results and analytics
│       └── LeaderboardScreen.jsx     # Rankings and leaderboard
├── assets/
│   └── images/            # Dummy images and assets
└── package.json           # Dependencies and scripts
```

## 🎨 UI Components

### Common UI Elements
- **TabButton**: Reusable tab component with active states
- **InfoGrid**: Grid layout for displaying contest information
- **CategoryBadge**: Colored badges for contest categories
- **JoinButton**: Primary action button for contest participation
- **LeaderboardItem**: Individual participant ranking display

### Styling System
- **Color Scheme**: Consistent color palette with category-specific colors
- **Typography**: Hierarchical text styles for readability
- **Spacing**: Consistent margins and padding throughout
- **Shadows**: Subtle elevation effects for depth
- **Responsive Design**: Adapts to different screen sizes

## 🔄 Data Flow

1. **Contest Discovery**: ContestHubScreen → ContestDetailScreen
2. **Contest Participation**: ContestDetailScreen → ContestPlayScreen (free) or PaymentScreen (paid)
3. **Gameplay**: ContestPlayScreen → SubmissionScreen
4. **Results**: SubmissionScreen → ResultsScreen
5. **Leaderboard**: ResultsScreen → LeaderboardScreen

## 🚀 Future Enhancements

- **Real-time Updates**: Live leaderboard and contest updates
- **Push Notifications**: Contest reminders and results
- **Offline Support**: Contest participation without internet
- **Social Features**: Friend challenges and team contests
- **AI Integration**: Dynamic question generation
- **AR Features**: Augmented reality contest elements

## 📝 Code Standards

- **JSDoc Comments**: All functions documented with parameters and return values
- **Component Structure**: Consistent component organization
- **State Management**: Clear state handling and updates
- **Error Handling**: Graceful error handling throughout
- **Performance**: Optimized rendering and memory usage

---

**Note**: This documentation covers the main functions and components. For detailed implementation specifics, refer to the individual source files.
