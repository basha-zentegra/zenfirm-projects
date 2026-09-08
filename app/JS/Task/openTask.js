let selectedTask = ''

const taskCanvasBtn = document.getElementById("canvasbtnTask");
const taskLable = document.getElementById("offcanvasTaskLabel");
const taskContent = document.getElementById("offcanvasTasksContent");
const taskLogs = document.getElementById("offcanvasTasksLogs");
const tasklogstbody = document.getElementById("tasklogstbody");
const taskActionSection = document.getElementById("offcanvasTaskActionSection");
const closeTask = document.getElementById("offcanvas-task-cls-btn");
const addmanuallogicon = document.getElementById("addmanuallogicon");
// tasklogstbody

function openTask(TID){

    // console.log("OPEN TASK -><-", TID)

    taskContent.innerHTML = `<div class="text-center">
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div> Loading...
    </div>`

    tasklogstbody.innerHTML = `
    <tr id="nologsfound"><td colspan="4" class="text-center"><div class="text-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div></td> </tr>`
 
    taskCanvasBtn.click();
    

    var config = {
        appName : "zenfirm",
        reportName : "Task_Report", 
        id : TID
    } 

    selectedTask = TID;


    ZOHO.CREATOR.API.getRecordById(config).then(function(response){

        console.log(response.data);
        const taskData = response.data;
        console.log(taskData);
        taskLable.innerText = taskData.Task_Name;
        taskContent.innerHTML = /*html*/ `

     

        <section class="card mb-3 d-none" style="overflow-x: hidden; width: 80vw; position:absolute; left:-600px; z-index:2500;" id="itreventpopup">
            Faaaaaaaaaaaaaaaahh
            
        </section>


        <div class="card">
        
        <div class="card-body">


                                           
        <div class="py-2  mb-2">
            <h5 class="text-primary">Task Details</h5>
        </div>
            <table class="table table-borderless" style="table-layout: fixed;">
                <tbody>
                <tr>
                    <th style="width: 7%;"><i class="bi bi-card-heading"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Project</th>
                    <td style="width: 58%;">${taskData.Project_Name.display_value || "-"}</td>
                </tr>

                <tr>
                    <th style="width: 7%;"><i class="bi bi-signpost"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Phase</th>
                    <td style="width: 58%;">${taskData?.Milestone_Name?.display_value || "-"}</td>
                </tr>

                <tr>
                    <th style="width: 7%;"><i class="bi bi-chat-left"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Description</th>
                    <td style="width: 58%;">
                        <span id="crtDesc-266830000001194162">${taskData?.Task_Description || "-"}</span>
                        <div class="input-group d-none" id="descInput-266830000001194162">
                            <input type="text" class="form-control" id="editDesc-266830000001194162" value="No Description">
                            <span class="input-group-text bg-primary" id="saveDesc-266830000001194162"><i class="bi bi-check text-white"></i></span>
                        </div>
                        
                    </td>
                </tr>

                <tr>
                    <th style="width: 7%;"><i class="bi bi-record-circle"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Status</th>
                    <td id="taskStatusTD" style="width: 58%;">
                        <span class="bg-status ${taskData?.Task_Status.toLowerCase().replace(" ", "-") || "not-started"}">${taskData?.Task_Status || "Not Started"}</span>

                    </td>
                </tr>
                
                <tr>
                    <th style="width: 7%;"><i class="bi bi-calendar-check"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Task Date</th>
                    <td id="startDate" style="width: 58%;">${taskData?.Task_Date || "-"} </td>
                </tr>

                <tr>
                    <th style="width: 7%;"><i class="bi bi-clock"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Time</th>
                    <td id="endDate" style="width: 58%;">
                        <span id="crtTime-266830000001194162">${taskData?.Start_Time + " - " + taskData?.End_Time} </span>

                        <div class="input-group d-none" id="timeInput-266830000001194162">
                            <input type="text" class="form-control" placeholder="HH:MM" id="editSTime-266830000001194162" pattern="^([01]d|2[0-3]):([0-5]d)$" value="18:27">
                            
                            <input type="text" class="form-control" placeholder="HH:MM" id="editETime-266830000001194162" value="19:27">
                            <span class="input-group-text bg-primary" id="saveTime-266830000001194162"><i class="bi bi-check text-white"></i></span>
                        </div>
                        
                        
                    </td>
                </tr>
                
                <tr>
                    <th style="width: 7%;"><i class="bi bi-hourglass-split"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Allocated Time</th>
                    <td id="allocatedTime" style="width: 58%;">${taskData?.Budgeted_Time || allocatedTime(taskData?.Start_Time, taskData?.End_Time) || "-" }</td>
                </tr>
                
                <tr>
                    <th style="width: 7%;"><i class="bi bi-stopwatch"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Total Time Worked</th>
                    <td id="totalWorkedTime" style="width: 58%;">${taskData?.Total_Worked || "-"}</td>
                </tr>

                <tr>
                    <th style="width: 7%;"><i class="bi bi-flag"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Priority</th>
                    <td style="width: 58%;" id="prio-td-266830000001194162">
                    <span  class="bg-status my-3 fw-bold cursor-pointer ${taskData?.Task_Priority.toLowerCase() || "-"}">
                        ${taskData?.Task_Priority || "-"}
                    </span>
                    </td>
                </tr>

                <tr>
                    <th style="width: 7%;"><i class="bi bi-person"></i></th>
                    <th class="fw-semibold" style="color:#3e4043; width: 35%;">Assignee</th>
                    <td style="width: 58%;">${taskData?.Assignee?.display_value || "-"}</td>
                </tr>

            </tbody>
            </table>

            <section id="rejected-msg-space">

            </section>

            <section id="chips">

                <div id="otchip" class="chip ${taskData?.Overtime === "true" ? ' ' : 'd-none'}">
                    <div class="avatar">OT</div>
                    Over Time
                </div>

            </section>
            
            
        </div>

        </div>

        <br><br>
        <h5 class="text-primary">Notes <i onclick="addNotesOnTask('${TID}')" class="bi bi-plus-square-fill text-primary ms-3"></i></h5>
        
        `

        if(taskData?.Notes.length > 0){
            const allNotes = taskData?.Notes;

            const ul = document.createElement("ul")
            ul.className = "list-group";



            allNotes.forEach(element => {
                const li = document.createElement("li");
                li.className = "list-group-item"
                li.textContent = element.display_value;

                ul.appendChild(li)
                
            });
            taskContent.appendChild(ul);
        }else{
            
        }

        if(taskData?.Logs.length > 0){
            tasklogstbody.innerHTML = '';
            const allLogs = taskData?.Logs;

           allLogs.forEach(element=> {
                const [date, start, end, worked, newStart, newEnd, newWorked] = element.display_value.split(",");
                tasklogstbody.innerHTML += `
                    <tr class="logRow">
                        <td>${date}</td>
                        <td>${newStart}</td>
                        <td>${newEnd}</td>
                        <td>${newWorked}</td>
                    </tr>
                `

           })
        } else{
            tasklogstbody.innerHTML = `<tr id="nologsfound"><td colspan="4" class="text-center">No Logs Found.</td> </tr>`
        }



        //ACTION BUTTON FOR THE TASK
        if(taskData?.Task_Status !== "Completed" && taskData?.Task_Status !== "Approved" ){


            if(taskData?.Assignee?.ID === USERID){
                taskActionSection.innerHTML = `
                    <button onclick="completeTask('${TID}')" class="btn btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Complete">
                        <i class="bi bi-check-square me-2 fs-5 text-success"></i>
                    </button>

                    <div class="dropdown me-5" data-bs-toggle="tooltip" data-bs-title="Delete">
                        <button class="btn task-action-btns dropdown-toggle btn-sm carot" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <!-- <span class="tooltip-task-action">Delete</span> -->
                            <i class="bi bi-trash text-danger fs-5"></i>
                        </button>
                        <ul class="dropdown-menu text-center">
                        <li>Delete Task</li>
                        <li>
                            <button class=" btn btn-danger btn-sm" onclick="deleteTask('${TID}')">
                                Delete
                            </button>
                        </li>
                        </ul>
                    </div>`

                    addmanuallogicon.innerHTML = `<i  onclick="addManualLogs()" class="bi bi-plus-square-fill text-primary ms-3"></i>`
            } else{
                taskActionSection.innerHTML = ""
                addmanuallogicon.innerHTML = "";
            }

                

        } else{
            taskActionSection.innerHTML = ""
            addmanuallogicon.innerHTML = "";
        }

        // REJECT OR APPROVE
        if(taskData?.Task_Status === "Completed" && taskData?.Assignee?.ID !== USERID){

             taskActionSection.innerHTML = `
                <button onclick="approveTask('${taskData.ID}')" class="btn btn-sm text-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Approve">
                    Approve
                </button>
                
                <div class="dropdown me-5" data-bs-toggle="tooltip" data-bs-title="Reject">
                    <button class="btn task-action-btns dropdown-toggle btn-sm text-danger carot" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        
                        Reject
                    </button>
                    <ul class="dropdown-menu text-center">
                    <li><input id="rejection-input" type="text" class="form-control" placeholder="Reason"></li>
                    <li>
                        <button class=" btn btn-danger btn-sm" onclick="rejectTask('${taskData.ID}')">
                            Reject
                        </button>
                    </li>
                    </ul>
                </div>`

        }else{

        }

        if(taskData?.Rejection_Message){
            document.getElementById("rejected-msg-space").innerHTML = `<div class="p-2 rounded-3" style="background-color: #fad9d8;">${taskData?.Rejection_Message}</div>`
        } else{
            document.getElementById("rejected-msg-space").innerHTML = ''
        }


        //COMPLETED OR APPROVED TASK
        // if(taskData?.Task_Status === "Completed" || taskData?.Task_Status === "Approved"){

        //     document.getElementById("addmanuallogicon").classList.add("d-none");
        // }else{
        //     document.getElementById("addmanuallogicon").classList.remove("d-none");

        // }



        // setTimeout(() => {

        //     openPopup()
            
        // }, 3000);

    });



    setTimeout(() => {
        const logRow = document.querySelectorAll(".logRow");
        console.log(logRow.length);
    }, 3000);

    
}

