// function searchProject() {
//   const searchInput = document.getElementById('searchInput');
//   const dropdownList = document.getElementById('dropdownList');
//   const tableRows = document.querySelectorAll('#projects-table tbody tr');
//   const courseFilter = document.getElementById('courseFilter');

//   const allProjects = Array.from(tableRows).map(row => ({
//     name: row.cells[0].innerText,
//     row: row
//   }));


//   function showDropdown(projects) {
//     dropdownList.innerHTML = "";
//     if (projects.length === 0) {
//       console.log("NO PROJECTTTSSSSSSSSSSSSSSSSSSSSSSSSS SO TERMINATE",projects )
//       dropdownList.style.display = "none";
//       return;
//     }
//     projects.forEach(p => {
//       const li = document.createElement('li');
//       li.className = "list-group-item list-group-item-action";
//       li.textContent = p.name;
//       li.onclick = () => {
//         tableRows.forEach(r => r.style.display = 'none');
//         p.row.style.display = '';
//         dropdownList.style.display = "none";
//         searchInput.value = p.name;
//       };
//       dropdownList.appendChild(li);
//     });
//     dropdownList.style.display = "block";
//   }

//   searchInput.addEventListener('focus', () => {
//     showDropdown(allProjects);
//   });

//   searchInput.addEventListener('keyup', () => {
//     const searchValue = searchInput.value.toLowerCase();
//     const filtered = allProjects.filter(p => 
//       p.name.toLowerCase().includes(searchValue)
//     );
//     showDropdown(filtered);
//   });

//   document.addEventListener('click', (e) => {
//     if (!searchInput.contains(e.target) && !dropdownList.contains(e.target)) {
//       dropdownList.style.display = "none";
//     }
//   });

//     courseFilter.addEventListener('change', () => {
//       searchInput.value = "";
//       const selectedCourse = courseFilter.value.toLowerCase();
//       tableRows.forEach(row => {
//         const course = row.cells[1].innerText.toLowerCase();
//         row.style.display = selectedCourse === 'all' || course === selectedCourse ? '' : 'none';
//       });
//     });
// }

function searchProjectName(){

  const projectName = document.getElementById("projectNameInput").value;
  const cri = `Project_Name.contains("${projectName.trim()}")`
  fetchAllProjects(cri)

  

  const modalEl = document.getElementById('exampleModal');

  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) {
    modal.hide();
  }


}


function searchTask(){

  const searchInput = document.getElementById('searchInputTask');
  const dropdownList = document.getElementById('dropdownListTasks');
  const tableRows = document.querySelectorAll('#task-table tbody tr');

  const taskMemberFilter = document.getElementById("taskMemberFilter");

  const allProjects = Array.from(tableRows).map(row => ({
    name: row.cells[1].innerText,
    row: row
  }));

  function showDropdown(projects) {
      dropdownList.innerHTML = "";
      if (projects.length === 0) {
        dropdownList.style.display = "none";
        return;
      }
      projects.forEach(p => {
        const li = document.createElement('li');
        li.className = "list-group-item list-group-item-action";
        li.textContent = p.name;
        li.onclick = () => {
          tableRows.forEach(r => r.style.display = 'none');
          p.row.style.display = '';
          dropdownList.style.display = "none";
          searchInput.value = p.name;
        };
        dropdownList.appendChild(li);
      });
      dropdownList.style.display = "block";
    }

  searchInput.addEventListener('focus', () => {
    showDropdown(allProjects);
  });

  searchInput.addEventListener('keyup', () => {
    const searchValue = searchInput.value.toLowerCase();
    const filtered = allProjects.filter(p => 
      p.name.toLowerCase().includes(searchValue)
    );
    showDropdown(filtered);
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdownList.contains(e.target)) {
      dropdownList.style.display = "none";
    }
  });


  taskFilter.addEventListener('change', () => {
    // searchInput.value = "";
      const selectedTask = taskFilter.value.toLowerCase();
      tableRows.forEach(row => {
        const course = row.cells[4].innerText.toLowerCase();
        row.style.display = selectedTask === 'all' || course === selectedTask ? '' : 'none';
      });
  });



}


//---- MEMBER WISE 

taskMemberFilter.addEventListener('change', e => {
  if(e.target.value === "null"){
    populateTasks(selecteProject);
  }else{
    populateTasks(selecteProject, e.target.value);
  }
  
});


