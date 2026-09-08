const phaseForm = () => {


    return /* html */ `

   <section class="mx-5 px-5">

        <div class="d-flex flex-row align-items-center mb-4">
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            <label class="form-label" for="form3Example1c">Project Name <span class="text-danger">*</span></label>
            <input type="text" id="phaseProjectName" class="form-control" readonly value="${selectedProjectName}" />
          </div>
        </div>

        <div class="d-flex flex-row align-items-center mb-4">
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            <label class="form-label" for="form3Example1c">Phase Name <span class="text-danger">*</span></label>
            <input type="text" id="phaseName" class="form-control" />
          </div>
        </div>

        <div class="d-flex flex-row align-items-center mb-4">
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            <label class="form-label" for="form3Example1c">Description </label>
            <textarea type="text" id="phaseDescription" class="form-control" > </textArea>
          </div>
        </div>

        <div class="d-flex flex-row align-items-center mb-4">
          <div data-mdb-input-init class="form-outline flex-fill mb-0">
            <label class="form-label" for="form3Example3c">Phase Owner <span class="text-danger">*</span></label>
            ${rtnReporteeSelect()}
          </div>
        </div>
        
        <br>

        <div class="text-center">
          <button class="btn btn-primary ms-5" onclick="addPhase()">Phase Task</button>
        </div>

    </section>
    
    `
}


const addPhase = () => {

    const phaseName = document.getElementById("phaseName").value;
    const description = document.getElementById("phaseDescription").value;
    const phaseOwner = document.getElementById("task-assigneeselect").value;

    let formData = {

        data : {
            Project_Name :selecteProject,
            Phase_Name : phaseName.trim(),
            Owner : phaseOwner,
            Priority : "Low",
        }

    }

    if(description) formData.data.Description = description;

    var config = {
        formName : "Milestone",
        data : formData
    }

    ZOHO.CREATOR.API.addRecord(config).then(function(response){
      console.log(response)
       if(response.code == 3000){
              console.log("Record added successfully");
              populateMilestones(selecteProject);
              document.getElementById("offcanvas-cls-btn").click();
              
        }
    });

    console.log(config)

}