var globalCategoryId;

function onload() {
    createHeading();

    updateHeading();
    loadCategories();
    loadStatements();

    document.getElementById("load-div").style.display = "none";
    document.getElementById("main-div").style.display = "block";

    // "/" Shortcut for Search Bar
    document.addEventListener("keydown", function (event) {
        if (event.keyCode == 191) {
            event.preventDefault();
            document.getElementById("searchBar").focus();
        }
    }, false);

    // Add Listeners for Heading Data
    headingListeners();
}

function createHeading() {
    headingForm = document.getElementById("headingForm")
    // headingForm.innerHTML = html
    noteHeadingFields = headingForm.getElementsByClassName("headinglabel-"+noteId)
    
    for (i=0; i<noteHeadingFields.length; i++) {
        noteHeadingFields[i].style.display = "block";
    }

}

function loadCategories() {
    parent = document.getElementById('categories')

    htmlString = "<div class='category_div' " +
        "onClick='updateHeading()'><h3>HEADING</h3></div>"

    for (const key in data) {
        htmlString += "<div onClick=\"updateCategory(" + key + ", \'" + 
        data[key].name +
            "\')\" class='category_div heading'><h3>" + data[key].name +
            "</h3></div>"
    }
    parent.innerHTML = htmlString
}

function headingListener(listenElementId, updateElementId) {
    document.getElementById(listenElementId).addEventListener("change", function () {
        value = document.getElementById(listenElementId).value;
        if (listenElementId == "dateinput" || listenElementId == "dateofbirthinput") {
            // FIX THIS IF THIS IF PROJECT EXPANDS, NO HARDCODED TIMEZONES
            value = new Date(value + 'T00:00:00-06:00').toLocaleDateString('en-us', { weekday: "long", day: 'numeric', month: "long", year: "numeric" });
        }
        if (listenElementId == "starttimeinput" || listenElementId == "endtimeinput") {
            value = new Date("2011-04-11T" + value + ":00");
            value = value.toLocaleTimeString('en-us', { hour12: true, hour: "numeric", minute: "2-digit" });
            // value = value.toLocaleTimeString();
        }
        if (listenElementId == "feeinput") {
            // FIX THIS IF THIS IF PROJECT EXPANDS, HARDCODES TO USD NEAREST CENT
            const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
            value = formatter.format(value)
        }
        // Hide Heading Value when not in use
        if (value && value != "$0.00" && value != "Invalid Date") {
            document.getElementById(updateElementId).parentElement.style.display = "block";
            document.getElementById(updateElementId).textContent = value;
        } else {
            document.getElementById(updateElementId).parentElement.style.display = "none";
            document.getElementById(updateElementId).textContent = "";
        }
    });
}

function headingListeners() {

    headingElements = {
        "nameinput": "note-heading-name",
        "nameofcoupleinput": "note-heading-name-of-couple",
        "partneranameinput": "note-heading-partner-a-name",
        "partnerbnameinput": "note-heading-partner-b-name",
        "nameofidentifiedclientinput": "note-heading-name-of-identified-client",
        "dateinput": "note-heading-date",
        "starttimeinput": "note-heading-start-time",
        "endtimeinput": "note-heading-end-time",
        "feeinput": "note-heading-fee",
        "cptcodeinput": "note-heading-cpt-code",
        "diagnosiscodeinput": "note-heading-diagnosis-code",
        "dateofbirthinput": "note-heading-date-of-birth",
        "addressinput": "note-heading-address",
        "referralsourceinput": "note-heading-referral-source",
        "phoneinput": "note-heading-phone",
        "oktoleavemessageinput": "note-heading-ok-to-leave-message",
        "maritalstatusinput": "note-heading-marital-status",
        "livingarrangementinput": "note-heading-living-arrangement",
        "occupationinput": "note-heading-occupation",
        "educationlevelinput": "note-heading-education-level",
        "emergencycontactnameinput": "note-heading-emergency-contact-name",
        "emergencycontactphoneinput": "note-heading-emergency-contact-phone",
        "prolongedservicenoteinput": "note-heading-prolonged-service-note",
        "diagnosisidentifyclientinput": "note-heading-diagnosis-identify-client",
        "diagnosticcodeidentifyclientinput": "note-heading-diagnostic-code-identify-client",
        "couplecharacteristicsinput": "note-heading-couple-characteristics"        
    }

    for (key in headingElements) {
        headingListener(key, headingElements[key]);
    }
}

