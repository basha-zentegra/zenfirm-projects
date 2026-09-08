const EMPDATA = [];
let BREAKDATA = [];
let CHECKINREPORT = [];
var LOGEDINUSER= '';
let USERNAME = '';
let USERID = '';
let totalBreakTaken = '';
let totalHoursWorked = '';
let TASKS = [];
let Shift = '';
let AllLeaveBalance = []
let LeaveBalanceLine = []
let Approvals = [];
let Logs = null;
let MyReporties = null;
let ReportiesCheckin = null;
let ReportiesBreak = null;
let showReporties = false;


const Checkin_Date = new Date().toISOString().split("T")[0];

const USERIDLOCAL = localStorage.getItem("USERID")

//support variables
let checkInReport1 = []

const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const mmm = monthNames[today.getMonth()];
const yyyy = today.getFullYear();

const DATETODAY = `${dd}-${mmm}-${yyyy}`;
console.log(DATETODAY); // Example output: 01-Jul-2025

const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
console.log(formattedDate); // e.g., "23/07/2025"

const firstDateOfMonth = `01-${monthNames[today.getMonth()]}-${today.getFullYear()}`;
console.log(firstDateOfMonth); // e.g., "01-Jul-2025"


//api

ZOHO.CREATOR.init().then(function() {
    console.log("Zoho Creator SDK initialized");

    try {
        const response = window.ZOHO.CREATOR.UTIL.getInitParams();
        console.log("✅ UTIL Response:", response);
        LOGEDINUSER = response?.loginUser || null;
        console.log("LOGEDINUSER, ", LOGEDINUSER)
      
      } catch (error) {
        console.error("❌ Error Getting Init Params:", error);
      }

    //fetch Emp Details
    const employeeConfig = {
      appName: "zenworkr",
      reportName: "All_Employee",
      criteria : `(Email == "${LOGEDINUSER}")`,
    };
    
    ZOHO.CREATOR.API.getAllRecords(employeeConfig).then((response) => {
        console.log("✅Employee Response:", response.data);
        const empdata = response?.data || [];
        empdata.forEach(element => {
            // console.log(element?.Email)
            if (element?.Email === LOGEDINUSER){
                EMPDATA.push(element)

            }
        });
        const loggedInEmp = response.data.find(
            emp => emp.Email === LOGEDINUSER
        );

        USERID = response.data.find(e => true)?.ID;

        USERNAME = response.data.find(e => true)?.Name;

        Shift = loggedInEmp.Shift_Form.display_value


        console.log("✅",USERID, USERNAME)
        localStorage.setItem("USERID", USERID)

    }).catch((error) => console.error("❌ Error Fetching Employee Data:", error))

    window.fetchMyReporties = function(){
        //fetch fetch My Reporties Details
        const employeeConfig = {
            appName: "zenworkr",
            reportName: "My_Team_Employees",
            criteria : `(Reporting_To.ID == ${USERIDLOCAL})`,
        };
    
        ZOHO.CREATOR.API.getAllRecords(employeeConfig).then((response) => {
            console.log("✅ My Reporties Response:", response.data);

           MyReporties = response?.data || [];
           const reportiesTab = document.getElementById("reporties-tab");
           const reportiesSection = document.getElementById("reporties");
           const tasksTab = document.getElementById("tasks-tab");
           const taskSection = document.getElementById("tasks");
           if(MyReporties.length > 0){
                showReporties = true
                
                reportiesTab.classList.remove("d-none");
                tasksTab.classList.remove("active");
                reportiesTab.classList.add("active");
                reportiesSection.classList.remove("d-none");
                taskSection.classList.remove("show");
                taskSection.classList.remove("active");
           }

        }).catch((error) => console.error("❌ Error Fetching My Reporties Data:", error))
    }
    fetchMyReporties()

    window.fetchAllBreaks = function () {
        
        BREAKDATA = [];

        const breakConfig = {
            appName: "zenworkr",
            reportName: "All_Breaks",
            criteria : `(Date_field == '${DATETODAY}' && Employee.ID == ${USERIDLOCAL})`,
        };
        
        ZOHO.CREATOR.API.getAllRecords(breakConfig).then((response) => {

            console.log("✅Break response", response.data)

            const breakData = response?.data || [];

            breakData.forEach(element => {
        
                    BREAKDATA.push(element)

            });

        }).catch((error) => console.error("❌ Error Fetching Breaks of the Day:", error))
    }
    fetchAllBreaks()


    window.fetchReportiesBreak = function () {

        const breakConfig = {
            appName: "zenworkr",
            reportName: "All_Breaks",
            criteria : `(Date_field == '${DATETODAY}')`,
        };
        
        ZOHO.CREATOR.API.getAllRecords(breakConfig).then((response) => {

            console.log("✅ Reporties Break response", response.data)

            ReportiesBreak = response?.data || [];


        }).catch((error) => console.error("❌ Error Fetching Breaks of the Day:", error))
    }
    fetchReportiesBreak()

    window.fetchAllTasks = function () {
        //fetch Break Logs
        const breakConfig = {
            appName: "zenworkr",
            reportName: "Task_Report",
            criteria : `(Assignee.ID == ${USERIDLOCAL} && Task_Date == '${DATETODAY}')`
        };
        
        ZOHO.CREATOR.API.getAllRecords(breakConfig).then((response) => {

            console.log("✅Task response", response.data)

            TASKS = response?.data || [];
            // const todayMyTasks = TASKS.filter(t => t.Assignee.ID === USERID && t.Task_Date === dateNow()) || [];

            refreshTasks(TASKS);

        }).catch((error) => {
            console.error("❌ Error Fetching Task of the Day:", error)
            
        });
    }
    fetchAllTasks()


    window.fetchAllLeaveBalances = function () {
        // AllLeaveBalance = [];

        //fetch Break Logs

        const leaveConfig = {
            appName: "zenworkr",
            reportName: "All_Leave_Balances",
            criteria : `(Employee.ID == ${USERIDLOCAL})`
        };
        
        ZOHO.CREATOR.API.getAllRecords(leaveConfig).then((response) => {

            console.log("✅All leave balance response", response.data)
            const leaveData = response?.data || [];
            leaveData.forEach(element => {
                AllLeaveBalance.push(element)
            });

        }).catch((error) => console.error("❌ Error Fetching My Leave Balance:", error))
    }
    fetchAllLeaveBalances();

    window.fetchLeaveBalanceLine = function () {
        // LeaveBalanceLine = [];

        //fetch Break Logs

        const leaveConfig = {
            appName: "zenworkr",
            reportName: "Leave_Balance_Line_Items_Report",
            // criteria : `(Employee.ID == ${USERIDLOCAL})`
        };
        
        ZOHO.CREATOR.API.getAllRecords(leaveConfig).then((response) => {

            console.log("✅Leave balance Line", response.data)
            const leaveData = response?.data || [];
            leaveData.forEach(element => {
                LeaveBalanceLine.push(element)
            });

        }).catch((error) => console.error("❌ Error Fetching Task of the Day:", error))
    }
    fetchLeaveBalanceLine();

    window.fetchApprovals = function () {
        // Approvals = [];


        const leaveConfig = {
            appName: "zenworkr",
            reportName: "Team_Leave_Approvals",
            criteria : `(Employee_Name.ID == ${USERIDLOCAL})`
        };
        
        ZOHO.CREATOR.API.getAllRecords(leaveConfig).then((response) => {

            console.log("✅✅Approval Response", USERIDLOCAL, response.data)
            const approvalData = response?.data || [];
            approvalData.forEach(element => {
                Approvals.push(element)
            });

        }).catch((error) => console.error("❌ Error Fetching Leave Approvals:", error))
    }
    fetchApprovals();

    //fetch today's logs..
    const logsConfig = {
        appName: "zenworkr",
        reportName: "All_Logs",
        criteria : `(Date_field == "${formattedDate}")`,
        
    };

    ZOHO.CREATOR.API.getAllRecords(logsConfig).then(function (logsresponse) {

        console.log("✅✅Log Response", logsresponse.data)
    
         Logs = logsresponse?.data || [];

    }).catch((error) => console.error("❌ Error Fetching Log data:", error))

    //fetch Checkin and Checkout Report
    window.fetchMyCheckinCheckout = function() {
        const checkReportConfig = {
            appName: "zenworkr",
            reportName: "Checking_Check_Out_Form_Report",
            criteria : `(Employee.ID == ${USERIDLOCAL} && Date_field >= '${firstDateOfMonth}')`
        };
        
        ZOHO.CREATOR.API.getAllRecords(checkReportConfig).then((response) => {
            console.log("✅Checkin Checkout Report", response.data);

            CHECKINREPORT = response?.data || [];

            checkInReport1 = CHECKINREPORT.filter((c) => c.Date_field === dateNow());
            console.log("checkInReport1",checkInReport1);

            const totalWorkedtoday = checkInReport1.map(t => t.Total_Worked)
            totalHoursWorked = sumTodayBreak(totalWorkedtoday) || [];

            console.log(totalHoursWorked);

            document.getElementById("hours-worked").innerText = totalHoursWorked;

        }).catch((error) => console.error("❌ Error Fetching Checkin checkout report:", error))
    }

    fetchMyCheckinCheckout();

    window.fetchReportiesCheckin = function() {
        //fetch Checkin and Checkout Report
        const checkReportConfig = {
        appName: "zenworkr",
        reportName: "Copy_of_Check_in_Check_out_History",
        criteria : `(Date_field == '${DATETODAY}')`
        };
        
        ZOHO.CREATOR.API.getAllRecords(checkReportConfig).then((response) => {
            console.log("✅Reporties Checkin Report", response.data);

            ReportiesCheckin = response?.data || [];

            

        }).catch((error) => console.error("❌ Error Fetching Checkin checkout report:", error))
    }
    fetchReportiesCheckin()

    // Add Break start Time
    window.addBreakStart = function () {
        console.log("Break ku poren...");

        const date = dateNow();
        const time = timeNow();

        localStorage.setItem("Break_Start_Time", time)

        const formData = {
            data: {
                Employee: USERID,
                Date_field : date,
                Break: "Start",
                Break_Start_Time: time,
                // Check_Out_Time: "20:20:20"
                
            }
        };

        const config = {
            appName: "zenworkr",
            formName: "Break_Form",
            data: formData
        };

        ZOHO.CREATOR.API.addRecord(config).then(function (response) {
            if (response.code == 3000) {
                console.log("✅ Record added successfully", response.data.ID);
                localStorage.setItem("Break_Start_Id", response.data.ID)
            } else {
                console.error("❌ Zoho error:", response);
            }
            })
            .catch((error) => console.error("❌ API error:", error));
    };

    // Add checkin Data
    window.addCheckIn = function () {
        console.log("Vanakkam da mapla..");

        const date = dateNow();
        const time = timeNow();

        localStorage.setItem("Checkin_Time", time)
        localStorage.setItem("Checkin_Date", new Date().toISOString().split("T")[0])

        console.log(timeNow())

        const formData = {
            data: {
                Employee: USERID,
                Check_In: "check_in",
                Date_field : date,
                Check_In_Time: time,
                // Check_Out_Time: "20:20:20"
                
            }
        };

        const config = {
            appName: "zenworkr",
            formName: "Checking_Check_Out_Form",
            data: formData
        };

        ZOHO.CREATOR.API.addRecord(config).then(function (response) {
            if (response.code == 3000) {
                console.log("✅ Record added successfully", response.data.ID);
                localStorage.setItem("Checkin_Id", response.data.ID)
            } else {
                console.error("❌ Zoho error:", response);
            }
            })
            .catch((error) => console.error("❌ API error:", error));
    };

     // Add checkout Data
    window.addCheckOut = function () {
        
        console.log("Varta mamey durrr...");
        const time = timeNow();
        const checkInID = localStorage.getItem("Checkin_Id");
        const checkInTime = localStorage.getItem("Checkin_Time");
        const totalWorked = getWorkedTime(checkInTime, time);
        const finalTotalWorked = subTime(totalWorked, totalBreakTaken)

        console.log("totalWorked", totalWorked)
        console.log("finalTotalWorked",finalTotalWorked)

        console.log(timeNow())

        const formData = {
            data: {
                Check_In: "check_out",
                Check_Out_Time: time,
                Total_Worked: totalWorked
                
            }
        };

        const config = { 
                appName: "zenworkr",
                reportName : "Checking_Check_Out_Form_Report", 
                id : checkInID,
                data : formData 
        }

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
            if (response.code == 3000) {
                console.log("✅ Record Updated successfully");
            } else {
                console.error("❌ Zoho error:", response);
            }
            })
            .catch((error) => console.error("❌ API error:", error));
    };

     // Add Break end Data
    window.addBreakEnd = function () {
        console.log("Vandhutten");
        const time = timeNow();
        const breakID = localStorage.getItem("Break_Start_Id");
        const breakStartTime = localStorage.getItem("Break_Start_Time");

        const totalWorked = getWorkedTime(breakStartTime, time);
        console.log(totalWorked)

        console.log(timeNow())

        const formData = {
            data: {
                Break: "Stop",
                Break_End_Time: time,
                Total_Break: totalWorked
                
            }
        };

        const config = { 
                appName: "zenworkr",
                reportName : "All_Breaks", 
                id : breakID,
                data : formData 
        }

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
            if (response.code == 3000) {
                console.log("✅ Record Updated successfully");
            } else {
                console.error("❌ Zoho error:", response);
            }
            })
            .catch((error) => console.error("❌ API error:", error));
    };



}).catch(function(error) {
    console.error("Zoho SDK initialization failed:", error);
}); 




