window.fetchAllProjects = function(UID=null){ 

    let cri = `(Associated_Members.ID != 5)`;

    if(UID){
       cri = `(Associated_Members.ID == ${UID})`
    } 

    const projectConfig = {
        appName: "zenworkr",
        reportName: "My_Team_Projects", 
        criteria : cri 
    };

    const totalProjectCount = document.getElementById("total-projects-count");
    const projectTbody = document.getElementById("all-projects-tbody");
    const searchDropdown = document.getElementById('searchDropdown');
    //1141991000005670051

    

    // Fetch project data //|| Associated_Members.ID ==
    ZOHO.CREATOR.API.getAllRecords(projectConfig).then(function (res) {
        console.log("✅ Project Response:", res);

        // totalProjectCount.innerText = res.data.length;
        animateCount(totalProjectCount, res.data.length, 1500)
        ALL_PROJECTS = res.data;
        projectTbody.innerHTML = ""; //🔥 clear before appending

        ALL_PROJECTS.forEach(p =>{

            let statusClass = "";
            switch ((p.Project_Status || "").toLowerCase()) {
            case "not started":
                statusClass = "not-started";
                break;
            case "in progress":
                statusClass = "in-progress";
                break;
            case "completed":
                statusClass = "completed";
                break;
            case "approved":
                statusClass = "approved";
                break;
            default:
                statusClass = "unknown"; // fallback class
            }

            let priorityClass = "";

            switch ((p.Priority || "").toLowerCase()) {
            case "high":
                priorityClass = "high";
                break;
            case "medium":
                priorityClass = "medium";
                break;
            case "low":
                priorityClass = "low";
                break;
            default:
                priorityClass = "unknown"; // fallback class
            }

            projectTbody.innerHTML+= `
                <tr class="cursor-pointer" onclick="openModal('${p.ID}', ${UID})">
                    <td>${p.Project_Name || "-"}</td>
                    <td style="width:15%;" class="text-center"><span class="bg-status ${statusClass}">${p.Project_Status || "-"}</span></td>
                    <td class="text-center"><span class="bg-status  fw-semibold fw-md-bold ${priorityClass}">${p.Priority.slice(0,3) || "-"}</span></td>
                    <td class="text-center">${p.Project_owner?.display_value || "-"}</td>
                    <td class="text-center">${p.Team?.display_value || "-"}</td>
                    <td class="text-center">${p.Project_Start_Date || "-"}</td>
                    <td class="text-center">${p.Project_End_Date || "-"}</td>
                </tr>
            `;

            // searchDropdown.innerHTML+= `<li>${p.Project_Name || "-"}</li>`;
            document.getElementById("loading-animation").className="d-none";

            
        });

        searchProject();
        
        fetchAllTasksCount(UID); //KPY CARDS

        if(!UID){
          fetchAllEmployees(); //emplooye
        }

    }).catch(e=>{
      console.log("error fetching projects", e)
    })

}

