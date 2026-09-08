let timerInterval;



async function startTaskTimer(TID){

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();

    const formattedDate = `${mm}-${dd}-${yyyy}`;


    const startBtn = document.getElementById(`str-btn-${TID}`);
    const stopBtn = document.getElementById(`stp-btn-${TID}`);
    const startTimeStr = new Date().toLocaleTimeString("en-IN", {hour12: false,});

    if(sessionStorage.getItem("LL")){
        
        const LL = sessionStorage.getItem("LL");
        const TID = sessionStorage.getItem("TID");
        console.log("OTHER TASK IS RUNNING", LL, TID);
        await stopTaskTimer(TID, LL)
        console.log("AFTER AWAIT")

        setTimeout(() => {
            startTimeApi()
        }, 2000);

    }else{


            startTimeApi()
            startBtn.classList.add("d-none")
            stopBtn.classList.remove("d-none")
 
    }


    function startTimeApi(){


        var config = {
            appName: "zenfirm",
            reportName: "Task_Report",
            id: TID,
            data: {
                data: {
                    Run_Time: true,
                }
            }
        };

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {

            console.log(response, config)
            if (response.code == 3000) {
                console.log("Run_Time updated successfully");
                setTimeout(() => {

                    populateTasks(selecteProject, USERID)
                    
                }, 500);


            }
        }).catch(function (err) {

                console.log("Error Updateing Run_Time failed", err);
        });









    // var logUpdateConfig = {
    //     appName: "zenfirm",
    //     formName: "Logs",
    //     data: {
    //         data : {
    //             Work_Started: startTimeStr,
    //             Task: TID,
    //             Date_field: formattedDate,
    //         }
    //     }
    //   };

    //   ZOHO.CREATOR.API.addRecord(logUpdateConfig).then(function (logUpdateResponse){
    //     if (logUpdateResponse.code == 3000) {
    //         console.log("Log Start Time added successfully",startTimeStr,formattedDate,logUpdateResponse);
    //         const lastLogId = `${logUpdateResponse.data.ID}-${startTimeStr}`
    //       } else {
    //         console.log("Error adding record:", logUpdateResponse);
    //       }
    //     })
    //     .catch(function (err) {
    //       console.log("Request failed", err);
    //     });

    }
}

function stopTaskTimer(TID, LL){


    clearInterval(timerInterval);

    // const [logId, logTime] = LL.split("-");


    // const endTimeStr = new Date().toLocaleTimeString("en-IN", {hour12: false,});
    
    // const totalWorkedStr = calculateTimeDifference2(logTime, endTimeStr);

    // const [h,m,s] = totalWorkedStr.split(":");

    // const totalWorked = `${h}h ${m}m`

    // var config = {
    //   appName: "zenfirm",
    //   reportName: "All_Logs",
    //   id: logId,
    //   data:  {
    //         data: {
    //             Work_Ended: endTimeStr,
    //             Hours_Worked: totalWorked,
               
    //         }
    //     }
    // };
    // console.log(config)
    // ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
    //   if (response.code == 3000) {
    //     console.log("End Time and Worked Hours updated successfully");


        
    //   } else {
    //     console.log("error", response);
    //   }
    // });

        const config = {
            appName: "zenfirm",
            reportName: "Task_Report",
            id: TID,
            data: {
                data: {
                    Run_Time: false,
                }
            }
        };

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
            if (response.code == 3000) {
                sessionStorage.removeItem("LL");
                sessionStorage.removeItem("TID");
                populateTasks(selecteProject, USERID);
                console.log("Run_Time updated as false successfully and the myLastLogId is");
                
            }
        });
}




function startTimer(TID) {

    const timer = document.getElementById(`taskTimer-${TID}`);

    let start = Date.now();
    timerInterval = setInterval(function () {
        let elapsed = Date.now() - start;
        let hours = Math.floor(elapsed / 3600000);
        let minutes = Math.floor((elapsed % 3600000) / 60000);
        let seconds = Math.floor((elapsed % 60000) / 1000);
        timer.innerText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);

}

function onLoadRun(TID, LL){

    if(!TID || !LL){
        return;
    }

    sessionStorage.setItem("LL", LL);
    sessionStorage.setItem("TID", TID);

    const timer = document.getElementById(`taskTimer-${TID}`);

    const [logId, logTime] = LL.split("-");

    const currentTime = new Date().toLocaleTimeString("en-IN", {hour12: false,});

    const calculateInitialOffest = calculateTimeDifference2(logTime,currentTime);
    const [h, m, s] = calculateInitialOffest.split(":").map(Number);
    let initialOffset = (h * 3600 + m * 60 + s) * 1000;
    let start = Date.now() - initialOffset;
    timerInterval = setInterval(function () {
        let elapsed = Date.now() - start;
        let hours = Math.floor(elapsed / 3600000);
        let minutes = Math.floor((elapsed % 3600000) / 60000);
        let seconds = Math.floor((elapsed % 60000) / 1000);
        timer.innerText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
}

function returnTaskTimer(TID, EID, TS, RUN, LL){

    if(!TID, !EID){
        return " "
    }

    if(TS === "Completed" || TS === "Approved" ){

        return " ";

        const prev = `<div class=" p-2 py-1 rounded-3 border border-secondary" style="opacity:0.5">
                    <span class="" >00:00:00</span> 
                    <i class="bi bi-play-circle-fill" ></i>
                </div>`
    }

    if(RUN === "true"){

        setTimeout(() => {
            onLoadRun(TID,LL);
        }, 200);
        

        return `<div class=" p-2 py-1 rounded-3 border border-secondary">
                    <span class="" id="taskTimer-${TID}">00:00:00</span> 
                    <i id="str-btn-${TID}" class="bi bi-play-circle-fill d-none" onclick="startTaskTimer('${TID}')"></i>
                    <i id="stp-btn-${TID}" class="bi bi-pause-circle-fill" onclick="stopTaskTimer('${TID}','${LL}')"></i>
                </div>`
    }

    if(EID === USERID){

        return `<div class=" p-2 py-1 rounded-3 border border-secondary">
                    <span class="" id="taskTimer-${TID}">00:00:00</span> 
                    <i id="str-btn-${TID}" class="bi bi-play-circle-fill" onclick="startTaskTimer('${TID}')"></i>
                    <i id="stp-btn-${TID}" class="bi bi-pause-circle-fill d-none" onclick="stopTaskTimer('${TID}')"></i>
                </div>`

    }

    return ' '
        
}


function calculateTimeDifference2(startTime, endTime) {
    const [sh, sm, ss] = startTime.split(":").map(Number);
    const [eh, em, es] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(sh, sm, ss);

    const end = new Date();
    end.setHours(eh, em, es);

    let diffInSeconds = Math.floor((end - start) / 1000);

    if (diffInSeconds < 0) diffInSeconds += 24 * 3600; // handle crossing midnight

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}:${minutes}:${seconds}`;
}