function mainFunction(){
    console.log("EMPDATA", EMPDATA)
    console.log("BREAKDATA", BREAKDATA)
    console.log("CHECKINREPORT", CHECKINREPORT)
    console.log("TASKS", TASKS)
    console.log("AllLeaveBalance", AllLeaveBalance)
    console.log("AllLeaveBalance", LeaveBalanceLine)
    console.log("Approvals", Approvals)
    console.log("Logs", Logs)
    console.log("Reporties", MyReporties, ReportiesCheckin)

    // console.table(MyReporties)

    refreshReporties(MyReporties, ReportiesCheckin, ReportiesBreak);


    refreshLogs(Logs);

    refreshApprovals(Approvals);

    refreshAttendance(CHECKINREPORT);

    // refreshAttendance2();


    // const flatData = LeaveBalanceLine.map(item => ({
    //     ID: item.ID,
    //     Leave_Taken: item.Leave_Taken,
    //     Leave_Balance_Form_ID: item.Leave_Balance_Form?.ID
    // }));

    // console.table(flatData, ["ID", "Leave_Taken", "Leave_Balance_Form_ID"]);

    const correctLeaveID = AllLeaveBalance.find(f => true)?.ID;

    const finalLeaves = LeaveBalanceLine.filter(l => l.Leave_Balance_Form.ID === correctLeaveID)

    console.log("finalLeaves", finalLeaves)

    refreshLeaves(finalLeaves);

    refreshProfile(EMPDATA)

    document.getElementById("emp-name").innerText = USERNAME;


    // checkInReport1 = CHECKINREPORT.filter((c) => c.Employee.ID === USERID && c.Date_field === dateNow());
    const breakDataToday = BREAKDATA.filter((b) => b.Employee.ID === USERID && b.Date_field === dateNow());
    const totalBreakToday = breakDataToday.map(t => t.Total_Break)
    // const totalWorkedtoday = checkInReport1.map(t => t.Total_Worked)
    // totalHoursWorked = sumTodayBreak(totalWorkedtoday) || [];
    totalBreakTaken = sumTodayBreak(totalBreakToday) || [];

    
    // document.getElementById("tasks").innerText = todayMyTasks.map(tt => tt.Task_Name)
    
    console.log(sumTodayBreak(totalBreakToday))
    console.log("Break's and Today",breakDataToday[0] || "No Breaks Today")
    //onBreak (otha break is ON and Check In is on)

    if(breakDataToday[0]?.Break === "Start"){

        isActive = true
        isOnBreak = true
        const breakButton = document.getElementById("breakButton");
        breakButton.classList.remove("d-none");
        // breakButton.innerText = 'Resume';
        breakButton.innerHTML = `<i id="break-icon" class="bi bi-play-circle-fill"></i> Resume`;

        const time = timeNow();
        const breakStartTime = localStorage.getItem("Break_Start_Time");

        const totalBreak = getWorkedTime(breakStartTime, time);
        startBreak(timeStringToMilliseconds(totalBreak))

        // //work here.....
        const time2 = timeNow();
        const checkInTime = localStorage.getItem("Checkin_Time");
        const totalWorked = getWorkedTime(checkInTime, time2);
        elapsedTime = timeStringToMilliseconds(totalWorked) - timeStringToMilliseconds(totalBreakTaken) - timeStringToMilliseconds(totalBreak);
        const currentElapsed = Date.now() - timeStringToMilliseconds(totalWorked);
        const currentElapsed2 = Date.now() - currentElapsed;


        if (timeStringToMilliseconds(totalWorked) > timeStringToMilliseconds(totalBreakTaken)){
            updateTimerDisplay(currentElapsed2 - timeStringToMilliseconds(totalBreakTaken) - timeStringToMilliseconds(totalBreak));
        }else{
            updateTimerDisplay(currentElapsed2);
        }

        const button = document.getElementById("toggleTimer");

        button.innerText = "Check Out";
        button.classList.remove("btn-check-in")
        button.classList.add("btn-check-out")

        const cover = document.getElementById("cover-picture")
        cover.classList.remove("cover-in")
        cover.classList.add("cover-break")

        const statusIndicator = document.getElementById("statusIndicator");
        statusIndicator.innerText = "Break";
        statusIndicator.className = "status-indicator status-break";

    }
    //isActive (otha Checkin is ON but Break is not ON)
    if(checkInReport1[0]?.Check_In === "check_in" && breakDataToday[0]?.Break !== "Start"){
        console.log("After refresh... Main taimer is still running......................")
        isActive = true
        const button = document.getElementById("toggleTimer");
        const breakButton = document.getElementById("breakButton");
        button.innerText = "Check Out";
        button.classList.remove("btn-check-in")
        button.classList.add("btn-check-out")
        breakButton.classList.remove("d-none")

        //startFrom logic...
        const time = timeNow();
        const checkInTime = localStorage.getItem("Checkin_Time");

        const totalWorked = getWorkedTime(checkInTime, time);

        if (timeStringToMilliseconds(totalWorked) > timeStringToMilliseconds(totalBreakTaken)){
            startTimer(timeStringToMilliseconds(totalWorked) - timeStringToMilliseconds(totalBreakTaken))
        }else{
            startTimer(timeStringToMilliseconds(totalWorked))
        }

        const statusIndicator = document.getElementById("statusIndicator");
        statusIndicator.innerText = "In";
        statusIndicator.className = "status-indicator status-active";

        const cover = document.getElementById("cover-picture")
        cover.classList.remove("cover-out")
        cover.classList.add("cover-in")
        
    }
    refreshAboutToday(checkInReport1, totalHoursWorked, totalBreakTaken)
    console.log(breakDataToday)    
    
}

