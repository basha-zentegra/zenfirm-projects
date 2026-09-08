function editProjectStatus(PID,event){
    event.preventDefault();
    event.stopPropagation(); // 🔥 prevents td click
    const td = document.getElementById(`prj-sts-${PID}`);

    document.querySelectorAll(".custom-context-menu").forEach(m => m.remove());
    const menu = document.createElement("ul");
    menu.className = "list-group custom-context-menu";

    menu.innerHTML = `
        <li class="list-group-item small  p-1" data-status="New Discussion">New Discussion</li>
        <li class="list-group-item small  p-1" data-status="Not Started">Not Started</li>
        <li class="list-group-item small  p-1" data-status="In Progress">In Progress</li>
        <li class="list-group-item small  p-1" data-status="Completed">Completed</li>
    `;

    // position at mouse click
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.zIndex = "1000";
    menu.style.width = "160px";
    menu.style.cursor = "pointer"; 

    td.appendChild(menu);

    // handle menu item click
    menu.addEventListener("click", function (e) {
        e.stopPropagation(); // 🔥 stops td click
        if (e.target.tagName === "LI") {


            td.innerHTML =`<div class="spinner-border spinner-border-sm text-secondary" role="status">
                                 <span class="visually-hidden">Loading...</span>
                            </div>`;
            
            const selectedStatus = e.target.dataset.status;

            const config = {
                appName: "zenfirm",
                reportName: "My_Team_Projects", 
                id : PID,
                data : {
                    data:{
                        Project_Status : selectedStatus
                    }
                } 
            };

            ZOHO.CREATOR.API.updateRecord(config).then(function(response){
                console.log(response)
                if(response.code == 3000){
                    console.log("Status updated successfully");
                    td.innerHTML = `<span class="bg-status ${selectedStatus.toLowerCase().replace(" ", "-")}">${selectedStatus}</span>`

                } 
            }).catch(e => console.log(e))

            console.log(selectedStatus, config)

            menu.remove();
        }
    });

    // close menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });

}


function editProjectPriority(PID,event){
    event.preventDefault();
    event.stopPropagation(); // 🔥 prevents td click
    const td = document.getElementById(`prj-pri-${PID}`);

    document.querySelectorAll(".custom-context-menu").forEach(m => m.remove());
    const menu = document.createElement("ul");
    menu.className = "list-group custom-context-menu";

    menu.innerHTML = `
        <li class="list-group-item small  p-1" data-status="Low">Low</li>
        <li class="list-group-item small  p-1" data-status="Medium">Medium</li>
        <li class="list-group-item small  p-1" data-status="High">High</li>
        
    `;


    // position at mouse click
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.zIndex = "1000";
    menu.style.width = "120px";
    menu.style.cursor = "pointer"; 

    td.appendChild(menu);

    // handle menu item click
    menu.addEventListener("click", function (e) {
        e.stopPropagation(); // 🔥 stops td click
        if (e.target.tagName === "LI") {


            td.innerHTML =`<div class="spinner-border spinner-border-sm text-secondary" role="status">
                                 <span class="visually-hidden">Loading...</span>
                            </div>`;
            
            const selectedStatus = e.target.dataset.status;

            const config = {
                appName: "zenfirm",
                reportName: "My_Team_Projects", 
                id : PID,
                data : {
                    data:{
                        Priority : selectedStatus
                    }
                } 
            };

            ZOHO.CREATOR.API.updateRecord(config).then(function(response){
                console.log(response)
                if(response.code == 3000){
                    console.log("Status updated successfully");
                    td.innerHTML = `<span class="bg-status  fw-semibold fw-md-bold ${selectedStatus.toLowerCase()}" >${selectedStatus.slice(0,3)}</span>`

                } 
            }).catch(e => console.log(e))

            console.log(selectedStatus, config)

            menu.remove();
        }
    });

    // close menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });

}



