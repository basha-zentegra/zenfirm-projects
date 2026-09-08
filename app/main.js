let ALL_PROJECTS = null;
let LOGEDINUSER = null;
let USERID = null;
let ORG = null;
let ORGNAME = '';
let ALL_REPORTEES = [];
let TYPE = null;
let ALL_ORG_EMPLOYEES = [];


//---> TEAM LISTS <------
let ITR_TEAM = [];
let BTR_TEAM = [];
let PAYROLL_TEAM = [];
let BOOKKEEPING_TEAM = [];
let SALESTAX_TEAM = [];
let INC_TEAM = [];

let selectedProjectTeam = [];

const APP_NAME = "zenfirm";

let selected_project_group = '';

let domain = '';


function johoApi(){

ZOHO.CREATOR.init().then(function(data) {
    console.log("Zoho Creator SDK Initialized.");
    var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    console.log("Query response", queryParams);

    if(queryParams.pid){
      autoProjectClick(queryParams.pid)
    }

    if(localStorage.getItem("LOGEDINUSER")){

      LOGEDINUSER = localStorage.getItem("LOGEDINUSER");

      if(LOGEDINUSER.includes("@zentegra.com")){
        domain = 'https://creatorapp.zoho.in/zentegraindia/zenfirm'
      }else{
        domain = 'https://zenfirm.zohocreatorportal.in/'
      }
      
    } else{
      try {
        const response = window.ZOHO.CREATOR.UTIL.getInitParams();
        console.log("✅ UTIL Response:", response);
        LOGEDINUSER = response?.loginUser || null;
        console.log("LOGEDINUSER, ", LOGEDINUSER);
        localStorage.setItem("LOGEDINUSER",response?.loginUser)
            if(LOGEDINUSER.includes("@zentegra.com")){
              domain = 'https://creatorapp.zoho.in/zentegraindia/zenfirm'
            }else{
              domain = 'https://zenfirm.zohocreatorportal.in/'
            }
      } catch (error) {
        console.error("❌ Error Getting Init Params:", error);
      }
    }

    if(localStorage.getItem("USERID") && localStorage.getItem("ORG")){

      USERID = localStorage.getItem("USERID");
      ORG = localStorage.getItem("ORG");
      fetchAllProjects();
      fetchAllTasksCount(null); //KPY CARDS
      
      
    } else{
      const employeeConfig = {
        appName: "zenfirm",
        reportName: "All_Employee",
        criteria: `(Email == "${LOGEDINUSER}")`,
      };

      ZOHO.CREATOR.API.getAllRecords(employeeConfig).then(function (employeeResponse) {
          console.log("✅Logged in Employee Response:", employeeResponse.data);
          USERID = employeeResponse.data.find((e) => true)?.ID;
          ORG = employeeResponse.data.find((e) => true)?.Organization.ID;
          localStorage.setItem("USERID",USERID);
          localStorage.setItem("ORG",ORG);

          console.log("ORGINIZATION ID", ORG)

          setTimeout(() => {
            fetchAllTasksCount(null)
          }, 1000);

          return fetchAllProjects();
           
      });

    }
    

    


    if(sessionStorage.getItem("ALL_EMP")){
      ALL_ORG_EMPLOYEES = JSON.parse(sessionStorage.getItem("ALL_EMP"))
      // sessionStorage.removeItem("ALL_EMP")

    } else{
      setTimeout(() => {
        fetchAllOrgEmployees()
      }, 2000);
    }

    if(sessionStorage.getItem("ALL_REPORTEE")){
      ALL_REPORTEES = JSON.parse(sessionStorage.getItem("ALL_REPORTEE"));
      if(ALL_REPORTEES.length > 1){
          document.getElementById("emp_input_div").classList.remove("d-none");
          document.getElementById("today-report-btn").classList.remove("d-none");
          searchEmployee(ALL_REPORTEES);
          // todayReport(TODAY);

          const asign_button = document.getElementById("asign-emp-dropdown");
          ALL_REPORTEES.forEach(r =>{
              asign_button.innerHTML += `<li><a class="dropdown-item btn" onclick="bulkAsign('${r.ID}','${r.Name}')">${r.Name}</a></li>`
          })
      }
    } else{

      fetchAllReportiees()

    }

    fetchTeams()
    fetchImapCredential()


})
.catch(function (error) {
    console.error("Error initializing Zoho Creator SDK:", error);
});
}
johoApi()