function searchEmployee(ALL_EMPLOYEES){
    const searchInput = document.getElementById('employeeSearchInput');
    const dropdownList = document.getElementById('employeeDropdownList');

    function showDropdown(projects) {
    console.log(projects)
      dropdownList.innerHTML = "";
      if (projects.length === 0) {
        dropdownList.style.display = "none";
        console.log("NO EMPLOYEE RESPONSE ARRAY SO RETURING EMPTY")
        return;
      }
      projects.forEach(p => {
        console.log("ITS GONNA LOOP")
        const li = document.createElement('li');
        li.className = "list-group-item list-group-item-action";
        li.textContent = p.Name;
        li.onclick = () =>{
          fetchAllProjects(p.ID);
          dropdownList.style.display = "none";
          searchInput.value = p.Name;
        } 
        dropdownList.appendChild(li);
      });
      dropdownList.style.display = "block";
    }

  searchInput.addEventListener('focus', () => {
    showDropdown(ALL_EMPLOYEES);
  });

  searchInput.addEventListener('keyup', () => {
    
    const searchValue = searchInput.value.toLowerCase();
    const filtered = ALL_EMPLOYEES.filter(p => 
      p.Name.toLowerCase().includes(searchValue)
    );
    showDropdown(filtered);
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdownList.contains(e.target)) {
      dropdownList.style.display = "none";
    }
  });

}

//SEARCH TASK NAME CONTAINS
function searchTaskNameContains(type){
  const keyword = document.getElementById("inputSearchKeyword").value.trim();
  const modalBody = document.getElementById("kpiTbody");
  modalBody.innerHTML = '';

  if(type==='completed'){
    cri = `(Task_Status == "Completed" && Task_Name.contains("${keyword}"))`
    statusClass = 'completed'
    modalTitle.innerText = 'All Completed Tasks'
  } else if(type==='in-progress'){
      cri = `(Task_Status == "In Progress" && Task_Name.contains("${keyword}"))`
      statusClass = 'in-progress'
      modalTitle.innerText = 'All In Progress Tasks'
  } else if(type==='approved'){
      cri = `(Task_Status == "Approved" && Task_Name.contains("${keyword}"))`
      statusClass = 'approved'
      modalTitle.innerText = 'All Approved Tasks'
  } else if(type === 'rejected'){
    cri = `(Task_Status == "Rejected" && Task_Name.contains("${keyword}"))`
    statusClass = 'rejected'
    modalTitle.innerText = 'All Rejected Tasks'
  }
  const config = {
    appName: "zenworkr",
    reportName: "Task_Report",
    criteria: cri,

  };
  ZOHO.CREATOR.API.getAllRecords(config).then(function(response){
    console.log(response)
    if(response.code === 3000){

      response.data.forEach((element, i) => {
        modalBody.innerHTML += `
            <tr>
                <td class="text-center">${(i + 1)}</td>
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
      document.getElementById("inputSearchKeyword").value='';
      document.getElementById("paginationContainer").classList.add('d-none');
    }else if(response.code===3100){
      modalBody.innerHTML = `
      <tr><td colspan="10" class="text-center text-muted">No tasks found.</td></tr>`;
    }
  }).catch(e =>{
    modalBody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No tasks found.</td></tr>`;
    document.getElementById("paginationContainer").classList.add('d-none');
  })
}



function searchTaskLists(){

  const searchInput = document.getElementById('searchInputTask-list');
  const dropdownList = document.getElementById('dropdownTask-list');
  const tableRows = document.querySelectorAll('#tasklist-table tbody tr');

  const allProjects = Array.from(tableRows).map(row => ({
    name: row.cells[0].innerText,
    row: row
  }));

  function showDropdown(projects) {
      dropdownList.innerHTML = "";
      if (projects.length === 0) {
        dropdownList.style.display = "none";
        return;
      }
      projects.forEach(p => {
        const li = document.createElement('li');
        li.className = "list-group-item list-group-item-action";
        li.textContent = p.name;
        li.onclick = () => {
          tableRows.forEach(r => r.style.display = 'none');
          p.row.style.display = '';
          dropdownList.style.display = "none";
          searchInput.value = p.name;
        };
        dropdownList.appendChild(li);
      });
      dropdownList.style.display = "block";
    }

  searchInput.addEventListener('focus', () => {
    showDropdown(allProjects);
  });

  searchInput.addEventListener('keyup', () => {
    const searchValue = searchInput.value.toLowerCase();
    const filtered = allProjects.filter(p => 
      p.name.toLowerCase().includes(searchValue)
    );
    showDropdown(filtered);
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdownList.contains(e.target)) {
      dropdownList.style.display = "none";
    }
  });

}


//--- SEARCH EMPLOYEES IN TODAY'S REPORT

document.getElementById('dateTodayReportEmp').addEventListener('keyup', function () {
  let filter = this.value.toLowerCase();
  let rows = document.querySelectorAll('#emp-accordion .accordion-item');

  rows.forEach(row => {
    let text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
});


//--- SEARCH INPUT AUTO FOCUS 
document.getElementById('exampleModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('projectNameInput').focus();
});

document.addEventListener('keydown', function (event) {

  // event.preventDefault();
    // Check if Ctrl + K is pressed
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault(); // Prevent browser default (important!)
        var modalElement = document.getElementById('exampleModal');
        var modal = new bootstrap.Modal(modalElement);
        modal.show();
    }

});

document.getElementById('searchForm').addEventListener('submit', function (e) {

    e.preventDefault(); // prevent page reload

    const value = document.getElementById('projectNameInput').value;

    console.log("Searching for:", value);

    searchProjectName(value); // call your function
});