function addNotesOnTask(TID){
    if(document.getElementById("addnotesontaskdiv")){
        document.getElementById("addnotesontaskdiv").remove()
    }
    const textArea = `
        <div class="mb-3" id="addnotesontaskdiv">
            <textarea class="form-control" id="addnoteontasktextarea" placeholder="Add Notes..." rows="3"></textarea>
            <button id="addnotebtn" class="btn btn-primary btn-sm mt-1">Add</button>
        </div>`
    taskContent.innerHTML += textArea;
    document.getElementById("addnotebtn").addEventListener("click", function(){
        const noteContent = document.getElementById("addnoteontasktextarea").value;
        if(!noteContent){
            return;
        }
        var config = {
             appName :APP_NAME,
             formName : "Notes",
             data : {
                data : {
                    Note: noteContent,
                    Task: TID,
                    Project: selecteProject,
                    Added_by: USERID
                }
             }
        }
        ZOHO.CREATOR.API.addRecord(config).then(function(response){
            console.log(response, config);
            if(response.code == 3000){
                console.log("Record added successfully");
                document.getElementById("addnotesontaskdiv").remove()

                taskContent.innerHTML += `<ul class="list-group"><li class="list-group-item">${noteContent}</li></ul>`

            }
        }).catch(e=> console.log(e))
    })
}