function refreshAboutToday(checkInReport1, totalHoursWorked, totalBreakTaken){
    console.log("refreshAboutToday",checkInReport1 )
    const todayTable = `
        <tr>
            <th>Date</th>
            <td>${dateNow()}</td>
        </tr>
        
        <tr>
            <th>Check In</th>
            <td id="check-in-time" >${checkInReport1[checkInReport1.length - 1]?.Check_In_Time || '-'}</td>
        </tr>

        <tr>
            <th>Last Check Out</th>
            <td id="check-out-time">${checkInReport1[0]?.Check_Out_Time || checkInReport1[1]?.Check_Out_Time || '-'}</td>
        </tr>
        
        <tr>
            <th>Hours Worked</th>
            <td id="hours-worked"> ${totalHoursWorked || '-'}</td>
        </tr>
        <tr>
            <th>Break Taken</th>
            <td>${totalBreakTaken || '-'}</td>
        </tr>
    `;

    document.getElementById("today-content").innerHTML = todayTable;
    document.getElementById("loading-animation").className="d-none";
}



function dateNow(){
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;

}
function timeNow(){
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedTime;
}
function timeNow2() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    hours = String(hours).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${ampm}`;
}
function getWorkedTime(start, end) {
    console.log("start->", start)
    console.log("end->", end)
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

  if (totalMinutes < 0) totalMinutes += 24 * 60; // handle cases crossing midnight

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

function timeStringToMilliseconds(timeStr) { //0h 0m --> millisecond
    console.log("timeStr", timeStr)
    const hourMatch = timeStr.match(/(\d+)h/);
    const minMatch = timeStr.match(/(\d+)m/);
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;
    const totalMilliseconds = (hours * 60 + minutes) * 60 * 1000;
    return totalMilliseconds;
}

function sumTodayBreak(timeList) {
  let totalMinutes = 0;

  timeList.forEach(timeStr => {
    const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || 0, 10);
    const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || 0, 10);
    totalMinutes += hours * 60 + minutes;
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${totalHours}h ${remainingMinutes}m`;
}