// --- KPI CARDS ---
window.fetchAllTasksCount = function (UID){

  

  const closedTaskCount = document.getElementById("closed-task-count");
    const openTask = document.getElementById("open-task-count");
    const approved = document.getElementById("approved-tasks-count");

  const statuses = ["Not Started", "In Progress", "Completed", "Approved"];
  const taskCounts = {
    "Not Started": 0,
    "In Progress": 0,
    "Completed": 0,
    "Approved": 0
  };

  const myPromises = statuses.map(status => {

    let config = {}

    if(UID){
        config = {
          appName: "zenworkr",
          reportName: "Task_Report",
          criteria: `(Assignee.ID == ${UID} && Task_Status ==  "${status}")`,
        };
    } else{
        config = {
            appName: "zenworkr",
            reportName: "Task_Report",
            criteria: `(Task_Status ==  "${status}")`,
        };
    }


    return ZOHO.CREATOR.API.getRecordCount(config).then(response =>{
      taskCounts[status] = response.result.records_count;
    });
  });

  Promise.all(myPromises).then(()=>{
    // closedTaskCount.innerText = taskCounts["Completed"];
    
    // openTask.innerText = taskCounts["In Progress"];
    // approved.innerText = taskCounts["Approved"];
    animateCount(closedTaskCount, taskCounts["Completed"], 1000);
    animateCount(openTask, taskCounts["In Progress"], 1000);
    animateCount(approved, taskCounts["Approved"], 1000);
  })

    // let closedCri = `(Task_Status == "Completed")`;
    // let openCri = `(Task_Status == "In Progress")`;
    // let approvedCri = `(Task_Status == "Approved")`;

    // if(UID){
    //    closedCri = `(Assignee.ID == ${UID} && Task_Status == "Completed" || Task_Status == "Approved")`;
    //    openCri = `(Assignee.ID == ${UID} && Task_Status == "In Progress")`;
    // } 

    

    // const closedConfig = {
    //     appName: "zenworkr",
    //     reportName: "Task_Report",
    //     criteria: closedCri,
    // };

    // ZOHO.CREATOR.API.getRecordCount(closedConfig).then(function (res) {
    //     console.log("✅Closed Tasks Response:---->", res.data);
    //     closedTaskCount.innerText = res.result.records_count;
    // });

    // const openConfig = {
    //     appName: "zenworkr",
    //     reportName: "Task_Report",
    //     criteria: openCri,
    // };

    // ZOHO.CREATOR.API.getRecordCount(openConfig).then(function (res) {
    //     console.log("✅In progress Response:---->", res.data);
    //     openTask.innerText = res.result.records_count;
    // });
    
}


function populateMilestones(PID){

  const phaseTbody = document.getElementById("phases-tbody");
  const phaseCount = document.getElementById("total-phases-count");

    const milestoneConfig = {
        appName: "zenworkr",
        reportName: "All_Milestones", 
        criteria : `(Project_Name.ID == ${PID})`
    
    };

    // Fetch project data
    ZOHO.CREATOR.API.getAllRecords(milestoneConfig).then(function (res) {

        console.log("✅ Milestone Response:", res.data);

        const allPhases = res.data;

        phaseCount.innerText = res.data.length;

        phaseTbody.innerHTML = '';

        allPhases.forEach(p =>{

            phaseTbody.innerHTML+= `
                    <tr>
                        <td>${p.Millstone_Name || "-"}</td>
                        <td>-</td>
                        <td>${p.Priority || "-"}</td>
                        <td>${p.Owner.display_value || "-"}</td>
                        <td>${p.Start_Date || "-"}</td>
                        <td>${p.End_Date || "-"}</td>
                        
                        
                    </tr>
            `;
        
        });


    }).catch(err => {
        phaseTbody.innerHTML = `<tr>
                        <td colspan="6"><p class="text-center text-muted lead my-3">No Milestones for this project...</p></td>
                        
                    </tr>`;

        phaseCount.innerText = "0";
        console.log(err)
    });

}