function switchProject(event){
    event.preventDefault();
    event.stopPropagation(); // 🔥 prevents td click
    const prjName = document.getElementById(`modalTitle`);

    document.querySelectorAll(".custom-context-menu").forEach(m => m.remove());
    const menu = document.createElement("ul");
    menu.className = "list-group custom-context-menu";


    menu.innerHTML = ''


    
    // position at mouse click
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.zIndex = "1000";
    menu.style.width = "350px";
    menu.style.cursor = "pointer"; 
    menu.style.fontSize = "17px";
    menu.style.maxHeight = "400px";
    menu.style.overflowY = "auto";

     // 🔍 Search input
    const searchItem = document.createElement("li");
    searchItem.className = "list-group-item p-1 ps-2";
    searchItem.innerHTML = `
        <input 
            type="text" 
            class="form-control form-control-sm"
            placeholder="Search project..."
        />
    `;
    menu.appendChild(searchItem);


    const searchInput = searchItem.querySelector("input");
    
    // Project list items
    ALL_PROJECTS.forEach(element => {
        const li = document.createElement("li");
        li.className = "list-group-item small p-1 fw-medium project-item";
        li.dataset.prjid = element.ID;
        li.dataset.name = element.Project_Name.toLowerCase();
        li.textContent = element.Project_Name;
        menu.appendChild(li);
    });

    prjName.appendChild(menu);


    // 🔍 Filter logic
    searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll(".project-item").forEach(item => {
            item.style.display = item.dataset.name.includes(value)
                ? "block"
                : "none";
        });
    });

    // handle menu item click
    menu.addEventListener("click", function (e) {
        e.stopPropagation();

        if (e.target.classList.contains("project-item")) {
            document.getElementById("cls-btn-main-modal").click();

            const selectedPrjID = e.target.dataset.prjid;
            setTimeout(() => {
                openModal(selectedPrjID, null);
            }, 500);

            menu.remove();
        }
    });

    // close menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });

}



function editPreparer(PID,type, event){

    console.log(ITR_TEAM, BTR_TEAM, INC_TEAM)

    // if(!type){
    //     alert("Project does not have Project type")
    //     return;
    // }

    event.preventDefault();
    event.stopPropagation(); // 🔥 prevents td click
    const td = document.getElementById(`prj-preparer-${PID}`);

    document.querySelectorAll(".custom-context-menu").forEach(m => m.remove());
    const menu = document.createElement("ul");
    menu.className = "list-group custom-context-menu";

    if(type.includes("Individual")){
        ITR_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        })                                                                                                
    } else if(type.includes("Business")){
        BTR_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    } else if(type.includes("Payroll")){
        PAYROLL_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    } else if(type.includes("Bookkeeping")){
        BOOKKEEPING_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    }else if(type.includes("Sales")){
        SALESTAX_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    }else if(type.includes("Incorp")){
        INC_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    }
    else{
        menu.innerHTML =`<li class="list-group-item small  p-1 disabled">No Data</li>`
    }

    

    // position at mouse click
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.zIndex = "1000";
    menu.style.width = "150px";
    menu.style.cursor = "pointer"; 

    td.appendChild(menu);

    // handle menu item click
    menu.addEventListener("click", function (e) {
        e.stopPropagation(); // 🔥 stops td click
        if (e.target.tagName === "LI") {

            td.innerHTML =`<div class="spinner-border spinner-border-sm text-secondary" role="status">
                                 <span class="visually-hidden">Loading...</span>
                            </div>`;
            
            const selectedStatus = e.target.dataset.status;
            const selectedname = e.target.dataset.ename;

            const config = {
                appName: "zenfirm",
                reportName: "My_Team_Projects", 
                id : PID,
                data : {
                    data:{
                        Preparer : selectedStatus
                    }
                } 
            };

            ZOHO.CREATOR.API.updateRecord(config).then(function(response){
                console.log(response)
                if(response.code == 3000){
                    console.log("Preparer updated successfully");
                    td.innerHTML = `${selectedname}`

                } 
            }).catch(e => console.log(e))

            console.log(selectedStatus, config)

            menu.remove();
        }
    });

    // close menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });

}



