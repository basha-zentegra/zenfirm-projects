var TODAY = returnToday();
let incorpId = "";

let current_Project_Page = 1;
let project_count = 0;
let totalPages = 0;

window.fetchAllProjects = function(CRITI=null){


    let projectConfig = {reportName: "My_Team_Projects", page : current_Project_Page,pageSize : 200};

    if(CRITI){

        console.log("CRITERIA IS APPLIEEEDDD!!!")

        projectConfig = {
            reportName: "My_Team_Projects", 
            criteria : CRITI,
            page : current_Project_Page,
            pageSize : 200
        };
    }

    ZOHO.CREATOR.API.getRecordCount({appName: "zenfirm",reportName: "My_Team_Projects"}).then(function (response){project_count=response.result.records_count; totalPages = Math.ceil(project_count / 200);renderPagination();});

    
    const projectTbody = document.getElementById("all-projects-tbody");
    const searchDropdown = document.getElementById('searchDropdown');
    //1141991000005670051

    

    // Fetch project data //|| Associated_Members.ID ==
    ZOHO.CREATOR.API.getAllRecords(projectConfig).then(function (res) {
      
        console.log("✅ Project Response:", res.data);

        // totalProjectCount.innerText = res.data.length;
        
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
            case "new discussion":
              statusClass = "new-discussion";
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

            // if(CRITI){

            //   projectTbody.innerHTML+= `
            //     <tr class="cursor-pointer" onclick="openModal('${p.ID}', '${UID}')">
            //         <td>${p.Project_Name || "-"}</td>
            //         <td id="prj-sts-${p.ID}" style="width:15%;" class="text-center" contextmenu="editProjectStatus('${p.ID}',event)"><span class="bg-status ${statusClass}">${p.Project_Status || "-"}</span></td>
            //         <td class="text-center"><span class="bg-status  fw-semibold fw-md-bold ${priorityClass}">${p.Priority.slice(0,3) || "No Priority"}</span></td>
            //         <td class="text-center">${p.Project_owner?.display_value || p.Account_Manager?.display_value || "-"}</td>
            //         <td class="text-center">${p.Team?.display_value || "-"}</td>
            //         <td class="text-center">${p.Project_Start_Date || "-"}</td>
            //         <td class="text-center">${p.Project_End_Date || "-"}</td>
            //     </tr>
            //    `;


            // } else{
            //   projectTbody.innerHTML+= `
            //     <tr class="cursor-pointer" onclick="openModal('${p.ID}', ${UID})"> 
            //         <td>${p.Project_Name || "-"}</td>
            //         <td id="prj-sts-${p.ID}" style="width:15%;" class="text-center" oncontextmenu="editProjectStatus('${p.ID}',event)"><span class="bg-status ${statusClass}">${p.Project_Status || "No Status"}</span></td>
            //         <td id="prj-pri-${p.ID}" class="text-center" oncontextmenu="editProjectPriority('${p.ID}',event)"><span class="bg-status  fw-semibold fw-md-bold ${priorityClass}" >${p.Priority.slice(0,3) || "No Priority"}</span></td>
            //         <td class="text-center">${ p.Account_Manager?.display_value || "-"}</td>
            //         <td class="text-center">${ p.Service_Owner?.display_value || "-"}</td>

            //         <td class="text-center">${p.Project_Type1?.display_value || "-"}</td>
            //         <td class="text-center">${p.Contact_Name?.display_value || "-"}</td>
            //         <td class="text-center">${p.Accounts?.display_value || "-"}</td>

            //         <td id="prj-preparer-${p.ID}" class="text-center" oncontextmenu="editPreparer('${p.ID}','${p.Project_Type1?.display_value}', event)">${ p.Preparer?.display_value || "-"}</td>
            //         <td id="prj-reviewer-${p.ID}" class="text-center" oncontextmenu="editReviewer('${p.ID}','${p.Project_Type1?.display_value}', event)">${ p.Reviewer?.display_value || "-"}</td>
            //         <td id="prj-peerreviewer-${p.ID}" oncontextmenu="editPeerReviewer('${p.ID}','${p.Project_Type1?.display_value}', event)" class="text-center">${ p.Peer_Reviewer?.display_value || "-"}</td>

            //         <td class="text-center">${p.Project_Start_Date || "-"}</td>
            //         <td class="text-center">${p.Project_End_Date || "-"}</td>
            //     </tr>
            // `;
            // }

            projectTbody.innerHTML+= `
                <tr class="cursor-pointer" onclick="openModal('${p.ID}')"> 
                    <td>${p.Project_Name || "-"}</td>
                    <td id="prj-sts-${p.ID}" style="width:15%;" class="text-center" oncontextmenu="editProjectStatus('${p.ID}',event)"><span class="bg-status ${statusClass}">${p.Project_Status || "No Status"}</span></td>
                    <td id="prj-pri-${p.ID}" class="text-center" oncontextmenu="editProjectPriority('${p.ID}',event)"><span class="bg-status  fw-semibold fw-md-bold ${priorityClass}" >${p.Priority.slice(0,3) || "No Priority"}</span></td>
                    <td class="text-center">${ p.Account_Manager?.display_value || "-"}</td>
                    <td class="text-center">${ p.Service_Owner?.display_value || "-"}</td>

                    <td class="text-center">${p.Project_Type1?.display_value || "-"}</td>
                    <td class="text-center">${p.Contact_Name?.display_value || "-"}</td>
                    <td class="text-center">${p.Accounts?.display_value || "-"}</td>

                    <td id="prj-preparer-${p.ID}" class="text-center" oncontextmenu="editPreparer('${p.ID}','${p.Project_Type1?.display_value}', event)">${ p.Preparer?.display_value || "-"}</td>
                    <td id="prj-reviewer-${p.ID}" class="text-center" oncontextmenu="editReviewer('${p.ID}','${p.Project_Type1?.display_value}', event)">${ p.Reviewer?.display_value || "-"}</td>
                    <td id="prj-peerreviewer-${p.ID}" oncontextmenu="editPeerReviewer('${p.ID}','${p.Project_Type1?.display_value}', event)" class="text-center">${ p.Peer_Reviewer?.display_value || "-"}</td>

                    <td class="text-center">${p.Project_Start_Date || "-"}</td>
                    <td class="text-center">${p.Project_End_Date || "-"}</td>
                </tr>
            `;

            // searchDropdown.innerHTML+= `<li>${p.Project_Name || "-"}</li>`;
            document.getElementById("loading-animation").className="d-none";
            
        });

        // searchProject();
        // fetchAllTasksCount(UID); //KPY CARDS

        console.log("RESPONSE,", res.code)

        document.getElementById("paginationspinner").classList.add("d-none");
        document.getElementById("pagination").classList.remove("opacity-75")
        document.getElementById("pagination").classList.remove("pe-none")


    }).catch(e=>{
      console.log("error fetching projects", e)

      let errCode = null;

      if (e.responseText) {
          try {
              const errObj = JSON.parse(e.responseText);
              errCode = errObj.code;

              console.log("🔍 Parsed Error Code:", errCode);

              // ✔️ Check specifically for code 3100
              if (errCode === 3100) {
                  console.log("⚠️ No projects found — custom block executed.");
                  // 👉 Put your custom logic here
                  projectTbody.innerHTML = `
                  <tr  class="cursor-pointer">
                      <td colspan="13"><p class="lead text-center">No Projects Found</p></td>
                      
                  </tr>
                `;
              }

          } catch (parseError) {
              console.error("❌ Failed to parse error JSON:", parseError);
          }
      }
      
      document.getElementById("loading-animation").className="d-none";
    })

}

