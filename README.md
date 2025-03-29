# Personal_financial_system

Це платформа, де користувачі можуть відстежувати свої доходи та витрати, створювати фінансові цілі та отримувати аналітику щодо своїх витрат. Користувачі можуть групувати витрати за категоріями, переглядати статистику у вигляді графіків та відстежувати виконання своїх фінансових цілей.

Проект базується на мікросервісах, які взаємодіють через меседж брокер для забезпечення асинхронної обробки фінансових даних та автоматичного оновлення цілей.

## Сервіси

### 1. User Service
Управління користувачами (реєстрація, аутентифікація, зберігання інформації).

### 2. Transaction Service
Управління доходами та витратами користувачів.

### 3. Goal Service
Управління фінансовими цілями та відстеження їх виконання.

## Практичні завдання

### 1. Реалізація User Service та API Gateway
- Розробити **User Service**, який буде підключений до бази даних **PostgreSQL** і матиме відповідні **CRUD-операції** для керування користувачами (реєстрація, аутентифікація).
- Розробити **API Gateway**, що буде обробляти запити від фронтенду та направляти їх до **User Service** або інших сервісів залежно від ендпоінта.
- Протестувати роботу ендпоінтів за допомогою **Postman**.

### 2. Розробка Transaction Service
- Розробити **Transaction Service** з відповідною базою даних і підключити його до **API Gateway**.
- Реалізувати функції додавання, видалення та отримання списку транзакцій.
- Додати можливість сортування та фільтрації транзакцій за типом (дохід або витрата) та категорією.
- Провести тестування ендпоінтів за допомогою **Postman**.

### 3. Розробка Goal Service
- Розробити **Goal Service** з відповідною базою даних і підключити його до **API Gateway**.
- Реалізувати функції створення, оновлення та отримання списку фінансових цілей.
- Додати автоматичне оновлення поточної суми зібраних коштів через підписку на зміни в транзакціях за допомогою **меседж брокера**.
- Протестувати роботу всіх ендпоінтів за допомогою **Postman**.

### 4. Створити дашборд фінансової аналітики
- Відображати основні показники: загальний баланс, доходи, витрати за останній місяць.
- Додати графіки витрат за категоріями (наприклад, кругову діаграму).
- Відображати динаміку доходів та витрат за допомогою лінійного графіка.

### 5. Додати сторінку управління фінансовими цілями та транзакціями
- Відображати список активних і завершених фінансових цілей користувача.
- Додати можливість створення нової цілі та встановлення терміну досягнення.
- Автоматично оновлювати статус цілі залежно від прогресу.
- Відображати список доходів та витрат із можливістю фільтрації за категоріями та типом.
- Додати кнопку для додавання нової транзакції (дохід або витрата).
- Показувати коротку інформацію про баланс користувача.
