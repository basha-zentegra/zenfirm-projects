let selecteProject = ''
let selectedProjectName = ''

function openOffcanvas(event){

  document.getElementById("canvasbtn").click();

  const content = document.getElementById("offcanvasContent"); 
  const heading = document.getElementById("offcanvasRightLabel");
  //?Project_Name=ABI
  //?Organization_Name=1141991000005671003
  if(event === "project"){
      content.innerHTML = `<iframe style="border:0;" height='600px' width='100%' frameborder='0' allowTransparency='true' scrolling='auto' id="projectForm" src='https://creatorapp.zohopublic.in/zentegraindia/zenfirm/form-embed/Project/pyud8AVvsHfevO398YVaaXtHsgmpbR1Dv7sxp5a99kOF8Bb49Gsx3nne0mM982xp0qHDJRBgpVX5uxY9vux5nExx2wqaqrmKxppk?Organization_Name=${ORG}&params=${USERID}'></iframe>
      `;
      heading.innerText ="Create New Project"

  }else if(event === "meeting"){

    content.innerHTML = `<iframe style="border:0;" height='600px' width='100%' frameborder='0' allowTransparency='true' scrolling='auto' id="projectForm" src='https://creatorapp.zohopublic.com/zentegra/zenworkr/form-embed/Meeting/YQBdBF3YJW00FVt0tarvngtWQBuzUKWC7VAqRgSHHYfGfTOsbQDtFn8UJCk1eXy59XOaQEPratSRz44qT5eBmmD98tOdmBZW72ub?Project_Name=${selecteProject}'></iframe>
      `;
      heading.innerText ="Create New Meeting"

  }else if(event === "notes"){
    heading.innerText ="Add Notes on Project";
    content.innerHTML = notesForm();
  }
  else if(event === "task"){

    // content.innerHTML = `<iframe style="border:0;" height='600px' width='100%' frameborder='0' allowTransparency='true' scrolling='auto' id="projectForm" src='https://creatorapp.zohopublic.in/zentegraindia/zenfirm/form-embed/Task/F0BkHeK1bOEWwvUNtaJn7pNunERs41QRfCs15PZ5dNrg9SQ8WCAr18DxdMDrn631M2DQuOBMF0vZKVF1WVAHJw3jJ4bWjAgQ07dB?Project_Name=${selecteProject}&Assignee=${USERID}'></iframe>
    //   `;
      heading.innerText ="Create New Task"
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const yyyy = today.getFullYear();

      content.innerHTML = /* html */ `

      <section class="mx-5 px-5">

        <div class="d-flex flex-row align-items-center mb-4">
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            
            <label class="form-label" for="form3Example1c">Project Name <span class="text-danger">*</span></label>
            <input type="text" id="project-nameinput" class="form-control" readonly value="${selectedProjectName}" />
          </div>
        </div>

        <div class="d-flex flex-row align-items-center mb-4">
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            
            <label class="form-label" for="form3Example1c">Task Name <span class="text-danger">*</span></label>
            <input type="text" id="task-nameinput" class="form-control" />
          </div>
        </div>

        <div class="d-flex flex-row align-items-center mb-4">
          
          
          <div class="form-outline flex-fill mb-0">
            
            <label class="form-label">Phase </label>

            ${rtnPrjPhases()}

            
          </div>
        </div>

        <div class="d-flex flex-row align-items-center mb-4">
          
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            
            <label class="form-label" for="form3Example3c">Assignee <span class="text-danger">*</span></label>
            ${rtnReporteeSelect()}

            
          </div>
        </div>



        <div class="d-flex flex-row align-items-center mb-4">
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            
            <label class="form-label" for="form3Example4c">Date</label>
            <input type="text" id="task-dateinput" class="form-control" placeholder="MM-DD-YYYY" value = ${mm}-${dd}-${yyyy} />
          </div>
        </div>

        <div class=" flex-row align-items-center mb-4">
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            <label class="form-label" for="budgetedtimeinput">Budgeted Time</label>
            ${rtnBudgetedTimeSelect()}

          </div>
        </div>

        <div class="d-none flex-row align-items-center mb-4">
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            
            <label class="form-label" for="form3Example4cd">Start Time</label>
            <input type="text" id="startdateinput" class="form-control" placeholder="HH:MM" />
          </div>
        </div>

        <section class="d-flex justify-content-around d-none">

        <div>
          <small class="text-center d-block mb-2" >Start Time</small>
          <div class="time-picker">
              
              <div class="text-center">
                  <div class="arrow-btns">
                      <button class="btn btn-light" onclick="changeHourSt(1)">▲</button>
                      <input type="text" id="hourSt" class="time-box mt-1">
                      <button class="btn btn-light" onclick="changeHourSt(-1)">▼</button>
                  </div>
              </div>

              <span>:</span>

              <div class="text-center">
                  <div class="arrow-btns">
                      <button class="btn btn-light" onclick="changeMinuteSt(1)">▲</button>
                      <input type="text" id="minuteSt" class="time-box mt-1">
                      <button class="btn btn-light" onclick="changeMinuteSt(-1)">▼</button>
                  </div>
              </div>
          </div>
        </div>


        <div >
          <h6 class="mt-5">-></h6>
        </div>


            <div>
              <small class=" text-center d-block mb-2" >End Time</small>
              <div class="time-picker">
                  
                  <div class="text-center">
                      <div class="arrow-btns">
                          <button class="btn btn-light" onclick="changeHourEt(1)">▲</button>
                          <input type="text" id="hourEt" class="time-box mt-1">
                          <button class="btn btn-light" onclick="changeHourEt(-1)">▼</button>
                      </div>
                      
                  </div>

                  <span>:</span>

                  
                  <div class="text-center">
                      <div class="arrow-btns">
                          <button class="btn btn-light" onclick="changeMinuteEt(1)">▲</button>
                          <input type="text" id="minuteEt" class="time-box mt-1">
                          <button class="btn btn-light" onclick="changeMinuteEt(-1)">▼</button>
                      </div>
                      
                  </div>
              </div>
            </div>


        </section>




        <div class="d-none flex-row align-items-center mb-4">
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            <label class="form-label" for="enddateinput">End Time</label>
            <input type="text" id="enddateinput" class="form-control" placeholder="HH:MM" />

          </div>
        </div>

        <br>
        <div class="text-center">
          <button class="btn btn-primary ms-5" onclick="addTask()">Add Task</button>
        </div>

      </section>
      
      `
          // let hourInput = document.getElementById("hour");
          // let minuteInput = document.getElementById("minute");
          // let result = document.getElementById("result");

        function initTime() {

          let hourInputSt = document.getElementById("hourSt");
          let minuteInputSt = document.getElementById("minuteSt");

          let hourInputEt = document.getElementById("hourEt");
          let minuteInputEt = document.getElementById("minuteEt");
          

            const now = new Date();
            hourInputSt.value = String(now.getHours()).padStart(2, "0");
            minuteInputSt.value = String(now.getMinutes()).padStart(2, "0");

              hourInputEt.value = String(now.getHours() + 1).padStart(2, "0");
              minuteInputEt.value = String(now.getMinutes()).padStart(2, "0");
        }

        // function updateResult() {
        //     result.textContent = `${hourInput.value}:${minuteInput.value}`;
        // }

        initTime();

  }

  else if(event === "phase"){


    content.innerHTML = phaseForm()

    // content.innerHTML = `<iframe style="border:0;" height='600px' width='100%' frameborder='0' allowTransparency='true' scrolling='auto' id="projectForm" src='https://creatorapp.zohopublic.com/zentegra/zenworkr/form-embed/Milestone/SagXJY5TV0Fj5UVq83RjKSbaJTZr1z6RBBrQNM3BTymPBUK5pRzh8VZNSYUOpdCSFSRFnQ0Sjh8s1bD7GJGsRE2OyEnde8wXTkeW?Project_Name=${selecteProject}'></iframe>
    //   `;

    heading.innerText ="Create New Phase"

  }

  else if(event === "discussion"){

    content.innerHTML = `<iframe style="border:0;" height='600px' width='100%' frameborder='0' allowTransparency='true' scrolling='auto' id="projectForm" src='https://creatorapp.zohopublic.com/zentegra/zenworkr/form-embed/Project_Discussions/pAAM6QpWvUGwsPN8tOVjs4QEx8OvYK2a3OyXGe0TnF40nCVSH2nA5bCY6AWwb4UTwzrxKjTurV2QrQEzDnm7CrWayw92eu80N492?Project_Name=${selecteProject}'></iframe>
      `;

    heading.innerText ="Add a Discussion"

  } else if(event === "editproject"){
    console.log(selecteProject)

    //https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Project/record-edit/All_Projects1/266830000002970069/gOptXTKTQwF8pF6GYWg3ry9dS6ymvUH9ta0WNT9O636CTCAW2saeVt4nqSkeC4jvtjQPu2K20DEP4WXFCnhSfXPHNmaqHWQbHqfX
    
    // content.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Project/record-edit/All_Projects1/${selecteProject}/gOptXTKTQwF8pF6GYWg3ry9dS6ymvUH9ta0WNT9O636CTCAW2saeVt4nqSkeC4jvtjQPu2K20DEP4WXFCnhSfXPHNmaqHWQbHqfX?Organization_Name=${ORG}&params=${USERID}" frameborder="0"></iframe>`;

      content.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Project/record-edit/All_Projects1/${selecteProject}/gOptXTKTQwF8pF6GYWg3ry9dS6ymvUH9ta0WNT9O636CTCAW2saeVt4nqSkeC4jvtjQPu2K20DEP4WXFCnhSfXPHNmaqHWQbHqfX?params=${USERID}" frameborder="0"></iframe>`;
      
      heading.innerText ="Edit Project"

      console.log(content.innerHTML)
  }
  else if(event === "cancalationform"){
    
      content.innerHTML = `<iframe style="height: 80vh; width: 100%;"  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/form-embed/Project_Cancellation/aFEWe2CHCBrU54dap5COUAuV1mW3wOyQbAfz17KrFwKxKeRpafCeP24s2ybmDXkH7txEJFKtRexhGxG6rBC7Qz7PBj5DAqPUG9nY?Project=${selecteProject}" frameborder="0"></iframe>`;
      heading.innerText ="Project Cancelation"
  } else{

    content.innerHTML = `<iframe height='100%' width='100%'  src="https://creatorapp.zohopublic.in/zentegraindia/zenfirm/ITR/record-edit/ITR_Report/266830000000960032/RfHFPj48UtYFOsYazvhzWfbzNChbdEeD9MA8BMxWez63pxDP2Gf6kJQykbhM7EnKmXDBUTVRyaZ0jn8pUEjSeDByt8UY8ROUVHmb" frameborder="0"></iframe> `;
      heading.innerText ="Add New Team Member"

  }

  console.log(event)

  // <iframe height='500px' width='100%' frameborder='0' allowTransparency='true' scrolling='auto' src='https://creatorapp.zohopublic.com/zentegra/zenworkr/form-embed/Team/QesrRS6hEpww5OC5am4RW5TwxpktMKvACGnMFnXRvShs30WJFfgx2Sj7jOwz6bxaZh1UKvYqpduQhhxNq1eDb2wmxV6t6g2RxR5H'></iframe>
  // https://creatorapp.zohopublic.com/zentegra/zenworkr/#Form:Team?recLinkID=1141991000005984003
  //https://creatorapp.zohopublic.com/zentegra/zenworkr/form-embed/Project_Discussions/pAAM6QpWvUGwsPN8tOVjs4QEx8OvYK2a3OyXGe0TnF40nCVSH2nA5bCY6AWwb4UTwzrxKjTurV2QrQEzDnm7CrWayw92eu80N492
  // https://creatorapp.zohopublic.in/zentegraindia/zenfirm/form-perma/Project_Cancellation/aFEWe2CHCBrU54dap5COUAuV1mW3wOyQbAfz17KrFwKxKeRpafCeP24s2ybmDXkH7txEJFKtRexhGxG6rBC7Qz7PBj5DAqPUG9nY


}