function allocatedTime(st, et) {


    if(st === "-" || et === "-"){
        return "-";
    }

    if(!st || !et){
        return "-";
    }

  function toMinutes(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes, seconds] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  const startMinutes = toMinutes(st);
  const endMinutes = toMinutes(et);

  let diffMinutes = endMinutes - startMinutes;
  if (diffMinutes < 0) diffMinutes += 24 * 60; // handles crossing midnight

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
}




function completeTask(TID){

    console.log("COMPLETE TASKK")

    console.log(ORG)
    if(selected_project_group === "ITR_Report" || selected_project_group === "BTR_Report"){


        console.log("Terminating......")

        openPopup();
        console.log("Terminating......")
        return
    }

    const logRow = document.querySelectorAll(".logRow");
    console.log(logRow);

    if(logRow.length === 0){
        // alert("No Logs in this tasks..")
        const userChoice = confirm("No Logs in this tasks..\nDo you want to continue?");
        if(!userChoice){
            return;

        }
    }
    

    if(sessionStorage.getItem("TID")){
        console.log("This Task is running...")
        const LocalTID = sessionStorage.getItem("TID");
        document.getElementById(`stp-btn-${LocalTID}`).click();
    }

        const config = {
            appName: "zenfirm",
            reportName: "Task_Report",
            id: TID,
            data: {
                data: {
                    Task_Status: "Completed"
                }
            }
        };

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
            if (response.code == 3000) {
                // sessionStorage.removeItem("LL");
                // sessionStorage.removeItem("TID");
                populateTasks(selecteProject, USERID)
                console.log("TASK COMPLETED!!");
                taskActionSection.innerHTML = ""
                addmanuallogicon.innerHTML = "";
                document.getElementById("taskStatusTD").innerHTML = `<span class="bg-status completed">Completed</span>`
                
            }
        });
    
}


