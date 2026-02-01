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
        id: 'no_sugar_habit',
        title: 'No Added Sugar',
        description: 'Lower inflammation and stabilize energy levels.',
        type: 'check',
        category: 'Bad Habit',
        color: '#F472B6',
        icon: 'CandyOff',
        cue: 'Cleaning out the pantry of all sugary snacks.',
        craving: 'The afternoon energy slump that makes you want a snack.',
        response: 'Eat a piece of fruit or some nuts instead.',
        reward: 'Steady energy levels and clearer skin over time.',
        howToApply: 'Inversion of Law 2: Make it unattractive. Read about the effects of sugar.'
    },
    {
        id: 'gratitude_habit',
        title: 'Gratitude Journal',
        description: 'Shift your focus from what you lack to what you have.',
        type: 'check',
        category: 'Mindset',
        color: '#FCD34D',
        icon: 'HeartPulse',
        cue: 'Seeing your journal on your nightstand.',
        craving: 'Wanting to end the day on a positive note.',
        response: 'Write down 3 things you are grateful for today.',
        reward: 'Falling asleep with a peaceful and thankful mind.',
        howToApply: 'Law 4: Make it satisfying. Use a beautiful journal you love.'
    },
    {
        id: 'plan_day_habit',
        title: 'Plan Tomorrow',
        description: 'Wake up with clarity by planning ahead.',
        type: 'check',
        category: 'Productivity',
        color: '#4B5563',
        icon: 'ListChecks',
        cue: 'Closing your laptop for the final time in the evening.',
        craving: 'The peace of mind that comes with knowing what to do next.',
        response: 'Write down your top 3 tasks for tomorrow.',
        reward: 'A productive morning without the "decision fatigue".',
        howToApply: 'Law 1: Make it obvious. Keep your planner on your desk.'
    },
    {
        id: 'deep_work_habit',
        title: 'Deep Work Block',
        description: 'Focus on high-value tasks without distractions.',
        type: 'timer',
        category: 'Productivity',
        color: '#6366F1',
        icon: 'Zap',
        goal: 3600, // 60 mins
        cue: 'Putting on focus-mode headphones.',
        craving: 'The desire to make real progress on important projects.',
        response: 'Work for 60 minutes with phone in another room.',
        reward: 'Completing "Work that Matters" and feeling accomplished.',
        howToApply: 'Law 3: Make it easy. Set a specific time for Deep Work.'
    },
    {
        id: 'stretch_habit',
        title: 'Daily Stretching',
        description: 'Maintain mobility and prevent stiffness.',
        type: 'timer',
        category: 'Health',
        color: '#6EE7B7',
        icon: 'Accessibility',
        goal: 600, // 10 mins
        cue: 'Rolling out your yoga mat when you start watching TV.',
        craving: 'Relieving the tension in your back and shoulders.',
        response: '10 minutes of mobility work while listening to a podcast.',
        reward: 'Feeling loose and limber rather than stiff and sore.',
        howToApply: 'Law 2: Make it attractive. Watch your favorite show while stretching.'
    },
    {
        id: 'cold_shower_habit',
        title: 'Cold Shower',
        description: 'Build mental toughness and boost immunity.',
        type: 'timer',
        category: 'Health',
        color: '#3B82F6',
        icon: 'Snowflake',
        goal: 180, // 3 mins
        cue: 'Turning the handle to cold at the end of your shower.',
        craving: 'The rush of adrenaline and clarity after the initial shock.',
        response: 'Breathe through 3 minutes of cold water.',
        reward: 'Extreme mental clarity and an "I can do anything" attitude.',
        howToApply: 'Law 4: Make it satisfying. Track your wins on the Rise app.'
    },
    {
        id: 'no_caffeine_late',
        title: 'No Caffeine After 2PM',
        description: 'Ensure caffeine doesn\'t interfere with deep sleep.',
        type: 'check',
        category: 'Bad Habit',
        color: '#B45309',
        icon: 'Coffee',
        cue: 'The clock hitting 2:00 PM.',
        craving: 'The habit of having a mid-afternoon pick-me-up.',
        response: 'Switch to herbal tea or sparkling water.',
        reward: 'Deeper sleep and waking up more naturally alert.',
        howToApply: 'Inversion of Law 3: Make it difficult. Remove coffee from the office after 2PM.'
    },
    {
        id: 'save_money_habit',
        title: 'No Random Spends',
        description: 'Build wealth by eliminating impulsive purchases.',
        type: 'check',
        category: 'Mindset',
        color: '#059669',
        icon: 'Banknote',
        cue: 'Seeing an ad or an item you "want" but don\'t "need".',
        craving: 'The temporary dopamine hit of a new purchase.',
        response: 'Wait 24 hours before buying anything non-essential.',
        reward: 'Watching your savings account grow every month.',
        howToApply: 'Inversion of Law 4: Make it unsatisfying. Imagine the wasted hours spent earning that money.'
    },
    {
        id: 'coding_habit',
        title: 'Code/Learn 1hr',
        description: 'Continuous skill building for career growth.',
        type: 'timer',
        category: 'Productivity',
        color: '#EC4899',
        icon: 'Code',
        goal: 3600, // 1 hr
        cue: 'Opening your laptop at 7 PM.',
        craving: 'The satisfaction of solving problems and building things.',
        response: 'Follow a tutorial or work on a side project for 1 hour.',
        reward: 'New skills and certificates for your portfolio.',
        howToApply: 'Law 1: Make it obvious. Set your computer to open your project automatically.'
    }
];