function rtnPrjPhases(){
  let select = `<select class="form-select" id="task-phaseselect" >
  <option selected value="" >Select</option>`

  selected_project_phases.forEach(element => {
    
      select += `<option value="${element.ID}">${element?.Phase_Name || "-"}</option>`
    
  })
  select += `</select>`;

  return select;


}

function rtnReporteeSelect(){

  // const errorMsg = document.getElementById("assignee-error-msg");

  // errorMsg.classList.add("d-none");

  let select = `<select class="form-select" id="task-assigneeselect" aria-label="Default select example">
  <option disabled >Select</option>`

  if(selectedProjectTeam.length > 0){

      selectedProjectTeam.forEach(element => {

        if(element.ID === USERID){
          select += `<option selected value="${element.ID}">${element.display_value}</option>`
        } else{
          select += `<option value="${element.ID}">${element.display_value}</option>`
        }
        
        console.log(element.display_value)
      })
      select += `</select>`;

      return select;

  }else{
    // select += `<option selected disabled value="No Assignee Available">No Assignee Available</option>`
    select += `</select>
    <small id="assignee-error-msg" class="text-danger">
              Project does not have any Associated Members.
            </small>
    
    `;

    // errorMsg.classList.remove("d-none");

    return select;
  }

}

function rtnBudgetedTimeSelect() {
  const times = ["0h 15m", "0h 30m", "0h 45m","1h 0m", "2h 0m", "3h 0m","4h 0m", "5h 0m"];

  let select = `<select id="budgetedtimeinput" class="form-select task-assigneeselect">`;

  times.forEach(time => {
      if(time === "1h 0m"){
        select += `<option selected value="${time}">${time}</option>`;
      } else{
        select += `<option value="${time}">${time}</option>`;
      }
  });

  select += `</select>`;
  return select;
}