function subTime(time1, time2) {
  const toMinutes = (timeStr) => {
    const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || 0, 10);
    const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || 0, 10);
    return hours * 60 + minutes;
  };

  let total1 = toMinutes(time1);
  let total2 = toMinutes(time2);

  let diff = total1 - total2;
  if (diff < 0) diff = 0; // prevent negative time

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}h ${minutes}m`;
}


//timer-----------------------------------------------
//timer variables---
let timerInterval = null;
let breakInterval = null;

let isActive = false;
let isOnBreak = false;

let startTime = null;
let breakStartTime = null;

let elapsedTime = 0; 
let breakElapsedTime = 0;

// let onBreak = false;

// const breakBtn = document.getElementById("break-btn")
function toggleTimer() {

    const button = document.getElementById("toggleTimer");
    const statusIndicator = document.getElementById("statusIndicator");
    const breakButton = document.getElementById("breakButton");
    const cover = document.getElementById("cover-picture")
    const checkInTime = document.getElementById("check-in-time");

    button.disabled = true;
    button.style.opacity = "0.6";

    setTimeout(() =>{
        button.disabled = false;
        button.style.opacity = "1";
    },5000)

    
    
    
    if (checkInReport1.length === 0 || checkInReport1[0].Check_In === "check_out") {
        rocketAnimation("#26AD55");
        // Check In - Start the timer
        startTimer(elapsedTime);
        button.innerText = "Check Out";
        button.className = "timer-button btn-check-out";
        statusIndicator.innerText = "In";
        statusIndicator.className = "status-indicator status-active";
        isActive = true;
        addCheckIn();
        if (checkInTime.innerText.trim() === "-") {
            checkInTime.innerText = timeNow2();
        }
        breakButton.classList.remove("d-none") // Show Break button
        cover.className = "cover-in"
        breakButton.classList.remove("d-none") // Show Break button

        setTimeout(() =>{
            fetchMyCheckinCheckout();
        } ,2000)


        
        

    } else {

        rocketAnimation("#E3373A");

        const isBreakIsRunning = localStorage.getItem("isOnBreak");

        //condition write...
        if (isBreakIsRunning){

            breakButton.click();
            console.log("stop the break", isOnBreak)


            // console.warn("Break is on.. But Forcing to Check Out..!!!", isOnBreak)
            // isOnBreak = false;
            // addBreakEnd()
            // localStorage.removeItem("isOnBreak");
        }else{
            console.log("Break is not on.. so Checking out..", isOnBreak)
        }

        // Check Out - Stop the timer
        stopTimer();
        resetTimer()
        // stopBreak();


        //UI
        button.innerText = "Check In";
        button.className = "timer-button btn-check-in";
        statusIndicator.innerText = "Out";
        statusIndicator.className = "status-indicator status-inactive";
        
        isActive = false;
        addCheckOut();
        document.getElementById("check-out-time").innerText = timeNow2();
        const Checkin_Time = localStorage.getItem("Checkin_Time");
        document.getElementById("hours-worked").innerText = '...';
        breakButton.classList.add("d-none") // Hide Break button
        breakButton.innerText = "Break";

        cover.className = "cover-out";

        setTimeout(() => {
            if (localStorage.getItem("Checkin_Time")) {
                localStorage.removeItem("Checkin_Time");
                localStorage.removeItem("Checkin_Id");
                localStorage.removeItem("Checkin_Date")
            }
        }, 1000);

        breakButton.innerHTML = `<i id="break-icon" class="bi bi-pause-circle-fill"></i> Break`;

        

        

        setTimeout(() => {
            if (localStorage.getItem("Break_Start_Time")) {
                localStorage.removeItem("Break_Start_Time");
                localStorage.removeItem("Break_Start_Id")
            }
        }, 1000);

        setTimeout(() =>{
            fetchMyCheckinCheckout();
        } ,2000)

    }
}


function startTimer(startFrom) {
    // Set start time accounting for any previously elapsed time
    startTime = Date.now() - startFrom;
    
    timerInterval = setInterval(function() {
        const currentElapsed = Date.now() - startTime;
        updateTimerDisplay(currentElapsed);
        elapsedTime = currentElapsed; // Keep track of elapsed time
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        console.log("Going INNNN timer interval",timerInterval)
        clearInterval(timerInterval);
        timerInterval = null;
        console.log("After clearInterval",timerInterval)
    }
}

function updateTimerDisplay(milliseconds) {
    // console.log("Milliseconds", milliseconds)
    const taskTimer = document.getElementById("taskTimer");
    
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    taskTimer.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    // updateTimerDisplay(5000000000000000);
    
    const button = document.getElementById("toggleTimer");
    const breakButton = document.getElementById("breakButton");
    const statusIndicator = document.getElementById("statusIndicator");
    
    button.innerText = "Check In";
    button.className = "timer-button btn-check-in";
    statusIndicator.innerText = "Out";
    statusIndicator.className = "status-indicator status-inactive";
    breakButton.innerText = "Break";
    breakButton.classList.add("d-none");

    isActive = false;
    isOnBreak = false;
}


// ✅ Break Timer Logic----------------------------------------
function toggleBreak() {
    const breakButton = document.getElementById("breakButton");
    const breakIcon = document.getElementById("break-icon");
    const cover = document.getElementById("cover-picture")
    const statusIndicator = document.getElementById("statusIndicator");
    breakElapsedTime = 0;

    breakButton.disabled = true;
    breakButton.style.opacity = "0.6";

    setTimeout(() =>{
        breakButton.disabled = false;
        breakButton.style.opacity = "1";
    },5000)

    if (!isOnBreak) {
        // Pause main timer
        console.log("Stop Main timer OFFF aaga pogudhu....")
        stopTimer();
        startBreak(0);
        isOnBreak = true;
        localStorage.setItem("isOnBreak", true)
        console.log("Break is gonna on..", isOnBreak)
        addBreakStart();

        //UI
        breakIcon.className = "bi bi-play-circle-fill";
        breakButton.innerHTML = `<i id="break-icon" class="bi bi-play-circle-fill"></i> Resume`;
        cover.className = "cover-break"
        statusIndicator.innerText = "Break";
        statusIndicator.className = "status-indicator status-break";
    } else {
        // Resume main timer
        stopBreak();
        if(localStorage.getItem("Break_Start_Time")){
            startTimer(elapsedTime);
        }
        
        isOnBreak = false;
        addBreakEnd()


        //UI
        breakIcon.className = "bi bi-pause-circle-fill";
        breakButton.innerHTML = `<i id="break-icon" class="bi bi-pause-circle-fill"></i> Break`;
        cover.className = "cover-in"
        statusIndicator.innerText = "In";
        statusIndicator.className = "status-indicator status-active";

        
        setTimeout(() => {
             fetchAllBreaks();
        }, 1000);

        setTimeout(() => {
            
            const totalBreakToday = BREAKDATA.map(t => t.Total_Break)
            // const totalWorkedtoday = checkInReport1.map(t => t.Total_Worked)
            // totalHoursWorked = sumTodayBreak(totalWorkedtoday) || [];
            const totalBreakTaken2 = sumTodayBreak(totalBreakToday) || [];
            refreshAboutToday(checkInReport1,totalHoursWorked, totalBreakTaken2)
        }, 2000);

        setTimeout(() => {
            if (localStorage.getItem("Break_Start_Time")) {
                localStorage.removeItem("Break_Start_Time");
                localStorage.removeItem("Break_Start_Id")
            }
        }, 1000);

        localStorage.removeItem("isOnBreak");

        
    }
}

function startBreak(startFrom) {
    breakStartTime = Date.now() - startFrom;

    breakInterval = setInterval(() => {
        const currentElapsed = Date.now() - breakStartTime;
        updateBreakDisplay(currentElapsed);
        breakElapsedTime = currentElapsed;
    }, 1000);
}

function stopBreak() {
    clearInterval(breakInterval);
    breakInterval = null;
}

function updateBreakDisplay(milliseconds) {
    const breakTimer = document.getElementById("breakTimer");

    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    breakTimer.innerText = `Break: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Initialize both timers to 00:00:00
updateTimerDisplay(0);
updateBreakDisplay(0);

const interval = setInterval(() => {
    if (EMPDATA.length > 0) {

        setTimeout(() => {
            console.log('This runs after 2 seconds-----------------------------------');
            mainFunction();
        }, 1500);

      clearInterval(interval); 
    }
}, 1000); 


function refreshReporties(MyReporties, ReportiesCheckin, ReportiesBreak) {

    console.log(">>>-Reporties", ReportiesCheckin)

    if (!Array.isArray(MyReporties) || MyReporties.length === 0) {
        return;
    }


    const reporties = document.getElementById("My-reporties");

    let repo = '';

    MyReporties.forEach(r => {
        // const hasCheckedIn = ReportiesCheckin.some(c => c?.Employee?.ID === r.ID && c?.Check_In === "check_in");
        const hasCheckedIn = (ReportiesCheckin || []).some(c => c?.Employee?.ID === r.ID && c?.Check_In === "check_in");
        // const hasCheckedOut = ReportiesCheckin.some(c => c.Employee.ID === r.ID && c.Check_In === "check_out");
        const hasCheckedOut = (ReportiesCheckin || []).some(c => c.Employee.ID === r.ID && c.Check_In === "check_out");
        const isOnBreak = (ReportiesBreak || []).some(b => b.Employee.ID === r.ID && b.Break === "Start");

        const checkinData = ReportiesCheckin.filter(c => c?.Employee?.ID === r.ID).map(i => i.Check_In_Time);
        const checkoutData = ReportiesCheckin.filter(c => c?.Employee?.ID === r.ID).map(i => i.Check_Out_Time);
        const totalTime = ReportiesCheckin.filter(c => c?.Employee?.ID === r.ID).map(i => i.Total_Worked);

        console.log("checkin time", totalTime);

        let statusText = '';
        let statusClass = '';
        let color = '';

        if (hasCheckedIn) {
            if (isOnBreak) {
                statusText = 'Break';
                statusClass = 'text-warning';
                color = '#FF8904'
            } else {
                statusText = 'In';
                statusClass = 'text-checkin';
                color = "#05DF72"
            }
        } else if(hasCheckedOut){
            statusText = 'Out';
            statusClass = 'text-danger';
            color = '#FF6467';
        }
        
        else {
            statusText = 'Absent';
            statusClass = 'text-absent';
            color = '#737373';
        }
//style="width:8%"
        repo += `
            <tr>
                <td>${r.Name}</td> 
                <td>${r.Department.display_value || '-'}</td> 
                <td class="text-center" ><span class="badge" style="background-color:${color};">${statusText}</span></td>
                <td>${checkinData[checkinData.length - 1] || " "}</td>
                <td>${checkoutData?.[0] && checkoutData[0] !== "" ? checkoutData[0] : (checkoutData?.[1] || " ")}</td>
                <td>${sumTodayBreak(totalTime) === "0h 0m" ? " " : sumTodayBreak(totalTime)}</td>
            </tr>
        `;
    });

    reporties.innerHTML = repo;
}



