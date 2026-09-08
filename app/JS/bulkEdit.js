function getSelectedTaskIds() {
    return Array.from(document.querySelectorAll('.task-checkbox:checked'))
        .map(cb => cb.dataset.id);
}



async function bulkAsign(empID, empName) {
    const selectedIds = getSelectedTaskIds();

    if (selectedIds.length === 0) {
        alert("Please select at least one task.");
        return;
    }

    if (!confirm(`Assign selected ${selectedIds.length} task(s)?`)) return;

    // const assigneeId = "266830000000822003";

    try {
        const requests = selectedIds.map(tid => {
            const config = { 
                appName: "zenfirm",
                reportName: "Task_Report", 
                id: tid,
                data: {
                    data: {
                        Assignee: empID
                    }
                }
            };

            return ZOHO.CREATOR.API.updateRecord(config);
        });

        const responses = await Promise.all(requests);

        console.log("Bulk assign responses:", responses);
        alert("Tasks assigned successfully!");
        



        document.querySelectorAll('.task-checkbox:checked').forEach(cb => {
            const row = cb.closest('tr');
            const assigneeCell = row.querySelector('.assignee-cell');

            if (assigneeCell) {
                assigneeCell.innerText = empName;
            }
        });


        clearSelections(); // ✅ uncheck all

    } catch (error) {
        console.error("Bulk assign failed:", error);
        alert("Something went wrong while assigning tasks.");
    }
}



function bulkEdit() {
    const selectedIds = getSelectedTaskIds();

    if (selectedIds.length === 0) {
        alert("Please select at least one task.");
        return;
    }

    const newStatus = prompt("Enter new status:");

    if (!newStatus) return;

    selectedIds.forEach(id => {
        console.log(`Updating task ${id} → ${newStatus}`);
        // updateTask(id, { Task_Status: newStatus });
    });

    alert("Bulk update completed!");


    document.querySelectorAll('.task-checkbox:checked').forEach(cb => {
        cb.closest('tr').remove();
    });
}


function clearSelections() {
    document.querySelectorAll('.task-checkbox:checked')
        .forEach(cb => cb.checked = false);

    const selectAll = document.getElementById('selectAll');
    if (selectAll) selectAll.checked = false;
}