function addTask(){


  const taskName = document.getElementById("task-nameinput").value;
  const date = document.getElementById("task-dateinput").value;

  const phase = document.getElementById("task-phaseselect").value;

  // const stime = document.getElementById("startdateinput").value;
  // const etime = document.getElementById("enddateinput").value;


  const hourSt = document.getElementById("hourSt").value;
  const minuteSt = document.getElementById("minuteSt").value;

  const hourEt = document.getElementById("hourEt").value;
  const minuteEt = document.getElementById("minuteEt").value;
  // const assignee = document.getElementById("task-assigneeselect").value;

  const selectEl = document.getElementById("task-assigneeselect");

  const assigneeValue = selectEl.value; // value attribute
  // const assigneeText  = selectEl.options[selectEl.selectedIndex].text; // visible text

  const budgetedtimeinput = document.getElementById("budgetedtimeinput").value;

  if(!taskName || !assigneeValue){
    alert("Task name and assignee is mandatory")
    return;
  }

  const tasksTbody = document.getElementById("tasks-tbody");

  console.log(taskName,assigneeValue,date,`${hourSt}:${minuteSt}`,`${hourEt}:${minuteEt}`)

  var formData = {
    data : {
      Project_Name :selecteProject,
      Task_Name : taskName,
      Assignee : assigneeValue,
      Task_Status : "Not Started",
      Task_Priority : "Low",
      Budgeted_Time : budgetedtimeinput
    }
  }

  if(date){
    formData.data.Task_Date = date;
  }

  if(phase){
    formData.data.Milestone_Name = phase;
  }

// if(hourSt && minuteSt){
//   formData.data.Start_Time = `${hourSt}:${minuteSt}`;
// }

// if(hourEt && minuteEt){
//   formData.data.End_Time = `${hourEt}:${minuteEt}`;
// }

var config = {
      appName : "zenfirm",
      formName : "Task",
      data : formData
}

ZOHO.CREATOR.API.addRecord(config).then(function(response){
    if(response.code == 3000){
      console.log("Record added successfully",response);

      


      // tasksTbody.innerHTML+= `
      //           <tr class="table-success">
                
      //               <td style="width:1%"><input class="form-check-input task-checkbox" type="checkbox" value="" data-id="${response.data.ID}"></td>
      //               <td style="width:18%">
      //                 <a style="text-decoration:none; color:inherit;" href="https://creatorapp.zoho.in/zentegraindia/zenfirm#Page:WSM_EMP?autoClick=event-box-${response.data.ID}" target="_blank">
      //                   ${formData.data.Task_Name || "-"}
      //                 </a>
                    
      //               </td>
      //               <td class="text-center cursor-pointer">-</td>
      //               <td style="width:18%">-</td>
      //               <td style="width:10%" class="text-center" ><span class="bg-status not-started">Not Started</span></td>
      //               <td id="tsk-pri-${response.data.ID}" class="text-center" oncontextmenu="editTaskPriority('${response.data.ID}',event)"><span class="bg-status my-3 fw-bold ">-</span></td>
      //               <td id="assignee-cell-${response.data.ID}" class="text-center assignee-cell cursor-pointe" oncontextmenu="editTaskOwner('${response.data.ID}',event)">${assigneeText || "-"}</td>
      //               <td class="text-center">${formData.data?.Task_Date || "-"}</td>
      //               <td class="text-center">${formData.data?.Start_Time || "-"}</td>
      //               <td class="text-center">${formData.data?.End_Time || "-"}</td>
      //               <td class="text-center">-</td>
      //               <td class="text-center cursor-pointer">
      //                 <i class="bi bi-play-circle-fill" onclick="startTaskTimer(${formData.ID})"></i>
      //               </td>
                
      //           </tr>
      //       `;


            document.getElementById("offcanvas-cls-btn").click()
            populateTasks(selecteProject, USERID)

            // setTimeout(() => {

            //   const row = document.querySelector("#tasks-tbody tr.table-success");

            //   if (row) {
            //     row.classList.remove("table-success");
            //   }

              
            // }, 3000);

  
    }else{
      console.log("COde else block", response)
      // alert(response.error)4
      const errorMessages = Object.values(response.error).join("\n");
      alert(errorMessages);
    }
}).catch(e => {
  console.log(e)
  alert("Please fill the correct details")
})

}




