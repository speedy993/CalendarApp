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

const currentDate = new Date().toISOString().split('T')[0]; // Ustawienie bieżącej daty jako domyślnej daty kalendarza

export default function App() {
  const [data, setData] = useState([]);
  const [currentDateState, setCurrentDateState] = useState(currentDate);
  const [currentViewName, setCurrentViewName] = useState('Day');

  useEffect(() => {
    // Funkcja pobierająca wydarzenia z Firestore, wywoływana przy uruchomieniu aplikacji
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id, 
            ...data, // Destrukturyzacja danych
            startDate: new Date(data.startDate), // Konwersja daty na obiekt Date
            endDate: new Date(data.endDate), // Konwersja daty na obiekt Date
          };
        });
        console.log('Fetched events:', eventsList); // Sprawdzenie poprawności pobranych danych, przydało się przy debugowaniu :)
        setData(eventsList); // Zapisanie pobranych wydarzeń do stanu
      } catch (error) {
        console.error('Error fetching events from Firestore:', error);
      }
    };
    
    fetchEvents(); // Wywołanie funkcji pobierającej wydarzenia
  }, []); 

  // Funkcja obsługująca dodawanie, edytowanie i usuwanie wydarzeń
  const onCommitChanges = async ({ added, changed, deleted }) => {
    try {
      if (added) {
        // Dodawanie nowego wydarzenia do Firestore
        const newEvent = {
          ...added,
          startDate: new Date(added.startDate).toISOString(), // Konwersja daty na format ISO
          endDate: new Date(added.endDate).toISOString(), // Konwersja daty na format ISO. Wykonałem je, ponieważ początkowo miałem problem z odpowiednim formatowaniem dat
        };
        const newEventRef = await addDoc(collection(db, 'events'), newEvent); // Dodanie nowego dokumentu do kolekcji 'events'
        setData([...data, { id: newEventRef.id, ...newEvent }]); // Aktualizacja stanu po dodaniu nowego wydarzenia
      }
      if (changed) {
        const changedId = Object.keys(changed)[0]; // Pobranie id zmienionego wydarzenia
        const existingEvent = data.find(appointment => appointment.id === changedId); // Znalezienie istniejącego wydarzenia

        // Obsługa sytuacji, gdy zmienione wydarzenie zawiera nowe daty lub zachowanie oryginalnych dat
        const rawStartDate = changed[changedId].startDate || existingEvent.startDate;
        const rawEndDate = changed[changedId].endDate || existingEvent.endDate;

        const startDate = new Date(rawStartDate);
        const endDate = new Date(rawEndDate);

        console.log('Raw startDate: ', rawStartDate); // Sprawdzenie oryginalnej daty
        console.log('Raw endDate:', rawEndDate); // Sprawdzenie oryginalnej daty
        console.log('Converted startDate:', startDate); // Sprawdzenie daty po konwersji
        console.log('Converted endDate:', endDate); // Sprawdzenie daty po konwersji, przydatne było przy debugowaniu, więc zostawiłem ;)

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid date encountered:', startDate, endDate); // Obsługa błędnych dat
          return; 
        }

        // Utworzenie zaktualizowanego wydarzenia
        const updatedEvent = {
          ...existingEvent, // Zachowanie oryginalnych wartości wydarzenia
          ...changed[changedId], // Nadpisanie tylko zmienionych pól
          startDate: startDate.toISOString(), // Konwersja zaktualizowanej daty na format ISO
          endDate: endDate.toISOString(), // Konwersja zaktualizowanej daty na format ISO
        };

        const eventDoc = doc(db, 'events', changedId); // Odniesienie do dokumentu w Firestore
        await updateDoc(eventDoc, updatedEvent); // Aktualizacja dokumentu w Firestore
        console.log('Successfully updated event in Firestore:', updatedEvent); 
        setData(data.map(appointment =>
          appointment.id === changedId ? { ...appointment, ...updatedEvent } : appointment
        )); // Aktualizacja stanu po edycji wydarzenia
      }
      if (deleted !== undefined) {
        const eventDoc = doc(db, 'events', deleted); // Odniesienie do dokumentu do usunięcia
        await deleteDoc(eventDoc); // Usunięcie dokumentu z Firestore
        setData(data.filter(appointment => appointment.id !== deleted)); // Aktualizacja stanu po usunięciu wydarzenia
      }
    } catch (error) {
      console.error('Error interacting with Firestore:', error); // Obsługa błędów związanych z interakcją z Firestore
    }
  };

  return (
    <>
    <div style={{ 
      textAlign: 'center', 
      backgroundColor: '#3457D5', 
      padding: '10px 0', 
      fontSize: '13px'
    }}>
      <h1>
        Aplikacja stworzona jako zadanie rekrutacyjne
      </h1>
      <h2 style={{ marginTop: '10px' }}>
        Pozdrowienia dla Patryka, jak i całego zespołu WELL Marketing 😀
      </h2>
    </div>
    <Paper>
      <Scheduler
        data={data} 
        locale="pl-PL" 
      >
        <ViewState
          currentDate={currentDateState} // Przekazanie bieżącej daty
          onCurrentDateChange={setCurrentDateState} // Obsługa zmiany bieżącej daty
          currentViewName={currentViewName} // Przekazanie aktualnie wybranego widoku
          onCurrentViewNameChange={setCurrentViewName} // Obsługa zmiany widoku
        />
        <EditingState
          onCommitChanges={onCommitChanges} // Przekazanie funkcji obsługującej zmiany w wydarzeniach
        />
        <IntegratedEditing />
        <DayView
          startDayHour={9} // Ustawienie godziny rozpoczęcia dnia w widoku dziennym
          endDayHour={18} // Ustawienie godziny zakończenia dnia w widoku dziennym
        />
        <WeekView
          startDayHour={9} // Ustawienie godziny rozpoczęcia dnia w widoku tygodniowym
          endDayHour={18} // Ustawienie godziny zakończenia dnia w widoku tygodniowym
        />
        <MonthView />
        <Appointments />
        <AppointmentTooltip
          showOpenButton // Wyświetlanie przycisku otwierającego formularz edycji
          showDeleteButton // Wyświetlanie przycisku usuwania wydarzenia
        />
        <AppointmentForm />
        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
      </Scheduler>
    </Paper>
    </>
  );
}
