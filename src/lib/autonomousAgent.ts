export interface AutonomousSuggestion {
  id: string;
  type: 'reply' | 'date' | 'birthday' | 'gift' | 'reconnect' | 'milestone';
  title: string;
  description: string;
  actionText: string;
  targetProfileName: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

export const AUTONOMOUS_SUGGESTIONS: AutonomousSuggestion[] = [
  {
    id: 'as1',
    type: 'reply',
    title: 'High-Intent Reply Opportunity',
    description: "Elena sent a message about Bach violin sonatas 2 hours ago. Replying now increases engagement harmony by 24%.",
    actionText: 'Draft AI Reply',
    targetProfileName: 'Elena Rostova',
    priority: 'high',
    timestamp: '2 hours ago'
  },
  {
    id: 'as2',
    type: 'date',
    title: 'Optimal Date Window Detected',
    description: "Both you and Zoe are free this Saturday evening. Weather forecast in SF is 68°F and clear.",
    actionText: 'Schedule Date Itinerary',
    targetProfileName: 'Zoe Hayashi',
    priority: 'high',
    timestamp: '1 hour ago'
  },
  {
    id: 'as3',
    type: 'birthday',
    title: 'Upcoming Birthday Reminder',
    description: "Elena's birthday is in 4 days. Would you like to reserve a table at Benu SF?",
    actionText: 'View Celebration Ideas',
    targetProfileName: 'Elena Rostova',
    priority: 'medium',
    timestamp: 'Today'
  },
  {
    id: 'as4',
    type: 'gift',
    title: 'Milestone Gift Suggestion',
    description: "Zoe added 'Japanese Woodworking Joinery' to her memory vault. Recommended gift: Handcrafted cherry wood tea tray.",
    actionText: 'Order Gift via Store',
    targetProfileName: 'Zoe Hayashi',
    priority: 'medium',
    timestamp: 'Yesterday'
  }
];
