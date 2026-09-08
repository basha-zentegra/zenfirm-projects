let imapU = ''
let imapP = ''
let from_email = ''

async function loadEmails(page) {

    let access = localStorage.getItem("access");

    let emailRes = await fetch(`http://127.0.0.1:8000/emails/?page=${page}&from_email=${from_email}`, {
        headers: { "Authorization": "Bearer " + access }
    });

    // let emailRes = await fetch(`http://127.0.0.1:8000/emails/?page=1&from_email=abdul@zentegra.com`, {
    //     headers: { "Authorization": "Bearer " + access }
    // });

    // if token expired, refresh it
    if (emailRes.status === 401) {
        access = await refreshToken();

        emailRes = await fetch(`http://127.0.0.1:8000/emails/?page=${page}&from_email=${from_email}`, {
            headers: { "Authorization": "Bearer " + access }
        });
    }

    const emailData = await emailRes.json();
    console.log(emailData)

    const list = document.getElementById("email-list");
    list.innerHTML = "";

    if (emailData.length === 0) {
        list.innerHTML = `
        <div class="text-center mt-5 pt-5">
            <img src="https://cdn-icons-png.flaticon.com/128/8419/8419049.png" width="100px" height="auto" style="opacity:0.6;" alt="">
            
            <p class='text-muted text-center  lead'>No more emails.</p>
        </div>`;
        return;
    }

    if(emailData.code === "token_not_valid"){
        list.innerHTML = `
        <div class="text-center mt-5 pt-5">
            <img src="https://cdn-icons-png.flaticon.com/128/13793/13793271.png" width="100px" height="auto" style="opacity:0.6;" alt="">
            
            <p class='text-muted text-center  lead'>IMAP Not Configured.</p>
        </div>`;
        return;
    }

    if(emailData?.error === `UID command error: BAD [b"[CLIENTBUG] syntax: unexpected char: ')'"]` ){
        list.innerHTML = `
        <div class="text-center mt-5 pt-5">
            <img src="https://cdn-icons-png.flaticon.com/128/8419/8419049.png" width="100px" height="auto" style="opacity:0.6;" alt="">
            
            <p class='text-muted text-center  lead'>No more emails.</p>
        </div>`;
        return;
    }

    if(emailData?.error){
        list.innerHTML = `
        <div class="text-center mt-5 pt-5">
            <img src="https://cdn-icons-png.flaticon.com/128/8727/8727608.png" width="100px" height="auto" style="opacity:0.6;" alt="">
            
            <p class='text-muted text-center  lead'>${emailData.error}</p>
        </div>`;
        return;
    }

    emailData.forEach(email => {
        const div = document.createElement("div");
        div.className = "email-item";
        div.innerHTML = `
            <div class="subject">${email.subject}</div>
            <div class="from">${email.from}</div>
            <div class="date">${email.date}</div>
        `;
        div.onclick = () => showDetails(email, div);
        list.appendChild(div);
    });
}

let page = 1;

async function refreshToken(){
    const refresh = localStorage.getItem("refresh");

    const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh })
    });

    const data = await res.json();
    localStorage.setItem("access", data.access);

    return data.access;
}

async function login(imapU, imapP) {
    const tokenRes = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: imapU,
            password: imapP
        })
    });

    const tokenData = await tokenRes.json();

    console.log("LOGGED IN", tokenData)

    // store tokens in localStorage
    localStorage.setItem("access", tokenData.access);
    localStorage.setItem("refresh", tokenData.refresh);
    // loadEmails(page);
}

// if(localStorage.getItem("imap-username")){
//     imapU = localStorage.getItem("imap-username") 
//     imapP =  localStorage.getItem("imap-pass") 
//     login(imapU, imapP)
// } 

document.getElementById("next-btn").onclick = () => {
    page++;
    loadEmails(page);

    document.getElementById("email-list").innerHTML = `<div class="text-center mt-5 pt-5">
                                        <img class=""  src="https://cdn-icons-png.flaticon.com/128/2989/2989993.png" width="100px" style="opacity: 0.6;" alt="">
                                        <p class="lead">Loading emails...</p>
                                    </div>`
};

document.getElementById("prev-btn").onclick = () => {
    if (page > 1) {
        page--;
    }
    loadEmails(page);

    document.getElementById("email-list").innerHTML = `<div class="text-center mt-5 pt-5">
                                        <img class=""  src="https://cdn-icons-png.flaticon.com/128/2989/2989993.png" width="100px" style="opacity: 0.6;" alt="">
                                        <p class="lead">Loading emails...</p>
                                    </div>`
};


function showDetails(email, divElem) {

    console.log("Console.log", email)

    document.getElementById("email-details").style.display = "block";
    document.getElementById("placeholder-box").style.display = "none";

    document.querySelectorAll(".email-item").forEach(i => i.classList.remove("active-email"));
    divElem.classList.add("active-email");

    // document.getElementById("detail-subject").innerText = email.subject;
    // document.getElementById("detail-from").innerText = email.from;
    // document.getElementById("detail-date").innerText = email.date;
    // document.getElementById("detail-body").innerText = email.text || "(No text body)";

    // if(email?.to){
    //     document.getElementById("detail-to").classList.remove("d-none")
    //     document.getElementById("detail-to").innerHTML = `<strong>To:</strong> <span >${email.to}</span>` ;
    // }else{
    //     document.getElementById("detail-to").classList.add("d-none")
    // }
     // Fill UI
    document.getElementById("subject").innerText = email.subject;
    document.getElementById("fromEmail").innerText = email.from;
    document.getElementById("toEmail").innerText = email.to.join(", ");
    document.getElementById("ccEmail").innerText = email.cc.join(", ") || "-";
    document.getElementById("bccEmail").innerText = email.bcc.join(", ") || "-";
    document.getElementById("emailDate").innerText = email.date;
    document.getElementById("emailText").innerText = email.text;
    document.getElementById("uid").innerText = email.uid;

    // Avatar Letter
    document.getElementById("avatar").innerText =
        email.from.charAt(0).toUpperCase();
}

