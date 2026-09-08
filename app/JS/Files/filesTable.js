
function filesTableView(TID, type=null){

    const filesTable = document.getElementById("files-table-view");
    filesTable.innerHTML = ''

    let cri =  `(Project.ID == ${TID})`

    if(type){
        cri =  `(Project.ID == ${TID} && File_Type == "${type}")`
    }

    let config = {
        appName: "zenfirm",
        reportName: "All_Files",
        criteria : cri
    };

  ZOHO.CREATOR.API.getAllRecords(config).then(function (res) {

      if (res.code === 3000) {
        console.log("✅ Files report:", res.data);

        // document.getElementById("current-nested-folder").innerHTML =`<i class="bi bi-chevron-right"></i> ${res.data[0].Task.display_value}`


       

       res.data.forEach(f => {

            const [trash, filename2] = f.File_field.split("=");
            const fileName = filename2.split('_').slice(1).join('_');
            const format = fileName.slice(-5);
            const [slug,fileFormat] = format.split(".");


            const [kuppai, url] = f.File_field.split('All_Files/');
            const [fileIdda, kuppa] = url.split('/File_field/');

            console.log("All_Files/",fileIdda)

            const previewUrl = `https://pdf-preview-html.vercel.app/?url=https://creator.zoho.com/publishapi/v2/zentegra/zenworkr/report/All_Files/${fileIdda}/File_field/download?privatelink=KT5fdg81hVaR9xhd5M8VtmNsTQT7Q8OGUuZUqUHS1Z8KCNJ69WnTBRREdGdw6fUrNNTmnq2AbStZ0Xwqq0VbT8RJ4XkWeAyQTKjK`

      
            let icon = ''

            let imageURL = [];

            switch (fileFormat) {
                case "pdf":
                  icon = "bi-file-earmark-pdf";
                  break;
                case "png":
                  icon = "bi-image";
                  imageURL.push(f.File_field);
                  break;
                case "jpg":
                  icon = "bi-image";
                  imageURL.push(f.File_field);
                  break;
                default:
                  icon = "bi-file-text";
              }
        
            filesTable.innerHTML+=`
              <tr>
                  <td class="px-0" style="width:3%;"><span><input class="form-check-input" type="checkbox" value=""></span></td>
                  <td ><div class="d-flex align-items-center"><span class="file-table-icon ${fileFormat}"><i class="bi ${icon}"></i></span><span class="ms-2">${fileName}</span></div></td>
                  <td class="text-muted"><small>${f.Added_Time}</small></td>
                  <td class="text-muted"><small>${f.Added_User}</small></td>
                  <td style="width:5%"><a class="text-decoration-none text-dark" href="https://zenworkr.zohocreatorportal.com${f.File_field}"><i class="bi bi-download fs-6"></i></a></td>
                  <td style="width:5%"><a class="text-decoration-none text-danger cursor-pointer" onclick="deleteFile('${f.ID}', '${TID}')"><i class="bi bi-trash text-danger fs-6"></i></a></td>
                  <td style="width:5%"><i class="bi bi-eye text-primary cursor-pointer" onclick="previewFile('${previewUrl}', '${fileName}', '${imageURL}')"></i></td>
              </tr>`
       });
      } else {
        return;
      }

  }).catch(e=> {
    console.log(e,config)
    filesTable.innerHTML = `<tr><td colspan="7"><p class="lead text-center text-muted">Empty Folder</p></td> </tr>`
  })

}



function filesRightSideView(type){

    

  if(type === "toClients"){

    document.getElementById('current-opened-folder').innerText = 'Files To Clients'

    const value = "Files To Clients";

    let tst =` <input type="file" id="fileInputToClient">
    <button class="btn btn-primary btn-sm" onclick="uploadFile('${value}',this)"> Upload</button>
                           `

    document.getElementById("upload-file-div").innerHTML = tst;
  
    filesTableView(selecteProject, "Files To Clients")
  
  }

  if(type === "fromClients"){

    document.getElementById('current-opened-folder').innerText = 'Files From Clients'

    const value = "Files From Clients";

    let tst =` <input type="file" id="fileInputToClient">
    <button class="btn btn-primary btn-sm" onclick="uploadFile('${value}',this)"> Upload</button>
                           `

    document.getElementById("upload-file-div").innerHTML = tst;
  
    filesTableView(selecteProject, "Files From Clients")

  }

  if(type === "workingFiles"){

    console.log("WORKING FILES CLICKED!!!")

    document.getElementById('current-opened-folder').innerText = 'Working Files'

    const value = "Working Files";

    let tst =` <input type="file" id="fileInputToClient">
    <button class="btn btn-primary btn-sm" onclick="uploadFile('${value}',this)"> Upload</button>
                           `

    document.getElementById("upload-file-div").innerHTML = tst;
  
    filesTableView(selecteProject, "Working Files")

  }



}









function uploadFile(value, btn){

  console.log("UPLOAD files function", selecteProject,value)
  const fileObj  = document.getElementById("fileInputToClient").files[0];

  if(!fileObj){
    console.log("Terminated")
    alert("Choose file before upload")
    return;
  }

  btn.disabled = true;
  btn.innerHTML= `<div class="spinner-border spinner-border-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div> Loading`

  var config = {
      appName : "zenfirm",
      formName : "Files",
      data : {
        data: {

          Project: selecteProject,
          File_Type: value.toString()
        }
      }
  }
  ZOHO.CREATOR.API.addRecord(config).then(function(response){
    console.log(response)
        if(response.code == 3000){
          console.log("Record added successfully", response);
          console.log("ID is", response.data.ID);

            var configf = { 
                appName : "zenfirm",
                reportName : "All_Files", 
                id : response.data.ID,
                fieldName : "File_field",
                file : fileObj
            } 
            ZOHO.CREATOR.API.uploadFile(configf).then(function(responsef){
              console.log("File uploaded successfully");

                var config = {
                    appName : "zenfirm",
                    reportName : "All_Files", 
                    id : response.data.ID,
                    data : {
                      data: {

                        Project: selecteProject,
                        File_Type: value.toString()
                      }
                    }
                }

               ZOHO.CREATOR.API.updateRecord(config).then(function(response){
                  console.log(response)
                  if(response.code == 3000){
                    console.log("Record updated successfully", response);
                    document.getElementById("fileInputToClient").value = "";
                    filesTableView(selecteProject, value.toString())

                    btn.disabled = false;
                    btn.innerHTML= "Upload"

                  }
                })

            });

        }
  }).catch(e => console.log(e))

}

function deleteFile(FID, TID){

  const config = {
    appName: "zenfirm",
    reportName: "All_Files",
    criteria : `(ID == ${FID})`
  };
  ZOHO.CREATOR.API.deleteRecord(config).then(function(response){
    console.log("Record has been deleted", response);
    if(response.code === 3000){
      //deleted post logic
      filesTableView(selecteProject, "Files To Clients")
    }
  });
}
