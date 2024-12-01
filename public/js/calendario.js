let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// variáveis do modal:
const newEvent = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
// --------
const calendar = document.getElementById('calendar'); // div calendar
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']; // array with weekdays

let isEditing = false; // flag to indicate if we are editing an event

// funções

function openModal(date) {
  clicked = date;
  const eventDay = events.find((event) => event.date === clicked);

  if (eventDay) {
    document.getElementById('eventText').innerText = eventDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEvent.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

async function load() {
  const date = new Date();

  // APIからイベントデータを取得
  try {
    const response = await fetch('/calendario/listar');
    const data = await response.json();
    events = data.map(event => ({
      date: new Date(event.data_evento).toLocaleDateString('pt-BR'), // "DD/MM/YYYY"形式
      title: event.nome_evento,
    }));
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }
  console.log(events) //確認済　しっかりとEventoを表示できている

  // 月とナビゲーションの処理
  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const daysMonth = new Date(year, month + 1, 0).getDate();
  const firstDayMonth = new Date(year, month, 1);

  const dateString = firstDayMonth.toLocaleDateString('pt-br', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddinDays = weekdays.indexOf(dateString.split(', ')[0]);

  // 月と年を表示
  document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br', { month: 'long' })}, ${year}`;

  calendar.innerHTML = '';

  // 各日をカレンダーに描画
  for (let i = 1; i <= paddinDays + daysMonth; i++) {
    const dayS = document.createElement('div');
    dayS.classList.add('day');

    const dayString = `${i - paddinDays}/${month + 1}/${year}`;

    if (i > paddinDays) {
      dayS.innerText = i - paddinDays;

      // イベントデータがある場合は表示
      const eventDay = events.find(event => event.date === dayString);
      if (i - paddinDays === day && nav === 0) {
        dayS.id = 'currentDay';
      }
      console.log(eventDay)
      if (eventDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventDay.title;
        dayS.appendChild(eventDiv);
      }

      dayS.addEventListener('click', () => openModal(dayString));
    } else {
      dayS.classList.add('padding');
    }

    calendar.appendChild(dayS);
  }
}


function closeModal() {
  eventTitleInput.classList.remove('error');
  newEvent.style.display = 'none';
  backDrop.style.display = 'none';
  deleteEventModal.style.display = 'none';

  eventTitleInput.value = '';
  clicked = null;
  isEditing = false; // Reset the editing flag
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    if (isEditing) {
      // Se estiver editando, atualize o evento existente
      const eventIndex = events.findIndex((event) => event.date === clicked);
      if (eventIndex !== -1) {
        events[eventIndex].title = eventTitleInput.value;
      }
    } else {
      // Se não estiver editando, crie um novo evento
      events.push({
        date: clicked,
        title: eventTitleInput.value,
      });
    }

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter((event) => event.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function editEvent() {
  const eventDay = events.find((event) => event.date === clicked);
  if (eventDay) {
    eventTitleInput.value = eventDay.title;
    newEvent.style.display = 'block';
    deleteEventModal.style.display = 'none';
    isEditing = true; // Set the flag to indicate we are editing
  }
}

// botões
function buttons() {
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', () => saveEvent());

  document.getElementById('cancelButton').addEventListener('click', () => closeModal());

  document.getElementById('deleteButton').addEventListener('click', () => deleteEvent());

  document.getElementById('closeButton').addEventListener('click', () => closeModal());

  document.getElementById('editButton').addEventListener('click', () => editEvent()); // Botão de Editar
}

buttons();
load();