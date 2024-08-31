import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const currentDate = new Date().toISOString().split('T')[0];

export default function App() {
  const [data, setData] = useState([]);
  const [currentDateState, setCurrentDateState] = useState(currentDate);
  const [currentViewName, setCurrentViewName] = useState('Day');

  useEffect(() => {
    // Pobierz wydarzenia z Firestore przy uruchomieniu aplikacji
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startDate: new Date(data.startDate), // Konwersja na obiekt Date
            endDate: new Date(data.endDate),     // Konwersja na obiekt Date
          };
        });
        console.log('Fetched events:', eventsList); // Logowanie pobranych wydarzeń
        setData(eventsList);
      } catch (error) {
        console.error('Error fetching events from Firestore:', error);
      }
    };
    
    
    
    fetchEvents(); // Wywołanie funkcji pobierającej dane
  }, []);

  const onCommitChanges = async ({ added, changed, deleted }) => {
    try {
      if (added) {
        const newEvent = {
          ...added,
          startDate: new Date(added.startDate).toISOString(),
          endDate: new Date(added.endDate).toISOString(),
        };
        const newEventRef = await addDoc(collection(db, 'events'), newEvent);
        setData([...data, { id: newEventRef.id, ...newEvent }]);
      }
      if (changed) {
        const changedId = Object.keys(changed)[0];
        const existingEvent = data.find(appointment => appointment.id === changedId);
        
        const rawStartDate = changed[changedId].startDate || existingEvent.startDate;
        const rawEndDate = changed[changedId].endDate || existingEvent.endDate;
  
        const startDate = new Date(rawStartDate);
        const endDate = new Date(rawEndDate);
  
        console.log('Raw startDate: nee ', rawStartDate);
        console.log('Raw endDate:', rawEndDate);
        console.log('Converted startDate:', startDate);
        console.log('Converted endDate:', endDate);
  
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid date encountered:', startDate, endDate);
          return; // Wyjście z funkcji, jeśli data jest niepoprawna
        }
  
        const updatedEvent = {
          ...existingEvent, // Zachowanie oryginalnych wartości
          ...changed[changedId], // Nadpisanie tylko zmienionych pól
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };
  
        const eventDoc = doc(db, 'events', changedId);
        await updateDoc(eventDoc, updatedEvent);
        console.log('Successfully updated event in Firestore:', updatedEvent);
        setData(data.map(appointment =>
          appointment.id === changedId ? { ...appointment, ...updatedEvent } : appointment
        ));
      }
      if (deleted !== undefined) {
        const eventDoc = doc(db, 'events', deleted);
        await deleteDoc(eventDoc);
        setData(data.filter(appointment => appointment.id !== deleted));
      }
    } catch (error) {
      console.error('Error interacting with Firestore:', error);
    }
  };
  
  
  

  return (
    <Paper>
      <Scheduler
        data={data}
        locale="pl-PL"
      >
        <ViewState
          currentDate={currentDateState}
          onCurrentDateChange={setCurrentDateState}
          currentViewName={currentViewName}
          onCurrentViewNameChange={setCurrentViewName}
        />
        <EditingState
          onCommitChanges={onCommitChanges}
        />
        <IntegratedEditing />
        <DayView
          startDayHour={9}
          endDayHour={18}
        />
        <WeekView
          startDayHour={9}
          endDayHour={18}
        />
        <MonthView />
        <Appointments />
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
        />
        <AppointmentForm />
        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
      </Scheduler>
    </Paper>
  );
}
