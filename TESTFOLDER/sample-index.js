const DASHBOARD = "EMP";

let TESTCOUNT = 1;
let APICOUNT = 0;
let AVOIDNEWUPDATE = [];

var LASTLOG;
var ALLTURE = [];
var LOGEDINUSER = "";
let USERID = "";

let shiftStart = "11:00:00";
let shiftEnd = "24:00:00";

let shiftStartLocal = "";
let shiftEndLocal = "";

let myLastLogId = "";

if (localStorage.getItem("shiftStartLocal")) {
  shiftStartLocal = localStorage.getItem("shiftStartLocal");
  shiftEndLocal = localStorage.getItem("shiftEndLocal");
}

const manualLogDate = new Date().toISOString().split("T")[0];

let ALL_PROJECTS = null;

// Dummy events
    const DummyEvents = [
      {
        id: 1,
        resourceIds: ['r1'],
        start: new Date().toISOString().split('T')[0] + "T09:00:00",
        end: new Date().toISOString().split('T')[0] + "T10:00:00",
        title: "Existing Task"
      }
    ];

// function addAllModalIdToSessionStorage(key, newItem){
//   const existing = JSON.parse(sessionStorage.getItem(key)) || [];
//   existing.push(newItem);

//   sessionStorage.setItem(key, JSON.stringify(existing));
// }

function addAllModalIdToSessionStorage(key, newItem) {
  const existing = JSON.parse(sessionStorage.getItem(key)) || [];

  if (!existing.includes(newItem)) {
    existing.push(newItem);
    sessionStorage.setItem(key, JSON.stringify(existing));
  }
}