function populateTasks(PID, UID){

  let cri =  `(Project_Name.ID == ${PID})`

  if(UID){
    // UID = String(UID)
    cri =  `(Assignee.ID == ${UID.toString()} && Project_Name.ID == ${PID})`//check the issue of uid
  }

  const tasksTbody = document.getElementById("tasks-tbody");
  const timeSheetList = document.getElementById("timesheet-list");
  const filesList = document.getElementById("files-list");

    const milestoneConfig = {
        appName: "zenworkr",
        reportName: "Task_Report", 
        criteria : cri
    
    };

    // Fetch project data
    ZOHO.CREATOR.API.getAllRecords(milestoneConfig).then(function (res) {

        console.log("✅ Task:", res.data);

        document.getElementById("total-task-count").innerText = res.data.length;

        const allTasks = res.data;

        timeSheetList.innerHTML = '';
        filesList.innerHTML = '';
        tasksTbody.innerHTML = '';

        let completedCount = "0";

        allTasks.forEach(t =>{


          let statusClass = "";
          switch ((t.Task_Status || "").toLowerCase()) {
            case "not started":
              statusClass = "not-started";
              break;
            case "in progress":
              statusClass = "in-progress";
              break;
            case "completed":
              statusClass = "completed";
              completedCount++;
              break;
            case "approved":
              statusClass = "approved";
              break;
            default:
              statusClass = "unknown"; // fallback class
          }

          let priorityClass = "";
          switch ((t.Task_Priority || "").toLowerCase()) {
            case "high":
              priorityClass = "high";
              break;
            case "medium":
              priorityClass = "medium";
              break;
            case "low":
              priorityClass = "low";
              break;
            default:
              priorityClass = "unknown"; // fallback class
          }

            populateTimesheet(t.ID);
            populateFiles(t.ID);

            tasksTbody.innerHTML+= `
                    <tr>
                        <td style="width:18%">${t.Task_Name || "-"}</td>
                        <td style="width:18%">${t.Task_Description || "-"}</td>
                        <td style="width:10%" class="text-center" ><span class="bg-status ${statusClass}">${t.Task_Status || "-"}</span></td>
                        <td class="text-center"><span class="bg-status my-3 fw-bold ${priorityClass}">${t.Task_Priority.slice(0,3) || "-"}</span></td>
                        <td class="text-center">${t.Assignee.display_value || "-"}</td>
                        <td class="text-center">${t.Task_Date || "-"}</td>
                        <td class="text-center">${t.Start_Time || "-"}</td>
                        <td class="text-center">${t.End_Time || "-"}</td>
                        <td class="text-center">${calculateTimeDifference(t.Start_Time,t.End_Time) || "-"}</td>
                        
                    </tr>
            `;
        
        });

        document.getElementById("completed-task-count").innerText = completedCount;
        setTimeout(() => {
          searchTask();
        }, 100);


    }).catch(err => {
      tasksTbody.innerHTML = `<tr>
                        <td colspan="9"><p class="text-center text-muted lead my-3">No Tasks for this project...</p></td>
                    </tr>`;
        timeSheetList.innerHTML = `<div class="card bg-white">
                        <p class="text-center text-muted lead my-3">No Timesheet for this project...</p>
                    </div>`;
        filesList.innerHTML = `<div class="card bg-white">
            <p class="text-center text-muted lead my-3">No Files for this project...</p>
        </div>`;
        document.getElementById("total-task-count").innerText = "0";
        document.getElementById("completed-task-count").innerText = "0";
        
    });

}

function populateMeetings(PID){

    const upcommingMeetings = document.getElementById("upcomming-meetings");
    const completedMeegings = document.getElementById("completed-meetings");

    const meetingsCongig = {
        appName: "zenworkr",
        reportName: "All_Meetings", 
        criteria : `(Project_Name.ID == ${PID})`
    
    };

    // Fetch project data
    ZOHO.CREATOR.API.getAllRecords(meetingsCongig).then(function (res) {

        console.log("✅ Meetings report:", res.data);

        const allMeetings = res.data;

        


        upcommingMeetings.innerHTML = '';
        completedMeegings.innerHTML = '';

        allMeetings.forEach(m =>{

            if(m.Status === "Completed"){

                const attendees = Array.isArray(m.Attende) ? m.Attende : [];

                completedMeegings.innerHTML+= `
                    <tr>

                        <td>${m?.Meeting_Name}</td>
                        <td>${m?.Meeting_Date}</td>
                        <td>${m?.Description}</td>
                        <td>${attendees.map(a => `<span>${a?.display_value}</span>`).join("")}</td>
                    </tr>
            `;
            }else{

                const attendees = Array.isArray(m.Attende) ? m.Attende : [];

                upcommingMeetings.innerHTML+= `
                    <tr>

                        <td>${m?.Meeting_Name}</td>
                        <td class="">${m?.Description}</td>
                        <td class="text-center">${m?.Meeting_Date}</td>
                        <td class="text-center">${attendees.map(a => `<span>${a?.display_value}, </span>`).join("")}</td>
                    </tr>
            `;
            }
        });


    }).catch(err => {
       upcommingMeetings.innerHTML = `
       <tr>
        <td colspan="4"><p class="text-center text-muted lead my-3">No Upcomming meetings for this project...</p></td>
       </tr>`;

       completedMeegings.innerHTML = `
       <tr>
        <td colspan="4"><p class="text-center text-muted lead my-3">No Completed meetings for this project...</p></td>
       </tr>`;
        console.log(err)
    });

}