function refreshApprovals(Approvals){
    const approvalsDiv = document.getElementById("approvals")

    let approv = '';

    Approvals.forEach((a) => {
        const appStatus = a.Approval_status;
        approv += `
            <div class="card py-3 my-3">
                <div class="d-flex approvals-responsive">
                    <div class="d-flex justify-content- align-items-center mx-4" >
                        <img src="https://contacts.zoho.com/file?ID=876575575&fs=thumb" alt="" style="border-radius: 10px; width:50px;" >
                        <div class="ms-4">
                            <h5 class="m-0">${a.Employee_Name.display_value}</h5>
                            <p style="font-size: 13px;" class="m-0">has made a <strong>${a.Leave_Type.display_value}</strong> request</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-start align-items-center" >
                        <div class="mx-5">
                            <p class="m-0">Raised On</p>
                            <h6>${ a.From === a.To ? a.From : `${a.From} to ${a.To}` }</h6>
                        </div>
                        ${
                            appStatus === '' ? `${showReporties ? `<div id="btns-${a.ID}">
                                <button class="btn btn-primary" onclick="approveApproval('${a.ID}')">Approve</button>
                                <button class="btn btn-danger" onclick="rejectApproval('${a.ID}')">Reject</button>
                            </div>` : '<div class="text-center"><h6 class="text-warning m-0 ms-5">Pending</h6></div>'}` : `<div class="text-center">
                                <h6 class="text-${appStatus === 'Approved'? 'success': 'danger'} m-0 ms-5">${appStatus}</h6>
                            </div>`

                        }
                    </div>
                </div>
            </div>
            `
    })
    approvalsDiv.innerHTML= approv || `<div class="text-center">
                
                <img width="200px" src="no-timelog.png" alt="">
                <p class="text-dark">No Approvals</p>
                
            </div>`;
}

function approveApproval(ID){
        const formData = {
            data: {
                Approval_status: "Approved",
            }
        };

        const config = { 
                appName: "zenworkr",
                reportName : "Team_Leave_Approvals", 
                id : ID,
                data : formData 
        }

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
            if (response.code == 3000) {
                console.log("✅ Record Updated successfully");
                document.getElementById(`btns-${ID}`).innerHTML = `<div class="text-center">
                            <h6 class="text-success m-0 ms-5">Approved</h6>
                        </div>`
                
            } else {
                console.error("❌ Zoho error:", response);
            }
        })
}

function rejectApproval(ID){
// Rejected

        const formData = {
            data: {
                Approval_status: "Rejected",
            }
        };

        const config = { 
                appName: "zenworkr",
                reportName : "Team_Leave_Approvals", 
                id : ID,
                data : formData 
        }

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
            if (response.code == 3000) {
                console.log("✅ Record Updated successfully");
                document.getElementById(`btns-${ID}`).innerHTML = `<div class="text-center">
                            <h6 class="text-danger m-0 ms-5">Rejected</h6>
                        </div>`
            } else {
                console.error("❌ Zoho error:", response);
            }
        })
}

function refreshLeaves(finalLeaves){

    const leaveBalance = document.getElementById("leaveBalance");


    let leaveType = ''

    finalLeaves.reverse().forEach((l, i) => {

        const leaveName = l.Leave_Type.display_value;
        const leaveBalance = parseFloat(l.Leave_Balance);
        const leaveTaken = parseFloat(l.Leave_Taken);

        const leaveStyles = {"Casual Leave": {icon: "bi-umbrella",bg: "#F6CFFF"},"Sick Leave": {icon: "bi-thermometer-half",bg: "#FFD6D6" },"Floating Leave": {icon: "bi-calendar-event",bg: "#96f7e4d6" }};

        const { icon, bg } = leaveStyles[leaveName] || { icon: "bi-calendar", bg: "#E0E0E0" };


        let displayValue;
        let displayValue2;

        if (Number.isInteger(leaveBalance)) {
             displayValue = leaveBalance.toFixed(0); // no decimals if .00
        } else {
             displayValue = leaveBalance.toFixed(2); // keep 2 decimals if needed
        }

        if (Number.isInteger(leaveTaken)) {
             displayValue2 = leaveTaken.toFixed(0); // no decimals if .00
        } else {
             displayValue2 = leaveTaken.toFixed(2); // keep 2 decimals if needed
        }
        leaveType += `
        
            <div class="col-4">
                <div class="card  mb-0 mx-2 py-4 ps-4" style="border-radius: 25px;">
            

                    <div class="leave-logo ms-1" style="background-color:  ${bg}; "><i class="bi ${icon}"></i></div>
                    <p class="m-0 mt-2 text-uppercase small text-muted fw-semibold">${leaveName}</p>
                    <p class="mb-0 "><span class="fs-2 text-dark fw-semibold">${ displayValue2 }</span> /${ displayValue} Days</p>
                    
                   
                </div>
            </div>
            `
    })

    leaveBalance.innerHTML = leaveType;
    
}

// function refreshLogs(Logs){
//     const timeLog = document.getElementById("time-log");
//     if (!Logs || Logs.length === 0) {
//         timeLog.innerHTML = `
//             <div class="text-center">
//                 <a class="text-decoration-none" href="https://zenworkr.zohocreatorportal.com/#Page:WSM_EMP" target="_blank">
//                     <img width="200px" src="no-timelog.png" alt="">
//                     <p class="text-dark">Work on tasks</p>
//                 </a>
//             </div>
//         `;
//         return;
//     }

//     let row = ''

//     Logs.forEach(l => {
//         row+= `
//             <div class="card py-2 my-2">
//                 <div class="d-flex timelog-div">
//                     <div class="d-flex justify-content- align-items-center mx-4" >
                        
//                         <div>
//                             <h5 class="m-0">${l.Task.display_value}</h5>
//                             <p>${l["Task.Assignee"]}</p>
                            
//                         </div>

//                     </div>
//                     <div class="d-flex justify-content-around ms-2" >
//                         <div class="text-center">
//                             <p class="m-0" style="color:grey">Started</p>
//                             <h6>${l.Work_Started}</h6>
//                         </div>
//                         <div class="text-center">
//                             <p class="m-0" style="color:grey">Finished</p>
//                             <h6>${l.Work_Ended}</h6>
//                         </div>
//                         <div class="text-center">
//                             <p class="m-0" style="color:grey">Total</p>
//                             <h6>${l.Hours_Worked}</h6>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     })
//     timeLog.innerHTML = row;

// }
function refreshLogs(Logs) {
    const timeLog = document.getElementById("time-log");

    if (!Logs || Logs.length === 0) {
        timeLog.innerHTML = `
            <div class="text-center">
                <a class="text-decoration-none" href="https://zenworkr.zohocreatorportal.com/#Page:WSM_EMP" target="_blank">
                    <img width="200px" src="no-timelog.png" alt="">
                    <p class="text-dark">Work on tasks</p>
                </a>
            </div>
        `;
        return;
    }

    // 🔹 Group logs by Assignee
    const grouped = {};
    Logs.forEach(l => {
        const assignee = l["Task.Assignee"] || "Unassigned";
        if (!grouped[assignee]) {
            grouped[assignee] = [];
        }
        grouped[assignee].push(l);
    });

    let content = `<h6 class="text-center">Today's Time Logs</h6>`;

    // 🔹 Build HTML by groups
    Object.keys(grouped).forEach(assignee => {
        content += `

        <h6><i class="bi bi-person"></i> ${assignee}</h6>
            <table class="table  mb-4 table-bordered">
                <thead class="text-white text-indego" >
                    <tr style="background-color: #4e73df !important;">
                        <th class="text-uppercase small text-white text-indego">Task Name</th>
                        <th class="text-uppercase small text-white text-indego" style="width: 15%">Started</th>
                        <th class="text-uppercase small text-white text-indego" style="width: 15%">Finished</th>
                        <th class="text-uppercase small text-white text-indego" style="width: 15%">Total</th>
                    </tr>
                </thead>
                
            
        `;

        grouped[assignee].forEach(l => {
            content += `


            <tr>
                        <td class="">${l.Task.display_value}</td>
                        <td class="small">${l.Work_Started}</td>
                        <td class="small">${l.Work_Ended}</td>
                        <td class="small">${l.Hours_Worked}</td>
            </tr>
                
            
                
            `;
        });

        content += `</table>`; // close assignee group
    });

    timeLog.innerHTML = content;
}