function johoApi(){

  APICOUNT +=1;

  ZOHO.CREATOR.init().then(function () {

    console.log("Zoho Creator SDK Initialized.");

    var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    console.log("Query response", queryParams.autoClick);

    if(queryParams.autoClick && APICOUNT<2){
      autoClickTask(queryParams);
    }

    // ZOHO.CREATOR.UTIL.getQueryParams().then(function (response) {
    //   console.log("Query response", response);
    // })

    try {
      const response = window.ZOHO.CREATOR.UTIL.getInitParams();
      console.log("✅ UTIL Response:", response);
      LOGEDINUSER = response?.loginUser || null;
      console.log("LOGEDINUSER, ", LOGEDINUSER);
    } catch (error) {
      console.error("❌ Error Getting Init Params:", error);
    }

    const employeeConfig = {
      appName: "zenworkr",
      reportName: "All_Employee",
      criteria: `(Email == "${LOGEDINUSER}")`,
    };

    // const tasksConfig = {
    //   appName: "zenworkr",
    //   reportName: "Task_Report",
    //   criteria : "(Assignee.ID == 1141991000005334019)",

    //   // criteria : `(Assignee.ID == "${USERID}")`,
    // }; //USERID //"1141991000005334019"

    // Fetch employee data
    ZOHO.CREATOR.API.getAllRecords(employeeConfig).then(function (employeeResponse) {
        console.log("✅Employee Response:", employeeResponse.data);

        USERID = employeeResponse.data.find((e) => true)?.ID;

        const loggedInEmp = employeeResponse.data.find(
          (emp) => emp.Email === LOGEDINUSER
        );

        console.log("loggedInEmp...", loggedInEmp);

        if (!localStorage.getItem("shiftStartLocal")) {
          
          if (loggedInEmp.Shift_Form.display_value === "Second Shift") {
            //work here....

            shiftStart = "11:00:00";
            shiftEnd = "24:00:00";

            localStorage.setItem("shiftStartLocal", "11:00:00");
            localStorage.setItem("shiftEndLocal", "24:00:00");

            // console.log("shiftStart",shiftStart)
          } else if (loggedInEmp.Shift_Form.display_value === "First Shift") {
            shiftStart = "08:00:00";
            shiftEnd = "20:00:00";

            localStorage.setItem("shiftStartLocal", "11:00:00");
            localStorage.setItem("shiftEndLocal", "24:00:00");
          } else if (loggedInEmp.Shift_Form.display_value === "Third Shift") {
            shiftStart = "18:00:00";
            shiftEnd = "32:00:00";

            localStorage.setItem("shiftStartLocal", "11:00:00");
            localStorage.setItem("shiftEndLocal", "24:00:00");
          } else {
            shiftStart = "07:00:00";
            shiftEnd = "19:00:00";

            localStorage.setItem("shiftStartLocal", "01:00:00");
            localStorage.setItem("shiftEndLocal", "24:00:00");
          }

          shiftStartLocal = localStorage.getItem("shiftStartLocal");
          shiftEndLocal = localStorage.getItem("shiftEndLocal");
        }

        localStorage.setItem("USERID", USERID);
        console.log("USERID->", USERID);

        const resources = employeeResponse.data
          .filter((employee) => employee.Email === LOGEDINUSER)
          .map((employee) => ({
            id: employee.ID,
            title: employee.Name,
          }));



          window.fetchAllProjects = function(){

            const project = document.getElementById("projectSelect");
            project.innerHTML = '<option selected disabled>Project</option>';

            if(ALL_PROJECTS){
                ALL_PROJECTS.forEach(p =>{ project.innerHTML+= `<option value="${p.ID}">${p.Project_Name}</option>`; });
                return;
            }

            const projectConfig = {
              appName: "zenworkr",
              reportName: "Project_Report", 
              criteria : `(Associated_Members.ID == ${USERID})`
            };

            // Fetch project data
            ZOHO.CREATOR.API.getAllRecords(projectConfig).then(function (res) {
                console.log("✅ Project Response:", res.data);

                const allProjects = res.data;
                ALL_PROJECTS = res.data;

                allProjects.forEach(p =>{
                  project.innerHTML+= `
                    <option value="${p.ID}">${p.Project_Name}</option>
                  `;
                });
            });
          }

          fetchAllProjects();

        console.log("✅Transformed Resources:", resources);

        

        // Fetch task data
        const tasksConfig = {
          appName: "zenworkr",
          reportName: "Task_Report",
          criteria: `(Assignee.ID == ${USERID})`,

          // criteria : `(Assignee.ID == "${USERID}")`,
        };
        ZOHO.CREATOR.API.getAllRecords(tasksConfig).then(function (tasksResponse) {
            console.log("✅Tasks Response:---->", tasksResponse.data);

            const taskReport = tasksResponse.data;

            const events = taskReport.map((task) => {
              const employeeId = task.Assignee.ID;
              ALLTURE.push(task.Run_Time);

              // Safely parse "dd-MM-yyyy"
              const [day, month, year] = task.Task_Date.split("-");
              const startDate = new Date(`${year}-${month}-${day}`);
              const endDate = new Date(`${year}-${month}-${day}`);

              

              // Set start and end times
              startDate.setHours(
                Number(task.Start_Time_Hours),
                Number(task.Start_Time_Mins),
                0
              );
              endDate.setHours(
                Number(task.End_Time_Hours),
                Number(task.End_Time_Mins),
                0
              );

              return {
                id: task.ID,
                resourceIds: [employeeId],
                start: startDate,
                end: endDate,
                title: task.Task_Name, // Only task name

                extendedProps: {
                  // ✅ Move description & priority inside extendedProps
                  description: task.Task_Description || "No Description",
                  priority: task.Task_Priority || "No Priority",
                  status: task.Task_Status || "No Statusss",
                  start_date: task.Task_Date,
                  end_date: task.Due_Date,
                  assignee: task.Assignee.display_value,
                  Checklist_Template: task.Checklist_Template,
                  Run_Time: task.Run_Time,
                  Start_Time_Hours: task.Start_Time_Hours,
                  Start_Time_Mins: task.Start_Time_Mins,
                  End_Time_Hours: task.End_Time_Hours,
                  End_Time_Mins: task.End_Time_Mins ,
                  Rejection_Message:task.Rejection_Message || "No Rejection Message",
                  Project_Name:task.Project_Name.display_value || "No Project Name",
                  Project_ID:task.Project_Name.ID || null,
                  Overtime: task.Overtime,
                  lastLogId:task?.lastLogId,
                },
              };
            });

            console.log("Transformed Events:", events);

            document.getElementById("ec").innerHTML = "";
            const ec = new EventCalendar(document.getElementById("ec"), {
              resources,
              events,
              view: "resourceTimeGridWeek",
              allDaySlot: false,
              // slotMinTime: shiftStart,dayGridMonth
              // slotMaxTime: shiftEnd,resourceTimeGridWeek
              slotMinTime: shiftStartLocal,
              slotMaxTime: shiftEndLocal,
              nowIndicator: true,
              selectable: true,
              editable: true,
              firstDay: 1,
              hiddenDays: [0, 6],
              // eventStartEditable: false,
              select: function (event) {

                console.log(event)

                
                const start = event.start;
                const end = event.end;

                const newEvent = {
                  id: new Date().getTime(),
                  resourceIds: [event.resource.id],
                  start: start,
                  end: end,
                  title: "New Task",
                  description: "",
                };

                console.log(newEvent)

                addNewEvent(event);

                // showModal(newEvent);
              },

              eventDrop: function ({ event, revert }) {
                const NAMMA_MODEL_ID = localStorage.getItem("MODEL_ID") || "";
                if (hasOtherOverlappingEvents(event)) {
                  // alert("This move overlaps with another event. Action reverted.");
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    This move
                    <strong>overlaps.</strong> 
                    with another event. Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;
                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                } else if (event.id === NAMMA_MODEL_ID) {
                  console.log("NAMMA_MODEL_ID", NAMMA_MODEL_ID);
                  alert("Cannot move current running task. Action reverted.");
                  revert();
                  // document.getElementById('ScreenFade').style.display = 'block';
                  reloadPage();
                } else if (isPastDate(event.extendedProps.start_date) && event.extendedProps.status == "Completed" || event.extendedProps.status == "Approved") {
                  console.log(event.extendedProps.status);
                  // alert("Cannot move from a past date. If it is completed. Action reverted.");
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Cannot move from a past date.
                    <strong>If it is completed.</strong> 
                    Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;

                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                  
                } else if (isPastDate2(event.start)) {
                  // console.log(isPastDate2(event.extendedProps.start_date))
                  // alert("Cannot move to a past date. Action reverted.");
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Cannot move to a
                    <strong>past date.</strong> 
                    Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;
                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                } else if (event.extendedProps.status == "Completed") {
                  // alert("Cannot move Completed task. Action reverted.");
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Cannot move 
                    <strong>Completed task</strong> 
                    Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;
                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                } else if (event.extendedProps.status == "Approved") {
                  // alert("Cannot move Completed task. Action reverted.");
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Cannot move 
                    <strong>Approved task</strong> 
                    Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;
                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                } else {
                  // console.log("event.extendedProps", event.start);
                  // console.log(event.id);
                  updateZohoTask(event);

                  // johoApi();

                  document.getElementById("ScreenFade").style.display = "block";
                }
              },

              eventResize: function ({ event, revert }) {
                if (hasOtherOverlappingEvents(event)) {
                  // alert("This resize overlaps with another event. Action reverted.");
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    This resize 
                    <strong>overlaps with another event.</strong> 
                    Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;
                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                } else if (isPastDate(event.extendedProps.start_date)) {
                  // alert("Cannot resize a past date. Action reverted.");
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Cannot resize a 
                    <strong>past date.</strong> 
                    Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;
                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                } else if (event.extendedProps.status == "Completed") {
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Cannot resize a 
                    <strong>Completed task</strong> 
                    Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;
                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                }
                else if (event.extendedProps.status == "Approved") {
                  document.getElementById("allert-mesages").innerHTML = `
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Cannot resize a 
                    <strong>Completed task</strong> 
                    Action reverted.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;
                  revert();
                  setTimeout(function(){
                    reloadPage();
                  }, 500)
                }

                 else {
                  updateZohoTask(event);
                  document.getElementById("ScreenFade").style.display = "block";
                }
              },

              headerToolbar: {
                start: "title",
                center: "",
                end: "today,prev,next",
              },

              titleFormat: function (start, end) {
                function getFormattedDate() {
                  const today = new Date();

                  const day = String(today.getDate()).padStart(2, "0");
                  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                  const month = monthNames[today.getMonth()];
                  const year = today.getFullYear();

                  return `${day}-${month}-${year}`;
                }
                // const s = `${start.getDate()}-${start.getMonth() + 1}-${start.getFullYear()}`;
                const s = getFormattedDate();
                return { html: s };
              },

              eventContent: function (arg) {
                // console.log("arg is here....",arg)
                let eventEl = document.createElement("div");
                let modalId = `${arg.event.id}`;
                // const allocatedTime = ;
                eventEl.classList.add("drgg");

                const safeArg = JSON.stringify(arg).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

                eventEl.setAttribute("data-bs-toggle", "modal");
                eventEl.setAttribute("data-bs-target", `#${modalId}`);
                let priority =
                  arg.event.extendedProps?.priority || "No Priority";
                let status = arg.event.extendedProps?.status || "No Statuss";

                let priorityClass = "grey";
                if (priority === "High") priorityClass = "green";
                else if (priority === "Medium") priorityClass = "blue";
                else if (priority === "Low") priorityClass = "pink";

                eventEl.classList.add(priorityClass);

                eventEl.style.border = `1px solid ${clrPrio2(priority)}`;
                eventEl.style.borderLeft = `6px solid ${clrPrio2(priority)}`;

                //onClickRefreshMacha

                // if (
                //   !isTaskDateIsTodayFuture(arg.event.extendedProps?.start_date)
                // ) {
                //   eventEl.style.opacity = "0.5";
                // }

                if(arg.event.extendedProps?.status === "Completed" || arg.event.extendedProps?.status === "Approved" ){
                  eventEl.style.opacity= '0.6'
                }

                eventEl.id = `event-box-${modalId}`;

                eventEl.setAttribute("onclick", `onClickRefreshMacha('${modalId}')`);

                const st = arg.event.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const et = arg.event.end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const timee = calculateTimeDifference(st, et);

                let isRunning = arg.event.extendedProps?.Run_Time;

                const taskRunning = arg.event.extendedProps?.Run_Time === "true";

                

                if(taskRunning){
                    
                    localStorage.setItem("MODEL_ID", modalId);
                    myLastLogId = arg.event.extendedProps?.lastLogId;

                }




                //Calander Task Boxes
                eventEl.innerHTML = `
                  <div class="ec-event-title" style="background-color:${clrPrio2(priority)};">
                    ${truncateTitle(arg.event.title)}


                    <p id="tic-${modalId}" class="m-0 text-white" style="position: absolute; right: 5px; top: 0px; z-index: 10;">
                      ${status === 'Approved' ? '<i class="bi bi-check2-all"></i>': ''}  
                      ${status === 'Completed' ? '<i class="bi bi-check2"></i>': ''} 
                      ${status === 'Rejected' ? '<i class="bi bi-exclamation-triangle"></i>': ''} 
                    </p>
                  
                  </div>
                  <div id="ot-${modalId}" class="ribbon bg-primary ${
                  arg.event.extendedProps?.Overtime === "false" ? "d-none" : " "
                }" style="font-size: 10px; font-weight: 400;">OT</div>
                  
                  <div class="ec-event-description ${retDescription(timee)}">${
                  arg.event.extendedProps?.description || "No Description"
                }</div>
                  
                  <div class="ec-event-priority">${priority}</div>
                  <div class="ec-event-time ${retPrio(timee)}">
                    ${arg.event.start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - 
                    ${arg.event.end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                `;

                if (isRunning === "true") {
                  eventEl.innerHTML += `<span style="border-radius: 100px" id="badge-${modalId}" class="position-absolute top-0 start-100 translate-middle badge ">
                    <img style="height: 25px; width: 25px;" src="clock.gif" />
                    <span class="visually-hidden">unread messages</span>
                  </span>`;
                }

                const Start_Time_Hours =
                  arg.event.extendedProps?.Start_Time_Hours;
                const Start_Time_Mins =
                  arg.event.extendedProps?.Start_Time_Mins;

                todayTasksSessionStorage(
                  arg.event.extendedProps?.start_date,
                  modalId
                );

                let modalEl = document.createElement("div");
                modalEl.innerHTML = `


                  <div class="modal fade " id="${modalId}" tabindex="-1" aria-labelledby="${modalId}-label" aria-hidden="false">
                  
                    <div class="modal-dialog modal-fullscreen" style="hight: 100%">
                      
                      <div class="modal-content p-0">

                      <div class="modal-header py-2">
                        <div class="ps-0 d-flex align-items-center" style="width: fit-content; border-radius: 10px; color:${clrPrio2(priority)};">
                            <h5 class="mb-0 me-5" style="font-size: 40px;">${arg.event.title}</h5>
                        </div>

                        <div class="ms-auto d-flex">
                                <button id="rbn-cmp-${modalId}" class="btn task-action-btns d-none" onClick="addRibbon('${modalId}')"
                                ${status === "Completed" || !isPastOrToday(arg.event.extendedProps?.start_date) ? 'style="opacity:0" disabled' : ''}
                                ><span class="tooltip-task-action">Complete</span> <i class="bi text-success bi-check-square"></i></button>

                                

                                <button class="btn task-action-btns" onclick="cloneTask('${modalId}', ${safeArg})"><span class="tooltip-task-action">Clone</span> <i class="bi bi-copy text-primary"></i></button>

                                <div class="dropdown">
                                  <button class="btn task-action-btns dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                                  <span class="tooltip-task-action">Delete</span>
                                    <i class="bi bi-trash text-danger fs-5"></i>
                                  </button>
                                  <ul class="dropdown-menu text-center">
                                    <li>Delete Task</li>
                                    <li>
                                      <button class=" btn btn-danger btn-sm" onclick="deleteMainTask('${modalId}')">
                                        Delete
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                        </div>

                        <div class="timer-container b-${clrPrio(priority)}  px-2 ms-3" style="border-radius: 10px; border:1px solid ${clrPrio2(priority)}; ${isTaskDateIsToday(arg.event.extendedProps?.start_date) && !["Completed","Approved","Invoiced",].includes(status)? "": 'opacity:0.4; pointer-events: none;'}">
                            <span style="color: ${clrPrio2(priority)};" class="timer me-2" id="taskTimer-${modalId}">00:00:00</span>
                            <button class="timer-button" id="toggleTimer-${modalId}"} >
                                ${(() => {

                                  if (isRunning === "false") {
                                    return `<i style="color: ${clrPrio2(priority)};" class="bi bi-play-circle-fill"></i>`;
                                  } else {
                                    return `<i style="color: ${clrPrio2(priority)};" class="bi bi-stop-circle-fill"></i>`;
                                  }
                                })()}
                            </button>
                        </div>

                        <button id="mCls-${modalId}" type="button" class="btn-close ms-4" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      
                      <div class="modal-body">
           
                          <div class=" position-relative mb-2">
                           
                              <div class="card-body">
                                  <div class="table-container">
                                      <div class="card task-details"  >
                                        ${
                                          [
                                            "Completed",
                                            "Approved",
                                            "Invoiced",
                                          ].includes(status)
                                            ? `<div class="ribbon" style="background-color:${clrsts(
                                                status
                                              )};" >${status}</div>`
                                            : " "
                                        }
                                        <div id="ribbonn-${modalId}" style="background-color: #00BC7D;" class="ribbon d-none ">Completed</div>
                                          
                                          <div class="card-body">
                                          
                                          <div id="rsn-alrt-${modalId}" class="alert alert-danger d-flex align-items-center ${status === "Rejected" ? "" : "d-none"}" role="alert">   
                                              <div id="rsn-alrt-msg-${modalId}">
                                                ${arg.event.extendedProps?.Rejection_Message}
                                              </div>
                                          </div>

                                          
                                            
                                            <div class="py-2  mb-2" >
                                              <h5 style="color: ${clrPrio2(priority)};">Task Details</h5>
                                            </div>
                                              <table class="table table-borderless" style="table-layout: fixed;">
                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-card-heading"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Project</th>
                                                      <td style="width: 58%;">${
                                                        arg.event.extendedProps
                                                          ?.Project_Name ||
                                                        "No Project Name"
                                                      }</td>
                                                  </tr>

                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-chat-left"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Description</th>
                                                      <td style="width: 58%;">
                                                        <span id="crtDesc-${modalId}">${arg.event.extendedProps?.description ||"No Description"}</span>
                                                        <div class="input-group d-none" id="descInput-${modalId}">
                                                          <input type="text" class="form-control" id="editDesc-${modalId}" value="${arg.event.extendedProps?.description ||"No Description"}">
                                                          <span class="input-group-text bg-primary" id="saveDesc-${modalId}"><i class="bi bi-check text-white"></i></span>
                                                        </div>
                                                        <i id="descPencil-${modalId}" onclick="editTaskDesc('${modalId}')" class="bi bi-pencil-square text-primary float-end"></i>
                                                      </td>
                                                  </tr>

                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-record-circle"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Status</th>
                                                      <td id="stat-${modalId}" style="width: 58%;"><span style="font-size: 14px; box-shadow: 0 0 0 0.7px ${clrsts(
                                                        status
                                                      )}; border-radius: 15px; padding: 3px 9px; background-color:${clrstsbg(
                                                        status
                                                      )};"><i class="bi bi-circle-fill" style="color:${clrsts(
                                                        status
                                                      )}"></i> ${status}</span></td>
                                                  </tr>
                                                  
                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-calendar-check"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Task Date</th>
                                                      <td id="startDate" style="width: 58%;">${arg.event.extendedProps?.start_date ||"No Start date"} </td>
                                                  </tr>

                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-clock"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Time</th>
                                                      <td id="endDate" style="width: 58%;">
                                                      <span id="crtTime-${modalId}">${arg.event.start.toLocaleTimeString([],{hour: "2-digit", minute: "2-digit"})} - ${arg.event.end.toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit"})}</span>

                                                      <div class="input-group d-none" id="timeInput-${modalId}">
                                                        <input type="text" class="form-control" placeholder="HH:MM" id="editSTime-${modalId}" pattern="^([01]\d|2[0-3]):([0-5]\d)$" value="${arg.event.start.toLocaleTimeString([],{hour: "2-digit", minute: "2-digit",  hour12: false})}">
                                                        
                                                        <input type="text" class="form-control" placeholder="HH:MM" id="editETime-${modalId}" value="${arg.event.end.toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit",  hour12: false })}">
                                                        <span class="input-group-text bg-primary" id="saveTime-${modalId}"><i class="bi bi-check text-white"></i></span>
                                                      </div>
                                                      
                                                      <i id="timePencil-${modalId}" onclick="editTime('${modalId}')" class="bi bi-pencil-square text-primary float-end"></i>
                                                      </td>
                                                  </tr>
                                                  
                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-hourglass-split"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Allocated Time</th>
                                                      <td id="allocatedTime-${modalId}" style="width: 58%;">${timee}</td>
                                                  </tr>
                                                  
                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-stopwatch"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Total Time Worked</th>
                                                      <td id="totalTime-${modalId}" style="width: 58%;">0 hrs</td>
                                                  </tr>

                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-flag"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Priority</th>
                                                      <td style="width: 58%;"><span class="badge rounded" style="background: ${clrPrio2(
                                                        priority
                                                      )}; font-size: 14px;">${priority}</span></td>
                                                  </tr>

                                                  <tr>
                                                      <th style="width: 7%;"><i class="bi bi-person"></i></th>
                                                      <th class="fw-semibold" style="color:#3e4043; width: 35%;">Employee or Team Name</th>
                                                      <td style="width: 58%;">${
                                                        arg.event.extendedProps
                                                          ?.assignee ||
                                                        "No assignee"
                                                      }</td>
                                                  </tr>

                                              </table>
                                              
                                              
                                          </div>
                                      </div>
                                      
                                  
                                  <!-- Action Section with Tabs -->
                                  <div class="card action-section" >
                                     
                                      <div class="card-body " style="overflow-y: auto; max-height: 500px; overflow-x: hidden;  scrollbar-width: thin; scrollbar-color: #888 #f1f1f1;">

                                           <ul class="nav nav-tabs p-2" id="taskTabs" role="tablist" style="background-color:#F4F5F7; border-radius: 10px;">
                                              <li class="nav-item"><button class="nav-link tex active" data-bs-toggle="tab" data-bs-target="#subtasks-${modalId}" style="color: #222;">Subtasks</button></li>
                                              <li class="nav-item"><button class="nav-link tex" data-bs-toggle="tab" data-bs-target="#logs-${modalId}" style="color:#222;">Logs</button></li>
                                              <li class="nav-item"><button class="nav-link tex" data-bs-toggle="tab" data-bs-target="#notes-${modalId}" style="color:#222;">Notes</button></li>
                                              <li class="nav-item"><button class="nav-link tex" data-bs-toggle="tab" data-bs-target="#files-${modalId}" style="color:#222;">Files</button></li>
                                              <li class="nav-item"><button class="nav-link tex" data-bs-toggle="tab" data-bs-target="#checklist-${modalId}" style="color:#222;">Checklist</button></li>
                                              <i
                                                class="bi bi-arrow-clockwise download-link"
                                                style="padding: 8px 16px; cursor: pointer;"
                                                onclick="refreshMacha()"
                                                
                                                
                                              ><span class="tooltip-text-2">Refresh</span></i>

                                          </ul>
                                          <div class="tab-content mt-3">
                                              <div class="tab-pane fade show active" id="subtasks-${modalId}">

                                                  <div class="mb-3 d-flex justify-content-start">
                                                      <div style="width: 500px;" class="d-flex align-items-end gap-2">
                                                          <div class="flex-grow-1">
                                                              <input type="text" id="subtaskName-${modalId}" class="form-control" placeholder="Task Name">
                                                          </div>
                                                          <div class="my-auto">
                                                              <button id="addSubtask-${modalId}" style="background-color:${clrPrio2(
                  priority
                )} " class="btn text-white btn-sm bt-${clrPrio(
                  priority
                )}" onclick="addSubtask('${modalId}')" ${
                  status === "Completed" ? "disabled" : ""
                }>Add Subtask</button>
                                                          </div>
                                                      </div>
                                                  </div>

                                                  <div class="px-4 mt-3">
                                                    <table class="table table-borderless">
                                                      <thead>
                                                          <tr>
                                                              <th style="color:#5C5F62; width: 33.33%;">Task Name</th>
                                                              <th style="color:#5C5F62; width: 33.33%;">Status</th>
                                                              <th style="color:#5C5F62; width: 33.33%;">Action</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody class="subtaskList" id="subtaskList-${modalId}"></tbody>
                                                        
                                                    </table>
                                                    
                                                  </div>
                                              </div>
                                              <div class="tab-content mt-3">
                                                  <div class="tab-pane fade " id="logs-${modalId}">
                                                
                                                    <div class="row mb-3">
                                                    
                                                      <div class="col">
                                                      <small class="text-muted text-center">Date</small>
                                                        <input type="date" id="logManualDate-${modalId}" class="form-control" placeholder="DD/MM/YYYY" value="${manualLogDate}"  required>

                                                      </div>
                                                      <div class="col">
                                                        <small class="text-muted">Started Time</small>

                                                        <div class="d-flex gap-2">

                                                        <select id="logManualSTH-${modalId}" class="form-select w-auto">
                                                          ${Array.from({ length: 24 }, (_, i) => 
                                                            `<option value="${i}" ${i == arg.event.extendedProps?.Start_Time_Hours ? "selected" : ""}>
                                                              ${String(i).padStart(2, "0")}
                                                            </option>`
                                                          ).join("")}
                                                        </select>

                                                        <select id="logManualSTM-${modalId}" class="form-select w-auto">
                                                          ${Array.from({ length: 60 }, (_, i) => 
                                                            `<option value="${i}" ${i == arg.event.extendedProps?.Start_Time_Mins ? "selected" : ""}>
                                                              ${String(i).padStart(2, "0")}
                                                            </option>`
                                                          ).join("")}
                                                        </select>

                                                        </div> 

                                                      </div>

                                                      <div class="col">
                                                        <small class="text-muted">Finished Time</small>
                                                        <div class="d-flex gap-2">


                                                        <select id="logManualETH-${modalId}" class="form-select w-auto">
                                                          ${Array.from({ length: 24 }, (_, i) => 
                                                            `<option value="${i}" ${i == arg.event.extendedProps?.End_Time_Hours ? "selected" : ""}>
                                                              ${String(i).padStart(2, "0")}
                                                            </option>`
                                                          ).join("")}
                                                        </select>

                                                        <select id="logManualETM-${modalId}" class="form-select w-auto">
                                                          ${Array.from({ length: 60 }, (_, i) => 
                                                            `<option value="${i}" ${i == arg.event.extendedProps?.End_Time_Mins ? "selected" : ""}>
                                                              ${String(i).padStart(2, "0")}
                                                            </option>`
                                                          ).join("")}
                                                        </select>
                                                         
                                                        </div>
                                                      </div>

                                                      <div class="col">
                                                         <button id="addLog-${modalId}" style="background-color:${clrPrio2(
                                                            priority
                                                          )} " class="btn bt-${clrPrio(
                                                            priority
                                                          )} btn-sm my-4 text-white" onclick="addNewLogManualy('${modalId}')" ${
                                                            status === "Completed" ? "disabled" : ""
                                                          }>Add Log</button>
                                                      </div>
                                                    </div>
                                                    
                                                      <div class="px-4">
                                                        <h5 >Log History</h5>
                                                      <table class="table table-borderless" >
                                                          <thead>
                                                              <tr>
                                                                  <th style="color:#5C5F62; width: 25%;">Date</th>
                                                                  <th style="color:#5C5F62; width: 25%;">Start Time</th>
                                                                  <th style="color:#5C5F62; width: 25%;">End Time</th>
                                                                  <th style="color:#5C5F62; width: 25%;">Hours Worked</th>
                                                                  
                                                              </tr>
                                                          </thead>
                                                          <tbody id="logHistory-${modalId}"></tbody>
                                                      </table>
                                                      </div>
                                                  </div>
                                              </div>

                                              <div class="tab-pane fade" id="notes-${modalId}">
                                                  <h5>Notes</h5>
                                                  <textarea id="noteText-${modalId}" class="form-control" rows="3" placeholder="Enter your note"></textarea>
                                                  <button id="addNote-${modalId}" style="background-color:${clrPrio2(
                                                      priority
                                                    )} " class="btn btn-sm bt-${clrPrio(
                                                      priority
                                                    )} mt-2 text-white" onclick="addNote('${modalId}')" ${
                                                      status === "Completed" ? "disabled" : ""
                                                    }>Add Note</button>
                                                  <ul  class="list-group mt-3"></ul>
                                                  <div class="mx-5 ms-4" id="noteList-${modalId}"></div>
                                              </div>

                                              <div class="tab-pane fade" id="files-${modalId}">
                                                  <h5>Files</h5>
                                                  <div class="mb-3 d-flex justify-content-start">
                                                      <div  class="d-flex align-items-end gap-2">
                                                          <div class="flex-grow-1">
                                                              <input type="file" id="fileUpload-${modalId}" class="form-control">
                                                              <small class="text-muted">Maximum file size is 10MB</small>
                                                              
                                                          </div>
                                                          <div class="mb-auto mt-1">
                                                              <button id="uploadFile-${modalId}" style="background-color:${clrPrio2(
                                                                  priority
                                                                )} " class="btn btn-sm bt-${clrPrio(
                                                                  priority
                                                                )} text-white" onclick="addFile('${modalId}')" ${
                                                                  status === "Completed" ? "disabled" : ""
                                                                }>Upload File</button>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <ul id="fileList-${modalId}" class="list-group mt-3 files2"></ul>
                                              </div>
                                           
                                              
                                              <div class="tab-pane fade " id="checklist-${modalId}">
                                                  <h5>Checklist</h5>  
                                                  
                                                  <div class="row">

                                                    <div class="col">
                                                      <input type="text" id="checklistItem-${modalId}" class="form-control" placeholder="Enter checklist item">
                                                      <button id="addChecklist-${modalId}" style="background-color:${clrPrio2(
                                                          priority
                                                        )} " class="btn btn-sm bt-${clrPrio(
                                                          priority
                                                        )} mt-3 text-white" onclick="addChecklistItem('${modalId}')" ${
                                                          status === "Completed" ? "disabled" : ""
                                                        }>Add Item</button>
                                                    </div>
                                                    
                                                    <div class="col">

                                                      <div class="checklist-toggle"  style="height: 100px; overflow-y: auto;" data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" class="scrollspy-example bg-body-tertiary p-3 rounded-2" tabindex="0">
                                                        
                                                        <div class="form-check form-switch ms-auto">

                                                          <div id="checklistTemplateContiner-${modalId}">

                                                          </div>
                  
                                                        </div>
                                                      </div>

                                                    </div>
                                                    
                                                  </div>
                                                  
                                                  <ul id="checklistList-${modalId}" class="list-group mt-3"></ul>
                                              </div>
                                          </div>

                                      </div>
                                  </div>
                                </div>
                              </div>
                          </div>
                      </div>
    
                      </div>
                    </div>
                  </div>
                  
                  
                `;

                // related js

                addAllModalIdToSessionStorage("allModalIdArr", modalId);
                localStorage.setItem("isRunning", isRunning);

                // Append modal to body (to prevent nesting issues)
                document.body.appendChild(modalEl);

                //try to avoid api unwanted looping to newUpdate -- Tommorow (use local storage logic)



                if(isTaskDateIsToday(arg.event.extendedProps?.start_date) && !AVOIDNEWUPDATE.includes(modalId)){

                  newUpdate(modalId,isRunning,timee,Start_Time_Hours,Start_Time_Mins,status, priority);

                  AVOIDNEWUPDATE.push(modalId);

                  console.log("(TEST COUNT)", TESTCOUNT, AVOIDNEWUPDATE)
                  TESTCOUNT += 1;

                }

                


                getAlreadyAddedTemplate().then((addedTemplate) => {
                  getChecklistTemplate().then((t) => {
                    const uniqueTemplate = [
                      ...new Set(
                        t.map((tt) => tt.Checklist_Template.display_value)
                      ),
                    ];
                    // console.log(uniqueTemplate)
                    let html = "";
                    uniqueTemplate.forEach((tem) => {
                      const checking = addedTemplate.filter(
                        (m) => m.Checklist_Template.display_value === tem
                      );
                      // console.log("checking", checking.filter(m => m.Task.ID  === modalId))

                      if (checking.filter((m) => m.Task.ID === modalId)) {
                        // console.log("Hellow world mamey..")
                      }

                      html += `
                     
                        <input id="switchCheckDefault-${modalId}" onChange='addChecklistTemplate(this, "${tem}", ${JSON.stringify(
                        t
                      )},"${modalId}")' class="form-check-input" type="checkbox" role="switch" ${
                        checking.some((m) => m.Task.ID === modalId)
                          ? "checked"
                          : ""
                      }  >
                        <small class="text-muted">${tem}</small><br>
                     
                      `;
                    });
                    document.getElementById(
                      `checklistTemplateContiner-${modalId}`
                    ).innerHTML = html;
                  });
                });

                if (status === "Completed" || status === "Approved") {
                  disableEverything(modalId);
                }

                return { domNodes: [eventEl] };
              },
            });

            function hasOverlappingEvents(event) {
              const rId = event.resource
                ? event.resource.id
                : event.resourceIds[0];
              return ec
                .getEvents()
                .some(
                  (e) =>
                    e.resourceIds[0] === rId &&
                    e.start < event.end &&
                    event.start < e.end &&
                    e.id !== event.id
                );
            }

            function hasOtherOverlappingEvents(event) {
              return hasOverlappingEvents(event);
            }

            

            // console.log(ALLTURE)
            const allSame = ALLTURE.every((val) => val === ALLTURE[0]);

            if (allSame) {
              console.log(" all true");
            } else {
              const localModelID = localStorage.getItem("MODEL_ID");
              const itemTasks = document.getElementsByClassName("timer-button");

              for (let item of itemTasks) {
                if (item.id != `toggleTimer-${localModelID}`) {
                  item.setAttribute("disabled", "true");
                  item.style.opacity = "0.5";
                }
              }
            }
          }).catch(function (error) {
            console.error("Error fetching task data: Task Catch Block ", error);
            /////////////////////////////////////////////////////////////////// Dummy events
            const events = [
              {
                id: 1,
                resourceIds: [USERID],
                start: new Date().toISOString().split('T')[0] + "T09:00:00",
                end: new Date().toISOString().split('T')[0] + "T10:00:00",
                title: "Existing Task"
              }
            ];

            const shiftStartLocal = "08:00:00";
            const shiftEndLocal = "24:00:00";

            document.getElementById("ec").innerHTML = "";
            const ec = new EventCalendar(document.getElementById("ec"), {
              resources,
              events,
              view: "resourceTimeGridWeek",
              allDaySlot: false,
              slotMinTime: shiftStartLocal,
              slotMaxTime: shiftEndLocal,
              nowIndicator: true,
              selectable: true,
              editable: true,
              firstDay: 1,
              hiddenDays: [0, 6],
              select: function (event) {

                        console.log(event)

                        
                        const start = event.start;
                        const end = event.end;

                        const newEvent = {
                          id: new Date().getTime(),
                          resourceIds: [event.resource.id],
                          start: start,
                          end: end,
                          title: "New Task",
                          description: "",
                        };

                        console.log(newEvent)

                        addNewEvent(event);

                        // showModal(newEvent);
                      },
            });
            
          });
      })
      .catch(function (error) {
        console.error("Error fetching employee data:", error);
      });




    
  })
  .catch(function (error) {
    console.error("Error initializing Zoho Creator SDK:", error);
  });


  if(APICOUNT>1){
    setTimeout(()=>{
      console.log("(API CALL COUNT)", APICOUNT);    

      refreshMacha();
    },1000)
    
  }
}

johoApi();

function isPastOrToday(inputDateStr) {

  if(!inputDateStr){
    return false;
  }
  // Split the input string into day, month, and year
  const [day, month, year] = inputDateStr.split("-").map(Number);

  // Create Date object from input date (set to midnight for comparison)
  const inputDate = new Date(year, month - 1, day);
  inputDate.setHours(0, 0, 0, 0);

  // Today's date (set to midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Return true if the input date is in the past or today, false if it is in the future
  return inputDate <= today;
}

//Accept Zoho Date format
function isPastDate(inputDateStr) {
  const [day, month, year] = inputDateStr.split("-").map(Number);

  // Create date object from input (use midnight for comparison)
  const inputDate = new Date(year, month - 1, day);
  inputDate.setHours(0, 0, 0, 0);

  // Today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate < today;
}

//Accept Calendar Date format
function isPastDate2(dateStr) {
  // Parse the input string into a Date object
  const input = new Date(dateStr);

  // Remove time (set time to midnight)
  const inputDate = new Date(
    input.getFullYear(),
    input.getMonth(),
    input.getDate()
  );

  // Get today's date with time set to midnight
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Compare the two
  return inputDate < todayDate;
}

//Getting all Checklist Templates...
async function getChecklistTemplate() {
  const CHECKLISTTEMPLATEARRAY = [];

  const templateConfig = {
    appName: "zenworkr",
    reportName: "All_Checklist_Template_Items",
  };
  try {
    const res = await ZOHO.CREATOR.API.getAllRecords(templateConfig);
    res.data.forEach((temp) => {
      // CHECKLISTTEMPLATEARRAY.push(temp.Checklist_Template.display_value);
      CHECKLISTTEMPLATEARRAY.push(temp);
      // console.log(temp)
    });
    return CHECKLISTTEMPLATEARRAY;
  } catch (error) {
    console.error("Error fetching checklist template:", error);
    return [];
  }
}

//get already added templates...
async function getAlreadyAddedTemplate() {
  const ADDEDTEMPLATEARRAY = [];
  const config = {
    appName: "zenworkr",
    reportName: "All_Task_Checklists",
  };
  try {
    const res = await ZOHO.CREATOR.API.getAllRecords(config);
    res.data.forEach((templ) => {
      ADDEDTEMPLATEARRAY.push(templ);
    });
    return ADDEDTEMPLATEARRAY;
  } catch (error) {
    console.error("Error fetching the added checklist template:", error);
    return [];
  }
}

//refresh Checklist..
window.refreshChecklist = function (modalId) {
  const checklistList = document.getElementById(`checklistList-${modalId}`);

  // 🛡️ Prevent error if element not found
  if (!checklistList) {
    console.warn(`⚠️ checklistList-${modalId} not found in DOM.`);
    return;
  }

  checklistList.innerHTML = `<li style="text-align:center; font-style: italic; color: gray;" class="list-group-item">Checklists are loading...</li>`;

  const checklistConfig = {
    appName: "zenworkr",
    reportName: "All_Checklists",
  };

  ZOHO.CREATOR.API.getAllRecords(checklistConfig).then(function (Checklistresponse) {
    let checklisting = "";

    Checklistresponse.data.forEach((checklist) => {
      if (modalId == checklist.Task.ID) {
        checklisting += `
          <li  class="list-group-item d-flex justify-content-between  align-items-center ${
            checklist.Done === "false" ? "" : "text-decoration-line-through"
          }">


          <div class="d-flex " style="width: 100%">
          
            <button class='btn p-0 btn-sm me-2 ' ${
              checklist.Done === "true"
                ? `onclick="unCheckChecklistItem('${checklist.ID}', '${modalId}')"`
                : `onclick="markChecklistItem('${checklist.ID}', '${modalId}')"`
              } ><i class="bi ${
              checklist.Done === "false"
                ? "bi-app fs-5"
                : "bi-check2-square text-success fs-5"
              }"></i>
            </button> 
        
          
            <p class="m-0 mt-1">${checklist.List_field}</p>

          </div>

          <span style="color: grey; font-size:10px; " class="m-0 fst-italic ${checklist.Mandatory === "true" ? "" :"d-none"}">mandatory</span>

          
          
          </li>
          `;
      }
    });

    checklistList.innerHTML =
      checklisting ||
      `<li style="text-align:center; font-style: italic; color: gray;" class="list-group-item">Checklists are not found...</li>`;
  });
};

//refresh logs..
window.refreshLogs = function (modalId) {
  const logTable = document.getElementById(`logHistory-${modalId}`);
  const totalTimeElement = document.getElementById(`totalTime-${modalId}`);

  // 🛡️ Prevent error if element not found
  if (!logTable) {
    console.warn(`⚠️ logTable-${modalId} not found in DOM.`);
    return;
  }

  // Show loading row
  logTable.innerHTML = `
