const dateInput = document.getElementById("dateTodayReport");
  const calendar = document.getElementById("calendar");

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  const today = new Date();

  // Open calendar
  dateInput.addEventListener("click", () => {
    calendar.style.display = "block";
    renderCalendar(currentMonth, currentYear);
  });

  // Prevent clicks inside the calendar from closing it
  calendar.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close calendar when clicking outside
  document.addEventListener("click", function (e) {
    if (!calendar.contains(e.target) && e.target !== dateInput) {
      calendar.style.display = "none";
    }
  });

  // Render calendar UI
  function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    let html = `
      <div class="calendar-header">
        <button onclick="prevMonth()">❮</button>
        <span>${months[month]} ${year}</span>
        <button onclick="nextMonth()">❯</button>
      </div>
      <table class="table table-bordered mb-0">
        <thead>
          <tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr>
        </thead>
        <tbody><tr>
    `;

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      html += "<td></td>";
    }

    // Fill dates
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);

      let isFuture = dateObj > today;

      if ((firstDay + d - 1) % 7 === 0) html += "</tr><tr>";

      if (isFuture) {
        html += `<td class="disabled">${d}</td>`;
      } else {
        html += `<td class="enabled" onclick="selectDate(${d}, ${month}, ${year})">${d}</td>`;
      }
    }

    html += "</tr></tbody></table>";

    calendar.innerHTML = html;
  }

  // Select date
  function selectDate(day, month, year) {
    const formatted =
      String(day).padStart(2, '0') + "-" +
      String(month + 1).padStart(2, '0') + "-" +
      year;

    dateInput.value = formatted;
    calendar.style.display = "none";
    console.log(formatted)
    exportArray.length = 0;
    todayReport(formatted)
  }

  // Month navigation
  function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  }

  function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  }