function populateTeam(team){

    console.log("team",team);

    const teamList = document.getElementById("team-list");

    teamList.innerHTML = '';

    team.forEach(t=>{

        teamList.innerHTML += `
        <div class="col-6 col-md-3">
            <div class="bg-white text-center rounded p-3 my-card">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" class="rounded-circle team-profile"  alt="Profile">
                <h6 class="text-center mt-2 mb-1">${t.display_value}</h6>
                <small class="text-muted  fw-light">Team Member</small>
                <p class="text-center text-muted">${t.display_value.toLowerCase()}@zentegra.com</p>
                <span class="p-2 rounded small mt-3" style="background-color:#e5ebf8;"><i class="bi bi-check-circle-fill text-primary"></i> Available</span>
            </div>
        </div>`;
        
    });
}

function populateTimesheet(TID){
    

  const logsConfig = {
    appName: "zenworkr",
    reportName: "All_Logs",
    criteria : `(Task.ID == ${TID})`
    
  };

  ZOHO.CREATOR.API.getAllRecords(logsConfig).then(function (logsresponse) {

      if (logsresponse.code === 3000) {
        console.log("✅ Logs report:", logsresponse.data);

        const taskLogs = logsresponse.data;

        const timeSheetList = document.getElementById("timesheet-list");

        let html  = `<h6 class="mt-2"><i class="bi bi-clock-history"></i> ${taskLogs[0]["Task.Task_Name"]}</h6>`;
        html += `
        <div class="">
          <table class="table table-bordered table-rounded">
            <thead class="text-white">
              <tr>
                <th style="width:35%" class="text-uppercase small text-white text-indego">Asignee</th>
                <th style="width:20%" class="text-uppercase small text-white text-indego">Date</th>
                <th style="width:15%" class="text-uppercase small text-white text-indego">Started</th>
                <th style="width:15%" class="text-uppercase small text-white text-indego">Ended</th>
                <th style="width:15%" class="text-uppercase small text-white text-indego">Total Worked</th>
              </tr>
            </thead>
            <tbody>
        `;

        taskLogs.forEach(l=>{

            html +=`
            <tr>

                <td class="small">${l["Task.Assignee"]}</td>
                <td class="small">${l.Date_field}</td>
                <td class="small">${l.Work_Started}</td>
                <td class="small">${l.Work_Ended}</td>
                <td class="small">${l.Hours_Worked}</td>

            </tr>
            
            `
        })

        html += `
            </tbody>
          </table> 
          </div>
          
        `;

        timeSheetList.innerHTML += html;

      } else {
        return;
      }

  });

}

function populateFiles(TID){
    

  const logsConfig = {
    appName: "zenworkr",
    reportName: "All_Files",
    criteria : `(Task.ID == ${TID})`
    
  };

  ZOHO.CREATOR.API.getAllRecords(logsConfig).then(function (res) {

      if (res.code === 3000) {
        console.log("✅ Files report:", res.data);

        const taskFiles = res.data;

       const filesList = document.getElementById("files-list");
       const filesAcordion = document.getElementById("accordionPanelsStayOpenExample");

       let html =`
       
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${TID}" aria-expanded="false" aria-controls="${TID}">
            <i class="bi bi-folder"></i> <small class="ms-2 mb-0">${taskFiles[0].Task.display_value}</small>
          </button>
        </h2>
        <div id="${TID}" class="accordion-collapse collapse">
      <div class="accordion-body">
      `

      //  let html  = `<h6 class="mt-2"><i class="bi bi-clock-history"></i> ${taskFiles[0].Task.display_value}</h6>`;

        html += `
        <div class="">
          <table class="table table-bordered table-rounded">
            <thead class="text-white">
              <tr>
                <th style="width:35%" class="text-uppercase small text-white text-indego">File</th>
                <th style="width:25%" class="text-uppercase small text-white text-indego">Added By</th>
                <th style="width:25%" class="text-uppercase small text-white text-indego">Added Time</th>
                <th style="width:15%" class="text-uppercase small text-white text-indego">Download</th>
                

              </tr>
            </thead>
            <tbody>
        `;


        taskFiles.forEach(f=>{
            html +=`
            <tr>
                <td><img src="https://zenworkr.zohocreatorportal.com${f.File_field}" alt="" width="80" height="80"></td>
                <td>${f.Added_User}</td>
                <td>${f.Added_Time}</td>
                <td class="text-center"><a class="text-decoration-none text-dark" href="https://zenworkr.zohocreatorportal.com${f.File_field}"><i class="bi bi-download"></i></a></td>

            </tr>
            
            `
        });

        html += `
            </tbody>
          </table> 
          </div>

          </div>
    </div>
  </div>
          
        `;

        filesAcordion.innerHTML += html;

      } else {
        return;
      }

  });

}