<tr>
  <td colspan="4" style="text-align:center; font-style: italic; color: gray;">
    Loading logs...
  </td>
</tr>`;

  const logsConfig = {
    appName: "zenworkr",
    reportName: "All_Logs",
    //add criteria here
  };

  ZOHO.CREATOR.API.getAllRecords(logsConfig).then(function (logsresponse) {
    let totalTimeWorked = [];
    let newRow = "";

    logsresponse.data.forEach((log) => {
      if (modalId == log.Task.ID) {
        totalTimeWorked.push(log.Hours_Worked);
        newRow += `
            <tr>
              <td>${log.Date_field}</td>
              <td>${log.Work_Started}</td>
              <td>${log.Work_Ended}</td>
              <td>${log.Hours_Worked}</td>
            </tr>`;
      }
    });

    logTable.innerHTML = newRow || `<tr>
        <td colspan="4" style="text-align:center; font-style: italic; color: gray;">
          No logs found.
        </td>
      </tr>`;

    // console.log("totalTimeWorked", totalTimeWorked)
    totalTimeElement.innerText = calTotalWorkedHrs(totalTimeWorked);

    checkOvertime(modalId);

    
  });
};

//refresh notes..
window.refreshNotes = function (modalId) {
  let noteList = document.getElementById(`noteList-${modalId}`);

  // 🛡️ Prevent error if element not found
  if (!noteList) {
    console.warn(`⚠️ noteList-${modalId} not found in DOM.`);
    return;
  }

  noteList.innerHTML = `<li style="text-align:center; font-style: italic; color: gray;" class="list-group-item">Notes are laoding...</li>`; // clear old logs

  // // Fetch notes data
  const notesConfig = {
    appName: "zenworkr",
    reportName: "All_Notes",
  };

  ZOHO.CREATOR.API.getAllRecords(notesConfig).then(function (notesresponse){
    // console.log("Note Response:",notesresponse)
    let newNote = "";
    notesresponse.data.forEach((note) => {

      if (modalId == note.Task.ID) {


        newNote +=  `
          <div class="d-flex my-3 notesDiv"  >
            

            <div class=" px-4 pt-3 pb-0 noteStyle ms-3" >
              
              <p class="mb-1">${note.Note}</p>
              <p class="m-0 mb-1 text-end" style="color: grey; font-size: 10px;">by <span style="font-size: 14px;" class="fw-semibold" >${note.Added_User}</span> - ${note.Added_Time}</p>
            </div>

            <div class="align-content-center ms-2">
              <i onclick="deleteNotes('${note.ID}','${modalId}')" class="bi bi-trash fs-5 text-danger notesDelete"></i>
            </div>
          
          </div>
        
        `
        
      }
    });



    noteList.innerHTML =
      newNote ||
      `<li style="text-align:center; font-style: italic; color: gray;" class="list-group-item">Notes are not found...</li>`;
  });
};

//refresh subtasks..
window.refreshSubtasks = function (modalId) {
      const tableBody = document.getElementById(`subtaskList-${modalId}`);

      // 🛡️ Prevent error if element not found
      if (!tableBody) {
        console.warn(`⚠️ tableBody-${modalId} not found in DOM.`);
        return;
      }

      tableBody.innerHTML = `
                                <tr>
                                  <td colspan="4" style="text-align:center; font-style: italic; color: gray;">
                                    Loading subtasks...
                                  </td>
                                </tr>`;

      const subTaskConfig = {
        appName: "zenworkr",
        reportName: "Subtask_Report",
      };

      ZOHO.CREATOR.API.getAllRecords(subTaskConfig).then(function (
        subTaskresponse
      ) {
        let row = "";
        subTaskresponse.data.forEach((subtask) => {
          const subtaskID = subtask.ID;

          if (modalId == subtask.Task.ID) {
            if (subtask.Status === "New") {
              row += `<tr>
                  <td>${subtask.Sub_task_Name}</td>
                  <td class="status">${subtask.Status}</td>
                  <td>
                       <button class='btn btn-sm p-0 pe-4 download-link' onclick='updateStatus(this, "${subtask.Status}", "${subtaskID}", "${modalId}")' > <span class="tooltip-text">Mark In Progress</span>
 <i class="bi bi-person-workspace text-warning fs-5"></i></button> 
                      <button class='btn  btn-sm p-0 download-link' onclick='deleteSubtask("${subtaskID}", "${modalId}")'><span class="tooltip-text">Delete</span><i class="bi bi-trash text-danger fs-5"></i></button>
                  </td>
                  </tr>`;
            } else if (subtask.Status === "In Progress") {
              row += `<tr>
                  <td>${subtask.Sub_task_Name}</td>
                  <td class="status">${subtask.Status}</td>
                  <td>
                       <button class='btn btn-sm p-0 pe-4 download-link' onclick='updateStatus(this, "${subtask.Status}", "${subtaskID}", "${modalId}")'  > <span class="tooltip-text">Mark as Done</span><i class="bi bi-check-square-fill text-primary fs-5"></i></button> 
                      <button class='btn  btn-sm p-0 download-link' onclick='deleteSubtask("${subtaskID}", "${modalId}")'><span class="tooltip-text">Delete</span><i class="bi bi-trash text-danger fs-5"></i></button>
                  </td>
                  </tr>`;
            } else if (subtask.Status === "Completed") {
              //Only Delete Button

              row += `<tr>
                  <td>${subtask.Sub_task_Name}</td>
                  <td class="status">${subtask.Status}</td>
                  <td>
                       
                      <button style="opacity: 0.3; border: none;" class='btn btn-sm p-0 download-link' onclick='deleteSubtask("${subtaskID}", "${modalId}")' disabled><span class="tooltip-text">Delete</span><i class="bi bi-trash text-danger fs-5"></i></button>
                  </td>
                  </tr>`;
            }
          }
        });
        tableBody.innerHTML =
          row ||
          `
      <tr>
        <td colspan="3" style="text-align:center; font-style: italic; color: gray;">
          No sub tasks found.
        </td>
      </tr>`;
      });
};

//refresh Files..
window.refreshFiles = function (modalId) {
      let fileList = document.getElementById(`fileList-${modalId}`);

      // 🛡️ Prevent error if element not found
      if (!fileList) {
        console.warn(`⚠️ fileList-${modalId} not found in DOM.`);
        return;
      }
      fileList.innerHTML = `<li  style="text-align:center; font-style: italic; color: gray;" class="list-group-item">Files are loading...</li>`; // clear old logs

      const FilesConfig = {
        appName: "zenworkr",
        reportName: "All_Files",
      };

      ZOHO.CREATOR.API.getAllRecords(FilesConfig).then(function (
        Filesresponse
      ) {
        // console.log("file respojnse:", Filesresponse.data);
        let newFile = "";
        Filesresponse.data.forEach((file) => {
          if (modalId == file.Task.ID) {
            const fileID = file.ID;
            const fullStr = file.File_field;

            const cleaned = fullStr.replace(
              "/api/v2/32demo1zentegra/zenworkr/report/All_Files/",
              ""
            );

            // const newFile =`<li class="list-group-item d-flex justify-content-between"><img src="https://creatorapp.zoho.com${fullStr}" >
            // <button onClick="downloadFile('${fileID}')" class="btn btn-outline-dark btn-sm">Download</button></li>`; https://creatorapp.zoho.com${fullStr}

            newFile += `
                  <li class="list-group-item d-flex justify-content-between ">

                    <div class="preview">

                      <img src="${
                        [".png", ".jpg", ".jpeg", ".webp"].some((ext) =>
                          fullStr.toLowerCase().endsWith(ext)
                        )
                          ? `https://creatorapp.zoho.com${fullStr}`
                          : fullStr.toLowerCase().endsWith(".pdf")
                          ? "https://cdn-icons-png.flaticon.com/128/337/337946.png"
                          : "https://cdn-icons-png.flaticon.com/128/2821/2821739.png"
                      }" alt="${cleaned}" style="max-height: 30px; cursor: pointer;" />

                      <div class="d-flex">
                        
                        <p class="m-0 text-end" style="color: grey; font-size: 10px;">by <strong>${file.Added_User}</strong> - ${file.Added_Time}</p>

                      </div>
                         
                    </div>


                    <div >
                      <a href="https://creatorapp.zoho.com${fullStr}" 
                        class="download-link mx-4">
                        <i class="bi bi-download text-dark fs-5"></i>
                        <span class="tooltip-text">Download</span>
                      </a>

                      <a onclick="deleteFile('${fileID}', '${modalId}')" class="download-link mx-4 delete-btn2">
                        <i  class="bi bi-trash text-danger fs-5 "></i>
                        <span class="tooltip-text">Delete</span>
                      </a>
                    </div>


                  </li>
                `;
          }
        });
        fileList.innerHTML =
          newFile ||
          `<li style="text-align:center; font-style: italic; color: gray;" class="list-group-item">Files are not found...</li>`;
      });
};


function createDate(hours, minutes) {
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  return now;
}

function formatDateTime(date) {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0") +
    " " +
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0") +
    ":00"
  );
}
// Function to update Zoho Creator when a task is moved/resized
function updateZohoTask(event) {
  console.log(event);

  const taskId = event.id; // Task unique ID

  console.log("update : records-->", event);
  const taskNewDate = formatDateToDDMMYYYY(event.start);
  console.log(taskNewDate);

  // Fetch Employee ID from the event resource
  const employeeId = event.resourceIds ? event.resourceIds[0] : null; // Ensure Employee ID exists

  if (!employeeId) {
    console.error("❌ Error: Employee ID is missing.");
    return;
  }

  const updateConfig = {
    appName: "zenworkr",
    reportName: "Task_Report",
    id: taskId,
    data: {
      data: {
        Start_Time_Hours: event.start.getHours(),
        End_Time_Hours: event.end.getHours(),
        Start_Time_Mins: event.start.getMinutes(),
        End_Time_Mins: event.end.getMinutes(),
        Assignee: employeeId,
        Task_Date: taskNewDate,
        Start_Time: `${event.start.getHours()}:${event.start.getMinutes()}`,
        End_Time: `${event.end.getHours()}:${event.end.getMinutes()}`
      },
    },
  };

  ZOHO.CREATOR.API.updateRecord(updateConfig)
    .then(function (response) {
      if (response.code === 3000) {
        console.log("✅ Task updated successfully in Zoho Creator:", response);
        // refreshMamey()
      } else {
        console.error("❌ Failed to update task:", response);
      }
    })
    .catch(function (error) {
      console.error("❌ Error updating task in Zoho Creator:", error);
    });

  // function refreshMamey(){
  //   const subtaskList = document.getElementsByClassName('subtaskList');

  //   for (let item in subtaskList){
  //     item.innerText = "hello mamey"
  //   }
  // }
}

function clrPrio(priority) {
  if (priority === "High") {
    return "danger";
  } else if (priority === "Medium") {
    return "warning";
  } else if (priority === "Low") {
    return "success";
  } else {
    return "nopriority";
  }
}

function clrPrio2(priority) {
  if (priority === "High") {
    return "#FF6467";
  } else if (priority === "Medium") {
    return "#FE9A00";
  } else if (priority === "Low") {
    return "#00C951";
  } else {
    return "#52525C";
  }
}

function clrPrio3(priority) {
  if (priority === "High") {
    return "linear-gradient(135deg, #FB2C36 0%, #8b2f26  100%);";
  } else if (priority === "Medium") {
    return "linear-gradient(135deg, #BB4D00 0%, #FDC700 100%);";
  } else if (priority === "Low") {
    return "linear-gradient(135deg, #00A63E 0%, #126b4f 100%);";
  } else {
    return "#52525C;";
  }
}

function clrsts(status) {
  if (status === "Not Started") {
    return "#314158";
  } else if (status === "In Progress") {
    return "#F0B100";
  } else if (status === "Completed") {
    return "#00BC7D";
  } else if (status === "Approved") {
    return "#155DFC";
  } else if (status === "Invoiced") {
    return "#4F39F6";
  } else if (status === "Rejected") {
    return "#FB2C36";
  } else {
    return "black";
  }
}

function clrstsbg(status) {
  if (status === "Not Started") {
    return "#CAD5E2";
  } else if (status === "In Progress") {
    return "#FFF085";
  } else if (status === "Completed") {
    return "#A4F4CF";
  } else if (status === "Approved") {
    return "#8EC5FF";
  } else if (status === "Invoiced") {
    return "#A3B3FF";
  } else if (status === "Rejected") {
    return "#FFA2A2";
  } else {
    return "white";
  }
}

function calculateTimeDifference(startTime, endTime) {
  // Convert time strings to Date objects
  const start = new Date(`01/01/2000 ${startTime}`);
  const end = new Date(`01/01/2000 ${endTime}`);

  // Calculate the difference in milliseconds
  let diffMs = end - start;

  // Convert milliseconds to hours and minutes
  let diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
  let diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes

  return `${diffHrs} hrs ${diffMins > 0 ? diffMins + " mins" : ""}`.trim();
}

// function retDescription(timee) {
//   if (timee === '0 hrs 30 mins' || timee === '1 hrs' || timee === '1 hrs 30 mins') {
//     return 'd-none';
//   }
//   else if(timee === '2 hrs' ) {
//     return 'text-limit-1'
//   }
//   else if(timee === '2 hrs 30 mins' ){
//     return 'text-limit-2'
//   } else if(timee === '3 hrs' || timee === '3 hrs 30 mins' || timee === '4 hrs' || timee === '4 hrs 30 mins' ){
//     return 'text-limit-3'
//   }
// }
function retDescription(timee) {
  let hours = 0, minutes = 0;

  if (timee.includes('hrs')) {
    const hrsMatch = timee.match(/(\d+)\s*hrs?/);
    if (hrsMatch) hours = parseInt(hrsMatch[1], 10);
  }

  if (timee.includes('mins')) {
    const minsMatch = timee.match(/(\d+)\s*mins?/);
    if (minsMatch) minutes = parseInt(minsMatch[1], 10);
  }

  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes >= 30 && totalMinutes <= 90) {
    return 'd-none';
  }
  else if (totalMinutes < 30 ) {
    return 'd-none';
  } 
  else if (totalMinutes > 90 && totalMinutes <= 150) {
    return 'text-limit-1';
  } else if (totalMinutes > 150 && totalMinutes <= 180) {
    return 'text-limit-2';
  } else if (totalMinutes > 180 && totalMinutes <= 270) {
    return 'text-limit-3';
  }

  return '';
}

function retPrio(timee) {
  let hours = 0, minutes = 0;

  const hrsMatch = timee.match(/(\d+)\s*hrs?/);
  if (hrsMatch) hours = parseInt(hrsMatch[1], 10);

  const minsMatch = timee.match(/(\d+)\s*mins?/);
  if (minsMatch) minutes = parseInt(minsMatch[1], 10);

  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes < 60) {
    return "d-none";
  }

  return "";
}

console.log(
  "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
);

// new update ---------------------------------------------------------------------------------------------------------

//fetch the updated task report without looping sholud not use johoApi -- Tommorow

function newUpdate(modalId,isRunning,timee,Start_Time_Hours,Start_Time_Mins,status,priority) {

  let timerRunning = false;
  let startTime;
  let timerInterval;

  const toggleBtn = document.getElementById(`toggleTimer-${modalId}`);
  const taskTimer = document.getElementById(`taskTimer-${modalId}`);

  const itemTasks = document.getElementsByClassName("timer-button");

  if (isRunning === "true") {
    startTime = new Date();
    timerRunning = true;

    const [logId, logStartTime] = myLastLogId.split("-");

    // const lastLog1 = localStorage.getItem("LASTLOG");

    let lastLog2;
    

    // (async () => {
    //   var config = {
    //     appName: "zenworkr",
    //     reportName: "All_Logs",
    //     id: logId,
    //   };

    //   try {
    //     const res = await ZOHO.CREATOR.API.getRecordById(config);
    //     console.log("lasttt-->", res.data.Work_Started);

    //     lastLog2 = res.data.Work_Started;

    //     runTimer(lastLog2);
    //   } catch (error) {
    //     console.error("Error Fetching record mameyy:", error);
    //   }
    // })();

    const runTimer = (logStartTime) => {

      const currentTime = new Date().toLocaleTimeString("en-IN", {hour12: false,});

      function calculateTimeDifference2(startTime, endTime) {
        const [sh, sm, ss] = startTime.split(":").map(Number);
        const [eh, em, es] = endTime.split(":").map(Number);

        const start = new Date();
        start.setHours(sh, sm, ss);

        const end = new Date();
        end.setHours(eh, em, es);

        let diffInSeconds = Math.floor((end - start) / 1000);

        if (diffInSeconds < 0) diffInSeconds += 24 * 3600; // handle crossing midnight

        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;

        return `${hours}:${minutes}:${seconds}`;
      }

      const calculateInitialOffest = calculateTimeDifference2(logStartTime,currentTime);

      console.log("calculateInitialOffest", calculateInitialOffest);

      const [h, m, s] = calculateInitialOffest.split(":").map(Number);

      console.log(h, m, s);

      let initialOffset = (h * 3600 + m * 60 + s) * 1000;

      console.log("initialOffset", initialOffset);

      let start = Date.now() - initialOffset;
      timerInterval = setInterval(function () {
        let elapsed = Date.now() - start;
        let hours = Math.floor(elapsed / 3600000);
        let minutes = Math.floor((elapsed % 3600000) / 60000);
        let seconds = Math.floor((elapsed % 60000) / 1000);
        taskTimer.innerText = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }, 1000);
    };
    runTimer(logStartTime);
  }

  toggleBtn.addEventListener("click", function () {

    if (!timerRunning) {
      startTime = new Date();
      timerRunning = true;
      this.innerHTML = `<i style="color: ${clrPrio2(priority)};" class="bi bi-stop-circle-fill"></i>`;
      startTimer(modalId);

      const startTimeStr = startTime.toLocaleTimeString("en-IN", {hour12: false,});
      console.log("Start Time is gonna add now...");
      addOnlyStartTime(modalId, startTimeStr);

      localStorage.setItem("MODEL_ID", modalId);

      //I forgot this so just commented & i have done inside the Add only start time function

      // if (status === "Not Started" || status === "Rejected") {
      //   const statustd = document.getElementById(`stat-${modalId}`);

      //   var formData = {
      //     data: {
      //       Task_Status: "In Progress",
      //     },
      //   };

      //   var config = {
      //     appName: "zenworkr",
      //     reportName: "Task_Report",
      //     id: modalId,
      //     data: formData,
      //   };
      //   ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
      //     if (response.code == 3000) {
      //       // console.log("Record updated successfully");
      //       statustd.innerHTML = `<span style="font-size: 14px; box-shadow: 0 0 0 0.7px #F0B100; border-radius: 15px; padding: 3px 9px; background-color: #FFF085"><i class="bi bi-circle-fill" style="color: #F0B100"></i> In Progress</span>`;
      //     }
      //   });
      // }

      // // console.log("SEEEE THE ISRUNNINGGG-->", isRunning);
      // if (isRunning === "false") {
      //   console.log("Trying to update runitme da...", isRunning);

      //   const formData = {
      //     data: {
      //       Run_Time: true,
      //     },
      //   };

      //   const config = {
      //     appName: "zenworkr",
      //     reportName: "Task_Report",
      //     id: modalId,
      //     data: formData,
      //   };

      //   ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
      //     if (response.code == 3000) {
      //       console.log("Record updated successfully");
      //       isRunning = "true";
      //     }
      //   });
      // }

      for (let item of itemTasks) {
        if (item.id != `toggleTimer-${modalId}`) {
          item.setAttribute("disabled", "true");
          item.style.opacity = "0.3";
        }
      }
    } else {

      let endTimeStr = new Date().toLocaleTimeString("en-IN", { hour12: false });
      const [logId, logStartTime] = myLastLogId.split("-"); //work here
      addOnlyEndTime(logStartTime,endTimeStr,logId,modalId,timee,Start_Time_Hours,Start_Time_Mins);
      clearInterval(timerInterval);

      isRunning = "false";

      const formData = {
        data: {
          Run_Time: false,
          lastLogId: " "
        },
      };

      const config = {
        appName: "zenworkr",
        reportName: "Task_Report",
        id: modalId,
        data: formData,
      };

      ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
        if (response.code == 3000) {
          myLastLogId = "";
          console.log("Run_Time updated as false successfully and the myLastLogId is", myLastLogId);
        }
      });

      // let currentTotal = parseFloat(totalTimeElement.innerText) || 0;
      // let updatedTotal = currentTotal + parseFloat(hoursWorked);
      // totalTimeElement.innerText = updatedTotal.toFixed(2) + " hrs";

      // let rate = parseFloat(employeeRateElement.innerText);
      // totalAmountElement.innerText = "$" + (updatedTotal * rate).toFixed(2);

      timerRunning = false;
      this.innerHTML = `<i style="color: ${clrPrio2(priority)};" class="bi bi-play-circle-fill"></i>`;
      

      const badge = document.getElementById(`badge-${modalId}`);
      if (badge) badge.remove();

      const todaystasks = JSON.parse(sessionStorage.getItem("TodayTasks") || "[]");

      for (let item of todaystasks) {
        const todayTaskId = document.getElementById(`toggleTimer-${item}`);

        if (todayTaskId) {
          todayTaskId.removeAttribute("disabled");
          todayTaskId.style.opacity = "1";
        }
      }

      localStorage.removeItem("MODEL_ID");
    }
  });

  function startTimer(modalId) {
    let start = Date.now();
    timerInterval = setInterval(function () {
      let elapsed = Date.now() - start;
      let hours = Math.floor(elapsed / 3600000);
      let minutes = Math.floor((elapsed % 3600000) / 60000);
      let seconds = Math.floor((elapsed % 60000) / 1000);
      taskTimer.innerText = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);

    const addBatch = document.getElementById(`event-box-${modalId}`);
    addBatch.innerHTML += `
        <span style="border-radius: 100px" id="badge-${modalId}" class="position-absolute top-0 start-100 translate-middle badge ">
          <img style="height: 25px; width: 25px;" src="clock.gif" />
          <span class="visually-hidden">unread messages</span>
        </span>
        `;
  }

}

function addSubtask(modalId) {
  let input = document.getElementById("subtaskName-" + modalId);
  let task = input.value.trim();
  if (task !== "") {
    addNewSubtask(modalId, task);
    input.value = "";
  }
}


function updateStatus(button, status, subtaskID, modalId) {
  if (status === "New") {
    var formData = {
      data: {
        Status: "In Progress",
      },
    };

    var statusUpdateconfig = {
      appName: "zenworkr",
      reportName: "Subtask_Report",
      id: subtaskID,
      data: formData,
    };
    ZOHO.CREATOR.API.updateRecord(statusUpdateconfig).then(function (response) {
      if (response.code == 3000) {
        // console.log("Subtask Status updated successfully");
        // console.log("before refresh...", button)
        button.innerText = "Updated";
        refreshSubtasks(modalId);

        // console.log("After refresh...")
      } else {
        console.log("Error Updating subtask status:", response);
      }
    });
  } else if (status === "In Progress") {
    var formData = {
      data: {
        Status: "Completed",
      },
    };

    var statusUpdateconfig = {
      appName: "zenworkr",
      reportName: "Subtask_Report",
      id: subtaskID,
      data: formData,
    };
    ZOHO.CREATOR.API.updateRecord(statusUpdateconfig).then(function (response) {
      if (response.code == 3000) {
        refreshSubtasks(modalId);
        checkRibbon(modalId);
      } else {
        console.log("Error Updating subtask status:", response);
      }
    });
  }
}

function unCheckChecklistItem(buttonID,modalId){
  //write here...
    var formData = {
      data: {
        Done: false,
      },
    };

    var markDoneconfig = {
      appName: "zenworkr",
      reportName: "All_Checklists",
      id: buttonID,
      data: formData,
    };

    ZOHO.CREATOR.API.updateRecord(markDoneconfig).then(function (response) {
        if (response.code == 3000) {
          console.log("Updated checklist successfully");
          refreshChecklist(modalId);
          checkRibbon(modalId);
        } else {
          console.log("Error Updating record:", response);
        }
      });
}

function deleteNotes(notesID, modalId){

    const config = {
      appName: "zenworkr",
      reportName: "All_Notes",
      criteria: `(ID == "${notesID}")`,
    };

  ZOHO.CREATOR.API.deleteRecord(config).then(function (response) {
    if (response.code === 3000) {
      console.log("Deleted successfully");
      refreshNotes(modalId); // Refresh the subtask table

    } else {
      console.error("Delete failed da macha: ", response);
    }
  });

}
//deleteFile

function deleteFile(fileID, modalId){


    const config = {
      appName: "zenworkr",
      reportName: "All_Files",
      criteria: `(ID == "${fileID}")`,
    };

  ZOHO.CREATOR.API.deleteRecord(config).then(function (response) {
    if (response.code === 3000) {
      console.log("Deleted successfully");
      refreshFiles(modalId); 

    } else {
      console.error("Delete failed da macha: ", response);
    }
  });

}

function deleteSubtask(subtaskID, modalId) {
  // console.log("Helloo da mameyyyyyy abiii", subtaskID, typeof(subtaskID), typeof(modalId) );

  const config = {
    appName: "zenworkr",
    reportName: "Subtask_Report",
    criteria: `(ID == "${subtaskID}")`,
  };

  ZOHO.CREATOR.API.deleteRecord(config).then(function (response) {
    if (response.code === 3000) {
      console.log("Deleted successfully");
      refreshSubtasks(modalId); // Refresh the subtask table
      checkRibbon(modalId);
    } else {
      console.error("Delete failed da macha: ", response);
    }
  });
}

function addNote(modalId) {
  // console.log(`noteText-${modalId}`);
  let noteText = document.getElementById(`noteText-${modalId}`).value;
  if (noteText.trim() !== "") {
    addNewNotes(modalId, noteText);

    document.getElementById(`noteText-${modalId}`).value = "";
  }
}

function addFile(modalId) {
  let fileInput = document.getElementById(`fileUpload-${modalId}`).files[0];
  if (fileInput) {
    // let fileList = document.getElementById(`fileList-${modalId}`);
    addNewFile(modalId, fileInput);

    fileInput.value = "";
  }
}

function addChecklistItem(modalId) {
  let checklistItem = document
    .getElementById(`checklistItem-${modalId}`)
    .value.trim();
  // console.log(checklistItem)
  if (checklistItem !== "") {
    addNewChecklistItem(modalId, checklistItem);
    document.getElementById(`checklistItem-${modalId}`).value = "";
  }
}

function markChecklistItem(buttonID, modalId) {
  // console.log("this is marking function", buttonID, modalId);

  var formData = {
    data: {
      Done: true,
    },
  };

  var markDoneconfig = {
    appName: "zenworkr",
    reportName: "All_Checklists",
    id: buttonID,
    data: formData,
  };
  ZOHO.CREATOR.API.updateRecord(markDoneconfig).then(function (response) {
    if (response.code == 3000) {
      console.log("Updated checklist successfully");
      refreshChecklist(modalId);
      checkRibbon(modalId);
    } else {
      console.log("Error Updating record:", response);
    }
  });
}

// console.log("helooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")

function addNewLog(modalId, readableTime, startTimeStr, endTimeStr) {
  const todayDate = new Date().toLocaleDateString();

  formData = {
    data: {
      Hours_Worked: readableTime,
      Work_Started: startTimeStr,
      Work_Ended: endTimeStr,
      Task: modalId,
      Date_field: todayDate,
    },
  };

  var logUpdateConfig = {
    appName: "zenworkr",
    formName: "Logs",
    data: formData,
  };

  ZOHO.CREATOR.API.addRecord(logUpdateConfig).then(function (
    logUpdateResponse
  ) {
    if (logUpdateResponse.code == 3000) {
      console.log("Record added successfully");
      refreshLogs(modalId);
    } else {
      console.log("Error adding record:", logUpdateResponse);
    }
  });
}


let isAddingLog = false;

function addOnlyStartTime(modalId, startTimeStr) {
  if (isAddingLog) return;
  isAddingLog = true;

  const todayDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  var formData = {
    data: {
      Work_Started: startTimeStr,
      Task: modalId,
      Date_field: todayDate,
    },
  };

  var logUpdateConfig = {
    appName: "zenworkr",
    formName: "Logs",
    data: formData,
  };

  ZOHO.CREATOR.API.addRecord(logUpdateConfig).then(function (logUpdateResponse) {
      isAddingLog = false;
      if (logUpdateResponse.code == 3000) {
        console.log("Log Start Time added successfully");

        myLastLogId = `${logUpdateResponse.data.ID}-${startTimeStr}`;

        const lastLogId = `${logUpdateResponse.data.ID}-${startTimeStr}`;
        updateRunTime(lastLogId);

        // LASTLOG = logUpdateResponse.data.ID;
        // localStorage.setItem("LASTLOG", logUpdateResponse.data.ID);
        refreshLogs(modalId);
      } else {
        console.log("Error adding record:", logUpdateResponse);
      }
    })
    .catch(function (err) {
      isAddingLog = false;
      console.log("Request failed", err);
    });

    //Update Run_Time
    function updateRunTime(lastLogId){


        var config = {
          appName: "zenworkr",
          reportName: "Task_Report",
          id: modalId,
          data: {
            data: {
                Task_Status: "In Progress",
                Run_Time: true,
                lastLogId: lastLogId
            }
          }
        };

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
          if (response.code == 3000) {
           console.log("Run_Time updated successfully");
          //  fetchAllTasks();
          // johoApi();
          }
        }).catch(function (err) {
        
             console.log("Error Updateing Run_Time failed", err);
        });

    }
}

function addOnlyEndTime(logStartTime, endTimeStr,LASTLOG,modalId,timee,Start_Time_Hours,Start_Time_Mins) {

  console.log(new Date().toLocaleTimeString());
  console.log(logStartTime, endTimeStr,LASTLOG,modalId,timee,Start_Time_Hours,Start_Time_Mins)

  function calculateTimeDifference2(startTime, endTime) {

    if (!startTime || !endTime) {
      return "Invalid time"; // or return "" if you prefer silent fail
    }

    const [sh, sm, ss] = startTime.split(":").map(Number);
    const [eh, em, es] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(sh, sm, ss);

    const end = new Date();
    end.setHours(eh, em, es);

    let diffInSeconds = Math.floor((end - start) / 1000);

    if (diffInSeconds < 0) diffInSeconds += 24 * 3600; // handle crossing midnight

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }


      const finalWorkEnded = endTimeStr;
      const finalWorkedHours = calculateTimeDifference2(logStartTime,finalWorkEnded);
      calFinalLog(finalWorkEnded, finalWorkedHours, LASTLOG, modalId);


      const newEndTime = Number(Start_Time_Hours) + Number(finalWorkedHours[0]);
      const newEndMin = getMinutes(finalWorkedHours);
      const newEndMinRec = Number(Start_Time_Mins) + getMinutes(finalWorkedHours);
      const timeeMins = getMinutes2(timee);
      // console.log("newEndMin: ", newEndMin);
      
      //Just commented Overtime Auto Drag Feture
      // overTimeTaken(finalWorkedHours,timee,modalId,newEndTime,newEndMin,timeeMins,newEndMinRec);


  function getMinutes(finalWorkedHours) {
    const match = finalWorkedHours.match(/(\d+)m/);
    return match ? parseInt(match[1]) : 0;
  }

  function getMinutes2(str) {
    const match = str.match(/(\d+)\s*mins/);
    return match ? parseInt(match[1]) : 0;
  }

  function overTimeTaken(
    finalWorkedHours,
    timee,
    modalId,
    newEndTime,
    newEndMin,
    timeeMins,
    newEndMinRec
  ) {
    if (timee.length > 6) {
      console.log("it contains mins");
      if (timee[0] >= finalWorkedHours[0]) {
        if (timeeMins >= newEndMin) {
          console.log("No Change Macha..!!..DA...");
        } else {
          console.log("change only minutes..da macha");
          //write logic to change only minutes here --> newEndMinRec

          var config = {
            appName: "zenworkr",
            reportName: "Task_Report",
            id: modalId,
            data: {
              data: {
                End_Time_Mins: newEndMinRec,
              },
            },
          };

          ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
            if (response.code == 3000) {
              console.log("Record updated successfully");
              // document.getElementById('ScreenFade').style.display = 'block';
              OvertimeTrue(modalId);
              reloadPage();
            }
          });
        }
      } else {
        console.log("Change Madi Guru...");
        //write logic for Hour and minute both...
        var config = {
          appName: "zenworkr",
          reportName: "Task_Report",
          id: modalId,
          data: {
            data: {
              End_Time_Hours: newEndTime,
              End_Time_Mins: newEndMinRec,
            },
          },
        };
        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
          if (response.code == 3000) {
            console.log("Record updated successfully");
            // document.getElementById('ScreenFade').style.display = 'block';
            OvertimeTrue(modalId);
            reloadPage();
          }
        });
      }
    } else {
      if (timee[0] >= finalWorkedHours[0]) {
        console.log("No Change", finalWorkedHours[0], timee[0]); //timee = 1 |  finalworkedhours = 2
      } else {
        console.log("Need to change", finalWorkedHours[0]);
        //write code here -->  newEndTime

        var config = {
          appName: "zenworkr",
          reportName: "Task_Report",
          id: modalId,
          data: {
            data: {
              End_Time_Hours: newEndTime,
              End_Time_Mins: newEndMinRec,
            },
          },
        };
        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
          if (response.code == 3000) {
            console.log("Record updated successfully");
            // document.getElementById('ScreenFade').style.display = 'block';
            OvertimeTrue(modalId);
            reloadPage();
          }
        });
      }
    }
  }

  function OvertimeTrue(modalId) {
    var formData = {
      data: {
        Overtime: "true",
      },
    };

    var config = {
      appName: "zenworkr",
      reportName: "Task_Report",
      id: modalId,
      data: formData,
    };
    ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
      if (response.code == 3000) {
        console.log("OvertimeTrue updated successfully");
      } else {
        console.log("error", response);
      }
    });
  }

  function calFinalLog(finalWorkEnded, finalWorkedHours, LASTLOG, modalId) {
    // console.log(typeof finalWorkEnded, typeof finalWorkEnded, typeof LASTLOG);
    // console.log(finalWorkEnded, finalWorkEnded, LASTLOG);

    var formData = {
      data: {
        Hours_Worked: finalWorkedHours,
        Work_Ended: finalWorkEnded,
      },
    };

    var config = {
      appName: "zenworkr",
      reportName: "All_Logs",
      id: LASTLOG,
      data: formData,
    };
    ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
      if (response.code == 3000) {
        console.log("End Time and Worked Hours updated successfully");
        refreshLogs(modalId);
      } else {
        console.log("error", response);
      }
    });
  }
}

function addNewLogManualy(modalId) {
  const rawDate = document.getElementById(`logManualDate-${modalId}`).value;

  const startTimeHours = document.getElementById(`logManualSTH-${modalId}`).value;
  const startTimeMins = document.getElementById(`logManualSTM-${modalId}`).value;
  const endTimeHours = document.getElementById(`logManualETH-${modalId}`).value;
  const endTimeMins = document.getElementById(`logManualETM-${modalId}`).value;

  // Check if startTime is greater than endTime
  // const [startH, startM] = startTime.split(":").map(Number);
  // const [endH, endM] = endTime.split(":").map(Number);

  const startTotalMinutes = Number(startTimeHours) * 60 + Number(startTimeMins);
  const endTotalMinutes = Number(endTimeHours) * 60 + Number(endTimeMins);

  if (startTotalMinutes >= endTotalMinutes || startTotalMinutes === endTotalMinutes) {
    alert("Start time should be earlier and same as end time");
    return;
  }

  // function isValidTimeFormat(time) {
  //   const pattern = /^([01]\d|2[0-3]):[0-5]\d$/;
  //   return pattern.test(time);
  // }

  // if (startTime === endTime) {
  //   alert("Please enter the valid time range");
  //   return;
  // }

  if (!rawDate) {
    alert("Please select a valid date");
    return;
  }

  

  // Compare selected date with today's date
  const selectedDate = new Date(rawDate);
  const today = new Date();

  if (selectedDate > today) {
    alert("Future dates are not allowed");
    return;
  }

  // if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
  //   alert("Please enter time in HH:MM format");
  //   return;
  // }

  // ⛔ Prevent future time if selected date is today
  // Clone and normalize both selectedDate and today to midnight for accurate comparison
  const selectedDateMidnight = new Date(selectedDate);
  selectedDateMidnight.setHours(0, 0, 0, 0);

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const isToday = selectedDateMidnight.getTime() === todayMidnight.getTime();
  // console.log(isToday, selectedDateMidnight.getTime(), todayMidnight.getTime());

  if (isToday) {
    const now = new Date();

    // const [endHour, endMinute] = endTime.split(":").map(Number); 

    const endHour = Number(endTimeHours);
    const endMinute = Number(endTimeMins);

    const enteredEndTime = new Date();
    enteredEndTime.setHours(endHour, endMinute, 0, 0);

    if (enteredEndTime > now) {
      alert("Future time is not allowed for today");
      return;
    }
  }

  const [year, month, day] = rawDate.split("-");
  const date = `${day}/${month}/${year}`;

  function calculateTimeDifference1(sh, sm, eh, em) {
    // const [sh, sm] = startTime.split(":").map(Number);
    // const [eh, em] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(sh, sm, 0); // seconds set to 0

    const end = new Date();
    end.setHours(eh, em, 0); // seconds set to 0

    let diffInMinutes = Math.floor((end - start) / 60000);

    if (diffInMinutes < 0) diffInMinutes += 24 * 60; // handle crossing midnight

    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return `${hours}h ${minutes}m 0s`;
  }

  const hoursWorked = calculateTimeDifference1(startTimeHours, startTimeMins, endTimeHours, endTimeMins);

  formData = {
    data: {
      Hours_Worked: hoursWorked,
      Work_Started: `${startTimeHours}:${startTimeMins}:00`,
      Work_Ended: `${endTimeHours}:${endTimeMins}:00`,
      Task: modalId,
      Date_field: date,
    },
  };
  var logUpdateConfig = {
    appName: "zenworkr",
    formName: "Logs",
    data: formData,
  };

  ZOHO.CREATOR.API.addRecord(logUpdateConfig).then(function (logUpdateResponse) {
    if (logUpdateResponse.code == 3000) {
      console.log("Log added successfully");
      refreshLogs(modalId);
      // document.getElementById(`logManualST-${modalId}`).value = "";
      // document.getElementById(`logManualET-${modalId}`).value = "";
      // document.getElementById(`logManualDate-${modalId}`).value = "";
      document.getElementById(`addLog-${modalId}`).disabled = true;
    } else {
      console.log("Error adding log:", logUpdateResponse);
    }
  });
}

//////////////////////////////////////////////////////////////////////

function addNewSubtask(modalId, task) {
  subTaskData = {
    data: {
      Sub_task_Name: task,
      Task: modalId,
      Status: "New",
    },
  };

  var subTaskAddConfig = {
    appName: "zenworkr",
    formName: "Subtask",
    data: subTaskData,
  };

  ZOHO.CREATOR.API.addRecord(subTaskAddConfig).then(function (
    subTaskAddResponse
  ) {
    if (subTaskAddResponse.code == 3000) {
      console.log("Record added successfully");
      refreshSubtasks(modalId);
      checkRibbon(modalId);
    } else {
      console.log("Error adding record:", subTaskAddResponse);
    }
  });
}

function addNewNotes(modalId, note) {
  notesData = {
    data: {
      Note: note,
      Task: modalId,
    },
  };
  var notesAddConfig = {
    appName: "zenworkr",
    formName: "Notes",
    data: notesData,
  };

  ZOHO.CREATOR.API.addRecord(notesAddConfig).then(function (notesAddResponse) {
    if (notesAddResponse.code == 3000) {
      console.log("Notes added successfully");
      refreshNotes(modalId);
    } else {
      console.log("Error adding Notes:", notesAddResponse);
    }
  });
}

function addNewFile(modalId, fileInput) {
  fileData = {
    data: {
      Task: modalId,
    },
  };

  var fileAddConfig = {
    appName: "zenworkr",
    formName: "Files",
    data: fileData,
  };

  ZOHO.CREATOR.API.addRecord(fileAddConfig).then(function (fileAddResponse) {
    if (fileAddResponse.code == 3000) {
      console.log("File ID added successfully");
      setTimeout(function () {
        fetchLatestRecordAndUpload(modalId, fileInput);
      }, 5);
      // refreshNotes(modalId);
    } else {
      console.log("Error adding File ID:", fileAddResponse);
    }
  });
}

function fetchLatestRecordAndUpload(modalId, fileInput) {
  var config = {
    appName: "zenworkr",
    reportName: "All_Files",
  };

  // Fetch the latest record
  ZOHO.CREATOR.API.getAllRecords(config)
    .then(function (response) {
      if (response.code == 3000 && response.data.length > 0) {
        var latestRecordID = response.data[0].ID; // Get latest record ID
        // console.log("Latest Record ID:", latestRecordID);
        uploadFile(modalId, latestRecordID, fileInput); // Upload file to this record
      } else {
        console.log("No records found or API error:", response.message);
      }
    })
    .catch(function (error) {
      console.error("Error fetching records:", error);
    });
}

function uploadFile(modalId, recordID, fileInput) {
  // console.log("uploadFile function is called succesfully!!")
  // console.log(recordID, fileInput)

  var fileUploadConfig = {
    appName: "zenworkr",
    reportName: "All_Files",
    id: recordID,
    fieldName: "File_field",
    file: fileInput,
  };

  ZOHO.CREATOR.API.uploadFile(fileUploadConfig).then(function (response) {
    if (response.code == 3000) {
      console.log("File uploaded successfully");

      const fileInputdel = document.getElementById(`fileUpload-${modalId}`);
      fileInputdel.value = "";
      refreshFiles(modalId);
    } else {
      console.log("Error Uploading File:", response);
    }
  });
}

function addNewChecklistItem(modalId, checklist) {
  checklistDatas = {
    data: {
      List_field: checklist,
      Task: modalId,
    },
  };
  var checklistAddConfig = {
    appName: "zenworkr",
    formName: "Checklist",
    data: checklistDatas,
  };

  ZOHO.CREATOR.API.addRecord(checklistAddConfig).then(function (
    checklistAddResponse
  ) {
    if (checklistAddResponse.code == 3000) {
      // console.log("Checklist added successfully");
      refreshChecklist(modalId);
      checkRibbon(modalId);
    } else {
      console.log("Error adding Checklist:", checklistAddResponse);
    }
  });
}

function addChecklistTemplate(element, tem, t, modalId) {
  // console.log("Gommala..", tem, t, modalId)

  const temID = [
    ...new Set(
      t
        .filter((srch) => srch.Checklist_Template.display_value === tem)
        .map((m) => m.Checklist_Template.ID)
    ),
  ][0];

  // console.log("temID", temID)

  const templateArray = t
    .filter((template) => template.Checklist_Template.display_value === tem)
    .map((template) => template.Item_Name);
  const refreshWait = templateArray.length;

  if (element.checked) {
    // console.log("templateArray", templateArray)
    checkListTemplateStore(element, modalId, tem, temID);

    // let completed = 0;

    templateArray.forEach((i, index) => {
      checklistDatas = {
        data: {
          List_field: i,
          Task: modalId,
        },
      };
      var checklistAddConfig = {
        appName: "zenworkr",
        formName: "Checklist",
        data: checklistDatas,
      };
      ZOHO.CREATOR.API.addRecord(checklistAddConfig).then(function (
        checklistAddResponse
      ) {
        if (checklistAddResponse.code == 3000) {
          console.log("Checklist added successfully");
          // refreshChecklist(modalId);
          index + 1 === refreshWait
            ? refreshChecklist(modalId)
            : console.log("Looping for", index + 1, "times");
        } else {
          console.log("Error adding Checklist:", checklistAddResponse);
        }
        // if (completed === templateArray.length) {
        //   refreshChecklist(modalId);
        // }
      });
    });
    checkRibbon(modalId);
  } else {
    checkListTemplateStore(element, modalId, tem, temID);

    // let completed = 0;
    templateArray.forEach((i, index) => {
      var config = {
        appName: "zenworkr",
        reportName: "All_Checklists",
        criteria: `(List_field == "${i}" && Task == "${modalId}")`,
      };

      ZOHO.CREATOR.API.deleteRecord(config).then(function (response) {
        if (response.code == 3000) {
          console.log("Checklist Deleted successfully");
          index + 1 === refreshWait
            ? refreshChecklist(modalId)
            : console.log("Looping for", index + 1, "times");
        } else {
          console.log("Error Deleting Checklist:", response);
        }
        // if (completed === templateArray.length) {
        //   refreshChecklist(modalId);
        // }
      });
    });
    checkRibbon(modalId);
  }
}

function checkListTemplateStore(element, modalId, tem, temID) {
  if (element.checked) {
    formData = {
      data: {
        Checklist_Template: temID,
        Task: modalId,
      },
    };

    var config = {
      appName: "zenworkr",
      formName: "Task_Checklists",
      data: formData,
    };

    ZOHO.CREATOR.API.addRecord(config).then(function (response) {
      if (response.code == 3000) {
        console.log("Checklist Template added successfully");
        // index+1 === refreshWait ? (refreshChecklist(modalId)) : (console.log("Looping for", index+1, "times"))
      } else {
        console.log("Error Adding Checklist Template:", response);
      }
    });
  } else {
    var config = {
      appName: "zenworkr",
      reportName: "All_Task_Checklists",
      criteria: `(Checklist_Template == "${temID}" && Task == "${modalId}")`,
    };
    ZOHO.CREATOR.API.deleteRecord(config).then(function (response) {
      if (response.code == 3000) {
        console.log("Checklist Template Deleted successfully");
      } else {
        console.log("Error Deleting Checklist Template:", response);
      }
    });
  }
}

//Task Complete button Display
async function checkRibbon(modalId) {
  //checklist
  let RIBBONARR = [];

  const subTaskConfig = {
    appName: "zenworkr",
    reportName: "Subtask_Report",
  };

  try {
    const res = await ZOHO.CREATOR.API.getAllRecords(subTaskConfig);
    res.data.forEach((subtask) => {
      if (modalId == subtask.Task.ID) {
        RIBBONARR.push(subtask.Status);
      }
    });
  } catch (error) {
    console.error("Error fetching the added checklist template:", error);
  }

  //checklist

  let RIBBONARR2 = [];

  const checklistConfig = {
    appName: "zenworkr",
    reportName: "All_Checklists",
  };

  try {
    const res = await ZOHO.CREATOR.API.getAllRecords(checklistConfig);
    res.data.forEach((check) => {
      if (modalId == check.Task.ID) {

        if(check.Mandatory === "true"){
          RIBBONARR2.push(check.Done);
        }
        
      }
    });
  } catch (error) {
    console.error("Error fetching the added checklist template:", error);
  }

  const completeButton = document.getElementById(`rbn-cmp-${modalId}`);

  if (!completeButton) {
    return;
  }

  if (RIBBONARR.every((r) => r === "Completed" || r === "Approved") && RIBBONARR2.every((r) => r === "true")) {
    completeButton.classList.remove("d-none");
  } else {
    completeButton.classList.add("d-none");
  }
}

window.addRibbon = async function (modalId) {
  document.getElementById(`ribbonn-${modalId}`).classList.remove("d-none");
  document.getElementById(`stat-${modalId}`).innerHTML =
    '<span style="font-size: 14px; box-shadow: 0 0 0 0.7px #00BC7D; border-radius: 15px; padding: 3px 9px; background-color: #A4F4CF"><i class="bi bi-circle-fill" style="color: #00BC7D"></i> Completed</span>';

  // const timerButton = document.getElementById(`toggleTimer-${modalId}`);
  const savedModalId = localStorage.getItem("MODEL_ID");

  if (savedModalId) {
    const toggleBtn = document.getElementById(`toggleTimer-${savedModalId}`);
    if (toggleBtn) {
      toggleBtn.click();
      // toggleBtn.disabled = true;
    } else {
      console.warn("Toggle button not found for modalId:", savedModalId);
    }
  }

  var formData = {
    data: {
      Task_Status: "Completed",
    },
  };

  var config = {
    appName: "zenworkr",
    reportName: "Task_Report",
    id: modalId,
    data: formData,
  };
  ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
    if (response.code == 3000) {
      console.log("Task Status = Completed");

      // disableEverything(modalId);
      // document.getElementById(`event-box-${modalId}`).style.opacity= '0.6';
      // document.getElementById(`tic-${modalId}`).innerHTML = `<i class="bi bi-check2"></i>`;
      johoApi(); 


    }
  });
};

function disableEverything(modalId) {
  const addSubtask = document.getElementById(`addSubtask-${modalId}`);
  const deleteSubtask = document.getElementById(`subtaskList-${modalId}`);
  const addLog = document.getElementById(`addLog-${modalId}`);
  const addNote = document.getElementById(`addNote-${modalId}`);
  const uploadFile = document.getElementById(`uploadFile-${modalId}`);
  const addChecklist = document.getElementById(`addChecklist-${modalId}`);
  const addCheckListTemplate = document.getElementById(
    `checklistTemplateContiner-${modalId}`
  );
  const completeButton = document.getElementById(`rbn-cmp-${modalId}`);
  const deleteNotes = document.getElementById(`noteList-${modalId}`);

  const uncheckChecklist = document.getElementById(`checklistList-${modalId}`);

  // const files = document.querySelectorAll(`#fileList-${modalId} > li`);

  const files2 = document.getElementById(`fileList-${modalId}`);





  //disable timer
  document.getElementById(`toggleTimer-${modalId}`).disabled = true;
  document.getElementById(`toggleTimer-${modalId}`).style.opacity = "0.3";

  //hide complete btn
  if (completeButton) {
    completeButton.remove();
  }

  //hide add subtask button
  addSubtask.disabled = true;
  addSubtask.style.opacity = "0.3";

  //hide delete subtask button
  deleteSubtask.style.pointerEvents = "none";
  deleteSubtask.style.opacity = "0.5";

  //hide delete notes button
  deleteNotes.style.pointerEvents = "none";

  //diable uncheck button
  uncheckChecklist.style.pointerEvents = "none";
  

  //disable add log
  addLog.disabled = true;
  addLog.style.opacity = "0.3";

  //disable add notes
  addNote.disabled = true;
  addNote.style.opacity = "0.3";

  //disable upload files
  uploadFile.disabled = true;
  uploadFile.style.opacity = "0.3";

  //disable upload files
  addChecklist.disabled = true;
  addChecklist.style.opacity = "0.3";

  //hide delete subtask button
  addCheckListTemplate.style.pointerEvents = "none";
  addCheckListTemplate.style.opacity = "0.5";

  //hide complete button
  // document.getElementById(`rbn-cmp-${modalId}`).classList.add("d-none")

  //disable files
  // files2.style.pointerEvents = "none";
  // files2.style.opacity= "0.5";

  files2.classList.add("no-hover");

}