function rejectTask(TID){

    const rejInp = document.getElementById("rejection-input").value.trim();

    if(!rejInp){
        alert("Add Rejection Message")
    }

        const config = {
            appName: "zenfirm",
            reportName: "Task_Report",
            id: TID,
            data: {
                data: {
                    Task_Status: "Rejected",
                    Rejection_Message: rejInp
                }
            }
        };

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
            if (response.code == 3000) {

                populateTasks(selecteProject, null)
                console.log("TASK REJECTED!!");
                taskActionSection.innerHTML = ""

                document.getElementById("taskStatusTD").innerHTML = `<span class="bg-status rejected">Rejected</span>`

                document.getElementById("rejection-input").value = '';
                
            }
        });

}

function approveTask(TID){


    const config = {
        appName: "zenfirm",
        reportName: "Task_Report",
        id: TID,
        data: {
            data: {
                Task_Status: "Approved",
            }
        }
    };

    ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
        if (response.code == 3000) {

            populateTasks(selecteProject, null)
            console.log("TASK APPROVED!!");
            taskActionSection.innerHTML = ""

            document.getElementById("taskStatusTD").innerHTML = `<span class="bg-status approved">Approved</span>`
            
        }
    });

}




function deleteTask(TID){

    var config = { 
        reportName : "Task_Report", 
        criteria : `ID == ${TID}`
    }
    ZOHO.CREATOR.API.deleteRecord(config).then(function(response){
        console.log("Record has been deleted", response);
        
        if(response.code === 3000){
            populateTasks(selecteProject, null)
            closeTask.click()
        }
    }).catch(e => console.log(e));

}