function startTaskTimer2(taskId, lastLogId){

    const taskTimer = document.getElementById(`taskTimer-${taskId}`);

    const [logId, startTime] = lastLogId.split("-");

    const currentTime = new Date().toLocaleTimeString("en-IN", {hour12: false,});

      function calculateTimeDifference3(startTime, endTime) {
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

      const calculateInitialOffest = calculateTimeDifference3(startTime, currentTime);

    //   console.log("calculateInitialOffest", calculateInitialOffest);

      const [h, m, s] = calculateInitialOffest.split(":").map(Number);

    //   console.log(h, m, s);

      let initialOffset = (h * 3600 + m * 60 + s) * 1000;

    //   console.log("initialOffset", initialOffset);

      let start = Date.now() - initialOffset;
      timerInterval = setInterval(function () {
        let elapsed = Date.now() - start;
        let hours = Math.floor(elapsed / 3600000);
        let minutes = Math.floor((elapsed % 3600000) / 60000);
        let seconds = Math.floor((elapsed % 60000) / 1000);
        taskTimer.innerText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }, 1000);

}

let allTaskIDs = [];


function refreshTasks(todayMyTasks) {
    todayMyTasks.forEach(t => {
        allTaskIDs.push(t.ID);
    });

    let isRunning = false;
    let runID = null;

    let RunningTask = todayMyTasks.filter(t => t.Run_Time === "true").map(t => ({ ID: t.ID, Run_Time: t.Run_Time }));

    if (RunningTask.length > 0) {
        isRunning = true;
        runID = RunningTask[0].ID;
    }

    const todayTask = document.getElementById("today-tasks");

    if (!todayMyTasks || todayMyTasks.length === 0) {
        todayTask.innerHTML = `
            <div class="text-center">
                <a class="text-decoration-none" href="https://zenworkr.zohocreatorportal.com/#Page:WSM_EMP" target="_blank">
                    <img width="200px" src="no-data.png" alt="">
                    <p class="text-dark">Add Tasks</p>
                </a>
            </div>
        `;
        return;
    }

    let row = '';

    // Sort tasks by time
    todayMyTasks.sort((a, b) => a.Start_Time_Hours.localeCompare(b.Start_Time_Hours));

    todayMyTasks.forEach(tmt => {
        const taskId = tmt.ID;
        const taskRunning = tmt.Run_Time === "true";
        const lastLogId = tmt?.lastLogId;

        if(taskRunning){
            
            setTimeout(()=>{
                startTaskTimer2(taskId, lastLogId);
            },100)
        }
        
        const startTime = `${tmt.Start_Time_Hours}:${tmt.Start_Time_Mins === '0' ? '00' : tmt.Start_Time_Mins}`;
        const endTime = `${tmt.End_Time_Hours}:${tmt.End_Time_Mins === '0' ? '00' : tmt.End_Time_Mins}`;

        const status = tmt.Task_Status;
        const priority = tmt.Task_Priority;

        

        row += `
        <div class="card my-2" style="background-color:${clrPrio(priority)}">
            <div class="card-body task-card">
                <div>
                    <a style="text-decoration:none; color:inherit;" href="https://zenworkr.zohocreatorportal.com/#Page:WSM_EMP?autoClick=event-box-${tmt.ID}" target="_blank">
                        <h6 class="m-0">${tmt.Task_Name}</h6>
                    </a>
                </div>

                <div class="ms-0 ms-md-4">
                    <span style="font-size: 14px; box-shadow: 0 0 0 0.7px ${clrsts(status)}; border-radius: 15px; padding: 3px 9px; background-color:${clrstsbg(status)};">
                        <i class="bi bi-circle-fill" style="color:${clrsts(status)}"></i> ${status}
                    </span>
                </div>

               
                <span class="border border-dark bordered rounded py-1 px-2 small text-center">
                ${startTime} -> ${endTime} 
                <strong class="bg-white">${totalHours(startTime,endTime)}</strong>
                </span>

                <div class="ps-2 d-flex align-items-center" style="border-radius: 8px; border: 1px solid; padding-top: 2px; padding-bottom: 2px;" >
                    <span class="timer small " id="taskTimer-${taskId}">00:00:00</span>

                    <button id="startTask-${taskId}" 
                            class="btn py-0 border-0 ${taskRunning ? 'd-none' : ''}" 
                            onclick="startTask('${taskId}')"
                            ${(isRunning && runID !== taskId) ? "disabled" : ""}>
                        <i class="bi bi-play-circle-fill"></i>
                    </button>

                    <button id="stopTask-${taskId}" 
                            class="btn py-0 border-0 ${taskRunning ? '' : 'd-none'}" 
                            onclick='stopTask("${taskId}","${lastLogId}")'>
                        <i class="bi bi-stop-circle-fill"></i>
                    </button>
                </div>
                

                
            </div>
        </div>`;

        

    });

    todayTask.innerHTML = row;


}





function startTaskTimer(taskId) {

    console.log("StartTaskTimer function");

    const taskTimer = document.getElementById(`taskTimer-${taskId}`);

    let start = Date.now();
    timerInterval_taskId = setInterval(function () {
        let elapsed = Date.now() - start;
        let hours = Math.floor(elapsed / 3600000);
        let minutes = Math.floor((elapsed % 3600000) / 60000);
        let seconds = Math.floor((elapsed % 60000) / 1000);
        taskTimer.innerText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);

}


function startTask(taskId){

    startTaskTimer(taskId);

    const startBtn = document.getElementById(`startTask-${taskId}`);
    const stopBtn = document.getElementById(`stopTask-${taskId}`)
    startBtn.classList.add("d-none");
    stopBtn.classList.remove("d-none");
    console.log(taskId);

    allTaskIDs.forEach(i => {
        const btn = document.getElementById(`startTask-${i}`);
        if (i !== taskId) {
            btn.disabled = true;
        } 
    });

    const startTimeStr = new Date().toLocaleTimeString("en-IN", {hour12: false,});
    const todayDate = new Date().toLocaleDateString("en-IN", {day: "2-digit",month: "2-digit",year: "numeric",});

    var logUpdateConfig = {
        appName: "zenworkr",
        formName: "Logs",
        data:  {
            data: {
                Work_Started: startTimeStr,
                Task: taskId,
                Date_field: todayDate,
            },
        }
    };

    ZOHO.CREATOR.API.addRecord(logUpdateConfig).then(function (logUpdateResponse) {
      if (logUpdateResponse.code == 3000) {
        console.log("Log Start Time added successfully");
        

        //store Last Log id in Task Form
        const lastLogId = `${logUpdateResponse.data.ID}-${startTimeStr}`;
        updateRunTime(lastLogId);
        
        
      } else {
        console.log("Error adding record:", logUpdateResponse);
      }
    })
    .catch(function (err) {
      
      console.log("Request failed", err);
    });


    //Update Run_Time
    function updateRunTime(lastLogId){


        var config = {
          appName: "zenworkr",
          reportName: "Task_Report",
          id: taskId,
          data: {
            data: {
                Task_Status: "In Progress",
                Run_Time: true,
                lastLogId: lastLogId
            }
          }
        };

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
          if (response.code == 3000) {
           console.log("Run_Time updated successfully");
           fetchAllTasks();
          }
        }).catch(function (err) {
        
             console.log("Error Updateing Run_Time failed", err);
        });

    }

}

function stopTask(taskId, lastLogId){
    clearInterval(timerInterval);
    const startBtn = document.getElementById(`startTask-${taskId}`);
    const stopBtn = document.getElementById(`stopTask-${taskId}`);
    stopBtn.classList.add("d-none");
    startBtn.classList.remove("d-none");
    
    console.log(taskId, lastLogId);

    const [logId, startTime] = lastLogId.split("-");

    let endTimeStr = new Date().toLocaleTimeString("en-IN", { hour12: false });

    const workedTime = calculateTimeDifference2(startTime, endTimeStr)


    var config = {
        appName: "zenworkr",
        reportName: "All_Logs",
        id: logId,
        data: {
            data: {
                Work_Ended: endTimeStr,
                Hours_Worked: workedTime,
            },
        },
    };

    ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
      if (response.code == 3000) {
        console.log("Log End Time added successfully");
        updateRunTimeEnd();
        
      } else {
        console.log("error adding Log End Time", response);
      }
    });

    //Update Run_Time
    function updateRunTimeEnd(){


        var config = {
          appName: "zenworkr",
          reportName: "Task_Report",
          id: taskId,
          data: {
            data: {
                
                Run_Time: false,
                lastLogId: " "
            }
          }
        };

        ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
          if (response.code == 3000) {
           console.log("Run_Time updated successfully");
           fetchAllTasks();
          }
        }).catch(function (err) {
        
             console.log("Error Updateing Run_Time failed", err);
        });

    }
}


function totalHours(start, end) {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startDate = new Date(0, 0, 0, startH, startM);
    const endDate = new Date(0, 0, 0, endH, endM);

    // If end time is earlier than start, assume it's on the next day
    if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }

    const diffMs = endDate - startDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return `${hours}h ${minutes}m`;
}

