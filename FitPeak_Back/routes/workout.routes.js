const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { Workout, validateWorkout } = require("../models/workout.model");
const asyncHandler = require("express-async-handler");

router.post("/", asyncHandler(async (req, res) => {
  const { error } = validateWorkout(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const workout = new Workout({
      workoutId: uuidv4(),
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      exercises: req.body.exercises,
      duration: req.body.duration,
      date: req.body.date,
      completed: req.body.completed,
      category: req.body.category,
      calories: req.body.calories, 
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    console.error("Error creating workout:", err);
    res.status(500).json({ message: "An error occurred while creating the workout" });
  }
}));

router.get("/user/:userId", asyncHandler(async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ message: "An error occurred while fetching the workout" });
  }
}));

router.get("/:workoutId", asyncHandler(async (req, res) => {
  try {
    const workout = await Workout.findOne({ workoutId: req.params.workoutId });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json(workout);
  } catch (err) {
    console.error("Error fetching workout:", err);
    res.status(500).json({ message: "An error occurred while fetching the workout" });
  }
}));


router.delete("/:workoutId", asyncHandler(async (req, res) => {
  try {
    const workout = await Workout.findOne({ workoutId: req.params.workoutId });
    
    if (!workout) {
      return res.status(404).json({ message:"Workout not found" });
    }
    
    await Workout.findOneAndDelete({ workoutId: req.params.workoutId });
    res.json({ message: "Deleted workout successfully" });
  } catch (err) {
    console.error("Error deleting workout:", err);
    res.status(500).json({ message: "Error deleting workout" });
  }
}));

router.patch("/:workoutId/complete", asyncHandler(async (req, res) => {
  try {
    const workout = await Workout.findOne({ workoutId: req.params.workoutId });
    
    if (!workout) {
      return res.status(404).json({ message: "Workout not found"});
    }
    
  
    workout.completed = true;
    await workout.save();
    
    res.json(workout);
  } catch (err) {
    console.error("Error completing workout:", err);
    res.status(500).json({ message: "Error completing workout" });
  }
}));

router.get("/category/:category/user/:userId", asyncHandler(async (req, res) => {
  try {
    const workouts = await Workout.find({ 
      category: req.params.category,
      userId: req.params.userId 
    }).sort({ date: -1 });
    
    res.json(workouts);
  } catch (err) {
    console.error("Error fetching workouts by category:", err);
    res.status(500).json({ message: "Error fetching workouts by category" });
  }
}));

router.get("/dashboard/stats/:userId", asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const totalWorkouts = await Workout.countDocuments({ userId, completed: true });
    
    const caloriesResult = await Workout.aggregate([
      { $match: { userId, completed: true } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$calories" } } } }
    ]);
    const totalCalories = caloriesResult.length > 0 ? caloriesResult[0].total : 0;
    
    const categoriesDistribution = await Workout.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } }
    ]);
    
    const recentWorkouts = await Workout.find({ userId })
      .sort({ date: -1 })
      .limit(5);
    
    const allWorkouts = await Workout.find({ 
      userId, 
      completed: true 
    }).sort({ date: -1 });
    
    let streak = 0;
    if (allWorkouts.length > 0) {
      const uniqueDates = [];
      allWorkouts.forEach(workout => {
        const dateStr = new Date(workout.date).toISOString().split('T')[0];
        if (!uniqueDates.includes(dateStr)) {
          uniqueDates.push(dateStr);
        }
      });
      
      streak = 1;
      const today = new Date().toISOString().split('T')[0];
      
      const hasWorkoutToday = uniqueDates[0] === today;
      
      let currentDate = new Date();
      if (!hasWorkoutToday) {
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      for (let i = hasWorkoutToday ? 1 : 0; i < uniqueDates.length; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        const dateToCheck = currentDate.toISOString().split('T')[0];
        
        if (uniqueDates[i] === dateToCheck) {
          streak++;
        } else {
          break; 
        }
      }
    }
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const caloriesOverTime = await Workout.aggregate([
      { 
        $match: { 
          userId, 
          date: { $gte: sevenDaysAgo },
          completed: true
        } 
      },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          calories: { $sum: { $toDouble: "$calories" } }
        } 
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", calories: 1, _id: 0 } }
    ]);
    
    const bestWorkout = await Workout.findOne({ userId, completed: true })
      .sort({ calories: -1 })
      .limit(1);
    
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const thisWeekWorkouts = await Workout.find({ 
      userId, 
      date: { $gte: startOfWeek },
      completed: true
    });
    
    const thisWeekWorkoutsCount = thisWeekWorkouts.length;
    
    const thisWeekCaloriesResult = await Workout.aggregate([
      { 
        $match: { 
          userId, 
          date: { $gte: startOfWeek },
          completed: true
        } 
      },
      { $group: { _id: null, total: { $sum: { $toDouble: "$calories" } } } }
    ]);
    const thisWeekCalories = thisWeekCaloriesResult.length > 0 ? thisWeekCaloriesResult[0].total : 0;
    
    const targetWorkoutsPerWeek = 5;
    const targetCaloriesPerWeek = 2500;
    
    const workoutProgress = Math.min((thisWeekWorkoutsCount / targetWorkoutsPerWeek) * 100, 100);
    const calorieProgress = Math.min((thisWeekCalories / targetCaloriesPerWeek) * 100, 100);
    const totalProgress = Math.min((workoutProgress + calorieProgress) / 2, 100);
    
    res.json({
      totalWorkouts,
      totalCalories,
      categoriesDistribution,
      recentWorkouts,
      streak,
      caloriesOverTime,
      bestWorkout,
      weeklyProgress: {
        workoutProgress,
        calorieProgress,
        totalProgress: totalProgress.toFixed(1) + "%"
      }
    });
    
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
}));

module.exports = router;