function openPopup(){
    // closeTask.click()

    console.log("selected_project_group",selected_project_group)

    const itreventpopup = document.getElementById("itreventpopup");


    if(!selected_project_group){
        // itreventpopup.innerHTML = `<p class="text-center lead">Service is not associated with this Project so Contact Admin</p>`
        return;
    }

    const itrConfig = {
        appName: "zenfirm",
        reportName: selected_project_group, 
        criteria : `(Project.ID == ${selecteProject})`
    
    };




    ZOHO.CREATOR.API.getAllRecords(itrConfig).then(function (res) {
        console.log("✅ ITR report:", USERID, res.data);
        if(res.code === 3000){
            if(res.data.length === 1){

            if(selected_project_group === "ITR_Report"){

                itreventpopup.classList.remove("d-none")

              itreventpopup.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/ITR/record-edit/ITR_Report/${res.data[0].ID}/j5CAPWKesd06OT3Zr9Yjf5vEE9tMVdNFdv21Cg84ZpBYkTmFd257YbKh4Agyzxpu18dGstmg3KJAAaDxPYQyfy2JdbHbBKdKT0zg?params=${USERID}&Hide_Fields=true" frameborder="0"></iframe>`;

              
            
            } else if( selected_project_group === "BTR_Report"){

                itreventpopup.classList.remove("d-none")


               itreventpopup.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/BTR/record-edit/BTR_Report/${res.data[0].ID}/0t8jZVq4MDy5PKzBe4XyXZB2Pq8SsddfV5WnW5s2bEkXWyUvw8b3sCPwfJFPSj8Ea2P6Qa6WNDGK4D7RJydUTECXkaugvpOWh4F3?params=${USERID}&Hide_Fields=true" frameborder="0"></iframe>`;

            } else if( selected_project_group === "Incorp_Report"){

                // itreventpopup.classList.remove("d-none")


               itreventpopup.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Incorp/record-edit/Incorp_Report/${res.data[0].ID}/5tqCe70eVFDpJDb7xq6OUnOgHnSj2jtQJCmkjFOHzFGqhh1yAF1uKNHC0MkPX1BhU21VbsKOejnsW3PXmbh5hXZ7TAZX4tWNYBQZ?params=${USERID}" frameborder="0"></iframe>`;

            }

          } else if(res.data.length > 1){
            itreventpopup.innerHTML = `<p>Multiple ITRs are associated with this Project so Contact Admin</p>`
          }else {
            itreventpopup.innerHTML = `<p>ITRs is not associated with this Project so Contact Admin</p>`
          }

        }

   }).catch(e=> {
        console.log(e)
        itreventpopup.innerHTML = `<p class="text-center mt-5">ITRs is not associated with this Project so Contact Admin</p>`
   })

        

}


function addManualLogs(){

    if (document.getElementById("manualRow")) return;

    tasklogstbody.innerHTML += `
        <tr id="manualRow">
            <td><input type="date" class="form-control" id="manualDate"></td>
            <td><input type="time" class="form-control" name="" id="manualST"></td>
            <td><input type="time" class="form-control" name="" id="manualET"></td>
            <td>
                <button  class="btn btn-sm text-primary" onclick="submitManulLog()" >Submit</button>
            </td>
        </tr>
    `
    document.getElementById("manualDate").max = new Date().toISOString().split("T")[0];
    document.getElementById("manualDate").value = new Date().toISOString().split('T')[0];

}

function submitManulLog(){

    const date = document.getElementById("manualDate").value;
    const st = document.getElementById("manualST").value;
    const et = document.getElementById("manualET").value;

    if(!date || !st || !et){
        alert("Date, Start and End Time are Mandatory")
        return;
    }

    const now = new Date();

    const selectedStart = new Date(`${date}T${st}`);
    const selectedEnd = new Date(`${date}T${et}`);

    if (selectedStart > now || selectedEnd > now) {
        alert("Future date or time is not allowed.");
        return;
    }

    if (selectedEnd <= selectedStart) {
        alert("End time must be greater than Start time.");
        return;
    }

    if (isOverlapping(date, selectedStart, selectedEnd)) {
        alert("Time overlaps with an existing log.");
        return;
    }

    const formattedDate = formatDateToMDY(date);
    const worked = calculateWorkedTime(st,et)

    console.log("Date", date)
    console.log("ST", st)
    console.log("ET", et)
    console.log("REAL TID VALUE:", selectedTask);

    var config = {
        formName : "Logs",
        data : {
            data: {
                Task:selectedTask,
                Date_field:formattedDate,
                Work_Started:st,
                Work_Ended:et,
                Hours_Worked:worked
            }
        }
    }

    ZOHO.CREATOR.API.addRecord(config).then(function(response){
        
        if(response.code == 3000){
            console.log("Record added successfully", response.data);
            document.getElementById("manualRow").remove()

            if(document.getElementById("nologsfound")){
                document.getElementById("nologsfound").remove();
            }

            tasklogstbody.innerHTML +=`
                <tr class="logRow">
                    <td>${formattedDate}</td>
                    <td>${st}</td>
                    <td>${et}</td>
                    <td>
                        ${worked}
                    </td>
                </tr>
            `
            document.getElementById("totalWorkedTime").innerText = calculateTotalLogs();

            isOverTime();

        }else{
            console.log(response)
        }
    });
}

