let exportArray = []
async function todayReport(TODAY=returnToday(), secID=null) {

  let empAcc = ''
  if(document.getElementById("accordionPanelsStayOpenExample1")){
    empAcc = document.getElementById("accordionPanelsStayOpenExample1");
  }
  
  if(secID){
      empAcc = document.getElementById(`${secID}`);
      empAcc.innerHTML =`<div class="text-center">
                        <h6 class="lead text-success-emphasis">${TODAY}</h6>
                      </div>`;
      document.getElementById("today-report-heroSection").classList.add('d-none')
  } else{

    if(!document.getElementById("accordionPanelsStayOpenExample1")){
      console.log("NO ELEMENT IN DOM...")
      const div = document.createElement("div");
      div.id = "accordionPanelsStayOpenExample1"
      empAcc = div;
    } else{
      empAcc.innerHTML = ''
    }
    
  }

  let ALLOCATED_TIME = [];
  let WORKED_TIME = [];
  let alloChartBar = [];
  let workChartBar = [];

  document.getElementById('emp-count').innerText = ALL_REPORTEES.length;

  // Store promises for each employee fetch
  const promises = ALL_REPORTEES.map((e,i) => {
    // Add accordion item with placeholder
    empAcc.innerHTML += `
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#${e.ID}-${secID}" aria-expanded="false" aria-controls="${e.ID}-${secID}">
            🧑‍💼 ${e.Name}
            <div class="border rounded ms-4 p-1 px-2 border border-primary-subtle">
              <span class="me-2 text-primary" id="${e.ID}-emp-allocated-${secID}"><span class="text-danger">0h 0m</span></span> - 
              <span class="ms-2 text-success" id="${e.ID}-emp-worked-${secID}"><span class="text-danger">0h 0m</span></span>
            </div>
          </button>
        </h2>
        <div id="${e.ID}-${secID}" class="accordion-collapse collapse">
          <div class="accordion-body p-0" id="body-${e.ID}-${secID}">
            <div class="text-muted small">Loading...</div>
          </div>
        </div>
      </div>
    `;

    return fetchEmployeeData(e,i,secID); // Return promise
  });

  // Wait for all employees to finish fetching
  const results = await Promise.all(promises);

  // Update totals and chart only after all data is ready
  document.getElementById("total-allocated-time").innerText = timeToDecimal(sumTime(ALLOCATED_TIME))
  document.getElementById("total-worked-time").innerText = timeToDecimal(sumTime(WORKED_TIME))

  allovsworkedChart.data.labels = ALL_REPORTEES.map(e => e.Name);
  allovsworkedChart.data.datasets[0].data = alloChartBar;
  allovsworkedChart.data.datasets[1].data = workChartBar;
  allovsworkedChart.update();

  // -------- Helper function inside ----------
  function fetchEmployeeData(e, index) {

    let cri = `(Task_Date == "${TODAY}" && Assignee.ID == ${e.ID})`;


    // console.log("CRY==>",cri)

    // if(from){
    //   cri = `(Task_Date >= "${from}" && Task_Date <= "${TODAY}" || Task_Date == "${TODAY}" && Assignee.ID == ${e.ID})`;
    // }
    

    const config = {
      appName: "zenworkr",
      reportName: "Task_Report",
      criteria: cri,
    };

    return ZOHO.CREATOR.API.getAllRecords(config).then(response => {
        if (response.code === 3000) {

        response.data.map(e => {
            exportArray.push({
              task_name : e.Task_Name,
              task_description: e.Task_Description,
              task_date : e.Task_Date,
              assignee : e.Assignee.display_value,
              task_status : e.Task_Status,
              task_Priority : e.Task_Priority,
              task_date : e.Task_Date,
              project_name: e.Project_Name.display_value,
              milestone_name: e.Milestone_Name.display_value,
              start_time: e.Start_Time,
              end_time : e.End_Time,
              worked: e.Total_Worked
            })
          })

          //work here

          // console.log(response.data)



          const rows = response.data.map((element, i) => {
            const diff = calculateTimeDifference(element.Start_Time, element.End_Time) || '0h 0m';
            const worked = element.Total_Worked || '0h 0m';
            let cls = worked === '0h 0m' ? 'text-danger' : 'text-success fw-semibold';

            ALLOCATED_TIME.push(diff);
            WORKED_TIME.push(worked);

            

            return `
              <tr>
                <td class="text-center">${i + 1}</td>
                <td style="width:15%;">${element.Task_Name || "-"}</td>
                <td class="text-center"><span class="bg-status ${(element.Task_Status.replace(" ", "-") || '').toLowerCase()}">${element.Task_Status || "-"}</span></td>
                <td class="text-center"><span class="bg-status fw-bold ${(element.Task_Priority || '').toLowerCase()}">${element.Task_Priority?.slice(0,3) || "-"}</span></td>
                <td class="text-center">${element.Task_Date || "-"}</td>
                <td class="text-center">${element.Start_Time || "-"}</td>
                <td class="text-center">${element.End_Time || "-"}</td>
                <td class="text-center">${diff}</td>
                <td class="text-center ${cls}">${worked}</td>
              </tr>
            `;
          }).join('');

          const empAllo = response.data.map(t => calculateTimeDifference(t.Start_Time, t.End_Time));
          const empWrkd = response.data.map(t => t.Total_Worked);

          document.getElementById(`${e.ID}-emp-allocated-${secID}`).innerText = sumTime(empAllo);
          document.getElementById(`${e.ID}-emp-worked-${secID}`).innerText = sumTime(empWrkd);
          document.getElementById(`body-${e.ID}-${secID}`).innerHTML = `
            <table class="table table-rounded btable">
              <thead>
                <tr>
                  <th>SI</th>
                  <th>Task Name</th>
                  <th class="text-center">Status</th>
                  <th class="text-center">Priority</th>
                  <th class="text-center">Task Date</th>
                  <th class="text-center">Start</th>
                  <th class="text-center">End</th>
                  <th class="text-center">Allocated</th>
                  <th class="text-center">Worked</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          `;

           // 🧩 Key Fix: assign by index instead of push
          alloChartBar[index] = timeToDecimal(sumTime(empAllo));
          workChartBar[index] = timeToDecimal(sumTime(empWrkd));
        } else {
          document.getElementById(`body-${e.ID}-${secID}`).innerHTML = `<p class="text-danger">No data found.</p>`;
          alloChartBar[index] = 0;
          workChartBar[index] = 0;
        }
      })
      .catch(err => {
        // console.error(err);
        document.getElementById(`body-${e.ID}-${secID}`).innerHTML = `<p class="text-secondary">No data found.</p>`;
        alloChartBar[index] = 0;
        workChartBar[index] = 0;
      });
  }
}
function downloadCSV(array, filename = "data.csv") {
  // Convert array of objects → CSV text
  const headers = Object.keys(array[0]).join(",");
  const rows = array
    .map(obj => Object.values(obj).join(","))
    .join("\n");

  const csvContent = headers + "\n" + rows;

  // Create a blob
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  // Create download link
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function triggerExport(){
  console.log("EXPORT ARRAY=>", exportArray)
  downloadCSV(exportArray, "myfile.csv");


  setTimeout(() => {
    exportArray.length = 0;
  }, 3000);
}

// setTimeout(() => {
//   console.log("EXPORT ARRAY",exportArray)
// }, 5000);


function timeToDecimal(timeStr) {
  let hours = 0;
  let minutes = 0;

  // Extract hours
  if (timeStr.includes('h')) {
    hours = parseInt(timeStr.split('h')[0].trim(), 10);
    timeStr = timeStr.split('h')[1];
  }

  // Extract minutes
  if (timeStr && timeStr.includes('m')) {
    minutes = parseInt(timeStr.split('m')[0].trim(), 10);
  }

  // Convert to decimal hours
  const decimalHours = hours + minutes / 60;
  return Math.round(decimalHours * 100) / 100; // round to 2 decimals
}



function sumTime(arr) {
  let totalMinutes = 0;

  arr.forEach(time => {
    const [hPart, mPart] = time.split(' ');
    const hours = parseInt(hPart.replace('h', '')) || 0;
    const minutes = mPart ? parseInt(mPart.replace('m', '')) : 0;
    totalMinutes += (hours * 60) + minutes;
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${totalHours}h ${remainingMinutes}m`;
}


function returnToday(){
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function getStartOfCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // getMonth() is 0-based

  // Always first day of the month
  const day = 1;

  // Format with leading zeros
  const formatted = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  return formatted;
}

function getStartOfCurrentWeek() {
  const today = new Date();
  const day = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  
  // Calculate the difference to get Monday
  const diff = (day === 0 ? -6 : 1 - day); // if Sunday, go back 6 days; else back to Monday
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  // Format to DD-MM-YYYY
  const dd = String(monday.getDate()).padStart(2, '0');
  const mm = String(monday.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const yyyy = monday.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}


function trigerTodayReport(type){

  exportArray.length = 0;
  document.getElementById("date-picker-div").classList.add("d-none");

  const parent = document.getElementById("emp-accordion");

  if(type === 'week'){

    parent.innerHTML = ''


    //--- OLD LOGIC
    const today =returnToday();
    const from = getStartOfCurrentWeek();

    const totalDays = getDatesBetween(from, today);

    totalDays.forEach((d,i) =>{

      const secID = `accordionPanelsStayOpenExample-${i}`;

      const newdiv = document.createElement('div');
      newdiv.id = secID;
      newdiv.className = 'accordion my-5';
      parent.appendChild(newdiv);

      todayReport(d, secID)

    });
    document.getElementById("offcanvasBottomLabel").innerText = "This Week Report"
    document.getElementById("dateTodayReport").value = '';

    return;
  } else if(type === 'month'){

    parent.innerHTML = ''

    const today =returnToday();
    const from = getStartOfCurrentMonth();

    const totalDays = getDatesBetween(from, today);

    totalDays.forEach((d,i) =>{

      if(!isWeekday(d)){
        return;
      }
      

      const secID = `accordionPanelsStayOpenExample-${i}`;

      const newdiv = document.createElement('div');
      newdiv.id = secID;
      newdiv.className = 'accordion my-5';
      parent.appendChild(newdiv);

      todayReport(d, secID)

    });

    document.getElementById("dateTodayReport").value = '';
    document.getElementById("offcanvasBottomLabel").innerText = "This Month Report"
    return;
  }

  const date = document.getElementById("dateTodayReport").value.trim();
  console.log(date)
  todayReport(date)
  document.getElementById("offcanvasBottomLabel").innerText = `${date} Report`
  document.getElementById("dateTodayReport").value = '';
}


function getDatesBetween(startDateStr, endDateStr) {
  // Helper to parse DD-MM-YYYY into a Date object
  function parseDate(str) {
    const [day, month, year] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Helper to format Date object back to DD-MM-YYYY
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);
  const dates = [];

  // Loop from start to end (inclusive)
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(formatDate(new Date(d)));
  }

  return dates;
}



function isWeekday(dateStr) {
  // dateStr format: "DD-MM-YYYY"
  const [day, month, year] = dateStr.split("-").map(Number);

  // JS Date: month is 0-based
  const date = new Date(year, month - 1, day);

  const dayOfWeek = date.getDay(); 
  // 0 = Sunday, 6 = Saturday

  return dayOfWeek !== 0 && dayOfWeek !== 6;
}
