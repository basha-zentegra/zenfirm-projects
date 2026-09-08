// Create Contact
cont_rec = insert into Contact
[
	Added_User=zoho.loginuser
	Contact_Owner=ifnull(input.Lead.Lead_Owner,null)
	Contact_Name=ifnull(input.Lead.Name,null)
	Phone_Number=ifnull(input.Lead.Phone_Number,"")
	Email=ifnull(input.Lead.Email,"")
];
// Create Accounts
Acc_rec = insert into Accounts
[
	Added_User=zoho.loginuser
	Account_Owner=ifnull(input.Lead.Lead_Owner,null)
	Account_Name=ifnull(input.Lead.Company_Name,"")
	Phone_Number=ifnull(input.Lead.Phone_Number,"")
	Billing_Address=ifnull(input.Lead.Address,null)
];
contact_obj = Contact[ID == cont_rec];
RoleList = List({"Account Manager","Service Owner","Preparer","Reviewer","Peer Reviewer"});
if(Acc_rec != null)
{
	contact_obj.Account_Name=Acc_rec;
	for each  servcice_obj in input.Service_Items
	{
		associated_mem = List();
		associated_mem.add(servcice_obj.Account_Manager);
		associated_mem.add(servcice_obj.Service_Owner);
		servcice_obj.Account=Acc_rec;
		// 		proj_obj = Project[ID == servcice_obj.Project];
		// 		if(proj_obj.count() == 0)
		// 		{
		project_id = insert into Project
		[
			Added_User=zoho.loginuser
			Project_Name=servcice_obj.Service_Name
			Project_Type1=servcice_obj.Project_Type
			Project_Group1=servcice_obj.Service_Group
			Year_field=servcice_obj.Year_field
			Account_Manager=servcice_obj.Account_Manager
			Service_Owner=servcice_obj.Service_Owner
			Associated_Members=associated_mem
			Accounts=Acc_rec
			Contact_Name=cont_rec
			Project_Status="New Discussion"
		];
		servcice_obj.Project=project_id;
		//---------> TIME LINE <---------
		insert into Timeline
		[
			Added_User=zoho.loginuser
			Project=project_id
			Report_Status="Created"
			Date_Time=zoho.currenttime
			Comment=servcice_obj.Service_Group.Project_Group + " Created"
		]
		insert into Timeline
		[
			Added_User=zoho.loginuser
			Project=project_id
			Report_Status="Assigned"
			Date_Time=zoho.currenttime
			Comment=servcice_obj.Account_Manager.Name + " is Assigned as Account Manager & " + servcice_obj.Service_Owner.Name + " is Assigned as Service Owner  by Workflow "
		]
		if(servcice_obj.Service_Group.Project_Group == "Individual Tax Filing")
		{
			//----> ONLY ITR <----
			insert into ITR
			[
				Added_User=zoho.loginuser
				Project=project_id
			]
			insert into Timeline
			[
				Added_User=zoho.loginuser
				Project=project_id
				Report_Status="Assigned"
				Date_Time=zoho.currenttime
				Comment="Project is Assigned to ITR Team"
			]
		}
		else if(servcice_obj.Service_Group.Project_Group == "Payroll")
		{
			//----> ONLY PAYROLL <----
			insert into Timeline
			[
				Added_User=zoho.loginuser
				Project=project_id
				Report_Status="Assigned"
				Date_Time=zoho.currenttime
				Comment="Project is Assigned to Payroll Team"
			]
		}
		project_budget_id = insert into Project_Budgets
		[
			Added_User=zoho.loginuser
			Project_Name=project_id
		];
		for each  roleing in RoleList
		{
			if(roleing == "Account Manager")
			{
				insert into Project_Task_Budget_Details
				[
					Added_User=zoho.loginuser
					Project_Budgets=project_budget_id
					Project_Name=project_id
					Role=roleing
					Type_field="Hourly"
					Owner=servcice_obj.Account_Manager
					US_Emp_Rate=servcice_obj.Account_Manager.US_Hourly_Rate
					IN_Emp_Rate=servcice_obj.Account_Manager.IN_Hourly_Rate
				]
			}
			else
			{
				insert into Project_Task_Budget_Details
				[
					Added_User=zoho.loginuser
					Project_Budgets=project_budget_id
					Project_Name=project_id
					Role=roleing
					Type_field="Hourly"
				]
			}
		}
		// 		}
		// 		else
		// 		{
		// 			project_id = proj_obj.ID;
		// 			proj_obj.Project_Name=servcice_obj.Service_Name;
		// 			proj_obj.Project_Type1=servcice_obj.Project_Type;
		// 			proj_obj.Project_Group1=servcice_obj.Project_Group;
		// 			proj_obj.Year_field=servcice_obj.Year_field;
		// 		}if(j.Milestone_Name == "Intake"){
		servcice_obj.Project=project_id;
		//--->CREATE TASKS<---  FLOW CHANGED SO I HAVE DISABLED THE TASK CREATION OF THE PROJECT - BY BASHA
		// 		prj_obj = Project[ID == project_id];
		// 		template = Task_Template[ID == 266830000000819111];
		// 		all_tasks = template.Task_Items;
		// 		all_milestones = template.Milestone_Items;
		// 		milestone_list = List();
		// 		for each  j in all_milestones
		// 		{
		// 			milestone_response = insert into Milestone
		// 			[
		// 				Millstone_Name=j.Milestone_Name.Milestone_Name
		// 				Project_Name=project_id
		// 				Added_User=zoho.loginuser
		// 				Owner=servcice_obj.Account_Manager
		// 			];
		// 			for each  i in all_tasks
		// 			{
		// 				if(j.Milestone_Name.Milestone_Name == i.Milestone_Name.Milestone_Name)
		// 				{
		// 					info i.Milestone_Name.Milestone_Name;
		// 					task_resp = insert into Task
		// 					[
		// 						Task_Name=i.Task_Name
		// 						Project_Name=project_id
		// 						Milestone_Name=milestone_response
		// 						Added_User=zoho.loginuser
		// 						Assignee=servcice_obj.Account_Manager
		// 					];
		// 				}
		// 			}
		// 		}
		// 	Create Ticket
		ticket_id = insert into Tickets
		[
			Added_User=zoho.loginuser
			Ticket_Owner=ifnull(input.Lead.Lead_Owner,null)
			Subject_field=servcice_obj.Service_Name
			Description=servcice_obj.Service_Name
			Status="Open"
			Contact_Name=cont_rec
			Account_Name=Acc_rec
		];
		// 		insert into Thread
		// 		[
		// 			Added_User=zoho.loginuser
		// 			Tickets=ticket_id
		// 			Message=servcice_obj.Service_Name
		// 			To=cont_rec
		// 			To_Address_List=contact_obj.Email.toList(",")
		// 			Action_field="Sent"
		// 		]
		thisapp.Desk.create_ticket_in_desk(Tickets[ID == ticket_id]);
		//=================================>> Creating Payroll Employer Steup <<=================================
		serv_obj = Service[ID == servcice_obj.ID];
		if(serv_obj.Project_Type.Project_Type == "Payroll Setup")
		{
			projName = Project[ID == project_id];
			taskResp = insert into Task
			[
				Task_Name="Task For Assigning Employees Payroll Setup - " + projName.Project_Name
				Added_User=zoho.loginuser
				Accounts=Acc_rec
				Contact=cont_rec
				Task_Date=zoho.currentdate
				Assignee=serv_obj.Account_Manager
				Project_Name=projName
				Service=serv_obj
			];
			Payroll_init_set_res = insert into Payroll_Employer_Setup
			[
				Added_User=zoho.loginuser
				Service=serv_obj.ID
				Project=project_id
			];
			// SendMail About Payroll Employer Setup Creation
			clientEmail = contact_obj.Email;
			clientName = contact_obj.Contact_Name;
			updateLink = "https://creatorapp.zohopublic.in/zentegraindia/zenfirm/Payroll_Employer_Setup/record-edit/Payroll_Employer_Setups_Report/" + Payroll_init_set_res + "/M10Qnb7jMZRmGE9wQb7dUCd4ZHF70ngMbbtaR9e79MKFfqt6nxJOBGeJ0xedXnHKnHS677ymnud6zwzn1U0Xz3hV5FfTTFJQMg2U";
			sub = "Request to Update Employer Information for Payroll";
			msg = "Dear " + clientName + ", please update your employer information for payroll by clicking " + "<a href='" + updateLink + "'>here</a>. Thank you.";
			sendmail
			[
				from :zoho.adminuserid
				to :"abhinand@zentegra.com"
				subject :sub
				message :msg
			]
		}
		//=================================>> Bookkeping Creation <<=========================================
		if(servcice_obj.Project_Type.Project_Type == "Bookkeeping Setup")
		{
			acc_obj = Accounts[ID == Acc_rec];
			Bookkeeping = insert into Bookkeeping
			[
				Bookkeeping_Name=acc_obj.Account_Name + " Book Keeping " + serv_obj.Year_field
				Service=serv_obj.ID
				Project=project_id
				Added_User=zoho.loginuser
			];
			projName = Project[ID == project_id];
			taskResp = insert into Task
			[
				Task_Name="Task For Assigning Employees Bookkeeping Setup - " + projName.Project_Name
				Added_User=zoho.loginuser
				Accounts=Acc_rec
				Contact=cont_rec
				Task_Date=zoho.currentdate
				Assignee=serv_obj.Account_Manager
				Project_Name=projName
				Service=serv_obj
			];
		}
		//=================================>> Sales Tax Creation <<=========================================
		if(servcice_obj.Project_Type.Project_Type == "Sales Tax Setup")
		{
			acc_obj = Accounts[ID == Acc_rec];
			Sales_Tax = insert into Sales_Tax
			[
				Sales_Tax_Name=acc_obj.Account_Name + " Sales Tax " + serv_obj.Year_field
				Service=serv_obj.ID
				Project=project_id
				Added_User=zoho.loginuser
			];
			projName = Project[ID == project_id];
			taskResp = insert into Task
			[
				Task_Name="Task For Assigning Employees SalesTax Setup - " + projName.Project_Name
				Added_User=zoho.loginuser
				Accounts=Acc_rec
				Contact=cont_rec
				Task_Date=zoho.currentdate
				Assignee=serv_obj.Account_Manager
				Project_Name=projName
				Service=serv_obj
			];
		}
	}
}
//
//
//
//------------------> 	WORKDRIVE FOLDER & STORING ID INTO SERVICE   <------------------------
//
folderMap = Map();
folderMap.put("ITR","zi6br9e29067c8c0b4d0ab8c4aae065cd66ba");
folderMap.put("BTR","zi6br6839fb8da11f46fba449027b9c0e9c3f");
folderMap.put("PAYROLL","zi6br73e4ee558d3a4990886f67a90a8594c1");
folderMap.put("BOOKKEEPING","zi6br364f83945e584624939b46c9ab1b8acb");
folderMap.put("INCORP","zi6brf39a0d9a6abe462cb8ba8342ac4a9a73");
for each  si in input.Service_Items
{
	service_name = si.Service_Name;
	letter_folder = service_name.left(1).toUpperCase();
	if(si.Service_Group.Project_Group == "Individual Tax Filing")
	{
		header = Map();
		header.put("Accept","application/vnd.api+json");
		response = invokeurl
		[
			url :"https://www.zohoapis.in/workdrive/api/v1/files/" + folderMap.get("ITR") + "/files"
			type :GET
			headers:header
			connection:"zoho_workdrive_connection"
		];
		data = response.get("data");
		for each  i in data
		{
			letter_folder_name = i.get("attributes").get("name");
			if(letter_folder_name == letter_folder)
			{
				create_client_folder = zoho.workdrive.createFolder(input.Lead.Company_Name,i.get("id"),"zoho_workdrive_connection");
				client_folder_id_da = create_client_folder.get("data").get("id");
			}
		}
		create_year_folder = zoho.workdrive.createFolder(si.Year_field,client_folder_id_da,"zoho_workdrive_connection");
		year_folder_id_da = create_year_folder.get("data").get("id");
		//
		create_sourceDoc_folder = zoho.workdrive.createFolder("Files From Clients",year_folder_id_da,"zoho_workdrive_connection");
		sourceDoc_folder_id_da = create_sourceDoc_folder.get("data").get("id");
		//
		create_filesToClients_folder = zoho.workdrive.createFolder("Files To Clients",year_folder_id_da,"zoho_workdrive_connection");
		filesToClients_folder_id_da = create_filesToClients_folder.get("data").get("id");
		//
		create_workingFiles_folder = zoho.workdrive.createFolder("Working Files",year_folder_id_da,"zoho_workdrive_connection");
		workingFiles_folder_id_da = create_workingFiles_folder.get("data").get("id");
	}
	else if(si.Service_Group.Project_Group == "Business Tax Filing")
	{
		header = Map();
		header.put("Accept","application/vnd.api+json");
		response = invokeurl
		[
			url :"https://www.zohoapis.in/workdrive/api/v1/files/" + folderMap.get("BTR") + "/files"
			type :GET
			headers:header
			connection:"zoho_workdrive_connection"
		];
		data = response.get("data");
		for each  i in data
		{
			letter_folder_name = i.get("attributes").get("name");
			if(letter_folder_name == letter_folder)
			{
				create_client_folder = zoho.workdrive.createFolder(input.Lead.Company_Name,i.get("id"),"zoho_workdrive_connection");
				client_folder_id_da = create_client_folder.get("data").get("id");
			}
		}
		create_year_folder = zoho.workdrive.createFolder(si.Year_field,client_folder_id_da,"zoho_workdrive_connection");
		year_folder_id_da = create_year_folder.get("data").get("id");
		//
		create_sourceDoc_folder = zoho.workdrive.createFolder("Source Document",year_folder_id_da,"zoho_workdrive_connection");
		sourceDoc_folder_id_da = create_sourceDoc_folder.get("data").get("id");
		//
		create_filesToClients_folder = zoho.workdrive.createFolder("Files to Clients",year_folder_id_da,"zoho_workdrive_connection");
		filesToClients_folder_id_da = create_filesToClients_folder.get("data").get("id");
		//
		create_workingFiles_folder = zoho.workdrive.createFolder("Working Files",year_folder_id_da,"zoho_workdrive_connection");
		workingFiles_folder_id_da = create_workingFiles_folder.get("data").get("id");
	}
	si.Client_Folder=client_folder_id_da;
	si.Year_Folder=year_folder_id_da;
	si.Files_From_Client=sourceDoc_folder_id_da;
	si.Files_to_Client=filesToClients_folder_id_da;
	si.Working_Files=workingFiles_folder_id_da;
}
// one = client_folder_id_da;
// two = year_folder_id_da;
// three = sourceDoc_folder_id_da;
// Acc_rec
//------------------> DELETE THE DATA <------------------------
delete from Leads[ID == input.Lead.ID];
openUrl("#Script:dialog.close","same window");
openUrl("#Script:page.refresh","same window");