function formatDateToMDY(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${month}-${day}-${year}`;
}

function calculateWorkedTime(st, et) {

    // Split hours and minutes
    const [sh, sm] = st.split(":").map(Number);
    const [eh, em] = et.split(":").map(Number);

    // Convert both times to total minutes
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    // Handle overnight case (e.g., 22:00 → 01:00)
    let diff = endMinutes - startMinutes;
    if (diff < 0) {
        diff += 24 * 60;
    }

    // Convert back to hours and minutes
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}h ${minutes}m`;
}


function isOverlapping(date, newStart, newEnd) {

    const rows = tasklogstbody.querySelectorAll("tr");

    for (let row of rows) {

        // Skip manual input row
        if (row.id === "manualRow" || row.id === "nologsfound") continue;

        const rowDate = row.children[0]?.innerText.trim();
        const rowStart = row.children[1]?.innerText.trim();
        const rowEnd = row.children[2]?.innerText.trim();

        if (!rowDate || !rowStart || !rowEnd) continue;

        // Only check same date
        if (rowDate !== formatDateToMDY(date)) continue;

        const existingStart = new Date(`${date}T${rowStart}`);
        const existingEnd = new Date(`${date}T${rowEnd}`);

        if (newStart < existingEnd && newEnd > existingStart) {
            return true; // overlap found
        }
    }

    return false;
}

function calculateTotalLogs(){

    const rows = tasklogstbody.querySelectorAll("tr");

    let totalMinutes = 0;

    for (let row of rows){

        const workedCell = row.children[3];
        if (!workedCell) continue;

        const workedText = workedCell.innerText.trim();

        if (workedText === "" || workedText === "0h 0m") continue;

        // Example: "3h 30m"
        const match = workedText.match(/(\d+)h\s+(\d+)m/);
        if (!match) continue;

        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);

        totalMinutes += (hours * 60) + minutes;
    }

    const finalHours = Math.floor(totalMinutes / 60);
    const finalMinutes = totalMinutes % 60;

    return `${finalHours}h ${finalMinutes}m`;
}



function isOverTime(){

    const allocated = document.getElementById("allocatedTime").innerText.trim();
    const worked = document.getElementById("totalWorkedTime").innerText.trim();

    function convertToMinutes(timeStr){
        const match = timeStr.match(/(\d+)h\s+(\d+)m/);
        if (!match) return 0;

        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);

        return (hours * 60) + minutes;
    }

    const allocatedMinutes = convertToMinutes(allocated);
    const workedMinutes = convertToMinutes(worked);

    if (workedMinutes > allocatedMinutes){
        document.getElementById("otchip").classList.remove("d-none");
        console.log("Overtime detected");
        var config = {
            reportName : "Task_Report",
            id: selectedTask,
            data: {
                data: {
                    Overtime: "true"
                }
            }
        };
        ZOHO.CREATOR.API.updateRecord(config).then(function(response){
            if(response.code == 3000){
                console.log("Record updated successfully", response);
            } 
        });
        return true;
    }

    return false;
}