function calculateTimeDifference(startTime, endTime) {

  if(!startTime, !endTime){
    return "-";
  }

  // Convert time strings to Date objects
  const start = new Date(`01/01/2000 ${startTime}`);
  const end = new Date(`01/01/2000 ${endTime}`);

  // Calculate the difference in milliseconds
  let diffMs = end - start;

  // Convert milliseconds to hours and minutes
  let diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
  let diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes

  return `${diffHrs}h ${diffMins > 0 ? diffMins + "m" : ""}`.trim();
}

function parseApiString(str) {

  const regex = /^(.+?)\s+(\d+\.\d{2})\s+(\w+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(.+?)\s+(\d{2}-\d{2}-\d{4})\s+(\d{2}:\d{2}:\d{2}\s[AP]M)\s+(\S+)\s+(\d+)\s+(\d+)\s+(\w+)\s+(\d+)$/;


  const match = str.match(regex);
  if (!match) return null;

  return {
    project_name: match[1].trim(),
    amount: match[2],
    employee: match[3],
    estimated_budget: match[4],
    hourly_rate: match[5],
    mockup: match[6],
    phase_name: match[7].trim(),
    date_time: `${match[8]} ${match[9]}`,
    added_user: match[10],
    id1: match[11],
    id2: match[12],
    lock: match[13],
    time: match[14]
  };
}

function parseString(str) {
  const parts = str.split(" ");

  // topic = always first word
  const topic = parts[0];

  // find first date (dd-mm-yyyy)
  const dateRegex = /\d{2}-\d{2}-\d{4}/;
  const firstDateIndex = parts.findIndex(p => dateRegex.test(p));
  const date = parts[firstDateIndex];

  // project_name = words between topic and first date
  const project_name = parts.slice(1, firstDateIndex).join(" ");

  // description = word just after first date
  const description = parts[firstDateIndex + 1];

  // date_time = remaining after description
  const date_time = parts.slice(firstDateIndex + 2).join(" ");

  return {
    topic,
    project_name,
    date,
    description,
    date_time
  };
}


function animateCount(element, target, duration = 2000) {
  let start = 0;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // max = 1
    const current = Math.floor(progress * target);
    element.innerText = current;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.innerText = target; // ensure final number
    }
  }
  requestAnimationFrame(updateCount);
}