function refreshMacha() {
  const allModalIdArr = JSON.parse(sessionStorage.getItem("allModalIdArr") || "[]");


  allModalIdArr.forEach((m) => {
    // refreshFiles(m);
    // refreshNotes(m);
    // refreshChecklist(m);
    // checkRibbon(m);
    // refreshSubtasks(m);
    refreshLogs(m);
  });
}

function onClickRefreshMacha(m){
    refreshFiles(m);
    refreshNotes(m);
    refreshChecklist(m);
    checkRibbon(m);
    refreshSubtasks(m);
    refreshLogs(m);
}

// function refreshSubforms() {
//   const allModalIdArr = JSON.parse(
//     sessionStorage.getItem("allModalIdArr") || "[]"
//   );
//   // console.log(allModalIdArr2)
//   const isRunning = localStorage.getItem("isRunning");
//   const allModalIdArr2 = [...new Set(allModalIdArr)];

//   allModalIdArr2.forEach((m) => {
//     refreshFiles(m);
//     refreshNotes(m);
//     refreshChecklist(m);
//     checkRibbon(m);
//     refreshSubtasks(m);
//     refreshLogs(m);
//   });
// }

// setTimeout(function () {
//   refreshMacha();
// }, 5000);

window.onload = function () {
  console.log("its gonna run...");
  setTimeout(function () {
    refreshMacha();
  }, 2500);
};

