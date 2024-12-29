import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '../css/common.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Для використання англійської локалізації, flatpickr за замовчуванням використовує англійську.
const inputEl = document.querySelector('#datetime-picker');
const buttonEl = document.querySelector('button[data-start]');
const daysEl = document.querySelector('.value[data-days]');
const hoursEl = document.querySelector('.value[data-hours]');
const minutesEl = document.querySelector('.value[data-minutes]');
const secondsEl = document.querySelector('.value[data-seconds]');

let selectedDate = null;
let intervalId = null;

buttonEl.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  locale: 'en',  // Вказуємо англійську локалізацію без імпорту файлів
  onClose(selectedDates) {
    if (!selectedDates || selectedDates.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'No date selected!',
        position: 'topRight',
      });
      buttonEl.disabled = true;
      return;
    }

    const selectedDateTime = selectedDates[0]; 

    if (selectedDateTime < Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      buttonEl.disabled = true; 
    } else {
      iziToast.success({
        title: 'Success',
        message: 'You have selected a valid date!',
        position: 'topRight',
      });
      selectedDate = selectedDateTime; 
      buttonEl.disabled = false; 
    }
  },
};

flatpickr(inputEl, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer() {
  const remainingTime = selectedDate - Date.now();

  if (remainingTime <= 0) {
    clearInterval(intervalId);
    buttonEl.disabled = true; 
    inputEl.disabled = false; 
    iziToast.success({
      title: 'Timer finished!',
      message: 'The countdown has ended.',
      position: 'topRight',
    });
    
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
  } else {
    const { days, hours, minutes, seconds } = convertMs(remainingTime);
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
  }
}

buttonEl.addEventListener('click', () => {
  buttonEl.disabled = true;
  inputEl.disabled = true;
  intervalId = setInterval(updateTimer, 1000); 
});
























