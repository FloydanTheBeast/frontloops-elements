const calendarContainer = document.querySelector('.calendar__container');
const nextBtn = document.querySelector('.calendar__controls-next');
const prevBtn = document.querySelector('.calendar__controls-prev');

const generateWeedDates = baseDate => {
  const weekDates = [];
  const startDate = new Date(baseDate);
  startDate.setDate(startDate.getDate() - baseDate.getDay());

  for (let i = 0; i < 8; i++) {
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);
    weekDates.push(new Date(startDate));
  }

  return weekDates;
};

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
});

const CURRENT_DATE = new Date();
CURRENT_DATE.setHours(0, 0, 0, 0);
(() => {
  let baseDate = new Date(CURRENT_DATE);

  const renderWeekDays = () => {
    const weekDays = generateWeedDates(baseDate);

    calendarContainer.replaceChildren(
      ...weekDays.map(date => {
        const weekdayText = document.createElement('span');

        if (date.getTime() === CURRENT_DATE.getTime()) {
          weekdayText.classList.add('current');
        }

        weekdayText.textContent = dateTimeFormatter.format(date);

        return weekdayText;
      }),
    );
  };

  renderWeekDays();

  nextBtn.addEventListener('click', () => {
    baseDate.setDate(baseDate.getDate() + 7);
    renderWeekDays();
  });

  prevBtn.addEventListener('click', () => {
    baseDate.setDate(baseDate.getDate() - 7);
    renderWeekDays();
  });
})();