function reloadPage() {
  sessionStorage.clear();
  document.getElementById("loader").style.display = "block";
  document.getElementById("ScreenFade").style.display = "none";

  setTimeout(function () {
    location.reload();
  }, 500);
}
window.reloadPage = reloadPage;

function formatDateToDDMMYYYY(inputDate) {

  const ddmmyyyyRegex = /^\d{2}-\d{2}-\d{4}$/;
  // If the input is already in DD-MM-YYYY format, return as-is
  if (typeof inputDate === 'string' && ddmmyyyyRegex.test(inputDate)) {
    return inputDate;
  }

  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

//09-12-2025

// function isTaskDateIsToday(taskDate) {
//   const [day, month, year] = taskDate.split("-").map(Number);

//   const inputDate = new Date(year, month - 1, day);
//   const today = new Date();

//   console.log("Veriry this da macha....")

//   console.log(inputDate.getDate() === today.getDate() &&
//     inputDate.getMonth() === today.getMonth() &&
//     inputDate.getFullYear() === today.getFullYear())

//   return (
//     inputDate.getDate() === today.getDate() &&
//     inputDate.getMonth() === today.getMonth() &&
//     inputDate.getFullYear() === today.getFullYear()
//   );
// }

function isTaskDateIsToday(taskDate) {
  if (!taskDate || typeof taskDate !== "string") {
    return false;
  }

  const parts = taskDate.split("-");

  if (parts.length !== 3) {
    console.warn("Invalid date format (expected dd-mm-yyyy):", taskDate);
    return false;
  }

  const [day, month, year] = parts.map(Number);

  // Check if values are valid numbers
  if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
    console.warn("Invalid date values:", { day, month, year });
    return false;
  }

  const inputDate = new Date(year, month - 1, day);
  const today = new Date();

  return (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  );
}


