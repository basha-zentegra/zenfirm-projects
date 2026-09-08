function editTaskOwner(TID,event){
    event.preventDefault();
    event.stopPropagation(); // 🔥 prevents td click
    const td = document.getElementById(`assignee-cell-${TID}`);

    document.querySelectorAll(".custom-context-menu").forEach(m => m.remove());
    const menu = document.createElement("ul");
    menu.className = "list-group custom-context-menu";


    menu.innerHTML = ''

    ALL_ORG_EMPLOYEES.forEach(element =>{
        menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-name="${element.Name}">${element.Name}</li>`;
    })
    

    // position at mouse click
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.zIndex = "10000";
    menu.style.width = "200px";
    menu.style.cursor = "pointer"; 
    menu.style.height = "220px";
    menu.style.overflowY = "auto";

    // td.appendChild(menu);
    document.body.appendChild(menu);

    // handle menu item click
    menu.addEventListener("click", function (e) {
        e.stopPropagation(); // 🔥 stops td click
        if (e.target.tagName === "LI") {


            td.innerHTML =`<div class="spinner-border spinner-border-sm text-secondary" role="status">
                                 <span class="visually-hidden">Loading...</span>
                            </div>`;
            
            const selectedEmpID = e.target.dataset.status;
            const selectedEmpName = e.target.dataset.name;

            const config = {
                appName: "zenfirm",
                reportName: "Task_Report", 
                id : TID,
                data : {
                    data:{
                        Assignee : selectedEmpID
                    }
                } 
            };

            ZOHO.CREATOR.API.updateRecord(config).then(function(response){
                console.log(response)
                if(response.code == 3000){
                    console.log("Status updated successfully");
                    td.innerHTML = `<span>${selectedEmpName}</span>`

                } 
            }).catch(e => console.log(e))

            console.log(selectedEmpID, config, e)

            menu.remove();
        }
    });

    // close menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });

}

function editTaskPriority(TID,event){
    event.preventDefault();
    event.stopPropagation(); // 🔥 prevents td click
    const td = document.getElementById(`tsk-pri-${TID}`);

    document.querySelectorAll(".custom-context-menu").forEach(m => m.remove());
    const menu = document.createElement("ul");
    menu.className = "list-group custom-context-menu";


    menu.innerHTML = ''

    menu.innerHTML = `
        <li class="list-group-item small  p-1" data-status="Low">Low</li>
        <li class="list-group-item small  p-1" data-status="Medium">Medium</li>
        <li class="list-group-item small  p-1" data-status="High">High</li>
        
    `;

    // position at mouse click
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.zIndex = "10000";
    menu.style.width = "120px";
    menu.style.cursor = "pointer"; 

    // td.appendChild(menu);
    document.body.appendChild(menu);

    // handle menu item click
    menu.addEventListener("click", function (e) {
        e.stopPropagation(); // 🔥 stops td click
        if (e.target.tagName === "LI") {


            td.innerHTML =`<div class="spinner-border spinner-border-sm text-secondary" role="status">
                                 <span class="visually-hidden">Loading...</span>
                            </div>`;
            
            const selectedValue = e.target.dataset.status;

            const config = {
                appName: "zenfirm",
                reportName: "Task_Report", 
                id : TID,
                data : {
                    data:{
                        Task_Priority : selectedValue
                    }
                } 
            };

            ZOHO.CREATOR.API.updateRecord(config).then(function(response){
                console.log(response)
                if(response.code == 3000){
                    console.log("Status updated successfully");
                    td.innerHTML = `<span class="bg-status  fw-semibold fw-md-bold ${selectedValue.toLowerCase()}" >${selectedValue.slice(0,3)}</span>`

                } 
            }).catch(e => console.log(e))

            console.log(selectedValue, config, e)

            menu.remove();
        }
    });

    // close menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });

}