// --- KPI CARDS ---
window.fetchAllTasksCount = function (UID){

  

    const closedTaskCount = document.getElementById("closed-task-count");
    const openTask = document.getElementById("open-task-count");
    const approved = document.getElementById("approved-tasks-count");
    const rejected = document.getElementById("rejected-task-count");

  const statuses = ["Not Started", "In Progress", "Completed", "Approved", "Rejected"];
  const taskCounts = {"Not Started": 0,"In Progress": 0,"Completed": 0,"Approved": 0,"Rejected":0};

  const myPromises = statuses.map(status => {

    let config = {}

    if(UID){
        config = {
          appName: "zenfirm",
          reportName: "Task_Report",
          criteria: `(Assignee.ID == ${UID} && Task_Status ==  "${status}")`,
        };
    } else{
        config = {
            appName: "zenfirm",
            reportName: "Task_Report",
            criteria: `(Task_Status ==  "${status}")`,
        };
    }


    return ZOHO.CREATOR.API.getRecordCount(config).then(response =>{taskCounts[status] = response.result.records_count;  });
  });

  Promise.all(myPromises).then(()=>{
    animateCount(closedTaskCount, taskCounts["Completed"], 1000);
    animateCount(openTask, taskCounts["In Progress"], 1000);
    animateCount(approved, taskCounts["Approved"], 1000);
    animateCount(rejected, taskCounts["Rejected"], 1000);
  })

  let interv= setInterval(() => {
    if(project_count > 0){
      const totalProjectCount = document.getElementById("total-projects-count");
      animateCount(totalProjectCount, project_count, 3500)
      clearInterval(interv);
    }
  }, 500);

  
    
}