function populateExpenses(PID){

  const expensesTbody = document.getElementById("expense-body");
    

  const config = {
    appName: "zenworkr",
    reportName: "All_Project_Expenses",
    criteria : `(Project_Name.ID == ${PID})`
    
  };

  ZOHO.CREATOR.API.getAllRecords(config).then(function (res) {

      if (res.code === 3000) {
        console.log("✅ Expenses report:", res.data);

        const allExpenses = res.data;

        

        allExpenses.forEach(e=>{
            expensesTbody.innerHTML = `
                <tr>
                    <td>${e.Amount || "-"}</td>
                    <td>${e.Billing_Type || "-"}</td>
                    <td>${e?.Category || "-"}</td>
                    <td>${e.Description || "-"}</td>
                    <td>${e.Expense_Date || "-"}</td>
                </tr>
            `;
        })

      } else {
        return;
      }

  }).catch(err =>{
    expensesTbody.innerHTML = `<tr>
        <td colspan="9"><p class="text-center text-muted lead my-3">No Expenses for this project...</p></td>
        
    </tr>`;
  })

}

function populateBudget(PID){

  const budgetTbody = document.getElementById("budget-body");
    

  const config = {
    appName: "zenworkr",
    reportName: "backend_budget_Report",
    criteria : `(Project_Name.ID == ${PID})`
    
  };

  ZOHO.CREATOR.API.getAllRecords(config).then(function (res) {

      if (res.code === 3000) {
        console.log("✅ Budget report:", res.data);

        const allBudget = res.data;

        

        budgetTbody.innerHTML = "";

        allBudget.forEach((b,i)=>{

          const budgetDetails = b.Budget_Details
          // console.log(budgetDetails)

          // check if it's array
          if (Array.isArray(budgetDetails)) {
            budgetDetails.forEach((detail, j) => {
              const rows = parseApiString(detail.display_value);
              budgetTbody.innerHTML += `
                <tr>
                    <td>${rows.phase_name || "-"}</td>
                    <td>${rows.time || "-"}</td>
                    <td>${rows.employee || "-"}</td>
                    <td>${rows.hourly_rate || "-"}</td>
                    <td>${rows.amount || "-"}</td>
                    <td>${rows.mockup || "-"}</td>
                    <td>${rows.estimated_budget || "-"}</td>
                </tr>`
              
            });
          };

        });


        const budgetCards =document.getElementById("budget-cards");

        budgetCards.innerHTML = "";

        budgetCards.innerHTML = `

        <div class="col">

            <div class="card text-center">
                <h5>Total Hours</h5>
                <p>${allBudget[0].Total_Estimated_Budget_Hours}</p>
            </div>

        </div>
        <div class="col">

            <div class="card text-center">
                <h5>Total Cost with Mockup</h5>
                <p>${allBudget[0].Total_Budget}</p>
            </div>

        </div>
        <div class="col">

            <div class="card text-center">
                <h5>Base Cost</h5>
                <p>${allBudget[0].Total_Estimated_Budget_Cost}</p>
            </div>

        </div>
        
        `

      } else {
        return;
      }

  }).catch(err =>{
    budgetTbody.innerHTML = `<tr>
        <td colspan="9"><p class="text-center text-muted lead my-3">No Budget for this project...</p></td>
        
    </tr>`;
  })

}

function fetchAllEmployees(){
    const employeeConfig = {
      appName: "zenworkr",
      reportName: "My_Team_Employees",
    };

    ZOHO.CREATOR.API.getAllRecords(employeeConfig).then(function (employeeResponse) {
        console.log("✅ALL Reportees Response:", employeeResponse.data);

        ALL_REPORTEES = employeeResponse.data;
        if(employeeResponse.data.length > 1){
          document.getElementById("emp_input_div").classList.remove("d-none");
          searchEmployee(ALL_REPORTEES);
        } 
        
          

    });
}