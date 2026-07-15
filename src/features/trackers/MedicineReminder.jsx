import React, { useState, useEffect } from 'react';
// మీ రిక్వెస్ట్ ప్రకారం కరెక్ట్ పాత్ మరియు కాన్ఫిగరేషన్ నుండి db ని ఇంపోర్ట్ చేస్తున్నాం
import { db } from '../../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

export default function MedicineReminder() {
  const [reminders, setReminders] = useState([]);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });

  // 1. Load medicines from Firestore in real-time using onSnapshot()
  useEffect(() => {
    const q = query(collection(db, 'medicine_reminders'), orderBy('time', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const medsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReminders(medsList);
    }, (error) => {
      console.error("Error fetching medicine reminders: ", error);
    });

    return () => unsubscribe();
  }, []);

  // 2. Add new medicine to Firestore collection
  const addMed = async (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.time) return;

    try {
      await addDoc(collection(db, 'medicine_reminders'), {
        name: newMed.name,
        dosage: newMed.dosage || '',
        time: newMed.time,
        taken: false,
        createdAt: new Date().toISOString()
      });
      
      // Reset input form values
      setNewMed({ name: '', dosage: '', time: '' });
    } catch (error) {
      console.error("Error adding medicine reminder: ", error);
    }
  };

  // 3. Toggle Taken status directly in Firestore document
  const toggleTaken = async (id, currentStatus) => {
    try {
      const medRef = doc(db, 'medicine_reminders', id);
      await updateDoc(medRef, {
        taken: !currentStatus
      });
    } catch (error) {
      console.error("Error updating medicine status: ", error);
    }
  };

  // --- UI Layout, Colors, and Tailwind Design Remains Exactly The Same ---
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        ⏰ Medicine Schedule
      </h2>

      <form onSubmit={addMed} className="grid grid-cols-3 gap-2 mb-6">
        <input 
          type="text" 
          placeholder="Med Name" 
          value={newMed.name} 
          onChange={(e) => setNewMed({...newMed, name: e.target.value})}
          className="border p-2 rounded-lg text-sm"
        />
        <input 
          type="text" 
          placeholder="Dosage" 
          value={newMed.dosage} 
          onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
          className="border p-2 rounded-lg text-sm"
        />
        <div className="flex gap-1">
          <input 
            type="time" 
            value={newMed.time} 
            onChange={(e) => setNewMed({...newMed, time: e.target.value})}
            className="border p-2 rounded-lg text-sm flex-1"
          />
          <button type="submit" className="bg-brand-blue-600 text-white px-3 rounded-lg text-sm font-bold">+</button>
        </div>
      </form>

      <div className="space-y-3">
        {reminders.map((med) => (
          <div key={med.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${med.taken ? 'bg-slate-50 border-slate-200 line-through text-slate-400' : 'bg-brand-blue-50/50 border-brand-blue-100'}`}>
            <div>
              <p className="font-bold text-slate-800">{med.name} - <span className="text-sm font-normal text-slate-500">{med.dosage}</span></p>
              <p className="text-xs text-slate-500 mt-0.5">{med.time}</p>
            </div>
            <button 
              onClick={() => toggleTaken(med.id, med.taken)}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${med.taken ? 'bg-slate-200 text-slate-600' : 'bg-brand-teal-500 text-white'}`}
            >
              {med.taken ? 'Taken' : 'Mark Taken'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}