let selected_project_phases = [];
function populateMilestones(PID){

  const phaseTbody = document.getElementById("phases-tbody");
  const phaseCount = document.getElementById("total-phases-count");

    const milestoneConfig = {
        appName: "zenfirm",
        reportName: "All_Milestones", 
        criteria : `(Project_Name.ID == ${PID})`
    
    };

    // Fetch project data
    ZOHO.CREATOR.API.getAllRecords(milestoneConfig).then(function (res) {

        console.log("✅ Milestone Response:", res.data);

        const phase_list = res.data.map(p=> {
          return {
            ID : p.ID,
            phaseName: p.Phase_Name,
            taskCount: 0
          }
        });

        const allPhases = res.data;
        selected_project_phases = res.data || [];

        phaseCount.innerText = res.data.length;

        phaseTbody.innerHTML = '';

        allPhases.forEach(p =>{

            phaseTbody.innerHTML+= `
                    <tr>
                        <td>${p?.Phase_Name || "-"}</td>
                        <td>-</td>
                        <td>${p?.Priority || "-"}</td>
                        <td>${p?.Owner.display_value || "-"}</td>
                        <td>${p?.Start_Date || "-"}</td>
                        <td>${p?.End_Date || "-"}</td>
                    </tr>
            `;
        });
        return populatePhaseBarChart(PID,phase_list);


    }).catch(err => {
        phaseTbody.innerHTML = `<tr>
                        <td colspan="6"><p class="text-center text-muted lead my-3">No Milestones for this project...</p></td>
                        
                    </tr>`;

        phaseCount.innerText = "0";
        populatePhaseBarChart(null, null)
        console.log(err)
    });

}

function populateTaskLists(PID){

  const tlTbody = document.getElementById("task-list-tbody");
  // const phaseCount = document.getElementById("total-phases-count");

  const config = {
      appName: "zenfirm",
      reportName: "All_Task_Lists", 
      criteria : `(Project.ID == ${PID})`
  
  };

    // Fetch project data
    ZOHO.CREATOR.API.getAllRecords(config).then(function (res) {

        console.log("✅ Task List Response:", res);

        // const phase_list = res.data.map(p=> {
        //   return {
        //     ID : p.ID,
        //     phaseName: p.Millstone_Name,
        //     taskCount: 0
        //   }
        // });

        let tl_obj = {};



        const allTl = res.data;



        // phaseCount.innerText = res.data.length;

        tlTbody.innerHTML = '';

        allTl.forEach(p =>{

            // tlTbody.innerHTML+= `
            //         <tr>
            //             <td>${p.Task_List_Name || "-"}</td>
            //             <td>${p.Milestone.display_value || "-"}</td>

            //         </tr>
            // `;
            if(!tl_obj[p.Milestone.display_value]){
              tl_obj[p.Milestone.display_value] = [p.Task_List_Name] 
            }else{
              tl_obj[p.Milestone.display_value].push(p.Task_List_Name)
            }
        });
        // return populatePhaseBarChart(PID,phase_list);

        for (let milestone in tl_obj){

          tlTbody.innerHTML+= `
          <tr>
              <th colspan="3" class="text-primary-emphasis small fw-medium px-5 bg-primary-subtle border border-primary-subtle  text-uppercase"><i class="me-2  fs-md-5 bi bi-signpost-split"></i> ${milestone || "-"} (${tl_obj[milestone].length || 0}) </th>
          </tr>`

          tl_obj[milestone].forEach(tl => {

            tlTbody.innerHTML+= `
            <tr>
                <td>${tl || "-"}</td>
                <td>Not Started</td>
                <td>Low</td>
            </tr>`
          })

          
        }

        console.log("tl_obj",tl_obj)


        setTimeout(() => {
          searchTaskLists()
        }, 2000);


    }).catch(err => {
        tlTbody.innerHTML = `<tr>
                        <td colspan="2"><p class="text-center text-muted lead my-3">No Task list for this project...</p></td>
                        
                    </tr>`;

        // phaseCount.innerText = "0";
        // populatePhaseBarChart(null, null)
        console.log(err)
    });

}