function isTaskDateIsTodayFuture(taskDate) {
  const [day, month, year] = taskDate.split("-").map(Number);
  const inputDate = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of the day
  inputDate.setHours(0, 0, 0, 0); // normalize input

  return inputDate >= today;
}

function truncateTitle(title) {
  return title.length > 24 ? title.slice(0, 24) + "...." : title;
}

function todayTasksSessionStorage(taskDate, modalId) {
  if (isTaskDateIsToday(taskDate)) {
    addAllModalIdToSessionStorage("TodayTasks", modalId);
  }
}

function checkOvertime(modalId) {
  const allocatedTime = document.getElementById(`allocatedTime-${modalId}`).innerText;
  const workedTime = document.getElementById(`totalTime-${modalId}`).innerHTML;

  function parseTime(timeStr) {
    let hours = 0, minutes = 0;

    const hrMatch = timeStr.match(/(\d+)\s*hr[s]?/i);
    const minMatch = timeStr.match(/(\d+)\s*min[s]?/i);

    if (hrMatch) hours = parseInt(hrMatch[1]);
    if (minMatch) minutes = parseInt(minMatch[1]);

    return hours * 60 + minutes;
  }

  const allocatedMinutes = parseTime(allocatedTime);
  const workedMinutes = parseTime(workedTime);

  if(workedMinutes > allocatedMinutes){
    document.getElementById(`ot-${modalId}`).classList.remove("d-none");
  }

}

