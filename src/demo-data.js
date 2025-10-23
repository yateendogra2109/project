// Demo data for testing the Notes App
export const demoNotes = [
  {
    id: "demo1",
    title: "Project Ideas",
    content: "1. Build a task management app\n2. Create a weather dashboard\n3. Develop a recipe organizer\n4. Design a fitness tracker\n5. Make a budget planner",
    category: "Ideas",
    type: "short",
    reminder: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
  },
  {
    id: "demo2",
    title: "Meeting Notes - Q4 Planning",
    content: "Today's quarterly planning meeting covered several key areas that will shape our strategy for the final quarter of the year. The discussion began with a comprehensive review of our current performance metrics, which show strong growth in user engagement but highlight areas for improvement in conversion rates.\n\nKey decisions made:\n- Increase marketing budget by 15% for digital campaigns\n- Launch new feature set by November 15th\n- Hire 3 additional developers for the mobile team\n- Implement new customer feedback system\n\nAction items:\n- Sarah to prepare budget proposal by Friday\n- Dev team to finalize feature specifications\n- HR to begin recruitment process immediately\n- Customer success team to design feedback workflows\n\nNext meeting scheduled for October 30th to review progress on all initiatives.",
    category: "Work",
    type: "long",
    reminder: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    id: "demo3",
    title: "Grocery List",
    content: "• Milk\n• Bread\n• Eggs\n• Chicken breast\n• Spinach\n• Tomatoes\n• Greek yogurt\n• Bananas\n• Coffee beans",
    category: "Shopping",
    type: "short",
    reminder: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
  },
  {
    id: "demo4",
    title: "Book Recommendations",
    content: "Recently discovered some amazing books that I want to read:\n\n1. \"Atomic Habits\" by James Clear - About building good habits\n2. \"The Psychology of Money\" by Morgan Housel - Financial wisdom\n3. \"Educated\" by Tara Westover - Memoir about education and family\n4. \"Sapiens\" by Yuval Noah Harari - History of humankind\n5. \"The Midnight Library\" by Matt Haig - Fiction about life choices",
    category: "Personal",
    type: "short",
    reminder: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: "demo5",
    title: "Workout Plan",
    content: "Monday - Upper Body:\n• Push-ups: 3 sets of 15\n• Pull-ups: 3 sets of 8\n• Dumbbell rows: 3 sets of 12\n• Shoulder press: 3 sets of 10\n\nWednesday - Lower Body:\n• Squats: 3 sets of 20\n• Lunges: 3 sets of 12 each leg\n• Deadlifts: 3 sets of 10\n• Calf raises: 3 sets of 15\n\nFriday - Cardio:\n• 30 minutes running\n• 15 minutes cycling\n• 10 minutes stretching",
    category: "Health",
    type: "long",
    reminder: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // Tomorrow morning
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  }
];

// Function to load demo data
export const loadDemoData = () => {
  const existingNotes = localStorage.getItem('notes');
  if (!existingNotes || JSON.parse(existingNotes).length === 0) {
    localStorage.setItem('notes', JSON.stringify(demoNotes));
    console.log('Demo data loaded!');
    return true;
  }
  return false;
};