function populateTasks(PID, UID=null){

  // console.log("POPULATE TASK ENTERING. UID->", UID)

  let cri =  `(Project_Name.ID == ${PID})`

  let UID2 = ''
  if(UID){
    // UID = String(UID)
    // console.log(UID.toString())
    UID2 = UID.toString();

    console.log("uid2", UID2)

    cri =  `(Assignee.ID == ${UID2} && Project_Name.ID == ${PID})`
  }

  const tasksTbody = document.getElementById("tasks-tbody");
  const timeSheetList = document.getElementById("timesheet-list");
  // const filesList = document.getElementById("task-files");

    const milestoneConfig = {
        appName: "zenfirm",
        reportName: "Task_Report", 
        criteria : cri
    
    };

    // Fetch project data
    ZOHO.CREATOR.API.getAllRecords(milestoneConfig).then(function (res) {

        let phaseObj = {prepration:[], review:[], peerreview:[]}

        console.log("✅ Task:", res.data);

        document.getElementById("total-task-count").innerText = res.data.length;

        const allTasks = res.data;

        timeSheetList.innerHTML = '';
        // filesList.innerHTML = '';
        tasksTbody.innerHTML = '';

        let completedCount = "0";

        allTasks.forEach(t =>{

            if(t?.Logs?.length > 0){
              populateTimesheet(t.ID);
            }

            // if(t?.Files?.length > 0){
            //   // populateFiles(t.ID);
            // }
            

            tasksTbody.innerHTML+= `
              <tr class="cursor-pointer ${t?.Run_Time === "true" ? 'table-warning border-warning' : ' '}">

                  <td style="width:1%"><input class="form-check-input task-checkbox" type="checkbox" value="" data-id="${t.ID}"></td>
                  <td class="" >
                    <a class="taskName" style="text-decoration:none; color:inherit;" onclick="openTask('${t.ID}')">
                      ${t.Task_Name || "-"}
                    </a>
                  </td>
                  <td class="">
                    <div class="taskDescription">${t.Task_Description || "-"}</div>
                  </td>
                  <td class="text-center cursor-pointer">${returnNotes(t.Notes)}</td>
                  <td style="width:10%" class="text-center" ><span class="bg-status ${t.Task_Status.toLowerCase().replace(" ", "-") || "not-started"}">${t.Task_Status || "Not Started"}</span></td>
                  <td id="tsk-pri-${t.ID}" class="text-center" oncontextmenu="editTaskPriority('${t.ID}',event)"><span class="bg-status my-3 fw-bold ${t.Task_Priority.toLowerCase() || " "}">${t.Task_Priority.slice(0,3) || "-"}</span></td>
                  <td id="assignee-cell-${t.ID}" class="text-center assignee-cell cursor-pointe" oncontextmenu="editTaskOwner('${t.ID}',event)">${t.Assignee.display_value || "-"}</td>
                  
                  <td class="text-center cursor-pointer ">${returnTaskTimer(t.ID,t?.Assignee?.ID,t?.Task_Status, t?.Run_Time,t?.lastLogId )}</td>
                  <td class="text-center">${t.Total_Worked || "0h 0m"}</td>
                  <td class="text-center">${t?.Budgeted_Time || allocatedTime(t?.Start_Time, t?.End_Time) || "-"}</td>

                  <td class="text-center">${t.Task_Date || "-"}</td>
                  <td class="text-center">${t.Start_Time || "-"}</td>
                  <td class="text-center">${t.End_Time || "-"}</td>

              </tr>
            `;

            if(t?.Task_Name === "ITR Organizer" || t?.Task_Name === "	Follow up 1" || t?.Task_Name === "	Follow up 2" || t?.Task_Name === "ITR Ready for Preparer"){
              phaseObj.prepration.push(t?.Task_Name)
            }
        
        });



        document.getElementById("completed-task-count").innerText = completedCount;
        setTimeout(() => {
          searchTask();
        }, 100);


        //new phase view


        // document.getElementById("newphasesection").innerHTML =






    }).catch(err => {

      console.log(err)
      tasksTbody.innerHTML = `<tr>
                        <td colspan="13"><p class="text-center text-muted lead my-3">No Tasks for this project...</p></td>
                    </tr>`;
        timeSheetList.innerHTML = `<div class="card bg-white">
                        <p class="text-center text-muted lead my-3">No Timesheet for this project...</p>
                    </div>`;
        // filesList.innerHTML = `<div class="card bg-white">
        //     <p class="text-center text-muted lead my-3">No Files for this project...</p>
        // </div>`;
        document.getElementById("total-task-count").innerText = "0";
        document.getElementById("completed-task-count").innerText = "0";
        
    });

}

