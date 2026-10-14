// Form 2553 (S-Corp election) - fills the embedded PDF (EMBEDDED_PDF_B64 from 2553_form.js)
// using pdf-lib and shows it in the "Inc PDF" tab (#incPdfPreview).

const P1 = "topmostSubform[0].Page1[0].";
const P2 = "topmostSubform[0].Page2[0].";
const P3 = "topmostSubform[0].Page3[0].";
const P4 = "topmostSubform[0].Page4[0].";

// Zoho field values can be plain strings or objects (lookups -> display_value,
// address fields -> address_line_1 / district_city / ...). This returns plain text.
function incorpValue(value) {
    if (value == null) return "";
    if (typeof value === "object") return value.display_value ?? value.zc_display_value ?? "";
    return String(value);
}

// Shareholder_Information subform rows only come back as a display_value string, e.g.
// "Ragu Test Varma,100.00,true,23, 45, Ardente Office, ...,02-03-1987,,123456,regu@test.com,..."
// Values are joined by "," with no space; commas inside the address have a space after them,
// so splitting on a comma NOT followed by a space gives the subform columns.
// Positions of the subform columns in that string:
const SH_NAME = 0;
const SH_OWNERSHIP = 1;
const SH_ADDRESS = 3;
const SH_SSN = 6;

// Page 2 table: 7 rows x 7 columns (J name/address, K signature, K date,
// L shares/percentage, L date acquired, M SSN/EIN, N tax year ends).
// Row 1 = f2_03..f2_09, Row 2 = f2_10..f2_16, ... Row 7 = f2_45..f2_51
const SH_MAX_ROWS = 7;

function shareholderCell(row, col) {
    const num = String(3 + (row - 1) * 7 + col).padStart(2, "0");
    return `${P2}Table_Part1[0].Row${row}[0].f2_${num}[0]`;
}

function mapShareholdersTo2553(shareholders) {
    const fields = {};
    (shareholders || []).slice(0, SH_MAX_ROWS).forEach((sh, i) => {
        const parts = incorpValue(sh).split(/,(?! )/).map(s => s.trim());
        const row = i + 1;
        const ownership = parts[SH_OWNERSHIP] ? `${parts[SH_OWNERSHIP]}%` : "";

        fields[shareholderCell(row, 0)] = [parts[SH_NAME], parts[SH_ADDRESS]].filter(Boolean).join("\n"); // J - Name and address
        fields[shareholderCell(row, 3)] = ownership;                                                     // L - Shares / percentage
        fields[shareholderCell(row, 5)] = parts[SH_SSN] || "";                                           // M - SSN / EIN
    });
    if ((shareholders || []).length > SH_MAX_ROWS) {
        console.warn(`2553: ${shareholders.length} shareholders - only the first ${SH_MAX_ROWS} fit on page 2`);
    }
    return fields;
}

// Maps the Incorp_Report record to the 2553 PDF fields.
// textFields: { "pdf field name": "value" }
// checkBoxes: { "pdf field name": true/false }
// Field names are the Incorp_Report link names.
function mapIncorpTo2553(incorp) {
    const address = incorp.Address_for_the_Company || {};
    const street = [address.address_line_1, address.address_line_2].filter(Boolean).join(", ");
    const cityStateZip = [address.district_city, address.state_province, address.postal_code]
        .filter(Boolean).join(", ");
    const companyName = incorpValue(incorp.Name_of_Company_Option_1);

    return {
        textFields: {
            [P1 + "NameAddress[0].f1_01[0]"]: companyName,                               // Name of corporation
            [P1 + "NameAddress[0].f1_02[0]"]: street,                                    // Number, street, room/suite
            [P1 + "NameAddress[0].f1_03[0]"]: cityStateZip,                              // City, state, ZIP
            [P1 + "f1_04[0]"]: incorpValue(incorp.EIN),                                  // A - EIN
            [P1 + "f1_06[0]"]: incorpValue(incorp.State_of_Incorporation),               // C - State of incorporation
            [P1 + "f1_10[0]"]: incorpValue(incorp.Name),                                 // H - Officer / legal representative name
            [P1 + "f1_11[0]"]: incorpValue(incorp.Phone_Number),                         // H - Telephone number
            [P2 + "f2_01[0]"]: companyName,                                              // Page 2 header - name
            [P2 + "f2_02[0]"]: incorpValue(incorp.EIN),                                  // Page 2 header - EIN
            ...mapShareholdersTo2553(incorp.Shareholder_Information),                    // Page 2 shareholder table
        },
        checkBoxes: {},
    };
}

function fillIncorp2553Pdf(data) {
    return fillPdfForm(EMBEDDED_PDF_B64, "incPdfPreview", data);
}

// Fills a base64 PDF's form fields and shows the result in the given iframe.
// Shared by the 2553 and SS-4 forms.
async function fillPdfForm(pdfB64, iframeId, data) {
    try {
        const pdfBytes = Uint8Array.from(atob(pdfB64), c => c.charCodeAt(0));
        const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        Object.entries(data.textFields || {}).forEach(([name, value]) => {
            try {
                form.getTextField(name).setText(value == null ? "" : String(value));
            } catch (e) {
                console.warn(`${iframeId}: text field not found -`, name);
            }
        });

        Object.entries(data.checkBoxes || {}).forEach(([name, checked]) => {
            try {
                const box = form.getCheckBox(name);
                checked ? box.check() : box.uncheck();
            } catch (e) {
                console.warn(`${iframeId}: checkbox not found -`, name);
            }
        });

        // Uncomment to make the fields read-only
        // form.flatten();

        const filledPdfBytes = await pdfDoc.save();
        const pdfUrl = URL.createObjectURL(new Blob([filledPdfBytes], { type: "application/pdf" }));
        const iframe = document.getElementById(iframeId);
        if (iframe.src.startsWith("blob:")) URL.revokeObjectURL(iframe.src);
        iframe.src = pdfUrl;
    } catch (error) {
        console.error(`${iframeId}: error generating PDF`, error);
    }
}

// Logs every field name/type in the PDF - handy when mapping new fields
async function logIncorp2553Fields() {
    const pdfBytes = Uint8Array.from(atob(EMBEDDED_PDF_B64), c => c.charCodeAt(0));
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    pdfDoc.getForm().getFields().forEach(field => {
        console.log(`Field Name: ${field.getName()} | Type: ${field.constructor.name}`);
    });
}

// Blank form until an Incorp record is fetched
fillIncorp2553Pdf({});


async function fetchIncorp(PID){
    if(!PID){
        console.log("NO PROJECT ID")
        return;
    };

    try {
        const response = await ZOHO.CREATOR.API.getAllRecords({ appName : "zenfirm", reportName: "Incorp_Report", criteria : `(Project.ID == ${PID})`});

        if (response.code === 3000 && response.data?.length) {

          const incorp = response.data[0];
          console.log("FETCHED INCOPR FROM ID",incorp)
          await fillIncorp2553Pdf(mapIncorpTo2553(incorp));
          await fillSS4Pdf(mapIncorpToSS4(incorp));
        }else{
          console.log("ELSE",response)
        }

      } catch (err) {
        console.error("Error fetching incorp:", err);
        return; // stop execution if API fails
      }
}