function editReviewer(PID,type,event){

    event.preventDefault();
    event.stopPropagation(); // 🔥 prevents td click
    const td = document.getElementById(`prj-reviewer-${PID}`);

    document.querySelectorAll(".custom-context-menu").forEach(m => m.remove());
    const menu = document.createElement("ul");
    menu.className = "list-group custom-context-menu";

        if(type.includes("Individual")){
        ITR_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        })                                                                                                
    } else if(type.includes("Business")){
        BTR_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    } else if(type.includes("Payroll")){
        PAYROLL_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    } else if(type.includes("Bookkeeping")){
        BOOKKEEPING_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    }else if(type.includes("Sales")){
        SALESTAX_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    }else if(type.includes("Incorp")){
        INC_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    }
    else{
        menu.innerHTML =`<li class="list-group-item small  p-1 disabled">No Data</li>`
    }

    // position at mouse click
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.zIndex = "1000";
    menu.style.width = "150px";
    menu.style.cursor = "pointer"; 

    td.appendChild(menu);

    // handle menu item click
    menu.addEventListener("click", function (e) {
        e.stopPropagation(); // 🔥 stops td click
        if (e.target.tagName === "LI") {

            td.innerHTML =`<div class="spinner-border spinner-border-sm text-secondary" role="status">
                                 <span class="visually-hidden">Loading...</span>
                            </div>`;
            
            const selectedStatus = e.target.dataset.status;
            const selectedname = e.target.dataset.ename;

            const config = {
                appName: "zenfirm",
                reportName: "My_Team_Projects", 
                id : PID,
                data : {
                    data:{
                        Reviewer : selectedStatus
                    }
                } 
            };

            ZOHO.CREATOR.API.updateRecord(config).then(function(response){
                console.log(response)
                if(response.code == 3000){

                    console.log("Rewiwer updated successfully");
                    td.innerHTML = `${selectedname}`

                } 
            }).catch(e => console.log(e))

            console.log(selectedStatus, config)

            menu.remove();
        }
    });

    // close menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });

}


function editPeerReviewer(PID, type, event){

    event.preventDefault();
    event.stopPropagation(); //🔥 prevents td click

    const td = document.getElementById(`prj-peerreviewer-${PID}`);
    document.querySelectorAll(".custom-context-menu").forEach(m => m.remove());
    const menu = document.createElement("ul");
    menu.className = "list-group custom-context-menu";

    if(type.includes("Individual")){
        ITR_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        })                                                                                                
    } else if(type.includes("Business")){
        BTR_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    } else if(type.includes("Payroll")){
        PAYROLL_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    } else if(type.includes("Bookkeeping")){
        BOOKKEEPING_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        })
    }else if(type.includes("Sales")){
        SALESTAX_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    }else if(type.includes("Incorp")){
        INC_TEAM.forEach(element => {
            menu.innerHTML += `<li class="list-group-item small  p-1" data-status="${element.ID}" data-ename="${element.display_value}">${element.display_value}</li>`;
        }) 
    }
    else{
        menu.innerHTML =`<li class="list-group-item small  p-1 disabled">No Data</li>`
    }

    // position at mouse click
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.zIndex = "1000";
    menu.style.width = "150px";
    menu.style.cursor = "pointer"; 

    td.appendChild(menu);

    // handle menu item click
    menu.addEventListener("click", function (e) {
        e.stopPropagation(); // 🔥 stops td click
        if (e.target.tagName === "LI") {

            td.innerHTML =`<div class="spinner-border spinner-border-sm text-secondary" role="status">
                                 <span class="visually-hidden">Loading...</span>
                            </div>`;

            const selectedStatus = e.target.dataset.status;
            const selectedname = e.target.dataset.ename;

            const config = {
                appName: "zenfirm",
                reportName: "My_Team_Projects", 
                id : PID,
                data : {
                    data:{
                        Peer_Reviewer : selectedStatus
                    }
                } 
            };

            ZOHO.CREATOR.API.updateRecord(config).then(function(response){
                console.log(response)
                if(response.code == 3000){
                    console.log("Peer Rewiwer updated successfully");
                    td.innerHTML = `${selectedname}`
                } 
            }).catch(e => console.log(e))

            console.log(selectedStatus, config)

            menu.remove();
        }
    });

    // close menu on outside click
    document.addEventListener("click", () => {
        menu.remove();
    }, { once: true });

}