function populateITR(PID, group){

  const itrModule = document.getElementById("itr-module");
  
  if(!group){
    itrModule.innerHTML = `<p class="text-center lead">Service is not associated with this Project so Contact Admin</p>`
    return;
  }

  const itrConfig = {
        appName: "zenfirm",
        reportName: group, 
        criteria : `(Project.ID == ${PID})`
    
  };

  
   ZOHO.CREATOR.API.getAllRecords(itrConfig).then(function (res) {
        console.log("✅ ITR report:", USERID, res.data);
        if(res.code === 3000){

          incorpId = res.data[0].ID;

          if(res.data.length === 1){

            

            if(group === "ITR_Report"){

              itrModule.innerHTML = `<iframe style="height: 80vh; width: 100%;" class="itriframe"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/ITR/record-edit/ITR_Report/${res.data[0].ID}/j5CAPWKesd06OT3Zr9Yjf5vEE9tMVdNFdv21Cg84ZpBYkTmFd257YbKh4Agyzxpu18dGstmg3KJAAaDxPYQyfy2JdbHbBKdKT0zg?params=${USERID}" frameborder="0"></iframe>
              <button>Next</button>`;

              

            } else if( group === "Payroll_Employer_Setups_Report"){

               itrModule.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Payroll_Employer_Setup/record-edit/Payroll_Employer_Setups_Report/${res.data[0].ID}/ERdNd3zamwOB9uW0eDHEDeU8wj0S0yd618PHZ6OyhPPHvXhwM2SmhKUOrkugZKQ7MZvXFUTQHFByZXT1MdC2tkUZ52ju6Gs9QVfV?params=${USERID}" frameborder="0"></iframe>`;

            } else if( group === "All_Bookkeepings"){

               itrModule.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Bookkeeping/record-edit/All_Bookkeepings/${res.data[0].ID}/YzpgrKtznFF5GgZ7K4n2PO6Z3aA8WgnVXaYApD80wXkHgknDJWvFk9CWU4tnExjK4hVD2COMpSyPBrv5uBx9xUe60DEszqkaN8zs?params=${USERID}" frameborder="0"></iframe>`;

            } else if( group === "Sales_Tax_Report"){

               itrModule.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Sales_Tax/record-edit/Sales_Tax_Report/${res.data[0].ID}/vnTdHgpGE2uz61vw5BebjQhfTpna5vW7dYqXanGqkdSbSak8TrfW9Q1QKjFYjdzYBdv4QM1k9h4Hsd9hOQwkKKxKx76Eaj6k3VUO?params=${USERID}" frameborder="0"></iframe>`;

            } else if( group === "BTR_Report"){

               itrModule.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/BTR/record-edit/BTR_Report/${res.data[0].ID}/0t8jZVq4MDy5PKzBe4XyXZB2Pq8SsddfV5WnW5s2bEkXWyUvw8b3sCPwfJFPSj8Ea2P6Qa6WNDGK4D7RJydUTECXkaugvpOWh4F3?params=${USERID}" frameborder="0"></iframe>`;

            } else if( group === "Incorp_Report"){

               itrModule.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Incorp/record-edit/Incorp_Report/${res.data[0].ID}/5tqCe70eVFDpJDb7xq6OUnOgHnSj2jtQJCmkjFOHzFGqhh1yAF1uKNHC0MkPX1BhU21VbsKOejnsW3PXmbh5hXZ7TAZX4tWNYBQZ?params=${USERID}" frameborder="0"></iframe>`;
            }

          } else if(res.data.length > 1){
            itrModule.innerHTML = `<p>Multiple ITRs are associated with this Project so Contact Admin</p>`
          }else {
            itrModule.innerHTML = `<p>ITRs is not associated with this Project so Contact Admin</p>`
          }

        }

   }).catch(e=> {
        console.log(e)
        itrModule.innerHTML = `<p class="text-center mt-5">ITRs is not associated with this Project so Contact Admin</p>`
   })

}

function populateTimeline(PID){

  const timelineHistory = document.getElementById("timeline-history");

  timelineHistory.innerHTML = ''
  // timelineHistory.innerHTML = `<div class="timeline-vline" ></div>`

   const timelineConfig = {
        appName: "zenfirm",
        reportName: "Timeline_Report", 
        criteria : `(Project.ID == ${PID})`
    
  };

   ZOHO.CREATOR.API.getAllRecords(timelineConfig).then(function (res) {

        console.log("✅ Timeline report:", res.data);
        if(res.code === 3000){
          // res.data.forEach(t => {

          //   timelineHistory.innerHTML += `
          //   <div class="mb-4 ">
          //     <p class="mb-1">${t.Report_Status} - ${t.Comment}</p>
          //     <small class="text-muted">${t.Date_Time}</small>
          //   </div>`


          // })

          res.data.forEach(item => {

            const iconMap = {
              Created: "bi-plus-circle",
              Assigned: "bi-person-check",
              Completed: "bi-check-circle",
              Modified: "bi-pencil"
            };


            const timelineItem = document.createElement("div");
            timelineItem.className = "timeline-item";

            timelineItem.innerHTML = `
              <div class="timeline-icon">
                <i class="bi ${iconMap[item.Report_Status] || "bi-pencil"}"></i>
              </div>
              <div class="timeline-content">
                <span class="text-muted time">${item.Date_Time}</span>
                <p class="${item.highlight ? 'text-success' : ''}">
                  <span class="fw-semibold">${item.Comment}</span><br>
                  
                </p>
              </div>
            `;

            timelineHistory.appendChild(timelineItem);
          });
            
        }
        // ${item.description}

   }).catch(e=> {
        console.log(e)
        itrModule.innerHTML = `<p class="text-center mt-5">ITRs is not associated with this Project so Contact Admin</p>`
   })
}