function refreshProfile(EMPDATA){
    const profileContent = document.getElementById("profile-content");
    let content = '';
    EMPDATA.forEach(e => {
        content = `
            <div class="p-2 px-3 d-flex" style="border-radius: 12px; background-color: #f0f0f0ff; ">
                <div class="align-content-center me-2">
                    <i class="bi bi-clock fs-2"></i>
                </div>
                <div>
                    <p class="mb-1" style="color:grey">Shift</p>
                    <h6>${e.Shift_Form.display_value}</h6>
                </div>
            </div>
            <div class="p-2 px-3 d-flex" style="border-radius: 12px; background-color: #f0f0f0ff; ">
                <div class="align-content-center me-2">
                    <i class="bi bi-building fs-2"></i>
                </div>
                <div>
                    <p class="mb-1" style="color:grey">Department</p>
                    <h6>${e.Department.display_value || "Not Mentioned"}</h6>
                </div>
                
            </div>
            <div class="p-2 px-3 d-flex" style="border-radius: 12px; background-color: #f0f0f0ff; ">
                <div class="align-content-center me-2">
                    <i class="bi bi-envelope fs-2"></i>
                </div>
                <div>
                    <p class="mb-1" style="color:grey">Email ID</p>
                    <h6>${e.Email}</h6>
                </div>
                
            </div>
        `;
    })
    profileContent.innerHTML = content;
    
}