document.getElementById("back-btn").onclick = () => {
    document.getElementById("email-details").style.display = "none";
    document.getElementById("placeholder-box").style.display = "block";
};


async function sendEmail() {
    let access = localStorage.getItem("access");

    const emailTo = document.getElementById("emailTo").value
    const emailSubject = document.getElementById("emailSubject").value
    const emailContent = document.getElementById("emailContent").value
    const emailCc = document.getElementById("emailCc").value

    const emailSubmit = document.getElementById("emailSubmit")

    emailSubmit.disabled = true;
    emailSubmit.innerHTML = 'Loading... <span class="spinner-border spinner-border-sm"></span>';

    if(!emailTo || !emailSubject || !emailContent){
        alert("Fill all details before submit!")
        return;
    }

    console.log("CC", emailCc)

    const body = {
        to: emailTo,
        cc: emailCc,
        subject: emailSubject,
        message: emailContent
    };

    // const body = {
    //     to: "basha@zentegra.com",
    //     subject: "SMTP MAIL FROM DJNAGO",
    //     message: "CONTENT OF THE MAIL IS TESTING..."
    // };

    let res = await fetch("http://127.0.0.1:8000/send-email/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access
        },
        body: JSON.stringify(body)
    });

    // Handle token expiry
    if (res.status === 401) {
        access = await refreshToken();
        res = await fetch("http://127.0.0.1:8000/send-email/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access
            },
            body: JSON.stringify(body)
        });
    }

    const data = await res.json();
    console.log(data);
    alert(data.status || data.error);

    if(data.status === 'Email sent successfully'){
        document.getElementById("emailCc").value = '';
        document.getElementById("emailSubject").value = '';
        document.getElementById("emailContent").value = '';

        emailSubmit.disabled = false;
        emailSubmit.innerHTML = 'Submit <i class="bi bi-send-fill"></i>';

    }
    
}


function displayCompose(){
    const composeSection = document.getElementById("compose-email-section"); //zoho-mail-box
    const mailBoxSection = document.getElementById("zoho-mail-box");

    composeSection.classList.toggle("d-none");
    mailBoxSection.classList.toggle("d-none");
}
//with file 


// async function sendEmail() {
//     let access = localStorage.getItem("access");

//     const formData = new FormData(); 
//     formData.append("to", document.getElementById("to").value);
//     formData.append("subject", document.getElementById("subject").value);
//     formData.append("message", document.getElementById("message").value);

//     const files = document.getElementById("attachments").files;
//     for (let file of files) {
//         formData.append("attachments", file);
//     }

//     let res = await fetch("http://127.0.0.1:8000/send-email/", {
//         method: "POST",
//         headers: {
//             "Authorization": "Bearer " + access   // ❗ NO Content-Type header
//         },
//         body: formData
//     });

//     // Token refresh
//     if (res.status === 401) {
//         access = await refreshToken();

//         res = await fetch("http://127.0.0.1:8000/send-email/", {
//             method: "POST",
//             headers: { "Authorization": "Bearer " + access },
//             body: formData
//         });
//     }

//     const data = await res.json();
//     alert(data.status || data.error);
// }


async function signupUser() {

    let email = document.getElementById("imap_email").value;
    let password = document.getElementById("imap_password").value;
    let lastName = document.getElementById("imap_last_name").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/api/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                last_name: lastName
            })
        });

        console.log("response", response)

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Signup successful!");
            console.log("Success:", data);

            document.getElementById("imap_email").value = "";
            document.getElementById("imap_password").value = "";
            document.getElementById("imap_last_name").value = "";

            addImaptoZoho(email,password,lastName);


        } else {
            alert(data.error || "Signup failed!");
            console.log("Error:", data);
        }

    } catch (error) {
        console.error("Network error:", error);
        alert("Something went wrong. Please try again.");
    }
}

function trigerImapSignup(){

    document.getElementById("zoho-mail-box").classList.add("d-none");

    const signupform = `<div class="mail-full-view px-5">

    <p class="lead mb-4 text-center"> IMAP Configuration for Email  </p>

        <input class="form-control mb-3" type="email" id="imap_email" placeholder="Email" />
        <input class="form-control mb-3" type="password" id="imap_password" placeholder="Password" />
        <input class="form-control mb-3" type="text" id="imap_last_name" placeholder="App Password" />

        <button class="btn btn-success btn-sm" onclick="signupUser()">Configure</button>
    </div>`

    document.getElementById("placeholder-box").innerHTML += signupform;
    
}



function addImaptoZoho(email,password,lastName){

    var config = {
        formName : "IMAP",
        data : {
            data : {
                Employee: USERID,
                Email: email,
                App_Password: lastName,
                Password: password
            }
        }
    }

    ZOHO.CREATOR.API.addRecord(config).then(function(response){
        if(response.code == 3000){
            console.log("Record added successfully");
            alert("Configuration Successfull...!! Refresh to Continue")
            location.reload();
        }else{
            console.log("error in response", response)
        }
    });

}