function calTotalWorkedHrs(totalTimeWorked) {
  let totalHours = 0;
  let totalMinutes = 0;

  totalTimeWorked.forEach((time) => {
    if (!time) return;

    const match = time.match(/(\d+)h\s+(\d+)m/);
    if (match) {
      totalHours += parseInt(match[1], 10);
      totalMinutes += parseInt(match[2], 10);
    }
  });

  // Convert excess minutes to hours
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  const result = `${totalHours} hrs ${totalMinutes} mins`;
  return result;
}

function noData() {
  document.getElementById("add-new-task").click();
}

function change24() {
  localStorage.setItem("shiftStartLocal", "00:00:00");
  localStorage.setItem("shiftEndLocal", "24:00:00");
  reloadPage();
}

if (localStorage.getItem("shiftStartLocal")) {
  setTimeout(function () {
    localStorage.removeItem("shiftStartLocal");
    localStorage.removeItem("shiftEndLocal");
  }, 10000);
}

//add new event task


function addNewEvent(event) {

  
  fetchAllProjects();

  document.getElementById("taskName").value = "";
  document.getElementById("description").value = "";
  document.getElementById('prioritySelect').selectedIndex = 0;
  const addTaskBtn = document.getElementById("addTaskBtn");
  addTaskBtn.innerText="Add";
  document.getElementById("staticBackdropLabel").innerText= "Add Task";



  console.log("event",event)
  // Get the modal element
  var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
  myModal.show();


  

  // Remove old listener if exists
  addTaskBtn.replaceWith(addTaskBtn.cloneNode(true));

  // Re-select the new button (since replaceWith creates a new DOM node)
  const freshAddTaskBtn = document.getElementById("addTaskBtn");

  document.getElementById("displayEventTime").innerHTML = `

  <small class="text-muted text-small mb-1 d-block">Start Time</small>
  <div class="d-flex gap-3 align-items-center mb-1">
    <div class="form-floating">
      <input type="number" class="form-control" id="eventStartTimeHr" placeholder="HH" value="${event.start.getHours()}">
      <label for="eventStartTimeHr">HH</label>
    </div>
    <span>:</span>
    <div class="form-floating">
      <input type="number" class="form-control" id="eventStartTimeMin" placeholder="MM" value="${event.start.getMinutes()}">
      <label for="eventStartTimeMin">MM</label>
    </div>
  </div> 
  <small class="text-muted text-small mb-1 d-block">End Time</small>
  <div class="d-flex gap-3 align-items-center">

    <div class="form-floating">
      <input type="number" class="form-control" id="eventEndTimeHr" placeholder="HH" value="${event.end.getHours()}">
      <label for="eventEndTimeHr">HH</label>
    </div>
    <span>:</span>
    <div class="form-floating">
      <input type="number" class="form-control" id="eventEndTimeMin" placeholder="MM" value="${event.end.getMinutes()}">
      <label for="eventEndTimeMin">MM</label>
    </div>
    
  </div>
  `;


  //add button-------------------------------------------
  freshAddTaskBtn.addEventListener("click", function () {
    const project = document.getElementById("projectSelect").value;
    const taskName = document.getElementById("taskName").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("prioritySelect").value;
    const esth = Number(document.getElementById("eventStartTimeHr").value);
    const estm = Number(document.getElementById("eventStartTimeMin").value) || 0;
    const eeth = Number(document.getElementById("eventEndTimeHr").value);
    const eetm = Number(document.getElementById("eventEndTimeMin").value) || 0;

    const milestoneSelect = document.getElementById("milestoneSelect");
    let milestonePhase = null;

    if (!milestoneSelect.classList.contains("d-none")) {
      milestonePhase = milestoneSelect.value;
    }

    console.log("milestonePhase", milestonePhase)

    // Validate inputs
    if (!project || project === "Project") {
      alert("Please select a project");
      return;
    }
    if (!taskName) {
      alert("Please enter a task name");
      return;
    }
    if (!description) {
      alert("Please enter a task description");
      return;
    }
    if (!priority || priority === "Priority") {
      alert("Please select a priority");
      return;
    }


    if (isNaN(esth) || isNaN(eeth) || esth < 0 || eeth < 0 || esth > 23 || eeth > 23 ) {
      alert("⚠️ Please enter valid Start and End time");
      return;
    }

    // ✅ Auto-correct invalid ranges
    if (estm < 0 || estm > 59) estm = 0;
    if (eetm < 0 || eetm > 59) eetm = 0;

    document.getElementById("eventStartTimeMin").value = estm;
    document.getElementById("eventEndTimeMin").value = eetm;


    // (Optional) check time validity
    const startMins = esth * 60 + estm;
    const endMins   = eeth * 60 + eetm;
    if (startMins >= endMins) {
      alert("⚠️ Start time should be earlier than End time");
      return;
    }


    const taskData = { project, taskName, description, priority, esth, estm, eeth, eetm, milestonePhase};
    console.log("taskData:", taskData);
    console.log("milestonePhase",milestonePhase);

    myModal.hide();

    newTaskAdded(event, taskData);

    // setTimeout(function(){
    //   reloadPage();
    // }, 1000)

  });
}

