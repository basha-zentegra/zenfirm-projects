let currentPage = 1;
let CompletedCount = 0;
let isModalOpened = false;
let UIDKPICLICK = null;

async function kpiClick(type, pageNo = 1) {

    const modalTitle = document.getElementById("modal-title-tasksCount");

    console.log(type,isModalOpened)

    let cri = ''
    let statusClass = ''

    if(!UIDKPICLICK){
      if(type==='completed'){
        cri = `(Task_Status == "Completed")`
        statusClass = 'completed'
        modalTitle.innerText = 'All Completed Tasks'
      } else if(type==='in-progress'){
          cri = `(Task_Status == "In Progress")`
          statusClass = 'in-progress'
          modalTitle.innerText = 'All In Progress Tasks'
      } else if(type==='approved'){
          cri = `(Task_Status == "Approved")`
          statusClass = 'approved'
          modalTitle.innerText = 'All Approved Tasks'
      } else if(type === 'rejected'){
        cri = `(Task_Status == "Rejected")`
        statusClass = 'rejected'
        modalTitle.innerText = 'All Rejected Tasks'
      }
    }else{

      if(type==='completed'){
        cri = `(Assignee.ID == ${UIDKPICLICK} && Task_Status == "Completed")`
        statusClass = 'completed'
        modalTitle.innerText = 'All Completed Tasks'
      } else if(type==='in-progress'){
          cri = `(Assignee.ID == ${UIDKPICLICK} && Task_Status == "In Progress")`
          statusClass = 'in-progress'
          modalTitle.innerText = 'All In Progress Tasks'
      } else if(type==='approved'){
          cri = `(Assignee.ID == ${UIDKPICLICK} && Task_Status == "Approved")`
          statusClass = 'approved'
          modalTitle.innerText = 'All Approved Tasks'
      } else if(type==='rejected'){
          cri = `(Assignee.ID == ${UIDKPICLICK} && Task_Status == "Rejected")`
          statusClass = 'rejected'
          modalTitle.innerText = 'All Rejected Tasks'
      }
    }

  const modalBody = document.getElementById("kpiTbody");
  const paginationContainer = document.getElementById("paginationContainer");

  modalBody.innerHTML = '';
  paginationContainer.innerHTML = '';

  currentPage = pageNo;
  const pageSize = 50;

  // ✅ Ensure we have the record count first
  if (CompletedCount === 0) {
    const closedConfig = {
      appName: APP_NAME,
      reportName: "Task_Report",
      criteria: cri,
    };

    try {
      const res = await ZOHO.CREATOR.API.getRecordCount(closedConfig);
      CompletedCount = res.result.records_count || 0;
      console.log("✅ CompletedCount:", CompletedCount);
    } catch (err) {
      console.error("Error fetching count:", err);
    }
  }

    if (!isModalOpened){

      const kpiModel = new bootstrap.Modal(document.getElementById('cardViewModal'));
      kpiModel.show();
      isModalOpened = true;

  }

  // ✅ Now fetch the records for the current page
  const config = {
    appName: APP_NAME,
    reportName: "Task_Report",
    criteria: cri,
    page: pageNo,
    pageSize: pageSize
  };

  try {
    const res = await ZOHO.CREATOR.API.getAllRecords(config);
    const data = res.data || [];

    if (data.length === 0) {
      modalBody.innerHTML = `<p class="text-center text-muted">No tasks found.</p>`;
    } else {


        data.forEach((element, i) => {
        modalBody.innerHTML += `
          
            <tr>
                <td class="text-center">${(pageNo - 1) * pageSize + (i + 1)}</td>
                <td style="width:18%">${element.Task_Name || "-"}</td>
                <td style="width:18%">${element.Task_Description || "-"}</td>
                <td style="width:10%" class="text-center" ><span class="bg-status ${statusClass}">${element.Task_Status || "-"}</span></td>
                <td class="text-center"><span class="bg-status my-3 fw-bold ${(element.Task_Priority || "").toLowerCase()}">${element.Task_Priority.slice(0,3) || "-"}</span></td>
                <td class="text-center">${element.Assignee.display_value || "-"}</td>
                <td class="text-center">${element.Task_Date || "-"}</td>
                <td class="text-center">${element.Start_Time || "-"}</td>
                <td class="text-center">${element.End_Time || "-"}</td>
                <td class="text-center">${calculateTimeDifference(element.Start_Time,element.End_Time) || "-"}</td>
                
            </tr>
        `;
      });

      
    }

    // ✅ Add pagination
    addPagination(type, pageNo, pageSize);
  } catch (err) {
    console.error("Error fetching records:", err);
  }

  document.getElementById("inputSearchKeywordBtn").onclick = ()=>{
    console.log("CICKED")
    searchTaskNameContains(type);
  }


}

function addPagination(type,pageNo, pageSize) {
  const paginationContainer = document.getElementById("paginationContainer");

  const totalRecords = CompletedCount;
  const totalPages = Math.ceil(totalRecords / pageSize);

  console.log("🧭 Total Pages:", totalPages);

  if (totalPages <= 1) return;

  let paginationHTML = `<nav><ul class="pagination justify-content-center">`;

  // Prev
  paginationHTML += `
    <li class="page-item ${pageNo === 1 ? 'disabled' : ''}">
      <button class="page-link" onclick="kpiClick('${type}',${pageNo - 1})">Prev</button>
    </li>
  `;

  // Pages
  const start = Math.max(1, pageNo - 2);
  const end = Math.min(totalPages, pageNo + 2);

  for (let i = start; i <= end; i++) {
    paginationHTML += `
      <li class="page-item ${i === pageNo ? 'active' : ''}">
        <button class="page-link" onclick="kpiClick('${type}',${i})">${i}</button>
      </li>
    `;
  }

  // Next
  paginationHTML += `
    <li class="page-item ${pageNo === totalPages ? 'disabled' : ''}">
      <button class="page-link" onclick="kpiClick('${type}', ${pageNo + 1})">Next</button>
    </li>
  `;

  paginationHTML += `</ul></nav>`;
  paginationContainer.innerHTML = paginationHTML;
}


function kpiClickClose(){
    isModalOpened = false;
    CompletedCount = 0;
    document.getElementById("paginationContainer").classList.remove('d-none');
    document.getElementById("inputSearchKeyword").value='';
    
}