function newNote() {
    fetch("/", {
            method: "POST",
            body: JSON.stringify({
                request: "new_note"
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }
    );

    window.location.replace("/note");
}

function updateCategory(categoryId, categoryTitle) {

    globalCategoryId = categoryId;

    // Display Search Bar and Statements and Hide headingForm
    document.getElementById("header_div_fixed").style.display = "none";
    document.getElementById("statements_div").style.display = "block";
    document.getElementById("searchbox").style.display = "block";
    document.getElementById("middle_footer").style.display = "block";

    // Update Title in Middle Column
    document.getElementById("categoryTitle").innerHTML =
        categoryTitle.toUpperCase();

    // Reset Search Bar
    searchEl = document.getElementById("searchBar");
    searchEl.value = "";

    // Filter Statements by Category Id
    filterStatements(categoryId);
}

function updateHeading() {
    // Hide Search Bar and Statements, Change Title, Show Heading
    document.getElementById("categoryTitle").innerHTML = "HEADING";
    document.getElementById("searchbox").style.display = "none";
    document.getElementById("statements_div").style.display = "none";
    document.getElementById("header_div_fixed").style.display = "block";
    document.getElementById("middle_footer").style.display = "none";
}

function validateCPT() {
    cpt = document.getElementById("cptcodeinput").value

    if (cpt.length != 5 && cpt.length != 0) {
        document.getElementById("cptcodeinput").style.backgroundColor = "#f2d9d9";
    } else {
        document.getElementById("cptcodeinput").style.backgroundColor = "white";
    }
}

function validateTime() {
    startElement = document.getElementById("starttimeinput")
    endElement = document.getElementById("endtimeinput")
    start = startElement.value
    end = endElement.value

    if (start.length != 0 && end != 0) {

        const startTimestamp = new Date("1970-01-01T" + start);
        const endTimestamp = new Date("1970-01-01T" + end);
        const delta = endTimestamp - startTimestamp;

        if (delta > 14400000) {
            startElement.style.backgroundColor = "#f2d9d9";
            endElement.style.backgroundColor = "#f2d9d9";
        } else {
            startElement.style.backgroundColor = "white";
            endElement.style.backgroundColor = "white"; 
        }
    } else {
        startElement.style.backgroundColor = "white";
        endElement.style.backgroundColor = "white"; 
    }
}

function validateDate() { 

    dateElement = document.getElementById("dateinput");
    
    const date = new Date(dateElement.value);
    const today = new Date();

    const difference = Math.abs(today - date)

    if (dateElement.value) {
        // 3 Days (185141428ms per day)
        if (difference > 555424284) {
            dateElement.style.backgroundColor = "#f2d9d9";
        } else {
            dateElement.style.backgroundColor = "white";
        }

    } else {
        dateElement.style.backgroundColor = "white";
    }
}

function validateFee() {

    feeElement = document.getElementById("feeinput")
    
    fee = Number(feeElement.value);

    if (fee) {
        let isNumber = /^\d+$/.test(fee);

        if (!isNumber || fee > 1000 || fee < 0) {
            feeElement.style.backgroundColor = "#f2d9d9";
        } else {
            feeElement.style.backgroundColor = "white";
        }

    } else {
        feeElement.style.backgroundColor = "white";
    }
}

function loadStatements() {

    document.getElementById("statements_div").innerHTML = "";

    html = "";

    if (data) {

        for (const category in data) {
            subcategories = data[category].subcategories

            for (const subcategory in subcategories) {
                subcategoryId = subcategory
                subcategoryName = subcategories[subcategory].name
                snippets = subcategories[subcategory].snippets
                statements = subcategories[subcategory].statements
                type = parseInt(subcategories[subcategory].type)

                html += "<div class='subcategory' id='subcategory-" + subcategoryId + "'>"
                html += "<div class='header'><h2>" + subcategoryName +
                    "</h2></div>"
                
                switch (type) {
                    case 1:
                        html += loadTypeNone();
                        break;
                    case 2:
                        html += loadTypeFront();
                        break;
                    case 3:
                        html += loadTypeBoth();
                        break;
                    case 4:
                        html += loadTypeText();
                        break;
                    case 5:
                        html += loadTypePSO();
                        break;
                    default:
                        console.log("No Category Type")
                }
                html += "</div>"                
            }
        }
        document.getElementById("statements_div").innerHTML += html 
    }

    function loadTypeNone() {
        html = "<div class='subcategory-stem hidden'></div>"
        html += "<div class='statement-container'>"

        for (id in statements) {
            html += "<div class='statement'>"
            html += "<div class='statement-snippet-front hidden'></div>"
            html += "<div class='statement-option' id='statement-option-" + id +
                "' onclick='clickStatement(this)'>" + statements[id] + "</div>"
            html += "<div class='statement-text-input hidden'></div>"
            html += "<div class='statement-snippet-back hidden'></div>"
            html += "</div>"
        }

        html += "</div><div>"
        html += "<div class='add-statement-div' style='display:none;'>"
        html += "<input class='statement-input' type='text' placeholder='Enter a new statement...'>"
        html += "<div class='add-statement-button-div'>"
        html += "<button class='cancel-statement-button' type='button' onclick='clickCancelStatement(this)'>Cancel</button>"
        html += "<button class='confirm-statement-button' type='button' onclick='clickConfirmStatement(this, " +
            subcategoryId + ", " + type + ")'>Confirm</button>"
        html += "</div></div>"
        html += "<button class='add-statement-button' type='button' onclick='clickAddStatement(this)'><strong class='bold'>+</strong> Add Statement</button></div>"
        html += "</div>"
        
        return html
    }

    function loadTypeFront() {
        html = "<div class='subcategory-stem' id='subcategory-stem-" +
            subcategoryId + "'>" + snippets[0] + "</div>"
        html += "<div class='statement-container'>"

        for (id in statements) {
            html += "<div class='statement'>"
            html += "<div class='statement-snippet-front hidden'></div>"
            html += "<div class='statement-option' id='statement-option-" + id +
                "' onclick='clickStatement(this)'>" + statements[id] + "</div>"
            html += "<div class='statement-text-input hidden'></div>"
            html += "<div class='statement-snippet-back hidden'></div>"
            html += "</div>"
        }

        html += "</div><div>"
        html += "<div class='add-statement-div' style='display:none;'>"
        html += "<input class='statement-input' type='text' placeholder='Enter a new statement...'>"
        html += "<div class='add-statement-button-div'>"
        html += "<button class='cancel-statement-button' type='button' onclick='clickCancelStatement(this)'>Cancel</button>"
        html += "<button class='confirm-statement-button' type='button' onclick='clickConfirmStatement(this, " +
            subcategoryId + ", " + type + ")'>Confirm</button>"
        html += "</div></div>"
        html += "<button class='add-statement-button' type='button' onclick='clickAddStatement(this)'><strong class='bold'>+</strong> Add Statement</button></div>"
        html += "</div>"
        
        return html
    }

    function loadTypeBoth() {
        
        options = snippets[0].split("$$$");

        html = "<div class='subcategory-stem hidden'></div>"
        html += "<div class='statement-container'>"

        for (id in statements) {

            snippetParts = statements[id].split("$$$")

            html += "<div class='statement'>"
            html += "<div class='statement-snippet-front' " +
                "id='statement-snippet-front-" + id + "'>" + snippetParts[0] +
                "</div>"

            for (optionId in options) {
                html += "<div class='statement-option option-three' " +
                    "id='statement-option-" + optionId +
                    "' onclick='clickStatement(this)'>" + options[optionId] +
                    "</div>"
            }

            html += "<div class='statement-text-input hidden'></div>"
            html += "<div class='statement-snippet-back' " +
                "id='statement-snippet-back-" + id + "'>" + snippetParts[1] +
                "</div>"
            html += "</div>"
        }
        html += "</div></div>"

        return html
    }

    function loadTypeText() {
        html = "<div class='subcategory-stem hidden'></div>"
        html += "<div class='statement-container'>"

        for (id in statements) {
            html += "<div class='statement'>"
            html += "<div class='statement-snippet-front' " +
                "id='statement-snippet-front-" + id + "'>" + statements[id] +
                "</div>"
            html += "<div class='statement-option hidden'></div>"
            html += "<div class='statement-text-input' " + 
                "id='statement-text-input-" + id +
                "'><textarea class='text-area' rows='5' oninput='textAreaListener(this)'></textarea></div>"
            html += "<div class='statement-snippet-back hidden'></div>"
            html += "</div>"
        }
        html += "</div></div>"
        
        return html
    }

    function loadTypePSO() {
        options = snippets[0].split("$$$");

        html = "<div class='subcategory-stem hidden'></div>"
        html += "<div class='statement-container'>"

        for (id in statements) {
            snippetParts = statements[id].split("$$$")

            html += "<div class='statement'>"
            html += "<div class='statement-snippet-front hidden'></div>"

            html += "<div class='statement-option option-pso' " +
                "id='statement-option-0' onclick='clickStatement(this)'>" +
                "P" + "</div>"
            html += "<div class='statement-option option-pso' " +
                "id='statement-option-1' onclick='clickStatement(this)'>" +
                "S" + "</div>"
            html += "<div class='statement-option option-pso' " +
                "id='statement-option-2' onclick='clickStatement(this)'>" +
                "O" + "</div>"

            html += "<div class='statement-text-input hidden'></div>"

            html += "<div class='statement-snippet-back snippet-pso' " +
                "id='statement-snippet-back-" + id + "'>" +
                snippetParts[0] + "</div>"

            html += "</div>"
        }

        html += "</div><div>"
        html += "<div class='add-statement-div' style='display:none;'>"
        html += "<input class='statement-input' type='text' placeholder='Enter a new statement...'>"
        html += "<div class='add-statement-button-div'>"
        html += "<button class='cancel-statement-button' type='button' onclick='clickCancelStatement(this)'>Cancel</button>"
        html += "<button class='confirm-statement-button' type='button' onclick='clickConfirmStatement(this, " +
            subcategoryId + ", " + type + ")'>Confirm</button>"
        html += "</div></div>"
        html += "<button class='add-statement-button' type='button' onclick='clickAddStatement(this)'><strong class='bold'>+</strong> Add Statement</button></div>"
        html += "</div>"

        return html
    }
}

function clickAddStatement(button) {
    addStatemetDiv = button.parentElement.getElementsByClassName("add-statement-div")[0]
    button.style.display = "none";
    addStatemetDiv.style.display = "block";

    // searchEl = document.getElementById("searchBar");
    // searchEl.value = "";
    // filterStatements(globalCategoryId);

}
function clickCancelStatement(button) {
    addStatementDiv = button.parentElement.parentElement
    addButton = addStatementDiv.parentElement.getElementsByClassName("add-statement-button")[0]
    statementInput = addStatementDiv.getElementsByClassName("statement-input")[0]

    statementInput.value = ""
    addStatementDiv.style.display = "none";
    addButton.style.display = "block";
}
function clickConfirmStatement(button, subcategoryId, type) {
    addStatementDiv = button.parentElement.parentElement
    addButton = addStatementDiv.parentElement.getElementsByClassName("add-statement-button")[0]
    statementInput = addStatementDiv.getElementsByClassName("statement-input")[0]

    newStatementText = statementInput.value;

    addStatementToClient(newStatementText, subcategoryId,
        addStatementDiv.parentElement.parentElement, type);

    statementInput.value = ""
    addStatementDiv.style.display = "none";
    addButton.style.display = "block";
}
function addStatementToClient(text, subcategory, subcategoryDiv, type) {
    now = new Date();
    minutes = now.getMinutes();
    seconds = now.getSeconds();

    id = "" + 1 + minutes +  seconds;

    statementContainer = subcategoryDiv
        .getElementsByClassName("statement-container")[0]

    console.log(type)

    switch (type) {
        case 1:
            html = addTypeNone();
            break;
        case 2:
            html = addTypeFront();
            break;
        case 3:
            html = addTypeBoth();
            break;
        // case 4:
        //     html = addTypeText();
        //     break;
        case 5:
            html = addTypePSO();
            break;
        default:
            console.log("No Category Type")
    }

    statementContainer.innerHTML += html

    searchEl = document.getElementById("searchBar");
    searchEl.value = "";
    filterStatements(globalCategoryId);

    sendAddStatementRequest(text, subcategory);



    function addTypeNone() {
        html = "<div class='statement'>"
        html += "<div class='statement-snippet-front hidden'></div>"
        html += "<div class='statement-option' id='statement-option-" + id +
            "' onclick='clickStatement(this)'>" + text + "</div>"
        html += "<div class='statement-text-input hidden'></div>"
        html += "<div class='statement-snippet-back hidden'></div>"
        html += "</div>"

        return html

    }
    function addTypeFront() {

        console.log("Type Front")

        html = "<div class='statement'>"
        html += "<div class='statement-snippet-front hidden'></div>"
        html += "<div class='statement-option' id='statement-option-" + id +
            "' onclick='clickStatement(this)'>" + text + "</div>"
        html += "<div class='statement-text-input hidden'></div>"
        html += "<div class='statement-snippet-back hidden'></div>"
        html += "</div>"

        return html

    }
    function addTypeBoth() {

    }
    // function addTypeText() {
    // }
    function addTypePSO() {

        html = "<div class='statement'>"
        html += "<div class='statement-snippet-front hidden'></div>"

        html += "<div class='statement-option option-pso' " +
            "id='statement-option-0' onclick='clickStatement(this)'>" +
            "P" + "</div>"
        html += "<div class='statement-option option-pso' " +
            "id='statement-option-1' onclick='clickStatement(this)'>" +
            "S" + "</div>"
        html += "<div class='statement-option option-pso' " +
            "id='statement-option-2' onclick='clickStatement(this)'>" +
            "O" + "</div>"

        html += "<div class='statement-text-input hidden'></div>"

        html += "<div class='statement-snippet-back snippet-pso' " +
            "id='statement-snippet-back-" + id + "'>" +
            text + "</div>"

        html += "</div>"

        return html
    }
    
}

function sendAddStatementRequest(text, subcategory) {
    fetch("/", {
        method: "POST",
        body: JSON.stringify({
            request: "add_statement",
            statementText: text,
            statementSubcategory: subcategory
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    }
    );
}

function textAreaListener(element) {
    // Type 4
    div = element.parentElement
    textId = div.id
    text = element.value

    statementElement = div.parentElement
    subcategoryId = statementElement.parentElement.parentElement.id
    textBox = statementElement
        .querySelectorAll('.statement-text-input:not(.hidden)')[0]

    noteElement = document.getElementById("note-body")

    subcategorySpan = document.getElementById("note-" + subcategoryId);

    if (element.value.length > 0) {
        if (subcategorySpan == null) {
            noteElement.innerHTML += "<span id='note-" + subcategoryId + 
                "'>" + "<span id='note-" + textId +"'>" + text + "</span></span>"
        }
        else {
            textSpan = document.getElementById('note-' + textId)
            textSpan.innerHTML = text + " "
        }
    } else {
        if (subcategorySpan) {
            subcategorySpan.remove()
        }
    }
}

function filterStatements(categoryId) {

    subcategoryElements = document.querySelectorAll(".subcategory");

    subcategoryIds = Object.keys(data[categoryId].subcategories);

    categorySearchableElements = [];
    categorySubcategories = [];

    subcategoryElements.forEach(function(element) {

        elementSubcategoryId = element.id.slice(12)

        if(subcategoryIds.includes(elementSubcategoryId)) {
            categorySubcategories.push(element)
            categorySearchableElements.push.apply(categorySearchableElements,
                element.querySelectorAll(".statement-option"));
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    })

    for (id in categorySearchableElements) {

        categorySearchableElements[id].style.display = "block";
        categorySearchableElements[id].parentElement.style.display = "block";
    }


    document.getElementById("statements_div").scrollTop = 0;

    // Searches on every key press
    searchEl = document.querySelector(".searchbox");

    searchEl.addEventListener("keyup", (event) => search(event,
        categorySearchableElements, categorySubcategories));
}

// On Statement Click Functionality
function clickStatement(div) {

    statementClickColor(div);
    addStatement(div);

    function statementClickColor(div) {
        if (div.style.backgroundColor == "rgb(230, 233, 235)") { //#e6e9eb
            div.style.background = "rgb(248, 248, 248)"; //#f8f8f8
        }
        else {
            div.style.background = "rgb(230, 233, 235)"; //#e6e9eb
        }
    }

    // Add Statement, Snippets and more to Note Body
    function addStatement(div) {

        // div = statement option
        textId = div.id
        text = div.textContent

        statementElement = div.parentElement
        subcategoryId = statementElement.parentElement.parentElement.id
        subcategoryStem = statementElement.parentElement.parentElement
            .querySelectorAll('.subcategory-stem:not(.hidden)')[0]

        snippetFront = statementElement
            .querySelectorAll('.statement-snippet-front:not(.hidden)')[0]
        snippetBack = statementElement
            .querySelectorAll('.statement-snippet-back:not(.hidden)')[0]
        textBox = statementElement
            .querySelectorAll('.statement-text-input:not(.hidden)')[0]

        noteElement = document.getElementById("note-body")

        if (subcategoryStem) {
            // Type 2

            addSubcategorySpan();
            addStem();
            addOption();
            alterPunctuation();
            addSubcategorySpan();

            function addSubcategorySpan() {

                subcategorySpan = document.getElementById("note-" + subcategoryId);

                if (subcategorySpan == null) {
                    noteElement.innerHTML += "<span id='note-" + subcategoryId + 
                        "'></span>"
                } else {
                    if (subcategorySpan.children.length < 2) {
                        subcategorySpan.remove()
                    }
                }
            }

            function addStem() {
                hasStem = document.getElementById('note-' + subcategoryStem.id)

                if (!hasStem) {
                        
                    html = "<span id='note-" + subcategoryStem.id + "'>" +
                        subcategoryStem.innerHTML + "</span>"

                    document.getElementById("note-" + subcategoryId).innerHTML = html
                }
            }

            function addOption() {
                textSpan = document.getElementById("note-" + textId);
    
                if (textSpan == null) {
                    html = "<span id='note-" + textId +"'>" + text + "</span>"
                    document.getElementById("note-" + subcategoryId).innerHTML += html
                } else {
                    textSpan.remove();
                }
            }

            function alterPunctuation() {
                subcategorySpan = document.getElementById("note-" +
                    subcategoryId);

                textSpans = subcategorySpan.children

            for (i=0; i<textSpans.length; i++) {

                    removePunctuation(textSpans[i]);

                    if (textSpans.length <= 2) {
                        if (i == 0) {
                            textSpans[i].innerHTML = textSpans[i].innerHTML + " "
                        } else {
                            textSpans[i].innerHTML = textSpans[i].innerHTML + ". "
                        }
                    } else {
                        if (i == 0) {
                            textSpans[i].innerHTML = textSpans[i].innerHTML + ": "
                        } else if (i == textSpans.length - 1) {
                            textSpans[i].innerHTML = textSpans[i].innerHTML + ". "
                        } else if (i == textSpans.length - 2) {
                            textSpans[i].innerHTML = textSpans[i].innerHTML + "; and "
                        } else {
                            textSpans[i].innerHTML = textSpans[i].innerHTML + "; "
                        }
                    }
                }

                function removePunctuation(element) {

                    text = element.textContent;

                    if (text.endsWith(": ")) {
                        text = text.replace(": ", "")
                    }
                    if (text.endsWith(". ")) {
                        text = text.substr(0, text.length -2);
                    }
                    if (text.endsWith("; and ")) {
                        text = text.substr(0, text.length - 6);
                    }
                    if (text.endsWith("; ")) {
                        text = text.substr(0, text.length - 2);
                    }
                    if (text.endsWith(" ")) {
                        text = text.substr(0, text.length - 1);
                    }

                    element.textContent = text;
                }
            }
        } else if (textBox) {
            // Type 4

            addSubcategorySpan();
            addOption();
            // alterPunctuation();
            addSubcategorySpan();

            function addSubcategorySpan() {
                subcategorySpan = document.getElementById("note-" +
                    subcategoryId);
    
                if (subcategorySpan == null) {
                    noteElement.innerHTML += "<span id='note-" + subcategoryId + 
                        "'></span>"
                } else {
                    if (subcategorySpan.children.length < 1) {
                        subcategorySpan.remove();
                    }
                }
            }
    
            function addOption() {
                textSpan = document.getElementById("note-" + textId);
    
                if (textSpan == null) {
                    html = "<span id='note-" + textId +"'>" + text + "</span>"
                    document.getElementById("note-" + subcategoryId).innerHTML += html
                } else {
                    textSpan.remove();
                }
            }

            function alterPunctuation() {
                subcategorySpan = document.getElementById("note-" +
                    subcategoryId);

                textSpans = subcategorySpan.children

                for (id in textSpans) {

                    text = textSpans[id].innerHTML

                    if (text && !text.endsWith(". ")) {
                        textSpans[id].innerHTML = text + ". "
                    }
                }
            }
            
        } else if (snippetFront) {
            // Type 3

            addSubcategorySpan();
            addOption();
            addSubcategorySpan();

            function addSubcategorySpan() {

                subcategorySpan = document.getElementById("note-" + subcategoryId);

                if (subcategorySpan == null) {
                    noteElement.innerHTML += "<span id='note-" + subcategoryId + 
                        "'></span>"
                } else {
                    if (subcategorySpan.children.length < 1) {
                        subcategorySpan.remove()
                    }
                }
            }

            function addOption() {

                statementId = statementElement
                    .getElementsByClassName("statement-snippet-front")[0].id.slice(24)

                snippetFront = statementElement
                    .getElementsByClassName("statement-snippet-front")[0].textContent

                snippetBack = statementElement
                    .getElementsByClassName("statement-snippet-back")[0].textContent

                optionText = div.textContent
                textSpan = document.getElementById("note-statement-option-" + statementId);
                text = snippetFront + " " + optionText + " " + snippetBack + " "

                if (textSpan) {
                    if (text == textSpan.textContent) {
                        textSpan.remove()
                    } else {
                        textSpan.innerHTML = text
                    }
                } else {
                    html = "<span id='note-statement-option-" + statementId + 
                        "'>" + text + "</span>"
                    document.getElementById("note-" +
                        subcategoryId).innerHTML += html
                }

                optionElements = statementElement.getElementsByClassName("statement-option")

                for (i=0; i<optionElements.length; i++) {
                    if (optionElements[i].id != div.id) {
                        optionElements[i].style.background = "rgb(248, 248, 248)"
                    }
                }
            }
        } else if (snippetBack) {
            // Type 5

            addSubcategorySpan();
            addOption();
            alterPunctuation();
            addSubcategorySpan();

            function addSubcategorySpan() {
                subcategorySpan = document.getElementById("note-" +
                    subcategoryId);

                if (subcategorySpan == null) {
                    noteElement.innerHTML += "<span id='note-" + subcategoryId + 
                        "'></span>"
                    subcategorySpan = document.getElementById("note-" +
                        subcategoryId);

                    addTypeSpan();

                } else {
                    addTypeSpan();

                    if (subcategorySpan.children.length < 1) {
                        subcategorySpan.remove()
                    }
                }
            }

            function addTypeSpan() {
                typeId = div.id.slice(17)

                typeSpan = document.getElementById("note-" + subcategoryId +
                    "-" + typeId)

                if (typeSpan == null) {
                    // html = "<span id='note-" + subcategoryId + "-" + typeId +
                    //     "' style='color:red;'><span>"

                    switch (parseInt(typeId)) {
                        case 0:
                            html = "<span id='note-" + subcategoryId + "-" + typeId +
                                "'><span>"
                            html += "The primary goals of the couple therapy include"
                            break;
                        case 1:
                            html = "<span id='note-" + subcategoryId + "-" + typeId +
                                "'><span>"
                            html += "The secondary goals of the couple therapy include"
                            break;
                        case 2:
                            html = "<span id='note-" + subcategoryId + "-" + typeId +
                                "'><span>"
                            html += "The specific objectives of the couple therapy include"
                            break;
                    }

                    html += "</span></span>"
                    subcategorySpan.innerHTML += html
                    
                } else {
                    if (typeSpan.children.length < 2) {
                        typeSpan.remove()
                    }
                }
            }

            function addOption() {
                typeId = div.id.slice(17)

                statementId = statementElement
                    .getElementsByClassName("statement-snippet-back")[0].id.slice(24)

                snippetBack = statementElement
                    .getElementsByClassName("statement-snippet-back")[0].textContent

                optionText = div.textContent
                textSpan = document.getElementById("note-statement-option-" + statementId);

                if (textSpan) {
                    currentTypeLocation = textSpan.parentElement.id.slice(-1)
                    parentTypeSpan = textSpan.parentElement
                    if (currentTypeLocation == typeId) {
                        if (textSpan.textContent.includes(snippetBack)) {
                            textSpan.remove()
                        } else {
                            textSpan.innerHTML = snippetBack
                        }
                    } else {
                        if (parentTypeSpan.children.length < 3) {
                            parentTypeSpan.remove();
                            addOption();
                        } else {
                            textSpan.remove();
                            addOption();
                        }
                    }
                } else {
                    html = "<span id='note-statement-option-" + statementId + 
                        "'>" + snippetBack + "</span>"
                    document.getElementById("note-" + subcategoryId + "-" +
                        typeId).innerHTML += html
                }

                optionElements = statementElement.getElementsByClassName("statement-option")

                // May have to fix, remove from other notes

                for (i=0; i<optionElements.length; i++) {
                    if (optionElements[i].id != div.id) {
                        optionElements[i].style.background = "rgb(248, 248, 248)"
                    }
                }
            }

            function alterPunctuation() {
                typeId = div.id.slice(17)

                subcategorySpan = document.getElementById("note-" +
                    subcategoryId);

                typeSpans = subcategorySpan.children

                for (i=0;i<typeSpans.length;i++) {

                    optionSpans = typeSpans[i].children

                    for (j=0;j<optionSpans.length;j++) {
                        if (optionSpans.length <= 2) {
                            removePunctuation(optionSpans[j]);

                            if (j == 0) {
                                optionSpans[j].innerHTML = optionSpans[j].innerHTML + " "
                            } else {
                                optionSpans[j].innerHTML = optionSpans[j].innerHTML + ". "
                            }
                        } else {
                            removePunctuation(optionSpans[j]);

                            if (j == 0) {
                                optionSpans[j].innerHTML = optionSpans[j].innerHTML + ": "
                            } else if (j == optionSpans.length - 1) {
                                optionSpans[j].innerHTML = optionSpans[j].innerHTML + ". "
                            } else if (j == optionSpans.length - 2) {
                                optionSpans[j].innerHTML = optionSpans[j].innerHTML + "; and "
                            } else {
                                optionSpans[j].innerHTML = optionSpans[j].innerHTML + "; "
                            }
                        }
                    }

                }

                function removePunctuation(element) {

                    text = element.textContent;

                    if (text.endsWith(": ")) {
                        text = text.replace(": ", "")
                    }
                    if (text.endsWith(". ")) {
                        text = text.substr(0, text.length -2);
                    }
                    if (text.endsWith("; and ")) {
                        text = text.substr(0, text.length - 6);
                    }
                    if (text.endsWith("; ")) {
                        text = text.substr(0, text.length - 2);
                    }
                    if (text.endsWith(" ")) {
                        text = text.substr(0, text.length - 1);
                    }

                    element.textContent = text;
                }
            }
        } else {
            // Type 1

            addSubcategorySpan();
            addOption();
            alterPunctuation();
            addSubcategorySpan();

            function addSubcategorySpan() {
                subcategorySpan = document.getElementById("note-" +
                    subcategoryId);
    
                if (subcategorySpan == null) {
                    noteElement.innerHTML += "<span id='note-" + subcategoryId + 
                        "'></span>"
                } else {
                    if (subcategorySpan.children.length < 1) {
                        subcategorySpan.remove();
                    }
                }
            }
    
            function addOption() {
                textSpan = document.getElementById("note-" + textId);
    
                if (textSpan == null) {
                    html = "<span id='note-" + textId +"'>" + text + "</span>"
                    document.getElementById("note-" + subcategoryId).innerHTML += html
                } else {
                    textSpan.remove();
                }
            }

            function alterPunctuation() {
                subcategorySpan = document.getElementById("note-" +
                    subcategoryId);

                textSpans = subcategorySpan.children

                for (id in textSpans) {

                    text = textSpans[id].innerHTML

                    if (text && !text.endsWith(". ")) {
                        textSpans[id].innerHTML = text + ". "
                    }
                }
            }
        }
    }
}

function search(e, x, subDivs) {

    x.forEach( (item, index) => {

        matchingText = item.innerHTML.toLowerCase().includes(e.target.value.toLowerCase())

        if (matchingText) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });

    filterElements(subDivs)

    function filterElements(subcategoryElements) {

        subcategoryElements.forEach( (subcategoryElement, index) => {

            statementParts = subcategoryElement
                .getElementsByClassName("statement-option")

            decrementor = statementParts.length

            for (i=0; i < statementParts.length; i++) {

                displayed = statementParts[i].style.display

                if (displayed == "none") {
                    decrementor--;
                }
            }

            if (decrementor <= 0) {
                subcategoryElement.style.display = "none";
            } else {
                subcategoryElement.style.display = "block";
            }

            statements = subcategoryElement.getElementsByClassName("statement");

            for (i=0; i < statements.length; i++) {

                children = statements[i]
                    .querySelectorAll(".statement-option:not(.hidden), " +
                        ".statement-text-input:not(.hidden)")

                statementDecrementor = children.length
                
                for (j=0; j<children.length; j++) {

                    displayed = children[j].style.display

                    if (displayed == "none") {
                        statementDecrementor--;
                    }
                }

                if (statementDecrementor <= 0) {
                    statements[i].style.display = "none";
                } else {
                    statements[i].style.display = "block";
                }
            }
        })
    }
}

function copyClipboard() {

    noteElement = document.getElementById("note-content-body")

    lines = noteElement.textContent.split("\n");

    outputLines = []

    for (i=0; i<lines.length; i++) {

        line = lines[i].trim();

        if (!line.endsWith(":") && !line.endsWith("?") && line.length > 0) {
                outputLines.push(line)
        }
    }

    copyText = outputLines.join("\n");
    navigator.clipboard.writeText(copyText);
    noteElement.style.color = "white";

    setTimeout(function() {
        noteElement.style.color = "black";
    }, 200)
}