const project2 = document.getElementById("projectSelect");

project2.addEventListener("change", function () {
  
  populateMilestones(project2.value);
});

function populateMilestones(PID){

  const milestoneConfig = {
      appName: "zenworkr",
      reportName: "All_Milestones", 
      criteria : `(Project_Name.ID == ${PID})`
      
    };

    // Fetch project data
    ZOHO.CREATOR.API.getAllRecords(milestoneConfig).then(function (res) {

        console.log("✅ Milestone Response:", res.data);

        const allMilestone = res.data;

        const milestone = document.getElementById("milestoneSelect");

        document.getElementById("milestoneSelect").classList.remove("d-none");

        milestone.innerHTML = '<option selected disabled>Milestone</option>'

        allMilestone.forEach(p =>{

          milestone.innerHTML+= `
            <option value="${p.ID}">${p.Millstone_Name}</option>
          `;
          
        });


    }).catch(err => {
      console.log(err)
      document.getElementById("milestoneSelect").classList.add("d-none");
    });

}


function newTaskAdded(event, taskData){

  const taskNewDate = formatDateToDDMMYYYY(event.start);


  formData = {
    "data" : {
        "Task_Name": taskData.taskName,
        "Project_Name": taskData.project,
        "Task_Description": taskData.description ,
        "Task_Date": taskNewDate,
        "Start_Time_Hours": taskData.esth,
        "End_Time_Hours": taskData.eeth,
        "Start_Time_Mins": taskData.estm,
        "End_Time_Mins": taskData.eetm,
        "Assignee": event.resource.id, 
        "Task_Priority": taskData.priority ,
        "Task_Status": "Not Started",
        "Start_Time": `${taskData.esth}:${taskData.estm}`,
        "End_Time": `${taskData.eeth}:${taskData.eetm}`

      }
  }

        // "Start_Time" : ,
        // "End_Time": 

  // Add milestone only if not null
  if (taskData.milestonePhase !== null && taskData.milestonePhase !== "Milestone") {
    formData.data["Milestone_Name"] = taskData.milestonePhase;
  }


  var addNewTaskConfig = {
    appName: "zenworkr",
    formName: "Task",
    data : formData
  }

  ZOHO.CREATOR.API.addRecord(addNewTaskConfig).then(function(res) {
    if (res.code == 3000) {
      console.log("Task added successfully");
      // reloadPage();
      johoApi();
      
    } else {
      console.log("Error adding Task:", res);
    }
  });

}

// banner 
  var bannerModal = new bootstrap.Modal(document.getElementById('staticBackdropBanner'));


  if(!localStorage.getItem("BannerFlag")){

      setTimeout(function(){

        bannerModal.show();
        localStorage.setItem("BannerFlag", true)

      }, 5000)

  }

  function bannerClose(){

    bannerModal.hide();
    document.getElementById('myAudio').play()

  }

  function help(){
    bannerModal.show();
  }


  //delete task
  function deleteMainTask(modalId){

    const config = {
      appName: "zenworkr",
      reportName: "Task_Report",
      criteria: `(ID == "${modalId}")`,
    };

  ZOHO.CREATOR.API.deleteRecord(config).then(function (response) {
    if (response.code === 3000) {
      console.log("Deleted successfully");
      // location.reload();
      johoApi();
      const modal = document.getElementById(`mCls-${modalId}`);
      modal.click();  

    } else {
      console.error("Delete failed da macha: ", response);
    }
  });

}

function editTaskDesc(modalId){

  const currentDescriptio = document.getElementById(`crtDesc-${modalId}`);
  const inputField = document.getElementById(`descInput-${modalId}`);
  const pencil = document.getElementById(`descPencil-${modalId}`);

  currentDescriptio.classList.add("d-none");
  inputField.classList.remove("d-none");
  pencil.classList.add("d-none"); // hide pencil //

  document.getElementById(`saveDesc-${modalId}`).onclick = function(){


    const newDescription = document.getElementById(`editDesc-${modalId}`).value;

    inputField.classList.add("d-none");
    currentDescriptio.classList.remove("d-none");
    pencil.classList.remove("d-none"); // hide pencil //


    const editDescConfig = {
      appName: "zenworkr",
      reportName: "Task_Report",
      id: modalId,
      data: {
        data: {
          Task_Description: newDescription
        },
      },
    };

  ZOHO.CREATOR.API.updateRecord(editDescConfig).then(function (response) {
      if (response.code === 3000) {
        console.log("✅ Description edited successfully in Zoho Creator:", response);
        currentDescriptio.innerText=newDescription;
        
      } else {
        console.error("❌ Failed to edit task:", response);
      }
    })
    .catch(function (error) {
      console.error("❌ Error editing description in Zoho Creator:", error);
    });

  };
}


function editTime(modalId){
  const currentTime = document.getElementById(`crtTime-${modalId}`);
  const inputField = document.getElementById(`timeInput-${modalId}`);
  const pencil = document.getElementById(`timePencil-${modalId}`);

  currentTime.classList.add("d-none");
  inputField.classList.remove("d-none");
  pencil.classList.add("d-none"); // hide pencil //


  function normalizeTime(time) {
    let [h, m] = time.split(":");

    if (!h) h = "00";
    if (!m) m = "00";

    // Keep only numbers
    h = h.replace(/\D/g, "");
    m = m.replace(/\D/g, "");

    // Pad with leading zeros
    h = h.padStart(2, "0").slice(0, 2);
    m = m.padStart(2, "0").slice(0, 2);

    // Convert to numbers
    let hours = parseInt(h, 10);
    let mins = parseInt(m, 10);

    // Auto-correct invalid values
    if (isNaN(hours) || hours > 23) hours = 23;
    if (isNaN(mins) || mins > 59) mins = 59;

    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }

  function attachTimeFormatter(modalId) {
    const startInput = document.getElementById(`editSTime-${modalId}`);
    const endInput   = document.getElementById(`editETime-${modalId}`);

    [startInput, endInput].forEach(input => {
      input.addEventListener("blur", () => {
        input.value = normalizeTime(input.value);
      });
    });
  }

  attachTimeFormatter(modalId);

  document.getElementById(`saveTime-${modalId}`).onclick =  function(){


    //not in use
    function isValidTime(time) {
      // Matches 00:00 to 23:59
      const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return regex.test(time);
    }


    let newStartTime = document.getElementById(`editSTime-${modalId}`).value.trim();
    let newEndTime = document.getElementById(`editETime-${modalId}`).value.trim();

    // Convert HH:MM → minutes for comparison
    const [sh, sm] = newStartTime.split(":").map(Number);
    const [eh, em] = newEndTime.split(":").map(Number);
    const startMins = sh * 60 + sm;
    const endMins   = eh * 60 + em;

    if (startMins >= endMins) {
      alert("⚠️ Start time should be earlier than End time!");
      return; // ⛔ stop saving
    }

    //not in use
    if (!isValidTime(newStartTime) || !isValidTime(newEndTime)) {
      alert("⏰ Please enter a valid time in HH:MM format (00:00 - 23:59).");
      return;
    }


    currentTime.classList.remove("d-none");
    inputField.classList.add("d-none");
    pencil.classList.remove("d-none"); // hide pencil //


    const Start_Time_Hours = newStartTime.slice(0,2);
    const Start_Time_Mins = newStartTime.slice(3);

    const End_Time_Hours = newEndTime.slice(0,2);
    const End_Time_Mins = newEndTime.slice(3);



    const editTimeConfig = {
      appName: "zenworkr",
      reportName: "Task_Report",
      id: modalId,
      data: {
        data: {
          Start_Time_Hours: Start_Time_Hours,
          End_Time_Hours:  End_Time_Hours,
          Start_Time_Mins: Start_Time_Mins,
          End_Time_Mins: End_Time_Mins,
       
        },
      },
    };

  ZOHO.CREATOR.API.updateRecord(editTimeConfig).then(function (response) {
      if (response.code === 3000) {
        console.log("✅ Description edited successfully in Zoho Creator:", response);
        console.log(newStartTime,newEndTime)
        console.log(Start_Time_Hours,Start_Time_Mins, " - ", End_Time_Hours, End_Time_Mins )
        currentTime.innerText = newStartTime + " - " + newEndTime;
        johoApi();
        
        
      } else {
        console.error("❌ Failed to edit task:", response);
      }
    })
    .catch(function (error) {
      console.error("❌ Error editing description in Zoho Creator:", error);
    });

  };
}

function cloneTask(modalId, arg){

   


  
  const modal = document.getElementById(`mCls-${modalId}`);
  modal.click();

  const cloneBtn = document.getElementById("addTaskBtn");
  document.getElementById("staticBackdropLabel").innerText= "Clone Task";
  cloneBtn.innerText= "Clone";

  const editModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
  editModal.show();

  console.log("Modal Details", arg)

  const project2 = document.getElementById("projectSelect");
  const taskName2 = document.getElementById("taskName");
  const description2 = document.getElementById("description");
  const priority2 = document.getElementById("prioritySelect");

  // project.value = arg.event.extendedProps.Project_Name;
  taskName2.value = arg.event.title;
  description2.value = arg.event.extendedProps.description;
  priority2.value = arg.event.extendedProps.priority;
  project2.innerHTML = `<option value="${arg.event.extendedProps.Project_ID}" selected disabled>${arg.event.extendedProps.Project_Name}</option>`;

  document.getElementById("displayEventTime").innerHTML = `

  <small class="text-muted text-small mb-1 d-block">Start Time</small>
  <div class="d-flex gap-3 align-items-center mb-1">
    <div class="form-floating">
      <input type="number" class="form-control" id="eventStartTimeHr" placeholder="HH" value="${arg.event.extendedProps.Start_Time_Hours}">
      <label for="eventStartTimeHr">HH</label>
    </div>
    <span>:</span>
    <div class="form-floating">
      <input type="number" class="form-control" id="eventStartTimeMin" placeholder="MM" value="${arg.event.extendedProps.Start_Time_Mins}">
      <label for="eventStartTimeMin">MM</label>
    </div>
  </div> 
  <small class="text-muted text-small mb-1 d-block">End Time</small>
  <div class="d-flex gap-3 align-items-center">

    <div class="form-floating">
      <input type="number" class="form-control" id="eventEndTimeHr" placeholder="HH" value="${arg.event.extendedProps.End_Time_Hours}">
      <label for="eventEndTimeHr">HH</label>
    </div>
    <span>:</span>
    <div class="form-floating">
      <input type="number" class="form-control" id="eventEndTimeMin" placeholder="MM" value="${arg.event.extendedProps.End_Time_Mins}">
      <label for="eventEndTimeMin">MM</label>
    </div>
    
  </div>
  `;

  // console.log(arg.event.resourceIds[0])

  // testing purpose 

  console.log("Previos is gonna iniitialize....")
  const prevBtn = document.querySelector('button[aria-label="Previous week"]');
  // Then you can use it like an ID element
  prevBtn.addEventListener("click", () => {
    console.log("Previous week button clicked!");
  });
  

  console.log(arg.event.extendedProps.start_date)

  cloneBtn.onclick = () => {
    console.log("Cloned")
    const project = document.getElementById("projectSelect").value;
    const taskName = document.getElementById("taskName").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("prioritySelect").value;
    let esth = Number(document.getElementById("eventStartTimeHr").value);
    let estm = Number(document.getElementById("eventStartTimeMin").value) || 0;
    let eeth = Number(document.getElementById("eventEndTimeHr").value);
    let eetm = Number(document.getElementById("eventEndTimeMin").value) || 0;

    const milestonePhase = null;

    if (!taskName) {
      alert("⚠️ Task Name cannot be empty");
      return;
    }

    if (isNaN(esth) || isNaN(eeth) || esth < 0 || eeth < 0 || esth > 23 || eeth > 23 ) {
      alert("⚠️ Please enter valid Start and End time");
      return;
    }

    // ✅ Auto-correct invalid ranges
    if (estm < 0 || estm > 59) estm = 0;
    if (eetm < 0 || eetm > 59) eetm = 0;

    // document.getElementById("eventStartTimeHr").value = esth;
    // document.getElementById("eventEndTimeHr").value = eeth;
    document.getElementById("eventStartTimeMin").value = estm;
    document.getElementById("eventEndTimeMin").value = eetm;


    // (Optional) check time validity
    const startMins = esth * 60 + estm;
    const endMins   = eeth * 60 + eetm;
    if (startMins >= endMins) {
      alert("⚠️ Start time should be earlier than End time");
      return;
    }



    const taskData = { project, taskName, description, priority, esth, estm, eeth, eetm, milestonePhase};
    const event = {resource: {id: arg.event.resourceIds[0]}, start:arg.event.extendedProps.start_date };
    newTaskAdded(event, taskData);
    

    console.log(event.start)
    
    editModal.hide();
  }

}


//Query Params
function autoClickTask(queryParams){
  
  console.log(queryParams.autoClick)
  const taskId = queryParams.autoClick;

  

  setTimeout(() => {
    console.log("clicking............")
    document.getElementById(taskId).click();
  }, 1500);
}