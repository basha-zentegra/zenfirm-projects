let sent_page = 1;
async function sent_loadEmails(page) {
    let access = localStorage.getItem("access");

    let emailRes = await fetch(`http://127.0.0.1:8000/sent_emails/?page=${page}&from_email=${from_email}`, {
        headers: { "Authorization": "Bearer " + access }
    });


    // if token expired, refresh it
    if (emailRes.status === 401) {
        access = await refreshToken();

        emailRes = await fetch(`http://127.0.0.1:8000/sent_emails/?page=${page}&from_email=${from_email}`, {
            headers: { "Authorization": "Bearer " + access }
        });
    }

    const emailData = await emailRes.json();
    console.log(emailData)

    const list = document.getElementById("sent-email-list");
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
            <div class="from">From: ${email.from}</div>
            <div class="from">To: ${email.to.join(", ")}</div>
            <div class="date">${email.date}</div>
        `;
        div.onclick = () => showDetails(email, div);
        list.appendChild(div);
    });
}


document.getElementById("sent-next-btn").onclick = () => {
    sent_page++;
    sent_loadEmails(sent_page);

    document.getElementById("sent-email-list").innerHTML = `<div class="text-center mt-5 pt-5">
                                        <img class=""  src="https://cdn-icons-png.flaticon.com/128/2989/2989993.png" width="100px" style="opacity: 0.6;" alt="">
                                        <p class="lead">Loading emails...</p>
                                    </div>`
};

document.getElementById("sent-prev-btn").onclick = () => {
    if (sent_page > 1) {
        sent_page--;
    }
    sent_loadEmails(sent_page);

    document.getElementById("sent-email-list").innerHTML = `<div class="text-center mt-5 pt-5">
                                        <img class=""  src="https://cdn-icons-png.flaticon.com/128/2989/2989993.png" width="100px" style="opacity: 0.6;" alt="">
                                        <p class="lead">Loading emails...</p>
                                    </div>`
};



function switchInbox(){
    document.getElementById("inbox-div").classList.toggle("d-none");
    document.getElementById("sent-email-div").classList.toggle("d-none");

    document.getElementById("inb-btn").classList.toggle("btn-purple");
    document.getElementById("snt-btn").classList.toggle("btn-purple");
}

