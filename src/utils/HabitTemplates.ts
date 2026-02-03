export interface HabitTemplate {
    id: string;
    title: string;
    description: string;
    type: 'check' | 'timer' | 'numeric';
    category: 'Health' | 'Productivity' | 'Mindset' | 'Bad Habit';
    color: string;
    icon: string;
    goal?: number;
    unit?: string;
    // Atomic Habit Laws
    cue: string;
    craving: string;
    response: string;
    reward: string;
    howToApply: string;
    // Sensor Information
    isSensorBased?: boolean;
    sensorType?: 'pedometer' | 'light' | 'screen' | 'noise' | 'movement' | 'gps';
    requiredPermissions?: string[];
}

export const COMMON_HABITS_TEMPLATES: HabitTemplate[] = [
    {
        id: 'water_habit',
        title: 'Drink Water',
        description: 'Stay hydrated for physical and mental clarity.',
        type: 'numeric',
        category: 'Health',
        color: '#60A5FA',
        icon: 'Droplets',
        goal: 8,
        unit: 'glasses',
        cue: 'Place a large water bottle on your desk every morning.',
        craving: 'Visualize the refreshing feeling of hydration and energy.',
        response: 'Take a sip every time you finish a task or check your phone.',
        reward: 'Tick off a glass in the app and feel the physical energy boost.',
        howToApply: 'Law 1: Make it obvious. Set the bottle in your line of sight.'
    },
    {
        id: 'sunlight_habit',
        title: 'Morning Sunlight',
        description: 'Sync your circadian rhythm with early morning light.',
        type: 'timer',
        category: 'Health',
        color: '#FBBF24',
        icon: 'Sun',
        goal: 600, // 10 mins
        cue: 'Open the blinds as soon as you wake up.',
        craving: 'The desire to feel awake and alert without needing caffeine immediately.',
        response: 'Step outside for 10 minutes right after your first glass of water.',
        reward: 'Enjoy the warmth on your face and the natural alertness.',
        howToApply: 'Law 2: Make it attractive. Combine it with your morning coffee.'
    },
    {
        id: 'meditation_habit',
        title: 'Meditation',
        description: 'Reduce stress and improve focus with daily mindfulness.',
        type: 'timer',
        category: 'Mindset',
        color: '#A78BFA',
        icon: 'Wind',
        goal: 600, // 10 mins
        cue: 'Sitting in your "meditation chair" immediately after brushing teeth.',
        craving: 'Longing for a moment of quiet in a loud world.',
        response: 'Use the Rise timer and focus on your breath for 10 minutes.',
        reward: 'Sense of calm and mental space for the day ahead.',
        howToApply: 'Law 3: Make it easy. Start with just 2 minutes if 10 feels hard.'
    },
    {
        id: 'no_phone_night',
        title: 'No Phone in Bed',
        description: 'Protect your sleep quality by avoiding blue light.',
        type: 'check',
        category: 'Bad Habit',
        color: '#EF4444',
        icon: 'SmartphoneNfc',
        cue: 'The phone charger is in the living room, not the bedroom.',
        craving: 'Wanting to doomscroll to avoid tomorrow\'s responsibilities.',
        response: 'Read a physical book instead when you get into bed.',
        reward: 'Falling asleep faster and waking up feeling rested.',
        howToApply: 'Inversion of Law 1: Make it invisible. Charge your phone away from bed.'
    },
    {
        id: 'read_habit',
        title: 'Read 10 Pages',
        description: 'Consistent reading compounds into massive knowledge.',
        type: 'numeric',
        category: 'Productivity',
        color: '#34D399',
        icon: 'BookOpen',
        goal: 10,
        unit: 'pages',
        cue: 'Leave your book on your pillow when you make the bed.',
        craving: 'The excitement of learning something new or getting lost in a story.',
        response: 'Read 10 pages before you go to sleep.',
        reward: 'The satisfaction of finishing chapters and growing smarter.',
        howToApply: 'Law 3: Make it easy. Use the "Two-Minute Rule"—just read one page to start.'
    },
    {
        id: 'walk_habit',
        title: '30m Daily Walk',
        description: 'Simple movement is the foundation of health.',
        type: 'timer',
        category: 'Health',
        color: '#10B981',
        icon: 'Footprints',
        goal: 1800, // 30 mins
        cue: 'Keep your walking shoes by the door.',
        craving: 'The need for fresh air after being indoors all day.',
        response: 'Walk for 30 minutes right after lunch.',
        reward: 'Lowered stress and better digestion.',
        howToApply: 'Law 1: Make it obvious. Set your shoes where you can\'t miss them.'
    },
    {
        id: 'step_legend',
        title: 'Step Legend',
        description: 'Commit to a daily step goal verified by your phone.',
        type: 'numeric',
        category: 'Health',
        color: '#FFFFFF',
        icon: 'Footprints',
        goal: 10000,
        unit: 'steps',
        isSensorBased: true,
        sensorType: 'pedometer',
        requiredPermissions: ['android.permission.ACTIVITY_RECOGNITION', 'ios.permission.MOTION'],
        cue: 'Check your current step count as soon as you finish breakfast.',
        craving: 'The urge to see that progress bar hit the 100% mark.',
        response: 'Take the stairs or go for a short walk to top up your count.',
        reward: 'The "Legendary" badge on your profile and genuine physical fatigue.',
        howToApply: 'Law 1: Make it obvious. Add the Rise Step Widget to your home screen.'
    },
    {
        id: 'lumen_guardian',
        title: 'Lumen Guardian',
        description: 'Get your daily dose of morning light for better circadian rhythm.',
        type: 'timer',
        category: 'Health',
        color: '#FDE047',
        icon: 'Sun',
        goal: 1200, // 20 mins
        unit: 'seconds',
        isSensorBased: true,
        sensorType: 'light',
        requiredPermissions: [],
        cue: 'Wait for the "Low Light" notification from Rise at 8:00 AM.',
        craving: 'Desiring that mental "click" where your brain finally feels awake.',
        response: 'Spend 20 minutes near a window or outside (Detected by sensor).',
        reward: 'Consistent nightly sleep and morning alertness.',
        howToApply: 'Law 2: Make it attractive. Sunlight + Podcast = The perfect combo.'
    },
    {
        id: 'digital_sunset',
        title: 'Digital Sunset',
        description: 'Ensure no phone usage after your sunset time.',
        type: 'check',
        category: 'Bad Habit',
        color: '#FB7185',
        icon: 'Moon',
        isSensorBased: true,
        sensorType: 'screen',
        requiredPermissions: [],
        cue: 'The clock hitting 10:00 PM and your phone auto-dimming.',
        craving: 'Resisting the "one last scroll" that steals your sleep.',
        response: 'Put the phone on the charger in another room (Verified by sensor).',
        reward: 'Waking up without dry eyes and with a clear head.',
        howToApply: 'Law 3: Make it difficult. A physical separation from your device.'
    },
    {
        id: 'deep_silence',
        title: 'Deep Silence',
        description: 'Build focus by working in a truly quiet environment.',
        type: 'timer',
        category: 'Productivity',
        color: '#94A3B8',
        icon: 'VolumeX',
        goal: 3600, // 1 hour
        unit: 'seconds',
        isSensorBased: true,
        sensorType: 'noise',
        requiredPermissions: ['android.permission.RECORD_AUDIO', 'ios.permission.MICROPHONE'],
        cue: 'Clearing your desk and putting your phone in "Silent".',
        craving: 'The feeling of "Flow" where time disappears.',
        response: 'Work for 60 minutes with noise levels below 45dB.',
        reward: 'Massive progress on your hardest tasks.',
        howToApply: 'Law 4: Make it satisfying. Watching the "Silence Meter" stay in the green.'
    },
    {
        id: 'immediate_rise',
        title: 'Immediate Rise',
        description: 'Defeat the snooze button by moving instantly.',
        type: 'check',
        category: 'Health',
        color: '#38BDF8',
        icon: 'Zap',
        isSensorBased: true,
        sensorType: 'movement',
        requiredPermissions: ['android.permission.ACTIVITY_RECOGNITION', 'ios.permission.MOTION'],
        cue: 'Your alarm goes off at 7:00 AM.',
        craving: 'The instinct to hide under the covers for "5 more minutes".',
        response: 'Walk 50 meters within 5 minutes (Verified by accelerometer).',
        reward: 'Being the first person to start the day in your household.',
        howToApply: 'Law 3: Make it easy. Place your robe and slippers right next to bed.'
    },
    {
        id: 'city_glider',
        title: 'City Glider',
        description: 'Choose active commuting over idle travel.',
        type: 'numeric',
        category: 'Health',
        color: '#4ADE80',
        icon: 'Bike',
        goal: 2,
        unit: 'km',
        isSensorBased: true,
        sensorType: 'gps',
        requiredPermissions: ['android.permission.ACCESS_FINE_LOCATION', 'ios.permission.LOCATION'],
        cue: 'Leaving the house for work or errands.',
        craving: 'Feeling the wind and noticing your surroundings.',
        response: 'Bike or walk 2km instead of taking a car or bus.',
        reward: 'Endorphin rush and a "Greener World" achievement.',
        howToApply: 'Law 4: Make it satisfying. Check the commute savings in your weekly report.'
    }
];