function refreshAttendance(CHECKINREPORT) {
    const attendanceDiv = document.getElementById("monthlyCalander");
    attendanceDiv.innerText = "Loading...";

    const todayDate = new Date();
    const currentDay = todayDate.getDate(); // 1 to today only
    const month = todayDate.getMonth();     // 0-based
    const year = todayDate.getFullYear();

    let row = '';

    for (let day = currentDay; day >= 1; day--) { //want to display reverse order
        const dateStr = `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${year}`;
        const dateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const jsDate = new Date(dateISO);
        const dayName = jsDate.toLocaleDateString('en-US', { weekday: 'short' });

        const dayEntries = CHECKINREPORT.filter(e => e.Date_field === dateStr);

        let checkIn = '--';
        let checkOut = '--';
        let workedMinutes = 0;
        let status = 'Absent';

        if (dayEntries.length > 0) {
            const checkIns = dayEntries.map(e => e.Check_In_Time);
            const checkOuts = dayEntries.map(e => e.Check_Out_Time);

            checkIn = checkIns[0];
            checkOut = checkOuts[checkOuts.length - 1];
            status = 'Present';

            dayEntries.forEach(e => {
                const [h, m] = e.Total_Worked.split('h').map(s => s.trim());
                const minutes = parseInt(h || 0) * 60 + parseInt((m || '0').replace('m', ''));
                workedMinutes += minutes;
            });
        }

        const totalWorked = workedMinutes > 0
            ? `${Math.floor(workedMinutes / 60)}h ${workedMinutes % 60}m`
            : '--';

        const isToday = dateStr === formatToday();

        const Holiday = dayName === 'Sun' ? true : false;

        if(dayName === 'Sun' || dayName === 'Sat'){
            row += `
            <div class="day-row" style="background-color: #B8E6FE;">
                <div class="day-info">
                    <div class="day-name">${dayName}</div>
                    <div class="day-number ${isToday ? 'today' : ''}">${String(day).padStart(2, '0')}</div>
                </div>
                <div class="schedule-info d-flex">
                    <div class="schedule-block" style="width: 80%">
                        <div class="schedule-title mx-5 text-center">
                            <h4 class="m-0">Holiday</h4>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
        } else{
            row += `
            <div class="day-row">
                <div class="day-info">
                    <div class="day-name">${dayName}</div>
                    <div class="day-number ${isToday ? 'today' : ''}">${String(day).padStart(2, '0')}</div>
                </div>
                <div class="schedule-info d-flex">
                    <div class="schedule-block" style="width: 40%">
                        <div class="schedule-title">${Shift}</div>
                        <p class="schedule-time">01:00 PM - 10:00 PM</p>
                    </div>
                    <div class="check-in-block" style="width: 35%">
                        <p class="m-0">${checkIn} - ${checkOut}</p>
                        <p class="m-0 text-${status === "Absent" ? 'danger' : 'success'}">${status}</p>
                    </div>
                    <div class="worked-block" style="width: 15%">
                        <p class="m-0 text-center"><strong>${totalWorked}</strong></p>
                    </div>
                </div>
            </div>
        `;
        }

        
    }

    attendanceDiv.innerHTML = row;
}


let currentMonth = new Date(firstDateOfMonth); // starting month

function refreshAttendance2(monthDate = null) {
    if (monthDate) currentMonth = monthDate; // update if passed

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const startDateStr = startOfMonth.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const endDateStr = endOfMonth.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

    const attendanceDiv = document.getElementById("monthlyCalander");
    attendanceDiv.innerHTML = '<div id="ec"></div>';

    const checkReportConfig = {
        appName: "zenworkr",
        reportName: "Checking_Check_Out_Form_Report",
        criteria: `(Employee.ID == ${USERIDLOCAL} && Date_field >= '${startDateStr}' && Date_field <= '${endDateStr}')`
    };
    
    ZOHO.CREATOR.API.getAllRecords(checkReportConfig).then((response) => {
        const MONTHLYCHECKIN = response?.data || [];

        const uniqueReports = MONTHLYCHECKIN.reduce((acc, current) => {
            if (!acc.some(item => item.Date_field === current.Date_field)) {
                acc.push(current);
            }
            return acc;
        }, []);

        const events = uniqueReports.map((e) => {

            const [day, month, year] = e.Date_field.split("-");
            const formattedDate = `${year}-${month}-${day}`;
            const nextDay = new Date(`${formattedDate}T00:00:00`);
            nextDay.setDate(nextDay.getDate() + 1);
            const endDate = nextDay.toISOString().split("T")[0];

            return {
                title: "Present",
                start: formattedDate,
                end: endDate,
                allDay: true
            };
        });

        console.log(events)

        // Render calendar even if events = []
        new EventCalendar(document.getElementById("ec"), {
            view: "dayGridMonth", 
            events: events, // will be [] if no data
            firstDay: 1,
            editable: false,
            eventStartEditable: false,
            eventDurationEditable: false,
            selectable: false,
            date: `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}-01`,
            headerToolbar: { start: "title", center: "", end: "" }
        });

        attendanceDiv.innerHTML += `
            <div class="text-center mt-2">
                <button class="btn" onclick="changeMonth(-1)"><i class="bi bi-arrow-left-short"></i></button>
                <button class="btn" onclick="changeMonth(1)"><i class="bi bi-arrow-right-short"></i></button>
            </div>
        `;
    })
    .catch(function (error) {
        console.error("Error initializing Zoho Creator SDK:", error);
        // Render calendar even if events = []
        new EventCalendar(document.getElementById("ec"), {
            view: "dayGridMonth", 
            events: [], // will be [] if no data
            firstDay: 1,
            editable: false,
            eventStartEditable: false,
            eventDurationEditable: false,
            selectable: false,
            date: `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}-01`,
            headerToolbar: { start: "title", center: "", end: "" }
        });
        attendanceDiv.innerHTML += `
            <div class="text-center mt-2">
                <button class="btn" onclick="changeMonth(-1)"><i class="bi bi-arrow-left-short"></i></button>
                <button class="btn" onclick="changeMonth(1)"><i class="bi bi-arrow-right-short"></i></button>
            </div>
        `;
    });
}







function changeMonth(offset) {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    refreshAttendance2(newMonth);
}



// Helper function to get today's date in DD-MM-YYYY
function formatToday() {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
}



// function refreshAttendance(CHECKINREPORT) {
    
//     const attendanceDiv = document.getElementById("monthlyCalander");
//     attendanceDiv.innerText = "Loading Mamay..";

//     let row = '';
//     const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//     // Get day name from a YYYY-MM-DD formatted string
//     function getDayName(dateStr) {
//         // Convert "DD-MM-YYYY" to "YYYY-MM-DD"
//         const [day, month, year] = dateStr.split("-");
//         const isoFormat = `${year}-${month}-${day}`;
//         const date = new Date(isoFormat);

//         if (isNaN(date)) return "Invalid Date";

//         return date.toLocaleDateString('en-US', { weekday: 'short' });
//     }

//     function getTodayInDDMMYYYY() {
//         const now = new Date();
//         const dd = String(now.getDate()).padStart(2, '0');
//         const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//         const yyyy = now.getFullYear();
//         return `${dd}-${mm}-${yyyy}`;
//     }

    


//     const groupedData = {};

//     // Group by date
//     CHECKINREPORT.forEach(entry => {
//         const date = entry.Date_field;
//         if (!groupedData[date]) {
//             groupedData[date] = [];
//         }
//         groupedData[date].push(entry);
//     });
//     console.table(groupedData)
//     Object.keys(groupedData).forEach((date, index) => {

//         console.log(date)

//         const dayName = getDayName(date); // dynamically get day name


//         const entries = groupedData[date];

//         // Sort by Check_In_Time
//         entries.sort((a, b) => a.Check_In_Time.localeCompare(b.Check_In_Time));

//         const firstIn = entries[0].Check_In_Time;
//         const lastOut = entries[entries.length - 1].Check_Out_Time;

//         // ✅ Total Work Time Calculation
//         let totalMinutes = 0;

//         entries.forEach(entry => {
//             const match = entry.Total_Worked.match(/(\d+)h\s*(\d+)m/);
//             if (match) {
//                 const hours = parseInt(match[1], 10);
//                 const minutes = parseInt(match[2], 10);
//                 totalMinutes += hours * 60 + minutes;
//             }
//         });

//         const totalHours = Math.floor(totalMinutes / 60);
//         const remainingMinutes = totalMinutes % 60;
//         const totalWorkedFormatted = `${totalHours}h ${remainingMinutes}m`;

//         // Highlight today (optional)
//         const today = getTodayInDDMMYYYY();

        
//         const todayHighlight = date === today;

//         console.log(today, "Illi Nodu", date)

//         row += `
//             <div class="day-row">
//                 <div class="day-info">
//                     <div class="day-name">${dayName}</div>
//                     <div class="day-number ${todayHighlight ? 'today' : ''}">${date.slice(0, 2)}</div>
//                 </div>
//                 <div class="schedule-info d-flex">
//                     <div class="schedule-block" style="width: 50%">
//                         <div class="schedule-title">Shift</div>
//                         <p class="schedule-time">01:00 PM - 10:00 PM</p>
//                     </div>
//                     <div class="check-in-block" style="width: 30%">
//                         <p class="m-0">${firstIn} - ${lastOut}</p>
//                         <p class="m-0"><strong>Total: ${totalWorkedFormatted}</strong></p>
//                     </div>
//                 </div>
//             </div>
//         `;
//     });

//     attendanceDiv.innerHTML = row;
// }




// function getStartOfWeek(date) {
//      const d = new Date(date);
//      const day = d.getDay();
//      const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
//      return new Date(d.setDate(diff));
//  }
//  const today = new Date();
//  const startOfWeek = getStartOfWeek(today);
//  console.log("Start of the Week", startOfWeek)




//Attendence Module Calander

// function generateWeeklyCalendar() {
//     const today = new Date();
//     const calendarContainer = document.getElementById('weeklyCalendar');
    
//     // Get the start of the current week (Monday)
//     function getStartOfWeek(date) {
//         const d = new Date(date);
//         const day = d.getDay();
//         const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
//         return new Date(d.setDate(diff));
//     }
    
//     const startOfWeek = getStartOfWeek(today);
//     const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
//     // Generate the week days
//     const weekDays = [];
//     for (let i = 0; i < 7; i++) {
//         const date = new Date(startOfWeek);
//         date.setDate(startOfWeek.getDate() + i);
//         weekDays.push(date);
//     }

//     function formatDate(date) {
//         return date.getDate().toString().padStart(2, '0');
//     }
    
//     function isToday(date) {
//         return date.toDateString() === today.toDateString();
//     }
    
//     // Clear existing content
//     calendarContainer.innerHTML = '';

//     weekDays.forEach((date, index) => {
//     const dayName = dayNames[index];
//     const dayNumber = formatDate(date); // e.g., "10"
//     const todayHighlight = isToday(date);
    
//     // Filter all reports for that day
//     const reportsForDay = CHECKINREPORT.filter((c) => {
//         return c.Date_field.slice(0, 2) === dayNumber;
//     });

//     if (reportsForDay.length > 0) {
//         const firstReport = reportsForDay[0];
//         const lastReport = reportsForDay[reportsForDay.length - 1];

//         const dayRow = document.createElement('div');
//         dayRow.className = 'day-row';
        
//         dayRow.innerHTML = `
//             <div class="day-info">
//                 <div class="day-name">${dayName}</div>
//                 <div class="day-number ${todayHighlight ? 'today' : ''}">${dayNumber}</div>
//             </div>
//             <div class="schedule-info d-flex">
//                 <div class="schedule-block" style="width: 80%">
//                     <div class="schedule-title">${Shift}</div>
//                     <p class="schedule-time">01:00 PM - 10:00 PM</p>
//                 </div>
//                 <div class="check-in-block" style="width: 20%">
//                     <p class="schedule-time">${firstReport.Check_In_Time} - ${lastReport.Check_Out_Time}</p>
//                 </div>
//             </div>
//             `;
//         calendarContainer.appendChild(dayRow);
//     }
// });

// }

// // Generate calendar when page loads
// document.addEventListener('DOMContentLoaded', function() {
//     generateWeeklyCalendar();
    
//     // Optional: Update calendar every minute to catch day changes
//     setInterval(generateWeeklyCalendar, 60000);
// });

// setTimeout(() =>{
//     generateWeeklyCalendar();
// }, 5000)

// // Optional: Regenerate calendar when window regains focus
// window.addEventListener('focus', generateWeeklyCalendar);



function clrsts(status){
  if (status === 'Not Started'){
    return '#314158'
  }
  else if(status === 'In Progress'){
    return '#F0B100'
  }
  else if (status === 'Completed'){
    return '#00BC7D'
  }
  else if (status === 'Approved'){
    return '#155DFC'
  }
  else if (status === 'Invoiced'){
    return '#4F39F6'
  }
  else if (status === 'Rejected'){
    return '#FB2C36'
  }
  else{
    return 'black'
  }
}

function clrstsbg(status){
  if (status === 'Not Started'){
    return '#CAD5E2'
  }
  else if(status === 'In Progress'){
    return '#FFF085'
  }
  else if (status === 'Completed'){
    return '#A4F4CF'
  }
  else if (status === 'Approved'){
    return '#8EC5FF'
  }
  else if (status === 'Invoiced'){
    return '#A3B3FF'
  }
  else if (status === 'Rejected'){
    return '#FFA2A2'
  }
  else{
    return 'white'
  }
}

// function clrPrio(priority){
//   if (priority === 'High'){
//     return '#FFE2E2'
//   }
//   else if(priority === 'Medium'){
//     return '#FEF9C2'
//   }
//   else if (priority === 'Low'){
//     return '#DBFCE7'
//   }
//   else{
//     return '#EFF6FF'
//   }
// }

function clrPrio(priority){
  if (priority === 'High'){
    return '#FEF2F2'
  }
  else if(priority === 'Medium'){
    return '#FEFCE8'
  }
  else if (priority === 'Low'){
    return '#F0FDF4'
  }
  else{
    return '#EFF6FF'
  }
}

function triggerAttendance(){
    refreshAttendance(CHECKINREPORT);
}

function rocketAnimation(color){

    const bar = document.getElementById("checkinProgress");
    bar.style.backgroundColor = color;
    bar.style.width = "100%"; // animate from 0% → 100%
    

    setTimeout(() => {
        bar.style.display = "none";
        bar.style.width = "0%";
        
        setTimeout(()=>{
            bar.style.display = "block";
        },2000)

    }, 4500);


    // const icon = document.createElement("div");
    // icon.className = "fly-icon";
    // icon.innerHTML = `<img width="50px" src="rocket.png" alt="">`; // you can change to any emoji/icon
    
    // container.appendChild(icon);

    // // remove after animation
    // setTimeout(() => {
    //     icon.remove();
    // }, 2000);
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

    return `${hours}h ${minutes}m ${seconds}s`;
}