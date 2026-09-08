let acc = null;
// notes-category-button

const notesForm = () =>{

    const form = /* HTML */ `

    <section class="mx-5 px-5">
        <div class="d-flex flex-row align-items-center mb-4">
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            
            <label class="form-label" for="form3Example1c">Project Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control" readonly value="${selectedProjectName}" />

          </div>
        </div>

        <div class="d-flex flex-row align-items-center mb-4">
          
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            
            <label class="form-label" for="notes">Notes <span class="text-danger">*</span></label>
            <textarea name="notes" class="form-control" rows="5" placeholder="Notes..." id="notesonProjectTextarea"></textarea>
            
          </div>
        </div>

        <div class="text-center">
          <button class="btn btn-primary ms-5" onclick="addNotesOnProject()">Submit</button>
        </div>

    </section>`

    return form;
}

function addNotesOnProject(){

        const noteContent = document.getElementById("notesonProjectTextarea").value.trim();

        if(!noteContent){
            return;
        }

        var config = {
             appName :APP_NAME,
             formName : "Notes",
             data : {
                data : {
                    Note: noteContent,
                    Project: selecteProject,
                    Added_by: USERID
                }
             }
        }

        ZOHO.CREATOR.API.addRecord(config).then(function(response){
            console.log(response, config);
            if(response.code == 3000){

                console.log("Record added successfully");
                document.getElementById("offcanvas-cls-btn").click();
                populateNotes(selecteProject);

            }
        }).catch(e=> console.log(e))


}



function populateAccountNotes() {

    const notesSec = document.getElementById("account-notes-sec");
    notesSec.innerHTML = '';

    document.getElementById("notes-category-button").innerText = "Account Notes";

    const config = {
        appName: "zenfirm",
        reportName: "All_Notes",
        criteria : `(Accounts.ID == ${acc})`
    };

    ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
            console.log('✅ Notes report', response.data);

            const allNotes = response.data;

            allNotes.forEach(element => {
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
                </div>`
            })


    }).catch(error => {

          notesSec.innerHTML = `
              <p class="text-center text-muted lead my-3">No Notes added for this Account...</p>`;
            console.error('Error loading discussions:', error);
            
    });
}