function previewFile(previewUrl, fileName, imageURL){

  console.log(previewUrl, fileName, imageURL, typeof(imageURL))
  const body = document.getElementById("previewModal-body");
  const title = document.getElementById("previewModalTitle");
   const myModal = new bootstrap.Modal(document.getElementById("previewModal"));

  if(imageURL){
    title.innerText = fileName;
    body.innerHTML =  `
      <div class="text-center">
        <img src="https://zenworkr.zohocreatorportal.com${imageURL}" style="width:500px; height:auto;" alt="">
      </div>

    `
   
    myModal.show();
    return
  }
  
  title.innerText = fileName;
  
  body.innerHTML = `<iframe
    id="inlineFrameExample"
    title="Inline Frame Example"
    width="100%"
    height="800px"
    src="${previewUrl}">
  </iframe>`

  
  myModal.show()
  console.log("opned")
  
}






function returnNotes(Notes){
  if(Notes.length > 0){
    let htmo = 
          `<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-sticky text-primary"></i>
          </a>
          <ul class="dropdown-menu" style="max-width: 800px; ">`

        Notes.forEach(element =>{

          htmo += `<li><a class="dropdown-item" style="white-space:normal; word-wrap:break-word; word-break:break-word;" href="#">${element.display_value}</a></li>`
          
        })
        htmo += `</ul>`
        return htmo;

  }else{
    return `<span class="bg-status"> </span>`
  }
}