function populateMeetings(PID){

    const upcommingMeetings = document.getElementById("upcomming-meetings");
    const completedMeegings = document.getElementById("completed-meetings");

    const meetingsCongig = {
        appName: "zenfirm",
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

function populateTeam(team, id){

    document.getElementById("taskMemberFilter").innerHTML = `<option value="${USERID}">My Tasks</option>
      <option value="${null}">All Tasks</option>`

    const teamList = document.getElementById("team-list");
    

  if(!team){
    teamList.innerHTML = `<p class="lead text-center">No Team Members</p>`;
    return;
  }

  console.log(team, id)

  const btnDiv = document.getElementById("add-member-button");

  if(id){

      btnDiv.innerHTML = `<button class="btn btn-primary btn-sm my-auto " onclick="openOffcanvas('${id}')" id="add-meeting-button"><i class="bi bi-plus-lg"></i> Member</button>`
    
  }

    // console.log("team",team);



    if(!ALL_ORG_EMPLOYEES){
      console.warn("ALL ORG EMP ARRAY IS EMPTY!");
      fetchAllOrgEmployees()
    }

    teamList.innerHTML = '';

//Shashidar Kemturu Individual Tax Filing 2025
    team?.forEach(t=>{

     const emp_obj =  ALL_ORG_EMPLOYEES?.find(e => e?.ID === t?.ID);
    //  console.log("emp_obj", emp_obj) //https://randomuser.me/api/portraits/women/44.jpg

     let DP ='https://contacts.zoho.in/file?ID=60038379214&fs=thumb';
     if(emp_obj?.Profile_Photo){
      DP = `https://zenworkr.zohocreatorportal.com${emp_obj.Profile_Photo}`;
     } 


      teamList.innerHTML += `
      <div class="col-6 col-md-3">
          <div class="bg-white text-center rounded p-3 my-card">
              <img src="${DP}" class="rounded-circle team-profile"  alt="Profile">
              <h6 class="text-center mt-2 mb-1">${t.display_value}</h6>
              <small class="text-muted  fw-light">${emp_obj?.Role?.display_value || "Team Member"}</small>
              <p class="text-center text-muted">${emp_obj?.Email || t.display_value.toLowerCase() + "@zentegra.com"}</p>
              <span class="p-2 rounded small mt-3" style="background-color:#e5ebf8;"><i class="bi bi-check-circle-fill text-primary"></i> Available</span>
          </div>
      </div>`;

      document.getElementById("taskMemberFilter").innerHTML += `<option value="${t.ID}">${t.display_value}</option>`
        
    });
}

function populateTimesheet(TID){
    
  const logsConfig = {
    appName: "zenfirm",
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

function generateEmployeeList(apiData) {

    const employeeMap = {};

    apiData.forEach(record => {

        const employeeName = record.Employee?.display_value;
        const logHours = record.Log_Hours;

        // Skip invalid records
        if (!employeeName || !logHours) {
            return;
        }

        // Convert HH.MM to total minutes
        const [hours, minutes = 0] = String(logHours).split(".").map(Number);

        const totalMinutes = (hours * 60) + minutes;

        // Create employee if not already present
        if (!employeeMap[employeeName]) {
            employeeMap[employeeName] = {
                name: employeeName,
                totalMinutes: 0
            };
        }

        // Add minutes
        employeeMap[employeeName].totalMinutes += totalMinutes;
    });


    // Convert object to employee array
    return Object.values(employeeMap).map(employee => {

        const hours = Math.floor(employee.totalMinutes / 60);
        const minutes = employee.totalMinutes % 60;

        return {
            name: employee.name,
            totalMinutes: employee.totalMinutes,
            hours: `${hours}.${String(minutes).padStart(2, "0")}`
        };
    });
}


async function populateTaskKpi(PID) {

    const kpiContainer = document.getElementById("kpiContainer");

    // Clear existing cards
    kpiContainer.innerHTML = "";

    const pageSize = 200;
    let page = 1;
    let allLogs = [];

    try {

        while (true) {

            console.log(`📄 Fetching logs page ${page}...`);

            const logsConfig = {
                appName: "zenfirm",
                reportName: "Copy_of_All_Logs",
                criteria: `(Project == ${PID} )`,
                page: page,
                pageSize: pageSize 
            };
            //&& Employee.Name!="Basha A"

            const response = await ZOHO.CREATOR.API.getAllRecords(logsConfig);

            if (response.code !== 3000) {
                console.error("❌ Error fetching logs:", response);
                break;
            }

            const pageData = response.data || [];

            console.log(
                `✅ Page ${page}: ${pageData.length} records`
            );

            // Add this page's records to the main array
            allLogs.push(...pageData);

            // If fewer than 200 records came back,
            // this is the last page
            if (pageData.length < pageSize) {
                break;
            }

            // Otherwise fetch next page
            page++;
        }

        console.log("================================");
        console.log("✅ TOTAL LOG RECORDS:", allLogs.length);
        console.log("================================");

        // Generate employee-wise hours ONLY after
        // all pages have been fetched
        const employees = generateEmployeeList(allLogs);

        console.log("👨‍💼 EMPLOYEE KPI DATA:", employees);

        // Project total = sum of every employee's minutes, shown as H.MM
        const projectMinutes = employees.reduce((sum, employee) => sum + employee.totalMinutes, 0);
        const projectHours = `${Math.floor(projectMinutes / 60)}.${String(projectMinutes % 60).padStart(2, "0")}`;

        kpiContainer.insertAdjacentHTML("beforeend", `
                <div class="kpi-card">

                    <div class="d-flex align-items-center gap-2">

                        <div class="employee-icon">
                            <i class="bi bi-clock-history"></i>
                        </div>

                        <div class="flex-grow-1 min-width-0">

                            <div class="employee-label">
                                Project
                            </div>

                            <div class="employee-name" title="Total Logged Hours">
                                Total Logged
                            </div>

                        </div>

                    </div>

                    <div class="d-flex align-items-end mt-2">

                        <div class="hours">
                            ${projectHours}
                        </div>

                        <div class="hours-label ms-1 mb-1">
                            hrs
                        </div>

                    </div>

                </div>
            `);


        // Render KPI cards
        employees.forEach(employee => {

            const card = `
                <div class="kpi-card">

                    <div class="d-flex align-items-center gap-2">

                        <div class="employee-icon">
                            <i class="bi bi-person-fill"></i>
                        </div>

                        <div class="flex-grow-1 min-width-0">

                            <div class="employee-label">
                                Employee
                            </div>

                            <div 
                                class="employee-name" 
                                title="${employee.name}"
                            >
                                ${employee.name}
                            </div>

                        </div>

                    </div>

                    <div class="d-flex align-items-end mt-2">

                        <div class="hours">
                            ${employee.hours}
                        </div>

                        <div class="hours-label ms-1 mb-1">
                            hrs
                        </div>

                    </div>

                </div>
            `;

            kpiContainer.insertAdjacentHTML("beforeend", card);

        });

    } catch (error) {

        console.error("❌ Failed to fetch project logs:", error);

    }
}





async function populateFiles(TID){

  const logsConfig = {
    appName: "zenfirm",
    reportName: "All_Files",
    criteria : `(Task.ID == ${TID})`
    
  };


ZOHO.CREATOR.API.getAllRecords(logsConfig).then(function (res) {

  if (res.code === 3000) {
            console.log("✅ Files report:", res.data);

            const taskFiles = res.data;

          // const filesAcordion = document.getElementById("task-files");

          let html =`
          
          <div class="accordion-item border-start-0 border-end-0 accordion-flush rounded-0">
            <h2 class="accordion-header" onclick="filesTableView('${TID}')">
              <button class="accordion-button collapsed py-3 pe-2" type="button" data-bs-toggle="collapse" data-bs-target="#${TID}" aria-expanded="true" aria-controls="${TID}">
                <i class="bi bi-folder"></i> <small class="ms-2 mb-0">${taskFiles[0].Task.display_value}</small>
              </button>
            </h2>
            <div id="${TID}" class="accordion-collapse collapse">
          <div class="accordion-body">
          `

          //  let html  = `<h6 class="mt-2"><i class="bi bi-clock-history"></i> ${taskFiles[0].Task.display_value}</h6>`;

            html += `<ul class="list-group list-group-flush">`;

          

            taskFiles.forEach(f=>{

                const [trash, filename2] = f.File_field.split("=");
                const fileName = filename2.split('_').slice(1).join('_');

                // const [kuppai, url] = f.File_field.split('All_Files/');
                // const [fileIdda, kuppa] = url.split('/File_field/');

                // console.log("All_Files/",fileIdda)

                // const previewUrl = `https://pdf-preview-html.vercel.app/?url=https://creator.zoho.com/publishapi/v2/zentegra/zenfirm/report/All_Files/${fileIdda}/File_field/download?privatelink=KT5fdg81hVaR9xhd5M8VtmNsTQT7Q8OGUuZUqUHS1Z8KCNJ69WnTBRREdGdw6fUrNNTmnq2AbStZ0Xwqq0VbT8RJ4XkWeAyQTKjK`

                html +=`

                <li class="list-group-item list-group-item-action text-truncate"><i class="bi bi-file-earmark me-1"></i> <small>${fileName}</small></li>
                
                `
            });

            html += `</ul></div></div></div>`;

            // filesAcordion.innerHTML += html;
          } 
});    
  
}




function populateFilesToClients(PID){
  const filesAcordion = document.getElementById("filestoClients");
        filesAcordion.innerHTML = ''

  const logsConfig = {
    appName: "zenfirm",
    reportName: "All_Files",
    criteria : `(Project.ID == ${PID} && File_Type == "Files To Clients")`
    
  };
  ZOHO.CREATOR.API.getAllRecords(logsConfig).then(function (res) {
  if (res.code === 3000) {
        console.log("✅FILES TO CLIENT Files report:", res.data);
        const taskFiles = res.data;
        
        let html = `<ul class="list-group list-group-flush">`;
          taskFiles.forEach(f=>{
              const [trash, filename2] = f.File_field.split("=");
              const fileName = filename2.split('_').slice(1).join('_');
              html +=`<li class="list-group-item list-group-item-action text-truncate"><i class="bi bi-file-earmark me-1"></i> <small>${fileName}</small></li>`
          });
        html += `</ul>`;
        filesAcordion.innerHTML = html;
      } 
  }).catch(e=> {
    console.log(e)
    filesAcordion.innerHTML = ''
    filesAcordion.innerHTML = `<p class="text-center"> Empty Folder</p>`
  })
  
}

function populateFilesFromClients(PID){
  const filesAcordion = document.getElementById("filesfromClients");
        filesAcordion.innerHTML = ''

  const logsConfig = {
    appName: "zenfirm",
    reportName: "All_Files",
    criteria : `(Project.ID == ${PID} && File_Type == "Files From Clients")`
  };
  ZOHO.CREATOR.API.getAllRecords(logsConfig).then(function (res) {
    if (res.code === 3000) {
        console.log("✅FILES TO CLIENT Files report:", res.data);
        const taskFiles = res.data;
        
        let html = `<ul class="list-group list-group-flush">`;
          taskFiles.forEach(f=>{
              const [trash, filename2] = f.File_field.split("=");
              const fileName = filename2.split('_').slice(1).join('_');
              html +=`<li class="list-group-item list-group-item-action text-truncate"><i class="bi bi-file-earmark me-1"></i> <small>${fileName}</small></li>`
          });
        html += `</ul>`;
        filesAcordion.innerHTML = html;
      } 
  }).catch(e=> {
    console.log(e)
    filesAcordion.innerHTML = ''
    filesAcordion.innerHTML = `<p class="text-center"> Empty Folder</p>`
  })
  
}

function populateWorkingFiles(PID){
  const filesAcordion = document.getElementById("workingFiles");
        filesAcordion.innerHTML = ''

  const logsConfig = {
    appName: "zenfirm",
    reportName: "All_Files",
    criteria : `(Project.ID == ${PID} && File_Type == "Working Files")`
  };

  ZOHO.CREATOR.API.getAllRecords(logsConfig).then(function (res) {
    if (res.code === 3000) {
        console.log("✅FILES TO CLIENT Files report:", res.data);
        const taskFiles = res.data;
        
        let html = `<ul class="list-group list-group-flush">`;
          taskFiles.forEach(f=>{
              const [trash, filename2] = f.File_field.split("=");
              const fileName = filename2.split('_').slice(1).join('_');
              html +=`<li class="list-group-item list-group-item-action text-truncate"><i class="bi bi-file-earmark me-1"></i> <small>${fileName}</small></li>`
          });
        html += `</ul>`;
        filesAcordion.innerHTML = html;
      } 
  }).catch(e=> {
    console.log(e)
    filesAcordion.innerHTML = ''
    filesAcordion.innerHTML = `<p class="text-center"> Empty Folder</p>`
  })
  
}





function populateExpenses(PID){

  const expensesTbody = document.getElementById("expense-body");
    

  const config = {
    appName: "zenfirm",
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
    appName: "zenfirm",
    reportName: "All_Project_Budgets",
    criteria : `(Project_Name.ID == ${PID})`
    
  };

  ZOHO.CREATOR.API.getAllRecords(config).then(function (res) {

      if (res.code === 3000) {
        console.log("✅ Budget report:", res.data);
        if(res.data.length === 1){

            budgetTbody.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Project_Budgets/record-edit/All_Project_Budgets/${res.data[0].ID}/2jXgnYsh7w3aq0Q1TNpwdNgJwuzKSrAthrFwkA4J8sM16Tdd4pRpKGjabmw7fSPNb3rWO2gHMAJjT8VJ3sgDQaVZGJCJF7SCmRYy?params=${USERID}" frameborder="0"></iframe>`;


          } else if(res.data.length > 1){
            budgetTbody.innerHTML = `<p class="text-center">Multiple Budgets are associated with this Project so Contact Admin</p>`
          }else {
            budgetTbody.innerHTML = `<p class="text-center">Budget is not associated with this Project so Contact Admin</p>`
          }
        
      } else {
        return;
      }

  }).catch(err =>{
    budgetTbody.innerHTML = `<tr>
        <td colspan="9"><p class="text-center text-muted lead my-3">No Budget for this project...</p></td>
        
    </tr>`;
  })

}

function fetchAllReportiees(){

    const employeeConfig = {
      appName: "zenfirm",
      reportName: "My_Team_Employees",
    };
    //asign-emp-dropdown
    
    ZOHO.CREATOR.API.getAllRecords(employeeConfig).then(function (employeeResponse) {
        console.log("✅ALL Reportees Response:", employeeResponse.data);

        ALL_REPORTEES = employeeResponse.data;
        if(employeeResponse.data.length > 1){
          document.getElementById("emp_input_div").classList.remove("d-none");
          document.getElementById("today-report-btn").classList.remove("d-none");
          searchEmployee(ALL_REPORTEES);
          todayReport(TODAY);
          sessionStorage.setItem("ALL_REPORTEE", JSON.stringify(employeeResponse.data))
        } 
    });
}

function fetchAllOrgEmployees(){
  let allOrgEmployee ={
    appName: "zenfirm",
    reportName: "All_Employee",
    criteria: `(Organization == ${ORG})`,
  }
  ZOHO.CREATOR.API.getAllRecords(allOrgEmployee).then(function (res) {
    console.log("✅Employee Response:", res)
    ALL_ORG_EMPLOYEES = res.data;
    sessionStorage.setItem("ALL_EMP", JSON.stringify(res.data))

    // setTimeout(() => {
    //     fetchAllProjects()
    // }, 1000);
    
  })
   if(localStorage.getItem("ALL_EMP")){
      localStorage.removeItem("ALL_EMP")
   }
}