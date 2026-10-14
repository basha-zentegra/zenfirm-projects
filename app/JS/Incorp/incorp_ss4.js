// Form SS-4 (EIN application) - fills the embedded PDF (SS4_PDF_B64 from ss4_form.js)
// and shows it in the "Form SS-4" tab (#ss4PdfPreview).
// Uses incorpValue() and fillPdfForm() from incorp_2553.js.

const SS4_P1 = "topmostSubform[0].Page1[0].";

function fillSS4Pdf(data) {
    return fillPdfForm(SS4_PDF_B64, "ss4PdfPreview", data);
}

// Maps the Incorp_Report record to the SS-4 PDF fields.
function mapIncorpToSS4(incorp) {
    const address = incorp.Address_for_the_Company || {};
    const street = [address.address_line_1, address.address_line_2].filter(Boolean).join(", ");
    const cityStateZip = [address.district_city, address.state_province, address.postal_code]
        .filter(Boolean).join(", ");
    const isLLC = incorpValue(incorp.Incorporation_Type) === "LLC";
    const memberCount = (incorp.Shareholder_Information || []).length;

    return {
        textFields: {
            [SS4_P1 + "f1_2[0]"]: incorpValue(incorp.Name_of_Company_Option_1),             // 1 - Legal name of entity
            [SS4_P1 + "Line4ReadOrder[0].f1_5[0]"]: street,                                 // 4a - Mailing address
            [SS4_P1 + "Line4ReadOrder[0].f1_6[0]"]: cityStateZip,                           // 4b - City, state, ZIP
            [SS4_P1 + "f1_10[0]"]: incorpValue(incorp.Name),                                // 7a - Responsible party
            [SS4_P1 + "f1_12[0]"]: isLLC && memberCount ? String(memberCount) : "",         // 8b - Number of LLC members
            [SS4_P1 + "f1_19[0]"]: isLLC ? "" : incorpValue(incorp.State_of_Incorporation), // 9b - State where incorporated (corporations)
            [SS4_P1 + "f1_38[0]"]: incorpValue(incorp.Business_Activity),                   // 17 - Principal line of business
            [SS4_P1 + "f1_44[0]"]: incorpValue(incorp.Name),                                // Applicant name and title
            [SS4_P1 + "f1_45[0]"]: incorpValue(incorp.Phone_Number),                        // Applicant's telephone number
        },
        checkBoxes: {
            [SS4_P1 + "c1_1[0]"]: isLLC,                                                    // 8a - Is this for an LLC? Yes
            [SS4_P1 + "c1_1[1]"]: !isLLC,                                                   // 8a - No
        },
    };
}

// Blank form until an Incorp record is fetched
fillSS4Pdf({});
