import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function FoodTracker() {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("Breakfast");

  const [foods, setFoods] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const targetCalories = 2000;

  const getTodayDate = () =>
    new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "food_logs"),
      where("userId", "==", auth.currentUser.uid),
      where("date", "==", getTodayDate())
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = [];
        let total = 0;

        snapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };

          list.push(data);
          total += Number(data.calories || 0);
        });

        setFoods(list);
        setTotalCalories(total);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to load food data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addFood = async (e) => {
    e.preventDefault();

    if (!foodName || !calories) {
      alert("Please enter food name and calories.");
      return;
    }

    try {
      await addDoc(collection(db, "food_logs"), {
        userId: auth.currentUser.uid,
        foodName,
        calories: Number(calories),
        mealType,
        date: getTodayDate(),
        createdAt: serverTimestamp(),
      });

      setFoodName("");
      setCalories("");
      setMealType("Breakfast");
    } catch (err) {
      console.error(err);
      setError("Unable to save food.");
    }
  };

  const progress = Math.min(
    (totalCalories / targetCalories) * 100,
    100
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">

      <h1 className="text-2xl font-bold mb-5">
        🍽 Food Tracker
      </h1>

      {loading && (
        <p className="text-blue-600 mb-3">
          Loading...
        </p>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}

      <form
        onSubmit={addFood}
        className="grid md:grid-cols-2 gap-4 mb-6"
      >

        <input
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="border rounded-lg p-3"
        />

        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snacks</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white rounded-lg p-3 font-semibold"
        >
          Save Food
        </button>

      </form>

      <div className="mb-6">

        <div className="flex justify-between mb-2">
          <span>Today's Calories</span>
          <strong>
            {totalCalories} / {targetCalories}
          </strong>
        </div>

        <div className="bg-gray-200 rounded-full h-4">

          <div
            className="bg-green-500 h-4 rounded-full"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="space-y-3">

        {foods.length === 0 ? (
          <p className="text-gray-500">
            No food added today.
          </p>
        ) : (
          foods.map((food) => (
            <div
              key={food.id}
              className="border rounded-lg p-4 flex justify-between"
            >
              <div>
                <h3 className="font-bold">
                  {food.foodName}
                </h3>

                <p className="text-sm text-gray-500">
                  {food.mealType}
                </p>
              </div>

              <div className="font-semibold">
                {food.calories} kcal
              </div>
            </div>
          ))
        )}

      </div>

      <div className="mt-6 bg-green-50 rounded-lg p-4">

        <h3 className="font-semibold">
          🤖 AI Nutrition Insight
        </h3>

        <p className="text-sm mt-2">

          {totalCalories < 1200 &&
            "🍎 Your calorie intake is low today."}

          {totalCalories >= 1200 &&
            totalCalories < 1800 &&
            "👍 Good nutrition. Keep eating balanced meals."}

          {totalCalories >= 1800 &&
            "✅ Great! Daily nutrition goal is almost complete."}

        </p>

      </div>

    </div>
  );
}