function populateNotes(PID) {

    const notesSec = document.getElementById("all-notes-sec");
    notesSec.innerHTML = '';

    const taskNoteSec = document.getElementById("task-notes-sec");
    taskNoteSec.innerHTML='';

    var project_diss_config = {
        appName: "zenfirm",
        reportName: "All_Notes",
        criteria : `(Project.ID == ${PID})`
    };

    ZOHO.CREATOR.API.getAllRecords(project_diss_config).then(function (response) {
            console.log('✅ Notes report', response.data);

            const allNotes = response.data;

            

            allNotes.forEach(element => {

              if(element?.Task===""){

                document.getElementById("notes-category-button").innerText = "Project Notes";

                notesSec.innerHTML += `
  <div class="note-item">
        <img src="https://cdn-icons-png.flaticon.com/128/16683/16683419.png"
             class="note-avatar">

        <div class="note-content">
            <div class="note-author">${element?.Added_by?.display_value  || " "}</div>

            <div class="note-text">
                ${element?.Note || " "}
            </div>

            <div class="note-meta">
                ${element["Task.Task_Name"] || "No Task"} | ${element?.Project?.display_value || "No Project"} | ${element?.Added_Time  || " "}
            </div>
        </div>
    </div>
           `


              }else{
                
                
                  
                taskNoteSec.innerHTML += `

                  
<div class="note-item">
        <img src="https://cdn-icons-png.flaticon.com/128/16683/16683419.png"
             class="note-avatar">

        <div class="note-content">
            <div class="note-author">${element?.Added_by?.display_value  || " "}</div>

            <div class="note-text">
                ${element?.Note || " "}
            </div>

            <div class="note-meta">
                ${element["Task.Task_Name"] || "No Task"} | ${element?.Project?.display_value || "No Project"} | ${element?.Added_Time  || " "}
            </div>
        </div>
    </div>
                  
                  
                  
                  `
              }



            })


    }).catch(error => {

          notesSec.innerHTML = `
              <p class="text-center text-muted lead my-3">No Notes added for this project...</p>`;
            console.error('Error loading discussions:', error);
            
    });
}

function overdueTask(PID){
  const div =  document.getElementById("overduetask-tbody");
  div.innerHTML ="";
      const config = {
        appName: "zenworkr",
        reportName: "Task_Report", 
        criteria : `(Project_Name.ID == ${PID} && Task_Status == "In Progress" || Task_Status == "Not Started" && Task_Date < '03-11-2025' )`
    
    };

    // Fetch project data //&& Overtime == "true" //&& Assignee.ID == ${USERID} criteria : `(Project_Name.ID == ${PID}  && Overtime == true)`
    ZOHO.CREATOR.API.getAllRecords(config).then(function (res) {

      if(res.code === 3000){
        console.log("✅ Overtime Task:", res.data);

        res.data.forEach(t => {

          div.innerHTML += `
          <tr>
              <td>
                <div class="avatar-container">
                  <div 
                    class="avatar" 
                    title="${t.Assignee.display_value}"
                    style="background-color: ${getAvatarColor(t.Assignee.display_value)};"
                  >
                    ${getInitials(t.Assignee.display_value)}
                  </div>
                  <span>${t.Task_Name}</span>
                </div>

              </td>

              <td style="width:18%;" class="text-danger">${t.Task_Date || "0"}</td>
          </tr>
          `;

        })
//              <td>${calculateTimeDifference(t.Start_Time,t.End_Time) || "-"}</td>
      }else{
        console.log("the response code is not 3000", res)
      }
        
    }).catch(e=>{
      console.log("Error fetching overdue tasks",e)
    })
}

