function rtnAvatar(OID){

    let DP ='https://contacts.zoho.in/file?ID=60038379214&fs=thumb';

    if(OID){
        const emp_obj = ALL_ORG_EMPLOYEES.find(e => e?.ID === OID)

        if(emp_obj){
            if(emp_obj?.Profile_Photo){
                DP = `https://zenworkr.zohocreatorportal.com${emp_obj.Profile_Photo}`;
            } 
        }

    }

    return DP;

}