function refreshTask(i){
  console.log(i)
  i.classList.add("rotate")
  populateTasks(selecteProject, USERID)

  setTimeout(() => {
    i.classList.remove("rotate");
  }, 1500);
}


function addRecentProject(project) {
  let recentProjects = JSON.parse(localStorage.getItem("recentProjects")) || [];

  // Remove if already exists
  recentProjects = recentProjects.filter(p => p.id !== project.id);

  // Add to top
  recentProjects.unshift(project);

  // Keep only last 5
  recentProjects = recentProjects.slice(0, 10);

  localStorage.setItem("recentProjects", JSON.stringify(recentProjects));
}


function showRecentProjects() {
  const recentProjects = JSON.parse(localStorage.getItem("recentProjects")) || [];
  const list = document.getElementById("recent-projects");

  list.innerHTML = "";

  recentProjects.forEach(project => {
    const li = document.createElement("li");
    li.innerHTML = `<a class="dropdown-item cursor-pointer" onclick="clickRecentProjects('${project.id}')" >${project.name}</a>`;
    list.appendChild(li);

  });
}

function clickRecentProjects(pid){
  document.getElementById("cls-btn-main-modal").click();

  setTimeout(() => {
    openModal(pid, null)
  }, 500);
  
}




//TIME INPUT JS CODE



function changeHourSt(step) {

    let hourInput = document.getElementById("hourSt");
    let hour = parseInt(hourInput.value);
    hour = (hour + step + 24) % 24;
    hourInput.value = String(hour).padStart(2, "0");
    

}

function changeMinuteSt(step) {

    let minuteInput = document.getElementById("minuteSt");
    let minute = parseInt(minuteInput.value);
    minute = (minute + step + 60) % 60;
    minuteInput.value = String(minute).padStart(2, "0");
    

}



function changeHourEt(step) {

    let hourInput = document.getElementById("hourEt");
    let hour = parseInt(hourInput.value);
    hour = (hour + step + 24) % 24;
    hourInput.value = String(hour).padStart(2, "0");
    

}

function changeMinuteEt(step) {

    let minuteInput = document.getElementById("minuteEt");
    let minute = parseInt(minuteInput.value);
    minute = (minute + step + 60) % 60;
    minuteInput.value = String(minute).padStart(2, "0");
    

}