function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}
function getAvatarColor(name) {
  const colors = ['#f4b400', '#4285f4', '#34a853', '#ea4335', '#ff6d00'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// function calculateTimeDifference

//work on meeting module from scratch

async function openModal(pid, UID=null) {

  console.log("PID CAME TO OPEN MODALLLLL PROJECT CLICK::::::::::::::", pid)


    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();

    populateTasks(pid, USERID);
    populateTaskKpi(pid)
    populateMilestones(pid);
    
    // populateMeetings(pid);
    // populateExpenses(pid);
    populateNotes(pid);
    populateCharts(pid, UID);
    overdueTask(pid);
    // populateTaskLists(pid);

    populateFilesToClients(pid);
    populateFilesFromClients(pid);
    populateWorkingFiles(pid);

    document.getElementById("budget-btn").addEventListener("click", () => {
      populateBudget(pid);
      setTimeout(() => {
        // const test = document.querySelectorAll('#budget-body');
        const test = document.getElementById("budget-body");
        console.log("test", test.innerHTML)
      }, 5000);
    });
    document.getElementById("timeline-btn").addEventListener("click", () => populateTimeline(pid));

    //Individual Tax Filing

    const itrBtn = document.getElementById("itr-btn");
    
    let project = ALL_PROJECTS.find(x => x.ID === pid);

    // if(!project){
    //   console.log("FETCHING THE RECORD BY PID")
    //   ZOHO.CREATOR.API.getRecordById({reportName : "My_Team_Projects", id : pid} ).then(function(response){
    //       console.log(response.data);
    //       if(response.code===3000) project = response.data;
    //   });
    // }

    if (!project) {
      console.log("FETCHING THE RECORD BY PID",pid);

      try {
        const response = await ZOHO.CREATOR.API.getRecordById({ appName : "zenfirm",reportName: "All_Projects1", id: pid});

        if (response.code === 3000) {
          console.log("FETCHED PROJECT FROM PID")
          project = response.data;
        }else{
          console.log("ELSE",response)
        }

      } catch (err) {
        console.error("Error fetching project:", err);
        return; // stop execution if API fails
      }
    }

    if (!project) {
      console.error("Project not found");
      return;
    }




    console.log("Selected project:", project);
    document.getElementById("itr-btn").classList.remove("d-none"); 
    if(project?.Project_Group1?.display_value === "Individual Tax Filing"){

      itrBtn.innerHTML = `<i class="me-1 fs-md-6 bi bi-card-checklist"></i> ITR`;
      // itrBtn.addEventListener("click", () => populateITR(pid, "ITR_Report"));
      itrBtn.onclick = () => populateITR(pid, "ITR_Report");
      selected_project_group = "ITR_Report"

    } else if(project?.Project_Group1?.display_value === "Payroll"){
      itrBtn.innerHTML = `<i class="me-1 fs-md-6 bi bi-card-checklist"></i> Payroll`;
      // itrBtn.addEventListener("click", () => populateITR(pid, "Payroll_Employer_Setups_Report"));
      itrBtn.onclick = () => populateITR(pid, "Payroll_Employer_Setups_Report");
      selected_project_group = '';

    } else if(project?.Project_Group1?.display_value === "Bookkeeping"){
      itrBtn.innerHTML = `<i class="me-1 fs-md-6 bi bi-card-checklist"></i> Bookkeeping`;
      itrBtn.onclick = () => populateITR(pid, "All_Bookkeepings");
      selected_project_group = '';

    } else if(project?.Project_Group1?.display_value === "Sales Tax"){
      itrBtn.innerHTML = `<i class="me-1 fs-md-6 bi bi-card-checklist"></i> Sales Tax`;
      itrBtn.onclick = () => populateITR(pid, "Sales_Tax_Report");
      selected_project_group = '';
    } 
    else if(project?.Project_Group1?.display_value === "Business Tax Filing"){
      itrBtn.innerHTML = `<i class="me-1 fs-md-6 bi bi-card-checklist"></i> BTR`;
      itrBtn.onclick = () => populateITR(pid, "BTR_Report");
      selected_project_group = "BTR_Report"
    } 
    else if(project?.Project_Group1?.display_value === "Incorporation"){
      itrBtn.innerHTML = `<i class="me-1 fs-md-6 bi bi-card-checklist"></i> Incorp Details`;
      itrBtn.onclick = () => populateITR(pid, "Incorp_Report");
      selected_project_group = '';
    } 
    else {
      itrBtn.innerHTML = `<i class="me-1 fs-md-6 bi bi-card-checklist"></i> None`;
      itrBtn.onclick = () => populateITR(pid, null);
      // itrBtn.classList.add("d-none");
      selected_project_group = '';
      document.getElementById("itr-btn").classList.add("d-none"); 
      
    } 

    // document.getElementById("team-btn").addEventListener("click", () => populateTeam(project.Associated_Members, project?.Team?.ID));
    //Associated_Members
    populateTeam(project.Associated_Members, project?.Team?.ID);

    selectedProjectTeam = project?.Associated_Members || [];

    document.getElementById('modalTitle').innerText = project.Project_Name || "-";
    document.getElementById("root-project-folder").innerText = project.Project_Name || "-";

    // Open modal programmatically
    // const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    // myModal.show();

    selecteProject = pid; 
    selectedProjectName = project?.Project_Name || 'Null';
    from_email = project["Contact_Name.Email"];
    acc = project?.Accounts?.ID;
    console.log("-----------------------------------------------")
    loadEmails(page);
    sent_loadEmails(sent_page);
    document.getElementById("emailTo").value = from_email || '';

    // populateFilesToClients(pid);

    addRecentProject({id: pid,name: project.Project_Name});

    if(project.Project_Name.toLowerCase().includes("payroll") || project.Project_Name.toLowerCase().includes("bookkeeping") || project.Project_Name.toLowerCase().includes("sales tax")){
      document.getElementById("project-cancel-btn").classList.remove("d-none");
    }else {
      document.getElementById("project-cancel-btn").classList.add("d-none");
    }

    if(project?.Accounts?.ID){
      document.getElementById("accountName-div").innerHTML = `<a class="small text-decoration-none" target="_blank" style="font-size: 12px;" href="${domain}#Page:Account_View?recordID=${project?.Accounts?.ID}">${project?.Accounts?.display_value}</a>`
    }else{
      document.getElementById("accountName-div").innerHTML = ``;
    }

    // sessionStorage.setItem("pid", project?.ID)

}

function populatePhaseBarChart(PID,phase_list){

  if(!PID){
    phaseBarChart.data.labels = ['No Phases in this project'];
    phaseBarChart.data.datasets[0].data = [0];
    phaseBarChart.update();
    return;
  }

  const promises = phase_list.map(p => {

    let cri = `(Project_Name.ID == ${PID} && Milestone_Name.ID == ${p.ID})`

    const config = {
      appName: "zenworkr",
      reportName: "Task_Report",
      criteria: cri
    };
    
    return ZOHO.CREATOR.API.getRecordCount(config).then(response => {
      // console.log(response.result.records_count)
      p.taskCount = response.result.records_count;
    });

  })

  Promise.all(promises).then(() => {
    console.log("phase_list",phase_list); 
    // phaseBarchart(phase_list)
    phaseBarChart.data.labels = phase_list.map(p=> p.phaseName);
    phaseBarChart.data.datasets[0].data = phase_list.map(p=> p.taskCount);
    phaseBarChart.update();
  });
  
}

function populateCharts(PID, UID){

  const statuses = ["Not Started", "In Progress", "Completed", "Approved"];
  const taskCounts = {"Not Started": 0,"In Progress": 0,"Completed": 0,"Approved": 0};

  const promises = statuses.map(status => {
    
    let cri = `(Project_Name.ID == ${PID} && Task_Status == "${status}")`

    if(UID){
      cri = `(Assignee.ID == ${UID} && Project_Name.ID == ${PID} && Task_Status == "${status}")`
    }

    const config = {
      appName: "zenworkr",
      reportName: "Task_Report",
      criteria: cri
    };
    return ZOHO.CREATOR.API.getRecordCount(config).then(response => {
      taskCounts[status] = response.result.records_count;
    });

  });

  Promise.all(promises).then(() => {
    const data = statuses.map(s => taskCounts[s]);

    myDoughnutChart.data.datasets[0].data = data;
    myDoughnutChart.update();
  });
}


function resetApp(){
  localStorage.removeItem("ALL_EMP");
  localStorage.removeItem("ALL_REPORTEE");
  localStorage.removeItem("LOGEDINUSER");
  localStorage.removeItem("ORG");
  localStorage.removeItem("USERID");
  location.reload();
}

/* Bootstrap 5 JS included */
/* vanillajs-datepicker 1.1.4 JS included */

const getDatePickerTitle = elem => {
  // From the label or the aria-label
  const label = elem.nextElementSibling;
  let titleText = '';
  if (label && label.tagName === 'LABEL') {
    titleText = label.textContent;
  } else {
    titleText = elem.getAttribute('aria-label') || '';
  }
  return titleText;
}

const elems = document.querySelectorAll('.datepicker_input');
for (const elem of elems) {
  const datepicker = new Datepicker(elem, {
    'format': 'dd/mm/yyyy', // UK format
    title: getDatePickerTitle(elem)
  });
}


// Example URL: https://example.com/page?name=John&age=25

// setTimeout(() => {
//   const params = new URLSearchParams(window.location.search);
//   const paramsPid = params.get("pid");

//   console.log("PERAMS LOG", paramsPid, params)
// }, 5000);


// function getQueryParam(key) {
//   const query = window.location.search.substring(1);
//   console.log(query)
//   const pairs = query.split("&");

//   for (const pair of pairs) {
//     const [k, v] = pair.split("=");
//     if (k === key) return decodeURIComponent(v);
//   }
//   return null;
// }

// setTimeout(() => {
//   console.log(getQueryParam("pid"));
// }, 3000);

function autoProjectClick(pid){

  console.log("PID CAME TO AUTO PROJECT CLICK::::::::::::::", pid)

  setTimeout(() => {
    openModal(pid, null)
  }, 2000);
  
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))





// iframe.addEventListener('load', () => {

//   const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

//   const matchedDivs = [...iframeDoc.querySelectorAll('h1')]
//     .filter(div =>
//       div.textContent.toLowerCase().includes('data updated successfully')
//     );

//   console.log(matchedDivs);
// });


function fetchTeams(){

  ZOHO.CREATOR.API.getAllRecords({appName: APP_NAME, reportName: "All_Teams"})
  .then(function (response){
    console.log("All_Teams",response)
    if(response.code === 3000){
      
      const allTeams = response.data;

      allTeams.forEach(element => {
        if(element?.Project_Group?.display_value?.includes("Individual")){
          ITR_TEAM = element?.Members;
        }

        if(element?.Project_Group?.display_value?.includes("Business")){
          BTR_TEAM = element?.Members;
        }

        if(element?.Project_Group?.display_value?.includes("Payroll")){
          PAYROLL_TEAM = element?.Members;
        }
        if(element?.Project_Group?.display_value?.includes("Bookkeeping")){
          BOOKKEEPING_TEAM = element?.Members;
        }
        if(element?.Project_Group?.display_value?.includes("Sales")){
          SALESTAX_TEAM = element?.Members;
        }
        if(element?.Project_Group?.display_value?.includes("Incorporation")){
          INC_TEAM = element?.Members;
        }
        
      });
    }
    

  })
  .catch(e => console.error(e))
}


  // const totalPages = 10;

  
  

  // function renderPagination() {
  //   const pagination = document.getElementById("pagination");
  //   pagination.innerHTML = "";

  //   // Previous button
  //   pagination.innerHTML += `
  //     <li class="page-item ${current_Project_Page === 1 ? "disabled" : ""}">
  //       <a class="page-link" href="#" onclick="changePage(${current_Project_Page - 1})">Previous</a>
  //     </li>
  //   `;

  //   // Page numbers
  //   for (let i = 1; i <= totalPages; i++) {
  //     pagination.innerHTML += `
  //       <li class="page-item ${i === current_Project_Page ? "active" : ""}">
  //         <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
  //       </li>
  //     `;
  //   }

  //   // Next button
  //   pagination.innerHTML += `
  //     <li class="page-item ${current_Project_Page === totalPages ? "disabled" : ""}">
  //       <a class="page-link" href="#" onclick="changePage(${current_Project_Page + 1})">Next</a>
  //     </li>
  //   `;
  // }

  //// ------- > PAGINATION

  const visibleRange = 2; 


  function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    // Previous
    pagination.innerHTML += `
      <li class="page-item ${current_Project_Page === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" onclick="changePage(${current_Project_Page - 1})">Previous</a>
      </li>
    `;

    // First page
    addPage(1);

    // Left dots
    if (current_Project_Page > visibleRange + 2) {
      addDots();
    }

    // Middle pages
    const start = Math.max(2, current_Project_Page - visibleRange);
    const end = Math.min(totalPages - 1, current_Project_Page + visibleRange);

    for (let i = start; i <= end; i++) {
      addPage(i);
    }

    // Right dots
    if (current_Project_Page < totalPages - visibleRange - 1) {
      addDots();
    }

    // Last page
    if (totalPages > 1) {
      addPage(totalPages);
    }

    // Next
    pagination.innerHTML += `
      <li class="page-item ${current_Project_Page === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" onclick="changePage(${current_Project_Page + 1})">Next</a>
      </li>
    `;
  }


  function addPage(page) {
    pagination.innerHTML += `
      <li class="page-item ${page === current_Project_Page ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${page})">${page}</a>
      </li>
    `;
  }

  function addDots() {
    pagination.innerHTML += `
      <li class="page-item disabled">
        <span class="page-link">...</span>
      </li>
    `;
  }



  function changePage(page) {
    if (page < 1 || page > totalPages) return;
    current_Project_Page = page;
    renderPagination();
    fetchAllProjects();
    document.getElementById("paginationspinner").classList.remove("d-none"); 
    document.getElementById("pagination").classList.add("opacity-75")
    document.getElementById("pagination").classList.add("pe-none")

    console.log("Current Page:", current_Project_Page);
    // Load data for this page here
  }

  setTimeout(() => {
    
  }, 5000);

  
function closeProjectModal(){
  document.getElementById("task-nav-button").click()
}


// document.addEventListener("DOMContentLoaded", function(){
//   if(sessionStorage.getItem("pid")){
//     setTimeout(() => {
//       const pid = sessionStorage.getItem("pid");
//       openModal(pid, null)
//     }, 2000);
//   }
// })


function fetchImapCredential(){

  var config = { 
      reportName : "IMAP_Report", 
      criteria : `Employee.ID ==${USERID}`,
  }
  
  ZOHO.CREATOR.API.getAllRecords(config).then(function(response){

      if(response.code===3000){

        if(response.data.length > 0){

          const recordArr = response.data[0];
          console.log(recordArr)
          login(recordArr?.Email, recordArr?.Password)

        }else{
          console.log("ARRAY LENTH IS 0")
        }

      }else if(response.code == 3100){
        //TRIGER IMAP SIGNUP---
        console.log("RESPONSE CODE IS NOT 3000", response)
        trigerImapSignup()

      }else{
        console.log("SOME ERROR: ", response )
        trigerImapSignup()
      }

  }).catch(e=> {
    console.log("SOME ERROR: ", e );
    trigerImapSignup() 
  });
}