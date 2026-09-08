
start_time = (input.Meeting_Date.toString() + " " + input.Start_Time.toString()).toDateTime();
end_time = (input.Meeting_Date.toString() + " " + input.End_Time.toString()).toDateTime();
duration = start_time.timeBetween(end_time);
duration_in_sec = duration.getprefix(":").toNumber() * 60 * 60 + duration.getsuffix(":").getprefix(":").toNumber() * 60 + duration.getsuffix(":").getsuffix(":").toNumber();
header_map = Map({"Content-Type":"application/json;charset=UTF-8"});


attendeeEmail =  input.Attende.Email;
attendeeList = List();
for each ate in attendeeEmail
{
    attendeeMap = Map();
    attendeeMap.put("email", ate);
    attendeeList.add(attendeeMap);
} 

month_list = List(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
month = month_list.get(input.Meeting_Date.getMonth() -1);
dat = input.Meeting_Date.getDay() + 1;
year = input.Meeting_Date.getYear();

if(input.Start_Time.getHour() >= 12){
    decresedTime = input.Start_Time.getHour() - 12;
        if(input.Start_Time.getMinutes().toString().length() == 1){
            timee = "0"+ decresedTime.toString() + ":0" + input.Start_Time.getMinutes().toString() + " " + "PM";
            info  timee; 
        } else if (input.Start_Time.getMinutes().toString().length() == 2) 
        {
            timee = "0"+ decresedTime.toString() + ":" + input.Start_Time.getMinutes().toString() + " " + "PM";
            info  timee; 
        }
        
        
    } else if ( input.Start_Time.getHour() < 12 ) 
    {
        if( input.Start_Time.getHour() < 10){
            
            if(input.Start_Time.getMinutes().toString().length() == 1){
                timee = "0"+ decresedTime.toString() + ":0" + input.Start_Time.getMinutes().toString() + " " + "AM";
                info  timee; 
            } else if (input.Start_Time.getMinutes().toString().length() == 2) 
            {
                timee = "0"+ decresedTime.toString() + ":" + input.Start_Time.getMinutes().toString() + " " + "AM";
                info  timee; 
            }
            
        } else 
        {
            if(input.Start_Time.getMinutes().toString().length() == 1){
                timee = decresedTime.toString() + ":0" + input.Start_Time.getMinutes().toString() + " " + "AM";
                info  timee; 
            } else if (input.Start_Time.getMinutes().toString().length() == 2) 
            {
                timee = decresedTime.toString() + ":" + input.Start_Time.getMinutes().toString() + " " + "AM";
                info  timee; 
            }
        }
    }
    
apiStartTime = month.toString() + " " + dat.toString()+ "," + " " + year.toString() + " " + timee;

session_map = Map();
session_map.put("topic", input.Project_Name.Project_Name + "-" + input.Meeting_Name);
session_map.put("agenda", input.Description);
session_map.put("presenter", 60038379214);
session_map.put("startTime", apiStartTime);
session_map.put("duration", duration_in_sec.toNumber());
session_map.put("timezone", "Asia/Calcutta");
session_map.put("participants",attendeeList);
body_map = Map();
body_map.put("session",session_map);


// Send POST request to Zoho Meeting
response = invokeurl
[
    url : "https://meeting.zoho.in/api/v2/60038379214/sessions.json"
    type : POST
    headers : header_map
    parameters: body_map.toString()
    connection : "zoho_meeting_connection"
];

session = response.getJSON("session");
jlk = session.getJSON("joinLink");

info jlk;
