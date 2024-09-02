# Cześć!

Chciałbym zaprezentować aplikację, którą stworzyłem jako część zadania rekrutacyjnego dla WELL Marketing. Projekt to prosty kalendarz, który umożliwia dodawanie, edytowanie i usuwanie wydarzeń. Dane są przechowywane w bazie danych Firebase, co umożliwia synchronizację wydarzeń w czasie rzeczywistym. Aplikacja została stworzona w frameworku React z wykorzystaniem biblioteki React Scheduler oraz Material-UI.

## Funkcjonalności

### 1. Wyświetlanie Wydarzeń
Aplikacja korzysta z komponentu `Scheduler`, który umożliwia wyświetlanie wydarzeń w różnych widokach (dzień, tydzień, miesiąc). Użytkownik może przełączać się między widokami, korzystając z komponentu `ViewSwitcher`.

### 2. Synchronizacja z Firebase 
Aplikacja jest zintegrowana z Firebase, gdzie przechowywane są dane dotyczące wydarzeń. W momencie uruchomienia aplikacji, dane są pobierane z Firestore i wyświetlane w kalendarzu. Funkcja `fetchEvents` obsługuje pobieranie danych, konwertując daty na obiekty `Date`.

### 3. Dodawanie Nowych Wydarzeń
Użytkownik może dodawać nowe wydarzenia do kalendarza. Po dodaniu wydarzenia, dane są zapisywane do Firestore za pomocą funkcji `addDoc` i natychmiastowo wyświetlane w kalendarzu.

### 4. Edytowanie Istniejących Wydarzeń
Aplikacja umożliwia edytowanie istniejących wydarzeń. W momencie dokonania zmian, odpowiedni dokument w Firestore jest aktualizowany. W tym celu aplikacja korzysta z funkcji `updateDoc`. Podczas edycji szczególnie ważne było prawidłowe przetwarzanie i konwersja dat, aby uniknąć początkowych błędów związanych z niepoprawnym formatowaniem.

### 5. Usuwanie Wydarzeń
Istnieje również możliwość usunięcia wydarzenia z kalendarza. W przypadku usunięcia, odpowiedni dokument w Firestore jest kasowany za pomocą funkcji `deleteDoc`, a wydarzenie zostaje natychmiast usunięte z widoku kalendarza.

### 6. Obsługa Błędów
W aplikacji zaimplementowałem również podstawową obsługę błędów, która informuje użytkownika (poprzez konsolę) w przypadku problemów z połączeniem z Firestore, co może być przydatne w trakcie debugowania. (nieraz już się przydało :)

## Uruchomienie Aplikacji

Aplikacja jest dostępna do podglądu na GitHub Pages pod linkiem:
```
https://speedy993.github.io/CalendarApp/
```
 
A aby uruchomić ją lokalnie, wykonaj następujące kroki:

### Klonowanie repozytorium:

```
git clone https://github.com/speedy993/CalendarApp.git
cd CalendarApp
```

### Instalacja zależności:

```
npm install
```

### Uruchomienie aplikacji:

```
npm start
```
Aplikacja zostanie uruchomiona lokalnie na http://localhost:3000/.

### Podsumowanie
Aplikacja uważam, że spełnia wymagania zadania rekrutacyjnego. Wykorzystałem technologie frontendowe, takie jak framework React, czy biblioteki (Material-UI, React Scheduler), a także zintegrowałem ją z Firebase, co pozwala na dynamiczne zarządzanie wydarzeniami. Chętnie opowiem więcej o tej, oraz innych swoich aplikacjach podczas rozmowy rekrutacyjnej :-)

Dziękuję za uwagę i zapraszam do przetestowania aplikacji!